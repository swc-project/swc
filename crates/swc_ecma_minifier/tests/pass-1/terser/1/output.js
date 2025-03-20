def_optimize(AST_Call, function(self, compressor) {
    if (compressor.option("unsafe")) {
        if (exp instanceof AST_Dot && "Array" === exp.start.value && "from" === exp.property && 1 === self.args.length) {
            const [argument] = self.args;
            if (argument instanceof AST_Array) return make_node(AST_Array, argument, {
                elements: argument.elements
            }).optimize(compressor);
        }
        if (is_undeclared_ref(exp)) exp.name;
        else if (exp instanceof AST_Dot && "join" === exp.property) {
            if (exp.expression instanceof AST_Array) {
                EXIT: if (!(self.args.length > 0) || (separator = self.args[0].evaluate(compressor)) !== self.args[0]) {
                    for(var separator, first, elements = [], consts = [], i = 0, len = exp.expression.elements.length; i < len; i++){
                        var el = exp.expression.elements[i];
                        if (el instanceof AST_Expansion) break EXIT;
                        var value = el.evaluate(compressor);
                        value !== el ? consts.push(value) : (consts.length > 0 && (elements.push(make_node(AST_String, self, {
                            value: consts.join(separator)
                        })), consts.length = 0), elements.push(el));
                    }
                    if (consts.length > 0 && elements.push(make_node(AST_String, self, {
                        value: consts.join(separator)
                    })), 0 == elements.length) return make_node(AST_String, self, {
                        value: ""
                    });
                    if (1 == elements.length) {
                        if (elements[0].is_string(compressor)) return elements[0];
                        return make_node(AST_Binary, elements[0], {
                            operator: "+",
                            left: make_node(AST_String, self, {
                                value: ""
                            }),
                            right: elements[0]
                        });
                    }
                    if ("" == separator) return first = elements[0].is_string(compressor) || elements[1].is_string(compressor) ? elements.shift() : make_node(AST_String, self, {
                        value: ""
                    }), elements.reduce(function(prev, el) {
                        return make_node(AST_Binary, el, {
                            operator: "+",
                            left: prev,
                            right: el
                        });
                    }, first).optimize(compressor);
                    // need this awkward cloning to not affect original element
                    // best_of will decide which one to get through.
                    var node = self.clone();
                    return node.expression = node.expression.clone(), node.expression.expression = node.expression.expression.clone(), node.expression.expression.elements = elements, best_of(compressor, self, node);
                }
            }
        }
    }
});
