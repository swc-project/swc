function foo() {
    var collection = this, success = options.success;
    return options.success = function(model1, resp, options1) {
        options1.wait && collection.add(model1, options1), success && success(model1, resp, options1);
    }, model.save(null, options), model;
}
