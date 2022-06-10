import { sequelize, Match } from './database.mjs';

Match.destroy({
    where: {},
    truncate: true,
    cascade: true,
});

const r1 = Match.build({
    id: 1,
    user_1: 1,
    user_2: 2,
});
const r2 = Match.build({
    id: 2,
    user_1: 2,
    user_2: 1,
});
const r3 = Match.build({
    id: 3,
    user_1: 2,
    user_2: 3,
});
const r4 = Match.build({
    id: 4,
    user_1: 3,
    user_2: 4,
});
const r5 = Match.build({
    id: 5,
    user_1: 4,
    user_2: 1,
});
const r6 = Match.build({
    id: 6,
    user_1: 1,
    user_2: 4,
});


await r1.save();
await r2.save();
await r3.save();
await r4.save();
await r5.save();
await r6.save();
