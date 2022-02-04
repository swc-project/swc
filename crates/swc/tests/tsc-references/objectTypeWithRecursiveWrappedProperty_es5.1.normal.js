function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var List = function List() {
    "use strict";
    _classCallCheck(this, List);
};
var list1 = new List();
var list2 = new List();
var list3 = new List();
list1 = list2; // ok
list1 = list3; // error
