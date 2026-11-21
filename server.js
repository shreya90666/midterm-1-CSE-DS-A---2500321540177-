const http = require('http');
const fs = require('fs');
const path = require('path');
let books = [
    { id: 1, title: "Harry Potter", author: "J.K. Rowling", category: "Fantasy" },
    { id: 2, title: "Wings of Fire", author: "APJ Abdul Kalam", category: "Biography" },
    { id: 3, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction" },
    { id: 4, title: "Atomic Habits", author: "James Clear", category: "Self Help" }
];
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET' && req.url.startsWith('/books')) {

        const url = new URL(req.url, 'http://localhost:8080');
        const filter = url.searchParams.get('filter');

        if (filter) {
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(filter.toLowerCase()) ||
                book.author.toLowerCase().includes(filter.toLowerCase()) ||
                book.category.toLowerCase().includes(filter.toLowerCase())
            );
            res.writeHead(200);
            return res.end(JSON.stringify(filteredBooks));
        }
        const id = url.pathname.split('/')[2];
        if (id) {
            const book = books.find(b => b.id === Number(id));
            if (book) {
                res.writeHead(200);
                return res.end(JSON.stringify(book));
            }
            res.writeHead(404);
            return res.end(JSON.stringify({ message: "Book not found" }));
        }
        res.writeHead(200);
        return res.end(JSON.stringify(books));
    }
    if (req.method === 'POST' && req.url === '/books') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newBook = JSON.parse(body);
            newBook.id = books.length
                ? Math.max(...books.map(b => b.id)) + 1
                : 1;
            books.push(newBook);
            res.writeHead(201);
            res.end(JSON.stringify(newBook));
        });
        return;
    }
    if (req.method === 'PUT' && req.url.startsWith('/books/')) {
        const id = Number(req.url.split('/')[2]);
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const index = books.findIndex(b => b.id === id);
            if (index === -1) {
                res.writeHead(404);
                return res.end(JSON.stringify({ message: "Book not found" }));
            }
            const updatedBook = JSON.parse(body);
            books[index] = { ...books[index], ...updatedBook, id };
            res.writeHead(200);
            res.end(JSON.stringify(books[index]));
        });
        return;
    }
    if (req.method === 'DELETE' && req.url.startsWith('/books/')) {
        const id = Number(req.url.split('/')[2]);
        const index = books.findIndex(b => b.id === id);
        if (index === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({ message: "Book not found" }));
        }
        const deletedBook = books.splice(index, 1);
        res.writeHead(200);
        return res.end(JSON.stringify(deletedBook[0]));
    }
    const filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
    const fullPath = path.join(__dirname, filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript'
    };
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end(JSON.stringify({ message: "Not found" }));
        }
        res.writeHead(200, {
            'Content-Type': contentTypes[path.extname(fullPath)] || 'text/plain'
        });
        res.end(data);
    });
});
server.listen(8080, () => {
    console.log("Server running at http://localhost:8080");
});
