var application;
(()=>{
    var __webpack_require__ = {};
    (()=>{
        __webpack_require__.d = (exports, definition)=>{
            for(var key in definition){
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                }
            }
        };
    })();
    (()=>{
        __webpack_require__.o = (obj, prop)=>(Object.prototype.hasOwnProperty.call(obj, prop));
    })();
    (()=>{
        __webpack_require__.r = (exports)=>{
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, {
                    value: 'Module'
                });
            }
            Object.defineProperty(exports, '__esModule', {
                value: true
            });
        };
    })();
    var __webpack_exports__ = {};
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
        "bootstrap": ()=>(bootstrap)
    });
    function bootstrap() {
        alert();
    }
    application = __webpack_exports__;
})();
