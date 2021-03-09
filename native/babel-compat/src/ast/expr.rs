use serde::{Serialize, Deserialize};

use crate::ast::{
    class::{ClassBody, ClassImpl, InterfaceExtends, Super},
    common::{BaseNode, SpreadElement, LVal, Identifier, PrivateName, MetaProperty, Arg, Callee, Param, Decorator, TypeAnnotOrNoop, TypeParamDeclOrNoop, SuperTypeParams},
    flow::{TypeParameterInstantiation, TypeParameterDeclaration, TypeAnnotation},
    jsx::{JSXElement, JSXFragment},
    lit::{StringLiteral, NumericLiteral, NullLiteral, BooleanLiteral, RegExpLiteral, TemplateLiteral, BigIntLiteral, DecimalLiteral},
    module::{Import, Program},
    object::{ObjectMethod, ObjectProperty},
    stmt::{BlockStatement},
    typescript::{TSTypeParameterInstantiation, TSTypeParameterDeclaration, TSAsExpression, TSTypeAssertion, TSNonNullExpression},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Expression {
    #[serde(rename = "ArrayExpression")]
    Array(ArrayExpression),
    #[serde(rename = "AssignmentExpression")]
    Assignment(AssignmentExpression),
    #[serde(rename = "BinaryExpression")]
    Binary(BinaryExpression),
    #[serde(rename = "CallExpression")]
    Call(CallExpression),
    #[serde(rename = "ConditionalExpression")]
    Conditional(ConditionalExpression),
    #[serde(rename = "FunctionExpression")]
    Func(FunctionExpression),
    #[serde(rename = "Identifier")]
    Id(Identifier),
    StringLiteral(StringLiteral),
    NumericLiteral(NumericLiteral),
    NullLiteral(NullLiteral),
    BooleanLiteral(BooleanLiteral),
    RegExpLiteral(RegExpLiteral),
    #[serde(rename = "LogicalExpression")]
    Logical(LogicalExpression),
    #[serde(rename = "MemberExpression")]
    Member(MemberExpression),
    #[serde(rename = "NewExpression")]
    New(NewExpression),
    #[serde(rename = "ObjectExpression")]
    Object(ObjectExpression),
    #[serde(rename = "SequenceExpression")]
    Sequence(SequenceExpression),
    #[serde(rename = "ParenthesizedExpression")]
    Parenthesized(ParenthesizedExpression),
    #[serde(rename = "ThisExpression")]
    This(ThisExpression),
    #[serde(rename = "UnaryExpression")]
    Unary(UnaryExpression),
    #[serde(rename = "UpdateExpression")]
    Update(UpdateExpression),
    #[serde(rename = "ArrowFunctionExpression")]
    ArrowFunc(ArrowFunctionExpression),
    #[serde(rename = "ClassExpression")]
    Class(ClassExpression),
    #[serde(rename = "MetaProperty")]
    MetaProp(MetaProperty),
    Super(Super),
    #[serde(rename = "TaggedTemplateExpression")]
    TaggedTemplate(TaggedTemplateExpression),
    TemplateLiteral(TemplateLiteral),
    #[serde(rename = "YieldExpression")]
    Yield(YieldExpression),
    #[serde(rename = "AwaitExpression")]
    Await(AwaitExpression),
    Import(Import),
    BigIntLiteral(BigIntLiteral),
    #[serde(rename = "OptionalMemberExpression")]
    OptionalMember(OptionalMemberExpression),
    #[serde(rename = "OptionalCallExpression")]
    OptionalCall(OptionalCallExpression),
    #[serde(rename = "TypeCastExpression")]
    TypeCast(TypeCastExpression),
    JSXElement(JSXElement),
    JSXFragment(JSXFragment),
    #[serde(rename = "BindExpression")]
    Bind(BindExpression),
    #[serde(rename = "PipelinePrimaryTopicReference")]
    PipelinePrimaryTopicRef(PipelinePrimaryTopicReference),
    #[serde(rename = "DoExpression")]
    Do(DoExpression),
    #[serde(rename = "RecordExpression")]
    Record(RecordExpression),
    #[serde(rename = "TupleExpression")]
    Tuple(TupleExpression),
    DecimalLiteral(DecimalLiteral),
    #[serde(rename = "ModuleExpression")]
    Module(ModuleExpression),
    #[serde(rename = "TSAsExpression")]
    TSAs(TSAsExpression),
    TSTypeAssertion(TSTypeAssertion),
    #[serde(rename = "TSNonNullExpression")]
    TSNonNull(TSNonNullExpression),
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum MemberExprProp {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "Identifier")]
    Id(Identifier),
    PrivateName(PrivateName),
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

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
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
pub struct ConditionalExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub test: Box<Expression>,
    pub consequent: Box<Expression>,
    pub alternate: Box<Expression>,
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
pub struct ThisExpression {
    #[serde(flatten)]
    pub base: BaseNode,
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
pub enum OptionalMemberExprProp {
    #[serde(rename = "Expression")]
    Expr(Expression),
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
pub struct BindExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<Expression>,
    pub callee: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct PipelinePrimaryTopicReference {
    #[serde(flatten)]
    pub base: BaseNode,
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
    #[serde(rename = "SpreadElement")]
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
pub struct ModuleExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub body: Program,
}

