import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const websocketHnadler = (wss) => {
    wss.on('connection', (connection, req) => {

        const notifyAboutOnlinePeople = () => {
            [...wss.clients].forEach(client => {
                client.send(JSON.stringify({
                    online: [...wss.clients].map(user => ({ userId: user.userId, username: user.username }))
                }
                ))
            })
        }

        connection.isAlive = true;

        connection.timer = setInterval(() => {
            connection.ping();
            connection.deathTimer = setTimeout(() => {
                connection.isAlive = false;
                clearInterval(connection.timer);
                connection.terminate();
                notifyAboutOnlinePeople();
                console.log('dead')
            }, 1000)
        }, 5000);

        connection.on('pong', () => {
            clearTimeout(connection.deathTimer);
        })

        const cookies = req.headers.cookie;
        if (cookies) {
            const tokenCookieString = cookies.split(';').find(str => str.startsWith('jwt'));
            if (tokenCookieString) {
                const token = tokenCookieString.split('=')[1];
                if (token) {
                    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
                        if (err) throw err;

                        connection.userId = decode.id
                        connection.username = decode.username
                    })
                }
            }
        }

        notifyAboutOnlinePeople()

        connection.on('message', async message => {
            const messageData = JSON.parse(message.toString());
            const { recipient, text, file } = messageData;
            let fileName = null;

            if (file) {
                const parts = file.name.split('.');
                const ext = parts[parts.length - 1];
                fileName = Date.now() + '.' + ext
                const pathName = __dirname + '/uploads/' + fileName;
                const bufferData = new Buffer.from(file.data.split(',')[1], 'base64');
                fs.writeFile(pathName, bufferData, () => {
                    console.log('file saved:' + pathName);
                })
            }

            if (recipient && (text || file)) {
                const messageDoc = await Message.create({
                    text,
                    recipient,
                    sender: connection.userId,
                    file: file ? fileName : null
                });

                [...wss.clients].filter(client => client.userId === recipient)
                    .forEach(user => {
                        user.send(JSON.stringify({ text, sender: connection.userId, id: messageDoc._id, file: file ? fileName : null }));
                    })
            }
        })
    })
}