const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://rabbitmq:5672';

const express = require('express');
const app = express();

const port = 5000;
app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
});

const relacje_match = [
    {
        id: 1,
        user_1: 1,
        user_2: 2,
    },
    {
        id: 2,
        user_1: 2,
        user_2: 1,
    },
    {
        id: 3,
        user_1: 2,
        user_2: 3,
    },
    {
        id: 4,
        user_1: 3,
        user_2: 4,
    },
    {
        id: 5,
        user_1: 4,
        user_2: 1
    },
    {
        id: 6,
        user_1: 1,
        user_2: 4,
    },
]

app.get('/match/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    let users_that_we_matched = new Set();
    let users_that_matched_us = new Set();

    relacje_match.forEach(relacja => {
        if (relacja.user_1 === id) {
            users_that_we_matched.add(relacja.user_2);
        } else if (relacja.user_2 === id) {
            users_that_matched_us.add(relacja.user_1);
        }
    });

    console.log(users_that_we_matched, users_that_matched_us);

    let intersection = new Set([...users_that_we_matched].filter(x => users_that_matched_us.has(x)));
    let matches_list = Array.from(intersection);

    res.send(matches_list);
})

async function processMessage(msg) {
    console.log(msg.content.toString(), 'Call email API here');
    // set last message to msg.content
}

(async () => {
    const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
    const channel = await connection.createChannel();
    channel.prefetch(10);
    const queue = 'user.add_relation';
    process.once('SIGINT', async () => {
        console.log('got sigint, closing connection');
        await channel.close();
        await connection.close();
        process.exit(0);
    });

    await channel.assertQueue(queue, { durable: true });
    await channel.consume(queue, async (msg) => {
        console.log('processing messages');
        await processMessage(msg);
        await channel.ack(msg);
    },
        {
            noAck: false,
            consumerTag: 'email_consumer'
        });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();
