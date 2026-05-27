import express from 'express'
import { Session } from '../models/Session.js'
import { Message } from '../models/Message.js'
import { getAIResponseStream } from '../services/aiService.js'
import { requireAuth } from '../middleware/auth.js'

export const router = express.Router()

router.post('/', requireAuth, async (req, res) => {
    try {
        const { message, sessionId, userId } = req.body
        let currentSessionId = sessionId

        if (!currentSessionId) {
            const session = new Session({ title: message.substring(0, 30) || 'New Conversation', userId })
            await session.save()
            currentSessionId = session._id.toString()
        }

        const userMessage = new Message({
            sessionId: currentSessionId,
            role: 'user',
            content: message
        })
        await userMessage.save()

        const latest10 = await Message.find({ sessionId: currentSessionId })
            .sort({ timestamp: -1 })
            .limit(10)

        // Sort ascending for the API call
        const messagesToSend = latest10.reverse()

        // Set up Server-Sent Events headers
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        // Send session ID first
        res.write(`data: ${JSON.stringify({ type: 'session', sessionId: currentSessionId })}\n\n`)

        const stream = await getAIResponseStream(messagesToSend)
        let fullReply = ''

        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
                fullReply += text
                res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`)
                // Add a small artificial delay to slow down Groq's extremely fast generation
                // to make it feel more like human typing or ChatGPT
                await new Promise(resolve => setTimeout(resolve, 80))
            }
        }

        const assistantMessage = new Message({
            sessionId: currentSessionId,
            role: 'assistant',
            content: fullReply
        })
        await assistantMessage.save()

        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        res.end()
    } catch (error) {
        console.error('Error in chat route:', error)
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' })
        } else {
            res.end()
        }
    }
})

router.get('/history/:sessionId', requireAuth, async (req, res) => {
    try {
        const { sessionId } = req.params
        const messages = await Message.find({ sessionId }).sort({ timestamp: 1 })
        res.json(messages)
    } catch (error) {
        console.error('Error getting history:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/sessions/:userId', requireAuth, async (req, res) => {
    try {
        const { userId } = req.params
        const sessions = await Session.find({ userId }).sort({ updatedAt: -1 })
        res.json(sessions)
    } catch (error) {
        console.error('Error getting sessions:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})
