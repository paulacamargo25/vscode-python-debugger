/* eslint-disable @typescript-eslint/naming-convention */
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { Readable } from 'stream';
import {
    CancellationToken,
    DebugAdapterDescriptorFactory,
    DebugAdapterTrackerFactory,
    DebugConfigurationProvider,
    Disposable,
    QuickPickItem,
    QuickPickItemKind,
    WorkspaceFolder,
} from 'vscode';

import { DebugConfigurationArguments } from '../types';

export const IDebugConfigurationService = Symbol('IDebugConfigurationService');
export interface IDebugConfigurationService extends DebugConfigurationProvider {}

export const IDynamicDebugConfigurationService = Symbol('IDynamicDebugConfigurationService');
export interface IDynamicDebugConfigurationService extends DebugConfigurationProvider {}

export enum DebugProfileType {
    debug = 'debug',
    debugTesting = 'debug.testing',
}

export type DebugProfileArguments = {
    name: string;
    debugProfile?: DebugProfileType[];
};

export type DebugProfileState = {
    config: Partial<DebugProfileArguments>;
};

export type DebugConfigurationState = {
    config: Partial<DebugConfigurationArguments>;
    folder?: WorkspaceFolder;
    token?: CancellationToken;
};

export interface DebugProfileConfigQuickPickItem extends QuickPickItem {
    item: DebugProfileArguments;
    debugProfile: DebugProfileType;
    description: string;
    kind?: QuickPickItemKind;
}

export interface SeparatorQuickPickItem extends QuickPickItem {
    label: string;
    kind?: QuickPickItemKind;
}

export type DebugProfilePickType = DebugProfileConfigQuickPickItem | SeparatorQuickPickItem;

export enum DebugConfigurationType {
    launchFile = 'launchFile',
    launchFileWithArgs = 'launchFileWithArgs',
    remoteAttach = 'remoteAttach',
    launchDjango = 'launchDjango',
    launchFastAPI = 'launchFastAPI',
    launchFlask = 'launchFlask',
    launchModule = 'launchModule',
    launchPyramid = 'launchPyramid',
    pidAttach = 'pidAttach',
    debugProfile = 'debugProfile',
}

export enum PythonPathSource {
    launchJson = 'launch.json',
    settingsJson = 'settings.json',
}

export const IDebugAdapterDescriptorFactory = Symbol('IDebugAdapterDescriptorFactory');
export interface IDebugAdapterDescriptorFactory extends DebugAdapterDescriptorFactory {}

export const IDebugSessionLoggingFactory = Symbol('IDebugSessionLoggingFactory');

export interface IDebugSessionLoggingFactory extends DebugAdapterTrackerFactory {}

export const IOutdatedDebuggerPromptFactory = Symbol('IOutdatedDebuggerPromptFactory');

export interface IOutdatedDebuggerPromptFactory extends DebugAdapterTrackerFactory {}

export const IProtocolParser = Symbol('IProtocolParser');
export interface IProtocolParser extends Disposable {
    connect(stream: Readable): void;
    once(event: string | symbol, listener: (...args: unknown[]) => void): this;
    on(event: string | symbol, listener: (...args: unknown[]) => void): this;
}
