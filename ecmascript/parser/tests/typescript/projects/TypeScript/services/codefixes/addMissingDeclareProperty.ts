/* @internal */
namespace ts.codefix {
    const fixId = "addMissingDeclareProperty";
    const errorCodes = [
        Diagnostics.Property_0_will_overwrite_the_base_property_in_1_If_this_is_intentional_add_an_initializer_Otherwise_add_a_declare_modifier_or_remove_the_redundant_declaration.code,
    ];

    registerCodeFix({
        errorCodes,
        getCodeActions: (context) => {
            const changes = textChanges.ChangeTracker.with(context, t => makeChange(t, context.sourceFile, context.span.start));
            if (changes.length > 0) {
                return [createCodeFixAction(fixId, changes, Diagnostics.Prefix_with_declare, fixId, Diagnostics.Prefix_all_incorrect_property_declarations_with_declare)];
            }
        },
        fixIds: [fixId],
        getAllCodeActions: context => {
            const fixedNodes = new NodeSet();
            return codeFixAll(context, errorCodes, (changes, diag) => makeChange(changes, diag.file, diag.start, fixedNodes));
        },
    });

    function makeChange(changeTracker: textChanges.ChangeTracker, sourceFile: SourceFile, pos: number, fixedNodes?: NodeSet<Node>) {
        const token = getTokenAtPosition(sourceFile, pos);
        if (!isIdentifier(token)) {
            return;
        }
        const declaration = token.parent;
        if (declaration.kind === SyntaxKind.PropertyDeclaration &&
            (!fixedNodes || fixedNodes.tryAdd(declaration))) {
            changeTracker.insertModifierBefore(sourceFile, SyntaxKind.DeclareKeyword, declaration);
        }
    }
}
