const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(require('cookie-parser')());
app.use(require('express-session')({
	secret:getEnv("SESSION_SECRET"),
	resave:false,
	saveUninitialized:false
}))

const sequelize = new Sequelize(getEnv("DATABASE_URL"))



app.set('port', (process.env.PORT || 5000));
app.use('/user',function(req,res,next){
	if(req.session.user){
		next();
	}else{
		res.redirect('/login')
	}
})
app.use("/login",express.static(__dirname + '/public/login'))
app.use("/",express.static(__dirname + '/public/main'));




app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});

function getEnv(key){
	return process.env[key]||require('./config.js')[key]
}