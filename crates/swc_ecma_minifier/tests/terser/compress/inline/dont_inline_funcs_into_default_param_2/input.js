"use strict";
const foo = () => 42;
const getData = (val) => ({ val: val });
const print = (data = getData(foo())) => {
    data.val === 42 && pass();
};
print();
