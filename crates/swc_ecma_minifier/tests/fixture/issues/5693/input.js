API.prototype._getIngestEndpoint = function (target) {
    var base = this.getBaseApiEndpoint();
    var dsn = this._dsnObject;
    return "" + base + dsn.projectId + "/" + target + "/";
};