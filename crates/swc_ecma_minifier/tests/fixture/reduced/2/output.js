export const def = {
    code (cxt) {
        const { gen , schema , parentSchema , data , it  } = cxt;
        "all" === it.opts.removeAdditional && void 0 === parentSchema.additionalProperties && additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop2 of allProps)it.definedProperties.add(prop2);
        it.opts.unevaluated && allProps.length && !0 !== it.props && (it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props));
        const properties = allProps.filter((p)=>!(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (0 === properties.length) return;
        const valid = gen.name("valid");
        for (const prop1 of properties)hasDefault(prop1) ? applyPropertySchema(prop1) : (gen.if((0, code_1.propertyInData)(gen, data, prop1, it.opts.ownProperties)), applyPropertySchema(prop1), it.allErrors || gen.else().var(valid, !0), gen.endIf()), cxt.it.definedProperties.add(prop1), cxt.ok(valid);
        function hasDefault(prop) {
            return it.opts.useDefaults && !it.compositeRule && void 0 !== schema[prop].default;
        }
        function applyPropertySchema(prop) {
            cxt.subschema({
                keyword: "properties",
                schemaProp: prop,
                dataProp: prop
            }, valid);
        }
    }
};
