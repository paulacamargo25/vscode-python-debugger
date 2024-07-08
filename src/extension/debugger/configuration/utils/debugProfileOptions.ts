import { QuickPickItemKind } from 'vscode';
import { getConfiguration } from '../../../common/vscodeapi';
import {
    configSubType,
    configType,
    DebugProfileArguments,
    DebugProfileConfigQuickPickItem,
    DebugProfilePickType,
} from '../../types';
import { DebugConfigStrings } from '../../../common/utils/localize';
import { DebugConfigurationArguments } from '../../../types';
import { DebuggerTypeName } from '../../../constants';

export function getDebugProfileOptions(type: configType, subtype: configSubType): DebugProfilePickType[] {
    const profileConfigs = getConfiguration('python').get<[]>('configs', []);
    const debugProfileOptions: DebugProfileConfigQuickPickItem[] = profileConfigs
        .filter((item: DebugProfileArguments) => item.type === type && item.subtype?.includes(subtype))
        .map((item: DebugProfileArguments) => {
            return {
                label: item.name,
                item: item,
            };
        });

    return [
        ...debugProfileOptions,
        { label: '', kind: QuickPickItemKind.Separator },
        {
            label: DebugConfigStrings.debugProfile.createNew.label,
            description: DebugConfigStrings.debugProfile.createNew.description,
        },
    ];
}

export function getDefaultConfig(item: any, type: configSubType): Partial<DebugConfigurationArguments> {
    if (type === configSubType.terminalDebug) {
        return {
            name: `Python Debugger: ${type} Profile`,
            type: DebuggerTypeName,
            request: 'launch',
            program: '${file}',
            console: 'integratedTerminal',
            debugProfile: item.name,
        };
    } else {
        return {
            name: `Python Debugger: ${type} Profile`,
            type: DebuggerTypeName,
            request: 'launch',
            subProcess: true,
            debugProfile: item.name,
            console: 'integratedTerminal',
        };
    }
}
