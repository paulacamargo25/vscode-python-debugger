// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { QuickPickItem, QuickPickItemKind, Uri } from 'vscode';
import { SeparatorQuickPickItem } from '../../../types';

export interface PathQuickPickItem extends QuickPickItem {
    filePath: Uri;
    kind?: QuickPickItemKind;
    description: string;
}

export type QuickPickType = PathQuickPickItem | SeparatorQuickPickItem;
