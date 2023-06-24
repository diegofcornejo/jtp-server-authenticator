
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
const client = createClient({ url: process.env.REDIS_URL });
client.on('error', err => console.log('Redis Client Error', err));

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        try {
            await client.connect();
            const storedPassword = await client.hGet(`user:${username}`, 'password');
            if (storedPassword && password === storedPassword) {
                console.log(process.env.JWT_SECRET)
                const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '24h', issuer: 'jtp-server-authenticator' });
                await client.hSet(`user:${username}`, 'token', token);
                await client.quit();
                res.status(200).json({ token });
            } else {
                await client.quit();
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            console.log('ERROR', error)
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default handler;