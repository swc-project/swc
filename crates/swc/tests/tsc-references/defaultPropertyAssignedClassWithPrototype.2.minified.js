//// [bug39167.js]
var test = {};
test.K = test.K || function() {}, test.K.prototype = {
    add: function() {}
}, new test.K().add;
