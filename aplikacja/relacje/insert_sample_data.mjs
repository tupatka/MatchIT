import { sequelize, Match, Hate } from './database.mjs';

Match.destroy({
    where: {},
    truncate: true,
    cascade: true,
});

Hate.destroy({
    where: {},
    truncate: true,
    cascade: true,
});

const r1 = Match.build({
    user_1: 1,
    user_2: 2,
});
const r2 = Match.build({
    user_1: 2,
    user_2: 1,
});
const r3 = Match.build({
    user_1: 2,
    user_2: 3,
});
const r4 = Match.build({
    user_1: 3,
    user_2: 4,
});
const r5 = Match.build({
    user_1: 4,
    user_2: 1,
});
const r6 = Match.build({
    user_1: 1,
    user_2: 4,
});
const r7 = Match.build({
    user_1: 7,
    user_2: 1,
});


await r1.save();
await r2.save();
await r3.save();
await r4.save();
await r5.save();
await r6.save();
await r7.save();


const h1 = Hate.build({
    user_1: 1,
    user_2: 5,
});

const h2 = Hate.build({
    user_1: 3,
    user_2: 1,
});

const h3 = Hate.build({
    user_1: 2,
    user_2: 4,
});

const h4 = Hate.build({
    user_1: 4,
    user_2: 2,
});

await h1.save();
await h2.save();
await h3.save();
await h4.save();