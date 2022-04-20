export const E = {
    set: function (models, options) {
        options = _.defaults({}, options, setOptions);
        if (options.parse) models = this.parse(models, options);
        var singular = !_.isArray(models);
        models = singular ? (models ? [models] : []) : _.clone(models);
        var i, l, id, model, attrs, existing, sort;
        var at = options.at;
        var targetModel = this.model;
        var sortable = this.comparator && (at == null) && options.sort !== false;
        var sortAttr = _.isString(this.comparator) ? this.comparator : null;
        var toAdd = [], toRemove = [], modelMap = {};
        var add = options.add, merge = options.merge, remove = options.remove;
        var order = !sortable && add && remove ? [] : false;

        // Turn bare objects into model references, and prevent invalid models
        // from being added.
        for (i = 0, l = models.length; i < l; i++) {
            attrs = models[i];
            if (attrs instanceof Model) {
                id = model = attrs;
            } else {
                id = attrs[targetModel.prototype.idAttribute];
            }

            // If a duplicate is found, prevent it from being added and
            // optionally merge it into the existing model.
            if (existing = this.get(id)) {
                if (remove) modelMap[existing.cid] = true;
                if (merge) {
                    attrs = attrs === model ? model.attributes : attrs;
                    if (options.parse) attrs = existing.parse(attrs, options);
                    existing.set(attrs, options);
                    if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
                }
                models[i] = existing;

                // If this is a new, valid model, push it to the `toAdd` list.
            } else if (add) {
                model = models[i] = this._prepareModel(attrs, options);
                if (!model) continue;
                toAdd.push(model);

                // Listen to added models' events, and index models for lookup by
                // `id` and by `cid`.
                model.on('all', this._onModelEvent, this);
                this._byId[model.cid] = model;
                if (model.id != null) this._byId[model.id] = model;
            }
            if (order) order.push(existing || model);
        }

        // Remove nonexistent models if appropriate.
        if (remove) {
            for (i = 0, l = this.length; i < l; ++i) {
                if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
            }
            if (toRemove.length) this.remove(toRemove, options);
        }

        // See if sorting is needed, update `length` and splice in new models.
        if (toAdd.length || (order && order.length)) {
            if (sortable) sort = true;
            this.length += toAdd.length;
            if (at != null) {
                for (i = 0, l = toAdd.length; i < l; i++) {
                    this.models.splice(at + i, 0, toAdd[i]);
                }
            } else {
                if (order) this.models.length = 0;
                var orderedModels = order || toAdd;
                for (i = 0, l = orderedModels.length; i < l; i++) {
                    this.models.push(orderedModels[i]);
                }
            }
        }

        // Silently sort the collection if appropriate.
        if (sort) this.sort({ silent: true });

        // Unless silenced, it's time to fire all appropriate add/sort events.
        if (!options.silent) {
            for (i = 0, l = toAdd.length; i < l; i++) {
                (model = toAdd[i]).trigger('add', model, this, options);
            }
            if (sort || (order && order.length)) this.trigger('sort', this, options);
        }

        // Return the added (or merged) model (or models).
        return singular ? models[0] : models;
    }
}