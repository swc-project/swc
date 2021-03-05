use std::collections::HashMap;

use ahash::RandomState;
use serde::{Serialize, Deserialize};
use serde_json::Value;

// Source: https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LineCol {
    pub line: usize,
    pub column: usize,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Loc {
    pub start: LineCol,
    pub end: LineCol,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseComment {
    pub value: String,
    pub start: usize,
    pub end: usize,
    pub loc: Loc,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub enum Comment {
    #[serde(rename = "CommentBlock")]
    Block(BaseComment),
    #[serde(rename = "CommentLine")]
    Line(BaseComment),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseNode {
    #[serde(default)]
    pub leading_comments: Vec<Comment>,
    #[serde(default)]
    pub inner_comments: Vec<Comment>,
    #[serde(default)]
    pub trailing_comments: Vec<Comment>,

    #[serde(default)]
    pub start: Option<usize>,
    #[serde(default)]
    pub end: Option<usize>,
    #[serde(default)]
    pub loc: Option<Loc>,

    #[serde(default)]
    pub extra: Option<HashMap<String, Value, RandomState>>,
}

// #[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub enum CommentTypeShorthand {
//     Leading,
//     Inner,
//     Trailing,
// }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Node {

    // TODO

    // AnyTypeAnnotation(AnyTypeAnnotation),
    // ArgumentPlaceholder(ArgumentPlaceholder),
    // ArrayExpression(ArrayExpression),
    // ArrayPattern(ArrayPattern),
    // ArrayTypeAnnotation(ArrayTypeAnnotation),
    // ArrowFunctionExpression(ArrowFunctionExpression),
    // AssignmentExpression(AssignmentExpression),
    // AssignmentPattern(AssignmentPattern),
    // AwaitExpression(AwaitExpression),
    // BigIntLiteral(BigIntLiteral),
    // Binary(Binary),
    // BinaryExpression(BinaryExpression),
    // BindExpression(BindExpression),
    // Block(Block),
    // BlockParent(BlockParent),
    // BlockStatement(BlockStatement),
    // BooleanLiteral(BooleanLiteral),
    // BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
    // BooleanTypeAnnotation(BooleanTypeAnnotation),
    // BreakStatement(BreakStatement),
    // CallExpression(CallExpression),
    // CatchClause(CatchClause),
    // Class(Class),
    // ClassBody(ClassBody),
    // ClassDeclaration(ClassDeclaration),
    // ClassExpression(ClassExpression),
    // ClassImplements(ClassImplements),
    // ClassMethod(ClassMethod),
    // ClassPrivateMethod(ClassPrivateMethod),
    // ClassPrivateProperty(ClassPrivateProperty),
    // ClassProperty(ClassProperty),
    // CompletionStatement(CompletionStatement),
    // Conditional(Conditional),
    // ConditionalExpression(ConditionalExpression),
    // ContinueStatement(ContinueStatement),
    // DebuggerStatement(DebuggerStatement),
    // DecimalLiteral(DecimalLiteral),
    // Declaration(Declaration),
    // DeclareClass(DeclareClass),
    // DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    // DeclareExportDeclaration(DeclareExportDeclaration),
    // DeclareFunction(DeclareFunction),
    // DeclareInterface(DeclareInterface),
    // DeclareModule(DeclareModule),
    // DeclareModuleExports(DeclareModuleExports),
    // DeclareOpaqueType(DeclareOpaqueType),
    // DeclareTypeAlias(DeclareTypeAlias),
    // DeclareVariable(DeclareVariable),
    // DeclaredPredicate(DeclaredPredicate),
    // Decorator(Decorator),
    // Directive(Directive),
    // DirectiveLiteral(DirectiveLiteral),
    // DoExpression(DoExpression),
    // DoWhileStatement(DoWhileStatement),
    // EmptyStatement(EmptyStatement),
    // EmptyTypeAnnotation(EmptyTypeAnnotation),
    // EnumBody(EnumBody),
    // EnumBooleanBody(EnumBooleanBody),
    // EnumBooleanMember(EnumBooleanMember),
    // EnumDeclaration(EnumDeclaration),
    // EnumDefaultedMember(EnumDefaultedMember),
    // EnumMember(EnumMember),
    // EnumNumberBody(EnumNumberBody),
    // EnumNumberMember(EnumNumberMember),
    // EnumStringBody(EnumStringBody),
    // EnumStringMember(EnumStringMember),
    // EnumSymbolBody(EnumSymbolBody),
    // ExistsTypeAnnotation(ExistsTypeAnnotation),
    // ExportAllDeclaration(ExportAllDeclaration),
    // ExportDeclaration(ExportDeclaration),
    // ExportDefaultDeclaration(ExportDefaultDeclaration),
    // ExportDefaultSpecifier(ExportDefaultSpecifier),
    // ExportNamedDeclaration(ExportNamedDeclaration),
    // ExportNamespaceSpecifier(ExportNamespaceSpecifier),
    // ExportSpecifier(ExportSpecifier),
    // Expression(Expression),
    // ExpressionStatement(ExpressionStatement),
    // ExpressionWrapper(ExpressionWrapper),
    // File(File),
    // Flow(Flow),
    // FlowBaseAnnotation(FlowBaseAnnotation),
    // FlowDeclaration(FlowDeclaration),
    // FlowPredicate(FlowPredicate),
    // FlowType(FlowType),
    // For(For),
    // ForInStatement(ForInStatement),
    // ForOfStatement(ForOfStatement),
    // ForStatement(ForStatement),
    // ForXStatement(ForXStatement),
    // Function(Function),
    // FunctionDeclaration(FunctionDeclaration),
    // FunctionExpression(FunctionExpression),
    // FunctionParent(FunctionParent),
    // FunctionTypeAnnotation(FunctionTypeAnnotation),
    // FunctionTypeParam(FunctionTypeParam),
    // GenericTypeAnnotation(GenericTypeAnnotation),
    // Identifier(Identifier),
    // IfStatement(IfStatement),
    // Immutable(Immutable),
    // Import(Import),
    // ImportAttribute(ImportAttribute),
    // ImportDeclaration(ImportDeclaration),
    // ImportDefaultSpecifier(ImportDefaultSpecifier),
    // ImportNamespaceSpecifier(ImportNamespaceSpecifier),
    // ImportSpecifier(ImportSpecifier),
    // InferredPredicate(InferredPredicate),
    // InterfaceDeclaration(InterfaceDeclaration),
    // InterfaceExtends(InterfaceExtends),
    // InterfaceTypeAnnotation(InterfaceTypeAnnotation),
    // InterpreterDirective(InterpreterDirective),
    // IntersectionTypeAnnotation(IntersectionTypeAnnotation),
    // JSX(JSX),
    // JSXAttribute(JSXAttribute),
    // JSXClosingElement(JSXClosingElement),
    // JSXClosingFragment(JSXClosingFragment),
    // JSXElement(JSXElement),
    // JSXEmptyExpression(JSXEmptyExpression),
    // JSXExpressionContainer(JSXExpressionContainer),
    // JSXFragment(JSXFragment),
    // JSXIdentifier(JSXIdentifier),
    // JSXMemberExpression(JSXMemberExpression),
    // JSXNamespacedName(JSXNamespacedName),
    // JSXOpeningElement(JSXOpeningElement),
    // JSXOpeningFragment(JSXOpeningFragment),
    // JSXSpreadAttribute(JSXSpreadAttribute),
    // JSXSpreadChild(JSXSpreadChild),
    // JSXText(JSXText),
    // LVal(LVal),
    // LabeledStatement(LabeledStatement),
    // Literal(Literal),
    // LogicalExpression(LogicalExpression),
    // Loop(Loop),
    // MemberExpression(MemberExpression),
    // MetaProperty(MetaProperty),
    // Method(Method),
    // MixedTypeAnnotation(MixedTypeAnnotation),
    // ModuleDeclaration(ModuleDeclaration),
    // ModuleExpression(ModuleExpression),
    // ModuleSpecifier(ModuleSpecifier),
    // NewExpression(NewExpression),
    // Noop(Noop),
    // NullLiteral(NullLiteral),
    // NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    // NullableTypeAnnotation(NullableTypeAnnotation),
    // NumberLiteral(NumberLiteral),
    // NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
    // NumberTypeAnnotation(NumberTypeAnnotation),
    // NumericLiteral(NumericLiteral),
    // ObjectExpression(ObjectExpression),
    // ObjectMember(ObjectMember),
    // ObjectMethod(ObjectMethod),
    // ObjectPattern(ObjectPattern),
    // ObjectProperty(ObjectProperty),
    // ObjectTypeAnnotation(ObjectTypeAnnotation),
    // ObjectTypeCallProperty(ObjectTypeCallProperty),
    // ObjectTypeIndexer(ObjectTypeIndexer),
    // ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    // ObjectTypeProperty(ObjectTypeProperty),
    // ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
    // OpaqueType(OpaqueType),
    // OptionalCallExpression(OptionalCallExpression),
    // OptionalMemberExpression(OptionalMemberExpression),
    // ParenthesizedExpression(ParenthesizedExpression),
    // Pattern(Pattern),
    // PatternLike(PatternLike),
    // PipelineBareFunction(PipelineBareFunction),
    // PipelinePrimaryTopicReference(PipelinePrimaryTopicReference),
    // PipelineTopicExpression(PipelineTopicExpression),
    // Placeholder(Placeholder),
    // Private(Private),
    // PrivateName(PrivateName),
    // Program(Program),
    // Property(Property),
    // Pureish(Pureish),
    // QualifiedTypeIdentifier(QualifiedTypeIdentifier),
    // RecordExpression(RecordExpression),
    // RegExpLiteral(RegExpLiteral),
    // RegexLiteral(RegexLiteral),
    // RestElement(RestElement),
    // RestProperty(RestProperty),
    // ReturnStatement(ReturnStatement),
    // Scopable(Scopable),
    // SequenceExpression(SequenceExpression),
    // SpreadElement(SpreadElement),
    // SpreadProperty(SpreadProperty),
    // Statement(Statement),
    // StaticBlock(StaticBlock),
    // StringLiteral(StringLiteral),
    // StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
    // StringTypeAnnotation(StringTypeAnnotation),
    // Super(Super),
    // SwitchCase(SwitchCase),
    // SwitchStatement(SwitchStatement),
    // SymbolTypeAnnotation(SymbolTypeAnnotation),
    // TSAnyKeyword(TSAnyKeyword),
    // TSArrayType(TSArrayType),
    // TSAsExpression(TSAsExpression),
    // TSBaseType(TSBaseType),
    // TSBigIntKeyword(TSBigIntKeyword),
    // TSBooleanKeyword(TSBooleanKeyword),
    // TSCallSignatureDeclaration(TSCallSignatureDeclaration),
    // TSConditionalType(TSConditionalType),
    // TSConstructSignatureDeclaration(TSConstructSignatureDeclaration),
    // TSConstructorType(TSConstructorType),
    // TSDeclareFunction(TSDeclareFunction),
    // TSDeclareMethod(TSDeclareMethod),
    // TSEntityName(TSEntityName),
    // TSEnumDeclaration(TSEnumDeclaration),
    // TSEnumMember(TSEnumMember),
    // TSExportAssignment(TSExportAssignment),
    // TSExpressionWithTypeArguments(TSExpressionWithTypeArguments),
    // TSExternalModuleReference(TSExternalModuleReference),
    // TSFunctionType(TSFunctionType),
    // TSImportEqualsDeclaration(TSImportEqualsDeclaration),
    // TSImportType(TSImportType),
    // TSIndexSignature(TSIndexSignature),
    // TSIndexedAccessType(TSIndexedAccessType),
    // TSInferType(TSInferType),
    // TSInterfaceBody(TSInterfaceBody),
    // TSInterfaceDeclaration(TSInterfaceDeclaration),
    // TSIntersectionType(TSIntersectionType),
    // TSIntrinsicKeyword(TSIntrinsicKeyword),
    // TSLiteralType(TSLiteralType),
    // TSMappedType(TSMappedType),
    // TSMethodSignature(TSMethodSignature),
    // TSModuleBlock(TSModuleBlock),
    // TSModuleDeclaration(TSModuleDeclaration),
    // TSNamedTupleMember(TSNamedTupleMember),
    // TSNamespaceExportDeclaration(TSNamespaceExportDeclaration),
    // TSNeverKeyword(TSNeverKeyword),
    // TSNonNullExpression(TSNonNullExpression),
    // TSNullKeyword(TSNullKeyword),
    // TSNumberKeyword(TSNumberKeyword),
    // TSObjectKeyword(TSObjectKeyword),
    // TSOptionalType(TSOptionalType),
    // TSParameterProperty(TSParameterProperty),
    // TSParenthesizedType(TSParenthesizedType),
    // TSPropertySignature(TSPropertySignature),
    // TSQualifiedName(TSQualifiedName),
    // TSRestType(TSRestType),
    // TSStringKeyword(TSStringKeyword),
    // TSSymbolKeyword(TSSymbolKeyword),
    // TSThisType(TSThisType),
    // TSTupleType(TSTupleType),
    // TSType(TSType),
    // TSTypeAliasDeclaration(TSTypeAliasDeclaration),
    // TSTypeAnnotation(TSTypeAnnotation),
    // TSTypeAssertion(TSTypeAssertion),
    // TSTypeElement(TSTypeElement),
    // TSTypeLiteral(TSTypeLiteral),
    // TSTypeOperator(TSTypeOperator),
    // TSTypeParameter(TSTypeParameter),
    // TSTypeParameterDeclaration(TSTypeParameterDeclaration),
    // TSTypeParameterInstantiation(TSTypeParameterInstantiation),
    // TSTypePredicate(TSTypePredicate),
    // TSTypeQuery(TSTypeQuery),
    // TSTypeReference(TSTypeReference),
    // TSUndefinedKeyword(TSUndefinedKeyword),
    // TSUnionType(TSUnionType),
    // TSUnknownKeyword(TSUnknownKeyword),
    // TSVoidKeyword(TSVoidKeyword),
    // TaggedTemplateExpression(TaggedTemplateExpression),
    // TemplateElement(TemplateElement),
    // TemplateLiteral(TemplateLiteral),
    // Terminatorless(Terminatorless),
    // ThisExpression(ThisExpression),
    // ThisTypeAnnotation(ThisTypeAnnotation),
    // ThrowStatement(ThrowStatement),
    // TryStatement(TryStatement),
    // TupleExpression(TupleExpression),
    // TupleTypeAnnotation(TupleTypeAnnotation),
    // TypeAlias(TypeAlias),
    // TypeAnnotation(TypeAnnotation),
    // TypeCastExpression(TypeCastExpression),
    // TypeParameter(TypeParameter),
    // TypeParameterDeclaration(TypeParameterDeclaration),
    // TypeParameterInstantiation(TypeParameterInstantiation),
    // TypeofTypeAnnotation(TypeofTypeAnnotation),
    // UnaryExpression(UnaryExpression),
    // UnaryLike(UnaryLike),
    // UnionTypeAnnotation(UnionTypeAnnotation),
    // UpdateExpression(UpdateExpression),
    // UserWhitespacable(UserWhitespacable),
    // V8IntrinsicIdentifier(V8IntrinsicIdentifier),
    // VariableDeclaration(VariableDeclaration),
    // VariableDeclarator(VariableDeclarator),
    // Variance(Variance),
    // VoidTypeAnnotation(VoidTypeAnnotation),
    // While(While),
    // WhileStatement(WhileStatement),
    // WithStatement(WithStatement),
    // YieldExpression(YieldExpression),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ArrayEl {
    // TODO
    // Expression(Expression),
    // SpreadElement(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ArrayExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub elements: Vec<Option<ArrayEl>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AssignmentExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: String,
    // TODO
    // pub left: LVal,
    // pub right: Expression,
}

// Source:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BinaryOp {
    #[serde(rename = "+")]
    Addition,
    #[serde(rename = "-")]
    Subtraction,
    #[serde(rename = "/")]
    Division,
    #[serde(rename = "%")]
    Remainder,
    #[serde(rename = "*")]
    Multiplication,
    #[serde(rename = "**")]
    Exponentiation,
    #[serde(rename = "&")]
    And,
    #[serde(rename = "|")]
    Or,
    #[serde(rename = ">>")]
    RightShift,
    #[serde(rename = ">>>")]
    UnsignedRightShift,
    #[serde(rename = "<<")]
    LeftShift,
    #[serde(rename = "^")]
    Xor,
    #[serde(rename = "==")]
    Equal,
    #[serde(rename = "===")]
    StrictEqual,
    #[serde(rename = "!=")]
    NotEqual,
    #[serde(rename = "!==")]
    StrictNotEqual,
    #[serde(rename = "in")]
    In,
    #[serde(rename = "instanceof")]
    Instanceof,
    #[serde(rename = ">")]
    GreaterThan,
    #[serde(rename = "<")]
    LessThan,
    #[serde(rename = ">=")]
    GreaterThanOrEqual,
    #[serde(rename = "<=")]
    LessThanOrEqual,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BinaryLeft {
    Expression(Expression),
    PrivateName(PrivateName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BinaryExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: BinaryOp,
    pub left: Box<BinaryLeft>,
    pub right: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct InterpreterDirective {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Directive {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: DirectiveLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DirectiveLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BlockStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Vec<Statement>,
    pub directives: Vec<Directive>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BreakStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub label: Option<Identifier>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Callee {
    Expression(Expression),
    V8IntrinsicIdentifier(V8IntrinsicIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Arg {
    Expression(Expression),
    SpreadElement(SpreadElement),
    JSXNamespacedName(JSXNamespacedName),
    ArgumentPlaceholder(ArgumentPlaceholder),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct CallExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Box<Callee>,
    pub arguments: Vec<Arg>,
    pub optional: Option<bool>,
    pub type_arguments: Option<TypeParameterInstantiation>,
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CatchParam {
    Identifier(Identifier),
    ArrayPattern(ArrayPattern),
    ObjectPattern(ObjectPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct CatchClause {
    #[serde(flatten)]
    pub base: BaseNode,
    pub param: Option<CatchParam>,
    pub body: BlockStatement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ConditionalExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Box<Expression>,
    pub consequent: Box<Expression>,
    pub altername: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ContinueStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub label: Option<Identifier>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DebuggerStatement {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DoWhileStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Expression,
    pub body: Statement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EmptyStatement {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExpressionStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct File {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub program: Program,
    pub comments: Option<Vec<Comment>>,
    // pub tokens: Option<Vec<any>>, // TODO: how to model any?
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ForLeft {
    // TODO
    // VariableDeclaration(VariableDeclaration),
    LVal(LVal),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ForInStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: ForLeft,
    pub right: Expression,
    pub body: Statement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ForInit {
    // TODO
    // VariableDeclaration(VariableDeclaration),
    Expression(Expression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ForStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub init: Option<ForInit>,
    pub test: Option<Expression>,
    pub update: Option<Expression>,
    pub body: Statement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlowTypeAnnotationOrTSTypeAnnotationOrNoop { // TODO rename

    // TODO
    // TypeAnnotation(TypeAnnotation),
    // TSTypeAnnotation(TSTypeAnnotation),
    // Noop(Noop),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Param {
    Identifier(Identifier),
    Pattern(Pattern),
    RestElement(RestElement),
    // TODO
    // TSParameterTypeProperty(TSParameterTypeProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop { // TODO rename

    // TODO
    // TypeParameterDeclaration(TypeParameterDeclaration),
    // TSTypeParameterDeclaration(TSTypeParameterDeclaration),
    // Noop(Noop),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Option<Identifier>,
    pub params: Vec<Param>,
    pub body: BlockStatement,
    pub generator: Option<bool>,
    #[serde(rename = "async")]
    pub is_async: Option<bool>,
    pub return_type: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Option<Identifier>,
    pub params: Vec<Param>,
    pub body: BlockStatement,
    pub generator: Option<bool>,
    #[serde(rename = "async")]
    pub is_async: Option<bool>,
    pub return_type: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>,
}


#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct Identifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: String,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub optional: Option<bool>,
    pub type_annotation: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct IfStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Expression,
    pub consequent: Statement,
    pub alternate: Option<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct LabeledStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub label: Identifier,
    pub body: Statement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StringLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NumericLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NullLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BooleanLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct RegExpLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub pattern: String,
    pub flags: String,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LogicalOp {
    #[serde(rename = "||")]
    Or,
    #[serde(rename = "&&")]
    And,
    #[serde(rename = "??")]
    Nullish,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct LogicalExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: LogicalOp,
    pub left: Box<Expression>,
    pub right: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MemberExpressionProperty { // TODO fix names
    Expression(Expression),
    Identifier(Identifier),
    PrivateName(PrivateName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct MemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub property: Box<MemberExpressionProperty>,
    pub computed: bool,
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct NewExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Box<Callee>,
    pub arguments: Vec<Arg>,
    pub optional: Option<bool>,
    pub type_arguments: Option<TypeParameterInstantiation>,
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SourceType {
    Script,
    Module,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct Program {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Vec<Statement>,
    pub directives: Vec<Directive>,
    pub source_type: SourceType,
    pub interpreter: Option<InterpreterDirective>,
    pub source_file: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ObjectExpressionProp {
    // TODO
    // ObjectMethod(ObjectMethod),
    // ObjectProperty(ObjectProperty),
    // SpreadElement(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub properties: Vec<ObjectExpressionProp>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ObjectKind {
    Method,
    Get,
    Set,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ObjectKey {
    Expression(Expression),
    Identifier(Identifier),
    StringLiteral(StringLiteral),
    NumericLiteral(NumericLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: ObjectKind,
    pub key: ObjectKey,
    pub params: Vec<Param>,
    pub body: BlockStatement,
    pub computed: bool,
    pub generator: Option<bool>,
    #[serde(rename = "async")]
    pub is_async: Option<bool>,
    // TODO
    // pub decorator: Option<Vec<Decorator>>,
    pub return_type: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ObjectPropertyVal {
    Expression(Expression),
    PatternLike(PatternLike),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: ObjectKey,
    pub value: ObjectPropertyVal,
    pub computed: bool,
    pub shorthand: bool,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct RestElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: LVal,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub type_annotation: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ReturnStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SequenceExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expressions: Vec<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ParenthesizedExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SwitchCase {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Option<Expression>,
    pub consequent: Vec<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SwitchStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub descriminant: Expression,
    pub cases: Vec<SwitchCase>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ThisExpression {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ThrowStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TryStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub block: BlockStatement,
    pub handler: Option<CatchClause>,
    pub finalizer: Option<BlockStatement>,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum UnaryOp {
    Void,
    Throw,
    Delete,
    #[serde(rename = "!")]
    LogicalNot,
    #[serde(rename = "+")]
    Plus,
    #[serde(rename = "-")]
    Negation,
    #[serde(rename = "~")]
    BitwiseNot,
    Typeof,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct UnaryExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: UnaryOp,
    pub argument: Box<Expression>,
    pub prefix: bool,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UpdateOp {
    #[serde(rename = "++")]
    Increment,
    #[serde(rename = "--")]
    Decrement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct UpdateExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: UpdateOp,
    pub argument: Box<Expression>,
    pub prefix: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum VariableDeclarationKind {
    Var,
    Let,
    Const,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct VariableDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: VariableDeclarationKind,
    pub declarations: Vec<VariableDeclarator>,
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct VariableDeclarator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: LVal,
    pub init: Option<Expression>,
    pub definite: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct WhileStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Expression,
    pub body: Statement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AssignmentPatternLeft {
    Identifier(Identifier),
    // TODO
    // ObjectPattern(ObjectPattern),
    // ArrayPattern(ArrayPattern),
    MemberExpression(MemberExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AssignmentPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: AssignmentPatternLeft,
    pub right: Expression,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub type_annotation: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ArrayPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    pub elements: Vec<Option<PatternLike>>,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub type_annotation: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ArrowFunctionExpressionBody {
    BlockStatement(BlockStatement),
    Expression(Expression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ArrowFunctionExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub params: Vec<Param>,
    pub body: Box<ArrowFunctionExpressionBody>,
    #[serde(rename = "async")]
    pub is_async: bool,
    pub expression: bool,
    pub generator: bool,
    pub return_type: FlowTypeAnnotationOrTSTypeAnnotationOrNoop,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ClassBodyEl {
    // TODO
    // ClassMethod(ClassMethod),
    // ClassPrivateMethod(ClassPrivateMethod),
    // ClassProperty(ClassProperty),
    // ClassPrivateProperty(ClassPrivateProperty),
    // TSDeclareMethod(TSDeclareMethod),
    // TSIndexSignature(TSIndexSignature),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ClassBody {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Vec<ClassBodyEl>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ClassImpl {
    // TODO
    // TSExpressionWithTypeArguments(TSExpressionWithTypeArguments),
    // ClassImplements(ClassImplements),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlowOrTSTypeParameterInstantiation {
    TypeParameterInstantiation(TypeParameterInstantiation),
    TSTypeParameterInstantiation(TSTypeParameterInstantiation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Option<Identifier>,
    pub super_class: Option<Box<Expression>>,
    pub body: ClassBody,
    pub decorators: Option<Vec<Decorator>>,
    pub implements: Option<ClassImpl>,
    pub mixins: Option<InterfaceExtends>,
    pub super_type_parameters: Option<FlowOrTSTypeParameterInstantiation>,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub super_class: Option<Expression>,
    pub body: ClassBody,
    pub decorators: Option<Vec<Decorator>>,
    #[serde(rename = "abstract")]
    pub is_abstract: Option<bool>,
    pub declare: Option<bool>,
    pub implements: Option<ClassImpl>,
    pub mixins: Option<InterfaceExtends>,
    pub super_type_parameters: Option<FlowOrTSTypeParameterInstantiation>,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ExportKind {
    Type,
    Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ExportAllDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub source: StringLiteral,
    pub assertions: Option<Vec<ImportAttribute>>,
    pub export_kind: Option<ExportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExportDefaultDeclartionType {
    FunctionDeclaration(FunctionDeclaration),
    // TODO
    // TSDeclarFunction(TSDeclareFunction),
    ClassDeclaration(ClassDeclaration),
    Expression(Expression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportDefaultDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub declaration: ExportDefaultDeclartionType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExportSpecifierType {
    // TODO
    // ExportSpecifier(ExportSpecifier),
    // ExportDefaultSpecifier(ExportDefaultSpecifier),
    // ExportNamespaceSpecifier(ExportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportNamedDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub declaration: Option<Declaration>,
    pub specifiers: Vec<ExportSpecifierType>,
    pub source: Option<StringLiteral>,
    // TODO
    // pub assertions: Option<Vec<ImportAttribute>>,
    pub export_kind: Option<ExportKind>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum IdOrString {
    Identifier(Identifier),
    StringLiteral(StringLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
    pub exported: IdOrString,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ForOfStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: ForLeft,
    pub right: Expression,
    pub body: Statement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ImportSpecifierType {
    // TODO
    // ImportSpecifier(ImportSpecifier),
    // ImportDefaultSpecifier(ImportDefaultSpecifier),
    // ImportNamespaceSpecifier(ImportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ImportKind {
    Type,
    Typeof,
    Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ImportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub specifiers: Vec<ImportSpecifierType>,
    pub source: StringLiteral,
    // TODO
    // pub assertions: Option<Vec<ImportAttribute>>,
    pub import_kind: Option<ImportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ImportDefaultSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ImportNamespaceSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ImportSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub local: Identifier,
    pub imported: IdOrString,
    pub import_kind: ImportKind,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct MetaProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub meta: Identifier,
    pub property: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ClassMethodKind {
    Get,
    Set,
    Method,
    Constructor,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Access {
    Public,
    Private,
    Protected,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: Option<ClassMethodKind>,
    pub key: ObjectKey,
    pub params: Vec<Param>,
    pub body: BlockStatement,
    pub computed: Option<bool>,
    #[serde(rename = "static")]
    pub is_static: Option<bool>,
    pub generator: Option<bool>,
    #[serde(rename = "async")]
    pub is_async: Option<bool>,
    #[serde(rename = "abstract")]
    pub is_abstract: Option<bool>,
    pub access: Option<Access>,
    pub accessibility: Option<Access>,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub optional: Option<bool>,
    pub return_type: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ObjectPropOrRest {
    RestElement(RestElement),
    ObjectProperty(ObjectProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    pub properties: Vec<ObjectPropOrRest>,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub type_annotation: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SpreadElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Super {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TaggedTemplateExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub tag: Box<Expression>,
    pub quasi: TemplateLiteral,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>, // TODO: w/o noop
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemplateVal {
    pub raw: String,
    pub cooked: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TemplateElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: TemplateVal,
    pub tail: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TemplateExpression {
    Expression(Expression),
    TSType(TSType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TemplateLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub quasis: Vec<TemplateElement>,
    pub expressions: Vec<TemplateExpression>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct YieldExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Option<Box<Expression>>,
    pub delegate: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AwaitExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Import {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BigIntLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportNamespaceSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub exported: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExpressionOrIdentifier {
    Expression(Expression),
    Identifier(Identifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct OptionalMemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub property: Box<ExpressionOrIdentifier>,
    pub computed: bool,
    pub optional: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct OptionalCallExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Box<Expression>,
    pub arguments: Vec<Arg>,
    pub optional: bool,
    pub type_arguments: Option<TypeParameterInstantiation>,
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AnyTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ArrayTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub element_type: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BooleanTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BooleanLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NullLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassImplements {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareClass {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TypeParameterInstantiation>,
    // pub extends: Option<Vec<InterfaceExtends>>,
    // pub body: ObjectTypeAnnotation,
    pub implements: Option<Vec<ClassImplements>>,
    // pub mixins: Option<Array<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub predicate: Option<DeclarePredicate>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareInterface {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TypeParameterInstantiation>,
    // pub extends: Option<Vec<InterfaceExtends>>,
    // pub body: ObjectTypeAnnotation,
    pub implements: Option<Vec<ClassImplements>>,
    // pub mixins: Option<Array<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModuleKind {
    #[serde(rename = "CommonJS")]
    CommonJs,
    #[serde(rename = "ES")]
    Es,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareModule {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    pub body: BlockStatement,
    pub kind: Option<ModuleKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareModuleExports {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TypeAnnotation,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareTypeAlias {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TypeParameterDeclaration>,
    pub right: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareOpaqueType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TypeParameterDeclaration>,
    pub supertype: Option<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareVariable {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareExportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub declaration: Option<Flow>,
    pub specifiers: Option<Vec<ExportSpecifierType>>, // TODO: w/o export default specifier
    pub source: Option<StringLiteral>,
    pub default: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareExportAllDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub source: StringLiteral,
    pub export_kind: Option<ExportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclarePredicate {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: Flow,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExistsTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub type_parameters: Option<TypeParameterDeclaration>,
    // pub params: Vec<FunctionTypeParam>,
    // pub rest: Option<FunctionTypeParam>,
    pub return_type: FlowType,
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionTypeParam {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: Option<Identifier>,
    pub type_annotation: FlowType,
    pub optional: Option<bool>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum IdOrQualifiedId {
    Identifier(Identifier),
    // TODO
    // QualifiedTypeIdentifier(QualifiedTypeIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct GenericTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrQualifiedId,
    // TODO
    // pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct InferredPredicate {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceExtends {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrQualifiedId,
    // TODO
    // pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TypeParameterDeclaration>,
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
    pub implements: Option<Vec<ClassImplements>>,
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct IntersectionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct MixedTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EmptyTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct NullableTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NumberLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NumberTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ObjectTypeOrSpreadProp {
    // TODO
    // ObjectTypeProperty(ObjectTypeProperty),
    // ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub properties: Vec<ObjectTypeOrSpreadProp>,
    // pub indexers: Option<Vec<ObjectTypeIndexer>>,
    pub call_properties: Option<Vec<ObjectTypeCallProperty>>,
    pub internal_slots: Option<Vec<ObjectTypeInternalSlot>>,
    pub exact: bool,
    pub inexact: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypeInternalSlot {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub value: FlowType,
    pub optional: bool,
    #[serde(rename = "static")]
    pub is_static: bool,
    pub method: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypeCallProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: FlowType,
    #[serde(rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypeIndexer {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Option<Identifier>,
    pub key: FlowType,
    pub value: FlowType,
    // TODO
    // pub variance: Option<Variance>,
    #[serde(rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ObjectTypePropertyKind {
    Init,
    Get,
    Set,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypeProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: IdOrString,
    pub value: FlowType,
    // TODO
    // pub variance: Option<Variance>,
    pub kind: ObjectTypePropertyKind,
    pub method: bool,
    pub optional: bool,
    pub proto: bool,
    #[serde(rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypePropertySpread {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct OpaqueType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TypeParameterDeclaration>,
    pub supertype: Option<FlowType>,
    pub impltype: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct QualifiedTypeIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub qualification: IdOrQualifiedId,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StringLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StringTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SymbolTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ThisTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TupleTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeOfTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TypeAlias {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TypeParameterDeclaration>,
    pub right: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TypeCastExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
    pub type_annotation: TypeAnnotation,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeParameter {
    #[serde(flatten)]
    pub base: BaseNode,
    pub bound: Option<TypeAnnotation>,
    pub default: Option<FlowType>,
    pub variance: Option<Variance>,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeParameterDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub params: Vec<TypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeParameterInstantiation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub params: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct UnionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum MinusOrPlus {
    Minus,
    Plus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Variance {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: MinusOrPlus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct VoidTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EnumDeclarationBody {
    EnumBooleanBody(EnumBooleanBody),
    EnumNumberBody(EnumNumberBody),
    EnumStringBody(EnumStringBody),
    EnumSymbolBody(EnumSymbolBody),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EnumDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub body: EnumDeclarationBody,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct EnumBooleanBody {
    #[serde(flatten)]
    pub base: BaseNode,
    pub members: Vec<EnumBooleanMember>,
    pub explicit_type: bool,
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct EnumNumberBody {
    #[serde(flatten)]
    pub base: BaseNode,
    pub members: Vec<EnumNumberMember>,
    pub explicit_type: bool,
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EnumStringBodyMember {
    EnumStringMember(EnumStringMember),
    EnumDefaultedMember(EnumDefaultedMember),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct EnumStringBody {
    #[serde(flatten)]
    pub base: BaseNode,
    pub members: Vec<EnumStringBodyMember>,
    pub explicit_type: bool,
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct EnumSymbolBody {
    #[serde(flatten)]
    pub base: BaseNode,
    pub members: Vec<EnumDefaultedMember>,
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EnumBooleanMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub init: BooleanLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EnumNumberMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub init: NumericLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EnumStringMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub init: StringLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EnumDefaultedMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JSXAttributeName {
    // TODO
    // JSXIdentifier(JSXIdentifier),
    // JSXNamespacedName(JSXNamespacedName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JSXAttributeValue {
    // TODO
    // JSXElement(JSXElement),
    // JSXFragment(JSXFragment),
    // StringLiteral(StringLiteral),
    // JSXExpressionContainer(JSXExpressionContainer),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXAttributeName,
    pub value: Option<JSXAttributeValue>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JSXElementName {
    // TODO
    // JSXIdentifier(JSXIdentifier),
    // JSXMemberExpression(JSXMemberExpression),
    // JSXNamespacedName(JSXNamespacedName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXClosingElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXElementName,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JSXElementChild {
    // TODO
    // JSXText(JSXText),
    // JSXExpressionContainer(JSXExpressionContainer),
    // JSXSpreadChild(JSXSpreadChild),
    // JSXElement(JSXElement),
    // JSXFragment(JSXFragment),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct JSXElement {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub opening_element: JSXOpeningElement,
    pub closing_element: Option<JSXClosingElement>,
    pub children: Vec<JSXElementChild>,
    pub self_closing: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXEmptyExpression {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JSXExpressionContainerExpression { // TODO fix name
    Expression(Expression),
    JSXEmptyExpression(JSXEmptyExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXExpressionContainer {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: JSXExpressionContainerExpression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXSpreadChild {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JSXMemberExpressionObject {
    JSXMemberExpression(JSXMemberExpression),
    JSXIdentifier(JSXIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXMemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<JSXMemberExpressionObject>,
    pub property: JSXIdentifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXNamespacedName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub namespace: JSXIdentifier,
    pub name: JSXIdentifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JSXOpeningElementAttribute { // TODO fix names
    JSXAttribute(JSXAttribute),
    // TODO
    // JSXSpreadAttribute(JSXSpreadAttribute),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct JSXOpeningElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXElementName,
    pub attributes: Vec<JSXOpeningElementAttribute>,
    pub self_closing: bool,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>, // TODO w/o noop
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXSpreadAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXText {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct JSXFragment {
    #[serde(flatten)]
    pub base: BaseNode,
    pub opening_fragment: JSXOpeningFragment,
    pub closing_fragment: JSXClosingFragment,
    pub children: Vec<JSXElementChild>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXOpeningFragment {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXClosingFragment {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Noop {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PlaceholderExpectedNode {
    Identifier,
    StringLiteral,
    Expression,
    Statement,
    Declaration,
    BlockStatement,
    ClassBody,
    Pattern,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct Placeholder {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expected_node: PlaceholderExpectedNode,
    pub name: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct V8IntrinsicIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ArgumentPlaceholder {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BindExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub callee: Box<Expression>,
}

// TODO more descriptive name for object key
pub type ClassPropertyKey = ObjectKey;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: ClassPropertyKey,
    pub value: Option<Expression>,
    pub type_annotation: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub computed: Option<bool>,
    #[serde(rename = "static")]
    pub is_static: Option<bool>,
    #[serde(rename = "abstract")]
    pub is_abstract: Option<bool>,
    pub accessibility: Option<Access>,
    pub declare: Option<bool>,
    pub definite: Option<bool>,
    pub optinoal: Option<bool>,
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct PiplineTopicExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct PipelineBareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct PipelinePrimaryTopicReference {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassPrivateProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub key: PrivateName,
    pub value: Option<Expression>,
    // pub decorators: Option<Vec<Decorator>>,
    // pub static: any, // TODO how to handle any?
    pub type_annotation: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassPrivateMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: Option<ClassMethodKind>,
    // TODO
    // pub key: PrivateName,
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(rename = "static")]
    pub is_static: Option<bool>,
    #[serde(rename = "abstract")]
    pub is_abstract: Option<bool>,
    pub access: Option<Access>,
    pub accessibility: Option<Access>,
    #[serde(rename = "async")]
    pub is_async: Option<bool>,
    pub computed: Option<bool>,
    // pub decorators: <Option<Vec<Decorator>>,
    pub generator: Option<bool>,
    pub optional: Option<bool>,
    pub return_type: Option<FlowTypeAnnotationOrTSTypeAnnotationOrNoop>,
    pub type_parameters: Option<FlowTypeParameterDeclarationOrTSTypeParameterDeclarationOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ImportAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: IdOrString,
    pub value: StringLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Decorator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DoExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: BlockStatement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportDefaultSpecifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub exported: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct PrivateName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RecordExpressionProperty { // TODO fix names
    ObjectProperty(ObjectProperty),
    SpreadElement(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct RecordExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub properties: Vec<RecordExpressionProperty>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TupleExpressionElement { // TODO fix names
    Expression(Expression),
    SpreadElement(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TupleExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub elements: Vec<TupleExpressionElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DecimalLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StaticBlock {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ModuleExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Program,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSParameterPropertyParameter { // TODO fix names
    Identifier(Identifier),
    AssignmentPattern(AssignmentPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSParameterProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub parameter: TSParameterPropertyParameter,
    pub accessibility: Option<Access>,
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSTypeParameterDeclarationOrNoop { // TODO fix names
    // TODO
    // TSTypeParameterDeclaration(TSTypeParameterDeclaration),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSTypeAnnotationOrNoop { // TODO fix names
    // TODO
    // TSTypeAnnotation(TSTypeAnnotation),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSDeclareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Option<Identifier>,
    pub type_parameters: Option<TSTypeParameterDeclarationOrNoop>,
    pub params: Vec<Param>,
    pub return_type: Option<TSTypeAnnotationOrNoop>,
    #[serde(rename = "async")]
    pub is_async: Option<bool>,
    pub declare: Option<bool>,
    pub generator: Option<bool>,
}

pub type TSDeclareMethodKey = ObjectKey;
pub type TSDeclareMethodKind = ClassMethodKind;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSDeclareMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    pub decorators: Option<Vec<Decorator>>,
    pub key: TSDeclareMethodKey,
    pub type_parameters: Option<TSTypeParameterDeclarationOrNoop>,
    pub params: Vec<Param>,
    pub return_type: Option<TSTypeAnnotationOrNoop>,
    #[serde(rename = "abstract")]
    pub is_abstract: Option<bool>,
    pub access: Option<Access>,
    pub accessibility: Option<Access>,
    #[serde(rename = "async")]
    pub is_async: Option<bool>,
    pub computed: Option<bool>,
    pub generator: Option<bool>,
    pub kind: Option<TSDeclareMethodKind>,
    pub optional: Option<bool>,
    #[serde(rename = "static")]
    pub is_static: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSQualifiedName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: TSEntityName,
    pub right: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum IdOrRest { // TODO fix names
    Identifier(Identifier),
    RestElement(RestElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSCallSignatureDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub parameters: Vec<IdOrRest>,
    // pub type_annotation: Option<TSTypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConstructSignatureDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub parameters: Vec<IdOrRest>,
    // pub type_annotation: Option<TSTypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSPropertySignature {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: Expression,
    // TODO
    // pub type_annotation: Option<TSTypeAnnotation>,
    pub initializer: Option<Expression>,
    pub computed: Option<bool>,
    pub optional: Option<bool>,
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSMethodSignature {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub parameters: Vec<IdOrRest>,
    // pub type_annotation: Option<TSTypeAnnotation>,
    pub computed: Option<bool>,
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSIndexSignature {
    #[serde(flatten)]
    pub base: BaseNode,
    pub paramters: Vec<Identifier>,
    // TODO
    // pub type_annotation: Option<TSTypeAnnotation>,
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSAnyKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSBooleanKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSBigIntKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSIntrinsicKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNeverKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNullKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNumberKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSObjectKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSStringKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSSymbolKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSUndefinedKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSUnknownKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSVoidKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSThisKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSFunctionType {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub parameters: Vec<IdOrRest>,
    // pub type_annotation: Option<TSTypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConstructorType {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub parameters: Vec<IdOrRest>,
    // pub type_annotation: Option<TSTypeAnnotation>,
    #[serde(rename = "abstract")]
    pub is_abstract: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeReference {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_name: TSEntityName,
    // TODO
    // pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSTypePredicateParameterName { // TODO fix name
    Identifier(Identifier),
    // TODO
    // TSThisType(TSThisType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypePredicate {
    #[serde(flatten)]
    pub base: BaseNode,
    pub parameter_name: TSTypePredicateParameterName,
    // TODO
    // pub type_annotation: Option<TSTypeAnnotation>,
    pub asserts: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSTypeQueryExprName { // TODO fix name
    TSEntityName(TSEntityName),
    // TODO
    // TSImportType(TSImportType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeQuery {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expr_name: TSTypeQueryExprName,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSTypeLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub members: Vec<TSTypeElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSArrayType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub element_type: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSTupleTypeElementType {
    TSType(TSType),
    // TODO
    // TSNamedTupleMember(TSNamedTupleMember),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTupleType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub element_types: Vec<TSTupleTypeElementType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSRestType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSNamedTupleMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub label: Identifier,
    pub element_type: TSType,
    pub option: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSUnionType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub types: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSIntersectionType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub types: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConditionalType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub check_type: TSType,
    pub extends_type: TSType,
    pub true_type: TSType,
    pub false_type: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSInferType {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub type_parameter: TSTypeParameter,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct A {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeOperator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
    pub operator: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSIndexedAccessType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object_type: TSType,
    pub index_type: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSMappedType {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub type_parameter: TSTypeParameter,
    pub type_annotation: Option<TSType>,
    pub name_type: Option<TSType>,
    pub optional: Option<bool>,
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSLiteralTypeLiteral { // TODO fix names
    NumericLiteral(NumericLiteral),
    StringLiteral(StringLiteral),
    BooleanLiteral(BooleanLiteral),
    BigIntLiteral(BigIntLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSLiteralType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub literal: TSLiteralTypeLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSExpressionWithTypeArguments {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: TSEntityName,
    // TODO
    // pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSInterfaceDeclartion {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub extends: Option<TSExpressionWithTypeArguments>,
    pub body: TSInterfaceBody,
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSInterfaceBody {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Vec<TSTypeElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAliasDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    // TODO
    // pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub type_annotation: TSType,
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSAsExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
    pub type_annotation: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAssertion {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSEnumDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub members: Vec<TSEnumMember>,
    #[serde(rename = "const")]
    pub is_const: Option<bool>,
    pub declare: Option<bool>,
    pub initializer: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSEnumMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    pub initializer: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSModuleDeclarationBody { // TODO fix names
    TSModuleBlock(TSModuleBlock),
    TSModuleDeclaration(Box<TSModuleDeclaration>),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSModuleDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    pub body: TSModuleDeclarationBody,
    pub declare: Option<bool>,
    pub global: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSModuleBlock {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Vec<Statement>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSImportType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: StringLiteral,
    pub qualifier: Option<TSEntityName>,
    // TODO
    // pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSImportEqualsDeclarationModuleReference { // TODO fix names
    TSEntityName(TSEntityName),
    TSExternalModuleRefernce(TSExternalModuleReference),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSImportEqualsDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub module_reference: TSImportEqualsDeclarationModuleReference,
    pub is_export: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSExternalModuleReference {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: StringLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNonNullExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSExportAssignment {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNamespaceExportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSTypeParameterInstantiation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub params: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSTypeParameterDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub params: Vec<TSTypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSTypeParameter {
    #[serde(flatten)]
    pub base: BaseNode,
    pub constraint: Option<TSType>,
    pub default: Option<TSType>,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Expression {
    ArrayExpression(ArrayExpression),
    AssignmentExpression(AssignmentExpression),
    BinaryExpression(BinaryExpression),
    CallExpression(CallExpression),
    ConditionalExpression(ConditionalExpression),
    FunctionExpression(FunctionExpression),
    Identifier(Identifier),
    StringLiteral(StringLiteral),
    NumericLiteral(NumericLiteral),
    NullLiteral(NullLiteral),
    BooleanLiteral(BooleanLiteral),
    RegExpLiteral(RegExpLiteral),
    LogicalExpression(LogicalExpression),
    MemberExpression(MemberExpression),
    NewExpression(NewExpression),
    ObjectExpression(ObjectExpression),
    SequenceExpression(SequenceExpression),
    ParenthesizedExpression(ParenthesizedExpression),
    ThisExpression(ThisExpression),
    UnaryExpression(UnaryExpression),
    UpdateExpression(UpdateExpression),
    ArrowFunctionExpression(ArrowFunctionExpression),
    ClassExpression(ClassExpression),
    MetaProperty(MetaProperty),
    Super(Super),
    TaggedTemplateExpression(TaggedTemplateExpression),
    TemplateLiteral(TemplateLiteral),
    YieldExpression(YieldExpression),
    AwaitExpression(AwaitExpression),
    Import(Import),
    BigIntLiteral(BigIntLiteral),
    OptionalMemberExpression(OptionalMemberExpression),
    OptionalCallExpression(OptionalCallExpression),
    TypeCastExpression(TypeCastExpression),
    JSXElement(JSXElement),
    JSXFragment(JSXFragment),
    BindExpression(BindExpression),
    PipelinePrimaryTopicReference(PipelinePrimaryTopicReference),
    DoExpression(DoExpression),
    RecordExpression(RecordExpression),
    TupleExpression(TupleExpression),
    DecimalLiteral(DecimalLiteral),
    ModuleExpression(ModuleExpression),
    TSAsExpression(TSAsExpression),
    TSTypeAssertion(TSTypeAssertion),
    TSNonNullExpression(TSNonNullExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Binary {
    BinaryExpression(BinaryExpression),
    LogicalExpression(LogicalExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Scopable {
    BlockStatement(BlockStatement),
    CatchClause(CatchClause),
    DoWhileStatement(DoWhileStatement),
    ForInStatement(ForInStatement),
    ForStatement(ForStatement),
    FunctionDeclaration(FunctionDeclaration),
    FunctionExpression(FunctionExpression),
    Program(Program),
    ObjectMethod(ObjectMethod),
    SwitchStatement(SwitchStatement),
    WhileStatement(WhileStatement),
    ArrowFunctionExpression(ArrowFunctionExpression),
    ClassExpression(ClassExpression),
    ClassDeclaration(ClassDeclaration),
    ForOfStatement(ForOfStatement),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
    StaticBlock(StaticBlock),
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BlockParent  {
    BlockStatement(BlockStatement),
    CatchClause(CatchClause),
    DoWhileStatement(DoWhileStatement),
    ForInStatement(ForInStatement),
    ForStatement(ForStatement),
    FunctionDeclaration(FunctionDeclaration),
    FunctionExpression(FunctionExpression),
    Program(Program),
    ObjectMethod(ObjectMethod),
    SwitchStatement(SwitchStatement),
    WhileStatement(WhileStatement),
    ArrowFunctionExpression(ArrowFunctionExpression),
    ForOfStatement(ForOfStatement),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
    StaticBlock(StaticBlock),
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Block {
    BlockStatement(BlockStatement),
    Program(Program),
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Statement {

    // TODO
    // BlockStatement(BlockStatement),
    // BreakStatement(BreakStatement),
    // ContinueStatement(ContinueStatement),
    // DebuggerStatement(DebuggerStatement),
    // DoWhileStatement(DoWhileStatement),
    // EmptyStatement(EmptyStatement),
    // ExpressionStatement(ExpressionStatement),
    // ForInStatement(ForInStatement),
    // ForStatement(ForStatement),
    // FunctionDeclaration(FunctionDeclaration),
    // IfStatement(IfStatement),
    // LabeledStatement(LabeledStatement),
    // ReturnStatement(ReturnStatement),
    // SwitchStatement(SwitchStatement),
    // ThrowStatement(ThrowStatement),
    // TryStatement(TryStatement),
    // VariableDeclaration(VariableDeclaration),
    // WhileStatement(WhileStatement),
    // WithStatement(WithStatement),
    // ClassDeclaration(ClassDeclaration),
    // ExportAllDeclaration(ExportAllDeclaration),
    // ExportDefaultDeclaration(ExportDefaultDeclaration),
    // ExportNamedDeclaration(ExportNamedDeclaration),
    // ForOfStatement(ForOfStatement),
    // ImportDeclaration(ImportDeclaration),
    // DeclareClass(DeclareClass),
    // DeclareFunction(DeclareFunction),
    // DeclareInterface(DeclareInterface),
    // DeclareModule(DeclareModule),
    // DeclareModuleExports(DeclareModuleExports),
    // DeclareTypeAlias(DeclareTypeAlias),
    // DeclareOpaqueType(DeclareOpaqueType),
    // DeclareVariable(DeclareVariable),
    // DeclareExportDeclaration(DeclareExportDeclaration),
    // DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    // InterfaceDeclaration(InterfaceDeclaration),
    // OpaqueType(OpaqueType),
    // TypeAlias(TypeAlias),
    // EnumDeclaration(EnumDeclaration),
    // TSDeclareFunction(TSDeclareFunction),
    // TSInterfaceDeclaration(TSInterfaceDeclaration),
    // TSTypeAliasDeclaration(TSTypeAliasDeclaration),
    // TSEnumDeclaration(TSEnumDeclaration),
    // TSModuleDeclaration(TSModuleDeclaration),
    // TSImportEqualsDeclaration(TSImportEqualsDeclaration),
    // TSExportAssignment(TSExportAssignment),
    // TSNamespaceExportDeclaration(TSNamespaceExportDeclaration),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Terminatorless {

    // TODO
    // BreakStatement(BreakStatement),
    // ContinueStatement(ContinueStatement),
    // ReturnStatement(ReturnStatement),
    // ThrowStatement(ThrowStatement),
    // YieldExpression(YieldExpression),
    // AwaitExpression(AwaitExpression),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CompletionStatement {

    // TODO
    // BreakStatement(BreakStatement),
    // ContinueStatement(ContinueStatement),
    // ReturnStatement(ReturnStatement),
    // ThrowStatement(ThrowStatement),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Conditional {

    // TODO
    // ConditionalExpression(ConditionalExpression),
    // IfStatement(IfStatement),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Loop {

    // TODO
    // DoWhileStatement(DoWhileStatement),
    // ForInStatement(ForInStatement),
    // ForStatement(ForStatement),
    // WhileStatement(WhileStatement),
    // ForOfStatement(ForOfStatement),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum While {

    // TODO
    // DoWhileStatement(DoWhileStatement),
    // WhileStatement(WhileStatement),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExpressionWrapper {

    // TODO
    // ExpressionStatement(ExpressionStatement),
    // ParenthesizedExpression(ParenthesizedExpression),
    // TypeCastExpression(TypeCastExpression),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum For {

    // TODO
    // ForInStatement(ForInStatement),
    // ForStatement(ForStatement),
    // ForOfStatement(ForOfStatement),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ForXStatement {

    // TODO
    // ForInStatement(ForInStatement),
    // ForOfStatement(ForOfStatement),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Function {

    // TODO
    // FunctionDeclaration(FunctionDeclaration),
    // FunctionExpression(FunctionExpression),
    // ObjectMethod(ObjectMethod),
    // ArrowFunctionExpression(ArrowFunctionExpression),
    // ClassMethod(ClassMethod),
    // ClassPrivateMethod(ClassPrivateMethod),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FunctionParent {

    // TODO
    // FunctionDeclaration(FunctionDeclaration),
    // FunctionExpression(FunctionExpression),
    // ObjectMethod(ObjectMethod),
    // ArrowFunctionExpression(ArrowFunctionExpression),
    // ClassMethod(ClassMethod),
    // ClassPrivateMethod(ClassPrivateMethod),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Pureish {

    // TODO
    // FunctionDeclaration(FunctionDeclaration),
    // FunctionExpression(FunctionExpression),
    // StringLiteral(StringLiteral),
    // NumericLiteral(NumericLiteral),
    // NullLiteral(NullLiteral),
    // BooleanLiteral(BooleanLiteral),
    // RegExpLiteral(RegExpLiteral),
    // ArrowFunctionExpression(ArrowFunctionExpression),
    // BigIntLiteral(BigIntLiteral),
    // DecimalLiteral(DecimalLiteral),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Declaration {

    // TODO
    // FunctionDeclaration(FunctionDeclaration),
    // VariableDeclaration(VariableDeclaration),
    // ClassDeclaration(ClassDeclaration),
    // ExportAllDeclaration(ExportAllDeclaration),
    // ExportDefaultDeclaration(ExportDefaultDeclaration),
    // ExportNamedDeclaration(ExportNamedDeclaration),
    // ImportDeclaration(ImportDeclaration),
    // DeclareClass(DeclareClass),
    // DeclareFunction(DeclareFunction),
    // DeclareInterface(DeclareInterface),
    // DeclareModule(DeclareModule),
    // DeclareModuleExports(DeclareModuleExports),
    // DeclareTypeAlias(DeclareTypeAlias),
    // DeclareOpaqueType(DeclareOpaqueType),
    // DeclareVariable(DeclareVariable),
    // DeclareExportDeclaration(DeclareExportDeclaration),
    // DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    // InterfaceDeclaration(InterfaceDeclaration),
    // OpaqueType(OpaqueType),
    // TypeAlias(TypeAlias),
    // EnumDeclaration(EnumDeclaration),
    // TSDeclareFunction(TSDeclareFunction),
    // TSInterfaceDeclaration(TSInterfaceDeclaration),
    // TSTypeAliasDeclaration(TSTypeAliasDeclaration),
    // TSEnumDeclaration(TSEnumDeclaration),
    // TSModuleDeclaration(TSModuleDeclaration),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PatternLike {

    // TODO
    // Identifier(Identifier),
    // RestElement(RestElement),
    // AssignmentPattern(AssignmentPattern),
    // ArrayPattern(ArrayPattern),
    // ObjectPattern(ObjectPattern),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LVal {

    // TODO
    // Identifier(Identifier),
    // MemberExpression(MemberExpression),
    // RestElement(RestElement),
    // AssignmentPattern(AssignmentPattern),
    // ArrayPattern(ArrayPattern),
    // ObjectPattern(ObjectPattern),
    // TSParameterProperty(TSParameterProperty),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSEntityName {

    // TODO
    // Identifier(Identifier),
    // TSQualifiedName(TSQualifiedName),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Literal {

    // TODO
    // StringLiteral(StringLiteral),
    // NumericLiteral(NumericLiteral),
    // NullLiteral(NullLiteral),
    // BooleanLiteral(BooleanLiteral),
    // RegExpLiteral(RegExpLiteral),
    // TemplateLiteral(TemplateLiteral),
    // BigIntLiteral(BigIntLiteral),
    // DecimalLiteral(DecimalLiteral),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Immutable {

    // TODO
    // StringLiteral(StringLiteral),
    // NumericLiteral(NumericLiteral),
    // NullLiteral(NullLiteral),
    // BooleanLiteral(BooleanLiteral),
    // BigIntLiteral(BigIntLiteral),
    // JSXAttribute(JSXAttribute),
    // JSXClosingElement(JSXClosingElement),
    // JSXElement(JSXElement),
    // JSXExpressionContainer(JSXExpressionContainer),
    // JSXSpreadChild(JSXSpreadChild),
    // JSXOpeningElement(JSXOpeningElement),
    // JSXText(JSXText),
    // JSXFragment(JSXFragment),
    // JSXOpeningFragment(JSXOpeningFragment),
    // JSXClosingFragment(JSXClosingFragment),
    // DecimalLiteral(DecimalLiteral),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UserWhitespacable {

    // TODO
    // ObjectMethod(ObjectMethod),
    // ObjectProperty(ObjectProperty),
    // ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    // ObjectTypeCallProperty(ObjectTypeCallProperty),
    // ObjectTypeIndexer(ObjectTypeIndexer),
    // ObjectTypeProperty(ObjectTypeProperty),
    // ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Method {

    // TODO
    // ObjectMethod(ObjectMethod),
    // ClassMethod(ClassMethod),
    // ClassPrivateMethod(ClassPrivateMethod),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ObjectMember {

    // TODO
    // ObjectMethod(ObjectMethod),
    // ObjectProperty(ObjectProperty),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Property {

    // TODO
    // ObjectProperty(ObjectProperty),
    // ClassProperty(ClassProperty),
    // ClassPrivateProperty(ClassPrivateProperty),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UnaryLike {

    // TODO
    // UnaryExpression(UnaryExpression),
    // SpreadElement(SpreadElement),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Pattern {

    // TODO
    // AssignmentPattern(AssignmentPattern),
    // ArrayPattern(ArrayPattern),
    // ObjectPattern(ObjectPattern),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Class {

    // TODO
    // ClassExpression(ClassExpression),
    // ClassDeclaration(ClassDeclaration),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModuleDeclaration {

    // TODO
    // ExportAllDeclaration(ExportAllDeclaration),
    // ExportDefaultDeclaration(ExportDefaultDeclaration),
    // ExportNamedDeclaration(ExportNamedDeclaration),
    // ImportDeclaration(ImportDeclaration),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExportDeclaration {

    // TODO
    // ExportAllDeclaration(ExportAllDeclaration),
    // ExportDefaultDeclaration(ExportDefaultDeclaration),
    // ExportNamedDeclaration(ExportNamedDeclaration),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModuleSpecifier {

    // TODO
    // ExportSpecifier(ExportSpecifier),
    // ImportDefaultSpecifier(ImportDefaultSpecifier),
    // ImportNamespaceSpecifier(ImportNamespaceSpecifier),
    // ImportSpecifier(ImportSpecifier),
    // ExportNamespaceSpecifier(ExportNamespaceSpecifier),
    // ExportDefaultSpecifier(ExportDefaultSpecifier),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Flow {

    // TODO
    // AnyTypeAnnotation(AnyTypeAnnotation),
    // ArrayTypeAnnotation(ArrayTypeAnnotation),
    // BooleanTypeAnnotation(BooleanTypeAnnotation),
    // BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
    // NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    // ClassImplements(ClassImplements),
    // DeclareClass(DeclareClass),
    // DeclareFunction(DeclareFunction),
    // DeclareInterface(DeclareInterface),
    // DeclareModule(DeclareModule),
    // DeclareModuleExports(DeclareModuleExports),
    // DeclareTypeAlias(DeclareTypeAlias),
    // DeclareOpaqueType(DeclareOpaqueType),
    // DeclareVariable(DeclareVariable),
    // DeclareExportDeclaration(DeclareExportDeclaration),
    // DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    // DeclaredPredicate(DeclaredPredicate),
    // ExistsTypeAnnotation(ExistsTypeAnnotation),
    // FunctionTypeAnnotation(FunctionTypeAnnotation),
    // FunctionTypeParam(FunctionTypeParam),
    // GenericTypeAnnotation(GenericTypeAnnotation),
    // InferredPredicate(InferredPredicate),
    // InterfaceExtends(InterfaceExtends),
    // InterfaceDeclaration(InterfaceDeclaration),
    // InterfaceTypeAnnotation(InterfaceTypeAnnotation),
    // IntersectionTypeAnnotation(IntersectionTypeAnnotation),
    // MixedTypeAnnotation(MixedTypeAnnotation),
    // EmptyTypeAnnotation(EmptyTypeAnnotation),
    // NullableTypeAnnotation(NullableTypeAnnotation),
    // NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
    // NumberTypeAnnotation(NumberTypeAnnotation),
    // ObjectTypeAnnotation(ObjectTypeAnnotation),
    // ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    // ObjectTypeCallProperty(ObjectTypeCallProperty),
    // ObjectTypeIndexer(ObjectTypeIndexer),
    // ObjectTypeProperty(ObjectTypeProperty),
    // ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
    // OpaqueType(OpaqueType),
    // QualifiedTypeIdentifier(QualifiedTypeIdentifier),
    // StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
    // StringTypeAnnotation(StringTypeAnnotation),
    // SymbolTypeAnnotation(SymbolTypeAnnotation),
    // ThisTypeAnnotation(ThisTypeAnnotation),
    // TupleTypeAnnotation(TupleTypeAnnotation),
    // TypeofTypeAnnotation(TypeofTypeAnnotation),
    // TypeAlias(TypeAlias),
    // TypeAnnotation(TypeAnnotation),
    // TypeCastExpression(TypeCastExpression),
    // TypeParameter(TypeParameter),
    // TypeParameterDeclaration(TypeParameterDeclaration),
    // TypeParameterInstantiation(TypeParameterInstantiation),
    // UnionTypeAnnotation(UnionTypeAnnotation),
    // Variance(Variance),
    // VoidTypeAnnotation(VoidTypeAnnotation),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlowType {

    // TODO
    // AnyTypeAnnotation(AnyTypeAnnotation),
    // ArrayTypeAnnotation(ArrayTypeAnnotation),
    // BooleanTypeAnnotation(BooleanTypeAnnotation),
    // BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
    // NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    // ExistsTypeAnnotation(ExistsTypeAnnotation),
    // FunctionTypeAnnotation(FunctionTypeAnnotation),
    // GenericTypeAnnotation(GenericTypeAnnotation),
    // InterfaceTypeAnnotation(InterfaceTypeAnnotation),
    // IntersectionTypeAnnotation(IntersectionTypeAnnotation),
    // MixedTypeAnnotation(MixedTypeAnnotation),
    // EmptyTypeAnnotation(EmptyTypeAnnotation),
    // NullableTypeAnnotation(NullableTypeAnnotation),
    // NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
    // NumberTypeAnnotation(NumberTypeAnnotation),
    // ObjectTypeAnnotation(ObjectTypeAnnotation),
    // StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
    // StringTypeAnnotation(StringTypeAnnotation),
    // SymbolTypeAnnotation(SymbolTypeAnnotation),
    // ThisTypeAnnotation(ThisTypeAnnotation),
    // TupleTypeAnnotation(TupleTypeAnnotation),
    // TypeofTypeAnnotation(TypeofTypeAnnotation),
    // UnionTypeAnnotation(UnionTypeAnnotation),
    // VoidTypeAnnotation(VoidTypeAnnotation),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlowBaseAnnotation {

    // TODO
    // AnyTypeAnnotation(AnyTypeAnnotation),
    // BooleanTypeAnnotation(BooleanTypeAnnotation),
    // NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    // MixedTypeAnnotation(MixedTypeAnnotation),
    // EmptyTypeAnnotation(EmptyTypeAnnotation),
    // NumberTypeAnnotation(NumberTypeAnnotation),
    // StringTypeAnnotation(StringTypeAnnotation),
    // SymbolTypeAnnotation(SymbolTypeAnnotation),
    // ThisTypeAnnotation(ThisTypeAnnotation),
    // VoidTypeAnnotation(VoidTypeAnnotation),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlowDeclaration {

    // TODO
    // DeclareClass(DeclareClass),
    // DeclareFunction(DeclareFunction),
    // DeclareInterface(DeclareInterface),
    // DeclareModule(DeclareModule),
    // DeclareModuleExports(DeclareModuleExports),
    // DeclareTypeAlias(DeclareTypeAlias),
    // DeclareOpaqueType(DeclareOpaqueType),
    // DeclareVariable(DeclareVariable),
    // DeclareExportDeclaration(DeclareExportDeclaration),
    // DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    // InterfaceDeclaration(InterfaceDeclaration),
    // OpaqueType(OpaqueType),
    // TypeAlias(TypeAlias),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlowPredicate {

    // TODO
    // DeclaredPredicate(DeclaredPredicate),
    // InferredPredicate(InferredPredicate),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EnumBody {

    // TODO
    // EnumBooleanBody(EnumBooleanBody),
    // EnumNumberBody(EnumNumberBody),
    // EnumStringBody(EnumStringBody),
    // EnumSymbolBody(EnumSymbolBody),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EnumMember {

    // TODO
    // EnumBooleanMember(EnumBooleanMember),
    // EnumNumberMember(EnumNumberMember),
    // EnumStringMember(EnumStringMember),
    // EnumDefaultedMember(EnumDefaultedMember),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JSX {

    // TODO
    // JSXAttribute(JSXAttribute),
    // JSXClosingElement(JSXClosingElement),
    // JSXElement(JSXElement),
    // JSXEmptyExpression(JSXEmptyExpression),
    // JSXExpressionContainer(JSXExpressionContainer),
    // JSXSpreadChild(JSXSpreadChild),
    // JSXIdentifier(JSXIdentifier),
    // JSXMemberExpression(JSXMemberExpression),
    // JSXNamespacedName(JSXNamespacedName),
    // JSXOpeningElement(JSXOpeningElement),
    // JSXSpreadAttribute(JSXSpreadAttribute),
    // JSXText(JSXText),
    // JSXFragment(JSXFragment),
    // JSXOpeningFragment(JSXOpeningFragment),
    // JSXClosingFragment(JSXClosingFragment),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Private {

    // TODO
    // ClassPrivateProperty(ClassPrivateProperty),
    // ClassPrivateMethod(ClassPrivateMethod),
    // PrivateName(PrivateName),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSTypeElement {

    // TODO
    // TSCallSignatureDeclaration(TSCallSignatureDeclaration),
    // TSConstructSignatureDeclaration(TSConstructSignatureDeclaration),
    // TSPropertySignature(TSPropertySignature),
    // TSMethodSignature(TSMethodSignature),
    // TSIndexSignature(TSIndexSignature),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSType {

    // TODO
    // TSAnyKeyword(TSAnyKeyword),
    // TSBooleanKeyword(TSBooleanKeyword),
    // TSBigIntKeyword(TSBigIntKeyword),
    // TSIntrinsicKeyword(TSIntrinsicKeyword),
    // TSNeverKeyword(TSNeverKeyword),
    // TSNullKeyword(TSNullKeyword),
    // TSNumberKeyword(TSNumberKeyword),
    // TSObjectKeyword(TSObjectKeyword),
    // TSStringKeyword(TSStringKeyword),
    // TSSymbolKeyword(TSSymbolKeyword),
    // TSUndefinedKeyword(TSUndefinedKeyword),
    // TSUnknownKeyword(TSUnknownKeyword),
    // TSVoidKeyword(TSVoidKeyword),
    // TSThisType(TSThisType),
    // TSFunctionType(TSFunctionType),
    // TSConstructorType(TSConstructorType),
    // TSTypeReference(TSTypeReference),
    // TSTypePredicate(TSTypePredicate),
    // TSTypeQuery(TSTypeQuery),
    // TSTypeLiteral(TSTypeLiteral),
    // TSArrayType(TSArrayType),
    // TSTupleType(TSTupleType),
    // TSOptionalType(TSOptionalType),
    // TSRestType(TSRestType),
    // TSUnionType(TSUnionType),
    // TSIntersectionType(TSIntersectionType),
    // TSConditionalType(TSConditionalType),
    // TSInferType(TSInferType),
    // TSParenthesizedType(TSParenthesizedType),
    // TSTypeOperator(TSTypeOperator),
    // TSIndexedAccessType(TSIndexedAccessType),
    // TSMappedType(TSMappedType),
    // TSLiteralType(TSLiteralType),
    // TSExpressionWithTypeArguments(TSExpressionWithTypeArguments),
    // TSImportType(TSImportType),;

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TSBaseType {

    // TSAnyKeyword(TSAnyKeyword),
    // TSBooleanKeyword(TSBooleanKeyword),
    // TSBigIntKeyword(TSBigIntKeyword),
    // TSIntrinsicKeyword(TSIntrinsicKeyword),
    // TSNeverKeyword(TSNeverKeyword),
    // TSNullKeyword(TSNullKeyword),
    // TSNumberKeyword(TSNumberKeyword),
    // TSObjectKeyword(TSObjectKeyword),
    // TSStringKeyword(TSStringKeyword),
    // TSSymbolKeyword(TSSymbolKeyword),
    // TSUndefinedKeyword(TSUndefinedKeyword),
    // TSUnknownKeyword(TSUnknownKeyword),
    // TSVoidKeyword(TSVoidKeyword),
    // TSThisType(TSThisType),
    // TSLiteralType(TSLiteralType),;

}

