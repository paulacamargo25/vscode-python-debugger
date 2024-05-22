// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as fs from 'fs-extra';
import * as path from 'path';
import { TerminalShellExecutionStartEvent, Uri } from 'vscode';
import { getInterpreterDetails, runPythonExtensionCommand } from '../common/python';
import { Commands } from '../common/constants';
import { noop } from 'lodash';
import { getDebugConfiguration } from '../debugger/debugCommands';
import { getWorkspaceFolder, getWorkspaceFolders, startDebugging } from '../common/vscodeapi';

function checkCommand(command: string): boolean {
    const lower = command.toLowerCase();
    return lower.startsWith('debugpy');
}

async function getFile(e: TerminalShellExecutionStartEvent, filePath: string): Promise<Uri> {
    if (await fs.pathExists(filePath)) {
        return Uri.file(filePath);
    }
    return Uri.parse(path.join(e.execution.cwd?.path || "", filePath));
}

export async function registerTriggerForDebugpyInTerminal(e: TerminalShellExecutionStartEvent) {

    if (e.execution.commandLine.isTrusted && checkCommand(e.execution.commandLine.value)) {
        const commandLine = e.execution.commandLine.value;
        const path = commandLine.split(' ').slice(1).join(' ');
        const file = await getFile(e, path);
        const interpreter = await getInterpreterDetails(file);
        if (!interpreter.path) {
            runPythonExtensionCommand(Commands.TriggerEnvironmentSelection, file).then(noop, noop);
            return;
        }
        const config = await getDebugConfiguration(file);
        config['consoleName'] = e.terminal.name;
        startDebugging(undefined, config);        
    }
}
