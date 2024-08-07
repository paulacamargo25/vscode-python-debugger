import * as vscode from 'vscode';
import * as path from 'path';
import { EXTENSION_ROOT_DIR } from '../common/constants';

export async function createPythonTerminal() {
    const terminal = vscode.window.createTerminal({
        name: 'Python Debug Terminal',
        iconPath: new vscode.ThemeIcon('debug'),
        env: {
            DEBUGPY_EXTRA_ARGV: '--listen 5678 --wait-for-client',
            PYTHONPATH: path.join(EXTENSION_ROOT_DIR, 'bundled', 'libs'),
            PATH: path.join(EXTENSION_ROOT_DIR, 'bundled', 'libs', 'bin'),
        },
    });
    terminal.show();
}
