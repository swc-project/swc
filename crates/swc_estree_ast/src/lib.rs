use swc_estree_macros::estree_ast;

#[estree_ast(flavors(babel, acorn))]
pub mod ast {
    use serde::{Deserialize, Serialize};
    use serde_json::Value;
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
    #[ast_serde]
    pub enum Declaration {
        #[tag("FunctionDeclaration")]
        FuncDecl(FunctionDeclaration),
        #[tag("VariableDeclaration")]
        VarDecl(VariableDeclaration),
        #[tag("ClassDeclaration")]
        ClassDecl(ClassDeclaration),
        #[tag("ExportAllDeclaration")]
        ExportAllDecl(ExportAllDeclaration),
        #[tag("ExportDefaultDeclaration")]
        ExportDefaultDecl(ExportDefaultDeclaration),
        #[tag("ExportNamedDeclaration")]
        ExportNamedDecl(ExportNamedDeclaration),
        #[tag("ImportDeclaration")]
        ImportDecl(ImportDeclaration),
        #[tag("DeclareClass")]
        DeclClass(DeclareClass),
        #[tag("DeclareFuncction")]
        DeclFunc(DeclareFunction),
        #[tag("DeclareInterface")]
        DeclInterface(DeclareInterface),
        #[tag("DeclareModule")]
        DeclModule(DeclareModule),
        #[tag("DeclareModuleExports")]
        DeclModuleExports(DeclareModuleExports),
        #[tag("DeclareTypeAlias")]
        DeclTypeAlias(DeclareTypeAlias),
        #[tag("DeclareOpaqueType")]
        DeclOpaqueType(DeclareOpaqueType),
        #[tag("DeclareVariable")]
        DeclVar(DeclareVariable),
        #[tag("DeclareExportDeclaration")]
        DeclExportDecl(DeclareExportDeclaration),
        #[tag("DeclareExportAllDeclaration")]
        DeclExportAllDecl(DeclareExportAllDeclaration),
        #[tag("InterfaceDeclaration")]
        InterfaceDecl(InterfaceDeclaration),
        #[tag("OpaqueType")]
        OpaqueType(OpaqueType),
        #[tag("TypeAlias")]
        TypeAlias(TypeAlias),
        #[tag("EnumDeclaration")]
        EnumDecl(EnumDeclaration),
        #[tag("TSDeclareFunction")]
        TSDeclFunc(TSDeclareFunction),
        #[tag("TSIterfaceDeclaration")]
        TSInterfaceDecl(TSInterfaceDeclaration),
        #[tag("TSTypeAliasDeclaration")]
        TSTypeAliasDecl(TSTypeAliasDeclaration),
        #[tag("TSEnumDeclaration")]
        TSEnumDecl(TSEnumDeclaration),
        #[tag("TSModuleDeclaration")]
        TSModuleDecl(TSModuleDeclaration),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum VariableDeclarationKind {
        Var,
        Let,
        Const,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("VariableDeclarator")]
    pub struct VariableDeclarator {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: LVal,
        #[serde(default)]
        pub init: Option<Box<Expression>>,
        #[serde(default)]
        pub definite: Option<bool>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("VariableDeclaration")]
    pub struct VariableDeclaration {
        #[serde(flatten)]
        pub base: BaseNode,
        pub kind: VariableDeclarationKind,
        #[serde(default)]
        pub declarations: Vec<VariableDeclarator>,
        #[serde(default)]
        pub declare: Option<bool>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("FunctionDeclaration")]
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
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        #[serde(default)]
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }

    impl From<FunctionExpression> for FunctionDeclaration {
        fn from(expr: FunctionExpression) -> Self {
            FunctionDeclaration {
                base: expr.base,
                id: expr.id,
                params: expr.params,
                body: expr.body,
                generator: expr.generator,
                is_async: expr.is_async,
                return_type: expr.return_type,
                type_parameters: expr.type_parameters,
            }
        }
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumBooleanMember")]
    pub struct EnumBooleanMember {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
        pub init: BooleanLiteral,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumNumberMember")]
    pub struct EnumNumberMember {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
        pub init: NumericLiteral,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumStringMember")]
    pub struct EnumStringMember {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
        pub init: StringLiteral,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum EnumStringBodyMember {
        #[tag("EnumStringBodyMember")]
        String(EnumStringMember),
        #[tag("EnumDefaultedMember")]
        Defaulted(EnumDefaultedMember),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumDefaultedMember")]
    pub struct EnumDefaultedMember {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum EnumMember {
        #[tag("EnumBooleanMember")]
        Boolean(EnumBooleanMember),
        #[tag("EnumNumberMember")]
        Number(EnumNumberMember),
        #[tag("EnumStringMember")]
        String(EnumStringMember),
        #[tag("EnumDefaultedMember")]
        Defaulted(EnumDefaultedMember),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumBooleanBody")]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumNumberBody")]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumStringBody")]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumSymbolBody")]
    pub struct EnumSymbolBody {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub members: Vec<EnumDefaultedMember>,
        #[serde(default)]
        pub has_unknown_members: bool,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum EnumBody {
        #[tag("EnumBooleanBody")]
        Boolean(EnumBooleanBody),
        #[tag("EnumNumberBody")]
        Number(EnumNumberBody),
        #[tag("EnumStringBody")]
        String(EnumStringBody),
        #[tag("EnumSymbolBody")]
        Symbol(EnumSymbolBody),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("EnumDeclaration")]
    pub struct EnumDeclaration {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
        pub body: EnumBody,
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
    #[ast_serde("BaseComment")]
    pub struct BaseComment {
        pub value: String,
        pub start: usize,
        pub end: usize,
        pub loc: Loc,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum Comment {
        #[tag("CommentBlock")]
        Block(BaseComment),
        #[tag("CommentLine")]
        Line(BaseComment),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum CommentTypeShorthand {
        Leading,
        Inner,
        Trailing,
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
        StringLiteral(StringLiteral),
        #[tag("NumericLiteral")]
        NumericLiteral(NumericLiteral),
        #[tag("NullLiteral")]
        NullLiteral(NullLiteral),
        #[tag("BooleanLiteral")]
        BooleanLiteral(BooleanLiteral),
        #[tag("RegExpLiteral")]
        RegExpLiteral(RegExpLiteral),
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
        #[tag("BigIntLiteral")]
        BigIntLiteral(BigIntLiteral),
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
        #[tag("DecimalLiteral")]
        DecimalLiteral(DecimalLiteral),
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
        #[serde(default)]
        pub optional: Option<bool>,
    }

    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
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
        #[serde(default)]
        pub optional: Option<bool>,
        #[serde(default)]
        pub type_arguments: Option<TypeParameterInstantiation>,
        #[serde(default)]
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
        #[serde(default)]
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        #[serde(default)]
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
        #[serde(default)]
        pub optional: Option<bool>,
        #[serde(default)]
        pub type_arguments: Option<TypeParameterInstantiation>,
        #[serde(default)]
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }

    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("ThisExpression")]
    pub struct ThisExpression {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
        #[serde(default)]
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        #[serde(default)]
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
        #[serde(default)]
        pub decorators: Option<Vec<Decorator>>,
        #[serde(default)]
        pub implements: Option<Vec<ClassImpl>>,
        #[serde(default)]
        pub mixins: Option<InterfaceExtends>,
        #[serde(default)]
        pub super_type_parameters: Option<SuperTypeParams>,
        #[serde(default)]
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

    #[derive(Debug, Clone, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("Super")]
    pub struct Super {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum Flow {
        #[tag("AnyTypeAnnotation")]
        AnyTypeAnnotation(AnyTypeAnnotation),
        #[tag("ArrayTypeAnnotation")]
        ArrayTypeAnnotation(ArrayTypeAnnotation),
        #[tag("BooleanTypeAnnotation")]
        BooleanTypeAnnotation(BooleanTypeAnnotation),
        #[tag("BooleanLiteralTypeAnnotation")]
        BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
        #[tag("NullLiteralTypeAnnotation")]
        NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
        #[tag("ClassImplements")]
        ClassImplements(ClassImplements),
        #[tag("DeclareClass")]
        DeclareClass(DeclareClass),
        #[tag("DeclareFunction")]
        DeclareFunction(DeclareFunction),
        #[tag("DeclareInterface")]
        DeclareInterface(DeclareInterface),
        #[tag("DeclareModule")]
        DeclareModule(DeclareModule),
        #[tag("DeclareModuleExports")]
        DeclareModuleExports(DeclareModuleExports),
        #[tag("DeclareTypeAlias")]
        DeclareTypeAlias(DeclareTypeAlias),
        #[tag("DeclareOpaqueType")]
        DeclareOpaqueType(DeclareOpaqueType),
        #[tag("DeclareVariable")]
        DeclareVariable(DeclareVariable),
        #[tag("DeclareExportDeclaration")]
        DeclareExportDeclaration(DeclareExportDeclaration),
        #[tag("DeclareExportAllDeclaration")]
        DeclareExportAllDeclaration(DeclareExportAllDeclaration),
        #[tag("DeclaredPredicate")]
        DeclaredPredicate(DeclaredPredicate),
        #[tag("ExistsTypeAnnotation")]
        ExistsTypeAnnotation(ExistsTypeAnnotation),
        #[tag("FunctionTypeAnnotation")]
        FunctionTypeAnnotation(FunctionTypeAnnotation),
        #[tag("FunctionTypeParam")]
        FunctionTypeParam(FunctionTypeParam),
        #[tag("GenericTypeAnnotation")]
        GenericTypeAnnotation(GenericTypeAnnotation),
        #[tag("InferredPredicate")]
        InferredPredicate(InferredPredicate),
        #[tag("InterfaceExtends")]
        InterfaceExtends(InterfaceExtends),
        #[tag("InterfaceDeclaration")]
        InterfaceDeclaration(InterfaceDeclaration),
        #[tag("InterfaceTypeAnnotation")]
        InterfaceTypeAnnotation(InterfaceTypeAnnotation),
        #[tag("IntersectionTypeAnnotation")]
        IntersectionTypeAnnotation(IntersectionTypeAnnotation),
        #[tag("MixedTypeAnnotation")]
        MixedTypeAnnotation(MixedTypeAnnotation),
        #[tag("EmptyTypeAnnotation")]
        EmptyTypeAnnotation(EmptyTypeAnnotation),
        #[tag("NullableTypeAnnotation")]
        NullableTypeAnnotation(NullableTypeAnnotation),
        #[tag("NumberLiteralTypeAnnotation")]
        NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
        #[tag("NumberTypeAnnotation")]
        NumberTypeAnnotation(NumberTypeAnnotation),
        #[tag("ObjectTypeAnnotation")]
        ObjectTypeAnnotation(ObjectTypeAnnotation),
        #[tag("ObjectTypeInternalSlot")]
        ObjectTypeInternalSlot(ObjectTypeInternalSlot),
        #[tag("ObjectTypeCallProperty")]
        ObjectTypeCallProperty(ObjectTypeCallProperty),
        #[tag("ObjectTypeIndexer")]
        ObjectTypeIndexer(ObjectTypeIndexer),
        #[tag("ObjectTypeProperty")]
        ObjectTypeProperty(ObjectTypeProperty),
        #[tag("ObjectTypeSpreadProperty")]
        ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
        #[tag("OpaqueType")]
        OpaqueType(OpaqueType),
        #[tag("QualifiedTypeIdentifier")]
        QualifiedTypeIdentifier(QualifiedTypeIdentifier),
        #[tag("StringLiteralTypeAnnotation")]
        StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
        #[tag("StringTypeAnnotation")]
        StringTypeAnnotation(StringTypeAnnotation),
        #[tag("SymbolTypeAnnotation")]
        SymbolTypeAnnotation(SymbolTypeAnnotation),
        #[tag("ThisTypeAnnotation")]
        ThisTypeAnnotation(ThisTypeAnnotation),
        #[tag("TupleTypeAnnotation")]
        TupleTypeAnnotation(TupleTypeAnnotation),
        #[tag("TypeofTypeAnnotation")]
        TypeofTypeAnnotation(TypeofTypeAnnotation),
        #[tag("TypeAlias")]
        TypeAlias(TypeAlias),
        #[tag("TypeAnnotation")]
        TypeAnnotation(TypeAnnotation),
        #[tag("TypeCastExpression")]
        TypeCastExpression(TypeCastExpression),
        #[tag("TypeParameter")]
        TypeParameter(TypeParameter),
        #[tag("TypeParameterDeclaration")]
        TypeParameterDeclaration(TypeParameterDeclaration),
        #[tag("TypeParameterInstantiation")]
        TypeParameterInstantiation(TypeParameterInstantiation),
        #[tag("UnionTypeAnnotation")]
        UnionTypeAnnotation(UnionTypeAnnotation),
        #[tag("Variance")]
        Variance(Variance),
        #[tag("VoidTypeAnnotation")]
        VoidTypeAnnotation(VoidTypeAnnotation),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum FlowType {
        #[tag("AnyTypeAnnotation")]
        Any(AnyTypeAnnotation),
        #[tag("ArrayTypeAnnotation")]
        Array(ArrayTypeAnnotation),
        #[tag("BooleanTypeAnnotation")]
        Boolean(BooleanTypeAnnotation),
        #[tag("BooleanLiteralTypeAnnotation")]
        BooleanLiteral(BooleanLiteralTypeAnnotation),
        #[tag("NullLiteralTypeAnnotation")]
        NullLiteral(NullLiteralTypeAnnotation),
        #[tag("ExistsTypeAnnotation")]
        Exists(ExistsTypeAnnotation),
        #[tag("FunctionTypeAnnotation")]
        Function(FunctionTypeAnnotation),
        #[tag("GenericTypeAnnotation")]
        Generic(GenericTypeAnnotation),
        #[tag("InterfaceTypeAnnotation")]
        Interface(InterfaceTypeAnnotation),
        #[tag("IntersectionTypeAnnotation")]
        Intersection(IntersectionTypeAnnotation),
        #[tag("MixedTypeAnnotation")]
        Mixed(MixedTypeAnnotation),
        #[tag("EmptyTypeAnnotation")]
        Empty(EmptyTypeAnnotation),
        #[tag("NullableTypeAnnotation")]
        Nullable(NullableTypeAnnotation),
        #[tag("NumberLiteralTypeAnnotation")]
        NumerLiteral(NumberLiteralTypeAnnotation),
        #[tag("NumberTypeAnnotation")]
        Number(NumberTypeAnnotation),
        #[tag("ObjectTypeAnnotation")]
        Object(ObjectTypeAnnotation),
        #[tag("StringLiteralTypeAnnotation")]
        StringLiteral(StringLiteralTypeAnnotation),
        #[tag("StringTypeAnnotation")]
        String(StringTypeAnnotation),
        #[tag("SymbolTypeAnnotation")]
        Symbol(SymbolTypeAnnotation),
        #[tag("ThisTypeAnnotation")]
        This(ThisTypeAnnotation),
        #[tag("TupleTypeAnnotation")]
        Tuple(TupleTypeAnnotation),
        #[tag("TypeofTypeAnnotation")]
        Typeof(TypeofTypeAnnotation),
        #[tag("UnionTypeAnnotation")]
        Union(UnionTypeAnnotation),
        #[tag("VoidTypeAnnotation")]
        Void(VoidTypeAnnotation),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum FlowBaseAnnotation {
        #[tag("AnyTypeAnnotation")]
        Any(AnyTypeAnnotation),
        #[tag("BooleanTypeAnnotation")]
        Boolean(BooleanTypeAnnotation),
        #[tag("NullLiteralTypeAnnotation")]
        NullLiteral(NullLiteralTypeAnnotation),
        #[tag("MixedTypeAnnotation")]
        Mixed(MixedTypeAnnotation),
        #[tag("EmptyTypeAnnotation")]
        Empty(EmptyTypeAnnotation),
        #[tag("NumberTypeAnnotation")]
        Number(NumberTypeAnnotation),
        #[tag("StringTypeAnnotation")]
        String(StringTypeAnnotation),
        #[tag("SymbolTypeAnnotation")]
        Symbol(SymbolTypeAnnotation),
        #[tag("ThisTypeAnnotation")]
        This(ThisTypeAnnotation),
        #[tag("VoidTypeAnnotation")]
        Void(VoidTypeAnnotation),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum FlowDeclaration {
        #[tag("DeclareClass")]
        Class(DeclareClass),
        #[tag("DeclareFunction")]
        Func(DeclareFunction),
        #[tag("DeclareInterface")]
        Interface(DeclareInterface),
        #[tag("DeclareModule")]
        Module(DeclareModule),
        #[tag("DeclareModuleExports")]
        ModuleExports(DeclareModuleExports),
        #[tag("DeclareTypeAlias")]
        DeclareTypeAlias(DeclareTypeAlias),
        #[tag("DeclareOpaqueType")]
        DeclareOpaqueType(DeclareOpaqueType),
        #[tag("DeclareVariable")]
        Var(DeclareVariable),
        #[tag("DeclareExportAllDeclaration")]
        ExportDecl(DeclareExportDeclaration),
        #[tag("DeclareExportAllDeclaration")]
        ExportAllDecl(DeclareExportAllDeclaration),
        #[tag("InterfaceDeclaration")]
        InterfaceDeclaration(InterfaceDeclaration),
        #[tag("OpaqueType")]
        OpaqueType(OpaqueType),
        #[tag("TypeAlias")]
        TypeAlias(TypeAlias),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum FlowPredicate {
        #[tag("DeclaredPredicate")]
        DeclaredPredicate(DeclaredPredicate),
        #[tag("InferredPredicate")]
        InferredPredicate(InferredPredicate),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: FlowType,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct AnyTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct ArrayTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        pub element_type: Box<FlowType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct BooleanTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct BooleanLiteralTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub value: bool,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct NullLiteralTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ExistsTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct FunctionTypeParam {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub name: Option<Identifier>,
        pub type_annotation: Box<FlowType>,
        #[serde(default)]
        pub optional: Option<bool>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TypeParameterDeclaration {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub params: Vec<TypeParameter>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum PlusOrMinus {
        Plus,
        Minus,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct Variance {
        #[serde(flatten)]
        pub base: BaseNode,
        pub kind: PlusOrMinus,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
        pub name: JsWord,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TypeParameterInstantiation {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub params: Vec<FlowType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct GenericTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: IdOrQualifiedId,
        #[serde(default)]
        pub type_parameters: Option<TypeParameterInstantiation>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct InterfaceExtends {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: IdOrQualifiedId,
        #[serde(default)]
        pub type_parameters: Option<TypeParameterInstantiation>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum ObjectTypePropKind {
        Init,
        Get,
        Set,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ObjectTypeSpreadProperty {
        #[serde(flatten)]
        pub base: BaseNode,
        pub argument: FlowType,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ObjectTypeAnnotProp {
        #[tag("ObjectTypeProperty")]
        Prop(ObjectTypeProperty),
        #[tag("ObjectTypeSpreadProperty")]
        Spread(ObjectTypeSpreadProperty),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ObjectTypeCallProperty {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: FlowType,
        #[serde(rename = "static")]
        pub is_static: bool,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct InterfaceTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(flatten)]
        pub extends: Option<Vec<InterfaceExtends>>,
        pub body: ObjectTypeAnnotation,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct IntersectionTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(flatten)]
        pub types: Vec<FlowType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct MixedTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct EmptyTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct NullableTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: Box<FlowType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct NumberLiteralTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: f64,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct NumberTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct StringLiteralTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub value: JsWord,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct StringTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct SymbolTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ThisTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TupleTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub types: Vec<FlowType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TypeofTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        pub argument: Box<FlowType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct UnionTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub types: Vec<FlowType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct VoidTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct ClassImplements {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
        #[serde(default)]
        pub type_parameters: Option<TypeParameterInstantiation>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct DeclareFunction {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
        #[serde(default)]
        pub predicate: Option<Box<DeclaredPredicate>>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    pub enum ModuleKind {
        #[serde(rename = "CommonJS")]
        CommonJs,
        #[serde(rename = "ES")]
        Es,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct DeclareModule {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: IdOrString,
        pub body: BlockStatement,
        #[serde(default)]
        pub kind: Option<ModuleKind>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct DeclareModuleExports {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: TypeAnnotation,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct DeclareVariable {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum DeclareExportDeclSpecifier {
        #[tag("ExportSpecifier")]
        Export(ExportSpecifier),
        #[tag("ExportNamespaceSpecifier")]
        Namespace(ExportNamespaceSpecifier),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct DeclareExportAllDeclaration {
        #[serde(flatten)]
        pub base: BaseNode,
        pub source: StringLiteral,
        #[serde(default)]
        pub export_kind: Option<ExportKind>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct DeclaredPredicate {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: Box<Flow>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct InferredPredicate {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct QualifiedTypeIdentifier {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
        pub qualification: Box<IdOrQualifiedId>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum JSX {
        #[tag("JSXAttribute")]
        Attr(JSXAttribute),
        #[tag("JSXClosingElement")]
        ClosingEl(JSXClosingElement),
        #[tag("JSXElement")]
        El(JSXElement),
        #[tag("JSXEmptyExpression")]
        EmptyExpr(JSXEmptyExpression),
        #[tag("JSXExpressionContainer")]
        ExprContainer(JSXExpressionContainer),
        #[tag("JSXSpreadChild")]
        SpreadChild(JSXSpreadChild),
        #[tag("JSXIdentifier")]
        Id(JSXIdentifier),
        #[tag("JSXMemberExpression")]
        MemberExpr(JSXMemberExpression),
        #[tag("JSXNamespacedName")]
        NamespacedName(JSXNamespacedName),
        #[tag("JSXOpeningElement")]
        OpeningEl(JSXOpeningElement),
        #[tag("JSXSpreadAttribute")]
        SpreadAttr(JSXSpreadAttribute),
        #[tag("JSXText")]
        Text(JSXText),
        #[tag("JSXFragment")]
        Fragment(JSXFragment),
        #[tag("JSXOpeningFragment")]
        OpeningFragment(JSXOpeningFragment),
        #[tag("JSXClosingFragment")]
        ClosingFragment(JSXClosingFragment),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum JSXAttrName {
        #[tag("JSXIdentifier")]
        Id(JSXIdentifier),
        #[tag("JSXNamespacedName")]
        Name(JSXNamespacedName),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum JSXAttrVal {
        #[tag("JSXElement")]
        Element(JSXElement),
        #[tag("JSXFragment")]
        Fragment(JSXFragment),
        #[tag("StringLiteral")]
        String(StringLiteral),
        #[tag("JSXExpressionContainer")]
        Expr(JSXExpressionContainer),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXAttribute")]
    pub struct JSXAttribute {
        #[serde(flatten)]
        pub base: BaseNode,
        pub name: JSXAttrName,
        #[serde(default)]
        pub value: Option<JSXAttrVal>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXClosingElement")]
    pub struct JSXClosingElement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub name: JSXElementName,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXElement")]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXEmptyExpression")]
    pub struct JSXEmptyExpression {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum JSXExprContainerExpr {
        #[tag("JSXEmptyExpression")]
        Empty(JSXEmptyExpression),
        #[tag("*")]
        Expr(Box<Expression>),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXExpressionContainer")]
    pub struct JSXExpressionContainer {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expression: JSXExprContainerExpr,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXSpreadChild")]
    pub struct JSXSpreadChild {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXIdentifier")]
    pub struct JSXIdentifier {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub name: JsWord,
    }

    impl From<Identifier> for JSXIdentifier {
        fn from(id: Identifier) -> Self {
            JSXIdentifier {
                base: id.base,
                name: id.name,
            }
        }
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum JSXMemberExprObject {
        #[tag("JSXMemberExpression")]
        Expr(JSXMemberExpression),
        #[tag("JSXIdentifier")]
        Id(JSXIdentifier),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXMemberExpression")]
    pub struct JSXMemberExpression {
        #[serde(flatten)]
        pub base: BaseNode,
        pub object: Box<JSXMemberExprObject>,
        pub property: JSXIdentifier,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXNamespacedName")]
    pub struct JSXNamespacedName {
        #[serde(flatten)]
        pub base: BaseNode,
        pub namespace: JSXIdentifier,
        pub name: JSXIdentifier,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum JSXOpeningElAttr {
        #[tag("JSXAttribute")]
        Attr(JSXAttribute),
        #[tag("JSXSpreadAttribute")]
        Spread(JSXSpreadAttribute),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXOpeningElement")]
    pub struct JSXOpeningElement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub name: JSXElementName,
        #[serde(default)]
        pub attributes: Vec<JSXOpeningElAttr>,
        #[serde(default)]
        pub self_closing: bool,
        #[serde(default)]
        pub type_parameters: Option<SuperTypeParams>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXSpreadAttribute")]
    pub struct JSXSpreadAttribute {
        #[serde(flatten)]
        pub base: BaseNode,
        pub argument: Box<Expression>,
    }

    // impl From<SpreadElement> for JSXSpreadAttribute {
    //     fn from(spread: SpreadElement) -> Self {
    //         JSXSpreadAttribute {
    //             // base: spread.base.clone(),
    //             base: spread.base,
    //             argument: spread.argument,
    //         }
    //     }
    // }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXText")]
    pub struct JSXText {
        #[serde(flatten)]
        pub base: BaseNode,
        pub value: JsWord,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXFragment")]
    pub struct JSXFragment {
        #[serde(flatten)]
        pub base: BaseNode,
        pub opening_fragment: JSXOpeningFragment,
        pub closing_fragment: JSXClosingFragment,
        #[serde(default)]
        pub children: Vec<JSXElementChild>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXOpeningFragment")]
    pub struct JSXOpeningFragment {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde("JSXClosingElement")]
    pub struct JSXClosingFragment {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum JSXElementName {
        #[tag("JSXIdentifier")]
        Id(JSXIdentifier),
        #[tag("JSXMemberExpression")]
        Expr(JSXMemberExpression),
        #[tag("JSXNamespacedName")]
        Name(JSXNamespacedName),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum JSXElementChild {
        #[tag("JSXText")]
        Text(JSXText),
        #[tag("JSXExpressionContainer")]
        Expr(JSXExpressionContainer),
        #[tag("JSXSpreadChild")]
        Spread(JSXSpreadChild),
        #[tag("JSXElement")]
        Element(JSXElement),
        #[tag("JSXFragment")]
        Fragment(JSXFragment),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ModuleDeclaration {
        #[tag("ExportAllDeclaration")]
        ExportAll(ExportAllDeclaration),
        #[tag("ExportDefaultDeclaration")]
        ExportDefault(ExportDefaultDeclaration),
        #[tag("ExportNamedDeclaration")]
        ExportNamed(ExportNamedDeclaration),
        #[tag("ImportDeclaration")]
        Import(ImportDeclaration),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ExportDeclaration {
        #[tag("ExportAllDeclaration")]
        ExportAll(ExportAllDeclaration),
        #[tag("ExportDefaultDeclaration")]
        ExportDefault(ExportDefaultDeclaration),
        #[tag("ExportNamedDeclaration")]
        ExportNamed(ExportNamedDeclaration),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ModuleSpecifier {
        #[tag("ExportSpecifier")]
        Export(ExportSpecifier),
        #[tag("ImportDefaultSpecifier")]
        ImportDefault(ImportDefaultSpecifier),
        #[tag("ImportNamespaceSpecifier")]
        ImportNamespace(ImportNamespaceSpecifier),
        #[tag("ImportSpecifier")]
        Import(ImportSpecifier),
        #[tag("ExportNamespaceSpecifier")]
        ExportNamespace(ExportNamespaceSpecifier),
        #[tag("ExportDefaultSpecifier")]
        ExportDefault(ExportDefaultSpecifier),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct InterpreterDirective {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub value: JsWord,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum SrcType {
        Script,
        Module,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum ExportKind {
        Type,
        Value,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct ExportSpecifier {
        #[serde(flatten)]
        pub base: BaseNode,
        pub local: Identifier,
        pub exported: IdOrString,
        pub export_kind: ExportKind,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ExportDefaultSpecifier {
        #[serde(flatten)]
        pub base: BaseNode,
        pub exported: Identifier,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ExportNamespaceSpecifier {
        #[serde(flatten)]
        pub base: BaseNode,
        pub exported: Identifier,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ExportDefaultDeclType {
        #[tag("FunctionDeclaration")]
        Func(FunctionDeclaration),
        #[tag("TSDeclareFunction")]
        TSFunc(TSDeclareFunction),
        #[tag("ClassDeclaration")]
        Class(ClassDeclaration),
        #[tag("*")]
        Expr(Box<Expression>),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ExportDefaultDeclaration {
        #[serde(flatten)]
        pub base: BaseNode,
        pub declaration: ExportDefaultDeclType,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ExportSpecifierType {
        #[tag("ExportSpecifier")]
        Export(ExportSpecifier),
        #[tag("ExportDefaultSpecifier")]
        Default(ExportDefaultSpecifier),
        #[tag("ExportNamespaceSpecifier")]
        Namespace(ExportNamespaceSpecifier),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
        pub export_kind: Option<ExportKind>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct Import {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ImportAttribute {
        #[serde(flatten)]
        pub base: BaseNode,
        pub key: IdOrString,
        pub value: StringLiteral,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct ImportSpecifier {
        #[serde(flatten)]
        pub base: BaseNode,
        pub local: Identifier,
        pub imported: IdOrString,
        #[serde(default)]
        pub import_kind: Option<ImportKind>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ImportDefaultSpecifier {
        #[serde(flatten)]
        pub base: BaseNode,
        pub local: Identifier,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ImportNamespaceSpecifier {
        #[serde(flatten)]
        pub base: BaseNode,
        pub local: Identifier,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ImportSpecifierType {
        #[tag("ImportSpecifier")]
        Import(ImportSpecifier),
        #[tag("ImportDefaultSpecifier")]
        Default(ImportDefaultSpecifier),
        #[tag("ImportNamespaceSpecifier")]
        Namespace(ImportNamespaceSpecifier),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum ImportKind {
        Type,
        Typeof,
        Value,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum UserWhitespacable {
        #[tag("ObjectMethod")]
        ObjectMethod(ObjectMethod),
        #[tag("ObjectProperty")]
        ObjectProperty(ObjectProperty),
        #[tag("ObjectTypeInternalSlot")]
        ObjectTypeInternalSlot(ObjectTypeInternalSlot),
        #[tag("ObjectTypeCallProperty")]
        ObjectTypeCallProperty(ObjectTypeCallProperty),
        #[tag("ObjectTypeIndexer")]
        ObjectTypeIndexer(ObjectTypeIndexer),
        #[tag("ObjectTypeProperty")]
        ObjectTypeProperty(ObjectTypeProperty),
        #[tag("ObjectTypeSpreadProperty")]
        ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ObjectMember {
        #[tag("ObjectMember")]
        Method(ObjectMethod),
        #[tag("ObjectProperty")]
        Prop(ObjectProperty),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "lowercase")]
    pub enum ObjectMethodKind {
        Method,
        Get,
        Set,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ObjectKey {
        #[tag("Identifier")]
        Id(Identifier),
        #[tag("StringLiteral")]
        String(StringLiteral),
        #[tag("NumericLiteral")]
        Numeric(NumericLiteral),
        #[tag("*")]
        Expr(Box<Expression>),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct ObjectMethod {
        #[serde(flatten)]
        pub base: BaseNode,
        pub kind: ObjectMethodKind,
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
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        #[serde(default)]
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ObjectPropVal {
        #[tag("Identifier")]
        #[tag("RestElement")]
        #[tag("AssignmentPattern")]
        #[tag("ArrayPattern")]
        #[tag("ObjectPattern")]
        Pattern(PatternLike),
        #[tag("*")]
        Expr(Box<Expression>),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum Pattern {
        #[tag("AssignmentPattern")]
        Assignment(AssignmentPattern),
        #[tag("ArrayPattern")]
        Array(ArrayPattern),
        #[tag("ObjectPattern")]
        Object(ObjectPattern),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ObjectPatternProp {
        #[tag("RestElement")]
        Rest(RestElement),
        #[tag("ObjectProperty")]
        Prop(ObjectProperty),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum AssignmentPatternLeft {
        #[tag("Identifier")]
        Id(Identifier),
        #[tag("ObjectPattern")]
        Object(ObjectPattern),
        #[tag("ArrayPattern")]
        Array(ArrayPattern),
        #[tag("MemberExpression")]
        Member(MemberExpression),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct AssignmentPattern {
        #[serde(flatten)]
        pub base: BaseNode,
        pub left: AssignmentPatternLeft,
        pub right: Box<Expression>,
        #[serde(default)]
        pub decorators: Option<Vec<Decorator>>,
        #[serde(default)]
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ArrayPattern {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub elements: Vec<Option<PatternLike>>,
        #[serde(default)]
        pub decorators: Option<Vec<Decorator>>,
        #[serde(default)]
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum Statement {
        #[tag("BlockStatement")]
        Block(BlockStatement),
        #[tag("BreakStatement")]
        Break(BreakStatement),
        #[tag("ContinueStatement")]
        Continue(ContinueStatement),
        #[tag("DebuggerStatement")]
        Debugger(DebuggerStatement),
        #[tag("DoWhileStatement")]
        DoWhile(DoWhileStatement),
        #[tag("EmptyStatement")]
        Empty(EmptyStatement),
        #[tag("ExpressionStatement")]
        Expr(ExpressionStatement),
        #[tag("ForInStatement")]
        ForIn(ForInStatement),
        #[tag("ForStatement")]
        For(ForStatement),
        #[tag("FunctionDeclaration")]
        FuncDecl(FunctionDeclaration),
        #[tag("IfStatement")]
        If(IfStatement),
        #[tag("LabeledStatement")]
        Labeled(LabeledStatement),
        #[tag("ReturnStatement")]
        Return(ReturnStatement),
        #[tag("SwitchStatement")]
        Switch(SwitchStatement),
        #[tag("ThrowStatement")]
        Throw(ThrowStatement),
        #[tag("TryStatement")]
        Try(TryStatement),
        #[tag("VariableDeclaration")]
        VarDecl(VariableDeclaration),
        #[tag("WhileStatement")]
        While(WhileStatement),
        #[tag("WithStatement")]
        With(WithStatement),
        #[tag("ClassDeclaration")]
        ClassDecl(ClassDeclaration),
        #[tag("ExportAllDeclaration")]
        ExportAllDecl(ExportAllDeclaration),
        #[tag("ExportDefaultDeclaration")]
        ExportDefaultDecl(ExportDefaultDeclaration),
        #[tag("ExportNamedDeclaration")]
        ExportNamedDecl(ExportNamedDeclaration),
        #[tag("ForOfStatement")]
        ForOf(ForOfStatement),
        #[tag("ImportDeclaration")]
        ImportDecl(ImportDeclaration),
        #[tag("DeclareClass")]
        DeclClass(DeclareClass),
        #[tag("DeclareFunction")]
        DeclFunc(DeclareFunction),
        #[tag("DeclareInterface")]
        DeclInterface(DeclareInterface),
        #[tag("DeclareModule")]
        DeclModule(DeclareModule),
        #[tag("DeclareModuleExports")]
        DeclareModuleExports(DeclareModuleExports),
        #[tag("DeclareTypeAlias")]
        DeclTypeAlias(DeclareTypeAlias),
        #[tag("DeclareOpaqueType")]
        DeclOpaqueType(DeclareOpaqueType),
        #[tag("DeclareVariable")]
        DeclVar(DeclareVariable),
        #[tag("DeclareExportDeclaration")]
        DeclExportDeclaration(DeclareExportDeclaration),
        #[tag("DeclareExportAllDeclaration")]
        DeclExportAllDeclaration(DeclareExportAllDeclaration),
        #[tag("InterfaceDeclaration")]
        InterfaceDecl(InterfaceDeclaration),
        #[tag("OpaqueType")]
        OpaqueType(OpaqueType),
        #[tag("TypeAlias")]
        TypeAlias(TypeAlias),
        #[tag("EnumDeclaration")]
        EnumDecl(EnumDeclaration),
        #[tag("TSDeclareFunction")]
        TSDeclFunc(TSDeclareFunction),
        #[tag("TSInterfaceDeclaration")]
        TSInterfaceDecl(TSInterfaceDeclaration),
        #[tag("TSTypeAliasDeclaration")]
        TSTypeAliasDecl(TSTypeAliasDeclaration),
        #[tag("TSEnumDeclaration")]
        TSEnumDecl(TSEnumDeclaration),
        #[tag("TSModuleDeclaration")]
        TSModuleDecl(TSModuleDeclaration),
        #[tag("TSImportEqualsDeclaration")]
        TSImportEqualsDecl(TSImportEqualsDeclaration),
        #[tag("TSExportAssignment")]
        TSExportAssignment(TSExportAssignment),
        #[tag("TSNamespaceExportDeclaration")]
        TSNamespaceExportDecl(TSNamespaceExportDeclaration),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum CompletionStatement {
        #[tag("BreakStatement")]
        Break(BreakStatement),
        #[tag("ContinueStatement")]
        Continue(ContinueStatement),
        #[tag("ReturnStatement")]
        Return(ReturnStatement),
        #[tag("ThrowStatement")]
        Throw(ThrowStatement),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum Loop {
        #[tag("DoWhileStatement")]
        DoWhile(DoWhileStatement),
        #[tag("ForInStatement")]
        ForIn(ForInStatement),
        #[tag("ForStatement")]
        For(ForStatement),
        #[tag("WhileStatement")]
        While(WhileStatement),
        #[tag("ForOfStatement")]
        ForOf(ForOfStatement),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum For {
        #[tag("ForInStatement")]
        InStmt(ForInStatement),
        #[tag("ForStatement")]
        Stmt(ForStatement),
        #[tag("ForOfStatement")]
        OfStmt(ForOfStatement),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ForXStatement {
        #[tag("ForInStatement")]
        ForIn(ForInStatement),
        #[tag("ForOfStatement")]
        ForOf(ForOfStatement),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum While {
        #[tag("DoWhileStatement")]
        DoWhile(DoWhileStatement),
        #[tag("WhileStatement")]
        While(WhileStatement),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct BlockStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub body: Vec<Statement>,
        #[serde(default)]
        pub directives: Vec<Directive>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct BreakStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub label: Option<Identifier>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ContinueStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub label: Option<Identifier>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct DebuggerStatement {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct DoWhileStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub test: Box<Expression>,
        pub body: Box<Statement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct EmptyStatement {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ExpressionStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ForStmtInit {
        #[tag("VariableDeclaration")]
        VarDecl(VariableDeclaration),
        #[tag("*")]
        Expr(Box<Expression>),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum ForStmtLeft {
        #[tag("VariableDeclaration")]
        VarDecl(VariableDeclaration),
        #[tag("*")]
        LVal(LVal),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ForInStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub left: ForStmtLeft,
        pub right: Box<Expression>,
        pub body: Box<Statement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ForStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub init: Option<ForStmtInit>,
        #[serde(default)]
        pub test: Option<Box<Expression>>,
        #[serde(default)]
        pub update: Option<Box<Expression>>,
        pub body: Box<Statement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ForOfStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub left: ForStmtLeft,
        pub right: Box<Expression>,
        pub body: Box<Statement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct IfStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub test: Box<Expression>,
        pub consequent: Box<Statement>,
        #[serde(default)]
        pub alternate: Option<Box<Statement>>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct LabeledStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub label: Identifier,
        pub body: Box<Statement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ReturnStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub argument: Option<Box<Expression>>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct SwitchCase {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub test: Option<Box<Expression>>,
        #[serde(default)]
        pub consequent: Vec<Statement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct SwitchStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub discriminant: Box<Expression>,
        #[serde(default)]
        pub cases: Vec<SwitchCase>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct ThrowStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub argument: Box<Expression>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum CatchClauseParam {
        #[tag("Identifier")]
        Id(Identifier),
        #[tag("ArrayPattern")]
        Array(ArrayPattern),
        #[tag("ObjectPattern")]
        Object(ObjectPattern),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct CatchClause {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub param: Option<CatchClauseParam>,
        pub body: BlockStatement,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct WhileStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub test: Box<Expression>,
        pub body: Box<Statement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct WithStatement {
        #[serde(flatten)]
        pub base: BaseNode,
        pub object: Box<Expression>,
        pub body: Box<Statement>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSTypeElement {
        #[tag("TSCallSignatureDeclaration")]
        CallSignatureDecl(TSCallSignatureDeclaration),
        #[tag("TSConstructSignatureDeclaration")]
        ConstructSignatureDecl(TSConstructSignatureDeclaration),
        #[tag("TSPropertySignature")]
        PropSignature(TSPropertySignature),
        #[tag("TSMethodSignature")]
        MethodSignature(TSMethodSignature),
        #[tag("TSIndexSignature")]
        IndexSignature(TSIndexSignature),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSType {
        #[tag("TSAnyKeyword")]
        AnyKeyword(TSAnyKeyword),
        #[tag("TSBooleanKeyword")]
        BooleanKeyword(TSBooleanKeyword),
        #[tag("TSBigIntKeyword")]
        BigIntKeyword(TSBigIntKeyword),
        #[tag("TSIntrinsicKeyword")]
        IntrinsicKeyword(TSIntrinsicKeyword),
        #[tag("TSNeverKeyword")]
        NeverKeyword(TSNeverKeyword),
        #[tag("TSNullKeyword")]
        NullKeyword(TSNullKeyword),
        #[tag("TSNumberKeyword")]
        NumberKeyword(TSNumberKeyword),
        #[tag("TSObjectKeyword")]
        ObjectKeyword(TSObjectKeyword),
        #[tag("TSStringKeyword")]
        StringKeyword(TSStringKeyword),
        #[tag("TSSymbolKeyword")]
        SymbolKeyword(TSSymbolKeyword),
        #[tag("TSUndefinedKeyword")]
        UndefinedKeyword(TSUndefinedKeyword),
        #[tag("TSUnknownKeyword")]
        UnknownKeyword(TSUnknownKeyword),
        #[tag("TSVoidKeyword")]
        VoidKeyword(TSVoidKeyword),
        #[tag("TSThisType")]
        This(TSThisType),
        #[tag("TSFunctionType")]
        Function(TSFunctionType),
        #[tag("TSConstructorType")]
        Constructor(TSConstructorType),
        #[tag("TSTypeReference")]
        TypeRef(TSTypeReference),
        #[tag("TSTypePredicate")]
        TypePredicate(TSTypePredicate),
        #[tag("TSTypeQuery")]
        TypeQuery(TSTypeQuery),
        #[tag("TSTypeLiteral")]
        TypeLiteral(TSTypeLiteral),
        #[tag("TSArrayType")]
        Array(TSArrayType),
        #[tag("TSTupleType")]
        Tuple(TSTupleType),
        #[tag("TSOptionalType")]
        Optional(TSOptionalType),
        #[tag("TSRestType")]
        Rest(TSRestType),
        #[tag("TSUnionType")]
        Union(TSUnionType),
        #[tag("TSIntersectionType")]
        Intersection(TSIntersectionType),
        #[tag("TSConditionalType")]
        Conditional(TSConditionalType),
        #[tag("TSInferType")]
        Infer(TSInferType),
        #[tag("TSParenthesizedType")]
        Parenthesized(TSParenthesizedType),
        #[tag("TSTypeOperator")]
        TypeOp(TSTypeOperator),
        #[tag("TSIndexedAccessType")]
        IndexedAccess(TSIndexedAccessType),
        #[tag("TSMappedType")]
        Mapped(TSMappedType),
        #[tag("TSLiteralType")]
        Literal(TSLiteralType),
        #[tag("TSExpressionWithTypeArguments")]
        ExprWithArgs(TSExpressionWithTypeArguments),
        #[tag("TSImportType")]
        Import(TSImportType),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSBaseType {
        #[tag("TSAnyKeyword")]
        Any(TSAnyKeyword),
        #[tag("TSBooleanKeyword")]
        Boolean(TSBooleanKeyword),
        #[tag("TSBigIntKeyword")]
        BigInt(TSBigIntKeyword),
        #[tag("TSIntrinsicKeyword")]
        Intrinsic(TSIntrinsicKeyword),
        #[tag("TSNeverKeyword")]
        Never(TSNeverKeyword),
        #[tag("TSNullKeyword")]
        Null(TSNullKeyword),
        #[tag("TSNumberKeyword")]
        Number(TSNumberKeyword),
        #[tag("TSObjectKeyword")]
        Object(TSObjectKeyword),
        #[tag("TSStringKeyword")]
        String(TSStringKeyword),
        #[tag("TSSymbolKeyword")]
        Symbol(TSSymbolKeyword),
        #[tag("TSUndefinedKeyword")]
        Undefined(TSUndefinedKeyword),
        #[tag("TSUnknownKeyword")]
        Unknown(TSUnknownKeyword),
        #[tag("TSVoidKeyword")]
        Void(TSVoidKeyword),
        #[tag("TSThisType")]
        This(TSThisType),
        #[tag("TSLiteralType")]
        Literal(TSLiteralType),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSTypeAnnotation {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: TSType,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSParamPropParam {
        #[tag("Identifier")]
        Id(Identifier),
        #[tag("AssignmentPattern")]
        Assignment(AssignmentPattern),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSFuncDeclTypeParams {
        #[tag("TSTypeParameterDeclaration")]
        Type(TSTypeParameterDeclaration),
        #[tag("Noop")]
        Noop(Noop),
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSFuncDeclTypeAnnot {
        #[tag("TSTypeAnnotation")]
        Type(Box<TSTypeAnnotation>),
        #[tag("Noop")]
        Noop(Noop),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSQualifiedName {
        #[serde(flatten)]
        pub base: BaseNode,
        pub left: Box<TSEntityName>,
        pub right: Identifier,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSPropertySignature {
        #[serde(flatten)]
        pub base: BaseNode,
        pub key: Box<Expression>,
        #[serde(default)]
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
        #[serde(default)]
        pub initializer: Option<Box<Expression>>,
        #[serde(default)]
        pub computed: Option<bool>,
        #[serde(default)]
        pub optional: Option<bool>,
        #[serde(default)]
        pub readonly: Option<bool>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSMethodSignature {
        #[serde(flatten)]
        pub base: BaseNode,
        pub key: Box<Expression>,
        #[serde(default)]
        pub type_parameters: Option<TSTypeParameterDeclaration>,
        #[serde(default)]
        pub parameters: Vec<IdOrRest>,
        #[serde(default)]
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
        #[serde(default)]
        pub computed: Option<bool>,
        #[serde(default)]
        pub optional: Option<bool>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSIndexSignature {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub paramters: Vec<Identifier>,
        #[serde(default)]
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
        #[serde(default)]
        pub readonly: Option<bool>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSAnyKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSBooleanKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSBigIntKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSIntrinsicKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSNeverKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSNullKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSNumberKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSObjectKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSStringKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSSymbolKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSUndefinedKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSUnknownKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSVoidKeyword {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSThisType {
        #[serde(flatten)]
        pub base: BaseNode,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSEntityName {
        #[tag("Identifier")]
        Id(Identifier),
        #[tag("TSQualifiedName")]
        Qualified(TSQualifiedName),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSTypeReference {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_name: TSEntityName,
        #[serde(default)]
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSTypePredicateParamName {
        #[tag("Identifier")]
        Id(Identifier),
        #[tag("TSThisType")]
        This(TSThisType),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSTypeQueryExprName {
        #[tag("Identifier")]
        #[tag("TSQualifiedName")]
        EntityName(TSEntityName),
        #[tag("TSImportType")]
        ImportType(TSImportType),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSTypeQuery {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expr_name: TSTypeQueryExprName,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSTypeLiteral {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub members: Vec<TSTypeElement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSArrayType {
        #[serde(flatten)]
        pub base: BaseNode,
        pub element_type: Box<TSType>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSTupleTypeElType {
        #[tag("TSNamedTupleMember")]
        Member(TSNamedTupleMember),
        #[tag("*")]
        TSType(TSType),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSTupleType {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub element_types: Vec<TSTupleTypeElType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSOptionalType {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: Box<TSType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSRestType {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: Box<TSType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSUnionType {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub types: Vec<TSType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSIntersectionType {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub types: Vec<TSType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSInferType {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_parameter: Box<TSTypeParameter>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSParenthesizedType {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: Box<TSType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSTypeOperator {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: Box<TSType>,
        #[serde(default)]
        pub operator: JsWord,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSIndexedAccessType {
        #[serde(flatten)]
        pub base: BaseNode,
        pub object_type: Box<TSType>,
        pub index_type: Box<TSType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSLiteralTypeLiteral {
        #[tag("NumericLiteral")]
        Numeric(NumericLiteral),
        #[tag("StringLiteral")]
        String(StringLiteral),
        #[tag("BooleanLiteral")]
        Boolean(BooleanLiteral),
        #[tag("BigIntLiteral")]
        BigInt(BigIntLiteral),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSLiteralType {
        #[serde(flatten)]
        pub base: BaseNode,
        pub literal: TSLiteralTypeLiteral,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSExpressionWithTypeArguments {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expression: TSEntityName,
        #[serde(default)]
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSInterfaceBody {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub body: Vec<TSTypeElement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSAsExpression {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expression: Box<Expression>,
        pub type_annotation: TSType,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    #[serde(tag = "type")]
    pub struct TSTypeAssertion {
        #[serde(flatten)]
        pub base: BaseNode,
        pub type_annotation: TSType,
        pub expression: Box<Expression>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
        pub initializer: Option<Box<Expression>>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSEnumMember {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: IdOrString,
        #[serde(default)]
        pub initializer: Option<Box<Expression>>,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSModuleDeclBody {
        #[tag("TSModuleBlock")]
        Block(TSModuleBlock),
        #[tag("TSModuleDeclaration")]
        Decl(TSModuleDeclaration),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSModuleBlock {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub body: Vec<Statement>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, PartialEq)]
    #[ast_serde]
    pub enum TSImportEqualsDeclModuleRef {
        #[tag("Identifier")]
        #[tag("TSQualifiedName")]
        Name(TSEntityName),
        #[tag("TSExternalModuleReference")]
        External(TSExternalModuleReference),
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSExternalModuleReference {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expression: StringLiteral,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSNonNullExpression {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSExportAssignment {
        #[serde(flatten)]
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSNamespaceExportDeclaration {
        #[serde(flatten)]
        pub base: BaseNode,
        pub id: Identifier,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSTypeParameterInstantiation {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub params: Vec<TSType>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSTypeParameterDeclaration {
        #[serde(flatten)]
        pub base: BaseNode,
        pub params: Vec<TSTypeParameter>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
    #[serde(tag = "type")]
    pub struct TSTypeParameter {
        #[serde(flatten)]
        pub base: BaseNode,
        #[serde(default)]
        pub constraint: Option<Box<TSType>>,
        #[serde(default)]
        pub default: Option<Box<TSType>>,
        #[serde(default)]
        pub name: JsWord,
    }
}
