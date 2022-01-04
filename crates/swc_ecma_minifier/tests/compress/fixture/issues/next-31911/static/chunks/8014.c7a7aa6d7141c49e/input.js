"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[8014],{

/***/ 8014:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ion_img": function() { return /* binding */ Img; }
/* harmony export */ });
/* harmony import */ var _index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5121);
/* harmony import */ var _ionic_global_63a97a32_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3007);
var imgCss=":host{display:block;-o-object-fit:contain;object-fit:contain}img{display:block;width:100%;height:100%;-o-object-fit:inherit;object-fit:inherit;-o-object-position:inherit;object-position:inherit}";var Img=function(){function t(t){var i=this;(0,_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,t);this.ionImgWillLoad=(0,_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__.e)(this,"ionImgWillLoad",7);this.ionImgDidLoad=(0,_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__.e)(this,"ionImgDidLoad",7);this.ionError=(0,_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__.e)(this,"ionError",7);this.onLoad=function(){i.ionImgDidLoad.emit()};this.onError=function(){i.ionError.emit()}}t.prototype.srcChanged=function(){this.addIO()};t.prototype.componentDidLoad=function(){this.addIO()};t.prototype.addIO=function(){var t=this;if(this.src===undefined){return}if(typeof window!=="undefined"&&"IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"isIntersecting"in window.IntersectionObserverEntry.prototype){this.removeIO();this.io=new IntersectionObserver((function(i){if(i[i.length-1].isIntersecting){t.load();t.removeIO()}}));this.io.observe(this.el)}else{setTimeout((function(){return t.load()}),200)}};t.prototype.load=function(){this.loadError=this.onError;this.loadSrc=this.src;this.ionImgWillLoad.emit()};t.prototype.removeIO=function(){if(this.io){this.io.disconnect();this.io=undefined}};t.prototype.render=function(){return (0,_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__.H,{class:(0,_ionic_global_63a97a32_js__WEBPACK_IMPORTED_MODULE_1__.b)(this)},(0,_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__.h)("img",{decoding:"async",src:this.loadSrc,alt:this.alt,onLoad:this.onLoad,onError:this.loadError,part:"image"}))};Object.defineProperty(t.prototype,"el",{get:function(){return (0,_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__.i)(this)},enumerable:false,configurable:true});Object.defineProperty(t,"watchers",{get:function(){return{src:["srcChanged"]}},enumerable:false,configurable:true});return t}();Img.style=imgCss;

/***/ })

}]);