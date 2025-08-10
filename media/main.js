(function () {
    const vscode = acquireVsCodeApi();

    const chatLog = document.getElementById('chat-log');
    const questionInput = document.getElementById('question-input');
    const askButton = document.getElementById('ask-button');
    let botMessageElement = null;

    function askQuestion() {
        const question = questionInput.value.trim();
        if (question) {
            vscode.postMessage({
                type: 'askQuestion',
                value: question
            });

            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.textContent = question;
            chatLog.appendChild(userMessage);

            questionInput.value = '';

            const thinkingMessage = document.createElement('div');
            thinkingMessage.className = 'message bot-message thinking';
            thinkingMessage.textContent = 'Thinking...';
            chatLog.appendChild(thinkingMessage);
            botMessageElement = thinkingMessage;

            chatLog.scrollTop = chatLog.scrollHeight;
        }
    }

    askButton.addEventListener('click', askQuestion);
    questionInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            askQuestion();
        }
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'streamResponse':
                if (botMessageElement && botMessageElement.classList.contains('thinking')) {
                    botMessageElement.classList.remove('thinking');
                    botMessageElement.textContent = '';
                }
                if (botMessageElement) {
                    botMessageElement.textContent += message.value;
                    chatLog.scrollTop = chatLog.scrollHeight;
                }
                break;
            case 'streamEnd':
                botMessageElement = null;
                break;
        }
    });
}());
