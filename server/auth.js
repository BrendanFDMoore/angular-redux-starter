// var fs = require("fs");
// var util = require('util');
const passport = require('passport');

module.exports = (app) => {
  console.log("am i loading?");

  app.post('/api/auth/login',
    passport.authenticate('local',
      { successRedirect: '/',
       failureRedirect: '/',
       failureFlash: false })
  );
};
