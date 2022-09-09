export const def = {
    code (e) {
        const { gen: o , schema: t , parentSchema: r , data: i , it: a  } = e;
        if (a.opts.removeAdditional === "all" && r.additionalProperties === undefined) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(a, additionalProperties_1.default, "additionalProperties"));
        }
        const d = (0, code_1.allSchemaProperties)(t);
        for (const s of d){
            a.definedProperties.add(s);
        }
        if (a.opts.unevaluated && d.length && a.props !== true) {
            a.props = util_1.mergeEvaluated.props(o, (0, util_1.toHash)(d), a.props);
        }
        const n = d.filter((e)=>!(0, util_1.alwaysValidSchema)(a, t[e]));
        if (n.length === 0) return;
        const l = o.name("valid");
        for (const p of n){
            if (f(p)) {
                u(p);
            } else {
                o.if((0, code_1.propertyInData)(o, i, p, a.opts.ownProperties));
                u(p);
                if (!a.allErrors) o.else().var(l, true);
                o.endIf();
            }
            e.it.definedProperties.add(p);
            e.ok(l);
        }
        function f(e) {
            return (a.opts.useDefaults && !a.compositeRule && t[e].default !== undefined);
        }
        function u(o) {
            e.subschema({
                keyword: "properties",
                schemaProp: o,
                dataProp: o
            }, l);
        }
    }
};
