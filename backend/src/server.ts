import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import booksRouter from './routes/books'
import ordersRouter from './routes/orders'
import reviewsRouter from './routes/reviews'
import paymentsRouter from './routes/payments'
import authRouter from './routes/auth.routes'
import cartRouter from './routes/cart.routes'
import path from 'path'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/auth', authRouter)
app.use('/books', booksRouter)
app.use('/orders', ordersRouter)
app.use('/reviews', reviewsRouter)
app.use('/payments', paymentsRouter)
app.use('/cart', cartRouter)

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})