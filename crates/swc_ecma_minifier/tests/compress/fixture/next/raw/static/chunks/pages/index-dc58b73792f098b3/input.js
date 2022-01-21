(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 5301:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(5075);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 5075:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ IndexPage; }
/* harmony export */ });
/* harmony import */ var _Users_kdy1_projects_lab_fb9_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4051);
/* harmony import */ var _Users_kdy1_projects_lab_fb9_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_kdy1_projects_lab_fb9_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7294);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5503);
/* harmony import */ var _firebase_firestore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(19);






function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
var firebaseConfig = {
    apiKey: "AIzaSyA1bnMep051XONQKBEG86WD8u6Ne4t9dtk",
    authDomain: "swc-min.firebaseapp.com",
    projectId: "swc-min",
    storageBucket: "swc-min.appspot.com",
    messagingSenderId: "185520786347",
    appId: "1:185520786347:web:8cee4a61679e44cc04a0ee",
    measurementId: "G-P9LZ91SMSB"
};
// Initialize Firebase
var app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_4__/* .initializeApp */ .ZF)(firebaseConfig);
var store = (0,_firebase_firestore__WEBPACK_IMPORTED_MODULE_5__/* .getFirestore */ .ad)(app);
function IndexPage() {
    var testRequest = function() {
        var _ref = _asyncToGenerator(_Users_kdy1_projects_lab_fb9_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
            var result;
            return _Users_kdy1_projects_lab_fb9_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.prev = 0;
                        _ctx.next = 3;
                        return (0,_firebase_firestore__WEBPACK_IMPORTED_MODULE_5__/* .getDoc */ .QT)((0,_firebase_firestore__WEBPACK_IMPORTED_MODULE_5__/* .doc */ .JU)(store, "users", "testid"));
                    case 3:
                        result = _ctx.sent;
                        console.log("test result", {
                            docSnap: result.data()
                        });
                        _ctx.next = 10;
                        break;
                    case 7:
                        _ctx.prev = 7;
                        _ctx.t0 = _ctx["catch"](0);
                        console.log(_ctx.t0);
                    case 10:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee, null, [
                [
                    0,
                    7
                ]
            ]);
        }));
        return function testRequest() {
            return _ref.apply(this, arguments);
        };
    }();
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function() {
        testRequest();
    }, []);
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        children: [
            "Hello World.",
            " ",
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3__["default"], {
                href: "/about",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
                    children: "About"
                })
            })
        ]
    }));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [16,97,774,888,179], function() { return __webpack_exec__(5301); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);