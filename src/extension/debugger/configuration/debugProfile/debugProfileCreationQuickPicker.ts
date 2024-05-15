// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { QuickPickItem } from 'vscode';
import { MultiStepInput } from '../../../common/multiStepInput';
import { DebugConfigurationState } from '../../types';
import { updateSetting } from '../../../common/settings';
import { getConfiguration } from '../../../common/vscodeapi';

export class DebugProfileCreationPicker {
    constructor() {}

    public showQuickPick(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const multiStep = new MultiStepInput<DebugConfigurationState>();
            const state = {
                config: {
                    name: '',
                    type: 'terminal',
                    subtype: '',
                } as any,
            };

            await multiStep.run((input, s) => this.selectConfigName(input, s), state);
            await multiStep.run((input, s) => this.selectConfigType(input, s), state);
            
            let debugProfileConfigs = getConfiguration('debugpy').get<[]>('configs', [])


            updateSetting('debugpy', 'configs', [...debugProfileConfigs, state.config]);z
        });
    }

    async selectConfigName(input: MultiStepInput<DebugConfigurationState>, state: DebugConfigurationState) {
        const options = {
            title: 'Create Debug Profile Configuration',
            value: '',
            prompt: 'Prompt',
            validate: (value: string) =>
                Promise.resolve(value && value.trim().length > 0 ? undefined : 'Enter a valid name'),
            placeholder: 'Enter the name of the configuration',
        };
        const selection = await input.showInputBox(options);
        if (selection === undefined) {
            return;
        }
        state.config.name = selection;
    }

    async selectConfigType(input: MultiStepInput<DebugConfigurationState>, state: DebugConfigurationState) {
        const items: QuickPickItem[] = [
            { label: 'run', description: 'Run configuration' },
            { label: 'debug', description: 'Debug configuration' },
        ];
        const selection = await input.showQuickPick({
            items: items,
            title: 'Create Debug Profile Configuration',
            placeholder: 'Select the type of configuration',
            canSelectMany: true,
        });
        if (selection === undefined || !Array.isArray(selection)) {
            return;
        }
        state.config.subtype = selection.map((i) => i.label);
    }
}
