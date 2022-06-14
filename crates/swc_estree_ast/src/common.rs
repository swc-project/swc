use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::ast_serde;

use crate::{
    class::*, comment::Comment, decl::*, expr::*, flow::*, jsx::*, lit::*, module::*, object::*,
    pat::*, stmt::*, typescript::*,
};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct LineCol {
    pub line: usize,
    pub column: usize,
}

impl LineCol {
    pub fn dummy() -> Self {
        LineCol { line: 0, column: 0 }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Loc {
    pub start: LineCol,
    pub end: LineCol,
}

impl Loc {
    pub fn dummy() -> Self {
        Loc {
            start: LineCol::dummy(),
            end: LineCol::dummy(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct BaseNode {
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub leading_comments: Vec<Comment>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub inner_comments: Vec<Comment>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub trailing_comments: Vec<Comment>,

    #[serde(default)]
    pub start: Option<u32>,
    #[serde(default)]
    pub end: Option<u32>,

    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_range")]
    pub range: Option<[u32; 2]>,

    #[serde(default)]
    pub loc: Option<Loc>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Binary {
    #[tag("BinaryExpression")]
    BinaryExpr(BinaryExpression),
    #[tag("LogicalExpression")]
    LogicalExpr(LogicalExpression),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Conditional {
    #[tag("ConditionalExpression")]
    Expr(ConditionalExpression),
    #[tag("IfStatement")]
    If(IfStatement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Function {
    #[tag("FunctionDeclaration")]
    Decl(FunctionDeclaration),
    #[tag("FunctionExpression")]
    Expr(FunctionExpression),
    #[tag("ObjectMethod")]
    ObjectMethod(ObjectMethod),
    #[tag("ArrowFunctionExpression")]
    Arrow(ArrowFunctionExpression),
    #[tag("ClassMethod")]
    ClassMethod(ClassMethod),
    #[tag("ClassPrivateMethod")]
    ClassPrivateMethod(ClassPrivateMethod),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum FunctionParent {
    #[tag("FunctionDeclaration")]
    Decl(FunctionDeclaration),
    #[tag("FunctionExpression")]
    Expr(FunctionExpression),
    #[tag("ObjectMethod")]
    ObjectMethod(ObjectMethod),
    #[tag("ArrowFunctionExpression")]
    Arrow(ArrowFunctionExpression),
    #[tag("ClassMethod")]
    ClassMethod(ClassMethod),
    #[tag("ClassPrivateMethod")]
    ClassPrivateMethod(ClassPrivateMethod),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Immutable {
    #[tag("StringLiteral")]
    #[tag("DecimalLiteral")]
    #[tag("NumericLiteral")]
    #[tag("NullLiteral")]
    #[tag("BooleanLiteral")]
    #[tag("BigIntLiteral")]
    Literal(Literal),
    #[tag("JSXAttribute")]
    JSXAttribute(JSXAttribute),
    #[tag("JSXClosingElement")]
    JSXClosingElement(JSXClosingElement),
    #[tag("JSXElement")]
    JSXElement(JSXElement),
    #[tag("JSXExpressionContainer")]
    JSXExpressionContainer(JSXExpressionContainer),
    #[tag("JSXSpreadChild")]
    JSXSpreadChild(JSXSpreadChild),
    #[tag("JSXOpeningElement")]
    JSXOpeningElement(JSXOpeningElement),
    #[tag("JSXText")]
    JSXText(JSXText),
    #[tag("JSXFragment")]
    JSXFragment(JSXFragment),
    #[tag("JSXOpeningFragment")]
    JSXOpeningFragment(JSXOpeningFragment),
    #[tag("JSXClosingFragment")]
    JSXClosingFragment(JSXClosingFragment),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Method {
    #[tag("ObjectMethod")]
    Object(ObjectMethod),
    #[tag("ClassMethod")]
    Class(ClassMethod),
    #[tag("ClassPrivateMethod")]
    ClassPrivate(ClassPrivateMethod),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Private {
    #[tag("ClassPrivateProperty")]
    ClassProp(ClassPrivateProperty),
    #[tag("ClassPrivateMethod")]
    ClassMethod(ClassPrivateMethod),
    #[tag("PrivateName")]
    Name(PrivateName),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Property {
    #[tag("ObjectProperty")]
    ObjectProp(ObjectProperty),
    #[tag("ClassProperty")]
    ClassProp(ClassProperty),
    #[tag("ClassPrivateProperty")]
    ClassPrivateProp(ClassPrivateProperty),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Pureish {
    #[tag("FunctionDeclaration")]
    FunctionDecl(FunctionDeclaration),
    #[tag("FunctionExpression")]
    FunctionExpr(FunctionExpression),
    #[tag("StringLiteral")]
    #[tag("NumericLiteral")]
    #[tag("NullLiteral")]
    #[tag("BooleanLiteral")]
    #[tag("RegExpLiteral")]
    #[tag("BigIntLiteral")]
    #[tag("DecimalLiteral")]
    Literal(Literal),
    #[tag("ArrowFunctionExpression")]
    ArrowFuncExpr(ArrowFunctionExpression),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Scopable {
    #[tag("BlockStatement")]
    BlockStmt(BlockStatement),
    #[tag("CatchClause")]
    CatchClause(CatchClause),
    #[tag("DoWhileStatement")]
    DoWhileStmt(DoWhileStatement),
    #[tag("ForInStatement")]
    ForInStmt(ForInStatement),
    #[tag("ForStatement")]
    ForStmt(ForStatement),
    #[tag("FunctionDeclaration")]
    FuncDecl(FunctionDeclaration),
    #[tag("FunctionExpression")]
    FuncExpr(FunctionExpression),
    #[tag("Program")]
    Program(Program),
    #[tag("ObjectMethod")]
    ObjectMethod(ObjectMethod),
    #[tag("SwitchStatement")]
    SwitchStmt(SwitchStatement),
    #[tag("WhileStatement")]
    WhileStmt(WhileStatement),
    #[tag("ArrowFunctionExpression")]
    ArrowFuncExpr(ArrowFunctionExpression),
    #[tag("ClassExpression")]
    ClassExpr(ClassExpression),
    #[tag("ClassDeclaration")]
    ClassDecl(ClassDeclaration),
    #[tag("ForOfStatement")]
    ForOfStmt(ForOfStatement),
    #[tag("ClassMethod")]
    ClassMethod(ClassMethod),
    #[tag("ClassPrivateMethod")]
    ClassPrivateMethod(ClassPrivateMethod),
    #[tag("StaticBlock")]
    StaticBlock(StaticBlock),
    #[tag("TSModuleBlock")]
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum BlockParent {
    #[tag("BlockStatement")]
    BlockStmt(BlockStatement),
    #[tag("CatchClause")]
    CatchClause(CatchClause),
    #[tag("DoWhileStatement")]
    DoWhileStmt(DoWhileStatement),
    #[tag("ForInStatement")]
    ForInStmt(ForInStatement),
    #[tag("ForStatement")]
    ForStmt(ForStatement),
    #[tag("FunctionDeclaration")]
    FuncDecl(FunctionDeclaration),
    #[tag("FunctionExpression")]
    FuncExpr(FunctionExpression),
    #[tag("Program")]
    Program(Program),
    #[tag("ObjectMethod")]
    ObjectMethod(ObjectMethod),
    #[tag("SwitchStatement")]
    SwitchStmt(SwitchStatement),
    #[tag("WhileStatement")]
    WhileStmt(WhileStatement),
    #[tag("ArrowFunctionExpression")]
    ArrowFuncExpr(ArrowFunctionExpression),
    #[tag("ForOfStatement")]
    ForOfStmt(ForOfStatement),
    #[tag("ClassMethod")]
    ClassMethod(ClassMethod),
    #[tag("ClassPrivateMethod")]
    ClassPrivateMethod(ClassPrivateMethod),
    #[tag("StaticBlock")]
    StaticBlock(StaticBlock),
    #[tag("TSModuleBlock")]
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Block {
    #[tag("BlockStatement")]
    BlockStmt(BlockStatement),
    #[tag("Program")]
    Program(Program),
    #[tag("TSModuleBlock")]
    TSModuleBlock(TSModuleBlock),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Terminatorless {
    #[tag("BreakStatement")]
    Break(BreakStatement),
    #[tag("ContinueStatement")]
    Continue(ContinueStatement),
    #[tag("ReturnStatement")]
    Return(ReturnStatement),
    #[tag("ThrowStatement")]
    Throw(ThrowStatement),
    #[tag("YieldExpression")]
    Yield(YieldExpression),
    #[tag("AwaitExpression")]
    Await(AwaitExpression),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum UnaryLike {
    #[tag("UnaryExpression")]
    Expr(UnaryExpression),
    #[tag("SpreadElement")]
    Spread(SpreadElement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("SpreadElement")]
pub struct SpreadElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<Expression>,
}

/// Deprecated. Use SpreadElement instead.
#[derive(Debug, Clone, PartialEq)]
#[ast_serde("SpreadProperty")]
pub struct SpreadProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("RestElement")]
pub struct RestElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<LVal>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}

/// Deprecated. Use RestElement element.
#[derive(Debug, Clone, PartialEq)]
#[ast_serde("RestProperty")]
pub struct RestProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: LVal,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("Identifier")]
pub struct Identifier {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: JsWord,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(
        default,
        skip_serializing_if = "crate::flavor::Flavor::skip_none_and_false"
    )]
    pub optional: Option<bool>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum IdOrQualifiedId {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("QualifiedTypeIdentifier")]
    QualifiedId(QualifiedTypeIdentifier),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum IdOrString {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("StringLiteral")]
    String(StringLiteral),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum IdOrRest {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("RestElement")]
    Rest(RestElement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("Decorator")]
pub struct Decorator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("Noop")]
pub struct Noop {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Param {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("AssignmentPattern")]
    #[tag("ArrayPattern")]
    #[tag("ObjectPattern")]
    Pat(Pattern),
    #[tag("RestElement")]
    Rest(RestElement),
    #[tag("TSParameterProperty")]
    TSProp(TSParameterProperty),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum LVal {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("MemberExpression")]
    MemberExpr(MemberExpression),
    #[tag("RestElement")]
    RestEl(RestElement),
    #[tag("AssignmentPattern")]
    AssignmentPat(AssignmentPattern),
    #[tag("ArrayPattern")]
    ArrayPat(ArrayPattern),
    #[tag("ObjectPattern")]
    ObjectPat(ObjectPattern),
    #[tag("TSParameterProperty")]
    TSParamProp(TSParameterProperty),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum PatternLike {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("RestElement")]
    RestEl(RestElement),
    #[tag("AssignmentPattern")]
    AssignmentPat(AssignmentPattern),
    #[tag("ArrayPattern")]
    ArrayPat(ArrayPattern),
    #[tag("ObjectPattern")]
    ObjectPat(ObjectPattern),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TypeAnnotOrNoop {
    #[tag("TypeAnnotation")]
    Flow(TypeAnnotation),
    #[tag("TSTypeAnnotation")]
    TS(Box<TSTypeAnnotation>),
    #[tag("Noop")]
    Noop(Noop),
}

impl From<TSTypeAnnotation> for TypeAnnotOrNoop {
    fn from(annot: TSTypeAnnotation) -> Self {
        TypeAnnotOrNoop::TS(Box::new(annot))
    }
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TypeParamDeclOrNoop {
    #[tag("TypeParameterDeclaration")]
    Flow(TypeParameterDeclaration),
    #[tag("TSTypeParameterDeclaration")]
    TS(TSTypeParameterDeclaration),
    #[tag("Noop")]
    Noop(Noop),
}

impl From<TSTypeParameterDeclaration> for TypeParamDeclOrNoop {
    fn from(decl: TSTypeParameterDeclaration) -> Self {
        TypeParamDeclOrNoop::TS(decl)
    }
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum SuperTypeParams {
    #[tag("TypeParameterInstantiation")]
    Flow(TypeParameterInstantiation),
    #[tag("TSTypeParameterInstantiation")]
    TS(TSTypeParameterInstantiation),
}

impl From<TSTypeParameterInstantiation> for SuperTypeParams {
    fn from(param: TSTypeParameterInstantiation) -> Self {
        SuperTypeParams::TS(param)
    }
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("PrivateName")]
pub struct PrivateName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Access {
    Public,
    Private,
    Protected,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("MetaProperty")]
pub struct MetaProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub meta: Identifier,
    pub property: Identifier,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("Directive")]
pub struct Directive {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: DirectiveLiteral,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("DirectiveLiteral")]
pub struct DirectiveLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: JsWord,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("PipelineBareFunction")]
pub struct PipelineBareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("PipelineTopicExpression")]
pub struct PipelineTopicExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
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

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("Placeholder")]
pub struct Placeholder {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expected_node: PlaceholderExpectedNode,
    pub name: Identifier,
}

// NOTE(dwoznicki): Node is part of the babel node definitions, but it's never
// used and a pain to maintain. Do we actually need this?
//
// #[derive(Debug, Clone, PartialEq)]
// #[ast_serde]
// pub enum Node {
//     #[tag("AnyTypeAnnotation")]
//     AnyTypeAnnotation(AnyTypeAnnotation),
//     #[tag("ArgumentPlaceholder")]
//     ArgumentPlaceholder(ArgumentPlaceholder),
//     #[tag("ArrayExpression")]
//     ArrayExpression(ArrayExpression),
//     #[tag("ArrayPattern")]
//     ArrayPattern(ArrayPattern),
//     #[tag("ArrayTypeAnnotation")]
//     ArrayTypeAnnotation(ArrayTypeAnnotation),
//     #[tag("ArrowFunctionExpression")]
//     ArrowFunctionExpression(ArrowFunctionExpression),
//     #[tag("AssignmentExpression")]
//     AssignmentExpression(AssignmentExpression),
//     #[tag("AssignmentPattern")]
//     AssignmentPattern(AssignmentPattern),
//     #[tag("AwaitExpression")]
//     AwaitExpression(AwaitExpression),
//     #[tag("BigIntLiteral")]
//     BigIntLiteral(BigIntLiteral),
//     #[tag("BinaryExpression")]
//     #[tag("LogicalExpression")]
//     Binary(Binary),
//     #[tag("BinaryExpression")]
//     BinaryExpression(BinaryExpression),
//     #[tag("BindExpression")]
//     BindExpression(BindExpression),
//     #[tag("BlockStatement")]
//     #[tag("Program")]
//     #[tag("TSModuleBlock")]
//     Block(Block),
//     #[tag("*")]
//     BlockParent(BlockParent),
//     #[tag("BlockStatement")]
//     BlockStatement(BlockStatement),
//     BooleanLiteral(BooleanLiteral),
//     BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
//     BooleanTypeAnnotation(BooleanTypeAnnotation),
//     BreakStatement(BreakStatement),
//     CallExpression(CallExpression),
//     CatchClause(CatchClause),
//     Class(Class),
//     ClassBody(ClassBody),
//     ClassDeclaration(ClassDeclaration),
//     ClassExpression(ClassExpression),
//     ClassImplements(ClassImplements),
//     ClassMethod(ClassMethod),
//     ClassPrivateMethod(ClassPrivateMethod),
//     ClassPrivateProperty(ClassPrivateProperty),
//     ClassProperty(ClassProperty),
//     CompletionStatement(CompletionStatement),
//     Conditional(Conditional),
//     ConditionalExpression(ConditionalExpression),
//     ContinueStatement(ContinueStatement),
//     DebuggerStatement(DebuggerStatement),
//     DecimalLiteral(DecimalLiteral),
//     Declaration(Declaration),
//     DeclareClass(DeclareClass),
//     DeclareExportAllDeclaration(DeclareExportAllDeclaration),
//     DeclareExportDeclaration(DeclareExportDeclaration),
//     DeclareFunction(DeclareFunction),
//     DeclareInterface(DeclareInterface),
//     DeclareModule(DeclareModule),
//     DeclareModuleExports(DeclareModuleExports),
//     DeclareOpaqueType(DeclareOpaqueType),
//     DeclareTypeAlias(DeclareTypeAlias),
//     DeclareVariable(DeclareVariable),
//     DeclaredPredicate(DeclaredPredicate),
//     Decorator(Decorator),
//     Directive(Directive),
//     DirectiveLiteral(DirectiveLiteral),
//     DoExpression(DoExpression),
//     DoWhileStatement(DoWhileStatement),
//     EmptyStatement(EmptyStatement),
//     EmptyTypeAnnotation(EmptyTypeAnnotation),
//     EnumBody(EnumBody),
//     EnumBooleanBody(EnumBooleanBody),
//     EnumBooleanMember(EnumBooleanMember),
//     EnumDeclaration(EnumDeclaration),
//     EnumDefaultedMember(EnumDefaultedMember),
//     EnumMember(EnumMember),
//     EnumNumberBody(EnumNumberBody),
//     EnumNumberMember(EnumNumberMember),
//     EnumStringBody(EnumStringBody),
//     EnumStringMember(EnumStringMember),
//     EnumSymbolBody(EnumSymbolBody),
//     ExistsTypeAnnotation(ExistsTypeAnnotation),
//     ExportAllDeclaration(ExportAllDeclaration),
//     ExportDeclaration(ExportDeclaration),
//     ExportDefaultDeclaration(ExportDefaultDeclaration),
//     ExportDefaultSpecifier(ExportDefaultSpecifier),
//     ExportNamedDeclaration(ExportNamedDeclaration),
//     ExportNamespaceSpecifier(ExportNamespaceSpecifier),
//     ExportSpecifier(ExportSpecifier),
//     Expression(Expression),
//     ExpressionStatement(ExpressionStatement),
//     ExpressionWrapper(ExpressionWrapper),
//     File(File),
//     Flow(Flow),
//     FlowBaseAnnotation(FlowBaseAnnotation),
//     FlowDeclaration(FlowDeclaration),
//     FlowPredicate(FlowPredicate),
//     FlowType(FlowType),
//     For(For),
//     ForInStatement(ForInStatement),
//     ForOfStatement(ForOfStatement),
//     ForStatement(ForStatement),
//     ForXStatement(ForXStatement),
//     Function(Function),
//     FunctionDeclaration(FunctionDeclaration),
//     FunctionExpression(FunctionExpression),
//     FunctionParent(FunctionParent),
//     FunctionTypeAnnotation(FunctionTypeAnnotation),
//     FunctionTypeParam(FunctionTypeParam),
//     GenericTypeAnnotation(GenericTypeAnnotation),
//     Identifier(Identifier),
//     IfStatement(IfStatement),
//     Immutable(Immutable),
//     Import(Import),
//     ImportAttribute(ImportAttribute),
//     ImportDeclaration(ImportDeclaration),
//     ImportDefaultSpecifier(ImportDefaultSpecifier),
//     ImportNamespaceSpecifier(ImportNamespaceSpecifier),
//     ImportSpecifier(ImportSpecifier),
//     InferredPredicate(InferredPredicate),
//     InterfaceDeclaration(InterfaceDeclaration),
//     InterfaceExtends(InterfaceExtends),
//     InterfaceTypeAnnotation(InterfaceTypeAnnotation),
//     InterpreterDirective(InterpreterDirective),
//     IntersectionTypeAnnotation(IntersectionTypeAnnotation),
//     JSX(JSX),
//     JSXAttribute(JSXAttribute),
//     JSXClosingElement(JSXClosingElement),
//     JSXClosingFragment(JSXClosingFragment),
//     JSXElement(JSXElement),
//     JSXEmptyExpression(JSXEmptyExpression),
//     JSXExpressionContainer(JSXExpressionContainer),
//     JSXFragment(JSXFragment),
//     JSXIdentifier(JSXIdentifier),
//     JSXMemberExpression(JSXMemberExpression),
//     JSXNamespacedName(JSXNamespacedName),
//     JSXOpeningElement(JSXOpeningElement),
//     JSXOpeningFragment(JSXOpeningFragment),
//     JSXSpreadAttribute(JSXSpreadAttribute),
//     JSXSpreadChild(JSXSpreadChild),
//     JSXText(JSXText),
//     LVal(LVal),
//     LabeledStatement(LabeledStatement),
//     Literal(Literal),
//     LogicalExpression(LogicalExpression),
//     Loop(Loop),
//     MemberExpression(MemberExpression),
//     MetaProperty(MetaProperty),
//     Method(Method),
//     MixedTypeAnnotation(MixedTypeAnnotation),
//     ModuleDeclaration(ModuleDeclaration),
//     ModuleExpression(ModuleExpression),
//     ModuleSpecifier(ModuleSpecifier),
//     NewExpression(NewExpression),
//     Noop(Noop),
//     NullLiteral(NullLiteral),
//     NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
//     NullableTypeAnnotation(NullableTypeAnnotation),
//     NumberLiteral(NumberLiteral),
//     NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
//     NumberTypeAnnotation(NumberTypeAnnotation),
//     NumericLiteral(NumericLiteral),
//     ObjectExpression(ObjectExpression),
//     ObjectMember(ObjectMember),
//     ObjectMethod(ObjectMethod),
//     ObjectPattern(ObjectPattern),
//     ObjectProperty(ObjectProperty),
//     ObjectTypeAnnotation(ObjectTypeAnnotation),
//     ObjectTypeCallProperty(ObjectTypeCallProperty),
//     ObjectTypeIndexer(ObjectTypeIndexer),
//     ObjectTypeInternalSlot(ObjectTypeInternalSlot),
//     ObjectTypeProperty(ObjectTypeProperty),
//     ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
//     OpaqueType(OpaqueType),
//     OptionalCallExpression(OptionalCallExpression),
//     OptionalMemberExpression(OptionalMemberExpression),
//     ParenthesizedExpression(ParenthesizedExpression),
//     Pattern(Pattern),
//     PatternLike(PatternLike),
//     PipelineBareFunction(PipelineBareFunction),
//     PipelinePrimaryTopicReference(PipelinePrimaryTopicReference),
//     PipelineTopicExpression(PipelineTopicExpression),
//     Placeholder(Placeholder),
//     Private(Private),
//     PrivateName(PrivateName),
//     Program(Program),
//     Property(Property),
//     Pureish(Pureish),
//     QualifiedTypeIdentifier(QualifiedTypeIdentifier),
//     RecordExpression(RecordExpression),
//     RegExpLiteral(RegExpLiteral),
//     RegexLiteral(RegexLiteral),
//     RestElement(RestElement),
//     RestProperty(RestProperty),
//     ReturnStatement(ReturnStatement),
//     Scopable(Scopable),
//     SequenceExpression(SequenceExpression),
//     SpreadElement(SpreadElement),
//     SpreadProperty(SpreadProperty),
//     Statement(Statement),
//     StaticBlock(StaticBlock),
//     StringLiteral(StringLiteral),
//     StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
//     StringTypeAnnotation(StringTypeAnnotation),
//     Super(Super),
//     SwitchCase(SwitchCase),
//     SwitchStatement(SwitchStatement),
//     SymbolTypeAnnotation(SymbolTypeAnnotation),
//     TSAnyKeyword(TSAnyKeyword),
//     TSArrayType(TSArrayType),
//     TSAsExpression(TSAsExpression),
//     TSBaseType(TSBaseType),
//     TSBigIntKeyword(TSBigIntKeyword),
//     TSBooleanKeyword(TSBooleanKeyword),
//     TSCallSignatureDeclaration(TSCallSignatureDeclaration),
//     TSConditionalType(TSConditionalType),
//     TSConstructSignatureDeclaration(TSConstructSignatureDeclaration),
//     TSConstructorType(TSConstructorType),
//     TSDeclareFunction(TSDeclareFunction),
//     TSDeclareMethod(TSDeclareMethod),
//     TSEntityName(TSEntityName),
//     TSEnumDeclaration(TSEnumDeclaration),
//     TSEnumMember(TSEnumMember),
//     TSExportAssignment(TSExportAssignment),
//     TSExpressionWithTypeArguments(TSExpressionWithTypeArguments),
//     TSExternalModuleReference(TSExternalModuleReference),
//     TSFunctionType(TSFunctionType),
//     TSImportEqualsDeclaration(TSImportEqualsDeclaration),
//     TSImportType(TSImportType),
//     TSIndexSignature(TSIndexSignature),
//     TSIndexedAccessType(TSIndexedAccessType),
//     TSInferType(TSInferType),
//     TSInterfaceBody(TSInterfaceBody),
//     TSInterfaceDeclaration(TSInterfaceDeclaration),
//     TSIntersectionType(TSIntersectionType),
//     TSIntrinsicKeyword(TSIntrinsicKeyword),
//     TSLiteralType(TSLiteralType),
//     TSMappedType(TSMappedType),
//     TSMethodSignature(TSMethodSignature),
//     TSModuleBlock(TSModuleBlock),
//     TSModuleDeclaration(TSModuleDeclaration),
//     TSNamedTupleMember(TSNamedTupleMember),
//     TSNamespaceExportDeclaration(TSNamespaceExportDeclaration),
//     TSNeverKeyword(TSNeverKeyword),
//     TSNonNullExpression(TSNonNullExpression),
//     TSNullKeyword(TSNullKeyword),
//     TSNumberKeyword(TSNumberKeyword),
//     TSObjectKeyword(TSObjectKeyword),
//     TSOptionalType(TSOptionalType),
//     TSParameterProperty(TSParameterProperty),
//     TSParenthesizedType(TSParenthesizedType),
//     TSPropertySignature(TSPropertySignature),
//     TSQualifiedName(TSQualifiedName),
//     TSRestType(TSRestType),
//     TSStringKeyword(TSStringKeyword),
//     TSSymbolKeyword(TSSymbolKeyword),
//     TSThisType(TSThisType),
//     TSTupleType(TSTupleType),
//     TSType(TSType),
//     TSTypeAliasDeclaration(TSTypeAliasDeclaration),
//     TSTypeAnnotation(TSTypeAnnotation),
//     TSTypeAssertion(TSTypeAssertion),
//     TSTypeElement(TSTypeElement),
//     TSTypeLiteral(TSTypeLiteral),
//     TSTypeOperator(TSTypeOperator),
//     TSTypeParameter(TSTypeParameter),
//     TSTypeParameterDeclaration(TSTypeParameterDeclaration),
//     TSTypeParameterInstantiation(TSTypeParameterInstantiation),
//     TSTypePredicate(TSTypePredicate),
//     TSTypeQuery(TSTypeQuery),
//     TSTypeReference(TSTypeReference),
//     TSUndefinedKeyword(TSUndefinedKeyword),
//     TSUnionType(TSUnionType),
//     TSUnknownKeyword(TSUnknownKeyword),
//     TSVoidKeyword(TSVoidKeyword),
//     TaggedTemplateExpression(TaggedTemplateExpression),
//     TemplateElement(TemplateElement),
//     TemplateLiteral(TemplateLiteral),
//     Terminatorless(Terminatorless),
//     ThisExpression(ThisExpression),
//     ThisTypeAnnotation(ThisTypeAnnotation),
//     ThrowStatement(ThrowStatement),
//     TryStatement(TryStatement),
//     TupleExpression(TupleExpression),
//     TupleTypeAnnotation(TupleTypeAnnotation),
//     TypeAlias(TypeAlias),
//     TypeAnnotation(TypeAnnotation),
//     TypeCastExpression(TypeCastExpression),
//     TypeParameter(TypeParameter),
//     TypeParameterDeclaration(TypeParameterDeclaration),
//     TypeParameterInstantiation(TypeParameterInstantiation),
//     TypeofTypeAnnotation(TypeofTypeAnnotation),
//     UnaryExpression(UnaryExpression),
//     UnaryLike(UnaryLike),
//     UnionTypeAnnotation(UnionTypeAnnotation),
//     UpdateExpression(UpdateExpression),
//     UserWhitespacable(UserWhitespacable),
//     V8IntrinsicIdentifier(V8IntrinsicIdentifier),
//     VariableDeclaration(VariableDeclaration),
//     VariableDeclarator(VariableDeclarator),
//     Variance(Variance),
//     VoidTypeAnnotation(VoidTypeAnnotation),
//     While(While),
//     WhileStatement(WhileStatement),
//     WithStatement(WithStatement),
//     YieldExpression(YieldExpression),
// }
