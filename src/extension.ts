import * as vscode from 'vscode';
import { ClaudeChatPanel } from './claudeChatPanel';
import { claudeCodeCompletion, claudeCodeFix } from './claudeApi';

export async function activate(context: vscode.ExtensionContext) {
    const chatViewProvider = new ClaudeChatPanel(context.extensionUri, context);

    const apiKey = await context.secrets.get('anthropic.apiKey');
    if (!apiKey) {
        const newApiKey = await vscode.window.showInputBox({ prompt: 'Enter your Anthropic API key' });
        if (newApiKey) {
            await context.secrets.store('anthropic.apiKey', newApiKey);
            vscode.window.showInformationMessage('Anthropic API key stored successfully.');
        } else {
            vscode.window.showErrorMessage('Anthropic API key is required for this extension to work.');
            return;
        }
    }

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ClaudeChatPanel.viewType, chatViewProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claude.chat', () => {
            vscode.commands.executeCommand('claude.chat.focus');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claude.setApiKey', () => {
            vscode.window.showInputBox({ prompt: 'Enter your Anthropic API key' }).then(apiKey => {
                if (apiKey) {
                    context.secrets.store('anthropic.apiKey', apiKey);
                    vscode.window.showInformationMessage('Anthropic API key stored successfully.');
                }
            });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claude.codeCompletion', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);
                if (selectedText) {
                    const completion = await claudeCodeCompletion(context, selectedText);
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, completion);
                    });
                } else {
                    vscode.window.showErrorMessage('No text selected.');
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claude.codeFix', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);
                if (selectedText) {
                    const fixedCode = await claudeCodeFix(context, selectedText);
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, fixedCode);
                    });
                } else {
                    vscode.window.showErrorMessage('No text selected.');
                }
            }
        })
    );
}

export function deactivate() {}
