export type Book = {
  Book_ID: number
  Title: string
  Author: string
  Genre: string
  Published: number
  Price: number  // <-- change this to number
  Stock: number
  Language: string
  Average_Rating: number // <-- ADD THIS
  Rating_Count: number
}


// In mock.ts

const mockBooks: Book[] = [
  { 
    Book_ID: 1, 
    Title: 'Clean Code', 
    Author: 'Robert C. Martin', 
    Genre: 'Programming', 
    Published: 2008, 
    Price: 29.99, 
    Stock: 12, 
    Language: 'English',
    ImagePath: '/uploads/default.jpg', // You'd also need ImagePath
    Average_Rating: 4.7,               // <-- Add this
    Rating_Count: 120                  // <-- Add this
  },
  // ... etc
]

export const mockApi = {
  async listBooks() {
    await new Promise(r => setTimeout(r, 200))
    return mockBooks
  },
  async getBook(id: number) {
    await new Promise(r => setTimeout(r, 200))
    return mockBooks.find(b => b.Book_ID === id) ?? null
  },
}

export default mockApi

