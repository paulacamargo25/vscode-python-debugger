// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { DebugConfigStrings } from '../../../common/utils/localize';
import { IQuickPickParameters, MultiStepInput } from '../../../common/multiStepInput';
import { sendTelemetryEvent } from '../../../telemetry';
import { EventName } from '../../../telemetry/constants';
import { DebuggerTypeName } from '../../../constants';
import { LaunchRequestArguments } from '../../../types';
import { DebugConfigurationState, DebugConfigurationType } from '../../types';
import { QuickPickItem, QuickPickItemKind } from 'vscode';
import { browseFileOption } from './providerQuickPick/providerQuickPick';
import { QuickPickType } from './providerQuickPick/types';
import { getConfiguration } from '../../../common/vscodeapi';

export async function buildDebugProfileLaunchDebugConfiguration(
    input: MultiStepInput<DebugConfigurationState>,
    state: DebugConfigurationState,
): Promise<void> {
    const config: Partial<LaunchRequestArguments> = {
        name: DebugConfigStrings.file.snippet.name,
        type: DebuggerTypeName,
        request: 'launch',
        console: 'integratedTerminal'
    };

    let debugProfileOptions = getConfiguration("python.framework")
    debugProfileOptions.filter((item: any) => "debug" in item.testRunProfileKind).map((item: any) => {
        return {
            label: item.name,
            config: config
        }
    })
    

    let options: QuickPickItem[] = [
        ...debugProfileOptions,
        { label: '', kind: QuickPickItemKind.Separator },
        browseFileOption,
    ];

    const selection = await input.showQuickPick<QuickPickType, IQuickPickParameters<QuickPickType>>({
        placeholder: DebugConfigStrings.django.djangoConfigPromp.prompt,
        items: options,
        acceptFilterBoxTextAsSelection: true,
        matchOnDescription: true,
        title: DebugConfigStrings.django.djangoConfigPromp.title,
        onDidTriggerItemButton: async (e: QuickPickItemButtonEvent<QuickPickType>) => {
            if (e.item && 'filePath' in e.item) {
                await window.showTextDocument(e.item.filePath, { preview: true });
            }
        },
    });


    sendTelemetryEvent(EventName.DEBUGGER_CONFIGURATION_PROMPTS, undefined, {
        configurationType: DebugConfigurationType.launchFastAPI,
    });
    Object.assign(state.config, config);
}
