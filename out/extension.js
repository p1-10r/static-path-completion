"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('🧩 Flask補完拡張が有効化されました！');
    const triggerChars = [
        '{', '.', '/', '_',
        'a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u',
        'v', 'w', 'x', 'y', 'z'
    ];
    const provider = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'html' }, {
        async provideCompletionItems(document, position) {
            const line = document.lineAt(position).text;
            const char = position.character;
            const prev = line.charAt(char - 1);
            const prev2 = line.charAt(char - 2);
            const beforeCursor = line.substring(0, char);
            if (beforeCursor.includes("filename='./")) {
                console.log("📂 ./ を検知しました！");
                const match = beforeCursor.match(/filename='\.\/*([^']*)$/);
                const relativePath = match?.[1] ?? '';
                console.log('📂 相対パス:', relativePath);
                const staticPath = vscode.Uri.joinPath(document.uri, '..', '..', 'static', ...relativePath.split('/').filter(p => p.length > 0)).with({ scheme: 'file' });
                console.log("📁 staticフォルダのパス:", staticPath.fsPath);
                try {
                    const entries = await vscode.workspace.fs.readDirectory(staticPath);
                    const items = entries
                        .filter(([name, type]) => type === vscode.FileType.Directory || /\.(png|jpe?g|gif|svg|webp|css|js)$/i.test(name))
                        .map(([name, type]) => {
                        const isDir = type === vscode.FileType.Directory;
                        const item = new vscode.CompletionItem(name, isDir ? vscode.CompletionItemKind.Folder : vscode.CompletionItemKind.File);
                        item.insertText = name + (isDir ? '/' : '');
                        if (isDir) {
                            item.command = {
                                command: 'editor.action.triggerSuggest',
                                title: 'Trigger Suggest'
                            };
                        }
                        return item;
                    });
                    console.log("📦 候補一覧:", items.map(i => i.label));
                    return items;
                }
                catch (err) {
                    console.log("❌ staticフォルダ読み込みエラー:", err);
                }
            }
            if (prev === '{' && prev2 === '{') {
                console.log('✅ {{ を検知しました！');
                const item = new vscode.CompletionItem("url_for('static', filename='')", vscode.CompletionItemKind.Snippet);
                item.insertText = new vscode.SnippetString("url_for('static', filename='$1')");
                item.detail = "Flask static path";
                item.documentation = "Flaskのstaticファイルのパスを指定します";
                return [item];
            }
            return undefined;
        }
    }, ...triggerChars);
    context.subscriptions.push(provider);
}
function deactivate() {
    console.log('🛑 Flask補完拡張が無効化されました！');
}
//# sourceMappingURL=extension.js.map