// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { DebugConfigStrings } from '../../../common/utils/localize';
import { IQuickPickParameters, MultiStepInput } from '../../../common/multiStepInput';
import {
    configSubType,
    configType,
    DebugConfigurationState,
    DebugConfigurationType,
    DebugProfilePickType,
    DebugProfileState,
} from '../../types';
import { sendTelemetryEvent } from '../../../telemetry';
import { EventName } from '../../../telemetry/constants';
import { showDebugSettingsProfileCreationPicker } from '../debugProfile/debugProfileCreationQuickPicker';
import { getDebugProfileOptions, getDefaultConfig } from '../utils/debugProfileOptions';

export async function buildDebugProfileLaunchDebugConfiguration(
    input: MultiStepInput<DebugConfigurationState>,
    state: DebugConfigurationState,
): Promise<void> {
    let options = getDebugProfileOptions(configType.terminal, configSubType.terminalDebug);

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
        const multiStep = new MultiStepInput<DebugProfileState>();
        await input.run(() => showDebugSettingsProfileCreationPicker(multiStep), state);
        return await input.run(() => buildDebugProfileLaunchDebugConfiguration(input, state), state);
    } else if ('item' in selection) {
        Object.assign(state.config, getDefaultConfig(selection.item, configSubType.terminalDebug));
    }

    sendTelemetryEvent(EventName.DEBUGGER_CONFIGURATION_PROMPTS, undefined, {
        configurationType: DebugConfigurationType.debugProfile,
    });
}
