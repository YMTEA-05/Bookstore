import { useEffect, useState } from 'react'
import { fetchBooks, type Book } from '@/api/books'
import BookCard from '@/components/BookCard'

export default function Books() {
  const [books, setBooks] = useState<Book[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')

  useEffect(() => {
  fetchBooks()
    .then(fetched => {
      console.log('Fetched books:', fetched)
      setBooks(fetched)
    })
    .catch(e => setError(String(e)))
}, [])

  useEffect(() => {
    fetchBooks().then(setBooks).catch(e => setError(String(e)))
  }, [])

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-500 text-lg mb-4">Failed to load books</div>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (!books) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading books...</div>
      </div>
    )
  }

  const genres = Array.from(new Set(books.map(book => book.Genre).filter(Boolean)))
  
  const filteredBooks = books.filter(book => {
  const title = book.Title?.toLowerCase() ?? ''
  const author = book.Author?.toLowerCase() ?? ''
  const genre = book.Genre?.toLowerCase() ?? ''
  const search = searchTerm.toLowerCase().trim()
  const selected = selectedGenre.toLowerCase().trim()

  const matchesSearch = title.includes(search) || author.includes(search)
  const matchesGenre = !selected || genre === selected

  return matchesSearch && matchesGenre
})



  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Book Collection</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover your next favorite book from our carefully curated selection
        </p>
      </div>

      {/* Search and Filter */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Search Books</label>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Filter by Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="form-input form-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <BookCard key={book.Book_ID} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

