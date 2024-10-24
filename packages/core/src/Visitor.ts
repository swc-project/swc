import {
    Accessibility,
    Argument,
    ArrayExpression,
    ArrayPattern,
    ArrowFunctionExpression,
    AssignmentExpression,
    AssignmentPattern,
    AssignmentPatternProperty,
    AssignmentProperty,
    AwaitExpression,
    BigIntLiteral,
    BinaryExpression,
    BindingIdentifier,
    BlockStatement,
    BooleanLiteral,
    BreakStatement,
    CallExpression,
    CatchClause,
    Class,
    ClassDeclaration,
    ClassExpression,
    ClassMember,
    ClassMethod,
    ClassProperty,
    ComputedPropName,
    ConditionalExpression,
    Constructor,
    ContinueStatement,
    DebuggerStatement,
    Declaration,
    Decorator,
    DefaultDecl,
    DoWhileStatement,
    EmptyStatement,
    ExportAllDeclaration,
    ExportDeclaration,
    ExportDefaultDeclaration,
    ExportDefaultExpression,
    ExportDefaultSpecifier,
    ExportNamedDeclaration,
    ExportNamespaceSpecifier,
    ExportSpecifier,
    ExprOrSpread,
    Expression,
    ExpressionStatement,
    Fn,
    ForInStatement,
    ForOfStatement,
    ForStatement,
    FunctionDeclaration,
    FunctionExpression,
    GetterProperty,
    Identifier,
    IfStatement,
    Import,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
    JSXAttrValue,
    JSXAttribute,
    JSXAttributeName,
    JSXAttributeOrSpread,
    JSXClosingElement,
    JSXClosingFragment,
    JSXElement,
    JSXElementChild,
    JSXElementName,
    JSXEmptyExpression,
    JSXExpressionContainer,
    JSXFragment,
    JSXMemberExpression,
    JSXNamespacedName,
    JSXObject,
    JSXOpeningElement,
    JSXOpeningFragment,
    JSXSpreadChild,
    JSXText,
    KeyValuePatternProperty,
    KeyValueProperty,
    LabeledStatement,
    MemberExpression,
    MetaProperty,
    MethodProperty,
    Module,
    ModuleDeclaration,
    ModuleExportName,
    ModuleItem,
    NamedExportSpecifier,
    NamedImportSpecifier,
    NewExpression,
    NullLiteral,
    NumericLiteral,
    ObjectExpression,
    ObjectPattern,
    ObjectPatternProperty,
    OptionalChainingCall,
    OptionalChainingExpression,
    Param,
    ParenthesisExpression,
    Pattern,
    PrivateMethod,
    PrivateName,
    PrivateProperty,
    Program,
    Property,
    PropertyName,
    RegExpLiteral,
    RestElement,
    ReturnStatement,
    Script,
    SequenceExpression,
    SetterProperty,
    SpreadElement,
    Statement,
    StaticBlock,
    StringLiteral,
    Super,
    SuperPropExpression,
    SwitchCase,
    SwitchStatement,
    TaggedTemplateExpression,
    TemplateLiteral,
    ThisExpression,
    ThrowStatement,
    TryStatement,
    TsAsExpression,
    TsCallSignatureDeclaration,
    TsConstAssertion,
    TsConstructSignatureDeclaration,
    TsEntityName,
    TsEnumDeclaration,
    TsEnumMember,
    TsEnumMemberId,
    TsExportAssignment,
    TsExpressionWithTypeArguments,
    TsExternalModuleReference,
    TsFnParameter,
    TsGetterSignature,
    TsImportEqualsDeclaration,
    TsIndexSignature,
    TsInstantiation,
    TsInterfaceBody,
    TsInterfaceDeclaration,
    TsMethodSignature,
    TsModuleBlock,
    TsModuleDeclaration,
    TsModuleName,
    TsModuleReference,
    TsNamespaceBody,
    TsNamespaceDeclaration,
    TsNamespaceExportDeclaration,
    TsNonNullExpression,
    TsParameterProperty,
    TsParameterPropertyParameter,
    TsPropertySignature,
    TsQualifiedName,
    TsSatisfiesExpression,
    TsSetterSignature,
    TsType,
    TsTypeAliasDeclaration,
    TsTypeAnnotation,
    TsTypeAssertion,
    TsTypeElement,
    TsTypeParameter,
    TsTypeParameterDeclaration,
    TsTypeParameterInstantiation,
    UnaryExpression,
    UpdateExpression,
    VariableDeclaration,
    VariableDeclarator,
    WhileStatement,
    WithStatement,
    YieldExpression,
} from "@swc/types";

/**
 * @deprecated JavaScript API is deprecated. Please use Wasm plugin instead.
 */
export class Visitor {
    visitProgram(n: Program): Program {
        switch (n.type) {
            case "Module":
                return this.visitModule(n);
            case "Script":
                return this.visitScript(n);
        }
    }

    visitModule(m: Module): Module {
        m.body = this.visitModuleItems(m.body);
        return m;
    }

    visitScript(m: Script): Script {
        m.body = this.visitStatements(m.body);
        return m;
    }

    visitModuleItems(items: ModuleItem[]): ModuleItem[] {
        return items.map(this.visitModuleItem.bind(this));
    }

    visitModuleItem(n: ModuleItem): ModuleItem {
        switch (n.type) {
            case "ExportDeclaration":
            case "ExportDefaultDeclaration":
            case "ExportNamedDeclaration":
            case "ExportDefaultExpression":
            case "ImportDeclaration":
            case "ExportAllDeclaration":
            case "TsImportEqualsDeclaration":
            case "TsExportAssignment":
            case "TsNamespaceExportDeclaration":
                return this.visitModuleDeclaration(n);
            default:
                return this.visitStatement(n);
        }
    }

    visitModuleDeclaration(n: ModuleDeclaration): ModuleDeclaration {
        switch (n.type) {
            case "ExportDeclaration":
                return this.visitExportDeclaration(n);
            case "ExportDefaultDeclaration":
                return this.visitExportDefaultDeclaration(n);
            case "ExportNamedDeclaration":
                return this.visitExportNamedDeclaration(n);
            case "ExportDefaultExpression":
                return this.visitExportDefaultExpression(n);
            case "ImportDeclaration":
                return this.visitImportDeclaration(n);
            case "ExportAllDeclaration":
                return this.visitExportAllDeclaration(n);
            case "TsImportEqualsDeclaration":
                return this.visitTsImportEqualsDeclaration(n);
            case "TsExportAssignment":
                return this.visitTsExportAssignment(n);
            case "TsNamespaceExportDeclaration":
                return this.visitTsNamespaceExportDeclaration(n);
        }
    }

    visitTsNamespaceExportDeclaration(
        n: TsNamespaceExportDeclaration
    ): ModuleDeclaration {
        n.id = this.visitBindingIdentifier(n.id);
        return n;
    }

    visitTsExportAssignment(n: TsExportAssignment): TsExportAssignment {
        n.expression = this.visitExpression(n.expression);

        return n;
    }

    visitTsImportEqualsDeclaration(
        n: TsImportEqualsDeclaration
    ): ModuleDeclaration {
        n.id = this.visitBindingIdentifier(n.id);
        n.moduleRef = this.visitTsModuleReference(n.moduleRef);
        return n;
    }

    visitTsModuleReference(n: TsModuleReference): TsModuleReference {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "TsExternalModuleReference":
                return this.visitTsExternalModuleReference(n);
            case "TsQualifiedName":
                return this.visitTsQualifiedName(n);
        }
    }

    visitTsExternalModuleReference(
        n: TsExternalModuleReference
    ): TsExternalModuleReference {
        n.expression = this.visitStringLiteral(n.expression);
        return n;
    }

    visitExportAllDeclaration(n: ExportAllDeclaration): ModuleDeclaration {
        n.source = this.visitStringLiteral(n.source);
        return n;
    }

    visitExportDefaultExpression(
        n: ExportDefaultExpression
    ): ModuleDeclaration {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitExportNamedDeclaration(n: ExportNamedDeclaration): ModuleDeclaration {
        n.specifiers = this.visitExportSpecifiers(n.specifiers);
        n.source = this.visitOptionalStringLiteral(n.source);
        return n;
    }

    visitExportSpecifiers(nodes: ExportSpecifier[]): ExportSpecifier[] {
        return nodes.map(this.visitExportSpecifier.bind(this));
    }

    visitExportSpecifier(n: ExportSpecifier): ExportSpecifier {
        switch (n.type) {
            case "ExportDefaultSpecifier":
                return this.visitExportDefaultSpecifier(n);
            case "ExportNamespaceSpecifier":
                return this.visitExportNamespaceSpecifier(n);
            case "ExportSpecifier":
                return this.visitNamedExportSpecifier(n);
        }
    }
    visitNamedExportSpecifier(n: NamedExportSpecifier): ExportSpecifier {
        if (n.exported) {
            n.exported = this.visitModuleExportName(n.exported);
        }
        n.orig = this.visitModuleExportName(n.orig);
        return n;
    }

    visitModuleExportName(n: ModuleExportName): ModuleExportName {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifier(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
        }
    }

    visitExportNamespaceSpecifier(
        n: ExportNamespaceSpecifier
    ): ExportSpecifier {
        n.name = this.visitModuleExportName(n.name);
        return n;
    }

    visitExportDefaultSpecifier(n: ExportDefaultSpecifier): ExportSpecifier {
        n.exported = this.visitBindingIdentifier(n.exported);
        return n;
    }

    visitOptionalStringLiteral(
        n: StringLiteral | undefined
    ): StringLiteral | undefined {
        if (n) {
            return this.visitStringLiteral(n);
        }
    }

    visitExportDefaultDeclaration(
        n: ExportDefaultDeclaration
    ): ModuleDeclaration {
        n.decl = this.visitDefaultDeclaration(n.decl);
        return n;
    }

    visitDefaultDeclaration(n: DefaultDecl): DefaultDecl {
        switch (n.type) {
            case "ClassExpression":
                return this.visitClassExpression(n);
            case "FunctionExpression":
                return this.visitFunctionExpression(n);
            case "TsInterfaceDeclaration":
                return this.visitTsInterfaceDeclaration(n);
        }
    }

    visitFunctionExpression(n: FunctionExpression): FunctionExpression {
        n = this.visitFunction(n);
        if (n.identifier) {
            n.identifier = this.visitBindingIdentifier(n.identifier);
        }
        return n;
    }

    visitClassExpression(n: ClassExpression): ClassExpression {
        n = this.visitClass(n);
        if (n.identifier) {
            n.identifier = this.visitBindingIdentifier(n.identifier);
        }
        return n;
    }

    visitExportDeclaration(n: ExportDeclaration): ModuleDeclaration {
        n.declaration = this.visitDeclaration(n.declaration);
        return n;
    }

    visitArrayExpression(e: ArrayExpression): Expression {
        if (e.elements) {
            e.elements = e.elements.map(this.visitArrayElement.bind(this));
        }
        return e;
    }

    visitArrayElement(e: ExprOrSpread | undefined): ExprOrSpread | undefined {
        if (e) {
            return this.visitExprOrSpread(e);
        }
    }

    visitExprOrSpread(e: ExprOrSpread): ExprOrSpread {
        return {
            ...e,
            expression: this.visitExpression(e.expression),
        };
    }
    visitExprOrSpreads(nodes: ExprOrSpread[]): ExprOrSpread[] {
        return nodes.map(this.visitExprOrSpread.bind(this));
    }

    visitSpreadElement(e: SpreadElement): SpreadElement {
        e.arguments = this.visitExpression(e.arguments);
        return e;
    }

    visitOptionalExpression(e: Expression | undefined): Expression | undefined {
        if (e) {
            return this.visitExpression(e);
        }
    }

    visitArrowFunctionExpression(e: ArrowFunctionExpression): Expression {
        e.body = this.visitArrowBody(e.body);
        e.params = this.visitPatterns(e.params);
        e.returnType = this.visitTsTypeAnnotation(e.returnType);
        e.typeParameters = this.visitTsTypeParameterDeclaration(
            e.typeParameters
        );

        return e;
    }

    visitArrowBody(
        body: BlockStatement | Expression
    ): BlockStatement | Expression {
        switch (body.type) {
            case "BlockStatement":
                return this.visitBlockStatement(body);
            default:
                return this.visitExpression(body);
        }
    }

    visitBlockStatement(block: BlockStatement): BlockStatement {
        block.stmts = this.visitStatements(block.stmts);

        return block;
    }

    visitStatements(stmts: Statement[]): Statement[] {
        return stmts.map(this.visitStatement.bind(this));
    }

    visitStatement(stmt: Statement): Statement {
        switch (stmt.type) {
            case "ClassDeclaration":
            case "FunctionDeclaration":
            case "TsEnumDeclaration":
            case "TsInterfaceDeclaration":
            case "TsModuleDeclaration":
            case "TsTypeAliasDeclaration":
            case "VariableDeclaration":
                return this.visitDeclaration(stmt);

            case "BreakStatement":
                return this.visitBreakStatement(stmt);
            case "BlockStatement":
                return this.visitBlockStatement(stmt);
            case "ContinueStatement":
                return this.visitContinueStatement(stmt);
            case "DebuggerStatement":
                return this.visitDebuggerStatement(stmt);
            case "DoWhileStatement":
                return this.visitDoWhileStatement(stmt);
            case "EmptyStatement":
                return this.visitEmptyStatement(stmt);
            case "ForInStatement":
                return this.visitForInStatement(stmt);
            case "ForOfStatement":
                return this.visitForOfStatement(stmt);
            case "ForStatement":
                return this.visitForStatement(stmt);
            case "IfStatement":
                return this.visitIfStatement(stmt);
            case "LabeledStatement":
                return this.visitLabeledStatement(stmt);
            case "ReturnStatement":
                return this.visitReturnStatement(stmt);
            case "SwitchStatement":
                return this.visitSwitchStatement(stmt);
            case "ThrowStatement":
                return this.visitThrowStatement(stmt);
            case "TryStatement":
                return this.visitTryStatement(stmt);
            case "WhileStatement":
                return this.visitWhileStatement(stmt);
            case "WithStatement":
                return this.visitWithStatement(stmt);
            case "ExpressionStatement":
                return this.visitExpressionStatement(stmt);

            default:
                throw new Error(
                    `Unknown statement type: ` + (stmt as any).type
                );
        }
    }

    visitSwitchStatement(stmt: SwitchStatement): Statement {
        stmt.discriminant = this.visitExpression(stmt.discriminant);
        stmt.cases = this.visitSwitchCases(stmt.cases);
        return stmt;
    }

    visitSwitchCases(cases: SwitchCase[]): SwitchCase[] {
        return cases.map(this.visitSwitchCase.bind(this));
    }

    visitSwitchCase(c: SwitchCase): SwitchCase {
        c.test = this.visitOptionalExpression(c.test);
        c.consequent = this.visitStatements(c.consequent);

        return c;
    }

    visitIfStatement(stmt: IfStatement): Statement {
        stmt.test = this.visitExpression(stmt.test);
        stmt.consequent = this.visitStatement(stmt.consequent);
        stmt.alternate = this.visitOptionalStatement(stmt.alternate);

        return stmt;
    }

    visitOptionalStatement(stmt: Statement | undefined): Statement | undefined {
        if (stmt) {
            return this.visitStatement(stmt);
        }
    }

    visitBreakStatement(stmt: BreakStatement): Statement {
        if (stmt.label) {
            stmt.label = this.visitLabelIdentifier(stmt.label);
        }

        return stmt;
    }

    visitWhileStatement(stmt: WhileStatement): Statement {
        stmt.test = this.visitExpression(stmt.test);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    }

    visitTryStatement(stmt: TryStatement): Statement {
        stmt.block = this.visitBlockStatement(stmt.block);
        stmt.handler = this.visitCatchClause(stmt.handler);
        if (stmt.finalizer) {
            stmt.finalizer = this.visitBlockStatement(stmt.finalizer);
        }
        return stmt;
    }

    visitCatchClause(
        handler: CatchClause | undefined
    ): CatchClause | undefined {
        if (handler) {
            if (handler.param) {
                handler.param = this.visitPattern(handler.param);
            }

            handler.body = this.visitBlockStatement(handler.body);
        }

        return handler;
    }

    visitThrowStatement(stmt: ThrowStatement): Statement {
        stmt.argument = this.visitExpression(stmt.argument);
        return stmt;
    }

    visitReturnStatement(stmt: ReturnStatement): Statement {
        if (stmt.argument) {
            stmt.argument = this.visitExpression(stmt.argument);
        }
        return stmt;
    }

    visitLabeledStatement(stmt: LabeledStatement): Statement {
        stmt.label = this.visitLabelIdentifier(stmt.label);
        stmt.body = this.visitStatement(stmt.body);

        return stmt;
    }

    visitForStatement(stmt: ForStatement): Statement {
        if (stmt.init) {
            if (stmt.init.type === "VariableDeclaration") {
                stmt.init = this.visitVariableDeclaration(stmt.init);
            } else {
                stmt.init = this.visitOptionalExpression(stmt.init);
            }
        }

        stmt.test = this.visitOptionalExpression(stmt.test);
        stmt.update = this.visitOptionalExpression(stmt.update);
        stmt.body = this.visitStatement(stmt.body);

        return stmt;
    }

    visitForOfStatement(stmt: ForOfStatement): Statement {
        if (stmt.left.type === "VariableDeclaration") {
            stmt.left = this.visitVariableDeclaration(stmt.left);
        } else {
            stmt.left = this.visitPattern(stmt.left);
        }
        stmt.right = this.visitExpression(stmt.right);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    }

    visitForInStatement(stmt: ForInStatement): Statement {
        if (stmt.left.type === "VariableDeclaration") {
            stmt.left = this.visitVariableDeclaration(stmt.left);
        } else {
            stmt.left = this.visitPattern(stmt.left);
        }
        stmt.right = this.visitExpression(stmt.right);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    }

    visitEmptyStatement(stmt: EmptyStatement): EmptyStatement {
        return stmt;
    }

    visitDoWhileStatement(stmt: DoWhileStatement): Statement {
        stmt.body = this.visitStatement(stmt.body);
        stmt.test = this.visitExpression(stmt.test);
        return stmt;
    }

    visitDebuggerStatement(stmt: DebuggerStatement): Statement {
        return stmt;
    }

    visitWithStatement(stmt: WithStatement): Statement {
        stmt.object = this.visitExpression(stmt.object);
        stmt.body = this.visitStatement(stmt.body);
        return stmt;
    }

    visitDeclaration(decl: Declaration): Declaration {
        switch (decl.type) {
            case "ClassDeclaration":
                return this.visitClassDeclaration(decl);
            case "FunctionDeclaration":
                return this.visitFunctionDeclaration(decl);
            case "TsEnumDeclaration":
                return this.visitTsEnumDeclaration(decl);
            case "TsInterfaceDeclaration":
                return this.visitTsInterfaceDeclaration(decl);
            case "TsModuleDeclaration":
                return this.visitTsModuleDeclaration(decl);
            case "TsTypeAliasDeclaration":
                return this.visitTsTypeAliasDeclaration(decl);
            case "VariableDeclaration":
                return this.visitVariableDeclaration(decl);
        }
    }

    visitVariableDeclaration(n: VariableDeclaration): VariableDeclaration {
        n.declarations = this.visitVariableDeclarators(n.declarations);
        return n;
    }

    visitVariableDeclarators(
        nodes: VariableDeclarator[]
    ): VariableDeclarator[] {
        return nodes.map(this.visitVariableDeclarator.bind(this));
    }

    visitVariableDeclarator(n: VariableDeclarator): VariableDeclarator {
        n.id = this.visitPattern(n.id);
        n.init = this.visitOptionalExpression(n.init);
        return n;
    }

    visitTsTypeAliasDeclaration(n: TsTypeAliasDeclaration): Declaration {
        n.id = this.visitBindingIdentifier(n.id);
        n.typeAnnotation = this.visitTsType(n.typeAnnotation);
        n.typeParams = this.visitTsTypeParameterDeclaration(n.typeParams);
        return n;
    }

    visitTsModuleDeclaration(n: TsModuleDeclaration): Declaration {
        n.id = this.visitTsModuleName(n.id);
        if (n.body) {
            n.body = this.visitTsNamespaceBody(n.body);
        }
        return n;
    }

    visitTsModuleName(n: TsModuleName): TsModuleName {
        switch (n.type) {
            case "Identifier":
                return this.visitBindingIdentifier(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
        }
    }

    visitTsNamespaceBody(n: TsNamespaceBody): TsNamespaceBody | undefined {
        if (n) {
            switch (n.type) {
                case "TsModuleBlock":
                    return this.visitTsModuleBlock(n);
                case "TsNamespaceDeclaration":
                    return this.visitTsNamespaceDeclaration(n);
            }
        }
    }

    visitTsNamespaceDeclaration(
        n: TsNamespaceDeclaration
    ): TsModuleBlock | TsNamespaceDeclaration {
        const body = this.visitTsNamespaceBody(n.body);
        if (body) {
            n.body = body;
        }
        n.id = this.visitBindingIdentifier(n.id);
        return n;
    }

    visitTsModuleBlock(
        n: TsModuleBlock
    ): TsModuleBlock | TsNamespaceDeclaration {
        n.body = this.visitModuleItems(n.body);
        return n;
    }

    visitTsInterfaceDeclaration(
        n: TsInterfaceDeclaration
    ): TsInterfaceDeclaration {
        n.id = this.visitBindingIdentifier(n.id);
        n.typeParams = this.visitTsTypeParameterDeclaration(n.typeParams);
        n.extends = this.visitTsExpressionsWithTypeArguments(n.extends);
        n.body = this.visitTsInterfaceBody(n.body);
        return n;
    }

    visitTsInterfaceBody(n: TsInterfaceBody): TsInterfaceBody {
        n.body = this.visitTsTypeElements(n.body);
        return n;
    }

    visitTsTypeElements(nodes: TsTypeElement[]): TsTypeElement[] {
        return nodes.map(this.visitTsTypeElement.bind(this));
    }

    visitTsTypeElement(n: TsTypeElement): TsTypeElement {
        switch (n.type) {
            case "TsCallSignatureDeclaration":
                return this.visitTsCallSignatureDeclaration(n);
            case "TsConstructSignatureDeclaration":
                return this.visitTsConstructSignatureDeclaration(n);
            case "TsPropertySignature":
                return this.visitTsPropertySignature(n);
            case "TsGetterSignature":
                return this.visitTsGetterSignature(n);
            case "TsSetterSignature":
                return this.visitTsSetterSignature(n);
            case "TsMethodSignature":
                return this.visitTsMethodSignature(n);
            case "TsIndexSignature":
                return this.visitTsIndexSignature(n);
        }
    }

    visitTsCallSignatureDeclaration(
        n: TsCallSignatureDeclaration
    ): TsCallSignatureDeclaration {
        n.params = this.visitTsFnParameters(n.params);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }
    visitTsConstructSignatureDeclaration(
        n: TsConstructSignatureDeclaration
    ): TsConstructSignatureDeclaration {
        n.params = this.visitTsFnParameters(n.params);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }
    visitTsPropertySignature(n: TsPropertySignature): TsPropertySignature {
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }
    visitTsGetterSignature(n: TsGetterSignature): TsGetterSignature {
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }
    visitTsSetterSignature(n: TsSetterSignature): TsSetterSignature {
        n.param = this.visitTsFnParameter(n.param);
        return n;
    }
    visitTsMethodSignature(n: TsMethodSignature): TsMethodSignature {
        n.params = this.visitTsFnParameters(n.params);
        n.typeAnn = this.visitTsTypeAnnotation(n.typeAnn);
        return n;
    }

    visitTsEnumDeclaration(n: TsEnumDeclaration): Declaration {
        n.id = this.visitIdentifier(n.id);
        n.members = this.visitTsEnumMembers(n.members);
        return n;
    }

    visitTsEnumMembers(nodes: TsEnumMember[]): TsEnumMember[] {
        return nodes.map(this.visitTsEnumMember.bind(this));
    }

    visitTsEnumMember(n: TsEnumMember): TsEnumMember {
        n.id = this.visitTsEnumMemberId(n.id);
        n.init = this.visitOptionalExpression(n.init);
        return n;
    }

    visitTsEnumMemberId(n: TsEnumMemberId): TsEnumMemberId {
        switch (n.type) {
            case "Identifier":
                return this.visitBindingIdentifier(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
        }
    }

    visitFunctionDeclaration(decl: FunctionDeclaration): Declaration {
        decl.identifier = this.visitIdentifier(decl.identifier);
        decl = this.visitFunction(decl);

        return decl;
    }

    visitClassDeclaration(decl: ClassDeclaration): Declaration {
        decl = this.visitClass(decl);
        decl.identifier = this.visitIdentifier(decl.identifier);
        return decl;
    }

    visitClassBody(members: ClassMember[]): ClassMember[] {
        return members.map(this.visitClassMember.bind(this));
    }

    visitClassMember(member: ClassMember): ClassMember {
        switch (member.type) {
            case "ClassMethod":
                return this.visitClassMethod(member);
            case "ClassProperty":
                return this.visitClassProperty(member);
            case "Constructor":
                return this.visitConstructor(member);
            case "PrivateMethod":
                return this.visitPrivateMethod(member);
            case "PrivateProperty":
                return this.visitPrivateProperty(member);
            case "TsIndexSignature":
                return this.visitTsIndexSignature(member);
            case "EmptyStatement":
                return this.visitEmptyStatement(member);
            case "StaticBlock":
                return this.visitStaticBlock(member);
        }
    }

    visitTsIndexSignature(n: TsIndexSignature): TsIndexSignature {
        n.params = this.visitTsFnParameters(n.params);
        if (n.typeAnnotation)
            n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }

    visitTsFnParameters(params: TsFnParameter[]): TsFnParameter[] {
        return params.map(this.visitTsFnParameter.bind(this));
    }

    visitTsFnParameter(n: TsFnParameter): TsFnParameter {
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }

    visitPrivateProperty(n: PrivateProperty): ClassMember {
        n.decorators = this.visitDecorators(n.decorators);
        n.key = this.visitPrivateName(n.key);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        n.value = this.visitOptionalExpression(n.value);
        return n;
    }

    visitPrivateMethod(n: PrivateMethod): ClassMember {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.function = this.visitFunction(n.function);
        n.key = this.visitPrivateName(n.key);
        return n;
    }

    visitPrivateName(n: PrivateName): PrivateName {
        return n;
    }

    visitConstructor(n: Constructor): ClassMember {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.key = this.visitPropertyName(n.key);
        n.params = this.visitConstructorParameters(n.params);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        return n;
    }

    visitConstructorParameters(
        nodes: (Param | TsParameterProperty)[]
    ): (Param | TsParameterProperty)[] {
        return nodes.map(this.visitConstructorParameter.bind(this));
    }

    visitConstructorParameter(
        n: Param | TsParameterProperty
    ): Param | TsParameterProperty {
        switch (n.type) {
            case "TsParameterProperty":
                return this.visitTsParameterProperty(n);
            default:
                return this.visitParameter(n);
        }
    }

    visitStaticBlock(n: StaticBlock): StaticBlock {
        n.body = this.visitBlockStatement(n.body);
        return n;
    }

    visitTsParameterProperty(
        n: TsParameterProperty
    ): TsParameterProperty | Param {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.decorators = this.visitDecorators(n.decorators);
        n.param = this.visitTsParameterPropertyParameter(n.param);
        return n;
    }

    visitTsParameterPropertyParameter(
        n: TsParameterPropertyParameter
    ): TsParameterPropertyParameter {
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }

    visitPropertyName(key: PropertyName): PropertyName {
        switch (key.type) {
            case "Identifier":
                return this.visitBindingIdentifier(key);
            case "StringLiteral":
                return this.visitStringLiteral(key);
            case "NumericLiteral":
                return this.visitNumericLiteral(key);
            case "BigIntLiteral":
                return this.visitBigIntLiteral(key);
            default:
                return this.visitComputedPropertyKey(key);
        }
    }

    visitAccessibility(
        n: Accessibility | undefined
    ): Accessibility | undefined {
        return n;
    }

    visitClassProperty(n: ClassProperty): ClassMember {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.decorators = this.visitDecorators(n.decorators);
        n.key = this.visitPropertyName(n.key);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        n.value = this.visitOptionalExpression(n.value);
        return n;
    }

    visitClassMethod(n: ClassMethod): ClassMember {
        n.accessibility = this.visitAccessibility(n.accessibility);
        n.function = this.visitFunction(n.function);
        n.key = this.visitPropertyName(n.key);
        return n;
    }

    visitComputedPropertyKey(n: ComputedPropName): ComputedPropName {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitClass<T extends Class>(n: T): T {
        n.decorators = this.visitDecorators(n.decorators);

        n.superClass = this.visitOptionalExpression(n.superClass);

        n.superTypeParams = this.visitTsTypeParameterInstantiation(
            n.superTypeParams
        );
        if (n.implements) {
            n.implements = this.visitTsExpressionsWithTypeArguments(
                n.implements
            );
        }

        n.body = this.visitClassBody(n.body);
        return n;
    }

    visitFunction<T extends Fn>(n: T): T {
        n.decorators = this.visitDecorators(n.decorators);
        n.params = this.visitParameters(n.params);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        n.returnType = this.visitTsTypeAnnotation(n.returnType);
        n.typeParameters = this.visitTsTypeParameterDeclaration(
            n.typeParameters
        );
        return n;
    }

    visitTsExpressionsWithTypeArguments(
        nodes: TsExpressionWithTypeArguments[]
    ): TsExpressionWithTypeArguments[] {
        return nodes.map(this.visitTsExpressionWithTypeArguments.bind(this));
    }

    visitTsExpressionWithTypeArguments(
        n: TsExpressionWithTypeArguments
    ): TsExpressionWithTypeArguments {
        n.expression = this.visitExpression(n.expression);
        n.typeArguments = this.visitTsTypeParameterInstantiation(
            n.typeArguments
        );
        return n;
    }

    visitTsTypeParameterInstantiation(
        n: TsTypeParameterInstantiation | undefined
    ): TsTypeParameterInstantiation | undefined {
        if (n) {
            n.params = this.visitTsTypes(n.params);
        }
        return n;
    }

    visitTsTypes(nodes: TsType[]): TsType[] {
        return nodes.map(this.visitTsType.bind(this));
    }

    visitTsEntityName(n: TsEntityName): TsEntityName {
        switch (n.type) {
            case "Identifier":
                return this.visitBindingIdentifier(n);
            case "TsQualifiedName":
                return this.visitTsQualifiedName(n);
        }
    }

    visitTsQualifiedName(n: TsQualifiedName): TsQualifiedName {
        n.left = this.visitTsEntityName(n.left);
        n.right = this.visitIdentifier(n.right);
        return n;
    }

    visitDecorators(nodes: Decorator[] | undefined): Decorator[] | undefined {
        if (nodes) {
            return nodes.map(this.visitDecorator.bind(this));
        }
    }

    visitDecorator(n: Decorator): Decorator {
        n.expression = this.visitExpression(n.expression);

        return n;
    }

    visitExpressionStatement(stmt: ExpressionStatement): Statement {
        stmt.expression = this.visitExpression(stmt.expression);
        return stmt;
    }

    visitContinueStatement(stmt: ContinueStatement): Statement {
        if (stmt.label) {
            stmt.label = this.visitLabelIdentifier(stmt.label);
        }
        return stmt;
    }

    visitExpression(n: Expression): Expression {
        switch (n.type) {
            case "ArrayExpression":
                return this.visitArrayExpression(n);
            case "ArrowFunctionExpression":
                return this.visitArrowFunctionExpression(n);
            case "AssignmentExpression":
                return this.visitAssignmentExpression(n);
            case "AwaitExpression":
                return this.visitAwaitExpression(n);
            case "BigIntLiteral":
                return this.visitBigIntLiteral(n);
            case "BinaryExpression":
                return this.visitBinaryExpression(n);
            case "BooleanLiteral":
                return this.visitBooleanLiteral(n);
            case "CallExpression":
                return this.visitCallExpression(n);
            case "ClassExpression":
                return this.visitClassExpression(n);
            case "ConditionalExpression":
                return this.visitConditionalExpression(n);
            case "FunctionExpression":
                return this.visitFunctionExpression(n);
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "JSXElement":
                return this.visitJSXElement(n);
            case "JSXEmptyExpression":
                return this.visitJSXEmptyExpression(n);
            case "JSXFragment":
                return this.visitJSXFragment(n);
            case "JSXMemberExpression":
                return this.visitJSXMemberExpression(n);
            case "JSXNamespacedName":
                return this.visitJSXNamespacedName(n);
            case "JSXText":
                return this.visitJSXText(n);
            case "MemberExpression":
                return this.visitMemberExpression(n);
            case "SuperPropExpression":
                return this.visitSuperPropExpression(n);
            case "MetaProperty":
                return this.visitMetaProperty(n);
            case "NewExpression":
                return this.visitNewExpression(n);
            case "NullLiteral":
                return this.visitNullLiteral(n);
            case "NumericLiteral":
                return this.visitNumericLiteral(n);
            case "ObjectExpression":
                return this.visitObjectExpression(n);
            case "ParenthesisExpression":
                return this.visitParenthesisExpression(n);
            case "PrivateName":
                return this.visitPrivateName(n);
            case "RegExpLiteral":
                return this.visitRegExpLiteral(n);
            case "SequenceExpression":
                return this.visitSequenceExpression(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);
            case "TaggedTemplateExpression":
                return this.visitTaggedTemplateExpression(n);
            case "TemplateLiteral":
                return this.visitTemplateLiteral(n);
            case "ThisExpression":
                return this.visitThisExpression(n);
            case "TsAsExpression":
                return this.visitTsAsExpression(n);
            case "TsSatisfiesExpression":
                return this.visitTsSatisfiesExpression(n);
            case "TsNonNullExpression":
                return this.visitTsNonNullExpression(n);
            case "TsTypeAssertion":
                return this.visitTsTypeAssertion(n);
            case "TsConstAssertion":
                return this.visitTsConstAssertion(n);
            case "TsInstantiation":
                return this.visitTsInstantiation(n);
            case "UnaryExpression":
                return this.visitUnaryExpression(n);
            case "UpdateExpression":
                return this.visitUpdateExpression(n);
            case "YieldExpression":
                return this.visitYieldExpression(n);
            case "OptionalChainingExpression":
                return this.visitOptionalChainingExpression(n);
            case "Invalid":
                return n;
        }
    }
    visitOptionalChainingExpression(n: OptionalChainingExpression): Expression {
        n.base = this.visitMemberExpressionOrOptionalChainingCall(n.base);
        return n;
    }

    visitMemberExpressionOrOptionalChainingCall(
        n: MemberExpression | OptionalChainingCall
    ): MemberExpression | OptionalChainingCall {
        switch (n.type) {
            case "MemberExpression":
                return this.visitMemberExpression(n);
            case "CallExpression":
                return this.visitOptionalChainingCall(n);
        }
    }

    visitOptionalChainingCall(n: OptionalChainingCall): OptionalChainingCall {
        n.callee = this.visitExpression(n.callee);
        n.arguments = this.visitExprOrSpreads(n.arguments);
        if (n.typeArguments)
            n.typeArguments = this.visitTsTypeParameterInstantiation(
                n.typeArguments
            );
        return n;
    }

    visitAssignmentExpression(n: AssignmentExpression): Expression {
        n.left = this.visitPatternOrExpression(n.left);
        n.right = this.visitExpression(n.right);
        return n;
    }

    visitPatternOrExpression(n: Pattern | Expression): Pattern | Expression {
        switch (n.type) {
            case "ObjectPattern":
            case "ArrayPattern":
            case "Identifier":
            case "AssignmentPattern":
            case "RestElement":
                return this.visitPattern(n);
            default:
                return this.visitExpression(n);
        }
    }

    visitYieldExpression(n: YieldExpression): Expression {
        n.argument = this.visitOptionalExpression(n.argument);
        return n;
    }

    visitUpdateExpression(n: UpdateExpression): Expression {
        n.argument = this.visitExpression(n.argument);
        return n;
    }

    visitUnaryExpression(n: UnaryExpression): Expression {
        n.argument = this.visitExpression(n.argument);
        return n;
    }

    visitTsTypeAssertion(n: TsTypeAssertion): Expression {
        n.expression = this.visitExpression(n.expression);
        n.typeAnnotation = this.visitTsType(n.typeAnnotation);
        return n;
    }

    visitTsConstAssertion(n: TsConstAssertion): Expression {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitTsInstantiation(n: TsInstantiation): TsInstantiation {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitTsNonNullExpression(n: TsNonNullExpression): Expression {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitTsAsExpression(n: TsAsExpression): Expression {
        n.expression = this.visitExpression(n.expression);
        n.typeAnnotation = this.visitTsType(n.typeAnnotation);
        return n;
    }

    visitTsSatisfiesExpression(n: TsSatisfiesExpression): Expression {
        n.expression = this.visitExpression(n.expression);
        n.typeAnnotation = this.visitTsType(n.typeAnnotation);
        return n;
    }

    visitThisExpression(n: ThisExpression): Expression {
        return n;
    }

    visitTemplateLiteral(n: TemplateLiteral): Expression {
        n.expressions = n.expressions.map(this.visitExpression.bind(this));
        return n;
    }

    visitParameters(n: Param[]): Param[] {
        return n.map(this.visitParameter.bind(this));
    }

    visitParameter(n: Param): Param {
        n.pat = this.visitPattern(n.pat);
        return n;
    }

    visitTaggedTemplateExpression(n: TaggedTemplateExpression): Expression {
        n.tag = this.visitExpression(n.tag);
        const template = this.visitTemplateLiteral(n.template);
        if (template.type === "TemplateLiteral") {
            n.template = template;
        }
        return n;
    }

    visitSequenceExpression(n: SequenceExpression): Expression {
        n.expressions = n.expressions.map(this.visitExpression.bind(this));
        return n;
    }

    visitRegExpLiteral(n: RegExpLiteral): Expression {
        return n;
    }

    visitParenthesisExpression(n: ParenthesisExpression): Expression {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitObjectExpression(n: ObjectExpression): Expression {
        if (n.properties) {
            n.properties = this.visitObjectProperties(n.properties);
        }
        return n;
    }

    visitObjectProperties(
        nodes: (Property | SpreadElement)[]
    ): (Property | SpreadElement)[] {
        return nodes.map(this.visitObjectProperty.bind(this));
    }

    visitObjectProperty(n: Property | SpreadElement): Property | SpreadElement {
        switch (n.type) {
            case "SpreadElement":
                return this.visitSpreadElement(n);
            default:
                return this.visitProperty(n);
        }
    }

    visitProperty(n: Property): Property | SpreadElement {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifier(n);
            case "AssignmentProperty":
                return this.visitAssignmentProperty(n);
            case "GetterProperty":
                return this.visitGetterProperty(n);
            case "KeyValueProperty":
                return this.visitKeyValueProperty(n);
            case "MethodProperty":
                return this.visitMethodProperty(n);
            case "SetterProperty":
                return this.visitSetterProperty(n);
        }
    }

    visitSetterProperty(n: SetterProperty): Property | SpreadElement {
        n.key = this.visitPropertyName(n.key);
        n.param = this.visitPattern(n.param);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        return n;
    }

    visitMethodProperty(n: MethodProperty): Property | SpreadElement {
        n.key = this.visitPropertyName(n.key);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        n.decorators = this.visitDecorators(n.decorators);
        n.params = this.visitParameters(n.params);
        n.returnType = this.visitTsTypeAnnotation(n.returnType);
        n.typeParameters = this.visitTsTypeParameterDeclaration(
            n.typeParameters
        );
        return n;
    }

    visitKeyValueProperty(n: KeyValueProperty): Property | SpreadElement {
        n.key = this.visitPropertyName(n.key);
        n.value = this.visitExpression(n.value);
        return n;
    }

    visitGetterProperty(n: GetterProperty): Property | SpreadElement {
        n.key = this.visitPropertyName(n.key);
        if (n.body) {
            n.body = this.visitBlockStatement(n.body);
        }
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }

    visitAssignmentProperty(n: AssignmentProperty): Property | SpreadElement {
        n.key = this.visitIdentifier(n.key);
        n.value = this.visitExpression(n.value);
        return n;
    }

    visitNullLiteral(n: NullLiteral): NullLiteral {
        return n;
    }

    visitNewExpression(n: NewExpression): Expression {
        n.callee = this.visitExpression(n.callee);
        if (n.arguments) {
            n.arguments = this.visitArguments(n.arguments);
        }
        n.typeArguments = this.visitTsTypeArguments(n.typeArguments);
        return n;
    }

    visitTsTypeArguments(
        n: TsTypeParameterInstantiation | undefined
    ): TsTypeParameterInstantiation | undefined {
        if (n) {
            n.params = this.visitTsTypes(n.params);
        }
        return n;
    }

    visitArguments(nodes: Argument[]): Argument[] {
        return nodes.map(this.visitArgument.bind(this));
    }

    visitArgument(n: Argument): Argument {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitMetaProperty(n: MetaProperty): Expression {
        return n;
    }

    visitMemberExpression(n: MemberExpression): MemberExpression {
        n.object = this.visitExpression(n.object);
        switch (n.property.type) {
            case "Computed": {
                n.property = this.visitComputedPropertyKey(n.property);
                return n;
            }
            case "Identifier": {
                n.property = this.visitIdentifier(n.property);
                return n;
            }
            case "PrivateName": {
                n.property = this.visitPrivateName(n.property);
                return n;
            }
        }
    }

    visitSuperPropExpression(n: SuperPropExpression): Expression {
        switch (n.property.type) {
            case "Computed": {
                n.property = this.visitComputedPropertyKey(n.property);
                return n;
            }
            case "Identifier": {
                n.property = this.visitIdentifier(n.property);
                return n;
            }
        }
    }

    visitCallee(n: Expression | Super | Import): Expression | Super | Import {
        if (n.type === "Super" || n.type === "Import") {
            return n;
        }
        return this.visitExpression(n);
    }

    visitJSXText(n: JSXText): JSXText {
        return n;
    }

    visitJSXNamespacedName(n: JSXNamespacedName): JSXNamespacedName {
        n.namespace = this.visitIdentifierReference(n.namespace);
        n.name = this.visitIdentifierReference(n.name);
        return n;
    }

    visitJSXMemberExpression(n: JSXMemberExpression): JSXMemberExpression {
        n.object = this.visitJSXObject(n.object);
        n.property = this.visitIdentifierReference(n.property);
        return n;
    }

    visitJSXObject(n: JSXObject): JSXObject {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "JSXMemberExpression":
                return this.visitJSXMemberExpression(n);
        }
    }

    visitJSXFragment(n: JSXFragment): JSXFragment {
        n.opening = this.visitJSXOpeningFragment(n.opening);
        if (n.children) {
            n.children = this.visitJSXElementChildren(n.children);
        }
        n.closing = this.visitJSXClosingFragment(n.closing);
        return n;
    }

    visitJSXClosingFragment(n: JSXClosingFragment): JSXClosingFragment {
        return n;
    }

    visitJSXElementChildren(nodes: JSXElementChild[]): JSXElementChild[] {
        return nodes.map(this.visitJSXElementChild.bind(this));
    }

    visitJSXElementChild(n: JSXElementChild): JSXElementChild {
        switch (n.type) {
            case "JSXElement":
                return this.visitJSXElement(n);
            case "JSXExpressionContainer":
                return this.visitJSXExpressionContainer(n);
            case "JSXFragment":
                return this.visitJSXFragment(n);
            case "JSXSpreadChild":
                return this.visitJSXSpreadChild(n);
            case "JSXText":
                return this.visitJSXText(n);
        }
    }

    visitJSXExpressionContainer(
        n: JSXExpressionContainer
    ): JSXExpressionContainer {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitJSXSpreadChild(n: JSXSpreadChild): JSXElementChild {
        n.expression = this.visitExpression(n.expression);
        return n;
    }

    visitJSXOpeningFragment(n: JSXOpeningFragment): JSXOpeningFragment {
        return n;
    }

    visitJSXEmptyExpression(n: JSXEmptyExpression): Expression {
        return n;
    }

    visitJSXElement(n: JSXElement): JSXElement {
        n.opening = this.visitJSXOpeningElement(n.opening);
        n.children = this.visitJSXElementChildren(n.children);
        n.closing = this.visitJSXClosingElement(n.closing);
        return n;
    }

    visitJSXClosingElement(
        n: JSXClosingElement | undefined
    ): JSXClosingElement | undefined {
        if (n) {
            n.name = this.visitJSXElementName(n.name);
        }
        return n;
    }

    visitJSXElementName(n: JSXElementName): JSXElementName {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "JSXMemberExpression":
                return this.visitJSXMemberExpression(n);
            case "JSXNamespacedName":
                return this.visitJSXNamespacedName(n);
        }
    }

    visitJSXOpeningElement(n: JSXOpeningElement): JSXOpeningElement {
        n.name = this.visitJSXElementName(n.name);
        n.typeArguments = this.visitTsTypeParameterInstantiation(
            n.typeArguments
        );
        n.attributes = this.visitJSXAttributeOrSpreads(n.attributes);
        return n;
    }

    visitJSXAttributes(
        attrs: JSXAttributeOrSpread[] | undefined
    ): JSXAttributeOrSpread[] | undefined {
        if (attrs) return attrs.map(this.visitJSXAttributeOrSpread.bind(this));
    }

    visitJSXAttributeOrSpread(n: JSXAttributeOrSpread): JSXAttributeOrSpread {
        switch (n.type) {
            case "JSXAttribute":
                return this.visitJSXAttribute(n);
            case "SpreadElement":
                return this.visitSpreadElement(n);
        }
    }
    visitJSXAttributeOrSpreads(
        nodes: JSXAttributeOrSpread[]
    ): JSXAttributeOrSpread[] {
        return nodes.map(this.visitJSXAttributeOrSpread.bind(this));
    }

    visitJSXAttribute(n: JSXAttribute): JSXAttributeOrSpread {
        n.name = this.visitJSXAttributeName(n.name);
        n.value = this.visitJSXAttributeValue(n.value);
        return n;
    }

    visitJSXAttributeValue(
        n: JSXAttrValue | undefined
    ): JSXAttrValue | undefined {
        if (!n) return n;

        switch (n.type) {
            case "BooleanLiteral":
                return this.visitBooleanLiteral(n);
            case "NullLiteral":
                return this.visitNullLiteral(n);
            case "NumericLiteral":
                return this.visitNumericLiteral(n);
            case "JSXText":
                return this.visitJSXText(n);
            case "StringLiteral":
                return this.visitStringLiteral(n);

            case "JSXElement":
                return this.visitJSXElement(n);
            case "JSXExpressionContainer":
                return this.visitJSXExpressionContainer(n);
            case "JSXFragment":
                return this.visitJSXFragment(n);
        }
        return n;
    }

    visitJSXAttributeName(n: JSXAttributeName): JSXAttributeName {
        switch (n.type) {
            case "Identifier":
                return this.visitIdentifierReference(n);
            case "JSXNamespacedName":
                return this.visitJSXNamespacedName(n);
        }
    }

    visitConditionalExpression(n: ConditionalExpression): Expression {
        n.test = this.visitExpression(n.test);
        n.consequent = this.visitExpression(n.consequent);
        n.alternate = this.visitExpression(n.alternate);
        return n;
    }

    visitCallExpression(n: CallExpression): Expression {
        n.callee = this.visitCallee(n.callee);
        n.typeArguments = this.visitTsTypeParameterInstantiation(
            n.typeArguments
        );
        if (n.arguments) {
            n.arguments = this.visitArguments(n.arguments);
        }

        return n;
    }

    visitBooleanLiteral(n: BooleanLiteral): BooleanLiteral {
        return n;
    }

    visitBinaryExpression(n: BinaryExpression): Expression {
        n.left = this.visitExpression(n.left);
        n.right = this.visitExpression(n.right);
        return n;
    }

    visitAwaitExpression(n: AwaitExpression): Expression {
        n.argument = this.visitExpression(n.argument);
        return n;
    }

    visitTsTypeParameterDeclaration(
        n: TsTypeParameterDeclaration | undefined
    ): TsTypeParameterDeclaration | undefined {
        if (n) {
            n.parameters = this.visitTsTypeParameters(n.parameters);
        }
        return n;
    }

    visitTsTypeParameters(nodes: TsTypeParameter[]): TsTypeParameter[] {
        return nodes.map(this.visitTsTypeParameter.bind(this));
    }

    visitTsTypeParameter(n: TsTypeParameter): TsTypeParameter {
        if (n.constraint) {
            n.constraint = this.visitTsType(n.constraint);
        }
        if (n.default) {
            n.default = this.visitTsType(n.default);
        }
        n.name = this.visitIdentifierReference(n.name);
        return n;
    }

    visitTsTypeAnnotation(
        a: TsTypeAnnotation | undefined
    ): TsTypeAnnotation | undefined {
        if (a) {
            a.typeAnnotation = this.visitTsType(a.typeAnnotation);
        }
        return a;
    }

    visitTsType(n: TsType): TsType {
        throw new Error("Method visitTsType not implemented.");
    }

    visitPatterns(nodes: Pattern[]): Pattern[] {
        return nodes.map(this.visitPattern.bind(this));
    }

    visitImportDeclaration(n: ImportDeclaration): ImportDeclaration {
        n.source = this.visitStringLiteral(n.source);
        n.specifiers = this.visitImportSpecifiers(n.specifiers || []);
        return n;
    }

    visitImportSpecifiers(nodes: ImportSpecifier[]): ImportSpecifier[] {
        return nodes.map(this.visitImportSpecifier.bind(this));
    }

    visitImportSpecifier(node: ImportSpecifier): ImportSpecifier {
        switch (node.type) {
            case "ImportDefaultSpecifier":
                return this.visitImportDefaultSpecifier(node);

            case "ImportNamespaceSpecifier":
                return this.visitImportNamespaceSpecifier(node);

            case "ImportSpecifier":
                return this.visitNamedImportSpecifier(node);
        }
    }
    visitNamedImportSpecifier(
        node: NamedImportSpecifier
    ): NamedImportSpecifier {
        node.local = this.visitBindingIdentifier(node.local);

        if (node.imported) {
            node.imported = this.visitModuleExportName(node.imported);
        }

        return node;
    }

    visitImportNamespaceSpecifier(
        node: ImportNamespaceSpecifier
    ): ImportNamespaceSpecifier {
        node.local = this.visitBindingIdentifier(node.local);

        return node;
    }

    visitImportDefaultSpecifier(node: ImportDefaultSpecifier): ImportSpecifier {
        node.local = this.visitBindingIdentifier(node.local);

        return node;
    }

    visitBindingIdentifier(i: BindingIdentifier): BindingIdentifier {
        if (i.typeAnnotation) {
            i.typeAnnotation = this.visitTsTypeAnnotation(i.typeAnnotation);
        }
        return this.visitIdentifier(i);
    }

    visitIdentifierReference(i: Identifier): Identifier {
        return this.visitIdentifier(i);
    }

    visitLabelIdentifier(label: Identifier): Identifier {
        return this.visitIdentifier(label);
    }

    visitIdentifier(n: Identifier): Identifier {
        return n;
    }

    visitStringLiteral(n: StringLiteral): StringLiteral {
        return n;
    }

    visitNumericLiteral(n: NumericLiteral): NumericLiteral {
        return n;
    }

    visitBigIntLiteral(n: BigIntLiteral): BigIntLiteral {
        return n;
    }

    visitPattern(n: Pattern): Pattern {
        switch (n.type) {
            case "Identifier":
                return this.visitBindingIdentifier(n);
            case "ArrayPattern":
                return this.visitArrayPattern(n);
            case "ObjectPattern":
                return this.visitObjectPattern(n);
            case "AssignmentPattern":
                return this.visitAssignmentPattern(n);
            case "RestElement":
                return this.visitRestElement(n);
            default:
                return this.visitExpression(n);
        }
    }

    visitRestElement(n: RestElement): RestElement {
        n.argument = this.visitPattern(n.argument);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }

    visitAssignmentPattern(n: AssignmentPattern): Pattern {
        n.left = this.visitPattern(n.left);
        n.right = this.visitExpression(n.right);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }

    visitObjectPattern(n: ObjectPattern): Pattern {
        n.properties = this.visitObjectPatternProperties(n.properties || []);
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        return n;
    }

    visitObjectPatternProperties(
        nodes: ObjectPatternProperty[]
    ): ObjectPatternProperty[] {
        return nodes.map(this.visitObjectPatternProperty.bind(this));
    }

    visitObjectPatternProperty(
        n: ObjectPatternProperty
    ): ObjectPatternProperty {
        switch (n.type) {
            case "AssignmentPatternProperty":
                return this.visitAssignmentPatternProperty(n);
            case "KeyValuePatternProperty":
                return this.visitKeyValuePatternProperty(n);
            case "RestElement":
                return this.visitRestElement(n);
        }
    }

    visitKeyValuePatternProperty(
        n: KeyValuePatternProperty
    ): ObjectPatternProperty {
        n.key = this.visitPropertyName(n.key);
        n.value = this.visitPattern(n.value);
        return n;
    }

    visitAssignmentPatternProperty(
        n: AssignmentPatternProperty
    ): ObjectPatternProperty {
        n.key = this.visitBindingIdentifier(n.key);
        n.value = this.visitOptionalExpression(n.value);
        return n;
    }

    visitArrayPattern(n: ArrayPattern): Pattern {
        n.typeAnnotation = this.visitTsTypeAnnotation(n.typeAnnotation);
        n.elements = this.visitArrayPatternElements(n.elements);
        return n;
    }

    visitArrayPatternElements(
        nodes: (Pattern | undefined)[]
    ): (Pattern | undefined)[] {
        return nodes.map(this.visitArrayPatternElement.bind(this));
    }

    visitArrayPatternElement(n: Pattern | undefined): Pattern | undefined {
        if (n) {
            n = this.visitPattern(n);
        }
        return n;
    }
}

export default Visitor;
