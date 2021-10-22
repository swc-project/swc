use serde_json::Value;
use std::any::Any;
use swc_atoms::JsWord;
use swc_babel_ast::*;
use swc_visit::define;

pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

define!({
    pub enum Class {
        Expr(ClassExpression),
        Decl(ClassDeclaration),
    }
    pub enum ClassMethodKind {
        Get,
        Set,
        Method,
        Constructor,
    }
    pub struct ClassMethod {
        pub base: BaseNode,
        pub kind: Option<ClassMethodKind>,
        pub key: ObjectKey,
        pub params: Vec<Param>,
        pub body: BlockStatement,
        pub computed: Option<bool>,
        pub is_static: Option<bool>,
        pub generator: Option<bool>,
        pub is_async: Option<bool>,
        pub is_abstract: Option<bool>,
        pub access: Option<Access>,
        pub accessibility: Option<Access>,
        pub decorators: Option<Vec<Decorator>>,
        pub optional: Option<bool>,
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }
    pub struct ClassPrivateProperty {
        pub base: BaseNode,
        pub key: PrivateName,
        pub value: Option<Box<Expression>>,
        pub decorators: Option<Vec<Decorator>>,
        pub static_any: Value,
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }
    pub struct ClassPrivateMethod {
        pub base: BaseNode,
        pub kind: Option<ClassMethodKind>,
        pub key: PrivateName,
        pub params: Vec<Param>,
        pub body: BlockStatement,
        pub is_static: Option<bool>,
        pub is_abstract: Option<bool>,
        pub access: Option<Access>,
        pub accessibility: Option<Access>,
        pub is_async: Option<bool>,
        pub computed: Option<bool>,
        pub decorators: Option<Vec<Decorator>>,
        pub generator: Option<bool>,
        pub optional: Option<bool>,
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }
    pub struct ClassProperty {
        pub base: BaseNode,
        pub key: ObjectKey,
        pub value: Option<Box<Expression>>,
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
        pub decorators: Option<Vec<Decorator>>,
        pub computed: Option<bool>,
        pub is_static: Option<bool>,
        pub is_abstract: Option<bool>,
        pub accessibility: Option<Access>,
        pub declare: Option<bool>,
        pub definite: Option<bool>,
        pub optional: Option<bool>,
        pub readonly: Option<bool>,
    }
    pub struct StaticBlock {
        pub base: BaseNode,
        pub body: Vec<Statement>,
    }
    pub enum ClassBodyEl {
        Method(ClassMethod),
        PrivateMethod(ClassPrivateMethod),
        Prop(ClassProperty),
        PrivateProp(ClassPrivateProperty),
        TSMethod(TSDeclareMethod),
        TSIndex(TSIndexSignature),
        StaticBlock(StaticBlock),
    }
    pub struct ClassBody {
        pub base: BaseNode,
        pub body: Vec<ClassBodyEl>,
    }
    pub enum ClassImpl {
        TSExpr(TSExpressionWithTypeArguments),
        Implements(ClassImplements),
    }
    pub struct ClassDeclaration {
        pub base: BaseNode,
        pub id: Identifier,
        pub super_class: Option<Box<Expression>>,
        pub body: ClassBody,
        pub decorators: Option<Vec<Decorator>>,
        pub is_abstract: Option<bool>,
        pub declare: Option<bool>,
        pub implements: Option<Vec<ClassImpl>>,
        pub mixins: Option<InterfaceExtends>,
        pub super_type_parameters: Option<SuperTypeParams>,
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }
    pub struct BaseComment {
        pub value: String,
        pub start: usize,
        pub end: usize,
        pub loc: Loc,
    }
    pub enum Comment {
        Block(BaseComment),
        Line(BaseComment),
    }
    pub enum CommentTypeShorthand {
        Leading,
        Inner,
        Trailing,
    }
    pub struct LineCol {
        pub line: usize,
        pub column: usize,
    }
    pub struct Loc {
        pub start: LineCol,
        pub end: LineCol,
    }
    pub struct BaseNode {
        pub leading_comments: Vec<Comment>,
        pub inner_comments: Vec<Comment>,
        pub trailing_comments: Vec<Comment>,
        pub start: Option<usize>,
        pub end: Option<usize>,
        pub loc: Option<Loc>,
    }
    pub enum Binary {
        BinaryExpr(BinaryExpression),
        LogicalExpr(LogicalExpression),
    }
    pub enum Conditional {
        Expr(ConditionalExpression),
        If(IfStatement),
    }
    pub enum EnumBody {
        Boolean(EnumBooleanBody),
        Number(EnumNumberBody),
        String(EnumStringBody),
        Symbol(EnumSymbolBody),
    }
    pub enum EnumMember {
        Boolean(EnumBooleanMember),
        Number(EnumNumberMember),
        String(EnumStringMember),
        Defaulted(EnumDefaultedMember),
    }
    pub enum Function {
        Decl(FunctionDeclaration),
        Expr(FunctionExpression),
        ObjectMethod(ObjectMethod),
        Arrow(ArrowFunctionExpression),
        ClassMethod(ClassMethod),
        ClassPrivateMethod(ClassPrivateMethod),
    }
    pub enum FunctionParent {
        Decl(FunctionDeclaration),
        Expr(FunctionExpression),
        ObjectMethod(ObjectMethod),
        Arrow(ArrowFunctionExpression),
        ClassMethod(ClassMethod),
        ClassPrivateMethod(ClassPrivateMethod),
    }
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
    pub enum Method {
        Object(ObjectMethod),
        Class(ClassMethod),
        ClassPrivate(ClassPrivateMethod),
    }
    pub enum Private {
        ClassProp(ClassPrivateProperty),
        ClassMethod(ClassPrivateMethod),
        Name(PrivateName),
    }
    pub enum Property {
        ObjectProp(ObjectProperty),
        ClassProp(ClassProperty),
        ClassPrivateProp(ClassPrivateProperty),
    }
    pub enum Pureish {
        FunctionDecl(FunctionDeclaration),
        FunctionExpr(FunctionExpression),
        StringLiteral(StringLiteral),
        NumericLiteral(NumericLiteral),
        NullLiteral(NullLiteral),
        BooleanLiteral(BooleanLiteral),
        RegExpLiteral(RegExpLiteral),
        ArrowFuncExpr(ArrowFunctionExpression),
        BigIntLiteral(BigIntLiteral),
        DecimalLiteral(DecimalLiteral),
    }
    pub enum Scopable {
        BlockStmt(BlockStatement),
        CatchClause(CatchClause),
        DoWhileStmt(DoWhileStatement),
        ForInStmt(ForInStatement),
        ForStmt(ForStatement),
        FuncDecl(FunctionDeclaration),
        FuncExpr(FunctionExpression),
        Program(Program),
        ObjectMethod(ObjectMethod),
        SwitchStmt(SwitchStatement),
        WhileStmt(WhileStatement),
        ArrowFuncExpr(ArrowFunctionExpression),
        ClassExpr(ClassExpression),
        ClassDecl(ClassDeclaration),
        ForOfStmt(ForOfStatement),
        ClassMethod(ClassMethod),
        ClassPrivateMethod(ClassPrivateMethod),
        StaticBlock(StaticBlock),
        TSModuleBlock(TSModuleBlock),
    }
    pub enum BlockParent {
        BlockStmt(BlockStatement),
        CatchClause(CatchClause),
        DoWhileStmt(DoWhileStatement),
        ForInStmt(ForInStatement),
        ForStmt(ForStatement),
        FuncDecl(FunctionDeclaration),
        FuncExpr(FunctionExpression),
        Program(Program),
        ObjectMethod(ObjectMethod),
        SwitchStmt(SwitchStatement),
        WhileStmt(WhileStatement),
        ArrowFuncExpr(ArrowFunctionExpression),
        ForOfStmt(ForOfStatement),
        ClassMethod(ClassMethod),
        ClassPrivateMethod(ClassPrivateMethod),
        StaticBlock(StaticBlock),
        TSModuleBlock(TSModuleBlock),
    }
    pub enum Block {
        BlockStmt(BlockStatement),
        Program(Program),
        TSModuleBlock(TSModuleBlock),
    }
    pub enum Terminatorless {
        Break(BreakStatement),
        Continue(ContinueStatement),
        Return(ReturnStatement),
        Throw(ThrowStatement),
        Yield(YieldExpression),
        Await(AwaitExpression),
    }
    pub enum UnaryLike {
        Expr(UnaryExpression),
        Spread(SpreadElement),
    }
    pub struct SpreadElement {
        pub base: BaseNode,
        pub argument: Box<Expression>,
    }
    pub struct SpreadProperty {
        pub base: BaseNode,
        pub argument: Box<Expression>,
    }
    pub struct RestElement {
        pub base: BaseNode,
        pub argument: Box<LVal>,
        pub decorators: Option<Vec<Decorator>>,
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }
    pub struct RestProperty {
        pub base: BaseNode,
        pub argument: LVal,
        pub decorators: Option<Vec<Decorator>>,
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }
    pub struct Identifier {
        pub base: BaseNode,
        pub name: JsWord,
        pub decorators: Option<Vec<Decorator>>,
        pub optional: Option<bool>,
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }
    pub enum IdOrQualifiedId {
        Id(Identifier),
        QualifiedId(QualifiedTypeIdentifier),
    }
    pub enum IdOrString {
        Id(Identifier),
        String(StringLiteral),
    }
    pub enum IdOrRest {
        Id(Identifier),
        Rest(RestElement),
    }
    pub struct Decorator {
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }
    pub struct Noop {
        pub base: BaseNode,
    }
    pub enum Param {
        Id(Identifier),
        Pat(Pattern),
        Rest(RestElement),
        TSProp(TSParameterProperty),
    }
    pub enum LVal {
        Id(Identifier),
        MemberExpr(MemberExpression),
        RestEl(RestElement),
        AssignmentPat(AssignmentPattern),
        ArrayPat(ArrayPattern),
        ObjectPat(ObjectPattern),
        TSParamProp(TSParameterProperty),
    }
    pub enum PatternLike {
        Id(Identifier),
        RestEl(RestElement),
        AssignmentPat(AssignmentPattern),
        ArrayPat(ArrayPattern),
        ObjectPat(ObjectPattern),
    }
    pub enum TypeAnnotOrNoop {
        Flow(TypeAnnotation),
        TS(Box<TSTypeAnnotation>),
        Noop(Noop),
    }
    pub enum TypeParamDeclOrNoop {
        Flow(TypeParameterDeclaration),
        TS(TSTypeParameterDeclaration),
        Noop(Noop),
    }
    pub enum SuperTypeParams {
        Flow(TypeParameterInstantiation),
        TS(TSTypeParameterInstantiation),
    }
    pub struct PrivateName {
        pub base: BaseNode,
        pub id: Identifier,
    }
    pub enum Access {
        Public,
        Private,
        Protected,
    }
    pub struct MetaProperty {
        pub base: BaseNode,
        pub meta: Identifier,
        pub property: Identifier,
    }
    pub struct Directive {
        pub base: BaseNode,
        pub value: DirectiveLiteral,
    }
    pub struct DirectiveLiteral {
        pub base: BaseNode,
        pub value: JsWord,
    }
    pub struct PipelineBareFunction {
        pub base: BaseNode,
        pub callee: Box<Expression>,
    }
    pub struct PipelineTopicExpression {
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }
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
    pub struct Placeholder {
        pub base: BaseNode,
        pub expected_node: PlaceholderExpectedNode,
        pub name: Identifier,
    }
    pub enum Declaration {
        FuncDecl(FunctionDeclaration),
        VarDecl(VariableDeclaration),
        ClassDecl(ClassDeclaration),
        ExportAllDecl(ExportAllDeclaration),
        ExportDefaultDecl(ExportDefaultDeclaration),
        ExportNamedDecl(ExportNamedDeclaration),
        ImportDecl(ImportDeclaration),
        DeclClass(DeclareClass),
        DeclFunc(DeclareFunction),
        DeclInterface(DeclareInterface),
        DeclModule(DeclareModule),
        DeclModuleExports(DeclareModuleExports),
        DeclTypeAlias(DeclareTypeAlias),
        DeclOpaqueType(DeclareOpaqueType),
        DeclVar(DeclareVariable),
        DeclExportDecl(DeclareExportDeclaration),
        DeclExportAllDecl(DeclareExportAllDeclaration),
        InterfaceDecl(InterfaceDeclaration),
        OpaqueType(OpaqueType),
        TypeAlias(TypeAlias),
        EnumDecl(EnumDeclaration),
        TSDeclFunc(TSDeclareFunction),
        TSInterfaceDecl(TSInterfaceDeclaration),
        TSTypeAliasDecl(TSTypeAliasDeclaration),
        TSEnumDecl(TSEnumDeclaration),
        TSModuleDecl(TSModuleDeclaration),
    }
    pub enum VariableDeclarationKind {
        Var,
        Let,
        Const,
    }
    pub struct VariableDeclarator {
        pub base: BaseNode,
        pub id: LVal,
        pub init: Option<Box<Expression>>,
        pub definite: Option<bool>,
    }
    pub struct VariableDeclaration {
        pub base: BaseNode,
        pub kind: VariableDeclarationKind,
        pub declarations: Vec<VariableDeclarator>,
        pub declare: Option<bool>,
    }
    pub struct FunctionDeclaration {
        pub base: BaseNode,
        pub id: Option<Identifier>,
        pub params: Vec<Param>,
        pub body: BlockStatement,
        pub generator: Option<bool>,
        pub is_async: Option<bool>,
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }
    pub struct EnumBooleanMember {
        pub base: BaseNode,
        pub id: Identifier,
        pub init: BooleanLiteral,
    }
    pub struct EnumNumberMember {
        pub base: BaseNode,
        pub id: Identifier,
        pub init: NumericLiteral,
    }
    pub struct EnumStringMember {
        pub base: BaseNode,
        pub id: Identifier,
        pub init: StringLiteral,
    }
    pub enum EnumStringBodyMember {
        String(EnumStringMember),
        Defaulted(EnumDefaultedMember),
    }
    pub struct EnumDefaultedMember {
        pub base: BaseNode,
        pub id: Identifier,
    }
    pub struct EnumBooleanBody {
        pub base: BaseNode,
        pub members: Vec<EnumBooleanMember>,
        pub explicit_type: bool,
        pub has_unknown_members: bool,
    }
    pub struct EnumNumberBody {
        pub base: BaseNode,
        pub members: Vec<EnumNumberMember>,
        pub explicit_type: bool,
        pub has_unknown_members: bool,
    }
    pub struct EnumStringBody {
        pub base: BaseNode,
        pub members: Vec<EnumStringBodyMember>,
        pub explicit_type: bool,
        pub has_unknown_members: bool,
    }
    pub struct EnumSymbolBody {
        pub base: BaseNode,
        pub members: Vec<EnumDefaultedMember>,
        pub has_unknown_members: bool,
    }
    pub enum EnumBody {
        Boolean(EnumBooleanBody),
        Number(EnumNumberBody),
        String(EnumStringBody),
        Symbol(EnumSymbolBody),
    }
    pub struct EnumDeclaration {
        pub base: BaseNode,
        pub id: Identifier,
        pub body: EnumBody,
    }
    pub enum Expression {
        Array(ArrayExpression),
        Assignment(AssignmentExpression),
        Binary(BinaryExpression),
        Call(CallExpression),
        Conditional(ConditionalExpression),
        Func(FunctionExpression),
        Id(Identifier),
        StringLiteral(StringLiteral),
        NumericLiteral(NumericLiteral),
        NullLiteral(NullLiteral),
        BooleanLiteral(BooleanLiteral),
        RegExpLiteral(RegExpLiteral),
        Logical(LogicalExpression),
        Member(MemberExpression),
        New(NewExpression),
        Object(ObjectExpression),
        Sequence(SequenceExpression),
        Parenthesized(ParenthesizedExpression),
        This(ThisExpression),
        Unary(UnaryExpression),
        Update(UpdateExpression),
        ArrowFunc(ArrowFunctionExpression),
        Class(ClassExpression),
        MetaProp(MetaProperty),
        Super(Super),
        TaggedTemplate(TaggedTemplateExpression),
        TemplateLiteral(TemplateLiteral),
        Yield(YieldExpression),
        Await(AwaitExpression),
        Import(Import),
        BigIntLiteral(BigIntLiteral),
        OptionalMember(OptionalMemberExpression),
        OptionalCall(OptionalCallExpression),
        TypeCast(TypeCastExpression),
        JSXElement(JSXElement),
        JSXFragment(JSXFragment),
        Bind(BindExpression),
        PipelinePrimaryTopicRef(PipelinePrimaryTopicReference),
        Do(DoExpression),
        Record(RecordExpression),
        Tuple(TupleExpression),
        DecimalLiteral(DecimalLiteral),
        Module(ModuleExpression),
        TSAs(TSAsExpression),
        TSTypeAssertion(TSTypeAssertion),
        TSNonNull(TSNonNullExpression),
    }
    pub enum ExpressionWrapper {
        Stmt(ExpressionStatement),
        Parenthesized(ParenthesizedExpression),
        TypeCast(TypeCastExpression),
    }
    pub enum ArrayExprEl {
        Expr(Box<Expression>),
        Spread(SpreadElement),
    }
    pub struct ArrayExpression {
        pub base: BaseNode,
        pub elements: Vec<Option<ArrayExprEl>>,
    }
    pub struct AssignmentExpression {
        pub base: BaseNode,
        pub operator: JsWord,
        pub left: Box<LVal>,
        pub right: Box<Expression>,
    }
    pub enum MemberExprProp {
        Expr(Box<Expression>),
        Id(Identifier),
        PrivateName(PrivateName),
    }
    pub struct MemberExpression {
        pub base: BaseNode,
        pub object: Box<Expression>,
        pub property: Box<MemberExprProp>,
        pub computed: bool,
        pub optional: Option<bool>,
    }
    pub enum BinaryExprOp {
        Addition,
        Subtraction,
        Division,
        Remainder,
        Multiplication,
        Exponentiation,
        And,
        Or,
        RightShift,
        UnsignedRightShift,
        LeftShift,
        Xor,
        Equal,
        StrictEqual,
        NotEqual,
        StrictNotEqual,
        In,
        Instanceof,
        GreaterThan,
        LessThan,
        GreaterThanOrEqual,
        LessThanOrEqual,
    }
    pub enum BinaryExprLeft {
        Expr(Box<Expression>),
        Private(PrivateName),
    }
    pub struct BinaryExpression {
        pub base: BaseNode,
        pub operator: BinaryExprOp,
        pub left: Box<BinaryExprLeft>,
        pub right: Box<Expression>,
    }
    pub struct V8IntrinsicIdentifier {
        pub base: BaseNode,
        pub name: JsWord,
    }
    pub enum Callee {
        Expr(Box<Expression>),
        V8Id(V8IntrinsicIdentifier),
    }
    pub struct ArgumentPlaceholder {
        pub base: BaseNode,
    }
    pub enum Arg {
        Expr(Box<Expression>),
        Spread(SpreadElement),
        JSXName(JSXNamespacedName),
        Placeholder(ArgumentPlaceholder),
    }
    pub struct CallExpression {
        pub base: BaseNode,
        pub callee: Box<Callee>,
        pub arguments: Vec<Arg>,
        pub optional: Option<bool>,
        pub type_arguments: Option<TypeParameterInstantiation>,
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }
    pub struct ConditionalExpression {
        pub base: BaseNode,
        pub test: Box<Expression>,
        pub consequent: Box<Expression>,
        pub alternate: Box<Expression>,
    }
    pub struct FunctionExpression {
        pub base: BaseNode,
        pub id: Option<Identifier>,
        pub params: Vec<Param>,
        pub body: BlockStatement,
        pub generator: Option<bool>,
        pub is_async: Option<bool>,
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }
    pub struct NewExpression {
        pub base: BaseNode,
        pub callee: Callee,
        pub arguments: Vec<Arg>,
        pub optional: Option<bool>,
        pub type_arguments: Option<TypeParameterInstantiation>,
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }
    pub enum LogicalExprOp {
        Or,
        And,
        Nullish,
    }
    pub struct LogicalExpression {
        pub base: BaseNode,
        pub operator: LogicalExprOp,
        pub left: Box<Expression>,
        pub right: Box<Expression>,
    }
    pub enum ObjectExprProp {
        Method(ObjectMethod),
        Prop(ObjectProperty),
        Spread(SpreadElement),
    }
    pub struct ObjectExpression {
        pub base: BaseNode,
        pub properties: Vec<ObjectExprProp>,
    }
    pub struct SequenceExpression {
        pub base: BaseNode,
        pub expressions: Vec<Box<Expression>>,
    }
    pub struct ParenthesizedExpression {
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }
    pub struct ThisExpression {
        pub base: BaseNode,
    }
    pub enum UnaryExprOp {
        Void,
        Throw,
        Delete,
        LogicalNot,
        Plus,
        Negation,
        BitwiseNot,
        Typeof,
    }
    pub struct UnaryExpression {
        pub base: BaseNode,
        pub operator: UnaryExprOp,
        pub argument: Box<Expression>,
        pub prefix: bool,
    }
    pub enum UpdateExprOp {
        Increment,
        Decrement,
    }
    pub struct UpdateExpression {
        pub base: BaseNode,
        pub operator: UpdateExprOp,
        pub argument: Box<Expression>,
        pub prefix: bool,
    }
    pub enum ArrowFuncExprBody {
        Block(BlockStatement),
        Expr(Box<Expression>),
    }
    pub struct ArrowFunctionExpression {
        pub base: BaseNode,
        pub params: Vec<Param>,
        pub body: Box<ArrowFuncExprBody>,
        pub is_async: bool,
        pub expression: bool,
        pub generator: bool,
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }
    pub struct ClassExpression {
        pub base: BaseNode,
        pub id: Option<Identifier>,
        pub super_class: Option<Box<Expression>>,
        pub body: ClassBody,
        pub decorators: Option<Vec<Decorator>>,
        pub implements: Option<Vec<ClassImpl>>,
        pub mixins: Option<InterfaceExtends>,
        pub super_type_parameters: Option<SuperTypeParams>,
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }
    pub enum TaggedTemplateExprTypeParams {
        Flow(TypeParameterDeclaration),
        TS(TSTypeParameterInstantiation),
    }
    pub struct TaggedTemplateExpression {
        pub base: BaseNode,
        pub tag: Box<Expression>,
        pub quasi: TemplateLiteral,
        pub type_parameters: Option<TaggedTemplateExprTypeParams>,
    }
    pub struct YieldExpression {
        pub base: BaseNode,
        pub argument: Option<Box<Expression>>,
        pub delegate: bool,
    }
    pub struct AwaitExpression {
        pub base: BaseNode,
        pub argument: Box<Expression>,
    }
    pub enum OptionalMemberExprProp {
        Expr(Box<Expression>),
        Id(Identifier),
    }
    pub struct OptionalMemberExpression {
        pub base: BaseNode,
        pub object: Box<Expression>,
        pub property: OptionalMemberExprProp,
        pub computed: bool,
        pub optional: bool,
    }
    pub struct OptionalCallExpression {
        pub base: BaseNode,
        pub callee: Box<Expression>,
        pub arguments: Vec<Arg>,
        pub optional: bool,
        pub type_arguments: Option<TypeParameterInstantiation>,
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }
    pub struct TypeCastExpression {
        pub base: BaseNode,
        pub expression: Box<Expression>,
        pub type_annotation: TypeAnnotation,
    }
    pub struct BindExpression {
        pub base: BaseNode,
        pub object: Box<Expression>,
        pub callee: Box<Expression>,
    }
    pub struct PipelinePrimaryTopicReference {
        pub base: BaseNode,
    }
    pub struct DoExpression {
        pub base: BaseNode,
        pub body: BlockStatement,
    }
    pub enum RecordExprProp {
        Prop(ObjectProperty),
        Spread(SpreadElement),
    }
    pub struct RecordExpression {
        pub base: BaseNode,
        pub properties: Vec<RecordExprProp>,
    }
    pub enum TupleExprEl {
        Expr(Box<Expression>),
        Spread(SpreadElement),
    }
    pub struct TupleExpression {
        pub base: BaseNode,
        pub elements: Vec<TupleExprEl>,
    }
    pub struct ModuleExpression {
        pub base: BaseNode,
        pub body: Program,
    }
    pub struct Super {
        pub base: BaseNode,
    }
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
    pub enum FlowType {
        Any(AnyTypeAnnotation),
        Array(ArrayTypeAnnotation),
        Boolean(BooleanTypeAnnotation),
        BooleanLiteral(BooleanLiteralTypeAnnotation),
        NullLiteral(NullLiteralTypeAnnotation),
        Exists(ExistsTypeAnnotation),
        Function(FunctionTypeAnnotation),
        Generic(GenericTypeAnnotation),
        Interface(InterfaceTypeAnnotation),
        Intersection(IntersectionTypeAnnotation),
        Mixed(MixedTypeAnnotation),
        Empty(EmptyTypeAnnotation),
        Nullable(NullableTypeAnnotation),
        NumerLiteral(NumberLiteralTypeAnnotation),
        Number(NumberTypeAnnotation),
        Object(ObjectTypeAnnotation),
        StringLiteral(StringLiteralTypeAnnotation),
        String(StringTypeAnnotation),
        Symbol(SymbolTypeAnnotation),
        This(ThisTypeAnnotation),
        Tuple(TupleTypeAnnotation),
        Typeof(TypeofTypeAnnotation),
        Union(UnionTypeAnnotation),
        Void(VoidTypeAnnotation),
    }
    pub enum FlowBaseAnnotation {
        Any(AnyTypeAnnotation),
        Boolean(BooleanTypeAnnotation),
        NullLiteral(NullLiteralTypeAnnotation),
        Mixed(MixedTypeAnnotation),
        Empty(EmptyTypeAnnotation),
        Number(NumberTypeAnnotation),
        String(StringTypeAnnotation),
        Symbol(SymbolTypeAnnotation),
        This(ThisTypeAnnotation),
        Void(VoidTypeAnnotation),
    }
    pub enum FlowDeclaration {
        Class(DeclareClass),
        Func(DeclareFunction),
        Interface(DeclareInterface),
        Module(DeclareModule),
        ModuleExports(DeclareModuleExports),
        DeclareTypeAlias(DeclareTypeAlias),
        DeclareOpaqueType(DeclareOpaqueType),
        Var(DeclareVariable),
        ExportDecl(DeclareExportDeclaration),
        ExportAllDecl(DeclareExportAllDeclaration),
        InterfaceDeclaration(InterfaceDeclaration),
        OpaqueType(OpaqueType),
        TypeAlias(TypeAlias),
    }
    pub enum FlowPredicate {
        DeclaredPredicate(DeclaredPredicate),
        InferredPredicate(InferredPredicate),
    }
    pub struct TypeAnnotation {
        pub base: BaseNode,
        pub type_annotation: FlowType,
    }
    pub struct AnyTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct ArrayTypeAnnotation {
        pub base: BaseNode,
        pub element_type: Box<FlowType>,
    }
    pub struct BooleanTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct BooleanLiteralTypeAnnotation {
        pub base: BaseNode,
        pub value: bool,
    }
    pub struct NullLiteralTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct ExistsTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct FunctionTypeParam {
        pub base: BaseNode,
        pub name: Option<Identifier>,
        pub type_annotation: Box<FlowType>,
        pub optional: Option<bool>,
    }
    pub struct FunctionTypeAnnotation {
        pub base: BaseNode,
        pub type_parameters: Option<TypeParameterDeclaration>,
        pub params: Vec<FunctionTypeParam>,
        pub rest: Option<Box<FunctionTypeParam>>,
        pub return_type: Box<FlowType>,
        pub optional: Option<bool>,
    }
    pub struct TypeParameterDeclaration {
        pub base: BaseNode,
        pub params: Vec<TypeParameter>,
    }
    pub enum PlusOrMinus {
        Plus,
        Minus,
    }
    pub struct Variance {
        pub base: BaseNode,
        pub kind: PlusOrMinus,
    }
    pub struct TypeParameter {
        pub base: BaseNode,
        pub bound: Option<TypeAnnotation>,
        pub default: Option<FlowType>,
        pub variance: Option<Variance>,
        pub name: JsWord,
    }
    pub struct TypeParameterInstantiation {
        pub base: BaseNode,
        pub params: Vec<FlowType>,
    }
    pub struct GenericTypeAnnotation {
        pub base: BaseNode,
        pub id: IdOrQualifiedId,
        pub type_parameters: Option<TypeParameterInstantiation>,
    }
    pub struct InterfaceExtends {
        pub base: BaseNode,
        pub id: IdOrQualifiedId,
        pub type_parameters: Option<TypeParameterInstantiation>,
    }
    pub enum ObjectTypePropKind {
        Init,
        Get,
        Set,
    }
    pub struct ObjectTypeProperty {
        pub base: BaseNode,
        pub key: IdOrString,
        pub value: FlowType,
        pub variance: Option<Variance>,
        pub kind: ObjectTypePropKind,
        pub method: bool,
        pub optional: bool,
        pub proto: bool,
        pub is_static: bool,
    }
    pub struct ObjectTypeSpreadProperty {
        pub base: BaseNode,
        pub argument: FlowType,
    }
    pub enum ObjectTypeAnnotProp {
        Prop(ObjectTypeProperty),
        Spread(ObjectTypeSpreadProperty),
    }
    pub struct ObjectTypeIndexer {
        pub base: BaseNode,
        pub id: Option<Identifier>,
        pub key: FlowType,
        pub value: FlowType,
        pub variance: Option<Variance>,
        pub is_static: bool,
    }
    pub struct ObjectTypeCallProperty {
        pub base: BaseNode,
        pub value: FlowType,
        pub is_static: bool,
    }
    pub struct ObjectTypeInternalSlot {
        pub base: BaseNode,
        pub id: Identifier,
        pub value: FlowType,
        pub optional: bool,
        pub is_static: bool,
        pub method: bool,
    }
    pub struct ObjectTypeAnnotation {
        pub base: BaseNode,
        pub properties: Vec<ObjectTypeAnnotProp>,
        pub indexers: Option<Vec<ObjectTypeIndexer>>,
        pub call_properties: Option<Vec<ObjectTypeCallProperty>>,
        pub internal_slots: Option<Vec<ObjectTypeInternalSlot>>,
        pub exact: bool,
        pub inexact: Option<bool>,
    }
    pub struct InterfaceTypeAnnotation {
        pub base: BaseNode,
        pub extends: Option<Vec<InterfaceExtends>>,
        pub body: ObjectTypeAnnotation,
    }
    pub struct IntersectionTypeAnnotation {
        pub base: BaseNode,
        pub types: Vec<FlowType>,
    }
    pub struct MixedTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct EmptyTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct NullableTypeAnnotation {
        pub base: BaseNode,
        pub type_annotation: Box<FlowType>,
    }
    pub struct NumberLiteralTypeAnnotation {
        pub base: BaseNode,
        pub value: f64,
    }
    pub struct NumberTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct StringLiteralTypeAnnotation {
        pub base: BaseNode,
        pub value: JsWord,
    }
    pub struct StringTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct SymbolTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct ThisTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct TupleTypeAnnotation {
        pub base: BaseNode,
        pub types: Vec<FlowType>,
    }
    pub struct TypeofTypeAnnotation {
        pub base: BaseNode,
        pub argument: Box<FlowType>,
    }
    pub struct UnionTypeAnnotation {
        pub base: BaseNode,
        pub types: Vec<FlowType>,
    }
    pub struct VoidTypeAnnotation {
        pub base: BaseNode,
    }
    pub struct OpaqueType {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TypeParameterDeclaration>,
        pub supertype: Option<FlowType>,
        pub impltype: FlowType,
    }
    pub struct DeclareOpaqueType {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TypeParameterDeclaration>,
        pub supertype: Option<FlowType>,
    }
    pub struct TypeAlias {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TypeParameterDeclaration>,
        pub right: FlowType,
    }
    pub struct ClassImplements {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TypeParameterInstantiation>,
    }
    pub struct DeclareClass {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TypeParameterInstantiation>,
        pub extends: Option<Vec<InterfaceExtends>>,
        pub body: ObjectTypeAnnotation,
        pub implements: Option<Vec<ClassImplements>>,
        pub mixins: Option<Vec<InterfaceExtends>>,
    }
    pub struct DeclareFunction {
        pub base: BaseNode,
        pub id: Identifier,
        pub predicate: Option<Box<DeclaredPredicate>>,
    }
    pub struct DeclareInterface {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TypeParameterInstantiation>,
        pub extends: Option<Vec<InterfaceExtends>>,
        pub body: ObjectTypeAnnotation,
        pub implements: Option<Vec<ClassImplements>>,
        pub mixins: Option<Vec<InterfaceExtends>>,
    }
    pub enum ModuleKind {
        CommonJs,
        Es,
    }
    pub struct DeclareModule {
        pub base: BaseNode,
        pub id: IdOrString,
        pub body: BlockStatement,
        pub kind: Option<ModuleKind>,
    }
    pub struct DeclareModuleExports {
        pub base: BaseNode,
        pub type_annotation: TypeAnnotation,
    }
    pub struct DeclareTypeAlias {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TypeParameterDeclaration>,
        pub right: FlowType,
    }
    pub struct DeclareVariable {
        pub base: BaseNode,
        pub id: Identifier,
    }
    pub enum DeclareExportDeclSpecifier {
        Export(ExportSpecifier),
        Namespace(ExportNamespaceSpecifier),
    }
    pub struct DeclareExportDeclaration {
        pub base: BaseNode,
        pub declaration: Option<Box<Flow>>,
        pub specifiers: Option<Vec<DeclareExportDeclSpecifier>>,
        pub source: Option<StringLiteral>,
        pub default: Option<bool>,
    }
    pub struct DeclareExportAllDeclaration {
        pub base: BaseNode,
        pub source: StringLiteral,
        pub export_kind: Option<ExportKind>,
    }
    pub struct DeclaredPredicate {
        pub base: BaseNode,
        pub value: Box<Flow>,
    }
    pub struct InferredPredicate {
        pub base: BaseNode,
    }
    pub struct InterfaceDeclaration {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TypeParameterDeclaration>,
        pub extends: Option<Vec<InterfaceExtends>>,
        pub body: ObjectTypeAnnotation,
        pub implements: Option<Vec<ClassImplements>>,
        pub mixins: Option<Vec<InterfaceExtends>>,
    }
    pub struct QualifiedTypeIdentifier {
        pub base: BaseNode,
        pub id: Identifier,
        pub qualification: Box<IdOrQualifiedId>,
    }
    pub enum JSX {
        Attr(JSXAttribute),
        ClosingEl(JSXClosingElement),
        El(JSXElement),
        EmptyExpr(JSXEmptyExpression),
        ExprContainer(JSXExpressionContainer),
        SpreadChild(JSXSpreadChild),
        Id(JSXIdentifier),
        MemberExpr(JSXMemberExpression),
        NamespacedName(JSXNamespacedName),
        OpeningEl(JSXOpeningElement),
        SpreadAttr(JSXSpreadAttribute),
        Text(JSXText),
        Fragment(JSXFragment),
        OpeningFragment(JSXOpeningFragment),
        ClosingFragment(JSXClosingFragment),
    }
    pub enum JSXAttrName {
        Id(JSXIdentifier),
        Name(JSXNamespacedName),
    }
    pub enum JSXAttrVal {
        Element(JSXElement),
        Fragment(JSXFragment),
        String(StringLiteral),
        Expr(JSXExpressionContainer),
    }
    pub struct JSXAttribute {
        pub base: BaseNode,
        pub name: JSXAttrName,
        pub value: Option<JSXAttrVal>,
    }
    pub struct JSXClosingElement {
        pub base: BaseNode,
        pub name: JSXElementName,
    }
    pub struct JSXElement {
        pub base: BaseNode,
        pub opening_element: JSXOpeningElement,
        pub closing_element: Option<JSXClosingElement>,
        pub children: Vec<JSXElementChild>,
        pub self_closing: Option<bool>,
    }
    pub struct JSXEmptyExpression {
        pub base: BaseNode,
    }
    pub enum JSXExprContainerExpr {
        Expr(Box<Expression>),
        Empty(JSXEmptyExpression),
    }
    pub struct JSXExpressionContainer {
        pub base: BaseNode,
        pub expression: JSXExprContainerExpr,
    }
    pub struct JSXSpreadChild {
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }
    pub struct JSXIdentifier {
        pub base: BaseNode,
        pub name: JsWord,
    }
    pub enum JSXMemberExprObject {
        Expr(JSXMemberExpression),
        Id(JSXIdentifier),
    }
    pub struct JSXMemberExpression {
        pub base: BaseNode,
        pub object: Box<JSXMemberExprObject>,
        pub property: JSXIdentifier,
    }
    pub struct JSXNamespacedName {
        pub base: BaseNode,
        pub namespace: JSXIdentifier,
        pub name: JSXIdentifier,
    }
    pub enum JSXOpeningElAttr {
        Attr(JSXAttribute),
        Spread(JSXSpreadAttribute),
    }
    pub struct JSXOpeningElement {
        pub base: BaseNode,
        pub name: JSXElementName,
        pub attributes: Vec<JSXOpeningElAttr>,
        pub self_closing: bool,
        pub type_parameters: Option<SuperTypeParams>,
    }
    pub struct JSXSpreadAttribute {
        pub base: BaseNode,
        pub argument: Box<Expression>,
    }
    pub struct JSXText {
        pub base: BaseNode,
        pub value: JsWord,
    }
    pub struct JSXFragment {
        pub base: BaseNode,
        pub opening_fragment: JSXOpeningFragment,
        pub closing_fragment: JSXClosingFragment,
        pub children: Vec<JSXElementChild>,
    }
    pub struct JSXOpeningFragment {
        pub base: BaseNode,
    }
    pub struct JSXClosingFragment {
        pub base: BaseNode,
    }
    pub enum JSXElementName {
        Id(JSXIdentifier),
        Expr(JSXMemberExpression),
        Name(JSXNamespacedName),
    }
    pub enum JSXElementChild {
        Text(JSXText),
        Expr(JSXExpressionContainer),
        Spread(JSXSpreadChild),
        Element(JSXElement),
        Fragment(JSXFragment),
    }
    pub enum Literal {
        String(StringLiteral),
        Numeric(NumericLiteral),
        Null(NullLiteral),
        Boolean(BooleanLiteral),
        RegExp(RegExpLiteral),
        Template(TemplateLiteral),
        BigInt(BigIntLiteral),
        Decimal(DecimalLiteral),
    }
    pub struct StringLiteral {
        pub base: BaseNode,
        pub value: JsWord,
    }
    pub struct NumericLiteral {
        pub base: BaseNode,
        pub value: f64,
    }
    pub struct NumberLiteral {
        pub base: BaseNode,
        pub value: f64,
    }
    pub struct NullLiteral {
        pub base: BaseNode,
    }
    pub struct BooleanLiteral {
        pub base: BaseNode,
        pub value: bool,
    }
    pub struct RegExpLiteral {
        pub base: BaseNode,
        pub pattern: JsWord,
        pub flags: JsWord,
    }
    pub struct RegexLiteral {
        pub base: BaseNode,
        pub pattern: JsWord,
        pub flags: JsWord,
    }
    pub struct TemplateElVal {
        pub raw: JsWord,
        pub cooked: Option<JsWord>,
    }
    pub struct TemplateElement {
        pub base: BaseNode,
        pub value: TemplateElVal,
        pub tail: bool,
    }
    pub enum TemplateLiteralExpr {
        Expr(Box<Expression>),
        TSType(TSType),
    }
    pub struct TemplateLiteral {
        pub base: BaseNode,
        pub quasis: Vec<TemplateElement>,
        pub expressions: Vec<TemplateLiteralExpr>,
    }
    pub struct BigIntLiteral {
        pub base: BaseNode,
        pub value: String,
    }
    pub struct DecimalLiteral {
        pub base: BaseNode,
        pub value: JsWord,
    }
    pub enum ModuleDeclaration {
        ExportAll(ExportAllDeclaration),
        ExportDefault(ExportDefaultDeclaration),
        ExportNamed(ExportNamedDeclaration),
        Import(ImportDeclaration),
    }
    pub enum ExportDeclaration {
        ExportAll(ExportAllDeclaration),
        ExportDefault(ExportDefaultDeclaration),
        ExportNamed(ExportNamedDeclaration),
    }
    pub enum ModuleSpecifier {
        Export(ExportSpecifier),
        ImportDefault(ImportDefaultSpecifier),
        ImportNamespace(ImportNamespaceSpecifier),
        Import(ImportSpecifier),
        ExportNamespace(ExportNamespaceSpecifier),
        ExportDefault(ExportDefaultSpecifier),
    }
    pub struct File {
        pub base: BaseNode,
        pub program: Program,
        pub comments: Option<Vec<Comment>>,
        pub tokens: Option<Vec<Value>>,
    }
    pub struct InterpreterDirective {
        pub base: BaseNode,
        pub value: JsWord,
    }
    pub enum SrcType {
        Script,
        Module,
    }
    pub struct Program {
        pub base: BaseNode,
        pub body: Vec<Statement>,
        pub directives: Vec<Directive>,
        pub source_type: SrcType,
        pub interpreter: Option<InterpreterDirective>,
        pub source_file: String,
    }
    pub enum ExportKind {
        Type,
        Value,
    }
    pub struct ExportSpecifier {
        pub base: BaseNode,
        pub local: Identifier,
        pub exported: IdOrString,
        pub export_kind: ExportKind,
    }
    pub struct ExportDefaultSpecifier {
        pub base: BaseNode,
        pub exported: Identifier,
    }
    pub struct ExportNamespaceSpecifier {
        pub base: BaseNode,
        pub exported: Identifier,
    }
    pub struct ExportAllDeclaration {
        pub base: BaseNode,
        pub source: StringLiteral,
        pub assertions: Option<Vec<ImportAttribute>>,
        pub export_kind: Option<ExportKind>,
    }
    pub enum ExportDefaultDeclType {
        Func(FunctionDeclaration),
        TSFunc(TSDeclareFunction),
        Class(ClassDeclaration),
        Expr(Box<Expression>),
    }
    pub struct ExportDefaultDeclaration {
        pub base: BaseNode,
        pub declaration: ExportDefaultDeclType,
    }
    pub enum ExportSpecifierType {
        Export(ExportSpecifier),
        Default(ExportDefaultSpecifier),
        Namespace(ExportNamespaceSpecifier),
    }
    pub struct ExportNamedDeclaration {
        pub base: BaseNode,
        pub declaration: Option<Box<Declaration>>,
        pub specifiers: Vec<ExportSpecifierType>,
        pub source: Option<StringLiteral>,
        pub assertions: Option<Vec<ImportAttribute>>,
        pub export_kind: Option<ExportKind>,
    }
    pub struct Import {
        pub base: BaseNode,
    }
    pub struct ImportAttribute {
        pub base: BaseNode,
        pub key: IdOrString,
        pub value: StringLiteral,
    }
    pub struct ImportSpecifier {
        pub base: BaseNode,
        pub local: Identifier,
        pub imported: IdOrString,
        pub import_kind: Option<ImportKind>,
    }
    pub struct ImportDefaultSpecifier {
        pub base: BaseNode,
        pub local: Identifier,
    }
    pub struct ImportNamespaceSpecifier {
        pub base: BaseNode,
        pub local: Identifier,
    }
    pub enum ImportSpecifierType {
        Import(ImportSpecifier),
        Default(ImportDefaultSpecifier),
        Namespace(ImportNamespaceSpecifier),
    }
    pub enum ImportKind {
        Type,
        Typeof,
        Value,
    }
    pub struct ImportDeclaration {
        pub base: BaseNode,
        pub specifiers: Vec<ImportSpecifierType>,
        pub source: StringLiteral,
        pub assertions: Option<Vec<ImportAttribute>>,
        pub import_kind: Option<ImportKind>,
    }
    pub enum UserWhitespacable {
        ObjectMethod(ObjectMethod),
        ObjectProperty(ObjectProperty),
        ObjectTypeInternalSlot(ObjectTypeInternalSlot),
        ObjectTypeCallProperty(ObjectTypeCallProperty),
        ObjectTypeIndexer(ObjectTypeIndexer),
        ObjectTypeProperty(ObjectTypeProperty),
        ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
    }
    pub enum ObjectMember {
        Method(ObjectMethod),
        Prop(ObjectProperty),
    }
    pub enum ObjectMethodKind {
        Method,
        Get,
        Set,
    }
    pub enum ObjectKey {
        Expr(Box<Expression>),
        Id(Identifier),
        String(StringLiteral),
        Numeric(NumericLiteral),
    }
    pub struct ObjectMethod {
        pub base: BaseNode,
        pub kind: ObjectMethodKind,
        pub key: ObjectKey,
        pub params: Vec<Param>,
        pub body: BlockStatement,
        pub computed: bool,
        pub generator: Option<bool>,
        pub is_async: Option<bool>,
        pub decorator: Option<Vec<Decorator>>,
        pub return_type: Option<Box<TypeAnnotOrNoop>>,
        pub type_parameters: Option<TypeParamDeclOrNoop>,
    }
    pub enum ObjectPropVal {
        Expr(Box<Expression>),
        Pattern(PatternLike),
    }
    pub struct ObjectProperty {
        pub base: BaseNode,
        pub key: ObjectKey,
        pub value: ObjectPropVal,
        pub computed: bool,
        pub shorthand: bool,
        pub decorators: Option<Vec<Decorator>>,
    }
    pub enum Pattern {
        Assignment(AssignmentPattern),
        Array(ArrayPattern),
        Object(ObjectPattern),
    }
    pub enum ObjectPatternProp {
        Rest(RestElement),
        Prop(ObjectProperty),
    }
    pub struct ObjectPattern {
        pub base: BaseNode,
        pub properties: Vec<ObjectPatternProp>,
        pub decorators: Option<Vec<Decorator>>,
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }
    pub enum AssignmentPatternLeft {
        Id(Identifier),
        Object(ObjectPattern),
        Array(ArrayPattern),
        Member(MemberExpression),
    }
    pub struct AssignmentPattern {
        pub base: BaseNode,
        pub left: AssignmentPatternLeft,
        pub right: Box<Expression>,
        pub decorators: Option<Vec<Decorator>>,
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }
    pub struct ArrayPattern {
        pub base: BaseNode,
        pub elements: Vec<Option<PatternLike>>,
        pub decorators: Option<Vec<Decorator>>,
        pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
    }
    pub enum Statement {
        Block(BlockStatement),
        Break(BreakStatement),
        Continue(ContinueStatement),
        Debugger(DebuggerStatement),
        DoWhile(DoWhileStatement),
        Empty(EmptyStatement),
        Expr(ExpressionStatement),
        ForIn(ForInStatement),
        For(ForStatement),
        FuncDecl(FunctionDeclaration),
        If(IfStatement),
        Labeled(LabeledStatement),
        Return(ReturnStatement),
        Switch(SwitchStatement),
        Throw(ThrowStatement),
        Try(TryStatement),
        VarDecl(VariableDeclaration),
        While(WhileStatement),
        With(WithStatement),
        ClassDecl(ClassDeclaration),
        ExportAllDecl(ExportAllDeclaration),
        ExportDefaultDecl(ExportDefaultDeclaration),
        ExportNamedDecl(ExportNamedDeclaration),
        ForOf(ForOfStatement),
        ImportDecl(ImportDeclaration),
        DeclClass(DeclareClass),
        DeclFunc(DeclareFunction),
        DeclInterface(DeclareInterface),
        DeclModule(DeclareModule),
        DeclareModuleExports(DeclareModuleExports),
        DeclTypeAlias(DeclareTypeAlias),
        DeclOpaqueType(DeclareOpaqueType),
        DeclVar(DeclareVariable),
        DeclExportDeclaration(DeclareExportDeclaration),
        DeclExportAllDeclaration(DeclareExportAllDeclaration),
        InterfaceDecl(InterfaceDeclaration),
        OpaqueType(OpaqueType),
        TypeAlias(TypeAlias),
        EnumDecl(EnumDeclaration),
        TSDeclFunc(TSDeclareFunction),
        TSInterfaceDecl(TSInterfaceDeclaration),
        TSTypeAliasDecl(TSTypeAliasDeclaration),
        TSEnumDecl(TSEnumDeclaration),
        TSModuleDecl(TSModuleDeclaration),
        TSImportEqualsDecl(TSImportEqualsDeclaration),
        TSExportAssignment(TSExportAssignment),
        TSNamespaceExportDecl(TSNamespaceExportDeclaration),
    }
    pub enum CompletionStatement {
        Break(BreakStatement),
        Continue(ContinueStatement),
        Return(ReturnStatement),
        Throw(ThrowStatement),
    }
    pub enum Loop {
        DoWhile(DoWhileStatement),
        ForIn(ForInStatement),
        For(ForStatement),
        While(WhileStatement),
        ForOf(ForOfStatement),
    }
    pub enum For {
        InStmt(ForInStatement),
        Stmt(ForStatement),
        OfStmt(ForOfStatement),
    }
    pub enum ForXStatement {
        ForIn(ForInStatement),
        ForOf(ForOfStatement),
    }
    pub enum While {
        DoWhile(DoWhileStatement),
        While(WhileStatement),
    }
    pub struct BlockStatement {
        pub base: BaseNode,
        pub body: Vec<Statement>,
        pub directives: Vec<Directive>,
    }
    pub struct BreakStatement {
        pub base: BaseNode,
        pub label: Option<Identifier>,
    }
    pub struct ContinueStatement {
        pub base: BaseNode,
        pub label: Option<Identifier>,
    }
    pub struct DebuggerStatement {
        pub base: BaseNode,
    }
    pub struct DoWhileStatement {
        pub base: BaseNode,
        pub test: Box<Expression>,
        pub body: Box<Statement>,
    }
    pub struct EmptyStatement {
        pub base: BaseNode,
    }
    pub struct ExpressionStatement {
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }
    pub enum ForStmtInit {
        VarDecl(VariableDeclaration),
        Expr(Box<Expression>),
    }
    pub enum ForStmtLeft {
        VarDecl(VariableDeclaration),
        LVal(LVal),
    }
    pub struct ForInStatement {
        pub base: BaseNode,
        pub left: ForStmtLeft,
        pub right: Box<Expression>,
        pub body: Box<Statement>,
    }
    pub struct ForStatement {
        pub base: BaseNode,
        pub init: Option<ForStmtInit>,
        pub test: Option<Box<Expression>>,
        pub update: Option<Box<Expression>>,
        pub body: Box<Statement>,
    }
    pub struct ForOfStatement {
        pub base: BaseNode,
        pub left: ForStmtLeft,
        pub right: Box<Expression>,
        pub body: Box<Statement>,
    }
    pub struct IfStatement {
        pub base: BaseNode,
        pub test: Box<Expression>,
        pub consequent: Box<Statement>,
        pub alternate: Option<Box<Statement>>,
    }
    pub struct LabeledStatement {
        pub base: BaseNode,
        pub label: Identifier,
        pub body: Box<Statement>,
    }
    pub struct ReturnStatement {
        pub base: BaseNode,
        pub argument: Option<Box<Expression>>,
    }
    pub struct SwitchCase {
        pub base: BaseNode,
        pub test: Option<Box<Expression>>,
        pub consequent: Vec<Statement>,
    }
    pub struct SwitchStatement {
        pub base: BaseNode,
        pub discriminant: Box<Expression>,
        pub cases: Vec<SwitchCase>,
    }
    pub struct ThrowStatement {
        pub base: BaseNode,
        pub argument: Box<Expression>,
    }
    pub enum CatchClauseParam {
        Id(Identifier),
        Array(ArrayPattern),
        Object(ObjectPattern),
    }
    pub struct CatchClause {
        pub base: BaseNode,
        pub param: Option<CatchClauseParam>,
        pub body: BlockStatement,
    }
    pub struct TryStatement {
        pub base: BaseNode,
        pub block: BlockStatement,
        pub handler: Option<CatchClause>,
        pub finalizer: Option<BlockStatement>,
    }
    pub struct WhileStatement {
        pub base: BaseNode,
        pub test: Box<Expression>,
        pub body: Box<Statement>,
    }
    pub struct WithStatement {
        pub base: BaseNode,
        pub object: Box<Expression>,
        pub body: Box<Statement>,
    }
    pub enum TSTypeElement {
        CallSignatureDecl(TSCallSignatureDeclaration),
        ConstructSignatureDecl(TSConstructSignatureDeclaration),
        PropSignature(TSPropertySignature),
        MethodSignature(TSMethodSignature),
        IndexSignature(TSIndexSignature),
    }
    pub enum TSType {
        AnyKeyword(TSAnyKeyword),
        BooleanKeyword(TSBooleanKeyword),
        BigIntKeyword(TSBigIntKeyword),
        IntrinsicKeyword(TSIntrinsicKeyword),
        NeverKeyword(TSNeverKeyword),
        NullKeyword(TSNullKeyword),
        NumberKeyword(TSNumberKeyword),
        ObjectKeyword(TSObjectKeyword),
        StringKeyword(TSStringKeyword),
        SymbolKeyword(TSSymbolKeyword),
        UndefinedKeyword(TSUndefinedKeyword),
        UnknownKeyword(TSUnknownKeyword),
        VoidKeyword(TSVoidKeyword),
        This(TSThisType),
        Function(TSFunctionType),
        Constructor(TSConstructorType),
        TypeRef(TSTypeReference),
        TypePredicate(TSTypePredicate),
        TypeQuery(TSTypeQuery),
        TypeLiteral(TSTypeLiteral),
        Array(TSArrayType),
        Tuple(TSTupleType),
        Optional(TSOptionalType),
        Rest(TSRestType),
        Union(TSUnionType),
        Intersection(TSIntersectionType),
        Conditional(TSConditionalType),
        Infer(TSInferType),
        Parenthesized(TSParenthesizedType),
        TypeOp(TSTypeOperator),
        IndexedAccess(TSIndexedAccessType),
        Mapped(TSMappedType),
        Literal(TSLiteralType),
        ExprWithArgs(TSExpressionWithTypeArguments),
        Import(TSImportType),
    }
    pub enum TSBaseType {
        Any(TSAnyKeyword),
        Boolean(TSBooleanKeyword),
        BigInt(TSBigIntKeyword),
        Intrinsic(TSIntrinsicKeyword),
        Never(TSNeverKeyword),
        Null(TSNullKeyword),
        Number(TSNumberKeyword),
        Object(TSObjectKeyword),
        String(TSStringKeyword),
        Symbol(TSSymbolKeyword),
        Undefined(TSUndefinedKeyword),
        Unknown(TSUnknownKeyword),
        Void(TSVoidKeyword),
        This(TSThisType),
        Literal(TSLiteralType),
    }
    pub struct TSTypeAnnotation {
        pub base: BaseNode,
        pub type_annotation: TSType,
    }
    pub enum TSParamPropParam {
        Id(Identifier),
        Assignment(AssignmentPattern),
    }
    pub struct TSParameterProperty {
        pub base: BaseNode,
        pub parameter: TSParamPropParam,
        pub accessibility: Option<Access>,
        pub readonly: Option<bool>,
    }
    pub enum TSFuncDeclTypeParams {
        Type(TSTypeParameterDeclaration),
        Noop(Noop),
    }
    pub enum TSFuncDeclTypeAnnot {
        Type(Box<TSTypeAnnotation>),
        Noop(Noop),
    }
    pub struct TSDeclareFunction {
        pub base: BaseNode,
        pub id: Option<Identifier>,
        pub type_parameters: Option<TSFuncDeclTypeParams>,
        pub params: Vec<Param>,
        pub return_type: Option<TSFuncDeclTypeAnnot>,
        pub is_async: Option<bool>,
        pub declare: Option<bool>,
        pub generator: Option<bool>,
    }
    pub struct TSDeclareMethod {
        pub base: BaseNode,
        pub decorators: Option<Vec<Decorator>>,
        pub key: ObjectKey,
        pub type_parameters: Option<TSFuncDeclTypeParams>,
        pub params: Vec<Param>,
        pub return_type: Option<TSFuncDeclTypeAnnot>,
        pub is_abstract: Option<bool>,
        pub access: Option<Access>,
        pub accessibility: Option<Access>,
        pub is_async: Option<bool>,
        pub computed: Option<bool>,
        pub generator: Option<bool>,
        pub kind: Option<ClassMethodKind>,
        pub optional: Option<bool>,
        pub is_static: Option<bool>,
    }
    pub struct TSQualifiedName {
        pub base: BaseNode,
        pub left: Box<TSEntityName>,
        pub right: Identifier,
    }
    pub struct TSCallSignatureDeclaration {
        pub base: BaseNode,
        pub type_parameters: Option<TSTypeParameterDeclaration>,
        pub parameters: Vec<IdOrRest>,
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
    }
    pub struct TSConstructSignatureDeclaration {
        pub base: BaseNode,
        pub type_parameters: Option<TSTypeParameterDeclaration>,
        pub parameters: Vec<IdOrRest>,
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
    }
    pub struct TSPropertySignature {
        pub base: BaseNode,
        pub key: Box<Expression>,
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
        pub initializer: Option<Box<Expression>>,
        pub computed: Option<bool>,
        pub optional: Option<bool>,
        pub readonly: Option<bool>,
    }
    pub struct TSMethodSignature {
        pub base: BaseNode,
        pub key: Box<Expression>,
        pub type_parameters: Option<TSTypeParameterDeclaration>,
        pub parameters: Vec<IdOrRest>,
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
        pub computed: Option<bool>,
        pub optional: Option<bool>,
    }
    pub struct TSIndexSignature {
        pub base: BaseNode,
        pub paramters: Vec<Identifier>,
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
        pub readonly: Option<bool>,
    }
    pub struct TSAnyKeyword {
        pub base: BaseNode,
    }
    pub struct TSBooleanKeyword {
        pub base: BaseNode,
    }
    pub struct TSBigIntKeyword {
        pub base: BaseNode,
    }
    pub struct TSIntrinsicKeyword {
        pub base: BaseNode,
    }
    pub struct TSNeverKeyword {
        pub base: BaseNode,
    }
    pub struct TSNullKeyword {
        pub base: BaseNode,
    }
    pub struct TSNumberKeyword {
        pub base: BaseNode,
    }
    pub struct TSObjectKeyword {
        pub base: BaseNode,
    }
    pub struct TSStringKeyword {
        pub base: BaseNode,
    }
    pub struct TSSymbolKeyword {
        pub base: BaseNode,
    }
    pub struct TSUndefinedKeyword {
        pub base: BaseNode,
    }
    pub struct TSUnknownKeyword {
        pub base: BaseNode,
    }
    pub struct TSVoidKeyword {
        pub base: BaseNode,
    }
    pub struct TSThisType {
        pub base: BaseNode,
    }
    pub struct TSFunctionType {
        pub base: BaseNode,
        pub type_parameters: Option<TSTypeParameterDeclaration>,
        pub parameters: Vec<IdOrRest>,
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
    }
    pub struct TSConstructorType {
        pub base: BaseNode,
        pub type_parameters: Option<TSTypeParameterDeclaration>,
        pub parameters: Vec<IdOrRest>,
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
        pub is_abstract: Option<bool>,
    }
    pub enum TSEntityName {
        Id(Identifier),
        Qualified(TSQualifiedName),
    }
    pub struct TSTypeReference {
        pub base: BaseNode,
        pub type_name: TSEntityName,
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }
    pub enum TSTypePredicateParamName {
        Id(Identifier),
        This(TSThisType),
    }
    pub struct TSTypePredicate {
        pub base: BaseNode,
        pub parameter_name: TSTypePredicateParamName,
        pub type_annotation: Option<Box<TSTypeAnnotation>>,
        pub asserts: Option<bool>,
    }
    pub enum TSTypeQueryExprName {
        EntityName(TSEntityName),
        ImportType(TSImportType),
    }
    pub struct TSTypeQuery {
        pub base: BaseNode,
        pub expr_name: TSTypeQueryExprName,
    }
    pub struct TSTypeLiteral {
        pub base: BaseNode,
        pub members: Vec<TSTypeElement>,
    }
    pub struct TSArrayType {
        pub base: BaseNode,
        pub element_type: Box<TSType>,
    }
    pub enum TSTupleTypeElType {
        TSType(TSType),
        Member(TSNamedTupleMember),
    }
    pub struct TSTupleType {
        pub base: BaseNode,
        pub element_types: Vec<TSTupleTypeElType>,
    }
    pub struct TSOptionalType {
        pub base: BaseNode,
        pub type_annotation: Box<TSType>,
    }
    pub struct TSRestType {
        pub base: BaseNode,
        pub type_annotation: Box<TSType>,
    }
    pub struct TSNamedTupleMember {
        pub base: BaseNode,
        pub label: Identifier,
        pub element_type: TSType,
        pub optional: bool,
    }
    pub struct TSUnionType {
        pub base: BaseNode,
        pub types: Vec<TSType>,
    }
    pub struct TSIntersectionType {
        pub base: BaseNode,
        pub types: Vec<TSType>,
    }
    pub struct TSConditionalType {
        pub base: BaseNode,
        pub check_type: Box<TSType>,
        pub extends_type: Box<TSType>,
        pub true_type: Box<TSType>,
        pub false_type: Box<TSType>,
    }
    pub struct TSInferType {
        pub base: BaseNode,
        pub type_parameter: Box<TSTypeParameter>,
    }
    pub struct TSParenthesizedType {
        pub base: BaseNode,
        pub type_annotation: Box<TSType>,
    }
    pub struct TSTypeOperator {
        pub base: BaseNode,
        pub type_annotation: Box<TSType>,
        pub operator: JsWord,
    }
    pub struct TSIndexedAccessType {
        pub base: BaseNode,
        pub object_type: Box<TSType>,
        pub index_type: Box<TSType>,
    }
    pub struct TSMappedType {
        pub base: BaseNode,
        pub type_parameter: Box<TSTypeParameter>,
        pub type_annotation: Option<Box<TSType>>,
        pub name_type: Option<Box<TSType>>,
        pub optional: Option<bool>,
        pub readonly: Option<bool>,
    }
    pub enum TSLiteralTypeLiteral {
        Numeric(NumericLiteral),
        String(StringLiteral),
        Boolean(BooleanLiteral),
        BigInt(BigIntLiteral),
    }
    pub struct TSLiteralType {
        pub base: BaseNode,
        pub literal: TSLiteralTypeLiteral,
    }
    pub struct TSExpressionWithTypeArguments {
        pub base: BaseNode,
        pub expression: TSEntityName,
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }
    pub struct TSInterfaceDeclaration {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TSTypeParameterDeclaration>,
        pub extends: Option<TSExpressionWithTypeArguments>,
        pub body: TSInterfaceBody,
        pub declare: Option<bool>,
    }
    pub struct TSInterfaceBody {
        pub base: BaseNode,
        pub body: Vec<TSTypeElement>,
    }
    pub struct TSTypeAliasDeclaration {
        pub base: BaseNode,
        pub id: Identifier,
        pub type_parameters: Option<TSTypeParameterDeclaration>,
        pub type_annotation: TSType,
        pub declare: Option<bool>,
    }
    pub struct TSAsExpression {
        pub base: BaseNode,
        pub expression: Box<Expression>,
        pub type_annotation: TSType,
    }
    pub struct TSTypeAssertion {
        pub base: BaseNode,
        pub type_annotation: TSType,
        pub expression: Box<Expression>,
    }
    pub struct TSEnumDeclaration {
        pub base: BaseNode,
        pub id: Identifier,
        pub members: Vec<TSEnumMember>,
        pub is_const: Option<bool>,
        pub declare: Option<bool>,
        pub initializer: Option<Box<Expression>>,
    }
    pub struct TSEnumMember {
        pub base: BaseNode,
        pub id: IdOrString,
        pub initializer: Option<Box<Expression>>,
    }
    pub enum TSModuleDeclBody {
        Block(TSModuleBlock),
        Decl(TSModuleDeclaration),
    }
    pub struct TSModuleDeclaration {
        pub base: BaseNode,
        pub id: IdOrString,
        pub body: Box<TSModuleDeclBody>,
        pub declare: Option<bool>,
        pub global: Option<bool>,
    }
    pub struct TSModuleBlock {
        pub base: BaseNode,
        pub body: Vec<Statement>,
    }
    pub struct TSImportType {
        pub base: BaseNode,
        pub argument: StringLiteral,
        pub qualifier: Option<TSEntityName>,
        pub type_parameters: Option<TSTypeParameterInstantiation>,
    }
    pub enum TSImportEqualsDeclModuleRef {
        Name(TSEntityName),
        External(TSExternalModuleReference),
    }
    pub struct TSImportEqualsDeclaration {
        pub base: BaseNode,
        pub id: Identifier,
        pub module_reference: TSImportEqualsDeclModuleRef,
        pub is_export: bool,
    }
    pub struct TSExternalModuleReference {
        pub base: BaseNode,
        pub expression: StringLiteral,
    }
    pub struct TSNonNullExpression {
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }
    pub struct TSExportAssignment {
        pub base: BaseNode,
        pub expression: Box<Expression>,
    }
    pub struct TSNamespaceExportDeclaration {
        pub base: BaseNode,
        pub id: Identifier,
    }
    pub struct TSTypeParameterInstantiation {
        pub base: BaseNode,
        pub params: Vec<TSType>,
    }
    pub struct TSTypeParameterDeclaration {
        pub base: BaseNode,
        pub params: Vec<TSTypeParameter>,
    }
    pub struct TSTypeParameter {
        pub base: BaseNode,
        pub constraint: Option<Box<TSType>>,
        pub default: Option<Box<TSType>>,
        pub name: JsWord,
    }
});
