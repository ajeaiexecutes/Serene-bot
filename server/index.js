import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import { router } from './routes/chat.js'
import { router as authRouter } from './routes/auth.js'
import { configDotenv } from 'dotenv'

configDotenv()
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
connectDB()

app.use('/api/chat', router)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => res.send('Wellness app server running..'))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`server running on port ${PORT}`))