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
} from '../../types';
import { sendTelemetryEvent } from '../../../telemetry';
import { EventName } from '../../../telemetry/constants';
import { getDebugProfileOptions, getDefaultConfig } from '../utils/debugProfileOptions';
import { executeCommand } from '../../../common/vscodeapi';

export async function buildTestingDebugProfileLaunchDebugConfiguration(
    input: MultiStepInput<DebugConfigurationState>,
    state: DebugConfigurationState,
): Promise<void> {
    let options = getDebugProfileOptions(configType.test, configSubType.testDebug);

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
        await executeCommand('python.configureTests').then(async () => {
            return;
        });
    } else if ('item' in selection) {
        Object.assign(state.config, getDefaultConfig(selection.item, configSubType.testDebug));
    }

    sendTelemetryEvent(EventName.DEBUGGER_CONFIGURATION_PROMPTS, undefined, {
        configurationType: DebugConfigurationType.testingDebugProfile,
    });
}
