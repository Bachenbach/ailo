// script.js
class AIChatInterface {
    constructor() {
        this.chatButton = document.getElementById('chatButton');
        this.chatWindow = document.getElementById('chatWindow');
        this.minimizeButton = document.getElementById('minimizeButton');
        this.sendButton = document.getElementById('sendButton');
        this.userInput = document.getElementById('userInput');
        this.chatMessages = document.getElementById('chatMessages');
        this.thinking = document.getElementById('thinking');
        this.statusText = document.getElementById('statusText');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Toggle chat window
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.minimizeButton.addEventListener('click', () => this.toggleChat());

        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.userInput.addEventListener('input', () => {
            this.userInput.style.height = 'auto';
            this.userInput.style.height = this.userInput.scrollHeight + 'px';
        });
    }

    toggleChat() {
        this.chatWindow.classList.toggle('active');
        if (this.chatWindow.classList.contains('active')) {
            this.userInput.focus();
        }
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.userInput.style.height = 'auto';

        // Show thinking animation
        this.showThinking(true);
        this.updateStatus('Processing...');

        try {
            // Process with AI
            const response = await this.processWithAI(message);
            
            // Hide thinking animation
            this.showThinking(false);
            
            // Add AI response
            this.addMessage(response.response, 'ai');
            this.updateStatus('Online');
        } catch (error) {
            this.showThinking(false);
            this.addMessage('Sorry, I encountered an error.', 'ai');
            this.updateStatus('Error');
            console.error('Error:', error);
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showThinking(show) {
        this.thinking.classList.toggle('active', show);
    }

    updateStatus(status) {
        this.statusText.textContent = status;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async processWithAI(message) {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: message })
        });

        if (!response.ok) {
            throw new Error('AI processing failed');
        }

        return await response.json();
    }
}

// Initialize the chat interface
document.addEventListener('DOMContentLoaded', () => {
    const chatInterface = new AIChatInterface();
});
