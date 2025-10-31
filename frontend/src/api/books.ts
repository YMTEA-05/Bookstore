import api, { BASE_URL } from './client'
import mockApi, { type Book } from './mock'

export type { Book }

const useMock = false

export async function fetchBooks(): Promise<Book[]> {
  if (useMock) return mockApi.listBooks()

  try {
    const books = await api.get<Book[]>('/books')

    // Ensure Price is a number
    return books.map((book) => ({
      ...book,
      Price: Number(book.Price ?? 0),
    }))
  } catch (error) {
    console.error('Error fetching books:', error)
    return [] // fallback empty array
  }
}


export async function fetchBookById(id: number): Promise<Book | null> {
  if (useMock) return mockApi.getBook(id)

  try {
    const book = await api.get<Book>(`/books/${id}`)
    return book ? { ...book, Price: Number(book.Price ?? 0) } : null
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error)
    return null
  }
}

export async function updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
  if (useMock) { /* ... */ } // Not implementing mock for this
  
  // We send all fields, so backend must be set up to receive them
  return api.put<Book>(`/books/${id}`, bookData)
}

// --- ADD THIS FUNCTION ---
export async function deleteBook(id: number): Promise<void> {
  if (useMock) { /* ... */ } // Not implementing mock for this

  await api.delete<void>(`/books/${id}`)
}