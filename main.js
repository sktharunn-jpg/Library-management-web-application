const API_URL = 'http://localhost:3000/api';

const api = {
    async login(username, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return response.json();
    },

    async getBooks() {
        const response = await fetch(`${API_URL}/books`);
        return response.json();
    },

    async addBook(bookData) {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        return response.json();
    },

    async deleteBook(id) {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    async issueBook(issueData) {
        const response = await fetch(`${API_URL}/books/issue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueData)
        });
        return response.json();
    },

    async returnBook(returnData) {
        const response = await fetch(`${API_URL}/books/return`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(returnData)
        });
        return response.json();
    }
};

// Auth helper
const auth = {
    isLoggedIn() {
        return !!localStorage.getItem('user');
    },
    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    },
    login(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    },
    checkAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/index.html';
        }
    }
};

// UI Helpers
const ui = {
    showAlert(message, type = 'error') {
        const alertBox = document.getElementById('alert-box');
        if (alertBox) {
            alertBox.textContent = message;
            alertBox.className = `alert ${type}`;
            alertBox.style.display = 'block';
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 3000);
        }
    }
};
