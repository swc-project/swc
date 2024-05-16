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
export declare class Visitor {
    visitProgram(n: Program): Program;
    visitModule(m: Module): Module;
    visitScript(m: Script): Script;
    visitModuleItems(items: ModuleItem[]): ModuleItem[];
    visitModuleItem(n: ModuleItem): ModuleItem;
    visitModuleDeclaration(n: ModuleDeclaration): ModuleDeclaration;
    visitTsNamespaceExportDeclaration(
        n: TsNamespaceExportDeclaration
    ): ModuleDeclaration;
    visitTsExportAssignment(n: TsExportAssignment): TsExportAssignment;
    visitTsImportEqualsDeclaration(
        n: TsImportEqualsDeclaration
    ): ModuleDeclaration;
    visitTsModuleReference(n: TsModuleReference): TsModuleReference;
    visitTsExternalModuleReference(
        n: TsExternalModuleReference
    ): TsExternalModuleReference;
    visitExportAllDeclaration(n: ExportAllDeclaration): ModuleDeclaration;
    visitExportDefaultExpression(n: ExportDefaultExpression): ModuleDeclaration;
    visitExportNamedDeclaration(n: ExportNamedDeclaration): ModuleDeclaration;
    visitExportSpecifiers(nodes: ExportSpecifier[]): ExportSpecifier[];
    visitExportSpecifier(n: ExportSpecifier): ExportSpecifier;
    visitNamedExportSpecifier(n: NamedExportSpecifier): ExportSpecifier;
    visitModuleExportName(n: ModuleExportName): ModuleExportName;
    visitExportNamespaceSpecifier(n: ExportNamespaceSpecifier): ExportSpecifier;
    visitExportDefaultSpecifier(n: ExportDefaultSpecifier): ExportSpecifier;
    visitOptionalStringLiteral(
        n: StringLiteral | undefined
    ): StringLiteral | undefined;
    visitExportDefaultDeclaration(
        n: ExportDefaultDeclaration
    ): ModuleDeclaration;
    visitDefaultDeclaration(n: DefaultDecl): DefaultDecl;
    visitFunctionExpression(n: FunctionExpression): FunctionExpression;
    visitClassExpression(n: ClassExpression): ClassExpression;
    visitExportDeclaration(n: ExportDeclaration): ModuleDeclaration;
    visitArrayExpression(e: ArrayExpression): Expression;
    visitArrayElement(e: ExprOrSpread | undefined): ExprOrSpread | undefined;
    visitExprOrSpread(e: ExprOrSpread): ExprOrSpread;
    visitExprOrSpreads(nodes: ExprOrSpread[]): ExprOrSpread[];
    visitSpreadElement(e: SpreadElement): SpreadElement;
    visitOptionalExpression(e: Expression | undefined): Expression | undefined;
    visitArrowFunctionExpression(e: ArrowFunctionExpression): Expression;
    visitArrowBody(
        body: BlockStatement | Expression
    ): BlockStatement | Expression;
    visitBlockStatement(block: BlockStatement): BlockStatement;
    visitStatements(stmts: Statement[]): Statement[];
    visitStatement(stmt: Statement): Statement;
    visitSwitchStatement(stmt: SwitchStatement): Statement;
    visitSwitchCases(cases: SwitchCase[]): SwitchCase[];
    visitSwitchCase(c: SwitchCase): SwitchCase;
    visitIfStatement(stmt: IfStatement): Statement;
    visitOptionalStatement(stmt: Statement | undefined): Statement | undefined;
    visitBreakStatement(stmt: BreakStatement): Statement;
    visitWhileStatement(stmt: WhileStatement): Statement;
    visitTryStatement(stmt: TryStatement): Statement;
    visitCatchClause(handler: CatchClause | undefined): CatchClause | undefined;
    visitThrowStatement(stmt: ThrowStatement): Statement;
    visitReturnStatement(stmt: ReturnStatement): Statement;
    visitLabeledStatement(stmt: LabeledStatement): Statement;
    visitForStatement(stmt: ForStatement): Statement;
    visitForOfStatement(stmt: ForOfStatement): Statement;
    visitForInStatement(stmt: ForInStatement): Statement;
    visitEmptyStatement(stmt: EmptyStatement): EmptyStatement;
    visitDoWhileStatement(stmt: DoWhileStatement): Statement;
    visitDebuggerStatement(stmt: DebuggerStatement): Statement;
    visitWithStatement(stmt: WithStatement): Statement;
    visitDeclaration(decl: Declaration): Declaration;
    visitVariableDeclaration(n: VariableDeclaration): VariableDeclaration;
    visitVariableDeclarators(nodes: VariableDeclarator[]): VariableDeclarator[];
    visitVariableDeclarator(n: VariableDeclarator): VariableDeclarator;
    visitTsTypeAliasDeclaration(n: TsTypeAliasDeclaration): Declaration;
    visitTsModuleDeclaration(n: TsModuleDeclaration): Declaration;
    visitTsModuleName(n: TsModuleName): TsModuleName;
    visitTsNamespaceBody(n: TsNamespaceBody): TsNamespaceBody | undefined;
    visitTsNamespaceDeclaration(
        n: TsNamespaceDeclaration
    ): TsModuleBlock | TsNamespaceDeclaration;
    visitTsModuleBlock(
        n: TsModuleBlock
    ): TsModuleBlock | TsNamespaceDeclaration;
    visitTsInterfaceDeclaration(
        n: TsInterfaceDeclaration
    ): TsInterfaceDeclaration;
    visitTsInterfaceBody(n: TsInterfaceBody): TsInterfaceBody;
    visitTsTypeElements(nodes: TsTypeElement[]): TsTypeElement[];
    visitTsTypeElement(n: TsTypeElement): TsTypeElement;
    visitTsCallSignatureDeclaration(
        n: TsCallSignatureDeclaration
    ): TsCallSignatureDeclaration;
    visitTsConstructSignatureDeclaration(
        n: TsConstructSignatureDeclaration
    ): TsConstructSignatureDeclaration;
    visitTsPropertySignature(n: TsPropertySignature): TsPropertySignature;
    visitTsGetterSignature(n: TsGetterSignature): TsGetterSignature;
    visitTsSetterSignature(n: TsSetterSignature): TsSetterSignature;
    visitTsMethodSignature(n: TsMethodSignature): TsMethodSignature;
    visitTsEnumDeclaration(n: TsEnumDeclaration): Declaration;
    visitTsEnumMembers(nodes: TsEnumMember[]): TsEnumMember[];
    visitTsEnumMember(n: TsEnumMember): TsEnumMember;
    visitTsEnumMemberId(n: TsEnumMemberId): TsEnumMemberId;
    visitFunctionDeclaration(decl: FunctionDeclaration): Declaration;
    visitClassDeclaration(decl: ClassDeclaration): Declaration;
    visitClassBody(members: ClassMember[]): ClassMember[];
    visitClassMember(member: ClassMember): ClassMember;
    visitTsIndexSignature(n: TsIndexSignature): TsIndexSignature;
    visitTsFnParameters(params: TsFnParameter[]): TsFnParameter[];
    visitTsFnParameter(n: TsFnParameter): TsFnParameter;
    visitPrivateProperty(n: PrivateProperty): ClassMember;
    visitPrivateMethod(n: PrivateMethod): ClassMember;
    visitPrivateName(n: PrivateName): PrivateName;
    visitConstructor(n: Constructor): ClassMember;
    visitConstructorParameters(
        nodes: (Param | TsParameterProperty)[]
    ): (Param | TsParameterProperty)[];
    visitConstructorParameter(
        n: Param | TsParameterProperty
    ): Param | TsParameterProperty;
    visitStaticBlock(n: StaticBlock): StaticBlock;
    visitTsParameterProperty(
        n: TsParameterProperty
    ): TsParameterProperty | Param;
    visitTsParameterPropertyParameter(
        n: TsParameterPropertyParameter
    ): TsParameterPropertyParameter;
    visitPropertyName(key: PropertyName): PropertyName;
    visitAccessibility(n: Accessibility | undefined): Accessibility | undefined;
    visitClassProperty(n: ClassProperty): ClassMember;
    visitClassMethod(n: ClassMethod): ClassMember;
    visitComputedPropertyKey(n: ComputedPropName): ComputedPropName;
    visitClass<T extends Class>(n: T): T;
    visitFunction<T extends Fn>(n: T): T;
    visitTsExpressionsWithTypeArguments(
        nodes: TsExpressionWithTypeArguments[]
    ): TsExpressionWithTypeArguments[];
    visitTsExpressionWithTypeArguments(
        n: TsExpressionWithTypeArguments
    ): TsExpressionWithTypeArguments;
    visitTsTypeParameterInstantiation(
        n: TsTypeParameterInstantiation | undefined
    ): TsTypeParameterInstantiation | undefined;
    visitTsTypes(nodes: TsType[]): TsType[];
    visitTsEntityName(n: TsEntityName): TsEntityName;
    visitTsQualifiedName(n: TsQualifiedName): TsQualifiedName;
    visitDecorators(nodes: Decorator[] | undefined): Decorator[] | undefined;
    visitDecorator(n: Decorator): Decorator;
    visitExpressionStatement(stmt: ExpressionStatement): Statement;
    visitContinueStatement(stmt: ContinueStatement): Statement;
    visitExpression(n: Expression): Expression;
    visitOptionalChainingExpression(n: OptionalChainingExpression): Expression;
    visitMemberExpressionOrOptionalChainingCall(
        n: MemberExpression | OptionalChainingCall
    ): MemberExpression | OptionalChainingCall;
    visitOptionalChainingCall(n: OptionalChainingCall): OptionalChainingCall;
    visitAssignmentExpression(n: AssignmentExpression): Expression;
    visitPatternOrExpression(n: Pattern | Expression): Pattern | Expression;
    visitYieldExpression(n: YieldExpression): Expression;
    visitUpdateExpression(n: UpdateExpression): Expression;
    visitUnaryExpression(n: UnaryExpression): Expression;
    visitTsTypeAssertion(n: TsTypeAssertion): Expression;
    visitTsConstAssertion(n: TsConstAssertion): Expression;
    visitTsInstantiation(n: TsInstantiation): TsInstantiation;
    visitTsNonNullExpression(n: TsNonNullExpression): Expression;
    visitTsAsExpression(n: TsAsExpression): Expression;
    visitTsSatisfiesExpression(n: TsSatisfiesExpression): Expression;
    visitThisExpression(n: ThisExpression): Expression;
    visitTemplateLiteral(n: TemplateLiteral): Expression;
    visitParameters(n: Param[]): Param[];
    visitParameter(n: Param): Param;
    visitTaggedTemplateExpression(n: TaggedTemplateExpression): Expression;
    visitSequenceExpression(n: SequenceExpression): Expression;
    visitRegExpLiteral(n: RegExpLiteral): Expression;
    visitParenthesisExpression(n: ParenthesisExpression): Expression;
    visitObjectExpression(n: ObjectExpression): Expression;
    visitObjectProperties(
        nodes: (Property | SpreadElement)[]
    ): (Property | SpreadElement)[];
    visitObjectProperty(n: Property | SpreadElement): Property | SpreadElement;
    visitProperty(n: Property): Property | SpreadElement;
    visitSetterProperty(n: SetterProperty): Property | SpreadElement;
    visitMethodProperty(n: MethodProperty): Property | SpreadElement;
    visitKeyValueProperty(n: KeyValueProperty): Property | SpreadElement;
    visitGetterProperty(n: GetterProperty): Property | SpreadElement;
    visitAssignmentProperty(n: AssignmentProperty): Property | SpreadElement;
    visitNullLiteral(n: NullLiteral): NullLiteral;
    visitNewExpression(n: NewExpression): Expression;
    visitTsTypeArguments(
        n: TsTypeParameterInstantiation | undefined
    ): TsTypeParameterInstantiation | undefined;
    visitArguments(nodes: Argument[]): Argument[];
    visitArgument(n: Argument): Argument;
    visitMetaProperty(n: MetaProperty): Expression;
    visitMemberExpression(n: MemberExpression): MemberExpression;
    visitSuperPropExpression(n: SuperPropExpression): Expression;
    visitCallee(n: Expression | Super | Import): Expression | Super | Import;
    visitJSXText(n: JSXText): JSXText;
    visitJSXNamespacedName(n: JSXNamespacedName): JSXNamespacedName;
    visitJSXMemberExpression(n: JSXMemberExpression): JSXMemberExpression;
    visitJSXObject(n: JSXObject): JSXObject;
    visitJSXFragment(n: JSXFragment): JSXFragment;
    visitJSXClosingFragment(n: JSXClosingFragment): JSXClosingFragment;
    visitJSXElementChildren(nodes: JSXElementChild[]): JSXElementChild[];
    visitJSXElementChild(n: JSXElementChild): JSXElementChild;
    visitJSXExpressionContainer(
        n: JSXExpressionContainer
    ): JSXExpressionContainer;
    visitJSXSpreadChild(n: JSXSpreadChild): JSXElementChild;
    visitJSXOpeningFragment(n: JSXOpeningFragment): JSXOpeningFragment;
    visitJSXEmptyExpression(n: JSXEmptyExpression): Expression;
    visitJSXElement(n: JSXElement): JSXElement;
    visitJSXClosingElement(
        n: JSXClosingElement | undefined
    ): JSXClosingElement | undefined;
    visitJSXElementName(n: JSXElementName): JSXElementName;
    visitJSXOpeningElement(n: JSXOpeningElement): JSXOpeningElement;
    visitJSXAttributes(
        attrs: JSXAttributeOrSpread[] | undefined
    ): JSXAttributeOrSpread[] | undefined;
    visitJSXAttributeOrSpread(n: JSXAttributeOrSpread): JSXAttributeOrSpread;
    visitJSXAttributeOrSpreads(
        nodes: JSXAttributeOrSpread[]
    ): JSXAttributeOrSpread[];
    visitJSXAttribute(n: JSXAttribute): JSXAttributeOrSpread;
    visitJSXAttributeValue(
        n: JSXAttrValue | undefined
    ): JSXAttrValue | undefined;
    visitJSXAttributeName(n: JSXAttributeName): JSXAttributeName;
    visitConditionalExpression(n: ConditionalExpression): Expression;
    visitCallExpression(n: CallExpression): Expression;
    visitBooleanLiteral(n: BooleanLiteral): BooleanLiteral;
    visitBinaryExpression(n: BinaryExpression): Expression;
    visitAwaitExpression(n: AwaitExpression): Expression;
    visitTsTypeParameterDeclaration(
        n: TsTypeParameterDeclaration | undefined
    ): TsTypeParameterDeclaration | undefined;
    visitTsTypeParameters(nodes: TsTypeParameter[]): TsTypeParameter[];
    visitTsTypeParameter(n: TsTypeParameter): TsTypeParameter;
    visitTsTypeAnnotation(
        a: TsTypeAnnotation | undefined
    ): TsTypeAnnotation | undefined;
    visitTsType(n: TsType): TsType;
    visitPatterns(nodes: Pattern[]): Pattern[];
    visitImportDeclaration(n: ImportDeclaration): ImportDeclaration;
    visitImportSpecifiers(nodes: ImportSpecifier[]): ImportSpecifier[];
    visitImportSpecifier(node: ImportSpecifier): ImportSpecifier;
    visitNamedImportSpecifier(node: NamedImportSpecifier): NamedImportSpecifier;
    visitImportNamespaceSpecifier(
        node: ImportNamespaceSpecifier
    ): ImportNamespaceSpecifier;
    visitImportDefaultSpecifier(node: ImportDefaultSpecifier): ImportSpecifier;
    visitBindingIdentifier(i: BindingIdentifier): BindingIdentifier;
    visitIdentifierReference(i: Identifier): Identifier;
    visitLabelIdentifier(label: Identifier): Identifier;
    visitIdentifier(n: Identifier): Identifier;
    visitStringLiteral(n: StringLiteral): StringLiteral;
    visitNumericLiteral(n: NumericLiteral): NumericLiteral;
    visitBigIntLiteral(n: BigIntLiteral): BigIntLiteral;
    visitPattern(n: Pattern): Pattern;
    visitRestElement(n: RestElement): RestElement;
    visitAssignmentPattern(n: AssignmentPattern): Pattern;
    visitObjectPattern(n: ObjectPattern): Pattern;
    visitObjectPatternProperties(
        nodes: ObjectPatternProperty[]
    ): ObjectPatternProperty[];
    visitObjectPatternProperty(n: ObjectPatternProperty): ObjectPatternProperty;
    visitKeyValuePatternProperty(
        n: KeyValuePatternProperty
    ): ObjectPatternProperty;
    visitAssignmentPatternProperty(
        n: AssignmentPatternProperty
    ): ObjectPatternProperty;
    visitArrayPattern(n: ArrayPattern): Pattern;
    visitArrayPatternElements(
        nodes: (Pattern | undefined)[]
    ): (Pattern | undefined)[];
    visitArrayPatternElement(n: Pattern | undefined): Pattern | undefined;
}
export default Visitor;
