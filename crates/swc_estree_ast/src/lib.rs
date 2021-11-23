pub use comment::*;
pub use decl::*;
pub use expr::*;
pub use flow::*;
pub use jsx::*;
pub use module::*;
pub use object::*;
pub use pat::*;
pub use stmt::*;
use swc_estree_macros::estree_ast;
pub use typescript::*;

mod comment;
mod decl;
mod expr;
mod flow;
mod jsx;
mod module;
mod object;
mod pat;
mod stmt;
mod typescript;

#[estree_ast(flavors(babel, acorn))]
pub mod ast {
    use crate::{
        class::*,
        comment::Comment,
        decl::*,
        expr::{Expression, *},
        flow::*,
        jsx::*,
        module::*,
        object::*,
        pat::*,
        stmt::*,
        typescript::{TSType, *},
    };
    use serde::{Deserialize, Serialize};
    use swc_atoms::JsWord;
    use swc_common::ast_serde;

    #[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
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
        /* TODO(dwoznicki): I can't figure out what goes in this field, so I'm just
         * removing it for now.
         * #[serde(default)]
         * pub extra: Option<HashMap<String, Value, RandomState>>, */
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
        StringLiteral(StringLiteral),
        #[tag("NumericLiteral")]
        NumericLiteral(NumericLiteral),
        #[tag("NullLiteral")]
        NullLiteral(NullLiteral),
        #[tag("BooleanLiteral")]
        BooleanLiteral(BooleanLiteral),
        #[tag("BigIntLiteral")]
        BigIntLiteral(BigIntLiteral),
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
        #[tag("DecimalLiteral")]
        DecimalLiteral(DecimalLiteral),
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
        StringLiteral(StringLiteral),
        #[tag("NumericLiteral")]
        NumericLiteral(NumericLiteral),
        #[tag("NullLiteral")]
        NullLiteral(NullLiteral),
        #[tag("BooleanLiteral")]
        BooleanLiteral(BooleanLiteral),
        #[tag("RegExpLiteral")]
        RegExpLiteral(RegExpLiteral),
        #[tag("ArrowFunctionExpression")]
        ArrowFuncExpr(ArrowFunctionExpression),
        #[tag("BigIntLiteral")]
        BigIntLiteral(BigIntLiteral),
        #[tag("DecimalLiteral")]
        DecimalLiteral(DecimalLiteral),
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
        #[serde(default)]
        pub decorators: Option<Vec<Decorator>>,
        #[serde(default)]
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
        #[serde(default)]
        pub decorators: Option<Vec<Decorator>>,
        #[serde(default)]
        pub optional: Option<bool>,
        #[serde(default)]
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

    #[derive(Debug, Clone, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("Directive")]
    pub struct Directive {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: DirectiveLiteral,
    }

    #[derive(Debug, Clone, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("Placeholder")]
    pub struct Placeholder {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expected_node: PlaceholderExpectedNode,
        pub name: Identifier,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum Class {
        #[tag("ClassExpression")]
        Expr(ClassExpression),
        #[tag("ClassDeclaration")]
        Decl(ClassDeclaration),
    }

    #[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum ClassMethodKind {
        Get,
        Set,
        Method,
        Constructor,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("ClassMethod")]
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
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        #[serde(default)]
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("ClassPrivateProperty")]
    pub struct ClassPrivateProperty {
        #[serde(flatten)]
        pub base: BaseNode,
        pub key: PrivateName,
        #[serde(default)]
        pub value: Option<Box<Expression>>,
        #[serde(default)]
        pub decorators: Option<Vec<Decorator>>,
        #[serde(default, rename = "static")]
        pub static_any: Value,
        #[serde(default)]
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("ClassPrivateMethod")]
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
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        #[serde(default)]
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("ClassProperty")]
    pub struct ClassProperty {
        #[serde(flatten)]
        pub base: BaseNode,
        pub key: ObjectKey,
        #[serde(default)]
        pub value: Option<Box<Expression>>,
        #[serde(default)]
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
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
        pub optional: Option<bool>,
        #[serde(default)]
        pub readonly: Option<bool>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("StaticBlock")]
    pub struct StaticBlock {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub body: Vec<Statement>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ClassBodyEl {
        #[tag("ClassMethod")]
        Method(ClassMethod),
        #[tag("ClassPrivateMethod")]
        PrivateMethod(ClassPrivateMethod),
        #[tag("ClassProperty")]
        Prop(ClassProperty),
        #[tag("ClassPrivateProperty")]
        PrivateProp(ClassPrivateProperty),
        #[tag("TSDeclareMethod")]
        TSMethod(TSDeclareMethod),
        #[tag("TSIndexSignature")]
        TSIndex(TSIndexSignature),
        #[tag("StaticBlock")]
        StaticBlock(StaticBlock),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("ClassBody")]
    pub struct ClassBody {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub body: Vec<ClassBodyEl>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ClassImpl {
        #[tag("TSExpressionWithTypeArguments")]
        TSExpr(TSExpressionWithTypeArguments),
        #[tag("ClassImplements")]
        Implements(ClassImplements),
    }

    impl From<TSExpressionWithTypeArguments> for ClassImpl {
        fn from(expr: TSExpressionWithTypeArguments) -> Self {
            ClassImpl::TSExpr(expr)
        }
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("ClassDeclaration")]
    pub struct ClassDeclaration {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
        #[serde(default)]
        pub super_class: Option<Box<Expression>>,
        pub body: ClassBody,
        #[serde(default)]
        pub decorators: Option<Vec<Decorator>>,
        #[serde(default, rename = "abstract")]
        pub is_abstract: Option<bool>,
        #[serde(default)]
        pub declare: Option<bool>,
        #[serde(default)]
        pub implements: Option<Vec<ClassImpl>>,
        #[serde(default)]
        pub mixins: Option<InterfaceExtends>,
        #[serde(default)]
        pub super_type_parameters: Option<SuperTypeParams>,
        #[serde(default)]
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }

    impl From<ClassExpression> for ClassDeclaration {
        fn from(expr: ClassExpression) -> Self {
            ClassDeclaration {
                base: expr.base,
                id: expr.id.unwrap(),
                super_class: expr.super_class.map(|s| Box::new(*s)),
                body: expr.body,
                decorators: expr.decorators,
                is_abstract: Default::default(),
                declare: Default::default(),
                implements: expr.implements,
                mixins: expr.mixins,
                super_type_parameters: expr.super_type_parameters,
                type_parameters: expr.type_parameters,
            }
        }
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum Literal {
        #[tag("StringLiteral")]
        String(StringLiteral),
        #[tag("NumericLiteral")]
        Numeric(NumericLiteral),
        #[tag("NullLiteral")]
        Null(NullLiteral),
        #[tag("BooleanLiteral")]
        Boolean(BooleanLiteral),
        #[tag("RegExpLiteral")]
        RegExp(RegExpLiteral),
        #[tag("TemplateLiteral")]
        Template(TemplateLiteral),
        #[tag("BigIntLiteral")]
        BigInt(BigIntLiteral),
        #[tag("DecimalLiteral")]
        Decimal(DecimalLiteral),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct StringLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: JsWord,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct NumericLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: f64,
    }

    /// Deprecated. Use NumericLiteral instead.
    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct NumberLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: f64,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct NullLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct BooleanLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: bool,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct RegExpLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        pub pattern: JsWord,
        #[serde(default)]
        pub flags: JsWord,
    }

    /// Deprecated. Use RegExpLiteral instead.
    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct RegexLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        pub pattern: JsWord,
        #[serde(default)]
        pub flags: JsWord,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    pub struct TemplateElVal {
        #[serde(default)]
        pub raw: JsWord,
        #[serde(default)]
        pub cooked: Option<JsWord>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TemplateElement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: TemplateElVal,
        #[serde(default)]
        pub tail: bool,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TemplateLiteralExpr {
        #[tag("TSAnyKeyword")]
        #[tag("TSBooleanKeyword")]
        #[tag("TSBigIntKeyword")]
        #[tag("TSIntrinsicKeyword")]
        #[tag("TSNeverKeyword")]
        #[tag("TSNullKeyword")]
        #[tag("TSNumberKeyword")]
        #[tag("TSObjectKeyword")]
        #[tag("TSStringKeyword")]
        #[tag("TSSymbolKeyword")]
        #[tag("TSUndefinedKeyword")]
        #[tag("TSUnknownKeyword")]
        #[tag("TSVoidKeyword")]
        #[tag("TSThisType")]
        #[tag("TSFunctionType")]
        #[tag("TSConstructorType")]
        #[tag("TSTypeReference")]
        #[tag("TSTypePredicate")]
        #[tag("TSTypeQuery")]
        #[tag("TSTypeLiteral")]
        #[tag("TSArrayType")]
        #[tag("TSTupleType")]
        #[tag("TSOptionalType")]
        #[tag("TSRestType")]
        #[tag("TSUnionType")]
        #[tag("TSIntersectionType")]
        #[tag("TSConditionalType")]
        #[tag("TSInferType")]
        #[tag("TSParenthesizedType")]
        #[tag("TSTypeOperator")]
        #[tag("TSIndexedAccessType")]
        #[tag("TSMappedType")]
        #[tag("TSLiteralType")]
        #[tag("TSExpressionWithTypeArguments")]
        #[tag("TSImportType")]
        TSType(TSType),
        #[tag("*")]
        Expr(Box<Expression>),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TemplateLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub quasis: Vec<TemplateElement>,
        #[serde(default)]
        pub expressions: Vec<TemplateLiteralExpr>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct BigIntLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub value: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct DecimalLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub value: JsWord,
    }
}
