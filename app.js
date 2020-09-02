const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/users', userRouter);

app.use(globalErrorHandler);

module.exports = app;
