// Each IIFE runs once per loop iteration and its parameter is captured by a
// deferred evaluation. Inlining the IIFE into the loop body would make every
// closure share one binding and observe only the last iteration.
// See https://github.com/swc-project/swc-ai-issues/issues/313
// The parameter is captured by an arrow parameter default.
function arrowDefault() {
    for(var fs = [], i = 0; i < 2; i++)fs.push(function(value) {
        return (x = value)=>x;
    }(i));
    console.log(fs.map((f)=>f()).join(","));
}
// The parameter is captured by a class instance field initializer.
function classField() {
    for(var fs = [], i = 0; i < 2; i++)fs.push(function(value) {
        return class {
            v = value;
        };
    }(i));
    console.log(fs.map((C)=>new C().v).join(","));
}
// The parameter is captured by an ordinary arrow body.
function arrowBody() {
    for(var fs = [], i = 0; i < 2; i++)fs.push(function(value) {
        return ()=>value;
    }(i));
    console.log(fs.map((f)=>f()).join(","));
}
// The parameter is captured only through a local alias. After the alias is
// inlined, the parameter itself is captured.
function alias() {
    for(var fs = [], i = 0; i < 2; i++)!function(value) {
        fs.push(()=>value);
    }(i);
    console.log(fs.map((f)=>f()).join(","));
}
// A single-use function is inlined into the loop as an IIFE. Its parameter is
// captured only through a local alias.
function singleUseAlias() {
    for(var fs = [], i = 0; i < 2; i++)!function(value) {
        fs.push(function() {
            return value;
        });
    }(i);
    console.log(fs.map((f)=>f()).join(","));
}
// The parameter is captured through a property of a local object.
function objectAlias() {
    for(var fs = [], i = 0; i < 2; i++)!function(value) {
        fs.push(()=>value);
    }(i);
    console.log(fs.map((f)=>f()).join(","));
}
arrowDefault(), classField(), arrowBody(), alias(), singleUseAlias(), objectAlias();
