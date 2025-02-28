function t(e, n = {}, r = false) {
    return {
        rule: e,
        params: n,
        implicit: r
    };
}
function u(e) {
    if (typeof e === "undefined") {
        return t("nullable", {
            value: e
        }, true);
    }
}
function o(e) {
    return e.find((e)=>e === u) ? true : false;
}
function l(e) {
    return e === undefined || e === null || e === "";
}
function e(e) {
    return l(e) ? t("required", {
        value: e
    }, true) : undefined;
}
function c(t) {
    return t.find((t)=>t === e) ? false : true;
}
const f = (e, t, n, r)=>{
    t.attr = n;
    if (typeof e === "function") {
        return e(t, r || "");
    } else {
        for(let n in t){
            e = e.replace(`:${n}`, t[n]);
        }
        return e;
    }
};
const m = (t)=>{
    const e = t.split(":");
    e.shift();
    return e.join(":");
};
const d = (e, t, n, r, a)=>{
    return (e[`${t}.${n}`] || e[`${t}.${r}`] || e[t] || e[n] || e[r] || a);
};
const h = (n, { messages: e, attributes: r })=>{
    const t = {};
    const a = (e || {})["default"] || ":attr is invalid";
    for(let s in n){
        const i = n[s];
        const u = (r || {})[s] || s;
        t[s] = {};
        for (let n of i){
            const i = m(n.rule);
            const o = i ? n.rule.substr(0, n.rule.length - i.length - 1) : n.rule;
            if (n.rule === "validateObject" && n.params.errors) {
                t[s][o] = h(n.params.errors, {
                    messages: e,
                    attributes: r
                });
            } else if (n.rule === "validateArray" && n.params.errors) {
                t[s][o] = h(n.params.errors, {
                    messages: e,
                    attributes: r
                });
            } else {
                const r = d(e || {}, s, n.rule, o, a);
                t[s][o] = f(r, n.params, u, i);
            }
        }
    }
    return t;
};
const b = (e)=>{
    return e.match(/^\d+$/) ? true : false;
};
const g = (e, t)=>{
    if (typeof e[t] !== "undefined") {
        return e[t];
    }
    const n = t.split(".");
    const r = n.reduce((e, t)=>{
        if (e && typeof e === "object") {
            return e[t];
        } else if (e instanceof Array && b(t)) {
            const n = parseInt(t);
            return e[n];
        }
    }, {
        ...e
    });
    return r;
};
const p = (e, t)=>{
    const n = g(e, t);
    return typeof n !== "undefined";
};
const y = (e)=>{
    return {
        getValue: (t)=>g(e, t),
        hasValue: (t)=>p(e, t)
    };
};
const w = {
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
const x = (e, t)=>{
    return e[t];
};
const v = new Set([
    "requiredWhenRule",
    "requiredIfRule",
    "requiredUnlessRule"
]);
const V = async (e, t, r)=>{
    const n = [];
    if (l(e) && c(t)) {
        const a = t.filter((e)=>v.has(e.name));
        if (a.length === 0) {
            return [];
        }
        for (let a of t.filter((e)=>v.has(e.name))){
            let t = a(e, r);
            if (t instanceof Promise) {
                t = await t;
            }
            if (t !== undefined && t.noContext) {
                return [];
            }
            if (t !== undefined) {
                n.push(t);
                if (t.implicit) {
                    return n;
                }
            }
        }
        t = t.filter((e)=>!v.has(e.name));
    }
    if (typeof e === "object" && e === null && o(t)) {
        return [];
    }
    for (let a of t){
        let t = a(e, r);
        if (t instanceof Promise) {
            t = await t;
        }
        if (t !== undefined && !t.noContext) {
            n.push(t);
            if (t.implicit === true) {
                break;
            }
        }
    }
    return n;
};
const q = async (e, n)=>{
    const t = {};
    const r = y(e);
    for(let a in n){
        const s = n[a] instanceof Array ? n[a] : [
            n[a]
        ];
        const i = x(e, a);
        const u = await V(i, s, r);
        if (u.length) {
            t[a] = u;
        }
    }
    return t;
};
const n = async (n, r, a = {
    messages: w
})=>{
    const e = await q(n, r);
    const t = Object.keys(e).length === 0;
    const s = t ? {} : h(e, a);
    return [
        t,
        s
    ];
};
function r(e) {
    if (typeof e !== "number") {
        return t("isNumber", {
            value: e
        });
    }
}
const a = {
    name: "",
    age: "20"
};
const [s, i] = await n(a, {
    name: e,
    age: [
        e,
        r
    ]
});
console.log({
    passes: s,
    errors: i
});
