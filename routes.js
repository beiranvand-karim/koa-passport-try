const Router = require("koa-router");
const JWT = require('jsonwebtoken');
const passport = require('koa-passport');
const User = require('./user');

const router = new Router();


router.get("/", async function (ctx) {
    let name = ctx.request.body.name || "World";
    ctx.body = {message: `Hello ${name}!`}
});

router.post("/auth", async function (ctx, next){
    return passport.authenticate('local', (err, user) => {

        if (err || !user) {
            ctx.throw(401)
        }

        const token = user.generateToken();

        const response = user.toJSON();

        delete response.password;

        ctx.body = {
            token,
            user: response
        }
    })(ctx, next)
});


router.post("/register", async function (ctx, next) {
    const {username, password} = ctx.request.body;

    const user = await User.findOne({username});

    if (user) {
        return ctx.body = {
            error: 'user already in use'
        }
    }

    const newUser = new User({ username, password });
    await newUser.save();

    const token = newUser.generateToken();

    return ctx.body = {
        message: 'user registered.',
        token
    }

});


router.get("/test", async function (ctx, next){
    return passport.authenticate('local', (err, user) => {

        console.log(err);
        console.log(user);

        if (err || !user) {
            ctx.throw(401)
        }

        const token = user.generateToken();

        const response = user.toJSON();

        delete response.password;

        ctx.body = {
            token,
            user: response
        }
    })(ctx, next)
});

module.exports = router;
