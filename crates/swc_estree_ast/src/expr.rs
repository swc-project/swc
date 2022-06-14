use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::ast_serde;

use crate::{
    class::{ClassBody, ClassImpl},
    common::{
        BaseNode, Decorator, Identifier, LVal, MetaProperty, Param, PrivateName, SpreadElement,
        SuperTypeParams, TypeAnnotOrNoop, TypeParamDeclOrNoop,
    },
    flow::{
        InterfaceExtends, TypeAnnotation, TypeParameterDeclaration, TypeParameterInstantiation,
    },
    jsx::{JSXElement, JSXFragment, JSXNamespacedName},
    lit::{Literal, TemplateLiteral},
    module::{Import, Program},
    object::{ObjectMethod, ObjectProperty},
    stmt::{BlockStatement, ExpressionStatement},
    typescript::{
        TSAsExpression, TSNonNullExpression, TSTypeAssertion, TSTypeParameterInstantiation,
    },
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Expression {
    #[tag("ArrayExpression")]
    Array(ArrayExpression),
    #[tag("AssignmentExpression")]
    Assignment(AssignmentExpression),
    #[tag("BinaryExpression")]
    Binary(BinaryExpression),
    #[tag("CallExpression")]
    Call(CallExpression),
    #[tag("ConditionalExpression")]
    Conditional(ConditionalExpression),
    #[tag("FunctionExpression")]
    Func(FunctionExpression),
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("StringLiteral")]
    #[tag("NumericLiteral")]
    #[tag("NullLiteral")]
    #[tag("BooleanLiteral")]
    #[tag("RegExpLiteral")]
    #[tag("DecimalLiteral")]
    #[tag("BigIntLiteral")]
    Literal(Literal),
    #[tag("LogicalExpression")]
    Logical(LogicalExpression),
    #[tag("MemberExpression")]
    Member(MemberExpression),
    #[tag("NewExpression")]
    New(NewExpression),
    #[tag("ObjectExpression")]
    Object(ObjectExpression),
    #[tag("SequenceExpression")]
    Sequence(SequenceExpression),
    #[tag("ParenthesizedExpression")]
    Parenthesized(ParenthesizedExpression),
    #[tag("ThisExpression")]
    This(ThisExpression),
    #[tag("UnaryExpression")]
    Unary(UnaryExpression),
    #[tag("UpdateExpression")]
    Update(UpdateExpression),
    #[tag("ArrowFunctionExpression")]
    ArrowFunc(ArrowFunctionExpression),
    #[tag("ClassExpression")]
    Class(ClassExpression),
    #[tag("MetaProperty")]
    MetaProp(MetaProperty),
    #[tag("Super")]
    Super(Super),
    #[tag("TaggedTemplateExpression")]
    TaggedTemplate(TaggedTemplateExpression),
    #[tag("TemplateLiteral")]
    TemplateLiteral(TemplateLiteral),
    #[tag("YieldExpression")]
    Yield(YieldExpression),
    #[tag("AwaitExpression")]
    Await(AwaitExpression),
    #[tag("Import")]
    Import(Import),
    #[tag("OptionalMemberExpression")]
    OptionalMember(OptionalMemberExpression),
    #[tag("OptionalCallExpression")]
    OptionalCall(OptionalCallExpression),
    #[tag("TypeCastExpression")]
    TypeCast(TypeCastExpression),
    #[tag("JSXElement")]
    JSXElement(JSXElement),
    #[tag("Fragment")]
    JSXFragment(JSXFragment),
    #[tag("BindExpression")]
    Bind(BindExpression),
    #[tag("PipelinePrimaryTopicReference")]
    PipelinePrimaryTopicRef(PipelinePrimaryTopicReference),
    #[tag("DoExpression")]
    Do(DoExpression),
    #[tag("RecordExpression")]
    Record(RecordExpression),
    #[tag("TupleExpression")]
    Tuple(TupleExpression),
    #[tag("ModuleExpression")]
    Module(ModuleExpression),
    #[tag("TSAsExpression")]
    TSAs(TSAsExpression),
    #[tag("TSTypeAssertion")]
    TSTypeAssertion(TSTypeAssertion),
    #[tag("TSNonNullExpression")]
    TSNonNull(TSNonNullExpression),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ExpressionWrapper {
    #[tag("ExpressionStatement")]
    Stmt(ExpressionStatement),
    #[tag("ParenthesizedExpression")]
    Parenthesized(ParenthesizedExpression),
    #[tag("TypeCastExpression")]
    TypeCast(TypeCastExpression),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ArrayExprEl {
    #[tag("SpreadElement")]
    Spread(SpreadElement),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ArrayExpression")]
pub struct ArrayExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub elements: Vec<Option<ArrayExprEl>>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("AssignmentExpression")]
pub struct AssignmentExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub operator: JsWord,
    pub left: Box<LVal>,
    pub right: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum MemberExprProp {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("PrivateName")]
    PrivateName(PrivateName),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("MemberExpression")]
pub struct MemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub property: Box<MemberExprProp>,
    #[serde(default)]
    pub computed: bool,
    #[serde(default, serialize_with = "crate::ser::serialize_optional")]
    pub optional: Option<bool>,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
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

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum BinaryExprLeft {
    #[tag("PrivateName")]
    Private(PrivateName),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("BinaryExpression")]
pub struct BinaryExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: BinaryExprOp,
    pub left: Box<BinaryExprLeft>,
    pub right: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("V8IntrinsicIdentifier")]
pub struct V8IntrinsicIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: JsWord,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Callee {
    #[tag("V8IntrinsicIdentifier")]
    V8Id(V8IntrinsicIdentifier),
    #[tag("*")]
    Expr(Box<Expression>),
}

impl From<Expression> for Callee {
    fn from(expr: Expression) -> Self {
        Callee::Expr(Box::new(expr))
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("ArgumentPlaceholder")]
pub struct ArgumentPlaceholder {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Arg {
    #[tag("SpreadElement")]
    Spread(SpreadElement),
    #[tag("JSXNamespacedName")]
    JSXName(JSXNamespacedName),
    #[tag("ArgumentPlaceholder")]
    Placeholder(ArgumentPlaceholder),
    #[tag("*")]
    Expr(Box<Expression>),
}

impl From<ArrayExprEl> for Arg {
    fn from(el: ArrayExprEl) -> Self {
        match el {
            ArrayExprEl::Expr(e) => Arg::Expr(e),
            ArrayExprEl::Spread(s) => Arg::Spread(s),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("CallExpression")]
pub struct CallExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Box<Callee>,
    #[serde(default)]
    pub arguments: Vec<Arg>,
    #[serde(default, serialize_with = "crate::ser::serialize_optional")]
    pub optional: Option<bool>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_arguments: Option<TypeParameterInstantiation>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ConditionalExpression")]
pub struct ConditionalExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Box<Expression>,
    pub consequent: Box<Expression>,
    pub alternate: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("FunctionExpression")]
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
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub return_type: Option<Box<TypeAnnotOrNoop>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("NewExpression")]
pub struct NewExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub callee: Callee,
    #[serde(default)]
    pub arguments: Vec<Arg>,
    #[serde(
        default,
        skip_serializing_if = "crate::flavor::Flavor::skip_none_and_false"
    )]
    pub optional: Option<bool>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_arguments: Option<TypeParameterInstantiation>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum LogicalExprOp {
    #[serde(rename = "||")]
    Or,
    #[serde(rename = "&&")]
    And,
    #[serde(rename = "??")]
    Nullish,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("LogicalExpression")]
pub struct LogicalExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: LogicalExprOp,
    pub left: Box<Expression>,
    pub right: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectExprProp {
    #[tag("ObjectMethod")]
    Method(ObjectMethod),
    #[tag("ObjectProperty")]
    Prop(ObjectProperty),
    #[tag("SpreadElement")]
    Spread(SpreadElement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ObjectExpression")]
pub struct ObjectExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub properties: Vec<ObjectExprProp>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("SequenceExpression")]
pub struct SequenceExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub expressions: Vec<Box<Expression>>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ParenthesizedExpression")]
pub struct ParenthesizedExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("ThisExpression")]
pub struct ThisExpression {
    #[serde(flatten)]
    pub base: BaseNode,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
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

fn default_prefix() -> bool {
    true
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("UnaryExpression")]
pub struct UnaryExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: UnaryExprOp,
    pub argument: Box<Expression>,
    #[serde(default = "default_prefix")]
    pub prefix: bool,
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum UpdateExprOp {
    #[serde(rename = "++")]
    Increment,
    #[serde(rename = "--")]
    Decrement,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("UpdateExpression")]
pub struct UpdateExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub operator: UpdateExprOp,
    pub argument: Box<Expression>,
    #[serde(default)]
    pub prefix: bool,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ArrowFuncExprBody {
    #[tag("BlockStatement")]
    Block(BlockStatement),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ArrowFunctionExpression")]
pub struct ArrowFunctionExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: Box<ArrowFuncExprBody>,
    #[serde(default, rename = "async")]
    pub is_async: bool,
    #[serde(default)]
    pub expression: bool,
    #[serde(default)]
    pub generator: bool,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub return_type: Option<Box<TypeAnnotOrNoop>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ClassExpression")]
pub struct ClassExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    #[serde(default)]
    pub super_class: Option<Box<Expression>>,
    pub body: ClassBody,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub implements: Option<Vec<ClassImpl>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub mixins: Option<InterfaceExtends>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub super_type_parameters: Option<SuperTypeParams>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TaggedTemplateExprTypeParams {
    #[tag("TypeParameterDeclaration")]
    Flow(TypeParameterDeclaration),
    #[tag("TSTypeParameterInstantiation")]
    TS(TSTypeParameterInstantiation),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("TaggedTemplateExpression")]
pub struct TaggedTemplateExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub tag: Box<Expression>,
    pub quasi: TemplateLiteral,
    #[serde(default)]
    pub type_parameters: Option<TaggedTemplateExprTypeParams>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("YieldExpression")]
pub struct YieldExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub argument: Option<Box<Expression>>,
    #[serde(default)]
    pub delegate: bool,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("AwaitExpression")]
pub struct AwaitExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum OptionalMemberExprProp {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("OptionalMemberExpression")]
pub struct OptionalMemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub property: OptionalMemberExprProp,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub optional: bool,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("OptionalCallExpression")]
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

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("TypeCastExpression")]
pub struct TypeCastExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
    pub type_annotation: TypeAnnotation,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("BindExpression")]
pub struct BindExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub callee: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("PipelinePrimaryTopicReference")]
pub struct PipelinePrimaryTopicReference {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("DoExpression")]
pub struct DoExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: BlockStatement,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum RecordExprProp {
    #[tag("ObjectProperty")]
    Prop(ObjectProperty),
    #[tag("SpreadElement")]
    Spread(SpreadElement),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("RecordExpression")]
pub struct RecordExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub properties: Vec<RecordExprProp>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TupleExprEl {
    #[tag("SpreadElement")]
    Spread(SpreadElement),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("TupleExpression")]
pub struct TupleExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub elements: Vec<TupleExprEl>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ModuleExpression")]
pub struct ModuleExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Program,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("Super")]
pub struct Super {
    #[serde(flatten)]
    pub base: BaseNode,
}
