export const def = {
    code (e) {
        const { gen: b , schema: h , parentSchema: i , data: j , it: a  } = e;
        if (a.opts.removeAdditional === "all" && i.additionalProperties === undefined) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(a, additionalProperties_1.default, "additionalProperties"));
        }
        const d = (0, code_1.allSchemaProperties)(h);
        for (const k of d){
            a.definedProperties.add(k);
        }
        if (a.opts.unevaluated && d.length && a.props !== true) {
            a.props = util_1.mergeEvaluated.props(b, (0, util_1.toHash)(d), a.props);
        }
        const f = d.filter((b)=>!(0, util_1.alwaysValidSchema)(a, h[b]));
        if (f.length === 0) return;
        const g = b.name("valid");
        for (const c of f){
            if (l(c)) {
                m(c);
            } else {
                b.if((0, code_1.propertyInData)(b, j, c, a.opts.ownProperties));
                m(c);
                if (!a.allErrors) b.else().var(g, true);
                b.endIf();
            }
            e.it.definedProperties.add(c);
            e.ok(g);
        }
        function l(b) {
            return (a.opts.useDefaults && !a.compositeRule && h[b].default !== undefined);
        }
        function m(a) {
            e.subschema({
                keyword: "properties",
                schemaProp: a,
                dataProp: a
            }, g);
        }
    }
};
