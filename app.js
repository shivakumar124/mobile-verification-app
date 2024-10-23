const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();
connectDB();

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.get('/',(req, res)=>{
    res.send("Welcome to Mobile Verification APP!!!")
    
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;