
const Koa = require("koa");
const CORS = require('@koa/cors');
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const routes = require('./routes');
const mongoose = require('mongoose');
const passport = require('koa-passport');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/my-pass');

const app = new Koa();
app.use(CORS());

app.use(BodyParser());
app.use(logger());


require('./passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(routes.routes()).use(routes.allowedMethods());

app.listen(3000, () => console.log('app started ...'));
