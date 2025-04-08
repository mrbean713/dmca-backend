import express, { Request, Response } from 'express'
import cors from 'cors'
import { scanLeaks } from './scraper'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/scan-leaks', async (req: Request, res: Response) => {
  const { modelName } = req.body
  if (!modelName) return res.status(400).json({ error: 'Missing model name' })

  try {
    const results = await scanLeaks(modelName)
    res.json({ success: true, foundLinks: results })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: 'Scan failed' })
  }
})

app.listen(4000, () => console.log('✅ Scraper running on http://localhost:4000'))
