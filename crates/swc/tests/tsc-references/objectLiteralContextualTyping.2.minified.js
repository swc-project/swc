//// [objectLiteralContextualTyping.ts]
// In a contextually typed object literal, each property value expression is contextually typed by
//      the type of the property with a matching name in the contextual type, if any, or otherwise
//      for a numerically named property, the numeric index type of the contextual type, if any, or otherwise
//      the string index type of the contextual type, if any.
foo({
    name: "Sprocket"
}), foo({
    name: "Sprocket",
    description: "Bumpy wheel"
}), foo({
    name: "Sprocket",
    description: !1
}), foo({
    a: 10
}), bar({});
