// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { DebugConfigStrings } from '../../../common/utils/localize';
import { IQuickPickParameters, MultiStepInput } from '../../../common/multiStepInput';
import { DebuggerTypeName } from '../../../constants';
import { DebugConfigurationArguments } from '../../../types';
import {
    DebugConfigurationState,
    DebugConfigurationType,
    DebugProfileArguments,
    DebugProfileConfigQuickPickItem,
    DebugProfilePickType,
    DebugProfileType,
} from '../../types';
import { QuickPickItemKind } from 'vscode';
import { getConfiguration } from '../../../common/vscodeapi';
import { sendTelemetryEvent } from '../../../telemetry';
import { EventName } from '../../../telemetry/constants';
import { showDebugSettingsProfileCreationPicker } from '../debugProfile/debugProfileCreationQuickPicker';

export async function buildDebugProfileLaunchDebugConfiguration(
    input: MultiStepInput<DebugConfigurationState>,
    state: DebugConfigurationState,
): Promise<void> {
    const profileConfigs = getConfiguration('python').get<[]>('configs', []);
    const debugProfileOptions: DebugProfileConfigQuickPickItem[] = profileConfigs
        .filter((item: DebugProfileArguments) => item.debugProfile?.includes(DebugProfileType.debug))
        .map((item: DebugProfileArguments) => {
            return {
                label: item.name,
                item: item,
                description: `(${DebugProfileType.debug})`,
            };
        });

    const testingDebugProfileOptions: DebugProfileConfigQuickPickItem[] = profileConfigs
        .filter((item: DebugProfileArguments) => item.debugProfile?.includes(DebugProfileType.debugTesting))
        .map((item: DebugProfileArguments) => {
            return {
                label: item.name,
                item: item,
                description: `(${DebugProfileType.debugTesting})`,
            };
        });

    let options: DebugProfilePickType[] = [
        { label: DebugProfileType.debug, kind: QuickPickItemKind.Separator },
        ...debugProfileOptions,
        { label: DebugProfileType.debugTesting, kind: QuickPickItemKind.Separator },
        ...testingDebugProfileOptions,
        { label: '', kind: QuickPickItemKind.Separator },
        {
            label: DebugConfigStrings.debugProfile.createNew.label,
            description: DebugConfigStrings.debugProfile.createNew.description,
        },
    ];

    const selection = await input.showQuickPick<DebugProfilePickType, IQuickPickParameters<DebugProfilePickType>>({
        placeholder: DebugConfigStrings.debugProfile.configPromp.prompt,
        items: options,
        acceptFilterBoxTextAsSelection: true,
        matchOnDescription: true,
        title: DebugConfigStrings.debugProfile.configPromp.title,
    });

    if (selection === undefined) {
        return;
    } else if (selection.label === DebugConfigStrings.debugProfile.createNew.label) {
        await input.run(() => showDebugSettingsProfileCreationPicker(input), state);
        return await input.run(() => buildDebugProfileLaunchDebugConfiguration(input, state), state);
    } else if ('item' in selection) {
        if (selection.item.debugProfile?.includes(DebugProfileType.debug)) {
            Object.assign(state.config, getDefaultDebugConfig(selection.item));
        } else if (selection.item.debugProfile?.includes(DebugProfileType.debugTesting)) {
            Object.assign(state.config, getDefaultTestingDebugConfig(selection.item));
        }
    }

    sendTelemetryEvent(EventName.DEBUGGER_CONFIGURATION_PROMPTS, undefined, {
        configurationType: DebugConfigurationType.debugProfile,
    });
}

function getDefaultDebugConfig(item: any): Partial<DebugConfigurationArguments> {
    return {
        name: item.name,
        type: DebuggerTypeName,
        request: 'launch',
        program: '${file}',
        console: 'integratedTerminal',
        debugProfile: DebugProfileType.debug,
    };
}

function getDefaultTestingDebugConfig(item: any): Partial<DebugConfigurationArguments> {
    return {
        name: item.name,
        type: DebuggerTypeName,
        request: 'launch',
        subProcess: true,
        debugProfile: DebugProfileType.debugTesting,
        console: 'integratedTerminal',
    };
}
