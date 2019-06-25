"use strict";
var config = require("../config");
module.exports.route = function (server) {
 
 // General Login Page
 server.get(config.env.siteRoot + "/auth/login", function (req, res, next) {
  
  // TODO Should render login page that shows auth options
  req.redirect("/auth/live");
 });
}
