const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const teamRouter = require('./routes/teamRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/teams', teamRouter);
app.use('/users', userRouter);

app.use(globalErrorHandler);

module.exports = app;
