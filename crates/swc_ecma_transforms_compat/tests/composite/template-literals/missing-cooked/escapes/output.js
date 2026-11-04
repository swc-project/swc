function _templateObject() {
    const data = _tagged_template_literal([
        void 0
    ], [
        "\\unicode"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
consume("\n", "\\2b", "A", "A", "😀", "􏿿");
consume("A", "\uD800", "\uDC00", "\uD800\uD801", "𐀀");
consume("\n".concat(value, "\\2b").concat(other, "	"));
consume("\0\b\f\r	\v", "`$\\", "q");
consume("firstsecond");
tag(_templateObject());
