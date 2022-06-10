(function() {
    var Backbone, root1 = this, previousBackbone = root1.Backbone, slice = [].slice;
    (Backbone = "undefined" != typeof exports ? exports : root1.Backbone = {}).VERSION = "1.1.0";
    var _ = root1._;
    _ || "undefined" == typeof require || (_ = require("underscore")), Backbone.$ = root1.jQuery || root1.Zepto || root1.ender || root1.$, Backbone.noConflict = function() {
        return root1.Backbone = previousBackbone, this;
    }, Backbone.emulateHTTP = !1, Backbone.emulateJSON = !1;
    var Events = Backbone.Events = {
        on: function(name, callback, context) {
            return eventsApi(this, "on", name, [
                callback,
                context
            ]) && callback && (this._events || (this._events = {}), (this._events[name] || (this._events[name] = [])).push({
                callback: callback,
                context: context,
                ctx: context || this
            })), this;
        },
        once: function(name, callback, context) {
            if (!eventsApi(this, "once", name, [
                callback,
                context
            ]) || !callback) return this;
            var self = this, once = _.once(function() {
                self.off(name, once), callback.apply(this, arguments);
            });
            return once._callback = callback, this.on(name, once, context);
        },
        off: function(name, callback, context) {
            var retain, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, "off", name, [
                callback,
                context
            ])) return this;
            if (!name && !callback && !context) return this._events = {}, this;
            for(i = 0, l = (names = name ? [
                name
            ] : _.keys(this._events)).length; i < l; i++)if (name = names[i], events = this._events[name]) {
                if (this._events[name] = retain = [], callback || context) for(j = 0, k = events.length; j < k; j++)ev = events[j], (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) && retain.push(ev);
                retain.length || delete this._events[name];
            }
            return this;
        },
        trigger: function(name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, "trigger", name, args)) return this;
            var events = this._events[name], allEvents = this._events.all;
            return events && triggerEvents(events, args), allEvents && triggerEvents(allEvents, arguments), this;
        },
        stopListening: function(obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) return this;
            var remove = !name && !callback;
            for(var id in callback || "object" != typeof name || (callback = this), obj && ((listeningTo = {})[obj._listenId] = obj), listeningTo)(obj = listeningTo[id]).off(name, callback, this), (remove || _.isEmpty(obj._events)) && delete this._listeningTo[id];
            return this;
        }
    }, eventSplitter = /\s+/, eventsApi = function(obj, action, name, rest) {
        if (!name) return !0;
        if ("object" == typeof name) {
            for(var key in name)obj[action].apply(obj, [
                key,
                name[key]
            ].concat(rest));
            return !1;
        }
        if (eventSplitter.test(name)) {
            for(var names = name.split(eventSplitter), i = 0, l = names.length; i < l; i++)obj[action].apply(obj, [
                names[i]
            ].concat(rest));
            return !1;
        }
        return !0;
    }, triggerEvents = function(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch(args.length){
            case 0:
                for(; ++i < l;)(ev = events[i]).callback.call(ev.ctx);
                return;
            case 1:
                for(; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1);
                return;
            case 2:
                for(; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;
            case 3:
                for(; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;
            default:
                for(; ++i < l;)(ev = events[i]).callback.apply(ev.ctx, args);
        }
    };
    _.each({
        listenTo: "on",
        listenToOnce: "once"
    }, function(implementation, method) {
        Events[method] = function(obj, name, callback) {
            return (this._listeningTo || (this._listeningTo = {}))[obj._listenId || (obj._listenId = _.uniqueId("l"))] = obj, callback || "object" != typeof name || (callback = this), obj[implementation](name, callback, this), this;
        };
    }), Events.bind = Events.on, Events.unbind = Events.off, _.extend(Backbone, Events);
    var Model = Backbone.Model = function(attributes, options) {
        var attrs = attributes || {};
        options || (options = {}), this.cid = _.uniqueId("c"), this.attributes = {}, options.collection && (this.collection = options.collection), options.parse && (attrs = this.parse(attrs, options) || {}), attrs = _.defaults({}, attrs, _.result(this, "defaults")), this.set(attrs, options), this.changed = {}, this.initialize.apply(this, arguments);
    };
    _.extend(Model.prototype, Events, {
        changed: null,
        validationError: null,
        idAttribute: "id",
        initialize: function() {},
        toJSON: function(options) {
            return _.clone(this.attributes);
        },
        sync: function() {
            return Backbone.sync.apply(this, arguments);
        },
        get: function(attr) {
            return this.attributes[attr];
        },
        escape: function(attr) {
            return _.escape(this.get(attr));
        },
        has: function(attr) {
            return null != this.get(attr);
        },
        set: function(key, val, options) {
            var attr, attrs, unset, changes, silent, changing, prev, current;
            if (null == key) return this;
            if ("object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, options || (options = {}), !this._validate(attrs, options)) return !1;
            for(attr in unset = options.unset, silent = options.silent, changes = [], changing = this._changing, this._changing = !0, changing || (this._previousAttributes = _.clone(this.attributes), this.changed = {}), current = this.attributes, prev = this._previousAttributes, this.idAttribute in attrs && (this.id = attrs[this.idAttribute]), attrs)val = attrs[attr], _.isEqual(current[attr], val) || changes.push(attr), _.isEqual(prev[attr], val) ? delete this.changed[attr] : this.changed[attr] = val, unset ? delete current[attr] : current[attr] = val;
            if (!silent) {
                changes.length && (this._pending = !0);
                for(var i = 0, l = changes.length; i < l; i++)this.trigger("change:" + changes[i], this, current[changes[i]], options);
            }
            if (changing) return this;
            if (!silent) for(; this._pending;)this._pending = !1, this.trigger("change", this, options);
            return this._pending = !1, this._changing = !1, this;
        },
        unset: function(attr, options) {
            return this.set(attr, void 0, _.extend({}, options, {
                unset: !0
            }));
        },
        clear: function(options) {
            var attrs = {};
            for(var key in this.attributes)attrs[key] = void 0;
            return this.set(attrs, _.extend({}, options, {
                unset: !0
            }));
        },
        hasChanged: function(attr) {
            return null == attr ? !_.isEmpty(this.changed) : _.has(this.changed, attr);
        },
        changedAttributes: function(diff) {
            if (!diff) return !!this.hasChanged() && _.clone(this.changed);
            var val, changed = !1, old = this._changing ? this._previousAttributes : this.attributes;
            for(var attr in diff)_.isEqual(old[attr], val = diff[attr]) || ((changed || (changed = {}))[attr] = val);
            return changed;
        },
        previous: function(attr) {
            return null != attr && this._previousAttributes ? this._previousAttributes[attr] : null;
        },
        previousAttributes: function() {
            return _.clone(this._previousAttributes);
        },
        fetch: function(options) {
            void 0 === (options = options ? _.clone(options) : {}).parse && (options.parse = !0);
            var model = this, success = options.success;
            return options.success = function(resp) {
                if (!model.set(model.parse(resp, options), options)) return !1;
                success && success(model, resp, options), model.trigger("sync", model, resp, options);
            }, wrapError(this, options), this.sync("read", this, options);
        },
        save: function(key, val, options) {
            var attrs, method, xhr, attributes = this.attributes;
            if (null == key || "object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, options = _.extend({
                validate: !0
            }, options), attrs && !options.wait) {
                if (!this.set(attrs, options)) return !1;
            } else if (!this._validate(attrs, options)) return !1;
            attrs && options.wait && (this.attributes = _.extend({}, attributes, attrs)), void 0 === options.parse && (options.parse = !0);
            var model = this, success = options.success;
            return options.success = function(resp) {
                model.attributes = attributes;
                var serverAttrs = model.parse(resp, options);
                if (options.wait && (serverAttrs = _.extend(attrs || {}, serverAttrs)), _.isObject(serverAttrs) && !model.set(serverAttrs, options)) return !1;
                success && success(model, resp, options), model.trigger("sync", model, resp, options);
            }, wrapError(this, options), "patch" == (method = this.isNew() ? "create" : options.patch ? "patch" : "update") && (options.attrs = attrs), xhr = this.sync(method, this, options), attrs && options.wait && (this.attributes = attributes), xhr;
        },
        destroy: function(options) {
            options = options ? _.clone(options) : {};
            var model = this, success = options.success, destroy = function() {
                model.trigger("destroy", model, model.collection, options);
            };
            if (options.success = function(resp) {
                (options.wait || model.isNew()) && destroy(), success && success(model, resp, options), model.isNew() || model.trigger("sync", model, resp, options);
            }, this.isNew()) return options.success(), !1;
            wrapError(this, options);
            var xhr = this.sync("delete", this, options);
            return options.wait || destroy(), xhr;
        },
        url: function() {
            var base = _.result(this, "urlRoot") || _.result(this.collection, "url") || urlError();
            return this.isNew() ? base : base + ("/" === base.charAt(base.length - 1) ? "" : "/") + encodeURIComponent(this.id);
        },
        parse: function(resp, options) {
            return resp;
        },
        clone: function() {
            return new this.constructor(this.attributes);
        },
        isNew: function() {
            return null == this.id;
        },
        isValid: function(options) {
            return this._validate({}, _.extend(options || {}, {
                validate: !0
            }));
        },
        _validate: function(attrs, options) {
            if (!options.validate || !this.validate) return !0;
            attrs = _.extend({}, this.attributes, attrs);
            var error = this.validationError = this.validate(attrs, options) || null;
            return !error || (this.trigger("invalid", this, error, _.extend(options, {
                validationError: error
            })), !1);
        }
    }), _.each([
        "keys",
        "values",
        "pairs",
        "invert",
        "pick",
        "omit"
    ], function(method) {
        Model.prototype[method] = function() {
            var args = slice.call(arguments);
            return args.unshift(this.attributes), _[method].apply(_, args);
        };
    });
    var Collection = Backbone.Collection = function(models, options) {
        options || (options = {}), options.model && (this.model = options.model), void 0 !== options.comparator && (this.comparator = options.comparator), this._reset(), this.initialize.apply(this, arguments), models && this.reset(models, _.extend({
            silent: !0
        }, options));
    }, setOptions = {
        add: !0,
        remove: !0,
        merge: !0
    }, addOptions = {
        add: !0,
        remove: !1
    };
    _.extend(Collection.prototype, Events, {
        model: Model,
        initialize: function() {},
        toJSON: function(options) {
            return this.map(function(model) {
                return model.toJSON(options);
            });
        },
        sync: function() {
            return Backbone.sync.apply(this, arguments);
        },
        add: function(models, options) {
            return this.set(models, _.extend({
                merge: !1
            }, options, addOptions));
        },
        remove: function(models, options) {
            var i, l, index, model, singular = !_.isArray(models);
            for(models = singular ? [
                models
            ] : _.clone(models), options || (options = {}), i = 0, l = models.length; i < l; i++)(model = models[i] = this.get(models[i])) && (delete this._byId[model.id], delete this._byId[model.cid], index = this.indexOf(model), this.models.splice(index, 1), this.length--, options.silent || (options.index = index, model.trigger("remove", model, this, options)), this._removeReference(model));
            return singular ? models[0] : models;
        },
        set: function(models, options) {
            (options = _.defaults({}, options, setOptions)).parse && (models = this.parse(models, options));
            var i, l, id, model, attrs, existing, sort, singular = !_.isArray(models);
            models = singular ? models ? [
                models
            ] : [] : _.clone(models);
            var at = options.at, targetModel = this.model, sortable = this.comparator && null == at && !1 !== options.sort, sortAttr = _.isString(this.comparator) ? this.comparator : null, toAdd = [], toRemove = [], modelMap = {}, add = options.add, merge = options.merge, remove = options.remove, order = !sortable && !!add && !!remove && [];
            for(i = 0, l = models.length; i < l; i++){
                if (id = (attrs = models[i]) instanceof Model ? model = attrs : attrs[targetModel.prototype.idAttribute], existing = this.get(id)) remove && (modelMap[existing.cid] = !0), merge && (attrs = attrs === model ? model.attributes : attrs, options.parse && (attrs = existing.parse(attrs, options)), existing.set(attrs, options), sortable && !sort && existing.hasChanged(sortAttr) && (sort = !0)), models[i] = existing;
                else if (add) {
                    if (!(model = models[i] = this._prepareModel(attrs, options))) continue;
                    toAdd.push(model), model.on("all", this._onModelEvent, this), this._byId[model.cid] = model, null != model.id && (this._byId[model.id] = model);
                }
                order && order.push(existing || model);
            }
            if (remove) {
                for(i = 0, l = this.length; i < l; ++i)modelMap[(model = this.models[i]).cid] || toRemove.push(model);
                toRemove.length && this.remove(toRemove, options);
            }
            if (toAdd.length || order && order.length) {
                if (sortable && (sort = !0), this.length += toAdd.length, null != at) for(i = 0, l = toAdd.length; i < l; i++)this.models.splice(at + i, 0, toAdd[i]);
                else {
                    order && (this.models.length = 0);
                    var orderedModels = order || toAdd;
                    for(i = 0, l = orderedModels.length; i < l; i++)this.models.push(orderedModels[i]);
                }
            }
            if (sort && this.sort({
                silent: !0
            }), !options.silent) {
                for(i = 0, l = toAdd.length; i < l; i++)(model = toAdd[i]).trigger("add", model, this, options);
                (sort || order && order.length) && this.trigger("sort", this, options);
            }
            return singular ? models[0] : models;
        },
        reset: function(models, options) {
            options || (options = {});
            for(var i = 0, l = this.models.length; i < l; i++)this._removeReference(this.models[i]);
            return options.previousModels = this.models, this._reset(), models = this.add(models, _.extend({
                silent: !0
            }, options)), options.silent || this.trigger("reset", this, options), models;
        },
        push: function(model, options) {
            return this.add(model, _.extend({
                at: this.length
            }, options));
        },
        pop: function(options) {
            var model = this.at(this.length - 1);
            return this.remove(model, options), model;
        },
        unshift: function(model, options) {
            return this.add(model, _.extend({
                at: 0
            }, options));
        },
        shift: function(options) {
            var model = this.at(0);
            return this.remove(model, options), model;
        },
        slice: function() {
            return slice.apply(this.models, arguments);
        },
        get: function(obj) {
            if (null != obj) return this._byId[obj.id] || this._byId[obj.cid] || this._byId[obj];
        },
        at: function(index) {
            return this.models[index];
        },
        where: function(attrs, first) {
            return _.isEmpty(attrs) ? first ? void 0 : [] : this[first ? "find" : "filter"](function(model) {
                for(var key in attrs)if (attrs[key] !== model.get(key)) return !1;
                return !0;
            });
        },
        findWhere: function(attrs) {
            return this.where(attrs, !0);
        },
        sort: function(options) {
            if (!this.comparator) throw Error("Cannot sort a set without a comparator");
            return options || (options = {}), _.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(_.bind(this.comparator, this)), options.silent || this.trigger("sort", this, options), this;
        },
        pluck: function(attr) {
            return _.invoke(this.models, "get", attr);
        },
        fetch: function(options) {
            void 0 === (options = options ? _.clone(options) : {}).parse && (options.parse = !0);
            var success = options.success, collection = this;
            return options.success = function(resp) {
                collection[options.reset ? "reset" : "set"](resp, options), success && success(collection, resp, options), collection.trigger("sync", collection, resp, options);
            }, wrapError(this, options), this.sync("read", this, options);
        },
        create: function(model1, options1) {
            if (options1 = options1 ? _.clone(options1) : {}, !(model1 = this._prepareModel(model1, options1))) return !1;
            options1.wait || this.add(model1, options1);
            var collection = this, success = options1.success;
            return options1.success = function(model, resp, options) {
                options.wait && collection.add(model, options), success && success(model, resp, options);
            }, model1.save(null, options1), model1;
        },
        parse: function(resp, options) {
            return resp;
        },
        clone: function() {
            return new this.constructor(this.models);
        },
        _reset: function() {
            this.length = 0, this.models = [], this._byId = {};
        },
        _prepareModel: function(attrs, options) {
            if (attrs instanceof Model) return attrs.collection || (attrs.collection = this), attrs;
            (options = options ? _.clone(options) : {}).collection = this;
            var model = new this.model(attrs, options);
            return model.validationError ? (this.trigger("invalid", this, model.validationError, options), !1) : model;
        },
        _removeReference: function(model) {
            this === model.collection && delete model.collection, model.off("all", this._onModelEvent, this);
        },
        _onModelEvent: function(event, model, collection, options) {
            ("add" !== event && "remove" !== event || collection === this) && ("destroy" === event && this.remove(model, options), model && event === "change:" + model.idAttribute && (delete this._byId[model.previous(model.idAttribute)], null != model.id && (this._byId[model.id] = model)), this.trigger.apply(this, arguments));
        }
    }), _.each([
        "forEach",
        "each",
        "map",
        "collect",
        "reduce",
        "foldl",
        "inject",
        "reduceRight",
        "foldr",
        "find",
        "detect",
        "filter",
        "select",
        "reject",
        "every",
        "all",
        "some",
        "any",
        "include",
        "contains",
        "invoke",
        "max",
        "min",
        "toArray",
        "size",
        "first",
        "head",
        "take",
        "initial",
        "rest",
        "tail",
        "drop",
        "last",
        "without",
        "difference",
        "indexOf",
        "shuffle",
        "lastIndexOf",
        "isEmpty",
        "chain", 
    ], function(method) {
        Collection.prototype[method] = function() {
            var args = slice.call(arguments);
            return args.unshift(this.models), _[method].apply(_, args);
        };
    }), _.each([
        "groupBy",
        "countBy",
        "sortBy"
    ], function(method) {
        Collection.prototype[method] = function(value, context) {
            var iterator = _.isFunction(value) ? value : function(model) {
                return model.get(value);
            };
            return _[method](this.models, iterator, context);
        };
    });
    var View = Backbone.View = function(options) {
        this.cid = _.uniqueId("view"), options || (options = {}), _.extend(this, _.pick(options, viewOptions)), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
    }, delegateEventSplitter = /^(\S+)\s*(.*)$/, viewOptions = [
        "model",
        "collection",
        "el",
        "id",
        "attributes",
        "className",
        "tagName",
        "events", 
    ];
    _.extend(View.prototype, Events, {
        tagName: "div",
        $: function(selector) {
            return this.$el.find(selector);
        },
        initialize: function() {},
        render: function() {
            return this;
        },
        remove: function() {
            return this.$el.remove(), this.stopListening(), this;
        },
        setElement: function(element, delegate) {
            return this.$el && this.undelegateEvents(), this.$el = element instanceof Backbone.$ ? element : Backbone.$(element), this.el = this.$el[0], !1 !== delegate && this.delegateEvents(), this;
        },
        delegateEvents: function(events) {
            if (!(events || (events = _.result(this, "events")))) return this;
            for(var key in this.undelegateEvents(), events){
                var method = events[key];
                if (_.isFunction(method) || (method = this[events[key]]), method) {
                    var match = key.match(delegateEventSplitter), eventName = match[1], selector = match[2];
                    method = _.bind(method, this), eventName += ".delegateEvents" + this.cid, "" === selector ? this.$el.on(eventName, method) : this.$el.on(eventName, selector, method);
                }
            }
            return this;
        },
        undelegateEvents: function() {
            return this.$el.off(".delegateEvents" + this.cid), this;
        },
        _ensureElement: function() {
            if (this.el) this.setElement(_.result(this, "el"), !1);
            else {
                var attrs = _.extend({}, _.result(this, "attributes"));
                this.id && (attrs.id = _.result(this, "id")), this.className && (attrs.class = _.result(this, "className"));
                var $el = Backbone.$("<" + _.result(this, "tagName") + ">").attr(attrs);
                this.setElement($el, !1);
            }
        }
    }), Backbone.sync = function(method, model, options) {
        var type = methodMap[method];
        _.defaults(options || (options = {}), {
            emulateHTTP: Backbone.emulateHTTP,
            emulateJSON: Backbone.emulateJSON
        });
        var params = {
            type: type,
            dataType: "json"
        };
        if (options.url || (params.url = _.result(model, "url") || urlError()), null == options.data && model && ("create" === method || "update" === method || "patch" === method) && (params.contentType = "application/json", params.data = JSON.stringify(options.attrs || model.toJSON(options))), options.emulateJSON && (params.contentType = "application/x-www-form-urlencoded", params.data = params.data ? {
            model: params.data
        } : {}), options.emulateHTTP && ("PUT" === type || "DELETE" === type || "PATCH" === type)) {
            params.type = "POST", options.emulateJSON && (params.data._method = type);
            var beforeSend = options.beforeSend;
            options.beforeSend = function(xhr) {
                if (xhr.setRequestHeader("X-HTTP-Method-Override", type), beforeSend) return beforeSend.apply(this, arguments);
            };
        }
        "GET" === params.type || options.emulateJSON || (params.processData = !1), "PATCH" === params.type && noXhrPatch && (params.xhr = function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        });
        var xhr1 = options.xhr = Backbone.ajax(_.extend(params, options));
        return model.trigger("request", model, xhr1, options), xhr1;
    };
    var noXhrPatch = "undefined" != typeof window && !!window.ActiveXObject && !(window.XMLHttpRequest && new XMLHttpRequest().dispatchEvent), methodMap = {
        create: "POST",
        update: "PUT",
        patch: "PATCH",
        delete: "DELETE",
        read: "GET"
    };
    Backbone.ajax = function() {
        return Backbone.$.ajax.apply(Backbone.$, arguments);
    };
    var Router = Backbone.Router = function(options) {
        options || (options = {}), options.routes && (this.routes = options.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
    }, optionalParam = /\((.*?)\)/g, namedParam = /(\(\?)?:\w+/g, splatParam = /\*\w+/g, escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    _.extend(Router.prototype, Events, {
        initialize: function() {},
        route: function(route, name, callback) {
            _.isRegExp(route) || (route = this._routeToRegExp(route)), _.isFunction(name) && (callback = name, name = ""), callback || (callback = this[name]);
            var router = this;
            return Backbone.history.route(route, function(fragment) {
                var args = router._extractParameters(route, fragment);
                callback && callback.apply(router, args), router.trigger.apply(router, [
                    "route:" + name
                ].concat(args)), router.trigger("route", name, args), Backbone.history.trigger("route", router, name, args);
            }), this;
        },
        navigate: function(fragment, options) {
            return Backbone.history.navigate(fragment, options), this;
        },
        _bindRoutes: function() {
            if (this.routes) {
                this.routes = _.result(this, "routes");
                for(var route, routes = _.keys(this.routes); null != (route = routes.pop());)this.route(route, this.routes[route]);
            }
        },
        _routeToRegExp: function(route) {
            return RegExp("^" + (route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
                return optional ? match : "([^/]+)";
            }).replace(splatParam, "(.*?)")) + "$");
        },
        _extractParameters: function(route, fragment) {
            var params = route.exec(fragment).slice(1);
            return _.map(params, function(param) {
                return param ? decodeURIComponent(param) : null;
            });
        }
    });
    var History = Backbone.History = function() {
        this.handlers = [], _.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, this.history = window.history);
    }, routeStripper = /^[#\/]|\s+$/g, rootStripper = /^\/+|\/+$/g, isExplorer = /msie [\w.]+/, trailingSlash = /\/$/, pathStripper = /[?#].*$/;
    History.started = !1, _.extend(History.prototype, Events, {
        interval: 50,
        getHash: function(window) {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : "";
        },
        getFragment: function(fragment, forcePushState) {
            if (null == fragment) {
                if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                    fragment = this.location.pathname;
                    var root = this.root.replace(trailingSlash, "");
                    fragment.indexOf(root) || (fragment = fragment.slice(root.length));
                } else fragment = this.getHash();
            }
            return fragment.replace(routeStripper, "");
        },
        start: function(options) {
            if (History.started) throw Error("Backbone.history has already been started");
            History.started = !0, this.options = _.extend({
                root: "/"
            }, this.options, options), this.root = this.options.root, this._wantsHashChange = !1 !== this.options.hashChange, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
            var fragment = this.getFragment(), docMode = document.documentMode, oldIE = isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7);
            this.root = ("/" + this.root + "/").replace(rootStripper, "/"), oldIE && this._wantsHashChange && (this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(fragment)), this._hasPushState ? Backbone.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !oldIE ? Backbone.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = fragment;
            var loc = this.location, atRoot = loc.pathname.replace(/[^\/]$/, "$&/") === this.root;
            if (this._wantsHashChange && this._wantsPushState) {
                if (!this._hasPushState && !atRoot) return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0;
                this._hasPushState && atRoot && loc.hash && (this.fragment = this.getHash().replace(routeStripper, ""), this.history.replaceState({}, document.title, this.root + this.fragment + loc.search));
            }
            if (!this.options.silent) return this.loadUrl();
        },
        stop: function() {
            Backbone.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), History.started = !1;
        },
        route: function(route, callback) {
            this.handlers.unshift({
                route: route,
                callback: callback
            });
        },
        checkUrl: function(e) {
            var current = this.getFragment();
            if (current === this.fragment && this.iframe && (current = this.getFragment(this.getHash(this.iframe))), current === this.fragment) return !1;
            this.iframe && this.navigate(current), this.loadUrl();
        },
        loadUrl: function(fragment) {
            return fragment = this.fragment = this.getFragment(fragment), _.any(this.handlers, function(handler) {
                if (handler.route.test(fragment)) return handler.callback(fragment), !0;
            });
        },
        navigate: function(fragment, options) {
            if (!History.started) return !1;
            options && !0 !== options || (options = {
                trigger: !!options
            });
            var url = this.root + (fragment = this.getFragment(fragment || ""));
            if (fragment = fragment.replace(pathStripper, ""), this.fragment !== fragment) {
                if (this.fragment = fragment, "" === fragment && "/" !== url && (url = url.slice(0, -1)), this._hasPushState) this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url);
                else {
                    if (!this._wantsHashChange) return this.location.assign(url);
                    this._updateHash(this.location, fragment, options.replace), this.iframe && fragment !== this.getFragment(this.getHash(this.iframe)) && (options.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, fragment, options.replace));
                }
                if (options.trigger) return this.loadUrl(fragment);
            }
        },
        _updateHash: function(location, fragment, replace) {
            if (replace) {
                var href = location.href.replace(/(javascript:|#).*$/, "");
                location.replace(href + "#" + fragment);
            } else location.hash = "#" + fragment;
        }
    }), Backbone.history = new History(), Model.extend = Collection.extend = Router.extend = View.extend = History.extend = function(protoProps, staticProps) {
        var child, parent = this;
        child = protoProps && _.has(protoProps, "constructor") ? protoProps.constructor : function() {
            return parent.apply(this, arguments);
        }, _.extend(child, parent, staticProps);
        var Surrogate = function() {
            this.constructor = child;
        };
        return Surrogate.prototype = parent.prototype, child.prototype = new Surrogate(), protoProps && _.extend(child.prototype, protoProps), child.__super__ = parent.prototype, child;
    };
    var urlError = function() {
        throw Error('A "url" property or function must be specified');
    }, wrapError = function(model, options) {
        var error = options.error;
        options.error = function(resp) {
            error && error(model, resp, options), model.trigger("error", model, resp, options);
        };
    };
}).call(this);
