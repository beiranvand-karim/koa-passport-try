
const passport = require('koa-passport');
const { Strategy } = require('passport-local');
const User = require('./user');


passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (err) {
        done(err)
    }
});


passport.use('local', new Strategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) { return done(null, false) }

        try {
            const isMatch = await user.isValidPassword(password);

            if (!isMatch) { return done(null, false) }

            done(null, user)
        } catch (err) {
            done(err)
        }
    } catch (err) {
        return done(err)
    }
}));
