define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        useRouter: function() {
            return useRouter;
        },
        default: function() {
            return _default;
        }
    });
    function useRouter() {}
    const _default = useRouter;
});
