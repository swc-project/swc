class Narrow {
    narrowed: boolean
}

var a: object

if (a instanceof Narrow) {
    a.narrowed; // ok
    a = 123; // error
}

if (typeof a === 'number') {
    a.toFixed(); // error, never
}

var b: object | null

if (typeof b === 'object') {
   b.toString(); // ok, object | null
} else {
   b.toString(); // error, never
}
