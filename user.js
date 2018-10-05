const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
    type: { type: String, default: 'User' },
    name: { type: String },
    username: { type: String, required: false, unique: true },
    password: { type: String, required: false }
});

userSchema.pre('save', async function(next) {

    try {
        const salt = await bCrypt.genSalt(10);
        this.password = await bCrypt.hash(this.password, salt);
        next()
    } catch (e) {
        next(e)
    }

});

userSchema.methods.isValidPassword = async function (newPassWord) {

    try {
        return await bCrypt.compare(newPassWord, this.password)
    } catch (e) {
        throw new Error(e)
    }
};

userSchema.methods.generateToken = function () {
    return jwt.sign({
        iss: 'codeworkr',
        sub: this.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, 'secret')
};



const User = mongoose.model('user', userSchema);

module.exports = User;
