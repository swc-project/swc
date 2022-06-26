define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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
