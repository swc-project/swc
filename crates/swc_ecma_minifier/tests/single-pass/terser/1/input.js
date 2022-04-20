def_optimize(AST_Call, function (self, compressor) {
    var exp = self.expression;
    var fn = exp;
    inline_array_like_spread(self.args);
    var simple_args = self.args.every((arg) =>
        !(arg instanceof AST_Expansion)
    );

    if (compressor.option("reduce_vars")
        && fn instanceof AST_SymbolRef
        && !has_annotation(self, _NOINLINE)
    ) {
        const fixed = fn.fixed_value();
        if (!retain_top_func(fixed, compressor)) {
            fn = fixed;
        }
    }

    var is_func = fn instanceof AST_Lambda;

    if (is_func && fn.pinned()) return self;

    if (compressor.option("unused")
        && simple_args
        && is_func
        && !fn.uses_arguments) {
        var pos = 0, last = 0;
        for (var i = 0, len = self.args.length; i < len; i++) {
            if (fn.argnames[i] instanceof AST_Expansion) {
                if (has_flag(fn.argnames[i].expression, UNUSED)) while (i < len) {
                    var node = self.args[i++].drop_side_effect_free(compressor);
                    if (node) {
                        self.args[pos++] = node;
                    }
                } else while (i < len) {
                    self.args[pos++] = self.args[i++];
                }
                last = pos;
                break;
            }
            var trim = i >= fn.argnames.length;
            if (trim || has_flag(fn.argnames[i], UNUSED)) {
                var node = self.args[i].drop_side_effect_free(compressor);
                if (node) {
                    self.args[pos++] = node;
                } else if (!trim) {
                    self.args[pos++] = make_node(AST_Number, self.args[i], {
                        value: 0
                    });
                    continue;
                }
            } else {
                self.args[pos++] = self.args[i];
            }
            last = pos;
        }
        self.args.length = last;
    }

    if (compressor.option("unsafe")) {
        if (exp instanceof AST_Dot && exp.start.value === "Array" && exp.property === "from" && self.args.length === 1) {
            const [argument] = self.args;
            if (argument instanceof AST_Array) {
                return make_node(AST_Array, argument, {
                    elements: argument.elements
                }).optimize(compressor);
            }
        }
        if (is_undeclared_ref(exp)) switch (exp.name) {

        } else if (exp instanceof AST_Dot) switch (exp.property) {
            case "join":
                if (exp.expression instanceof AST_Array) EXIT: {
                    var separator;
                    if (self.args.length > 0) {
                        separator = self.args[0].evaluate(compressor);
                        if (separator === self.args[0]) break EXIT; // not a constant
                    }
                    var elements = [];
                    var consts = [];
                    for (var i = 0, len = exp.expression.elements.length; i < len; i++) {
                        var el = exp.expression.elements[i];
                        if (el instanceof AST_Expansion) break EXIT;
                        var value = el.evaluate(compressor);
                        if (value !== el) {
                            consts.push(value);
                        } else {
                            if (consts.length > 0) {
                                elements.push(make_node(AST_String, self, {
                                    value: consts.join(separator)
                                }));
                                consts.length = 0;
                            }
                            elements.push(el);
                        }
                    }
                    if (consts.length > 0) {
                        elements.push(make_node(AST_String, self, {
                            value: consts.join(separator)
                        }));
                    }
                    if (elements.length == 0) return make_node(AST_String, self, { value: "" });
                    if (elements.length == 1) {
                        if (elements[0].is_string(compressor)) {
                            return elements[0];
                        }
                        return make_node(AST_Binary, elements[0], {
                            operator: "+",
                            left: make_node(AST_String, self, { value: "" }),
                            right: elements[0]
                        });
                    }
                    if (separator == "") {
                        var first;
                        if (elements[0].is_string(compressor)
                            || elements[1].is_string(compressor)) {
                            first = elements.shift();
                        } else {
                            first = make_node(AST_String, self, { value: "" });
                        }
                        return elements.reduce(function (prev, el) {
                            return make_node(AST_Binary, el, {
                                operator: "+",
                                left: prev,
                                right: el
                            });
                        }, first).optimize(compressor);
                    }
                    // need this awkward cloning to not affect original element
                    // best_of will decide which one to get through.
                    var node = self.clone();
                    node.expression = node.expression.clone();
                    node.expression.expression = node.expression.expression.clone();
                    node.expression.expression.elements = elements;
                    return best_of(compressor, self, node);
                }
                break;

        }
    }
});