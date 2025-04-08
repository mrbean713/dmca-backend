import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
const { scanLeaks } = require('../dist/scraper')



const app = express()

// add this before any route:
app.use('/screenshots', express.static(path.join(__dirname, '../public/screenshots')))

app.use(cors({
  origin: 'https://dmca-dashboard.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}))

app.use(express.json())

app.post('/scan-leaks', (req: Request, res: Response): void => {
    (async () => {
      console.log("🔥 Received scan request", req.body)
  
      const { modelName } = req.body
      if (!modelName) return res.status(400).json({ error: 'Missing model name' })
  
      try {
        const results = await scanLeaks(modelName)
        res.json({ success: true, foundLinks: results })
      } catch (err) {
        console.error("❌ Scan failed:", err)
        res.status(500).json({
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    })()
  })
  

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`✅ Scraper running on http://localhost:${PORT}`))
