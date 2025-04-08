import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'

const app = express()

app.use('/screenshots', express.static(path.join(__dirname, '../public/screenshots')))

app.use(cors({
  origin: 'https://dmca-dashboard.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}))

app.use(express.json())

app.post('/scan-leaks', async function (req: Request, res: Response): Promise<void> {
    console.log("🔥 Received scan request", req.body)
  
    const { modelName } = req.body
    if (!modelName) {
      res.status(400).json({ error: 'Missing model name' })
      return
    }
  
    const fakeResults = [
      {
        domain: 'fapello.com',
        images: [
          '/screenshots/sophie-rain-diskussion-sophie-rain-3.png',
          '/screenshots/sophie-rain-sophie-rain-59.png',
          '/screenshots/sophie-rain-sophie-rain-x.png',
          '/screenshots/sophie-rain-sophie-rainn.png'
        ]
      }
    ]
  
    res.json({ success: true, foundLinks: fakeResults })
  })

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`✅ Scraper running on http://localhost:${PORT}`))
