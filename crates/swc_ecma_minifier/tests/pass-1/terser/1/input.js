def_optimize(AST_Call, function (self, compressor) {
    if (compressor.option("unsafe")) {
        if (
            exp instanceof AST_Dot &&
            exp.start.value === "Array" &&
            exp.property === "from" &&
            self.args.length === 1
        ) {
            const [argument] = self.args;
            if (argument instanceof AST_Array) {
                return make_node(AST_Array, argument, {
                    elements: argument.elements,
                }).optimize(compressor);
            }
        }
        if (is_undeclared_ref(exp))
            switch (exp.name) {
            }
        else if (exp instanceof AST_Dot)
            switch (exp.property) {
                case "join":
                    if (exp.expression instanceof AST_Array)
                        EXIT: {
                            var separator;
                            if (self.args.length > 0) {
                                separator = self.args[0].evaluate(compressor);
                                if (separator === self.args[0]) break EXIT; // not a constant
                            }
                            var elements = [];
                            var consts = [];
                            for (
                                var i = 0, len = exp.expression.elements.length;
                                i < len;
                                i++
                            ) {
                                var el = exp.expression.elements[i];
                                if (el instanceof AST_Expansion) break EXIT;
                                var value = el.evaluate(compressor);
                                if (value !== el) {
                                    consts.push(value);
                                } else {
                                    if (consts.length > 0) {
                                        elements.push(
                                            make_node(AST_String, self, {
                                                value: consts.join(separator),
                                            })
                                        );
                                        consts.length = 0;
                                    }
                                    elements.push(el);
                                }
                            }
                            if (consts.length > 0) {
                                elements.push(
                                    make_node(AST_String, self, {
                                        value: consts.join(separator),
                                    })
                                );
                            }
                            if (elements.length == 0)
                                return make_node(AST_String, self, {
                                    value: "",
                                });
                            if (elements.length == 1) {
                                if (elements[0].is_string(compressor)) {
                                    return elements[0];
                                }
                                return make_node(AST_Binary, elements[0], {
                                    operator: "+",
                                    left: make_node(AST_String, self, {
                                        value: "",
                                    }),
                                    right: elements[0],
                                });
                            }
                            if (separator == "") {
                                var first;
                                if (
                                    elements[0].is_string(compressor) ||
                                    elements[1].is_string(compressor)
                                ) {
                                    first = elements.shift();
                                } else {
                                    first = make_node(AST_String, self, {
                                        value: "",
                                    });
                                }
                                return elements
                                    .reduce(function (prev, el) {
                                        return make_node(AST_Binary, el, {
                                            operator: "+",
                                            left: prev,
                                            right: el,
                                        });
                                    }, first)
                                    .optimize(compressor);
                            }
                            // need this awkward cloning to not affect original element
                            // best_of will decide which one to get through.
                            var node = self.clone();
                            node.expression = node.expression.clone();
                            node.expression.expression =
                                node.expression.expression.clone();
                            node.expression.expression.elements = elements;
                            return best_of(compressor, self, node);
                        }
                    break;
            }
    }
});
