import express, { Request, Response } from 'express'
import cors from 'cors'
/** @type {{ scanLeaks: (modelName: string) => Promise<any[]> }} */
const { scanLeaks } = require('../dist/scraper')

const app = express()

// Allow cross-origin requests from frontend
app.use(cors({
  origin: 'https://dmca-dashboard.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}))

// Handle preflight
app.options('*', cors())

app.use(express.json())

app.post('/scan-leaks', async (req: Request, res: Response) => {
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
})


console.log(app._router.stack.map((r: any) => r.route?.path).filter(Boolean))
app.listen(4000, () => console.log('✅ Scraper running on http://localhost:4000'))
