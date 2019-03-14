// Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI
class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        // create tr
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;
        list.appendChild(row);
    }
    // show alert
    showAlert(message, className) {
        const div = document.createElement('div');
        // add classes
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // insert alert
        container.insertBefore(div, form);
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }
    // delete book
    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }
    // clear fields
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            // add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Loaded Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // form values
    const 
        title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    
    const book = new Book(title, author, isbn);

    const ui = new UI();

    // validate
    if(title === '' || author === '' || isbn === '') {
        // error alert
        ui.showAlert('Please fill all fields', 'error');
    } else {
        // add book to list
        ui.addBookToList(book);

        // add to localStorage
        Store.addBook(book);

        // show success
        ui.showAlert('Book Added!', 'success');

        // clear fields
        ui.clearFields();
    }
});

// event listener for delete 
document.getElementById('book-list').addEventListener('click', function(e) {
    e.preventDefault();
    
    const ui = new UI();

    // delete book
    ui.deleteBook(e.target);

    // remove from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show message
    ui.showAlert('Book Deleted!', 'success');
});