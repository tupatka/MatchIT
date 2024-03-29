import fetch from 'node-fetch';

import amqplib from 'amqplib';
const amqpUrl = process.env.AMQP_URL || 'amqp://rabbitmq:5672';

import express from 'express';
const app = express();

import { sequelize, Match, Hate } from './database.mjs';

const port = 5000;
app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
});

const my_id = 1;
const all_users = await fetch(`http://users:7070/get-users-ids`).
    then(data => data.json());

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

const who_is_hated_by_user = async (id) => {
    const map = await Hate.findAll(
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

// przeslij zbiór użytkowników z którym użytkownik id nie miał interakcji
app.get('/no-interaction/:id', async (req, res) => {
    //  console.log(await Hate.findAll({ raw: true }));

    const id = parseInt(req.params.id);
    // console.log(id);
    let users_that_we_matched = await get_user_2_ids(id);
    let users_that_we_hate = await who_is_hated_by_user(id);

    //  console.log(users_that_we_matched, users_that_we_hate);

    let users_with_no_iteraction = all_users.filter(value => !users_that_we_matched.includes(value));
    users_with_no_iteraction = users_with_no_iteraction.filter(value => !users_that_we_hate.includes(value));
    // I want to remove myself from interaction
    const index_of_myself = all_users.indexOf(id);
    if (index_of_myself > -1) {
        users_with_no_iteraction.splice(index_of_myself, 1); // 2nd parameter means remove one item only
    }
    //  console.log(users_with_no_iteraction);

    res.send(users_with_no_iteraction);
})

async function processMessage(msg) {
    console.log(JSON.parse(msg.content.toString()), 'Call email API here');
    const message = JSON.parse(msg.content.toString());
    // console.log(message, 'Call email API here');
    console.log(message.type);
    console.log(message.other_user);
    if (message.type == 'match') {
        const m = Match.build({
            user_1: message.id,
            user_2: message.other_user,
        });
        await m.save();
    } else {
        const h = Hate.build({
            user_1: message.id,
            user_2: message.other_user,
        });
        await h.save();
    }
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
    let consumerTag = await channel.consume(queue, async (msg) => {
        await processMessage(msg);
        await channel.ack(msg);
    },
        {
            noAck: false,
            consumerTag: 'email_consumer'
        });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();
