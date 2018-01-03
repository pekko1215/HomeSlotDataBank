const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const passport = require('passport')
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const Auth = require('./routes/auth/auth');


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

const User = require('./models/user')(sequelize, Sequelize)

const auth = new Auth(User);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');


app.set('port', (process.env.PORT || 5000));
passport.use(auth.signin(User))
//認証した際のオブジェクトをシリアライズしてセッションに保存する。
passport.serializeUser(function(username, done) {
    console.log('serializeUser');
    done(null, username);
});


//認証時にシリアライズしてセッションに保存したオブジェクトをデシリアライズする。
//デシリアライズしたオブジェクトは各routerの req.user で参照できる。
passport.deserializeUser(function(username, done) {
    console.log('deserializeUser');
    done(null, { name: username, msg: 'my message' });
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());

app.use('/user', express.static(__dirname + '/user/dashboard'))


app.post('/login', passport.authenticate('local', { successRedirect: '/user', failureRedirect: '/login', failureFlash: true }), function(req, res, next) {

})

const route = {
    main: require('./routes/main.js'),
    login: require('./routes/login.js'),
    signup: auth.signup
}

// app.use("/", express.static(__dirname + '/public/main'));
// app.get("/login",function(req,res){
//	res.render(__dirname + '/public/login/index.ejs',{
//		error:req.flash('error')
//	})
// })

app.use("/", express.static(__dirname + '/public'));

app.use('/', route.main);
app.use('/login', route.login);
app.use('/signup', route.signup(User));
//postはbodyにデータが

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});


function getEnv(key) {
    return process.env[key] || require('./config.js')[key]
}