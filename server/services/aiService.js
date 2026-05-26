import { OpenAI } from 'openai';
import { configDotenv } from 'dotenv';
configDotenv();

const openai = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are Serene, a compassionate AI mental wellness companion.
Your purpose is to support emotional well-being through empathetic listening.
Always listen first. Reflect what the user said before responding.
Validate emotions before offering any perspective or reframe.
Ask only one thoughtful question at a time — never overwhelm.
Draw gently from CBT, ACT, and person-centered therapy principles.
Use warm, calm, human language. Short paragraphs. Never clinical or robotic.
Never diagnose. Never prescribe medication or treatments.
Never pretend to be a licensed therapist.
If a user expresses suicidal thoughts or any crisis, respond with warmth,
provide this resource immediately: iCall India: 9152987821 (icallhelpline.org),
then stay present — do not abandon the conversation.
Tone: warm, unhurried, present, gentle. Like a wise, caring friend.`;

export async function getAIResponse(messages) {
    const formattedMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: formattedMessages
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
}
