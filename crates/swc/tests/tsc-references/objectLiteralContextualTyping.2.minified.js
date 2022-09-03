//// [objectLiteralContextualTyping.ts]
var x, y, z, w, b, x = foo({
    name: "Sprocket"
}), y = foo({
    name: "Sprocket",
    description: "Bumpy wheel"
}), z = foo({
    name: "Sprocket",
    description: !1
}), w = foo({
    a: 10
}), b = bar({});
