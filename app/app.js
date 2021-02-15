const express= require('express');
const kosarkasi = require('./routes/node.js');

const app =express();
app.use('/api', kosarkasi);
app.get('/', (req, res) => {
    res.send("Zdravo!");
});

app.listen(5000);

