!function() {
    window.used = (function() {
        window.foo;
        var B = window.bar, C = window.foobar;
        return -1 === C ? B : $(B, C);
    }).call(this);
}();
