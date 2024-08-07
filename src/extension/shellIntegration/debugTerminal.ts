import * as vscode from 'vscode';
import * as path from 'path';
import { EXTENSION_ROOT_DIR } from '../common/constants';

export async function createPythonTerminal(workspaceFolder?: vscode.WorkspaceFolder, config?: any) {
    const terminal = vscode.window.createTerminal({
        name: 'Python Debug Terminal',
        iconPath: new vscode.ThemeIcon('debug'),
        env: {
            DEBUGPY_EXTRA_ARGV: '--listen 5679',
            PYTHONPATH: path.join(EXTENSION_ROOT_DIR, 'bundled', 'libs', 'debugpy'),
            PATH: path.join(EXTENSION_ROOT_DIR, 'bundled', 'libs', 'debugpy'),            
        },
    });
    terminal.sendText('pip install debugpy');
    terminal.show();

}
