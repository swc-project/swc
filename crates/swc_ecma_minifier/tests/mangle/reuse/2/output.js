function e(e, t = {}, n = false) {
    return {
        rule: e,
        params: t,
        implicit: n
    };
}
function t(t) {
    if (typeof t === "undefined") {
        return e("nullable", {
            value: t
        }, true);
    }
}
function n(e) {
    return e.find((e)=>e === t) ? true : false;
}
function r(e) {
    return e === undefined || e === null || e === "";
}
function a(t) {
    return r(t) ? e("required", {
        value: t
    }, true) : undefined;
}
function s(e) {
    return e.find((e)=>e === a) ? false : true;
}
const i = (e, t, n, r)=>{
    t.attr = n;
    if (typeof e === "function") {
        return e(t, r || "");
    } else {
        for(let a in t){
            e = e.replace(`:${a}`, t[a]);
        }
        return e;
    }
};
const u = (e)=>{
    const t = e.split(":");
    t.shift();
    return t.join(":");
};
const o = (e, t, n, r, a)=>{
    return (e[`${t}.${n}`] || e[`${t}.${r}`] || e[t] || e[n] || e[r] || a);
};
const l = (e, { messages: t , attributes: n  })=>{
    const r = {};
    const a = (t || {})["default"] || ":attr is invalid";
    for(let s in e){
        const c = e[s];
        const f = (n || {})[s] || s;
        r[s] = {};
        for (let m of c){
            const d = u(m.rule);
            const h = d ? m.rule.substr(0, m.rule.length - d.length - 1) : m.rule;
            if (m.rule === "validateObject" && m.params.errors) {
                r[s][h] = l(m.params.errors, {
                    messages: t,
                    attributes: n
                });
            } else if (m.rule === "validateArray" && m.params.errors) {
                r[s][h] = l(m.params.errors, {
                    messages: t,
                    attributes: n
                });
            } else {
                const b = o(t || {}, s, m.rule, h, a);
                r[s][h] = i(b, m.params, f, d);
            }
        }
    }
    return r;
};
const c = (e)=>{
    return e.match(/^\d+$/) ? true : false;
};
const f = (e, t)=>{
    if (typeof e[t] !== "undefined") {
        return e[t];
    }
    const n = t.split(".");
    const r = n.reduce((e, t)=>{
        if (e && typeof e === "object") {
            return e[t];
        } else if (e instanceof Array && c(t)) {
            const n = parseInt(t);
            return e[n];
        }
    }, {
        ...e
    });
    return r;
};
const m = (e, t)=>{
    const n = f(e, t);
    return typeof n !== "undefined";
};
const d = (e)=>{
    return {
        getValue: (t)=>f(e, t),
        hasValue: (t)=>m(e, t)
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
const b = (e, t)=>{
    return e[t];
};
const g = new Set([
    "requiredWhenRule",
    "requiredIfRule",
    "requiredUnlessRule"
]);
const p = async (e, t, a)=>{
    const i = [];
    if (r(e) && s(t)) {
        const u = t.filter((e)=>g.has(e.name));
        if (u.length === 0) {
            return [];
        }
        for (let o of t.filter((e)=>g.has(e.name))){
            let l = o(e, a);
            if (l instanceof Promise) {
                l = await l;
            }
            if (l !== undefined && l.noContext) {
                return [];
            }
            if (l !== undefined) {
                i.push(l);
                if (l.implicit) {
                    return i;
                }
            }
        }
        t = t.filter((e)=>!g.has(e.name));
    }
    if (typeof e === "object" && e === null && n(t)) {
        return [];
    }
    for (let c of t){
        let f = c(e, a);
        if (f instanceof Promise) {
            f = await f;
        }
        if (f !== undefined && !f.noContext) {
            i.push(f);
            if (f.implicit === true) {
                break;
            }
        }
    }
    return i;
};
const y = async (e, t)=>{
    const n = {};
    const r = d(e);
    for(let a in t){
        const s = t[a] instanceof Array ? t[a] : [
            t[a]
        ];
        const i = b(e, a);
        const u = await p(i, s, r);
        if (u.length) {
            n[a] = u;
        }
    }
    return n;
};
const w = async (e, t, n = {
    messages: h
})=>{
    const r = await y(e, t);
    const a = Object.keys(r).length === 0;
    const s = a ? {} : l(r, n);
    return [
        a,
        s
    ];
};
function x(t) {
    if (typeof t !== "number") {
        return e("isNumber", {
            value: t
        });
    }
}
const v = {
    name: "",
    age: "20"
};
const [V, q] = await w(v, {
    name: a,
    age: [
        a,
        x
    ]
});
console.log({
    passes: V,
    errors: q
});
