const API = '/books';
async function loadBooks() {
    const filter = document.getElementById('filter').value;
    let url = API;
    if (filter) {
        url += '?filter=' + encodeURIComponent(filter);
    }
    const response = await fetch(url);
    const books = await response.json();
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    if (books.length === 0) {
        bookList.innerHTML = '<p>No books found.</p>';
        return;
    }
    books.forEach(book => {
        bookList.innerHTML += `
            <div class="book">
                <h3>${book.title}</h3>
                <p>ID: ${book.id}</p>
                <p>Author: ${book.author}</p>
                <p>Category: ${book.category}</p>

                <button class="edit"
                    onclick="updateBook(${book.id})">
                    Edit
                </button>
                <button class="delete"
                    onclick="deleteBook(${book.id})">
                    Delete
                </button>
            </div>
        `;
    });
}
async function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const category = document.getElementById('category').value;
    if (!title || !author || !category) {
        alert('Please fill all fields');
        return;
    }
    await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, category })
    });
    alert('Book added successfully');
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('category').value = '';
    loadBooks();
}
async function updateBook(id) {
    const title = prompt('Enter new book title:');
    if (!title) return;
    const author = prompt('Enter new author:');
    const category = prompt('Enter new category:');
    if (!author || !category) return;
    await fetch(API + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, category })
    });
    alert('Book updated successfully');
    loadBooks();
}
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    await fetch(API + '/' + id, {
        method: 'DELETE'
    });
    alert('Book deleted successfully');
    loadBooks();
}
function showAll() {
    document.getElementById('filter').value = '';
    loadBooks();
}
loadBooks();
