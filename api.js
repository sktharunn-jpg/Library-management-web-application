const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Simple ID generator
const generateId = () => Date.now().toString();

// --- Auth Routes ---

router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const users = store.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, message: 'Login successful', user: { username: user.username, role: user.role } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// --- Book Routes ---

// Get all books
router.get('/books', (req, res) => {
    const books = store.getBooks();
    res.json(books);
});

// Add a book
router.post('/books', (req, res) => {
    const { title, author, category, quantity } = req.body;
    if (!title || !author || !quantity) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const books = store.getBooks();
    const newBook = {
        id: generateId(),
        title,
        author,
        category,
        quantity: parseInt(quantity),
        available: parseInt(quantity),
        issued: [] // Array of { studentName, issueDate, returnDate, id }
    };

    books.push(newBook);
    store.saveBooks(books);
    res.json({ success: true, message: 'Book added successfully', book: newBook });
});

// Update a book
router.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, category, quantity } = req.body;
    const books = store.getBooks();
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Update fields
    const book = books[bookIndex];
    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (quantity) {
        const diff = parseInt(quantity) - book.quantity;
        book.quantity = parseInt(quantity);
        book.available += diff;
    }

    store.saveBooks(books);
    res.json({ success: true, message: 'Book updated successfully', book });
});

// Delete a book
router.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    let books = store.getBooks();
    const newBooks = books.filter(b => b.id !== id);

    if (books.length === newBooks.length) {
        return res.status(404).json({ success: false, message: 'Book not found' });
    }

    store.saveBooks(newBooks);
    res.json({ success: true, message: 'Book deleted successfully' });
});

// Issue a book
router.post('/books/issue', (req, res) => {
    const { bookId, studentName, issueDate, returnDate } = req.body;
    const books = store.getBooks();
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.available <= 0) {
        return res.status(400).json({ success: false, message: 'Book not available' });
    }

    book.available -= 1;
    book.issued.push({
        id: generateId(),
        studentName,
        issueDate,
        returnDate,
        returned: false
    });

    store.saveBooks(books);
    res.json({ success: true, message: 'Book issued successfully', book });
});

// Return a book
router.post('/books/return', (req, res) => {
    const { bookId, issueId } = req.body;
    const books = store.getBooks();
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const issueRecord = book.issued.find(i => i.id === issueId);
    if (!issueRecord) {
        return res.status(404).json({ success: false, message: 'Issue record not found' });
    }

    if (issueRecord.returned) {
        return res.status(400).json({ success: false, message: 'Book already returned' });
    }

    issueRecord.returned = true;
    issueRecord.actualReturnDate = new Date().toISOString().split('T')[0];
    book.available += 1;

    store.saveBooks(books);
    res.json({ success: true, message: 'Book returned successfully', book });
});

module.exports = router;
