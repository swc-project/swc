var myObject = new Object();

new Object();

var foo = new Object("foo");

// Valid

var myObject = new CustomObject();

var myObject = {};

var foo = Object("foo");

() => {
    var Object = function Object() {};
    new Object();
}
