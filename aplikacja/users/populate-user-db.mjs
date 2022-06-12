import { sequelize, Users } from './user-database.mjs';

Users.destroy({
    where: {},
    truncate: true,
    cascade: true,
});


const u1 = Users.build({
    id: 1,
    name: "Mirek",
    age: 24,
    desc: "Szukam miłości na całe życie ",
});
const u2 = Users.build({
    id: 2,
    name: "Lucyna",
    age: 28,
    desc: "Kocham róże i podróże",
});
const u3 = Users.build({
    id: 3,
    name: "Krzysztof",
    age: 33,
    desc: "Czy zjesz ze mną kremówkę?",
});
const u4 = Users.build({
    id: 4,
    name: "Antoni",
    age: 22,
    desc: "Raz na wozie raz pod wozem ",
});
const u5 = Users.build({
    id: 5,
    name: "Beatrycze",
    age: 26,
    desc: "Z pustego i Solomon nie naleje",
});
const u6 = Users.build({
    id: 6,
    name: "Nel",
    age: 21,
    desc: "Elo mordeczki",
});
const u7 = Users.build({
    id: 7,
    name: "Jimmy Coder",
    age: "22",
    desc: "Let me fix bugs in your heart ;)"
})

await u1.save();
await u2.save();
await u3.save();
await u4.save();
await u5.save();
await u6.save();
await u7.save();