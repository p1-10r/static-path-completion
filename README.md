# Flask Static Path Completion

このVSCode拡張機能は、Flaskでよく使われる `url_for('static', filename='')` 構文をHTML中で補完します。

## 主な機能

- `img`, `script`, `link` タグの `src` や `href` で `{{` を入力すると補完候補が出ます
- `filename='./'` を入力すると、staticフォルダ以下のファイルやディレクトリを階層的に補完します
- ディレクトリを選択すると `/` が補完され、自動で補完が再発火します（再帰補完）

## 対応ファイル形式

- 画像：`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`
- スタイル：`.css`
- スクリプト：`.js`

## インストール方法
code --install-extension static-path-completion-0.0.1.vsix

## 作者

Developed by pipi
