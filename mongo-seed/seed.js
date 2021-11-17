const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://0.0.0.0:27018/users',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then(() => {
    console.log('MONGO CONNECTION OPEN');
}).catch((err) => {
    console.log(err);
})

const seedUsers = [
    {
        email: "john@doe.com",
        password: "secret1234"
    },
    {
        email: "doe@john.com",
        password: "1234secret"
    }
]

const seedUserDB = async () => {
    await User.deleteMany({});
    for (let i = 0; i < seedUsers.length; i++) {
        await User.create(seedUsers[i]);
    }
}

seedUserDB().then(() => {
    mongoose.connection.close();
    console.log('DATA SEEDED');
    console.log('MONGO CONNECTION CLOSED');
})