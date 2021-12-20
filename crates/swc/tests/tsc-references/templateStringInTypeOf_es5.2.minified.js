var obj;
(obj = "abc".concat(123, "def")) && "undefined" != typeof Symbol && obj.constructor === Symbol;
