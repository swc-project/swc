function distinguish(thing) {
    var left, right;
    (left = thing, null != (right = Object) && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right) ? console.log("Aha!! It's a Date in " + thing.getFullYear()) : "string" == typeof thing ? console.log("Aha!! It's a string of length " + thing.length) : console.log("Aha!! It's the number " + thing.toPrecision(3));
}
distinguish(new Date()), distinguish("beef"), distinguish(3.14159265);
