// Loaded from https://cdn.esm.sh/v45/range-parser@1.2.1/es2015/range-parser.js


/* esm.sh - esbuild bundle(range-parser@1.2.1) es2015 production */
var v=Object.create;var d=Object.defineProperty;var l=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var c=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty;var N=t=>d(t,"__esModule",{value:!0});var y=(t,r)=>()=>(r||t((r={exports:{}}).exports,r),r.exports);var g=(t,r,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let e of m(r))!h.call(t,e)&&e!=="default"&&d(t,e,{get:()=>r[e],enumerable:!(i=l(r,e))||i.enumerable});return t},I=t=>g(N(d(t!=null?v(c(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var x=y((P,p)=>{"use strict";p.exports=b;function b(t,r,i){if(typeof r!="string")throw new TypeError("argument str must be a string");var e=r.indexOf("=");if(e===-1)return-2;var o=r.slice(e+1).split(","),n=[];n.type=r.slice(0,e);for(var s=0;s<o.length;s++){var u=o[s].split("-"),f=parseInt(u[0],10),a=parseInt(u[1],10);isNaN(f)?(f=t-a,a=t-1):isNaN(a)&&(a=t-1),a>t-1&&(a=t-1),!(isNaN(f)||isNaN(a)||f>a||f<0)&&n.push({start:f,end:a})}return n.length<1?-1:i&&i.combine?R(n):n}function R(t){for(var r=t.map(w).sort(E),i=0,e=1;e<r.length;e++){var o=r[e],n=r[i];o.start>n.end+1?r[++i]=o:o.end>n.end&&(n.end=o.end,n.index=Math.min(n.index,o.index))}r.length=i+1;var s=r.sort(W).map(B);return s.type=t.type,s}function w(t,r){return{start:t.start,end:t.end,index:r}}function B(t){return{start:t.start,end:t.end}}function W(t,r){return t.index-r.index}function E(t,r){return t.start-r.start}});var M=I(x());var export_default=M.default;export{export_default as default};
/*!
 * range-parser
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */
