import express, { Request, Response } from 'express'
import cors from 'cors'
const { scanLeaks } = require('../dist/scraper')

const app = express()
app.use(cors({
    origin: 'https://dmca-dashboard.vercel.app', // ✅ your frontend Vercel domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }))
app.use(express.json())


app.post('/scan-leaks', async (req: Request, res: Response) => {
    console.log("🔥 Received scan request", req.body) // <- log it
  
    const { modelName } = req.body
    if (!modelName) return res.status(400).json({ error: 'Missing model name' })
  
    try {
      const results = await scanLeaks(modelName)
      res.json({ success: true, foundLinks: results })
    } catch (err) {
        console.error("❌ Scan failed:", err)
        res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' })
    }
  })

app.listen(4000, () => console.log('✅ Scraper running on http://localhost:4000'))
