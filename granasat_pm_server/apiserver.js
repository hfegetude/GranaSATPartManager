var path = require('path');
var cors = require('cors')
var moment = require('moment')

var express = require('express')
var router = express.Router();

var favicon = require('serve-favicon');
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var helmet = require('helmet')
router.use(helmet())

var dbManager = require('./db.js')
var logger = require('./logger.js')

// CORS Headers
var corsOptions = {
    origin: '*',
    allowedHeaders: ['Accept', 'Origin', 'Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
}
router.use(cors())


////   Authentication check   ////
var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.status(401).json({
            error: "Unauthenticated"
        })
    }
}

////    Initialize the api authentication method    ////
router.use(fileUpload());
router.use(cookieParser());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
router.use(session({
    secret: dbManager.createSalt(),
    resave: false,
    cookie: {
        maxAge: 7/*d*/ * 24/*h*/ * 60/*m*/ * 60/*s*/ * 1000/*ms*/
    },
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, dbManager.checkPassportPassword.bind(dbManager)));

passport.serializeUser(function(user, done) {
    return done(null, user.id);
});

passport.deserializeUser(dbManager.getPassportUser);

/****************************************************************/
/*                      STATIC                                  */
/****************************************************************/


router.use(favicon(path.join(__dirname, '../granasat_pm_client/public/favicon.ico')));
router.use('/public', express.static(path.join(__dirname, '../granasat_pm_client/public')));
router.use('/static', express.static(path.join(__dirname, '../granasat_pm_client/build/static')));
router.use('/images', express.static('images'));
router.use('/files', express.static('files'));
router.use('/altiumfiles', isAuthenticated, express.static('altiumfiles'));

/****************************************************************/
/*                      API USER SESSION                        */
/****************************************************************/

//Login into API
router.post('/api/login', passport.authenticate('login'), function(req, res) {
    dbManager.saveLoginLogout(req, 1).then((error) => {
        if (!error) {
            res.status(200).json({
                status: "OK"
            })
        }
    }).catch(() => {
        res.json({
            status: "Error"
        })
    })
});

//API Logout
router.get('/api/logout', isAuthenticated, function(req, res) {
    req.logout();
    res.status(200).json({
        status: "OK"
    })
});

//Get User data
router.get('/api/whoami', isAuthenticated, function(req, res) {
    res.json({
        user: req.user
    })
});

/****************************************************************/
/*                          API USERS                           */
/****************************************************************/

//USER CREATION
router.post('/api/user', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    dbManager.postUsers(user, data).then((id) => {
        res.status(200).json({
            status: "OK"
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

/****************************************************************/
/*                          API PARTS                           */
/****************************************************************/

//PART SEARCH

router.get('/api/part', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.query

    var f = null
    if (data.hasOwnProperty("search")) {
        f = dbManager.searchPart
    }else{
        f = dbManager.getPart
    }
    f(user, data).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

//PART CREATION
router.post('/api/part', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    dbManager.postPart(user, data).then((inserted) => {
        res.status(200).json({
            status: "OK",
            inserted:inserted
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

//PART MODIFY
router.put('/api/part', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    dbManager.updatePart(user, data).then(() => {
        res.status(200).json({
            status: "OK",
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});


/****************************************************************/
/*                          API VENDORS                         */
/****************************************************************/

//PART SEARCH
router.get('/api/vendor', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.query
    dbManager.getVendor(user, data).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

//PART CREATION
router.post('/api/vendor', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    dbManager.postVendor(user, data).then((inserted) => {
        res.status(200).json({
            status: "OK",
            inserted:inserted
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

/****************************************************************/
/*                          API STOR. PLACES                     */
/****************************************************************/

//STORAGE SEARCH
router.get('/api/storageplaces', isAuthenticated, function(req, res) {
    var user = req.user
    
    dbManager.getStoragePlaces(user).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});


//STORAGE CREATE
router.post('/api/storageplaces', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    var photo = req.files

    dbManager.postStoragePlaces(user, data, photo).then((inserted) => {
        res.status(200).json({
            status: "OK",
            inserted:inserted
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});


/****************************************************************/
/*                          API STOCK                           */
/****************************************************************/

//STOCK FIND
router.get('/api/stock', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.query

    var f = null
    if (data.hasOwnProperty("search")) {
        f = dbManager.searchStock
    }else{
        f = dbManager.getStock
    }
    f(user, data).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

//STOCK CREATE
router.post('/api/stock', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    dbManager.postStock(user, data).then((inserted) => {
        res.status(200).json({
            status: "OK",
            inserted:inserted
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

//STOCK UPDATE
router.put('/api/stock', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    var f = null
    if (data.hasOwnProperty('quantity')) {
        f = dbManager.updateStockQuantity
    }else if(data.hasOwnProperty('storageplace')){
        f = dbManager.updateStockStorage
    }

    f(user, data).then((inserted) => {
        res.status(200).json({
            status: "OK",
            inserted:inserted
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
    
});

/****************************************************************/
/*                          API TRANSACTIONS                    */
/****************************************************************/

router.get('/api/transactions', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.query
    dbManager.getTransactions(user, data).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

/****************************************************************/
/*                          API FILE                            */
/****************************************************************/

router.get('/api/files', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.query
    dbManager.getFiles(user, data).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

router.delete('/api/files', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.query
    dbManager.getFiles(user, data).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

router.post('/api/files', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    dbManager.postFiles(user, data.idpart, req.files).then(() => {
        res.status(200).json({
            status: "ok",
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});



/****************************************************************/
/*                          API PROJECTS                        */
/****************************************************************/

router.get('/api/projects', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.query

    var f = null
    
    if (data.hasOwnProperty('project')) {
        f = dbManager.getProjectPart
    }else{
        f = dbManager.getProjects
    }

    f(user, data).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});

router.put('/api/projects', isAuthenticated, function(req, res) {
    var user = req.user
    var data = req.body
    dbManager.updateProject(user, data).then(() => {
        res.status(200).json({
            status: "OK",
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});



/****************************************************************/
/*                       PUBLIC API                             */
/****************************************************************/

router.get('/api/public/part',function(req, res) {
    var data = req.query

    var f = null

    f = dbManager.getPublicPart


    f(data).then((results) => {
        res.status(200).json({
            results: results,
        })
    }).catch((error) => {
        if (error) logger.error(error);
        res.status(400).json({
            error: error
        })
    });
});



module.exports = router;
