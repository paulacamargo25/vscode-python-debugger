// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { QuickPickItem } from 'vscode';
import { MultiStepInput } from '../../../common/multiStepInput';
import { DebugConfigurationState, DebugProfileArguments, DebugProfileState, DebugProfileType } from '../../types';
import { updateSetting } from '../../../common/settings';
import { workspace } from 'vscode';
import { DebugProfileCreation } from '../../../common/utils/localize';

export async function showDebugSettingsProfileCreationPicker(
    input: MultiStepInput<DebugProfileState> | MultiStepInput<DebugConfigurationState>,
): Promise<void> {
    const profileState = {
        config: {
            name: '',
            debugProfile: [],
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
        { label: DebugProfileType.debug, description: DebugProfileCreation.debugDescription },
        { label: DebugProfileType.debugTesting, description: DebugProfileCreation.debugTestingDescription },
    ];
    const selection = await input.showQuickPick({
        items: items,
        // title: 'Create Debug Profile Configuration',
        placeholder: DebugProfileCreation.selectConfigType.placeholder,
        canSelectMany: true,
    });
    if (selection === undefined || !Array.isArray(selection)) {
        return;
    }
    state.config.debugProfile = selection.map((i) => i.label);
}
