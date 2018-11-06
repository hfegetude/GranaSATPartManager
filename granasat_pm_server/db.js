var crypto = require('crypto')
var logger = require('./logger.js')


var db = require('./dbConnect')

db.on('error', function (err) {
    logger.error("DATABASE ERROR: " + error)
});


var dbManager = function () {};

dbManager.prototype.createSalt = function () {
    var len = 30;
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64') // convert to base64 format
        .slice(0, len) // return required number of characters
        .replace(/\+/g, '0') // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

dbManager.prototype.hashPassword = function (password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password || "");
    hash.update(salt || "");
    return hash.digest('hex');
}



/****************************************************************/
/*                     PASSPORT AND AUTH                        */
/****************************************************************/

dbManager.prototype.checkPassportPassword = function (req, username, password, done) {
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

dbManager.prototype.saveLoginLogout = function (req, login) {
    return new Promise((resolve, reject) => {
        db.query("UPDATE users SET last_login=CURRENT_TIMESTAMP() WHERE id=?", [req.user.id], function (error, results, fields) {
            if (error) logger.error(error);
            return resolve(error)
        });
    })
}

dbManager.prototype.getPassportUser = function (id, done) {
    db.query('SELECT id,username,user_group,firstname,lastname,email,last_login FROM users WHERE users.id = ?', [id], function (error, results, fields) {
        if (error) logger.error(error);
        if (!results.length) return done(null, false);
        return done(null, results[0]);
    });
}



/****************************************************************/
/*                      COMMON API USERS                        */
/****************************************************************/

dbManager.prototype.postUsers = function (user, data, companyManager) {
    return new Promise((resolve, reject) => {

        if (user.user_group == 1) {
            var salt = this.createSalt();
            var hash = this.hashPassword(data.password, salt);
            db.query("INSERT INTO users (username,password,salt,user_group,firstname,lastname,email,created_by) VALUES (?,?,?,?,?,?,?,?)",
                [data.username, hash, salt, 2, data.firstname, data.lastname, data.email, user.id],
                function (error, results, fields) {
                    if (error) {
                        logger.error(error)
                        return reject("Creation error: probably username in use.")
                    } else {
                        return resolve(results.insertId)
                    }
                })
        } else {
            return reject("Not authorized")
        }
    })
}

module.exports = new dbManager();