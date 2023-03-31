"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _Bar = require("./Bar");
const makeX = (props)=>{
    const _bar = props.bar;
    const { list  } = _bar;
    return list.map(()=>_Bar.bar);
};
