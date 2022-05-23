function foo() {
    var collection = this, success = options.success;
    return options.success = function(model, resp, options) {
        options.wait && collection.add(model, options), success && success(model, resp, options);
    }, model.save(null, options), model;
}
