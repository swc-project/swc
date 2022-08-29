//// [objectLiteralContextualTyping.ts]
// In a contextually typed object literal, each property value expression is contextually typed by
//      the type of the property with a matching name in the contextual type, if any, or otherwise
//      for a numerically named property, the numeric index type of the contextual type, if any, or otherwise
//      the string index type of the contextual type, if any.
var x = foo({
    name: "Sprocket"
});
var x;
var y = foo({
    name: "Sprocket",
    description: "Bumpy wheel"
});
var y;
var z = foo({
    name: "Sprocket",
    description: false
});
var z;
var w = foo({
    a: 10
});
var w;
var b = bar({});
var b;
