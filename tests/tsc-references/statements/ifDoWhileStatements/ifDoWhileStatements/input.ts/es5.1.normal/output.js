function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var C2 = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(C2, C);
    function C2() {
        _classCallCheck(this, C2);
        return _possibleConstructorReturn(this, _getPrototypeOf(C2).apply(this, arguments));
    }
    return C2;
}(C);
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
function F(x) {
    return 42;
}
function F2(x) {
    return x < 42;
}
var M;
(function(M) {
    var F21 = function F21(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _classCallCheck(this, A);
    };
    M.A = A;
    M.F2 = F21;
})(M || (M = {
}));
var N;
(function(N) {
    var F21 = function F21(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _classCallCheck(this, A);
    };
    N.A = A;
    N.F2 = F21;
})(N || (N = {
}));
// literals
if (true) {
}
while(true){
}
do {
}while (true)
if (null) {
}
while(null){
}
do {
}while (null)
if (undefined) {
}
while(undefined){
}
do {
}while (undefined)
if (0) {
}
while(0){
}
do {
}while (0)
if ('a string') {
}
while('a string'){
}
do {
}while ('a string')
if ('') {
}
while(''){
}
do {
}while ('')
if (/[a-z]/) {
}
while(/[a-z]/){
}
do {
}while (/[a-z]/)
if ([]) {
}
while([]){
}
do {
}while ([])
if ([
    1,
    2
]) {
}
while([
    1,
    2
]){
}
do {
}while ([
    1,
    2
])
if ({
}) {
}
while({
}){
}
do {
}while ({
})
if ({
    x: 1,
    y: 'a'
}) {
}
while({
    x: 1,
    y: 'a'
}){
}
do {
}while ({
    x: 1,
    y: 'a'
})
if (function() {
    return 43;
}) {
}
while(function() {
    return 43;
}){
}
do {
}while (function() {
    return 43;
})
if (new C()) {
}
while(new C()){
}
do {
}while (new C())
if (new D()) {
}
while(new D()){
}
do {
}while (new D())
// references
var a = true;
if (a) {
}
while(a){
}
do {
}while (a)
var b = null;
if (b) {
}
while(b){
}
do {
}while (b)
var c = undefined;
if (c) {
}
while(c){
}
do {
}while (c)
var d = 0;
if (d) {
}
while(d){
}
do {
}while (d)
var e = 'a string';
if (e) {
}
while(e){
}
do {
}while (e)
var f = '';
if (f) {
}
while(f){
}
do {
}while (f)
var g = /[a-z]/;
if (g) {
}
while(g){
}
do {
}while (g)
var h = [];
if (h) {
}
while(h){
}
do {
}while (h)
var i = [
    1,
    2
];
if (i) {
}
while(i){
}
do {
}while (i)
var j = {
};
if (j) {
}
while(j){
}
do {
}while (j)
var k = {
    x: 1,
    y: 'a'
};
if (k) {
}
while(k){
}
do {
}while (k)
function fn(x) {
    return null;
}
if (fn()) {
}
while(fn()){
}
do {
}while (fn())
if (fn) {
}
while(fn){
}
do {
}while (fn)
