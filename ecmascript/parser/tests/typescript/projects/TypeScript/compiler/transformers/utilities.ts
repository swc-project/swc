/* @internal */
namespace ts {
    export function getOriginalNodeId(node: Node) {
        node = getOriginalNode(node);
        return node ? getNodeId(node) : 0;
    }

    export interface ExternalModuleInfo {
        externalImports: (ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration)[]; // imports of other external modules
        externalHelpersImportDeclaration: ImportDeclaration | undefined; // import of external helpers
        exportSpecifiers: Map<ExportSpecifier[]>; // export specifiers by name
        exportedBindings: Identifier[][]; // exported names of local declarations
        exportedNames: Identifier[] | undefined; // all exported names local to module
        exportEquals: ExportAssignment | undefined; // an export= declaration if one was present
        hasExportStarsToExportValues: boolean; // whether this module contains export*
    }

    function containsDefaultReference(node: NamedImportBindings | undefined) {
        if (!node) return false;
        if (!isNamedImports(node)) return false;
        return some(node.elements, isNamedDefaultReference);
    }

    function isNamedDefaultReference(e: ImportSpecifier): boolean {
        return e.propertyName !== undefined && e.propertyName.escapedText === InternalSymbolName.Default;
    }

    export function chainBundle(transformSourceFile: (x: SourceFile) => SourceFile): (x: SourceFile | Bundle) => SourceFile | Bundle {
        return transformSourceFileOrBundle;

        function transformSourceFileOrBundle(node: SourceFile | Bundle) {
            return node.kind === SyntaxKind.SourceFile ? transformSourceFile(node) : transformBundle(node);
        }

        function transformBundle(node: Bundle) {
            return createBundle(map(node.sourceFiles, transformSourceFile), node.prepends);
        }
    }

    export function getImportNeedsImportStarHelper(node: ImportDeclaration): boolean {
        if (!!getNamespaceDeclarationNode(node)) {
            return true;
        }
        const bindings = node.importClause && node.importClause.namedBindings;
        if (!bindings) {
            return false;
        }
        if (!isNamedImports(bindings)) return false;
        let defaultRefCount = 0;
        for (const binding of bindings.elements) {
            if (isNamedDefaultReference(binding)) {
                defaultRefCount++;
            }
        }
        // Import star is required if there's default named refs mixed with non-default refs, or if theres non-default refs and it has a default import
        return (defaultRefCount > 0 && defaultRefCount !== bindings.elements.length) || (!!(bindings.elements.length - defaultRefCount) && isDefaultImport(node));
    }

    export function getImportNeedsImportDefaultHelper(node: ImportDeclaration): boolean {
        // Import default is needed if there's a default import or a default ref and no other refs (meaning an import star helper wasn't requested)
        return !getImportNeedsImportStarHelper(node) && (isDefaultImport(node) || (!!node.importClause && isNamedImports(node.importClause.namedBindings!) && containsDefaultReference(node.importClause.namedBindings))); // TODO: GH#18217
    }

    export function collectExternalModuleInfo(sourceFile: SourceFile, resolver: EmitResolver, compilerOptions: CompilerOptions): ExternalModuleInfo {
        const externalImports: (ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration)[] = [];
        const exportSpecifiers = createMultiMap<ExportSpecifier>();
        const exportedBindings: Identifier[][] = [];
        const uniqueExports = createMap<boolean>();
        let exportedNames: Identifier[] | undefined;
        let hasExportDefault = false;
        let exportEquals: ExportAssignment | undefined;
        let hasExportStarsToExportValues = false;
        let hasImportStar = false;
        let hasImportDefault = false;

        for (const node of sourceFile.statements) {
            switch (node.kind) {
                case SyntaxKind.ImportDeclaration:
                    // import "mod"
                    // import x from "mod"
                    // import * as x from "mod"
                    // import { x, y } from "mod"
                    externalImports.push(<ImportDeclaration>node);
                    if (!hasImportStar && getImportNeedsImportStarHelper(<ImportDeclaration>node)) {
                        hasImportStar = true;
                    }
                    if (!hasImportDefault && getImportNeedsImportDefaultHelper(<ImportDeclaration>node)) {
                        hasImportDefault = true;
                    }
                    break;

                case SyntaxKind.ImportEqualsDeclaration:
                    if ((<ImportEqualsDeclaration>node).moduleReference.kind === SyntaxKind.ExternalModuleReference) {
                        // import x = require("mod")
                        externalImports.push(<ImportEqualsDeclaration>node);
                    }

                    break;

                case SyntaxKind.ExportDeclaration:
                    if ((<ExportDeclaration>node).moduleSpecifier) {
                        if (!(<ExportDeclaration>node).exportClause) {
                            // export * from "mod"
                            externalImports.push(<ExportDeclaration>node);
                            hasExportStarsToExportValues = true;
                        }
                        else {
                            // export { x, y } from "mod"
                            externalImports.push(<ExportDeclaration>node);
                        }
                    }
                    else {
                        // export { x, y }
                        for (const specifier of (<ExportDeclaration>node).exportClause!.elements) {
                            if (!uniqueExports.get(idText(specifier.name))) {
                                const name = specifier.propertyName || specifier.name;
                                exportSpecifiers.add(idText(name), specifier);

                                const decl = resolver.getReferencedImportDeclaration(name)
                                    || resolver.getReferencedValueDeclaration(name);

                                if (decl) {
                                    multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(decl), specifier.name);
                                }

                                uniqueExports.set(idText(specifier.name), true);
                                exportedNames = append(exportedNames, specifier.name);
                            }
                        }
                    }
                    break;

                case SyntaxKind.ExportAssignment:
                    if ((<ExportAssignment>node).isExportEquals && !exportEquals) {
                        // export = x
                        exportEquals = <ExportAssignment>node;
                    }
                    break;

                case SyntaxKind.VariableStatement:
                    if (hasModifier(node, ModifierFlags.Export)) {
                        for (const decl of (<VariableStatement>node).declarationList.declarations) {
                            exportedNames = collectExportedVariableInfo(decl, uniqueExports, exportedNames);
                        }
                    }
                    break;

                case SyntaxKind.FunctionDeclaration:
                    if (hasModifier(node, ModifierFlags.Export)) {
                        if (hasModifier(node, ModifierFlags.Default)) {
                            // export default function() { }
                            if (!hasExportDefault) {
                                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), getDeclarationName(<FunctionDeclaration>node));
                                hasExportDefault = true;
                            }
                        }
                        else {
                            // export function x() { }
                            const name = (<FunctionDeclaration>node).name!;
                            if (!uniqueExports.get(idText(name))) {
                                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), name);
                                uniqueExports.set(idText(name), true);
                                exportedNames = append(exportedNames, name);
                            }
                        }
                    }
                    break;

                case SyntaxKind.ClassDeclaration:
                    if (hasModifier(node, ModifierFlags.Export)) {
                        if (hasModifier(node, ModifierFlags.Default)) {
                            // export default class { }
                            if (!hasExportDefault) {
                                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), getDeclarationName(<ClassDeclaration>node));
                                hasExportDefault = true;
                            }
                        }
                        else {
                            // export class x { }
                            const name = (<ClassDeclaration>node).name;
                            if (name && !uniqueExports.get(idText(name))) {
                                multiMapSparseArrayAdd(exportedBindings, getOriginalNodeId(node), name);
                                uniqueExports.set(idText(name), true);
                                exportedNames = append(exportedNames, name);
                            }
                        }
                    }
                    break;
            }
        }

        const externalHelpersImportDeclaration = createExternalHelpersImportDeclarationIfNeeded(sourceFile, compilerOptions, hasExportStarsToExportValues, hasImportStar, hasImportDefault);
        if (externalHelpersImportDeclaration) {
            externalImports.unshift(externalHelpersImportDeclaration);
        }

        return { externalImports, exportSpecifiers, exportEquals, hasExportStarsToExportValues, exportedBindings, exportedNames, externalHelpersImportDeclaration };
    }

    function collectExportedVariableInfo(decl: VariableDeclaration | BindingElement, uniqueExports: Map<boolean>, exportedNames: Identifier[] | undefined) {
        if (isBindingPattern(decl.name)) {
            for (const element of decl.name.elements) {
                if (!isOmittedExpression(element)) {
                    exportedNames = collectExportedVariableInfo(element, uniqueExports, exportedNames);
                }
            }
        }
        else if (!isGeneratedIdentifier(decl.name)) {
            const text = idText(decl.name);
            if (!uniqueExports.get(text)) {
                uniqueExports.set(text, true);
                exportedNames = append(exportedNames, decl.name);
            }
        }
        return exportedNames;
    }

    /** Use a sparse array as a multi-map. */
    function multiMapSparseArrayAdd<V>(map: V[][], key: number, value: V): V[] {
        let values = map[key];
        if (values) {
            values.push(value);
        }
        else {
            map[key] = values = [value];
        }
        return values;
    }

    /**
     * Used in the module transformer to check if an expression is reasonably without sideeffect,
     *  and thus better to copy into multiple places rather than to cache in a temporary variable
     *  - this is mostly subjective beyond the requirement that the expression not be sideeffecting
     */
    export function isSimpleCopiableExpression(expression: Expression) {
        return isStringLiteralLike(expression) ||
            expression.kind === SyntaxKind.NumericLiteral ||
            isKeyword(expression.kind) ||
            isIdentifier(expression);
    }

    /**
     * A simple inlinable expression is an expression which can be copied into multiple locations
     * without risk of repeating any sideeffects and whose value could not possibly change between
     * any such locations
     */
    export function isSimpleInlineableExpression(expression: Expression) {
        return !isIdentifier(expression) && isSimpleCopiableExpression(expression) ||
            isWellKnownSymbolSyntactically(expression);
    }

    /**
     * Adds super call and preceding prologue directives into the list of statements.
     *
     * @param ctor The constructor node.
     * @param result The list of statements.
     * @param visitor The visitor to apply to each node added to the result array.
     * @returns index of the statement that follows super call
     */
    export function addPrologueDirectivesAndInitialSuperCall(ctor: ConstructorDeclaration, result: Statement[], visitor: Visitor): number {
        if (ctor.body) {
            const statements = ctor.body.statements;
            // add prologue directives to the list (if any)
            const index = addPrologue(result, statements, /*ensureUseStrict*/ false, visitor);
            if (index === statements.length) {
                // list contains nothing but prologue directives (or empty) - exit
                return index;
            }

            const statement = statements[index];
            if (statement.kind === SyntaxKind.ExpressionStatement && isSuperCall((<ExpressionStatement>statement).expression)) {
                result.push(visitNode(statement, visitor, isStatement));
                return index + 1;
            }

            return index;
        }

        return 0;
    }


    /**
     * @param input Template string input strings
     * @param args Names which need to be made file-level unique
     */
    export function helperString(input: TemplateStringsArray, ...args: string[]) {
        return (uniqueName: EmitHelperUniqueNameCallback) => {
            let result = "";
            for (let i = 0; i < args.length; i++) {
                result += input[i];
                result += uniqueName(args[i]);
            }
            result += input[input.length - 1];
            return result;
        };
    }

    /**
     * Gets all the static or all the instance property declarations of a class
     *
     * @param node The class node.
     * @param isStatic A value indicating whether to get properties from the static or instance side of the class.
     */
    export function getProperties(node: ClassExpression | ClassDeclaration, requireInitializer: boolean, isStatic: boolean): readonly PropertyDeclaration[] {
        return filter(node.members, m => isInitializedOrStaticProperty(m, requireInitializer, isStatic)) as PropertyDeclaration[];
    }

    /**
     * Is a class element either a static or an instance property declaration with an initializer?
     *
     * @param member The class element node.
     * @param isStatic A value indicating whether the member should be a static or instance member.
     */
    function isInitializedOrStaticProperty(member: ClassElement, requireInitializer: boolean, isStatic: boolean) {
        return isPropertyDeclaration(member)
            && (!!member.initializer || !requireInitializer)
            && hasStaticModifier(member) === isStatic;
    }

    export function isInitializedProperty(member: ClassElement, requireInitializer: boolean): member is PropertyDeclaration {
        return isPropertyDeclaration(member) && (!!member.initializer || !requireInitializer);
    }

}
