var obj;
"abc".concat((obj = "hi", "undefined" != typeof Symbol && obj.constructor === Symbol) ? "symbol" : typeof obj, "def");
