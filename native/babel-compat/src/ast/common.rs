use crate::ser_union::SerializeUnion;
use ahash::RandomState;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

use crate::ast::{
    class::*, comment::Comment, decl::*, expr::*, flow::*, jsx::*, lit::*, module::*, object::*,
    pat::*, stmt::*, typescript::*,
};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct LineCol {
    pub line: usize,
    pub column: usize,
}

impl LineCol {
    pub(crate) fn dummy() -> Self {
        LineCol { line: 0, column: 0 }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Loc {
    pub start: LineCol,
    pub end: LineCol,
}

impl Loc {
    pub(crate) fn dummy() -> Self {
        Loc {
            start: LineCol::dummy(),
            end: LineCol::dummy(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
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

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Binary {
    #[serde(rename = "BinaryExpression")]
    BinaryExpr(BinaryExpression),
    #[serde(rename = "LogicalExpression")]
    LogicalExpr(LogicalExpression),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Conditional {
    #[serde(rename = "ConditionalExpression")]
    Expr(ConditionalExpression),
    #[serde(rename = "LogicalExpression")]
    If(IfStatement),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum EnumBody {
    #[serde(rename = "EnumBooleanBody")]
    Boolean(EnumBooleanBody),
    #[serde(rename = "EnumNumberBody")]
    Number(EnumNumberBody),
    #[serde(rename = "EnumStringBody")]
    String(EnumStringBody),
    #[serde(rename = "EnumSymbolBody")]
    Symbol(EnumSymbolBody),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum EnumMember {
    #[serde(rename = "EnumBooleanMember")]
    Boolean(EnumBooleanMember),
    #[serde(rename = "EnumNumberMember")]
    Number(EnumNumberMember),
    #[serde(rename = "EnumStringMember")]
    String(EnumStringMember),
    #[serde(rename = "EnumDefaultedMember")]
    Defaulted(EnumDefaultedMember),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Function {
    #[serde(rename = "FunctionDeclaration")]
    Decl(FunctionDeclaration),
    #[serde(rename = "FunctionExpression")]
    Expr(FunctionExpression),
    ObjectMethod(ObjectMethod),
    #[serde(rename = "ArrowFunctionExpression")]
    Arrow(ArrowFunctionExpression),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum FunctionParent {
    #[serde(rename = "FunctionDeclaration")]
    Decl(FunctionDeclaration),
    #[serde(rename = "FunctionExpression")]
    Expr(FunctionExpression),
    ObjectMethod(ObjectMethod),
    #[serde(rename = "ArrowFunctionExpression")]
    Arrow(ArrowFunctionExpression),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
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

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Method {
    #[serde(rename = "ObjectMethod")]
    Object(ObjectMethod),
    #[serde(rename = "ClassMethod")]
    Class(ClassMethod),
    #[serde(rename = "ClassPrivateMethod")]
    ClassPrivate(ClassPrivateMethod),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Private {
    #[serde(rename = "ClassPrivateProperty")]
    ClassProp(ClassPrivateProperty),
    #[serde(rename = "ClassPrivateMethod")]
    ClassMethod(ClassPrivateMethod),
    #[serde(rename = "PrivateName")]
    Name(PrivateName),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Property {
    #[serde(rename = "ObjectProperty")]
    ObjectProp(ObjectProperty),
    #[serde(rename = "ClassProperty")]
    ClassProp(ClassProperty),
    #[serde(rename = "ClassPrivateProperty")]
    ClassPrivateProp(ClassPrivateProperty),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Pureish {
    #[serde(rename = "FunctionDeclaration")]
    FunctionDecl(FunctionDeclaration),
    #[serde(rename = "FunctionExpression")]
    FunctionExpr(FunctionExpression),
    StringLiteral(StringLiteral),
    NumericLiteral(NumericLiteral),
    NullLiteral(NullLiteral),
    BooleanLiteral(BooleanLiteral),
    RegExpLiteral(RegExpLiteral),
    #[serde(rename = "ArrowFunctionExpression")]
    ArrowFuncExpr(ArrowFunctionExpression),
    BigIntLiteral(BigIntLiteral),
    DecimalLiteral(DecimalLiteral),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Scopable {
    #[serde(rename = "BlockStatement")]
    BlockStmt(BlockStatement),
    CatchClause(CatchClause),
    #[serde(rename = "DoWhileStatement")]
    DoWhileStmt(DoWhileStatement),
    #[serde(rename = "ForInStatement")]
    ForInStmt(ForInStatement),
    #[serde(rename = "ForStatement")]
    ForStmt(ForStatement),
    #[serde(rename = "FunctionDeclaration")]
    FuncDecl(FunctionDeclaration),
    #[serde(rename = "FunctionExpression")]
    FuncExpr(FunctionExpression),
    Program(Program),
    ObjectMethod(ObjectMethod),
    #[serde(rename = "SwitchStatement")]
    SwitchStmt(SwitchStatement),
    #[serde(rename = "WhileStatement")]
    WhileStmt(WhileStatement),
    #[serde(rename = "ArrowFunctionExpression")]
    ArrowFuncExpr(ArrowFunctionExpression),
    #[serde(rename = "ClassExpression")]
    ClassExpr(ClassExpression),
    #[serde(rename = "ClassDeclaration")]
    ClassDecl(ClassDeclaration),
    #[serde(rename = "ForOfStatement")]
    ForOfStmt(ForOfStatement),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
    StaticBlock(StaticBlock),
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum BlockParent {
    #[serde(rename = "BlockStatement")]
    BlockStmt(BlockStatement),
    CatchClause(CatchClause),
    #[serde(rename = "DoWhileStatement")]
    DoWhileStmt(DoWhileStatement),
    #[serde(rename = "ForInStatement")]
    ForInStmt(ForInStatement),
    #[serde(rename = "ForStatement")]
    ForStmt(ForStatement),
    #[serde(rename = "FunctionDeclaration")]
    FuncDecl(FunctionDeclaration),
    #[serde(rename = "FunctionExpression")]
    FuncExpr(FunctionExpression),
    Program(Program),
    ObjectMethod(ObjectMethod),
    #[serde(rename = "SwitchStatement")]
    SwitchStmt(SwitchStatement),
    #[serde(rename = "WhileStatement")]
    WhileStmt(WhileStatement),
    #[serde(rename = "ArrowFunctionExpression")]
    ArrowFuncExpr(ArrowFunctionExpression),
    #[serde(rename = "ForOfStatement")]
    ForOfStmt(ForOfStatement),
    ClassMethod(ClassMethod),
    ClassPrivateMethod(ClassPrivateMethod),
    StaticBlock(StaticBlock),
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Block {
    #[serde(rename = "BlockStatement")]
    BlockStmt(BlockStatement),
    Program(Program),
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Terminatorless {
    #[serde(rename = "BreakStatement")]
    Break(BreakStatement),
    #[serde(rename = "ContinueStatement")]
    Continue(ContinueStatement),
    #[serde(rename = "ReturnStatement")]
    Return(ReturnStatement),
    #[serde(rename = "ThrowStatement")]
    Throw(ThrowStatement),
    #[serde(rename = "YieldExpression")]
    Yield(YieldExpression),
    #[serde(rename = "AwaitExpression")]
    Await(AwaitExpression),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum UnaryLike {
    #[serde(rename = "UnaryExpression")]
    Expr(UnaryExpression),
    #[serde(rename = "SpreadElement")]
    Spread(SpreadElement),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct SpreadElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

/// Deprecated. Use SpreadElement instead.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct SpreadProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct QualifiedTypeIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub qualification: Box<IdOrQualifiedId>,
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum IdOrQualifiedId {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "QualifiedTypeIdentifier")]
    QualifiedId(QualifiedTypeIdentifier),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum IdOrString {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum IdOrRest {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "RestElement")]
    Rest(RestElement),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct Decorator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct Noop {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Param {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "Pattern")]
    Pat(Pattern),
    #[serde(rename = "RestElement")]
    Rest(RestElement),
    #[serde(rename = "TSParameterProperty")]
    TSProp(TSParameterProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ArgumentPlaceholder {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
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

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum LVal {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "MemberExpression")]
    MemberExpr(MemberExpression),
    #[serde(rename = "RestElement")]
    RestEl(RestElement),
    #[serde(rename = "AssignmentPattern")]
    AssignmentPat(AssignmentPattern),
    #[serde(rename = "ArrayPattern")]
    ArrayPat(ArrayPattern),
    #[serde(rename = "ObjectPattern")]
    ObjectPat(ObjectPattern),
    #[serde(rename = "TSParameterProperty")]
    TSParamProp(TSParameterProperty),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum PatternLike {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "RestElement")]
    RestEl(RestElement),
    #[serde(rename = "AssignmentPattern")]
    AssignmentPat(AssignmentPattern),
    #[serde(rename = "ArrayPattern")]
    ArrayPat(ArrayPattern),
    #[serde(rename = "ObjectPattern")]
    ObjectPat(ObjectPattern),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum TypeAnnotOrNoop {
    #[serde(rename = "TypeAnnotation")]
    Flow(TypeAnnotation),
    #[serde(rename = "TSTypeAnnotation")]
    TS(TSTypeAnnotation),
    Noop(Noop),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum TypeParamDeclOrNoop {
    #[serde(rename = "TypeParameterDeclaration")]
    Flow(TypeParameterDeclaration),
    #[serde(rename = "TSTypeParameterDeclaration")]
    TS(TSTypeParameterDeclaration),
    Noop(Noop),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum SuperTypeParams {
    #[serde(rename = "TypeParameterInstantiation")]
    Flow(TypeParameterInstantiation),
    #[serde(rename = "TSTypeParameterInstantiation")]
    TS(TSTypeParameterInstantiation),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct PrivateName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Access {
    Public,
    Private,
    Protected,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct V8IntrinsicIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: String,
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Callee {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "V8IntrinsicIdentifier")]
    V8Id(V8IntrinsicIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct MetaProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub meta: Identifier,
    pub property: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct Directive {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: DirectiveLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct DirectiveLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct PipelineBareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct PipelineTopicExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct Placeholder {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expected_node: PlaceholderExpectedNode,
    pub name: Identifier,
}

