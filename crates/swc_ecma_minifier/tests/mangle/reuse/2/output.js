function a(a, b = {}, c = false) {
    return {
        rule: a,
        params: b,
        implicit: c
    };
}
function b(b) {
    if (typeof b === "undefined") {
        return a("nullable", {
            value: b
        }, true);
    }
}
function c(a) {
    return a.find((a)=>a === b) ? true : false;
}
function d(a) {
    return a === undefined || a === null || a === "";
}
function e(b) {
    return d(b) ? a("required", {
        value: b
    }, true) : undefined;
}
function f(a) {
    return a.find((a)=>a === e) ? false : true;
}
const g = (a, b, c, d)=>{
    b.attr = c;
    if (typeof a === "function") {
        return a(b, d || "");
    } else {
        for(let e in b){
            a = a.replace(`:${e}`, b[e]);
        }
        return a;
    }
};
const h = (a)=>{
    const b = a.split(":");
    b.shift();
    return b.join(":");
};
const i = (a, b, c, d, e)=>{
    return (a[`${b}.${c}`] || a[`${b}.${d}`] || a[b] || a[c] || a[d] || e);
};
const j = (a, { messages: b , attributes: c  })=>{
    const d = {};
    const e = (b || {})["default"] || ":attr is invalid";
    for(let f in a){
        const k = a[f];
        const l = (c || {})[f] || f;
        d[f] = {};
        for (let m of k){
            const n = h(m.rule);
            const o = n ? m.rule.substr(0, m.rule.length - n.length - 1) : m.rule;
            if (m.rule === "validateObject" && m.params.errors) {
                d[f][o] = j(m.params.errors, {
                    messages: b,
                    attributes: c
                });
            } else if (m.rule === "validateArray" && m.params.errors) {
                d[f][o] = j(m.params.errors, {
                    messages: b,
                    attributes: c
                });
            } else {
                const p = i(b || {}, f, m.rule, o, e);
                d[f][o] = g(p, m.params, l, n);
            }
        }
    }
    return d;
};
const k = (a)=>{
    return a.match(/^\d+$/) ? true : false;
};
const l = (a, b)=>{
    if (typeof a[b] !== "undefined") {
        return a[b];
    }
    const c = b.split(".");
    const d = c.reduce((a, b)=>{
        if (a && typeof a === "object") {
            return a[b];
        } else if (a instanceof Array && k(b)) {
            const c = parseInt(b);
            return a[c];
        }
    }, {
        ...a
    });
    return d;
};
const m = (a, b)=>{
    const c = l(a, b);
    return typeof c !== "undefined";
};
const n = (a)=>{
    return {
        getValue: (b)=>l(a, b),
        hasValue: (b)=>m(a, b)
    };
};
const o = {
    "fileExists:pathCheck": "file :value doesn't exists",
    "fileExists:stringCheck": "file path must be a string",
    isArray: ":attr must be an array",
    isBool: ":attr must be a boolean",
    isEmail: ":attr is not a valid email address",
    isFloat: ":attr must be a float number",
    isIn: ":value is not allowed",
    isInt: ":attr must be an integer",
    isNumber: ":attr must be a number",
    isNumeric: ":attr must be numeric",
    isString: ":attr must be a string",
    lengthBetween: ":attr characters length must be between :minLength-:maxLength",
    match: ":attr format is incorrect",
    maxLength: ":attr cannot be higher than :maxValue characters",
    maxNumber: ":attr cannot be higher than :maxValue",
    minLength: ":attr cannot be lower than :minValue characters",
    minNumber: ":attr cannot be lower than :minValue",
    notIn: ":value is not allowed",
    notNull: ":value cannot be null",
    numberBetween: ":value must be between :minValue - :maxValue",
    required: ":attr is required",
    default: ":attr is invalid"
};
const p = (a, b)=>{
    return a[b];
};
const q = new Set([
    "requiredWhenRule",
    "requiredIfRule",
    "requiredUnlessRule", 
]);
const r = async (a, b, e)=>{
    const g = [];
    if (d(a) && f(b)) {
        const h = b.filter((a)=>q.has(a.name));
        if (h.length === 0) {
            return [];
        }
        for (let i of b.filter((a)=>q.has(a.name))){
            let j = i(a, e);
            if (j instanceof Promise) {
                j = await j;
            }
            if (j !== undefined && j.noContext) {
                return [];
            }
            if (j !== undefined) {
                g.push(j);
                if (j.implicit) {
                    return g;
                }
            }
        }
        b = b.filter((a)=>!q.has(a.name));
    }
    if (typeof a === "object" && a === null && c(b)) {
        return [];
    }
    for (let k of b){
        let l = k(a, e);
        if (l instanceof Promise) {
            l = await l;
        }
        if (l !== undefined && !l.noContext) {
            g.push(l);
            if (l.implicit === true) {
                break;
            }
        }
    }
    return g;
};
const s = async (a, b)=>{
    const c = {};
    const d = n(a);
    for(let e in b){
        const f = b[e] instanceof Array ? b[e] : [
            b[e]
        ];
        const g = p(a, e);
        const h = await r(g, f, d);
        if (h.length) {
            c[e] = h;
        }
    }
    return c;
};
const t = async (a, b, c = {
    messages: o
})=>{
    const d = await s(a, b);
    const e = Object.keys(d).length === 0;
    const f = e ? {} : j(d, c);
    return [
        e,
        f
    ];
};
function u(b) {
    if (typeof b !== "number") {
        return a("isNumber", {
            value: b
        });
    }
}
const v = {
    name: "",
    age: "20"
};
const [w, x] = await t(v, {
    name: e,
    age: [
        e,
        u
    ]
});
console.log({
    passes: w,
    errors: x
});
