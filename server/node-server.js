const express = require('express');
const winston = require('winston');
const helmet = require('helmet');
const nodeProxy = require('./node-proxy');
const nodeAppServer = require('./node-app-server');
const auth = require('./auth');
const authJson = require('./auth-json');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocalStrategy = require('passport-local').Strategy;


/**
 * Heroku-friendly production http server.
 *
 * Serves your app and allows you to proxy APIs if needed.
 */

const app = express();
const PORT = process.env.PORT || 8080;

// Enable various security helpers.
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(err, {id:12345});
});

passport.use(new passportLocalStrategy(
  {passReqToCallback:true},
  function(req, username, password, done) {
    console.log("pp username:\n"+username);
    console.log("pp password:\n"+password);

    return authJson(username, password, done);
  }
));


// app.use(function(req, res, next) {
console.log("preauth?");
auth(app);
//app.use('/auth', auth);
console.log("postauth?");
// API proxy logic: if you need to talk to a remote server from your client-side
// app you can proxy it though here by editing ./proxy-config.js
nodeProxy(app);
console.log("proxy?");
// Serve the distributed assets and allow HTML5 mode routing. NB: must be last.
nodeAppServer(app);

// Start up the server.
app.listen(PORT, (err) => {
  if (err) {
    winston.error(err);
    return;
  }

  winston.info(`Listening on port ${PORT}`);
});
