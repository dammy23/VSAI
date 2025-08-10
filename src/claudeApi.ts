import Anthropic from '@anthropic-ai/sdk';
import * as vscode from 'vscode';

async function getClaudeClient(context: vscode.ExtensionContext) {
    const apiKey = await context.secrets.get('anthropic.apiKey');
    if (!apiKey || typeof apiKey !== 'string') {
        throw new Error('Anthropic API key not found. Please run the "Claude: Set API Key" command.');
    }
    return new Anthropic({ apiKey });
}

export async function getLatestModel(): Promise<string> {
    // For now, we'll hardcode a recent powerful model.
    // In a real-world scenario, you might want to use the API to list models
    // and find the latest one, but that adds complexity.
    return "claude-3-opus-20240229";
}

export async function streamClaudeResponse(
    context: vscode.ExtensionContext,
    prompt: string,
    onStream: (chunk: string) => void
): Promise<void> {
    try {
        const anthropic = await getClaudeClient(context);
        const model = await getLatestModel();

        const stream = await anthropic.messages.stream({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            system: "You are a world-class AI assistant integrated into Visual Studio Code. Your name is Claude. Be concise, helpful, and an expert in all programming languages and technologies. Format your responses using markdown.",
        });

        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                onStream(chunk.delta.text);
            }
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error communicating with Anthropic API: ${error.message}`);
        throw error;
    }
}

export async function claudeCodeFix(
    context: vscode.ExtensionContext,
    code: string
): Promise<string> {
    try {
        const anthropic = await getClaudeClient(context);
        const model = await getLatestModel();

        const response = await anthropic.messages.create({
            model: model,
            messages: [{ role: 'user', content: `Fix the following code:\n\n${code}` }],
            system: "You are a senior software engineer. Improve and fix the provided code, keeping its functionality intact. Only return the fixed code, without any extra explanations or formatting.",
        });

        return response.content[0].text;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error communicating with Anthropic API: ${error.message}`);
        throw error;
    }
}

export async function claudeCodeCompletion(
    context: vscode.ExtensionContext,
    code: string
): Promise<string> {
    try {
        const anthropic = await getClaudeClient(context);
        const model = await getLatestModel();

        const response = await anthropic.messages.create({
            model: model,
            messages: [{ role: 'user', content: `Complete the following code:\n\n${code}` }],
            system: "You are a world-class AI assistant for code completion. Complete the given code snippet. Only return the completed code, without any extra explanations or formatting.",
        });

        return response.content[0].text;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error communicating with Anthropic API: ${error.message}`);
        throw error;
    }
}
