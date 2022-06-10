import amqplib from 'amqplib';
const amqpUrl = process.env.AMQP_URL || 'amqp://rabbitmq:5672';

import express from 'express';
const app = express();

import { sequelize, Match } from './database.mjs';

const port = 5000;
app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
});

const my_id = 1;

const get_user_1_ids = async (id) => {
    const map = await Match.findAll(
        {
            attributes: [
                'user_1'
            ],
            where: {
                user_2: id
            },
            raw: true
        }
    );
    return map.map(element => element['user_1']);
}

const get_user_2_ids = async (id) => {
    const map = await Match.findAll(
        {
            attributes: [
                'user_2'
            ],
            where: {
                user_1: id
            },
            raw: true
        }
    );
    return map.map(element => element['user_2']);
}

// prześlij zbiór matchy dla użytkownika z danym id
app.get('/match/:id', async (req, res) => {
    console.log(await Match.findAll({ raw: true }));

    const id = parseInt(req.params.id);
    console.log(id);
    let users_that_we_matched = await get_user_1_ids(id);
    let users_that_matched_us = await get_user_2_ids(id);

    console.log(users_that_we_matched, users_that_matched_us);

    const intersection = users_that_matched_us.filter(value => users_that_we_matched.includes(value));
    console.log(intersection);

    res.send(intersection);
})

// async function processMessage(msg) {
//     console.log(msg.content.toString(), 'Call email API here');
//     // set last message to msg.content
// }

// (async () => {
//     const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
//     const channel = await connection.createChannel();
//     channel.prefetch(10);
//     const queue = 'user.add_relation';
//     process.once('SIGINT', async () => {
//         console.log('got sigint, closing connection');
//         await channel.close();
//         await connection.close();
//         process.exit(0);
//     });

//     await channel.assertQueue(queue, { durable: true });
//     await channel.consume(queue, async (msg) => {
//         console.log('processing messages');
//         await processMessage(msg);
//         await channel.ack(msg);
//     },
//         {
//             noAck: false,
//             consumerTag: 'email_consumer'
//         });
//     console.log(" [*] Waiting for messages. To exit press CTRL+C");
// })();
