import * as vscode from 'vscode';
import { ClaudeChatPanel } from './claudeChatPanel';
import { claudeCodeCompletion, claudeCodeFix } from './claudeApi';

export async function activate(context: vscode.ExtensionContext) {
    const chatViewProvider = new ClaudeChatPanel(context.extensionUri, context);

    // Register all commands and the webview provider first.
    // This ensures they are always available, even if the API key isn't set yet.
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ClaudeChatPanel.viewType, chatViewProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claude.chat', () => {
            // The focus command will automatically reveal the view.
            vscode.commands.executeCommand('claude.chat.focus');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claude.setApiKey', async () => {
            const apiKey = await vscode.window.showInputBox({
                prompt: 'Enter your Anthropic API key',
                password: true, // Hide the key as the user types
                ignoreFocusOut: true, // Keep the input box open even if it loses focus
            });
            if (apiKey) {
                await context.secrets.store('anthropic.apiKey', apiKey);
                vscode.window.showInformationMessage('Anthropic API key stored successfully.');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claude.codeCompletion', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('No active editor.');
                return;
            }
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            if (!selectedText) {
                vscode.window.showErrorMessage('No text selected.');
                return;
            }

            try {
                const completion = await claudeCodeCompletion(context, selectedText);
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, completion);
                });
            } catch (error) {
                // Error is displayed by the claudeApi module
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claude.codeFix', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('No active editor.');
                return;
            }
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            if (!selectedText) {
                vscode.window.showErrorMessage('No text selected.');
                return;
            }

            try {
                const fixedCode = await claudeCodeFix(context, selectedText);
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, fixedCode);
                });
            } catch (error) {
                // Error is displayed by the claudeApi module
            }
        })
    );

    // Initial check to see if the key exists.
    // This is just to provide a helpful message on first launch.
    // It doesn't block activation.
    const apiKey = await context.secrets.get('anthropic.apiKey');
    if (!apiKey) {
        vscode.window.showInformationMessage('Welcome to Claude for VS Code! Please set your Anthropic API key using the "Claude: Set API Key" command.');
    }
}

export function deactivate() {}
