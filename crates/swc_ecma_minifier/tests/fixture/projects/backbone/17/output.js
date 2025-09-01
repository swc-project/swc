export const obj = {
    create: function(model, options) {
        if (options = options ? _.clone(options) : {}, !(model = this._prepareModel(model, options))) return !1;
        options.wait || this.add(model, options);
        var collection = this, success = options.success;
        return options.success = function(model, resp, options) {
            options.wait && collection.add(model, options), success && success(model, resp, options);
        }, model.save(null, options), model;
    }
};
