const crypto = require('crypto')
const logger = require('./logger.js')
const fs = require('fs');
const axios = require('axios');

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

dbManager.prototype.postUsers = function (user, data) {
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

/****************************************************************/
/*                      COMMON API PARTS                        */
/****************************************************************/

dbManager.prototype.getPart = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM parts WHERE name LIKE ? ",
            ["%"+data.name+"%"],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Part search error.")
                } else {
                    return resolve(results)
                }
            }) 
    })
}

dbManager.prototype.postPart = function (user, data) {
    return new Promise((resolve, reject) => {
        var t = this

        if(data.name == null || (data.name && data.name.length == 0)){
            data.name = null
            return reject("Creation error: probably name must be filled.")
        }

        db.query("INSERT INTO parts (name,description,manufacturer,creator) VALUES (?,?,?,?)",
            [data.name, data.description, data.manufacturer,user.id],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Creation error: probably name in use.")
                } else {
                    data.id = results.insertId

                    if (data.datasheet) {
                        axios.get(data.datasheet).then(response => {
                            t.postPartFiles(user,data.id,response,null)
                        })
                    }

                    return resolve(data)
                }
            }) 
    })
}

dbManager.prototype.postPartFiles = function (user, id, datasheet, altium) {
    return new Promise((resolve, reject) => {
        // TODO: accept only some extensions
        if (datasheet) {
            var datasheetname = id + ".pdf"
            fs.writeFile('datasheets/' + datasheetname, datasheet.data, (err) => {  
                 if (err){
                     logger.error("Datasheet not saved")
                } else {
                    db.query('UPDATE parts SET datasheet=? WHERE id=?', [datasheetname,id], function(error, results, fields) {
                        if (error) logger.error(error);
                    })
                }

            });
        }

        if (altium) {
            var altiumname = id + "_" +altium.name
            fs.writeFile('altiumfiles/' + altiumname, altium.data, (err) => {  
                 if (err){
                     logger.error("Altium Files not saved")
                } else {
                    db.query('UPDATE parts SET altiumfiles=? WHERE id=?', [altiumname,id], function(error, results, fields) {
                        if (error) logger.error(error);
                    })
                }

            });
        }

        resolve()
    })
}

/****************************************************************/
/*                      COMMON API VENDORS                      */
/****************************************************************/

dbManager.prototype.getVendor = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM vendors WHERE name LIKE ? ",
            ["%"+data.name+"%"],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Vendor search error.")
                } else {
                    return resolve(results)
                }
            }) 
    })
}

dbManager.prototype.postVendor = function (user, data) {
    return new Promise((resolve, reject) => {
        if(data.name == null || (data.name && data.name.length == 0)){
            data.name = null
            return reject("Creation error: probably name must be filled.")
        }
        db.query("INSERT INTO vendors (name,url) VALUES (?,?)",
            [data.name, data.url],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Creation error: probably name in use.")
                } else {
                    data.id = results.insertId
                    return resolve(data)
                }
            }) 
    })
}

/****************************************************************/
/*                      COMMON API STOR.PLACES                  */
/****************************************************************/

dbManager.prototype.getStoragePlaces = function (user) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM storageplaces",
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Storage places search error.")
                } else {
                    return resolve(results)
                }
            }) 
    })
}
 
/****************************************************************/
/*                      COMMON API STOCK                        */
/****************************************************************/

dbManager.prototype.getStock = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM stock WHERE part=? AND vendor=?",
            [parseInt(data.part),parseInt(data.vendor)],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Stock search error.")
                } else {
                    return resolve(results.map(e => {
                        e.part = data.part,
                        e.vendor = data.vendor
                        return e
                    }))
                }
            }) 
    })
}

dbManager.prototype.searchStock = function (user, data) {
    return new Promise((resolve, reject) => {
        if(data.search && data.search.length){
            db.query('SELECT * FROM stockcomplete WHERE \
            (name LIKE ? \
            OR description LIKE ? \
            OR manufacturer LIKE ? \
            OR vendorreference LIKE ?)',
            new Array(4).fill("%" + data.search + "%"),
        function (error, results, fields) {
            if (error) {
                logger.error(error)
                return reject("Vendor search error.")
            } else {
                return resolve(results)
            }
        }) 
        }else{
            return resolve([])
        }
    })
}

dbManager.prototype.postStock = async function (user, data) {
    return new Promise((resolve, reject) => {
        var t = this

        db.query("INSERT INTO stock (part,vendor,storageplace,url,creator) VALUES (?,?,?,?,?)",
            [data.part.id,data.vendor.id,data.storageplace.id,data.url,user.id],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Vendor search error.")
                } else {
                    data.id = results.insertId
                    t.updateStock(user,{stock:{id:results.insertId},quantity:data.quantity}).then(()=>{
                        return resolve(data)
                    })
                }
            }) 
    })
}

dbManager.prototype.updateStock = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO transactions (user,stock,quantity) VALUES (?,?,?)",
            [user.id,data.stock.id,data.quantity],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Transaction insert error.")
                } else {
                    data.id = results.insertId
                    return resolve(data)
                }
            }) 
    })
}



module.exports = new dbManager();
