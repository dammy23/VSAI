import * as vscode from 'vscode';
import { ChatViewProvider } from './ChatViewProvider';

export async function activate(context: vscode.ExtensionContext) {
    const chatViewProvider = new ChatViewProvider(context.extensionUri, context);

    const apiKey = await context.secrets.get('apiKey');
    if (!apiKey) {
        const newApiKey = await vscode.window.showInputBox({ prompt: 'Enter your API key' });
        if (newApiKey) {
            await context.secrets.store('apiKey', newApiKey);
            vscode.window.showInformationMessage('API key stored successfully.');
        } else {
            vscode.window.showErrorMessage('API key is required.');
            return;
        }
    }

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, chatViewProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('customAI.startChat', () => {
            // The view will be automatically shown when the user clicks on the activity bar icon
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('customAI.askAboutCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);
                if (selectedText) {
                    await vscode.commands.executeCommand('custom-ai-sidebar.focus');
                    chatViewProvider.postMessage({ type: 'askQuestion', value: selectedText });
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('customAI.setApiKey', () => {
            vscode.window.showInputBox({ prompt: 'Enter your API key' }).then(apiKey => {
                if (apiKey) {
                    context.secrets.store('apiKey', apiKey);
                    vscode.window.showInformationMessage('API key stored successfully.');
                }
            });
        })
    );
}

export function deactivate() {}
