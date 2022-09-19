API.prototype._getIngestEndpoint = function(target) {
    return "" + this.getBaseApiEndpoint() + this._dsnObject.projectId + "/" + target + "/";
};
