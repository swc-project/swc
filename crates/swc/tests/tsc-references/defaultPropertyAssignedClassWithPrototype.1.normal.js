//// [bug39167.js]
var test = {};
test.K = test.K || function() {};
test.K.prototype = {
    add: function add() {}
};
new test.K().add;
