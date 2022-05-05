function g(a, b = {}, c = false) {
    return {
        rule: a,
        params: b,
        implicit: c
    };
}
function h(a) {
    if (typeof a === "undefined") {
        return g("nullable", {
            value: a
        }, true);
    }
}
function i(a) {
    return a.find((a)=>a === h
    ) ? true : false;
}
function j(a) {
    return a === undefined || a === null || a === "";
}
function a(a) {
    return j(a) ? g("required", {
        value: a
    }, true) : undefined;
}
function k(b) {
    return b.find((b)=>b === a
    ) ? false : true;
}
const l = (a, b, d, e)=>{
    b.attr = d;
    if (typeof a === "function") {
        return a(b, e || "");
    } else {
        for(let c in b){
            a = a.replace(`:${c}`, b[c]);
        }
        return a;
    }
};
const m = (b)=>{
    const a = b.split(":");
    a.shift();
    return a.join(":");
};
const n = (a, b, c, d, e)=>{
    return (a[`${b}.${c}`] || a[`${b}.${d}`] || a[b] || a[c] || a[d] || e);
};
const o = (h, { messages: d , attributes: f  })=>{
    const c = {};
    const i = (d || {})["default"] || ":attr is invalid";
    for(let b in h){
        const j = h[b];
        const k = (f || {})[b] || b;
        c[b] = {};
        for (let a of j){
            const g = m(a.rule);
            const e = g ? a.rule.substr(0, a.rule.length - g.length - 1) : a.rule;
            if (a.rule === "validateObject" && a.params.errors) {
                c[b][e] = o(a.params.errors, {
                    messages: d,
                    attributes: f
                });
            } else if (a.rule === "validateArray" && a.params.errors) {
                c[b][e] = o(a.params.errors, {
                    messages: d,
                    attributes: f
                });
            } else {
                const p = n(d || {}, b, a.rule, e, i);
                c[b][e] = l(p, a.params, k, g);
            }
        }
    }
    return c;
};
const p = (a)=>{
    return a.match(/^\d+$/) ? true : false;
};
const q = (a, b)=>{
    if (typeof a[b] !== "undefined") {
        return a[b];
    }
    const c = b.split(".");
    const d = c.reduce((a, b)=>{
        if (a && typeof a === "object") {
            return a[b];
        } else if (a instanceof Array && p(b)) {
            const c = parseInt(b);
            return a[c];
        }
    }, {
        ...a
    });
    return d;
};
const r = (a, b)=>{
    const c = q(a, b);
    return typeof c !== "undefined";
};
const s = (a)=>{
    return {
        getValue: (b)=>q(a, b)
        ,
        hasValue: (b)=>r(a, b)
    };
};
const t = {
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
const u = (a, b)=>{
    return a[b];
};
const v = new Set([
    "requiredWhenRule",
    "requiredIfRule",
    "requiredUnlessRule", 
]);
const w = async (d, b, f)=>{
    const e = [];
    if (j(d) && k(b)) {
        const g = b.filter((a)=>v.has(a.name)
        );
        if (g.length === 0) {
            return [];
        }
        for (let h of b.filter((a)=>v.has(a.name)
        )){
            let a = h(d, f);
            if (a instanceof Promise) {
                a = await a;
            }
            if (a !== undefined && a.noContext) {
                return [];
            }
            if (a !== undefined) {
                e.push(a);
                if (a.implicit) {
                    return e;
                }
            }
        }
        b = b.filter((a)=>!v.has(a.name)
        );
    }
    if (typeof d === "object" && d === null && i(b)) {
        return [];
    }
    for (let l of b){
        let c = l(d, f);
        if (c instanceof Promise) {
            c = await c;
        }
        if (c !== undefined && !c.noContext) {
            e.push(c);
            if (c.implicit === true) {
                break;
            }
        }
    }
    return e;
};
const x = async (c, b)=>{
    const d = {};
    const f = s(c);
    for(let a in b){
        const g = b[a] instanceof Array ? b[a] : [
            b[a]
        ];
        const h = u(c, a);
        const e = await w(h, g, f);
        if (e.length) {
            d[a] = e;
        }
    }
    return d;
};
const b = async (c, d, e = {
    messages: t
})=>{
    const a = await x(c, d);
    const b = Object.keys(a).length === 0;
    const f = b ? {} : o(a, e);
    return [
        b,
        f
    ];
};
function c(a) {
    if (typeof a !== "number") {
        return g("isNumber", {
            value: a
        });
    }
}
const d = {
    name: "",
    age: "20"
};
const [e, f] = await b(d, {
    name: a,
    age: [
        a,
        c
    ]
});
console.log({
    passes: e,
    errors: f
});
