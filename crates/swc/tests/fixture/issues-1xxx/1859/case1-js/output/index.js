"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {};
var swcHelpers = require("@swc/helpers");
var _appConfig = swcHelpers.interopRequireWildcard(require("./app.config"));
Object.keys(_appConfig).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _appConfig[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _appConfig[key];
        }
    });
});
var _databaseConfig = swcHelpers.interopRequireWildcard(require("./database.config"));
Object.keys(_databaseConfig).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _databaseConfig[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _databaseConfig[key];
        }
    });
});
