const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {select: false, type: String, required: true},
  salt: {select: false, type: String},
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'OWNER'],
    required: true,
    default: 'USER',
  },
  tokens: [{
    token: String,
    ip: String,
    createdAt: Date,
  }],
}, {timestamps: true});

/**
 * Custom validations
 */
userSchema.path('email').validate(function(value, done) {
  mongoose.model('User')
    .count({email: value, _id: {$ne: this._id}})
    .then((count) => {
      done(!count);
    }).catch(done);
}, 'Email already exists');

/**
 * Hook a pre save method to hash the password
 * @param {function} callback
 */
userSchema.pre('save', function(next) {
  // Invalidate all tokens if password has been changed
  if (this.isModified('password')
    || this.isModified('email')
    || this.isModified('role')) {
    this.tokens = [];
  }

  // Encrypt and save the password
	if (this.password
    && this.password.length > 6
    && this.isModified('password')) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

// Virtuals
userSchema.virtual('isAdmin').get(function() {
  return ['ADMIN', 'OWNER'].indexOf(this.role) >= 0;
});

/**
 * Create instance method for hashing a password
 * @param {String} password user decoded password
 * @return {String} hashed password
 */
userSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto
      .pbkdf2Sync(password, this.salt, 10000, 64, 'sha256')
      .toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 * @param {String} password user decoded password
 * @return {boolean} true if passwords match
 */
userSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

/**
 * Check if a token is stored in the user tokens array
 * @param {String} token to check if it's right.
 * @return {boolean} true if it's right.
 */
userSchema.methods.hasToken = function(token) {
  return this.tokens.some((e) => e.token === token && !e.expired);
};

module.exports = mongoose.model('User', userSchema);
