var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , bcrypt = require('bcrypt');

var user = Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
    },
});

// Save a hash of the password rather than plain text
user.pre('save', function(next) {
    var user = this;

    // Don't rehash the password if it isn't new or hasn't changed
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // Store the hash rather than plain text
            user.password = hash;
            next()
        });

    });
});

// Provide a method of password verification
user.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.user = user;
module.exports.User = mongoose.model('User', user);
