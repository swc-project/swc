function t(t, e = {}, n = false) {
    return {
        rule: t,
        params: e,
        implicit: n
    };
}
function e(e) {
    if (typeof e === "undefined") {
        return t("nullable", {
            value: e
        }, true);
    }
}
function n(t) {
    return t.find((t)=>t === e) ? true : false;
}
function r(t) {
    return t === undefined || t === null || t === "";
}
function a(e) {
    return r(e) ? t("required", {
        value: e
    }, true) : undefined;
}
function s(t) {
    return t.find((t)=>t === a) ? false : true;
}
const i = (t, e, n, r)=>{
    e.attr = n;
    if (typeof t === "function") {
        return t(e, r || "");
    } else {
        for(let a in e){
            t = t.replace(`:${a}`, e[a]);
        }
        return t;
    }
};
const u = (t)=>{
    const e = t.split(":");
    e.shift();
    return e.join(":");
};
const o = (t, e, n, r, a)=>{
    return (t[`${e}.${n}`] || t[`${e}.${r}`] || t[e] || t[n] || t[r] || a);
};
const l = (t, { messages: e , attributes: n  })=>{
    const r = {};
    const a = (e || {})["default"] || ":attr is invalid";
    for(let s in t){
        const c = t[s];
        const f = (n || {})[s] || s;
        r[s] = {};
        for (let m of c){
            const h = u(m.rule);
            const b = h ? m.rule.substr(0, m.rule.length - h.length - 1) : m.rule;
            if (m.rule === "validateObject" && m.params.errors) {
                r[s][b] = l(m.params.errors, {
                    messages: e,
                    attributes: n
                });
            } else if (m.rule === "validateArray" && m.params.errors) {
                r[s][b] = l(m.params.errors, {
                    messages: e,
                    attributes: n
                });
            } else {
                const d = o(e || {}, s, m.rule, b, a);
                r[s][b] = i(d, m.params, f, h);
            }
        }
    }
    return r;
};
const c = (t)=>{
    return t.match(/^\d+$/) ? true : false;
};
const f = (t, e)=>{
    if (typeof t[e] !== "undefined") {
        return t[e];
    }
    const n = e.split(".");
    const r = n.reduce((t, e)=>{
        if (t && typeof t === "object") {
            return t[e];
        } else if (t instanceof Array && c(e)) {
            const n = parseInt(e);
            return t[n];
        }
    }, {
        ...t
    });
    return r;
};
const m = (t, e)=>{
    const n = f(t, e);
    return typeof n !== "undefined";
};
const h = (t)=>{
    return {
        getValue: (e)=>f(t, e),
        hasValue: (e)=>m(t, e)
    };
};
const b = {
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
const d = (t, e)=>{
    return t[e];
};
const g = new Set([
    "requiredWhenRule",
    "requiredIfRule",
    "requiredUnlessRule", 
]);
const p = async (t, e, a)=>{
    const i = [];
    if (r(t) && s(e)) {
        const u = e.filter((t)=>g.has(t.name));
        if (u.length === 0) {
            return [];
        }
        for (let o of e.filter((t)=>g.has(t.name))){
            let l = o(t, a);
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
        e = e.filter((t)=>!g.has(t.name));
    }
    if (typeof t === "object" && t === null && n(e)) {
        return [];
    }
    for (let c of e){
        let f = c(t, a);
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
const w = async (t, e)=>{
    const n = {};
    const r = h(t);
    for(let a in e){
        const s = e[a] instanceof Array ? e[a] : [
            e[a]
        ];
        const i = d(t, a);
        const u = await p(i, s, r);
        if (u.length) {
            n[a] = u;
        }
    }
    return n;
};
const y = async (t, e, n = {
    messages: b
})=>{
    const r = await w(t, e);
    const a = Object.keys(r).length === 0;
    const s = a ? {} : l(r, n);
    return [
        a,
        s
    ];
};
function x(e) {
    if (typeof e !== "number") {
        return t("isNumber", {
            value: e
        });
    }
}
const v = {
    name: "",
    age: "20"
};
const [V, q] = await y(v, {
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
