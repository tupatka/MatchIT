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

// Trzeba się zastanowić skąd relacje mają mieć tablicę z wszystkimi id, na razie jest tam zhardcodowana.
// Napiszę to^^ jako funkcję udostępnianą przez users.mjs, ale dopiero w następnym commicie, bo czas spanko już


const getUsersDetails = async (users) => {
    var usersDetails = [];
    for(const id of users){
        await fetch(`http://users:7070/user-info/${id}`).
        then(res => res.json()).
        then(data => usersDetails.push(data));
    }
    return usersDetails;
}

app.get('/', async (req, res) => {

    await fetch(`http://relacje:5000/no-interaction/${myId}`).
        then(res => res.json()).
        then(data => getUsersDetails(data)).
        then(data => res.render('main', {usersInfo: data})).
        catch(err => {
            console.log(err);
            res.send("Brak użytkowników do wyświetlenia.");
        });
})

app.get('/match', async (req, res) => {
    await fetch(`http://relacje:5000/match/${myId}`).
        then(res => res.json()).
        then (data => getUsersDetails(data)).
        then(data => res.render('match', {usersInfo: data})).
        catch(err => {
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
