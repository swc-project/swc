/* @internal */
namespace ts.codefix {
    const fixId = "constructorForDerivedNeedSuperCall";
    const errorCodes = [Diagnostics.Constructors_for_derived_classes_must_contain_a_super_call.code];
    registerCodeFix({
        errorCodes,
        getCodeActions(context) {
            const { sourceFile, span } = context;
            const ctr = getNode(sourceFile, span.start);
            const changes = textChanges.ChangeTracker.with(context, t => doChange(t, sourceFile, ctr));
            return [createCodeFixAction(fixId, changes, Diagnostics.Add_missing_super_call, fixId, Diagnostics.Add_all_missing_super_calls)];
        },
        fixIds: [fixId],
        getAllCodeActions: context => codeFixAll(context, errorCodes, (changes, diag) =>
            doChange(changes, context.sourceFile, getNode(diag.file, diag.start))),
    });

    function getNode(sourceFile: SourceFile, pos: number): ConstructorDeclaration {
        const token = getTokenAtPosition(sourceFile, pos);
        Debug.assert(token.kind === SyntaxKind.ConstructorKeyword, "token should be at the constructor keyword");
        return token.parent as ConstructorDeclaration;
    }

    function doChange(changes: textChanges.ChangeTracker, sourceFile: SourceFile, ctr: ConstructorDeclaration) {
        const superCall = createStatement(createCall(createSuper(), /*typeArguments*/ undefined, /*argumentsArray*/ emptyArray));
        changes.insertNodeAtConstructorStart(sourceFile, ctr, superCall);
    }
}
