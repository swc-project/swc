function a(b, c = {
}, d = false) {
    return {
        rule: b,
        params: c,
        implicit: d
    };
}
function b(c) {
    if (typeof c === "undefined") {
        return a("nullable", {
            value: c
        }, true);
    }
}
function c(a) {
    return a.find((d)=>d === b
    ) ? true : false;
}
function d(a) {
    return a === undefined || a === null || a === "";
}
function e(c) {
    return d(c) ? a("required", {
        value: c
    }, true) : undefined;
}
function f(a) {
    return a.find((b)=>b === e
    ) ? false : true;
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
    return a[`${b}.${c}`] || a[`${b}.${d}`] || a[b] || a[c] || a[d] || e;
};
const j = (a, { messages , attributes  })=>{
    const d = {
    };
    const e = (messages || {
    })["default"] || ":attr is invalid";
    for(let f in a){
        const k = a[f];
        const l = (attributes || {
        })[f] || f;
        d[f] = {
        };
        for (let m of k){
            const n = h(m.rule);
            const o = n ? m.rule.substr(0, m.rule.length - n.length - 1) : m.rule;
            if (m.rule === "validateObject" && m.params.errors) {
                d[f][o] = j(m.params.errors, {
                    messages,
                    attributes
                });
            } else if (m.rule === "validateArray" && m.params.errors) {
                d[f][o] = j(m.params.errors, {
                    messages,
                    attributes
                });
            } else {
                const p = i(messages || {
                }, f, m.rule, o, e);
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
    const d = c.reduce((e, f)=>{
        if (e && typeof e === "object") {
            return e[f];
        } else if (e instanceof Array && k(f)) {
            const h = parseInt(f);
            return e[h];
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
        getValue: (b)=>l(a, b)
        ,
        hasValue: (c)=>m(a, c)
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
const r = async (a, e, g)=>{
    const h = [];
    if (d(a) && f(e)) {
        const i = e.filter((j)=>q.has(j.name)
        );
        if (i.length === 0) {
            return [];
        }
        for (let k of e.filter((l)=>q.has(l.name)
        )){
            let m = k(a, g);
            if (m instanceof Promise) {
                m = await m;
            }
            if (m !== undefined && m.noContext) {
                return [];
            }
            if (m !== undefined) {
                h.push(m);
                if (m.implicit) {
                    return h;
                }
            }
        }
        e = e.filter((o)=>!q.has(o.name)
        );
    }
    if (typeof a === "object" && a === null && c(e)) {
        return [];
    }
    for (let p of e){
        let r = p(a, g);
        if (r instanceof Promise) {
            r = await r;
        }
        if (r !== undefined && !r.noContext) {
            h.push(r);
            if (r.implicit === true) {
                break;
            }
        }
    }
    return h;
};
const s = async (a, b)=>{
    const c = {
    };
    const d = n(a);
    for(let e in b){
        const f = b[e] instanceof Array ? b[e] : [
            b[e]
        ];
        const h = p(a, e);
        const i = await r(h, f, d);
        if (i.length) {
            c[e] = i;
        }
    }
    return c;
};
const t = async (a, b, c = {
    messages: o
})=>{
    const d = await s(a, b);
    const e = Object.keys(d).length === 0;
    const g = e ? {
    } : j(d, c);
    return [
        e,
        g
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
