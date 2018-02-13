'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Disposable, Uri, SourceControlResourceState, window, workspace, WorkspaceEdit, Range, Position, TextEdit, debug } from 'vscode';
import * as path from 'path';
import { parse } from 'url';
import * as fs from 'fs';
import { resolve } from 'path';
import UiTest from './UiTest';
import CargoTaskProvider from './cargo/TaskProvider'
import CargoExt from './cargo';
import { RustupResolver } from './rustup';
import { CargoWorkspaceFactory } from './cargo/Workspace';
import { MetadataFactory } from './cargo/Metadata';
import CargoConfigProvider from './debugger/ConfigProvider';



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    function add<T extends Disposable>(t: T): T {
        context.subscriptions.push(t);
        return t
    }


    const rustup = add(new RustupResolver());
    const cargoMetadata = add(new MetadataFactory(rustup));
    const cargoWorkspace = add(new CargoWorkspaceFactory(cargoMetadata));




    add(new CargoExt(new CargoTaskProvider(rustup, cargoWorkspace)));

    const uiTest = add(new UiTest(cargoWorkspace));

    const debugConfigProvider = add(new CargoConfigProvider(rustup));
    debug.registerDebugConfigurationProvider('rust', debugConfigProvider);


    vscode.window.activeTextEditor && uiTest.openDiffIfRequried(vscode.window.activeTextEditor.document);
}




// this method is called when your extension is deactivated
export async function deactivate() {
}