import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
console.log('🧩 Flask補完拡張が有効化されました！');

const triggerChars = [
	'{', '.', '/', '_',
	'a', 'b', 'c', 'd', 'e', 'f', 'g',
	'h', 'i', 'j', 'k', 'l', 'm', 'n',
	'o', 'p', 'q', 'r', 's', 't', 'u',
	'v', 'w', 'x', 'y', 'z'
];

const provider = vscode.languages.registerCompletionItemProvider(
	{ scheme: 'file', language: 'html' },
	{
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

		const staticPath = vscode.Uri.joinPath(
			document.uri,
			'..', '..',
			'static',
			...relativePath.split('/').filter(p => p.length > 0)
		).with({ scheme: 'file' });

		console.log("📁 staticフォルダのパス:", staticPath.fsPath);

		try {
			const entries = await vscode.workspace.fs.readDirectory(staticPath);
			const items = entries
			.filter(([name, type]) =>
				type === vscode.FileType.Directory || /\.(png|jpe?g|gif|svg|webp|css|js)$/i.test(name)
			)
			.map(([name, type]) => {
				const isDir = type === vscode.FileType.Directory;
				const item = new vscode.CompletionItem(
				name,
				isDir ? vscode.CompletionItemKind.Folder : vscode.CompletionItemKind.File
				);
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
		} catch (err) {
			console.log("❌ staticフォルダ読み込みエラー:", err);
		}
		}

		if (prev === '{' && prev2 === '{') {
		console.log('✅ {{ を検知しました！');

		const item = new vscode.CompletionItem(
			"url_for('static', filename='')",
			vscode.CompletionItemKind.Snippet
		);
		item.insertText = new vscode.SnippetString("url_for('static', filename='$1')");
		item.detail = "Flask static path";
		item.documentation = "Flaskのstaticファイルのパスを指定します";

		return [item];
		}

		return undefined;
	}
	},
	...triggerChars
);

context.subscriptions.push(provider);
}

export function deactivate() {
console.log('🛑 Flask補完拡張が無効化されました！');
}
