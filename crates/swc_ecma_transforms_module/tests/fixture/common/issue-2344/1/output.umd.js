(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
    class LoggingButton extends React.Component {
        handleClick = ()=>{
            console.log("this is:", this);
        };
        m() {
            this;
        }
        static a = ()=>this;
    }
});
