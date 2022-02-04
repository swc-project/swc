for(var match, Foo = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo);
}, re = /./g; null != (match = re.exec("xxx"));)match[1].length + match[2].length;
