import express from 'express';
import async from 'async';
const app = express();

import { sequelize, Users } from './user-database.mjs';
import { forever } from 'async';

const port = 7070;
app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
});

// prześlij dane użytkownika o danym id
app.get('/user-info/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const info = async () => await Users.findByPk(id, { raw: true });
    if (await info() == null) {
        throw "Użytkownik o id: " + id + " nie istnieje.";
    }
    else {
        res.send(await info());
    }
})

// prześlij listę wszystkich id użytkowników w bazie
app.get('/get-users-ids', async (req, res) => {
    var ids = [];
    const getInfo = async () => await Users.findAll({ raw: true });
    const info = await getInfo();
    info.forEach(user => {
        ids.push(user.id);
    });
    res.send(ids);
})