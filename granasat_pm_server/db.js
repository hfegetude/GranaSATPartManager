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
            ["%" + data.name + "%"],
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

dbManager.prototype.searchPart = function (user, data) {
    return new Promise((resolve, reject) => {
        if (data.search && data.search !== "") {
            db.query('SELECT * FROM parts WHERE \
            (name LIKE ? \
            OR description LIKE ? \
            OR manufacturer LIKE ?) LIMIT 50',
                new Array(3).fill("%" + data.search + "%"),
                function (error, results, fields) {
                    if (error) {
                        logger.error(error)
                        return reject("Part search error.")
                    } else {
                        return resolve(results)
                    }
                })
        } else {
            return resolve([])
        }
    })
}

dbManager.prototype.postPart = function (user, data) {
    return new Promise((resolve, reject) => {

        if (data.name == null || (data.name && data.name.length == 0)) {
            data.name = null
            return reject("Creation error: probably name must be filled.")
        }

        db.query("INSERT INTO parts (name,description,manufacturer,creator) VALUES (?,?,?,?)",
            [data.name, data.description, data.manufacturer, user.id],
            (error, results, fields) => {
                if (error) {
                    logger.error(error)
                    return reject("Creation error: probably name in use.")
                } else {
                    data.id = results.insertId

                    if (data.datasheet) {
                        var dir = "files/" + data.id
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }

                        axios({
                            'url': data.datasheet,
                            'responseType': 'stream'
                        }).then(response => {
                            response.data.pipe(fs.createWriteStream(dir + "/datasheet.pdf"))
                            db.query('INSERT INTO files (part,file,name,creator) VALUES (?,?,?,?)',[data.id, "datasheet.pdf", "datasheet.pdf", user.id])
                        })
                    }

                    return resolve(data)
                }
            })
    })
}

dbManager.prototype.updatePart = function (user, data) {
    return new Promise((resolve, reject) => {
        var t = this

        if (data.name == null || (data.name && data.name.length == 0)) {
            data.name = null
            return reject("Creation error: probably name must be filled.")
        }

        db.query("UPDATE parts SET name=?,description=?,manufacturer=?,lastUpdated=? WHERE id=?",
            [data.name, data.description, data.manufacturer, user.id, data.id],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Creation error: probably name in use.")
                } else {
                    return resolve()
                }
            })
    })
}

/****************************************************************/
/*                      COMMON API VENDORS                      */
/****************************************************************/

dbManager.prototype.getVendor = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM vendors WHERE name LIKE ? ",
            ["%" + data.name + "%"],
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
        if (data.name == null || (data.name && data.name.length == 0)) {
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

dbManager.prototype.postStoragePlaces = function (user, data, photo) {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO storageplaces (name,description,creator) VALUES (?,?,?)",
            [data.name, data.description, user.id],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Storage places insert error.")
                } else {
                    data.id = results.insertId

                    if (photo) {
                        photo = photo.photo
                        defname = photo.name.split(".")
                        var photoname = "storage_" + data.id + "." + defname[defname.length - 1]
                        fs.writeFile('images/' + photoname, photo.data, (err) => {
                            if (err) {
                                logger.error("Storage Photo not saved")
                            } else {
                                db.query('UPDATE storageplaces SET image=? WHERE id=?', [photoname, data.id], function (error, results, fields) {
                                    if (error) logger.error(error);
                                })
                            }
                        });
                    }

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
            [parseInt(data.part), parseInt(data.vendor)],
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
        if (data.search && data.search !== "") {
            db.query('SELECT * FROM stockcomplete WHERE \
            (name LIKE ? \
            OR description LIKE ? \
            OR manufacturer LIKE ? \
            OR vendorreference LIKE ? \
            OR storagename LIKE ?) LIMIT 50',
                new Array(5).fill("%" + data.search + "%"),
                function (error, results, fields) {
                    if (error) {
                        logger.error(error)
                        return reject("Vendor search error.")
                    } else {
                        return resolve(results)
                    }
                })
        } else {
            return resolve([])
        }
    })
}

dbManager.prototype.postStock = async function (user, data) {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO stock (part,vendor,vendorreference,storageplace,url,creator) VALUES (?,?,?,?,?,?)",
            [data.part.id, data.vendor.id, data.vendorreference, data.storageplace.id, data.url, user.id],
             (error, results, fields) => {
                if (error) {
                    logger.error(error)
                    return reject("Vendor search error.")
                } else {
                    data.id = results.insertId

                    if (data.image) {
                        var imagename = data.image.split("/")
                        imagename = imagename[imagename.length - 1].split("?")[0]
                        imagename = data.id + "." + imagename[imagename.length - 1].split(".")[1]
                        axios({
                            'url': data.image,
                            'responseType': 'stream'
                        }).then(response => {
                            response.data.pipe(fs.createWriteStream('images/' + imagename))
                            db.query('UPDATE stock SET image=? WHERE id=?', [imagename, data.id])
                        })
                    }

                    this.updateStockQuantity(user, {
                        stock: {
                            id: results.insertId
                        },
                        quantity: data.quantity
                    }).then(() => {
                        return resolve(data)
                    })
                }
            })
    })
}

dbManager.prototype.updateStockQuantity = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO transactions (user,stock,quantity) VALUES (?,?,?)",
            [user.id, data.stock.id, data.quantity],
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

dbManager.prototype.updateStockStorage = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query("UPDATE stock SET storageplace=? WHERE id=?",
            [data.storageplace.id, data.stock.id],
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

/****************************************************************/
/*                      COMMON API TRANSACTIONS                 */
/****************************************************************/

dbManager.prototype.getTransactions = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query('SELECT transactions.datetime,transactions.quantity,CONCAT(users.firstname," ",users.lastname) as user FROM transactions LEFT JOIN users ON transactions.user=users.id WHERE stock=? order by datetime desc',
            [parseInt(data.stock)],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Transactions search error.")
                } else {
                    resolve(results)
                }
            })
    })
}

/****************************************************************/
/*                      COMMON API FILES                        */
/****************************************************************/

dbManager.prototype.appendFile = function (user, idpart, file, name = null) {

    return new Promise((resolve, reject) => {
        var dir = "files/" + idpart
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        if (name === null) {
            name = file.name
        }

        fs.writeFile(dir + "/" + file.name, file.data, (err) => {
            if (err) {
                logger.error("File not saved: " + file.name)
                reject()
            } else {
                db.query('INSERT INTO files (part,file,name,creator) VALUES (?,?,?,?)',
                    [idpart, file.name, name, user.id],
                    function (error, results, fields) {
                        if (error) logger.error(error);
                        resolve()
                    })
            }
        });
    })
}

dbManager.prototype.getFiles = function (user, data) {
    return new Promise((resolve, reject) => {

        db.query('SELECT files.*,CONCAT(users.firstname," ",users.lastname) as user FROM files LEFT JOIN users ON files.creator=users.id WHERE files.part=?',
            [parseInt(data.idpart)],
            function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    return reject("Transactions search error.")
                } else {
                    resolve(results)
                }
            })
    })
}

dbManager.prototype.postFiles = function (user, idpart, files) {
    return new Promise(async (resolve, reject) => {
        if (files && Object.keys(files).length) {

            await Object.keys(files).forEach( name => {
                var file = files[name]
                this.appendFile(user, idpart, file, file.name)
            });
        }
        resolve()
    })
}

/****************************************************************/
/*                      COMMON API PROJECTS                     */
/****************************************************************/

dbManager.prototype.getProjects = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query('SELECT projects.*, CONCAT(users.firstname," ",users.lastname) as user FROM projects LEFT JOIN users ON projects.creator=users.id',
            (error, results, fields) => {
                if (error) {
                    logger.error(error)
                    return reject("Projects search error.")
                } else {
                    return resolve(results)
                }
            })
    })
}

dbManager.prototype.getProjectPart = function (user, data) {
    return new Promise((resolve, reject) => {
        db.query('SELECT parts.*, project_part.quantity, count.available \
                    FROM project_part\
                            LEFT JOIN parts ON parts.id = project_part.part \
                            LEFT JOIN (SELECT part,sum(quantity) as available FROM granasatpartmanager.stock GROUP BY part) count ON count.part=project_part.part\
                    WHERE project = ?',
            [parseInt(data.project)],
            (error, results, fields) => {
                if (error) {
                    logger.error(error)
                    return reject("Project part search error.")
                } else {
                    return resolve(results)
                }
            })
    })
}

dbManager.prototype.updateProject = function (user, data) {
    return new Promise((resolve, reject) => {
        if (data.quantity > 0) {
            db.query('INSERT INTO project_part (project, part, quantity) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE quantity=?',
            [data.project.id, data.part.id, data.quantity, data.quantity],
            (error, results, fields) => {
                if (error) {
                    logger.error(error)
                    return reject("Error on update project quantity")
                } else {
                    return resolve()
                }
            })
        }  else{
            db.query('DELETE FROM project_part WHERE project=? AND part=?',
            [data.project.id, data.part.id],
            (error, results, fields) => {
                if (error) {
                    logger.error(error)
                    return reject("Error on update project quantity")
                } else {
                    return resolve()
                }
            })
        }   
        
    })
}


/****************************************************************/
/*                       PUBLIC API                             */
/****************************************************************/

dbManager.prototype.getPublicPart = function (data) {
    return new Promise((resolve, reject) => {
        db.query('SELECT storageplaces.name as storage, stock.quantity, vendors.name as vendor, MAX(prices.price) as price FROM stock \
        LEFT JOIN parts ON parts.id = stock.part\
        LEFT JOIN vendors ON vendors.id = stock.vendor\
        LEFT JOIN prices ON stock.id = prices.stock\
        LEFT JOIN storageplaces ON storageplaces.id = stock.storageplace\
        WHERE parts.name = ?\
        GROUP BY vendors.name',
            [data.partname],
            (error, results, fields) => {
                if (error) {
                    logger.error(error)
                    return reject("Public part search error.")
                } else {
                    return resolve(results)
                }
            })
    })
}

module.exports = new dbManager();