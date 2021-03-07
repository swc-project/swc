use std::collections::HashMap;

use ahash::RandomState;
use serde::{Serialize, Deserialize};
use serde_json::Value;

// This file is derived from source:
// https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts

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
#[serde(rename_all = "lowercase")]
pub enum CommentTypeShorthand {
    Leading,
    Inner,
    Trailing,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Node {
    AnyTypeAnnotation(AnyTypeAnnotation),
    ArgumentPlaceholder(ArgumentPlaceholder),
    ArrayExpression(ArrayExpression),
    ArrayPattern(ArrayPattern),
    ArrayTypeAnnotation(ArrayTypeAnnotation),
    ArrowFunctionExpression(ArrowFunctionExpression),
    AssignmentExpression(AssignmentExpression),
    AssignmentPattern(AssignmentPattern),
    AwaitExpression(AwaitExpression),
    BigIntLiteral(BigIntLiteral),
    Binary(Binary),
    BinaryExpression(BinaryExpression),
    BindExpression(BindExpression),
    Block(Block),
    BlockParent(BlockParent),
    BlockStatement(BlockStatement),
    BooleanLiteral(BooleanLiteral),
    BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
    BooleanTypeAnnotation(BooleanTypeAnnotation),
    BreakStatement(BreakStatement),
    CallExpression(CallExpression),
    CatchClause(CatchClause),
    Class(Class),
    ClassBody(ClassBody),
    ClassDeclaration(ClassDeclaration),
    ClassExpression(ClassExpression),
    ClassImplements(ClassImplements),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
    ClassPrivateProperty(ClassPrivateProperty),
    ClassProperty(ClassProperty),
    CompletionStatement(CompletionStatement),
    Conditional(Conditional),
    ConditionalExpression(ConditionalExpression),
    ContinueStatement(ContinueStatement),
    DebuggerStatement(DebuggerStatement),
    DecimalLiteral(DecimalLiteral),
    Declaration(Declaration),
    DeclareClass(DeclareClass),
    DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    DeclareExportDeclaration(DeclareExportDeclaration),
    DeclareFunction(DeclareFunction),
    DeclareInterface(DeclareInterface),
    DeclareModule(DeclareModule),
    DeclareModuleExports(DeclareModuleExports),
    DeclareOpaqueType(DeclareOpaqueType),
    DeclareTypeAlias(DeclareTypeAlias),
    DeclareVariable(DeclareVariable),
    DeclaredPredicate(DeclaredPredicate),
    Decorator(Decorator),
    Directive(Directive),
    DirectiveLiteral(DirectiveLiteral),
    DoExpression(DoExpression),
    DoWhileStatement(DoWhileStatement),
    EmptyStatement(EmptyStatement),
    EmptyTypeAnnotation(EmptyTypeAnnotation),
    EnumBody(EnumBody),
    EnumBooleanBody(EnumBooleanBody),
    EnumBooleanMember(EnumBooleanMember),
    EnumDeclaration(EnumDeclaration),
    EnumDefaultedMember(EnumDefaultedMember),
    EnumMember(EnumMember),
    EnumNumberBody(EnumNumberBody),
    EnumNumberMember(EnumNumberMember),
    EnumStringBody(EnumStringBody),
    EnumStringMember(EnumStringMember),
    EnumSymbolBody(EnumSymbolBody),
    ExistsTypeAnnotation(ExistsTypeAnnotation),
    ExportAllDeclaration(ExportAllDeclaration),
    ExportDeclaration(ExportDeclaration),
    ExportDefaultDeclaration(ExportDefaultDeclaration),
    ExportDefaultSpecifier(ExportDefaultSpecifier),
    ExportNamedDeclaration(ExportNamedDeclaration),
    ExportNamespaceSpecifier(ExportNamespaceSpecifier),
    ExportSpecifier(ExportSpecifier),
    Expression(Expression),
    ExpressionStatement(ExpressionStatement),
    ExpressionWrapper(ExpressionWrapper),
    File(File),
    Flow(Flow),
    FlowBaseAnnotation(FlowBaseAnnotation),
    FlowDeclaration(FlowDeclaration),
    FlowPredicate(FlowPredicate),
    FlowType(FlowType),
    For(For),
    ForInStatement(ForInStatement),
    ForOfStatement(ForOfStatement),
    ForStatement(ForStatement),
    ForXStatement(ForXStatement),
    Function(Function),
    FunctionDeclaration(FunctionDeclaration),
    FunctionExpression(FunctionExpression),
    FunctionParent(FunctionParent),
    FunctionTypeAnnotation(FunctionTypeAnnotation),
    FunctionTypeParam(FunctionTypeParam),
    GenericTypeAnnotation(GenericTypeAnnotation),
    Identifier(Identifier),
    IfStatement(IfStatement),
    Immutable(Immutable),
    Import(Import),
    ImportAttribute(ImportAttribute),
    ImportDeclaration(ImportDeclaration),
    ImportDefaultSpecifier(ImportDefaultSpecifier),
    ImportNamespaceSpecifier(ImportNamespaceSpecifier),
    ImportSpecifier(ImportSpecifier),
    InferredPredicate(InferredPredicate),
    InterfaceDeclaration(InterfaceDeclaration),
    InterfaceExtends(InterfaceExtends),
    InterfaceTypeAnnotation(InterfaceTypeAnnotation),
    InterpreterDirective(InterpreterDirective),
    IntersectionTypeAnnotation(IntersectionTypeAnnotation),
    JSX(JSX),
    JSXAttribute(JSXAttribute),
    JSXClosingElement(JSXClosingElement),
    JSXClosingFragment(JSXClosingFragment),
    JSXElement(JSXElement),
    JSXEmptyExpression(JSXEmptyExpression),
    JSXExpressionContainer(JSXExpressionContainer),
    JSXFragment(JSXFragment),
    JSXIdentifier(JSXIdentifier),
    JSXMemberExpression(JSXMemberExpression),
    JSXNamespacedName(JSXNamespacedName),
    JSXOpeningElement(JSXOpeningElement),
    JSXOpeningFragment(JSXOpeningFragment),
    JSXSpreadAttribute(JSXSpreadAttribute),
    JSXSpreadChild(JSXSpreadChild),
    JSXText(JSXText),
    LVal(LVal),
    LabeledStatement(LabeledStatement),
    Literal(Literal),
    LogicalExpression(LogicalExpression),
    Loop(Loop),
    MemberExpression(MemberExpression),
    MetaProperty(MetaProperty),
    Method(Method),
    MixedTypeAnnotation(MixedTypeAnnotation),
    ModuleDeclaration(ModuleDeclaration),
    ModuleExpression(ModuleExpression),
    ModuleSpecifier(ModuleSpecifier),
    NewExpression(NewExpression),
    Noop(Noop),
    NullLiteral(NullLiteral),
    NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    NullableTypeAnnotation(NullableTypeAnnotation),
    NumberLiteral(NumberLiteral),
    NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
    NumberTypeAnnotation(NumberTypeAnnotation),
    NumericLiteral(NumericLiteral),
    ObjectExpression(ObjectExpression),
    ObjectMember(ObjectMember),
    ObjectMethod(ObjectMethod),
    ObjectPattern(ObjectPattern),
    ObjectProperty(ObjectProperty),
    ObjectTypeAnnotation(ObjectTypeAnnotation),
    ObjectTypeCallProperty(ObjectTypeCallProperty),
    ObjectTypeIndexer(ObjectTypeIndexer),
    ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    ObjectTypeProperty(ObjectTypeProperty),
    ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
    OpaqueType(OpaqueType),
    OptionalCallExpression(OptionalCallExpression),
    OptionalMemberExpression(OptionalMemberExpression),
    ParenthesizedExpression(ParenthesizedExpression),
    Pattern(Pattern),
    PatternLike(PatternLike),
    PipelineBareFunction(PipelineBareFunction),
    PipelinePrimaryTopicReference(PipelinePrimaryTopicReference),
    PipelineTopicExpression(PipelineTopicExpression),
    Placeholder(Placeholder),
    Private(Private),
    PrivateName(PrivateName),
    Program(Program),
    Property(Property),
    Pureish(Pureish),
    QualifiedTypeIdentifier(QualifiedTypeIdentifier),
    RecordExpression(RecordExpression),
    RegExpLiteral(RegExpLiteral),
    RegexLiteral(RegexLiteral),
    RestElement(RestElement),
    RestProperty(RestProperty),
    ReturnStatement(ReturnStatement),
    Scopable(Scopable),
    SequenceExpression(SequenceExpression),
    SpreadElement(SpreadElement),
    SpreadProperty(SpreadProperty),
    Statement(Statement),
    StaticBlock(StaticBlock),
    StringLiteral(StringLiteral),
    StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
    StringTypeAnnotation(StringTypeAnnotation),
    Super(Super),
    SwitchCase(SwitchCase),
    SwitchStatement(SwitchStatement),
    SymbolTypeAnnotation(SymbolTypeAnnotation),
    TSAnyKeyword(TSAnyKeyword),
    TSArrayType(TSArrayType),
    TSAsExpression(TSAsExpression),
    TSBaseType(TSBaseType),
    TSBigIntKeyword(TSBigIntKeyword),
    TSBooleanKeyword(TSBooleanKeyword),
    TSCallSignatureDeclaration(TSCallSignatureDeclaration),
    TSConditionalType(TSConditionalType),
    TSConstructSignatureDeclaration(TSConstructSignatureDeclaration),
    TSConstructorType(TSConstructorType),
    TSDeclareFunction(TSDeclareFunction),
    TSDeclareMethod(TSDeclareMethod),
    TSEntityName(TSEntityName),
    TSEnumDeclaration(TSEnumDeclaration),
    TSEnumMember(TSEnumMember),
    TSExportAssignment(TSExportAssignment),
    TSExpressionWithTypeArguments(TSExpressionWithTypeArguments),
    TSExternalModuleReference(TSExternalModuleReference),
    TSFunctionType(TSFunctionType),
    TSImportEqualsDeclaration(TSImportEqualsDeclaration),
    TSImportType(TSImportType),
    TSIndexSignature(TSIndexSignature),
    TSIndexedAccessType(TSIndexedAccessType),
    TSInferType(TSInferType),
    TSInterfaceBody(TSInterfaceBody),
    TSInterfaceDeclaration(TSInterfaceDeclaration),
    TSIntersectionType(TSIntersectionType),
    TSIntrinsicKeyword(TSIntrinsicKeyword),
    TSLiteralType(TSLiteralType),
    TSMappedType(TSMappedType),
    TSMethodSignature(TSMethodSignature),
    TSModuleBlock(TSModuleBlock),
    TSModuleDeclaration(TSModuleDeclaration),
    TSNamedTupleMember(TSNamedTupleMember),
    TSNamespaceExportDeclaration(TSNamespaceExportDeclaration),
    TSNeverKeyword(TSNeverKeyword),
    TSNonNullExpression(TSNonNullExpression),
    TSNullKeyword(TSNullKeyword),
    TSNumberKeyword(TSNumberKeyword),
    TSObjectKeyword(TSObjectKeyword),
    TSOptionalType(TSOptionalType),
    TSParameterProperty(TSParameterProperty),
    TSParenthesizedType(TSParenthesizedType),
    TSPropertySignature(TSPropertySignature),
    TSQualifiedName(TSQualifiedName),
    TSRestType(TSRestType),
    TSStringKeyword(TSStringKeyword),
    TSSymbolKeyword(TSSymbolKeyword),
    TSThisType(TSThisType),
    TSTupleType(TSTupleType),
    TSType(TSType),
    TSTypeAliasDeclaration(TSTypeAliasDeclaration),
    TSTypeAnnotation(TSTypeAnnotation),
    TSTypeAssertion(TSTypeAssertion),
    TSTypeElement(TSTypeElement),
    TSTypeLiteral(TSTypeLiteral),
    TSTypeOperator(TSTypeOperator),
    TSTypeParameter(TSTypeParameter),
    TSTypeParameterDeclaration(TSTypeParameterDeclaration),
    TSTypeParameterInstantiation(TSTypeParameterInstantiation),
    TSTypePredicate(TSTypePredicate),
    TSTypeQuery(TSTypeQuery),
    TSTypeReference(TSTypeReference),
    TSUndefinedKeyword(TSUndefinedKeyword),
    TSUnionType(TSUnionType),
    TSUnknownKeyword(TSUnknownKeyword),
    TSVoidKeyword(TSVoidKeyword),
    TaggedTemplateExpression(TaggedTemplateExpression),
    TemplateElement(TemplateElement),
    TemplateLiteral(TemplateLiteral),
    Terminatorless(Terminatorless),
    ThisExpression(ThisExpression),
    ThisTypeAnnotation(ThisTypeAnnotation),
    ThrowStatement(ThrowStatement),
    TryStatement(TryStatement),
    TupleExpression(TupleExpression),
    TupleTypeAnnotation(TupleTypeAnnotation),
    TypeAlias(TypeAlias),
    TypeAnnotation(TypeAnnotation),
    TypeCastExpression(TypeCastExpression),
    TypeParameter(TypeParameter),
    TypeParameterDeclaration(TypeParameterDeclaration),
    TypeParameterInstantiation(TypeParameterInstantiation),
    TypeofTypeAnnotation(TypeofTypeAnnotation),
    UnaryExpression(UnaryExpression),
    UnaryLike(UnaryLike),
    UnionTypeAnnotation(UnionTypeAnnotation),
    UpdateExpression(UpdateExpression),
    UserWhitespacable(UserWhitespacable),
    V8IntrinsicIdentifier(V8IntrinsicIdentifier),
    VariableDeclaration(VariableDeclaration),
    VariableDeclarator(VariableDeclarator),
    Variance(Variance),
    VoidTypeAnnotation(VoidTypeAnnotation),
    While(While),
    WhileStatement(WhileStatement),
    WithStatement(WithStatement),
    YieldExpression(YieldExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ArrayExprEl {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "SpreadElement")]
    Spread(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ArrayExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub elements: Vec<Option<ArrayExprEl>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AssignmentExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub operator: String,
    pub left: Box<LVal>,
    pub right: Box<Expression>,
}

// Source:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BinaryExprOp {
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
#[serde(tag = "type")]
pub enum BinaryExprLeft {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "PrivateName")]
    Private(PrivateName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BinaryExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: BinaryExprOp,
    pub left: Box<BinaryExprLeft>,
    pub right: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct InterpreterDirective {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
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
    #[serde(default)]
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BlockStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<Statement>,
    #[serde(default)]
    pub directives: Vec<Directive>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BreakStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub label: Option<Identifier>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct CallExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Box<Callee>,
    #[serde(default)]
    pub arguments: Vec<Arg>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub type_arguments: Option<TypeParameterInstantiation>,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum CatchClauseParam {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "ArrayPattern")]
    Array(ArrayPattern),
    #[serde(rename = "ObjectPattern")]
    Object(ObjectPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct CatchClause {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub param: Option<CatchClauseParam>,
    pub body: BlockStatement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ConditionalExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Box<Expression>,
    pub consequent: Box<Expression>,
    pub alternate: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ContinueStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub label: Option<Identifier>,
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
    pub body: Box<Statement>,
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
    pub program: Program,
    #[serde(default)]
    pub comments: Option<Vec<Comment>>,
    #[serde(default)]
    pub tokens: Option<Vec<Value>>, // TODO: is this the right way to model any?
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ForInStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: ForStmtLeft,
    pub right: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ForStmtInit {
    #[serde(rename = "VariableDeclaration")]
    VarDecl(VariableDeclaration),
    #[serde(rename = "Expression")]
    Expr(Expression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ForStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub init: Option<ForStmtInit>,
    #[serde(default)]
    pub test: Option<Expression>,
    #[serde(default)]
    pub update: Option<Expression>,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct Identifier {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct IfStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Expression,
    pub consequent: Box<Statement>,
    #[serde(default)]
    pub alternate: Option<Box<Statement>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct LabeledStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub label: Identifier,
    pub body: Box<Statement>,
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

/// Deprecated. Use NumericLiteral instead.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NumberLiteral {
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
    #[serde(default)]
    pub flags: String,
}

/// Deprecated. Use RegExpLiteral instead.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct RegexLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub pattern: String,
    #[serde(default)]
    pub flags: String,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LogicalExprOp {
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
    pub operator: LogicalExprOp,
    pub left: Box<Expression>,
    pub right: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum MemberExprProp {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "PrivateName")]
    Private(PrivateName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct MemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub property: Box<MemberExprProp>,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct NewExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Box<Callee>,
    #[serde(default)]
    pub arguments: Vec<Arg>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub type_arguments: Option<TypeParameterInstantiation>,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SrcType {
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
    #[serde(default)]
    pub directives: Vec<Directive>,
    pub source_type: SrcType,
    #[serde(default)]
    pub interpreter: Option<InterpreterDirective>,
    #[serde(default)]
    pub source_file: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ObjectExprProp {
    #[serde(rename = "ObjectMethod")]
    Method(ObjectMethod),
    #[serde(rename = "ObjectProperty")]
    Prop(ObjectProperty),
    #[serde(rename = "SpreadElement")]
    Spread(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub properties: Vec<ObjectExprProp>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ObjectKind {
    Method,
    Get,
    Set,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ObjectKey {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
    #[serde(rename = "NumericLiteral")]
    Numeric(NumericLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: ObjectKind,
    pub key: ObjectKey,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub decorator: Option<Vec<Decorator>>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ObjectPropVal {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "PatternLike")]
    Pattern(PatternLike),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: ObjectKey,
    pub value: ObjectPropVal,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub shorthand: bool,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct RestElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<LVal>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

/// Deprecated. Use RestElement element.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct RestProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: LVal,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ReturnStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub argument: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SequenceExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
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
    #[serde(default)]
    pub test: Option<Expression>,
    #[serde(default)]
    pub consequent: Vec<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SwitchStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub descriminant: Expression,
    #[serde(default)]
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
    #[serde(default)]
    pub handler: Option<CatchClause>,
    #[serde(default)]
    pub finalizer: Option<BlockStatement>,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum UnaryExprOp {
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
    pub operator: UnaryExprOp,
    pub argument: Box<Expression>,
    #[serde(default)]
    pub prefix: bool,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UpdateExprOp {
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
    pub operator: UpdateExprOp,
    pub argument: Box<Expression>,
    #[serde(default)]
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
    #[serde(default)]
    pub declarations: Vec<VariableDeclarator>,
    #[serde(default)]
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct VariableDeclarator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: LVal,
    #[serde(default)]
    pub init: Option<Expression>,
    #[serde(default)]
    pub definite: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct WithStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct WhileStatement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum AssignmentPatternLeft {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "ObjectPattern")]
    Object(ObjectPattern),
    #[serde(rename = "ArrayPattern")]
    Array(ArrayPattern),
    #[serde(rename = "MemberExpression")]
    Member(MemberExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AssignmentPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: AssignmentPatternLeft,
    pub right: Expression,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ArrayPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub elements: Vec<Option<PatternLike>>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ArrowFuncExprBody {
    #[serde(rename = "BlockStatement")]
    Block(BlockStatement),
    #[serde(rename = "Expression")]
    Expr(Expression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ArrowFunctionExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(rename = "NumericLiteral")]
    pub params: Vec<Param>,
    pub body: Box<ArrowFuncExprBody>,
    #[serde(default, rename = "async")]
    pub is_async: bool,
    #[serde(default)]
    pub expression: bool,
    #[serde(default)]
    pub generator: bool,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ClassBodyEl {
    #[serde(rename = "ClassMethod")]
    Method(ClassMethod),
    #[serde(rename = "ClassPrivateMethod")]
    PrivateMethod(ClassPrivateMethod),
    #[serde(rename = "ClassProperty")]
    Prop(ClassProperty),
    #[serde(rename = "ClassPrivateProperty")]
    PrivateProp(ClassPrivateProperty),
    #[serde(rename = "TSDeclareMethod")]
    TSMethod(TSDeclareMethod),
    #[serde(rename = "TSIndexSignature")]
    TSIndex(TSIndexSignature),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ClassBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<ClassBodyEl>,
}


#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    #[serde(default)]
    pub super_class: Option<Box<Expression>>,
    pub body: ClassBody,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub implements: Option<ClassImpl>,
    #[serde(default)]
    pub mixins: Option<InterfaceExtends>,
    #[serde(default)]
    pub super_type_parameters: Option<SuperTypeParams>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub super_class: Option<Expression>,
    pub body: ClassBody,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub implements: Option<ClassImpl>,
    #[serde(default)]
    pub mixins: Option<InterfaceExtends>,
    #[serde(default)]
    pub super_type_parameters: Option<SuperTypeParams>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ExportAllDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub source: StringLiteral,
    #[serde(default)]
    pub assertions: Option<Vec<ImportAttribute>>,
    #[serde(default)]
    pub export_kind: Option<ExportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ExportDefaultDeclType {
    #[serde(rename = "FunctionDeclaration")]
    Func(FunctionDeclaration),
    #[serde(rename = "TSDeclareFunction")]
    TSFunc(TSDeclareFunction),
    #[serde(rename = "ClassDeclaration")]
    Class(ClassDeclaration),
    #[serde(rename = "Expression")]
    Expr(Expression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportDefaultDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub declaration: ExportDefaultDeclType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ExportSpecifierType {
    #[serde(rename = "ExportSpecifier")]
    Export(ExportSpecifier),
    #[serde(rename = "ExportDefaultSpecifier")]
    Default(ExportDefaultSpecifier),
    #[serde(rename = "ExportNamespaceSpecifier")]
    Namespace(ExportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExportNamedDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub declaration: Option<Box<Declaration>>,
    #[serde(default)]
    pub specifiers: Vec<ExportSpecifierType>,
    #[serde(default)]
    pub source: Option<StringLiteral>,
    #[serde(default)]
    pub assertions: Option<Vec<ImportAttribute>>,
    #[serde(default)]
    pub export_kind: Option<ExportKind>
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
    pub left: ForStmtLeft,
    pub right: Expression,
    pub body: Box<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ImportSpecifierType {
    #[serde(rename = "ImportSpecifier")]
    Import(ImportSpecifier),
    #[serde(rename = "ImportDefaultSpecifier")]
    Default(ImportDefaultSpecifier),
    #[serde(rename = "ImportNamespaceSpecifier")]
    Namespace(ImportNamespaceSpecifier),
}


#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ImportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub specifiers: Vec<ImportSpecifierType>,
    pub source: StringLiteral,
    #[serde(default)]
    pub assertions: Option<Vec<ImportAttribute>>,
    #[serde(default)]
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
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub kind: Option<ClassMethodKind>,
    pub key: ObjectKey,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub access: Option<Access>,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ObjectPatternProp {
    #[serde(rename = "RestElement")]
    Rest(RestElement),
    #[serde(rename = "ObjectProperty")]
    Prop(ObjectProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub properties: Vec<ObjectPatternProp>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SpreadElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

/// Deprecated. Use SpreadElement instead.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SpreadProperty {
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
#[serde(tag = "type")]
pub enum TaggedTemplateExprTypeParams {
    #[serde(rename = "TypeParameterDeclaration")]
    Flow(TypeParameterDeclaration),
    #[serde(rename = "TSTypeParameterDeclaration")]
    TS(TSTypeParameterDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TaggedTemplateExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub tag: Box<Expression>,
    pub quasi: TemplateLiteral,
    #[serde(default)]
    pub type_parameters: Option<TaggedTemplateExprTypeParams>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemplateElVal {
    #[serde(default)]
    pub raw: String,
    #[serde(default)]
    pub cooked: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TemplateElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: TemplateElVal,
    #[serde(default)]
    pub tail: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TemplateLiteralExpr {
    #[serde(rename = "Expression")]
    Expr(Expression),
    TSType(TSType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TemplateLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub quasis: Vec<TemplateElement>,
    #[serde(default)]
    pub expressions: Vec<TemplateLiteralExpr>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct YieldExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub argument: Option<Box<Expression>>,
    #[serde(default)]
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
    #[serde(default)]
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
#[serde(tag = "type")]
pub enum OptionalMemberExprProp {
    #[serde(rename = "Expression")]
    Expression(Expression),
    #[serde(rename = "Identifier")]
    Id(Identifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct OptionalMemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub property: Box<OptionalMemberExprProp>,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub optional: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct OptionalCallExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Box<Expression>,
    #[serde(default)]
    pub arguments: Vec<Arg>,
    #[serde(default)]
    pub optional: bool,
    #[serde(default)]
    pub type_arguments: Option<TypeParameterInstantiation>,
    #[serde(default)]
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
    pub element_type: Box<FlowType>,
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
    #[serde(default)]
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
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareClass {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
    #[serde(default)]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
    #[serde(default)]
    pub implements: Option<Vec<ClassImplements>>,
    #[serde(default)]
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub predicate: Option<Box<DeclaredPredicate>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareInterface {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
    #[serde(default)]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
    #[serde(default)]
    pub implements: Option<Vec<ClassImplements>>,
    #[serde(default)]
    pub mixins: Option<Vec<InterfaceExtends>>,
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
    #[serde(default)]
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
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    pub right: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareOpaqueType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    #[serde(default)]
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
pub enum DeclareExportDeclSpecifier {
    #[serde(rename = "ExportSpecifier")]
    Export(ExportSpecifier),
    #[serde(rename = "ExportNamespaceSpecifier")]
    Namespace(ExportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareExportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub declaration: Option<Box<Flow>>,
    #[serde(default)]
    pub specifiers: Option<Vec<DeclareExportDeclSpecifier>>,
    #[serde(default)]
    pub source: Option<StringLiteral>,
    #[serde(default)]
    pub default: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareExportAllDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub source: StringLiteral,
    #[serde(default)]
    pub export_kind: Option<ExportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclaredPredicate {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: Box<Flow>,
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
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    #[serde(default)]
    pub params: Vec<FunctionTypeParam>,
    #[serde(default)]
    pub rest: Option<Box<FunctionTypeParam>>,
    pub return_type: Box<FlowType>,
    #[serde(default)]
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionTypeParam {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: Option<Identifier>,
    pub type_annotation: Box<FlowType>,
    #[serde(default)]
    pub optional: Option<bool>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct GenericTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrQualifiedId,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
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
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    #[serde(default)]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
    #[serde(default)]
    pub implements: Option<Vec<ClassImplements>>,
    #[serde(default)]
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(flatten)]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct IntersectionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(flatten)]
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
    pub type_annotation: Box<FlowType>,
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
#[serde(tag = "type")]
pub enum ObjectTypeAnnotProp {
    #[serde(rename = "ObjectTypeProperty")]
    Prop(ObjectTypeProperty),
    #[serde(rename = "ObjectTypeSpreadProperty")]
    Spread(ObjectTypeSpreadProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub properties: Vec<ObjectTypeAnnotProp>,
    #[serde(default)]
    pub indexers: Option<Vec<ObjectTypeIndexer>>,
    #[serde(default)]
    pub call_properties: Option<Vec<ObjectTypeCallProperty>>,
    #[serde(default)]
    pub internal_slots: Option<Vec<ObjectTypeInternalSlot>>,
    #[serde(default)]
    pub exact: bool,
    #[serde(default)]
    pub inexact: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypeInternalSlot {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub value: FlowType,
    #[serde(default)]
    pub optional: bool,
    #[serde(default, rename = "static")]
    pub is_static: bool,
    #[serde(default)]
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
    #[serde(default)]
    pub id: Option<Identifier>,
    pub key: FlowType,
    pub value: FlowType,
    #[serde(default)]
    pub variance: Option<Variance>,
    #[serde(default, rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ObjectTypePropKind {
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
    #[serde(default)]
    pub variance: Option<Variance>,
    pub kind: ObjectTypePropKind,
    #[serde(default)]
    pub method: bool,
    #[serde(default)]
    pub optional: bool,
    #[serde(default)]
    pub proto: bool,
    #[serde(default, rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypeSpreadProperty {
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
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    #[serde(default)]
    pub supertype: Option<FlowType>,
    pub impltype: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct QualifiedTypeIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub qualification: Box<IdOrQualifiedId>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StringLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
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
    #[serde(default)]
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeofTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TypeAlias {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
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
    #[serde(default)]
    pub bound: Option<TypeAnnotation>,
    #[serde(default)]
    pub default: Option<FlowType>,
    #[serde(default)]
    pub variance: Option<Variance>,
    #[serde(default)]
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeParameterDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<TypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeParameterInstantiation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct UnionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PlusOrMinus {
    Plus,
    Minus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Variance {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: PlusOrMinus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct VoidTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum EnumDeclBody {
    #[serde(rename = "EnumBooleanBody")]
    Boolean(EnumBooleanBody),
    #[serde(rename = "EnumNumberBody")]
    Number(EnumNumberBody),
    #[serde(rename = "EnumStringBody")]
    String(EnumStringBody),
    #[serde(rename = "EnumSymbolBody")]
    Symbol(EnumSymbolBody),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EnumDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub body: EnumDeclBody,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct EnumBooleanBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<EnumBooleanMember>,
    #[serde(default)]
    pub explicit_type: bool,
    #[serde(default)]
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct EnumNumberBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<EnumNumberMember>,
    #[serde(default)]
    pub explicit_type: bool,
    #[serde(default)]
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum EnumStringBodyMember {
    #[serde(rename = "EnumStringBodyMember")]
    String(EnumStringMember),
    #[serde(rename = "EnumDefaultedMember")]
    Defaulted(EnumDefaultedMember),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct EnumStringBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<EnumStringBodyMember>,
    #[serde(default)]
    pub explicit_type: bool,
    #[serde(default)]
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct EnumSymbolBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<EnumDefaultedMember>,
    #[serde(default)]
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
#[serde(tag = "type")]
pub enum JSXAttrName {
    #[serde(rename = "JSXIdentifier")]
    Id(JSXIdentifier),
    #[serde(rename = "JSXNamespacedName")]
    Name(JSXNamespacedName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXAttrVal {
    #[serde(rename = "JSXElement")]
    Element(JSXElement),
    #[serde(rename = "JSXFragment")]
    Fragment(JSXFragment),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
    #[serde(rename = "JSXExpressionContainer")]
    Expr(JSXExpressionContainer),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXAttrName,
    #[serde(default)]
    pub value: Option<JSXAttrVal>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXClosingElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXElementName,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct JSXElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub opening_element: JSXOpeningElement,
    #[serde(default)]
    pub closing_element: Option<JSXClosingElement>,
    #[serde(default)]
    pub children: Vec<JSXElementChild>,
    #[serde(default)]
    pub self_closing: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXEmptyExpression {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXExprContainerExpr {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "JSXEmptyExpression")]
    Empty(JSXEmptyExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXExpressionContainer {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: JSXExprContainerExpr,
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
    #[serde(default)]
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXMemberExprObject {
    #[serde(rename = "JSXMemberExpression")]
    Expr(JSXMemberExpression),
    #[serde(rename = "JSXIdentifier")]
    Id(JSXIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXMemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<JSXMemberExprObject>,
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
#[serde(tag = "type")]
pub enum JSXOpeningElAttr {
    #[serde(rename = "JSXAttribute")]
    Attr(JSXAttribute),
    #[serde(rename = "JSXSpreadAttribute")]
    Spread(JSXSpreadAttribute),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TypeParamDecl {
    #[serde(rename = "TypeParameterDeclaration")]
    Flow(TypeParameterDeclaration),
    #[serde(rename = "TSTypeParameterDeclaration")]
    TS(TSTypeParameterDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct JSXOpeningElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXElementName,
    #[serde(default)]
    pub attributes: Vec<JSXOpeningElAttr>,
    #[serde(default)]
    pub self_closing: bool,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDecl>,
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
    #[serde(default)]
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
    #[serde(default)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: ObjectKey,
    #[serde(default)]
    pub value: Option<Expression>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub definite: Option<bool>,
    #[serde(default)]
    pub optinoal: Option<bool>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct PipelineTopicExpression {
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
    pub key: PrivateName,
    #[serde(default)]
    pub value: Option<Expression>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default, rename = "static")]
    pub static_any: Value, // TODO: is this the right way to model any?
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassPrivateMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub kind: Option<ClassMethodKind>,
    pub key: PrivateName,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub access: Option<Access>,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
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
#[serde(tag = "type")]
pub enum RecordExprProp {
    #[serde(rename = "ObjectProperty")]
    Prop(ObjectProperty),
    #[serde(rename = "SpreadElement")]
    Spread(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct RecordExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub properties: Vec<RecordExprProp>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TupleExprEl {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "Spread")]
    Spread(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TupleExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub elements: Vec<TupleExprEl>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DecimalLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StaticBlock {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
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
#[serde(tag = "type")]
pub enum TSParamPropParam {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "AssignmentPattern")]
    Assignment(AssignmentPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSParameterProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub parameter: TSParamPropParam,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSDeclareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    #[serde(default)]
    pub type_parameters: Option<TSFuncDeclTypeParams>,
    #[serde(default)]
    pub params: Vec<Param>,
    #[serde(default)]
    pub return_type: Option<TSFuncDeclTypeAnnot>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub generator: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSDeclareMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    pub key: ObjectKey,
    #[serde(default)]
    pub type_parameters: Option<TSFuncDeclTypeParams>,
    #[serde(default)]
    pub params: Vec<Param>,
    #[serde(default)]
    pub return_type: Option<TSFuncDeclTypeAnnot>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub access: Option<Access>,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default)]
    pub kind: Option<ClassMethodKind>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSQualifiedName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: Box<TSEntityName>,
    pub right: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSCallSignatureDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<TSTypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConstructSignatureDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<TSTypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSPropertySignature {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: Expression,
    #[serde(default)]
    pub type_annotation: Option<TSTypeAnnotation>,
    #[serde(default)]
    pub initializer: Option<Expression>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSMethodSignature {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<TSTypeAnnotation>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSIndexSignature {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub paramters: Vec<Identifier>,
    #[serde(default)]
    pub type_annotation: Option<TSTypeAnnotation>,
    #[serde(default)]
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
pub struct TSThisType {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSFunctionType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConstructorType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeReference {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_name: TSEntityName,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSTypePredicateParamName {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "TSThisType")]
    This(TSThisType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypePredicate {
    #[serde(flatten)]
    pub base: BaseNode,
    pub parameter_name: TSTypePredicateParamName,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
    #[serde(default)]
    pub asserts: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSTypeQueryExprName {
    #[serde(rename = "TSEntityName")]
    EntityName(TSEntityName),
    #[serde(rename = "TSImportType")]
    ImportType(TSImportType),
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
    #[serde(default)]
    pub members: Vec<TSTypeElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSArrayType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub element_type: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSTupleTypeElType {
    TSType(TSType),
    #[serde(rename = "TSNamedTupleMember")]
    Member(TSNamedTupleMember),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTupleType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub element_types: Vec<TSTupleTypeElType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSOptionalType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSRestType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSNamedTupleMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub label: Identifier,
    pub element_type: TSType,
    #[serde(default)]
    pub optional: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSUnionType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSIntersectionType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConditionalType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub check_type: Box<TSType>,
    pub extends_type: Box<TSType>,
    pub true_type: Box<TSType>,
    pub false_type: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSInferType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_parameter: Box<TSTypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSParenthesizedType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeOperator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
    #[serde(default)]
    pub operator: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSIndexedAccessType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object_type: Box<TSType>,
    pub index_type: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSMappedType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_parameter: Box<TSTypeParameter>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSType>>,
    #[serde(default)]
    pub name_type: Option<Box<TSType>>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSLiteralTypeLiteral {
    #[serde(rename = "NumericLiteral")]
    Numeric(NumericLiteral),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
    #[serde(rename = "BooleanLiteral")]
    Boolean(BooleanLiteral),
    #[serde(rename = "BigIntLiteral")]
    BigInt(BigIntLiteral),
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
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSInterfaceDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub extends: Option<TSExpressionWithTypeArguments>,
    pub body: TSInterfaceBody,
    #[serde(default)]
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSInterfaceBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<TSTypeElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAliasDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub type_annotation: TSType,
    #[serde(default)]
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
    #[serde(default)]
    pub members: Vec<TSEnumMember>,
    #[serde(default, rename = "const")]
    pub is_const: Option<bool>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub initializer: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSEnumMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    #[serde(default)]
    pub initializer: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSModuleDeclBody {
    #[serde(rename = "TSModuleBlock")]
    Block(TSModuleBlock),
    #[serde(rename = "TSModuleDeclaration")]
    Decl(TSModuleDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSModuleDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    pub body: Box<TSModuleDeclBody>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub global: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSModuleBlock {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSImportType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: StringLiteral,
    #[serde(default)]
    pub qualifier: Option<TSEntityName>,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSImportEqualsDeclModuleRef {
    #[serde(rename = "TSEntityName")]
    Name(TSEntityName),
    #[serde(rename = "TSExternalModuleReference")]
    External(TSExternalModuleReference),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSImportEqualsDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub module_reference: TSImportEqualsDeclModuleRef,
    #[serde(default)]
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
    #[serde(default)]
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
    #[serde(default)]
    pub constraint: Option<Box<TSType>>,
    #[serde(default)]
    pub default: Option<Box<TSType>>,
    #[serde(default)]
    pub name: String,
}

// ----------------------------------------------------------------------------
// Shared union types
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Callee {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "V8IntrinsicIdentifier")]
    V8Id(V8IntrinsicIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Arg {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "SpreadElement")]
    Spread(SpreadElement),
    #[serde(rename = "JSXNamespacedName")]
    JSXName(JSXNamespacedName),
    #[serde(rename = "ArgumentPlaceholder")]
    Placeholder(ArgumentPlaceholder),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ForStmtLeft {
    #[serde(rename = "VariableDeclaration")]
    VarDecl(VariableDeclaration),
    LVal(LVal),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TypeAnnotOrNoop {
    #[serde(rename = "TypeAnnotation")]
    Flow(TypeAnnotation),
    #[serde(rename = "TSTypeAnnotation")]
    TS(TSTypeAnnotation),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TypeParamDeclOrNoop {
    #[serde(rename = "TypeParameterDeclaration")]
    Flow(TypeParameterDeclaration),
    #[serde(rename = "TSTypeParameterDeclaration")]
    TS(TSTypeParameterDeclaration),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Param {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    Pattern(Pattern),
    #[serde(rename = "RestElement")]
    Rest(RestElement),
    #[serde(rename = "TSParameterProperty")]
    TSProp(TSParameterProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ClassImpl {
    #[serde(rename = "TSExpressionWithTypeArguments")]
    TSExpr(TSExpressionWithTypeArguments),
    #[serde(rename = "ClassImplements")]
    Implements(ClassImplements),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SuperTypeParams {
    #[serde(rename = "TypeParameterInstantiation")]
    Flow(TypeParameterInstantiation),
    #[serde(rename = "TSTypeParameterInstantiation")]
    TS(TSTypeParameterInstantiation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum IdOrString {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ExportKind {
    Type,
    Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ImportKind {
    Type,
    Typeof,
    Value,
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
#[serde(tag = "type")]
pub enum IdOrQualifiedId {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "QualifiedTypeIdentifier")]
    QualifiedId(QualifiedTypeIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXElementName {
    #[serde(rename = "JSXIdentifier")]
    Id(JSXIdentifier),
    #[serde(rename = "JSXMemberExpression")]
    Expr(JSXMemberExpression),
    #[serde(rename = "JSXNamespacedName")]
    Name(JSXNamespacedName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXElementChild {
    #[serde(rename = "JSXText")]
    Text(JSXText),
    #[serde(rename = "JSXExpressionContainer")]
    Expr(JSXExpressionContainer),
    #[serde(rename = "JSXSpreadChild")]
    Spread(JSXSpreadChild),
    #[serde(rename = "JSXElement")]
    Element(JSXElement),
    #[serde(rename = "JSXFragment")]
    Fragment(JSXFragment),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSFuncDeclTypeParams {
    #[serde(rename = "TSTypeParameterDeclaration")]
    Type(TSTypeParameterDeclaration),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSFuncDeclTypeAnnot {
    #[serde(rename = "TSTypeAnnotation")]
    Type(TSTypeAnnotation),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum IdOrRest {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "RestElement")]
    Rest(RestElement),
}

// ----------------------------------------------------------------------------
// Babel types
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
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
#[serde(tag = "type")]
pub enum Binary {
    BinaryExpression(BinaryExpression),
    LogicalExpression(LogicalExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
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
#[serde(tag = "type")]
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
#[serde(tag = "type")]
pub enum Block {
    BlockStatement(BlockStatement),
    Program(Program),
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Statement {
    BlockStatement(BlockStatement),
    BreakStatement(BreakStatement),
    ContinueStatement(ContinueStatement),
    DebuggerStatement(DebuggerStatement),
    DoWhileStatement(DoWhileStatement),
    EmptyStatement(EmptyStatement),
    ExpressionStatement(ExpressionStatement),
    ForInStatement(ForInStatement),
    ForStatement(ForStatement),
    FunctionDeclaration(FunctionDeclaration),
    IfStatement(IfStatement),
    LabeledStatement(LabeledStatement),
    ReturnStatement(ReturnStatement),
    SwitchStatement(SwitchStatement),
    ThrowStatement(ThrowStatement),
    TryStatement(TryStatement),
    VariableDeclaration(VariableDeclaration),
    WhileStatement(WhileStatement),
    WithStatement(WithStatement),
    ClassDeclaration(ClassDeclaration),
    ExportAllDeclaration(ExportAllDeclaration),
    ExportDefaultDeclaration(ExportDefaultDeclaration),
    ExportNamedDeclaration(ExportNamedDeclaration),
    ForOfStatement(ForOfStatement),
    ImportDeclaration(ImportDeclaration),
    DeclareClass(DeclareClass),
    DeclareFunction(DeclareFunction),
    DeclareInterface(DeclareInterface),
    DeclareModule(DeclareModule),
    DeclareModuleExports(DeclareModuleExports),
    DeclareTypeAlias(DeclareTypeAlias),
    DeclareOpaqueType(DeclareOpaqueType),
    DeclareVariable(DeclareVariable),
    DeclareExportDeclaration(DeclareExportDeclaration),
    DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    InterfaceDeclaration(InterfaceDeclaration),
    OpaqueType(OpaqueType),
    TypeAlias(TypeAlias),
    EnumDeclaration(EnumDeclaration),
    TSDeclareFunction(TSDeclareFunction),
    TSInterfaceDeclaration(TSInterfaceDeclaration),
    TSTypeAliasDeclaration(TSTypeAliasDeclaration),
    TSEnumDeclaration(TSEnumDeclaration),
    TSModuleDeclaration(TSModuleDeclaration),
    TSImportEqualsDeclaration(TSImportEqualsDeclaration),
    TSExportAssignment(TSExportAssignment),
    TSNamespaceExportDeclaration(TSNamespaceExportDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Terminatorless {
    BreakStatement(BreakStatement),
    ContinueStatement(ContinueStatement),
    ReturnStatement(ReturnStatement),
    ThrowStatement(ThrowStatement),
    YieldExpression(YieldExpression),
    AwaitExpression(AwaitExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum CompletionStatement {
    BreakStatement(BreakStatement),
    ContinueStatement(ContinueStatement),
    ReturnStatement(ReturnStatement),
    ThrowStatement(ThrowStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Conditional {
    ConditionalExpression(ConditionalExpression),
    IfStatement(IfStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Loop {
    DoWhileStatement(DoWhileStatement),
    ForInStatement(ForInStatement),
    ForStatement(ForStatement),
    WhileStatement(WhileStatement),
    ForOfStatement(ForOfStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum While {
    DoWhileStatement(DoWhileStatement),
    WhileStatement(WhileStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ExpressionWrapper {
    ExpressionStatement(ExpressionStatement),
    ParenthesizedExpression(ParenthesizedExpression),
    TypeCastExpression(TypeCastExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum For {
    ForInStatement(ForInStatement),
    ForStatement(ForStatement),
    ForOfStatement(ForOfStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ForXStatement {
    ForInStatement(ForInStatement),
    ForOfStatement(ForOfStatement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Function {
    FunctionDeclaration(FunctionDeclaration),
    FunctionExpression(FunctionExpression),
    ObjectMethod(ObjectMethod),
    ArrowFunctionExpression(ArrowFunctionExpression),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FunctionParent {
    FunctionDeclaration(FunctionDeclaration),
    FunctionExpression(FunctionExpression),
    ObjectMethod(ObjectMethod),
    ArrowFunctionExpression(ArrowFunctionExpression),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Pureish {
    FunctionDeclaration(FunctionDeclaration),
    FunctionExpression(FunctionExpression),
    StringLiteral(StringLiteral),
    NumericLiteral(NumericLiteral),
    NullLiteral(NullLiteral),
    BooleanLiteral(BooleanLiteral),
    RegExpLiteral(RegExpLiteral),
    ArrowFunctionExpression(ArrowFunctionExpression),
    BigIntLiteral(BigIntLiteral),
    DecimalLiteral(DecimalLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Declaration {
    FunctionDeclaration(FunctionDeclaration),
    VariableDeclaration(VariableDeclaration),
    ClassDeclaration(ClassDeclaration),
    ExportAllDeclaration(ExportAllDeclaration),
    ExportDefaultDeclaration(ExportDefaultDeclaration),
    ExportNamedDeclaration(ExportNamedDeclaration),
    ImportDeclaration(ImportDeclaration),
    DeclareClass(DeclareClass),
    DeclareFunction(DeclareFunction),
    DeclareInterface(DeclareInterface),
    DeclareModule(DeclareModule),
    DeclareModuleExports(DeclareModuleExports),
    DeclareTypeAlias(DeclareTypeAlias),
    DeclareOpaqueType(DeclareOpaqueType),
    DeclareVariable(DeclareVariable),
    DeclareExportDeclaration(DeclareExportDeclaration),
    DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    InterfaceDeclaration(InterfaceDeclaration),
    OpaqueType(OpaqueType),
    TypeAlias(TypeAlias),
    EnumDeclaration(EnumDeclaration),
    TSDeclareFunction(TSDeclareFunction),
    TSInterfaceDeclaration(TSInterfaceDeclaration),
    TSTypeAliasDeclaration(TSTypeAliasDeclaration),
    TSEnumDeclaration(TSEnumDeclaration),
    TSModuleDeclaration(TSModuleDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum PatternLike {
    Identifier(Identifier),
    RestElement(RestElement),
    AssignmentPattern(AssignmentPattern),
    ArrayPattern(ArrayPattern),
    ObjectPattern(ObjectPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum LVal {
    Identifier(Identifier),
    MemberExpression(MemberExpression),
    RestElement(RestElement),
    AssignmentPattern(AssignmentPattern),
    ArrayPattern(ArrayPattern),
    ObjectPattern(ObjectPattern),
    TSParameterProperty(TSParameterProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSEntityName {
    Identifier(Identifier),
    TSQualifiedName(TSQualifiedName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Literal {
    StringLiteral(StringLiteral),
    NumericLiteral(NumericLiteral),
    NullLiteral(NullLiteral),
    BooleanLiteral(BooleanLiteral),
    RegExpLiteral(RegExpLiteral),
    TemplateLiteral(TemplateLiteral),
    BigIntLiteral(BigIntLiteral),
    DecimalLiteral(DecimalLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Immutable {
    StringLiteral(StringLiteral),
    NumericLiteral(NumericLiteral),
    NullLiteral(NullLiteral),
    BooleanLiteral(BooleanLiteral),
    BigIntLiteral(BigIntLiteral),
    JSXAttribute(JSXAttribute),
    JSXClosingElement(JSXClosingElement),
    JSXElement(JSXElement),
    JSXExpressionContainer(JSXExpressionContainer),
    JSXSpreadChild(JSXSpreadChild),
    JSXOpeningElement(JSXOpeningElement),
    JSXText(JSXText),
    JSXFragment(JSXFragment),
    JSXOpeningFragment(JSXOpeningFragment),
    JSXClosingFragment(JSXClosingFragment),
    DecimalLiteral(DecimalLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum UserWhitespacable {
    ObjectMethod(ObjectMethod),
    ObjectProperty(ObjectProperty),
    ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    ObjectTypeCallProperty(ObjectTypeCallProperty),
    ObjectTypeIndexer(ObjectTypeIndexer),
    ObjectTypeProperty(ObjectTypeProperty),
    ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Method {
    ObjectMethod(ObjectMethod),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ObjectMember {
    ObjectMethod(ObjectMethod),
    ObjectProperty(ObjectProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Property {
    ObjectProperty(ObjectProperty),
    ClassProperty(ClassProperty),
    ClassPrivateProperty(ClassPrivateProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum UnaryLike {
    UnaryExpression(UnaryExpression),
    SpreadElement(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Pattern {
    AssignmentPattern(AssignmentPattern),
    ArrayPattern(ArrayPattern),
    ObjectPattern(ObjectPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Class {
    ClassExpression(ClassExpression),
    ClassDeclaration(ClassDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ModuleDeclaration {
    ExportAllDeclaration(ExportAllDeclaration),
    ExportDefaultDeclaration(ExportDefaultDeclaration),
    ExportNamedDeclaration(ExportNamedDeclaration),
    ImportDeclaration(ImportDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ExportDeclaration {
    ExportAllDeclaration(ExportAllDeclaration),
    ExportDefaultDeclaration(ExportDefaultDeclaration),
    ExportNamedDeclaration(ExportNamedDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ModuleSpecifier {
    ExportSpecifier(ExportSpecifier),
    ImportDefaultSpecifier(ImportDefaultSpecifier),
    ImportNamespaceSpecifier(ImportNamespaceSpecifier),
    ImportSpecifier(ImportSpecifier),
    ExportNamespaceSpecifier(ExportNamespaceSpecifier),
    ExportDefaultSpecifier(ExportDefaultSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Flow {
    AnyTypeAnnotation(AnyTypeAnnotation),
    ArrayTypeAnnotation(ArrayTypeAnnotation),
    BooleanTypeAnnotation(BooleanTypeAnnotation),
    BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
    NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    ClassImplements(ClassImplements),
    DeclareClass(DeclareClass),
    DeclareFunction(DeclareFunction),
    DeclareInterface(DeclareInterface),
    DeclareModule(DeclareModule),
    DeclareModuleExports(DeclareModuleExports),
    DeclareTypeAlias(DeclareTypeAlias),
    DeclareOpaqueType(DeclareOpaqueType),
    DeclareVariable(DeclareVariable),
    DeclareExportDeclaration(DeclareExportDeclaration),
    DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    DeclaredPredicate(DeclaredPredicate),
    ExistsTypeAnnotation(ExistsTypeAnnotation),
    FunctionTypeAnnotation(FunctionTypeAnnotation),
    FunctionTypeParam(FunctionTypeParam),
    GenericTypeAnnotation(GenericTypeAnnotation),
    InferredPredicate(InferredPredicate),
    InterfaceExtends(InterfaceExtends),
    InterfaceDeclaration(InterfaceDeclaration),
    InterfaceTypeAnnotation(InterfaceTypeAnnotation),
    IntersectionTypeAnnotation(IntersectionTypeAnnotation),
    MixedTypeAnnotation(MixedTypeAnnotation),
    EmptyTypeAnnotation(EmptyTypeAnnotation),
    NullableTypeAnnotation(NullableTypeAnnotation),
    NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
    NumberTypeAnnotation(NumberTypeAnnotation),
    ObjectTypeAnnotation(ObjectTypeAnnotation),
    ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    ObjectTypeCallProperty(ObjectTypeCallProperty),
    ObjectTypeIndexer(ObjectTypeIndexer),
    ObjectTypeProperty(ObjectTypeProperty),
    ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
    OpaqueType(OpaqueType),
    QualifiedTypeIdentifier(QualifiedTypeIdentifier),
    StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
    StringTypeAnnotation(StringTypeAnnotation),
    SymbolTypeAnnotation(SymbolTypeAnnotation),
    ThisTypeAnnotation(ThisTypeAnnotation),
    TupleTypeAnnotation(TupleTypeAnnotation),
    TypeofTypeAnnotation(TypeofTypeAnnotation),
    TypeAlias(TypeAlias),
    TypeAnnotation(TypeAnnotation),
    TypeCastExpression(TypeCastExpression),
    TypeParameter(TypeParameter),
    TypeParameterDeclaration(TypeParameterDeclaration),
    TypeParameterInstantiation(TypeParameterInstantiation),
    UnionTypeAnnotation(UnionTypeAnnotation),
    Variance(Variance),
    VoidTypeAnnotation(VoidTypeAnnotation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FlowType {
    AnyTypeAnnotation(AnyTypeAnnotation),
    ArrayTypeAnnotation(ArrayTypeAnnotation),
    BooleanTypeAnnotation(BooleanTypeAnnotation),
    BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
    NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    ExistsTypeAnnotation(ExistsTypeAnnotation),
    FunctionTypeAnnotation(FunctionTypeAnnotation),
    GenericTypeAnnotation(GenericTypeAnnotation),
    InterfaceTypeAnnotation(InterfaceTypeAnnotation),
    IntersectionTypeAnnotation(IntersectionTypeAnnotation),
    MixedTypeAnnotation(MixedTypeAnnotation),
    EmptyTypeAnnotation(EmptyTypeAnnotation),
    NullableTypeAnnotation(NullableTypeAnnotation),
    NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
    NumberTypeAnnotation(NumberTypeAnnotation),
    ObjectTypeAnnotation(ObjectTypeAnnotation),
    StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
    StringTypeAnnotation(StringTypeAnnotation),
    SymbolTypeAnnotation(SymbolTypeAnnotation),
    ThisTypeAnnotation(ThisTypeAnnotation),
    TupleTypeAnnotation(TupleTypeAnnotation),
    TypeofTypeAnnotation(TypeofTypeAnnotation),
    UnionTypeAnnotation(UnionTypeAnnotation),
    VoidTypeAnnotation(VoidTypeAnnotation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FlowBaseAnnotation {
    AnyTypeAnnotation(AnyTypeAnnotation),
    BooleanTypeAnnotation(BooleanTypeAnnotation),
    NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    MixedTypeAnnotation(MixedTypeAnnotation),
    EmptyTypeAnnotation(EmptyTypeAnnotation),
    NumberTypeAnnotation(NumberTypeAnnotation),
    StringTypeAnnotation(StringTypeAnnotation),
    SymbolTypeAnnotation(SymbolTypeAnnotation),
    ThisTypeAnnotation(ThisTypeAnnotation),
    VoidTypeAnnotation(VoidTypeAnnotation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FlowDeclaration {
    DeclareClass(DeclareClass),
    DeclareFunction(DeclareFunction),
    DeclareInterface(DeclareInterface),
    DeclareModule(DeclareModule),
    DeclareModuleExports(DeclareModuleExports),
    DeclareTypeAlias(DeclareTypeAlias),
    DeclareOpaqueType(DeclareOpaqueType),
    DeclareVariable(DeclareVariable),
    DeclareExportDeclaration(DeclareExportDeclaration),
    DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    InterfaceDeclaration(InterfaceDeclaration),
    OpaqueType(OpaqueType),
    TypeAlias(TypeAlias),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FlowPredicate {
    DeclaredPredicate(DeclaredPredicate),
    InferredPredicate(InferredPredicate),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum EnumBody {
    EnumBooleanBody(EnumBooleanBody),
    EnumNumberBody(EnumNumberBody),
    EnumStringBody(EnumStringBody),
    EnumSymbolBody(EnumSymbolBody),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum EnumMember {
    EnumBooleanMember(EnumBooleanMember),
    EnumNumberMember(EnumNumberMember),
    EnumStringMember(EnumStringMember),
    EnumDefaultedMember(EnumDefaultedMember),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSX {
    JSXAttribute(JSXAttribute),
    JSXClosingElement(JSXClosingElement),
    JSXElement(JSXElement),
    JSXEmptyExpression(JSXEmptyExpression),
    JSXExpressionContainer(JSXExpressionContainer),
    JSXSpreadChild(JSXSpreadChild),
    JSXIdentifier(JSXIdentifier),
    JSXMemberExpression(JSXMemberExpression),
    JSXNamespacedName(JSXNamespacedName),
    JSXOpeningElement(JSXOpeningElement),
    JSXSpreadAttribute(JSXSpreadAttribute),
    JSXText(JSXText),
    JSXFragment(JSXFragment),
    JSXOpeningFragment(JSXOpeningFragment),
    JSXClosingFragment(JSXClosingFragment),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Private {
    ClassPrivateProperty(ClassPrivateProperty),
    ClassPrivateMethod(ClassPrivateMethod),
    PrivateName(PrivateName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSTypeElement {
    TSCallSignatureDeclaration(TSCallSignatureDeclaration),
    TSConstructSignatureDeclaration(TSConstructSignatureDeclaration),
    TSPropertySignature(TSPropertySignature),
    TSMethodSignature(TSMethodSignature),
    TSIndexSignature(TSIndexSignature),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSType {
    TSAnyKeyword(TSAnyKeyword),
    TSBooleanKeyword(TSBooleanKeyword),
    TSBigIntKeyword(TSBigIntKeyword),
    TSIntrinsicKeyword(TSIntrinsicKeyword),
    TSNeverKeyword(TSNeverKeyword),
    TSNullKeyword(TSNullKeyword),
    TSNumberKeyword(TSNumberKeyword),
    TSObjectKeyword(TSObjectKeyword),
    TSStringKeyword(TSStringKeyword),
    TSSymbolKeyword(TSSymbolKeyword),
    TSUndefinedKeyword(TSUndefinedKeyword),
    TSUnknownKeyword(TSUnknownKeyword),
    TSVoidKeyword(TSVoidKeyword),
    TSThisType(TSThisType),
    TSFunctionType(TSFunctionType),
    TSConstructorType(TSConstructorType),
    TSTypeReference(TSTypeReference),
    TSTypePredicate(TSTypePredicate),
    TSTypeQuery(TSTypeQuery),
    TSTypeLiteral(TSTypeLiteral),
    TSArrayType(TSArrayType),
    TSTupleType(TSTupleType),
    TSOptionalType(TSOptionalType),
    TSRestType(TSRestType),
    TSUnionType(TSUnionType),
    TSIntersectionType(TSIntersectionType),
    TSConditionalType(TSConditionalType),
    TSInferType(TSInferType),
    TSParenthesizedType(TSParenthesizedType),
    TSTypeOperator(TSTypeOperator),
    TSIndexedAccessType(TSIndexedAccessType),
    TSMappedType(TSMappedType),
    TSLiteralType(TSLiteralType),
    TSExpressionWithTypeArguments(TSExpressionWithTypeArguments),
    TSImportType(TSImportType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TSBaseType {
    TSAnyKeyword(TSAnyKeyword),
    TSBooleanKeyword(TSBooleanKeyword),
    TSBigIntKeyword(TSBigIntKeyword),
    TSIntrinsicKeyword(TSIntrinsicKeyword),
    TSNeverKeyword(TSNeverKeyword),
    TSNullKeyword(TSNullKeyword),
    TSNumberKeyword(TSNumberKeyword),
    TSObjectKeyword(TSObjectKeyword),
    TSStringKeyword(TSStringKeyword),
    TSSymbolKeyword(TSSymbolKeyword),
    TSUndefinedKeyword(TSUndefinedKeyword),
    TSUnknownKeyword(TSUnknownKeyword),
    TSVoidKeyword(TSVoidKeyword),
    TSThisType(TSThisType),
    TSLiteralType(TSLiteralType),
}

