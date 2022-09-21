API.prototype._getIngestEndpoint = function(t) {
    var n = this.getBaseApiEndpoint();
    var e = this._dsnObject;
    return "" + n + e.projectId + "/" + t + "/";
};
