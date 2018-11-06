var cors = require('cors')
var moment = require('moment')

var express = require('express')
var router = express.Router();

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
/*                               API                            */
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


module.exports = router;
