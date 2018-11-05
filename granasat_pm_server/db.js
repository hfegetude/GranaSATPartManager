var crypto = require('crypto')

var db = require('./dbConnect')

db.on('error', function(err) {
    logger.error("DATABASE ERROR: " + error)
});


var dbManager = function () {};

dbManager.prototype.createSalt = function() {
    var len = 30;
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64') // convert to base64 format
        .slice(0, len) // return required number of characters
        .replace(/\+/g, '0') // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

dbManager.prototype.hashPassword = function(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password || "");
    hash.update(salt || "");
    return hash.digest('hex');
}



/****************************************************************/
/*                     PASSPORT AND AUTH                        */
/****************************************************************/

dbManager.prototype.checkPassportPassword = function(username, password, done) {
    db.query('SELECT salt FROM users WHERE username = ?', [username], (error, results, fields) => {
        if (error) logger.error(error);
        if (!results.length) return done(null, false);
        var hash = this.hashPassword(password, results[0].salt);
        db.query('SELECT username, id FROM users WHERE username = ? AND password = ? AND enabled = 1', [username, hash], (error, results, fields) => {
            if (error) logger.error(error);
            if (!results.length) return done(null, false);
            return done(null, results[0]);
        });
    });
}

dbManager.prototype.saveLoginLogout = function(req, login) {
    return new Promise((resolve, reject) => {
        db.query("UPDATE users SET last_login=CURRENT_TIMESTAMP() WHERE id=?", [req.user.id], function(error, results, fields) {
            if (error) logger.error(error);
            return resolve(error)
        });
    })
}

dbManager.prototype.getPassportUser = function(id, done) {
    db.query('SELECT users.id,username,user_group,firstname,lastname,phone,email,installer,company,enabled FROM users WHERE users.id = ?', [id], function(error, results, fields) {
        if (error) logger.error(error);
        if (!results.length) return done(null, false);
        return done(null, results[0]);
    });
}


module.exports = new dbManager();


