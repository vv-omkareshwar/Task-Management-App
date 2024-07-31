require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')

connectToMongo();
const app = express()
const port = 5000
// const hostname = '192.168.1.4'

app.use(cors());
app.use(express.json())


// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/task', require('./routes/task'))

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


// app.listen(port,hostname, () => {
//   // console.log(`Example app listening at http://${hostname}:${port}`);
//   console.log(`Server running at http://0.0.0.0:${port}/`);
// })

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
})