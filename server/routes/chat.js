import express from 'express'
import { Session } from '../models/Session.js'
import { Message } from '../models/Message.js'
import { getAIResponse } from '../services/aiService.js'

export const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { message, sessionId } = req.body
        let currentSessionId = sessionId

        if (!currentSessionId) {
            const session = new Session({ title: 'New Conversation' })
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

        const reply = await getAIResponse(messagesToSend)

        const assistantMessage = new Message({
            sessionId: currentSessionId,
            role: 'assistant',
            content: reply
        })
        await assistantMessage.save()

        res.json({ reply, sessionId: currentSessionId })
    } catch (error) {
        console.error('Error in chat route:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params
        const messages = await Message.find({ sessionId }).sort({ timestamp: 1 })
        res.json(messages)
    } catch (error) {
        console.error('Error getting history:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})
