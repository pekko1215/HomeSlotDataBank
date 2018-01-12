const express = require('express');

const app = express();
const passport = require('passport')
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const Auth = require('./routes/auth/auth');
const Sequelize = require('sequelize')

app.use(flash());
app.use(require('express-session')({
    secret: getEnv("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false
}))

if (getEnv("DATABASE_URL")) {
    var sequelize = new Sequelize(getEnv("DATABASE_URL"));
} else {
    var sequelize = new Sequelize(getEnv('DATABASE_LOCAL')[0],getEnv('DATABASE_LOCAL')[1],getEnv('DATABASE_LOCAL')[2],getEnv('DATABASE_LOCAL')[3]);
}

const User = require('./models/user')(sequelize, Sequelize);
const PlayData = require('./models/playdatas')(sequelize,Sequelize);
const Slot = require('./models/slot')(sequelize,Sequelize);

const models = {
	User:User,
	PlayData:PlayData,
	Slot:Slot
}

// require('./systemslotregister')(Slot)

const auth = new Auth(models);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');


app.set('port', (process.env.PORT || 5000));
passport.use(auth.signin(models))
//認証した際のオブジェクトをシリアライズしてセッションに保存する。
passport.serializeUser(function(user, done) {
    done(null, user);
});


//認証時にシリアライズしてセッションに保存したオブジェクトをデシリアライズする。
//デシリアライズしたオブジェクトは各routerの req.user で参照できる。
passport.deserializeUser(function(user, done) {
    done(null,user);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());

app.post('/login', passport.authenticate('local', { successRedirect: '/user', failureRedirect: '/login', failureFlash: true }), function(req, res, next) {
	console.log(req.body)
})

const route = {
    main: require('./routes/main'),
    login: require('./routes/login'),
    signup: auth.signup(models),
    dashbord:require('./routes/user/user')(models)
}

app.use("/", express.static(__dirname + '/public'));

app.use('/', route.main);
app.use('/login', route.login);
app.use('/signup', route.signup);
app.use('/user',route.dashbord);

//postはbodyにデータが

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});


function getEnv(key) {
    return process.env[key] || require('./config.js')[key]
}