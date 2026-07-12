use(new function() {}("string", 1, true, null, /regex/, 1n));
use(new function() {}(void 0, 1 + 2, [], {}, function() {}, () => {}));

use(new function() {
    throw "string";
}("drop"));

use(new function() {
    throw 1;
}("drop"));

use(new function() {
    throw true;
}("drop"));

use(new function() {
    throw null;
}("drop"));

use(new function() {
    throw /regex/;
}("drop"));

use(new function() {
    throw 1n;
}("drop"));

use(new (function() {
    throw 1;
})("drop"));

use(new function() {
    throw 1;
}(sideEffect(), "drop", 2));
