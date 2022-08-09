// @target: ES6
var f;
var x = new new new f`abc${0}def`.member("hello")(42) === true;
