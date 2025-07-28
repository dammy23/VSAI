export async function getResponse(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (prompt.toLowerCase().includes('hello')) {
        return 'Hello, human!';
    }

    return 'Test Response';
}
