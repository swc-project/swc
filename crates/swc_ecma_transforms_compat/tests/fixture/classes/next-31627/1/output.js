import { useEffect } from "react";
import { select, selectAll } from "d3-selection";
export default function Home() {
    useEffect(()=>{
        new MyClass();
    }, []);
    return {};
};
let MyClass = function MyClass() {
    "use strict";
    _classCallCheck(this, MyClass);
    selectAll(".group").each(function() {
        select(this).selectAll("path");
    });
};
