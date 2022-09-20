export const obj = {
    remove: function(models, options) {
        var i, l, index, model, singular = !_.isArray(models);
        models = singular ? [
            models
        ] : _.clone(models);
        options || (options = {});
        for(i = 0, l = models.length; i < l; i++)if (model = models[i] = this.get(models[i])) {
            delete this._byId[model.id];
            delete this._byId[model.cid];
            index = this.indexOf(model);
            this.models.splice(index, 1);
            this.length--;
            if (!options.silent) {
                options.index = index;
                model.trigger("remove", model, this, options);
            }
            this._removeReference(model);
        }
        return singular ? models[0] : models;
    }
};
