const express = require('express');
const app = express();
const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

const port = 8080;
app.use(express.static('public'));
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', './views');

app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.render('main');
    /*
        tu powinna być:
        - strona z profilami użytkowników, dla każdego możliwość kliknięcia swipe left/swipe right
            (dodający event do kolejki, na razie jest przycisk który wysła event do kolejki)
        - przycisk z przejściem na stronę z matchami
            (na razie jest sobie link)
    */
})

app.get('/match', (req, res) => {
    res.send('match');
})

app.get('/send_to_queue', async (req, res) => {
    const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
    const channel = await connection.createChannel();
    try {
        console.log('Publishing');
        const exchange = 'user.relations';
        const queue = 'user.add_relation';
        const routingKey = 'add_relation';

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        const msg = { 'id': Math.floor(Math.random() * 1000), 'email': 'user@domail.com', name: 'firstname lastname' };
        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
        console.log('Message published');
    } catch (e) {
        console.error('Error in publishing message', e);
    } finally {
        console.info('Closing channel and connection if available');
        await channel.close();
        await connection.close();
        console.info('Channel and connection closed');
    }
    // process.exit(0);

    res.send('ok, wiadomosc wysłana');
});