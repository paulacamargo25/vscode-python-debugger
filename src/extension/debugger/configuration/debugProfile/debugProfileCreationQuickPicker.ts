// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { QuickPickItem } from 'vscode';
import { MultiStepInput } from '../../../common/multiStepInput';
import {
    configSubType,
    configType,
    DebugConfigurationState,
    DebugProfileArguments,
    DebugProfileState,
} from '../../types';
import { updateSetting } from '../../../common/settings';
import { workspace } from 'vscode';
import { DebugProfileCreation } from '../../../common/utils/localize';

export async function showDebugSettingsProfileCreationPicker(input: MultiStepInput<DebugProfileState>): Promise<void> {
    const profileState = {
        config: {
            name: '',
            type: '' as configType,
            subtype: [],
        } as Partial<DebugProfileArguments>,
    } as DebugProfileState;

    const options = {
        title: DebugProfileCreation.title,
        value: '',
        prompt: DebugProfileCreation.prompt,
        validate: (value: string) =>
            Promise.resolve(value && value.trim().length > 0 ? undefined : 'Enter a valid name'),
        placeholder: 'Enter the name of the configuration',
    };
    const selection = await input.showInputBox(options);
    if (selection === undefined) {
        return;
    }
    profileState.config.name = selection;

    await input.run((input, _s) => selectConfigType(input, profileState), profileState);
    let debugProfileConfigs = workspace.getConfiguration('python').get<[]>('configs', []);
    await updateSetting('python', 'configs', [...debugProfileConfigs, profileState.config]);
}

async function selectConfigType(
    input: MultiStepInput<DebugProfileState> | MultiStepInput<DebugConfigurationState>,
    state: DebugProfileState,
) {
    const items: QuickPickItem[] = [
        { label: configSubType.terminalRun, description: DebugProfileCreation.runDescription },
        { label: configSubType.terminalDebug, description: DebugProfileCreation.debugDescription },
    ];
    const selection = await input.showQuickPick({
        items: items,
        placeholder: DebugProfileCreation.selectConfigType.placeholder,
        canSelectMany: true,
    });
    if (selection === undefined || !Array.isArray(selection)) {
        return;
    }

    state.config.type = configType.terminal;
    state.config.subtype = selection.map((i) => i.label);
}
