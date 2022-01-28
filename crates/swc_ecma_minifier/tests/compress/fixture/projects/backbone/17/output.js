export const obj = {
    create: function(model1, options1) {
        if (options1 = options1 ? _.clone(options1) : {}, !(model1 = this._prepareModel(model1, options1))) return !1;
        options1.wait || this.add(model1, options1);
        var collection = this, success = options1.success;
        return options1.success = function(model, resp, options) {
            options.wait && collection.add(model, options), success && success(model, resp, options);
        }, model1.save(null, options1), model1;
    }
};
