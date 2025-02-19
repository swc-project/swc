(function () {
    function entry() {
        var struct = {
            a: [],
            b: 0,
        };
        setName(struct, "Alice");
    }
    function setName(struct, str) {
        writeString(struct.a, struct.b, str);
    }
    function writeString(buffer, offset, c) {
        for (var i = 0, v = c.length; i < v; i = (i + 1) | 0) {
            buffer[(offset + i) | 0] = c.charCodeAt(i);
        }
    }
    entry();
})();
