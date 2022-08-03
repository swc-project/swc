function t(t, n = {}, e = false) {
    return {
        rule: t,
        params: n,
        implicit: e
    };
}
function n(n) {
    if (typeof n === "undefined") {
        return t("nullable", {
            value: n
        }, true);
    }
}
function e(t) {
    return t.find((t)=>t === n) ? true : false;
}
function r(t) {
    return t === undefined || t === null || t === "";
}
function s(n) {
    return r(n) ? t("required", {
        value: n
    }, true) : undefined;
}
function o(t) {
    return t.find((t)=>t === s) ? false : true;
}
const i = (t, n, e, r)=>{
    n.attr = e;
    if (typeof t === "function") {
        return t(n, r || "");
    } else {
        for(let s in n){
            t = t.replace(`:${s}`, n[s]);
        }
        return t;
    }
};
const u = (t)=>{
    const n = t.split(":");
    n.shift();
    return n.join(":");
};
const c = (t, n, e, r, s)=>{
    return (t[`${n}.${e}`] || t[`${n}.${r}`] || t[n] || t[e] || t[r] || s);
};
const f = (t, { messages: n , attributes: e  })=>{
    const r = {};
    const s = (n || {})["default"] || ":attr is invalid";
    for(let o in t){
        const a = t[o];
        const l = (e || {})[o] || o;
        r[o] = {};
        for (let m of a){
            const p = u(m.rule);
            const h = p ? m.rule.substr(0, m.rule.length - p.length - 1) : m.rule;
            if (m.rule === "validateObject" && m.params.errors) {
                r[o][h] = f(m.params.errors, {
                    messages: n,
                    attributes: e
                });
            } else if (m.rule === "validateArray" && m.params.errors) {
                r[o][h] = f(m.params.errors, {
                    messages: n,
                    attributes: e
                });
            } else {
                const g = c(n || {}, o, m.rule, h, s);
                r[o][h] = i(g, m.params, l, p);
            }
        }
    }
    return r;
};
const a = (t)=>{
    return t.match(/^\d+$/) ? true : false;
};
const l = (t, n)=>{
    if (typeof t[n] !== "undefined") {
        return t[n];
    }
    const e = n.split(".");
    const r = e.reduce((t, n)=>{
        if (t && typeof t === "object") {
            return t[n];
        } else if (t instanceof Array && a(n)) {
            const e = parseInt(n);
            return t[e];
        }
    }, {
        ...t
    });
    return r;
};
const m = (t, n)=>{
    const e = l(t, n);
    return typeof e !== "undefined";
};
const p = (t)=>{
    return {
        getValue: (n)=>l(t, n),
        hasValue: (n)=>m(t, n)
    };
};
const h = {
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
const g = (t, n)=>{
    return t[n];
};
const y = new Set([
    "requiredWhenRule",
    "requiredIfRule",
    "requiredUnlessRule", 
]);
const w = async (t, n, s)=>{
    const i = [];
    if (r(t) && o(n)) {
        const u = n.filter((t)=>y.has(t.name));
        if (u.length === 0) {
            return [];
        }
        for (let c of n.filter((t)=>y.has(t.name))){
            let f = c(t, s);
            if (f instanceof Promise) {
                f = await f;
            }
            if (f !== undefined && f.noContext) {
                return [];
            }
            if (f !== undefined) {
                i.push(f);
                if (f.implicit) {
                    return i;
                }
            }
        }
        n = n.filter((t)=>!y.has(t.name));
    }
    if (typeof t === "object" && t === null && e(n)) {
        return [];
    }
    for (let a of n){
        let l = a(t, s);
        if (l instanceof Promise) {
            l = await l;
        }
        if (l !== undefined && !l.noContext) {
            i.push(l);
            if (l.implicit === true) {
                break;
            }
        }
    }
    return i;
};
const b = async (t, n)=>{
    const e = {};
    const r = p(t);
    for(let s in n){
        const o = n[s] instanceof Array ? n[s] : [
            n[s]
        ];
        const i = g(t, s);
        const u = await w(i, o, r);
        if (u.length) {
            e[s] = u;
        }
    }
    return e;
};
const d = async (t, n, e = {
    messages: h
})=>{
    const r = await b(t, n);
    const s = Object.keys(r).length === 0;
    const o = s ? {} : f(r, e);
    return [
        s,
        o
    ];
};
function x(n) {
    if (typeof n !== "number") {
        return t("isNumber", {
            value: n
        });
    }
}
const N = {
    name: "",
    age: "20"
};
const [k, C] = await d(N, {
    name: s,
    age: [
        s,
        x
    ]
});
console.log({
    passes: k,
    errors: C
});
