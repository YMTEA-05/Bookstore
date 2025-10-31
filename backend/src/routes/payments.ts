import { Router } from 'express'
import { pool } from '../config/db'
import { z } from 'zod'

const router = Router()

router.get('/:orderId', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Payments WHERE OID = ?', [req.params.orderId])
  const [payment] = rows as any[]
  if (!payment) return res.status(404).json({ error: 'Not found' })
  res.json(payment)
})

const createPaymentSchema = z.object({
  OID: z.number(),
  Amount: z.number().nonnegative(),
  Method: z.string().min(1),
  Status: z.string().optional().default('Completed'),
})

router.post('/', async (req, res) => {
  const parse = createPaymentSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })
  const { OID, Amount, Method, Status } = parse.data
  try {
    const [result] = await pool.query(
      'INSERT INTO Payments (OID, Amount, Method, Status) VALUES (?, ?, ?, ?)',
      [OID, Amount, Method, Status]
    )
    await pool.query('UPDATE Orders SET Status = ? WHERE Order_ID = ?', [Status === 'Completed' ? 'Paid' : 'Pending', OID])
    // @ts-ignore
    res.status(201).json({ Payment_ID: result.insertId })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

export default router

