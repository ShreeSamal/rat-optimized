const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    device_id: String,
    token: String,
    parent_id: String,
    role: String,
});

module.exports = mongoose.model('User', UserSchema);