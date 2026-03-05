const vscode = require('vscode');
const path = require('path');

function activate(context) {
  const extPath = context.extensionUri.fsPath;
  const cssUri = vscode.Uri.file(path.join(extPath, 'custom', 'hellfire.css')).toString();
  const jsUri  = vscode.Uri.file(path.join(extPath, 'custom', 'hellfire.js')).toString();

  const config = vscode.workspace.getConfiguration();
  const current = config.get('vscode_custom_css.imports', []);

  const filtered = current.filter(p => !p.includes('hellfire-theme'));
  const updated = [...filtered, cssUri, jsUri];

  if (JSON.stringify(current) !== JSON.stringify(updated)) {
    config.update('vscode_custom_css.imports', updated, vscode.ConfigurationTarget.Global);
  }
}

exports.activate = activate;
