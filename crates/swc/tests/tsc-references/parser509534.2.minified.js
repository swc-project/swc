//// [parser509534.ts]
var config = require("../config");
module.exports.route = function(server) {
    server.get(config.env.siteRoot + "/auth/login", function(req, res, next) {
        req.redirect("/auth/live");
    });
};
