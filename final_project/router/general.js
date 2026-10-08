const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  const keys = Object.keys(books);

  keys.forEach(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json({ booksbyauthor: matchingBooks });
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];
  const keys = Object.keys(books);

  keys.forEach(key => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json({ booksbytitle: matchingBooks });
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get all books – Using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await Promise.resolve(books);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Search by ISBN – Using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({ message: err }));
});

// Task 12: Search by Author – Using async/await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    return res.status(200).json({ booksbyauthor: matchingBooks });
  } catch (error) {
    return res.status(500).json({ message: "Error searching by author" });
  }
});

// Task 13: Search by Title – Using async/await
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    return res.status(200).json({ booksbytitle: matchingBooks });
  } catch (error) {
    return res.status(500).json({ message: "Error searching by title" });
  }
});

module.exports.general = public_users;
