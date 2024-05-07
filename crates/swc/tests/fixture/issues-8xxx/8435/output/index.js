var _class_call_check = require("@swc/helpers/_/_class_call_check"), _create_class = require("@swc/helpers/_/_create_class"), init = function() {
    var e = window.parcelRequire;
    e.register('module1', function() {}), e.register('module2', function() {
        console.log('test');
    });
};
init();
