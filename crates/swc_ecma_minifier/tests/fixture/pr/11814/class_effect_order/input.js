class DeclarationOrder extends effect("decl:extends") {
    [effect("decl:method")]() {}
    static [effect("decl:static-key")] = effect("decl:static-value");
    [effect("decl:instance-key")] = effect("decl:instance-value");
    static #privateField = effect("decl:private-value");
    static {
        effect("decl:block");
    }
}

(class ExpressionOrder extends effect("expr:extends") {
    [effect("expr:method")]() {}
    static [effect("expr:static-key")] = effect("expr:static-value");
    [effect("expr:instance-key")] = effect("expr:instance-value");
    static #privateField = effect("expr:private-value");
    static {
        effect("expr:block");
    }
});
