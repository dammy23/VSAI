# Claude for VS Code

This extension integrates Anthropic's Claude into Visual Studio Code, providing a powerful AI assistant for chat, code completion, and code fixing.

## Features

*   **Claude Chat**: Open a chat panel to have a conversation with Claude.
*   **Claude Code Completion**: Select a piece of code and have Claude complete it for you.
*   **Claude Code Fix**: Select a piece of code and have Claude fix any issues it finds.
*   **Secure API Key Storage**: Your Anthropic API key is stored securely using VS Code's SecretStorage.

## Prerequisites

*   You must have an API key from [Anthropic](https://console.anthropic.com/).
*   You need to have `vsce` (Visual Studio Code Extensions) installed to package the extension. If you don't have it, install it globally:
    ```
    npm install -g vsce
    ```

## Installation

1.  **Clone the repository**:
    ```
    git clone https://github.com/your-username/claude-vscode-extension.git
    cd claude-vscode-extension
    ```
2.  **Install dependencies**:
    ```
    npm install
    ```
3.  **Compile the TypeScript code**:
    ```
    npm run compile
    ```
4.  **Package the extension**:
    ```
    vsce package
    ```
    This will create a `.vsix` file (e.g., `claude-vscode-extension-1.0.0.vsix`).
5.  **Install the extension in VS Code**:
    *   Open VS Code.
    *   Go to the Extensions view (Ctrl+Shift+X).
    *   Click the "..." menu in the top-right corner of the Extensions view.
    *   Select "Install from VSIX..." and choose the `.vsix` file you just created.

## Usage

1.  **Set your API Key**:
    *   The first time you use a command, you will be prompted to enter your Anthropic API key.
    *   You can also run the "Claude: Set API Key" command from the Command Palette (Ctrl+Shift+P) to set or update your key at any time.

2.  **Using the Commands**:
    *   **Claude: Start Chat**: Run this command from the Command Palette to open the Claude chat panel.
    *   **Claude: Code Completion**: Select a piece of code in the editor, then run this command from the Command Palette or by right-clicking on the selection.
    *   **Claude: Fix Code**: Select a piece of code in the editor, then run this command from the Command Palette or by right-clicking on the selection.
