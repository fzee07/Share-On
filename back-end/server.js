const express = require('express')
const app = express()
const connectDB = require('./config/db');
connectDB();



//Routes
app.use('/api/files', require('./routes/files'));


// x1JKAiKwIBqyqPTY ---->>> PWD for DB
const PORT = process.env.PORT || 3000;
//starting listening server
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})