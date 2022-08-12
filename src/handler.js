const {nanoid} = require('nanoid');
const books = require('./bookshelfs');

const addBookshelfHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);

  const namearenull = name == null;
  const overreadPage = pageCount < readPage;
  const isSuccess = books.filter((book) => book.id === id).length > 0;


  if (namearenull) {
    books.pop(newBooks);
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (overreadPage) {
    books.pop(newBooks);
    const response = h.response({
      status: 'fail',
      message:
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } else {
    books.pop(newBooks);
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getAllBooksHandler = (request, h) =>{
  const viewbook = [];
  let filterbook = books;
  const {name, reading, finished} = request.query;

  if (name !== undefined) {
    filterbook = books.filter((condition) =>
      condition.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading !== undefined) {
    filterbook = books.filter((condition) =>
      condition.reading === (reading === '1'));
  }
  if (finished !== undefined) {
    filterbook = books.filter((condition) =>
      condition.finished === (finished === '1'));
  }

  for ( const book of filterbook) {
    viewbook.push({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    });
  }
  const response = h.response({
    status: 'success',
    data: {
      books: viewbook,
    },
  });
  response.code(200);
  return response;
};

const getBookHandler = (request, h) =>{
  const {bookId} = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };
};

const editBookHandler = (request, h) =>{
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  const namearenull = name == null;
  const overreadPage = pageCount < readPage;
  const finished = pageCount === readPage;

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } else if (namearenull) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (overreadPage) {
    const response = h.response({
      status: 'fail',
      message:
      'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
};

const deleteBookHandler = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

module.exports = {
  addBookshelfHandler,
  getAllBooksHandler,
  getBookHandler,
  editBookHandler,
  deleteBookHandler,
};
