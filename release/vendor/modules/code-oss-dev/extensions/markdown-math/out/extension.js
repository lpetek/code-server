"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const vscode = require("vscode");
const enabledSetting = 'markdown.math.enabled';
function activate(context) {
    function isEnabled() {
        const config = vscode.workspace.getConfiguration('markdown');
        return config.get('math.enabled', true);
    }
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(enabledSetting)) {
            vscode.commands.executeCommand('markdown.api.reloadPlugins');
        }
    }, undefined, context.subscriptions);
    return {
        extendMarkdownIt(md) {
            if (isEnabled()) {
                const katex = require('@iktakahiro/markdown-it-katex');
                return md.use(katex, { globalGroup: true });
            }
            return md;
        }
    };
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map