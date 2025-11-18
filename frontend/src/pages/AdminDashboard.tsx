import { useState, useEffect } from 'react'
import { fetchBooks, updateBook, deleteBook, type Book } from '@/api/books'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

const API_URL = 'http://localhost:4000'

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  
  const [file, setFile] = useState<File | null>(null)
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    published: new Date().getFullYear(),
    price: 0,
    stock: 0,
    language: 'English'
  })

  const { token } = useAuth()

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setLoading(true)
      const data = await fetchBooks()
      setBooks(data)
    } catch (error) {
      console.error('Failed to load books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('A book cover image is required.')
      return
    }

    const data = new FormData()
    data.append('image', file)
    data.append('title', newBook.title)
    data.append('author', newBook.author)
    data.append('genre', newBook.genre)
    data.append('published', String(newBook.published))
    data.append('price', String(newBook.price))
    data.append('stock', String(newBook.stock))
    data.append('language', newBook.language)

    try {
      // NOTE: We're not using the 'token' here because we removed 'protect'
      // from the POST /books route.
      await axios.post(`${API_URL}/books`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${token}` // Not needed for add
        }
      })
      
      alert('Book added successfully!')
      
      setNewBook({
        title: '',
        author: '',
        genre: '',
        published: new Date().getFullYear(),
        price: 0,
        stock: 0,
        language: 'English'
      })
      setFile(null)
      setShowAddForm(false)
      loadBooks() 

    } catch (error) {
      console.error('Failed to add book:', error)
      alert('Error adding book. Check console for details.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewBook(prev => ({
      ...prev,
      [name]: name === 'published' || name === 'price' || name ==='stock' 
        ? Number(value) 
        : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleDelete = async (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book? This cannot be undone.')) {
      try {
        //if (!token) throw new Error('Not authenticated'); // Token is needed for delete
        await deleteBook(bookId);
        alert('Book deleted successfully.');
        loadBooks(); 
      } catch (err: any) {
        alert(`Error deleting book: ${err.message}`);
        console.error(err);
      }
    }
  }

  const handleEditClick = (book: Book) => {
    // Set the book to be edited, pre-filling the form
    // IMPORTANT: Make sure the state keys (title, author) match the form
    setEditingBook({ 
      ...book,
      title: book.Title,
      author: book.Author,
      genre: book.Genre,
      published: book.Published,
      price: book.Price,
      stock: book.Stock,
      language: book.Language
    }); 
    setShowAddForm(false); 
  }
  
  const handleCancelEdit = () => {
    setEditingBook(null);
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingBook) return;
    
    const { name, value } = e.target;
    setEditingBook(prev => ({
      ...prev!,
      [name]: name === 'published' || name === 'price' || name === 'stock'
        ? Number(value)
        : value
    }));
  }

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      await updateBook(editingBook.Book_ID, editingBook);
      alert('Book updated successfully!');
      setEditingBook(null);
      loadBooks(); 
    } catch (err: any) {
      alert(`Error updating book: ${err.message}`);
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading books...</div>
      </div>
    )
  }

  return (
    <div>
      {/* --- HEADER --- */}
      <div className="admin-header">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-primary-100">Manage your bookstore inventory</p>
      </div>

      {/* --- STATS --- */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{books.reduce((sum, book) => sum + book.Stock, 0)}</div>
          <div className="stat-label">Total Stock</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{books.reduce((sum, book) => sum + (book.Price * book.Stock), 0).toFixed(2)}</div>
          <div className="stat-label">Inventory Value</div>
        </div>
      </div>

      <div className="card">
        {/* --- CARD HEADER (Add Book Button) --- */}
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Book Inventory</h2>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingBook(null); // Close edit form if open
              }}
              className="btn btn-primary"
            >
              {showAddForm ? 'Cancel' : 'Add New Book'}
            </button>
          </div>
        </div>

        {/* --- ADD BOOK FORM --- */}
        {showAddForm && (
          <div className="card-body border-t">
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... (all your form-groups for add book) ... */}
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" name="title" value={newBook.title} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Author</label>
                  <input type="text" name="author" value={newBook.author} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Genre</label>
                  <input type="text" name="genre" value={newBook.genre} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Book Cover</label>
                  <input type="file" name="image" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select name="language" value={newBook.language} onChange={handleInputChange} className="form-input form-select">
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Published Year</label>
                  <input type="number" name="published" value={newBook.published} onChange={handleInputChange} className="form-input" min="1900" max={new Date().getFullYear()} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" name="price" value={newBook.price} onChange={handleInputChange} className="form-input" min="0" step="0.01" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input type="number" name="stock" value={newBook.stock} onChange={handleInputChange} className="form-input" min="0" required />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-success">
                  Add Book
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- BOOK LIST --- */}
        <div className="card-body">
          <div className="books-grid">
            {books.map(book => (
              (editingBook && editingBook.Book_ID === book.Book_ID) ? (
                // --- RENDER EDIT FORM ---
                <form key={book.Book_ID} onSubmit={handleUpdateBook} className="book-card book-edit-form">
                  <div className="book-info">
                    {/* Note: names must match state keys (title, author, etc) */}
                    <div className="form-group-sm">
                      <label>Title</label>
                      <input type="text" name="title" value={editingBook.title} onChange={handleEditChange} className="form-input" />
                    </div>
                    <div className="form-group-sm">
                      <label>Author</label>
                      <input type="text" name="author" value={editingBook.author} onChange={handleEditChange} className="form-input" />
                    </div>
                    <div className="form-group-sm">
                      <label>Stock</label>
                      <input type="number" name="stock" value={editingBook.stock} onChange={handleEditChange} className="form-input" />
                    </div>
                    <div className="form-group-sm">
                      <label>Price</label>
                      <input type="number" name="price" step="0.01" value={editingBook.price} onChange={handleEditChange} className="form-input" />
                    </div>
                  </div>
                  <div className="book-actions">
                    <button type="submit" className="btn btn-sm btn-success">Save</button>
                    <button type="button" onClick={handleCancelEdit} className="btn btn-sm btn-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                // --- RENDER NORMAL BOOK CARD ---
                <div key={book.Book_ID} className="book-card">
                  <div className="book-cover aspect-[4/5] bg-gray-100">
                    <img
                      src={`${API_URL}${book.ImagePath}`}
                      alt={book.Title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-4xl">📚</div>'
                        }
                      }}
                    />
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.Title}</h3>
                    <p className="book-author">by {book.Author}</p>
                    <div className="book-price">₹{book.Price.toFixed(2)}</div>
                    <div className="book-stock">
                      Stock: {book.Stock} units
                    </div>
                    {/* --- ADD ONCLICK HANDLERS HERE --- */}
                    <div className="book-actions">
                      <button onClick={() => handleEditClick(book)} className="btn btn-sm btn-secondary">Edit</button>
                      <button onClick={() => handleDelete(book.Book_ID)} className="btn btn-sm btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
