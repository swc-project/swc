//// [emitExponentiationOperatorInTemplateString3ES6.ts]
var t1 = 10;
var t2 = 10;
var s;
// With TemplateTail
`${Math.pow(t1, t2)} world`;
`${Math.pow(t1, Math.pow(t2, t1))} world`;
`${t1 + Math.pow(t2, t1)} world`;
`${Math.pow(t1, t2) + t1} world`;
`${t1 + Math.pow(t2, t2) + t1} world`;
`${typeof Math.pow(t1, Math.pow(t2, t1))} world`;
`${1 + typeof Math.pow(t1, Math.pow(t2, t1))} world`;
`${Math.pow(t1, t2)}${Math.pow(t1, t2)} world`;
`${Math.pow(t1, Math.pow(t2, t1))}${Math.pow(t1, Math.pow(t2, t1))} world`;
`${t1 + Math.pow(t2, t1)}${t1 + Math.pow(t2, t1)} world`;
`${Math.pow(t1, t2) + t1}${Math.pow(t1, t2) + t1} world`;
`${t1 + Math.pow(t2, t2) + t1}${t1 + Math.pow(t2, t2) + t1} world`;
`${typeof Math.pow(t1, Math.pow(t2, t1))}${typeof Math.pow(t1, Math.pow(t2, t1))} world`;
`${Math.pow(t1, t2)} hello world ${Math.pow(t1, t2)} !!`;
`${Math.pow(t1, Math.pow(t2, t1))} hello world ${Math.pow(t1, Math.pow(t2, t1))} !!`;
`${t1 + Math.pow(t2, t1)} hello world ${t1 + Math.pow(t2, t1)} !!`;
`${Math.pow(t1, t2) + t1} hello world ${Math.pow(t1, t2) + t1} !!`;
`${t1 + Math.pow(t2, t2) + t1} hello world ${t1 + Math.pow(t2, t2) + t1} !!`;
`${typeof Math.pow(t1, Math.pow(t2, t1))} hello world ${typeof Math.pow(t1, Math.pow(t2, t1))} !!`;
