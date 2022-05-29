const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://rabbitmq:5672';


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
