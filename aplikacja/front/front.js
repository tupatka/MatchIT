const express = require('express');
const app = express();
const fetch = require('node-fetch');
const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://rabbitmq:5672';

const port = 8080;
app.use(express.static('public'));
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', './views');
const myId = 1;

app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
});

// Trzeba podobnie jak tu utworzyć bazę z modelem users, wrzucić tam przykładowe dane,
// przesyłać po stronie users przez http do frontu, odbierać po stronie frontu,
// zmienic puga żeby je wyświetlał na stronie głównej
// zapakować do osobnego kontenera



// Front pobiera z relacji użytkowników z którymi nie mamy interakcji.
// Są to same id, front powinien pobrać z users dane tych użytkowników i je udekorować.
// Trzeba się zastanowić skąd relacje mają mieć tablicę z wszystkimi id, na razie jest tam zhardcodowana.

app.get('/', async (req, res) => {
    await fetch(`http://relacje:5000/no-interaction/${myId}`).
        then(res => res.json()).
        then(data => {
            console.log(data);
            res.render('main', { user_ids: data });
        }).catch(err => {
            console.log(err);
            res.send('Brak użytkowników do wyświetlenia...')
        });
})

// Też ma pobrac z users i dopisac do id dane uzytkownikow
app.get('/match', async (req, res) => {
    await fetch(`http://relacje:5000/match/${myId}`).
        then(res => res.json()).
        then(data => {
            res.render('match', { matches: data });
        }).catch(err => {
            console.log(err);
            res.send('Niestety nie udało się znaleźć matchy...')
        });
})

app.get('/send_to_queue/:id', async (req, res) => {
    const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
    const channel = await connection.createChannel();
    const other_user_id = req.params.id;
    try {
        console.log('Publishing');
        const exchange = 'user.relations';
        const queue = 'user.add_relation';
        const routingKey = 'add_relation';

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        const msg = { 'id': myId, other_user: other_user_id, type: 'match' };

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
