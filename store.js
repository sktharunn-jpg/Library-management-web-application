const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname);
const booksFile = path.join(dataDir, 'books.json');
const usersFile = path.join(dataDir, 'users.json');

// Helper to read JSON file
const readJson = (file) => {
    if (!fs.existsSync(file)) {
        return [];
    }
    const data = fs.readFileSync(file);
    try {
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write JSON file
const writeJson = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

module.exports = {
    getBooks: () => readJson(booksFile),
    saveBooks: (books) => writeJson(booksFile, books),
    getUsers: () => readJson(usersFile),
    // We probably won't need to save users for this simple app, but good to have
    saveUsers: (users) => writeJson(usersFile, users)
};
