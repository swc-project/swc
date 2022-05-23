"use strict";
const getData = (val) => ({ val: val });
const print = function (data = getData(id("PASS"))) {
    console.log(data.val);
};
print();
