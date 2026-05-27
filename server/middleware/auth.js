import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'

configDotenv()
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev'

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId // Attach userId to the request payload
        next()
    } catch (error) {
        console.error('JWT verification error:', error)
        return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }
}
