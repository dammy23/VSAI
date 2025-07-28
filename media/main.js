(function () {
    const vscode = acquireVsCodeApi();

    const chatLog = document.getElementById('chat-log');
    const questionInput = document.getElementById('question-input');
    const askButton = document.getElementById('ask-button');

    askButton.addEventListener('click', () => {
        const question = questionInput.value;
        if (question) {
            vscode.postMessage({
                type: 'askQuestion',
                value: question
            });
            questionInput.value = '';
        }
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'addResponse':
                {
                    const response = message.value;
                    const li = document.createElement('li');
                    li.textContent = response;
                    chatLog.appendChild(li);
                    break;
                }
        }
    });
}());
