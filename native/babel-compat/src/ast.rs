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
pub enum BindaryLeft {
    Expression(Expression),
    // TODO
    // PrivateName(PrivateName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BinaryExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: BinaryOp,
    pub left: BindaryLeft,
    pub right: Expression,
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
    // TODO
    // pub body: Vec<Statement>,
    pub directives: Vec<Directive>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BreakStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    // TODO
    // pub label: Option<Identifier>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Callee {
    Expression(Expression),
    // TODO
    // V8IntrinsicIdentifier(V8IntrinsicIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Arg {
    Expression(Expression),
    // TODO
    // SpreadElement(SpreadElement),
    // JSXNamespacedName(JSXNamespacedName),
    // ArgumentPlaceholder(ArgumentPlaceholder),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct CallExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Callee,
    pub arguments: Vec<Arg>,
    pub optional: Option<bool>,
    // TODO
    // pub type_arguments: Option<TypeParameterInstantiation>,
    // pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CatchParam {
    // TODO
    // Identifier(Identifier),
    // ArrayPattern(ArrayPattern),
    // ObjectPattern(ObjectPattern),
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
    pub test: Expression,
    pub consequent: Expression,
    pub altername: Expression,
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
    // pub tokens: Option<Vec<_>>,
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
pub enum TypeAnnotation {

    // TODO
    // FlowTypeAnnotation(FlowTypeAnnotation),
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
pub enum FlowOrTSTypeParameterDeclaration {

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
    pub return_type: Option<TypeAnnotation>,
    pub type_parameters: Option<FlowOrTSTypeParameterDeclaration>,
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
    pub type_annotation: Option<TypeAnnotation>,
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
    pub left: Expression,
    pub right: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MemberProp {
    Expression(Expression),
    Identifier(Identifier),
    // TODO
    // PrivateName(PrivateName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct MemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Expression,
    pub property: MemberProp,
    pub computed: bool,
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct NewExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Callee,
    pub arguments: Vec<Arg>,
    pub optional: Option<bool>,
    // TODO
    // pub type_arguments: Option<TypeParameterInstantiation>,
    // pub type_parameters: Option<TSTypeParameterInstantiation>,
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
    pub return_type: Option<TypeAnnotation>,
    pub type_parameters: Option<FlowOrTSTypeParameterDeclaration>,
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
    pub type_annotation: Option<TypeAnnotation>,
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
    pub expression: Expression,
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
    pub argument: Expression,
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
    pub argument: Expression,
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
    pub type_annotation: Option<TypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ArrayPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    pub elements: Vec<Option<PatternLike>>,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub type_annotation: Option<TypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ArrowFunctionBody {
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
    pub body: ArrowFunctionBody,
    #[serde(rename = "async")]
    pub is_async: bool,
    pub expression: bool,
    pub generator: bool,
    pub return_type: TypeAnnotation,
    pub type_parameters: Option<FlowOrTSTypeParameterDeclaration>,
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
    // TODO
    // TypeParameterInstantiation(TypeParameterInstantiation),
    // TSTypeParameterInstantiation(TSTypeParameterInstantiation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Option<Identifier>,
    pub super_class: Option<Expression>,
    pub body: ClassBody,
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    pub implements: Option<ClassImpl>,
    // pub mixins: Option<InterfaceExtends>,
    pub super_type_parameters: Option<FlowOrTSTypeParameterInstantiation>,
    pub type_parameters: Option<FlowOrTSTypeParameterDeclaration>,
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
    // TODO
    // pub decorators: Option<Vec<Decorator>>,
    #[serde(rename = "abstract")]
    pub is_abstract: Option<bool>,
    pub declare: Option<bool>,
    pub implements: Option<ClassImpl>,
    // pub mixins: Option<InterfaceExtends>,
    pub super_type_parameters: Option<FlowOrTSTypeParameterInstantiation>,
    pub type_parameters: Option<FlowOrTSTypeParameterDeclaration>,
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
    // TODO
    // pub assertions: Option<Vec<ImportAttribute>>,
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
    pub return_type: Option<TypeAnnotation>,
    pub type_parameters: Option<FlowOrTSTypeParameterDeclaration>,
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
    pub type_annotation: Option<TypeAnnotation>,
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
    pub tag: Expression,
    pub quasi: TemplateLiteral,
    pub type_parameters: Option<FlowOrTSTypeParameterDeclaration>, // TODO: w/o noop
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
    pub argument: Option<Expression>,
    pub delegate: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AwaitExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
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
    pub object: Expression,
    pub property: ExpressionOrIdentifier,
    pub computed: bool,
    pub optional: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct OptionalCallExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Expression,
    pub arguments: Vec<Arg>,
    pub optional: bool,
    // TODO
    // pub type_arguments: Option<TypeParameterInstantiation>,
    // pub type_parameters: Option<TSTypeParameterInstantiation>,
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

/* 123
export interface ExistsTypeAnnotation extends BaseNode {
  type: "ExistsTypeAnnotation";
}

export interface FunctionTypeAnnotation extends BaseNode {
  type: "FunctionTypeAnnotation";
  typeParameters?: TypeParameterDeclaration | null;
  params: Array<FunctionTypeParam>;
  rest?: FunctionTypeParam | null;
  returnType: FlowType;
  this?: FunctionTypeParam | null;
}

export interface FunctionTypeParam extends BaseNode {
  type: "FunctionTypeParam";
  name?: Identifier | null;
  typeAnnotation: FlowType;
  optional?: boolean | null;
}

export interface GenericTypeAnnotation extends BaseNode {
  type: "GenericTypeAnnotation";
  id: Identifier | QualifiedTypeIdentifier;
  typeParameters?: TypeParameterInstantiation | null;
}

export interface InferredPredicate extends BaseNode {
  type: "InferredPredicate";
}

export interface InterfaceExtends extends BaseNode {
  type: "InterfaceExtends";
  id: Identifier | QualifiedTypeIdentifier;
  typeParameters?: TypeParameterInstantiation | null;
}

export interface InterfaceDeclaration extends BaseNode {
  type: "InterfaceDeclaration";
  id: Identifier;
  typeParameters?: TypeParameterDeclaration | null;
  extends?: Array<InterfaceExtends> | null;
  body: ObjectTypeAnnotation;
  implements?: Array<ClassImplements> | null;
  mixins?: Array<InterfaceExtends> | null;
}

export interface InterfaceTypeAnnotation extends BaseNode {
  type: "InterfaceTypeAnnotation";
  extends?: Array<InterfaceExtends> | null;
  body: ObjectTypeAnnotation;
}

export interface IntersectionTypeAnnotation extends BaseNode {
  type: "IntersectionTypeAnnotation";
  types: Array<FlowType>;
}

export interface MixedTypeAnnotation extends BaseNode {
  type: "MixedTypeAnnotation";
}

export interface EmptyTypeAnnotation extends BaseNode {
  type: "EmptyTypeAnnotation";
}

export interface NullableTypeAnnotation extends BaseNode {
  type: "NullableTypeAnnotation";
  typeAnnotation: FlowType;
}

export interface NumberLiteralTypeAnnotation extends BaseNode {
  type: "NumberLiteralTypeAnnotation";
  value: number;
}

export interface NumberTypeAnnotation extends BaseNode {
  type: "NumberTypeAnnotation";
}

export interface ObjectTypeAnnotation extends BaseNode {
  type: "ObjectTypeAnnotation";
  properties: Array<ObjectTypeProperty | ObjectTypeSpreadProperty>;
  indexers?: Array<ObjectTypeIndexer> | null;
  callProperties?: Array<ObjectTypeCallProperty> | null;
  internalSlots?: Array<ObjectTypeInternalSlot> | null;
  exact: boolean;
  inexact?: boolean | null;
}

export interface ObjectTypeInternalSlot extends BaseNode {
  type: "ObjectTypeInternalSlot";
  id: Identifier;
  value: FlowType;
  optional: boolean;
  static: boolean;
  method: boolean;
}

export interface ObjectTypeCallProperty extends BaseNode {
  type: "ObjectTypeCallProperty";
  value: FlowType;
  static: boolean;
}

export interface ObjectTypeIndexer extends BaseNode {
  type: "ObjectTypeIndexer";
  id?: Identifier | null;
  key: FlowType;
  value: FlowType;
  variance?: Variance | null;
  static: boolean;
}

export interface ObjectTypeProperty extends BaseNode {
  type: "ObjectTypeProperty";
  key: Identifier | StringLiteral;
  value: FlowType;
  variance?: Variance | null;
  kind: "init" | "get" | "set";
  method: boolean;
  optional: boolean;
  proto: boolean;
  static: boolean;
}

export interface ObjectTypeSpreadProperty extends BaseNode {
  type: "ObjectTypeSpreadProperty";
  argument: FlowType;
}

export interface OpaqueType extends BaseNode {
  type: "OpaqueType";
  id: Identifier;
  typeParameters?: TypeParameterDeclaration | null;
  supertype?: FlowType | null;
  impltype: FlowType;
}

export interface QualifiedTypeIdentifier extends BaseNode {
  type: "QualifiedTypeIdentifier";
  id: Identifier;
  qualification: Identifier | QualifiedTypeIdentifier;
}

export interface StringLiteralTypeAnnotation extends BaseNode {
  type: "StringLiteralTypeAnnotation";
  value: string;
}

export interface StringTypeAnnotation extends BaseNode {
  type: "StringTypeAnnotation";
}

export interface SymbolTypeAnnotation extends BaseNode {
  type: "SymbolTypeAnnotation";
}

export interface ThisTypeAnnotation extends BaseNode {
  type: "ThisTypeAnnotation";
}

export interface TupleTypeAnnotation extends BaseNode {
  type: "TupleTypeAnnotation";
  types: Array<FlowType>;
}

export interface TypeofTypeAnnotation extends BaseNode {
  type: "TypeofTypeAnnotation";
  argument: FlowType;
}

export interface TypeAlias extends BaseNode {
  type: "TypeAlias";
  id: Identifier;
  typeParameters?: TypeParameterDeclaration | null;
  right: FlowType;
}

export interface TypeAnnotation extends BaseNode {
  type: "TypeAnnotation";
  typeAnnotation: FlowType;
}

export interface TypeCastExpression extends BaseNode {
  type: "TypeCastExpression";
  expression: Expression;
  typeAnnotation: TypeAnnotation;
}

export interface TypeParameter extends BaseNode {
  type: "TypeParameter";
  bound?: TypeAnnotation | null;
  default?: FlowType | null;
  variance?: Variance | null;
  name: string;
}

export interface TypeParameterDeclaration extends BaseNode {
  type: "TypeParameterDeclaration";
  params: Array<TypeParameter>;
}

export interface TypeParameterInstantiation extends BaseNode {
  type: "TypeParameterInstantiation";
  params: Array<FlowType>;
}

export interface UnionTypeAnnotation extends BaseNode {
  type: "UnionTypeAnnotation";
  types: Array<FlowType>;
}

export interface Variance extends BaseNode {
  type: "Variance";
  kind: "minus" | "plus";
}

export interface VoidTypeAnnotation extends BaseNode {
  type: "VoidTypeAnnotation";
}

export interface EnumDeclaration extends BaseNode {
  type: "EnumDeclaration";
  id: Identifier;
  body: EnumBooleanBody | EnumNumberBody | EnumStringBody | EnumSymbolBody;
}

export interface EnumBooleanBody extends BaseNode {
  type: "EnumBooleanBody";
  members: Array<EnumBooleanMember>;
  explicitType: boolean;
  hasUnknownMembers: boolean;
}

export interface EnumNumberBody extends BaseNode {
  type: "EnumNumberBody";
  members: Array<EnumNumberMember>;
  explicitType: boolean;
  hasUnknownMembers: boolean;
}

export interface EnumStringBody extends BaseNode {
  type: "EnumStringBody";
  members: Array<EnumStringMember | EnumDefaultedMember>;
  explicitType: boolean;
  hasUnknownMembers: boolean;
}

export interface EnumSymbolBody extends BaseNode {
  type: "EnumSymbolBody";
  members: Array<EnumDefaultedMember>;
  hasUnknownMembers: boolean;
}

export interface EnumBooleanMember extends BaseNode {
  type: "EnumBooleanMember";
  id: Identifier;
  init: BooleanLiteral;
}

export interface EnumNumberMember extends BaseNode {
  type: "EnumNumberMember";
  id: Identifier;
  init: NumericLiteral;
}

export interface EnumStringMember extends BaseNode {
  type: "EnumStringMember";
  id: Identifier;
  init: StringLiteral;
}

export interface EnumDefaultedMember extends BaseNode {
  type: "EnumDefaultedMember";
  id: Identifier;
}

export interface JSXAttribute extends BaseNode {
  type: "JSXAttribute";
  name: JSXIdentifier | JSXNamespacedName;
  value?:
    | JSXElement
    | JSXFragment
    | StringLiteral
    | JSXExpressionContainer
    | null;
}

export interface JSXClosingElement extends BaseNode {
  type: "JSXClosingElement";
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
}

export interface JSXElement extends BaseNode {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  closingElement?: JSXClosingElement | null;
  children: Array<
    JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment
  >;
  selfClosing?: boolean | null;
}

export interface JSXEmptyExpression extends BaseNode {
  type: "JSXEmptyExpression";
}

export interface JSXExpressionContainer extends BaseNode {
  type: "JSXExpressionContainer";
  expression: Expression | JSXEmptyExpression;
}

export interface JSXSpreadChild extends BaseNode {
  type: "JSXSpreadChild";
  expression: Expression;
}

export interface JSXIdentifier extends BaseNode {
  type: "JSXIdentifier";
  name: string;
}

export interface JSXMemberExpression extends BaseNode {
  type: "JSXMemberExpression";
  object: JSXMemberExpression | JSXIdentifier;
  property: JSXIdentifier;
}

export interface JSXNamespacedName extends BaseNode {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  name: JSXIdentifier;
}

export interface JSXOpeningElement extends BaseNode {
  type: "JSXOpeningElement";
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
  attributes: Array<JSXAttribute | JSXSpreadAttribute>;
  selfClosing: boolean;
  typeParameters?:
    | TypeParameterInstantiation
    | TSTypeParameterInstantiation
    | null;
}

export interface JSXSpreadAttribute extends BaseNode {
  type: "JSXSpreadAttribute";
  argument: Expression;
}

export interface JSXText extends BaseNode {
  type: "JSXText";
  value: string;
}

export interface JSXFragment extends BaseNode {
  type: "JSXFragment";
  openingFragment: JSXOpeningFragment;
  closingFragment: JSXClosingFragment;
  children: Array<
    JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment
  >;
}

export interface JSXOpeningFragment extends BaseNode {
  type: "JSXOpeningFragment";
}

export interface JSXClosingFragment extends BaseNode {
  type: "JSXClosingFragment";
}

export interface Noop extends BaseNode {
  type: "Noop";
}

export interface Placeholder extends BaseNode {
  type: "Placeholder";
  expectedNode:
    | "Identifier"
    | "StringLiteral"
    | "Expression"
    | "Statement"
    | "Declaration"
    | "BlockStatement"
    | "ClassBody"
    | "Pattern";
  name: Identifier;
}

export interface V8IntrinsicIdentifier extends BaseNode {
  type: "V8IntrinsicIdentifier";
  name: string;
}

export interface ArgumentPlaceholder extends BaseNode {
  type: "ArgumentPlaceholder";
}

export interface BindExpression extends BaseNode {
  type: "BindExpression";
  object: Expression;
  callee: Expression;
}

export interface ClassProperty extends BaseNode {
  type: "ClassProperty";
  key: Identifier | StringLiteral | NumericLiteral | Expression;
  value?: Expression | null;
  typeAnnotation?: TypeAnnotation | TSTypeAnnotation | Noop | null;
  decorators?: Array<Decorator> | null;
  computed?: boolean;
  static?: boolean;
  abstract?: boolean | null;
  accessibility?: "public" | "private" | "protected" | null;
  declare?: boolean | null;
  definite?: boolean | null;
  optional?: boolean | null;
  readonly?: boolean | null;
}

export interface PipelineTopicExpression extends BaseNode {
  type: "PipelineTopicExpression";
  expression: Expression;
}

export interface PipelineBareFunction extends BaseNode {
  type: "PipelineBareFunction";
  callee: Expression;
}

export interface PipelinePrimaryTopicReference extends BaseNode {
  type: "PipelinePrimaryTopicReference";
}

export interface ClassPrivateProperty extends BaseNode {
  type: "ClassPrivateProperty";
  key: PrivateName;
  value?: Expression | null;
  decorators?: Array<Decorator> | null;
  static: any;
  typeAnnotation?: TypeAnnotation | TSTypeAnnotation | Noop | null;
}

export interface ClassPrivateMethod extends BaseNode {
  type: "ClassPrivateMethod";
  kind?: "get" | "set" | "method" | "constructor";
  key: PrivateName;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  body: BlockStatement;
  static?: boolean;
  abstract?: boolean | null;
  access?: "public" | "private" | "protected" | null;
  accessibility?: "public" | "private" | "protected" | null;
  async?: boolean;
  computed?: boolean;
  decorators?: Array<Decorator> | null;
  generator?: boolean;
  optional?: boolean | null;
  returnType?: TypeAnnotation | TSTypeAnnotation | Noop | null;
  typeParameters?:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface ImportAttribute extends BaseNode {
  type: "ImportAttribute";
  key: Identifier | StringLiteral;
  value: StringLiteral;
}

export interface Decorator extends BaseNode {
  type: "Decorator";
  expression: Expression;
}

export interface DoExpression extends BaseNode {
  type: "DoExpression";
  body: BlockStatement;
}

export interface ExportDefaultSpecifier extends BaseNode {
  type: "ExportDefaultSpecifier";
  exported: Identifier;
}

export interface PrivateName extends BaseNode {
  type: "PrivateName";
  id: Identifier;
}

export interface RecordExpression extends BaseNode {
  type: "RecordExpression";
  properties: Array<ObjectProperty | SpreadElement>;
}

export interface TupleExpression extends BaseNode {
  type: "TupleExpression";
  elements: Array<Expression | SpreadElement>;
}

export interface DecimalLiteral extends BaseNode {
  type: "DecimalLiteral";
  value: string;
}

export interface StaticBlock extends BaseNode {
  type: "StaticBlock";
  body: Array<Statement>;
}

export interface ModuleExpression extends BaseNode {
  type: "ModuleExpression";
  body: Program;
}

export interface TSParameterProperty extends BaseNode {
  type: "TSParameterProperty";
  parameter: Identifier | AssignmentPattern;
  accessibility?: "public" | "private" | "protected" | null;
  readonly?: boolean | null;
}

export interface TSDeclareFunction extends BaseNode {
  type: "TSDeclareFunction";
  id?: Identifier | null;
  typeParameters?: TSTypeParameterDeclaration | Noop | null;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  returnType?: TSTypeAnnotation | Noop | null;
  async?: boolean;
  declare?: boolean | null;
  generator?: boolean;
}

export interface TSDeclareMethod extends BaseNode {
  type: "TSDeclareMethod";
  decorators?: Array<Decorator> | null;
  key: Identifier | StringLiteral | NumericLiteral | Expression;
  typeParameters?: TSTypeParameterDeclaration | Noop | null;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  returnType?: TSTypeAnnotation | Noop | null;
  abstract?: boolean | null;
  access?: "public" | "private" | "protected" | null;
  accessibility?: "public" | "private" | "protected" | null;
  async?: boolean;
  computed?: boolean;
  generator?: boolean;
  kind?: "get" | "set" | "method" | "constructor";
  optional?: boolean | null;
  static?: boolean;
}

export interface TSQualifiedName extends BaseNode {
  type: "TSQualifiedName";
  left: TSEntityName;
  right: Identifier;
}

export interface TSCallSignatureDeclaration extends BaseNode {
  type: "TSCallSignatureDeclaration";
  typeParameters?: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation?: TSTypeAnnotation | null;
}

export interface TSConstructSignatureDeclaration extends BaseNode {
  type: "TSConstructSignatureDeclaration";
  typeParameters?: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation?: TSTypeAnnotation | null;
}

export interface TSPropertySignature extends BaseNode {
  type: "TSPropertySignature";
  key: Expression;
  typeAnnotation?: TSTypeAnnotation | null;
  initializer?: Expression | null;
  computed?: boolean | null;
  optional?: boolean | null;
  readonly?: boolean | null;
}

export interface TSMethodSignature extends BaseNode {
  type: "TSMethodSignature";
  key: Expression;
  typeParameters?: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation?: TSTypeAnnotation | null;
  computed?: boolean | null;
  optional?: boolean | null;
}

export interface TSIndexSignature extends BaseNode {
  type: "TSIndexSignature";
  parameters: Array<Identifier>;
  typeAnnotation?: TSTypeAnnotation | null;
  readonly?: boolean | null;
}

export interface TSAnyKeyword extends BaseNode {
  type: "TSAnyKeyword";
}

export interface TSBooleanKeyword extends BaseNode {
  type: "TSBooleanKeyword";
}

export interface TSBigIntKeyword extends BaseNode {
  type: "TSBigIntKeyword";
}

export interface TSIntrinsicKeyword extends BaseNode {
  type: "TSIntrinsicKeyword";
}

export interface TSNeverKeyword extends BaseNode {
  type: "TSNeverKeyword";
}

export interface TSNullKeyword extends BaseNode {
  type: "TSNullKeyword";
}

export interface TSNumberKeyword extends BaseNode {
  type: "TSNumberKeyword";
}

export interface TSObjectKeyword extends BaseNode {
  type: "TSObjectKeyword";
}

export interface TSStringKeyword extends BaseNode {
  type: "TSStringKeyword";
}

export interface TSSymbolKeyword extends BaseNode {
  type: "TSSymbolKeyword";
}

export interface TSUndefinedKeyword extends BaseNode {
  type: "TSUndefinedKeyword";
}

export interface TSUnknownKeyword extends BaseNode {
  type: "TSUnknownKeyword";
}

export interface TSVoidKeyword extends BaseNode {
  type: "TSVoidKeyword";
}

export interface TSThisType extends BaseNode {
  type: "TSThisType";
}

export interface TSFunctionType extends BaseNode {
  type: "TSFunctionType";
  typeParameters?: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation?: TSTypeAnnotation | null;
}

export interface TSConstructorType extends BaseNode {
  type: "TSConstructorType";
  typeParameters?: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation?: TSTypeAnnotation | null;
  abstract?: boolean | null;
}

export interface TSTypeReference extends BaseNode {
  type: "TSTypeReference";
  typeName: TSEntityName;
  typeParameters?: TSTypeParameterInstantiation | null;
}

export interface TSTypePredicate extends BaseNode {
  type: "TSTypePredicate";
  parameterName: Identifier | TSThisType;
  typeAnnotation?: TSTypeAnnotation | null;
  asserts?: boolean | null;
}

export interface TSTypeQuery extends BaseNode {
  type: "TSTypeQuery";
  exprName: TSEntityName | TSImportType;
}

export interface TSTypeLiteral extends BaseNode {
  type: "TSTypeLiteral";
  members: Array<TSTypeElement>;
}

export interface TSArrayType extends BaseNode {
  type: "TSArrayType";
  elementType: TSType;
}

export interface TSTupleType extends BaseNode {
  type: "TSTupleType";
  elementTypes: Array<TSType | TSNamedTupleMember>;
}

export interface TSOptionalType extends BaseNode {
  type: "TSOptionalType";
  typeAnnotation: TSType;
}

export interface TSRestType extends BaseNode {
  type: "TSRestType";
  typeAnnotation: TSType;
}

export interface TSNamedTupleMember extends BaseNode {
  type: "TSNamedTupleMember";
  label: Identifier;
  elementType: TSType;
  optional: boolean;
}

export interface TSUnionType extends BaseNode {
  type: "TSUnionType";
  types: Array<TSType>;
}

export interface TSIntersectionType extends BaseNode {
  type: "TSIntersectionType";
  types: Array<TSType>;
}

export interface TSConditionalType extends BaseNode {
  type: "TSConditionalType";
  checkType: TSType;
  extendsType: TSType;
  trueType: TSType;
  falseType: TSType;
}

export interface TSInferType extends BaseNode {
  type: "TSInferType";
  typeParameter: TSTypeParameter;
}

export interface TSParenthesizedType extends BaseNode {
  type: "TSParenthesizedType";
  typeAnnotation: TSType;
}

export interface TSTypeOperator extends BaseNode {
  type: "TSTypeOperator";
  typeAnnotation: TSType;
  operator: string;
}

export interface TSIndexedAccessType extends BaseNode {
  type: "TSIndexedAccessType";
  objectType: TSType;
  indexType: TSType;
}

export interface TSMappedType extends BaseNode {
  type: "TSMappedType";
  typeParameter: TSTypeParameter;
  typeAnnotation?: TSType | null;
  nameType?: TSType | null;
  optional?: boolean | null;
  readonly?: boolean | null;
}

export interface TSLiteralType extends BaseNode {
  type: "TSLiteralType";
  literal: NumericLiteral | StringLiteral | BooleanLiteral | BigIntLiteral;
}

export interface TSExpressionWithTypeArguments extends BaseNode {
  type: "TSExpressionWithTypeArguments";
  expression: TSEntityName;
  typeParameters?: TSTypeParameterInstantiation | null;
}

export interface TSInterfaceDeclaration extends BaseNode {
  type: "TSInterfaceDeclaration";
  id: Identifier;
  typeParameters?: TSTypeParameterDeclaration | null;
  extends?: Array<TSExpressionWithTypeArguments> | null;
  body: TSInterfaceBody;
  declare?: boolean | null;
}

export interface TSInterfaceBody extends BaseNode {
  type: "TSInterfaceBody";
  body: Array<TSTypeElement>;
}

export interface TSTypeAliasDeclaration extends BaseNode {
  type: "TSTypeAliasDeclaration";
  id: Identifier;
  typeParameters?: TSTypeParameterDeclaration | null;
  typeAnnotation: TSType;
  declare?: boolean | null;
}

export interface TSAsExpression extends BaseNode {
  type: "TSAsExpression";
  expression: Expression;
  typeAnnotation: TSType;
}

export interface TSTypeAssertion extends BaseNode {
  type: "TSTypeAssertion";
  typeAnnotation: TSType;
  expression: Expression;
}

export interface TSEnumDeclaration extends BaseNode {
  type: "TSEnumDeclaration";
  id: Identifier;
  members: Array<TSEnumMember>;
  const?: boolean | null;
  declare?: boolean | null;
  initializer?: Expression | null;
}

export interface TSEnumMember extends BaseNode {
  type: "TSEnumMember";
  id: Identifier | StringLiteral;
  initializer?: Expression | null;
}

export interface TSModuleDeclaration extends BaseNode {
  type: "TSModuleDeclaration";
  id: Identifier | StringLiteral;
  body: TSModuleBlock | TSModuleDeclaration;
  declare?: boolean | null;
  global?: boolean | null;
}

export interface TSModuleBlock extends BaseNode {
  type: "TSModuleBlock";
  body: Array<Statement>;
}

export interface TSImportType extends BaseNode {
  type: "TSImportType";
  argument: StringLiteral;
  qualifier?: TSEntityName | null;
  typeParameters?: TSTypeParameterInstantiation | null;
}

export interface TSImportEqualsDeclaration extends BaseNode {
  type: "TSImportEqualsDeclaration";
  id: Identifier;
  moduleReference: TSEntityName | TSExternalModuleReference;
  isExport: boolean;
}

export interface TSExternalModuleReference extends BaseNode {
  type: "TSExternalModuleReference";
  expression: StringLiteral;
}

export interface TSNonNullExpression extends BaseNode {
  type: "TSNonNullExpression";
  expression: Expression;
}

export interface TSExportAssignment extends BaseNode {
  type: "TSExportAssignment";
  expression: Expression;
}

export interface TSNamespaceExportDeclaration extends BaseNode {
  type: "TSNamespaceExportDeclaration";
  id: Identifier;
}

export interface TSTypeAnnotation extends BaseNode {
  type: "TSTypeAnnotation";
  typeAnnotation: TSType;
}

export interface TSTypeParameterInstantiation extends BaseNode {
  type: "TSTypeParameterInstantiation";
  params: Array<TSType>;
}

export interface TSTypeParameterDeclaration extends BaseNode {
  type: "TSTypeParameterDeclaration";
  params: Array<TSTypeParameter>;
}

export interface TSTypeParameter extends BaseNode {
  type: "TSTypeParameter";
  constraint?: TSType | null;
  default?: TSType | null;
  name: string;
}
123 */







#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Expression {

    // TODO
    // ArrayExpression(ArrayExpression),
    // AssignmentExpression(AssignmentExpression),
    // BinaryExpression(BinaryExpression),
    // CallExpression(CallExpression),
    // ConditionalExpression(ConditionalExpression),
    // FunctionExpression(FunctionExpression),
    // Identifier(Identifier),
    // StringLiteral(StringLiteral),
    // NumericLiteral(NumericLiteral),
    // NullLiteral(NullLiteral),
    // BooleanLiteral(BooleanLiteral),
    // RegExpLiteral(RegExpLiteral),
    // LogicalExpression(LogicalExpression),
    // MemberExpression(MemberExpression),
    // NewExpression(NewExpression),
    // ObjectExpression(ObjectExpression),
    // SequenceExpression(SequenceExpression),
    // ParenthesizedExpression(ParenthesizedExpression),
    // ThisExpression(ThisExpression),
    // UnaryExpression(UnaryExpression),
    // UpdateExpression(UpdateExpression),
    // ArrowFunctionExpression(ArrowFunctionExpression),
    // ClassExpression(ClassExpression),
    // MetaProperty(MetaProperty),
    // Super(Super),
    // TaggedTemplateExpression(TaggedTemplateExpression),
    // TemplateLiteral(TemplateLiteral),
    // YieldExpression(YieldExpression),
    // AwaitExpression(AwaitExpression),
    // Import(Import),
    // BigIntLiteral(BigIntLiteral),
    // OptionalMemberExpression(OptionalMemberExpression),
    // OptionalCallExpression(OptionalCallExpression),
    // TypeCastExpression(TypeCastExpression),
    // JSXElement(JSXElement),
    // JSXFragment(JSXFragment),
    // BindExpression(BindExpression),
    // PipelinePrimaryTopicReference(PipelinePrimaryTopicReference),
    // DoExpression(DoExpression),
    // RecordExpression(RecordExpression),
    // TupleExpression(TupleExpression),
    // DecimalLiteral(DecimalLiteral),
    // ModuleExpression(ModuleExpression),
    // TSAsExpression(TSAsExpression),
    // TSTypeAssertion(TSTypeAssertion),
    // TSNonNullExpression(TSNonNullExpression),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Binary {

    // TODO
    // BinaryExpression(BinaryExpression),
    // LogicalExpression(LogicalExpression),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Scopable {

    // TODO
    // BlockStatement(BlockStatement),
    // CatchClause(CatchClause),
    // DoWhileStatement(DoWhileStatement),
    // ForInStatement(ForInStatement),
    // ForStatement(ForStatement),
    // FunctionDeclaration(FunctionDeclaration),
    // FunctionExpression(FunctionExpression),
    // Program(Program),
    // ObjectMethod(ObjectMethod),
    // SwitchStatement(SwitchStatement),
    // WhileStatement(WhileStatement),
    // ArrowFunctionExpression(ArrowFunctionExpression),
    // ClassExpression(ClassExpression),
    // ClassDeclaration(ClassDeclaration),
    // ForOfStatement(ForOfStatement),
    // ClassMethod(ClassMethod),
    // ClassPrivateMethod(ClassPrivateMethod),
    // StaticBlock(StaticBlock),
    // TSModuleBlock(TSModuleBlock),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BlockParent  {

    // TODO
    // BlockStatement(BlockStatement),
    // CatchClause(CatchClause),
    // DoWhileStatement(DoWhileStatement),
    // ForInStatement(ForInStatement),
    // ForStatement(ForStatement),
    // FunctionDeclaration(FunctionDeclaration),
    // FunctionExpression(FunctionExpression),
    // Program(Program),
    // ObjectMethod(ObjectMethod),
    // SwitchStatement(SwitchStatement),
    // WhileStatement(WhileStatement),
    // ArrowFunctionExpression(ArrowFunctionExpression),
    // ForOfStatement(ForOfStatement),
    // ClassMethod(ClassMethod),
    // ClassPrivateMethod(ClassPrivateMethod),
    // StaticBlock(StaticBlock),
    // TSModuleBlock(TSModuleBlock),

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Block {

    // TODO
    // BlockStatement(BlockStatement),
    // Program(Program),
    // TSModuleBlock(TSModuleBlock),

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

