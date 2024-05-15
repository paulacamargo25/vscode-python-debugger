// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { DebugConfigStrings } from '../../../common/utils/localize';
import { IQuickPickParameters, MultiStepInput } from '../../../common/multiStepInput';
import { DebuggerTypeName } from '../../../constants';
import { LaunchRequestArguments } from '../../../types';
import { DebugConfigurationState, DebugConfigurationType } from '../../types';
import { QuickPickItem, QuickPickItemKind } from 'vscode';
import { QuickPickType } from './providerQuickPick/types';
import { executeCommand, getConfiguration } from '../../../common/vscodeapi';
import { Commands } from '../../../common/constants';
import { sendTelemetryEvent } from '../../../telemetry';
import { EventName } from '../../../telemetry/constants';

export async function buildDebugProfileLaunchDebugConfiguration(
    input: MultiStepInput<DebugConfigurationState>,
    state: DebugConfigurationState,
): Promise<void> {
    const config: Partial<LaunchRequestArguments> = {
        name: '',
        type: DebuggerTypeName,
        request: 'launch',
        program: '${file}',
        console: 'integratedTerminal',
    };

    let debugProfileOptions = getConfiguration('debugpy')
        .get<[]>('configs', [])
        .filter((item: any) => item.type == 'terminal' && item.subtype.includes('debug'))
        .map((item: any) => {
            return {
                label: item.name,
                config: item,
            };
        });

    let options: QuickPickItem[] = [
        ...debugProfileOptions,
        { label: '', kind: QuickPickItemKind.Separator },
        { label: 'Create new configuration', description: 'Create a new debug configuration' },
    ];

    const selection = await input.showQuickPick<QuickPickType, IQuickPickParameters<QuickPickType>>({
        placeholder: DebugConfigStrings.django.djangoConfigPromp.prompt,
        items: options,
        acceptFilterBoxTextAsSelection: true,
        matchOnDescription: true,
        title: DebugConfigStrings.django.djangoConfigPromp.title,
    });

    if (selection === undefined) {
        return;
    } else if (selection.label === 'Create new configuration') {
        await executeCommand(Commands.DebugProfileCreation);
        return;
    }

    config.name = selection.label;

    sendTelemetryEvent(EventName.DEBUGGER_CONFIGURATION_PROMPTS, undefined, {
        configurationType: DebugConfigurationType.debugProfile,
    });
    Object.assign(state.config, config);
}
