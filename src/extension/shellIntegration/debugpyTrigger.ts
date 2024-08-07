// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as fs from 'fs-extra';
import * as path from 'path';
import { DebugConfiguration, TerminalShellExecutionStartEvent, Uri } from 'vscode';
import { startDebugging } from '../common/vscodeapi';
import { DebuggerTypeName } from '../constants';

function checkCommand(command: string): boolean {
    const lower = command.toLowerCase();
    return lower.startsWith('debugpy');
}

async function getFile(e: TerminalShellExecutionStartEvent, filePath: string): Promise<Uri> {
    if (await fs.pathExists(filePath)) {
        return Uri.file(filePath);
    }
    return Uri.parse(path.join(e.execution.cwd?.path || '', filePath));
}

function getDefaultDebugConfiguration(): DebugConfiguration {
    return {
        name: `Debug File`,
        type: DebuggerTypeName,
        request: 'attach',
        connect: {
            port: 5678,
        },
    };
}

export async function registerTriggerForDebugpyInTerminal(e: TerminalShellExecutionStartEvent) {
    if (e.execution.commandLine.isTrusted && checkCommand(e.execution.commandLine.value)) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
        const config = getDefaultDebugConfiguration();
        startDebugging(undefined, config);
    }
}
