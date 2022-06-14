import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
// @allowJs: true
// @checkJs: true
// @target: esnext
// @strict: true
// @declaration: true
// @filename: index.js
// @outDir: /out
var С1 = function С1() {
    "use strict";
    _class_call_check(this, С1);
    /** @type {string=} */ this.p1 = undefined;
    /** @type {string | undefined} */ this.p2 = undefined;
    /** @type {?string} */ this.p3 = null;
    /** @type {string | null} */ this.p4 = null;
};
var С2 = /*#__PURE__*/ function() {
    "use strict";
    function С2() {
        _class_call_check(this, С2);
    }
    _create_class(С2, [
        {
            key: "p1",
            get: /** @type {string=} */ function get() {
                return undefined;
            }
        },
        {
            key: "p2",
            get: /** @type {string | undefined} */ function get() {
                return undefined;
            }
        },
        {
            key: "p3",
            get: /** @type {?string} */ function get() {
                return null;
            }
        },
        {
            key: "p4",
            get: /** @type {string | null} */ function get() {
                return null;
            }
        }
    ]);
    return С2;
}();
var С3 = /*#__PURE__*/ function() {
    "use strict";
    function С3() {
        _class_call_check(this, С3);
    }
    _create_class(С3, [
        {
            key: "p1",
            get: /** @type {string=} */ function get() {
                return undefined;
            },
            set: /** @param {string=} value */ function set(value) {
                this.p1 = value;
            }
        },
        {
            key: "p2",
            get: /** @type {string | undefined} */ function get() {
                return undefined;
            },
            set: /** @param {string | undefined} value */ function set(value) {
                this.p2 = value;
            }
        },
        {
            key: "p3",
            get: /** @type {?string} */ function get() {
                return null;
            },
            set: /** @param {?string} value */ function set(value) {
                this.p3 = value;
            }
        },
        {
            key: "p4",
            get: /** @type {string | null} */ function get() {
                return null;
            },
            set: /** @param {string | null} value */ function set(value) {
                this.p4 = value;
            }
        }
    ]);
    return С3;
}();
var С4 = /*#__PURE__*/ function() {
    "use strict";
    function С4() {
        _class_call_check(this, С4);
    }
    _create_class(С4, [
        {
            key: "p1",
            set: /** @param {string=} value */ function set(value) {
                this.p1 = value;
            }
        },
        {
            key: "p2",
            set: /** @param {string | undefined} value */ function set(value) {
                this.p2 = value;
            }
        },
        {
            key: "p3",
            set: /** @param {?string} value */ function set(value) {
                this.p3 = value;
            }
        },
        {
            key: "p4",
            set: /** @param {string | null} value */ function set(value) {
                this.p4 = value;
            }
        }
    ]);
    return С4;
}();
