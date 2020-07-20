use num_bigint::BigInt as BigIntValue;
use std::any::Any;
use swc_atoms::JsWord;
use swc_common::Span;
use swc_ecma_ast::*;
use swc_visit::{AndThen, Repeat, Repeated};

/// Visitable nodes.
pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

impl<A, B> Fold for AndThen<A, B>
where
    A: Fold,
    B: Fold,
{
    fn fold_module(&mut self, n: Module) -> Module {
        let n = self.first.fold_module(n);
        self.second.fold_module(n)
    }

    fn fold_script(&mut self, n: Script) -> Script {
        let n = self.first.fold_script(n);
        self.second.fold_script(n)
    }
}

impl<A, B> Visit for AndThen<A, B>
where
    A: Visit,
    B: Visit,
{
    fn visit_module(&mut self, n: &Module, _parent: &dyn Node) {
        self.first.visit_module(n, _parent);
        self.second.visit_module(n, _parent);
    }

    fn visit_script(&mut self, n: &Script, _parent: &dyn Node) {
        self.first.visit_script(n, _parent);
        self.second.visit_script(n, _parent);
    }
}

impl<V> Fold for Repeat<V>
where
    V: Fold + Repeated,
{
    fn fold_module(&mut self, mut node: Module) -> Module {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }

    fn fold_script(&mut self, mut node: Script) -> Script {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }
}

// define!({
//     pub struct Class {
//         pub span: Span,
//         pub decorators: Vec<Decorator>,
//         pub body: Vec<ClassMember>,
//         pub super_class: Option<Box<Expr>>,
//         pub is_abstract: bool,
//         pub type_params: Option<TsTypeParamDecl>,
//         pub super_type_params: Option<TsTypeParamInstantiation>,
//         pub implements: Vec<TsExprWithTypeArgs>,
//     }
//
//     pub enum ClassMember {
//         Constructor(Constructor),
//         Method(ClassMethod),
//         PrivateMethod(PrivateMethod),
//         ClassProp(ClassProp),
//         PrivateProp(PrivateProp),
//         TsIndexSignature(TsIndexSignature),
//         Empty(EmptyStmt),
//     }
//
//     pub struct ClassProp {
//         pub span: Span,
//         pub key: Box<Expr>,
//         pub value: Option<Box<Expr>>,
//         pub type_ann: Option<TsTypeAnn>,
//         pub is_static: bool,
//         pub decorators: Vec<Decorator>,
//         pub computed: bool,
//         pub accessibility: Option<Accessibility>,
//         pub is_abstract: bool,
//         pub is_optional: bool,
//         pub readonly: bool,
//         pub definite: bool,
//     }
//     pub struct PrivateProp {
//         pub span: Span,
//         pub key: PrivateName,
//         pub value: Option<Box<Expr>>,
//         pub type_ann: Option<TsTypeAnn>,
//         pub is_static: bool,
//         pub decorators: Vec<Decorator>,
//         pub computed: bool,
//         pub accessibility: Option<Accessibility>,
//         pub is_abstract: bool,
//         pub is_optional: bool,
//         pub readonly: bool,
//         pub definite: bool,
//     }
//     pub struct ClassMethod {
//         pub span: Span,
//         pub key: PropName,
//         pub function: Function,
//         pub kind: MethodKind,
//         pub is_static: bool,
//         pub accessibility: Option<Accessibility>,
//         pub is_abstract: bool,
//         pub is_optional: bool,
//     }
//     pub struct PrivateMethod {
//         pub span: Span,
//         pub key: PrivateName,
//         pub function: Function,
//         pub kind: MethodKind,
//         pub is_static: bool,
//         pub accessibility: Option<Accessibility>,
//         pub is_abstract: bool,
//         pub is_optional: bool,
//     }
//     pub struct Constructor {
//         pub span: Span,
//         pub key: PropName,
//         pub params: Vec<ParamOrTsParamProp>,
//         pub body: Option<BlockStmt>,
//         pub accessibility: Option<Accessibility>,
//         pub is_optional: bool,
//     }
//     pub struct Decorator {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub enum MethodKind {
//         Method,
//         Getter,
//         Setter,
//     }
//     pub enum Decl {
//         Class(ClassDecl),
//         Fn(FnDecl),
//         Var(VarDecl),
//         TsInterface(TsInterfaceDecl),
//         TsTypeAlias(TsTypeAliasDecl),
//         TsEnum(TsEnumDecl),
//         TsModule(TsModuleDecl),
//     }
//     pub struct FnDecl {
//         pub ident: Ident,
//         pub declare: bool,
//         pub function: Function,
//     }
//     pub struct ClassDecl {
//         pub ident: Ident,
//         pub declare: bool,
//         pub class: Class,
//     }
//     pub struct VarDecl {
//         pub span: Span,
//         pub kind: VarDeclKind,
//         pub declare: bool,
//         pub decls: Vec<VarDeclarator>,
//     }
//     pub enum VarDeclKind {
//         Var,
//         Let,
//         Const,
//     }
//     pub struct VarDeclarator {
//         pub span: Span,
//         pub name: Pat,
//         pub init: Option<Box<Expr>>,
//         pub definite: bool,
//     }
//     pub enum Expr {
//         This(ThisExpr),
//         Array(ArrayLit),
//         Object(ObjectLit),
//         Fn(FnExpr),
//         Unary(UnaryExpr),
//         Update(UpdateExpr),
//         Bin(BinExpr),
//         Assign(AssignExpr),
//         Member(MemberExpr),
//         Cond(CondExpr),
//         Call(CallExpr),
//         New(NewExpr),
//         Seq(SeqExpr),
//         Ident(Ident),
//         Lit(Lit),
//         Tpl(Tpl),
//         TaggedTpl(TaggedTpl),
//         Arrow(ArrowExpr),
//         Class(ClassExpr),
//         Yield(YieldExpr),
//         MetaProp(MetaPropExpr),
//         Await(AwaitExpr),
//         Paren(ParenExpr),
//         JSXMember(JSXMemberExpr),
//         JSXNamespacedName(JSXNamespacedName),
//         JSXEmpty(JSXEmptyExpr),
//         JSXElement(Box<JSXElement>),
//         JSXFragment(JSXFragment),
//         TsTypeAssertion(TsTypeAssertion),
//         TsConstAssertion(TsConstAssertion),
//         TsNonNull(TsNonNullExpr),
//         TsTypeCast(TsTypeCastExpr),
//         TsAs(TsAsExpr),
//         PrivateName(PrivateName),
//         OptChain(OptChainExpr),
//         Invalid(Invalid),
//     }
//     pub struct ThisExpr {
//         pub span: Span,
//     }
//     pub struct ArrayLit {
//         pub span: Span,
//         pub elems: Vec<Option<ExprOrSpread>>,
//     }
//     pub struct ObjectLit {
//         pub span: Span,
//         pub props: Vec<PropOrSpread>,
//     }
//     pub enum PropOrSpread {
//         Spread(SpreadElement),
//         Prop(Box<Prop>),
//     }
//     pub struct SpreadElement {
//         pub dot3_token: Span,
//         pub expr: Box<Expr>,
//     }
//     pub struct UnaryExpr {
//         pub span: Span,
//         pub op: UnaryOp,
//         pub arg: Box<Expr>,
//     }
//     pub struct UpdateExpr {
//         pub span: Span,
//         pub op: UpdateOp,
//         pub prefix: bool,
//         pub arg: Box<Expr>,
//     }
//     pub struct BinExpr {
//         pub span: Span,
//         pub op: BinaryOp,
//         pub left: Box<Expr>,
//         pub right: Box<Expr>,
//     }
//     pub struct FnExpr {
//         pub ident: Option<Ident>,
//         pub function: Function,
//     }
//     pub struct ClassExpr {
//         pub ident: Option<Ident>,
//         pub class: Class,
//     }
//     pub struct AssignExpr {
//         pub span: Span,
//         pub op: AssignOp,
//         pub left: PatOrExpr,
//         pub right: Box<Expr>,
//     }
//     pub struct MemberExpr {
//         pub span: Span,
//         pub obj: ExprOrSuper,
//         pub prop: Box<Expr>,
//         pub computed: bool,
//     }
//     pub struct CondExpr {
//         pub span: Span,
//         pub test: Box<Expr>,
//         pub cons: Box<Expr>,
//         pub alt: Box<Expr>,
//     }
//     pub struct CallExpr {
//         pub span: Span,
//         pub callee: ExprOrSuper,
//         pub args: Vec<ExprOrSpread>,
//         pub type_args: Option<TsTypeParamInstantiation>,
//     }
//     pub struct NewExpr {
//         pub span: Span,
//         pub callee: Box<Expr>,
//         pub args: Option<Vec<ExprOrSpread>>,
//         pub type_args: Option<TsTypeParamInstantiation>,
//     }
//     pub struct SeqExpr {
//         pub span: Span,
//         pub exprs: Vec<Box<Expr>>,
//     }
//     pub struct ArrowExpr {
//         pub span: Span,
//         pub params: Vec<Pat>,
//         pub body: BlockStmtOrExpr,
//         pub is_async: bool,
//         pub is_generator: bool,
//         pub type_params: Option<TsTypeParamDecl>,
//         pub return_type: Option<TsTypeAnn>,
//     }
//     pub struct YieldExpr {
//         pub span: Span,
//         pub arg: Option<Box<Expr>>,
//         pub delegate: bool,
//     }
//     pub struct MetaPropExpr {
//         pub meta: Ident,
//         pub prop: Ident,
//     }
//     pub struct AwaitExpr {
//         pub span: Span,
//         pub arg: Box<Expr>,
//     }
//     pub struct Tpl {
//         pub span: Span,
//         pub exprs: Vec<Box<Expr>>,
//         pub quasis: Vec<TplElement>,
//     }
//     pub struct TaggedTpl {
//         pub span: Span,
//         pub tag: Box<Expr>,
//         pub exprs: Vec<Box<Expr>>,
//         pub quasis: Vec<TplElement>,
//         pub type_params: Option<TsTypeParamInstantiation>,
//     }
//     pub struct TplElement {
//         pub span: Span,
//         pub tail: bool,
//         pub cooked: Option<Str>,
//         pub raw: Str,
//     }
//     pub struct ParenExpr {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub enum ExprOrSuper {
//         Super(Super),
//         Expr(Box<Expr>),
//     }
//     pub struct Super {
//         pub span: Span,
//     }
//     pub struct ExprOrSpread {
//         pub spread: Option<Span>,
//         pub expr: Box<Expr>,
//     }
//     pub enum BlockStmtOrExpr {
//         BlockStmt(BlockStmt),
//         Expr(Box<Expr>),
//     }
//     pub enum PatOrExpr {
//         Expr(Box<Expr>),
//         Pat(Box<Pat>),
//     }
//     pub struct OptChainExpr {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub struct Function {
//         pub params: Vec<Param>,
//         pub decorators: Vec<Decorator>,
//         pub span: Span,
//         pub body: Option<BlockStmt>,
//         pub is_generator: bool,
//         pub is_async: bool,
//         pub type_params: Option<TsTypeParamDecl>,
//         pub return_type: Option<TsTypeAnn>,
//     }
//     pub struct Param {
//         pub span: Span,
//         pub decorators: Vec<Decorator>,
//         pub pat: Pat,
//     }
//     pub enum ParamOrTsParamProp {
//         TsParamProp(TsParamProp),
//         Param(Param),
//     }
//
//     pub struct Ident {
//         pub span: Span,
//         pub sym: JsWord,
//         pub type_ann: Option<TsTypeAnn>,
//         pub optional: bool,
//     }
//     pub struct PrivateName {
//         pub span: Span,
//         pub id: Ident,
//     }
//     pub enum JSXObject {
//         JSXMemberExpr(Box<JSXMemberExpr>),
//         Ident(Ident),
//     }
//     pub struct JSXMemberExpr {
//         pub obj: JSXObject,
//         pub prop: Ident,
//     }
//     pub struct JSXNamespacedName {
//         pub ns: Ident,
//         pub name: Ident,
//     }
//     pub struct JSXEmptyExpr {
//         pub span: Span,
//     }
//     pub struct JSXExprContainer {
//         pub span: Span,
//         pub expr: JSXExpr,
//     }
//     pub enum JSXExpr {
//         JSXEmptyExpr(JSXEmptyExpr),
//         Expr(Box<Expr>),
//     }
//     pub struct JSXSpreadChild {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub enum JSXElementName {
//         Ident(Ident),
//         JSXMemberExpr(JSXMemberExpr),
//         JSXNamespacedName(JSXNamespacedName),
//     }
//     pub struct JSXOpeningElement {
//         pub name: JSXElementName,
//         pub span: Span,
//         pub attrs: Vec<JSXAttrOrSpread>,
//         pub self_closing: bool,
//         pub type_args: Option<TsTypeParamInstantiation>,
//     }
//     pub enum JSXAttrOrSpread {
//         JSXAttr(JSXAttr),
//         SpreadElement(SpreadElement),
//     }
//     pub struct JSXClosingElement {
//         pub span: Span,
//         pub name: JSXElementName,
//     }
//     pub struct JSXAttr {
//         pub span: Span,
//         pub name: JSXAttrName,
//         pub value: Option<JSXAttrValue>,
//     }
//     pub enum JSXAttrName {
//         Ident(Ident),
//         JSXNamespacedName(JSXNamespacedName),
//     }
//     pub enum JSXAttrValue {
//         Lit(Lit),
//         JSXExprContainer(JSXExprContainer),
//         JSXElement(Box<JSXElement>),
//         JSXFragment(JSXFragment),
//     }
//     pub struct JSXText {
//         pub span: Span,
//         pub value: JsWord,
//         pub raw: JsWord,
//     }
//     pub struct JSXElement {
//         pub span: Span,
//         pub opening: JSXOpeningElement,
//         pub children: Vec<JSXElementChild>,
//         pub closing: Option<JSXClosingElement>,
//     }
//     pub enum JSXElementChild {
//         JSXText(JSXText),
//         JSXExprContainer(JSXExprContainer),
//         JSXSpreadChild(JSXSpreadChild),
//         JSXElement(Box<JSXElement>),
//         JSXFragment(JSXFragment),
//     }
//     pub struct JSXFragment {
//         pub span: Span,
//         pub opening: JSXOpeningFragment,
//         pub children: Vec<JSXElementChild>,
//         pub closing: JSXClosingFragment,
//     }
//     pub struct JSXOpeningFragment {
//         pub span: Span,
//     }
//     pub struct JSXClosingFragment {
//         pub span: Span,
//     }
//     pub struct Invalid {
//         pub span: Span,
//     }
//     pub enum Lit {
//         Str(Str),
//         Bool(Bool),
//         Null(Null),
//         Num(Number),
//         BigInt(BigInt),
//         Regex(Regex),
//         JSXText(JSXText),
//     }
//     pub struct BigInt {
//         pub span: Span,
//         pub value: BigIntValue,
//     }
//     pub struct Str {
//         pub span: Span,
//         pub value: JsWord,
//         pub has_escape: bool,
//     }
//     pub struct Bool {
//         pub span: Span,
//         pub value: bool,
//     }
//     pub struct Null {
//         pub span: Span,
//     }
//     pub struct Regex {
//         pub span: Span,
//         pub exp: JsWord,
//         pub flags: JsWord,
//     }
//     pub struct Number {
//         pub span: Span,
//         pub value: f64,
//     }
//     pub enum Program {
//         Module(Module),
//         Script(Script),
//     }
//     pub struct Module {
//         pub span: Span,
//         pub body: Vec<ModuleItem>,
//         pub shebang: Option<JsWord>,
//     }
//     pub struct Script {
//         pub span: Span,
//         pub body: Vec<Stmt>,
//         pub shebang: Option<JsWord>,
//     }
//     pub enum ModuleItem {
//         ModuleDecl(ModuleDecl),
//         Stmt(Stmt),
//     }
//     pub enum ModuleDecl {
//         Import(ImportDecl),
//         ExportDecl(ExportDecl),
//         ExportNamed(NamedExport),
//         ExportDefaultDecl(ExportDefaultDecl),
//         ExportDefaultExpr(ExportDefaultExpr),
//         ExportAll(ExportAll),
//         TsImportEquals(TsImportEqualsDecl),
//         TsExportAssignment(TsExportAssignment),
//         TsNamespaceExport(TsNamespaceExportDecl),
//     }
//     pub struct ExportDefaultExpr {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub struct ExportDecl {
//         pub span: Span,
//         pub decl: Decl,
//     }
//     pub struct ImportDecl {
//         pub span: Span,
//         pub specifiers: Vec<ImportSpecifier>,
//         pub src: Str,
//         pub type_only: bool,
//     }
//     pub struct ExportAll {
//         pub span: Span,
//         pub src: Str,
//     }
//     pub struct NamedExport {
//         pub span: Span,
//         pub specifiers: Vec<ExportSpecifier>,
//         pub src: Option<Str>,
//         pub type_only: bool,
//     }
//     pub struct ExportDefaultDecl {
//         pub span: Span,
//         pub decl: DefaultDecl,
//     }
//     pub enum DefaultDecl {
//         Class(ClassExpr),
//         Fn(FnExpr),
//         TsInterfaceDecl(TsInterfaceDecl),
//     }
//     pub enum ImportSpecifier {
//         Named(ImportNamedSpecifier),
//         Default(ImportDefaultSpecifier),
//         Namespace(ImportStarAsSpecifier),
//     }
//     pub struct ImportDefaultSpecifier {
//         pub span: Span,
//         pub local: Ident,
//     }
//     pub struct ImportStarAsSpecifier {
//         pub span: Span,
//         pub local: Ident,
//     }
//     pub struct ImportNamedSpecifier {
//         pub span: Span,
//         pub local: Ident,
//         pub imported: Option<Ident>,
//     }
//     pub enum ExportSpecifier {
//         Namespace(ExportNamespaceSpecifier),
//         Default(ExportDefaultSpecifier),
//         Named(ExportNamedSpecifier),
//     }
//     pub struct ExportNamespaceSpecifier {
//         pub span: Span,
//         pub name: Ident,
//     }
//     pub struct ExportDefaultSpecifier {
//         pub exported: Ident,
//     }
//     pub struct ExportNamedSpecifier {
//         pub span: Span,
//         pub orig: Ident,
//         pub exported: Option<Ident>,
//     }
//     pub enum BinaryOp {
//         EqEq,
//         NotEq,
//         EqEqEq,
//         NotEqEq,
//         Lt,
//         LtEq,
//         Gt,
//         GtEq,
//         LShift,
//         RShift,
//         ZeroFillRShift,
//         Add,
//         Sub,
//         Mul,
//         Div,
//         Mod,
//         BitOr,
//         BitXor,
//         BitAnd,
//         LogicalOr,
//         LogicalAnd,
//         In,
//         InstanceOf,
//         Exp,
//         NullishCoalescing,
//     }
//     pub enum AssignOp {
//         Assign,
//         AddAssign,
//         SubAssign,
//         MulAssign,
//         DivAssign,
//         ModAssign,
//         LShiftAssign,
//         RShiftAssign,
//         ZeroFillRShiftAssign,
//         BitOrAssign,
//         BitXorAssign,
//         BitAndAssign,
//         ExpAssign,
//         AndAssign,
//         OrAssign,
//         NullishAssign,
//     }
//
//     pub enum UpdateOp {
//         PlusPlus,
//         MinusMinus,
//     }
//     pub enum UnaryOp {
//         Minus,
//         Plus,
//         Bang,
//         Tilde,
//         TypeOf,
//         Void,
//         Delete,
//     }
//     pub enum Pat {
//         Ident(Ident),
//         Array(ArrayPat),
//         Rest(RestPat),
//         Object(ObjectPat),
//         Assign(AssignPat),
//         Invalid(Invalid),
//         Expr(Box<Expr>),
//     }
//     pub struct ArrayPat {
//         pub span: Span,
//         pub elems: Vec<Option<Pat>>,
//         pub optional: bool,
//         pub type_ann: Option<TsTypeAnn>,
//     }
//     pub struct ObjectPat {
//         pub span: Span,
//         pub props: Vec<ObjectPatProp>,
//         pub optional: bool,
//         pub type_ann: Option<TsTypeAnn>,
//     }
//     pub struct AssignPat {
//         pub span: Span,
//         pub left: Box<Pat>,
//         pub right: Box<Expr>,
//         pub type_ann: Option<TsTypeAnn>,
//     }
//     pub struct RestPat {
//         pub span: Span,
//         pub dot3_token: Span,
//         pub arg: Box<Pat>,
//         pub type_ann: Option<TsTypeAnn>,
//     }
//     pub enum ObjectPatProp {
//         KeyValue(KeyValuePatProp),
//         Assign(AssignPatProp),
//         Rest(RestPat),
//     }
//     pub struct KeyValuePatProp {
//         pub key: PropName,
//         pub value: Box<Pat>,
//     }
//     pub struct AssignPatProp {
//         pub span: Span,
//         pub key: Ident,
//         pub value: Option<Box<Expr>>,
//     }
//     pub enum Prop {
//         Shorthand(Ident),
//         KeyValue(KeyValueProp),
//         Assign(AssignProp),
//         Getter(GetterProp),
//         Setter(SetterProp),
//         Method(MethodProp),
//     }
//     pub struct KeyValueProp {
//         pub key: PropName,
//         pub value: Box<Expr>,
//     }
//     pub struct AssignProp {
//         pub key: Ident,
//         pub value: Box<Expr>,
//     }
//     pub struct GetterProp {
//         pub span: Span,
//         pub key: PropName,
//         pub type_ann: Option<TsTypeAnn>,
//         pub body: Option<BlockStmt>,
//     }
//     pub struct SetterProp {
//         pub span: Span,
//         pub key: PropName,
//         pub param: Pat,
//         pub body: Option<BlockStmt>,
//     }
//     pub struct MethodProp {
//         pub key: PropName,
//         pub function: Function,
//     }
//     pub enum PropName {
//         Ident(Ident),
//         Str(Str),
//         Num(Number),
//         Computed(ComputedPropName),
//     }
//     pub struct ComputedPropName {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub struct BlockStmt {
//         pub span: Span,
//         pub stmts: Vec<Stmt>,
//     }
//     pub enum Stmt {
//         Block(BlockStmt),
//         Empty(EmptyStmt),
//         Debugger(DebuggerStmt),
//         With(WithStmt),
//         Return(ReturnStmt),
//         Labeled(LabeledStmt),
//         Break(BreakStmt),
//         Continue(ContinueStmt),
//         If(IfStmt),
//         Switch(SwitchStmt),
//         Throw(ThrowStmt),
//         Try(TryStmt),
//         While(WhileStmt),
//         DoWhile(DoWhileStmt),
//         For(ForStmt),
//         ForIn(ForInStmt),
//         ForOf(ForOfStmt),
//         Decl(Decl),
//         Expr(ExprStmt),
//     }
//     pub struct ExprStmt {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub struct EmptyStmt {
//         pub span: Span,
//     }
//     pub struct DebuggerStmt {
//         pub span: Span,
//     }
//     pub struct WithStmt {
//         pub span: Span,
//         pub obj: Box<Expr>,
//         pub body: Box<Stmt>,
//     }
//     pub struct ReturnStmt {
//         pub span: Span,
//         pub arg: Option<Box<Expr>>,
//     }
//     pub struct LabeledStmt {
//         pub span: Span,
//         pub label: Ident,
//         pub body: Box<Stmt>,
//     }
//     pub struct BreakStmt {
//         pub span: Span,
//         pub label: Option<Ident>,
//     }
//     pub struct ContinueStmt {
//         pub span: Span,
//         pub label: Option<Ident>,
//     }
//     pub struct IfStmt {
//         pub span: Span,
//         pub test: Box<Expr>,
//         pub cons: Box<Stmt>,
//         pub alt: Option<Box<Stmt>>,
//     }
//     pub struct SwitchStmt {
//         pub span: Span,
//         pub discriminant: Box<Expr>,
//         pub cases: Vec<SwitchCase>,
//     }
//     pub struct ThrowStmt {
//         pub span: Span,
//         pub arg: Box<Expr>,
//     }
//     pub struct TryStmt {
//         pub span: Span,
//         pub block: BlockStmt,
//         pub handler: Option<CatchClause>,
//         pub finalizer: Option<BlockStmt>,
//     }
//     pub struct WhileStmt {
//         pub span: Span,
//         pub test: Box<Expr>,
//         pub body: Box<Stmt>,
//     }
//     pub struct DoWhileStmt {
//         pub span: Span,
//         pub test: Box<Expr>,
//         pub body: Box<Stmt>,
//     }
//     pub struct ForStmt {
//         pub span: Span,
//         pub init: Option<VarDeclOrExpr>,
//         pub test: Option<Box<Expr>>,
//         pub update: Option<Box<Expr>>,
//         pub body: Box<Stmt>,
//     }
//     pub struct ForInStmt {
//         pub span: Span,
//         pub left: VarDeclOrPat,
//         pub right: Box<Expr>,
//         pub body: Box<Stmt>,
//     }
//     pub struct ForOfStmt {
//         pub span: Span,
//         pub await_token: Option<Span>,
//         pub left: VarDeclOrPat,
//         pub right: Box<Expr>,
//         pub body: Box<Stmt>,
//     }
//     pub struct SwitchCase {
//         pub span: Span,
//         pub test: Option<Box<Expr>>,
//         pub cons: Vec<Stmt>,
//     }
//     pub struct CatchClause {
//         pub span: Span,
//         pub param: Option<Pat>,
//         pub body: BlockStmt,
//     }
//     pub enum VarDeclOrPat {
//         VarDecl(VarDecl),
//         Pat(Pat),
//     }
//     pub enum VarDeclOrExpr {
//         VarDecl(VarDecl),
//         Expr(Box<Expr>),
//     }
//     pub struct TsTypeAnn {
//         pub span: Span,
//         pub type_ann: Box<TsType>,
//     }
//     pub struct TsTypeParamDecl {
//         pub span: Span,
//         pub params: Vec<TsTypeParam>,
//     }
//     pub struct TsTypeParam {
//         pub span: Span,
//         pub name: Ident,
//         pub constraint: Option<Box<TsType>>,
//         pub default: Option<Box<TsType>>,
//     }
//     pub struct TsTypeParamInstantiation {
//         pub span: Span,
//         pub params: Vec<Box<TsType>>,
//     }
//     pub struct TsTypeCastExpr {
//         pub span: Span,
//         pub expr: Box<Expr>,
//         pub type_ann: TsTypeAnn,
//     }
//     pub struct TsParamProp {
//         pub span: Span,
//         pub decorators: Vec<Decorator>,
//         pub accessibility: Option<Accessibility>,
//         pub readonly: bool,
//         pub param: TsParamPropParam,
//     }
//     pub enum TsParamPropParam {
//         Ident(Ident),
//         Assign(AssignPat),
//     }
//     pub struct TsQualifiedName {
//         pub left: TsEntityName,
//         pub right: Ident,
//     }
//     pub enum TsEntityName {
//         TsQualifiedName(Box<TsQualifiedName>),
//         Ident(Ident),
//     }
//     pub enum TsSignatureDecl {
//         TsCallSignatureDecl(TsCallSignatureDecl),
//         TsConstructSignatureDecl(TsConstructSignatureDecl),
//         TsMethodSignature(TsMethodSignature),
//         TsFnType(TsFnType),
//         TsConstructorType(TsConstructorType),
//     }
//     pub enum TsTypeElement {
//         TsCallSignatureDecl(TsCallSignatureDecl),
//         TsConstructSignatureDecl(TsConstructSignatureDecl),
//         TsPropertySignature(TsPropertySignature),
//         TsMethodSignature(TsMethodSignature),
//         TsIndexSignature(TsIndexSignature),
//     }
//     pub struct TsCallSignatureDecl {
//         pub span: Span,
//         pub params: Vec<TsFnParam>,
//         pub type_ann: Option<TsTypeAnn>,
//         pub type_params: Option<TsTypeParamDecl>,
//     }
//     pub struct TsConstructSignatureDecl {
//         pub span: Span,
//         pub params: Vec<TsFnParam>,
//         pub type_ann: Option<TsTypeAnn>,
//         pub type_params: Option<TsTypeParamDecl>,
//     }
//     pub struct TsPropertySignature {
//         pub span: Span,
//         pub readonly: bool,
//         pub key: Box<Expr>,
//         pub computed: bool,
//         pub optional: bool,
//         pub init: Option<Box<Expr>>,
//         pub params: Vec<TsFnParam>,
//         pub type_ann: Option<TsTypeAnn>,
//         pub type_params: Option<TsTypeParamDecl>,
//     }
//     pub struct TsMethodSignature {
//         pub span: Span,
//         pub readonly: bool,
//         pub key: Box<Expr>,
//         pub computed: bool,
//         pub optional: bool,
//         pub params: Vec<TsFnParam>,
//         pub type_ann: Option<TsTypeAnn>,
//         pub type_params: Option<TsTypeParamDecl>,
//     }
//     pub struct TsIndexSignature {
//         pub params: Vec<TsFnParam>,
//         pub type_ann: Option<TsTypeAnn>,
//         pub readonly: bool,
//         pub span: Span,
//     }
//     pub enum TsType {
//         TsKeywordType(TsKeywordType),
//         TsThisType(TsThisType),
//         TsFnOrConstructorType(TsFnOrConstructorType),
//         TsTypeRef(TsTypeRef),
//         TsTypeQuery(TsTypeQuery),
//         TsTypeLit(TsTypeLit),
//         TsArrayType(TsArrayType),
//         TsTupleType(TsTupleType),
//         TsOptionalType(TsOptionalType),
//         TsRestType(TsRestType),
//         TsUnionOrIntersectionType(TsUnionOrIntersectionType),
//         TsConditionalType(TsConditionalType),
//         TsInferType(TsInferType),
//         TsParenthesizedType(TsParenthesizedType),
//         TsTypeOperator(TsTypeOperator),
//         TsIndexedAccessType(TsIndexedAccessType),
//         TsMappedType(TsMappedType),
//         TsLitType(TsLitType),
//         TsTypePredicate(TsTypePredicate),
//         TsImportType(TsImportType),
//     }
//     pub enum TsFnOrConstructorType {
//         TsFnType(TsFnType),
//         TsConstructorType(TsConstructorType),
//     }
//     pub struct TsKeywordType {
//         pub span: Span,
//         pub kind: TsKeywordTypeKind,
//     }
//     pub enum TsKeywordTypeKind {
//         TsAnyKeyword,
//         TsUnknownKeyword,
//         TsNumberKeyword,
//         TsObjectKeyword,
//         TsBooleanKeyword,
//         TsBigIntKeyword,
//         TsStringKeyword,
//         TsSymbolKeyword,
//         TsVoidKeyword,
//         TsUndefinedKeyword,
//         TsNullKeyword,
//         TsNeverKeyword,
//     }
//     pub struct TsThisType {
//         pub span: Span,
//     }
//     pub enum TsFnParam {
//         Ident(Ident),
//         Array(ArrayPat),
//         Rest(RestPat),
//         Object(ObjectPat),
//     }
//     pub struct TsFnType {
//         pub span: Span,
//         pub params: Vec<TsFnParam>,
//         pub type_params: Option<TsTypeParamDecl>,
//         pub type_ann: TsTypeAnn,
//     }
//     pub struct TsConstructorType {
//         pub span: Span,
//         pub params: Vec<TsFnParam>,
//         pub type_params: Option<TsTypeParamDecl>,
//         pub type_ann: TsTypeAnn,
//     }
//     pub struct TsTypeRef {
//         pub span: Span,
//         pub type_name: TsEntityName,
//         pub type_params: Option<TsTypeParamInstantiation>,
//     }
//     pub struct TsTypePredicate {
//         pub span: Span,
//         pub asserts: bool,
//         pub param_name: TsThisTypeOrIdent,
//         pub type_ann: Option<TsTypeAnn>,
//     }
//     pub enum TsThisTypeOrIdent {
//         TsThisType(TsThisType),
//         Ident(Ident),
//     }
//     pub struct TsTypeQuery {
//         pub span: Span,
//         pub expr_name: TsTypeQueryExpr,
//     }
//     pub enum TsTypeQueryExpr {
//         TsEntityName(TsEntityName),
//         Import(TsImportType),
//     }
//     pub struct TsImportType {
//         pub span: Span,
//         pub arg: Str,
//         pub qualifier: Option<TsEntityName>,
//         pub type_args: Option<TsTypeParamInstantiation>,
//     }
//     pub struct TsTypeLit {
//         pub span: Span,
//         pub members: Vec<TsTypeElement>,
//     }
//     pub struct TsArrayType {
//         pub span: Span,
//         pub elem_type: Box<TsType>,
//     }
//
//     pub struct TsTupleType {
//         pub span: Span,
//         pub elem_types: Vec<TsTupleElement>,
//     }
//
//     pub struct TsTupleElement {
//         pub span: Span,
//         pub label: Option<Ident>,
//         pub ty: TsType,
//     }
//
//     pub struct TsOptionalType {
//         pub span: Span,
//         pub type_ann: Box<TsType>,
//     }
//     pub struct TsRestType {
//         pub span: Span,
//         pub type_ann: Box<TsType>,
//     }
//     pub enum TsUnionOrIntersectionType {
//         TsUnionType(TsUnionType),
//         TsIntersectionType(TsIntersectionType),
//     }
//     pub struct TsUnionType {
//         pub span: Span,
//         pub types: Vec<Box<TsType>>,
//     }
//     pub struct TsIntersectionType {
//         pub span: Span,
//         pub types: Vec<Box<TsType>>,
//     }
//     pub struct TsConditionalType {
//         pub span: Span,
//         pub check_type: Box<TsType>,
//         pub extends_type: Box<TsType>,
//         pub true_type: Box<TsType>,
//         pub false_type: Box<TsType>,
//     }
//     pub struct TsInferType {
//         pub span: Span,
//         pub type_param: TsTypeParam,
//     }
//     pub struct TsParenthesizedType {
//         pub span: Span,
//         pub type_ann: Box<TsType>,
//     }
//     pub struct TsTypeOperator {
//         pub span: Span,
//         pub op: TsTypeOperatorOp,
//         pub type_ann: Box<TsType>,
//     }
//     pub enum TsTypeOperatorOp {
//         KeyOf,
//         Unique,
//         ReadOnly,
//     }
//     pub struct TsIndexedAccessType {
//         pub span: Span,
//         pub readonly: bool,
//         pub obj_type: Box<TsType>,
//         pub index_type: Box<TsType>,
//     }
//     pub enum TruePlusMinus {
//         True,
//         Plus,
//         Minus,
//     }
//     pub struct TsMappedType {
//         pub span: Span,
//         pub readonly: Option<TruePlusMinus>,
//         pub type_param: TsTypeParam,
//         pub optional: Option<TruePlusMinus>,
//         pub type_ann: Option<Box<TsType>>,
//     }
//     pub struct TsLitType {
//         pub span: Span,
//         pub lit: TsLit,
//     }
//     pub enum TsLit {
//         Number(Number),
//         Str(Str),
//         Bool(Bool),
//         Tpl(Tpl),
//     }
//     pub struct TsInterfaceDecl {
//         pub span: Span,
//         pub id: Ident,
//         pub declare: bool,
//         pub type_params: Option<TsTypeParamDecl>,
//         pub extends: Vec<TsExprWithTypeArgs>,
//         pub body: TsInterfaceBody,
//     }
//     pub struct TsInterfaceBody {
//         pub span: Span,
//         pub body: Vec<TsTypeElement>,
//     }
//     pub struct TsExprWithTypeArgs {
//         pub span: Span,
//         pub expr: TsEntityName,
//         pub type_args: Option<TsTypeParamInstantiation>,
//     }
//     pub struct TsTypeAliasDecl {
//         pub span: Span,
//         pub declare: bool,
//         pub id: Ident,
//         pub type_params: Option<TsTypeParamDecl>,
//         pub type_ann: Box<TsType>,
//     }
//     pub struct TsEnumDecl {
//         pub span: Span,
//         pub declare: bool,
//         pub is_const: bool,
//         pub id: Ident,
//         pub members: Vec<TsEnumMember>,
//     }
//     pub struct TsEnumMember {
//         pub span: Span,
//         pub id: TsEnumMemberId,
//         pub init: Option<Box<Expr>>,
//     }
//     pub enum TsEnumMemberId {
//         Ident(Ident),
//         Str(Str),
//     }
//     pub struct TsModuleDecl {
//         pub span: Span,
//         pub declare: bool,
//         pub global: bool,
//         pub id: TsModuleName,
//         pub body: Option<TsNamespaceBody>,
//     }
//     pub enum TsNamespaceBody {
//         TsModuleBlock(TsModuleBlock),
//         TsNamespaceDecl(TsNamespaceDecl),
//     }
//     pub struct TsModuleBlock {
//         pub span: Span,
//         pub body: Vec<ModuleItem>,
//     }
//     pub struct TsNamespaceDecl {
//         pub span: Span,
//         pub declare: bool,
//         pub global: bool,
//         pub id: Ident,
//         pub body: Box<TsNamespaceBody>,
//     }
//     pub enum TsModuleName {
//         Ident(Ident),
//         Str(Str),
//     }
//     pub struct TsImportEqualsDecl {
//         pub span: Span,
//         pub declare: bool,
//         pub is_export: bool,
//         pub id: Ident,
//         pub module_ref: TsModuleRef,
//     }
//     pub enum TsModuleRef {
//         TsEntityName(TsEntityName),
//         TsExternalModuleRef(TsExternalModuleRef),
//     }
//     pub struct TsExternalModuleRef {
//         pub span: Span,
//         pub expr: Str,
//     }
//     pub struct TsExportAssignment {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub struct TsNamespaceExportDecl {
//         pub span: Span,
//         pub id: Ident,
//     }
//     pub struct TsAsExpr {
//         pub span: Span,
//         pub expr: Box<Expr>,
//         pub type_ann: Box<TsType>,
//     }
//     pub struct TsTypeAssertion {
//         pub span: Span,
//         pub expr: Box<Expr>,
//         pub type_ann: Box<TsType>,
//     }
//     pub struct TsNonNullExpr {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
//     pub enum Accessibility {
//         Public,
//         Protected,
//         Private,
//     }
//     pub struct TsConstAssertion {
//         pub span: Span,
//         pub expr: Box<Expr>,
//     }
// });

#[allow(unused_variables)]
pub fn fold_accessibility<V: ?Sized + Fold>(_visitor: &mut V, n: Accessibility) -> Accessibility {
    {
        match n {
            Accessibility::Public {} => {
                return Accessibility::Public {};
            }
            Accessibility::Protected {} => {
                return Accessibility::Protected {};
            }
            Accessibility::Private {} => {
                return Accessibility::Private {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_array_lit<V: ?Sized + Fold>(_visitor: &mut V, n: ArrayLit) -> ArrayLit {
    {
        match n {
            ArrayLit { span, elems } => {
                let span = _visitor.fold_span(span);
                let elems = _visitor.fold_opt_vec_expr_or_spreads(elems);
                return ArrayLit { span, elems };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_array_pat<V: ?Sized + Fold>(_visitor: &mut V, n: ArrayPat) -> ArrayPat {
    {
        match n {
            ArrayPat {
                span,
                elems,
                optional,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let elems = _visitor.fold_opt_vec_pats(elems);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                return ArrayPat {
                    span,
                    elems,
                    optional,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_arrow_expr<V: ?Sized + Fold>(_visitor: &mut V, n: ArrowExpr) -> ArrowExpr {
    {
        match n {
            ArrowExpr {
                span,
                params,
                body,
                is_async,
                is_generator,
                type_params,
                return_type,
            } => {
                let span = _visitor.fold_span(span);
                let params = _visitor.fold_pats(params);
                let body = _visitor.fold_block_stmt_or_expr(body);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                let return_type = _visitor.fold_opt_ts_type_ann(return_type);
                return ArrowExpr {
                    span,
                    params,
                    body,
                    is_async,
                    is_generator,
                    type_params,
                    return_type,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_assign_expr<V: ?Sized + Fold>(_visitor: &mut V, n: AssignExpr) -> AssignExpr {
    {
        match n {
            AssignExpr {
                span,
                op,
                left,
                right,
            } => {
                let span = _visitor.fold_span(span);
                let op = _visitor.fold_assign_op(op);
                let left = _visitor.fold_pat_or_expr(left);
                let right = Box::new(_visitor.fold_expr(*right));
                return AssignExpr {
                    span,
                    op,
                    left,
                    right,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_assign_op<V: ?Sized + Fold>(_visitor: &mut V, n: AssignOp) -> AssignOp {
    {
        match n {
            AssignOp::Assign {} => {
                return AssignOp::Assign {};
            }
            AssignOp::AddAssign {} => {
                return AssignOp::AddAssign {};
            }
            AssignOp::SubAssign {} => {
                return AssignOp::SubAssign {};
            }
            AssignOp::MulAssign {} => {
                return AssignOp::MulAssign {};
            }
            AssignOp::DivAssign {} => {
                return AssignOp::DivAssign {};
            }
            AssignOp::ModAssign {} => {
                return AssignOp::ModAssign {};
            }
            AssignOp::LShiftAssign {} => {
                return AssignOp::LShiftAssign {};
            }
            AssignOp::RShiftAssign {} => {
                return AssignOp::RShiftAssign {};
            }
            AssignOp::ZeroFillRShiftAssign {} => {
                return AssignOp::ZeroFillRShiftAssign {};
            }
            AssignOp::BitOrAssign {} => {
                return AssignOp::BitOrAssign {};
            }
            AssignOp::BitXorAssign {} => {
                return AssignOp::BitXorAssign {};
            }
            AssignOp::BitAndAssign {} => {
                return AssignOp::BitAndAssign {};
            }
            AssignOp::ExpAssign {} => {
                return AssignOp::ExpAssign {};
            }
            AssignOp::AndAssign {} => {
                return AssignOp::AndAssign {};
            }
            AssignOp::OrAssign {} => {
                return AssignOp::OrAssign {};
            }
            AssignOp::NullishAssign {} => {
                return AssignOp::NullishAssign {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_assign_pat<V: ?Sized + Fold>(_visitor: &mut V, n: AssignPat) -> AssignPat {
    {
        match n {
            AssignPat {
                span,
                left,
                right,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let left = Box::new(_visitor.fold_pat(*left));
                let right = Box::new(_visitor.fold_expr(*right));
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                return AssignPat {
                    span,
                    left,
                    right,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_assign_pat_prop<V: ?Sized + Fold>(_visitor: &mut V, n: AssignPatProp) -> AssignPatProp {
    {
        match n {
            AssignPatProp { span, key, value } => {
                let span = _visitor.fold_span(span);
                let key = _visitor.fold_ident(key);
                let value = _visitor.fold_opt_expr(value);
                return AssignPatProp { span, key, value };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_assign_prop<V: ?Sized + Fold>(_visitor: &mut V, n: AssignProp) -> AssignProp {
    {
        match n {
            AssignProp { key, value } => {
                let key = _visitor.fold_ident(key);
                let value = Box::new(_visitor.fold_expr(*value));
                return AssignProp { key, value };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_await_expr<V: ?Sized + Fold>(_visitor: &mut V, n: AwaitExpr) -> AwaitExpr {
    {
        match n {
            AwaitExpr { span, arg } => {
                let span = _visitor.fold_span(span);
                let arg = Box::new(_visitor.fold_expr(*arg));
                return AwaitExpr { span, arg };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_big_int<V: ?Sized + Fold>(_visitor: &mut V, n: BigInt) -> BigInt {
    {
        match n {
            BigInt { span, value } => {
                let span = _visitor.fold_span(span);
                let value = _visitor.fold_big_int_value(value);
                return BigInt { span, value };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_bin_expr<V: ?Sized + Fold>(_visitor: &mut V, n: BinExpr) -> BinExpr {
    {
        match n {
            BinExpr {
                span,
                op,
                left,
                right,
            } => {
                let span = _visitor.fold_span(span);
                let op = _visitor.fold_binary_op(op);
                let left = Box::new(_visitor.fold_expr(*left));
                let right = Box::new(_visitor.fold_expr(*right));
                return BinExpr {
                    span,
                    op,
                    left,
                    right,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_binary_op<V: ?Sized + Fold>(_visitor: &mut V, n: BinaryOp) -> BinaryOp {
    {
        match n {
            BinaryOp::EqEq {} => {
                return BinaryOp::EqEq {};
            }
            BinaryOp::NotEq {} => {
                return BinaryOp::NotEq {};
            }
            BinaryOp::EqEqEq {} => {
                return BinaryOp::EqEqEq {};
            }
            BinaryOp::NotEqEq {} => {
                return BinaryOp::NotEqEq {};
            }
            BinaryOp::Lt {} => {
                return BinaryOp::Lt {};
            }
            BinaryOp::LtEq {} => {
                return BinaryOp::LtEq {};
            }
            BinaryOp::Gt {} => {
                return BinaryOp::Gt {};
            }
            BinaryOp::GtEq {} => {
                return BinaryOp::GtEq {};
            }
            BinaryOp::LShift {} => {
                return BinaryOp::LShift {};
            }
            BinaryOp::RShift {} => {
                return BinaryOp::RShift {};
            }
            BinaryOp::ZeroFillRShift {} => {
                return BinaryOp::ZeroFillRShift {};
            }
            BinaryOp::Add {} => {
                return BinaryOp::Add {};
            }
            BinaryOp::Sub {} => {
                return BinaryOp::Sub {};
            }
            BinaryOp::Mul {} => {
                return BinaryOp::Mul {};
            }
            BinaryOp::Div {} => {
                return BinaryOp::Div {};
            }
            BinaryOp::Mod {} => {
                return BinaryOp::Mod {};
            }
            BinaryOp::BitOr {} => {
                return BinaryOp::BitOr {};
            }
            BinaryOp::BitXor {} => {
                return BinaryOp::BitXor {};
            }
            BinaryOp::BitAnd {} => {
                return BinaryOp::BitAnd {};
            }
            BinaryOp::LogicalOr {} => {
                return BinaryOp::LogicalOr {};
            }
            BinaryOp::LogicalAnd {} => {
                return BinaryOp::LogicalAnd {};
            }
            BinaryOp::In {} => {
                return BinaryOp::In {};
            }
            BinaryOp::InstanceOf {} => {
                return BinaryOp::InstanceOf {};
            }
            BinaryOp::Exp {} => {
                return BinaryOp::Exp {};
            }
            BinaryOp::NullishCoalescing {} => {
                return BinaryOp::NullishCoalescing {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_block_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: BlockStmt) -> BlockStmt {
    {
        match n {
            BlockStmt { span, stmts } => {
                let span = _visitor.fold_span(span);
                let stmts = _visitor.fold_stmts(stmts);
                return BlockStmt { span, stmts };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_block_stmt_or_expr<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: BlockStmtOrExpr,
) -> BlockStmtOrExpr {
    {
        match n {
            BlockStmtOrExpr::BlockStmt { 0: _0 } => {
                let _0 = _visitor.fold_block_stmt(_0);
                return BlockStmtOrExpr::BlockStmt { 0: _0 };
            }
            BlockStmtOrExpr::Expr { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_expr(*_0));
                return BlockStmtOrExpr::Expr { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_bool<V: ?Sized + Fold>(_visitor: &mut V, n: Bool) -> Bool {
    {
        match n {
            Bool { span, value } => {
                let span = _visitor.fold_span(span);
                return Bool { span, value };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_break_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: BreakStmt) -> BreakStmt {
    {
        match n {
            BreakStmt { span, label } => {
                let span = _visitor.fold_span(span);
                let label = _visitor.fold_opt_ident(label);
                return BreakStmt { span, label };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_call_expr<V: ?Sized + Fold>(_visitor: &mut V, n: CallExpr) -> CallExpr {
    {
        match n {
            CallExpr {
                span,
                callee,
                args,
                type_args,
            } => {
                let span = _visitor.fold_span(span);
                let callee = _visitor.fold_expr_or_super(callee);
                let args = _visitor.fold_expr_or_spreads(args);
                let type_args = _visitor.fold_opt_ts_type_param_instantiation(type_args);
                return CallExpr {
                    span,
                    callee,
                    args,
                    type_args,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_catch_clause<V: ?Sized + Fold>(_visitor: &mut V, n: CatchClause) -> CatchClause {
    {
        match n {
            CatchClause { span, param, body } => {
                let span = _visitor.fold_span(span);
                let param = _visitor.fold_opt_pat(param);
                let body = _visitor.fold_block_stmt(body);
                return CatchClause { span, param, body };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_class<V: ?Sized + Fold>(_visitor: &mut V, n: Class) -> Class {
    {
        match n {
            Class {
                span,
                decorators,
                body,
                super_class,
                is_abstract,
                type_params,
                super_type_params,
                implements,
            } => {
                let span = _visitor.fold_span(span);
                let decorators = _visitor.fold_decorators(decorators);
                let body = _visitor.fold_class_members(body);
                let super_class = _visitor.fold_opt_expr(super_class);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                let super_type_params =
                    _visitor.fold_opt_ts_type_param_instantiation(super_type_params);
                let implements = _visitor.fold_ts_expr_with_type_args_vec(implements);
                return Class {
                    span,
                    decorators,
                    body,
                    super_class,
                    is_abstract,
                    type_params,
                    super_type_params,
                    implements,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_class_decl<V: ?Sized + Fold>(_visitor: &mut V, n: ClassDecl) -> ClassDecl {
    {
        match n {
            ClassDecl {
                ident,
                declare,
                class,
            } => {
                let ident = _visitor.fold_ident(ident);
                let class = _visitor.fold_class(class);
                return ClassDecl {
                    ident,
                    declare,
                    class,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_class_expr<V: ?Sized + Fold>(_visitor: &mut V, n: ClassExpr) -> ClassExpr {
    {
        match n {
            ClassExpr { ident, class } => {
                let ident = _visitor.fold_opt_ident(ident);
                let class = _visitor.fold_class(class);
                return ClassExpr { ident, class };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_class_member<V: ?Sized + Fold>(_visitor: &mut V, n: ClassMember) -> ClassMember {
    {
        match n {
            ClassMember::Constructor { 0: _0 } => {
                let _0 = _visitor.fold_constructor(_0);
                return ClassMember::Constructor { 0: _0 };
            }
            ClassMember::Method { 0: _0 } => {
                let _0 = _visitor.fold_class_method(_0);
                return ClassMember::Method { 0: _0 };
            }
            ClassMember::PrivateMethod { 0: _0 } => {
                let _0 = _visitor.fold_private_method(_0);
                return ClassMember::PrivateMethod { 0: _0 };
            }
            ClassMember::ClassProp { 0: _0 } => {
                let _0 = _visitor.fold_class_prop(_0);
                return ClassMember::ClassProp { 0: _0 };
            }
            ClassMember::PrivateProp { 0: _0 } => {
                let _0 = _visitor.fold_private_prop(_0);
                return ClassMember::PrivateProp { 0: _0 };
            }
            ClassMember::TsIndexSignature { 0: _0 } => {
                let _0 = _visitor.fold_ts_index_signature(_0);
                return ClassMember::TsIndexSignature { 0: _0 };
            }
            ClassMember::Empty { 0: _0 } => {
                let _0 = _visitor.fold_empty_stmt(_0);
                return ClassMember::Empty { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_class_method<V: ?Sized + Fold>(_visitor: &mut V, n: ClassMethod) -> ClassMethod {
    {
        match n {
            ClassMethod {
                span,
                key,
                function,
                kind,
                is_static,
                accessibility,
                is_abstract,
                is_optional,
            } => {
                let span = _visitor.fold_span(span);
                let key = _visitor.fold_prop_name(key);
                let function = _visitor.fold_function(function);
                let kind = _visitor.fold_method_kind(kind);
                let accessibility = _visitor.fold_opt_accessibility(accessibility);
                return ClassMethod {
                    span,
                    key,
                    function,
                    kind,
                    is_static,
                    accessibility,
                    is_abstract,
                    is_optional,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_class_prop<V: ?Sized + Fold>(_visitor: &mut V, n: ClassProp) -> ClassProp {
    {
        match n {
            ClassProp {
                span,
                key,
                value,
                type_ann,
                is_static,
                decorators,
                computed,
                accessibility,
                is_abstract,
                is_optional,
                readonly,
                definite,
            } => {
                let span = _visitor.fold_span(span);
                let key = Box::new(_visitor.fold_expr(*key));
                let value = _visitor.fold_opt_expr(value);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                let decorators = _visitor.fold_decorators(decorators);
                let accessibility = _visitor.fold_opt_accessibility(accessibility);
                return ClassProp {
                    span,
                    key,
                    value,
                    type_ann,
                    is_static,
                    decorators,
                    computed,
                    accessibility,
                    is_abstract,
                    is_optional,
                    readonly,
                    definite,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_computed_prop_name<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ComputedPropName,
) -> ComputedPropName {
    {
        match n {
            ComputedPropName { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return ComputedPropName { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_cond_expr<V: ?Sized + Fold>(_visitor: &mut V, n: CondExpr) -> CondExpr {
    {
        match n {
            CondExpr {
                span,
                test,
                cons,
                alt,
            } => {
                let span = _visitor.fold_span(span);
                let test = Box::new(_visitor.fold_expr(*test));
                let cons = Box::new(_visitor.fold_expr(*cons));
                let alt = Box::new(_visitor.fold_expr(*alt));
                return CondExpr {
                    span,
                    test,
                    cons,
                    alt,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_constructor<V: ?Sized + Fold>(_visitor: &mut V, n: Constructor) -> Constructor {
    {
        match n {
            Constructor {
                span,
                key,
                params,
                body,
                accessibility,
                is_optional,
            } => {
                let span = _visitor.fold_span(span);
                let key = _visitor.fold_prop_name(key);
                let params = _visitor.fold_param_or_ts_param_props(params);
                let body = _visitor.fold_opt_block_stmt(body);
                let accessibility = _visitor.fold_opt_accessibility(accessibility);
                return Constructor {
                    span,
                    key,
                    params,
                    body,
                    accessibility,
                    is_optional,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_continue_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: ContinueStmt) -> ContinueStmt {
    {
        match n {
            ContinueStmt { span, label } => {
                let span = _visitor.fold_span(span);
                let label = _visitor.fold_opt_ident(label);
                return ContinueStmt { span, label };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_debugger_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: DebuggerStmt) -> DebuggerStmt {
    {
        match n {
            DebuggerStmt { span } => {
                let span = _visitor.fold_span(span);
                return DebuggerStmt { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_decl<V: ?Sized + Fold>(_visitor: &mut V, n: Decl) -> Decl {
    {
        match n {
            Decl::Class { 0: _0 } => {
                let _0 = _visitor.fold_class_decl(_0);
                return Decl::Class { 0: _0 };
            }
            Decl::Fn { 0: _0 } => {
                let _0 = _visitor.fold_fn_decl(_0);
                return Decl::Fn { 0: _0 };
            }
            Decl::Var { 0: _0 } => {
                let _0 = _visitor.fold_var_decl(_0);
                return Decl::Var { 0: _0 };
            }
            Decl::TsInterface { 0: _0 } => {
                let _0 = _visitor.fold_ts_interface_decl(_0);
                return Decl::TsInterface { 0: _0 };
            }
            Decl::TsTypeAlias { 0: _0 } => {
                let _0 = _visitor.fold_ts_type_alias_decl(_0);
                return Decl::TsTypeAlias { 0: _0 };
            }
            Decl::TsEnum { 0: _0 } => {
                let _0 = _visitor.fold_ts_enum_decl(_0);
                return Decl::TsEnum { 0: _0 };
            }
            Decl::TsModule { 0: _0 } => {
                let _0 = _visitor.fold_ts_module_decl(_0);
                return Decl::TsModule { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_decorator<V: ?Sized + Fold>(_visitor: &mut V, n: Decorator) -> Decorator {
    {
        match n {
            Decorator { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return Decorator { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_default_decl<V: ?Sized + Fold>(_visitor: &mut V, n: DefaultDecl) -> DefaultDecl {
    {
        match n {
            DefaultDecl::Class { 0: _0 } => {
                let _0 = _visitor.fold_class_expr(_0);
                return DefaultDecl::Class { 0: _0 };
            }
            DefaultDecl::Fn { 0: _0 } => {
                let _0 = _visitor.fold_fn_expr(_0);
                return DefaultDecl::Fn { 0: _0 };
            }
            DefaultDecl::TsInterfaceDecl { 0: _0 } => {
                let _0 = _visitor.fold_ts_interface_decl(_0);
                return DefaultDecl::TsInterfaceDecl { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_do_while_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: DoWhileStmt) -> DoWhileStmt {
    {
        match n {
            DoWhileStmt { span, test, body } => {
                let span = _visitor.fold_span(span);
                let test = Box::new(_visitor.fold_expr(*test));
                let body = Box::new(_visitor.fold_stmt(*body));
                return DoWhileStmt { span, test, body };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_empty_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: EmptyStmt) -> EmptyStmt {
    {
        match n {
            EmptyStmt { span } => {
                let span = _visitor.fold_span(span);
                return EmptyStmt { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_export_all<V: ?Sized + Fold>(_visitor: &mut V, n: ExportAll) -> ExportAll {
    {
        match n {
            ExportAll { span, src } => {
                let span = _visitor.fold_span(span);
                let src = _visitor.fold_str(src);
                return ExportAll { span, src };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_export_decl<V: ?Sized + Fold>(_visitor: &mut V, n: ExportDecl) -> ExportDecl {
    {
        match n {
            ExportDecl { span, decl } => {
                let span = _visitor.fold_span(span);
                let decl = _visitor.fold_decl(decl);
                return ExportDecl { span, decl };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_export_default_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ExportDefaultDecl,
) -> ExportDefaultDecl {
    {
        match n {
            ExportDefaultDecl { span, decl } => {
                let span = _visitor.fold_span(span);
                let decl = _visitor.fold_default_decl(decl);
                return ExportDefaultDecl { span, decl };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_export_default_expr<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ExportDefaultExpr,
) -> ExportDefaultExpr {
    {
        match n {
            ExportDefaultExpr { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return ExportDefaultExpr { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_export_default_specifier<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ExportDefaultSpecifier,
) -> ExportDefaultSpecifier {
    {
        match n {
            ExportDefaultSpecifier { exported } => {
                let exported = _visitor.fold_ident(exported);
                return ExportDefaultSpecifier { exported };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_export_named_specifier<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ExportNamedSpecifier,
) -> ExportNamedSpecifier {
    {
        match n {
            ExportNamedSpecifier {
                span,
                orig,
                exported,
            } => {
                let span = _visitor.fold_span(span);
                let orig = _visitor.fold_ident(orig);
                let exported = _visitor.fold_opt_ident(exported);
                return ExportNamedSpecifier {
                    span,
                    orig,
                    exported,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_export_namespace_specifier<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ExportNamespaceSpecifier,
) -> ExportNamespaceSpecifier {
    {
        match n {
            ExportNamespaceSpecifier { span, name } => {
                let span = _visitor.fold_span(span);
                let name = _visitor.fold_ident(name);
                return ExportNamespaceSpecifier { span, name };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_export_specifier<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ExportSpecifier,
) -> ExportSpecifier {
    {
        match n {
            ExportSpecifier::Namespace { 0: _0 } => {
                let _0 = _visitor.fold_export_namespace_specifier(_0);
                return ExportSpecifier::Namespace { 0: _0 };
            }
            ExportSpecifier::Default { 0: _0 } => {
                let _0 = _visitor.fold_export_default_specifier(_0);
                return ExportSpecifier::Default { 0: _0 };
            }
            ExportSpecifier::Named { 0: _0 } => {
                let _0 = _visitor.fold_export_named_specifier(_0);
                return ExportSpecifier::Named { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_expr<V: ?Sized + Fold>(_visitor: &mut V, n: Expr) -> Expr {
    {
        match n {
            Expr::This { 0: _0 } => {
                let _0 = _visitor.fold_this_expr(_0);
                return Expr::This { 0: _0 };
            }
            Expr::Array { 0: _0 } => {
                let _0 = _visitor.fold_array_lit(_0);
                return Expr::Array { 0: _0 };
            }
            Expr::Object { 0: _0 } => {
                let _0 = _visitor.fold_object_lit(_0);
                return Expr::Object { 0: _0 };
            }
            Expr::Fn { 0: _0 } => {
                let _0 = _visitor.fold_fn_expr(_0);
                return Expr::Fn { 0: _0 };
            }
            Expr::Unary { 0: _0 } => {
                let _0 = _visitor.fold_unary_expr(_0);
                return Expr::Unary { 0: _0 };
            }
            Expr::Update { 0: _0 } => {
                let _0 = _visitor.fold_update_expr(_0);
                return Expr::Update { 0: _0 };
            }
            Expr::Bin { 0: _0 } => {
                let _0 = _visitor.fold_bin_expr(_0);
                return Expr::Bin { 0: _0 };
            }
            Expr::Assign { 0: _0 } => {
                let _0 = _visitor.fold_assign_expr(_0);
                return Expr::Assign { 0: _0 };
            }
            Expr::Member { 0: _0 } => {
                let _0 = _visitor.fold_member_expr(_0);
                return Expr::Member { 0: _0 };
            }
            Expr::Cond { 0: _0 } => {
                let _0 = _visitor.fold_cond_expr(_0);
                return Expr::Cond { 0: _0 };
            }
            Expr::Call { 0: _0 } => {
                let _0 = _visitor.fold_call_expr(_0);
                return Expr::Call { 0: _0 };
            }
            Expr::New { 0: _0 } => {
                let _0 = _visitor.fold_new_expr(_0);
                return Expr::New { 0: _0 };
            }
            Expr::Seq { 0: _0 } => {
                let _0 = _visitor.fold_seq_expr(_0);
                return Expr::Seq { 0: _0 };
            }
            Expr::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return Expr::Ident { 0: _0 };
            }
            Expr::Lit { 0: _0 } => {
                let _0 = _visitor.fold_lit(_0);
                return Expr::Lit { 0: _0 };
            }
            Expr::Tpl { 0: _0 } => {
                let _0 = _visitor.fold_tpl(_0);
                return Expr::Tpl { 0: _0 };
            }
            Expr::TaggedTpl { 0: _0 } => {
                let _0 = _visitor.fold_tagged_tpl(_0);
                return Expr::TaggedTpl { 0: _0 };
            }
            Expr::Arrow { 0: _0 } => {
                let _0 = _visitor.fold_arrow_expr(_0);
                return Expr::Arrow { 0: _0 };
            }
            Expr::Class { 0: _0 } => {
                let _0 = _visitor.fold_class_expr(_0);
                return Expr::Class { 0: _0 };
            }
            Expr::Yield { 0: _0 } => {
                let _0 = _visitor.fold_yield_expr(_0);
                return Expr::Yield { 0: _0 };
            }
            Expr::MetaProp { 0: _0 } => {
                let _0 = _visitor.fold_meta_prop_expr(_0);
                return Expr::MetaProp { 0: _0 };
            }
            Expr::Await { 0: _0 } => {
                let _0 = _visitor.fold_await_expr(_0);
                return Expr::Await { 0: _0 };
            }
            Expr::Paren { 0: _0 } => {
                let _0 = _visitor.fold_paren_expr(_0);
                return Expr::Paren { 0: _0 };
            }
            Expr::JSXMember { 0: _0 } => {
                let _0 = _visitor.fold_jsx_member_expr(_0);
                return Expr::JSXMember { 0: _0 };
            }
            Expr::JSXNamespacedName { 0: _0 } => {
                let _0 = _visitor.fold_jsx_namespaced_name(_0);
                return Expr::JSXNamespacedName { 0: _0 };
            }
            Expr::JSXEmpty { 0: _0 } => {
                let _0 = _visitor.fold_jsx_empty_expr(_0);
                return Expr::JSXEmpty { 0: _0 };
            }
            Expr::JSXElement { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_jsx_element(*_0));
                return Expr::JSXElement { 0: _0 };
            }
            Expr::JSXFragment { 0: _0 } => {
                let _0 = _visitor.fold_jsx_fragment(_0);
                return Expr::JSXFragment { 0: _0 };
            }
            Expr::TsTypeAssertion { 0: _0 } => {
                let _0 = _visitor.fold_ts_type_assertion(_0);
                return Expr::TsTypeAssertion { 0: _0 };
            }
            Expr::TsConstAssertion { 0: _0 } => {
                let _0 = _visitor.fold_ts_const_assertion(_0);
                return Expr::TsConstAssertion { 0: _0 };
            }
            Expr::TsNonNull { 0: _0 } => {
                let _0 = _visitor.fold_ts_non_null_expr(_0);
                return Expr::TsNonNull { 0: _0 };
            }
            Expr::TsTypeCast { 0: _0 } => {
                let _0 = _visitor.fold_ts_type_cast_expr(_0);
                return Expr::TsTypeCast { 0: _0 };
            }
            Expr::TsAs { 0: _0 } => {
                let _0 = _visitor.fold_ts_as_expr(_0);
                return Expr::TsAs { 0: _0 };
            }
            Expr::PrivateName { 0: _0 } => {
                let _0 = _visitor.fold_private_name(_0);
                return Expr::PrivateName { 0: _0 };
            }
            Expr::OptChain { 0: _0 } => {
                let _0 = _visitor.fold_opt_chain_expr(_0);
                return Expr::OptChain { 0: _0 };
            }
            Expr::Invalid { 0: _0 } => {
                let _0 = _visitor.fold_invalid(_0);
                return Expr::Invalid { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_expr_or_spread<V: ?Sized + Fold>(_visitor: &mut V, n: ExprOrSpread) -> ExprOrSpread {
    {
        match n {
            ExprOrSpread { spread, expr } => {
                let spread = _visitor.fold_opt_span(spread);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return ExprOrSpread { spread, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_expr_or_super<V: ?Sized + Fold>(_visitor: &mut V, n: ExprOrSuper) -> ExprOrSuper {
    {
        match n {
            ExprOrSuper::Super { 0: _0 } => {
                let _0 = _visitor.fold_super(_0);
                return ExprOrSuper::Super { 0: _0 };
            }
            ExprOrSuper::Expr { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_expr(*_0));
                return ExprOrSuper::Expr { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_expr_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: ExprStmt) -> ExprStmt {
    {
        match n {
            ExprStmt { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return ExprStmt { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_fn_decl<V: ?Sized + Fold>(_visitor: &mut V, n: FnDecl) -> FnDecl {
    {
        match n {
            FnDecl {
                ident,
                declare,
                function,
            } => {
                let ident = _visitor.fold_ident(ident);
                let function = _visitor.fold_function(function);
                return FnDecl {
                    ident,
                    declare,
                    function,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_fn_expr<V: ?Sized + Fold>(_visitor: &mut V, n: FnExpr) -> FnExpr {
    {
        match n {
            FnExpr { ident, function } => {
                let ident = _visitor.fold_opt_ident(ident);
                let function = _visitor.fold_function(function);
                return FnExpr { ident, function };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_for_in_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: ForInStmt) -> ForInStmt {
    {
        match n {
            ForInStmt {
                span,
                left,
                right,
                body,
            } => {
                let span = _visitor.fold_span(span);
                let left = _visitor.fold_var_decl_or_pat(left);
                let right = Box::new(_visitor.fold_expr(*right));
                let body = Box::new(_visitor.fold_stmt(*body));
                return ForInStmt {
                    span,
                    left,
                    right,
                    body,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_for_of_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: ForOfStmt) -> ForOfStmt {
    {
        match n {
            ForOfStmt {
                span,
                await_token,
                left,
                right,
                body,
            } => {
                let span = _visitor.fold_span(span);
                let await_token = _visitor.fold_opt_span(await_token);
                let left = _visitor.fold_var_decl_or_pat(left);
                let right = Box::new(_visitor.fold_expr(*right));
                let body = Box::new(_visitor.fold_stmt(*body));
                return ForOfStmt {
                    span,
                    await_token,
                    left,
                    right,
                    body,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_for_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: ForStmt) -> ForStmt {
    {
        match n {
            ForStmt {
                span,
                init,
                test,
                update,
                body,
            } => {
                let span = _visitor.fold_span(span);
                let init = _visitor.fold_opt_var_decl_or_expr(init);
                let test = _visitor.fold_opt_expr(test);
                let update = _visitor.fold_opt_expr(update);
                let body = Box::new(_visitor.fold_stmt(*body));
                return ForStmt {
                    span,
                    init,
                    test,
                    update,
                    body,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_function<V: ?Sized + Fold>(_visitor: &mut V, n: Function) -> Function {
    {
        match n {
            Function {
                params,
                decorators,
                span,
                body,
                is_generator,
                is_async,
                type_params,
                return_type,
            } => {
                let params = _visitor.fold_params(params);
                let decorators = _visitor.fold_decorators(decorators);
                let span = _visitor.fold_span(span);
                let body = _visitor.fold_opt_block_stmt(body);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                let return_type = _visitor.fold_opt_ts_type_ann(return_type);
                return Function {
                    params,
                    decorators,
                    span,
                    body,
                    is_generator,
                    is_async,
                    type_params,
                    return_type,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_getter_prop<V: ?Sized + Fold>(_visitor: &mut V, n: GetterProp) -> GetterProp {
    {
        match n {
            GetterProp {
                span,
                key,
                type_ann,
                body,
            } => {
                let span = _visitor.fold_span(span);
                let key = _visitor.fold_prop_name(key);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                let body = _visitor.fold_opt_block_stmt(body);
                return GetterProp {
                    span,
                    key,
                    type_ann,
                    body,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ident<V: ?Sized + Fold>(_visitor: &mut V, n: Ident) -> Ident {
    {
        match n {
            Ident {
                span,
                sym,
                type_ann,
                optional,
            } => {
                let span = _visitor.fold_span(span);
                let sym = _visitor.fold_js_word(sym);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                return Ident {
                    span,
                    sym,
                    type_ann,
                    optional,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_if_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: IfStmt) -> IfStmt {
    {
        match n {
            IfStmt {
                span,
                test,
                cons,
                alt,
            } => {
                let span = _visitor.fold_span(span);
                let test = Box::new(_visitor.fold_expr(*test));
                let cons = Box::new(_visitor.fold_stmt(*cons));
                let alt = _visitor.fold_opt_stmt(alt);
                return IfStmt {
                    span,
                    test,
                    cons,
                    alt,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_import_decl<V: ?Sized + Fold>(_visitor: &mut V, n: ImportDecl) -> ImportDecl {
    {
        match n {
            ImportDecl {
                span,
                specifiers,
                src,
                type_only,
            } => {
                let span = _visitor.fold_span(span);
                let specifiers = _visitor.fold_import_specifiers(specifiers);
                let src = _visitor.fold_str(src);
                return ImportDecl {
                    span,
                    specifiers,
                    src,
                    type_only,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_import_default_specifier<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ImportDefaultSpecifier,
) -> ImportDefaultSpecifier {
    {
        match n {
            ImportDefaultSpecifier { span, local } => {
                let span = _visitor.fold_span(span);
                let local = _visitor.fold_ident(local);
                return ImportDefaultSpecifier { span, local };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_import_named_specifier<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ImportNamedSpecifier,
) -> ImportNamedSpecifier {
    {
        match n {
            ImportNamedSpecifier {
                span,
                local,
                imported,
            } => {
                let span = _visitor.fold_span(span);
                let local = _visitor.fold_ident(local);
                let imported = _visitor.fold_opt_ident(imported);
                return ImportNamedSpecifier {
                    span,
                    local,
                    imported,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_import_specifier<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ImportSpecifier,
) -> ImportSpecifier {
    {
        match n {
            ImportSpecifier::Named { 0: _0 } => {
                let _0 = _visitor.fold_import_named_specifier(_0);
                return ImportSpecifier::Named { 0: _0 };
            }
            ImportSpecifier::Default { 0: _0 } => {
                let _0 = _visitor.fold_import_default_specifier(_0);
                return ImportSpecifier::Default { 0: _0 };
            }
            ImportSpecifier::Namespace { 0: _0 } => {
                let _0 = _visitor.fold_import_star_as_specifier(_0);
                return ImportSpecifier::Namespace { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_import_star_as_specifier<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ImportStarAsSpecifier,
) -> ImportStarAsSpecifier {
    {
        match n {
            ImportStarAsSpecifier { span, local } => {
                let span = _visitor.fold_span(span);
                let local = _visitor.fold_ident(local);
                return ImportStarAsSpecifier { span, local };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_invalid<V: ?Sized + Fold>(_visitor: &mut V, n: Invalid) -> Invalid {
    {
        match n {
            Invalid { span } => {
                let span = _visitor.fold_span(span);
                return Invalid { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_attr<V: ?Sized + Fold>(_visitor: &mut V, n: JSXAttr) -> JSXAttr {
    {
        match n {
            JSXAttr { span, name, value } => {
                let span = _visitor.fold_span(span);
                let name = _visitor.fold_jsx_attr_name(name);
                let value = _visitor.fold_opt_jsx_attr_value(value);
                return JSXAttr { span, name, value };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_attr_name<V: ?Sized + Fold>(_visitor: &mut V, n: JSXAttrName) -> JSXAttrName {
    {
        match n {
            JSXAttrName::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return JSXAttrName::Ident { 0: _0 };
            }
            JSXAttrName::JSXNamespacedName { 0: _0 } => {
                let _0 = _visitor.fold_jsx_namespaced_name(_0);
                return JSXAttrName::JSXNamespacedName { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_attr_or_spread<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXAttrOrSpread,
) -> JSXAttrOrSpread {
    {
        match n {
            JSXAttrOrSpread::JSXAttr { 0: _0 } => {
                let _0 = _visitor.fold_jsx_attr(_0);
                return JSXAttrOrSpread::JSXAttr { 0: _0 };
            }
            JSXAttrOrSpread::SpreadElement { 0: _0 } => {
                let _0 = _visitor.fold_spread_element(_0);
                return JSXAttrOrSpread::SpreadElement { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_attr_value<V: ?Sized + Fold>(_visitor: &mut V, n: JSXAttrValue) -> JSXAttrValue {
    {
        match n {
            JSXAttrValue::Lit { 0: _0 } => {
                let _0 = _visitor.fold_lit(_0);
                return JSXAttrValue::Lit { 0: _0 };
            }
            JSXAttrValue::JSXExprContainer { 0: _0 } => {
                let _0 = _visitor.fold_jsx_expr_container(_0);
                return JSXAttrValue::JSXExprContainer { 0: _0 };
            }
            JSXAttrValue::JSXElement { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_jsx_element(*_0));
                return JSXAttrValue::JSXElement { 0: _0 };
            }
            JSXAttrValue::JSXFragment { 0: _0 } => {
                let _0 = _visitor.fold_jsx_fragment(_0);
                return JSXAttrValue::JSXFragment { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_closing_element<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXClosingElement,
) -> JSXClosingElement {
    {
        match n {
            JSXClosingElement { span, name } => {
                let span = _visitor.fold_span(span);
                let name = _visitor.fold_jsx_element_name(name);
                return JSXClosingElement { span, name };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_closing_fragment<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXClosingFragment,
) -> JSXClosingFragment {
    {
        match n {
            JSXClosingFragment { span } => {
                let span = _visitor.fold_span(span);
                return JSXClosingFragment { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_element<V: ?Sized + Fold>(_visitor: &mut V, n: JSXElement) -> JSXElement {
    {
        match n {
            JSXElement {
                span,
                opening,
                children,
                closing,
            } => {
                let span = _visitor.fold_span(span);
                let opening = _visitor.fold_jsx_opening_element(opening);
                let children = _visitor.fold_jsx_element_children(children);
                let closing = _visitor.fold_opt_jsx_closing_element(closing);
                return JSXElement {
                    span,
                    opening,
                    children,
                    closing,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_element_child<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXElementChild,
) -> JSXElementChild {
    {
        match n {
            JSXElementChild::JSXText { 0: _0 } => {
                let _0 = _visitor.fold_jsx_text(_0);
                return JSXElementChild::JSXText { 0: _0 };
            }
            JSXElementChild::JSXExprContainer { 0: _0 } => {
                let _0 = _visitor.fold_jsx_expr_container(_0);
                return JSXElementChild::JSXExprContainer { 0: _0 };
            }
            JSXElementChild::JSXSpreadChild { 0: _0 } => {
                let _0 = _visitor.fold_jsx_spread_child(_0);
                return JSXElementChild::JSXSpreadChild { 0: _0 };
            }
            JSXElementChild::JSXElement { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_jsx_element(*_0));
                return JSXElementChild::JSXElement { 0: _0 };
            }
            JSXElementChild::JSXFragment { 0: _0 } => {
                let _0 = _visitor.fold_jsx_fragment(_0);
                return JSXElementChild::JSXFragment { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_element_name<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXElementName,
) -> JSXElementName {
    {
        match n {
            JSXElementName::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return JSXElementName::Ident { 0: _0 };
            }
            JSXElementName::JSXMemberExpr { 0: _0 } => {
                let _0 = _visitor.fold_jsx_member_expr(_0);
                return JSXElementName::JSXMemberExpr { 0: _0 };
            }
            JSXElementName::JSXNamespacedName { 0: _0 } => {
                let _0 = _visitor.fold_jsx_namespaced_name(_0);
                return JSXElementName::JSXNamespacedName { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_empty_expr<V: ?Sized + Fold>(_visitor: &mut V, n: JSXEmptyExpr) -> JSXEmptyExpr {
    {
        match n {
            JSXEmptyExpr { span } => {
                let span = _visitor.fold_span(span);
                return JSXEmptyExpr { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_expr<V: ?Sized + Fold>(_visitor: &mut V, n: JSXExpr) -> JSXExpr {
    {
        match n {
            JSXExpr::JSXEmptyExpr { 0: _0 } => {
                let _0 = _visitor.fold_jsx_empty_expr(_0);
                return JSXExpr::JSXEmptyExpr { 0: _0 };
            }
            JSXExpr::Expr { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_expr(*_0));
                return JSXExpr::Expr { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_expr_container<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXExprContainer,
) -> JSXExprContainer {
    {
        match n {
            JSXExprContainer { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = _visitor.fold_jsx_expr(expr);
                return JSXExprContainer { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_fragment<V: ?Sized + Fold>(_visitor: &mut V, n: JSXFragment) -> JSXFragment {
    {
        match n {
            JSXFragment {
                span,
                opening,
                children,
                closing,
            } => {
                let span = _visitor.fold_span(span);
                let opening = _visitor.fold_jsx_opening_fragment(opening);
                let children = _visitor.fold_jsx_element_children(children);
                let closing = _visitor.fold_jsx_closing_fragment(closing);
                return JSXFragment {
                    span,
                    opening,
                    children,
                    closing,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_member_expr<V: ?Sized + Fold>(_visitor: &mut V, n: JSXMemberExpr) -> JSXMemberExpr {
    {
        match n {
            JSXMemberExpr { obj, prop } => {
                let obj = _visitor.fold_jsx_object(obj);
                let prop = _visitor.fold_ident(prop);
                return JSXMemberExpr { obj, prop };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_namespaced_name<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXNamespacedName,
) -> JSXNamespacedName {
    {
        match n {
            JSXNamespacedName { ns, name } => {
                let ns = _visitor.fold_ident(ns);
                let name = _visitor.fold_ident(name);
                return JSXNamespacedName { ns, name };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_object<V: ?Sized + Fold>(_visitor: &mut V, n: JSXObject) -> JSXObject {
    {
        match n {
            JSXObject::JSXMemberExpr { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_jsx_member_expr(*_0));
                return JSXObject::JSXMemberExpr { 0: _0 };
            }
            JSXObject::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return JSXObject::Ident { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_opening_element<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXOpeningElement,
) -> JSXOpeningElement {
    {
        match n {
            JSXOpeningElement {
                name,
                span,
                attrs,
                self_closing,
                type_args,
            } => {
                let name = _visitor.fold_jsx_element_name(name);
                let span = _visitor.fold_span(span);
                let attrs = _visitor.fold_jsx_attr_or_spreads(attrs);
                let type_args = _visitor.fold_opt_ts_type_param_instantiation(type_args);
                return JSXOpeningElement {
                    name,
                    span,
                    attrs,
                    self_closing,
                    type_args,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_opening_fragment<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXOpeningFragment,
) -> JSXOpeningFragment {
    {
        match n {
            JSXOpeningFragment { span } => {
                let span = _visitor.fold_span(span);
                return JSXOpeningFragment { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_spread_child<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: JSXSpreadChild,
) -> JSXSpreadChild {
    {
        match n {
            JSXSpreadChild { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return JSXSpreadChild { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_text<V: ?Sized + Fold>(_visitor: &mut V, n: JSXText) -> JSXText {
    {
        match n {
            JSXText { span, value, raw } => {
                let span = _visitor.fold_span(span);
                let value = _visitor.fold_js_word(value);
                let raw = _visitor.fold_js_word(raw);
                return JSXText { span, value, raw };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_key_value_pat_prop<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: KeyValuePatProp,
) -> KeyValuePatProp {
    {
        match n {
            KeyValuePatProp { key, value } => {
                let key = _visitor.fold_prop_name(key);
                let value = Box::new(_visitor.fold_pat(*value));
                return KeyValuePatProp { key, value };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_key_value_prop<V: ?Sized + Fold>(_visitor: &mut V, n: KeyValueProp) -> KeyValueProp {
    {
        match n {
            KeyValueProp { key, value } => {
                let key = _visitor.fold_prop_name(key);
                let value = Box::new(_visitor.fold_expr(*value));
                return KeyValueProp { key, value };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_labeled_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: LabeledStmt) -> LabeledStmt {
    {
        match n {
            LabeledStmt { span, label, body } => {
                let span = _visitor.fold_span(span);
                let label = _visitor.fold_ident(label);
                let body = Box::new(_visitor.fold_stmt(*body));
                return LabeledStmt { span, label, body };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_lit<V: ?Sized + Fold>(_visitor: &mut V, n: Lit) -> Lit {
    {
        match n {
            Lit::Str { 0: _0 } => {
                let _0 = _visitor.fold_str(_0);
                return Lit::Str { 0: _0 };
            }
            Lit::Bool { 0: _0 } => {
                let _0 = _visitor.fold_bool(_0);
                return Lit::Bool { 0: _0 };
            }
            Lit::Null { 0: _0 } => {
                let _0 = _visitor.fold_null(_0);
                return Lit::Null { 0: _0 };
            }
            Lit::Num { 0: _0 } => {
                let _0 = _visitor.fold_number(_0);
                return Lit::Num { 0: _0 };
            }
            Lit::BigInt { 0: _0 } => {
                let _0 = _visitor.fold_big_int(_0);
                return Lit::BigInt { 0: _0 };
            }
            Lit::Regex { 0: _0 } => {
                let _0 = _visitor.fold_regex(_0);
                return Lit::Regex { 0: _0 };
            }
            Lit::JSXText { 0: _0 } => {
                let _0 = _visitor.fold_jsx_text(_0);
                return Lit::JSXText { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_member_expr<V: ?Sized + Fold>(_visitor: &mut V, n: MemberExpr) -> MemberExpr {
    {
        match n {
            MemberExpr {
                span,
                obj,
                prop,
                computed,
            } => {
                let span = _visitor.fold_span(span);
                let obj = _visitor.fold_expr_or_super(obj);
                let prop = Box::new(_visitor.fold_expr(*prop));
                return MemberExpr {
                    span,
                    obj,
                    prop,
                    computed,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_meta_prop_expr<V: ?Sized + Fold>(_visitor: &mut V, n: MetaPropExpr) -> MetaPropExpr {
    {
        match n {
            MetaPropExpr { meta, prop } => {
                let meta = _visitor.fold_ident(meta);
                let prop = _visitor.fold_ident(prop);
                return MetaPropExpr { meta, prop };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_method_kind<V: ?Sized + Fold>(_visitor: &mut V, n: MethodKind) -> MethodKind {
    {
        match n {
            MethodKind::Method {} => {
                return MethodKind::Method {};
            }
            MethodKind::Getter {} => {
                return MethodKind::Getter {};
            }
            MethodKind::Setter {} => {
                return MethodKind::Setter {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_method_prop<V: ?Sized + Fold>(_visitor: &mut V, n: MethodProp) -> MethodProp {
    {
        match n {
            MethodProp { key, function } => {
                let key = _visitor.fold_prop_name(key);
                let function = _visitor.fold_function(function);
                return MethodProp { key, function };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_module<V: ?Sized + Fold>(_visitor: &mut V, n: Module) -> Module {
    {
        match n {
            Module {
                span,
                body,
                shebang,
            } => {
                let span = _visitor.fold_span(span);
                let body = _visitor.fold_module_items(body);
                let shebang = _visitor.fold_opt_js_word(shebang);
                return Module {
                    span,
                    body,
                    shebang,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_module_decl<V: ?Sized + Fold>(_visitor: &mut V, n: ModuleDecl) -> ModuleDecl {
    {
        match n {
            ModuleDecl::Import { 0: _0 } => {
                let _0 = _visitor.fold_import_decl(_0);
                return ModuleDecl::Import { 0: _0 };
            }
            ModuleDecl::ExportDecl { 0: _0 } => {
                let _0 = _visitor.fold_export_decl(_0);
                return ModuleDecl::ExportDecl { 0: _0 };
            }
            ModuleDecl::ExportNamed { 0: _0 } => {
                let _0 = _visitor.fold_named_export(_0);
                return ModuleDecl::ExportNamed { 0: _0 };
            }
            ModuleDecl::ExportDefaultDecl { 0: _0 } => {
                let _0 = _visitor.fold_export_default_decl(_0);
                return ModuleDecl::ExportDefaultDecl { 0: _0 };
            }
            ModuleDecl::ExportDefaultExpr { 0: _0 } => {
                let _0 = _visitor.fold_export_default_expr(_0);
                return ModuleDecl::ExportDefaultExpr { 0: _0 };
            }
            ModuleDecl::ExportAll { 0: _0 } => {
                let _0 = _visitor.fold_export_all(_0);
                return ModuleDecl::ExportAll { 0: _0 };
            }
            ModuleDecl::TsImportEquals { 0: _0 } => {
                let _0 = _visitor.fold_ts_import_equals_decl(_0);
                return ModuleDecl::TsImportEquals { 0: _0 };
            }
            ModuleDecl::TsExportAssignment { 0: _0 } => {
                let _0 = _visitor.fold_ts_export_assignment(_0);
                return ModuleDecl::TsExportAssignment { 0: _0 };
            }
            ModuleDecl::TsNamespaceExport { 0: _0 } => {
                let _0 = _visitor.fold_ts_namespace_export_decl(_0);
                return ModuleDecl::TsNamespaceExport { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_module_item<V: ?Sized + Fold>(_visitor: &mut V, n: ModuleItem) -> ModuleItem {
    {
        match n {
            ModuleItem::ModuleDecl { 0: _0 } => {
                let _0 = _visitor.fold_module_decl(_0);
                return ModuleItem::ModuleDecl { 0: _0 };
            }
            ModuleItem::Stmt { 0: _0 } => {
                let _0 = _visitor.fold_stmt(_0);
                return ModuleItem::Stmt { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_named_export<V: ?Sized + Fold>(_visitor: &mut V, n: NamedExport) -> NamedExport {
    {
        match n {
            NamedExport {
                span,
                specifiers,
                src,
                type_only,
            } => {
                let span = _visitor.fold_span(span);
                let specifiers = _visitor.fold_export_specifiers(specifiers);
                let src = _visitor.fold_opt_str(src);
                return NamedExport {
                    span,
                    specifiers,
                    src,
                    type_only,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_new_expr<V: ?Sized + Fold>(_visitor: &mut V, n: NewExpr) -> NewExpr {
    {
        match n {
            NewExpr {
                span,
                callee,
                args,
                type_args,
            } => {
                let span = _visitor.fold_span(span);
                let callee = Box::new(_visitor.fold_expr(*callee));
                let args = _visitor.fold_opt_expr_or_spreads(args);
                let type_args = _visitor.fold_opt_ts_type_param_instantiation(type_args);
                return NewExpr {
                    span,
                    callee,
                    args,
                    type_args,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_null<V: ?Sized + Fold>(_visitor: &mut V, n: Null) -> Null {
    {
        match n {
            Null { span } => {
                let span = _visitor.fold_span(span);
                return Null { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_number<V: ?Sized + Fold>(_visitor: &mut V, n: Number) -> Number {
    {
        match n {
            Number { span, value } => {
                let span = _visitor.fold_span(span);
                return Number { span, value };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_object_lit<V: ?Sized + Fold>(_visitor: &mut V, n: ObjectLit) -> ObjectLit {
    {
        match n {
            ObjectLit { span, props } => {
                let span = _visitor.fold_span(span);
                let props = _visitor.fold_prop_or_spreads(props);
                return ObjectLit { span, props };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_object_pat<V: ?Sized + Fold>(_visitor: &mut V, n: ObjectPat) -> ObjectPat {
    {
        match n {
            ObjectPat {
                span,
                props,
                optional,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let props = _visitor.fold_object_pat_props(props);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                return ObjectPat {
                    span,
                    props,
                    optional,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_object_pat_prop<V: ?Sized + Fold>(_visitor: &mut V, n: ObjectPatProp) -> ObjectPatProp {
    {
        match n {
            ObjectPatProp::KeyValue { 0: _0 } => {
                let _0 = _visitor.fold_key_value_pat_prop(_0);
                return ObjectPatProp::KeyValue { 0: _0 };
            }
            ObjectPatProp::Assign { 0: _0 } => {
                let _0 = _visitor.fold_assign_pat_prop(_0);
                return ObjectPatProp::Assign { 0: _0 };
            }
            ObjectPatProp::Rest { 0: _0 } => {
                let _0 = _visitor.fold_rest_pat(_0);
                return ObjectPatProp::Rest { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_opt_chain_expr<V: ?Sized + Fold>(_visitor: &mut V, n: OptChainExpr) -> OptChainExpr {
    {
        match n {
            OptChainExpr { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return OptChainExpr { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_param<V: ?Sized + Fold>(_visitor: &mut V, n: Param) -> Param {
    {
        match n {
            Param {
                span,
                decorators,
                pat,
            } => {
                let span = _visitor.fold_span(span);
                let decorators = _visitor.fold_decorators(decorators);
                let pat = _visitor.fold_pat(pat);
                return Param {
                    span,
                    decorators,
                    pat,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_param_or_ts_param_prop<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: ParamOrTsParamProp,
) -> ParamOrTsParamProp {
    {
        match n {
            ParamOrTsParamProp::TsParamProp { 0: _0 } => {
                let _0 = _visitor.fold_ts_param_prop(_0);
                return ParamOrTsParamProp::TsParamProp { 0: _0 };
            }
            ParamOrTsParamProp::Param { 0: _0 } => {
                let _0 = _visitor.fold_param(_0);
                return ParamOrTsParamProp::Param { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_paren_expr<V: ?Sized + Fold>(_visitor: &mut V, n: ParenExpr) -> ParenExpr {
    {
        match n {
            ParenExpr { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return ParenExpr { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_pat<V: ?Sized + Fold>(_visitor: &mut V, n: Pat) -> Pat {
    {
        match n {
            Pat::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return Pat::Ident { 0: _0 };
            }
            Pat::Array { 0: _0 } => {
                let _0 = _visitor.fold_array_pat(_0);
                return Pat::Array { 0: _0 };
            }
            Pat::Rest { 0: _0 } => {
                let _0 = _visitor.fold_rest_pat(_0);
                return Pat::Rest { 0: _0 };
            }
            Pat::Object { 0: _0 } => {
                let _0 = _visitor.fold_object_pat(_0);
                return Pat::Object { 0: _0 };
            }
            Pat::Assign { 0: _0 } => {
                let _0 = _visitor.fold_assign_pat(_0);
                return Pat::Assign { 0: _0 };
            }
            Pat::Invalid { 0: _0 } => {
                let _0 = _visitor.fold_invalid(_0);
                return Pat::Invalid { 0: _0 };
            }
            Pat::Expr { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_expr(*_0));
                return Pat::Expr { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_pat_or_expr<V: ?Sized + Fold>(_visitor: &mut V, n: PatOrExpr) -> PatOrExpr {
    {
        match n {
            PatOrExpr::Expr { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_expr(*_0));
                return PatOrExpr::Expr { 0: _0 };
            }
            PatOrExpr::Pat { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_pat(*_0));
                return PatOrExpr::Pat { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_private_method<V: ?Sized + Fold>(_visitor: &mut V, n: PrivateMethod) -> PrivateMethod {
    {
        match n {
            PrivateMethod {
                span,
                key,
                function,
                kind,
                is_static,
                accessibility,
                is_abstract,
                is_optional,
            } => {
                let span = _visitor.fold_span(span);
                let key = _visitor.fold_private_name(key);
                let function = _visitor.fold_function(function);
                let kind = _visitor.fold_method_kind(kind);
                let accessibility = _visitor.fold_opt_accessibility(accessibility);
                return PrivateMethod {
                    span,
                    key,
                    function,
                    kind,
                    is_static,
                    accessibility,
                    is_abstract,
                    is_optional,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_private_name<V: ?Sized + Fold>(_visitor: &mut V, n: PrivateName) -> PrivateName {
    {
        match n {
            PrivateName { span, id } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ident(id);
                return PrivateName { span, id };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_private_prop<V: ?Sized + Fold>(_visitor: &mut V, n: PrivateProp) -> PrivateProp {
    {
        match n {
            PrivateProp {
                span,
                key,
                value,
                type_ann,
                is_static,
                decorators,
                computed,
                accessibility,
                is_abstract,
                is_optional,
                readonly,
                definite,
            } => {
                let span = _visitor.fold_span(span);
                let key = _visitor.fold_private_name(key);
                let value = _visitor.fold_opt_expr(value);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                let decorators = _visitor.fold_decorators(decorators);
                let accessibility = _visitor.fold_opt_accessibility(accessibility);
                return PrivateProp {
                    span,
                    key,
                    value,
                    type_ann,
                    is_static,
                    decorators,
                    computed,
                    accessibility,
                    is_abstract,
                    is_optional,
                    readonly,
                    definite,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_program<V: ?Sized + Fold>(_visitor: &mut V, n: Program) -> Program {
    {
        match n {
            Program::Module { 0: _0 } => {
                let _0 = _visitor.fold_module(_0);
                return Program::Module { 0: _0 };
            }
            Program::Script { 0: _0 } => {
                let _0 = _visitor.fold_script(_0);
                return Program::Script { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_prop<V: ?Sized + Fold>(_visitor: &mut V, n: Prop) -> Prop {
    {
        match n {
            Prop::Shorthand { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return Prop::Shorthand { 0: _0 };
            }
            Prop::KeyValue { 0: _0 } => {
                let _0 = _visitor.fold_key_value_prop(_0);
                return Prop::KeyValue { 0: _0 };
            }
            Prop::Assign { 0: _0 } => {
                let _0 = _visitor.fold_assign_prop(_0);
                return Prop::Assign { 0: _0 };
            }
            Prop::Getter { 0: _0 } => {
                let _0 = _visitor.fold_getter_prop(_0);
                return Prop::Getter { 0: _0 };
            }
            Prop::Setter { 0: _0 } => {
                let _0 = _visitor.fold_setter_prop(_0);
                return Prop::Setter { 0: _0 };
            }
            Prop::Method { 0: _0 } => {
                let _0 = _visitor.fold_method_prop(_0);
                return Prop::Method { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_prop_name<V: ?Sized + Fold>(_visitor: &mut V, n: PropName) -> PropName {
    {
        match n {
            PropName::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return PropName::Ident { 0: _0 };
            }
            PropName::Str { 0: _0 } => {
                let _0 = _visitor.fold_str(_0);
                return PropName::Str { 0: _0 };
            }
            PropName::Num { 0: _0 } => {
                let _0 = _visitor.fold_number(_0);
                return PropName::Num { 0: _0 };
            }
            PropName::Computed { 0: _0 } => {
                let _0 = _visitor.fold_computed_prop_name(_0);
                return PropName::Computed { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_prop_or_spread<V: ?Sized + Fold>(_visitor: &mut V, n: PropOrSpread) -> PropOrSpread {
    {
        match n {
            PropOrSpread::Spread { 0: _0 } => {
                let _0 = _visitor.fold_spread_element(_0);
                return PropOrSpread::Spread { 0: _0 };
            }
            PropOrSpread::Prop { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_prop(*_0));
                return PropOrSpread::Prop { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_regex<V: ?Sized + Fold>(_visitor: &mut V, n: Regex) -> Regex {
    {
        match n {
            Regex { span, exp, flags } => {
                let span = _visitor.fold_span(span);
                let exp = _visitor.fold_js_word(exp);
                let flags = _visitor.fold_js_word(flags);
                return Regex { span, exp, flags };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_rest_pat<V: ?Sized + Fold>(_visitor: &mut V, n: RestPat) -> RestPat {
    {
        match n {
            RestPat {
                span,
                dot3_token,
                arg,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let dot3_token = _visitor.fold_span(dot3_token);
                let arg = Box::new(_visitor.fold_pat(*arg));
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                return RestPat {
                    span,
                    dot3_token,
                    arg,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_return_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: ReturnStmt) -> ReturnStmt {
    {
        match n {
            ReturnStmt { span, arg } => {
                let span = _visitor.fold_span(span);
                let arg = _visitor.fold_opt_expr(arg);
                return ReturnStmt { span, arg };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_script<V: ?Sized + Fold>(_visitor: &mut V, n: Script) -> Script {
    {
        match n {
            Script {
                span,
                body,
                shebang,
            } => {
                let span = _visitor.fold_span(span);
                let body = _visitor.fold_stmts(body);
                let shebang = _visitor.fold_opt_js_word(shebang);
                return Script {
                    span,
                    body,
                    shebang,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_seq_expr<V: ?Sized + Fold>(_visitor: &mut V, n: SeqExpr) -> SeqExpr {
    {
        match n {
            SeqExpr { span, exprs } => {
                let span = _visitor.fold_span(span);
                let exprs = _visitor.fold_exprs(exprs);
                return SeqExpr { span, exprs };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_setter_prop<V: ?Sized + Fold>(_visitor: &mut V, n: SetterProp) -> SetterProp {
    {
        match n {
            SetterProp {
                span,
                key,
                param,
                body,
            } => {
                let span = _visitor.fold_span(span);
                let key = _visitor.fold_prop_name(key);
                let param = _visitor.fold_pat(param);
                let body = _visitor.fold_opt_block_stmt(body);
                return SetterProp {
                    span,
                    key,
                    param,
                    body,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_spread_element<V: ?Sized + Fold>(_visitor: &mut V, n: SpreadElement) -> SpreadElement {
    {
        match n {
            SpreadElement { dot3_token, expr } => {
                let dot3_token = _visitor.fold_span(dot3_token);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return SpreadElement { dot3_token, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: Stmt) -> Stmt {
    {
        match n {
            Stmt::Block { 0: _0 } => {
                let _0 = _visitor.fold_block_stmt(_0);
                return Stmt::Block { 0: _0 };
            }
            Stmt::Empty { 0: _0 } => {
                let _0 = _visitor.fold_empty_stmt(_0);
                return Stmt::Empty { 0: _0 };
            }
            Stmt::Debugger { 0: _0 } => {
                let _0 = _visitor.fold_debugger_stmt(_0);
                return Stmt::Debugger { 0: _0 };
            }
            Stmt::With { 0: _0 } => {
                let _0 = _visitor.fold_with_stmt(_0);
                return Stmt::With { 0: _0 };
            }
            Stmt::Return { 0: _0 } => {
                let _0 = _visitor.fold_return_stmt(_0);
                return Stmt::Return { 0: _0 };
            }
            Stmt::Labeled { 0: _0 } => {
                let _0 = _visitor.fold_labeled_stmt(_0);
                return Stmt::Labeled { 0: _0 };
            }
            Stmt::Break { 0: _0 } => {
                let _0 = _visitor.fold_break_stmt(_0);
                return Stmt::Break { 0: _0 };
            }
            Stmt::Continue { 0: _0 } => {
                let _0 = _visitor.fold_continue_stmt(_0);
                return Stmt::Continue { 0: _0 };
            }
            Stmt::If { 0: _0 } => {
                let _0 = _visitor.fold_if_stmt(_0);
                return Stmt::If { 0: _0 };
            }
            Stmt::Switch { 0: _0 } => {
                let _0 = _visitor.fold_switch_stmt(_0);
                return Stmt::Switch { 0: _0 };
            }
            Stmt::Throw { 0: _0 } => {
                let _0 = _visitor.fold_throw_stmt(_0);
                return Stmt::Throw { 0: _0 };
            }
            Stmt::Try { 0: _0 } => {
                let _0 = _visitor.fold_try_stmt(_0);
                return Stmt::Try { 0: _0 };
            }
            Stmt::While { 0: _0 } => {
                let _0 = _visitor.fold_while_stmt(_0);
                return Stmt::While { 0: _0 };
            }
            Stmt::DoWhile { 0: _0 } => {
                let _0 = _visitor.fold_do_while_stmt(_0);
                return Stmt::DoWhile { 0: _0 };
            }
            Stmt::For { 0: _0 } => {
                let _0 = _visitor.fold_for_stmt(_0);
                return Stmt::For { 0: _0 };
            }
            Stmt::ForIn { 0: _0 } => {
                let _0 = _visitor.fold_for_in_stmt(_0);
                return Stmt::ForIn { 0: _0 };
            }
            Stmt::ForOf { 0: _0 } => {
                let _0 = _visitor.fold_for_of_stmt(_0);
                return Stmt::ForOf { 0: _0 };
            }
            Stmt::Decl { 0: _0 } => {
                let _0 = _visitor.fold_decl(_0);
                return Stmt::Decl { 0: _0 };
            }
            Stmt::Expr { 0: _0 } => {
                let _0 = _visitor.fold_expr_stmt(_0);
                return Stmt::Expr { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_str<V: ?Sized + Fold>(_visitor: &mut V, n: Str) -> Str {
    {
        match n {
            Str {
                span,
                value,
                has_escape,
            } => {
                let span = _visitor.fold_span(span);
                let value = _visitor.fold_js_word(value);
                return Str {
                    span,
                    value,
                    has_escape,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_super<V: ?Sized + Fold>(_visitor: &mut V, n: Super) -> Super {
    {
        match n {
            Super { span } => {
                let span = _visitor.fold_span(span);
                return Super { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_switch_case<V: ?Sized + Fold>(_visitor: &mut V, n: SwitchCase) -> SwitchCase {
    {
        match n {
            SwitchCase { span, test, cons } => {
                let span = _visitor.fold_span(span);
                let test = _visitor.fold_opt_expr(test);
                let cons = _visitor.fold_stmts(cons);
                return SwitchCase { span, test, cons };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_switch_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: SwitchStmt) -> SwitchStmt {
    {
        match n {
            SwitchStmt {
                span,
                discriminant,
                cases,
            } => {
                let span = _visitor.fold_span(span);
                let discriminant = Box::new(_visitor.fold_expr(*discriminant));
                let cases = _visitor.fold_switch_cases(cases);
                return SwitchStmt {
                    span,
                    discriminant,
                    cases,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_tagged_tpl<V: ?Sized + Fold>(_visitor: &mut V, n: TaggedTpl) -> TaggedTpl {
    {
        match n {
            TaggedTpl {
                span,
                tag,
                exprs,
                quasis,
                type_params,
            } => {
                let span = _visitor.fold_span(span);
                let tag = Box::new(_visitor.fold_expr(*tag));
                let exprs = _visitor.fold_exprs(exprs);
                let quasis = _visitor.fold_tpl_elements(quasis);
                let type_params = _visitor.fold_opt_ts_type_param_instantiation(type_params);
                return TaggedTpl {
                    span,
                    tag,
                    exprs,
                    quasis,
                    type_params,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_this_expr<V: ?Sized + Fold>(_visitor: &mut V, n: ThisExpr) -> ThisExpr {
    {
        match n {
            ThisExpr { span } => {
                let span = _visitor.fold_span(span);
                return ThisExpr { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_throw_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: ThrowStmt) -> ThrowStmt {
    {
        match n {
            ThrowStmt { span, arg } => {
                let span = _visitor.fold_span(span);
                let arg = Box::new(_visitor.fold_expr(*arg));
                return ThrowStmt { span, arg };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_tpl<V: ?Sized + Fold>(_visitor: &mut V, n: Tpl) -> Tpl {
    {
        match n {
            Tpl {
                span,
                exprs,
                quasis,
            } => {
                let span = _visitor.fold_span(span);
                let exprs = _visitor.fold_exprs(exprs);
                let quasis = _visitor.fold_tpl_elements(quasis);
                return Tpl {
                    span,
                    exprs,
                    quasis,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_tpl_element<V: ?Sized + Fold>(_visitor: &mut V, n: TplElement) -> TplElement {
    {
        match n {
            TplElement {
                span,
                tail,
                cooked,
                raw,
            } => {
                let span = _visitor.fold_span(span);
                let cooked = _visitor.fold_opt_str(cooked);
                let raw = _visitor.fold_str(raw);
                return TplElement {
                    span,
                    tail,
                    cooked,
                    raw,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_true_plus_minus<V: ?Sized + Fold>(_visitor: &mut V, n: TruePlusMinus) -> TruePlusMinus {
    {
        match n {
            TruePlusMinus::True {} => {
                return TruePlusMinus::True {};
            }
            TruePlusMinus::Plus {} => {
                return TruePlusMinus::Plus {};
            }
            TruePlusMinus::Minus {} => {
                return TruePlusMinus::Minus {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_try_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: TryStmt) -> TryStmt {
    {
        match n {
            TryStmt {
                span,
                block,
                handler,
                finalizer,
            } => {
                let span = _visitor.fold_span(span);
                let block = _visitor.fold_block_stmt(block);
                let handler = _visitor.fold_opt_catch_clause(handler);
                let finalizer = _visitor.fold_opt_block_stmt(finalizer);
                return TryStmt {
                    span,
                    block,
                    handler,
                    finalizer,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_array_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsArrayType) -> TsArrayType {
    {
        match n {
            TsArrayType { span, elem_type } => {
                let span = _visitor.fold_span(span);
                let elem_type = Box::new(_visitor.fold_ts_type(*elem_type));
                return TsArrayType { span, elem_type };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_as_expr<V: ?Sized + Fold>(_visitor: &mut V, n: TsAsExpr) -> TsAsExpr {
    {
        match n {
            TsAsExpr {
                span,
                expr,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                let type_ann = Box::new(_visitor.fold_ts_type(*type_ann));
                return TsAsExpr {
                    span,
                    expr,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_call_signature_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsCallSignatureDecl,
) -> TsCallSignatureDecl {
    {
        match n {
            TsCallSignatureDecl {
                span,
                params,
                type_ann,
                type_params,
            } => {
                let span = _visitor.fold_span(span);
                let params = _visitor.fold_ts_fn_params(params);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                return TsCallSignatureDecl {
                    span,
                    params,
                    type_ann,
                    type_params,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_conditional_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsConditionalType,
) -> TsConditionalType {
    {
        match n {
            TsConditionalType {
                span,
                check_type,
                extends_type,
                true_type,
                false_type,
            } => {
                let span = _visitor.fold_span(span);
                let check_type = Box::new(_visitor.fold_ts_type(*check_type));
                let extends_type = Box::new(_visitor.fold_ts_type(*extends_type));
                let true_type = Box::new(_visitor.fold_ts_type(*true_type));
                let false_type = Box::new(_visitor.fold_ts_type(*false_type));
                return TsConditionalType {
                    span,
                    check_type,
                    extends_type,
                    true_type,
                    false_type,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_const_assertion<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsConstAssertion,
) -> TsConstAssertion {
    {
        match n {
            TsConstAssertion { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return TsConstAssertion { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_construct_signature_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsConstructSignatureDecl,
) -> TsConstructSignatureDecl {
    {
        match n {
            TsConstructSignatureDecl {
                span,
                params,
                type_ann,
                type_params,
            } => {
                let span = _visitor.fold_span(span);
                let params = _visitor.fold_ts_fn_params(params);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                return TsConstructSignatureDecl {
                    span,
                    params,
                    type_ann,
                    type_params,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_constructor_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsConstructorType,
) -> TsConstructorType {
    {
        match n {
            TsConstructorType {
                span,
                params,
                type_params,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let params = _visitor.fold_ts_fn_params(params);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                let type_ann = _visitor.fold_ts_type_ann(type_ann);
                return TsConstructorType {
                    span,
                    params,
                    type_params,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_entity_name<V: ?Sized + Fold>(_visitor: &mut V, n: TsEntityName) -> TsEntityName {
    {
        match n {
            TsEntityName::TsQualifiedName { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_ts_qualified_name(*_0));
                return TsEntityName::TsQualifiedName { 0: _0 };
            }
            TsEntityName::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return TsEntityName::Ident { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_enum_decl<V: ?Sized + Fold>(_visitor: &mut V, n: TsEnumDecl) -> TsEnumDecl {
    {
        match n {
            TsEnumDecl {
                span,
                declare,
                is_const,
                id,
                members,
            } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ident(id);
                let members = _visitor.fold_ts_enum_members(members);
                return TsEnumDecl {
                    span,
                    declare,
                    is_const,
                    id,
                    members,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_enum_member<V: ?Sized + Fold>(_visitor: &mut V, n: TsEnumMember) -> TsEnumMember {
    {
        match n {
            TsEnumMember { span, id, init } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ts_enum_member_id(id);
                let init = _visitor.fold_opt_expr(init);
                return TsEnumMember { span, id, init };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_enum_member_id<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsEnumMemberId,
) -> TsEnumMemberId {
    {
        match n {
            TsEnumMemberId::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return TsEnumMemberId::Ident { 0: _0 };
            }
            TsEnumMemberId::Str { 0: _0 } => {
                let _0 = _visitor.fold_str(_0);
                return TsEnumMemberId::Str { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_export_assignment<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsExportAssignment,
) -> TsExportAssignment {
    {
        match n {
            TsExportAssignment { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return TsExportAssignment { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_expr_with_type_args<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsExprWithTypeArgs,
) -> TsExprWithTypeArgs {
    {
        match n {
            TsExprWithTypeArgs {
                span,
                expr,
                type_args,
            } => {
                let span = _visitor.fold_span(span);
                let expr = _visitor.fold_ts_entity_name(expr);
                let type_args = _visitor.fold_opt_ts_type_param_instantiation(type_args);
                return TsExprWithTypeArgs {
                    span,
                    expr,
                    type_args,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_external_module_ref<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsExternalModuleRef,
) -> TsExternalModuleRef {
    {
        match n {
            TsExternalModuleRef { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = _visitor.fold_str(expr);
                return TsExternalModuleRef { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_fn_or_constructor_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsFnOrConstructorType,
) -> TsFnOrConstructorType {
    {
        match n {
            TsFnOrConstructorType::TsFnType { 0: _0 } => {
                let _0 = _visitor.fold_ts_fn_type(_0);
                return TsFnOrConstructorType::TsFnType { 0: _0 };
            }
            TsFnOrConstructorType::TsConstructorType { 0: _0 } => {
                let _0 = _visitor.fold_ts_constructor_type(_0);
                return TsFnOrConstructorType::TsConstructorType { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_fn_param<V: ?Sized + Fold>(_visitor: &mut V, n: TsFnParam) -> TsFnParam {
    {
        match n {
            TsFnParam::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return TsFnParam::Ident { 0: _0 };
            }
            TsFnParam::Array { 0: _0 } => {
                let _0 = _visitor.fold_array_pat(_0);
                return TsFnParam::Array { 0: _0 };
            }
            TsFnParam::Rest { 0: _0 } => {
                let _0 = _visitor.fold_rest_pat(_0);
                return TsFnParam::Rest { 0: _0 };
            }
            TsFnParam::Object { 0: _0 } => {
                let _0 = _visitor.fold_object_pat(_0);
                return TsFnParam::Object { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_fn_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsFnType) -> TsFnType {
    {
        match n {
            TsFnType {
                span,
                params,
                type_params,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let params = _visitor.fold_ts_fn_params(params);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                let type_ann = _visitor.fold_ts_type_ann(type_ann);
                return TsFnType {
                    span,
                    params,
                    type_params,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_import_equals_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsImportEqualsDecl,
) -> TsImportEqualsDecl {
    {
        match n {
            TsImportEqualsDecl {
                span,
                declare,
                is_export,
                id,
                module_ref,
            } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ident(id);
                let module_ref = _visitor.fold_ts_module_ref(module_ref);
                return TsImportEqualsDecl {
                    span,
                    declare,
                    is_export,
                    id,
                    module_ref,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_import_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsImportType) -> TsImportType {
    {
        match n {
            TsImportType {
                span,
                arg,
                qualifier,
                type_args,
            } => {
                let span = _visitor.fold_span(span);
                let arg = _visitor.fold_str(arg);
                let qualifier = _visitor.fold_opt_ts_entity_name(qualifier);
                let type_args = _visitor.fold_opt_ts_type_param_instantiation(type_args);
                return TsImportType {
                    span,
                    arg,
                    qualifier,
                    type_args,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_index_signature<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsIndexSignature,
) -> TsIndexSignature {
    {
        match n {
            TsIndexSignature {
                params,
                type_ann,
                readonly,
                span,
            } => {
                let params = _visitor.fold_ts_fn_params(params);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                let span = _visitor.fold_span(span);
                return TsIndexSignature {
                    params,
                    type_ann,
                    readonly,
                    span,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_indexed_access_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsIndexedAccessType,
) -> TsIndexedAccessType {
    {
        match n {
            TsIndexedAccessType {
                span,
                readonly,
                obj_type,
                index_type,
            } => {
                let span = _visitor.fold_span(span);
                let obj_type = Box::new(_visitor.fold_ts_type(*obj_type));
                let index_type = Box::new(_visitor.fold_ts_type(*index_type));
                return TsIndexedAccessType {
                    span,
                    readonly,
                    obj_type,
                    index_type,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_infer_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsInferType) -> TsInferType {
    {
        match n {
            TsInferType { span, type_param } => {
                let span = _visitor.fold_span(span);
                let type_param = _visitor.fold_ts_type_param(type_param);
                return TsInferType { span, type_param };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_interface_body<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsInterfaceBody,
) -> TsInterfaceBody {
    {
        match n {
            TsInterfaceBody { span, body } => {
                let span = _visitor.fold_span(span);
                let body = _visitor.fold_ts_type_elements(body);
                return TsInterfaceBody { span, body };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_interface_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsInterfaceDecl,
) -> TsInterfaceDecl {
    {
        match n {
            TsInterfaceDecl {
                span,
                id,
                declare,
                type_params,
                extends,
                body,
            } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ident(id);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                let extends = _visitor.fold_ts_expr_with_type_args_vec(extends);
                let body = _visitor.fold_ts_interface_body(body);
                return TsInterfaceDecl {
                    span,
                    id,
                    declare,
                    type_params,
                    extends,
                    body,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_intersection_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsIntersectionType,
) -> TsIntersectionType {
    {
        match n {
            TsIntersectionType { span, types } => {
                let span = _visitor.fold_span(span);
                let types = _visitor.fold_ts_types(types);
                return TsIntersectionType { span, types };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_keyword_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsKeywordType) -> TsKeywordType {
    {
        match n {
            TsKeywordType { span, kind } => {
                let span = _visitor.fold_span(span);
                let kind = _visitor.fold_ts_keyword_type_kind(kind);
                return TsKeywordType { span, kind };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_keyword_type_kind<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsKeywordTypeKind,
) -> TsKeywordTypeKind {
    {
        match n {
            TsKeywordTypeKind::TsAnyKeyword {} => {
                return TsKeywordTypeKind::TsAnyKeyword {};
            }
            TsKeywordTypeKind::TsUnknownKeyword {} => {
                return TsKeywordTypeKind::TsUnknownKeyword {};
            }
            TsKeywordTypeKind::TsNumberKeyword {} => {
                return TsKeywordTypeKind::TsNumberKeyword {};
            }
            TsKeywordTypeKind::TsObjectKeyword {} => {
                return TsKeywordTypeKind::TsObjectKeyword {};
            }
            TsKeywordTypeKind::TsBooleanKeyword {} => {
                return TsKeywordTypeKind::TsBooleanKeyword {};
            }
            TsKeywordTypeKind::TsBigIntKeyword {} => {
                return TsKeywordTypeKind::TsBigIntKeyword {};
            }
            TsKeywordTypeKind::TsStringKeyword {} => {
                return TsKeywordTypeKind::TsStringKeyword {};
            }
            TsKeywordTypeKind::TsSymbolKeyword {} => {
                return TsKeywordTypeKind::TsSymbolKeyword {};
            }
            TsKeywordTypeKind::TsVoidKeyword {} => {
                return TsKeywordTypeKind::TsVoidKeyword {};
            }
            TsKeywordTypeKind::TsUndefinedKeyword {} => {
                return TsKeywordTypeKind::TsUndefinedKeyword {};
            }
            TsKeywordTypeKind::TsNullKeyword {} => {
                return TsKeywordTypeKind::TsNullKeyword {};
            }
            TsKeywordTypeKind::TsNeverKeyword {} => {
                return TsKeywordTypeKind::TsNeverKeyword {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_lit<V: ?Sized + Fold>(_visitor: &mut V, n: TsLit) -> TsLit {
    {
        match n {
            TsLit::Number { 0: _0 } => {
                let _0 = _visitor.fold_number(_0);
                return TsLit::Number { 0: _0 };
            }
            TsLit::Str { 0: _0 } => {
                let _0 = _visitor.fold_str(_0);
                return TsLit::Str { 0: _0 };
            }
            TsLit::Bool { 0: _0 } => {
                let _0 = _visitor.fold_bool(_0);
                return TsLit::Bool { 0: _0 };
            }
            TsLit::Tpl { 0: _0 } => {
                let _0 = _visitor.fold_tpl(_0);
                return TsLit::Tpl { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_lit_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsLitType) -> TsLitType {
    {
        match n {
            TsLitType { span, lit } => {
                let span = _visitor.fold_span(span);
                let lit = _visitor.fold_ts_lit(lit);
                return TsLitType { span, lit };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_mapped_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsMappedType) -> TsMappedType {
    {
        match n {
            TsMappedType {
                span,
                readonly,
                type_param,
                optional,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let readonly = _visitor.fold_opt_true_plus_minus(readonly);
                let type_param = _visitor.fold_ts_type_param(type_param);
                let optional = _visitor.fold_opt_true_plus_minus(optional);
                let type_ann = _visitor.fold_opt_ts_type(type_ann);
                return TsMappedType {
                    span,
                    readonly,
                    type_param,
                    optional,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_method_signature<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsMethodSignature,
) -> TsMethodSignature {
    {
        match n {
            TsMethodSignature {
                span,
                readonly,
                key,
                computed,
                optional,
                params,
                type_ann,
                type_params,
            } => {
                let span = _visitor.fold_span(span);
                let key = Box::new(_visitor.fold_expr(*key));
                let params = _visitor.fold_ts_fn_params(params);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                return TsMethodSignature {
                    span,
                    readonly,
                    key,
                    computed,
                    optional,
                    params,
                    type_ann,
                    type_params,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_module_block<V: ?Sized + Fold>(_visitor: &mut V, n: TsModuleBlock) -> TsModuleBlock {
    {
        match n {
            TsModuleBlock { span, body } => {
                let span = _visitor.fold_span(span);
                let body = _visitor.fold_module_items(body);
                return TsModuleBlock { span, body };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_module_decl<V: ?Sized + Fold>(_visitor: &mut V, n: TsModuleDecl) -> TsModuleDecl {
    {
        match n {
            TsModuleDecl {
                span,
                declare,
                global,
                id,
                body,
            } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ts_module_name(id);
                let body = _visitor.fold_opt_ts_namespace_body(body);
                return TsModuleDecl {
                    span,
                    declare,
                    global,
                    id,
                    body,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_module_name<V: ?Sized + Fold>(_visitor: &mut V, n: TsModuleName) -> TsModuleName {
    {
        match n {
            TsModuleName::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return TsModuleName::Ident { 0: _0 };
            }
            TsModuleName::Str { 0: _0 } => {
                let _0 = _visitor.fold_str(_0);
                return TsModuleName::Str { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_module_ref<V: ?Sized + Fold>(_visitor: &mut V, n: TsModuleRef) -> TsModuleRef {
    {
        match n {
            TsModuleRef::TsEntityName { 0: _0 } => {
                let _0 = _visitor.fold_ts_entity_name(_0);
                return TsModuleRef::TsEntityName { 0: _0 };
            }
            TsModuleRef::TsExternalModuleRef { 0: _0 } => {
                let _0 = _visitor.fold_ts_external_module_ref(_0);
                return TsModuleRef::TsExternalModuleRef { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_namespace_body<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsNamespaceBody,
) -> TsNamespaceBody {
    {
        match n {
            TsNamespaceBody::TsModuleBlock { 0: _0 } => {
                let _0 = _visitor.fold_ts_module_block(_0);
                return TsNamespaceBody::TsModuleBlock { 0: _0 };
            }
            TsNamespaceBody::TsNamespaceDecl { 0: _0 } => {
                let _0 = _visitor.fold_ts_namespace_decl(_0);
                return TsNamespaceBody::TsNamespaceDecl { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_namespace_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsNamespaceDecl,
) -> TsNamespaceDecl {
    {
        match n {
            TsNamespaceDecl {
                span,
                declare,
                global,
                id,
                body,
            } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ident(id);
                let body = Box::new(_visitor.fold_ts_namespace_body(*body));
                return TsNamespaceDecl {
                    span,
                    declare,
                    global,
                    id,
                    body,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_namespace_export_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsNamespaceExportDecl,
) -> TsNamespaceExportDecl {
    {
        match n {
            TsNamespaceExportDecl { span, id } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ident(id);
                return TsNamespaceExportDecl { span, id };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_non_null_expr<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsNonNullExpr,
) -> TsNonNullExpr {
    {
        match n {
            TsNonNullExpr { span, expr } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                return TsNonNullExpr { span, expr };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_optional_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsOptionalType,
) -> TsOptionalType {
    {
        match n {
            TsOptionalType { span, type_ann } => {
                let span = _visitor.fold_span(span);
                let type_ann = Box::new(_visitor.fold_ts_type(*type_ann));
                return TsOptionalType { span, type_ann };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_param_prop<V: ?Sized + Fold>(_visitor: &mut V, n: TsParamProp) -> TsParamProp {
    {
        match n {
            TsParamProp {
                span,
                decorators,
                accessibility,
                readonly,
                param,
            } => {
                let span = _visitor.fold_span(span);
                let decorators = _visitor.fold_decorators(decorators);
                let accessibility = _visitor.fold_opt_accessibility(accessibility);
                let param = _visitor.fold_ts_param_prop_param(param);
                return TsParamProp {
                    span,
                    decorators,
                    accessibility,
                    readonly,
                    param,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_param_prop_param<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsParamPropParam,
) -> TsParamPropParam {
    {
        match n {
            TsParamPropParam::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return TsParamPropParam::Ident { 0: _0 };
            }
            TsParamPropParam::Assign { 0: _0 } => {
                let _0 = _visitor.fold_assign_pat(_0);
                return TsParamPropParam::Assign { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_parenthesized_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsParenthesizedType,
) -> TsParenthesizedType {
    {
        match n {
            TsParenthesizedType { span, type_ann } => {
                let span = _visitor.fold_span(span);
                let type_ann = Box::new(_visitor.fold_ts_type(*type_ann));
                return TsParenthesizedType { span, type_ann };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_property_signature<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsPropertySignature,
) -> TsPropertySignature {
    {
        match n {
            TsPropertySignature {
                span,
                readonly,
                key,
                computed,
                optional,
                init,
                params,
                type_ann,
                type_params,
            } => {
                let span = _visitor.fold_span(span);
                let key = Box::new(_visitor.fold_expr(*key));
                let init = _visitor.fold_opt_expr(init);
                let params = _visitor.fold_ts_fn_params(params);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                return TsPropertySignature {
                    span,
                    readonly,
                    key,
                    computed,
                    optional,
                    init,
                    params,
                    type_ann,
                    type_params,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_qualified_name<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsQualifiedName,
) -> TsQualifiedName {
    {
        match n {
            TsQualifiedName { left, right } => {
                let left = _visitor.fold_ts_entity_name(left);
                let right = _visitor.fold_ident(right);
                return TsQualifiedName { left, right };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_rest_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsRestType) -> TsRestType {
    {
        match n {
            TsRestType { span, type_ann } => {
                let span = _visitor.fold_span(span);
                let type_ann = Box::new(_visitor.fold_ts_type(*type_ann));
                return TsRestType { span, type_ann };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_signature_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsSignatureDecl,
) -> TsSignatureDecl {
    {
        match n {
            TsSignatureDecl::TsCallSignatureDecl { 0: _0 } => {
                let _0 = _visitor.fold_ts_call_signature_decl(_0);
                return TsSignatureDecl::TsCallSignatureDecl { 0: _0 };
            }
            TsSignatureDecl::TsConstructSignatureDecl { 0: _0 } => {
                let _0 = _visitor.fold_ts_construct_signature_decl(_0);
                return TsSignatureDecl::TsConstructSignatureDecl { 0: _0 };
            }
            TsSignatureDecl::TsMethodSignature { 0: _0 } => {
                let _0 = _visitor.fold_ts_method_signature(_0);
                return TsSignatureDecl::TsMethodSignature { 0: _0 };
            }
            TsSignatureDecl::TsFnType { 0: _0 } => {
                let _0 = _visitor.fold_ts_fn_type(_0);
                return TsSignatureDecl::TsFnType { 0: _0 };
            }
            TsSignatureDecl::TsConstructorType { 0: _0 } => {
                let _0 = _visitor.fold_ts_constructor_type(_0);
                return TsSignatureDecl::TsConstructorType { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_this_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsThisType) -> TsThisType {
    {
        match n {
            TsThisType { span } => {
                let span = _visitor.fold_span(span);
                return TsThisType { span };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_this_type_or_ident<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsThisTypeOrIdent,
) -> TsThisTypeOrIdent {
    {
        match n {
            TsThisTypeOrIdent::TsThisType { 0: _0 } => {
                let _0 = _visitor.fold_ts_this_type(_0);
                return TsThisTypeOrIdent::TsThisType { 0: _0 };
            }
            TsThisTypeOrIdent::Ident { 0: _0 } => {
                let _0 = _visitor.fold_ident(_0);
                return TsThisTypeOrIdent::Ident { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_tuple_element<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTupleElement,
) -> TsTupleElement {
    {
        match n {
            TsTupleElement { span, label, ty } => {
                let span = _visitor.fold_span(span);
                let label = _visitor.fold_opt_ident(label);
                let ty = _visitor.fold_ts_type(ty);
                return TsTupleElement { span, label, ty };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_tuple_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsTupleType) -> TsTupleType {
    {
        match n {
            TsTupleType { span, elem_types } => {
                let span = _visitor.fold_span(span);
                let elem_types = _visitor.fold_ts_tuple_elements(elem_types);
                return TsTupleType { span, elem_types };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsType) -> TsType {
    {
        match n {
            TsType::TsKeywordType { 0: _0 } => {
                let _0 = _visitor.fold_ts_keyword_type(_0);
                return TsType::TsKeywordType { 0: _0 };
            }
            TsType::TsThisType { 0: _0 } => {
                let _0 = _visitor.fold_ts_this_type(_0);
                return TsType::TsThisType { 0: _0 };
            }
            TsType::TsFnOrConstructorType { 0: _0 } => {
                let _0 = _visitor.fold_ts_fn_or_constructor_type(_0);
                return TsType::TsFnOrConstructorType { 0: _0 };
            }
            TsType::TsTypeRef { 0: _0 } => {
                let _0 = _visitor.fold_ts_type_ref(_0);
                return TsType::TsTypeRef { 0: _0 };
            }
            TsType::TsTypeQuery { 0: _0 } => {
                let _0 = _visitor.fold_ts_type_query(_0);
                return TsType::TsTypeQuery { 0: _0 };
            }
            TsType::TsTypeLit { 0: _0 } => {
                let _0 = _visitor.fold_ts_type_lit(_0);
                return TsType::TsTypeLit { 0: _0 };
            }
            TsType::TsArrayType { 0: _0 } => {
                let _0 = _visitor.fold_ts_array_type(_0);
                return TsType::TsArrayType { 0: _0 };
            }
            TsType::TsTupleType { 0: _0 } => {
                let _0 = _visitor.fold_ts_tuple_type(_0);
                return TsType::TsTupleType { 0: _0 };
            }
            TsType::TsOptionalType { 0: _0 } => {
                let _0 = _visitor.fold_ts_optional_type(_0);
                return TsType::TsOptionalType { 0: _0 };
            }
            TsType::TsRestType { 0: _0 } => {
                let _0 = _visitor.fold_ts_rest_type(_0);
                return TsType::TsRestType { 0: _0 };
            }
            TsType::TsUnionOrIntersectionType { 0: _0 } => {
                let _0 = _visitor.fold_ts_union_or_intersection_type(_0);
                return TsType::TsUnionOrIntersectionType { 0: _0 };
            }
            TsType::TsConditionalType { 0: _0 } => {
                let _0 = _visitor.fold_ts_conditional_type(_0);
                return TsType::TsConditionalType { 0: _0 };
            }
            TsType::TsInferType { 0: _0 } => {
                let _0 = _visitor.fold_ts_infer_type(_0);
                return TsType::TsInferType { 0: _0 };
            }
            TsType::TsParenthesizedType { 0: _0 } => {
                let _0 = _visitor.fold_ts_parenthesized_type(_0);
                return TsType::TsParenthesizedType { 0: _0 };
            }
            TsType::TsTypeOperator { 0: _0 } => {
                let _0 = _visitor.fold_ts_type_operator(_0);
                return TsType::TsTypeOperator { 0: _0 };
            }
            TsType::TsIndexedAccessType { 0: _0 } => {
                let _0 = _visitor.fold_ts_indexed_access_type(_0);
                return TsType::TsIndexedAccessType { 0: _0 };
            }
            TsType::TsMappedType { 0: _0 } => {
                let _0 = _visitor.fold_ts_mapped_type(_0);
                return TsType::TsMappedType { 0: _0 };
            }
            TsType::TsLitType { 0: _0 } => {
                let _0 = _visitor.fold_ts_lit_type(_0);
                return TsType::TsLitType { 0: _0 };
            }
            TsType::TsTypePredicate { 0: _0 } => {
                let _0 = _visitor.fold_ts_type_predicate(_0);
                return TsType::TsTypePredicate { 0: _0 };
            }
            TsType::TsImportType { 0: _0 } => {
                let _0 = _visitor.fold_ts_import_type(_0);
                return TsType::TsImportType { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_alias_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypeAliasDecl,
) -> TsTypeAliasDecl {
    {
        match n {
            TsTypeAliasDecl {
                span,
                declare,
                id,
                type_params,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let id = _visitor.fold_ident(id);
                let type_params = _visitor.fold_opt_ts_type_param_decl(type_params);
                let type_ann = Box::new(_visitor.fold_ts_type(*type_ann));
                return TsTypeAliasDecl {
                    span,
                    declare,
                    id,
                    type_params,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_ann<V: ?Sized + Fold>(_visitor: &mut V, n: TsTypeAnn) -> TsTypeAnn {
    {
        match n {
            TsTypeAnn { span, type_ann } => {
                let span = _visitor.fold_span(span);
                let type_ann = Box::new(_visitor.fold_ts_type(*type_ann));
                return TsTypeAnn { span, type_ann };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_assertion<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypeAssertion,
) -> TsTypeAssertion {
    {
        match n {
            TsTypeAssertion {
                span,
                expr,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                let type_ann = Box::new(_visitor.fold_ts_type(*type_ann));
                return TsTypeAssertion {
                    span,
                    expr,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_cast_expr<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypeCastExpr,
) -> TsTypeCastExpr {
    {
        match n {
            TsTypeCastExpr {
                span,
                expr,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let expr = Box::new(_visitor.fold_expr(*expr));
                let type_ann = _visitor.fold_ts_type_ann(type_ann);
                return TsTypeCastExpr {
                    span,
                    expr,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_element<V: ?Sized + Fold>(_visitor: &mut V, n: TsTypeElement) -> TsTypeElement {
    {
        match n {
            TsTypeElement::TsCallSignatureDecl { 0: _0 } => {
                let _0 = _visitor.fold_ts_call_signature_decl(_0);
                return TsTypeElement::TsCallSignatureDecl { 0: _0 };
            }
            TsTypeElement::TsConstructSignatureDecl { 0: _0 } => {
                let _0 = _visitor.fold_ts_construct_signature_decl(_0);
                return TsTypeElement::TsConstructSignatureDecl { 0: _0 };
            }
            TsTypeElement::TsPropertySignature { 0: _0 } => {
                let _0 = _visitor.fold_ts_property_signature(_0);
                return TsTypeElement::TsPropertySignature { 0: _0 };
            }
            TsTypeElement::TsMethodSignature { 0: _0 } => {
                let _0 = _visitor.fold_ts_method_signature(_0);
                return TsTypeElement::TsMethodSignature { 0: _0 };
            }
            TsTypeElement::TsIndexSignature { 0: _0 } => {
                let _0 = _visitor.fold_ts_index_signature(_0);
                return TsTypeElement::TsIndexSignature { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_lit<V: ?Sized + Fold>(_visitor: &mut V, n: TsTypeLit) -> TsTypeLit {
    {
        match n {
            TsTypeLit { span, members } => {
                let span = _visitor.fold_span(span);
                let members = _visitor.fold_ts_type_elements(members);
                return TsTypeLit { span, members };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_operator<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypeOperator,
) -> TsTypeOperator {
    {
        match n {
            TsTypeOperator { span, op, type_ann } => {
                let span = _visitor.fold_span(span);
                let op = _visitor.fold_ts_type_operator_op(op);
                let type_ann = Box::new(_visitor.fold_ts_type(*type_ann));
                return TsTypeOperator { span, op, type_ann };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_operator_op<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypeOperatorOp,
) -> TsTypeOperatorOp {
    {
        match n {
            TsTypeOperatorOp::KeyOf {} => {
                return TsTypeOperatorOp::KeyOf {};
            }
            TsTypeOperatorOp::Unique {} => {
                return TsTypeOperatorOp::Unique {};
            }
            TsTypeOperatorOp::ReadOnly {} => {
                return TsTypeOperatorOp::ReadOnly {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_param<V: ?Sized + Fold>(_visitor: &mut V, n: TsTypeParam) -> TsTypeParam {
    {
        match n {
            TsTypeParam {
                span,
                name,
                constraint,
                default,
            } => {
                let span = _visitor.fold_span(span);
                let name = _visitor.fold_ident(name);
                let constraint = _visitor.fold_opt_ts_type(constraint);
                let default = _visitor.fold_opt_ts_type(default);
                return TsTypeParam {
                    span,
                    name,
                    constraint,
                    default,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_param_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypeParamDecl,
) -> TsTypeParamDecl {
    {
        match n {
            TsTypeParamDecl { span, params } => {
                let span = _visitor.fold_span(span);
                let params = _visitor.fold_ts_type_params(params);
                return TsTypeParamDecl { span, params };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_param_instantiation<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypeParamInstantiation,
) -> TsTypeParamInstantiation {
    {
        match n {
            TsTypeParamInstantiation { span, params } => {
                let span = _visitor.fold_span(span);
                let params = _visitor.fold_ts_types(params);
                return TsTypeParamInstantiation { span, params };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_predicate<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypePredicate,
) -> TsTypePredicate {
    {
        match n {
            TsTypePredicate {
                span,
                asserts,
                param_name,
                type_ann,
            } => {
                let span = _visitor.fold_span(span);
                let param_name = _visitor.fold_ts_this_type_or_ident(param_name);
                let type_ann = _visitor.fold_opt_ts_type_ann(type_ann);
                return TsTypePredicate {
                    span,
                    asserts,
                    param_name,
                    type_ann,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_query<V: ?Sized + Fold>(_visitor: &mut V, n: TsTypeQuery) -> TsTypeQuery {
    {
        match n {
            TsTypeQuery { span, expr_name } => {
                let span = _visitor.fold_span(span);
                let expr_name = _visitor.fold_ts_type_query_expr(expr_name);
                return TsTypeQuery { span, expr_name };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_query_expr<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsTypeQueryExpr,
) -> TsTypeQueryExpr {
    {
        match n {
            TsTypeQueryExpr::TsEntityName { 0: _0 } => {
                let _0 = _visitor.fold_ts_entity_name(_0);
                return TsTypeQueryExpr::TsEntityName { 0: _0 };
            }
            TsTypeQueryExpr::Import { 0: _0 } => {
                let _0 = _visitor.fold_ts_import_type(_0);
                return TsTypeQueryExpr::Import { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_ref<V: ?Sized + Fold>(_visitor: &mut V, n: TsTypeRef) -> TsTypeRef {
    {
        match n {
            TsTypeRef {
                span,
                type_name,
                type_params,
            } => {
                let span = _visitor.fold_span(span);
                let type_name = _visitor.fold_ts_entity_name(type_name);
                let type_params = _visitor.fold_opt_ts_type_param_instantiation(type_params);
                return TsTypeRef {
                    span,
                    type_name,
                    type_params,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_union_or_intersection_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: TsUnionOrIntersectionType,
) -> TsUnionOrIntersectionType {
    {
        match n {
            TsUnionOrIntersectionType::TsUnionType { 0: _0 } => {
                let _0 = _visitor.fold_ts_union_type(_0);
                return TsUnionOrIntersectionType::TsUnionType { 0: _0 };
            }
            TsUnionOrIntersectionType::TsIntersectionType { 0: _0 } => {
                let _0 = _visitor.fold_ts_intersection_type(_0);
                return TsUnionOrIntersectionType::TsIntersectionType { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_union_type<V: ?Sized + Fold>(_visitor: &mut V, n: TsUnionType) -> TsUnionType {
    {
        match n {
            TsUnionType { span, types } => {
                let span = _visitor.fold_span(span);
                let types = _visitor.fold_ts_types(types);
                return TsUnionType { span, types };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_unary_expr<V: ?Sized + Fold>(_visitor: &mut V, n: UnaryExpr) -> UnaryExpr {
    {
        match n {
            UnaryExpr { span, op, arg } => {
                let span = _visitor.fold_span(span);
                let op = _visitor.fold_unary_op(op);
                let arg = Box::new(_visitor.fold_expr(*arg));
                return UnaryExpr { span, op, arg };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_unary_op<V: ?Sized + Fold>(_visitor: &mut V, n: UnaryOp) -> UnaryOp {
    {
        match n {
            UnaryOp::Minus {} => {
                return UnaryOp::Minus {};
            }
            UnaryOp::Plus {} => {
                return UnaryOp::Plus {};
            }
            UnaryOp::Bang {} => {
                return UnaryOp::Bang {};
            }
            UnaryOp::Tilde {} => {
                return UnaryOp::Tilde {};
            }
            UnaryOp::TypeOf {} => {
                return UnaryOp::TypeOf {};
            }
            UnaryOp::Void {} => {
                return UnaryOp::Void {};
            }
            UnaryOp::Delete {} => {
                return UnaryOp::Delete {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_update_expr<V: ?Sized + Fold>(_visitor: &mut V, n: UpdateExpr) -> UpdateExpr {
    {
        match n {
            UpdateExpr {
                span,
                op,
                prefix,
                arg,
            } => {
                let span = _visitor.fold_span(span);
                let op = _visitor.fold_update_op(op);
                let arg = Box::new(_visitor.fold_expr(*arg));
                return UpdateExpr {
                    span,
                    op,
                    prefix,
                    arg,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_update_op<V: ?Sized + Fold>(_visitor: &mut V, n: UpdateOp) -> UpdateOp {
    {
        match n {
            UpdateOp::PlusPlus {} => {
                return UpdateOp::PlusPlus {};
            }
            UpdateOp::MinusMinus {} => {
                return UpdateOp::MinusMinus {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_var_decl<V: ?Sized + Fold>(_visitor: &mut V, n: VarDecl) -> VarDecl {
    {
        match n {
            VarDecl {
                span,
                kind,
                declare,
                decls,
            } => {
                let span = _visitor.fold_span(span);
                let kind = _visitor.fold_var_decl_kind(kind);
                let decls = _visitor.fold_var_declarators(decls);
                return VarDecl {
                    span,
                    kind,
                    declare,
                    decls,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_var_decl_kind<V: ?Sized + Fold>(_visitor: &mut V, n: VarDeclKind) -> VarDeclKind {
    {
        match n {
            VarDeclKind::Var {} => {
                return VarDeclKind::Var {};
            }
            VarDeclKind::Let {} => {
                return VarDeclKind::Let {};
            }
            VarDeclKind::Const {} => {
                return VarDeclKind::Const {};
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_var_decl_or_expr<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: VarDeclOrExpr,
) -> VarDeclOrExpr {
    {
        match n {
            VarDeclOrExpr::VarDecl { 0: _0 } => {
                let _0 = _visitor.fold_var_decl(_0);
                return VarDeclOrExpr::VarDecl { 0: _0 };
            }
            VarDeclOrExpr::Expr { 0: _0 } => {
                let _0 = Box::new(_visitor.fold_expr(*_0));
                return VarDeclOrExpr::Expr { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_var_decl_or_pat<V: ?Sized + Fold>(_visitor: &mut V, n: VarDeclOrPat) -> VarDeclOrPat {
    {
        match n {
            VarDeclOrPat::VarDecl { 0: _0 } => {
                let _0 = _visitor.fold_var_decl(_0);
                return VarDeclOrPat::VarDecl { 0: _0 };
            }
            VarDeclOrPat::Pat { 0: _0 } => {
                let _0 = _visitor.fold_pat(_0);
                return VarDeclOrPat::Pat { 0: _0 };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_var_declarator<V: ?Sized + Fold>(_visitor: &mut V, n: VarDeclarator) -> VarDeclarator {
    {
        match n {
            VarDeclarator {
                span,
                name,
                init,
                definite,
            } => {
                let span = _visitor.fold_span(span);
                let name = _visitor.fold_pat(name);
                let init = _visitor.fold_opt_expr(init);
                return VarDeclarator {
                    span,
                    name,
                    init,
                    definite,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_while_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: WhileStmt) -> WhileStmt {
    {
        match n {
            WhileStmt { span, test, body } => {
                let span = _visitor.fold_span(span);
                let test = Box::new(_visitor.fold_expr(*test));
                let body = Box::new(_visitor.fold_stmt(*body));
                return WhileStmt { span, test, body };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_with_stmt<V: ?Sized + Fold>(_visitor: &mut V, n: WithStmt) -> WithStmt {
    {
        match n {
            WithStmt { span, obj, body } => {
                let span = _visitor.fold_span(span);
                let obj = Box::new(_visitor.fold_expr(*obj));
                let body = Box::new(_visitor.fold_stmt(*body));
                return WithStmt { span, obj, body };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_yield_expr<V: ?Sized + Fold>(_visitor: &mut V, n: YieldExpr) -> YieldExpr {
    {
        match n {
            YieldExpr {
                span,
                arg,
                delegate,
            } => {
                let span = _visitor.fold_span(span);
                let arg = _visitor.fold_opt_expr(arg);
                return YieldExpr {
                    span,
                    arg,
                    delegate,
                };
            }
        }
    }
}
#[allow(unused_variables)]
pub fn fold_span<V: ?Sized + Fold>(_visitor: &mut V, n: Span) -> Span {
    {
        return n;
    }
}
#[allow(unused_variables)]
pub fn fold_decorators<V: ?Sized + Fold>(_visitor: &mut V, n: Vec<Decorator>) -> Vec<Decorator> {
    {
        n.into_iter().map(|v| _visitor.fold_decorator(v)).collect()
    }
}
#[allow(unused_variables)]
pub fn fold_class_members<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<ClassMember>,
) -> Vec<ClassMember> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_class_member(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_expr<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<Box<Expr>>,
) -> Option<Box<Expr>> {
    {
        match n {
            Some(n) => Some(Box::new(_visitor.fold_expr(*n))),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_opt_ts_type_param_decl<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<TsTypeParamDecl>,
) -> Option<TsTypeParamDecl> {
    {
        match n {
            Some(n) => Some(_visitor.fold_ts_type_param_decl(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_opt_ts_type_param_instantiation<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<TsTypeParamInstantiation>,
) -> Option<TsTypeParamInstantiation> {
    {
        match n {
            Some(n) => Some(_visitor.fold_ts_type_param_instantiation(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_expr_with_type_args_vec<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<TsExprWithTypeArgs>,
) -> Vec<TsExprWithTypeArgs> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_ts_expr_with_type_args(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_ts_type_ann<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<TsTypeAnn>,
) -> Option<TsTypeAnn> {
    {
        match n {
            Some(n) => Some(_visitor.fold_ts_type_ann(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_opt_accessibility<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<Accessibility>,
) -> Option<Accessibility> {
    {
        match n {
            Some(n) => Some(_visitor.fold_accessibility(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_param_or_ts_param_props<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<ParamOrTsParamProp>,
) -> Vec<ParamOrTsParamProp> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_param_or_ts_param_prop(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_block_stmt<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<BlockStmt>,
) -> Option<BlockStmt> {
    {
        match n {
            Some(n) => Some(_visitor.fold_block_stmt(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_var_declarators<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<VarDeclarator>,
) -> Vec<VarDeclarator> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_var_declarator(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_vec_expr_or_spreads<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<Option<ExprOrSpread>>,
) -> Vec<Option<ExprOrSpread>> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_opt_expr_or_spread(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_prop_or_spreads<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<PropOrSpread>,
) -> Vec<PropOrSpread> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_prop_or_spread(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_ident<V: ?Sized + Fold>(_visitor: &mut V, n: Option<Ident>) -> Option<Ident> {
    {
        match n {
            Some(n) => Some(_visitor.fold_ident(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_expr_or_spreads<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<ExprOrSpread>,
) -> Vec<ExprOrSpread> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_expr_or_spread(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_expr_or_spreads<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<Vec<ExprOrSpread>>,
) -> Option<Vec<ExprOrSpread>> {
    {
        match n {
            Some(n) => Some(_visitor.fold_expr_or_spreads(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_exprs<V: ?Sized + Fold>(_visitor: &mut V, n: Vec<Box<Expr>>) -> Vec<Box<Expr>> {
    {
        n.into_iter()
            .map(|v| Box::new(_visitor.fold_expr(*v)))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_pats<V: ?Sized + Fold>(_visitor: &mut V, n: Vec<Pat>) -> Vec<Pat> {
    {
        n.into_iter().map(|v| _visitor.fold_pat(v)).collect()
    }
}
#[allow(unused_variables)]
pub fn fold_tpl_elements<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<TplElement>,
) -> Vec<TplElement> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_tpl_element(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_str<V: ?Sized + Fold>(_visitor: &mut V, n: Option<Str>) -> Option<Str> {
    {
        match n {
            Some(n) => Some(_visitor.fold_str(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_opt_span<V: ?Sized + Fold>(_visitor: &mut V, n: Option<Span>) -> Option<Span> {
    {
        match n {
            Some(n) => Some(_visitor.fold_span(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_params<V: ?Sized + Fold>(_visitor: &mut V, n: Vec<Param>) -> Vec<Param> {
    {
        n.into_iter().map(|v| _visitor.fold_param(v)).collect()
    }
}
#[allow(unused_variables)]
pub fn fold_js_word<V: ?Sized + Fold>(_visitor: &mut V, n: JsWord) -> JsWord {
    {
        return n;
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_attr_or_spreads<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<JSXAttrOrSpread>,
) -> Vec<JSXAttrOrSpread> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_jsx_attr_or_spread(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_jsx_attr_value<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<JSXAttrValue>,
) -> Option<JSXAttrValue> {
    {
        match n {
            Some(n) => Some(_visitor.fold_jsx_attr_value(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_jsx_element_children<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<JSXElementChild>,
) -> Vec<JSXElementChild> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_jsx_element_child(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_jsx_closing_element<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<JSXClosingElement>,
) -> Option<JSXClosingElement> {
    {
        match n {
            Some(n) => Some(_visitor.fold_jsx_closing_element(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_big_int_value<V: ?Sized + Fold>(_visitor: &mut V, n: BigIntValue) -> BigIntValue {
    {
        return n;
    }
}
#[allow(unused_variables)]
pub fn fold_module_items<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<ModuleItem>,
) -> Vec<ModuleItem> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_module_item(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_js_word<V: ?Sized + Fold>(_visitor: &mut V, n: Option<JsWord>) -> Option<JsWord> {
    {
        match n {
            Some(n) => Some(_visitor.fold_js_word(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_stmts<V: ?Sized + Fold>(_visitor: &mut V, n: Vec<Stmt>) -> Vec<Stmt> {
    {
        n.into_iter().map(|v| _visitor.fold_stmt(v)).collect()
    }
}
#[allow(unused_variables)]
pub fn fold_import_specifiers<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<ImportSpecifier>,
) -> Vec<ImportSpecifier> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_import_specifier(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_export_specifiers<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<ExportSpecifier>,
) -> Vec<ExportSpecifier> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_export_specifier(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_vec_pats<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<Option<Pat>>,
) -> Vec<Option<Pat>> {
    {
        n.into_iter().map(|v| _visitor.fold_opt_pat(v)).collect()
    }
}
#[allow(unused_variables)]
pub fn fold_object_pat_props<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<ObjectPatProp>,
) -> Vec<ObjectPatProp> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_object_pat_prop(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_stmt<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<Box<Stmt>>,
) -> Option<Box<Stmt>> {
    {
        match n {
            Some(n) => Some(Box::new(_visitor.fold_stmt(*n))),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_switch_cases<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<SwitchCase>,
) -> Vec<SwitchCase> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_switch_case(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_catch_clause<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<CatchClause>,
) -> Option<CatchClause> {
    {
        match n {
            Some(n) => Some(_visitor.fold_catch_clause(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_opt_var_decl_or_expr<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<VarDeclOrExpr>,
) -> Option<VarDeclOrExpr> {
    {
        match n {
            Some(n) => Some(_visitor.fold_var_decl_or_expr(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_opt_pat<V: ?Sized + Fold>(_visitor: &mut V, n: Option<Pat>) -> Option<Pat> {
    {
        match n {
            Some(n) => Some(_visitor.fold_pat(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_params<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<TsTypeParam>,
) -> Vec<TsTypeParam> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_ts_type_param(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_ts_type<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<Box<TsType>>,
) -> Option<Box<TsType>> {
    {
        match n {
            Some(n) => Some(Box::new(_visitor.fold_ts_type(*n))),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_types<V: ?Sized + Fold>(_visitor: &mut V, n: Vec<Box<TsType>>) -> Vec<Box<TsType>> {
    {
        n.into_iter()
            .map(|v| Box::new(_visitor.fold_ts_type(*v)))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_ts_fn_params<V: ?Sized + Fold>(_visitor: &mut V, n: Vec<TsFnParam>) -> Vec<TsFnParam> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_ts_fn_param(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_ts_entity_name<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<TsEntityName>,
) -> Option<TsEntityName> {
    {
        match n {
            Some(n) => Some(_visitor.fold_ts_entity_name(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_type_elements<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<TsTypeElement>,
) -> Vec<TsTypeElement> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_ts_type_element(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_ts_tuple_elements<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<TsTupleElement>,
) -> Vec<TsTupleElement> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_ts_tuple_element(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_true_plus_minus<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<TruePlusMinus>,
) -> Option<TruePlusMinus> {
    {
        match n {
            Some(n) => Some(_visitor.fold_true_plus_minus(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_ts_enum_members<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Vec<TsEnumMember>,
) -> Vec<TsEnumMember> {
    {
        n.into_iter()
            .map(|v| _visitor.fold_ts_enum_member(v))
            .collect()
    }
}
#[allow(unused_variables)]
pub fn fold_opt_ts_namespace_body<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<TsNamespaceBody>,
) -> Option<TsNamespaceBody> {
    {
        match n {
            Some(n) => Some(_visitor.fold_ts_namespace_body(n)),
            None => None,
        }
    }
}
#[allow(unused_variables)]
pub fn fold_opt_expr_or_spread<V: ?Sized + Fold>(
    _visitor: &mut V,
    n: Option<ExprOrSpread>,
) -> Option<ExprOrSpread> {
    {
        match n {
            Some(n) => Some(_visitor.fold_expr_or_spread(n)),
            None => None,
        }
    }
}
pub trait Fold {
    #[allow(unused_variables)]
    fn fold_accessibility(&mut self, n: Accessibility) -> Accessibility {
        fold_accessibility(self, n)
    }
    #[allow(unused_variables)]
    fn fold_array_lit(&mut self, n: ArrayLit) -> ArrayLit {
        fold_array_lit(self, n)
    }
    #[allow(unused_variables)]
    fn fold_array_pat(&mut self, n: ArrayPat) -> ArrayPat {
        fold_array_pat(self, n)
    }
    #[allow(unused_variables)]
    fn fold_arrow_expr(&mut self, n: ArrowExpr) -> ArrowExpr {
        fold_arrow_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_assign_expr(&mut self, n: AssignExpr) -> AssignExpr {
        fold_assign_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_assign_op(&mut self, n: AssignOp) -> AssignOp {
        fold_assign_op(self, n)
    }
    #[allow(unused_variables)]
    fn fold_assign_pat(&mut self, n: AssignPat) -> AssignPat {
        fold_assign_pat(self, n)
    }
    #[allow(unused_variables)]
    fn fold_assign_pat_prop(&mut self, n: AssignPatProp) -> AssignPatProp {
        fold_assign_pat_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_assign_prop(&mut self, n: AssignProp) -> AssignProp {
        fold_assign_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_await_expr(&mut self, n: AwaitExpr) -> AwaitExpr {
        fold_await_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_big_int(&mut self, n: BigInt) -> BigInt {
        fold_big_int(self, n)
    }
    #[allow(unused_variables)]
    fn fold_bin_expr(&mut self, n: BinExpr) -> BinExpr {
        fold_bin_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_binary_op(&mut self, n: BinaryOp) -> BinaryOp {
        fold_binary_op(self, n)
    }
    #[allow(unused_variables)]
    fn fold_block_stmt(&mut self, n: BlockStmt) -> BlockStmt {
        fold_block_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_block_stmt_or_expr(&mut self, n: BlockStmtOrExpr) -> BlockStmtOrExpr {
        fold_block_stmt_or_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_bool(&mut self, n: Bool) -> Bool {
        fold_bool(self, n)
    }
    #[allow(unused_variables)]
    fn fold_break_stmt(&mut self, n: BreakStmt) -> BreakStmt {
        fold_break_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_call_expr(&mut self, n: CallExpr) -> CallExpr {
        fold_call_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_catch_clause(&mut self, n: CatchClause) -> CatchClause {
        fold_catch_clause(self, n)
    }
    #[allow(unused_variables)]
    fn fold_class(&mut self, n: Class) -> Class {
        fold_class(self, n)
    }
    #[allow(unused_variables)]
    fn fold_class_decl(&mut self, n: ClassDecl) -> ClassDecl {
        fold_class_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_class_expr(&mut self, n: ClassExpr) -> ClassExpr {
        fold_class_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_class_member(&mut self, n: ClassMember) -> ClassMember {
        fold_class_member(self, n)
    }
    #[allow(unused_variables)]
    fn fold_class_method(&mut self, n: ClassMethod) -> ClassMethod {
        fold_class_method(self, n)
    }
    #[allow(unused_variables)]
    fn fold_class_prop(&mut self, n: ClassProp) -> ClassProp {
        fold_class_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_computed_prop_name(&mut self, n: ComputedPropName) -> ComputedPropName {
        fold_computed_prop_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_cond_expr(&mut self, n: CondExpr) -> CondExpr {
        fold_cond_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        fold_constructor(self, n)
    }
    #[allow(unused_variables)]
    fn fold_continue_stmt(&mut self, n: ContinueStmt) -> ContinueStmt {
        fold_continue_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_debugger_stmt(&mut self, n: DebuggerStmt) -> DebuggerStmt {
        fold_debugger_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_decl(&mut self, n: Decl) -> Decl {
        fold_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_decorator(&mut self, n: Decorator) -> Decorator {
        fold_decorator(self, n)
    }
    #[allow(unused_variables)]
    fn fold_default_decl(&mut self, n: DefaultDecl) -> DefaultDecl {
        fold_default_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_do_while_stmt(&mut self, n: DoWhileStmt) -> DoWhileStmt {
        fold_do_while_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_empty_stmt(&mut self, n: EmptyStmt) -> EmptyStmt {
        fold_empty_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_all(&mut self, n: ExportAll) -> ExportAll {
        fold_export_all(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_decl(&mut self, n: ExportDecl) -> ExportDecl {
        fold_export_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_default_decl(&mut self, n: ExportDefaultDecl) -> ExportDefaultDecl {
        fold_export_default_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_default_expr(&mut self, n: ExportDefaultExpr) -> ExportDefaultExpr {
        fold_export_default_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_default_specifier(
        &mut self,
        n: ExportDefaultSpecifier,
    ) -> ExportDefaultSpecifier {
        fold_export_default_specifier(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_named_specifier(&mut self, n: ExportNamedSpecifier) -> ExportNamedSpecifier {
        fold_export_named_specifier(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_namespace_specifier(
        &mut self,
        n: ExportNamespaceSpecifier,
    ) -> ExportNamespaceSpecifier {
        fold_export_namespace_specifier(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_specifier(&mut self, n: ExportSpecifier) -> ExportSpecifier {
        fold_export_specifier(self, n)
    }
    #[allow(unused_variables)]
    fn fold_expr(&mut self, n: Expr) -> Expr {
        fold_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_expr_or_spread(&mut self, n: ExprOrSpread) -> ExprOrSpread {
        fold_expr_or_spread(self, n)
    }
    #[allow(unused_variables)]
    fn fold_expr_or_super(&mut self, n: ExprOrSuper) -> ExprOrSuper {
        fold_expr_or_super(self, n)
    }
    #[allow(unused_variables)]
    fn fold_expr_stmt(&mut self, n: ExprStmt) -> ExprStmt {
        fold_expr_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_fn_decl(&mut self, n: FnDecl) -> FnDecl {
        fold_fn_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_fn_expr(&mut self, n: FnExpr) -> FnExpr {
        fold_fn_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_for_in_stmt(&mut self, n: ForInStmt) -> ForInStmt {
        fold_for_in_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_for_of_stmt(&mut self, n: ForOfStmt) -> ForOfStmt {
        fold_for_of_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_for_stmt(&mut self, n: ForStmt) -> ForStmt {
        fold_for_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_function(&mut self, n: Function) -> Function {
        fold_function(self, n)
    }
    #[allow(unused_variables)]
    fn fold_getter_prop(&mut self, n: GetterProp) -> GetterProp {
        fold_getter_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ident(&mut self, n: Ident) -> Ident {
        fold_ident(self, n)
    }
    #[allow(unused_variables)]
    fn fold_if_stmt(&mut self, n: IfStmt) -> IfStmt {
        fold_if_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_import_decl(&mut self, n: ImportDecl) -> ImportDecl {
        fold_import_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_import_default_specifier(
        &mut self,
        n: ImportDefaultSpecifier,
    ) -> ImportDefaultSpecifier {
        fold_import_default_specifier(self, n)
    }
    #[allow(unused_variables)]
    fn fold_import_named_specifier(&mut self, n: ImportNamedSpecifier) -> ImportNamedSpecifier {
        fold_import_named_specifier(self, n)
    }
    #[allow(unused_variables)]
    fn fold_import_specifier(&mut self, n: ImportSpecifier) -> ImportSpecifier {
        fold_import_specifier(self, n)
    }
    #[allow(unused_variables)]
    fn fold_import_star_as_specifier(&mut self, n: ImportStarAsSpecifier) -> ImportStarAsSpecifier {
        fold_import_star_as_specifier(self, n)
    }
    #[allow(unused_variables)]
    fn fold_invalid(&mut self, n: Invalid) -> Invalid {
        fold_invalid(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_attr(&mut self, n: JSXAttr) -> JSXAttr {
        fold_jsx_attr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_attr_name(&mut self, n: JSXAttrName) -> JSXAttrName {
        fold_jsx_attr_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_attr_or_spread(&mut self, n: JSXAttrOrSpread) -> JSXAttrOrSpread {
        fold_jsx_attr_or_spread(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_attr_value(&mut self, n: JSXAttrValue) -> JSXAttrValue {
        fold_jsx_attr_value(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_closing_element(&mut self, n: JSXClosingElement) -> JSXClosingElement {
        fold_jsx_closing_element(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_closing_fragment(&mut self, n: JSXClosingFragment) -> JSXClosingFragment {
        fold_jsx_closing_fragment(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_element(&mut self, n: JSXElement) -> JSXElement {
        fold_jsx_element(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_element_child(&mut self, n: JSXElementChild) -> JSXElementChild {
        fold_jsx_element_child(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_element_name(&mut self, n: JSXElementName) -> JSXElementName {
        fold_jsx_element_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_empty_expr(&mut self, n: JSXEmptyExpr) -> JSXEmptyExpr {
        fold_jsx_empty_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_expr(&mut self, n: JSXExpr) -> JSXExpr {
        fold_jsx_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_expr_container(&mut self, n: JSXExprContainer) -> JSXExprContainer {
        fold_jsx_expr_container(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_fragment(&mut self, n: JSXFragment) -> JSXFragment {
        fold_jsx_fragment(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_member_expr(&mut self, n: JSXMemberExpr) -> JSXMemberExpr {
        fold_jsx_member_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_namespaced_name(&mut self, n: JSXNamespacedName) -> JSXNamespacedName {
        fold_jsx_namespaced_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_object(&mut self, n: JSXObject) -> JSXObject {
        fold_jsx_object(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_opening_element(&mut self, n: JSXOpeningElement) -> JSXOpeningElement {
        fold_jsx_opening_element(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_opening_fragment(&mut self, n: JSXOpeningFragment) -> JSXOpeningFragment {
        fold_jsx_opening_fragment(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_spread_child(&mut self, n: JSXSpreadChild) -> JSXSpreadChild {
        fold_jsx_spread_child(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_text(&mut self, n: JSXText) -> JSXText {
        fold_jsx_text(self, n)
    }
    #[allow(unused_variables)]
    fn fold_key_value_pat_prop(&mut self, n: KeyValuePatProp) -> KeyValuePatProp {
        fold_key_value_pat_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_key_value_prop(&mut self, n: KeyValueProp) -> KeyValueProp {
        fold_key_value_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_labeled_stmt(&mut self, n: LabeledStmt) -> LabeledStmt {
        fold_labeled_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_lit(&mut self, n: Lit) -> Lit {
        fold_lit(self, n)
    }
    #[allow(unused_variables)]
    fn fold_member_expr(&mut self, n: MemberExpr) -> MemberExpr {
        fold_member_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_meta_prop_expr(&mut self, n: MetaPropExpr) -> MetaPropExpr {
        fold_meta_prop_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_method_kind(&mut self, n: MethodKind) -> MethodKind {
        fold_method_kind(self, n)
    }
    #[allow(unused_variables)]
    fn fold_method_prop(&mut self, n: MethodProp) -> MethodProp {
        fold_method_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_module(&mut self, n: Module) -> Module {
        fold_module(self, n)
    }
    #[allow(unused_variables)]
    fn fold_module_decl(&mut self, n: ModuleDecl) -> ModuleDecl {
        fold_module_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_module_item(&mut self, n: ModuleItem) -> ModuleItem {
        fold_module_item(self, n)
    }
    #[allow(unused_variables)]
    fn fold_named_export(&mut self, n: NamedExport) -> NamedExport {
        fold_named_export(self, n)
    }
    #[allow(unused_variables)]
    fn fold_new_expr(&mut self, n: NewExpr) -> NewExpr {
        fold_new_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_null(&mut self, n: Null) -> Null {
        fold_null(self, n)
    }
    #[allow(unused_variables)]
    fn fold_number(&mut self, n: Number) -> Number {
        fold_number(self, n)
    }
    #[allow(unused_variables)]
    fn fold_object_lit(&mut self, n: ObjectLit) -> ObjectLit {
        fold_object_lit(self, n)
    }
    #[allow(unused_variables)]
    fn fold_object_pat(&mut self, n: ObjectPat) -> ObjectPat {
        fold_object_pat(self, n)
    }
    #[allow(unused_variables)]
    fn fold_object_pat_prop(&mut self, n: ObjectPatProp) -> ObjectPatProp {
        fold_object_pat_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_chain_expr(&mut self, n: OptChainExpr) -> OptChainExpr {
        fold_opt_chain_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_param(&mut self, n: Param) -> Param {
        fold_param(self, n)
    }
    #[allow(unused_variables)]
    fn fold_param_or_ts_param_prop(&mut self, n: ParamOrTsParamProp) -> ParamOrTsParamProp {
        fold_param_or_ts_param_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_paren_expr(&mut self, n: ParenExpr) -> ParenExpr {
        fold_paren_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_pat(&mut self, n: Pat) -> Pat {
        fold_pat(self, n)
    }
    #[allow(unused_variables)]
    fn fold_pat_or_expr(&mut self, n: PatOrExpr) -> PatOrExpr {
        fold_pat_or_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_private_method(&mut self, n: PrivateMethod) -> PrivateMethod {
        fold_private_method(self, n)
    }
    #[allow(unused_variables)]
    fn fold_private_name(&mut self, n: PrivateName) -> PrivateName {
        fold_private_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_private_prop(&mut self, n: PrivateProp) -> PrivateProp {
        fold_private_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_program(&mut self, n: Program) -> Program {
        fold_program(self, n)
    }
    #[allow(unused_variables)]
    fn fold_prop(&mut self, n: Prop) -> Prop {
        fold_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        fold_prop_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_prop_or_spread(&mut self, n: PropOrSpread) -> PropOrSpread {
        fold_prop_or_spread(self, n)
    }
    #[allow(unused_variables)]
    fn fold_regex(&mut self, n: Regex) -> Regex {
        fold_regex(self, n)
    }
    #[allow(unused_variables)]
    fn fold_rest_pat(&mut self, n: RestPat) -> RestPat {
        fold_rest_pat(self, n)
    }
    #[allow(unused_variables)]
    fn fold_return_stmt(&mut self, n: ReturnStmt) -> ReturnStmt {
        fold_return_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_script(&mut self, n: Script) -> Script {
        fold_script(self, n)
    }
    #[allow(unused_variables)]
    fn fold_seq_expr(&mut self, n: SeqExpr) -> SeqExpr {
        fold_seq_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_setter_prop(&mut self, n: SetterProp) -> SetterProp {
        fold_setter_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_spread_element(&mut self, n: SpreadElement) -> SpreadElement {
        fold_spread_element(self, n)
    }
    #[allow(unused_variables)]
    fn fold_stmt(&mut self, n: Stmt) -> Stmt {
        fold_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_str(&mut self, n: Str) -> Str {
        fold_str(self, n)
    }
    #[allow(unused_variables)]
    fn fold_super(&mut self, n: Super) -> Super {
        fold_super(self, n)
    }
    #[allow(unused_variables)]
    fn fold_switch_case(&mut self, n: SwitchCase) -> SwitchCase {
        fold_switch_case(self, n)
    }
    #[allow(unused_variables)]
    fn fold_switch_stmt(&mut self, n: SwitchStmt) -> SwitchStmt {
        fold_switch_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_tagged_tpl(&mut self, n: TaggedTpl) -> TaggedTpl {
        fold_tagged_tpl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_this_expr(&mut self, n: ThisExpr) -> ThisExpr {
        fold_this_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_throw_stmt(&mut self, n: ThrowStmt) -> ThrowStmt {
        fold_throw_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_tpl(&mut self, n: Tpl) -> Tpl {
        fold_tpl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_tpl_element(&mut self, n: TplElement) -> TplElement {
        fold_tpl_element(self, n)
    }
    #[allow(unused_variables)]
    fn fold_true_plus_minus(&mut self, n: TruePlusMinus) -> TruePlusMinus {
        fold_true_plus_minus(self, n)
    }
    #[allow(unused_variables)]
    fn fold_try_stmt(&mut self, n: TryStmt) -> TryStmt {
        fold_try_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_array_type(&mut self, n: TsArrayType) -> TsArrayType {
        fold_ts_array_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_as_expr(&mut self, n: TsAsExpr) -> TsAsExpr {
        fold_ts_as_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_call_signature_decl(&mut self, n: TsCallSignatureDecl) -> TsCallSignatureDecl {
        fold_ts_call_signature_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_conditional_type(&mut self, n: TsConditionalType) -> TsConditionalType {
        fold_ts_conditional_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_const_assertion(&mut self, n: TsConstAssertion) -> TsConstAssertion {
        fold_ts_const_assertion(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_construct_signature_decl(
        &mut self,
        n: TsConstructSignatureDecl,
    ) -> TsConstructSignatureDecl {
        fold_ts_construct_signature_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_constructor_type(&mut self, n: TsConstructorType) -> TsConstructorType {
        fold_ts_constructor_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_entity_name(&mut self, n: TsEntityName) -> TsEntityName {
        fold_ts_entity_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_enum_decl(&mut self, n: TsEnumDecl) -> TsEnumDecl {
        fold_ts_enum_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_enum_member(&mut self, n: TsEnumMember) -> TsEnumMember {
        fold_ts_enum_member(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_enum_member_id(&mut self, n: TsEnumMemberId) -> TsEnumMemberId {
        fold_ts_enum_member_id(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_export_assignment(&mut self, n: TsExportAssignment) -> TsExportAssignment {
        fold_ts_export_assignment(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_expr_with_type_args(&mut self, n: TsExprWithTypeArgs) -> TsExprWithTypeArgs {
        fold_ts_expr_with_type_args(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_external_module_ref(&mut self, n: TsExternalModuleRef) -> TsExternalModuleRef {
        fold_ts_external_module_ref(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_fn_or_constructor_type(
        &mut self,
        n: TsFnOrConstructorType,
    ) -> TsFnOrConstructorType {
        fold_ts_fn_or_constructor_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_fn_param(&mut self, n: TsFnParam) -> TsFnParam {
        fold_ts_fn_param(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_fn_type(&mut self, n: TsFnType) -> TsFnType {
        fold_ts_fn_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_import_equals_decl(&mut self, n: TsImportEqualsDecl) -> TsImportEqualsDecl {
        fold_ts_import_equals_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_import_type(&mut self, n: TsImportType) -> TsImportType {
        fold_ts_import_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_index_signature(&mut self, n: TsIndexSignature) -> TsIndexSignature {
        fold_ts_index_signature(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_indexed_access_type(&mut self, n: TsIndexedAccessType) -> TsIndexedAccessType {
        fold_ts_indexed_access_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_infer_type(&mut self, n: TsInferType) -> TsInferType {
        fold_ts_infer_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_interface_body(&mut self, n: TsInterfaceBody) -> TsInterfaceBody {
        fold_ts_interface_body(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_interface_decl(&mut self, n: TsInterfaceDecl) -> TsInterfaceDecl {
        fold_ts_interface_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_intersection_type(&mut self, n: TsIntersectionType) -> TsIntersectionType {
        fold_ts_intersection_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_keyword_type(&mut self, n: TsKeywordType) -> TsKeywordType {
        fold_ts_keyword_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_keyword_type_kind(&mut self, n: TsKeywordTypeKind) -> TsKeywordTypeKind {
        fold_ts_keyword_type_kind(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_lit(&mut self, n: TsLit) -> TsLit {
        fold_ts_lit(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_lit_type(&mut self, n: TsLitType) -> TsLitType {
        fold_ts_lit_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_mapped_type(&mut self, n: TsMappedType) -> TsMappedType {
        fold_ts_mapped_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_method_signature(&mut self, n: TsMethodSignature) -> TsMethodSignature {
        fold_ts_method_signature(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_module_block(&mut self, n: TsModuleBlock) -> TsModuleBlock {
        fold_ts_module_block(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_module_decl(&mut self, n: TsModuleDecl) -> TsModuleDecl {
        fold_ts_module_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_module_name(&mut self, n: TsModuleName) -> TsModuleName {
        fold_ts_module_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_module_ref(&mut self, n: TsModuleRef) -> TsModuleRef {
        fold_ts_module_ref(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_namespace_body(&mut self, n: TsNamespaceBody) -> TsNamespaceBody {
        fold_ts_namespace_body(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_namespace_decl(&mut self, n: TsNamespaceDecl) -> TsNamespaceDecl {
        fold_ts_namespace_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_namespace_export_decl(&mut self, n: TsNamespaceExportDecl) -> TsNamespaceExportDecl {
        fold_ts_namespace_export_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_non_null_expr(&mut self, n: TsNonNullExpr) -> TsNonNullExpr {
        fold_ts_non_null_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_optional_type(&mut self, n: TsOptionalType) -> TsOptionalType {
        fold_ts_optional_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_param_prop(&mut self, n: TsParamProp) -> TsParamProp {
        fold_ts_param_prop(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_param_prop_param(&mut self, n: TsParamPropParam) -> TsParamPropParam {
        fold_ts_param_prop_param(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_parenthesized_type(&mut self, n: TsParenthesizedType) -> TsParenthesizedType {
        fold_ts_parenthesized_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_property_signature(&mut self, n: TsPropertySignature) -> TsPropertySignature {
        fold_ts_property_signature(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_qualified_name(&mut self, n: TsQualifiedName) -> TsQualifiedName {
        fold_ts_qualified_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_rest_type(&mut self, n: TsRestType) -> TsRestType {
        fold_ts_rest_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_signature_decl(&mut self, n: TsSignatureDecl) -> TsSignatureDecl {
        fold_ts_signature_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_this_type(&mut self, n: TsThisType) -> TsThisType {
        fold_ts_this_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_this_type_or_ident(&mut self, n: TsThisTypeOrIdent) -> TsThisTypeOrIdent {
        fold_ts_this_type_or_ident(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_tuple_element(&mut self, n: TsTupleElement) -> TsTupleElement {
        fold_ts_tuple_element(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_tuple_type(&mut self, n: TsTupleType) -> TsTupleType {
        fold_ts_tuple_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type(&mut self, n: TsType) -> TsType {
        fold_ts_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_alias_decl(&mut self, n: TsTypeAliasDecl) -> TsTypeAliasDecl {
        fold_ts_type_alias_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_ann(&mut self, n: TsTypeAnn) -> TsTypeAnn {
        fold_ts_type_ann(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_assertion(&mut self, n: TsTypeAssertion) -> TsTypeAssertion {
        fold_ts_type_assertion(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_cast_expr(&mut self, n: TsTypeCastExpr) -> TsTypeCastExpr {
        fold_ts_type_cast_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_element(&mut self, n: TsTypeElement) -> TsTypeElement {
        fold_ts_type_element(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_lit(&mut self, n: TsTypeLit) -> TsTypeLit {
        fold_ts_type_lit(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_operator(&mut self, n: TsTypeOperator) -> TsTypeOperator {
        fold_ts_type_operator(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_operator_op(&mut self, n: TsTypeOperatorOp) -> TsTypeOperatorOp {
        fold_ts_type_operator_op(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_param(&mut self, n: TsTypeParam) -> TsTypeParam {
        fold_ts_type_param(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_param_decl(&mut self, n: TsTypeParamDecl) -> TsTypeParamDecl {
        fold_ts_type_param_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_param_instantiation(
        &mut self,
        n: TsTypeParamInstantiation,
    ) -> TsTypeParamInstantiation {
        fold_ts_type_param_instantiation(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_predicate(&mut self, n: TsTypePredicate) -> TsTypePredicate {
        fold_ts_type_predicate(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_query(&mut self, n: TsTypeQuery) -> TsTypeQuery {
        fold_ts_type_query(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_query_expr(&mut self, n: TsTypeQueryExpr) -> TsTypeQueryExpr {
        fold_ts_type_query_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_ref(&mut self, n: TsTypeRef) -> TsTypeRef {
        fold_ts_type_ref(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_union_or_intersection_type(
        &mut self,
        n: TsUnionOrIntersectionType,
    ) -> TsUnionOrIntersectionType {
        fold_ts_union_or_intersection_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_union_type(&mut self, n: TsUnionType) -> TsUnionType {
        fold_ts_union_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_unary_expr(&mut self, n: UnaryExpr) -> UnaryExpr {
        fold_unary_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_unary_op(&mut self, n: UnaryOp) -> UnaryOp {
        fold_unary_op(self, n)
    }
    #[allow(unused_variables)]
    fn fold_update_expr(&mut self, n: UpdateExpr) -> UpdateExpr {
        fold_update_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_update_op(&mut self, n: UpdateOp) -> UpdateOp {
        fold_update_op(self, n)
    }
    #[allow(unused_variables)]
    fn fold_var_decl(&mut self, n: VarDecl) -> VarDecl {
        fold_var_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_var_decl_kind(&mut self, n: VarDeclKind) -> VarDeclKind {
        fold_var_decl_kind(self, n)
    }
    #[allow(unused_variables)]
    fn fold_var_decl_or_expr(&mut self, n: VarDeclOrExpr) -> VarDeclOrExpr {
        fold_var_decl_or_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_var_decl_or_pat(&mut self, n: VarDeclOrPat) -> VarDeclOrPat {
        fold_var_decl_or_pat(self, n)
    }
    #[allow(unused_variables)]
    fn fold_var_declarator(&mut self, n: VarDeclarator) -> VarDeclarator {
        fold_var_declarator(self, n)
    }
    #[allow(unused_variables)]
    fn fold_while_stmt(&mut self, n: WhileStmt) -> WhileStmt {
        fold_while_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_with_stmt(&mut self, n: WithStmt) -> WithStmt {
        fold_with_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_yield_expr(&mut self, n: YieldExpr) -> YieldExpr {
        fold_yield_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_span(&mut self, n: Span) -> Span {
        fold_span(self, n)
    }
    #[allow(unused_variables)]
    fn fold_decorators(&mut self, n: Vec<Decorator>) -> Vec<Decorator> {
        fold_decorators(self, n)
    }
    #[allow(unused_variables)]
    fn fold_class_members(&mut self, n: Vec<ClassMember>) -> Vec<ClassMember> {
        fold_class_members(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_expr(&mut self, n: Option<Box<Expr>>) -> Option<Box<Expr>> {
        fold_opt_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_ts_type_param_decl(
        &mut self,
        n: Option<TsTypeParamDecl>,
    ) -> Option<TsTypeParamDecl> {
        fold_opt_ts_type_param_decl(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_ts_type_param_instantiation(
        &mut self,
        n: Option<TsTypeParamInstantiation>,
    ) -> Option<TsTypeParamInstantiation> {
        fold_opt_ts_type_param_instantiation(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_expr_with_type_args_vec(
        &mut self,
        n: Vec<TsExprWithTypeArgs>,
    ) -> Vec<TsExprWithTypeArgs> {
        fold_ts_expr_with_type_args_vec(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_ts_type_ann(&mut self, n: Option<TsTypeAnn>) -> Option<TsTypeAnn> {
        fold_opt_ts_type_ann(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_accessibility(&mut self, n: Option<Accessibility>) -> Option<Accessibility> {
        fold_opt_accessibility(self, n)
    }
    #[allow(unused_variables)]
    fn fold_param_or_ts_param_props(
        &mut self,
        n: Vec<ParamOrTsParamProp>,
    ) -> Vec<ParamOrTsParamProp> {
        fold_param_or_ts_param_props(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_block_stmt(&mut self, n: Option<BlockStmt>) -> Option<BlockStmt> {
        fold_opt_block_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_var_declarators(&mut self, n: Vec<VarDeclarator>) -> Vec<VarDeclarator> {
        fold_var_declarators(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_vec_expr_or_spreads(
        &mut self,
        n: Vec<Option<ExprOrSpread>>,
    ) -> Vec<Option<ExprOrSpread>> {
        fold_opt_vec_expr_or_spreads(self, n)
    }
    #[allow(unused_variables)]
    fn fold_prop_or_spreads(&mut self, n: Vec<PropOrSpread>) -> Vec<PropOrSpread> {
        fold_prop_or_spreads(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_ident(&mut self, n: Option<Ident>) -> Option<Ident> {
        fold_opt_ident(self, n)
    }
    #[allow(unused_variables)]
    fn fold_expr_or_spreads(&mut self, n: Vec<ExprOrSpread>) -> Vec<ExprOrSpread> {
        fold_expr_or_spreads(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_expr_or_spreads(
        &mut self,
        n: Option<Vec<ExprOrSpread>>,
    ) -> Option<Vec<ExprOrSpread>> {
        fold_opt_expr_or_spreads(self, n)
    }
    #[allow(unused_variables)]
    fn fold_exprs(&mut self, n: Vec<Box<Expr>>) -> Vec<Box<Expr>> {
        fold_exprs(self, n)
    }
    #[allow(unused_variables)]
    fn fold_pats(&mut self, n: Vec<Pat>) -> Vec<Pat> {
        fold_pats(self, n)
    }
    #[allow(unused_variables)]
    fn fold_tpl_elements(&mut self, n: Vec<TplElement>) -> Vec<TplElement> {
        fold_tpl_elements(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_str(&mut self, n: Option<Str>) -> Option<Str> {
        fold_opt_str(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_span(&mut self, n: Option<Span>) -> Option<Span> {
        fold_opt_span(self, n)
    }
    #[allow(unused_variables)]
    fn fold_params(&mut self, n: Vec<Param>) -> Vec<Param> {
        fold_params(self, n)
    }
    #[allow(unused_variables)]
    fn fold_js_word(&mut self, n: JsWord) -> JsWord {
        fold_js_word(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_attr_or_spreads(&mut self, n: Vec<JSXAttrOrSpread>) -> Vec<JSXAttrOrSpread> {
        fold_jsx_attr_or_spreads(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_jsx_attr_value(&mut self, n: Option<JSXAttrValue>) -> Option<JSXAttrValue> {
        fold_opt_jsx_attr_value(self, n)
    }
    #[allow(unused_variables)]
    fn fold_jsx_element_children(&mut self, n: Vec<JSXElementChild>) -> Vec<JSXElementChild> {
        fold_jsx_element_children(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_jsx_closing_element(
        &mut self,
        n: Option<JSXClosingElement>,
    ) -> Option<JSXClosingElement> {
        fold_opt_jsx_closing_element(self, n)
    }
    #[allow(unused_variables)]
    fn fold_big_int_value(&mut self, n: BigIntValue) -> BigIntValue {
        fold_big_int_value(self, n)
    }
    #[allow(unused_variables)]
    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        fold_module_items(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_js_word(&mut self, n: Option<JsWord>) -> Option<JsWord> {
        fold_opt_js_word(self, n)
    }
    #[allow(unused_variables)]
    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        fold_stmts(self, n)
    }
    #[allow(unused_variables)]
    fn fold_import_specifiers(&mut self, n: Vec<ImportSpecifier>) -> Vec<ImportSpecifier> {
        fold_import_specifiers(self, n)
    }
    #[allow(unused_variables)]
    fn fold_export_specifiers(&mut self, n: Vec<ExportSpecifier>) -> Vec<ExportSpecifier> {
        fold_export_specifiers(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_vec_pats(&mut self, n: Vec<Option<Pat>>) -> Vec<Option<Pat>> {
        fold_opt_vec_pats(self, n)
    }
    #[allow(unused_variables)]
    fn fold_object_pat_props(&mut self, n: Vec<ObjectPatProp>) -> Vec<ObjectPatProp> {
        fold_object_pat_props(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_stmt(&mut self, n: Option<Box<Stmt>>) -> Option<Box<Stmt>> {
        fold_opt_stmt(self, n)
    }
    #[allow(unused_variables)]
    fn fold_switch_cases(&mut self, n: Vec<SwitchCase>) -> Vec<SwitchCase> {
        fold_switch_cases(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_catch_clause(&mut self, n: Option<CatchClause>) -> Option<CatchClause> {
        fold_opt_catch_clause(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_var_decl_or_expr(&mut self, n: Option<VarDeclOrExpr>) -> Option<VarDeclOrExpr> {
        fold_opt_var_decl_or_expr(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_pat(&mut self, n: Option<Pat>) -> Option<Pat> {
        fold_opt_pat(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_params(&mut self, n: Vec<TsTypeParam>) -> Vec<TsTypeParam> {
        fold_ts_type_params(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_ts_type(&mut self, n: Option<Box<TsType>>) -> Option<Box<TsType>> {
        fold_opt_ts_type(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_types(&mut self, n: Vec<Box<TsType>>) -> Vec<Box<TsType>> {
        fold_ts_types(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_fn_params(&mut self, n: Vec<TsFnParam>) -> Vec<TsFnParam> {
        fold_ts_fn_params(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_ts_entity_name(&mut self, n: Option<TsEntityName>) -> Option<TsEntityName> {
        fold_opt_ts_entity_name(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_type_elements(&mut self, n: Vec<TsTypeElement>) -> Vec<TsTypeElement> {
        fold_ts_type_elements(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_tuple_elements(&mut self, n: Vec<TsTupleElement>) -> Vec<TsTupleElement> {
        fold_ts_tuple_elements(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_true_plus_minus(&mut self, n: Option<TruePlusMinus>) -> Option<TruePlusMinus> {
        fold_opt_true_plus_minus(self, n)
    }
    #[allow(unused_variables)]
    fn fold_ts_enum_members(&mut self, n: Vec<TsEnumMember>) -> Vec<TsEnumMember> {
        fold_ts_enum_members(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_ts_namespace_body(
        &mut self,
        n: Option<TsNamespaceBody>,
    ) -> Option<TsNamespaceBody> {
        fold_opt_ts_namespace_body(self, n)
    }
    #[allow(unused_variables)]
    fn fold_opt_expr_or_spread(&mut self, n: Option<ExprOrSpread>) -> Option<ExprOrSpread> {
        fold_opt_expr_or_spread(self, n)
    }
}
impl<'a, V> Fold for &'a mut V
where
    V: ?Sized + Fold,
{
    fn fold_class(&mut self, n: Class) -> Class {
        (**self).fold_class(n)
    }
    fn fold_class_member(&mut self, n: ClassMember) -> ClassMember {
        (**self).fold_class_member(n)
    }
    fn fold_class_prop(&mut self, n: ClassProp) -> ClassProp {
        (**self).fold_class_prop(n)
    }
    fn fold_private_prop(&mut self, n: PrivateProp) -> PrivateProp {
        (**self).fold_private_prop(n)
    }
    fn fold_class_method(&mut self, n: ClassMethod) -> ClassMethod {
        (**self).fold_class_method(n)
    }
    fn fold_private_method(&mut self, n: PrivateMethod) -> PrivateMethod {
        (**self).fold_private_method(n)
    }
    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        (**self).fold_constructor(n)
    }
    fn fold_decorator(&mut self, n: Decorator) -> Decorator {
        (**self).fold_decorator(n)
    }
    fn fold_method_kind(&mut self, n: MethodKind) -> MethodKind {
        (**self).fold_method_kind(n)
    }
    fn fold_decl(&mut self, n: Decl) -> Decl {
        (**self).fold_decl(n)
    }
    fn fold_fn_decl(&mut self, n: FnDecl) -> FnDecl {
        (**self).fold_fn_decl(n)
    }
    fn fold_class_decl(&mut self, n: ClassDecl) -> ClassDecl {
        (**self).fold_class_decl(n)
    }
    fn fold_var_decl(&mut self, n: VarDecl) -> VarDecl {
        (**self).fold_var_decl(n)
    }
    fn fold_var_decl_kind(&mut self, n: VarDeclKind) -> VarDeclKind {
        (**self).fold_var_decl_kind(n)
    }
    fn fold_var_declarator(&mut self, n: VarDeclarator) -> VarDeclarator {
        (**self).fold_var_declarator(n)
    }
    fn fold_expr(&mut self, n: Expr) -> Expr {
        (**self).fold_expr(n)
    }
    fn fold_this_expr(&mut self, n: ThisExpr) -> ThisExpr {
        (**self).fold_this_expr(n)
    }
    fn fold_array_lit(&mut self, n: ArrayLit) -> ArrayLit {
        (**self).fold_array_lit(n)
    }
    fn fold_object_lit(&mut self, n: ObjectLit) -> ObjectLit {
        (**self).fold_object_lit(n)
    }
    fn fold_prop_or_spread(&mut self, n: PropOrSpread) -> PropOrSpread {
        (**self).fold_prop_or_spread(n)
    }
    fn fold_spread_element(&mut self, n: SpreadElement) -> SpreadElement {
        (**self).fold_spread_element(n)
    }
    fn fold_unary_expr(&mut self, n: UnaryExpr) -> UnaryExpr {
        (**self).fold_unary_expr(n)
    }
    fn fold_update_expr(&mut self, n: UpdateExpr) -> UpdateExpr {
        (**self).fold_update_expr(n)
    }
    fn fold_bin_expr(&mut self, n: BinExpr) -> BinExpr {
        (**self).fold_bin_expr(n)
    }
    fn fold_fn_expr(&mut self, n: FnExpr) -> FnExpr {
        (**self).fold_fn_expr(n)
    }
    fn fold_class_expr(&mut self, n: ClassExpr) -> ClassExpr {
        (**self).fold_class_expr(n)
    }
    fn fold_assign_expr(&mut self, n: AssignExpr) -> AssignExpr {
        (**self).fold_assign_expr(n)
    }
    fn fold_member_expr(&mut self, n: MemberExpr) -> MemberExpr {
        (**self).fold_member_expr(n)
    }
    fn fold_cond_expr(&mut self, n: CondExpr) -> CondExpr {
        (**self).fold_cond_expr(n)
    }
    fn fold_call_expr(&mut self, n: CallExpr) -> CallExpr {
        (**self).fold_call_expr(n)
    }
    fn fold_new_expr(&mut self, n: NewExpr) -> NewExpr {
        (**self).fold_new_expr(n)
    }
    fn fold_seq_expr(&mut self, n: SeqExpr) -> SeqExpr {
        (**self).fold_seq_expr(n)
    }
    fn fold_arrow_expr(&mut self, n: ArrowExpr) -> ArrowExpr {
        (**self).fold_arrow_expr(n)
    }
    fn fold_yield_expr(&mut self, n: YieldExpr) -> YieldExpr {
        (**self).fold_yield_expr(n)
    }
    fn fold_meta_prop_expr(&mut self, n: MetaPropExpr) -> MetaPropExpr {
        (**self).fold_meta_prop_expr(n)
    }
    fn fold_await_expr(&mut self, n: AwaitExpr) -> AwaitExpr {
        (**self).fold_await_expr(n)
    }
    fn fold_tpl(&mut self, n: Tpl) -> Tpl {
        (**self).fold_tpl(n)
    }
    fn fold_tagged_tpl(&mut self, n: TaggedTpl) -> TaggedTpl {
        (**self).fold_tagged_tpl(n)
    }
    fn fold_tpl_element(&mut self, n: TplElement) -> TplElement {
        (**self).fold_tpl_element(n)
    }
    fn fold_paren_expr(&mut self, n: ParenExpr) -> ParenExpr {
        (**self).fold_paren_expr(n)
    }
    fn fold_expr_or_super(&mut self, n: ExprOrSuper) -> ExprOrSuper {
        (**self).fold_expr_or_super(n)
    }
    fn fold_super(&mut self, n: Super) -> Super {
        (**self).fold_super(n)
    }
    fn fold_expr_or_spread(&mut self, n: ExprOrSpread) -> ExprOrSpread {
        (**self).fold_expr_or_spread(n)
    }
    fn fold_block_stmt_or_expr(&mut self, n: BlockStmtOrExpr) -> BlockStmtOrExpr {
        (**self).fold_block_stmt_or_expr(n)
    }
    fn fold_pat_or_expr(&mut self, n: PatOrExpr) -> PatOrExpr {
        (**self).fold_pat_or_expr(n)
    }
    fn fold_opt_chain_expr(&mut self, n: OptChainExpr) -> OptChainExpr {
        (**self).fold_opt_chain_expr(n)
    }
    fn fold_function(&mut self, n: Function) -> Function {
        (**self).fold_function(n)
    }
    fn fold_param(&mut self, n: Param) -> Param {
        (**self).fold_param(n)
    }
    fn fold_param_or_ts_param_prop(&mut self, n: ParamOrTsParamProp) -> ParamOrTsParamProp {
        (**self).fold_param_or_ts_param_prop(n)
    }
    fn fold_ident(&mut self, n: Ident) -> Ident {
        (**self).fold_ident(n)
    }
    fn fold_private_name(&mut self, n: PrivateName) -> PrivateName {
        (**self).fold_private_name(n)
    }
    fn fold_jsx_object(&mut self, n: JSXObject) -> JSXObject {
        (**self).fold_jsx_object(n)
    }
    fn fold_jsx_member_expr(&mut self, n: JSXMemberExpr) -> JSXMemberExpr {
        (**self).fold_jsx_member_expr(n)
    }
    fn fold_jsx_namespaced_name(&mut self, n: JSXNamespacedName) -> JSXNamespacedName {
        (**self).fold_jsx_namespaced_name(n)
    }
    fn fold_jsx_empty_expr(&mut self, n: JSXEmptyExpr) -> JSXEmptyExpr {
        (**self).fold_jsx_empty_expr(n)
    }
    fn fold_jsx_expr_container(&mut self, n: JSXExprContainer) -> JSXExprContainer {
        (**self).fold_jsx_expr_container(n)
    }
    fn fold_jsx_expr(&mut self, n: JSXExpr) -> JSXExpr {
        (**self).fold_jsx_expr(n)
    }
    fn fold_jsx_spread_child(&mut self, n: JSXSpreadChild) -> JSXSpreadChild {
        (**self).fold_jsx_spread_child(n)
    }
    fn fold_jsx_element_name(&mut self, n: JSXElementName) -> JSXElementName {
        (**self).fold_jsx_element_name(n)
    }
    fn fold_jsx_opening_element(&mut self, n: JSXOpeningElement) -> JSXOpeningElement {
        (**self).fold_jsx_opening_element(n)
    }
    fn fold_jsx_attr_or_spread(&mut self, n: JSXAttrOrSpread) -> JSXAttrOrSpread {
        (**self).fold_jsx_attr_or_spread(n)
    }
    fn fold_jsx_closing_element(&mut self, n: JSXClosingElement) -> JSXClosingElement {
        (**self).fold_jsx_closing_element(n)
    }
    fn fold_jsx_attr(&mut self, n: JSXAttr) -> JSXAttr {
        (**self).fold_jsx_attr(n)
    }
    fn fold_jsx_attr_name(&mut self, n: JSXAttrName) -> JSXAttrName {
        (**self).fold_jsx_attr_name(n)
    }
    fn fold_jsx_attr_value(&mut self, n: JSXAttrValue) -> JSXAttrValue {
        (**self).fold_jsx_attr_value(n)
    }
    fn fold_jsx_text(&mut self, n: JSXText) -> JSXText {
        (**self).fold_jsx_text(n)
    }
    fn fold_jsx_element(&mut self, n: JSXElement) -> JSXElement {
        (**self).fold_jsx_element(n)
    }
    fn fold_jsx_element_child(&mut self, n: JSXElementChild) -> JSXElementChild {
        (**self).fold_jsx_element_child(n)
    }
    fn fold_jsx_fragment(&mut self, n: JSXFragment) -> JSXFragment {
        (**self).fold_jsx_fragment(n)
    }
    fn fold_jsx_opening_fragment(&mut self, n: JSXOpeningFragment) -> JSXOpeningFragment {
        (**self).fold_jsx_opening_fragment(n)
    }
    fn fold_jsx_closing_fragment(&mut self, n: JSXClosingFragment) -> JSXClosingFragment {
        (**self).fold_jsx_closing_fragment(n)
    }
    fn fold_invalid(&mut self, n: Invalid) -> Invalid {
        (**self).fold_invalid(n)
    }
    fn fold_lit(&mut self, n: Lit) -> Lit {
        (**self).fold_lit(n)
    }
    fn fold_big_int(&mut self, n: BigInt) -> BigInt {
        (**self).fold_big_int(n)
    }
    fn fold_str(&mut self, n: Str) -> Str {
        (**self).fold_str(n)
    }
    fn fold_bool(&mut self, n: Bool) -> Bool {
        (**self).fold_bool(n)
    }
    fn fold_null(&mut self, n: Null) -> Null {
        (**self).fold_null(n)
    }
    fn fold_regex(&mut self, n: Regex) -> Regex {
        (**self).fold_regex(n)
    }
    fn fold_number(&mut self, n: Number) -> Number {
        (**self).fold_number(n)
    }
    fn fold_program(&mut self, n: Program) -> Program {
        (**self).fold_program(n)
    }
    fn fold_module(&mut self, n: Module) -> Module {
        (**self).fold_module(n)
    }
    fn fold_script(&mut self, n: Script) -> Script {
        (**self).fold_script(n)
    }
    fn fold_module_item(&mut self, n: ModuleItem) -> ModuleItem {
        (**self).fold_module_item(n)
    }
    fn fold_module_decl(&mut self, n: ModuleDecl) -> ModuleDecl {
        (**self).fold_module_decl(n)
    }
    fn fold_export_default_expr(&mut self, n: ExportDefaultExpr) -> ExportDefaultExpr {
        (**self).fold_export_default_expr(n)
    }
    fn fold_export_decl(&mut self, n: ExportDecl) -> ExportDecl {
        (**self).fold_export_decl(n)
    }
    fn fold_import_decl(&mut self, n: ImportDecl) -> ImportDecl {
        (**self).fold_import_decl(n)
    }
    fn fold_export_all(&mut self, n: ExportAll) -> ExportAll {
        (**self).fold_export_all(n)
    }
    fn fold_named_export(&mut self, n: NamedExport) -> NamedExport {
        (**self).fold_named_export(n)
    }
    fn fold_export_default_decl(&mut self, n: ExportDefaultDecl) -> ExportDefaultDecl {
        (**self).fold_export_default_decl(n)
    }
    fn fold_default_decl(&mut self, n: DefaultDecl) -> DefaultDecl {
        (**self).fold_default_decl(n)
    }
    fn fold_import_specifier(&mut self, n: ImportSpecifier) -> ImportSpecifier {
        (**self).fold_import_specifier(n)
    }
    fn fold_import_default_specifier(
        &mut self,
        n: ImportDefaultSpecifier,
    ) -> ImportDefaultSpecifier {
        (**self).fold_import_default_specifier(n)
    }
    fn fold_import_star_as_specifier(&mut self, n: ImportStarAsSpecifier) -> ImportStarAsSpecifier {
        (**self).fold_import_star_as_specifier(n)
    }
    fn fold_import_named_specifier(&mut self, n: ImportNamedSpecifier) -> ImportNamedSpecifier {
        (**self).fold_import_named_specifier(n)
    }
    fn fold_export_specifier(&mut self, n: ExportSpecifier) -> ExportSpecifier {
        (**self).fold_export_specifier(n)
    }
    fn fold_export_namespace_specifier(
        &mut self,
        n: ExportNamespaceSpecifier,
    ) -> ExportNamespaceSpecifier {
        (**self).fold_export_namespace_specifier(n)
    }
    fn fold_export_default_specifier(
        &mut self,
        n: ExportDefaultSpecifier,
    ) -> ExportDefaultSpecifier {
        (**self).fold_export_default_specifier(n)
    }
    fn fold_export_named_specifier(&mut self, n: ExportNamedSpecifier) -> ExportNamedSpecifier {
        (**self).fold_export_named_specifier(n)
    }
    fn fold_binary_op(&mut self, n: BinaryOp) -> BinaryOp {
        (**self).fold_binary_op(n)
    }
    fn fold_assign_op(&mut self, n: AssignOp) -> AssignOp {
        (**self).fold_assign_op(n)
    }
    fn fold_update_op(&mut self, n: UpdateOp) -> UpdateOp {
        (**self).fold_update_op(n)
    }
    fn fold_unary_op(&mut self, n: UnaryOp) -> UnaryOp {
        (**self).fold_unary_op(n)
    }
    fn fold_pat(&mut self, n: Pat) -> Pat {
        (**self).fold_pat(n)
    }
    fn fold_array_pat(&mut self, n: ArrayPat) -> ArrayPat {
        (**self).fold_array_pat(n)
    }
    fn fold_object_pat(&mut self, n: ObjectPat) -> ObjectPat {
        (**self).fold_object_pat(n)
    }
    fn fold_assign_pat(&mut self, n: AssignPat) -> AssignPat {
        (**self).fold_assign_pat(n)
    }
    fn fold_rest_pat(&mut self, n: RestPat) -> RestPat {
        (**self).fold_rest_pat(n)
    }
    fn fold_object_pat_prop(&mut self, n: ObjectPatProp) -> ObjectPatProp {
        (**self).fold_object_pat_prop(n)
    }
    fn fold_key_value_pat_prop(&mut self, n: KeyValuePatProp) -> KeyValuePatProp {
        (**self).fold_key_value_pat_prop(n)
    }
    fn fold_assign_pat_prop(&mut self, n: AssignPatProp) -> AssignPatProp {
        (**self).fold_assign_pat_prop(n)
    }
    fn fold_prop(&mut self, n: Prop) -> Prop {
        (**self).fold_prop(n)
    }
    fn fold_key_value_prop(&mut self, n: KeyValueProp) -> KeyValueProp {
        (**self).fold_key_value_prop(n)
    }
    fn fold_assign_prop(&mut self, n: AssignProp) -> AssignProp {
        (**self).fold_assign_prop(n)
    }
    fn fold_getter_prop(&mut self, n: GetterProp) -> GetterProp {
        (**self).fold_getter_prop(n)
    }
    fn fold_setter_prop(&mut self, n: SetterProp) -> SetterProp {
        (**self).fold_setter_prop(n)
    }
    fn fold_method_prop(&mut self, n: MethodProp) -> MethodProp {
        (**self).fold_method_prop(n)
    }
    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        (**self).fold_prop_name(n)
    }
    fn fold_computed_prop_name(&mut self, n: ComputedPropName) -> ComputedPropName {
        (**self).fold_computed_prop_name(n)
    }
    fn fold_block_stmt(&mut self, n: BlockStmt) -> BlockStmt {
        (**self).fold_block_stmt(n)
    }
    fn fold_stmt(&mut self, n: Stmt) -> Stmt {
        (**self).fold_stmt(n)
    }
    fn fold_expr_stmt(&mut self, n: ExprStmt) -> ExprStmt {
        (**self).fold_expr_stmt(n)
    }
    fn fold_empty_stmt(&mut self, n: EmptyStmt) -> EmptyStmt {
        (**self).fold_empty_stmt(n)
    }
    fn fold_debugger_stmt(&mut self, n: DebuggerStmt) -> DebuggerStmt {
        (**self).fold_debugger_stmt(n)
    }
    fn fold_with_stmt(&mut self, n: WithStmt) -> WithStmt {
        (**self).fold_with_stmt(n)
    }
    fn fold_return_stmt(&mut self, n: ReturnStmt) -> ReturnStmt {
        (**self).fold_return_stmt(n)
    }
    fn fold_labeled_stmt(&mut self, n: LabeledStmt) -> LabeledStmt {
        (**self).fold_labeled_stmt(n)
    }
    fn fold_break_stmt(&mut self, n: BreakStmt) -> BreakStmt {
        (**self).fold_break_stmt(n)
    }
    fn fold_continue_stmt(&mut self, n: ContinueStmt) -> ContinueStmt {
        (**self).fold_continue_stmt(n)
    }
    fn fold_if_stmt(&mut self, n: IfStmt) -> IfStmt {
        (**self).fold_if_stmt(n)
    }
    fn fold_switch_stmt(&mut self, n: SwitchStmt) -> SwitchStmt {
        (**self).fold_switch_stmt(n)
    }
    fn fold_throw_stmt(&mut self, n: ThrowStmt) -> ThrowStmt {
        (**self).fold_throw_stmt(n)
    }
    fn fold_try_stmt(&mut self, n: TryStmt) -> TryStmt {
        (**self).fold_try_stmt(n)
    }
    fn fold_while_stmt(&mut self, n: WhileStmt) -> WhileStmt {
        (**self).fold_while_stmt(n)
    }
    fn fold_do_while_stmt(&mut self, n: DoWhileStmt) -> DoWhileStmt {
        (**self).fold_do_while_stmt(n)
    }
    fn fold_for_stmt(&mut self, n: ForStmt) -> ForStmt {
        (**self).fold_for_stmt(n)
    }
    fn fold_for_in_stmt(&mut self, n: ForInStmt) -> ForInStmt {
        (**self).fold_for_in_stmt(n)
    }
    fn fold_for_of_stmt(&mut self, n: ForOfStmt) -> ForOfStmt {
        (**self).fold_for_of_stmt(n)
    }
    fn fold_switch_case(&mut self, n: SwitchCase) -> SwitchCase {
        (**self).fold_switch_case(n)
    }
    fn fold_catch_clause(&mut self, n: CatchClause) -> CatchClause {
        (**self).fold_catch_clause(n)
    }
    fn fold_var_decl_or_pat(&mut self, n: VarDeclOrPat) -> VarDeclOrPat {
        (**self).fold_var_decl_or_pat(n)
    }
    fn fold_var_decl_or_expr(&mut self, n: VarDeclOrExpr) -> VarDeclOrExpr {
        (**self).fold_var_decl_or_expr(n)
    }
    fn fold_ts_type_ann(&mut self, n: TsTypeAnn) -> TsTypeAnn {
        (**self).fold_ts_type_ann(n)
    }
    fn fold_ts_type_param_decl(&mut self, n: TsTypeParamDecl) -> TsTypeParamDecl {
        (**self).fold_ts_type_param_decl(n)
    }
    fn fold_ts_type_param(&mut self, n: TsTypeParam) -> TsTypeParam {
        (**self).fold_ts_type_param(n)
    }
    fn fold_ts_type_param_instantiation(
        &mut self,
        n: TsTypeParamInstantiation,
    ) -> TsTypeParamInstantiation {
        (**self).fold_ts_type_param_instantiation(n)
    }
    fn fold_ts_type_cast_expr(&mut self, n: TsTypeCastExpr) -> TsTypeCastExpr {
        (**self).fold_ts_type_cast_expr(n)
    }
    fn fold_ts_param_prop(&mut self, n: TsParamProp) -> TsParamProp {
        (**self).fold_ts_param_prop(n)
    }
    fn fold_ts_param_prop_param(&mut self, n: TsParamPropParam) -> TsParamPropParam {
        (**self).fold_ts_param_prop_param(n)
    }
    fn fold_ts_qualified_name(&mut self, n: TsQualifiedName) -> TsQualifiedName {
        (**self).fold_ts_qualified_name(n)
    }
    fn fold_ts_entity_name(&mut self, n: TsEntityName) -> TsEntityName {
        (**self).fold_ts_entity_name(n)
    }
    fn fold_ts_signature_decl(&mut self, n: TsSignatureDecl) -> TsSignatureDecl {
        (**self).fold_ts_signature_decl(n)
    }
    fn fold_ts_type_element(&mut self, n: TsTypeElement) -> TsTypeElement {
        (**self).fold_ts_type_element(n)
    }
    fn fold_ts_call_signature_decl(&mut self, n: TsCallSignatureDecl) -> TsCallSignatureDecl {
        (**self).fold_ts_call_signature_decl(n)
    }
    fn fold_ts_construct_signature_decl(
        &mut self,
        n: TsConstructSignatureDecl,
    ) -> TsConstructSignatureDecl {
        (**self).fold_ts_construct_signature_decl(n)
    }
    fn fold_ts_property_signature(&mut self, n: TsPropertySignature) -> TsPropertySignature {
        (**self).fold_ts_property_signature(n)
    }
    fn fold_ts_method_signature(&mut self, n: TsMethodSignature) -> TsMethodSignature {
        (**self).fold_ts_method_signature(n)
    }
    fn fold_ts_index_signature(&mut self, n: TsIndexSignature) -> TsIndexSignature {
        (**self).fold_ts_index_signature(n)
    }
    fn fold_ts_type(&mut self, n: TsType) -> TsType {
        (**self).fold_ts_type(n)
    }
    fn fold_ts_fn_or_constructor_type(
        &mut self,
        n: TsFnOrConstructorType,
    ) -> TsFnOrConstructorType {
        (**self).fold_ts_fn_or_constructor_type(n)
    }
    fn fold_ts_keyword_type(&mut self, n: TsKeywordType) -> TsKeywordType {
        (**self).fold_ts_keyword_type(n)
    }
    fn fold_ts_keyword_type_kind(&mut self, n: TsKeywordTypeKind) -> TsKeywordTypeKind {
        (**self).fold_ts_keyword_type_kind(n)
    }
    fn fold_ts_this_type(&mut self, n: TsThisType) -> TsThisType {
        (**self).fold_ts_this_type(n)
    }
    fn fold_ts_fn_param(&mut self, n: TsFnParam) -> TsFnParam {
        (**self).fold_ts_fn_param(n)
    }
    fn fold_ts_fn_type(&mut self, n: TsFnType) -> TsFnType {
        (**self).fold_ts_fn_type(n)
    }
    fn fold_ts_constructor_type(&mut self, n: TsConstructorType) -> TsConstructorType {
        (**self).fold_ts_constructor_type(n)
    }
    fn fold_ts_type_ref(&mut self, n: TsTypeRef) -> TsTypeRef {
        (**self).fold_ts_type_ref(n)
    }
    fn fold_ts_type_predicate(&mut self, n: TsTypePredicate) -> TsTypePredicate {
        (**self).fold_ts_type_predicate(n)
    }
    fn fold_ts_this_type_or_ident(&mut self, n: TsThisTypeOrIdent) -> TsThisTypeOrIdent {
        (**self).fold_ts_this_type_or_ident(n)
    }
    fn fold_ts_type_query(&mut self, n: TsTypeQuery) -> TsTypeQuery {
        (**self).fold_ts_type_query(n)
    }
    fn fold_ts_type_query_expr(&mut self, n: TsTypeQueryExpr) -> TsTypeQueryExpr {
        (**self).fold_ts_type_query_expr(n)
    }
    fn fold_ts_import_type(&mut self, n: TsImportType) -> TsImportType {
        (**self).fold_ts_import_type(n)
    }
    fn fold_ts_type_lit(&mut self, n: TsTypeLit) -> TsTypeLit {
        (**self).fold_ts_type_lit(n)
    }
    fn fold_ts_array_type(&mut self, n: TsArrayType) -> TsArrayType {
        (**self).fold_ts_array_type(n)
    }
    fn fold_ts_tuple_type(&mut self, n: TsTupleType) -> TsTupleType {
        (**self).fold_ts_tuple_type(n)
    }
    fn fold_ts_tuple_element(&mut self, n: TsTupleElement) -> TsTupleElement {
        (**self).fold_ts_tuple_element(n)
    }
    fn fold_ts_optional_type(&mut self, n: TsOptionalType) -> TsOptionalType {
        (**self).fold_ts_optional_type(n)
    }
    fn fold_ts_rest_type(&mut self, n: TsRestType) -> TsRestType {
        (**self).fold_ts_rest_type(n)
    }
    fn fold_ts_union_or_intersection_type(
        &mut self,
        n: TsUnionOrIntersectionType,
    ) -> TsUnionOrIntersectionType {
        (**self).fold_ts_union_or_intersection_type(n)
    }
    fn fold_ts_union_type(&mut self, n: TsUnionType) -> TsUnionType {
        (**self).fold_ts_union_type(n)
    }
    fn fold_ts_intersection_type(&mut self, n: TsIntersectionType) -> TsIntersectionType {
        (**self).fold_ts_intersection_type(n)
    }
    fn fold_ts_conditional_type(&mut self, n: TsConditionalType) -> TsConditionalType {
        (**self).fold_ts_conditional_type(n)
    }
    fn fold_ts_infer_type(&mut self, n: TsInferType) -> TsInferType {
        (**self).fold_ts_infer_type(n)
    }
    fn fold_ts_parenthesized_type(&mut self, n: TsParenthesizedType) -> TsParenthesizedType {
        (**self).fold_ts_parenthesized_type(n)
    }
    fn fold_ts_type_operator(&mut self, n: TsTypeOperator) -> TsTypeOperator {
        (**self).fold_ts_type_operator(n)
    }
    fn fold_ts_type_operator_op(&mut self, n: TsTypeOperatorOp) -> TsTypeOperatorOp {
        (**self).fold_ts_type_operator_op(n)
    }
    fn fold_ts_indexed_access_type(&mut self, n: TsIndexedAccessType) -> TsIndexedAccessType {
        (**self).fold_ts_indexed_access_type(n)
    }
    fn fold_true_plus_minus(&mut self, n: TruePlusMinus) -> TruePlusMinus {
        (**self).fold_true_plus_minus(n)
    }
    fn fold_ts_mapped_type(&mut self, n: TsMappedType) -> TsMappedType {
        (**self).fold_ts_mapped_type(n)
    }
    fn fold_ts_lit_type(&mut self, n: TsLitType) -> TsLitType {
        (**self).fold_ts_lit_type(n)
    }
    fn fold_ts_lit(&mut self, n: TsLit) -> TsLit {
        (**self).fold_ts_lit(n)
    }
    fn fold_ts_interface_decl(&mut self, n: TsInterfaceDecl) -> TsInterfaceDecl {
        (**self).fold_ts_interface_decl(n)
    }
    fn fold_ts_interface_body(&mut self, n: TsInterfaceBody) -> TsInterfaceBody {
        (**self).fold_ts_interface_body(n)
    }
    fn fold_ts_expr_with_type_args(&mut self, n: TsExprWithTypeArgs) -> TsExprWithTypeArgs {
        (**self).fold_ts_expr_with_type_args(n)
    }
    fn fold_ts_type_alias_decl(&mut self, n: TsTypeAliasDecl) -> TsTypeAliasDecl {
        (**self).fold_ts_type_alias_decl(n)
    }
    fn fold_ts_enum_decl(&mut self, n: TsEnumDecl) -> TsEnumDecl {
        (**self).fold_ts_enum_decl(n)
    }
    fn fold_ts_enum_member(&mut self, n: TsEnumMember) -> TsEnumMember {
        (**self).fold_ts_enum_member(n)
    }
    fn fold_ts_enum_member_id(&mut self, n: TsEnumMemberId) -> TsEnumMemberId {
        (**self).fold_ts_enum_member_id(n)
    }
    fn fold_ts_module_decl(&mut self, n: TsModuleDecl) -> TsModuleDecl {
        (**self).fold_ts_module_decl(n)
    }
    fn fold_ts_namespace_body(&mut self, n: TsNamespaceBody) -> TsNamespaceBody {
        (**self).fold_ts_namespace_body(n)
    }
    fn fold_ts_module_block(&mut self, n: TsModuleBlock) -> TsModuleBlock {
        (**self).fold_ts_module_block(n)
    }
    fn fold_ts_namespace_decl(&mut self, n: TsNamespaceDecl) -> TsNamespaceDecl {
        (**self).fold_ts_namespace_decl(n)
    }
    fn fold_ts_module_name(&mut self, n: TsModuleName) -> TsModuleName {
        (**self).fold_ts_module_name(n)
    }
    fn fold_ts_import_equals_decl(&mut self, n: TsImportEqualsDecl) -> TsImportEqualsDecl {
        (**self).fold_ts_import_equals_decl(n)
    }
    fn fold_ts_module_ref(&mut self, n: TsModuleRef) -> TsModuleRef {
        (**self).fold_ts_module_ref(n)
    }
    fn fold_ts_external_module_ref(&mut self, n: TsExternalModuleRef) -> TsExternalModuleRef {
        (**self).fold_ts_external_module_ref(n)
    }
    fn fold_ts_export_assignment(&mut self, n: TsExportAssignment) -> TsExportAssignment {
        (**self).fold_ts_export_assignment(n)
    }
    fn fold_ts_namespace_export_decl(&mut self, n: TsNamespaceExportDecl) -> TsNamespaceExportDecl {
        (**self).fold_ts_namespace_export_decl(n)
    }
    fn fold_ts_as_expr(&mut self, n: TsAsExpr) -> TsAsExpr {
        (**self).fold_ts_as_expr(n)
    }
    fn fold_ts_type_assertion(&mut self, n: TsTypeAssertion) -> TsTypeAssertion {
        (**self).fold_ts_type_assertion(n)
    }
    fn fold_ts_non_null_expr(&mut self, n: TsNonNullExpr) -> TsNonNullExpr {
        (**self).fold_ts_non_null_expr(n)
    }
    fn fold_accessibility(&mut self, n: Accessibility) -> Accessibility {
        (**self).fold_accessibility(n)
    }
    fn fold_ts_const_assertion(&mut self, n: TsConstAssertion) -> TsConstAssertion {
        (**self).fold_ts_const_assertion(n)
    }
}
impl<V> Fold for Box<V>
where
    V: ?Sized + Fold,
{
    fn fold_class(&mut self, n: Class) -> Class {
        (**self).fold_class(n)
    }
    fn fold_class_member(&mut self, n: ClassMember) -> ClassMember {
        (**self).fold_class_member(n)
    }
    fn fold_class_prop(&mut self, n: ClassProp) -> ClassProp {
        (**self).fold_class_prop(n)
    }
    fn fold_private_prop(&mut self, n: PrivateProp) -> PrivateProp {
        (**self).fold_private_prop(n)
    }
    fn fold_class_method(&mut self, n: ClassMethod) -> ClassMethod {
        (**self).fold_class_method(n)
    }
    fn fold_private_method(&mut self, n: PrivateMethod) -> PrivateMethod {
        (**self).fold_private_method(n)
    }
    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        (**self).fold_constructor(n)
    }
    fn fold_decorator(&mut self, n: Decorator) -> Decorator {
        (**self).fold_decorator(n)
    }
    fn fold_method_kind(&mut self, n: MethodKind) -> MethodKind {
        (**self).fold_method_kind(n)
    }
    fn fold_decl(&mut self, n: Decl) -> Decl {
        (**self).fold_decl(n)
    }
    fn fold_fn_decl(&mut self, n: FnDecl) -> FnDecl {
        (**self).fold_fn_decl(n)
    }
    fn fold_class_decl(&mut self, n: ClassDecl) -> ClassDecl {
        (**self).fold_class_decl(n)
    }
    fn fold_var_decl(&mut self, n: VarDecl) -> VarDecl {
        (**self).fold_var_decl(n)
    }
    fn fold_var_decl_kind(&mut self, n: VarDeclKind) -> VarDeclKind {
        (**self).fold_var_decl_kind(n)
    }
    fn fold_var_declarator(&mut self, n: VarDeclarator) -> VarDeclarator {
        (**self).fold_var_declarator(n)
    }
    fn fold_expr(&mut self, n: Expr) -> Expr {
        (**self).fold_expr(n)
    }
    fn fold_this_expr(&mut self, n: ThisExpr) -> ThisExpr {
        (**self).fold_this_expr(n)
    }
    fn fold_array_lit(&mut self, n: ArrayLit) -> ArrayLit {
        (**self).fold_array_lit(n)
    }
    fn fold_object_lit(&mut self, n: ObjectLit) -> ObjectLit {
        (**self).fold_object_lit(n)
    }
    fn fold_prop_or_spread(&mut self, n: PropOrSpread) -> PropOrSpread {
        (**self).fold_prop_or_spread(n)
    }
    fn fold_spread_element(&mut self, n: SpreadElement) -> SpreadElement {
        (**self).fold_spread_element(n)
    }
    fn fold_unary_expr(&mut self, n: UnaryExpr) -> UnaryExpr {
        (**self).fold_unary_expr(n)
    }
    fn fold_update_expr(&mut self, n: UpdateExpr) -> UpdateExpr {
        (**self).fold_update_expr(n)
    }
    fn fold_bin_expr(&mut self, n: BinExpr) -> BinExpr {
        (**self).fold_bin_expr(n)
    }
    fn fold_fn_expr(&mut self, n: FnExpr) -> FnExpr {
        (**self).fold_fn_expr(n)
    }
    fn fold_class_expr(&mut self, n: ClassExpr) -> ClassExpr {
        (**self).fold_class_expr(n)
    }
    fn fold_assign_expr(&mut self, n: AssignExpr) -> AssignExpr {
        (**self).fold_assign_expr(n)
    }
    fn fold_member_expr(&mut self, n: MemberExpr) -> MemberExpr {
        (**self).fold_member_expr(n)
    }
    fn fold_cond_expr(&mut self, n: CondExpr) -> CondExpr {
        (**self).fold_cond_expr(n)
    }
    fn fold_call_expr(&mut self, n: CallExpr) -> CallExpr {
        (**self).fold_call_expr(n)
    }
    fn fold_new_expr(&mut self, n: NewExpr) -> NewExpr {
        (**self).fold_new_expr(n)
    }
    fn fold_seq_expr(&mut self, n: SeqExpr) -> SeqExpr {
        (**self).fold_seq_expr(n)
    }
    fn fold_arrow_expr(&mut self, n: ArrowExpr) -> ArrowExpr {
        (**self).fold_arrow_expr(n)
    }
    fn fold_yield_expr(&mut self, n: YieldExpr) -> YieldExpr {
        (**self).fold_yield_expr(n)
    }
    fn fold_meta_prop_expr(&mut self, n: MetaPropExpr) -> MetaPropExpr {
        (**self).fold_meta_prop_expr(n)
    }
    fn fold_await_expr(&mut self, n: AwaitExpr) -> AwaitExpr {
        (**self).fold_await_expr(n)
    }
    fn fold_tpl(&mut self, n: Tpl) -> Tpl {
        (**self).fold_tpl(n)
    }
    fn fold_tagged_tpl(&mut self, n: TaggedTpl) -> TaggedTpl {
        (**self).fold_tagged_tpl(n)
    }
    fn fold_tpl_element(&mut self, n: TplElement) -> TplElement {
        (**self).fold_tpl_element(n)
    }
    fn fold_paren_expr(&mut self, n: ParenExpr) -> ParenExpr {
        (**self).fold_paren_expr(n)
    }
    fn fold_expr_or_super(&mut self, n: ExprOrSuper) -> ExprOrSuper {
        (**self).fold_expr_or_super(n)
    }
    fn fold_super(&mut self, n: Super) -> Super {
        (**self).fold_super(n)
    }
    fn fold_expr_or_spread(&mut self, n: ExprOrSpread) -> ExprOrSpread {
        (**self).fold_expr_or_spread(n)
    }
    fn fold_block_stmt_or_expr(&mut self, n: BlockStmtOrExpr) -> BlockStmtOrExpr {
        (**self).fold_block_stmt_or_expr(n)
    }
    fn fold_pat_or_expr(&mut self, n: PatOrExpr) -> PatOrExpr {
        (**self).fold_pat_or_expr(n)
    }
    fn fold_opt_chain_expr(&mut self, n: OptChainExpr) -> OptChainExpr {
        (**self).fold_opt_chain_expr(n)
    }
    fn fold_function(&mut self, n: Function) -> Function {
        (**self).fold_function(n)
    }
    fn fold_param(&mut self, n: Param) -> Param {
        (**self).fold_param(n)
    }
    fn fold_param_or_ts_param_prop(&mut self, n: ParamOrTsParamProp) -> ParamOrTsParamProp {
        (**self).fold_param_or_ts_param_prop(n)
    }
    fn fold_ident(&mut self, n: Ident) -> Ident {
        (**self).fold_ident(n)
    }
    fn fold_private_name(&mut self, n: PrivateName) -> PrivateName {
        (**self).fold_private_name(n)
    }
    fn fold_jsx_object(&mut self, n: JSXObject) -> JSXObject {
        (**self).fold_jsx_object(n)
    }
    fn fold_jsx_member_expr(&mut self, n: JSXMemberExpr) -> JSXMemberExpr {
        (**self).fold_jsx_member_expr(n)
    }
    fn fold_jsx_namespaced_name(&mut self, n: JSXNamespacedName) -> JSXNamespacedName {
        (**self).fold_jsx_namespaced_name(n)
    }
    fn fold_jsx_empty_expr(&mut self, n: JSXEmptyExpr) -> JSXEmptyExpr {
        (**self).fold_jsx_empty_expr(n)
    }
    fn fold_jsx_expr_container(&mut self, n: JSXExprContainer) -> JSXExprContainer {
        (**self).fold_jsx_expr_container(n)
    }
    fn fold_jsx_expr(&mut self, n: JSXExpr) -> JSXExpr {
        (**self).fold_jsx_expr(n)
    }
    fn fold_jsx_spread_child(&mut self, n: JSXSpreadChild) -> JSXSpreadChild {
        (**self).fold_jsx_spread_child(n)
    }
    fn fold_jsx_element_name(&mut self, n: JSXElementName) -> JSXElementName {
        (**self).fold_jsx_element_name(n)
    }
    fn fold_jsx_opening_element(&mut self, n: JSXOpeningElement) -> JSXOpeningElement {
        (**self).fold_jsx_opening_element(n)
    }
    fn fold_jsx_attr_or_spread(&mut self, n: JSXAttrOrSpread) -> JSXAttrOrSpread {
        (**self).fold_jsx_attr_or_spread(n)
    }
    fn fold_jsx_closing_element(&mut self, n: JSXClosingElement) -> JSXClosingElement {
        (**self).fold_jsx_closing_element(n)
    }
    fn fold_jsx_attr(&mut self, n: JSXAttr) -> JSXAttr {
        (**self).fold_jsx_attr(n)
    }
    fn fold_jsx_attr_name(&mut self, n: JSXAttrName) -> JSXAttrName {
        (**self).fold_jsx_attr_name(n)
    }
    fn fold_jsx_attr_value(&mut self, n: JSXAttrValue) -> JSXAttrValue {
        (**self).fold_jsx_attr_value(n)
    }
    fn fold_jsx_text(&mut self, n: JSXText) -> JSXText {
        (**self).fold_jsx_text(n)
    }
    fn fold_jsx_element(&mut self, n: JSXElement) -> JSXElement {
        (**self).fold_jsx_element(n)
    }
    fn fold_jsx_element_child(&mut self, n: JSXElementChild) -> JSXElementChild {
        (**self).fold_jsx_element_child(n)
    }
    fn fold_jsx_fragment(&mut self, n: JSXFragment) -> JSXFragment {
        (**self).fold_jsx_fragment(n)
    }
    fn fold_jsx_opening_fragment(&mut self, n: JSXOpeningFragment) -> JSXOpeningFragment {
        (**self).fold_jsx_opening_fragment(n)
    }
    fn fold_jsx_closing_fragment(&mut self, n: JSXClosingFragment) -> JSXClosingFragment {
        (**self).fold_jsx_closing_fragment(n)
    }
    fn fold_invalid(&mut self, n: Invalid) -> Invalid {
        (**self).fold_invalid(n)
    }
    fn fold_lit(&mut self, n: Lit) -> Lit {
        (**self).fold_lit(n)
    }
    fn fold_big_int(&mut self, n: BigInt) -> BigInt {
        (**self).fold_big_int(n)
    }
    fn fold_str(&mut self, n: Str) -> Str {
        (**self).fold_str(n)
    }
    fn fold_bool(&mut self, n: Bool) -> Bool {
        (**self).fold_bool(n)
    }
    fn fold_null(&mut self, n: Null) -> Null {
        (**self).fold_null(n)
    }
    fn fold_regex(&mut self, n: Regex) -> Regex {
        (**self).fold_regex(n)
    }
    fn fold_number(&mut self, n: Number) -> Number {
        (**self).fold_number(n)
    }
    fn fold_program(&mut self, n: Program) -> Program {
        (**self).fold_program(n)
    }
    fn fold_module(&mut self, n: Module) -> Module {
        (**self).fold_module(n)
    }
    fn fold_script(&mut self, n: Script) -> Script {
        (**self).fold_script(n)
    }
    fn fold_module_item(&mut self, n: ModuleItem) -> ModuleItem {
        (**self).fold_module_item(n)
    }
    fn fold_module_decl(&mut self, n: ModuleDecl) -> ModuleDecl {
        (**self).fold_module_decl(n)
    }
    fn fold_export_default_expr(&mut self, n: ExportDefaultExpr) -> ExportDefaultExpr {
        (**self).fold_export_default_expr(n)
    }
    fn fold_export_decl(&mut self, n: ExportDecl) -> ExportDecl {
        (**self).fold_export_decl(n)
    }
    fn fold_import_decl(&mut self, n: ImportDecl) -> ImportDecl {
        (**self).fold_import_decl(n)
    }
    fn fold_export_all(&mut self, n: ExportAll) -> ExportAll {
        (**self).fold_export_all(n)
    }
    fn fold_named_export(&mut self, n: NamedExport) -> NamedExport {
        (**self).fold_named_export(n)
    }
    fn fold_export_default_decl(&mut self, n: ExportDefaultDecl) -> ExportDefaultDecl {
        (**self).fold_export_default_decl(n)
    }
    fn fold_default_decl(&mut self, n: DefaultDecl) -> DefaultDecl {
        (**self).fold_default_decl(n)
    }
    fn fold_import_specifier(&mut self, n: ImportSpecifier) -> ImportSpecifier {
        (**self).fold_import_specifier(n)
    }
    fn fold_import_default_specifier(
        &mut self,
        n: ImportDefaultSpecifier,
    ) -> ImportDefaultSpecifier {
        (**self).fold_import_default_specifier(n)
    }
    fn fold_import_star_as_specifier(&mut self, n: ImportStarAsSpecifier) -> ImportStarAsSpecifier {
        (**self).fold_import_star_as_specifier(n)
    }
    fn fold_import_named_specifier(&mut self, n: ImportNamedSpecifier) -> ImportNamedSpecifier {
        (**self).fold_import_named_specifier(n)
    }
    fn fold_export_specifier(&mut self, n: ExportSpecifier) -> ExportSpecifier {
        (**self).fold_export_specifier(n)
    }
    fn fold_export_namespace_specifier(
        &mut self,
        n: ExportNamespaceSpecifier,
    ) -> ExportNamespaceSpecifier {
        (**self).fold_export_namespace_specifier(n)
    }
    fn fold_export_default_specifier(
        &mut self,
        n: ExportDefaultSpecifier,
    ) -> ExportDefaultSpecifier {
        (**self).fold_export_default_specifier(n)
    }
    fn fold_export_named_specifier(&mut self, n: ExportNamedSpecifier) -> ExportNamedSpecifier {
        (**self).fold_export_named_specifier(n)
    }
    fn fold_binary_op(&mut self, n: BinaryOp) -> BinaryOp {
        (**self).fold_binary_op(n)
    }
    fn fold_assign_op(&mut self, n: AssignOp) -> AssignOp {
        (**self).fold_assign_op(n)
    }
    fn fold_update_op(&mut self, n: UpdateOp) -> UpdateOp {
        (**self).fold_update_op(n)
    }
    fn fold_unary_op(&mut self, n: UnaryOp) -> UnaryOp {
        (**self).fold_unary_op(n)
    }
    fn fold_pat(&mut self, n: Pat) -> Pat {
        (**self).fold_pat(n)
    }
    fn fold_array_pat(&mut self, n: ArrayPat) -> ArrayPat {
        (**self).fold_array_pat(n)
    }
    fn fold_object_pat(&mut self, n: ObjectPat) -> ObjectPat {
        (**self).fold_object_pat(n)
    }
    fn fold_assign_pat(&mut self, n: AssignPat) -> AssignPat {
        (**self).fold_assign_pat(n)
    }
    fn fold_rest_pat(&mut self, n: RestPat) -> RestPat {
        (**self).fold_rest_pat(n)
    }
    fn fold_object_pat_prop(&mut self, n: ObjectPatProp) -> ObjectPatProp {
        (**self).fold_object_pat_prop(n)
    }
    fn fold_key_value_pat_prop(&mut self, n: KeyValuePatProp) -> KeyValuePatProp {
        (**self).fold_key_value_pat_prop(n)
    }
    fn fold_assign_pat_prop(&mut self, n: AssignPatProp) -> AssignPatProp {
        (**self).fold_assign_pat_prop(n)
    }
    fn fold_prop(&mut self, n: Prop) -> Prop {
        (**self).fold_prop(n)
    }
    fn fold_key_value_prop(&mut self, n: KeyValueProp) -> KeyValueProp {
        (**self).fold_key_value_prop(n)
    }
    fn fold_assign_prop(&mut self, n: AssignProp) -> AssignProp {
        (**self).fold_assign_prop(n)
    }
    fn fold_getter_prop(&mut self, n: GetterProp) -> GetterProp {
        (**self).fold_getter_prop(n)
    }
    fn fold_setter_prop(&mut self, n: SetterProp) -> SetterProp {
        (**self).fold_setter_prop(n)
    }
    fn fold_method_prop(&mut self, n: MethodProp) -> MethodProp {
        (**self).fold_method_prop(n)
    }
    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        (**self).fold_prop_name(n)
    }
    fn fold_computed_prop_name(&mut self, n: ComputedPropName) -> ComputedPropName {
        (**self).fold_computed_prop_name(n)
    }
    fn fold_block_stmt(&mut self, n: BlockStmt) -> BlockStmt {
        (**self).fold_block_stmt(n)
    }
    fn fold_stmt(&mut self, n: Stmt) -> Stmt {
        (**self).fold_stmt(n)
    }
    fn fold_expr_stmt(&mut self, n: ExprStmt) -> ExprStmt {
        (**self).fold_expr_stmt(n)
    }
    fn fold_empty_stmt(&mut self, n: EmptyStmt) -> EmptyStmt {
        (**self).fold_empty_stmt(n)
    }
    fn fold_debugger_stmt(&mut self, n: DebuggerStmt) -> DebuggerStmt {
        (**self).fold_debugger_stmt(n)
    }
    fn fold_with_stmt(&mut self, n: WithStmt) -> WithStmt {
        (**self).fold_with_stmt(n)
    }
    fn fold_return_stmt(&mut self, n: ReturnStmt) -> ReturnStmt {
        (**self).fold_return_stmt(n)
    }
    fn fold_labeled_stmt(&mut self, n: LabeledStmt) -> LabeledStmt {
        (**self).fold_labeled_stmt(n)
    }
    fn fold_break_stmt(&mut self, n: BreakStmt) -> BreakStmt {
        (**self).fold_break_stmt(n)
    }
    fn fold_continue_stmt(&mut self, n: ContinueStmt) -> ContinueStmt {
        (**self).fold_continue_stmt(n)
    }
    fn fold_if_stmt(&mut self, n: IfStmt) -> IfStmt {
        (**self).fold_if_stmt(n)
    }
    fn fold_switch_stmt(&mut self, n: SwitchStmt) -> SwitchStmt {
        (**self).fold_switch_stmt(n)
    }
    fn fold_throw_stmt(&mut self, n: ThrowStmt) -> ThrowStmt {
        (**self).fold_throw_stmt(n)
    }
    fn fold_try_stmt(&mut self, n: TryStmt) -> TryStmt {
        (**self).fold_try_stmt(n)
    }
    fn fold_while_stmt(&mut self, n: WhileStmt) -> WhileStmt {
        (**self).fold_while_stmt(n)
    }
    fn fold_do_while_stmt(&mut self, n: DoWhileStmt) -> DoWhileStmt {
        (**self).fold_do_while_stmt(n)
    }
    fn fold_for_stmt(&mut self, n: ForStmt) -> ForStmt {
        (**self).fold_for_stmt(n)
    }
    fn fold_for_in_stmt(&mut self, n: ForInStmt) -> ForInStmt {
        (**self).fold_for_in_stmt(n)
    }
    fn fold_for_of_stmt(&mut self, n: ForOfStmt) -> ForOfStmt {
        (**self).fold_for_of_stmt(n)
    }
    fn fold_switch_case(&mut self, n: SwitchCase) -> SwitchCase {
        (**self).fold_switch_case(n)
    }
    fn fold_catch_clause(&mut self, n: CatchClause) -> CatchClause {
        (**self).fold_catch_clause(n)
    }
    fn fold_var_decl_or_pat(&mut self, n: VarDeclOrPat) -> VarDeclOrPat {
        (**self).fold_var_decl_or_pat(n)
    }
    fn fold_var_decl_or_expr(&mut self, n: VarDeclOrExpr) -> VarDeclOrExpr {
        (**self).fold_var_decl_or_expr(n)
    }
    fn fold_ts_type_ann(&mut self, n: TsTypeAnn) -> TsTypeAnn {
        (**self).fold_ts_type_ann(n)
    }
    fn fold_ts_type_param_decl(&mut self, n: TsTypeParamDecl) -> TsTypeParamDecl {
        (**self).fold_ts_type_param_decl(n)
    }
    fn fold_ts_type_param(&mut self, n: TsTypeParam) -> TsTypeParam {
        (**self).fold_ts_type_param(n)
    }
    fn fold_ts_type_param_instantiation(
        &mut self,
        n: TsTypeParamInstantiation,
    ) -> TsTypeParamInstantiation {
        (**self).fold_ts_type_param_instantiation(n)
    }
    fn fold_ts_type_cast_expr(&mut self, n: TsTypeCastExpr) -> TsTypeCastExpr {
        (**self).fold_ts_type_cast_expr(n)
    }
    fn fold_ts_param_prop(&mut self, n: TsParamProp) -> TsParamProp {
        (**self).fold_ts_param_prop(n)
    }
    fn fold_ts_param_prop_param(&mut self, n: TsParamPropParam) -> TsParamPropParam {
        (**self).fold_ts_param_prop_param(n)
    }
    fn fold_ts_qualified_name(&mut self, n: TsQualifiedName) -> TsQualifiedName {
        (**self).fold_ts_qualified_name(n)
    }
    fn fold_ts_entity_name(&mut self, n: TsEntityName) -> TsEntityName {
        (**self).fold_ts_entity_name(n)
    }
    fn fold_ts_signature_decl(&mut self, n: TsSignatureDecl) -> TsSignatureDecl {
        (**self).fold_ts_signature_decl(n)
    }
    fn fold_ts_type_element(&mut self, n: TsTypeElement) -> TsTypeElement {
        (**self).fold_ts_type_element(n)
    }
    fn fold_ts_call_signature_decl(&mut self, n: TsCallSignatureDecl) -> TsCallSignatureDecl {
        (**self).fold_ts_call_signature_decl(n)
    }
    fn fold_ts_construct_signature_decl(
        &mut self,
        n: TsConstructSignatureDecl,
    ) -> TsConstructSignatureDecl {
        (**self).fold_ts_construct_signature_decl(n)
    }
    fn fold_ts_property_signature(&mut self, n: TsPropertySignature) -> TsPropertySignature {
        (**self).fold_ts_property_signature(n)
    }
    fn fold_ts_method_signature(&mut self, n: TsMethodSignature) -> TsMethodSignature {
        (**self).fold_ts_method_signature(n)
    }
    fn fold_ts_index_signature(&mut self, n: TsIndexSignature) -> TsIndexSignature {
        (**self).fold_ts_index_signature(n)
    }
    fn fold_ts_type(&mut self, n: TsType) -> TsType {
        (**self).fold_ts_type(n)
    }
    fn fold_ts_fn_or_constructor_type(
        &mut self,
        n: TsFnOrConstructorType,
    ) -> TsFnOrConstructorType {
        (**self).fold_ts_fn_or_constructor_type(n)
    }
    fn fold_ts_keyword_type(&mut self, n: TsKeywordType) -> TsKeywordType {
        (**self).fold_ts_keyword_type(n)
    }
    fn fold_ts_keyword_type_kind(&mut self, n: TsKeywordTypeKind) -> TsKeywordTypeKind {
        (**self).fold_ts_keyword_type_kind(n)
    }
    fn fold_ts_this_type(&mut self, n: TsThisType) -> TsThisType {
        (**self).fold_ts_this_type(n)
    }
    fn fold_ts_fn_param(&mut self, n: TsFnParam) -> TsFnParam {
        (**self).fold_ts_fn_param(n)
    }
    fn fold_ts_fn_type(&mut self, n: TsFnType) -> TsFnType {
        (**self).fold_ts_fn_type(n)
    }
    fn fold_ts_constructor_type(&mut self, n: TsConstructorType) -> TsConstructorType {
        (**self).fold_ts_constructor_type(n)
    }
    fn fold_ts_type_ref(&mut self, n: TsTypeRef) -> TsTypeRef {
        (**self).fold_ts_type_ref(n)
    }
    fn fold_ts_type_predicate(&mut self, n: TsTypePredicate) -> TsTypePredicate {
        (**self).fold_ts_type_predicate(n)
    }
    fn fold_ts_this_type_or_ident(&mut self, n: TsThisTypeOrIdent) -> TsThisTypeOrIdent {
        (**self).fold_ts_this_type_or_ident(n)
    }
    fn fold_ts_type_query(&mut self, n: TsTypeQuery) -> TsTypeQuery {
        (**self).fold_ts_type_query(n)
    }
    fn fold_ts_type_query_expr(&mut self, n: TsTypeQueryExpr) -> TsTypeQueryExpr {
        (**self).fold_ts_type_query_expr(n)
    }
    fn fold_ts_import_type(&mut self, n: TsImportType) -> TsImportType {
        (**self).fold_ts_import_type(n)
    }
    fn fold_ts_type_lit(&mut self, n: TsTypeLit) -> TsTypeLit {
        (**self).fold_ts_type_lit(n)
    }
    fn fold_ts_array_type(&mut self, n: TsArrayType) -> TsArrayType {
        (**self).fold_ts_array_type(n)
    }
    fn fold_ts_tuple_type(&mut self, n: TsTupleType) -> TsTupleType {
        (**self).fold_ts_tuple_type(n)
    }
    fn fold_ts_tuple_element(&mut self, n: TsTupleElement) -> TsTupleElement {
        (**self).fold_ts_tuple_element(n)
    }
    fn fold_ts_optional_type(&mut self, n: TsOptionalType) -> TsOptionalType {
        (**self).fold_ts_optional_type(n)
    }
    fn fold_ts_rest_type(&mut self, n: TsRestType) -> TsRestType {
        (**self).fold_ts_rest_type(n)
    }
    fn fold_ts_union_or_intersection_type(
        &mut self,
        n: TsUnionOrIntersectionType,
    ) -> TsUnionOrIntersectionType {
        (**self).fold_ts_union_or_intersection_type(n)
    }
    fn fold_ts_union_type(&mut self, n: TsUnionType) -> TsUnionType {
        (**self).fold_ts_union_type(n)
    }
    fn fold_ts_intersection_type(&mut self, n: TsIntersectionType) -> TsIntersectionType {
        (**self).fold_ts_intersection_type(n)
    }
    fn fold_ts_conditional_type(&mut self, n: TsConditionalType) -> TsConditionalType {
        (**self).fold_ts_conditional_type(n)
    }
    fn fold_ts_infer_type(&mut self, n: TsInferType) -> TsInferType {
        (**self).fold_ts_infer_type(n)
    }
    fn fold_ts_parenthesized_type(&mut self, n: TsParenthesizedType) -> TsParenthesizedType {
        (**self).fold_ts_parenthesized_type(n)
    }
    fn fold_ts_type_operator(&mut self, n: TsTypeOperator) -> TsTypeOperator {
        (**self).fold_ts_type_operator(n)
    }
    fn fold_ts_type_operator_op(&mut self, n: TsTypeOperatorOp) -> TsTypeOperatorOp {
        (**self).fold_ts_type_operator_op(n)
    }
    fn fold_ts_indexed_access_type(&mut self, n: TsIndexedAccessType) -> TsIndexedAccessType {
        (**self).fold_ts_indexed_access_type(n)
    }
    fn fold_true_plus_minus(&mut self, n: TruePlusMinus) -> TruePlusMinus {
        (**self).fold_true_plus_minus(n)
    }
    fn fold_ts_mapped_type(&mut self, n: TsMappedType) -> TsMappedType {
        (**self).fold_ts_mapped_type(n)
    }
    fn fold_ts_lit_type(&mut self, n: TsLitType) -> TsLitType {
        (**self).fold_ts_lit_type(n)
    }
    fn fold_ts_lit(&mut self, n: TsLit) -> TsLit {
        (**self).fold_ts_lit(n)
    }
    fn fold_ts_interface_decl(&mut self, n: TsInterfaceDecl) -> TsInterfaceDecl {
        (**self).fold_ts_interface_decl(n)
    }
    fn fold_ts_interface_body(&mut self, n: TsInterfaceBody) -> TsInterfaceBody {
        (**self).fold_ts_interface_body(n)
    }
    fn fold_ts_expr_with_type_args(&mut self, n: TsExprWithTypeArgs) -> TsExprWithTypeArgs {
        (**self).fold_ts_expr_with_type_args(n)
    }
    fn fold_ts_type_alias_decl(&mut self, n: TsTypeAliasDecl) -> TsTypeAliasDecl {
        (**self).fold_ts_type_alias_decl(n)
    }
    fn fold_ts_enum_decl(&mut self, n: TsEnumDecl) -> TsEnumDecl {
        (**self).fold_ts_enum_decl(n)
    }
    fn fold_ts_enum_member(&mut self, n: TsEnumMember) -> TsEnumMember {
        (**self).fold_ts_enum_member(n)
    }
    fn fold_ts_enum_member_id(&mut self, n: TsEnumMemberId) -> TsEnumMemberId {
        (**self).fold_ts_enum_member_id(n)
    }
    fn fold_ts_module_decl(&mut self, n: TsModuleDecl) -> TsModuleDecl {
        (**self).fold_ts_module_decl(n)
    }
    fn fold_ts_namespace_body(&mut self, n: TsNamespaceBody) -> TsNamespaceBody {
        (**self).fold_ts_namespace_body(n)
    }
    fn fold_ts_module_block(&mut self, n: TsModuleBlock) -> TsModuleBlock {
        (**self).fold_ts_module_block(n)
    }
    fn fold_ts_namespace_decl(&mut self, n: TsNamespaceDecl) -> TsNamespaceDecl {
        (**self).fold_ts_namespace_decl(n)
    }
    fn fold_ts_module_name(&mut self, n: TsModuleName) -> TsModuleName {
        (**self).fold_ts_module_name(n)
    }
    fn fold_ts_import_equals_decl(&mut self, n: TsImportEqualsDecl) -> TsImportEqualsDecl {
        (**self).fold_ts_import_equals_decl(n)
    }
    fn fold_ts_module_ref(&mut self, n: TsModuleRef) -> TsModuleRef {
        (**self).fold_ts_module_ref(n)
    }
    fn fold_ts_external_module_ref(&mut self, n: TsExternalModuleRef) -> TsExternalModuleRef {
        (**self).fold_ts_external_module_ref(n)
    }
    fn fold_ts_export_assignment(&mut self, n: TsExportAssignment) -> TsExportAssignment {
        (**self).fold_ts_export_assignment(n)
    }
    fn fold_ts_namespace_export_decl(&mut self, n: TsNamespaceExportDecl) -> TsNamespaceExportDecl {
        (**self).fold_ts_namespace_export_decl(n)
    }
    fn fold_ts_as_expr(&mut self, n: TsAsExpr) -> TsAsExpr {
        (**self).fold_ts_as_expr(n)
    }
    fn fold_ts_type_assertion(&mut self, n: TsTypeAssertion) -> TsTypeAssertion {
        (**self).fold_ts_type_assertion(n)
    }
    fn fold_ts_non_null_expr(&mut self, n: TsNonNullExpr) -> TsNonNullExpr {
        (**self).fold_ts_non_null_expr(n)
    }
    fn fold_accessibility(&mut self, n: Accessibility) -> Accessibility {
        (**self).fold_accessibility(n)
    }
    fn fold_ts_const_assertion(&mut self, n: TsConstAssertion) -> TsConstAssertion {
        (**self).fold_ts_const_assertion(n)
    }
}
impl<V> Fold for ::swc_visit::Optional<V>
where
    V: Fold,
{
    fn fold_class(&mut self, n: Class) -> Class {
        if self.enabled {
            self.visitor.fold_class(n)
        } else {
            n
        }
    }
    fn fold_class_member(&mut self, n: ClassMember) -> ClassMember {
        if self.enabled {
            self.visitor.fold_class_member(n)
        } else {
            n
        }
    }
    fn fold_class_prop(&mut self, n: ClassProp) -> ClassProp {
        if self.enabled {
            self.visitor.fold_class_prop(n)
        } else {
            n
        }
    }
    fn fold_private_prop(&mut self, n: PrivateProp) -> PrivateProp {
        if self.enabled {
            self.visitor.fold_private_prop(n)
        } else {
            n
        }
    }
    fn fold_class_method(&mut self, n: ClassMethod) -> ClassMethod {
        if self.enabled {
            self.visitor.fold_class_method(n)
        } else {
            n
        }
    }
    fn fold_private_method(&mut self, n: PrivateMethod) -> PrivateMethod {
        if self.enabled {
            self.visitor.fold_private_method(n)
        } else {
            n
        }
    }
    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        if self.enabled {
            self.visitor.fold_constructor(n)
        } else {
            n
        }
    }
    fn fold_decorator(&mut self, n: Decorator) -> Decorator {
        if self.enabled {
            self.visitor.fold_decorator(n)
        } else {
            n
        }
    }
    fn fold_method_kind(&mut self, n: MethodKind) -> MethodKind {
        if self.enabled {
            self.visitor.fold_method_kind(n)
        } else {
            n
        }
    }
    fn fold_decl(&mut self, n: Decl) -> Decl {
        if self.enabled {
            self.visitor.fold_decl(n)
        } else {
            n
        }
    }
    fn fold_fn_decl(&mut self, n: FnDecl) -> FnDecl {
        if self.enabled {
            self.visitor.fold_fn_decl(n)
        } else {
            n
        }
    }
    fn fold_class_decl(&mut self, n: ClassDecl) -> ClassDecl {
        if self.enabled {
            self.visitor.fold_class_decl(n)
        } else {
            n
        }
    }
    fn fold_var_decl(&mut self, n: VarDecl) -> VarDecl {
        if self.enabled {
            self.visitor.fold_var_decl(n)
        } else {
            n
        }
    }
    fn fold_var_decl_kind(&mut self, n: VarDeclKind) -> VarDeclKind {
        if self.enabled {
            self.visitor.fold_var_decl_kind(n)
        } else {
            n
        }
    }
    fn fold_var_declarator(&mut self, n: VarDeclarator) -> VarDeclarator {
        if self.enabled {
            self.visitor.fold_var_declarator(n)
        } else {
            n
        }
    }
    fn fold_expr(&mut self, n: Expr) -> Expr {
        if self.enabled {
            self.visitor.fold_expr(n)
        } else {
            n
        }
    }
    fn fold_this_expr(&mut self, n: ThisExpr) -> ThisExpr {
        if self.enabled {
            self.visitor.fold_this_expr(n)
        } else {
            n
        }
    }
    fn fold_array_lit(&mut self, n: ArrayLit) -> ArrayLit {
        if self.enabled {
            self.visitor.fold_array_lit(n)
        } else {
            n
        }
    }
    fn fold_object_lit(&mut self, n: ObjectLit) -> ObjectLit {
        if self.enabled {
            self.visitor.fold_object_lit(n)
        } else {
            n
        }
    }
    fn fold_prop_or_spread(&mut self, n: PropOrSpread) -> PropOrSpread {
        if self.enabled {
            self.visitor.fold_prop_or_spread(n)
        } else {
            n
        }
    }
    fn fold_spread_element(&mut self, n: SpreadElement) -> SpreadElement {
        if self.enabled {
            self.visitor.fold_spread_element(n)
        } else {
            n
        }
    }
    fn fold_unary_expr(&mut self, n: UnaryExpr) -> UnaryExpr {
        if self.enabled {
            self.visitor.fold_unary_expr(n)
        } else {
            n
        }
    }
    fn fold_update_expr(&mut self, n: UpdateExpr) -> UpdateExpr {
        if self.enabled {
            self.visitor.fold_update_expr(n)
        } else {
            n
        }
    }
    fn fold_bin_expr(&mut self, n: BinExpr) -> BinExpr {
        if self.enabled {
            self.visitor.fold_bin_expr(n)
        } else {
            n
        }
    }
    fn fold_fn_expr(&mut self, n: FnExpr) -> FnExpr {
        if self.enabled {
            self.visitor.fold_fn_expr(n)
        } else {
            n
        }
    }
    fn fold_class_expr(&mut self, n: ClassExpr) -> ClassExpr {
        if self.enabled {
            self.visitor.fold_class_expr(n)
        } else {
            n
        }
    }
    fn fold_assign_expr(&mut self, n: AssignExpr) -> AssignExpr {
        if self.enabled {
            self.visitor.fold_assign_expr(n)
        } else {
            n
        }
    }
    fn fold_member_expr(&mut self, n: MemberExpr) -> MemberExpr {
        if self.enabled {
            self.visitor.fold_member_expr(n)
        } else {
            n
        }
    }
    fn fold_cond_expr(&mut self, n: CondExpr) -> CondExpr {
        if self.enabled {
            self.visitor.fold_cond_expr(n)
        } else {
            n
        }
    }
    fn fold_call_expr(&mut self, n: CallExpr) -> CallExpr {
        if self.enabled {
            self.visitor.fold_call_expr(n)
        } else {
            n
        }
    }
    fn fold_new_expr(&mut self, n: NewExpr) -> NewExpr {
        if self.enabled {
            self.visitor.fold_new_expr(n)
        } else {
            n
        }
    }
    fn fold_seq_expr(&mut self, n: SeqExpr) -> SeqExpr {
        if self.enabled {
            self.visitor.fold_seq_expr(n)
        } else {
            n
        }
    }
    fn fold_arrow_expr(&mut self, n: ArrowExpr) -> ArrowExpr {
        if self.enabled {
            self.visitor.fold_arrow_expr(n)
        } else {
            n
        }
    }
    fn fold_yield_expr(&mut self, n: YieldExpr) -> YieldExpr {
        if self.enabled {
            self.visitor.fold_yield_expr(n)
        } else {
            n
        }
    }
    fn fold_meta_prop_expr(&mut self, n: MetaPropExpr) -> MetaPropExpr {
        if self.enabled {
            self.visitor.fold_meta_prop_expr(n)
        } else {
            n
        }
    }
    fn fold_await_expr(&mut self, n: AwaitExpr) -> AwaitExpr {
        if self.enabled {
            self.visitor.fold_await_expr(n)
        } else {
            n
        }
    }
    fn fold_tpl(&mut self, n: Tpl) -> Tpl {
        if self.enabled {
            self.visitor.fold_tpl(n)
        } else {
            n
        }
    }
    fn fold_tagged_tpl(&mut self, n: TaggedTpl) -> TaggedTpl {
        if self.enabled {
            self.visitor.fold_tagged_tpl(n)
        } else {
            n
        }
    }
    fn fold_tpl_element(&mut self, n: TplElement) -> TplElement {
        if self.enabled {
            self.visitor.fold_tpl_element(n)
        } else {
            n
        }
    }
    fn fold_paren_expr(&mut self, n: ParenExpr) -> ParenExpr {
        if self.enabled {
            self.visitor.fold_paren_expr(n)
        } else {
            n
        }
    }
    fn fold_expr_or_super(&mut self, n: ExprOrSuper) -> ExprOrSuper {
        if self.enabled {
            self.visitor.fold_expr_or_super(n)
        } else {
            n
        }
    }
    fn fold_super(&mut self, n: Super) -> Super {
        if self.enabled {
            self.visitor.fold_super(n)
        } else {
            n
        }
    }
    fn fold_expr_or_spread(&mut self, n: ExprOrSpread) -> ExprOrSpread {
        if self.enabled {
            self.visitor.fold_expr_or_spread(n)
        } else {
            n
        }
    }
    fn fold_block_stmt_or_expr(&mut self, n: BlockStmtOrExpr) -> BlockStmtOrExpr {
        if self.enabled {
            self.visitor.fold_block_stmt_or_expr(n)
        } else {
            n
        }
    }
    fn fold_pat_or_expr(&mut self, n: PatOrExpr) -> PatOrExpr {
        if self.enabled {
            self.visitor.fold_pat_or_expr(n)
        } else {
            n
        }
    }
    fn fold_opt_chain_expr(&mut self, n: OptChainExpr) -> OptChainExpr {
        if self.enabled {
            self.visitor.fold_opt_chain_expr(n)
        } else {
            n
        }
    }
    fn fold_function(&mut self, n: Function) -> Function {
        if self.enabled {
            self.visitor.fold_function(n)
        } else {
            n
        }
    }
    fn fold_param(&mut self, n: Param) -> Param {
        if self.enabled {
            self.visitor.fold_param(n)
        } else {
            n
        }
    }
    fn fold_param_or_ts_param_prop(&mut self, n: ParamOrTsParamProp) -> ParamOrTsParamProp {
        if self.enabled {
            self.visitor.fold_param_or_ts_param_prop(n)
        } else {
            n
        }
    }
    fn fold_ident(&mut self, n: Ident) -> Ident {
        if self.enabled {
            self.visitor.fold_ident(n)
        } else {
            n
        }
    }
    fn fold_private_name(&mut self, n: PrivateName) -> PrivateName {
        if self.enabled {
            self.visitor.fold_private_name(n)
        } else {
            n
        }
    }
    fn fold_jsx_object(&mut self, n: JSXObject) -> JSXObject {
        if self.enabled {
            self.visitor.fold_jsx_object(n)
        } else {
            n
        }
    }
    fn fold_jsx_member_expr(&mut self, n: JSXMemberExpr) -> JSXMemberExpr {
        if self.enabled {
            self.visitor.fold_jsx_member_expr(n)
        } else {
            n
        }
    }
    fn fold_jsx_namespaced_name(&mut self, n: JSXNamespacedName) -> JSXNamespacedName {
        if self.enabled {
            self.visitor.fold_jsx_namespaced_name(n)
        } else {
            n
        }
    }
    fn fold_jsx_empty_expr(&mut self, n: JSXEmptyExpr) -> JSXEmptyExpr {
        if self.enabled {
            self.visitor.fold_jsx_empty_expr(n)
        } else {
            n
        }
    }
    fn fold_jsx_expr_container(&mut self, n: JSXExprContainer) -> JSXExprContainer {
        if self.enabled {
            self.visitor.fold_jsx_expr_container(n)
        } else {
            n
        }
    }
    fn fold_jsx_expr(&mut self, n: JSXExpr) -> JSXExpr {
        if self.enabled {
            self.visitor.fold_jsx_expr(n)
        } else {
            n
        }
    }
    fn fold_jsx_spread_child(&mut self, n: JSXSpreadChild) -> JSXSpreadChild {
        if self.enabled {
            self.visitor.fold_jsx_spread_child(n)
        } else {
            n
        }
    }
    fn fold_jsx_element_name(&mut self, n: JSXElementName) -> JSXElementName {
        if self.enabled {
            self.visitor.fold_jsx_element_name(n)
        } else {
            n
        }
    }
    fn fold_jsx_opening_element(&mut self, n: JSXOpeningElement) -> JSXOpeningElement {
        if self.enabled {
            self.visitor.fold_jsx_opening_element(n)
        } else {
            n
        }
    }
    fn fold_jsx_attr_or_spread(&mut self, n: JSXAttrOrSpread) -> JSXAttrOrSpread {
        if self.enabled {
            self.visitor.fold_jsx_attr_or_spread(n)
        } else {
            n
        }
    }
    fn fold_jsx_closing_element(&mut self, n: JSXClosingElement) -> JSXClosingElement {
        if self.enabled {
            self.visitor.fold_jsx_closing_element(n)
        } else {
            n
        }
    }
    fn fold_jsx_attr(&mut self, n: JSXAttr) -> JSXAttr {
        if self.enabled {
            self.visitor.fold_jsx_attr(n)
        } else {
            n
        }
    }
    fn fold_jsx_attr_name(&mut self, n: JSXAttrName) -> JSXAttrName {
        if self.enabled {
            self.visitor.fold_jsx_attr_name(n)
        } else {
            n
        }
    }
    fn fold_jsx_attr_value(&mut self, n: JSXAttrValue) -> JSXAttrValue {
        if self.enabled {
            self.visitor.fold_jsx_attr_value(n)
        } else {
            n
        }
    }
    fn fold_jsx_text(&mut self, n: JSXText) -> JSXText {
        if self.enabled {
            self.visitor.fold_jsx_text(n)
        } else {
            n
        }
    }
    fn fold_jsx_element(&mut self, n: JSXElement) -> JSXElement {
        if self.enabled {
            self.visitor.fold_jsx_element(n)
        } else {
            n
        }
    }
    fn fold_jsx_element_child(&mut self, n: JSXElementChild) -> JSXElementChild {
        if self.enabled {
            self.visitor.fold_jsx_element_child(n)
        } else {
            n
        }
    }
    fn fold_jsx_fragment(&mut self, n: JSXFragment) -> JSXFragment {
        if self.enabled {
            self.visitor.fold_jsx_fragment(n)
        } else {
            n
        }
    }
    fn fold_jsx_opening_fragment(&mut self, n: JSXOpeningFragment) -> JSXOpeningFragment {
        if self.enabled {
            self.visitor.fold_jsx_opening_fragment(n)
        } else {
            n
        }
    }
    fn fold_jsx_closing_fragment(&mut self, n: JSXClosingFragment) -> JSXClosingFragment {
        if self.enabled {
            self.visitor.fold_jsx_closing_fragment(n)
        } else {
            n
        }
    }
    fn fold_invalid(&mut self, n: Invalid) -> Invalid {
        if self.enabled {
            self.visitor.fold_invalid(n)
        } else {
            n
        }
    }
    fn fold_lit(&mut self, n: Lit) -> Lit {
        if self.enabled {
            self.visitor.fold_lit(n)
        } else {
            n
        }
    }
    fn fold_big_int(&mut self, n: BigInt) -> BigInt {
        if self.enabled {
            self.visitor.fold_big_int(n)
        } else {
            n
        }
    }
    fn fold_str(&mut self, n: Str) -> Str {
        if self.enabled {
            self.visitor.fold_str(n)
        } else {
            n
        }
    }
    fn fold_bool(&mut self, n: Bool) -> Bool {
        if self.enabled {
            self.visitor.fold_bool(n)
        } else {
            n
        }
    }
    fn fold_null(&mut self, n: Null) -> Null {
        if self.enabled {
            self.visitor.fold_null(n)
        } else {
            n
        }
    }
    fn fold_regex(&mut self, n: Regex) -> Regex {
        if self.enabled {
            self.visitor.fold_regex(n)
        } else {
            n
        }
    }
    fn fold_number(&mut self, n: Number) -> Number {
        if self.enabled {
            self.visitor.fold_number(n)
        } else {
            n
        }
    }
    fn fold_program(&mut self, n: Program) -> Program {
        if self.enabled {
            self.visitor.fold_program(n)
        } else {
            n
        }
    }
    fn fold_module(&mut self, n: Module) -> Module {
        if self.enabled {
            self.visitor.fold_module(n)
        } else {
            n
        }
    }
    fn fold_script(&mut self, n: Script) -> Script {
        if self.enabled {
            self.visitor.fold_script(n)
        } else {
            n
        }
    }
    fn fold_module_item(&mut self, n: ModuleItem) -> ModuleItem {
        if self.enabled {
            self.visitor.fold_module_item(n)
        } else {
            n
        }
    }
    fn fold_module_decl(&mut self, n: ModuleDecl) -> ModuleDecl {
        if self.enabled {
            self.visitor.fold_module_decl(n)
        } else {
            n
        }
    }
    fn fold_export_default_expr(&mut self, n: ExportDefaultExpr) -> ExportDefaultExpr {
        if self.enabled {
            self.visitor.fold_export_default_expr(n)
        } else {
            n
        }
    }
    fn fold_export_decl(&mut self, n: ExportDecl) -> ExportDecl {
        if self.enabled {
            self.visitor.fold_export_decl(n)
        } else {
            n
        }
    }
    fn fold_import_decl(&mut self, n: ImportDecl) -> ImportDecl {
        if self.enabled {
            self.visitor.fold_import_decl(n)
        } else {
            n
        }
    }
    fn fold_export_all(&mut self, n: ExportAll) -> ExportAll {
        if self.enabled {
            self.visitor.fold_export_all(n)
        } else {
            n
        }
    }
    fn fold_named_export(&mut self, n: NamedExport) -> NamedExport {
        if self.enabled {
            self.visitor.fold_named_export(n)
        } else {
            n
        }
    }
    fn fold_export_default_decl(&mut self, n: ExportDefaultDecl) -> ExportDefaultDecl {
        if self.enabled {
            self.visitor.fold_export_default_decl(n)
        } else {
            n
        }
    }
    fn fold_default_decl(&mut self, n: DefaultDecl) -> DefaultDecl {
        if self.enabled {
            self.visitor.fold_default_decl(n)
        } else {
            n
        }
    }
    fn fold_import_specifier(&mut self, n: ImportSpecifier) -> ImportSpecifier {
        if self.enabled {
            self.visitor.fold_import_specifier(n)
        } else {
            n
        }
    }
    fn fold_import_default_specifier(
        &mut self,
        n: ImportDefaultSpecifier,
    ) -> ImportDefaultSpecifier {
        if self.enabled {
            self.visitor.fold_import_default_specifier(n)
        } else {
            n
        }
    }
    fn fold_import_star_as_specifier(&mut self, n: ImportStarAsSpecifier) -> ImportStarAsSpecifier {
        if self.enabled {
            self.visitor.fold_import_star_as_specifier(n)
        } else {
            n
        }
    }
    fn fold_import_named_specifier(&mut self, n: ImportNamedSpecifier) -> ImportNamedSpecifier {
        if self.enabled {
            self.visitor.fold_import_named_specifier(n)
        } else {
            n
        }
    }
    fn fold_export_specifier(&mut self, n: ExportSpecifier) -> ExportSpecifier {
        if self.enabled {
            self.visitor.fold_export_specifier(n)
        } else {
            n
        }
    }
    fn fold_export_namespace_specifier(
        &mut self,
        n: ExportNamespaceSpecifier,
    ) -> ExportNamespaceSpecifier {
        if self.enabled {
            self.visitor.fold_export_namespace_specifier(n)
        } else {
            n
        }
    }
    fn fold_export_default_specifier(
        &mut self,
        n: ExportDefaultSpecifier,
    ) -> ExportDefaultSpecifier {
        if self.enabled {
            self.visitor.fold_export_default_specifier(n)
        } else {
            n
        }
    }
    fn fold_export_named_specifier(&mut self, n: ExportNamedSpecifier) -> ExportNamedSpecifier {
        if self.enabled {
            self.visitor.fold_export_named_specifier(n)
        } else {
            n
        }
    }
    fn fold_binary_op(&mut self, n: BinaryOp) -> BinaryOp {
        if self.enabled {
            self.visitor.fold_binary_op(n)
        } else {
            n
        }
    }
    fn fold_assign_op(&mut self, n: AssignOp) -> AssignOp {
        if self.enabled {
            self.visitor.fold_assign_op(n)
        } else {
            n
        }
    }
    fn fold_update_op(&mut self, n: UpdateOp) -> UpdateOp {
        if self.enabled {
            self.visitor.fold_update_op(n)
        } else {
            n
        }
    }
    fn fold_unary_op(&mut self, n: UnaryOp) -> UnaryOp {
        if self.enabled {
            self.visitor.fold_unary_op(n)
        } else {
            n
        }
    }
    fn fold_pat(&mut self, n: Pat) -> Pat {
        if self.enabled {
            self.visitor.fold_pat(n)
        } else {
            n
        }
    }
    fn fold_array_pat(&mut self, n: ArrayPat) -> ArrayPat {
        if self.enabled {
            self.visitor.fold_array_pat(n)
        } else {
            n
        }
    }
    fn fold_object_pat(&mut self, n: ObjectPat) -> ObjectPat {
        if self.enabled {
            self.visitor.fold_object_pat(n)
        } else {
            n
        }
    }
    fn fold_assign_pat(&mut self, n: AssignPat) -> AssignPat {
        if self.enabled {
            self.visitor.fold_assign_pat(n)
        } else {
            n
        }
    }
    fn fold_rest_pat(&mut self, n: RestPat) -> RestPat {
        if self.enabled {
            self.visitor.fold_rest_pat(n)
        } else {
            n
        }
    }
    fn fold_object_pat_prop(&mut self, n: ObjectPatProp) -> ObjectPatProp {
        if self.enabled {
            self.visitor.fold_object_pat_prop(n)
        } else {
            n
        }
    }
    fn fold_key_value_pat_prop(&mut self, n: KeyValuePatProp) -> KeyValuePatProp {
        if self.enabled {
            self.visitor.fold_key_value_pat_prop(n)
        } else {
            n
        }
    }
    fn fold_assign_pat_prop(&mut self, n: AssignPatProp) -> AssignPatProp {
        if self.enabled {
            self.visitor.fold_assign_pat_prop(n)
        } else {
            n
        }
    }
    fn fold_prop(&mut self, n: Prop) -> Prop {
        if self.enabled {
            self.visitor.fold_prop(n)
        } else {
            n
        }
    }
    fn fold_key_value_prop(&mut self, n: KeyValueProp) -> KeyValueProp {
        if self.enabled {
            self.visitor.fold_key_value_prop(n)
        } else {
            n
        }
    }
    fn fold_assign_prop(&mut self, n: AssignProp) -> AssignProp {
        if self.enabled {
            self.visitor.fold_assign_prop(n)
        } else {
            n
        }
    }
    fn fold_getter_prop(&mut self, n: GetterProp) -> GetterProp {
        if self.enabled {
            self.visitor.fold_getter_prop(n)
        } else {
            n
        }
    }
    fn fold_setter_prop(&mut self, n: SetterProp) -> SetterProp {
        if self.enabled {
            self.visitor.fold_setter_prop(n)
        } else {
            n
        }
    }
    fn fold_method_prop(&mut self, n: MethodProp) -> MethodProp {
        if self.enabled {
            self.visitor.fold_method_prop(n)
        } else {
            n
        }
    }
    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        if self.enabled {
            self.visitor.fold_prop_name(n)
        } else {
            n
        }
    }
    fn fold_computed_prop_name(&mut self, n: ComputedPropName) -> ComputedPropName {
        if self.enabled {
            self.visitor.fold_computed_prop_name(n)
        } else {
            n
        }
    }
    fn fold_block_stmt(&mut self, n: BlockStmt) -> BlockStmt {
        if self.enabled {
            self.visitor.fold_block_stmt(n)
        } else {
            n
        }
    }
    fn fold_stmt(&mut self, n: Stmt) -> Stmt {
        if self.enabled {
            self.visitor.fold_stmt(n)
        } else {
            n
        }
    }
    fn fold_expr_stmt(&mut self, n: ExprStmt) -> ExprStmt {
        if self.enabled {
            self.visitor.fold_expr_stmt(n)
        } else {
            n
        }
    }
    fn fold_empty_stmt(&mut self, n: EmptyStmt) -> EmptyStmt {
        if self.enabled {
            self.visitor.fold_empty_stmt(n)
        } else {
            n
        }
    }
    fn fold_debugger_stmt(&mut self, n: DebuggerStmt) -> DebuggerStmt {
        if self.enabled {
            self.visitor.fold_debugger_stmt(n)
        } else {
            n
        }
    }
    fn fold_with_stmt(&mut self, n: WithStmt) -> WithStmt {
        if self.enabled {
            self.visitor.fold_with_stmt(n)
        } else {
            n
        }
    }
    fn fold_return_stmt(&mut self, n: ReturnStmt) -> ReturnStmt {
        if self.enabled {
            self.visitor.fold_return_stmt(n)
        } else {
            n
        }
    }
    fn fold_labeled_stmt(&mut self, n: LabeledStmt) -> LabeledStmt {
        if self.enabled {
            self.visitor.fold_labeled_stmt(n)
        } else {
            n
        }
    }
    fn fold_break_stmt(&mut self, n: BreakStmt) -> BreakStmt {
        if self.enabled {
            self.visitor.fold_break_stmt(n)
        } else {
            n
        }
    }
    fn fold_continue_stmt(&mut self, n: ContinueStmt) -> ContinueStmt {
        if self.enabled {
            self.visitor.fold_continue_stmt(n)
        } else {
            n
        }
    }
    fn fold_if_stmt(&mut self, n: IfStmt) -> IfStmt {
        if self.enabled {
            self.visitor.fold_if_stmt(n)
        } else {
            n
        }
    }
    fn fold_switch_stmt(&mut self, n: SwitchStmt) -> SwitchStmt {
        if self.enabled {
            self.visitor.fold_switch_stmt(n)
        } else {
            n
        }
    }
    fn fold_throw_stmt(&mut self, n: ThrowStmt) -> ThrowStmt {
        if self.enabled {
            self.visitor.fold_throw_stmt(n)
        } else {
            n
        }
    }
    fn fold_try_stmt(&mut self, n: TryStmt) -> TryStmt {
        if self.enabled {
            self.visitor.fold_try_stmt(n)
        } else {
            n
        }
    }
    fn fold_while_stmt(&mut self, n: WhileStmt) -> WhileStmt {
        if self.enabled {
            self.visitor.fold_while_stmt(n)
        } else {
            n
        }
    }
    fn fold_do_while_stmt(&mut self, n: DoWhileStmt) -> DoWhileStmt {
        if self.enabled {
            self.visitor.fold_do_while_stmt(n)
        } else {
            n
        }
    }
    fn fold_for_stmt(&mut self, n: ForStmt) -> ForStmt {
        if self.enabled {
            self.visitor.fold_for_stmt(n)
        } else {
            n
        }
    }
    fn fold_for_in_stmt(&mut self, n: ForInStmt) -> ForInStmt {
        if self.enabled {
            self.visitor.fold_for_in_stmt(n)
        } else {
            n
        }
    }
    fn fold_for_of_stmt(&mut self, n: ForOfStmt) -> ForOfStmt {
        if self.enabled {
            self.visitor.fold_for_of_stmt(n)
        } else {
            n
        }
    }
    fn fold_switch_case(&mut self, n: SwitchCase) -> SwitchCase {
        if self.enabled {
            self.visitor.fold_switch_case(n)
        } else {
            n
        }
    }
    fn fold_catch_clause(&mut self, n: CatchClause) -> CatchClause {
        if self.enabled {
            self.visitor.fold_catch_clause(n)
        } else {
            n
        }
    }
    fn fold_var_decl_or_pat(&mut self, n: VarDeclOrPat) -> VarDeclOrPat {
        if self.enabled {
            self.visitor.fold_var_decl_or_pat(n)
        } else {
            n
        }
    }
    fn fold_var_decl_or_expr(&mut self, n: VarDeclOrExpr) -> VarDeclOrExpr {
        if self.enabled {
            self.visitor.fold_var_decl_or_expr(n)
        } else {
            n
        }
    }
    fn fold_ts_type_ann(&mut self, n: TsTypeAnn) -> TsTypeAnn {
        if self.enabled {
            self.visitor.fold_ts_type_ann(n)
        } else {
            n
        }
    }
    fn fold_ts_type_param_decl(&mut self, n: TsTypeParamDecl) -> TsTypeParamDecl {
        if self.enabled {
            self.visitor.fold_ts_type_param_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_type_param(&mut self, n: TsTypeParam) -> TsTypeParam {
        if self.enabled {
            self.visitor.fold_ts_type_param(n)
        } else {
            n
        }
    }
    fn fold_ts_type_param_instantiation(
        &mut self,
        n: TsTypeParamInstantiation,
    ) -> TsTypeParamInstantiation {
        if self.enabled {
            self.visitor.fold_ts_type_param_instantiation(n)
        } else {
            n
        }
    }
    fn fold_ts_type_cast_expr(&mut self, n: TsTypeCastExpr) -> TsTypeCastExpr {
        if self.enabled {
            self.visitor.fold_ts_type_cast_expr(n)
        } else {
            n
        }
    }
    fn fold_ts_param_prop(&mut self, n: TsParamProp) -> TsParamProp {
        if self.enabled {
            self.visitor.fold_ts_param_prop(n)
        } else {
            n
        }
    }
    fn fold_ts_param_prop_param(&mut self, n: TsParamPropParam) -> TsParamPropParam {
        if self.enabled {
            self.visitor.fold_ts_param_prop_param(n)
        } else {
            n
        }
    }
    fn fold_ts_qualified_name(&mut self, n: TsQualifiedName) -> TsQualifiedName {
        if self.enabled {
            self.visitor.fold_ts_qualified_name(n)
        } else {
            n
        }
    }
    fn fold_ts_entity_name(&mut self, n: TsEntityName) -> TsEntityName {
        if self.enabled {
            self.visitor.fold_ts_entity_name(n)
        } else {
            n
        }
    }
    fn fold_ts_signature_decl(&mut self, n: TsSignatureDecl) -> TsSignatureDecl {
        if self.enabled {
            self.visitor.fold_ts_signature_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_type_element(&mut self, n: TsTypeElement) -> TsTypeElement {
        if self.enabled {
            self.visitor.fold_ts_type_element(n)
        } else {
            n
        }
    }
    fn fold_ts_call_signature_decl(&mut self, n: TsCallSignatureDecl) -> TsCallSignatureDecl {
        if self.enabled {
            self.visitor.fold_ts_call_signature_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_construct_signature_decl(
        &mut self,
        n: TsConstructSignatureDecl,
    ) -> TsConstructSignatureDecl {
        if self.enabled {
            self.visitor.fold_ts_construct_signature_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_property_signature(&mut self, n: TsPropertySignature) -> TsPropertySignature {
        if self.enabled {
            self.visitor.fold_ts_property_signature(n)
        } else {
            n
        }
    }
    fn fold_ts_method_signature(&mut self, n: TsMethodSignature) -> TsMethodSignature {
        if self.enabled {
            self.visitor.fold_ts_method_signature(n)
        } else {
            n
        }
    }
    fn fold_ts_index_signature(&mut self, n: TsIndexSignature) -> TsIndexSignature {
        if self.enabled {
            self.visitor.fold_ts_index_signature(n)
        } else {
            n
        }
    }
    fn fold_ts_type(&mut self, n: TsType) -> TsType {
        if self.enabled {
            self.visitor.fold_ts_type(n)
        } else {
            n
        }
    }
    fn fold_ts_fn_or_constructor_type(
        &mut self,
        n: TsFnOrConstructorType,
    ) -> TsFnOrConstructorType {
        if self.enabled {
            self.visitor.fold_ts_fn_or_constructor_type(n)
        } else {
            n
        }
    }
    fn fold_ts_keyword_type(&mut self, n: TsKeywordType) -> TsKeywordType {
        if self.enabled {
            self.visitor.fold_ts_keyword_type(n)
        } else {
            n
        }
    }
    fn fold_ts_keyword_type_kind(&mut self, n: TsKeywordTypeKind) -> TsKeywordTypeKind {
        if self.enabled {
            self.visitor.fold_ts_keyword_type_kind(n)
        } else {
            n
        }
    }
    fn fold_ts_this_type(&mut self, n: TsThisType) -> TsThisType {
        if self.enabled {
            self.visitor.fold_ts_this_type(n)
        } else {
            n
        }
    }
    fn fold_ts_fn_param(&mut self, n: TsFnParam) -> TsFnParam {
        if self.enabled {
            self.visitor.fold_ts_fn_param(n)
        } else {
            n
        }
    }
    fn fold_ts_fn_type(&mut self, n: TsFnType) -> TsFnType {
        if self.enabled {
            self.visitor.fold_ts_fn_type(n)
        } else {
            n
        }
    }
    fn fold_ts_constructor_type(&mut self, n: TsConstructorType) -> TsConstructorType {
        if self.enabled {
            self.visitor.fold_ts_constructor_type(n)
        } else {
            n
        }
    }
    fn fold_ts_type_ref(&mut self, n: TsTypeRef) -> TsTypeRef {
        if self.enabled {
            self.visitor.fold_ts_type_ref(n)
        } else {
            n
        }
    }
    fn fold_ts_type_predicate(&mut self, n: TsTypePredicate) -> TsTypePredicate {
        if self.enabled {
            self.visitor.fold_ts_type_predicate(n)
        } else {
            n
        }
    }
    fn fold_ts_this_type_or_ident(&mut self, n: TsThisTypeOrIdent) -> TsThisTypeOrIdent {
        if self.enabled {
            self.visitor.fold_ts_this_type_or_ident(n)
        } else {
            n
        }
    }
    fn fold_ts_type_query(&mut self, n: TsTypeQuery) -> TsTypeQuery {
        if self.enabled {
            self.visitor.fold_ts_type_query(n)
        } else {
            n
        }
    }
    fn fold_ts_type_query_expr(&mut self, n: TsTypeQueryExpr) -> TsTypeQueryExpr {
        if self.enabled {
            self.visitor.fold_ts_type_query_expr(n)
        } else {
            n
        }
    }
    fn fold_ts_import_type(&mut self, n: TsImportType) -> TsImportType {
        if self.enabled {
            self.visitor.fold_ts_import_type(n)
        } else {
            n
        }
    }
    fn fold_ts_type_lit(&mut self, n: TsTypeLit) -> TsTypeLit {
        if self.enabled {
            self.visitor.fold_ts_type_lit(n)
        } else {
            n
        }
    }
    fn fold_ts_array_type(&mut self, n: TsArrayType) -> TsArrayType {
        if self.enabled {
            self.visitor.fold_ts_array_type(n)
        } else {
            n
        }
    }
    fn fold_ts_tuple_type(&mut self, n: TsTupleType) -> TsTupleType {
        if self.enabled {
            self.visitor.fold_ts_tuple_type(n)
        } else {
            n
        }
    }
    fn fold_ts_tuple_element(&mut self, n: TsTupleElement) -> TsTupleElement {
        if self.enabled {
            self.visitor.fold_ts_tuple_element(n)
        } else {
            n
        }
    }
    fn fold_ts_optional_type(&mut self, n: TsOptionalType) -> TsOptionalType {
        if self.enabled {
            self.visitor.fold_ts_optional_type(n)
        } else {
            n
        }
    }
    fn fold_ts_rest_type(&mut self, n: TsRestType) -> TsRestType {
        if self.enabled {
            self.visitor.fold_ts_rest_type(n)
        } else {
            n
        }
    }
    fn fold_ts_union_or_intersection_type(
        &mut self,
        n: TsUnionOrIntersectionType,
    ) -> TsUnionOrIntersectionType {
        if self.enabled {
            self.visitor.fold_ts_union_or_intersection_type(n)
        } else {
            n
        }
    }
    fn fold_ts_union_type(&mut self, n: TsUnionType) -> TsUnionType {
        if self.enabled {
            self.visitor.fold_ts_union_type(n)
        } else {
            n
        }
    }
    fn fold_ts_intersection_type(&mut self, n: TsIntersectionType) -> TsIntersectionType {
        if self.enabled {
            self.visitor.fold_ts_intersection_type(n)
        } else {
            n
        }
    }
    fn fold_ts_conditional_type(&mut self, n: TsConditionalType) -> TsConditionalType {
        if self.enabled {
            self.visitor.fold_ts_conditional_type(n)
        } else {
            n
        }
    }
    fn fold_ts_infer_type(&mut self, n: TsInferType) -> TsInferType {
        if self.enabled {
            self.visitor.fold_ts_infer_type(n)
        } else {
            n
        }
    }
    fn fold_ts_parenthesized_type(&mut self, n: TsParenthesizedType) -> TsParenthesizedType {
        if self.enabled {
            self.visitor.fold_ts_parenthesized_type(n)
        } else {
            n
        }
    }
    fn fold_ts_type_operator(&mut self, n: TsTypeOperator) -> TsTypeOperator {
        if self.enabled {
            self.visitor.fold_ts_type_operator(n)
        } else {
            n
        }
    }
    fn fold_ts_type_operator_op(&mut self, n: TsTypeOperatorOp) -> TsTypeOperatorOp {
        if self.enabled {
            self.visitor.fold_ts_type_operator_op(n)
        } else {
            n
        }
    }
    fn fold_ts_indexed_access_type(&mut self, n: TsIndexedAccessType) -> TsIndexedAccessType {
        if self.enabled {
            self.visitor.fold_ts_indexed_access_type(n)
        } else {
            n
        }
    }
    fn fold_true_plus_minus(&mut self, n: TruePlusMinus) -> TruePlusMinus {
        if self.enabled {
            self.visitor.fold_true_plus_minus(n)
        } else {
            n
        }
    }
    fn fold_ts_mapped_type(&mut self, n: TsMappedType) -> TsMappedType {
        if self.enabled {
            self.visitor.fold_ts_mapped_type(n)
        } else {
            n
        }
    }
    fn fold_ts_lit_type(&mut self, n: TsLitType) -> TsLitType {
        if self.enabled {
            self.visitor.fold_ts_lit_type(n)
        } else {
            n
        }
    }
    fn fold_ts_lit(&mut self, n: TsLit) -> TsLit {
        if self.enabled {
            self.visitor.fold_ts_lit(n)
        } else {
            n
        }
    }
    fn fold_ts_interface_decl(&mut self, n: TsInterfaceDecl) -> TsInterfaceDecl {
        if self.enabled {
            self.visitor.fold_ts_interface_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_interface_body(&mut self, n: TsInterfaceBody) -> TsInterfaceBody {
        if self.enabled {
            self.visitor.fold_ts_interface_body(n)
        } else {
            n
        }
    }
    fn fold_ts_expr_with_type_args(&mut self, n: TsExprWithTypeArgs) -> TsExprWithTypeArgs {
        if self.enabled {
            self.visitor.fold_ts_expr_with_type_args(n)
        } else {
            n
        }
    }
    fn fold_ts_type_alias_decl(&mut self, n: TsTypeAliasDecl) -> TsTypeAliasDecl {
        if self.enabled {
            self.visitor.fold_ts_type_alias_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_enum_decl(&mut self, n: TsEnumDecl) -> TsEnumDecl {
        if self.enabled {
            self.visitor.fold_ts_enum_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_enum_member(&mut self, n: TsEnumMember) -> TsEnumMember {
        if self.enabled {
            self.visitor.fold_ts_enum_member(n)
        } else {
            n
        }
    }
    fn fold_ts_enum_member_id(&mut self, n: TsEnumMemberId) -> TsEnumMemberId {
        if self.enabled {
            self.visitor.fold_ts_enum_member_id(n)
        } else {
            n
        }
    }
    fn fold_ts_module_decl(&mut self, n: TsModuleDecl) -> TsModuleDecl {
        if self.enabled {
            self.visitor.fold_ts_module_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_namespace_body(&mut self, n: TsNamespaceBody) -> TsNamespaceBody {
        if self.enabled {
            self.visitor.fold_ts_namespace_body(n)
        } else {
            n
        }
    }
    fn fold_ts_module_block(&mut self, n: TsModuleBlock) -> TsModuleBlock {
        if self.enabled {
            self.visitor.fold_ts_module_block(n)
        } else {
            n
        }
    }
    fn fold_ts_namespace_decl(&mut self, n: TsNamespaceDecl) -> TsNamespaceDecl {
        if self.enabled {
            self.visitor.fold_ts_namespace_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_module_name(&mut self, n: TsModuleName) -> TsModuleName {
        if self.enabled {
            self.visitor.fold_ts_module_name(n)
        } else {
            n
        }
    }
    fn fold_ts_import_equals_decl(&mut self, n: TsImportEqualsDecl) -> TsImportEqualsDecl {
        if self.enabled {
            self.visitor.fold_ts_import_equals_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_module_ref(&mut self, n: TsModuleRef) -> TsModuleRef {
        if self.enabled {
            self.visitor.fold_ts_module_ref(n)
        } else {
            n
        }
    }
    fn fold_ts_external_module_ref(&mut self, n: TsExternalModuleRef) -> TsExternalModuleRef {
        if self.enabled {
            self.visitor.fold_ts_external_module_ref(n)
        } else {
            n
        }
    }
    fn fold_ts_export_assignment(&mut self, n: TsExportAssignment) -> TsExportAssignment {
        if self.enabled {
            self.visitor.fold_ts_export_assignment(n)
        } else {
            n
        }
    }
    fn fold_ts_namespace_export_decl(&mut self, n: TsNamespaceExportDecl) -> TsNamespaceExportDecl {
        if self.enabled {
            self.visitor.fold_ts_namespace_export_decl(n)
        } else {
            n
        }
    }
    fn fold_ts_as_expr(&mut self, n: TsAsExpr) -> TsAsExpr {
        if self.enabled {
            self.visitor.fold_ts_as_expr(n)
        } else {
            n
        }
    }
    fn fold_ts_type_assertion(&mut self, n: TsTypeAssertion) -> TsTypeAssertion {
        if self.enabled {
            self.visitor.fold_ts_type_assertion(n)
        } else {
            n
        }
    }
    fn fold_ts_non_null_expr(&mut self, n: TsNonNullExpr) -> TsNonNullExpr {
        if self.enabled {
            self.visitor.fold_ts_non_null_expr(n)
        } else {
            n
        }
    }
    fn fold_accessibility(&mut self, n: Accessibility) -> Accessibility {
        if self.enabled {
            self.visitor.fold_accessibility(n)
        } else {
            n
        }
    }
    fn fold_ts_const_assertion(&mut self, n: TsConstAssertion) -> TsConstAssertion {
        if self.enabled {
            self.visitor.fold_ts_const_assertion(n)
        } else {
            n
        }
    }
}
impl<A, B> Fold for ::swc_visit::Either<A, B>
where
    A: Fold,
    B: Fold,
{
    fn fold_class(&mut self, n: Class) -> Class {
        match self {
            swc_visit::Either::Left(v) => v.fold_class(n),
            swc_visit::Either::Right(v) => v.fold_class(n),
        }
    }
    fn fold_class_member(&mut self, n: ClassMember) -> ClassMember {
        match self {
            swc_visit::Either::Left(v) => v.fold_class_member(n),
            swc_visit::Either::Right(v) => v.fold_class_member(n),
        }
    }
    fn fold_class_prop(&mut self, n: ClassProp) -> ClassProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_class_prop(n),
            swc_visit::Either::Right(v) => v.fold_class_prop(n),
        }
    }
    fn fold_private_prop(&mut self, n: PrivateProp) -> PrivateProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_private_prop(n),
            swc_visit::Either::Right(v) => v.fold_private_prop(n),
        }
    }
    fn fold_class_method(&mut self, n: ClassMethod) -> ClassMethod {
        match self {
            swc_visit::Either::Left(v) => v.fold_class_method(n),
            swc_visit::Either::Right(v) => v.fold_class_method(n),
        }
    }
    fn fold_private_method(&mut self, n: PrivateMethod) -> PrivateMethod {
        match self {
            swc_visit::Either::Left(v) => v.fold_private_method(n),
            swc_visit::Either::Right(v) => v.fold_private_method(n),
        }
    }
    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        match self {
            swc_visit::Either::Left(v) => v.fold_constructor(n),
            swc_visit::Either::Right(v) => v.fold_constructor(n),
        }
    }
    fn fold_decorator(&mut self, n: Decorator) -> Decorator {
        match self {
            swc_visit::Either::Left(v) => v.fold_decorator(n),
            swc_visit::Either::Right(v) => v.fold_decorator(n),
        }
    }
    fn fold_method_kind(&mut self, n: MethodKind) -> MethodKind {
        match self {
            swc_visit::Either::Left(v) => v.fold_method_kind(n),
            swc_visit::Either::Right(v) => v.fold_method_kind(n),
        }
    }
    fn fold_decl(&mut self, n: Decl) -> Decl {
        match self {
            swc_visit::Either::Left(v) => v.fold_decl(n),
            swc_visit::Either::Right(v) => v.fold_decl(n),
        }
    }
    fn fold_fn_decl(&mut self, n: FnDecl) -> FnDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_fn_decl(n),
            swc_visit::Either::Right(v) => v.fold_fn_decl(n),
        }
    }
    fn fold_class_decl(&mut self, n: ClassDecl) -> ClassDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_class_decl(n),
            swc_visit::Either::Right(v) => v.fold_class_decl(n),
        }
    }
    fn fold_var_decl(&mut self, n: VarDecl) -> VarDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_var_decl(n),
            swc_visit::Either::Right(v) => v.fold_var_decl(n),
        }
    }
    fn fold_var_decl_kind(&mut self, n: VarDeclKind) -> VarDeclKind {
        match self {
            swc_visit::Either::Left(v) => v.fold_var_decl_kind(n),
            swc_visit::Either::Right(v) => v.fold_var_decl_kind(n),
        }
    }
    fn fold_var_declarator(&mut self, n: VarDeclarator) -> VarDeclarator {
        match self {
            swc_visit::Either::Left(v) => v.fold_var_declarator(n),
            swc_visit::Either::Right(v) => v.fold_var_declarator(n),
        }
    }
    fn fold_expr(&mut self, n: Expr) -> Expr {
        match self {
            swc_visit::Either::Left(v) => v.fold_expr(n),
            swc_visit::Either::Right(v) => v.fold_expr(n),
        }
    }
    fn fold_this_expr(&mut self, n: ThisExpr) -> ThisExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_this_expr(n),
            swc_visit::Either::Right(v) => v.fold_this_expr(n),
        }
    }
    fn fold_array_lit(&mut self, n: ArrayLit) -> ArrayLit {
        match self {
            swc_visit::Either::Left(v) => v.fold_array_lit(n),
            swc_visit::Either::Right(v) => v.fold_array_lit(n),
        }
    }
    fn fold_object_lit(&mut self, n: ObjectLit) -> ObjectLit {
        match self {
            swc_visit::Either::Left(v) => v.fold_object_lit(n),
            swc_visit::Either::Right(v) => v.fold_object_lit(n),
        }
    }
    fn fold_prop_or_spread(&mut self, n: PropOrSpread) -> PropOrSpread {
        match self {
            swc_visit::Either::Left(v) => v.fold_prop_or_spread(n),
            swc_visit::Either::Right(v) => v.fold_prop_or_spread(n),
        }
    }
    fn fold_spread_element(&mut self, n: SpreadElement) -> SpreadElement {
        match self {
            swc_visit::Either::Left(v) => v.fold_spread_element(n),
            swc_visit::Either::Right(v) => v.fold_spread_element(n),
        }
    }
    fn fold_unary_expr(&mut self, n: UnaryExpr) -> UnaryExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_unary_expr(n),
            swc_visit::Either::Right(v) => v.fold_unary_expr(n),
        }
    }
    fn fold_update_expr(&mut self, n: UpdateExpr) -> UpdateExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_update_expr(n),
            swc_visit::Either::Right(v) => v.fold_update_expr(n),
        }
    }
    fn fold_bin_expr(&mut self, n: BinExpr) -> BinExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_bin_expr(n),
            swc_visit::Either::Right(v) => v.fold_bin_expr(n),
        }
    }
    fn fold_fn_expr(&mut self, n: FnExpr) -> FnExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_fn_expr(n),
            swc_visit::Either::Right(v) => v.fold_fn_expr(n),
        }
    }
    fn fold_class_expr(&mut self, n: ClassExpr) -> ClassExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_class_expr(n),
            swc_visit::Either::Right(v) => v.fold_class_expr(n),
        }
    }
    fn fold_assign_expr(&mut self, n: AssignExpr) -> AssignExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_assign_expr(n),
            swc_visit::Either::Right(v) => v.fold_assign_expr(n),
        }
    }
    fn fold_member_expr(&mut self, n: MemberExpr) -> MemberExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_member_expr(n),
            swc_visit::Either::Right(v) => v.fold_member_expr(n),
        }
    }
    fn fold_cond_expr(&mut self, n: CondExpr) -> CondExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_cond_expr(n),
            swc_visit::Either::Right(v) => v.fold_cond_expr(n),
        }
    }
    fn fold_call_expr(&mut self, n: CallExpr) -> CallExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_call_expr(n),
            swc_visit::Either::Right(v) => v.fold_call_expr(n),
        }
    }
    fn fold_new_expr(&mut self, n: NewExpr) -> NewExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_new_expr(n),
            swc_visit::Either::Right(v) => v.fold_new_expr(n),
        }
    }
    fn fold_seq_expr(&mut self, n: SeqExpr) -> SeqExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_seq_expr(n),
            swc_visit::Either::Right(v) => v.fold_seq_expr(n),
        }
    }
    fn fold_arrow_expr(&mut self, n: ArrowExpr) -> ArrowExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_arrow_expr(n),
            swc_visit::Either::Right(v) => v.fold_arrow_expr(n),
        }
    }
    fn fold_yield_expr(&mut self, n: YieldExpr) -> YieldExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_yield_expr(n),
            swc_visit::Either::Right(v) => v.fold_yield_expr(n),
        }
    }
    fn fold_meta_prop_expr(&mut self, n: MetaPropExpr) -> MetaPropExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_meta_prop_expr(n),
            swc_visit::Either::Right(v) => v.fold_meta_prop_expr(n),
        }
    }
    fn fold_await_expr(&mut self, n: AwaitExpr) -> AwaitExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_await_expr(n),
            swc_visit::Either::Right(v) => v.fold_await_expr(n),
        }
    }
    fn fold_tpl(&mut self, n: Tpl) -> Tpl {
        match self {
            swc_visit::Either::Left(v) => v.fold_tpl(n),
            swc_visit::Either::Right(v) => v.fold_tpl(n),
        }
    }
    fn fold_tagged_tpl(&mut self, n: TaggedTpl) -> TaggedTpl {
        match self {
            swc_visit::Either::Left(v) => v.fold_tagged_tpl(n),
            swc_visit::Either::Right(v) => v.fold_tagged_tpl(n),
        }
    }
    fn fold_tpl_element(&mut self, n: TplElement) -> TplElement {
        match self {
            swc_visit::Either::Left(v) => v.fold_tpl_element(n),
            swc_visit::Either::Right(v) => v.fold_tpl_element(n),
        }
    }
    fn fold_paren_expr(&mut self, n: ParenExpr) -> ParenExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_paren_expr(n),
            swc_visit::Either::Right(v) => v.fold_paren_expr(n),
        }
    }
    fn fold_expr_or_super(&mut self, n: ExprOrSuper) -> ExprOrSuper {
        match self {
            swc_visit::Either::Left(v) => v.fold_expr_or_super(n),
            swc_visit::Either::Right(v) => v.fold_expr_or_super(n),
        }
    }
    fn fold_super(&mut self, n: Super) -> Super {
        match self {
            swc_visit::Either::Left(v) => v.fold_super(n),
            swc_visit::Either::Right(v) => v.fold_super(n),
        }
    }
    fn fold_expr_or_spread(&mut self, n: ExprOrSpread) -> ExprOrSpread {
        match self {
            swc_visit::Either::Left(v) => v.fold_expr_or_spread(n),
            swc_visit::Either::Right(v) => v.fold_expr_or_spread(n),
        }
    }
    fn fold_block_stmt_or_expr(&mut self, n: BlockStmtOrExpr) -> BlockStmtOrExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_block_stmt_or_expr(n),
            swc_visit::Either::Right(v) => v.fold_block_stmt_or_expr(n),
        }
    }
    fn fold_pat_or_expr(&mut self, n: PatOrExpr) -> PatOrExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_pat_or_expr(n),
            swc_visit::Either::Right(v) => v.fold_pat_or_expr(n),
        }
    }
    fn fold_opt_chain_expr(&mut self, n: OptChainExpr) -> OptChainExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_opt_chain_expr(n),
            swc_visit::Either::Right(v) => v.fold_opt_chain_expr(n),
        }
    }
    fn fold_function(&mut self, n: Function) -> Function {
        match self {
            swc_visit::Either::Left(v) => v.fold_function(n),
            swc_visit::Either::Right(v) => v.fold_function(n),
        }
    }
    fn fold_param(&mut self, n: Param) -> Param {
        match self {
            swc_visit::Either::Left(v) => v.fold_param(n),
            swc_visit::Either::Right(v) => v.fold_param(n),
        }
    }
    fn fold_param_or_ts_param_prop(&mut self, n: ParamOrTsParamProp) -> ParamOrTsParamProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_param_or_ts_param_prop(n),
            swc_visit::Either::Right(v) => v.fold_param_or_ts_param_prop(n),
        }
    }
    fn fold_ident(&mut self, n: Ident) -> Ident {
        match self {
            swc_visit::Either::Left(v) => v.fold_ident(n),
            swc_visit::Either::Right(v) => v.fold_ident(n),
        }
    }
    fn fold_private_name(&mut self, n: PrivateName) -> PrivateName {
        match self {
            swc_visit::Either::Left(v) => v.fold_private_name(n),
            swc_visit::Either::Right(v) => v.fold_private_name(n),
        }
    }
    fn fold_jsx_object(&mut self, n: JSXObject) -> JSXObject {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_object(n),
            swc_visit::Either::Right(v) => v.fold_jsx_object(n),
        }
    }
    fn fold_jsx_member_expr(&mut self, n: JSXMemberExpr) -> JSXMemberExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_member_expr(n),
            swc_visit::Either::Right(v) => v.fold_jsx_member_expr(n),
        }
    }
    fn fold_jsx_namespaced_name(&mut self, n: JSXNamespacedName) -> JSXNamespacedName {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_namespaced_name(n),
            swc_visit::Either::Right(v) => v.fold_jsx_namespaced_name(n),
        }
    }
    fn fold_jsx_empty_expr(&mut self, n: JSXEmptyExpr) -> JSXEmptyExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_empty_expr(n),
            swc_visit::Either::Right(v) => v.fold_jsx_empty_expr(n),
        }
    }
    fn fold_jsx_expr_container(&mut self, n: JSXExprContainer) -> JSXExprContainer {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_expr_container(n),
            swc_visit::Either::Right(v) => v.fold_jsx_expr_container(n),
        }
    }
    fn fold_jsx_expr(&mut self, n: JSXExpr) -> JSXExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_expr(n),
            swc_visit::Either::Right(v) => v.fold_jsx_expr(n),
        }
    }
    fn fold_jsx_spread_child(&mut self, n: JSXSpreadChild) -> JSXSpreadChild {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_spread_child(n),
            swc_visit::Either::Right(v) => v.fold_jsx_spread_child(n),
        }
    }
    fn fold_jsx_element_name(&mut self, n: JSXElementName) -> JSXElementName {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_element_name(n),
            swc_visit::Either::Right(v) => v.fold_jsx_element_name(n),
        }
    }
    fn fold_jsx_opening_element(&mut self, n: JSXOpeningElement) -> JSXOpeningElement {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_opening_element(n),
            swc_visit::Either::Right(v) => v.fold_jsx_opening_element(n),
        }
    }
    fn fold_jsx_attr_or_spread(&mut self, n: JSXAttrOrSpread) -> JSXAttrOrSpread {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_attr_or_spread(n),
            swc_visit::Either::Right(v) => v.fold_jsx_attr_or_spread(n),
        }
    }
    fn fold_jsx_closing_element(&mut self, n: JSXClosingElement) -> JSXClosingElement {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_closing_element(n),
            swc_visit::Either::Right(v) => v.fold_jsx_closing_element(n),
        }
    }
    fn fold_jsx_attr(&mut self, n: JSXAttr) -> JSXAttr {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_attr(n),
            swc_visit::Either::Right(v) => v.fold_jsx_attr(n),
        }
    }
    fn fold_jsx_attr_name(&mut self, n: JSXAttrName) -> JSXAttrName {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_attr_name(n),
            swc_visit::Either::Right(v) => v.fold_jsx_attr_name(n),
        }
    }
    fn fold_jsx_attr_value(&mut self, n: JSXAttrValue) -> JSXAttrValue {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_attr_value(n),
            swc_visit::Either::Right(v) => v.fold_jsx_attr_value(n),
        }
    }
    fn fold_jsx_text(&mut self, n: JSXText) -> JSXText {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_text(n),
            swc_visit::Either::Right(v) => v.fold_jsx_text(n),
        }
    }
    fn fold_jsx_element(&mut self, n: JSXElement) -> JSXElement {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_element(n),
            swc_visit::Either::Right(v) => v.fold_jsx_element(n),
        }
    }
    fn fold_jsx_element_child(&mut self, n: JSXElementChild) -> JSXElementChild {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_element_child(n),
            swc_visit::Either::Right(v) => v.fold_jsx_element_child(n),
        }
    }
    fn fold_jsx_fragment(&mut self, n: JSXFragment) -> JSXFragment {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_fragment(n),
            swc_visit::Either::Right(v) => v.fold_jsx_fragment(n),
        }
    }
    fn fold_jsx_opening_fragment(&mut self, n: JSXOpeningFragment) -> JSXOpeningFragment {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_opening_fragment(n),
            swc_visit::Either::Right(v) => v.fold_jsx_opening_fragment(n),
        }
    }
    fn fold_jsx_closing_fragment(&mut self, n: JSXClosingFragment) -> JSXClosingFragment {
        match self {
            swc_visit::Either::Left(v) => v.fold_jsx_closing_fragment(n),
            swc_visit::Either::Right(v) => v.fold_jsx_closing_fragment(n),
        }
    }
    fn fold_invalid(&mut self, n: Invalid) -> Invalid {
        match self {
            swc_visit::Either::Left(v) => v.fold_invalid(n),
            swc_visit::Either::Right(v) => v.fold_invalid(n),
        }
    }
    fn fold_lit(&mut self, n: Lit) -> Lit {
        match self {
            swc_visit::Either::Left(v) => v.fold_lit(n),
            swc_visit::Either::Right(v) => v.fold_lit(n),
        }
    }
    fn fold_big_int(&mut self, n: BigInt) -> BigInt {
        match self {
            swc_visit::Either::Left(v) => v.fold_big_int(n),
            swc_visit::Either::Right(v) => v.fold_big_int(n),
        }
    }
    fn fold_str(&mut self, n: Str) -> Str {
        match self {
            swc_visit::Either::Left(v) => v.fold_str(n),
            swc_visit::Either::Right(v) => v.fold_str(n),
        }
    }
    fn fold_bool(&mut self, n: Bool) -> Bool {
        match self {
            swc_visit::Either::Left(v) => v.fold_bool(n),
            swc_visit::Either::Right(v) => v.fold_bool(n),
        }
    }
    fn fold_null(&mut self, n: Null) -> Null {
        match self {
            swc_visit::Either::Left(v) => v.fold_null(n),
            swc_visit::Either::Right(v) => v.fold_null(n),
        }
    }
    fn fold_regex(&mut self, n: Regex) -> Regex {
        match self {
            swc_visit::Either::Left(v) => v.fold_regex(n),
            swc_visit::Either::Right(v) => v.fold_regex(n),
        }
    }
    fn fold_number(&mut self, n: Number) -> Number {
        match self {
            swc_visit::Either::Left(v) => v.fold_number(n),
            swc_visit::Either::Right(v) => v.fold_number(n),
        }
    }
    fn fold_program(&mut self, n: Program) -> Program {
        match self {
            swc_visit::Either::Left(v) => v.fold_program(n),
            swc_visit::Either::Right(v) => v.fold_program(n),
        }
    }
    fn fold_module(&mut self, n: Module) -> Module {
        match self {
            swc_visit::Either::Left(v) => v.fold_module(n),
            swc_visit::Either::Right(v) => v.fold_module(n),
        }
    }
    fn fold_script(&mut self, n: Script) -> Script {
        match self {
            swc_visit::Either::Left(v) => v.fold_script(n),
            swc_visit::Either::Right(v) => v.fold_script(n),
        }
    }
    fn fold_module_item(&mut self, n: ModuleItem) -> ModuleItem {
        match self {
            swc_visit::Either::Left(v) => v.fold_module_item(n),
            swc_visit::Either::Right(v) => v.fold_module_item(n),
        }
    }
    fn fold_module_decl(&mut self, n: ModuleDecl) -> ModuleDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_module_decl(n),
            swc_visit::Either::Right(v) => v.fold_module_decl(n),
        }
    }
    fn fold_export_default_expr(&mut self, n: ExportDefaultExpr) -> ExportDefaultExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_export_default_expr(n),
            swc_visit::Either::Right(v) => v.fold_export_default_expr(n),
        }
    }
    fn fold_export_decl(&mut self, n: ExportDecl) -> ExportDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_export_decl(n),
            swc_visit::Either::Right(v) => v.fold_export_decl(n),
        }
    }
    fn fold_import_decl(&mut self, n: ImportDecl) -> ImportDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_import_decl(n),
            swc_visit::Either::Right(v) => v.fold_import_decl(n),
        }
    }
    fn fold_export_all(&mut self, n: ExportAll) -> ExportAll {
        match self {
            swc_visit::Either::Left(v) => v.fold_export_all(n),
            swc_visit::Either::Right(v) => v.fold_export_all(n),
        }
    }
    fn fold_named_export(&mut self, n: NamedExport) -> NamedExport {
        match self {
            swc_visit::Either::Left(v) => v.fold_named_export(n),
            swc_visit::Either::Right(v) => v.fold_named_export(n),
        }
    }
    fn fold_export_default_decl(&mut self, n: ExportDefaultDecl) -> ExportDefaultDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_export_default_decl(n),
            swc_visit::Either::Right(v) => v.fold_export_default_decl(n),
        }
    }
    fn fold_default_decl(&mut self, n: DefaultDecl) -> DefaultDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_default_decl(n),
            swc_visit::Either::Right(v) => v.fold_default_decl(n),
        }
    }
    fn fold_import_specifier(&mut self, n: ImportSpecifier) -> ImportSpecifier {
        match self {
            swc_visit::Either::Left(v) => v.fold_import_specifier(n),
            swc_visit::Either::Right(v) => v.fold_import_specifier(n),
        }
    }
    fn fold_import_default_specifier(
        &mut self,
        n: ImportDefaultSpecifier,
    ) -> ImportDefaultSpecifier {
        match self {
            swc_visit::Either::Left(v) => v.fold_import_default_specifier(n),
            swc_visit::Either::Right(v) => v.fold_import_default_specifier(n),
        }
    }
    fn fold_import_star_as_specifier(&mut self, n: ImportStarAsSpecifier) -> ImportStarAsSpecifier {
        match self {
            swc_visit::Either::Left(v) => v.fold_import_star_as_specifier(n),
            swc_visit::Either::Right(v) => v.fold_import_star_as_specifier(n),
        }
    }
    fn fold_import_named_specifier(&mut self, n: ImportNamedSpecifier) -> ImportNamedSpecifier {
        match self {
            swc_visit::Either::Left(v) => v.fold_import_named_specifier(n),
            swc_visit::Either::Right(v) => v.fold_import_named_specifier(n),
        }
    }
    fn fold_export_specifier(&mut self, n: ExportSpecifier) -> ExportSpecifier {
        match self {
            swc_visit::Either::Left(v) => v.fold_export_specifier(n),
            swc_visit::Either::Right(v) => v.fold_export_specifier(n),
        }
    }
    fn fold_export_namespace_specifier(
        &mut self,
        n: ExportNamespaceSpecifier,
    ) -> ExportNamespaceSpecifier {
        match self {
            swc_visit::Either::Left(v) => v.fold_export_namespace_specifier(n),
            swc_visit::Either::Right(v) => v.fold_export_namespace_specifier(n),
        }
    }
    fn fold_export_default_specifier(
        &mut self,
        n: ExportDefaultSpecifier,
    ) -> ExportDefaultSpecifier {
        match self {
            swc_visit::Either::Left(v) => v.fold_export_default_specifier(n),
            swc_visit::Either::Right(v) => v.fold_export_default_specifier(n),
        }
    }
    fn fold_export_named_specifier(&mut self, n: ExportNamedSpecifier) -> ExportNamedSpecifier {
        match self {
            swc_visit::Either::Left(v) => v.fold_export_named_specifier(n),
            swc_visit::Either::Right(v) => v.fold_export_named_specifier(n),
        }
    }
    fn fold_binary_op(&mut self, n: BinaryOp) -> BinaryOp {
        match self {
            swc_visit::Either::Left(v) => v.fold_binary_op(n),
            swc_visit::Either::Right(v) => v.fold_binary_op(n),
        }
    }
    fn fold_assign_op(&mut self, n: AssignOp) -> AssignOp {
        match self {
            swc_visit::Either::Left(v) => v.fold_assign_op(n),
            swc_visit::Either::Right(v) => v.fold_assign_op(n),
        }
    }
    fn fold_update_op(&mut self, n: UpdateOp) -> UpdateOp {
        match self {
            swc_visit::Either::Left(v) => v.fold_update_op(n),
            swc_visit::Either::Right(v) => v.fold_update_op(n),
        }
    }
    fn fold_unary_op(&mut self, n: UnaryOp) -> UnaryOp {
        match self {
            swc_visit::Either::Left(v) => v.fold_unary_op(n),
            swc_visit::Either::Right(v) => v.fold_unary_op(n),
        }
    }
    fn fold_pat(&mut self, n: Pat) -> Pat {
        match self {
            swc_visit::Either::Left(v) => v.fold_pat(n),
            swc_visit::Either::Right(v) => v.fold_pat(n),
        }
    }
    fn fold_array_pat(&mut self, n: ArrayPat) -> ArrayPat {
        match self {
            swc_visit::Either::Left(v) => v.fold_array_pat(n),
            swc_visit::Either::Right(v) => v.fold_array_pat(n),
        }
    }
    fn fold_object_pat(&mut self, n: ObjectPat) -> ObjectPat {
        match self {
            swc_visit::Either::Left(v) => v.fold_object_pat(n),
            swc_visit::Either::Right(v) => v.fold_object_pat(n),
        }
    }
    fn fold_assign_pat(&mut self, n: AssignPat) -> AssignPat {
        match self {
            swc_visit::Either::Left(v) => v.fold_assign_pat(n),
            swc_visit::Either::Right(v) => v.fold_assign_pat(n),
        }
    }
    fn fold_rest_pat(&mut self, n: RestPat) -> RestPat {
        match self {
            swc_visit::Either::Left(v) => v.fold_rest_pat(n),
            swc_visit::Either::Right(v) => v.fold_rest_pat(n),
        }
    }
    fn fold_object_pat_prop(&mut self, n: ObjectPatProp) -> ObjectPatProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_object_pat_prop(n),
            swc_visit::Either::Right(v) => v.fold_object_pat_prop(n),
        }
    }
    fn fold_key_value_pat_prop(&mut self, n: KeyValuePatProp) -> KeyValuePatProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_key_value_pat_prop(n),
            swc_visit::Either::Right(v) => v.fold_key_value_pat_prop(n),
        }
    }
    fn fold_assign_pat_prop(&mut self, n: AssignPatProp) -> AssignPatProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_assign_pat_prop(n),
            swc_visit::Either::Right(v) => v.fold_assign_pat_prop(n),
        }
    }
    fn fold_prop(&mut self, n: Prop) -> Prop {
        match self {
            swc_visit::Either::Left(v) => v.fold_prop(n),
            swc_visit::Either::Right(v) => v.fold_prop(n),
        }
    }
    fn fold_key_value_prop(&mut self, n: KeyValueProp) -> KeyValueProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_key_value_prop(n),
            swc_visit::Either::Right(v) => v.fold_key_value_prop(n),
        }
    }
    fn fold_assign_prop(&mut self, n: AssignProp) -> AssignProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_assign_prop(n),
            swc_visit::Either::Right(v) => v.fold_assign_prop(n),
        }
    }
    fn fold_getter_prop(&mut self, n: GetterProp) -> GetterProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_getter_prop(n),
            swc_visit::Either::Right(v) => v.fold_getter_prop(n),
        }
    }
    fn fold_setter_prop(&mut self, n: SetterProp) -> SetterProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_setter_prop(n),
            swc_visit::Either::Right(v) => v.fold_setter_prop(n),
        }
    }
    fn fold_method_prop(&mut self, n: MethodProp) -> MethodProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_method_prop(n),
            swc_visit::Either::Right(v) => v.fold_method_prop(n),
        }
    }
    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        match self {
            swc_visit::Either::Left(v) => v.fold_prop_name(n),
            swc_visit::Either::Right(v) => v.fold_prop_name(n),
        }
    }
    fn fold_computed_prop_name(&mut self, n: ComputedPropName) -> ComputedPropName {
        match self {
            swc_visit::Either::Left(v) => v.fold_computed_prop_name(n),
            swc_visit::Either::Right(v) => v.fold_computed_prop_name(n),
        }
    }
    fn fold_block_stmt(&mut self, n: BlockStmt) -> BlockStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_block_stmt(n),
            swc_visit::Either::Right(v) => v.fold_block_stmt(n),
        }
    }
    fn fold_stmt(&mut self, n: Stmt) -> Stmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_stmt(n),
            swc_visit::Either::Right(v) => v.fold_stmt(n),
        }
    }
    fn fold_expr_stmt(&mut self, n: ExprStmt) -> ExprStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_expr_stmt(n),
            swc_visit::Either::Right(v) => v.fold_expr_stmt(n),
        }
    }
    fn fold_empty_stmt(&mut self, n: EmptyStmt) -> EmptyStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_empty_stmt(n),
            swc_visit::Either::Right(v) => v.fold_empty_stmt(n),
        }
    }
    fn fold_debugger_stmt(&mut self, n: DebuggerStmt) -> DebuggerStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_debugger_stmt(n),
            swc_visit::Either::Right(v) => v.fold_debugger_stmt(n),
        }
    }
    fn fold_with_stmt(&mut self, n: WithStmt) -> WithStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_with_stmt(n),
            swc_visit::Either::Right(v) => v.fold_with_stmt(n),
        }
    }
    fn fold_return_stmt(&mut self, n: ReturnStmt) -> ReturnStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_return_stmt(n),
            swc_visit::Either::Right(v) => v.fold_return_stmt(n),
        }
    }
    fn fold_labeled_stmt(&mut self, n: LabeledStmt) -> LabeledStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_labeled_stmt(n),
            swc_visit::Either::Right(v) => v.fold_labeled_stmt(n),
        }
    }
    fn fold_break_stmt(&mut self, n: BreakStmt) -> BreakStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_break_stmt(n),
            swc_visit::Either::Right(v) => v.fold_break_stmt(n),
        }
    }
    fn fold_continue_stmt(&mut self, n: ContinueStmt) -> ContinueStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_continue_stmt(n),
            swc_visit::Either::Right(v) => v.fold_continue_stmt(n),
        }
    }
    fn fold_if_stmt(&mut self, n: IfStmt) -> IfStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_if_stmt(n),
            swc_visit::Either::Right(v) => v.fold_if_stmt(n),
        }
    }
    fn fold_switch_stmt(&mut self, n: SwitchStmt) -> SwitchStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_switch_stmt(n),
            swc_visit::Either::Right(v) => v.fold_switch_stmt(n),
        }
    }
    fn fold_throw_stmt(&mut self, n: ThrowStmt) -> ThrowStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_throw_stmt(n),
            swc_visit::Either::Right(v) => v.fold_throw_stmt(n),
        }
    }
    fn fold_try_stmt(&mut self, n: TryStmt) -> TryStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_try_stmt(n),
            swc_visit::Either::Right(v) => v.fold_try_stmt(n),
        }
    }
    fn fold_while_stmt(&mut self, n: WhileStmt) -> WhileStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_while_stmt(n),
            swc_visit::Either::Right(v) => v.fold_while_stmt(n),
        }
    }
    fn fold_do_while_stmt(&mut self, n: DoWhileStmt) -> DoWhileStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_do_while_stmt(n),
            swc_visit::Either::Right(v) => v.fold_do_while_stmt(n),
        }
    }
    fn fold_for_stmt(&mut self, n: ForStmt) -> ForStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_for_stmt(n),
            swc_visit::Either::Right(v) => v.fold_for_stmt(n),
        }
    }
    fn fold_for_in_stmt(&mut self, n: ForInStmt) -> ForInStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_for_in_stmt(n),
            swc_visit::Either::Right(v) => v.fold_for_in_stmt(n),
        }
    }
    fn fold_for_of_stmt(&mut self, n: ForOfStmt) -> ForOfStmt {
        match self {
            swc_visit::Either::Left(v) => v.fold_for_of_stmt(n),
            swc_visit::Either::Right(v) => v.fold_for_of_stmt(n),
        }
    }
    fn fold_switch_case(&mut self, n: SwitchCase) -> SwitchCase {
        match self {
            swc_visit::Either::Left(v) => v.fold_switch_case(n),
            swc_visit::Either::Right(v) => v.fold_switch_case(n),
        }
    }
    fn fold_catch_clause(&mut self, n: CatchClause) -> CatchClause {
        match self {
            swc_visit::Either::Left(v) => v.fold_catch_clause(n),
            swc_visit::Either::Right(v) => v.fold_catch_clause(n),
        }
    }
    fn fold_var_decl_or_pat(&mut self, n: VarDeclOrPat) -> VarDeclOrPat {
        match self {
            swc_visit::Either::Left(v) => v.fold_var_decl_or_pat(n),
            swc_visit::Either::Right(v) => v.fold_var_decl_or_pat(n),
        }
    }
    fn fold_var_decl_or_expr(&mut self, n: VarDeclOrExpr) -> VarDeclOrExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_var_decl_or_expr(n),
            swc_visit::Either::Right(v) => v.fold_var_decl_or_expr(n),
        }
    }
    fn fold_ts_type_ann(&mut self, n: TsTypeAnn) -> TsTypeAnn {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_ann(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_ann(n),
        }
    }
    fn fold_ts_type_param_decl(&mut self, n: TsTypeParamDecl) -> TsTypeParamDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_param_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_param_decl(n),
        }
    }
    fn fold_ts_type_param(&mut self, n: TsTypeParam) -> TsTypeParam {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_param(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_param(n),
        }
    }
    fn fold_ts_type_param_instantiation(
        &mut self,
        n: TsTypeParamInstantiation,
    ) -> TsTypeParamInstantiation {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_param_instantiation(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_param_instantiation(n),
        }
    }
    fn fold_ts_type_cast_expr(&mut self, n: TsTypeCastExpr) -> TsTypeCastExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_cast_expr(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_cast_expr(n),
        }
    }
    fn fold_ts_param_prop(&mut self, n: TsParamProp) -> TsParamProp {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_param_prop(n),
            swc_visit::Either::Right(v) => v.fold_ts_param_prop(n),
        }
    }
    fn fold_ts_param_prop_param(&mut self, n: TsParamPropParam) -> TsParamPropParam {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_param_prop_param(n),
            swc_visit::Either::Right(v) => v.fold_ts_param_prop_param(n),
        }
    }
    fn fold_ts_qualified_name(&mut self, n: TsQualifiedName) -> TsQualifiedName {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_qualified_name(n),
            swc_visit::Either::Right(v) => v.fold_ts_qualified_name(n),
        }
    }
    fn fold_ts_entity_name(&mut self, n: TsEntityName) -> TsEntityName {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_entity_name(n),
            swc_visit::Either::Right(v) => v.fold_ts_entity_name(n),
        }
    }
    fn fold_ts_signature_decl(&mut self, n: TsSignatureDecl) -> TsSignatureDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_signature_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_signature_decl(n),
        }
    }
    fn fold_ts_type_element(&mut self, n: TsTypeElement) -> TsTypeElement {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_element(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_element(n),
        }
    }
    fn fold_ts_call_signature_decl(&mut self, n: TsCallSignatureDecl) -> TsCallSignatureDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_call_signature_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_call_signature_decl(n),
        }
    }
    fn fold_ts_construct_signature_decl(
        &mut self,
        n: TsConstructSignatureDecl,
    ) -> TsConstructSignatureDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_construct_signature_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_construct_signature_decl(n),
        }
    }
    fn fold_ts_property_signature(&mut self, n: TsPropertySignature) -> TsPropertySignature {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_property_signature(n),
            swc_visit::Either::Right(v) => v.fold_ts_property_signature(n),
        }
    }
    fn fold_ts_method_signature(&mut self, n: TsMethodSignature) -> TsMethodSignature {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_method_signature(n),
            swc_visit::Either::Right(v) => v.fold_ts_method_signature(n),
        }
    }
    fn fold_ts_index_signature(&mut self, n: TsIndexSignature) -> TsIndexSignature {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_index_signature(n),
            swc_visit::Either::Right(v) => v.fold_ts_index_signature(n),
        }
    }
    fn fold_ts_type(&mut self, n: TsType) -> TsType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_type(n),
        }
    }
    fn fold_ts_fn_or_constructor_type(
        &mut self,
        n: TsFnOrConstructorType,
    ) -> TsFnOrConstructorType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_fn_or_constructor_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_fn_or_constructor_type(n),
        }
    }
    fn fold_ts_keyword_type(&mut self, n: TsKeywordType) -> TsKeywordType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_keyword_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_keyword_type(n),
        }
    }
    fn fold_ts_keyword_type_kind(&mut self, n: TsKeywordTypeKind) -> TsKeywordTypeKind {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_keyword_type_kind(n),
            swc_visit::Either::Right(v) => v.fold_ts_keyword_type_kind(n),
        }
    }
    fn fold_ts_this_type(&mut self, n: TsThisType) -> TsThisType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_this_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_this_type(n),
        }
    }
    fn fold_ts_fn_param(&mut self, n: TsFnParam) -> TsFnParam {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_fn_param(n),
            swc_visit::Either::Right(v) => v.fold_ts_fn_param(n),
        }
    }
    fn fold_ts_fn_type(&mut self, n: TsFnType) -> TsFnType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_fn_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_fn_type(n),
        }
    }
    fn fold_ts_constructor_type(&mut self, n: TsConstructorType) -> TsConstructorType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_constructor_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_constructor_type(n),
        }
    }
    fn fold_ts_type_ref(&mut self, n: TsTypeRef) -> TsTypeRef {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_ref(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_ref(n),
        }
    }
    fn fold_ts_type_predicate(&mut self, n: TsTypePredicate) -> TsTypePredicate {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_predicate(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_predicate(n),
        }
    }
    fn fold_ts_this_type_or_ident(&mut self, n: TsThisTypeOrIdent) -> TsThisTypeOrIdent {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_this_type_or_ident(n),
            swc_visit::Either::Right(v) => v.fold_ts_this_type_or_ident(n),
        }
    }
    fn fold_ts_type_query(&mut self, n: TsTypeQuery) -> TsTypeQuery {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_query(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_query(n),
        }
    }
    fn fold_ts_type_query_expr(&mut self, n: TsTypeQueryExpr) -> TsTypeQueryExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_query_expr(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_query_expr(n),
        }
    }
    fn fold_ts_import_type(&mut self, n: TsImportType) -> TsImportType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_import_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_import_type(n),
        }
    }
    fn fold_ts_type_lit(&mut self, n: TsTypeLit) -> TsTypeLit {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_lit(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_lit(n),
        }
    }
    fn fold_ts_array_type(&mut self, n: TsArrayType) -> TsArrayType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_array_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_array_type(n),
        }
    }
    fn fold_ts_tuple_type(&mut self, n: TsTupleType) -> TsTupleType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_tuple_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_tuple_type(n),
        }
    }
    fn fold_ts_tuple_element(&mut self, n: TsTupleElement) -> TsTupleElement {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_tuple_element(n),
            swc_visit::Either::Right(v) => v.fold_ts_tuple_element(n),
        }
    }
    fn fold_ts_optional_type(&mut self, n: TsOptionalType) -> TsOptionalType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_optional_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_optional_type(n),
        }
    }
    fn fold_ts_rest_type(&mut self, n: TsRestType) -> TsRestType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_rest_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_rest_type(n),
        }
    }
    fn fold_ts_union_or_intersection_type(
        &mut self,
        n: TsUnionOrIntersectionType,
    ) -> TsUnionOrIntersectionType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_union_or_intersection_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_union_or_intersection_type(n),
        }
    }
    fn fold_ts_union_type(&mut self, n: TsUnionType) -> TsUnionType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_union_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_union_type(n),
        }
    }
    fn fold_ts_intersection_type(&mut self, n: TsIntersectionType) -> TsIntersectionType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_intersection_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_intersection_type(n),
        }
    }
    fn fold_ts_conditional_type(&mut self, n: TsConditionalType) -> TsConditionalType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_conditional_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_conditional_type(n),
        }
    }
    fn fold_ts_infer_type(&mut self, n: TsInferType) -> TsInferType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_infer_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_infer_type(n),
        }
    }
    fn fold_ts_parenthesized_type(&mut self, n: TsParenthesizedType) -> TsParenthesizedType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_parenthesized_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_parenthesized_type(n),
        }
    }
    fn fold_ts_type_operator(&mut self, n: TsTypeOperator) -> TsTypeOperator {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_operator(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_operator(n),
        }
    }
    fn fold_ts_type_operator_op(&mut self, n: TsTypeOperatorOp) -> TsTypeOperatorOp {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_operator_op(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_operator_op(n),
        }
    }
    fn fold_ts_indexed_access_type(&mut self, n: TsIndexedAccessType) -> TsIndexedAccessType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_indexed_access_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_indexed_access_type(n),
        }
    }
    fn fold_true_plus_minus(&mut self, n: TruePlusMinus) -> TruePlusMinus {
        match self {
            swc_visit::Either::Left(v) => v.fold_true_plus_minus(n),
            swc_visit::Either::Right(v) => v.fold_true_plus_minus(n),
        }
    }
    fn fold_ts_mapped_type(&mut self, n: TsMappedType) -> TsMappedType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_mapped_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_mapped_type(n),
        }
    }
    fn fold_ts_lit_type(&mut self, n: TsLitType) -> TsLitType {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_lit_type(n),
            swc_visit::Either::Right(v) => v.fold_ts_lit_type(n),
        }
    }
    fn fold_ts_lit(&mut self, n: TsLit) -> TsLit {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_lit(n),
            swc_visit::Either::Right(v) => v.fold_ts_lit(n),
        }
    }
    fn fold_ts_interface_decl(&mut self, n: TsInterfaceDecl) -> TsInterfaceDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_interface_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_interface_decl(n),
        }
    }
    fn fold_ts_interface_body(&mut self, n: TsInterfaceBody) -> TsInterfaceBody {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_interface_body(n),
            swc_visit::Either::Right(v) => v.fold_ts_interface_body(n),
        }
    }
    fn fold_ts_expr_with_type_args(&mut self, n: TsExprWithTypeArgs) -> TsExprWithTypeArgs {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_expr_with_type_args(n),
            swc_visit::Either::Right(v) => v.fold_ts_expr_with_type_args(n),
        }
    }
    fn fold_ts_type_alias_decl(&mut self, n: TsTypeAliasDecl) -> TsTypeAliasDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_alias_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_alias_decl(n),
        }
    }
    fn fold_ts_enum_decl(&mut self, n: TsEnumDecl) -> TsEnumDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_enum_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_enum_decl(n),
        }
    }
    fn fold_ts_enum_member(&mut self, n: TsEnumMember) -> TsEnumMember {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_enum_member(n),
            swc_visit::Either::Right(v) => v.fold_ts_enum_member(n),
        }
    }
    fn fold_ts_enum_member_id(&mut self, n: TsEnumMemberId) -> TsEnumMemberId {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_enum_member_id(n),
            swc_visit::Either::Right(v) => v.fold_ts_enum_member_id(n),
        }
    }
    fn fold_ts_module_decl(&mut self, n: TsModuleDecl) -> TsModuleDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_module_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_module_decl(n),
        }
    }
    fn fold_ts_namespace_body(&mut self, n: TsNamespaceBody) -> TsNamespaceBody {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_namespace_body(n),
            swc_visit::Either::Right(v) => v.fold_ts_namespace_body(n),
        }
    }
    fn fold_ts_module_block(&mut self, n: TsModuleBlock) -> TsModuleBlock {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_module_block(n),
            swc_visit::Either::Right(v) => v.fold_ts_module_block(n),
        }
    }
    fn fold_ts_namespace_decl(&mut self, n: TsNamespaceDecl) -> TsNamespaceDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_namespace_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_namespace_decl(n),
        }
    }
    fn fold_ts_module_name(&mut self, n: TsModuleName) -> TsModuleName {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_module_name(n),
            swc_visit::Either::Right(v) => v.fold_ts_module_name(n),
        }
    }
    fn fold_ts_import_equals_decl(&mut self, n: TsImportEqualsDecl) -> TsImportEqualsDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_import_equals_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_import_equals_decl(n),
        }
    }
    fn fold_ts_module_ref(&mut self, n: TsModuleRef) -> TsModuleRef {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_module_ref(n),
            swc_visit::Either::Right(v) => v.fold_ts_module_ref(n),
        }
    }
    fn fold_ts_external_module_ref(&mut self, n: TsExternalModuleRef) -> TsExternalModuleRef {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_external_module_ref(n),
            swc_visit::Either::Right(v) => v.fold_ts_external_module_ref(n),
        }
    }
    fn fold_ts_export_assignment(&mut self, n: TsExportAssignment) -> TsExportAssignment {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_export_assignment(n),
            swc_visit::Either::Right(v) => v.fold_ts_export_assignment(n),
        }
    }
    fn fold_ts_namespace_export_decl(&mut self, n: TsNamespaceExportDecl) -> TsNamespaceExportDecl {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_namespace_export_decl(n),
            swc_visit::Either::Right(v) => v.fold_ts_namespace_export_decl(n),
        }
    }
    fn fold_ts_as_expr(&mut self, n: TsAsExpr) -> TsAsExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_as_expr(n),
            swc_visit::Either::Right(v) => v.fold_ts_as_expr(n),
        }
    }
    fn fold_ts_type_assertion(&mut self, n: TsTypeAssertion) -> TsTypeAssertion {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_type_assertion(n),
            swc_visit::Either::Right(v) => v.fold_ts_type_assertion(n),
        }
    }
    fn fold_ts_non_null_expr(&mut self, n: TsNonNullExpr) -> TsNonNullExpr {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_non_null_expr(n),
            swc_visit::Either::Right(v) => v.fold_ts_non_null_expr(n),
        }
    }
    fn fold_accessibility(&mut self, n: Accessibility) -> Accessibility {
        match self {
            swc_visit::Either::Left(v) => v.fold_accessibility(n),
            swc_visit::Either::Right(v) => v.fold_accessibility(n),
        }
    }
    fn fold_ts_const_assertion(&mut self, n: TsConstAssertion) -> TsConstAssertion {
        match self {
            swc_visit::Either::Left(v) => v.fold_ts_const_assertion(n),
            swc_visit::Either::Right(v) => v.fold_ts_const_assertion(n),
        }
    }
}
pub trait FoldWith<V: Fold> {
    fn fold_with(self, v: &mut V) -> Self;
    /// Visit children nodes of self with `v`
    fn fold_children_with(self, v: &mut V) -> Self;
}
impl<V, T> FoldWith<V> for Box<T>
where
    V: Fold,
    T: 'static + FoldWith<V>,
{
    fn fold_with(self, v: &mut V) -> Self {
        Box::new((*self).fold_with(v))
    }
    /// Visit children nodes of self with `v`
    fn fold_children_with(self, v: &mut V) -> Self {
        Box::new((*self).fold_children_with(v))
    }
}
impl<V: Fold> FoldWith<V> for Class {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_class(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_class(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Span {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_span(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_span(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<Decorator> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_decorators(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_decorators(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<ClassMember> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_class_members(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_class_members(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Box<Expr>> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<TsTypeParamDecl> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_ts_type_param_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_ts_type_param_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<TsTypeParamInstantiation> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_ts_type_param_instantiation(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_ts_type_param_instantiation(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<TsExprWithTypeArgs> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_expr_with_type_args_vec(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_expr_with_type_args_vec(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ClassMember {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_class_member(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_class_member(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Constructor {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_constructor(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_constructor(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ClassMethod {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_class_method(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_class_method(v, self)
    }
}
impl<V: Fold> FoldWith<V> for PrivateMethod {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_private_method(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_private_method(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ClassProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_class_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_class_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for PrivateProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_private_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_private_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsIndexSignature {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_index_signature(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_index_signature(v, self)
    }
}
impl<V: Fold> FoldWith<V> for EmptyStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_empty_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_empty_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<TsTypeAnn> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_ts_type_ann(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_ts_type_ann(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Accessibility> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_accessibility(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_accessibility(v, self)
    }
}
impl<V: Fold> FoldWith<V> for PrivateName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_private_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_private_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for PropName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_prop_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_prop_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Function {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_function(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_function(v, self)
    }
}
impl<V: Fold> FoldWith<V> for MethodKind {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_method_kind(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_method_kind(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<ParamOrTsParamProp> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_param_or_ts_param_props(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_param_or_ts_param_props(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<BlockStmt> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_block_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_block_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Decorator {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_decorator(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_decorator(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Decl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ClassDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_class_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_class_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for FnDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_fn_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_fn_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for VarDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_var_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_var_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsInterfaceDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_interface_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_interface_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeAliasDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_alias_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_alias_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsEnumDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_enum_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_enum_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsModuleDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_module_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_module_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Ident {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ident(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ident(v, self)
    }
}
impl<V: Fold> FoldWith<V> for VarDeclKind {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_var_decl_kind(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_var_decl_kind(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<VarDeclarator> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_var_declarators(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_var_declarators(v, self)
    }
}
impl<V: Fold> FoldWith<V> for VarDeclarator {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_var_declarator(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_var_declarator(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Pat {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_pat(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_pat(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Expr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ThisExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_this_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_this_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ArrayLit {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_array_lit(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_array_lit(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ObjectLit {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_object_lit(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_object_lit(v, self)
    }
}
impl<V: Fold> FoldWith<V> for FnExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_fn_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_fn_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for UnaryExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_unary_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_unary_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for UpdateExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_update_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_update_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for BinExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_bin_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_bin_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for AssignExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_assign_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_assign_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for MemberExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_member_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_member_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for CondExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_cond_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_cond_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for CallExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_call_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_call_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for NewExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_new_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_new_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for SeqExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_seq_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_seq_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Lit {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_lit(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_lit(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Tpl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_tpl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_tpl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TaggedTpl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_tagged_tpl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_tagged_tpl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ArrowExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_arrow_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_arrow_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ClassExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_class_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_class_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for YieldExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_yield_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_yield_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for MetaPropExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_meta_prop_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_meta_prop_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for AwaitExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_await_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_await_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ParenExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_paren_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_paren_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXMemberExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_member_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_member_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXNamespacedName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_namespaced_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_namespaced_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXEmptyExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_empty_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_empty_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXFragment {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_fragment(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_fragment(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeAssertion {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_assertion(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_assertion(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsConstAssertion {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_const_assertion(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_const_assertion(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsNonNullExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_non_null_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_non_null_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeCastExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_cast_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_cast_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsAsExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_as_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_as_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for OptChainExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_chain_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_chain_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Invalid {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_invalid(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_invalid(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<Option<ExprOrSpread>> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_vec_expr_or_spreads(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_vec_expr_or_spreads(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<PropOrSpread> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_prop_or_spreads(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_prop_or_spreads(v, self)
    }
}
impl<V: Fold> FoldWith<V> for PropOrSpread {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_prop_or_spread(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_prop_or_spread(v, self)
    }
}
impl<V: Fold> FoldWith<V> for SpreadElement {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_spread_element(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_spread_element(v, self)
    }
}
impl<V: Fold> FoldWith<V> for UnaryOp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_unary_op(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_unary_op(v, self)
    }
}
impl<V: Fold> FoldWith<V> for UpdateOp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_update_op(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_update_op(v, self)
    }
}
impl<V: Fold> FoldWith<V> for BinaryOp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_binary_op(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_binary_op(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Ident> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_ident(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_ident(v, self)
    }
}
impl<V: Fold> FoldWith<V> for AssignOp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_assign_op(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_assign_op(v, self)
    }
}
impl<V: Fold> FoldWith<V> for PatOrExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_pat_or_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_pat_or_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExprOrSuper {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_expr_or_super(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_expr_or_super(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<ExprOrSpread> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_expr_or_spreads(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_expr_or_spreads(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Vec<ExprOrSpread>> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_expr_or_spreads(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_expr_or_spreads(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<Box<Expr>> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_exprs(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_exprs(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<Pat> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_pats(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_pats(v, self)
    }
}
impl<V: Fold> FoldWith<V> for BlockStmtOrExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_block_stmt_or_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_block_stmt_or_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<TplElement> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_tpl_elements(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_tpl_elements(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TplElement {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_tpl_element(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_tpl_element(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Str> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_str(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_str(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Str {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_str(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_str(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Super {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_super(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_super(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExprOrSpread {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_expr_or_spread(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_expr_or_spread(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Span> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_span(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_span(v, self)
    }
}
impl<V: Fold> FoldWith<V> for BlockStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_block_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_block_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<Param> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_params(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_params(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Param {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_param(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_param(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ParamOrTsParamProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_param_or_ts_param_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_param_or_ts_param_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsParamProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_param_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_param_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JsWord {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_js_word(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_js_word(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXObject {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_object(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_object(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXExprContainer {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_expr_container(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_expr_container(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXSpreadChild {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_spread_child(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_spread_child(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXElementName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_element_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_element_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXOpeningElement {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_opening_element(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_opening_element(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<JSXAttrOrSpread> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_attr_or_spreads(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_attr_or_spreads(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXAttrOrSpread {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_attr_or_spread(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_attr_or_spread(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXAttr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_attr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_attr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXClosingElement {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_closing_element(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_closing_element(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXAttrName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_attr_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_attr_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<JSXAttrValue> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_jsx_attr_value(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_jsx_attr_value(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXAttrValue {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_attr_value(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_attr_value(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXText {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_text(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_text(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXElement {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_element(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_element(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<JSXElementChild> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_element_children(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_element_children(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<JSXClosingElement> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_jsx_closing_element(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_jsx_closing_element(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXElementChild {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_element_child(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_element_child(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXOpeningFragment {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_opening_fragment(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_opening_fragment(v, self)
    }
}
impl<V: Fold> FoldWith<V> for JSXClosingFragment {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_jsx_closing_fragment(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_jsx_closing_fragment(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Bool {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_bool(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_bool(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Null {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_null(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_null(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Number {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_number(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_number(v, self)
    }
}
impl<V: Fold> FoldWith<V> for BigInt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_big_int(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_big_int(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Regex {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_regex(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_regex(v, self)
    }
}
impl<V: Fold> FoldWith<V> for BigIntValue {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_big_int_value(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_big_int_value(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Program {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_program(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_program(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Module {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_module(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_module(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Script {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_script(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_script(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<ModuleItem> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_module_items(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_module_items(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<JsWord> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_js_word(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_js_word(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<Stmt> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_stmts(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_stmts(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ModuleItem {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_module_item(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_module_item(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ModuleDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_module_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_module_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Stmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ImportDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_import_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_import_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExportDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for NamedExport {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_named_export(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_named_export(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExportDefaultDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_default_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_default_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExportDefaultExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_default_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_default_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExportAll {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_all(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_all(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsImportEqualsDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_import_equals_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_import_equals_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsExportAssignment {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_export_assignment(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_export_assignment(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsNamespaceExportDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_namespace_export_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_namespace_export_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<ImportSpecifier> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_import_specifiers(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_import_specifiers(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<ExportSpecifier> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_specifiers(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_specifiers(v, self)
    }
}
impl<V: Fold> FoldWith<V> for DefaultDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_default_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_default_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ImportSpecifier {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_import_specifier(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_import_specifier(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ImportNamedSpecifier {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_import_named_specifier(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_import_named_specifier(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ImportDefaultSpecifier {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_import_default_specifier(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_import_default_specifier(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ImportStarAsSpecifier {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_import_star_as_specifier(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_import_star_as_specifier(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExportSpecifier {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_specifier(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_specifier(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExportNamespaceSpecifier {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_namespace_specifier(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_namespace_specifier(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExportDefaultSpecifier {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_default_specifier(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_default_specifier(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExportNamedSpecifier {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_export_named_specifier(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_export_named_specifier(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ArrayPat {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_array_pat(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_array_pat(v, self)
    }
}
impl<V: Fold> FoldWith<V> for RestPat {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_rest_pat(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_rest_pat(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ObjectPat {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_object_pat(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_object_pat(v, self)
    }
}
impl<V: Fold> FoldWith<V> for AssignPat {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_assign_pat(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_assign_pat(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<Option<Pat>> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_vec_pats(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_vec_pats(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<ObjectPatProp> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_object_pat_props(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_object_pat_props(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ObjectPatProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_object_pat_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_object_pat_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for KeyValuePatProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_key_value_pat_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_key_value_pat_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for AssignPatProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_assign_pat_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_assign_pat_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Prop {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for KeyValueProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_key_value_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_key_value_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for AssignProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_assign_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_assign_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for GetterProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_getter_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_getter_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for SetterProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_setter_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_setter_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for MethodProp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_method_prop(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_method_prop(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ComputedPropName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_computed_prop_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_computed_prop_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for DebuggerStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_debugger_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_debugger_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for WithStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_with_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_with_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ReturnStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_return_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_return_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for LabeledStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_labeled_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_labeled_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for BreakStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_break_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_break_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ContinueStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_continue_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_continue_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for IfStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_if_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_if_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for SwitchStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_switch_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_switch_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ThrowStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_throw_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_throw_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TryStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_try_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_try_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for WhileStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_while_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_while_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for DoWhileStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_do_while_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_do_while_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ForStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_for_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_for_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ForInStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_for_in_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_for_in_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ForOfStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_for_of_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_for_of_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for ExprStmt {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_expr_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_expr_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Box<Stmt>> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_stmt(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_stmt(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<SwitchCase> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_switch_cases(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_switch_cases(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<CatchClause> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_catch_clause(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_catch_clause(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<VarDeclOrExpr> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_var_decl_or_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_var_decl_or_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for VarDeclOrPat {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_var_decl_or_pat(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_var_decl_or_pat(v, self)
    }
}
impl<V: Fold> FoldWith<V> for SwitchCase {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_switch_case(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_switch_case(v, self)
    }
}
impl<V: Fold> FoldWith<V> for CatchClause {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_catch_clause(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_catch_clause(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Pat> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_pat(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_pat(v, self)
    }
}
impl<V: Fold> FoldWith<V> for VarDeclOrExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_var_decl_or_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_var_decl_or_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeAnn {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_ann(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_ann(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeParamDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_param_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_param_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<TsTypeParam> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_params(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_params(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeParam {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_param(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_param(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<Box<TsType>> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_ts_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_ts_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeParamInstantiation {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_param_instantiation(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_param_instantiation(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<Box<TsType>> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_types(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_types(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsParamPropParam {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_param_prop_param(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_param_prop_param(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsQualifiedName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_qualified_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_qualified_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsEntityName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_entity_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_entity_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsSignatureDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_signature_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_signature_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsCallSignatureDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_call_signature_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_call_signature_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsConstructSignatureDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_construct_signature_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_construct_signature_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsMethodSignature {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_method_signature(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_method_signature(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsFnType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_fn_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_fn_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsConstructorType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_constructor_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_constructor_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeElement {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_element(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_element(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsPropertySignature {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_property_signature(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_property_signature(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<TsFnParam> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_fn_params(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_fn_params(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsKeywordType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_keyword_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_keyword_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsThisType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_this_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_this_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsFnOrConstructorType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_fn_or_constructor_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_fn_or_constructor_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeRef {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_ref(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_ref(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeQuery {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_query(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_query(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeLit {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_lit(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_lit(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsArrayType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_array_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_array_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTupleType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_tuple_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_tuple_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsOptionalType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_optional_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_optional_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsRestType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_rest_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_rest_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsUnionOrIntersectionType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_union_or_intersection_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_union_or_intersection_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsConditionalType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_conditional_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_conditional_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsInferType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_infer_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_infer_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsParenthesizedType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_parenthesized_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_parenthesized_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeOperator {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_operator(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_operator(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsIndexedAccessType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_indexed_access_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_indexed_access_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsMappedType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_mapped_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_mapped_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsLitType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_lit_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_lit_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypePredicate {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_predicate(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_predicate(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsImportType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_import_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_import_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsKeywordTypeKind {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_keyword_type_kind(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_keyword_type_kind(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsFnParam {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_fn_param(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_fn_param(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsThisTypeOrIdent {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_this_type_or_ident(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_this_type_or_ident(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeQueryExpr {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_query_expr(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_query_expr(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<TsEntityName> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_ts_entity_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_ts_entity_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<TsTypeElement> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_elements(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_elements(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<TsTupleElement> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_tuple_elements(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_tuple_elements(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTupleElement {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_tuple_element(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_tuple_element(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsUnionType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_union_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_union_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsIntersectionType {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_intersection_type(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_intersection_type(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsTypeOperatorOp {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_type_operator_op(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_type_operator_op(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TruePlusMinus {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_true_plus_minus(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_true_plus_minus(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<TruePlusMinus> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_true_plus_minus(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_true_plus_minus(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsLit {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_lit(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_lit(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsInterfaceBody {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_interface_body(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_interface_body(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsExprWithTypeArgs {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_expr_with_type_args(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_expr_with_type_args(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Vec<TsEnumMember> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_enum_members(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_enum_members(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsEnumMember {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_enum_member(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_enum_member(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsEnumMemberId {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_enum_member_id(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_enum_member_id(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsModuleName {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_module_name(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_module_name(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<TsNamespaceBody> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_ts_namespace_body(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_ts_namespace_body(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsNamespaceBody {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_namespace_body(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_namespace_body(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsModuleBlock {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_module_block(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_module_block(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsNamespaceDecl {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_namespace_decl(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_namespace_decl(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsModuleRef {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_module_ref(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_module_ref(v, self)
    }
}
impl<V: Fold> FoldWith<V> for TsExternalModuleRef {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_ts_external_module_ref(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_ts_external_module_ref(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Accessibility {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_accessibility(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_accessibility(v, self)
    }
}
impl<V: Fold> FoldWith<V> for Option<ExprOrSpread> {
    fn fold_with(self, v: &mut V) -> Self {
        v.fold_opt_expr_or_spread(self)
    }
    fn fold_children_with(self, v: &mut V) -> Self {
        fold_opt_expr_or_spread(v, self)
    }
}
#[allow(unused_variables)]
pub fn visit_accessibility<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &Accessibility,
    _parent: &dyn Node,
) {
    {
        match n {
            Accessibility::Public {} => {}
            Accessibility::Protected {} => {}
            Accessibility::Private {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_array_lit<V: ?Sized + Visit>(_visitor: &mut V, n: &ArrayLit, _parent: &dyn Node) {
    {
        match n {
            ArrayLit { span, elems } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_vec_expr_or_spreads(elems, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_array_pat<V: ?Sized + Visit>(_visitor: &mut V, n: &ArrayPat, _parent: &dyn Node) {
    {
        match n {
            ArrayPat {
                span,
                elems,
                optional,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_vec_pats(elems, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_arrow_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &ArrowExpr, _parent: &dyn Node) {
    {
        match n {
            ArrowExpr {
                span,
                params,
                body,
                is_async,
                is_generator,
                type_params,
                return_type,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_pats(params, _parent as _);
                _visitor.visit_block_stmt_or_expr(body, _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_ann(return_type.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_assign_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &AssignExpr, _parent: &dyn Node) {
    {
        match n {
            AssignExpr {
                span,
                op,
                left,
                right,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_assign_op(op, _parent as _);
                _visitor.visit_pat_or_expr(left, _parent as _);
                _visitor.visit_expr(right, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_assign_op<V: ?Sized + Visit>(_visitor: &mut V, n: &AssignOp, _parent: &dyn Node) {
    {
        match n {
            AssignOp::Assign {} => {}
            AssignOp::AddAssign {} => {}
            AssignOp::SubAssign {} => {}
            AssignOp::MulAssign {} => {}
            AssignOp::DivAssign {} => {}
            AssignOp::ModAssign {} => {}
            AssignOp::LShiftAssign {} => {}
            AssignOp::RShiftAssign {} => {}
            AssignOp::ZeroFillRShiftAssign {} => {}
            AssignOp::BitOrAssign {} => {}
            AssignOp::BitXorAssign {} => {}
            AssignOp::BitAndAssign {} => {}
            AssignOp::ExpAssign {} => {}
            AssignOp::AndAssign {} => {}
            AssignOp::OrAssign {} => {}
            AssignOp::NullishAssign {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_assign_pat<V: ?Sized + Visit>(_visitor: &mut V, n: &AssignPat, _parent: &dyn Node) {
    {
        match n {
            AssignPat {
                span,
                left,
                right,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_pat(left, _parent as _);
                _visitor.visit_expr(right, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_assign_pat_prop<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &AssignPatProp,
    _parent: &dyn Node,
) {
    {
        match n {
            AssignPatProp { span, key, value } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(key, _parent as _);
                _visitor.visit_opt_expr(value.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_assign_prop<V: ?Sized + Visit>(_visitor: &mut V, n: &AssignProp, _parent: &dyn Node) {
    {
        match n {
            AssignProp { key, value } => {
                _visitor.visit_ident(key, _parent as _);
                _visitor.visit_expr(value, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_await_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &AwaitExpr, _parent: &dyn Node) {
    {
        match n {
            AwaitExpr { span, arg } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(arg, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_big_int<V: ?Sized + Visit>(_visitor: &mut V, n: &BigInt, _parent: &dyn Node) {
    {
        match n {
            BigInt { span, value } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_big_int_value(value, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_bin_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &BinExpr, _parent: &dyn Node) {
    {
        match n {
            BinExpr {
                span,
                op,
                left,
                right,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_binary_op(op, _parent as _);
                _visitor.visit_expr(left, _parent as _);
                _visitor.visit_expr(right, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_binary_op<V: ?Sized + Visit>(_visitor: &mut V, n: &BinaryOp, _parent: &dyn Node) {
    {
        match n {
            BinaryOp::EqEq {} => {}
            BinaryOp::NotEq {} => {}
            BinaryOp::EqEqEq {} => {}
            BinaryOp::NotEqEq {} => {}
            BinaryOp::Lt {} => {}
            BinaryOp::LtEq {} => {}
            BinaryOp::Gt {} => {}
            BinaryOp::GtEq {} => {}
            BinaryOp::LShift {} => {}
            BinaryOp::RShift {} => {}
            BinaryOp::ZeroFillRShift {} => {}
            BinaryOp::Add {} => {}
            BinaryOp::Sub {} => {}
            BinaryOp::Mul {} => {}
            BinaryOp::Div {} => {}
            BinaryOp::Mod {} => {}
            BinaryOp::BitOr {} => {}
            BinaryOp::BitXor {} => {}
            BinaryOp::BitAnd {} => {}
            BinaryOp::LogicalOr {} => {}
            BinaryOp::LogicalAnd {} => {}
            BinaryOp::In {} => {}
            BinaryOp::InstanceOf {} => {}
            BinaryOp::Exp {} => {}
            BinaryOp::NullishCoalescing {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_block_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &BlockStmt, _parent: &dyn Node) {
    {
        match n {
            BlockStmt { span, stmts } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_stmts(stmts, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_block_stmt_or_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &BlockStmtOrExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            BlockStmtOrExpr::BlockStmt { 0: _0 } => {
                _visitor.visit_block_stmt(_0, _parent as _);
            }
            BlockStmtOrExpr::Expr { 0: _0 } => {
                _visitor.visit_expr(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_bool<V: ?Sized + Visit>(_visitor: &mut V, n: &Bool, _parent: &dyn Node) {
    {
        match n {
            Bool { span, value } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_break_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &BreakStmt, _parent: &dyn Node) {
    {
        match n {
            BreakStmt { span, label } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_ident(label.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_call_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &CallExpr, _parent: &dyn Node) {
    {
        match n {
            CallExpr {
                span,
                callee,
                args,
                type_args,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr_or_super(callee, _parent as _);
                _visitor.visit_expr_or_spreads(args, _parent as _);
                _visitor.visit_opt_ts_type_param_instantiation(type_args.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_catch_clause<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &CatchClause,
    _parent: &dyn Node,
) {
    {
        match n {
            CatchClause { span, param, body } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_pat(param.as_ref(), _parent as _);
                _visitor.visit_block_stmt(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_class<V: ?Sized + Visit>(_visitor: &mut V, n: &Class, _parent: &dyn Node) {
    {
        match n {
            Class {
                span,
                decorators,
                body,
                super_class,
                is_abstract,
                type_params,
                super_type_params,
                implements,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_decorators(decorators, _parent as _);
                _visitor.visit_class_members(body, _parent as _);
                _visitor.visit_opt_expr(super_class.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_param_instantiation(
                    super_type_params.as_ref(),
                    _parent as _,
                );
                _visitor.visit_ts_expr_with_type_args_vec(implements, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_class_decl<V: ?Sized + Visit>(_visitor: &mut V, n: &ClassDecl, _parent: &dyn Node) {
    {
        match n {
            ClassDecl {
                ident,
                declare,
                class,
            } => {
                _visitor.visit_ident(ident, _parent as _);
                _visitor.visit_class(class, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_class_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &ClassExpr, _parent: &dyn Node) {
    {
        match n {
            ClassExpr { ident, class } => {
                _visitor.visit_opt_ident(ident.as_ref(), _parent as _);
                _visitor.visit_class(class, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_class_member<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ClassMember,
    _parent: &dyn Node,
) {
    {
        match n {
            ClassMember::Constructor { 0: _0 } => {
                _visitor.visit_constructor(_0, _parent as _);
            }
            ClassMember::Method { 0: _0 } => {
                _visitor.visit_class_method(_0, _parent as _);
            }
            ClassMember::PrivateMethod { 0: _0 } => {
                _visitor.visit_private_method(_0, _parent as _);
            }
            ClassMember::ClassProp { 0: _0 } => {
                _visitor.visit_class_prop(_0, _parent as _);
            }
            ClassMember::PrivateProp { 0: _0 } => {
                _visitor.visit_private_prop(_0, _parent as _);
            }
            ClassMember::TsIndexSignature { 0: _0 } => {
                _visitor.visit_ts_index_signature(_0, _parent as _);
            }
            ClassMember::Empty { 0: _0 } => {
                _visitor.visit_empty_stmt(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_class_method<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ClassMethod,
    _parent: &dyn Node,
) {
    {
        match n {
            ClassMethod {
                span,
                key,
                function,
                kind,
                is_static,
                accessibility,
                is_abstract,
                is_optional,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_prop_name(key, _parent as _);
                _visitor.visit_function(function, _parent as _);
                _visitor.visit_method_kind(kind, _parent as _);
                _visitor.visit_opt_accessibility(accessibility.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_class_prop<V: ?Sized + Visit>(_visitor: &mut V, n: &ClassProp, _parent: &dyn Node) {
    {
        match n {
            ClassProp {
                span,
                key,
                value,
                type_ann,
                is_static,
                decorators,
                computed,
                accessibility,
                is_abstract,
                is_optional,
                readonly,
                definite,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(key, _parent as _);
                _visitor.visit_opt_expr(value.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
                _visitor.visit_decorators(decorators, _parent as _);
                _visitor.visit_opt_accessibility(accessibility.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_computed_prop_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ComputedPropName,
    _parent: &dyn Node,
) {
    {
        match n {
            ComputedPropName { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_cond_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &CondExpr, _parent: &dyn Node) {
    {
        match n {
            CondExpr {
                span,
                test,
                cons,
                alt,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(test, _parent as _);
                _visitor.visit_expr(cons, _parent as _);
                _visitor.visit_expr(alt, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_constructor<V: ?Sized + Visit>(_visitor: &mut V, n: &Constructor, _parent: &dyn Node) {
    {
        match n {
            Constructor {
                span,
                key,
                params,
                body,
                accessibility,
                is_optional,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_prop_name(key, _parent as _);
                _visitor.visit_param_or_ts_param_props(params, _parent as _);
                _visitor.visit_opt_block_stmt(body.as_ref(), _parent as _);
                _visitor.visit_opt_accessibility(accessibility.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_continue_stmt<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ContinueStmt,
    _parent: &dyn Node,
) {
    {
        match n {
            ContinueStmt { span, label } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_ident(label.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_debugger_stmt<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &DebuggerStmt,
    _parent: &dyn Node,
) {
    {
        match n {
            DebuggerStmt { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_decl<V: ?Sized + Visit>(_visitor: &mut V, n: &Decl, _parent: &dyn Node) {
    {
        match n {
            Decl::Class { 0: _0 } => {
                _visitor.visit_class_decl(_0, _parent as _);
            }
            Decl::Fn { 0: _0 } => {
                _visitor.visit_fn_decl(_0, _parent as _);
            }
            Decl::Var { 0: _0 } => {
                _visitor.visit_var_decl(_0, _parent as _);
            }
            Decl::TsInterface { 0: _0 } => {
                _visitor.visit_ts_interface_decl(_0, _parent as _);
            }
            Decl::TsTypeAlias { 0: _0 } => {
                _visitor.visit_ts_type_alias_decl(_0, _parent as _);
            }
            Decl::TsEnum { 0: _0 } => {
                _visitor.visit_ts_enum_decl(_0, _parent as _);
            }
            Decl::TsModule { 0: _0 } => {
                _visitor.visit_ts_module_decl(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_decorator<V: ?Sized + Visit>(_visitor: &mut V, n: &Decorator, _parent: &dyn Node) {
    {
        match n {
            Decorator { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_default_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &DefaultDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            DefaultDecl::Class { 0: _0 } => {
                _visitor.visit_class_expr(_0, _parent as _);
            }
            DefaultDecl::Fn { 0: _0 } => {
                _visitor.visit_fn_expr(_0, _parent as _);
            }
            DefaultDecl::TsInterfaceDecl { 0: _0 } => {
                _visitor.visit_ts_interface_decl(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_do_while_stmt<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &DoWhileStmt,
    _parent: &dyn Node,
) {
    {
        match n {
            DoWhileStmt { span, test, body } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(test, _parent as _);
                _visitor.visit_stmt(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_empty_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &EmptyStmt, _parent: &dyn Node) {
    {
        match n {
            EmptyStmt { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_export_all<V: ?Sized + Visit>(_visitor: &mut V, n: &ExportAll, _parent: &dyn Node) {
    {
        match n {
            ExportAll { span, src } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_str(src, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_export_decl<V: ?Sized + Visit>(_visitor: &mut V, n: &ExportDecl, _parent: &dyn Node) {
    {
        match n {
            ExportDecl { span, decl } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_decl(decl, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_export_default_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ExportDefaultDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            ExportDefaultDecl { span, decl } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_default_decl(decl, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_export_default_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ExportDefaultExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            ExportDefaultExpr { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_export_default_specifier<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ExportDefaultSpecifier,
    _parent: &dyn Node,
) {
    {
        match n {
            ExportDefaultSpecifier { exported } => {
                _visitor.visit_ident(exported, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_export_named_specifier<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ExportNamedSpecifier,
    _parent: &dyn Node,
) {
    {
        match n {
            ExportNamedSpecifier {
                span,
                orig,
                exported,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(orig, _parent as _);
                _visitor.visit_opt_ident(exported.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_export_namespace_specifier<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ExportNamespaceSpecifier,
    _parent: &dyn Node,
) {
    {
        match n {
            ExportNamespaceSpecifier { span, name } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(name, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_export_specifier<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ExportSpecifier,
    _parent: &dyn Node,
) {
    {
        match n {
            ExportSpecifier::Namespace { 0: _0 } => {
                _visitor.visit_export_namespace_specifier(_0, _parent as _);
            }
            ExportSpecifier::Default { 0: _0 } => {
                _visitor.visit_export_default_specifier(_0, _parent as _);
            }
            ExportSpecifier::Named { 0: _0 } => {
                _visitor.visit_export_named_specifier(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &Expr, _parent: &dyn Node) {
    {
        match n {
            Expr::This { 0: _0 } => {
                _visitor.visit_this_expr(_0, _parent as _);
            }
            Expr::Array { 0: _0 } => {
                _visitor.visit_array_lit(_0, _parent as _);
            }
            Expr::Object { 0: _0 } => {
                _visitor.visit_object_lit(_0, _parent as _);
            }
            Expr::Fn { 0: _0 } => {
                _visitor.visit_fn_expr(_0, _parent as _);
            }
            Expr::Unary { 0: _0 } => {
                _visitor.visit_unary_expr(_0, _parent as _);
            }
            Expr::Update { 0: _0 } => {
                _visitor.visit_update_expr(_0, _parent as _);
            }
            Expr::Bin { 0: _0 } => {
                _visitor.visit_bin_expr(_0, _parent as _);
            }
            Expr::Assign { 0: _0 } => {
                _visitor.visit_assign_expr(_0, _parent as _);
            }
            Expr::Member { 0: _0 } => {
                _visitor.visit_member_expr(_0, _parent as _);
            }
            Expr::Cond { 0: _0 } => {
                _visitor.visit_cond_expr(_0, _parent as _);
            }
            Expr::Call { 0: _0 } => {
                _visitor.visit_call_expr(_0, _parent as _);
            }
            Expr::New { 0: _0 } => {
                _visitor.visit_new_expr(_0, _parent as _);
            }
            Expr::Seq { 0: _0 } => {
                _visitor.visit_seq_expr(_0, _parent as _);
            }
            Expr::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            Expr::Lit { 0: _0 } => {
                _visitor.visit_lit(_0, _parent as _);
            }
            Expr::Tpl { 0: _0 } => {
                _visitor.visit_tpl(_0, _parent as _);
            }
            Expr::TaggedTpl { 0: _0 } => {
                _visitor.visit_tagged_tpl(_0, _parent as _);
            }
            Expr::Arrow { 0: _0 } => {
                _visitor.visit_arrow_expr(_0, _parent as _);
            }
            Expr::Class { 0: _0 } => {
                _visitor.visit_class_expr(_0, _parent as _);
            }
            Expr::Yield { 0: _0 } => {
                _visitor.visit_yield_expr(_0, _parent as _);
            }
            Expr::MetaProp { 0: _0 } => {
                _visitor.visit_meta_prop_expr(_0, _parent as _);
            }
            Expr::Await { 0: _0 } => {
                _visitor.visit_await_expr(_0, _parent as _);
            }
            Expr::Paren { 0: _0 } => {
                _visitor.visit_paren_expr(_0, _parent as _);
            }
            Expr::JSXMember { 0: _0 } => {
                _visitor.visit_jsx_member_expr(_0, _parent as _);
            }
            Expr::JSXNamespacedName { 0: _0 } => {
                _visitor.visit_jsx_namespaced_name(_0, _parent as _);
            }
            Expr::JSXEmpty { 0: _0 } => {
                _visitor.visit_jsx_empty_expr(_0, _parent as _);
            }
            Expr::JSXElement { 0: _0 } => {
                _visitor.visit_jsx_element(_0, _parent as _);
            }
            Expr::JSXFragment { 0: _0 } => {
                _visitor.visit_jsx_fragment(_0, _parent as _);
            }
            Expr::TsTypeAssertion { 0: _0 } => {
                _visitor.visit_ts_type_assertion(_0, _parent as _);
            }
            Expr::TsConstAssertion { 0: _0 } => {
                _visitor.visit_ts_const_assertion(_0, _parent as _);
            }
            Expr::TsNonNull { 0: _0 } => {
                _visitor.visit_ts_non_null_expr(_0, _parent as _);
            }
            Expr::TsTypeCast { 0: _0 } => {
                _visitor.visit_ts_type_cast_expr(_0, _parent as _);
            }
            Expr::TsAs { 0: _0 } => {
                _visitor.visit_ts_as_expr(_0, _parent as _);
            }
            Expr::PrivateName { 0: _0 } => {
                _visitor.visit_private_name(_0, _parent as _);
            }
            Expr::OptChain { 0: _0 } => {
                _visitor.visit_opt_chain_expr(_0, _parent as _);
            }
            Expr::Invalid { 0: _0 } => {
                _visitor.visit_invalid(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_expr_or_spread<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ExprOrSpread,
    _parent: &dyn Node,
) {
    {
        match n {
            ExprOrSpread { spread, expr } => {
                _visitor.visit_opt_span(spread.as_ref(), _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_expr_or_super<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ExprOrSuper,
    _parent: &dyn Node,
) {
    {
        match n {
            ExprOrSuper::Super { 0: _0 } => {
                _visitor.visit_super(_0, _parent as _);
            }
            ExprOrSuper::Expr { 0: _0 } => {
                _visitor.visit_expr(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_expr_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &ExprStmt, _parent: &dyn Node) {
    {
        match n {
            ExprStmt { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_fn_decl<V: ?Sized + Visit>(_visitor: &mut V, n: &FnDecl, _parent: &dyn Node) {
    {
        match n {
            FnDecl {
                ident,
                declare,
                function,
            } => {
                _visitor.visit_ident(ident, _parent as _);
                _visitor.visit_function(function, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_fn_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &FnExpr, _parent: &dyn Node) {
    {
        match n {
            FnExpr { ident, function } => {
                _visitor.visit_opt_ident(ident.as_ref(), _parent as _);
                _visitor.visit_function(function, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_for_in_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &ForInStmt, _parent: &dyn Node) {
    {
        match n {
            ForInStmt {
                span,
                left,
                right,
                body,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_var_decl_or_pat(left, _parent as _);
                _visitor.visit_expr(right, _parent as _);
                _visitor.visit_stmt(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_for_of_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &ForOfStmt, _parent: &dyn Node) {
    {
        match n {
            ForOfStmt {
                span,
                await_token,
                left,
                right,
                body,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_span(await_token.as_ref(), _parent as _);
                _visitor.visit_var_decl_or_pat(left, _parent as _);
                _visitor.visit_expr(right, _parent as _);
                _visitor.visit_stmt(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_for_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &ForStmt, _parent: &dyn Node) {
    {
        match n {
            ForStmt {
                span,
                init,
                test,
                update,
                body,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_var_decl_or_expr(init.as_ref(), _parent as _);
                _visitor.visit_opt_expr(test.as_ref(), _parent as _);
                _visitor.visit_opt_expr(update.as_ref(), _parent as _);
                _visitor.visit_stmt(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_function<V: ?Sized + Visit>(_visitor: &mut V, n: &Function, _parent: &dyn Node) {
    {
        match n {
            Function {
                params,
                decorators,
                span,
                body,
                is_generator,
                is_async,
                type_params,
                return_type,
            } => {
                _visitor.visit_params(params, _parent as _);
                _visitor.visit_decorators(decorators, _parent as _);
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_block_stmt(body.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_ann(return_type.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_getter_prop<V: ?Sized + Visit>(_visitor: &mut V, n: &GetterProp, _parent: &dyn Node) {
    {
        match n {
            GetterProp {
                span,
                key,
                type_ann,
                body,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_prop_name(key, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
                _visitor.visit_opt_block_stmt(body.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ident<V: ?Sized + Visit>(_visitor: &mut V, n: &Ident, _parent: &dyn Node) {
    {
        match n {
            Ident {
                span,
                sym,
                type_ann,
                optional,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_js_word(sym, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_if_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &IfStmt, _parent: &dyn Node) {
    {
        match n {
            IfStmt {
                span,
                test,
                cons,
                alt,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(test, _parent as _);
                _visitor.visit_stmt(cons, _parent as _);
                _visitor.visit_opt_stmt(alt.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_import_decl<V: ?Sized + Visit>(_visitor: &mut V, n: &ImportDecl, _parent: &dyn Node) {
    {
        match n {
            ImportDecl {
                span,
                specifiers,
                src,
                type_only,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_import_specifiers(specifiers, _parent as _);
                _visitor.visit_str(src, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_import_default_specifier<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ImportDefaultSpecifier,
    _parent: &dyn Node,
) {
    {
        match n {
            ImportDefaultSpecifier { span, local } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(local, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_import_named_specifier<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ImportNamedSpecifier,
    _parent: &dyn Node,
) {
    {
        match n {
            ImportNamedSpecifier {
                span,
                local,
                imported,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(local, _parent as _);
                _visitor.visit_opt_ident(imported.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_import_specifier<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ImportSpecifier,
    _parent: &dyn Node,
) {
    {
        match n {
            ImportSpecifier::Named { 0: _0 } => {
                _visitor.visit_import_named_specifier(_0, _parent as _);
            }
            ImportSpecifier::Default { 0: _0 } => {
                _visitor.visit_import_default_specifier(_0, _parent as _);
            }
            ImportSpecifier::Namespace { 0: _0 } => {
                _visitor.visit_import_star_as_specifier(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_import_star_as_specifier<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ImportStarAsSpecifier,
    _parent: &dyn Node,
) {
    {
        match n {
            ImportStarAsSpecifier { span, local } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(local, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_invalid<V: ?Sized + Visit>(_visitor: &mut V, n: &Invalid, _parent: &dyn Node) {
    {
        match n {
            Invalid { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_attr<V: ?Sized + Visit>(_visitor: &mut V, n: &JSXAttr, _parent: &dyn Node) {
    {
        match n {
            JSXAttr { span, name, value } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_jsx_attr_name(name, _parent as _);
                _visitor.visit_opt_jsx_attr_value(value.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_attr_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXAttrName,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXAttrName::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            JSXAttrName::JSXNamespacedName { 0: _0 } => {
                _visitor.visit_jsx_namespaced_name(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_attr_or_spread<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXAttrOrSpread,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXAttrOrSpread::JSXAttr { 0: _0 } => {
                _visitor.visit_jsx_attr(_0, _parent as _);
            }
            JSXAttrOrSpread::SpreadElement { 0: _0 } => {
                _visitor.visit_spread_element(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_attr_value<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXAttrValue,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXAttrValue::Lit { 0: _0 } => {
                _visitor.visit_lit(_0, _parent as _);
            }
            JSXAttrValue::JSXExprContainer { 0: _0 } => {
                _visitor.visit_jsx_expr_container(_0, _parent as _);
            }
            JSXAttrValue::JSXElement { 0: _0 } => {
                _visitor.visit_jsx_element(_0, _parent as _);
            }
            JSXAttrValue::JSXFragment { 0: _0 } => {
                _visitor.visit_jsx_fragment(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_closing_element<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXClosingElement,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXClosingElement { span, name } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_jsx_element_name(name, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_closing_fragment<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXClosingFragment,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXClosingFragment { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_element<V: ?Sized + Visit>(_visitor: &mut V, n: &JSXElement, _parent: &dyn Node) {
    {
        match n {
            JSXElement {
                span,
                opening,
                children,
                closing,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_jsx_opening_element(opening, _parent as _);
                _visitor.visit_jsx_element_children(children, _parent as _);
                _visitor.visit_opt_jsx_closing_element(closing.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_element_child<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXElementChild,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXElementChild::JSXText { 0: _0 } => {
                _visitor.visit_jsx_text(_0, _parent as _);
            }
            JSXElementChild::JSXExprContainer { 0: _0 } => {
                _visitor.visit_jsx_expr_container(_0, _parent as _);
            }
            JSXElementChild::JSXSpreadChild { 0: _0 } => {
                _visitor.visit_jsx_spread_child(_0, _parent as _);
            }
            JSXElementChild::JSXElement { 0: _0 } => {
                _visitor.visit_jsx_element(_0, _parent as _);
            }
            JSXElementChild::JSXFragment { 0: _0 } => {
                _visitor.visit_jsx_fragment(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_element_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXElementName,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXElementName::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            JSXElementName::JSXMemberExpr { 0: _0 } => {
                _visitor.visit_jsx_member_expr(_0, _parent as _);
            }
            JSXElementName::JSXNamespacedName { 0: _0 } => {
                _visitor.visit_jsx_namespaced_name(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_empty_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXEmptyExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXEmptyExpr { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &JSXExpr, _parent: &dyn Node) {
    {
        match n {
            JSXExpr::JSXEmptyExpr { 0: _0 } => {
                _visitor.visit_jsx_empty_expr(_0, _parent as _);
            }
            JSXExpr::Expr { 0: _0 } => {
                _visitor.visit_expr(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_expr_container<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXExprContainer,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXExprContainer { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_jsx_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_fragment<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXFragment,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXFragment {
                span,
                opening,
                children,
                closing,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_jsx_opening_fragment(opening, _parent as _);
                _visitor.visit_jsx_element_children(children, _parent as _);
                _visitor.visit_jsx_closing_fragment(closing, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_member_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXMemberExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXMemberExpr { obj, prop } => {
                _visitor.visit_jsx_object(obj, _parent as _);
                _visitor.visit_ident(prop, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_namespaced_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXNamespacedName,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXNamespacedName { ns, name } => {
                _visitor.visit_ident(ns, _parent as _);
                _visitor.visit_ident(name, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_object<V: ?Sized + Visit>(_visitor: &mut V, n: &JSXObject, _parent: &dyn Node) {
    {
        match n {
            JSXObject::JSXMemberExpr { 0: _0 } => {
                _visitor.visit_jsx_member_expr(_0, _parent as _);
            }
            JSXObject::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_opening_element<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXOpeningElement,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXOpeningElement {
                name,
                span,
                attrs,
                self_closing,
                type_args,
            } => {
                _visitor.visit_jsx_element_name(name, _parent as _);
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_jsx_attr_or_spreads(attrs, _parent as _);
                _visitor.visit_opt_ts_type_param_instantiation(type_args.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_opening_fragment<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXOpeningFragment,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXOpeningFragment { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_spread_child<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &JSXSpreadChild,
    _parent: &dyn Node,
) {
    {
        match n {
            JSXSpreadChild { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_text<V: ?Sized + Visit>(_visitor: &mut V, n: &JSXText, _parent: &dyn Node) {
    {
        match n {
            JSXText { span, value, raw } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_js_word(value, _parent as _);
                _visitor.visit_js_word(raw, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_key_value_pat_prop<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &KeyValuePatProp,
    _parent: &dyn Node,
) {
    {
        match n {
            KeyValuePatProp { key, value } => {
                _visitor.visit_prop_name(key, _parent as _);
                _visitor.visit_pat(value, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_key_value_prop<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &KeyValueProp,
    _parent: &dyn Node,
) {
    {
        match n {
            KeyValueProp { key, value } => {
                _visitor.visit_prop_name(key, _parent as _);
                _visitor.visit_expr(value, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_labeled_stmt<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &LabeledStmt,
    _parent: &dyn Node,
) {
    {
        match n {
            LabeledStmt { span, label, body } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(label, _parent as _);
                _visitor.visit_stmt(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_lit<V: ?Sized + Visit>(_visitor: &mut V, n: &Lit, _parent: &dyn Node) {
    {
        match n {
            Lit::Str { 0: _0 } => {
                _visitor.visit_str(_0, _parent as _);
            }
            Lit::Bool { 0: _0 } => {
                _visitor.visit_bool(_0, _parent as _);
            }
            Lit::Null { 0: _0 } => {
                _visitor.visit_null(_0, _parent as _);
            }
            Lit::Num { 0: _0 } => {
                _visitor.visit_number(_0, _parent as _);
            }
            Lit::BigInt { 0: _0 } => {
                _visitor.visit_big_int(_0, _parent as _);
            }
            Lit::Regex { 0: _0 } => {
                _visitor.visit_regex(_0, _parent as _);
            }
            Lit::JSXText { 0: _0 } => {
                _visitor.visit_jsx_text(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_member_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &MemberExpr, _parent: &dyn Node) {
    {
        match n {
            MemberExpr {
                span,
                obj,
                prop,
                computed,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr_or_super(obj, _parent as _);
                _visitor.visit_expr(prop, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_meta_prop_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &MetaPropExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            MetaPropExpr { meta, prop } => {
                _visitor.visit_ident(meta, _parent as _);
                _visitor.visit_ident(prop, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_method_kind<V: ?Sized + Visit>(_visitor: &mut V, n: &MethodKind, _parent: &dyn Node) {
    {
        match n {
            MethodKind::Method {} => {}
            MethodKind::Getter {} => {}
            MethodKind::Setter {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_method_prop<V: ?Sized + Visit>(_visitor: &mut V, n: &MethodProp, _parent: &dyn Node) {
    {
        match n {
            MethodProp { key, function } => {
                _visitor.visit_prop_name(key, _parent as _);
                _visitor.visit_function(function, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_module<V: ?Sized + Visit>(_visitor: &mut V, n: &Module, _parent: &dyn Node) {
    {
        match n {
            Module {
                span,
                body,
                shebang,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_module_items(body, _parent as _);
                _visitor.visit_opt_js_word(shebang.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_module_decl<V: ?Sized + Visit>(_visitor: &mut V, n: &ModuleDecl, _parent: &dyn Node) {
    {
        match n {
            ModuleDecl::Import { 0: _0 } => {
                _visitor.visit_import_decl(_0, _parent as _);
            }
            ModuleDecl::ExportDecl { 0: _0 } => {
                _visitor.visit_export_decl(_0, _parent as _);
            }
            ModuleDecl::ExportNamed { 0: _0 } => {
                _visitor.visit_named_export(_0, _parent as _);
            }
            ModuleDecl::ExportDefaultDecl { 0: _0 } => {
                _visitor.visit_export_default_decl(_0, _parent as _);
            }
            ModuleDecl::ExportDefaultExpr { 0: _0 } => {
                _visitor.visit_export_default_expr(_0, _parent as _);
            }
            ModuleDecl::ExportAll { 0: _0 } => {
                _visitor.visit_export_all(_0, _parent as _);
            }
            ModuleDecl::TsImportEquals { 0: _0 } => {
                _visitor.visit_ts_import_equals_decl(_0, _parent as _);
            }
            ModuleDecl::TsExportAssignment { 0: _0 } => {
                _visitor.visit_ts_export_assignment(_0, _parent as _);
            }
            ModuleDecl::TsNamespaceExport { 0: _0 } => {
                _visitor.visit_ts_namespace_export_decl(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_module_item<V: ?Sized + Visit>(_visitor: &mut V, n: &ModuleItem, _parent: &dyn Node) {
    {
        match n {
            ModuleItem::ModuleDecl { 0: _0 } => {
                _visitor.visit_module_decl(_0, _parent as _);
            }
            ModuleItem::Stmt { 0: _0 } => {
                _visitor.visit_stmt(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_named_export<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &NamedExport,
    _parent: &dyn Node,
) {
    {
        match n {
            NamedExport {
                span,
                specifiers,
                src,
                type_only,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_export_specifiers(specifiers, _parent as _);
                _visitor.visit_opt_str(src.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_new_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &NewExpr, _parent: &dyn Node) {
    {
        match n {
            NewExpr {
                span,
                callee,
                args,
                type_args,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(callee, _parent as _);
                _visitor.visit_opt_expr_or_spreads(args.as_ref().map(|v| &**v), _parent as _);
                _visitor.visit_opt_ts_type_param_instantiation(type_args.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_null<V: ?Sized + Visit>(_visitor: &mut V, n: &Null, _parent: &dyn Node) {
    {
        match n {
            Null { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_number<V: ?Sized + Visit>(_visitor: &mut V, n: &Number, _parent: &dyn Node) {
    {
        match n {
            Number { span, value } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_object_lit<V: ?Sized + Visit>(_visitor: &mut V, n: &ObjectLit, _parent: &dyn Node) {
    {
        match n {
            ObjectLit { span, props } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_prop_or_spreads(props, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_object_pat<V: ?Sized + Visit>(_visitor: &mut V, n: &ObjectPat, _parent: &dyn Node) {
    {
        match n {
            ObjectPat {
                span,
                props,
                optional,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_object_pat_props(props, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_object_pat_prop<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ObjectPatProp,
    _parent: &dyn Node,
) {
    {
        match n {
            ObjectPatProp::KeyValue { 0: _0 } => {
                _visitor.visit_key_value_pat_prop(_0, _parent as _);
            }
            ObjectPatProp::Assign { 0: _0 } => {
                _visitor.visit_assign_pat_prop(_0, _parent as _);
            }
            ObjectPatProp::Rest { 0: _0 } => {
                _visitor.visit_rest_pat(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_opt_chain_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &OptChainExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            OptChainExpr { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_param<V: ?Sized + Visit>(_visitor: &mut V, n: &Param, _parent: &dyn Node) {
    {
        match n {
            Param {
                span,
                decorators,
                pat,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_decorators(decorators, _parent as _);
                _visitor.visit_pat(pat, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_param_or_ts_param_prop<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &ParamOrTsParamProp,
    _parent: &dyn Node,
) {
    {
        match n {
            ParamOrTsParamProp::TsParamProp { 0: _0 } => {
                _visitor.visit_ts_param_prop(_0, _parent as _);
            }
            ParamOrTsParamProp::Param { 0: _0 } => {
                _visitor.visit_param(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_paren_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &ParenExpr, _parent: &dyn Node) {
    {
        match n {
            ParenExpr { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_pat<V: ?Sized + Visit>(_visitor: &mut V, n: &Pat, _parent: &dyn Node) {
    {
        match n {
            Pat::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            Pat::Array { 0: _0 } => {
                _visitor.visit_array_pat(_0, _parent as _);
            }
            Pat::Rest { 0: _0 } => {
                _visitor.visit_rest_pat(_0, _parent as _);
            }
            Pat::Object { 0: _0 } => {
                _visitor.visit_object_pat(_0, _parent as _);
            }
            Pat::Assign { 0: _0 } => {
                _visitor.visit_assign_pat(_0, _parent as _);
            }
            Pat::Invalid { 0: _0 } => {
                _visitor.visit_invalid(_0, _parent as _);
            }
            Pat::Expr { 0: _0 } => {
                _visitor.visit_expr(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_pat_or_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &PatOrExpr, _parent: &dyn Node) {
    {
        match n {
            PatOrExpr::Expr { 0: _0 } => {
                _visitor.visit_expr(_0, _parent as _);
            }
            PatOrExpr::Pat { 0: _0 } => {
                _visitor.visit_pat(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_private_method<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &PrivateMethod,
    _parent: &dyn Node,
) {
    {
        match n {
            PrivateMethod {
                span,
                key,
                function,
                kind,
                is_static,
                accessibility,
                is_abstract,
                is_optional,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_private_name(key, _parent as _);
                _visitor.visit_function(function, _parent as _);
                _visitor.visit_method_kind(kind, _parent as _);
                _visitor.visit_opt_accessibility(accessibility.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_private_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &PrivateName,
    _parent: &dyn Node,
) {
    {
        match n {
            PrivateName { span, id } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(id, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_private_prop<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &PrivateProp,
    _parent: &dyn Node,
) {
    {
        match n {
            PrivateProp {
                span,
                key,
                value,
                type_ann,
                is_static,
                decorators,
                computed,
                accessibility,
                is_abstract,
                is_optional,
                readonly,
                definite,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_private_name(key, _parent as _);
                _visitor.visit_opt_expr(value.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
                _visitor.visit_decorators(decorators, _parent as _);
                _visitor.visit_opt_accessibility(accessibility.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_program<V: ?Sized + Visit>(_visitor: &mut V, n: &Program, _parent: &dyn Node) {
    {
        match n {
            Program::Module { 0: _0 } => {
                _visitor.visit_module(_0, _parent as _);
            }
            Program::Script { 0: _0 } => {
                _visitor.visit_script(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_prop<V: ?Sized + Visit>(_visitor: &mut V, n: &Prop, _parent: &dyn Node) {
    {
        match n {
            Prop::Shorthand { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            Prop::KeyValue { 0: _0 } => {
                _visitor.visit_key_value_prop(_0, _parent as _);
            }
            Prop::Assign { 0: _0 } => {
                _visitor.visit_assign_prop(_0, _parent as _);
            }
            Prop::Getter { 0: _0 } => {
                _visitor.visit_getter_prop(_0, _parent as _);
            }
            Prop::Setter { 0: _0 } => {
                _visitor.visit_setter_prop(_0, _parent as _);
            }
            Prop::Method { 0: _0 } => {
                _visitor.visit_method_prop(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_prop_name<V: ?Sized + Visit>(_visitor: &mut V, n: &PropName, _parent: &dyn Node) {
    {
        match n {
            PropName::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            PropName::Str { 0: _0 } => {
                _visitor.visit_str(_0, _parent as _);
            }
            PropName::Num { 0: _0 } => {
                _visitor.visit_number(_0, _parent as _);
            }
            PropName::Computed { 0: _0 } => {
                _visitor.visit_computed_prop_name(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_prop_or_spread<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &PropOrSpread,
    _parent: &dyn Node,
) {
    {
        match n {
            PropOrSpread::Spread { 0: _0 } => {
                _visitor.visit_spread_element(_0, _parent as _);
            }
            PropOrSpread::Prop { 0: _0 } => {
                _visitor.visit_prop(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_regex<V: ?Sized + Visit>(_visitor: &mut V, n: &Regex, _parent: &dyn Node) {
    {
        match n {
            Regex { span, exp, flags } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_js_word(exp, _parent as _);
                _visitor.visit_js_word(flags, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_rest_pat<V: ?Sized + Visit>(_visitor: &mut V, n: &RestPat, _parent: &dyn Node) {
    {
        match n {
            RestPat {
                span,
                dot3_token,
                arg,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_span(dot3_token, _parent as _);
                _visitor.visit_pat(arg, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_return_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &ReturnStmt, _parent: &dyn Node) {
    {
        match n {
            ReturnStmt { span, arg } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_expr(arg.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_script<V: ?Sized + Visit>(_visitor: &mut V, n: &Script, _parent: &dyn Node) {
    {
        match n {
            Script {
                span,
                body,
                shebang,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_stmts(body, _parent as _);
                _visitor.visit_opt_js_word(shebang.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_seq_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &SeqExpr, _parent: &dyn Node) {
    {
        match n {
            SeqExpr { span, exprs } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_exprs(exprs, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_setter_prop<V: ?Sized + Visit>(_visitor: &mut V, n: &SetterProp, _parent: &dyn Node) {
    {
        match n {
            SetterProp {
                span,
                key,
                param,
                body,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_prop_name(key, _parent as _);
                _visitor.visit_pat(param, _parent as _);
                _visitor.visit_opt_block_stmt(body.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_spread_element<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &SpreadElement,
    _parent: &dyn Node,
) {
    {
        match n {
            SpreadElement { dot3_token, expr } => {
                _visitor.visit_span(dot3_token, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &Stmt, _parent: &dyn Node) {
    {
        match n {
            Stmt::Block { 0: _0 } => {
                _visitor.visit_block_stmt(_0, _parent as _);
            }
            Stmt::Empty { 0: _0 } => {
                _visitor.visit_empty_stmt(_0, _parent as _);
            }
            Stmt::Debugger { 0: _0 } => {
                _visitor.visit_debugger_stmt(_0, _parent as _);
            }
            Stmt::With { 0: _0 } => {
                _visitor.visit_with_stmt(_0, _parent as _);
            }
            Stmt::Return { 0: _0 } => {
                _visitor.visit_return_stmt(_0, _parent as _);
            }
            Stmt::Labeled { 0: _0 } => {
                _visitor.visit_labeled_stmt(_0, _parent as _);
            }
            Stmt::Break { 0: _0 } => {
                _visitor.visit_break_stmt(_0, _parent as _);
            }
            Stmt::Continue { 0: _0 } => {
                _visitor.visit_continue_stmt(_0, _parent as _);
            }
            Stmt::If { 0: _0 } => {
                _visitor.visit_if_stmt(_0, _parent as _);
            }
            Stmt::Switch { 0: _0 } => {
                _visitor.visit_switch_stmt(_0, _parent as _);
            }
            Stmt::Throw { 0: _0 } => {
                _visitor.visit_throw_stmt(_0, _parent as _);
            }
            Stmt::Try { 0: _0 } => {
                _visitor.visit_try_stmt(_0, _parent as _);
            }
            Stmt::While { 0: _0 } => {
                _visitor.visit_while_stmt(_0, _parent as _);
            }
            Stmt::DoWhile { 0: _0 } => {
                _visitor.visit_do_while_stmt(_0, _parent as _);
            }
            Stmt::For { 0: _0 } => {
                _visitor.visit_for_stmt(_0, _parent as _);
            }
            Stmt::ForIn { 0: _0 } => {
                _visitor.visit_for_in_stmt(_0, _parent as _);
            }
            Stmt::ForOf { 0: _0 } => {
                _visitor.visit_for_of_stmt(_0, _parent as _);
            }
            Stmt::Decl { 0: _0 } => {
                _visitor.visit_decl(_0, _parent as _);
            }
            Stmt::Expr { 0: _0 } => {
                _visitor.visit_expr_stmt(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_str<V: ?Sized + Visit>(_visitor: &mut V, n: &Str, _parent: &dyn Node) {
    {
        match n {
            Str {
                span,
                value,
                has_escape,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_js_word(value, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_super<V: ?Sized + Visit>(_visitor: &mut V, n: &Super, _parent: &dyn Node) {
    {
        match n {
            Super { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_switch_case<V: ?Sized + Visit>(_visitor: &mut V, n: &SwitchCase, _parent: &dyn Node) {
    {
        match n {
            SwitchCase { span, test, cons } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_expr(test.as_ref(), _parent as _);
                _visitor.visit_stmts(cons, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_switch_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &SwitchStmt, _parent: &dyn Node) {
    {
        match n {
            SwitchStmt {
                span,
                discriminant,
                cases,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(discriminant, _parent as _);
                _visitor.visit_switch_cases(cases, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_tagged_tpl<V: ?Sized + Visit>(_visitor: &mut V, n: &TaggedTpl, _parent: &dyn Node) {
    {
        match n {
            TaggedTpl {
                span,
                tag,
                exprs,
                quasis,
                type_params,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(tag, _parent as _);
                _visitor.visit_exprs(exprs, _parent as _);
                _visitor.visit_tpl_elements(quasis, _parent as _);
                _visitor.visit_opt_ts_type_param_instantiation(type_params.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_this_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &ThisExpr, _parent: &dyn Node) {
    {
        match n {
            ThisExpr { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_throw_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &ThrowStmt, _parent: &dyn Node) {
    {
        match n {
            ThrowStmt { span, arg } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(arg, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_tpl<V: ?Sized + Visit>(_visitor: &mut V, n: &Tpl, _parent: &dyn Node) {
    {
        match n {
            Tpl {
                span,
                exprs,
                quasis,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_exprs(exprs, _parent as _);
                _visitor.visit_tpl_elements(quasis, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_tpl_element<V: ?Sized + Visit>(_visitor: &mut V, n: &TplElement, _parent: &dyn Node) {
    {
        match n {
            TplElement {
                span,
                tail,
                cooked,
                raw,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_str(cooked.as_ref(), _parent as _);
                _visitor.visit_str(raw, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_true_plus_minus<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TruePlusMinus,
    _parent: &dyn Node,
) {
    {
        match n {
            TruePlusMinus::True {} => {}
            TruePlusMinus::Plus {} => {}
            TruePlusMinus::Minus {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_try_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &TryStmt, _parent: &dyn Node) {
    {
        match n {
            TryStmt {
                span,
                block,
                handler,
                finalizer,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_block_stmt(block, _parent as _);
                _visitor.visit_opt_catch_clause(handler.as_ref(), _parent as _);
                _visitor.visit_opt_block_stmt(finalizer.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_array_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsArrayType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsArrayType { span, elem_type } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type(elem_type, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_as_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &TsAsExpr, _parent: &dyn Node) {
    {
        match n {
            TsAsExpr {
                span,
                expr,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
                _visitor.visit_ts_type(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_call_signature_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsCallSignatureDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsCallSignatureDecl {
                span,
                params,
                type_ann,
                type_params,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_fn_params(params, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_conditional_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsConditionalType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsConditionalType {
                span,
                check_type,
                extends_type,
                true_type,
                false_type,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type(check_type, _parent as _);
                _visitor.visit_ts_type(extends_type, _parent as _);
                _visitor.visit_ts_type(true_type, _parent as _);
                _visitor.visit_ts_type(false_type, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_const_assertion<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsConstAssertion,
    _parent: &dyn Node,
) {
    {
        match n {
            TsConstAssertion { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_construct_signature_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsConstructSignatureDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsConstructSignatureDecl {
                span,
                params,
                type_ann,
                type_params,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_fn_params(params, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_constructor_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsConstructorType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsConstructorType {
                span,
                params,
                type_params,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_fn_params(params, _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
                _visitor.visit_ts_type_ann(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_entity_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsEntityName,
    _parent: &dyn Node,
) {
    {
        match n {
            TsEntityName::TsQualifiedName { 0: _0 } => {
                _visitor.visit_ts_qualified_name(_0, _parent as _);
            }
            TsEntityName::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_enum_decl<V: ?Sized + Visit>(_visitor: &mut V, n: &TsEnumDecl, _parent: &dyn Node) {
    {
        match n {
            TsEnumDecl {
                span,
                declare,
                is_const,
                id,
                members,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(id, _parent as _);
                _visitor.visit_ts_enum_members(members, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_enum_member<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsEnumMember,
    _parent: &dyn Node,
) {
    {
        match n {
            TsEnumMember { span, id, init } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_enum_member_id(id, _parent as _);
                _visitor.visit_opt_expr(init.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_enum_member_id<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsEnumMemberId,
    _parent: &dyn Node,
) {
    {
        match n {
            TsEnumMemberId::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            TsEnumMemberId::Str { 0: _0 } => {
                _visitor.visit_str(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_export_assignment<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsExportAssignment,
    _parent: &dyn Node,
) {
    {
        match n {
            TsExportAssignment { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_expr_with_type_args<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsExprWithTypeArgs,
    _parent: &dyn Node,
) {
    {
        match n {
            TsExprWithTypeArgs {
                span,
                expr,
                type_args,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_entity_name(expr, _parent as _);
                _visitor.visit_opt_ts_type_param_instantiation(type_args.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_external_module_ref<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsExternalModuleRef,
    _parent: &dyn Node,
) {
    {
        match n {
            TsExternalModuleRef { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_str(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_fn_or_constructor_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsFnOrConstructorType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsFnOrConstructorType::TsFnType { 0: _0 } => {
                _visitor.visit_ts_fn_type(_0, _parent as _);
            }
            TsFnOrConstructorType::TsConstructorType { 0: _0 } => {
                _visitor.visit_ts_constructor_type(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_fn_param<V: ?Sized + Visit>(_visitor: &mut V, n: &TsFnParam, _parent: &dyn Node) {
    {
        match n {
            TsFnParam::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            TsFnParam::Array { 0: _0 } => {
                _visitor.visit_array_pat(_0, _parent as _);
            }
            TsFnParam::Rest { 0: _0 } => {
                _visitor.visit_rest_pat(_0, _parent as _);
            }
            TsFnParam::Object { 0: _0 } => {
                _visitor.visit_object_pat(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_fn_type<V: ?Sized + Visit>(_visitor: &mut V, n: &TsFnType, _parent: &dyn Node) {
    {
        match n {
            TsFnType {
                span,
                params,
                type_params,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_fn_params(params, _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
                _visitor.visit_ts_type_ann(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_import_equals_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsImportEqualsDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsImportEqualsDecl {
                span,
                declare,
                is_export,
                id,
                module_ref,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(id, _parent as _);
                _visitor.visit_ts_module_ref(module_ref, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_import_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsImportType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsImportType {
                span,
                arg,
                qualifier,
                type_args,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_str(arg, _parent as _);
                _visitor.visit_opt_ts_entity_name(qualifier.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_param_instantiation(type_args.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_index_signature<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsIndexSignature,
    _parent: &dyn Node,
) {
    {
        match n {
            TsIndexSignature {
                params,
                type_ann,
                readonly,
                span,
            } => {
                _visitor.visit_ts_fn_params(params, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_indexed_access_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsIndexedAccessType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsIndexedAccessType {
                span,
                readonly,
                obj_type,
                index_type,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type(obj_type, _parent as _);
                _visitor.visit_ts_type(index_type, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_infer_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsInferType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsInferType { span, type_param } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type_param(type_param, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_interface_body<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsInterfaceBody,
    _parent: &dyn Node,
) {
    {
        match n {
            TsInterfaceBody { span, body } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type_elements(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_interface_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsInterfaceDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsInterfaceDecl {
                span,
                id,
                declare,
                type_params,
                extends,
                body,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(id, _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
                _visitor.visit_ts_expr_with_type_args_vec(extends, _parent as _);
                _visitor.visit_ts_interface_body(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_intersection_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsIntersectionType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsIntersectionType { span, types } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_types(types, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_keyword_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsKeywordType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsKeywordType { span, kind } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_keyword_type_kind(kind, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_keyword_type_kind<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsKeywordTypeKind,
    _parent: &dyn Node,
) {
    {
        match n {
            TsKeywordTypeKind::TsAnyKeyword {} => {}
            TsKeywordTypeKind::TsUnknownKeyword {} => {}
            TsKeywordTypeKind::TsNumberKeyword {} => {}
            TsKeywordTypeKind::TsObjectKeyword {} => {}
            TsKeywordTypeKind::TsBooleanKeyword {} => {}
            TsKeywordTypeKind::TsBigIntKeyword {} => {}
            TsKeywordTypeKind::TsStringKeyword {} => {}
            TsKeywordTypeKind::TsSymbolKeyword {} => {}
            TsKeywordTypeKind::TsVoidKeyword {} => {}
            TsKeywordTypeKind::TsUndefinedKeyword {} => {}
            TsKeywordTypeKind::TsNullKeyword {} => {}
            TsKeywordTypeKind::TsNeverKeyword {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_lit<V: ?Sized + Visit>(_visitor: &mut V, n: &TsLit, _parent: &dyn Node) {
    {
        match n {
            TsLit::Number { 0: _0 } => {
                _visitor.visit_number(_0, _parent as _);
            }
            TsLit::Str { 0: _0 } => {
                _visitor.visit_str(_0, _parent as _);
            }
            TsLit::Bool { 0: _0 } => {
                _visitor.visit_bool(_0, _parent as _);
            }
            TsLit::Tpl { 0: _0 } => {
                _visitor.visit_tpl(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_lit_type<V: ?Sized + Visit>(_visitor: &mut V, n: &TsLitType, _parent: &dyn Node) {
    {
        match n {
            TsLitType { span, lit } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_lit(lit, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_mapped_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsMappedType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsMappedType {
                span,
                readonly,
                type_param,
                optional,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_true_plus_minus(readonly.as_ref(), _parent as _);
                _visitor.visit_ts_type_param(type_param, _parent as _);
                _visitor.visit_opt_true_plus_minus(optional.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type(type_ann.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_method_signature<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsMethodSignature,
    _parent: &dyn Node,
) {
    {
        match n {
            TsMethodSignature {
                span,
                readonly,
                key,
                computed,
                optional,
                params,
                type_ann,
                type_params,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(key, _parent as _);
                _visitor.visit_ts_fn_params(params, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_module_block<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsModuleBlock,
    _parent: &dyn Node,
) {
    {
        match n {
            TsModuleBlock { span, body } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_module_items(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_module_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsModuleDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsModuleDecl {
                span,
                declare,
                global,
                id,
                body,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_module_name(id, _parent as _);
                _visitor.visit_opt_ts_namespace_body(body.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_module_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsModuleName,
    _parent: &dyn Node,
) {
    {
        match n {
            TsModuleName::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            TsModuleName::Str { 0: _0 } => {
                _visitor.visit_str(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_module_ref<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsModuleRef,
    _parent: &dyn Node,
) {
    {
        match n {
            TsModuleRef::TsEntityName { 0: _0 } => {
                _visitor.visit_ts_entity_name(_0, _parent as _);
            }
            TsModuleRef::TsExternalModuleRef { 0: _0 } => {
                _visitor.visit_ts_external_module_ref(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_namespace_body<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsNamespaceBody,
    _parent: &dyn Node,
) {
    {
        match n {
            TsNamespaceBody::TsModuleBlock { 0: _0 } => {
                _visitor.visit_ts_module_block(_0, _parent as _);
            }
            TsNamespaceBody::TsNamespaceDecl { 0: _0 } => {
                _visitor.visit_ts_namespace_decl(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_namespace_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsNamespaceDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsNamespaceDecl {
                span,
                declare,
                global,
                id,
                body,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(id, _parent as _);
                _visitor.visit_ts_namespace_body(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_namespace_export_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsNamespaceExportDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsNamespaceExportDecl { span, id } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(id, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_non_null_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsNonNullExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            TsNonNullExpr { span, expr } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_optional_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsOptionalType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsOptionalType { span, type_ann } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_param_prop<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsParamProp,
    _parent: &dyn Node,
) {
    {
        match n {
            TsParamProp {
                span,
                decorators,
                accessibility,
                readonly,
                param,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_decorators(decorators, _parent as _);
                _visitor.visit_opt_accessibility(accessibility.as_ref(), _parent as _);
                _visitor.visit_ts_param_prop_param(param, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_param_prop_param<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsParamPropParam,
    _parent: &dyn Node,
) {
    {
        match n {
            TsParamPropParam::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
            TsParamPropParam::Assign { 0: _0 } => {
                _visitor.visit_assign_pat(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_parenthesized_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsParenthesizedType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsParenthesizedType { span, type_ann } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_property_signature<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsPropertySignature,
    _parent: &dyn Node,
) {
    {
        match n {
            TsPropertySignature {
                span,
                readonly,
                key,
                computed,
                optional,
                init,
                params,
                type_ann,
                type_params,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(key, _parent as _);
                _visitor.visit_opt_expr(init.as_ref(), _parent as _);
                _visitor.visit_ts_fn_params(params, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_qualified_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsQualifiedName,
    _parent: &dyn Node,
) {
    {
        match n {
            TsQualifiedName { left, right } => {
                _visitor.visit_ts_entity_name(left, _parent as _);
                _visitor.visit_ident(right, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_rest_type<V: ?Sized + Visit>(_visitor: &mut V, n: &TsRestType, _parent: &dyn Node) {
    {
        match n {
            TsRestType { span, type_ann } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_signature_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsSignatureDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsSignatureDecl::TsCallSignatureDecl { 0: _0 } => {
                _visitor.visit_ts_call_signature_decl(_0, _parent as _);
            }
            TsSignatureDecl::TsConstructSignatureDecl { 0: _0 } => {
                _visitor.visit_ts_construct_signature_decl(_0, _parent as _);
            }
            TsSignatureDecl::TsMethodSignature { 0: _0 } => {
                _visitor.visit_ts_method_signature(_0, _parent as _);
            }
            TsSignatureDecl::TsFnType { 0: _0 } => {
                _visitor.visit_ts_fn_type(_0, _parent as _);
            }
            TsSignatureDecl::TsConstructorType { 0: _0 } => {
                _visitor.visit_ts_constructor_type(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_this_type<V: ?Sized + Visit>(_visitor: &mut V, n: &TsThisType, _parent: &dyn Node) {
    {
        match n {
            TsThisType { span } => {
                _visitor.visit_span(span, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_this_type_or_ident<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsThisTypeOrIdent,
    _parent: &dyn Node,
) {
    {
        match n {
            TsThisTypeOrIdent::TsThisType { 0: _0 } => {
                _visitor.visit_ts_this_type(_0, _parent as _);
            }
            TsThisTypeOrIdent::Ident { 0: _0 } => {
                _visitor.visit_ident(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_tuple_element<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTupleElement,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTupleElement { span, label, ty } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_ident(label.as_ref(), _parent as _);
                _visitor.visit_ts_type(ty, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_tuple_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTupleType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTupleType { span, elem_types } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_tuple_elements(elem_types, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type<V: ?Sized + Visit>(_visitor: &mut V, n: &TsType, _parent: &dyn Node) {
    {
        match n {
            TsType::TsKeywordType { 0: _0 } => {
                _visitor.visit_ts_keyword_type(_0, _parent as _);
            }
            TsType::TsThisType { 0: _0 } => {
                _visitor.visit_ts_this_type(_0, _parent as _);
            }
            TsType::TsFnOrConstructorType { 0: _0 } => {
                _visitor.visit_ts_fn_or_constructor_type(_0, _parent as _);
            }
            TsType::TsTypeRef { 0: _0 } => {
                _visitor.visit_ts_type_ref(_0, _parent as _);
            }
            TsType::TsTypeQuery { 0: _0 } => {
                _visitor.visit_ts_type_query(_0, _parent as _);
            }
            TsType::TsTypeLit { 0: _0 } => {
                _visitor.visit_ts_type_lit(_0, _parent as _);
            }
            TsType::TsArrayType { 0: _0 } => {
                _visitor.visit_ts_array_type(_0, _parent as _);
            }
            TsType::TsTupleType { 0: _0 } => {
                _visitor.visit_ts_tuple_type(_0, _parent as _);
            }
            TsType::TsOptionalType { 0: _0 } => {
                _visitor.visit_ts_optional_type(_0, _parent as _);
            }
            TsType::TsRestType { 0: _0 } => {
                _visitor.visit_ts_rest_type(_0, _parent as _);
            }
            TsType::TsUnionOrIntersectionType { 0: _0 } => {
                _visitor.visit_ts_union_or_intersection_type(_0, _parent as _);
            }
            TsType::TsConditionalType { 0: _0 } => {
                _visitor.visit_ts_conditional_type(_0, _parent as _);
            }
            TsType::TsInferType { 0: _0 } => {
                _visitor.visit_ts_infer_type(_0, _parent as _);
            }
            TsType::TsParenthesizedType { 0: _0 } => {
                _visitor.visit_ts_parenthesized_type(_0, _parent as _);
            }
            TsType::TsTypeOperator { 0: _0 } => {
                _visitor.visit_ts_type_operator(_0, _parent as _);
            }
            TsType::TsIndexedAccessType { 0: _0 } => {
                _visitor.visit_ts_indexed_access_type(_0, _parent as _);
            }
            TsType::TsMappedType { 0: _0 } => {
                _visitor.visit_ts_mapped_type(_0, _parent as _);
            }
            TsType::TsLitType { 0: _0 } => {
                _visitor.visit_ts_lit_type(_0, _parent as _);
            }
            TsType::TsTypePredicate { 0: _0 } => {
                _visitor.visit_ts_type_predicate(_0, _parent as _);
            }
            TsType::TsImportType { 0: _0 } => {
                _visitor.visit_ts_import_type(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_alias_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeAliasDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeAliasDecl {
                span,
                declare,
                id,
                type_params,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(id, _parent as _);
                _visitor.visit_opt_ts_type_param_decl(type_params.as_ref(), _parent as _);
                _visitor.visit_ts_type(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_ann<V: ?Sized + Visit>(_visitor: &mut V, n: &TsTypeAnn, _parent: &dyn Node) {
    {
        match n {
            TsTypeAnn { span, type_ann } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_assertion<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeAssertion,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeAssertion {
                span,
                expr,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
                _visitor.visit_ts_type(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_cast_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeCastExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeCastExpr {
                span,
                expr,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(expr, _parent as _);
                _visitor.visit_ts_type_ann(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_element<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeElement,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeElement::TsCallSignatureDecl { 0: _0 } => {
                _visitor.visit_ts_call_signature_decl(_0, _parent as _);
            }
            TsTypeElement::TsConstructSignatureDecl { 0: _0 } => {
                _visitor.visit_ts_construct_signature_decl(_0, _parent as _);
            }
            TsTypeElement::TsPropertySignature { 0: _0 } => {
                _visitor.visit_ts_property_signature(_0, _parent as _);
            }
            TsTypeElement::TsMethodSignature { 0: _0 } => {
                _visitor.visit_ts_method_signature(_0, _parent as _);
            }
            TsTypeElement::TsIndexSignature { 0: _0 } => {
                _visitor.visit_ts_index_signature(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_lit<V: ?Sized + Visit>(_visitor: &mut V, n: &TsTypeLit, _parent: &dyn Node) {
    {
        match n {
            TsTypeLit { span, members } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type_elements(members, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_operator<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeOperator,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeOperator { span, op, type_ann } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type_operator_op(op, _parent as _);
                _visitor.visit_ts_type(type_ann, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_operator_op<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeOperatorOp,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeOperatorOp::KeyOf {} => {}
            TsTypeOperatorOp::Unique {} => {}
            TsTypeOperatorOp::ReadOnly {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_param<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeParam,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeParam {
                span,
                name,
                constraint,
                default,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ident(name, _parent as _);
                _visitor.visit_opt_ts_type(constraint.as_ref(), _parent as _);
                _visitor.visit_opt_ts_type(default.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_param_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeParamDecl,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeParamDecl { span, params } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type_params(params, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_param_instantiation<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeParamInstantiation,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeParamInstantiation { span, params } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_types(params, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_predicate<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypePredicate,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypePredicate {
                span,
                asserts,
                param_name,
                type_ann,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_this_type_or_ident(param_name, _parent as _);
                _visitor.visit_opt_ts_type_ann(type_ann.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_query<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeQuery,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeQuery { span, expr_name } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_type_query_expr(expr_name, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_query_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsTypeQueryExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            TsTypeQueryExpr::TsEntityName { 0: _0 } => {
                _visitor.visit_ts_entity_name(_0, _parent as _);
            }
            TsTypeQueryExpr::Import { 0: _0 } => {
                _visitor.visit_ts_import_type(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_ref<V: ?Sized + Visit>(_visitor: &mut V, n: &TsTypeRef, _parent: &dyn Node) {
    {
        match n {
            TsTypeRef {
                span,
                type_name,
                type_params,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_entity_name(type_name, _parent as _);
                _visitor.visit_opt_ts_type_param_instantiation(type_params.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_union_or_intersection_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsUnionOrIntersectionType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsUnionOrIntersectionType::TsUnionType { 0: _0 } => {
                _visitor.visit_ts_union_type(_0, _parent as _);
            }
            TsUnionOrIntersectionType::TsIntersectionType { 0: _0 } => {
                _visitor.visit_ts_intersection_type(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_union_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &TsUnionType,
    _parent: &dyn Node,
) {
    {
        match n {
            TsUnionType { span, types } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_ts_types(types, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_unary_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &UnaryExpr, _parent: &dyn Node) {
    {
        match n {
            UnaryExpr { span, op, arg } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_unary_op(op, _parent as _);
                _visitor.visit_expr(arg, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_unary_op<V: ?Sized + Visit>(_visitor: &mut V, n: &UnaryOp, _parent: &dyn Node) {
    {
        match n {
            UnaryOp::Minus {} => {}
            UnaryOp::Plus {} => {}
            UnaryOp::Bang {} => {}
            UnaryOp::Tilde {} => {}
            UnaryOp::TypeOf {} => {}
            UnaryOp::Void {} => {}
            UnaryOp::Delete {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_update_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &UpdateExpr, _parent: &dyn Node) {
    {
        match n {
            UpdateExpr {
                span,
                op,
                prefix,
                arg,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_update_op(op, _parent as _);
                _visitor.visit_expr(arg, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_update_op<V: ?Sized + Visit>(_visitor: &mut V, n: &UpdateOp, _parent: &dyn Node) {
    {
        match n {
            UpdateOp::PlusPlus {} => {}
            UpdateOp::MinusMinus {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_var_decl<V: ?Sized + Visit>(_visitor: &mut V, n: &VarDecl, _parent: &dyn Node) {
    {
        match n {
            VarDecl {
                span,
                kind,
                declare,
                decls,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_var_decl_kind(kind, _parent as _);
                _visitor.visit_var_declarators(decls, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_var_decl_kind<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &VarDeclKind,
    _parent: &dyn Node,
) {
    {
        match n {
            VarDeclKind::Var {} => {}
            VarDeclKind::Let {} => {}
            VarDeclKind::Const {} => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_var_decl_or_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &VarDeclOrExpr,
    _parent: &dyn Node,
) {
    {
        match n {
            VarDeclOrExpr::VarDecl { 0: _0 } => {
                _visitor.visit_var_decl(_0, _parent as _);
            }
            VarDeclOrExpr::Expr { 0: _0 } => {
                _visitor.visit_expr(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_var_decl_or_pat<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &VarDeclOrPat,
    _parent: &dyn Node,
) {
    {
        match n {
            VarDeclOrPat::VarDecl { 0: _0 } => {
                _visitor.visit_var_decl(_0, _parent as _);
            }
            VarDeclOrPat::Pat { 0: _0 } => {
                _visitor.visit_pat(_0, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_var_declarator<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &VarDeclarator,
    _parent: &dyn Node,
) {
    {
        match n {
            VarDeclarator {
                span,
                name,
                init,
                definite,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_pat(name, _parent as _);
                _visitor.visit_opt_expr(init.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_while_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &WhileStmt, _parent: &dyn Node) {
    {
        match n {
            WhileStmt { span, test, body } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(test, _parent as _);
                _visitor.visit_stmt(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_with_stmt<V: ?Sized + Visit>(_visitor: &mut V, n: &WithStmt, _parent: &dyn Node) {
    {
        match n {
            WithStmt { span, obj, body } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_expr(obj, _parent as _);
                _visitor.visit_stmt(body, _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_yield_expr<V: ?Sized + Visit>(_visitor: &mut V, n: &YieldExpr, _parent: &dyn Node) {
    {
        match n {
            YieldExpr {
                span,
                arg,
                delegate,
            } => {
                _visitor.visit_span(span, _parent as _);
                _visitor.visit_opt_expr(arg.as_ref(), _parent as _);
            }
        }
    }
}
#[allow(unused_variables)]
pub fn visit_span<V: ?Sized + Visit>(_visitor: &mut V, n: &Span, _parent: &dyn Node) {
    {}
}
#[allow(unused_variables)]
pub fn visit_decorators<V: ?Sized + Visit>(_visitor: &mut V, n: &[Decorator], _parent: &dyn Node) {
    {
        n.iter().for_each(|v| _visitor.visit_decorator(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_class_members<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[ClassMember],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_class_member(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&Box<Expr>>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_expr(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_opt_ts_type_param_decl<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&TsTypeParamDecl>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_ts_type_param_decl(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_opt_ts_type_param_instantiation<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&TsTypeParamInstantiation>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_ts_type_param_instantiation(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_expr_with_type_args_vec<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[TsExprWithTypeArgs],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_ts_expr_with_type_args(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_ts_type_ann<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&TsTypeAnn>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_ts_type_ann(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_opt_accessibility<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&Accessibility>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_accessibility(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_param_or_ts_param_props<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[ParamOrTsParamProp],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_param_or_ts_param_prop(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_block_stmt<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&BlockStmt>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_block_stmt(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_var_declarators<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[VarDeclarator],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_var_declarator(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_vec_expr_or_spreads<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[Option<ExprOrSpread>],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_opt_expr_or_spread(v.as_ref(), _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_prop_or_spreads<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[PropOrSpread],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_prop_or_spread(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_ident<V: ?Sized + Visit>(_visitor: &mut V, n: Option<&Ident>, _parent: &dyn Node) {
    {
        match n {
            Some(n) => _visitor.visit_ident(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_expr_or_spreads<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[ExprOrSpread],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_expr_or_spread(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_expr_or_spreads<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&[ExprOrSpread]>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_expr_or_spreads(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_exprs<V: ?Sized + Visit>(_visitor: &mut V, n: &[Box<Expr>], _parent: &dyn Node) {
    {
        n.iter().for_each(|v| _visitor.visit_expr(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_pats<V: ?Sized + Visit>(_visitor: &mut V, n: &[Pat], _parent: &dyn Node) {
    {
        n.iter().for_each(|v| _visitor.visit_pat(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_tpl_elements<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[TplElement],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_tpl_element(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_str<V: ?Sized + Visit>(_visitor: &mut V, n: Option<&Str>, _parent: &dyn Node) {
    {
        match n {
            Some(n) => _visitor.visit_str(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_opt_span<V: ?Sized + Visit>(_visitor: &mut V, n: Option<&Span>, _parent: &dyn Node) {
    {
        match n {
            Some(n) => _visitor.visit_span(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_params<V: ?Sized + Visit>(_visitor: &mut V, n: &[Param], _parent: &dyn Node) {
    {
        n.iter().for_each(|v| _visitor.visit_param(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_js_word<V: ?Sized + Visit>(_visitor: &mut V, n: &JsWord, _parent: &dyn Node) {
    {}
}
#[allow(unused_variables)]
pub fn visit_jsx_attr_or_spreads<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[JSXAttrOrSpread],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_jsx_attr_or_spread(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_jsx_attr_value<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&JSXAttrValue>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_jsx_attr_value(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_jsx_element_children<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[JSXElementChild],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_jsx_element_child(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_jsx_closing_element<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&JSXClosingElement>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_jsx_closing_element(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_big_int_value<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &BigIntValue,
    _parent: &dyn Node,
) {
    {}
}
#[allow(unused_variables)]
pub fn visit_module_items<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[ModuleItem],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_module_item(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_js_word<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&JsWord>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_js_word(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_stmts<V: ?Sized + Visit>(_visitor: &mut V, n: &[Stmt], _parent: &dyn Node) {
    {
        n.iter().for_each(|v| _visitor.visit_stmt(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_import_specifiers<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[ImportSpecifier],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_import_specifier(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_export_specifiers<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[ExportSpecifier],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_export_specifier(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_vec_pats<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[Option<Pat>],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_opt_pat(v.as_ref(), _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_object_pat_props<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[ObjectPatProp],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_object_pat_prop(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_stmt<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&Box<Stmt>>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_stmt(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_switch_cases<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[SwitchCase],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_switch_case(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_catch_clause<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&CatchClause>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_catch_clause(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_opt_var_decl_or_expr<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&VarDeclOrExpr>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_var_decl_or_expr(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_opt_pat<V: ?Sized + Visit>(_visitor: &mut V, n: Option<&Pat>, _parent: &dyn Node) {
    {
        match n {
            Some(n) => _visitor.visit_pat(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_params<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[TsTypeParam],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_ts_type_param(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_ts_type<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&Box<TsType>>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_ts_type(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_types<V: ?Sized + Visit>(_visitor: &mut V, n: &[Box<TsType>], _parent: &dyn Node) {
    {
        n.iter().for_each(|v| _visitor.visit_ts_type(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_ts_fn_params<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[TsFnParam],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_ts_fn_param(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_ts_entity_name<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&TsEntityName>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_ts_entity_name(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_type_elements<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[TsTypeElement],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_ts_type_element(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_ts_tuple_elements<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[TsTupleElement],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_ts_tuple_element(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_true_plus_minus<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&TruePlusMinus>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_true_plus_minus(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_ts_enum_members<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: &[TsEnumMember],
    _parent: &dyn Node,
) {
    {
        n.iter()
            .for_each(|v| _visitor.visit_ts_enum_member(v, _parent))
    }
}
#[allow(unused_variables)]
pub fn visit_opt_ts_namespace_body<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&TsNamespaceBody>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_ts_namespace_body(n, _parent),
            None => {}
        }
    }
}
#[allow(unused_variables)]
pub fn visit_opt_expr_or_spread<V: ?Sized + Visit>(
    _visitor: &mut V,
    n: Option<&ExprOrSpread>,
    _parent: &dyn Node,
) {
    {
        match n {
            Some(n) => _visitor.visit_expr_or_spread(n, _parent),
            None => {}
        }
    }
}
pub trait Visit {
    #[allow(unused_variables)]
    fn visit_accessibility(&mut self, n: &Accessibility, _parent: &dyn Node) {
        visit_accessibility(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_array_lit(&mut self, n: &ArrayLit, _parent: &dyn Node) {
        visit_array_lit(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_array_pat(&mut self, n: &ArrayPat, _parent: &dyn Node) {
        visit_array_pat(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _parent: &dyn Node) {
        visit_arrow_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_assign_expr(&mut self, n: &AssignExpr, _parent: &dyn Node) {
        visit_assign_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_assign_op(&mut self, n: &AssignOp, _parent: &dyn Node) {
        visit_assign_op(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_assign_pat(&mut self, n: &AssignPat, _parent: &dyn Node) {
        visit_assign_pat(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp, _parent: &dyn Node) {
        visit_assign_pat_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_assign_prop(&mut self, n: &AssignProp, _parent: &dyn Node) {
        visit_assign_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_await_expr(&mut self, n: &AwaitExpr, _parent: &dyn Node) {
        visit_await_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_big_int(&mut self, n: &BigInt, _parent: &dyn Node) {
        visit_big_int(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_bin_expr(&mut self, n: &BinExpr, _parent: &dyn Node) {
        visit_bin_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_binary_op(&mut self, n: &BinaryOp, _parent: &dyn Node) {
        visit_binary_op(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_block_stmt(&mut self, n: &BlockStmt, _parent: &dyn Node) {
        visit_block_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr, _parent: &dyn Node) {
        visit_block_stmt_or_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_bool(&mut self, n: &Bool, _parent: &dyn Node) {
        visit_bool(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_break_stmt(&mut self, n: &BreakStmt, _parent: &dyn Node) {
        visit_break_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_call_expr(&mut self, n: &CallExpr, _parent: &dyn Node) {
        visit_call_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_catch_clause(&mut self, n: &CatchClause, _parent: &dyn Node) {
        visit_catch_clause(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_class(&mut self, n: &Class, _parent: &dyn Node) {
        visit_class(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_class_decl(&mut self, n: &ClassDecl, _parent: &dyn Node) {
        visit_class_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_class_expr(&mut self, n: &ClassExpr, _parent: &dyn Node) {
        visit_class_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_class_member(&mut self, n: &ClassMember, _parent: &dyn Node) {
        visit_class_member(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_class_method(&mut self, n: &ClassMethod, _parent: &dyn Node) {
        visit_class_method(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_class_prop(&mut self, n: &ClassProp, _parent: &dyn Node) {
        visit_class_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_computed_prop_name(&mut self, n: &ComputedPropName, _parent: &dyn Node) {
        visit_computed_prop_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_cond_expr(&mut self, n: &CondExpr, _parent: &dyn Node) {
        visit_cond_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_constructor(&mut self, n: &Constructor, _parent: &dyn Node) {
        visit_constructor(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_continue_stmt(&mut self, n: &ContinueStmt, _parent: &dyn Node) {
        visit_continue_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt, _parent: &dyn Node) {
        visit_debugger_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_decl(&mut self, n: &Decl, _parent: &dyn Node) {
        visit_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_decorator(&mut self, n: &Decorator, _parent: &dyn Node) {
        visit_decorator(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_default_decl(&mut self, n: &DefaultDecl, _parent: &dyn Node) {
        visit_default_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt, _parent: &dyn Node) {
        visit_do_while_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_empty_stmt(&mut self, n: &EmptyStmt, _parent: &dyn Node) {
        visit_empty_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_all(&mut self, n: &ExportAll, _parent: &dyn Node) {
        visit_export_all(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_decl(&mut self, n: &ExportDecl, _parent: &dyn Node) {
        visit_export_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl, _parent: &dyn Node) {
        visit_export_default_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr, _parent: &dyn Node) {
        visit_export_default_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier, _parent: &dyn Node) {
        visit_export_default_specifier(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _parent: &dyn Node) {
        visit_export_named_specifier(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_namespace_specifier(
        &mut self,
        n: &ExportNamespaceSpecifier,
        _parent: &dyn Node,
    ) {
        visit_export_namespace_specifier(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_specifier(&mut self, n: &ExportSpecifier, _parent: &dyn Node) {
        visit_export_specifier(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_expr(&mut self, n: &Expr, _parent: &dyn Node) {
        visit_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread, _parent: &dyn Node) {
        visit_expr_or_spread(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_expr_or_super(&mut self, n: &ExprOrSuper, _parent: &dyn Node) {
        visit_expr_or_super(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_expr_stmt(&mut self, n: &ExprStmt, _parent: &dyn Node) {
        visit_expr_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_fn_decl(&mut self, n: &FnDecl, _parent: &dyn Node) {
        visit_fn_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_fn_expr(&mut self, n: &FnExpr, _parent: &dyn Node) {
        visit_fn_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _parent: &dyn Node) {
        visit_for_in_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _parent: &dyn Node) {
        visit_for_of_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_for_stmt(&mut self, n: &ForStmt, _parent: &dyn Node) {
        visit_for_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_function(&mut self, n: &Function, _parent: &dyn Node) {
        visit_function(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_getter_prop(&mut self, n: &GetterProp, _parent: &dyn Node) {
        visit_getter_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ident(&mut self, n: &Ident, _parent: &dyn Node) {
        visit_ident(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_if_stmt(&mut self, n: &IfStmt, _parent: &dyn Node) {
        visit_if_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_import_decl(&mut self, n: &ImportDecl, _parent: &dyn Node) {
        visit_import_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier, _parent: &dyn Node) {
        visit_import_default_specifier(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier, _parent: &dyn Node) {
        visit_import_named_specifier(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_import_specifier(&mut self, n: &ImportSpecifier, _parent: &dyn Node) {
        visit_import_specifier(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier, _parent: &dyn Node) {
        visit_import_star_as_specifier(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_invalid(&mut self, n: &Invalid, _parent: &dyn Node) {
        visit_invalid(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_attr(&mut self, n: &JSXAttr, _parent: &dyn Node) {
        visit_jsx_attr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName, _parent: &dyn Node) {
        visit_jsx_attr_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread, _parent: &dyn Node) {
        visit_jsx_attr_or_spread(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue, _parent: &dyn Node) {
        visit_jsx_attr_value(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement, _parent: &dyn Node) {
        visit_jsx_closing_element(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment, _parent: &dyn Node) {
        visit_jsx_closing_fragment(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_element(&mut self, n: &JSXElement, _parent: &dyn Node) {
        visit_jsx_element(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_element_child(&mut self, n: &JSXElementChild, _parent: &dyn Node) {
        visit_jsx_element_child(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_element_name(&mut self, n: &JSXElementName, _parent: &dyn Node) {
        visit_jsx_element_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr, _parent: &dyn Node) {
        visit_jsx_empty_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_expr(&mut self, n: &JSXExpr, _parent: &dyn Node) {
        visit_jsx_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer, _parent: &dyn Node) {
        visit_jsx_expr_container(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_fragment(&mut self, n: &JSXFragment, _parent: &dyn Node) {
        visit_jsx_fragment(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr, _parent: &dyn Node) {
        visit_jsx_member_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName, _parent: &dyn Node) {
        visit_jsx_namespaced_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_object(&mut self, n: &JSXObject, _parent: &dyn Node) {
        visit_jsx_object(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement, _parent: &dyn Node) {
        visit_jsx_opening_element(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment, _parent: &dyn Node) {
        visit_jsx_opening_fragment(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild, _parent: &dyn Node) {
        visit_jsx_spread_child(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_text(&mut self, n: &JSXText, _parent: &dyn Node) {
        visit_jsx_text(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp, _parent: &dyn Node) {
        visit_key_value_pat_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_key_value_prop(&mut self, n: &KeyValueProp, _parent: &dyn Node) {
        visit_key_value_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_labeled_stmt(&mut self, n: &LabeledStmt, _parent: &dyn Node) {
        visit_labeled_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_lit(&mut self, n: &Lit, _parent: &dyn Node) {
        visit_lit(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_member_expr(&mut self, n: &MemberExpr, _parent: &dyn Node) {
        visit_member_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr, _parent: &dyn Node) {
        visit_meta_prop_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_method_kind(&mut self, n: &MethodKind, _parent: &dyn Node) {
        visit_method_kind(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_method_prop(&mut self, n: &MethodProp, _parent: &dyn Node) {
        visit_method_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_module(&mut self, n: &Module, _parent: &dyn Node) {
        visit_module(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_module_decl(&mut self, n: &ModuleDecl, _parent: &dyn Node) {
        visit_module_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_module_item(&mut self, n: &ModuleItem, _parent: &dyn Node) {
        visit_module_item(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_named_export(&mut self, n: &NamedExport, _parent: &dyn Node) {
        visit_named_export(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_new_expr(&mut self, n: &NewExpr, _parent: &dyn Node) {
        visit_new_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_null(&mut self, n: &Null, _parent: &dyn Node) {
        visit_null(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_number(&mut self, n: &Number, _parent: &dyn Node) {
        visit_number(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_object_lit(&mut self, n: &ObjectLit, _parent: &dyn Node) {
        visit_object_lit(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_object_pat(&mut self, n: &ObjectPat, _parent: &dyn Node) {
        visit_object_pat(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp, _parent: &dyn Node) {
        visit_object_pat_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr, _parent: &dyn Node) {
        visit_opt_chain_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_param(&mut self, n: &Param, _parent: &dyn Node) {
        visit_param(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp, _parent: &dyn Node) {
        visit_param_or_ts_param_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_paren_expr(&mut self, n: &ParenExpr, _parent: &dyn Node) {
        visit_paren_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_pat(&mut self, n: &Pat, _parent: &dyn Node) {
        visit_pat(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_pat_or_expr(&mut self, n: &PatOrExpr, _parent: &dyn Node) {
        visit_pat_or_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_private_method(&mut self, n: &PrivateMethod, _parent: &dyn Node) {
        visit_private_method(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_private_name(&mut self, n: &PrivateName, _parent: &dyn Node) {
        visit_private_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_private_prop(&mut self, n: &PrivateProp, _parent: &dyn Node) {
        visit_private_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_program(&mut self, n: &Program, _parent: &dyn Node) {
        visit_program(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_prop(&mut self, n: &Prop, _parent: &dyn Node) {
        visit_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_prop_name(&mut self, n: &PropName, _parent: &dyn Node) {
        visit_prop_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_prop_or_spread(&mut self, n: &PropOrSpread, _parent: &dyn Node) {
        visit_prop_or_spread(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_regex(&mut self, n: &Regex, _parent: &dyn Node) {
        visit_regex(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_rest_pat(&mut self, n: &RestPat, _parent: &dyn Node) {
        visit_rest_pat(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_return_stmt(&mut self, n: &ReturnStmt, _parent: &dyn Node) {
        visit_return_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_script(&mut self, n: &Script, _parent: &dyn Node) {
        visit_script(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_seq_expr(&mut self, n: &SeqExpr, _parent: &dyn Node) {
        visit_seq_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_setter_prop(&mut self, n: &SetterProp, _parent: &dyn Node) {
        visit_setter_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_spread_element(&mut self, n: &SpreadElement, _parent: &dyn Node) {
        visit_spread_element(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_stmt(&mut self, n: &Stmt, _parent: &dyn Node) {
        visit_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_str(&mut self, n: &Str, _parent: &dyn Node) {
        visit_str(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_super(&mut self, n: &Super, _parent: &dyn Node) {
        visit_super(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_switch_case(&mut self, n: &SwitchCase, _parent: &dyn Node) {
        visit_switch_case(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_switch_stmt(&mut self, n: &SwitchStmt, _parent: &dyn Node) {
        visit_switch_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_tagged_tpl(&mut self, n: &TaggedTpl, _parent: &dyn Node) {
        visit_tagged_tpl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_this_expr(&mut self, n: &ThisExpr, _parent: &dyn Node) {
        visit_this_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_throw_stmt(&mut self, n: &ThrowStmt, _parent: &dyn Node) {
        visit_throw_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_tpl(&mut self, n: &Tpl, _parent: &dyn Node) {
        visit_tpl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_tpl_element(&mut self, n: &TplElement, _parent: &dyn Node) {
        visit_tpl_element(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_true_plus_minus(&mut self, n: &TruePlusMinus, _parent: &dyn Node) {
        visit_true_plus_minus(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_try_stmt(&mut self, n: &TryStmt, _parent: &dyn Node) {
        visit_try_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_array_type(&mut self, n: &TsArrayType, _parent: &dyn Node) {
        visit_ts_array_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_as_expr(&mut self, n: &TsAsExpr, _parent: &dyn Node) {
        visit_ts_as_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl, _parent: &dyn Node) {
        visit_ts_call_signature_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType, _parent: &dyn Node) {
        visit_ts_conditional_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion, _parent: &dyn Node) {
        visit_ts_const_assertion(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_construct_signature_decl(
        &mut self,
        n: &TsConstructSignatureDecl,
        _parent: &dyn Node,
    ) {
        visit_ts_construct_signature_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType, _parent: &dyn Node) {
        visit_ts_constructor_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_entity_name(&mut self, n: &TsEntityName, _parent: &dyn Node) {
        visit_ts_entity_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl, _parent: &dyn Node) {
        visit_ts_enum_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_enum_member(&mut self, n: &TsEnumMember, _parent: &dyn Node) {
        visit_ts_enum_member(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId, _parent: &dyn Node) {
        visit_ts_enum_member_id(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment, _parent: &dyn Node) {
        visit_ts_export_assignment(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs, _parent: &dyn Node) {
        visit_ts_expr_with_type_args(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef, _parent: &dyn Node) {
        visit_ts_external_module_ref(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType, _parent: &dyn Node) {
        visit_ts_fn_or_constructor_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_fn_param(&mut self, n: &TsFnParam, _parent: &dyn Node) {
        visit_ts_fn_param(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_fn_type(&mut self, n: &TsFnType, _parent: &dyn Node) {
        visit_ts_fn_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl, _parent: &dyn Node) {
        visit_ts_import_equals_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_import_type(&mut self, n: &TsImportType, _parent: &dyn Node) {
        visit_ts_import_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature, _parent: &dyn Node) {
        visit_ts_index_signature(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType, _parent: &dyn Node) {
        visit_ts_indexed_access_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_infer_type(&mut self, n: &TsInferType, _parent: &dyn Node) {
        visit_ts_infer_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody, _parent: &dyn Node) {
        visit_ts_interface_body(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl, _parent: &dyn Node) {
        visit_ts_interface_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType, _parent: &dyn Node) {
        visit_ts_intersection_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType, _parent: &dyn Node) {
        visit_ts_keyword_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_keyword_type_kind(&mut self, n: &TsKeywordTypeKind, _parent: &dyn Node) {
        visit_ts_keyword_type_kind(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_lit(&mut self, n: &TsLit, _parent: &dyn Node) {
        visit_ts_lit(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_lit_type(&mut self, n: &TsLitType, _parent: &dyn Node) {
        visit_ts_lit_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_mapped_type(&mut self, n: &TsMappedType, _parent: &dyn Node) {
        visit_ts_mapped_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature, _parent: &dyn Node) {
        visit_ts_method_signature(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_module_block(&mut self, n: &TsModuleBlock, _parent: &dyn Node) {
        visit_ts_module_block(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl, _parent: &dyn Node) {
        visit_ts_module_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_module_name(&mut self, n: &TsModuleName, _parent: &dyn Node) {
        visit_ts_module_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_module_ref(&mut self, n: &TsModuleRef, _parent: &dyn Node) {
        visit_ts_module_ref(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody, _parent: &dyn Node) {
        visit_ts_namespace_body(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl, _parent: &dyn Node) {
        visit_ts_namespace_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl, _parent: &dyn Node) {
        visit_ts_namespace_export_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr, _parent: &dyn Node) {
        visit_ts_non_null_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_optional_type(&mut self, n: &TsOptionalType, _parent: &dyn Node) {
        visit_ts_optional_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_param_prop(&mut self, n: &TsParamProp, _parent: &dyn Node) {
        visit_ts_param_prop(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam, _parent: &dyn Node) {
        visit_ts_param_prop_param(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType, _parent: &dyn Node) {
        visit_ts_parenthesized_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature, _parent: &dyn Node) {
        visit_ts_property_signature(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName, _parent: &dyn Node) {
        visit_ts_qualified_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_rest_type(&mut self, n: &TsRestType, _parent: &dyn Node) {
        visit_ts_rest_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_signature_decl(&mut self, n: &TsSignatureDecl, _parent: &dyn Node) {
        visit_ts_signature_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_this_type(&mut self, n: &TsThisType, _parent: &dyn Node) {
        visit_ts_this_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent, _parent: &dyn Node) {
        visit_ts_this_type_or_ident(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement, _parent: &dyn Node) {
        visit_ts_tuple_element(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_tuple_type(&mut self, n: &TsTupleType, _parent: &dyn Node) {
        visit_ts_tuple_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type(&mut self, n: &TsType, _parent: &dyn Node) {
        visit_ts_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl, _parent: &dyn Node) {
        visit_ts_type_alias_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn, _parent: &dyn Node) {
        visit_ts_type_ann(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion, _parent: &dyn Node) {
        visit_ts_type_assertion(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_cast_expr(&mut self, n: &TsTypeCastExpr, _parent: &dyn Node) {
        visit_ts_type_cast_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_element(&mut self, n: &TsTypeElement, _parent: &dyn Node) {
        visit_ts_type_element(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_lit(&mut self, n: &TsTypeLit, _parent: &dyn Node) {
        visit_ts_type_lit(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator, _parent: &dyn Node) {
        visit_ts_type_operator(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_operator_op(&mut self, n: &TsTypeOperatorOp, _parent: &dyn Node) {
        visit_ts_type_operator_op(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_param(&mut self, n: &TsTypeParam, _parent: &dyn Node) {
        visit_ts_type_param(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl, _parent: &dyn Node) {
        visit_ts_type_param_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_param_instantiation(
        &mut self,
        n: &TsTypeParamInstantiation,
        _parent: &dyn Node,
    ) {
        visit_ts_type_param_instantiation(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate, _parent: &dyn Node) {
        visit_ts_type_predicate(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_query(&mut self, n: &TsTypeQuery, _parent: &dyn Node) {
        visit_ts_type_query(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr, _parent: &dyn Node) {
        visit_ts_type_query_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_ref(&mut self, n: &TsTypeRef, _parent: &dyn Node) {
        visit_ts_type_ref(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_union_or_intersection_type(
        &mut self,
        n: &TsUnionOrIntersectionType,
        _parent: &dyn Node,
    ) {
        visit_ts_union_or_intersection_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_union_type(&mut self, n: &TsUnionType, _parent: &dyn Node) {
        visit_ts_union_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_unary_expr(&mut self, n: &UnaryExpr, _parent: &dyn Node) {
        visit_unary_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_unary_op(&mut self, n: &UnaryOp, _parent: &dyn Node) {
        visit_unary_op(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_update_expr(&mut self, n: &UpdateExpr, _parent: &dyn Node) {
        visit_update_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_update_op(&mut self, n: &UpdateOp, _parent: &dyn Node) {
        visit_update_op(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_var_decl(&mut self, n: &VarDecl, _parent: &dyn Node) {
        visit_var_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_var_decl_kind(&mut self, n: &VarDeclKind, _parent: &dyn Node) {
        visit_var_decl_kind(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr, _parent: &dyn Node) {
        visit_var_decl_or_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_var_decl_or_pat(&mut self, n: &VarDeclOrPat, _parent: &dyn Node) {
        visit_var_decl_or_pat(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_var_declarator(&mut self, n: &VarDeclarator, _parent: &dyn Node) {
        visit_var_declarator(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_while_stmt(&mut self, n: &WhileStmt, _parent: &dyn Node) {
        visit_while_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_with_stmt(&mut self, n: &WithStmt, _parent: &dyn Node) {
        visit_with_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_yield_expr(&mut self, n: &YieldExpr, _parent: &dyn Node) {
        visit_yield_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_span(&mut self, n: &Span, _parent: &dyn Node) {
        visit_span(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_decorators(&mut self, n: &[Decorator], _parent: &dyn Node) {
        visit_decorators(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_class_members(&mut self, n: &[ClassMember], _parent: &dyn Node) {
        visit_class_members(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_expr(&mut self, n: Option<&Box<Expr>>, _parent: &dyn Node) {
        visit_opt_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_ts_type_param_decl(&mut self, n: Option<&TsTypeParamDecl>, _parent: &dyn Node) {
        visit_opt_ts_type_param_decl(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_ts_type_param_instantiation(
        &mut self,
        n: Option<&TsTypeParamInstantiation>,
        _parent: &dyn Node,
    ) {
        visit_opt_ts_type_param_instantiation(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_expr_with_type_args_vec(&mut self, n: &[TsExprWithTypeArgs], _parent: &dyn Node) {
        visit_ts_expr_with_type_args_vec(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_ts_type_ann(&mut self, n: Option<&TsTypeAnn>, _parent: &dyn Node) {
        visit_opt_ts_type_ann(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_accessibility(&mut self, n: Option<&Accessibility>, _parent: &dyn Node) {
        visit_opt_accessibility(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_param_or_ts_param_props(&mut self, n: &[ParamOrTsParamProp], _parent: &dyn Node) {
        visit_param_or_ts_param_props(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_block_stmt(&mut self, n: Option<&BlockStmt>, _parent: &dyn Node) {
        visit_opt_block_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_var_declarators(&mut self, n: &[VarDeclarator], _parent: &dyn Node) {
        visit_var_declarators(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_vec_expr_or_spreads(&mut self, n: &[Option<ExprOrSpread>], _parent: &dyn Node) {
        visit_opt_vec_expr_or_spreads(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_prop_or_spreads(&mut self, n: &[PropOrSpread], _parent: &dyn Node) {
        visit_prop_or_spreads(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_ident(&mut self, n: Option<&Ident>, _parent: &dyn Node) {
        visit_opt_ident(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_expr_or_spreads(&mut self, n: &[ExprOrSpread], _parent: &dyn Node) {
        visit_expr_or_spreads(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_expr_or_spreads(&mut self, n: Option<&[ExprOrSpread]>, _parent: &dyn Node) {
        visit_opt_expr_or_spreads(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_exprs(&mut self, n: &[Box<Expr>], _parent: &dyn Node) {
        visit_exprs(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_pats(&mut self, n: &[Pat], _parent: &dyn Node) {
        visit_pats(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_tpl_elements(&mut self, n: &[TplElement], _parent: &dyn Node) {
        visit_tpl_elements(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_str(&mut self, n: Option<&Str>, _parent: &dyn Node) {
        visit_opt_str(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_span(&mut self, n: Option<&Span>, _parent: &dyn Node) {
        visit_opt_span(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_params(&mut self, n: &[Param], _parent: &dyn Node) {
        visit_params(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_js_word(&mut self, n: &JsWord, _parent: &dyn Node) {
        visit_js_word(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_attr_or_spreads(&mut self, n: &[JSXAttrOrSpread], _parent: &dyn Node) {
        visit_jsx_attr_or_spreads(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_jsx_attr_value(&mut self, n: Option<&JSXAttrValue>, _parent: &dyn Node) {
        visit_opt_jsx_attr_value(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_jsx_element_children(&mut self, n: &[JSXElementChild], _parent: &dyn Node) {
        visit_jsx_element_children(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_jsx_closing_element(&mut self, n: Option<&JSXClosingElement>, _parent: &dyn Node) {
        visit_opt_jsx_closing_element(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_big_int_value(&mut self, n: &BigIntValue, _parent: &dyn Node) {
        visit_big_int_value(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_module_items(&mut self, n: &[ModuleItem], _parent: &dyn Node) {
        visit_module_items(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_js_word(&mut self, n: Option<&JsWord>, _parent: &dyn Node) {
        visit_opt_js_word(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_stmts(&mut self, n: &[Stmt], _parent: &dyn Node) {
        visit_stmts(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_import_specifiers(&mut self, n: &[ImportSpecifier], _parent: &dyn Node) {
        visit_import_specifiers(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_export_specifiers(&mut self, n: &[ExportSpecifier], _parent: &dyn Node) {
        visit_export_specifiers(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_vec_pats(&mut self, n: &[Option<Pat>], _parent: &dyn Node) {
        visit_opt_vec_pats(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_object_pat_props(&mut self, n: &[ObjectPatProp], _parent: &dyn Node) {
        visit_object_pat_props(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_stmt(&mut self, n: Option<&Box<Stmt>>, _parent: &dyn Node) {
        visit_opt_stmt(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_switch_cases(&mut self, n: &[SwitchCase], _parent: &dyn Node) {
        visit_switch_cases(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_catch_clause(&mut self, n: Option<&CatchClause>, _parent: &dyn Node) {
        visit_opt_catch_clause(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_var_decl_or_expr(&mut self, n: Option<&VarDeclOrExpr>, _parent: &dyn Node) {
        visit_opt_var_decl_or_expr(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_pat(&mut self, n: Option<&Pat>, _parent: &dyn Node) {
        visit_opt_pat(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_params(&mut self, n: &[TsTypeParam], _parent: &dyn Node) {
        visit_ts_type_params(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_ts_type(&mut self, n: Option<&Box<TsType>>, _parent: &dyn Node) {
        visit_opt_ts_type(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_types(&mut self, n: &[Box<TsType>], _parent: &dyn Node) {
        visit_ts_types(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_fn_params(&mut self, n: &[TsFnParam], _parent: &dyn Node) {
        visit_ts_fn_params(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_ts_entity_name(&mut self, n: Option<&TsEntityName>, _parent: &dyn Node) {
        visit_opt_ts_entity_name(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_type_elements(&mut self, n: &[TsTypeElement], _parent: &dyn Node) {
        visit_ts_type_elements(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_tuple_elements(&mut self, n: &[TsTupleElement], _parent: &dyn Node) {
        visit_ts_tuple_elements(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_true_plus_minus(&mut self, n: Option<&TruePlusMinus>, _parent: &dyn Node) {
        visit_opt_true_plus_minus(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_ts_enum_members(&mut self, n: &[TsEnumMember], _parent: &dyn Node) {
        visit_ts_enum_members(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_ts_namespace_body(&mut self, n: Option<&TsNamespaceBody>, _parent: &dyn Node) {
        visit_opt_ts_namespace_body(self, n, _parent)
    }
    #[allow(unused_variables)]
    fn visit_opt_expr_or_spread(&mut self, n: Option<&ExprOrSpread>, _parent: &dyn Node) {
        visit_opt_expr_or_spread(self, n, _parent)
    }
}
impl<'a, V> Visit for &'a mut V
where
    V: ?Sized + Visit,
{
    fn visit_class(&mut self, n: &Class, _parent: &dyn Node) {
        (**self).visit_class(n, _parent)
    }
    fn visit_class_member(&mut self, n: &ClassMember, _parent: &dyn Node) {
        (**self).visit_class_member(n, _parent)
    }
    fn visit_class_prop(&mut self, n: &ClassProp, _parent: &dyn Node) {
        (**self).visit_class_prop(n, _parent)
    }
    fn visit_private_prop(&mut self, n: &PrivateProp, _parent: &dyn Node) {
        (**self).visit_private_prop(n, _parent)
    }
    fn visit_class_method(&mut self, n: &ClassMethod, _parent: &dyn Node) {
        (**self).visit_class_method(n, _parent)
    }
    fn visit_private_method(&mut self, n: &PrivateMethod, _parent: &dyn Node) {
        (**self).visit_private_method(n, _parent)
    }
    fn visit_constructor(&mut self, n: &Constructor, _parent: &dyn Node) {
        (**self).visit_constructor(n, _parent)
    }
    fn visit_decorator(&mut self, n: &Decorator, _parent: &dyn Node) {
        (**self).visit_decorator(n, _parent)
    }
    fn visit_method_kind(&mut self, n: &MethodKind, _parent: &dyn Node) {
        (**self).visit_method_kind(n, _parent)
    }
    fn visit_decl(&mut self, n: &Decl, _parent: &dyn Node) {
        (**self).visit_decl(n, _parent)
    }
    fn visit_fn_decl(&mut self, n: &FnDecl, _parent: &dyn Node) {
        (**self).visit_fn_decl(n, _parent)
    }
    fn visit_class_decl(&mut self, n: &ClassDecl, _parent: &dyn Node) {
        (**self).visit_class_decl(n, _parent)
    }
    fn visit_var_decl(&mut self, n: &VarDecl, _parent: &dyn Node) {
        (**self).visit_var_decl(n, _parent)
    }
    fn visit_var_decl_kind(&mut self, n: &VarDeclKind, _parent: &dyn Node) {
        (**self).visit_var_decl_kind(n, _parent)
    }
    fn visit_var_declarator(&mut self, n: &VarDeclarator, _parent: &dyn Node) {
        (**self).visit_var_declarator(n, _parent)
    }
    fn visit_expr(&mut self, n: &Expr, _parent: &dyn Node) {
        (**self).visit_expr(n, _parent)
    }
    fn visit_this_expr(&mut self, n: &ThisExpr, _parent: &dyn Node) {
        (**self).visit_this_expr(n, _parent)
    }
    fn visit_array_lit(&mut self, n: &ArrayLit, _parent: &dyn Node) {
        (**self).visit_array_lit(n, _parent)
    }
    fn visit_object_lit(&mut self, n: &ObjectLit, _parent: &dyn Node) {
        (**self).visit_object_lit(n, _parent)
    }
    fn visit_prop_or_spread(&mut self, n: &PropOrSpread, _parent: &dyn Node) {
        (**self).visit_prop_or_spread(n, _parent)
    }
    fn visit_spread_element(&mut self, n: &SpreadElement, _parent: &dyn Node) {
        (**self).visit_spread_element(n, _parent)
    }
    fn visit_unary_expr(&mut self, n: &UnaryExpr, _parent: &dyn Node) {
        (**self).visit_unary_expr(n, _parent)
    }
    fn visit_update_expr(&mut self, n: &UpdateExpr, _parent: &dyn Node) {
        (**self).visit_update_expr(n, _parent)
    }
    fn visit_bin_expr(&mut self, n: &BinExpr, _parent: &dyn Node) {
        (**self).visit_bin_expr(n, _parent)
    }
    fn visit_fn_expr(&mut self, n: &FnExpr, _parent: &dyn Node) {
        (**self).visit_fn_expr(n, _parent)
    }
    fn visit_class_expr(&mut self, n: &ClassExpr, _parent: &dyn Node) {
        (**self).visit_class_expr(n, _parent)
    }
    fn visit_assign_expr(&mut self, n: &AssignExpr, _parent: &dyn Node) {
        (**self).visit_assign_expr(n, _parent)
    }
    fn visit_member_expr(&mut self, n: &MemberExpr, _parent: &dyn Node) {
        (**self).visit_member_expr(n, _parent)
    }
    fn visit_cond_expr(&mut self, n: &CondExpr, _parent: &dyn Node) {
        (**self).visit_cond_expr(n, _parent)
    }
    fn visit_call_expr(&mut self, n: &CallExpr, _parent: &dyn Node) {
        (**self).visit_call_expr(n, _parent)
    }
    fn visit_new_expr(&mut self, n: &NewExpr, _parent: &dyn Node) {
        (**self).visit_new_expr(n, _parent)
    }
    fn visit_seq_expr(&mut self, n: &SeqExpr, _parent: &dyn Node) {
        (**self).visit_seq_expr(n, _parent)
    }
    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _parent: &dyn Node) {
        (**self).visit_arrow_expr(n, _parent)
    }
    fn visit_yield_expr(&mut self, n: &YieldExpr, _parent: &dyn Node) {
        (**self).visit_yield_expr(n, _parent)
    }
    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr, _parent: &dyn Node) {
        (**self).visit_meta_prop_expr(n, _parent)
    }
    fn visit_await_expr(&mut self, n: &AwaitExpr, _parent: &dyn Node) {
        (**self).visit_await_expr(n, _parent)
    }
    fn visit_tpl(&mut self, n: &Tpl, _parent: &dyn Node) {
        (**self).visit_tpl(n, _parent)
    }
    fn visit_tagged_tpl(&mut self, n: &TaggedTpl, _parent: &dyn Node) {
        (**self).visit_tagged_tpl(n, _parent)
    }
    fn visit_tpl_element(&mut self, n: &TplElement, _parent: &dyn Node) {
        (**self).visit_tpl_element(n, _parent)
    }
    fn visit_paren_expr(&mut self, n: &ParenExpr, _parent: &dyn Node) {
        (**self).visit_paren_expr(n, _parent)
    }
    fn visit_expr_or_super(&mut self, n: &ExprOrSuper, _parent: &dyn Node) {
        (**self).visit_expr_or_super(n, _parent)
    }
    fn visit_super(&mut self, n: &Super, _parent: &dyn Node) {
        (**self).visit_super(n, _parent)
    }
    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread, _parent: &dyn Node) {
        (**self).visit_expr_or_spread(n, _parent)
    }
    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr, _parent: &dyn Node) {
        (**self).visit_block_stmt_or_expr(n, _parent)
    }
    fn visit_pat_or_expr(&mut self, n: &PatOrExpr, _parent: &dyn Node) {
        (**self).visit_pat_or_expr(n, _parent)
    }
    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr, _parent: &dyn Node) {
        (**self).visit_opt_chain_expr(n, _parent)
    }
    fn visit_function(&mut self, n: &Function, _parent: &dyn Node) {
        (**self).visit_function(n, _parent)
    }
    fn visit_param(&mut self, n: &Param, _parent: &dyn Node) {
        (**self).visit_param(n, _parent)
    }
    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp, _parent: &dyn Node) {
        (**self).visit_param_or_ts_param_prop(n, _parent)
    }
    fn visit_ident(&mut self, n: &Ident, _parent: &dyn Node) {
        (**self).visit_ident(n, _parent)
    }
    fn visit_private_name(&mut self, n: &PrivateName, _parent: &dyn Node) {
        (**self).visit_private_name(n, _parent)
    }
    fn visit_jsx_object(&mut self, n: &JSXObject, _parent: &dyn Node) {
        (**self).visit_jsx_object(n, _parent)
    }
    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr, _parent: &dyn Node) {
        (**self).visit_jsx_member_expr(n, _parent)
    }
    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName, _parent: &dyn Node) {
        (**self).visit_jsx_namespaced_name(n, _parent)
    }
    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr, _parent: &dyn Node) {
        (**self).visit_jsx_empty_expr(n, _parent)
    }
    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer, _parent: &dyn Node) {
        (**self).visit_jsx_expr_container(n, _parent)
    }
    fn visit_jsx_expr(&mut self, n: &JSXExpr, _parent: &dyn Node) {
        (**self).visit_jsx_expr(n, _parent)
    }
    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild, _parent: &dyn Node) {
        (**self).visit_jsx_spread_child(n, _parent)
    }
    fn visit_jsx_element_name(&mut self, n: &JSXElementName, _parent: &dyn Node) {
        (**self).visit_jsx_element_name(n, _parent)
    }
    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement, _parent: &dyn Node) {
        (**self).visit_jsx_opening_element(n, _parent)
    }
    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread, _parent: &dyn Node) {
        (**self).visit_jsx_attr_or_spread(n, _parent)
    }
    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement, _parent: &dyn Node) {
        (**self).visit_jsx_closing_element(n, _parent)
    }
    fn visit_jsx_attr(&mut self, n: &JSXAttr, _parent: &dyn Node) {
        (**self).visit_jsx_attr(n, _parent)
    }
    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName, _parent: &dyn Node) {
        (**self).visit_jsx_attr_name(n, _parent)
    }
    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue, _parent: &dyn Node) {
        (**self).visit_jsx_attr_value(n, _parent)
    }
    fn visit_jsx_text(&mut self, n: &JSXText, _parent: &dyn Node) {
        (**self).visit_jsx_text(n, _parent)
    }
    fn visit_jsx_element(&mut self, n: &JSXElement, _parent: &dyn Node) {
        (**self).visit_jsx_element(n, _parent)
    }
    fn visit_jsx_element_child(&mut self, n: &JSXElementChild, _parent: &dyn Node) {
        (**self).visit_jsx_element_child(n, _parent)
    }
    fn visit_jsx_fragment(&mut self, n: &JSXFragment, _parent: &dyn Node) {
        (**self).visit_jsx_fragment(n, _parent)
    }
    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment, _parent: &dyn Node) {
        (**self).visit_jsx_opening_fragment(n, _parent)
    }
    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment, _parent: &dyn Node) {
        (**self).visit_jsx_closing_fragment(n, _parent)
    }
    fn visit_invalid(&mut self, n: &Invalid, _parent: &dyn Node) {
        (**self).visit_invalid(n, _parent)
    }
    fn visit_lit(&mut self, n: &Lit, _parent: &dyn Node) {
        (**self).visit_lit(n, _parent)
    }
    fn visit_big_int(&mut self, n: &BigInt, _parent: &dyn Node) {
        (**self).visit_big_int(n, _parent)
    }
    fn visit_str(&mut self, n: &Str, _parent: &dyn Node) {
        (**self).visit_str(n, _parent)
    }
    fn visit_bool(&mut self, n: &Bool, _parent: &dyn Node) {
        (**self).visit_bool(n, _parent)
    }
    fn visit_null(&mut self, n: &Null, _parent: &dyn Node) {
        (**self).visit_null(n, _parent)
    }
    fn visit_regex(&mut self, n: &Regex, _parent: &dyn Node) {
        (**self).visit_regex(n, _parent)
    }
    fn visit_number(&mut self, n: &Number, _parent: &dyn Node) {
        (**self).visit_number(n, _parent)
    }
    fn visit_program(&mut self, n: &Program, _parent: &dyn Node) {
        (**self).visit_program(n, _parent)
    }
    fn visit_module(&mut self, n: &Module, _parent: &dyn Node) {
        (**self).visit_module(n, _parent)
    }
    fn visit_script(&mut self, n: &Script, _parent: &dyn Node) {
        (**self).visit_script(n, _parent)
    }
    fn visit_module_item(&mut self, n: &ModuleItem, _parent: &dyn Node) {
        (**self).visit_module_item(n, _parent)
    }
    fn visit_module_decl(&mut self, n: &ModuleDecl, _parent: &dyn Node) {
        (**self).visit_module_decl(n, _parent)
    }
    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr, _parent: &dyn Node) {
        (**self).visit_export_default_expr(n, _parent)
    }
    fn visit_export_decl(&mut self, n: &ExportDecl, _parent: &dyn Node) {
        (**self).visit_export_decl(n, _parent)
    }
    fn visit_import_decl(&mut self, n: &ImportDecl, _parent: &dyn Node) {
        (**self).visit_import_decl(n, _parent)
    }
    fn visit_export_all(&mut self, n: &ExportAll, _parent: &dyn Node) {
        (**self).visit_export_all(n, _parent)
    }
    fn visit_named_export(&mut self, n: &NamedExport, _parent: &dyn Node) {
        (**self).visit_named_export(n, _parent)
    }
    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl, _parent: &dyn Node) {
        (**self).visit_export_default_decl(n, _parent)
    }
    fn visit_default_decl(&mut self, n: &DefaultDecl, _parent: &dyn Node) {
        (**self).visit_default_decl(n, _parent)
    }
    fn visit_import_specifier(&mut self, n: &ImportSpecifier, _parent: &dyn Node) {
        (**self).visit_import_specifier(n, _parent)
    }
    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier, _parent: &dyn Node) {
        (**self).visit_import_default_specifier(n, _parent)
    }
    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier, _parent: &dyn Node) {
        (**self).visit_import_star_as_specifier(n, _parent)
    }
    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier, _parent: &dyn Node) {
        (**self).visit_import_named_specifier(n, _parent)
    }
    fn visit_export_specifier(&mut self, n: &ExportSpecifier, _parent: &dyn Node) {
        (**self).visit_export_specifier(n, _parent)
    }
    fn visit_export_namespace_specifier(
        &mut self,
        n: &ExportNamespaceSpecifier,
        _parent: &dyn Node,
    ) {
        (**self).visit_export_namespace_specifier(n, _parent)
    }
    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier, _parent: &dyn Node) {
        (**self).visit_export_default_specifier(n, _parent)
    }
    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _parent: &dyn Node) {
        (**self).visit_export_named_specifier(n, _parent)
    }
    fn visit_binary_op(&mut self, n: &BinaryOp, _parent: &dyn Node) {
        (**self).visit_binary_op(n, _parent)
    }
    fn visit_assign_op(&mut self, n: &AssignOp, _parent: &dyn Node) {
        (**self).visit_assign_op(n, _parent)
    }
    fn visit_update_op(&mut self, n: &UpdateOp, _parent: &dyn Node) {
        (**self).visit_update_op(n, _parent)
    }
    fn visit_unary_op(&mut self, n: &UnaryOp, _parent: &dyn Node) {
        (**self).visit_unary_op(n, _parent)
    }
    fn visit_pat(&mut self, n: &Pat, _parent: &dyn Node) {
        (**self).visit_pat(n, _parent)
    }
    fn visit_array_pat(&mut self, n: &ArrayPat, _parent: &dyn Node) {
        (**self).visit_array_pat(n, _parent)
    }
    fn visit_object_pat(&mut self, n: &ObjectPat, _parent: &dyn Node) {
        (**self).visit_object_pat(n, _parent)
    }
    fn visit_assign_pat(&mut self, n: &AssignPat, _parent: &dyn Node) {
        (**self).visit_assign_pat(n, _parent)
    }
    fn visit_rest_pat(&mut self, n: &RestPat, _parent: &dyn Node) {
        (**self).visit_rest_pat(n, _parent)
    }
    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp, _parent: &dyn Node) {
        (**self).visit_object_pat_prop(n, _parent)
    }
    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp, _parent: &dyn Node) {
        (**self).visit_key_value_pat_prop(n, _parent)
    }
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp, _parent: &dyn Node) {
        (**self).visit_assign_pat_prop(n, _parent)
    }
    fn visit_prop(&mut self, n: &Prop, _parent: &dyn Node) {
        (**self).visit_prop(n, _parent)
    }
    fn visit_key_value_prop(&mut self, n: &KeyValueProp, _parent: &dyn Node) {
        (**self).visit_key_value_prop(n, _parent)
    }
    fn visit_assign_prop(&mut self, n: &AssignProp, _parent: &dyn Node) {
        (**self).visit_assign_prop(n, _parent)
    }
    fn visit_getter_prop(&mut self, n: &GetterProp, _parent: &dyn Node) {
        (**self).visit_getter_prop(n, _parent)
    }
    fn visit_setter_prop(&mut self, n: &SetterProp, _parent: &dyn Node) {
        (**self).visit_setter_prop(n, _parent)
    }
    fn visit_method_prop(&mut self, n: &MethodProp, _parent: &dyn Node) {
        (**self).visit_method_prop(n, _parent)
    }
    fn visit_prop_name(&mut self, n: &PropName, _parent: &dyn Node) {
        (**self).visit_prop_name(n, _parent)
    }
    fn visit_computed_prop_name(&mut self, n: &ComputedPropName, _parent: &dyn Node) {
        (**self).visit_computed_prop_name(n, _parent)
    }
    fn visit_block_stmt(&mut self, n: &BlockStmt, _parent: &dyn Node) {
        (**self).visit_block_stmt(n, _parent)
    }
    fn visit_stmt(&mut self, n: &Stmt, _parent: &dyn Node) {
        (**self).visit_stmt(n, _parent)
    }
    fn visit_expr_stmt(&mut self, n: &ExprStmt, _parent: &dyn Node) {
        (**self).visit_expr_stmt(n, _parent)
    }
    fn visit_empty_stmt(&mut self, n: &EmptyStmt, _parent: &dyn Node) {
        (**self).visit_empty_stmt(n, _parent)
    }
    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt, _parent: &dyn Node) {
        (**self).visit_debugger_stmt(n, _parent)
    }
    fn visit_with_stmt(&mut self, n: &WithStmt, _parent: &dyn Node) {
        (**self).visit_with_stmt(n, _parent)
    }
    fn visit_return_stmt(&mut self, n: &ReturnStmt, _parent: &dyn Node) {
        (**self).visit_return_stmt(n, _parent)
    }
    fn visit_labeled_stmt(&mut self, n: &LabeledStmt, _parent: &dyn Node) {
        (**self).visit_labeled_stmt(n, _parent)
    }
    fn visit_break_stmt(&mut self, n: &BreakStmt, _parent: &dyn Node) {
        (**self).visit_break_stmt(n, _parent)
    }
    fn visit_continue_stmt(&mut self, n: &ContinueStmt, _parent: &dyn Node) {
        (**self).visit_continue_stmt(n, _parent)
    }
    fn visit_if_stmt(&mut self, n: &IfStmt, _parent: &dyn Node) {
        (**self).visit_if_stmt(n, _parent)
    }
    fn visit_switch_stmt(&mut self, n: &SwitchStmt, _parent: &dyn Node) {
        (**self).visit_switch_stmt(n, _parent)
    }
    fn visit_throw_stmt(&mut self, n: &ThrowStmt, _parent: &dyn Node) {
        (**self).visit_throw_stmt(n, _parent)
    }
    fn visit_try_stmt(&mut self, n: &TryStmt, _parent: &dyn Node) {
        (**self).visit_try_stmt(n, _parent)
    }
    fn visit_while_stmt(&mut self, n: &WhileStmt, _parent: &dyn Node) {
        (**self).visit_while_stmt(n, _parent)
    }
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt, _parent: &dyn Node) {
        (**self).visit_do_while_stmt(n, _parent)
    }
    fn visit_for_stmt(&mut self, n: &ForStmt, _parent: &dyn Node) {
        (**self).visit_for_stmt(n, _parent)
    }
    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _parent: &dyn Node) {
        (**self).visit_for_in_stmt(n, _parent)
    }
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _parent: &dyn Node) {
        (**self).visit_for_of_stmt(n, _parent)
    }
    fn visit_switch_case(&mut self, n: &SwitchCase, _parent: &dyn Node) {
        (**self).visit_switch_case(n, _parent)
    }
    fn visit_catch_clause(&mut self, n: &CatchClause, _parent: &dyn Node) {
        (**self).visit_catch_clause(n, _parent)
    }
    fn visit_var_decl_or_pat(&mut self, n: &VarDeclOrPat, _parent: &dyn Node) {
        (**self).visit_var_decl_or_pat(n, _parent)
    }
    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr, _parent: &dyn Node) {
        (**self).visit_var_decl_or_expr(n, _parent)
    }
    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn, _parent: &dyn Node) {
        (**self).visit_ts_type_ann(n, _parent)
    }
    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl, _parent: &dyn Node) {
        (**self).visit_ts_type_param_decl(n, _parent)
    }
    fn visit_ts_type_param(&mut self, n: &TsTypeParam, _parent: &dyn Node) {
        (**self).visit_ts_type_param(n, _parent)
    }
    fn visit_ts_type_param_instantiation(
        &mut self,
        n: &TsTypeParamInstantiation,
        _parent: &dyn Node,
    ) {
        (**self).visit_ts_type_param_instantiation(n, _parent)
    }
    fn visit_ts_type_cast_expr(&mut self, n: &TsTypeCastExpr, _parent: &dyn Node) {
        (**self).visit_ts_type_cast_expr(n, _parent)
    }
    fn visit_ts_param_prop(&mut self, n: &TsParamProp, _parent: &dyn Node) {
        (**self).visit_ts_param_prop(n, _parent)
    }
    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam, _parent: &dyn Node) {
        (**self).visit_ts_param_prop_param(n, _parent)
    }
    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName, _parent: &dyn Node) {
        (**self).visit_ts_qualified_name(n, _parent)
    }
    fn visit_ts_entity_name(&mut self, n: &TsEntityName, _parent: &dyn Node) {
        (**self).visit_ts_entity_name(n, _parent)
    }
    fn visit_ts_signature_decl(&mut self, n: &TsSignatureDecl, _parent: &dyn Node) {
        (**self).visit_ts_signature_decl(n, _parent)
    }
    fn visit_ts_type_element(&mut self, n: &TsTypeElement, _parent: &dyn Node) {
        (**self).visit_ts_type_element(n, _parent)
    }
    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl, _parent: &dyn Node) {
        (**self).visit_ts_call_signature_decl(n, _parent)
    }
    fn visit_ts_construct_signature_decl(
        &mut self,
        n: &TsConstructSignatureDecl,
        _parent: &dyn Node,
    ) {
        (**self).visit_ts_construct_signature_decl(n, _parent)
    }
    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature, _parent: &dyn Node) {
        (**self).visit_ts_property_signature(n, _parent)
    }
    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature, _parent: &dyn Node) {
        (**self).visit_ts_method_signature(n, _parent)
    }
    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature, _parent: &dyn Node) {
        (**self).visit_ts_index_signature(n, _parent)
    }
    fn visit_ts_type(&mut self, n: &TsType, _parent: &dyn Node) {
        (**self).visit_ts_type(n, _parent)
    }
    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType, _parent: &dyn Node) {
        (**self).visit_ts_fn_or_constructor_type(n, _parent)
    }
    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType, _parent: &dyn Node) {
        (**self).visit_ts_keyword_type(n, _parent)
    }
    fn visit_ts_keyword_type_kind(&mut self, n: &TsKeywordTypeKind, _parent: &dyn Node) {
        (**self).visit_ts_keyword_type_kind(n, _parent)
    }
    fn visit_ts_this_type(&mut self, n: &TsThisType, _parent: &dyn Node) {
        (**self).visit_ts_this_type(n, _parent)
    }
    fn visit_ts_fn_param(&mut self, n: &TsFnParam, _parent: &dyn Node) {
        (**self).visit_ts_fn_param(n, _parent)
    }
    fn visit_ts_fn_type(&mut self, n: &TsFnType, _parent: &dyn Node) {
        (**self).visit_ts_fn_type(n, _parent)
    }
    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType, _parent: &dyn Node) {
        (**self).visit_ts_constructor_type(n, _parent)
    }
    fn visit_ts_type_ref(&mut self, n: &TsTypeRef, _parent: &dyn Node) {
        (**self).visit_ts_type_ref(n, _parent)
    }
    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate, _parent: &dyn Node) {
        (**self).visit_ts_type_predicate(n, _parent)
    }
    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent, _parent: &dyn Node) {
        (**self).visit_ts_this_type_or_ident(n, _parent)
    }
    fn visit_ts_type_query(&mut self, n: &TsTypeQuery, _parent: &dyn Node) {
        (**self).visit_ts_type_query(n, _parent)
    }
    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr, _parent: &dyn Node) {
        (**self).visit_ts_type_query_expr(n, _parent)
    }
    fn visit_ts_import_type(&mut self, n: &TsImportType, _parent: &dyn Node) {
        (**self).visit_ts_import_type(n, _parent)
    }
    fn visit_ts_type_lit(&mut self, n: &TsTypeLit, _parent: &dyn Node) {
        (**self).visit_ts_type_lit(n, _parent)
    }
    fn visit_ts_array_type(&mut self, n: &TsArrayType, _parent: &dyn Node) {
        (**self).visit_ts_array_type(n, _parent)
    }
    fn visit_ts_tuple_type(&mut self, n: &TsTupleType, _parent: &dyn Node) {
        (**self).visit_ts_tuple_type(n, _parent)
    }
    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement, _parent: &dyn Node) {
        (**self).visit_ts_tuple_element(n, _parent)
    }
    fn visit_ts_optional_type(&mut self, n: &TsOptionalType, _parent: &dyn Node) {
        (**self).visit_ts_optional_type(n, _parent)
    }
    fn visit_ts_rest_type(&mut self, n: &TsRestType, _parent: &dyn Node) {
        (**self).visit_ts_rest_type(n, _parent)
    }
    fn visit_ts_union_or_intersection_type(
        &mut self,
        n: &TsUnionOrIntersectionType,
        _parent: &dyn Node,
    ) {
        (**self).visit_ts_union_or_intersection_type(n, _parent)
    }
    fn visit_ts_union_type(&mut self, n: &TsUnionType, _parent: &dyn Node) {
        (**self).visit_ts_union_type(n, _parent)
    }
    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType, _parent: &dyn Node) {
        (**self).visit_ts_intersection_type(n, _parent)
    }
    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType, _parent: &dyn Node) {
        (**self).visit_ts_conditional_type(n, _parent)
    }
    fn visit_ts_infer_type(&mut self, n: &TsInferType, _parent: &dyn Node) {
        (**self).visit_ts_infer_type(n, _parent)
    }
    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType, _parent: &dyn Node) {
        (**self).visit_ts_parenthesized_type(n, _parent)
    }
    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator, _parent: &dyn Node) {
        (**self).visit_ts_type_operator(n, _parent)
    }
    fn visit_ts_type_operator_op(&mut self, n: &TsTypeOperatorOp, _parent: &dyn Node) {
        (**self).visit_ts_type_operator_op(n, _parent)
    }
    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType, _parent: &dyn Node) {
        (**self).visit_ts_indexed_access_type(n, _parent)
    }
    fn visit_true_plus_minus(&mut self, n: &TruePlusMinus, _parent: &dyn Node) {
        (**self).visit_true_plus_minus(n, _parent)
    }
    fn visit_ts_mapped_type(&mut self, n: &TsMappedType, _parent: &dyn Node) {
        (**self).visit_ts_mapped_type(n, _parent)
    }
    fn visit_ts_lit_type(&mut self, n: &TsLitType, _parent: &dyn Node) {
        (**self).visit_ts_lit_type(n, _parent)
    }
    fn visit_ts_lit(&mut self, n: &TsLit, _parent: &dyn Node) {
        (**self).visit_ts_lit(n, _parent)
    }
    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl, _parent: &dyn Node) {
        (**self).visit_ts_interface_decl(n, _parent)
    }
    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody, _parent: &dyn Node) {
        (**self).visit_ts_interface_body(n, _parent)
    }
    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs, _parent: &dyn Node) {
        (**self).visit_ts_expr_with_type_args(n, _parent)
    }
    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl, _parent: &dyn Node) {
        (**self).visit_ts_type_alias_decl(n, _parent)
    }
    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl, _parent: &dyn Node) {
        (**self).visit_ts_enum_decl(n, _parent)
    }
    fn visit_ts_enum_member(&mut self, n: &TsEnumMember, _parent: &dyn Node) {
        (**self).visit_ts_enum_member(n, _parent)
    }
    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId, _parent: &dyn Node) {
        (**self).visit_ts_enum_member_id(n, _parent)
    }
    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl, _parent: &dyn Node) {
        (**self).visit_ts_module_decl(n, _parent)
    }
    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody, _parent: &dyn Node) {
        (**self).visit_ts_namespace_body(n, _parent)
    }
    fn visit_ts_module_block(&mut self, n: &TsModuleBlock, _parent: &dyn Node) {
        (**self).visit_ts_module_block(n, _parent)
    }
    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl, _parent: &dyn Node) {
        (**self).visit_ts_namespace_decl(n, _parent)
    }
    fn visit_ts_module_name(&mut self, n: &TsModuleName, _parent: &dyn Node) {
        (**self).visit_ts_module_name(n, _parent)
    }
    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl, _parent: &dyn Node) {
        (**self).visit_ts_import_equals_decl(n, _parent)
    }
    fn visit_ts_module_ref(&mut self, n: &TsModuleRef, _parent: &dyn Node) {
        (**self).visit_ts_module_ref(n, _parent)
    }
    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef, _parent: &dyn Node) {
        (**self).visit_ts_external_module_ref(n, _parent)
    }
    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment, _parent: &dyn Node) {
        (**self).visit_ts_export_assignment(n, _parent)
    }
    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl, _parent: &dyn Node) {
        (**self).visit_ts_namespace_export_decl(n, _parent)
    }
    fn visit_ts_as_expr(&mut self, n: &TsAsExpr, _parent: &dyn Node) {
        (**self).visit_ts_as_expr(n, _parent)
    }
    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion, _parent: &dyn Node) {
        (**self).visit_ts_type_assertion(n, _parent)
    }
    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr, _parent: &dyn Node) {
        (**self).visit_ts_non_null_expr(n, _parent)
    }
    fn visit_accessibility(&mut self, n: &Accessibility, _parent: &dyn Node) {
        (**self).visit_accessibility(n, _parent)
    }
    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion, _parent: &dyn Node) {
        (**self).visit_ts_const_assertion(n, _parent)
    }
}
impl<V> Visit for Box<V>
where
    V: ?Sized + Visit,
{
    fn visit_class(&mut self, n: &Class, _parent: &dyn Node) {
        (**self).visit_class(n, _parent)
    }
    fn visit_class_member(&mut self, n: &ClassMember, _parent: &dyn Node) {
        (**self).visit_class_member(n, _parent)
    }
    fn visit_class_prop(&mut self, n: &ClassProp, _parent: &dyn Node) {
        (**self).visit_class_prop(n, _parent)
    }
    fn visit_private_prop(&mut self, n: &PrivateProp, _parent: &dyn Node) {
        (**self).visit_private_prop(n, _parent)
    }
    fn visit_class_method(&mut self, n: &ClassMethod, _parent: &dyn Node) {
        (**self).visit_class_method(n, _parent)
    }
    fn visit_private_method(&mut self, n: &PrivateMethod, _parent: &dyn Node) {
        (**self).visit_private_method(n, _parent)
    }
    fn visit_constructor(&mut self, n: &Constructor, _parent: &dyn Node) {
        (**self).visit_constructor(n, _parent)
    }
    fn visit_decorator(&mut self, n: &Decorator, _parent: &dyn Node) {
        (**self).visit_decorator(n, _parent)
    }
    fn visit_method_kind(&mut self, n: &MethodKind, _parent: &dyn Node) {
        (**self).visit_method_kind(n, _parent)
    }
    fn visit_decl(&mut self, n: &Decl, _parent: &dyn Node) {
        (**self).visit_decl(n, _parent)
    }
    fn visit_fn_decl(&mut self, n: &FnDecl, _parent: &dyn Node) {
        (**self).visit_fn_decl(n, _parent)
    }
    fn visit_class_decl(&mut self, n: &ClassDecl, _parent: &dyn Node) {
        (**self).visit_class_decl(n, _parent)
    }
    fn visit_var_decl(&mut self, n: &VarDecl, _parent: &dyn Node) {
        (**self).visit_var_decl(n, _parent)
    }
    fn visit_var_decl_kind(&mut self, n: &VarDeclKind, _parent: &dyn Node) {
        (**self).visit_var_decl_kind(n, _parent)
    }
    fn visit_var_declarator(&mut self, n: &VarDeclarator, _parent: &dyn Node) {
        (**self).visit_var_declarator(n, _parent)
    }
    fn visit_expr(&mut self, n: &Expr, _parent: &dyn Node) {
        (**self).visit_expr(n, _parent)
    }
    fn visit_this_expr(&mut self, n: &ThisExpr, _parent: &dyn Node) {
        (**self).visit_this_expr(n, _parent)
    }
    fn visit_array_lit(&mut self, n: &ArrayLit, _parent: &dyn Node) {
        (**self).visit_array_lit(n, _parent)
    }
    fn visit_object_lit(&mut self, n: &ObjectLit, _parent: &dyn Node) {
        (**self).visit_object_lit(n, _parent)
    }
    fn visit_prop_or_spread(&mut self, n: &PropOrSpread, _parent: &dyn Node) {
        (**self).visit_prop_or_spread(n, _parent)
    }
    fn visit_spread_element(&mut self, n: &SpreadElement, _parent: &dyn Node) {
        (**self).visit_spread_element(n, _parent)
    }
    fn visit_unary_expr(&mut self, n: &UnaryExpr, _parent: &dyn Node) {
        (**self).visit_unary_expr(n, _parent)
    }
    fn visit_update_expr(&mut self, n: &UpdateExpr, _parent: &dyn Node) {
        (**self).visit_update_expr(n, _parent)
    }
    fn visit_bin_expr(&mut self, n: &BinExpr, _parent: &dyn Node) {
        (**self).visit_bin_expr(n, _parent)
    }
    fn visit_fn_expr(&mut self, n: &FnExpr, _parent: &dyn Node) {
        (**self).visit_fn_expr(n, _parent)
    }
    fn visit_class_expr(&mut self, n: &ClassExpr, _parent: &dyn Node) {
        (**self).visit_class_expr(n, _parent)
    }
    fn visit_assign_expr(&mut self, n: &AssignExpr, _parent: &dyn Node) {
        (**self).visit_assign_expr(n, _parent)
    }
    fn visit_member_expr(&mut self, n: &MemberExpr, _parent: &dyn Node) {
        (**self).visit_member_expr(n, _parent)
    }
    fn visit_cond_expr(&mut self, n: &CondExpr, _parent: &dyn Node) {
        (**self).visit_cond_expr(n, _parent)
    }
    fn visit_call_expr(&mut self, n: &CallExpr, _parent: &dyn Node) {
        (**self).visit_call_expr(n, _parent)
    }
    fn visit_new_expr(&mut self, n: &NewExpr, _parent: &dyn Node) {
        (**self).visit_new_expr(n, _parent)
    }
    fn visit_seq_expr(&mut self, n: &SeqExpr, _parent: &dyn Node) {
        (**self).visit_seq_expr(n, _parent)
    }
    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _parent: &dyn Node) {
        (**self).visit_arrow_expr(n, _parent)
    }
    fn visit_yield_expr(&mut self, n: &YieldExpr, _parent: &dyn Node) {
        (**self).visit_yield_expr(n, _parent)
    }
    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr, _parent: &dyn Node) {
        (**self).visit_meta_prop_expr(n, _parent)
    }
    fn visit_await_expr(&mut self, n: &AwaitExpr, _parent: &dyn Node) {
        (**self).visit_await_expr(n, _parent)
    }
    fn visit_tpl(&mut self, n: &Tpl, _parent: &dyn Node) {
        (**self).visit_tpl(n, _parent)
    }
    fn visit_tagged_tpl(&mut self, n: &TaggedTpl, _parent: &dyn Node) {
        (**self).visit_tagged_tpl(n, _parent)
    }
    fn visit_tpl_element(&mut self, n: &TplElement, _parent: &dyn Node) {
        (**self).visit_tpl_element(n, _parent)
    }
    fn visit_paren_expr(&mut self, n: &ParenExpr, _parent: &dyn Node) {
        (**self).visit_paren_expr(n, _parent)
    }
    fn visit_expr_or_super(&mut self, n: &ExprOrSuper, _parent: &dyn Node) {
        (**self).visit_expr_or_super(n, _parent)
    }
    fn visit_super(&mut self, n: &Super, _parent: &dyn Node) {
        (**self).visit_super(n, _parent)
    }
    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread, _parent: &dyn Node) {
        (**self).visit_expr_or_spread(n, _parent)
    }
    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr, _parent: &dyn Node) {
        (**self).visit_block_stmt_or_expr(n, _parent)
    }
    fn visit_pat_or_expr(&mut self, n: &PatOrExpr, _parent: &dyn Node) {
        (**self).visit_pat_or_expr(n, _parent)
    }
    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr, _parent: &dyn Node) {
        (**self).visit_opt_chain_expr(n, _parent)
    }
    fn visit_function(&mut self, n: &Function, _parent: &dyn Node) {
        (**self).visit_function(n, _parent)
    }
    fn visit_param(&mut self, n: &Param, _parent: &dyn Node) {
        (**self).visit_param(n, _parent)
    }
    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp, _parent: &dyn Node) {
        (**self).visit_param_or_ts_param_prop(n, _parent)
    }
    fn visit_ident(&mut self, n: &Ident, _parent: &dyn Node) {
        (**self).visit_ident(n, _parent)
    }
    fn visit_private_name(&mut self, n: &PrivateName, _parent: &dyn Node) {
        (**self).visit_private_name(n, _parent)
    }
    fn visit_jsx_object(&mut self, n: &JSXObject, _parent: &dyn Node) {
        (**self).visit_jsx_object(n, _parent)
    }
    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr, _parent: &dyn Node) {
        (**self).visit_jsx_member_expr(n, _parent)
    }
    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName, _parent: &dyn Node) {
        (**self).visit_jsx_namespaced_name(n, _parent)
    }
    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr, _parent: &dyn Node) {
        (**self).visit_jsx_empty_expr(n, _parent)
    }
    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer, _parent: &dyn Node) {
        (**self).visit_jsx_expr_container(n, _parent)
    }
    fn visit_jsx_expr(&mut self, n: &JSXExpr, _parent: &dyn Node) {
        (**self).visit_jsx_expr(n, _parent)
    }
    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild, _parent: &dyn Node) {
        (**self).visit_jsx_spread_child(n, _parent)
    }
    fn visit_jsx_element_name(&mut self, n: &JSXElementName, _parent: &dyn Node) {
        (**self).visit_jsx_element_name(n, _parent)
    }
    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement, _parent: &dyn Node) {
        (**self).visit_jsx_opening_element(n, _parent)
    }
    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread, _parent: &dyn Node) {
        (**self).visit_jsx_attr_or_spread(n, _parent)
    }
    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement, _parent: &dyn Node) {
        (**self).visit_jsx_closing_element(n, _parent)
    }
    fn visit_jsx_attr(&mut self, n: &JSXAttr, _parent: &dyn Node) {
        (**self).visit_jsx_attr(n, _parent)
    }
    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName, _parent: &dyn Node) {
        (**self).visit_jsx_attr_name(n, _parent)
    }
    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue, _parent: &dyn Node) {
        (**self).visit_jsx_attr_value(n, _parent)
    }
    fn visit_jsx_text(&mut self, n: &JSXText, _parent: &dyn Node) {
        (**self).visit_jsx_text(n, _parent)
    }
    fn visit_jsx_element(&mut self, n: &JSXElement, _parent: &dyn Node) {
        (**self).visit_jsx_element(n, _parent)
    }
    fn visit_jsx_element_child(&mut self, n: &JSXElementChild, _parent: &dyn Node) {
        (**self).visit_jsx_element_child(n, _parent)
    }
    fn visit_jsx_fragment(&mut self, n: &JSXFragment, _parent: &dyn Node) {
        (**self).visit_jsx_fragment(n, _parent)
    }
    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment, _parent: &dyn Node) {
        (**self).visit_jsx_opening_fragment(n, _parent)
    }
    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment, _parent: &dyn Node) {
        (**self).visit_jsx_closing_fragment(n, _parent)
    }
    fn visit_invalid(&mut self, n: &Invalid, _parent: &dyn Node) {
        (**self).visit_invalid(n, _parent)
    }
    fn visit_lit(&mut self, n: &Lit, _parent: &dyn Node) {
        (**self).visit_lit(n, _parent)
    }
    fn visit_big_int(&mut self, n: &BigInt, _parent: &dyn Node) {
        (**self).visit_big_int(n, _parent)
    }
    fn visit_str(&mut self, n: &Str, _parent: &dyn Node) {
        (**self).visit_str(n, _parent)
    }
    fn visit_bool(&mut self, n: &Bool, _parent: &dyn Node) {
        (**self).visit_bool(n, _parent)
    }
    fn visit_null(&mut self, n: &Null, _parent: &dyn Node) {
        (**self).visit_null(n, _parent)
    }
    fn visit_regex(&mut self, n: &Regex, _parent: &dyn Node) {
        (**self).visit_regex(n, _parent)
    }
    fn visit_number(&mut self, n: &Number, _parent: &dyn Node) {
        (**self).visit_number(n, _parent)
    }
    fn visit_program(&mut self, n: &Program, _parent: &dyn Node) {
        (**self).visit_program(n, _parent)
    }
    fn visit_module(&mut self, n: &Module, _parent: &dyn Node) {
        (**self).visit_module(n, _parent)
    }
    fn visit_script(&mut self, n: &Script, _parent: &dyn Node) {
        (**self).visit_script(n, _parent)
    }
    fn visit_module_item(&mut self, n: &ModuleItem, _parent: &dyn Node) {
        (**self).visit_module_item(n, _parent)
    }
    fn visit_module_decl(&mut self, n: &ModuleDecl, _parent: &dyn Node) {
        (**self).visit_module_decl(n, _parent)
    }
    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr, _parent: &dyn Node) {
        (**self).visit_export_default_expr(n, _parent)
    }
    fn visit_export_decl(&mut self, n: &ExportDecl, _parent: &dyn Node) {
        (**self).visit_export_decl(n, _parent)
    }
    fn visit_import_decl(&mut self, n: &ImportDecl, _parent: &dyn Node) {
        (**self).visit_import_decl(n, _parent)
    }
    fn visit_export_all(&mut self, n: &ExportAll, _parent: &dyn Node) {
        (**self).visit_export_all(n, _parent)
    }
    fn visit_named_export(&mut self, n: &NamedExport, _parent: &dyn Node) {
        (**self).visit_named_export(n, _parent)
    }
    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl, _parent: &dyn Node) {
        (**self).visit_export_default_decl(n, _parent)
    }
    fn visit_default_decl(&mut self, n: &DefaultDecl, _parent: &dyn Node) {
        (**self).visit_default_decl(n, _parent)
    }
    fn visit_import_specifier(&mut self, n: &ImportSpecifier, _parent: &dyn Node) {
        (**self).visit_import_specifier(n, _parent)
    }
    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier, _parent: &dyn Node) {
        (**self).visit_import_default_specifier(n, _parent)
    }
    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier, _parent: &dyn Node) {
        (**self).visit_import_star_as_specifier(n, _parent)
    }
    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier, _parent: &dyn Node) {
        (**self).visit_import_named_specifier(n, _parent)
    }
    fn visit_export_specifier(&mut self, n: &ExportSpecifier, _parent: &dyn Node) {
        (**self).visit_export_specifier(n, _parent)
    }
    fn visit_export_namespace_specifier(
        &mut self,
        n: &ExportNamespaceSpecifier,
        _parent: &dyn Node,
    ) {
        (**self).visit_export_namespace_specifier(n, _parent)
    }
    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier, _parent: &dyn Node) {
        (**self).visit_export_default_specifier(n, _parent)
    }
    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _parent: &dyn Node) {
        (**self).visit_export_named_specifier(n, _parent)
    }
    fn visit_binary_op(&mut self, n: &BinaryOp, _parent: &dyn Node) {
        (**self).visit_binary_op(n, _parent)
    }
    fn visit_assign_op(&mut self, n: &AssignOp, _parent: &dyn Node) {
        (**self).visit_assign_op(n, _parent)
    }
    fn visit_update_op(&mut self, n: &UpdateOp, _parent: &dyn Node) {
        (**self).visit_update_op(n, _parent)
    }
    fn visit_unary_op(&mut self, n: &UnaryOp, _parent: &dyn Node) {
        (**self).visit_unary_op(n, _parent)
    }
    fn visit_pat(&mut self, n: &Pat, _parent: &dyn Node) {
        (**self).visit_pat(n, _parent)
    }
    fn visit_array_pat(&mut self, n: &ArrayPat, _parent: &dyn Node) {
        (**self).visit_array_pat(n, _parent)
    }
    fn visit_object_pat(&mut self, n: &ObjectPat, _parent: &dyn Node) {
        (**self).visit_object_pat(n, _parent)
    }
    fn visit_assign_pat(&mut self, n: &AssignPat, _parent: &dyn Node) {
        (**self).visit_assign_pat(n, _parent)
    }
    fn visit_rest_pat(&mut self, n: &RestPat, _parent: &dyn Node) {
        (**self).visit_rest_pat(n, _parent)
    }
    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp, _parent: &dyn Node) {
        (**self).visit_object_pat_prop(n, _parent)
    }
    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp, _parent: &dyn Node) {
        (**self).visit_key_value_pat_prop(n, _parent)
    }
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp, _parent: &dyn Node) {
        (**self).visit_assign_pat_prop(n, _parent)
    }
    fn visit_prop(&mut self, n: &Prop, _parent: &dyn Node) {
        (**self).visit_prop(n, _parent)
    }
    fn visit_key_value_prop(&mut self, n: &KeyValueProp, _parent: &dyn Node) {
        (**self).visit_key_value_prop(n, _parent)
    }
    fn visit_assign_prop(&mut self, n: &AssignProp, _parent: &dyn Node) {
        (**self).visit_assign_prop(n, _parent)
    }
    fn visit_getter_prop(&mut self, n: &GetterProp, _parent: &dyn Node) {
        (**self).visit_getter_prop(n, _parent)
    }
    fn visit_setter_prop(&mut self, n: &SetterProp, _parent: &dyn Node) {
        (**self).visit_setter_prop(n, _parent)
    }
    fn visit_method_prop(&mut self, n: &MethodProp, _parent: &dyn Node) {
        (**self).visit_method_prop(n, _parent)
    }
    fn visit_prop_name(&mut self, n: &PropName, _parent: &dyn Node) {
        (**self).visit_prop_name(n, _parent)
    }
    fn visit_computed_prop_name(&mut self, n: &ComputedPropName, _parent: &dyn Node) {
        (**self).visit_computed_prop_name(n, _parent)
    }
    fn visit_block_stmt(&mut self, n: &BlockStmt, _parent: &dyn Node) {
        (**self).visit_block_stmt(n, _parent)
    }
    fn visit_stmt(&mut self, n: &Stmt, _parent: &dyn Node) {
        (**self).visit_stmt(n, _parent)
    }
    fn visit_expr_stmt(&mut self, n: &ExprStmt, _parent: &dyn Node) {
        (**self).visit_expr_stmt(n, _parent)
    }
    fn visit_empty_stmt(&mut self, n: &EmptyStmt, _parent: &dyn Node) {
        (**self).visit_empty_stmt(n, _parent)
    }
    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt, _parent: &dyn Node) {
        (**self).visit_debugger_stmt(n, _parent)
    }
    fn visit_with_stmt(&mut self, n: &WithStmt, _parent: &dyn Node) {
        (**self).visit_with_stmt(n, _parent)
    }
    fn visit_return_stmt(&mut self, n: &ReturnStmt, _parent: &dyn Node) {
        (**self).visit_return_stmt(n, _parent)
    }
    fn visit_labeled_stmt(&mut self, n: &LabeledStmt, _parent: &dyn Node) {
        (**self).visit_labeled_stmt(n, _parent)
    }
    fn visit_break_stmt(&mut self, n: &BreakStmt, _parent: &dyn Node) {
        (**self).visit_break_stmt(n, _parent)
    }
    fn visit_continue_stmt(&mut self, n: &ContinueStmt, _parent: &dyn Node) {
        (**self).visit_continue_stmt(n, _parent)
    }
    fn visit_if_stmt(&mut self, n: &IfStmt, _parent: &dyn Node) {
        (**self).visit_if_stmt(n, _parent)
    }
    fn visit_switch_stmt(&mut self, n: &SwitchStmt, _parent: &dyn Node) {
        (**self).visit_switch_stmt(n, _parent)
    }
    fn visit_throw_stmt(&mut self, n: &ThrowStmt, _parent: &dyn Node) {
        (**self).visit_throw_stmt(n, _parent)
    }
    fn visit_try_stmt(&mut self, n: &TryStmt, _parent: &dyn Node) {
        (**self).visit_try_stmt(n, _parent)
    }
    fn visit_while_stmt(&mut self, n: &WhileStmt, _parent: &dyn Node) {
        (**self).visit_while_stmt(n, _parent)
    }
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt, _parent: &dyn Node) {
        (**self).visit_do_while_stmt(n, _parent)
    }
    fn visit_for_stmt(&mut self, n: &ForStmt, _parent: &dyn Node) {
        (**self).visit_for_stmt(n, _parent)
    }
    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _parent: &dyn Node) {
        (**self).visit_for_in_stmt(n, _parent)
    }
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _parent: &dyn Node) {
        (**self).visit_for_of_stmt(n, _parent)
    }
    fn visit_switch_case(&mut self, n: &SwitchCase, _parent: &dyn Node) {
        (**self).visit_switch_case(n, _parent)
    }
    fn visit_catch_clause(&mut self, n: &CatchClause, _parent: &dyn Node) {
        (**self).visit_catch_clause(n, _parent)
    }
    fn visit_var_decl_or_pat(&mut self, n: &VarDeclOrPat, _parent: &dyn Node) {
        (**self).visit_var_decl_or_pat(n, _parent)
    }
    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr, _parent: &dyn Node) {
        (**self).visit_var_decl_or_expr(n, _parent)
    }
    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn, _parent: &dyn Node) {
        (**self).visit_ts_type_ann(n, _parent)
    }
    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl, _parent: &dyn Node) {
        (**self).visit_ts_type_param_decl(n, _parent)
    }
    fn visit_ts_type_param(&mut self, n: &TsTypeParam, _parent: &dyn Node) {
        (**self).visit_ts_type_param(n, _parent)
    }
    fn visit_ts_type_param_instantiation(
        &mut self,
        n: &TsTypeParamInstantiation,
        _parent: &dyn Node,
    ) {
        (**self).visit_ts_type_param_instantiation(n, _parent)
    }
    fn visit_ts_type_cast_expr(&mut self, n: &TsTypeCastExpr, _parent: &dyn Node) {
        (**self).visit_ts_type_cast_expr(n, _parent)
    }
    fn visit_ts_param_prop(&mut self, n: &TsParamProp, _parent: &dyn Node) {
        (**self).visit_ts_param_prop(n, _parent)
    }
    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam, _parent: &dyn Node) {
        (**self).visit_ts_param_prop_param(n, _parent)
    }
    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName, _parent: &dyn Node) {
        (**self).visit_ts_qualified_name(n, _parent)
    }
    fn visit_ts_entity_name(&mut self, n: &TsEntityName, _parent: &dyn Node) {
        (**self).visit_ts_entity_name(n, _parent)
    }
    fn visit_ts_signature_decl(&mut self, n: &TsSignatureDecl, _parent: &dyn Node) {
        (**self).visit_ts_signature_decl(n, _parent)
    }
    fn visit_ts_type_element(&mut self, n: &TsTypeElement, _parent: &dyn Node) {
        (**self).visit_ts_type_element(n, _parent)
    }
    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl, _parent: &dyn Node) {
        (**self).visit_ts_call_signature_decl(n, _parent)
    }
    fn visit_ts_construct_signature_decl(
        &mut self,
        n: &TsConstructSignatureDecl,
        _parent: &dyn Node,
    ) {
        (**self).visit_ts_construct_signature_decl(n, _parent)
    }
    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature, _parent: &dyn Node) {
        (**self).visit_ts_property_signature(n, _parent)
    }
    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature, _parent: &dyn Node) {
        (**self).visit_ts_method_signature(n, _parent)
    }
    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature, _parent: &dyn Node) {
        (**self).visit_ts_index_signature(n, _parent)
    }
    fn visit_ts_type(&mut self, n: &TsType, _parent: &dyn Node) {
        (**self).visit_ts_type(n, _parent)
    }
    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType, _parent: &dyn Node) {
        (**self).visit_ts_fn_or_constructor_type(n, _parent)
    }
    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType, _parent: &dyn Node) {
        (**self).visit_ts_keyword_type(n, _parent)
    }
    fn visit_ts_keyword_type_kind(&mut self, n: &TsKeywordTypeKind, _parent: &dyn Node) {
        (**self).visit_ts_keyword_type_kind(n, _parent)
    }
    fn visit_ts_this_type(&mut self, n: &TsThisType, _parent: &dyn Node) {
        (**self).visit_ts_this_type(n, _parent)
    }
    fn visit_ts_fn_param(&mut self, n: &TsFnParam, _parent: &dyn Node) {
        (**self).visit_ts_fn_param(n, _parent)
    }
    fn visit_ts_fn_type(&mut self, n: &TsFnType, _parent: &dyn Node) {
        (**self).visit_ts_fn_type(n, _parent)
    }
    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType, _parent: &dyn Node) {
        (**self).visit_ts_constructor_type(n, _parent)
    }
    fn visit_ts_type_ref(&mut self, n: &TsTypeRef, _parent: &dyn Node) {
        (**self).visit_ts_type_ref(n, _parent)
    }
    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate, _parent: &dyn Node) {
        (**self).visit_ts_type_predicate(n, _parent)
    }
    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent, _parent: &dyn Node) {
        (**self).visit_ts_this_type_or_ident(n, _parent)
    }
    fn visit_ts_type_query(&mut self, n: &TsTypeQuery, _parent: &dyn Node) {
        (**self).visit_ts_type_query(n, _parent)
    }
    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr, _parent: &dyn Node) {
        (**self).visit_ts_type_query_expr(n, _parent)
    }
    fn visit_ts_import_type(&mut self, n: &TsImportType, _parent: &dyn Node) {
        (**self).visit_ts_import_type(n, _parent)
    }
    fn visit_ts_type_lit(&mut self, n: &TsTypeLit, _parent: &dyn Node) {
        (**self).visit_ts_type_lit(n, _parent)
    }
    fn visit_ts_array_type(&mut self, n: &TsArrayType, _parent: &dyn Node) {
        (**self).visit_ts_array_type(n, _parent)
    }
    fn visit_ts_tuple_type(&mut self, n: &TsTupleType, _parent: &dyn Node) {
        (**self).visit_ts_tuple_type(n, _parent)
    }
    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement, _parent: &dyn Node) {
        (**self).visit_ts_tuple_element(n, _parent)
    }
    fn visit_ts_optional_type(&mut self, n: &TsOptionalType, _parent: &dyn Node) {
        (**self).visit_ts_optional_type(n, _parent)
    }
    fn visit_ts_rest_type(&mut self, n: &TsRestType, _parent: &dyn Node) {
        (**self).visit_ts_rest_type(n, _parent)
    }
    fn visit_ts_union_or_intersection_type(
        &mut self,
        n: &TsUnionOrIntersectionType,
        _parent: &dyn Node,
    ) {
        (**self).visit_ts_union_or_intersection_type(n, _parent)
    }
    fn visit_ts_union_type(&mut self, n: &TsUnionType, _parent: &dyn Node) {
        (**self).visit_ts_union_type(n, _parent)
    }
    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType, _parent: &dyn Node) {
        (**self).visit_ts_intersection_type(n, _parent)
    }
    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType, _parent: &dyn Node) {
        (**self).visit_ts_conditional_type(n, _parent)
    }
    fn visit_ts_infer_type(&mut self, n: &TsInferType, _parent: &dyn Node) {
        (**self).visit_ts_infer_type(n, _parent)
    }
    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType, _parent: &dyn Node) {
        (**self).visit_ts_parenthesized_type(n, _parent)
    }
    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator, _parent: &dyn Node) {
        (**self).visit_ts_type_operator(n, _parent)
    }
    fn visit_ts_type_operator_op(&mut self, n: &TsTypeOperatorOp, _parent: &dyn Node) {
        (**self).visit_ts_type_operator_op(n, _parent)
    }
    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType, _parent: &dyn Node) {
        (**self).visit_ts_indexed_access_type(n, _parent)
    }
    fn visit_true_plus_minus(&mut self, n: &TruePlusMinus, _parent: &dyn Node) {
        (**self).visit_true_plus_minus(n, _parent)
    }
    fn visit_ts_mapped_type(&mut self, n: &TsMappedType, _parent: &dyn Node) {
        (**self).visit_ts_mapped_type(n, _parent)
    }
    fn visit_ts_lit_type(&mut self, n: &TsLitType, _parent: &dyn Node) {
        (**self).visit_ts_lit_type(n, _parent)
    }
    fn visit_ts_lit(&mut self, n: &TsLit, _parent: &dyn Node) {
        (**self).visit_ts_lit(n, _parent)
    }
    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl, _parent: &dyn Node) {
        (**self).visit_ts_interface_decl(n, _parent)
    }
    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody, _parent: &dyn Node) {
        (**self).visit_ts_interface_body(n, _parent)
    }
    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs, _parent: &dyn Node) {
        (**self).visit_ts_expr_with_type_args(n, _parent)
    }
    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl, _parent: &dyn Node) {
        (**self).visit_ts_type_alias_decl(n, _parent)
    }
    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl, _parent: &dyn Node) {
        (**self).visit_ts_enum_decl(n, _parent)
    }
    fn visit_ts_enum_member(&mut self, n: &TsEnumMember, _parent: &dyn Node) {
        (**self).visit_ts_enum_member(n, _parent)
    }
    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId, _parent: &dyn Node) {
        (**self).visit_ts_enum_member_id(n, _parent)
    }
    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl, _parent: &dyn Node) {
        (**self).visit_ts_module_decl(n, _parent)
    }
    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody, _parent: &dyn Node) {
        (**self).visit_ts_namespace_body(n, _parent)
    }
    fn visit_ts_module_block(&mut self, n: &TsModuleBlock, _parent: &dyn Node) {
        (**self).visit_ts_module_block(n, _parent)
    }
    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl, _parent: &dyn Node) {
        (**self).visit_ts_namespace_decl(n, _parent)
    }
    fn visit_ts_module_name(&mut self, n: &TsModuleName, _parent: &dyn Node) {
        (**self).visit_ts_module_name(n, _parent)
    }
    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl, _parent: &dyn Node) {
        (**self).visit_ts_import_equals_decl(n, _parent)
    }
    fn visit_ts_module_ref(&mut self, n: &TsModuleRef, _parent: &dyn Node) {
        (**self).visit_ts_module_ref(n, _parent)
    }
    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef, _parent: &dyn Node) {
        (**self).visit_ts_external_module_ref(n, _parent)
    }
    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment, _parent: &dyn Node) {
        (**self).visit_ts_export_assignment(n, _parent)
    }
    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl, _parent: &dyn Node) {
        (**self).visit_ts_namespace_export_decl(n, _parent)
    }
    fn visit_ts_as_expr(&mut self, n: &TsAsExpr, _parent: &dyn Node) {
        (**self).visit_ts_as_expr(n, _parent)
    }
    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion, _parent: &dyn Node) {
        (**self).visit_ts_type_assertion(n, _parent)
    }
    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr, _parent: &dyn Node) {
        (**self).visit_ts_non_null_expr(n, _parent)
    }
    fn visit_accessibility(&mut self, n: &Accessibility, _parent: &dyn Node) {
        (**self).visit_accessibility(n, _parent)
    }
    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion, _parent: &dyn Node) {
        (**self).visit_ts_const_assertion(n, _parent)
    }
}
impl<V> Visit for ::swc_visit::Optional<V>
where
    V: Visit,
{
    fn visit_class(&mut self, n: &Class, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_class(n, _parent)
        }
    }
    fn visit_class_member(&mut self, n: &ClassMember, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_class_member(n, _parent)
        }
    }
    fn visit_class_prop(&mut self, n: &ClassProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_class_prop(n, _parent)
        }
    }
    fn visit_private_prop(&mut self, n: &PrivateProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_private_prop(n, _parent)
        }
    }
    fn visit_class_method(&mut self, n: &ClassMethod, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_class_method(n, _parent)
        }
    }
    fn visit_private_method(&mut self, n: &PrivateMethod, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_private_method(n, _parent)
        }
    }
    fn visit_constructor(&mut self, n: &Constructor, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_constructor(n, _parent)
        }
    }
    fn visit_decorator(&mut self, n: &Decorator, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_decorator(n, _parent)
        }
    }
    fn visit_method_kind(&mut self, n: &MethodKind, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_method_kind(n, _parent)
        }
    }
    fn visit_decl(&mut self, n: &Decl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_decl(n, _parent)
        }
    }
    fn visit_fn_decl(&mut self, n: &FnDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_fn_decl(n, _parent)
        }
    }
    fn visit_class_decl(&mut self, n: &ClassDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_class_decl(n, _parent)
        }
    }
    fn visit_var_decl(&mut self, n: &VarDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_var_decl(n, _parent)
        }
    }
    fn visit_var_decl_kind(&mut self, n: &VarDeclKind, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_var_decl_kind(n, _parent)
        }
    }
    fn visit_var_declarator(&mut self, n: &VarDeclarator, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_var_declarator(n, _parent)
        }
    }
    fn visit_expr(&mut self, n: &Expr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_expr(n, _parent)
        }
    }
    fn visit_this_expr(&mut self, n: &ThisExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_this_expr(n, _parent)
        }
    }
    fn visit_array_lit(&mut self, n: &ArrayLit, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_array_lit(n, _parent)
        }
    }
    fn visit_object_lit(&mut self, n: &ObjectLit, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_object_lit(n, _parent)
        }
    }
    fn visit_prop_or_spread(&mut self, n: &PropOrSpread, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_prop_or_spread(n, _parent)
        }
    }
    fn visit_spread_element(&mut self, n: &SpreadElement, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_spread_element(n, _parent)
        }
    }
    fn visit_unary_expr(&mut self, n: &UnaryExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_unary_expr(n, _parent)
        }
    }
    fn visit_update_expr(&mut self, n: &UpdateExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_update_expr(n, _parent)
        }
    }
    fn visit_bin_expr(&mut self, n: &BinExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_bin_expr(n, _parent)
        }
    }
    fn visit_fn_expr(&mut self, n: &FnExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_fn_expr(n, _parent)
        }
    }
    fn visit_class_expr(&mut self, n: &ClassExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_class_expr(n, _parent)
        }
    }
    fn visit_assign_expr(&mut self, n: &AssignExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_assign_expr(n, _parent)
        }
    }
    fn visit_member_expr(&mut self, n: &MemberExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_member_expr(n, _parent)
        }
    }
    fn visit_cond_expr(&mut self, n: &CondExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_cond_expr(n, _parent)
        }
    }
    fn visit_call_expr(&mut self, n: &CallExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_call_expr(n, _parent)
        }
    }
    fn visit_new_expr(&mut self, n: &NewExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_new_expr(n, _parent)
        }
    }
    fn visit_seq_expr(&mut self, n: &SeqExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_seq_expr(n, _parent)
        }
    }
    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_arrow_expr(n, _parent)
        }
    }
    fn visit_yield_expr(&mut self, n: &YieldExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_yield_expr(n, _parent)
        }
    }
    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_meta_prop_expr(n, _parent)
        }
    }
    fn visit_await_expr(&mut self, n: &AwaitExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_await_expr(n, _parent)
        }
    }
    fn visit_tpl(&mut self, n: &Tpl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_tpl(n, _parent)
        }
    }
    fn visit_tagged_tpl(&mut self, n: &TaggedTpl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_tagged_tpl(n, _parent)
        }
    }
    fn visit_tpl_element(&mut self, n: &TplElement, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_tpl_element(n, _parent)
        }
    }
    fn visit_paren_expr(&mut self, n: &ParenExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_paren_expr(n, _parent)
        }
    }
    fn visit_expr_or_super(&mut self, n: &ExprOrSuper, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_expr_or_super(n, _parent)
        }
    }
    fn visit_super(&mut self, n: &Super, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_super(n, _parent)
        }
    }
    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_expr_or_spread(n, _parent)
        }
    }
    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_block_stmt_or_expr(n, _parent)
        }
    }
    fn visit_pat_or_expr(&mut self, n: &PatOrExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_pat_or_expr(n, _parent)
        }
    }
    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_opt_chain_expr(n, _parent)
        }
    }
    fn visit_function(&mut self, n: &Function, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_function(n, _parent)
        }
    }
    fn visit_param(&mut self, n: &Param, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_param(n, _parent)
        }
    }
    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_param_or_ts_param_prop(n, _parent)
        }
    }
    fn visit_ident(&mut self, n: &Ident, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ident(n, _parent)
        }
    }
    fn visit_private_name(&mut self, n: &PrivateName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_private_name(n, _parent)
        }
    }
    fn visit_jsx_object(&mut self, n: &JSXObject, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_object(n, _parent)
        }
    }
    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_member_expr(n, _parent)
        }
    }
    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_namespaced_name(n, _parent)
        }
    }
    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_empty_expr(n, _parent)
        }
    }
    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_expr_container(n, _parent)
        }
    }
    fn visit_jsx_expr(&mut self, n: &JSXExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_expr(n, _parent)
        }
    }
    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_spread_child(n, _parent)
        }
    }
    fn visit_jsx_element_name(&mut self, n: &JSXElementName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_element_name(n, _parent)
        }
    }
    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_opening_element(n, _parent)
        }
    }
    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_attr_or_spread(n, _parent)
        }
    }
    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_closing_element(n, _parent)
        }
    }
    fn visit_jsx_attr(&mut self, n: &JSXAttr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_attr(n, _parent)
        }
    }
    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_attr_name(n, _parent)
        }
    }
    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_attr_value(n, _parent)
        }
    }
    fn visit_jsx_text(&mut self, n: &JSXText, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_text(n, _parent)
        }
    }
    fn visit_jsx_element(&mut self, n: &JSXElement, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_element(n, _parent)
        }
    }
    fn visit_jsx_element_child(&mut self, n: &JSXElementChild, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_element_child(n, _parent)
        }
    }
    fn visit_jsx_fragment(&mut self, n: &JSXFragment, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_fragment(n, _parent)
        }
    }
    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_opening_fragment(n, _parent)
        }
    }
    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_jsx_closing_fragment(n, _parent)
        }
    }
    fn visit_invalid(&mut self, n: &Invalid, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_invalid(n, _parent)
        }
    }
    fn visit_lit(&mut self, n: &Lit, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_lit(n, _parent)
        }
    }
    fn visit_big_int(&mut self, n: &BigInt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_big_int(n, _parent)
        }
    }
    fn visit_str(&mut self, n: &Str, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_str(n, _parent)
        }
    }
    fn visit_bool(&mut self, n: &Bool, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_bool(n, _parent)
        }
    }
    fn visit_null(&mut self, n: &Null, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_null(n, _parent)
        }
    }
    fn visit_regex(&mut self, n: &Regex, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_regex(n, _parent)
        }
    }
    fn visit_number(&mut self, n: &Number, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_number(n, _parent)
        }
    }
    fn visit_program(&mut self, n: &Program, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_program(n, _parent)
        }
    }
    fn visit_module(&mut self, n: &Module, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_module(n, _parent)
        }
    }
    fn visit_script(&mut self, n: &Script, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_script(n, _parent)
        }
    }
    fn visit_module_item(&mut self, n: &ModuleItem, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_module_item(n, _parent)
        }
    }
    fn visit_module_decl(&mut self, n: &ModuleDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_module_decl(n, _parent)
        }
    }
    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_export_default_expr(n, _parent)
        }
    }
    fn visit_export_decl(&mut self, n: &ExportDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_export_decl(n, _parent)
        }
    }
    fn visit_import_decl(&mut self, n: &ImportDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_import_decl(n, _parent)
        }
    }
    fn visit_export_all(&mut self, n: &ExportAll, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_export_all(n, _parent)
        }
    }
    fn visit_named_export(&mut self, n: &NamedExport, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_named_export(n, _parent)
        }
    }
    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_export_default_decl(n, _parent)
        }
    }
    fn visit_default_decl(&mut self, n: &DefaultDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_default_decl(n, _parent)
        }
    }
    fn visit_import_specifier(&mut self, n: &ImportSpecifier, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_import_specifier(n, _parent)
        }
    }
    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_import_default_specifier(n, _parent)
        }
    }
    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_import_star_as_specifier(n, _parent)
        }
    }
    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_import_named_specifier(n, _parent)
        }
    }
    fn visit_export_specifier(&mut self, n: &ExportSpecifier, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_export_specifier(n, _parent)
        }
    }
    fn visit_export_namespace_specifier(
        &mut self,
        n: &ExportNamespaceSpecifier,
        _parent: &dyn Node,
    ) {
        if self.enabled {
            self.visitor.visit_export_namespace_specifier(n, _parent)
        }
    }
    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_export_default_specifier(n, _parent)
        }
    }
    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_export_named_specifier(n, _parent)
        }
    }
    fn visit_binary_op(&mut self, n: &BinaryOp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_binary_op(n, _parent)
        }
    }
    fn visit_assign_op(&mut self, n: &AssignOp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_assign_op(n, _parent)
        }
    }
    fn visit_update_op(&mut self, n: &UpdateOp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_update_op(n, _parent)
        }
    }
    fn visit_unary_op(&mut self, n: &UnaryOp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_unary_op(n, _parent)
        }
    }
    fn visit_pat(&mut self, n: &Pat, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_pat(n, _parent)
        }
    }
    fn visit_array_pat(&mut self, n: &ArrayPat, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_array_pat(n, _parent)
        }
    }
    fn visit_object_pat(&mut self, n: &ObjectPat, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_object_pat(n, _parent)
        }
    }
    fn visit_assign_pat(&mut self, n: &AssignPat, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_assign_pat(n, _parent)
        }
    }
    fn visit_rest_pat(&mut self, n: &RestPat, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_rest_pat(n, _parent)
        }
    }
    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_object_pat_prop(n, _parent)
        }
    }
    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_key_value_pat_prop(n, _parent)
        }
    }
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_assign_pat_prop(n, _parent)
        }
    }
    fn visit_prop(&mut self, n: &Prop, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_prop(n, _parent)
        }
    }
    fn visit_key_value_prop(&mut self, n: &KeyValueProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_key_value_prop(n, _parent)
        }
    }
    fn visit_assign_prop(&mut self, n: &AssignProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_assign_prop(n, _parent)
        }
    }
    fn visit_getter_prop(&mut self, n: &GetterProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_getter_prop(n, _parent)
        }
    }
    fn visit_setter_prop(&mut self, n: &SetterProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_setter_prop(n, _parent)
        }
    }
    fn visit_method_prop(&mut self, n: &MethodProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_method_prop(n, _parent)
        }
    }
    fn visit_prop_name(&mut self, n: &PropName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_prop_name(n, _parent)
        }
    }
    fn visit_computed_prop_name(&mut self, n: &ComputedPropName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_computed_prop_name(n, _parent)
        }
    }
    fn visit_block_stmt(&mut self, n: &BlockStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_block_stmt(n, _parent)
        }
    }
    fn visit_stmt(&mut self, n: &Stmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_stmt(n, _parent)
        }
    }
    fn visit_expr_stmt(&mut self, n: &ExprStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_expr_stmt(n, _parent)
        }
    }
    fn visit_empty_stmt(&mut self, n: &EmptyStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_empty_stmt(n, _parent)
        }
    }
    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_debugger_stmt(n, _parent)
        }
    }
    fn visit_with_stmt(&mut self, n: &WithStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_with_stmt(n, _parent)
        }
    }
    fn visit_return_stmt(&mut self, n: &ReturnStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_return_stmt(n, _parent)
        }
    }
    fn visit_labeled_stmt(&mut self, n: &LabeledStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_labeled_stmt(n, _parent)
        }
    }
    fn visit_break_stmt(&mut self, n: &BreakStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_break_stmt(n, _parent)
        }
    }
    fn visit_continue_stmt(&mut self, n: &ContinueStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_continue_stmt(n, _parent)
        }
    }
    fn visit_if_stmt(&mut self, n: &IfStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_if_stmt(n, _parent)
        }
    }
    fn visit_switch_stmt(&mut self, n: &SwitchStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_switch_stmt(n, _parent)
        }
    }
    fn visit_throw_stmt(&mut self, n: &ThrowStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_throw_stmt(n, _parent)
        }
    }
    fn visit_try_stmt(&mut self, n: &TryStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_try_stmt(n, _parent)
        }
    }
    fn visit_while_stmt(&mut self, n: &WhileStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_while_stmt(n, _parent)
        }
    }
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_do_while_stmt(n, _parent)
        }
    }
    fn visit_for_stmt(&mut self, n: &ForStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_for_stmt(n, _parent)
        }
    }
    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_for_in_stmt(n, _parent)
        }
    }
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_for_of_stmt(n, _parent)
        }
    }
    fn visit_switch_case(&mut self, n: &SwitchCase, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_switch_case(n, _parent)
        }
    }
    fn visit_catch_clause(&mut self, n: &CatchClause, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_catch_clause(n, _parent)
        }
    }
    fn visit_var_decl_or_pat(&mut self, n: &VarDeclOrPat, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_var_decl_or_pat(n, _parent)
        }
    }
    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_var_decl_or_expr(n, _parent)
        }
    }
    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_ann(n, _parent)
        }
    }
    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_param_decl(n, _parent)
        }
    }
    fn visit_ts_type_param(&mut self, n: &TsTypeParam, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_param(n, _parent)
        }
    }
    fn visit_ts_type_param_instantiation(
        &mut self,
        n: &TsTypeParamInstantiation,
        _parent: &dyn Node,
    ) {
        if self.enabled {
            self.visitor.visit_ts_type_param_instantiation(n, _parent)
        }
    }
    fn visit_ts_type_cast_expr(&mut self, n: &TsTypeCastExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_cast_expr(n, _parent)
        }
    }
    fn visit_ts_param_prop(&mut self, n: &TsParamProp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_param_prop(n, _parent)
        }
    }
    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_param_prop_param(n, _parent)
        }
    }
    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_qualified_name(n, _parent)
        }
    }
    fn visit_ts_entity_name(&mut self, n: &TsEntityName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_entity_name(n, _parent)
        }
    }
    fn visit_ts_signature_decl(&mut self, n: &TsSignatureDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_signature_decl(n, _parent)
        }
    }
    fn visit_ts_type_element(&mut self, n: &TsTypeElement, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_element(n, _parent)
        }
    }
    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_call_signature_decl(n, _parent)
        }
    }
    fn visit_ts_construct_signature_decl(
        &mut self,
        n: &TsConstructSignatureDecl,
        _parent: &dyn Node,
    ) {
        if self.enabled {
            self.visitor.visit_ts_construct_signature_decl(n, _parent)
        }
    }
    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_property_signature(n, _parent)
        }
    }
    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_method_signature(n, _parent)
        }
    }
    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_index_signature(n, _parent)
        }
    }
    fn visit_ts_type(&mut self, n: &TsType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type(n, _parent)
        }
    }
    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_fn_or_constructor_type(n, _parent)
        }
    }
    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_keyword_type(n, _parent)
        }
    }
    fn visit_ts_keyword_type_kind(&mut self, n: &TsKeywordTypeKind, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_keyword_type_kind(n, _parent)
        }
    }
    fn visit_ts_this_type(&mut self, n: &TsThisType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_this_type(n, _parent)
        }
    }
    fn visit_ts_fn_param(&mut self, n: &TsFnParam, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_fn_param(n, _parent)
        }
    }
    fn visit_ts_fn_type(&mut self, n: &TsFnType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_fn_type(n, _parent)
        }
    }
    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_constructor_type(n, _parent)
        }
    }
    fn visit_ts_type_ref(&mut self, n: &TsTypeRef, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_ref(n, _parent)
        }
    }
    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_predicate(n, _parent)
        }
    }
    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_this_type_or_ident(n, _parent)
        }
    }
    fn visit_ts_type_query(&mut self, n: &TsTypeQuery, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_query(n, _parent)
        }
    }
    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_query_expr(n, _parent)
        }
    }
    fn visit_ts_import_type(&mut self, n: &TsImportType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_import_type(n, _parent)
        }
    }
    fn visit_ts_type_lit(&mut self, n: &TsTypeLit, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_lit(n, _parent)
        }
    }
    fn visit_ts_array_type(&mut self, n: &TsArrayType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_array_type(n, _parent)
        }
    }
    fn visit_ts_tuple_type(&mut self, n: &TsTupleType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_tuple_type(n, _parent)
        }
    }
    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_tuple_element(n, _parent)
        }
    }
    fn visit_ts_optional_type(&mut self, n: &TsOptionalType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_optional_type(n, _parent)
        }
    }
    fn visit_ts_rest_type(&mut self, n: &TsRestType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_rest_type(n, _parent)
        }
    }
    fn visit_ts_union_or_intersection_type(
        &mut self,
        n: &TsUnionOrIntersectionType,
        _parent: &dyn Node,
    ) {
        if self.enabled {
            self.visitor.visit_ts_union_or_intersection_type(n, _parent)
        }
    }
    fn visit_ts_union_type(&mut self, n: &TsUnionType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_union_type(n, _parent)
        }
    }
    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_intersection_type(n, _parent)
        }
    }
    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_conditional_type(n, _parent)
        }
    }
    fn visit_ts_infer_type(&mut self, n: &TsInferType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_infer_type(n, _parent)
        }
    }
    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_parenthesized_type(n, _parent)
        }
    }
    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_operator(n, _parent)
        }
    }
    fn visit_ts_type_operator_op(&mut self, n: &TsTypeOperatorOp, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_operator_op(n, _parent)
        }
    }
    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_indexed_access_type(n, _parent)
        }
    }
    fn visit_true_plus_minus(&mut self, n: &TruePlusMinus, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_true_plus_minus(n, _parent)
        }
    }
    fn visit_ts_mapped_type(&mut self, n: &TsMappedType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_mapped_type(n, _parent)
        }
    }
    fn visit_ts_lit_type(&mut self, n: &TsLitType, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_lit_type(n, _parent)
        }
    }
    fn visit_ts_lit(&mut self, n: &TsLit, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_lit(n, _parent)
        }
    }
    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_interface_decl(n, _parent)
        }
    }
    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_interface_body(n, _parent)
        }
    }
    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_expr_with_type_args(n, _parent)
        }
    }
    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_alias_decl(n, _parent)
        }
    }
    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_enum_decl(n, _parent)
        }
    }
    fn visit_ts_enum_member(&mut self, n: &TsEnumMember, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_enum_member(n, _parent)
        }
    }
    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_enum_member_id(n, _parent)
        }
    }
    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_module_decl(n, _parent)
        }
    }
    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_namespace_body(n, _parent)
        }
    }
    fn visit_ts_module_block(&mut self, n: &TsModuleBlock, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_module_block(n, _parent)
        }
    }
    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_namespace_decl(n, _parent)
        }
    }
    fn visit_ts_module_name(&mut self, n: &TsModuleName, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_module_name(n, _parent)
        }
    }
    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_import_equals_decl(n, _parent)
        }
    }
    fn visit_ts_module_ref(&mut self, n: &TsModuleRef, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_module_ref(n, _parent)
        }
    }
    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_external_module_ref(n, _parent)
        }
    }
    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_export_assignment(n, _parent)
        }
    }
    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_namespace_export_decl(n, _parent)
        }
    }
    fn visit_ts_as_expr(&mut self, n: &TsAsExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_as_expr(n, _parent)
        }
    }
    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_type_assertion(n, _parent)
        }
    }
    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_non_null_expr(n, _parent)
        }
    }
    fn visit_accessibility(&mut self, n: &Accessibility, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_accessibility(n, _parent)
        }
    }
    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion, _parent: &dyn Node) {
        if self.enabled {
            self.visitor.visit_ts_const_assertion(n, _parent)
        }
    }
}
impl<A, B> Visit for ::swc_visit::Either<A, B>
where
    A: Visit,
    B: Visit,
{
    fn visit_class(&mut self, n: &Class, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_class(n, _parent),
            swc_visit::Either::Right(v) => v.visit_class(n, _parent),
        }
    }
    fn visit_class_member(&mut self, n: &ClassMember, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_class_member(n, _parent),
            swc_visit::Either::Right(v) => v.visit_class_member(n, _parent),
        }
    }
    fn visit_class_prop(&mut self, n: &ClassProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_class_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_class_prop(n, _parent),
        }
    }
    fn visit_private_prop(&mut self, n: &PrivateProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_private_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_private_prop(n, _parent),
        }
    }
    fn visit_class_method(&mut self, n: &ClassMethod, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_class_method(n, _parent),
            swc_visit::Either::Right(v) => v.visit_class_method(n, _parent),
        }
    }
    fn visit_private_method(&mut self, n: &PrivateMethod, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_private_method(n, _parent),
            swc_visit::Either::Right(v) => v.visit_private_method(n, _parent),
        }
    }
    fn visit_constructor(&mut self, n: &Constructor, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_constructor(n, _parent),
            swc_visit::Either::Right(v) => v.visit_constructor(n, _parent),
        }
    }
    fn visit_decorator(&mut self, n: &Decorator, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_decorator(n, _parent),
            swc_visit::Either::Right(v) => v.visit_decorator(n, _parent),
        }
    }
    fn visit_method_kind(&mut self, n: &MethodKind, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_method_kind(n, _parent),
            swc_visit::Either::Right(v) => v.visit_method_kind(n, _parent),
        }
    }
    fn visit_decl(&mut self, n: &Decl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_decl(n, _parent),
        }
    }
    fn visit_fn_decl(&mut self, n: &FnDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_fn_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_fn_decl(n, _parent),
        }
    }
    fn visit_class_decl(&mut self, n: &ClassDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_class_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_class_decl(n, _parent),
        }
    }
    fn visit_var_decl(&mut self, n: &VarDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_var_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_var_decl(n, _parent),
        }
    }
    fn visit_var_decl_kind(&mut self, n: &VarDeclKind, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_var_decl_kind(n, _parent),
            swc_visit::Either::Right(v) => v.visit_var_decl_kind(n, _parent),
        }
    }
    fn visit_var_declarator(&mut self, n: &VarDeclarator, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_var_declarator(n, _parent),
            swc_visit::Either::Right(v) => v.visit_var_declarator(n, _parent),
        }
    }
    fn visit_expr(&mut self, n: &Expr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_expr(n, _parent),
        }
    }
    fn visit_this_expr(&mut self, n: &ThisExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_this_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_this_expr(n, _parent),
        }
    }
    fn visit_array_lit(&mut self, n: &ArrayLit, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_array_lit(n, _parent),
            swc_visit::Either::Right(v) => v.visit_array_lit(n, _parent),
        }
    }
    fn visit_object_lit(&mut self, n: &ObjectLit, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_object_lit(n, _parent),
            swc_visit::Either::Right(v) => v.visit_object_lit(n, _parent),
        }
    }
    fn visit_prop_or_spread(&mut self, n: &PropOrSpread, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_prop_or_spread(n, _parent),
            swc_visit::Either::Right(v) => v.visit_prop_or_spread(n, _parent),
        }
    }
    fn visit_spread_element(&mut self, n: &SpreadElement, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_spread_element(n, _parent),
            swc_visit::Either::Right(v) => v.visit_spread_element(n, _parent),
        }
    }
    fn visit_unary_expr(&mut self, n: &UnaryExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_unary_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_unary_expr(n, _parent),
        }
    }
    fn visit_update_expr(&mut self, n: &UpdateExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_update_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_update_expr(n, _parent),
        }
    }
    fn visit_bin_expr(&mut self, n: &BinExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_bin_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_bin_expr(n, _parent),
        }
    }
    fn visit_fn_expr(&mut self, n: &FnExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_fn_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_fn_expr(n, _parent),
        }
    }
    fn visit_class_expr(&mut self, n: &ClassExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_class_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_class_expr(n, _parent),
        }
    }
    fn visit_assign_expr(&mut self, n: &AssignExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_assign_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_assign_expr(n, _parent),
        }
    }
    fn visit_member_expr(&mut self, n: &MemberExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_member_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_member_expr(n, _parent),
        }
    }
    fn visit_cond_expr(&mut self, n: &CondExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_cond_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_cond_expr(n, _parent),
        }
    }
    fn visit_call_expr(&mut self, n: &CallExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_call_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_call_expr(n, _parent),
        }
    }
    fn visit_new_expr(&mut self, n: &NewExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_new_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_new_expr(n, _parent),
        }
    }
    fn visit_seq_expr(&mut self, n: &SeqExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_seq_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_seq_expr(n, _parent),
        }
    }
    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_arrow_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_arrow_expr(n, _parent),
        }
    }
    fn visit_yield_expr(&mut self, n: &YieldExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_yield_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_yield_expr(n, _parent),
        }
    }
    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_meta_prop_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_meta_prop_expr(n, _parent),
        }
    }
    fn visit_await_expr(&mut self, n: &AwaitExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_await_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_await_expr(n, _parent),
        }
    }
    fn visit_tpl(&mut self, n: &Tpl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_tpl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_tpl(n, _parent),
        }
    }
    fn visit_tagged_tpl(&mut self, n: &TaggedTpl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_tagged_tpl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_tagged_tpl(n, _parent),
        }
    }
    fn visit_tpl_element(&mut self, n: &TplElement, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_tpl_element(n, _parent),
            swc_visit::Either::Right(v) => v.visit_tpl_element(n, _parent),
        }
    }
    fn visit_paren_expr(&mut self, n: &ParenExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_paren_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_paren_expr(n, _parent),
        }
    }
    fn visit_expr_or_super(&mut self, n: &ExprOrSuper, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_expr_or_super(n, _parent),
            swc_visit::Either::Right(v) => v.visit_expr_or_super(n, _parent),
        }
    }
    fn visit_super(&mut self, n: &Super, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_super(n, _parent),
            swc_visit::Either::Right(v) => v.visit_super(n, _parent),
        }
    }
    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_expr_or_spread(n, _parent),
            swc_visit::Either::Right(v) => v.visit_expr_or_spread(n, _parent),
        }
    }
    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_block_stmt_or_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_block_stmt_or_expr(n, _parent),
        }
    }
    fn visit_pat_or_expr(&mut self, n: &PatOrExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_pat_or_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_pat_or_expr(n, _parent),
        }
    }
    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_opt_chain_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_opt_chain_expr(n, _parent),
        }
    }
    fn visit_function(&mut self, n: &Function, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_function(n, _parent),
            swc_visit::Either::Right(v) => v.visit_function(n, _parent),
        }
    }
    fn visit_param(&mut self, n: &Param, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_param(n, _parent),
            swc_visit::Either::Right(v) => v.visit_param(n, _parent),
        }
    }
    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_param_or_ts_param_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_param_or_ts_param_prop(n, _parent),
        }
    }
    fn visit_ident(&mut self, n: &Ident, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ident(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ident(n, _parent),
        }
    }
    fn visit_private_name(&mut self, n: &PrivateName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_private_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_private_name(n, _parent),
        }
    }
    fn visit_jsx_object(&mut self, n: &JSXObject, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_object(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_object(n, _parent),
        }
    }
    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_member_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_member_expr(n, _parent),
        }
    }
    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_namespaced_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_namespaced_name(n, _parent),
        }
    }
    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_empty_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_empty_expr(n, _parent),
        }
    }
    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_expr_container(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_expr_container(n, _parent),
        }
    }
    fn visit_jsx_expr(&mut self, n: &JSXExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_expr(n, _parent),
        }
    }
    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_spread_child(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_spread_child(n, _parent),
        }
    }
    fn visit_jsx_element_name(&mut self, n: &JSXElementName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_element_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_element_name(n, _parent),
        }
    }
    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_opening_element(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_opening_element(n, _parent),
        }
    }
    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_attr_or_spread(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_attr_or_spread(n, _parent),
        }
    }
    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_closing_element(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_closing_element(n, _parent),
        }
    }
    fn visit_jsx_attr(&mut self, n: &JSXAttr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_attr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_attr(n, _parent),
        }
    }
    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_attr_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_attr_name(n, _parent),
        }
    }
    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_attr_value(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_attr_value(n, _parent),
        }
    }
    fn visit_jsx_text(&mut self, n: &JSXText, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_text(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_text(n, _parent),
        }
    }
    fn visit_jsx_element(&mut self, n: &JSXElement, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_element(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_element(n, _parent),
        }
    }
    fn visit_jsx_element_child(&mut self, n: &JSXElementChild, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_element_child(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_element_child(n, _parent),
        }
    }
    fn visit_jsx_fragment(&mut self, n: &JSXFragment, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_fragment(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_fragment(n, _parent),
        }
    }
    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_opening_fragment(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_opening_fragment(n, _parent),
        }
    }
    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_jsx_closing_fragment(n, _parent),
            swc_visit::Either::Right(v) => v.visit_jsx_closing_fragment(n, _parent),
        }
    }
    fn visit_invalid(&mut self, n: &Invalid, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_invalid(n, _parent),
            swc_visit::Either::Right(v) => v.visit_invalid(n, _parent),
        }
    }
    fn visit_lit(&mut self, n: &Lit, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_lit(n, _parent),
            swc_visit::Either::Right(v) => v.visit_lit(n, _parent),
        }
    }
    fn visit_big_int(&mut self, n: &BigInt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_big_int(n, _parent),
            swc_visit::Either::Right(v) => v.visit_big_int(n, _parent),
        }
    }
    fn visit_str(&mut self, n: &Str, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_str(n, _parent),
            swc_visit::Either::Right(v) => v.visit_str(n, _parent),
        }
    }
    fn visit_bool(&mut self, n: &Bool, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_bool(n, _parent),
            swc_visit::Either::Right(v) => v.visit_bool(n, _parent),
        }
    }
    fn visit_null(&mut self, n: &Null, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_null(n, _parent),
            swc_visit::Either::Right(v) => v.visit_null(n, _parent),
        }
    }
    fn visit_regex(&mut self, n: &Regex, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_regex(n, _parent),
            swc_visit::Either::Right(v) => v.visit_regex(n, _parent),
        }
    }
    fn visit_number(&mut self, n: &Number, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_number(n, _parent),
            swc_visit::Either::Right(v) => v.visit_number(n, _parent),
        }
    }
    fn visit_program(&mut self, n: &Program, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_program(n, _parent),
            swc_visit::Either::Right(v) => v.visit_program(n, _parent),
        }
    }
    fn visit_module(&mut self, n: &Module, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_module(n, _parent),
            swc_visit::Either::Right(v) => v.visit_module(n, _parent),
        }
    }
    fn visit_script(&mut self, n: &Script, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_script(n, _parent),
            swc_visit::Either::Right(v) => v.visit_script(n, _parent),
        }
    }
    fn visit_module_item(&mut self, n: &ModuleItem, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_module_item(n, _parent),
            swc_visit::Either::Right(v) => v.visit_module_item(n, _parent),
        }
    }
    fn visit_module_decl(&mut self, n: &ModuleDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_module_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_module_decl(n, _parent),
        }
    }
    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_export_default_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_export_default_expr(n, _parent),
        }
    }
    fn visit_export_decl(&mut self, n: &ExportDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_export_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_export_decl(n, _parent),
        }
    }
    fn visit_import_decl(&mut self, n: &ImportDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_import_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_import_decl(n, _parent),
        }
    }
    fn visit_export_all(&mut self, n: &ExportAll, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_export_all(n, _parent),
            swc_visit::Either::Right(v) => v.visit_export_all(n, _parent),
        }
    }
    fn visit_named_export(&mut self, n: &NamedExport, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_named_export(n, _parent),
            swc_visit::Either::Right(v) => v.visit_named_export(n, _parent),
        }
    }
    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_export_default_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_export_default_decl(n, _parent),
        }
    }
    fn visit_default_decl(&mut self, n: &DefaultDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_default_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_default_decl(n, _parent),
        }
    }
    fn visit_import_specifier(&mut self, n: &ImportSpecifier, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_import_specifier(n, _parent),
            swc_visit::Either::Right(v) => v.visit_import_specifier(n, _parent),
        }
    }
    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_import_default_specifier(n, _parent),
            swc_visit::Either::Right(v) => v.visit_import_default_specifier(n, _parent),
        }
    }
    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_import_star_as_specifier(n, _parent),
            swc_visit::Either::Right(v) => v.visit_import_star_as_specifier(n, _parent),
        }
    }
    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_import_named_specifier(n, _parent),
            swc_visit::Either::Right(v) => v.visit_import_named_specifier(n, _parent),
        }
    }
    fn visit_export_specifier(&mut self, n: &ExportSpecifier, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_export_specifier(n, _parent),
            swc_visit::Either::Right(v) => v.visit_export_specifier(n, _parent),
        }
    }
    fn visit_export_namespace_specifier(
        &mut self,
        n: &ExportNamespaceSpecifier,
        _parent: &dyn Node,
    ) {
        match self {
            swc_visit::Either::Left(v) => v.visit_export_namespace_specifier(n, _parent),
            swc_visit::Either::Right(v) => v.visit_export_namespace_specifier(n, _parent),
        }
    }
    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_export_default_specifier(n, _parent),
            swc_visit::Either::Right(v) => v.visit_export_default_specifier(n, _parent),
        }
    }
    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_export_named_specifier(n, _parent),
            swc_visit::Either::Right(v) => v.visit_export_named_specifier(n, _parent),
        }
    }
    fn visit_binary_op(&mut self, n: &BinaryOp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_binary_op(n, _parent),
            swc_visit::Either::Right(v) => v.visit_binary_op(n, _parent),
        }
    }
    fn visit_assign_op(&mut self, n: &AssignOp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_assign_op(n, _parent),
            swc_visit::Either::Right(v) => v.visit_assign_op(n, _parent),
        }
    }
    fn visit_update_op(&mut self, n: &UpdateOp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_update_op(n, _parent),
            swc_visit::Either::Right(v) => v.visit_update_op(n, _parent),
        }
    }
    fn visit_unary_op(&mut self, n: &UnaryOp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_unary_op(n, _parent),
            swc_visit::Either::Right(v) => v.visit_unary_op(n, _parent),
        }
    }
    fn visit_pat(&mut self, n: &Pat, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_pat(n, _parent),
            swc_visit::Either::Right(v) => v.visit_pat(n, _parent),
        }
    }
    fn visit_array_pat(&mut self, n: &ArrayPat, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_array_pat(n, _parent),
            swc_visit::Either::Right(v) => v.visit_array_pat(n, _parent),
        }
    }
    fn visit_object_pat(&mut self, n: &ObjectPat, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_object_pat(n, _parent),
            swc_visit::Either::Right(v) => v.visit_object_pat(n, _parent),
        }
    }
    fn visit_assign_pat(&mut self, n: &AssignPat, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_assign_pat(n, _parent),
            swc_visit::Either::Right(v) => v.visit_assign_pat(n, _parent),
        }
    }
    fn visit_rest_pat(&mut self, n: &RestPat, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_rest_pat(n, _parent),
            swc_visit::Either::Right(v) => v.visit_rest_pat(n, _parent),
        }
    }
    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_object_pat_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_object_pat_prop(n, _parent),
        }
    }
    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_key_value_pat_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_key_value_pat_prop(n, _parent),
        }
    }
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_assign_pat_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_assign_pat_prop(n, _parent),
        }
    }
    fn visit_prop(&mut self, n: &Prop, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_prop(n, _parent),
        }
    }
    fn visit_key_value_prop(&mut self, n: &KeyValueProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_key_value_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_key_value_prop(n, _parent),
        }
    }
    fn visit_assign_prop(&mut self, n: &AssignProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_assign_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_assign_prop(n, _parent),
        }
    }
    fn visit_getter_prop(&mut self, n: &GetterProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_getter_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_getter_prop(n, _parent),
        }
    }
    fn visit_setter_prop(&mut self, n: &SetterProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_setter_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_setter_prop(n, _parent),
        }
    }
    fn visit_method_prop(&mut self, n: &MethodProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_method_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_method_prop(n, _parent),
        }
    }
    fn visit_prop_name(&mut self, n: &PropName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_prop_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_prop_name(n, _parent),
        }
    }
    fn visit_computed_prop_name(&mut self, n: &ComputedPropName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_computed_prop_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_computed_prop_name(n, _parent),
        }
    }
    fn visit_block_stmt(&mut self, n: &BlockStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_block_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_block_stmt(n, _parent),
        }
    }
    fn visit_stmt(&mut self, n: &Stmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_stmt(n, _parent),
        }
    }
    fn visit_expr_stmt(&mut self, n: &ExprStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_expr_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_expr_stmt(n, _parent),
        }
    }
    fn visit_empty_stmt(&mut self, n: &EmptyStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_empty_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_empty_stmt(n, _parent),
        }
    }
    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_debugger_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_debugger_stmt(n, _parent),
        }
    }
    fn visit_with_stmt(&mut self, n: &WithStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_with_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_with_stmt(n, _parent),
        }
    }
    fn visit_return_stmt(&mut self, n: &ReturnStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_return_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_return_stmt(n, _parent),
        }
    }
    fn visit_labeled_stmt(&mut self, n: &LabeledStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_labeled_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_labeled_stmt(n, _parent),
        }
    }
    fn visit_break_stmt(&mut self, n: &BreakStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_break_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_break_stmt(n, _parent),
        }
    }
    fn visit_continue_stmt(&mut self, n: &ContinueStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_continue_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_continue_stmt(n, _parent),
        }
    }
    fn visit_if_stmt(&mut self, n: &IfStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_if_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_if_stmt(n, _parent),
        }
    }
    fn visit_switch_stmt(&mut self, n: &SwitchStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_switch_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_switch_stmt(n, _parent),
        }
    }
    fn visit_throw_stmt(&mut self, n: &ThrowStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_throw_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_throw_stmt(n, _parent),
        }
    }
    fn visit_try_stmt(&mut self, n: &TryStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_try_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_try_stmt(n, _parent),
        }
    }
    fn visit_while_stmt(&mut self, n: &WhileStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_while_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_while_stmt(n, _parent),
        }
    }
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_do_while_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_do_while_stmt(n, _parent),
        }
    }
    fn visit_for_stmt(&mut self, n: &ForStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_for_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_for_stmt(n, _parent),
        }
    }
    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_for_in_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_for_in_stmt(n, _parent),
        }
    }
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_for_of_stmt(n, _parent),
            swc_visit::Either::Right(v) => v.visit_for_of_stmt(n, _parent),
        }
    }
    fn visit_switch_case(&mut self, n: &SwitchCase, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_switch_case(n, _parent),
            swc_visit::Either::Right(v) => v.visit_switch_case(n, _parent),
        }
    }
    fn visit_catch_clause(&mut self, n: &CatchClause, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_catch_clause(n, _parent),
            swc_visit::Either::Right(v) => v.visit_catch_clause(n, _parent),
        }
    }
    fn visit_var_decl_or_pat(&mut self, n: &VarDeclOrPat, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_var_decl_or_pat(n, _parent),
            swc_visit::Either::Right(v) => v.visit_var_decl_or_pat(n, _parent),
        }
    }
    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_var_decl_or_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_var_decl_or_expr(n, _parent),
        }
    }
    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_ann(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_ann(n, _parent),
        }
    }
    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_param_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_param_decl(n, _parent),
        }
    }
    fn visit_ts_type_param(&mut self, n: &TsTypeParam, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_param(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_param(n, _parent),
        }
    }
    fn visit_ts_type_param_instantiation(
        &mut self,
        n: &TsTypeParamInstantiation,
        _parent: &dyn Node,
    ) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_param_instantiation(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_param_instantiation(n, _parent),
        }
    }
    fn visit_ts_type_cast_expr(&mut self, n: &TsTypeCastExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_cast_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_cast_expr(n, _parent),
        }
    }
    fn visit_ts_param_prop(&mut self, n: &TsParamProp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_param_prop(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_param_prop(n, _parent),
        }
    }
    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_param_prop_param(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_param_prop_param(n, _parent),
        }
    }
    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_qualified_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_qualified_name(n, _parent),
        }
    }
    fn visit_ts_entity_name(&mut self, n: &TsEntityName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_entity_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_entity_name(n, _parent),
        }
    }
    fn visit_ts_signature_decl(&mut self, n: &TsSignatureDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_signature_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_signature_decl(n, _parent),
        }
    }
    fn visit_ts_type_element(&mut self, n: &TsTypeElement, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_element(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_element(n, _parent),
        }
    }
    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_call_signature_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_call_signature_decl(n, _parent),
        }
    }
    fn visit_ts_construct_signature_decl(
        &mut self,
        n: &TsConstructSignatureDecl,
        _parent: &dyn Node,
    ) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_construct_signature_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_construct_signature_decl(n, _parent),
        }
    }
    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_property_signature(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_property_signature(n, _parent),
        }
    }
    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_method_signature(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_method_signature(n, _parent),
        }
    }
    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_index_signature(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_index_signature(n, _parent),
        }
    }
    fn visit_ts_type(&mut self, n: &TsType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type(n, _parent),
        }
    }
    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_fn_or_constructor_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_fn_or_constructor_type(n, _parent),
        }
    }
    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_keyword_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_keyword_type(n, _parent),
        }
    }
    fn visit_ts_keyword_type_kind(&mut self, n: &TsKeywordTypeKind, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_keyword_type_kind(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_keyword_type_kind(n, _parent),
        }
    }
    fn visit_ts_this_type(&mut self, n: &TsThisType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_this_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_this_type(n, _parent),
        }
    }
    fn visit_ts_fn_param(&mut self, n: &TsFnParam, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_fn_param(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_fn_param(n, _parent),
        }
    }
    fn visit_ts_fn_type(&mut self, n: &TsFnType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_fn_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_fn_type(n, _parent),
        }
    }
    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_constructor_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_constructor_type(n, _parent),
        }
    }
    fn visit_ts_type_ref(&mut self, n: &TsTypeRef, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_ref(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_ref(n, _parent),
        }
    }
    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_predicate(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_predicate(n, _parent),
        }
    }
    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_this_type_or_ident(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_this_type_or_ident(n, _parent),
        }
    }
    fn visit_ts_type_query(&mut self, n: &TsTypeQuery, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_query(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_query(n, _parent),
        }
    }
    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_query_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_query_expr(n, _parent),
        }
    }
    fn visit_ts_import_type(&mut self, n: &TsImportType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_import_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_import_type(n, _parent),
        }
    }
    fn visit_ts_type_lit(&mut self, n: &TsTypeLit, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_lit(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_lit(n, _parent),
        }
    }
    fn visit_ts_array_type(&mut self, n: &TsArrayType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_array_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_array_type(n, _parent),
        }
    }
    fn visit_ts_tuple_type(&mut self, n: &TsTupleType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_tuple_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_tuple_type(n, _parent),
        }
    }
    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_tuple_element(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_tuple_element(n, _parent),
        }
    }
    fn visit_ts_optional_type(&mut self, n: &TsOptionalType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_optional_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_optional_type(n, _parent),
        }
    }
    fn visit_ts_rest_type(&mut self, n: &TsRestType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_rest_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_rest_type(n, _parent),
        }
    }
    fn visit_ts_union_or_intersection_type(
        &mut self,
        n: &TsUnionOrIntersectionType,
        _parent: &dyn Node,
    ) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_union_or_intersection_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_union_or_intersection_type(n, _parent),
        }
    }
    fn visit_ts_union_type(&mut self, n: &TsUnionType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_union_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_union_type(n, _parent),
        }
    }
    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_intersection_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_intersection_type(n, _parent),
        }
    }
    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_conditional_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_conditional_type(n, _parent),
        }
    }
    fn visit_ts_infer_type(&mut self, n: &TsInferType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_infer_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_infer_type(n, _parent),
        }
    }
    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_parenthesized_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_parenthesized_type(n, _parent),
        }
    }
    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_operator(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_operator(n, _parent),
        }
    }
    fn visit_ts_type_operator_op(&mut self, n: &TsTypeOperatorOp, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_operator_op(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_operator_op(n, _parent),
        }
    }
    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_indexed_access_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_indexed_access_type(n, _parent),
        }
    }
    fn visit_true_plus_minus(&mut self, n: &TruePlusMinus, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_true_plus_minus(n, _parent),
            swc_visit::Either::Right(v) => v.visit_true_plus_minus(n, _parent),
        }
    }
    fn visit_ts_mapped_type(&mut self, n: &TsMappedType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_mapped_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_mapped_type(n, _parent),
        }
    }
    fn visit_ts_lit_type(&mut self, n: &TsLitType, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_lit_type(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_lit_type(n, _parent),
        }
    }
    fn visit_ts_lit(&mut self, n: &TsLit, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_lit(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_lit(n, _parent),
        }
    }
    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_interface_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_interface_decl(n, _parent),
        }
    }
    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_interface_body(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_interface_body(n, _parent),
        }
    }
    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_expr_with_type_args(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_expr_with_type_args(n, _parent),
        }
    }
    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_alias_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_alias_decl(n, _parent),
        }
    }
    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_enum_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_enum_decl(n, _parent),
        }
    }
    fn visit_ts_enum_member(&mut self, n: &TsEnumMember, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_enum_member(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_enum_member(n, _parent),
        }
    }
    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_enum_member_id(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_enum_member_id(n, _parent),
        }
    }
    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_module_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_module_decl(n, _parent),
        }
    }
    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_namespace_body(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_namespace_body(n, _parent),
        }
    }
    fn visit_ts_module_block(&mut self, n: &TsModuleBlock, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_module_block(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_module_block(n, _parent),
        }
    }
    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_namespace_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_namespace_decl(n, _parent),
        }
    }
    fn visit_ts_module_name(&mut self, n: &TsModuleName, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_module_name(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_module_name(n, _parent),
        }
    }
    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_import_equals_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_import_equals_decl(n, _parent),
        }
    }
    fn visit_ts_module_ref(&mut self, n: &TsModuleRef, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_module_ref(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_module_ref(n, _parent),
        }
    }
    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_external_module_ref(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_external_module_ref(n, _parent),
        }
    }
    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_export_assignment(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_export_assignment(n, _parent),
        }
    }
    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_namespace_export_decl(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_namespace_export_decl(n, _parent),
        }
    }
    fn visit_ts_as_expr(&mut self, n: &TsAsExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_as_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_as_expr(n, _parent),
        }
    }
    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_type_assertion(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_type_assertion(n, _parent),
        }
    }
    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_non_null_expr(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_non_null_expr(n, _parent),
        }
    }
    fn visit_accessibility(&mut self, n: &Accessibility, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_accessibility(n, _parent),
            swc_visit::Either::Right(v) => v.visit_accessibility(n, _parent),
        }
    }
    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion, _parent: &dyn Node) {
        match self {
            swc_visit::Either::Left(v) => v.visit_ts_const_assertion(n, _parent),
            swc_visit::Either::Right(v) => v.visit_ts_const_assertion(n, _parent),
        }
    }
}
pub trait VisitWith<V: Visit> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V);
    /// Visit children nodes of self with `v`
    fn visit_children_with(&self, v: &mut V);
}
impl<V, T> VisitWith<V> for Box<T>
where
    V: Visit,
    T: 'static + VisitWith<V>,
{
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        (**self).visit_with(_parent, v)
    }
    /// Visit children nodes of self with `v`
    fn visit_children_with(&self, v: &mut V) {
        let _parent = self as &dyn Node;
        (**self).visit_children_with(v)
    }
}
impl<V: Visit> VisitWith<V> for Class {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_class(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Span {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_span(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<Decorator> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_decorators(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter().for_each(|v| _visitor.visit_decorator(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<ClassMember> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_class_members(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_class_member(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<Box<Expr>> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_expr(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_expr(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<TsTypeParamDecl> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_ts_type_param_decl(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_ts_type_param_decl(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<TsTypeParamInstantiation> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_ts_type_param_instantiation(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_ts_type_param_instantiation(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<TsExprWithTypeArgs> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_expr_with_type_args_vec(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_ts_expr_with_type_args(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for ClassMember {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_class_member(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Constructor {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_constructor(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ClassMethod {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_class_method(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for PrivateMethod {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_private_method(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ClassProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_class_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for PrivateProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_private_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsIndexSignature {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_index_signature(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for EmptyStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_empty_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<TsTypeAnn> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_ts_type_ann(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_ts_type_ann(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<Accessibility> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_accessibility(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_accessibility(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for PrivateName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_private_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for PropName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_prop_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Function {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_function(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for MethodKind {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_method_kind(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<ParamOrTsParamProp> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_param_or_ts_param_props(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_param_or_ts_param_prop(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<BlockStmt> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_block_stmt(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_block_stmt(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Decorator {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_decorator(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Decl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ClassDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_class_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for FnDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_fn_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for VarDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_var_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsInterfaceDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_interface_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeAliasDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_alias_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsEnumDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_enum_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsModuleDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_module_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Ident {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ident(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for VarDeclKind {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_var_decl_kind(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<VarDeclarator> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_var_declarators(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_var_declarator(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for VarDeclarator {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_var_declarator(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Pat {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_pat(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Expr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ThisExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_this_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ArrayLit {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_array_lit(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ObjectLit {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_object_lit(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for FnExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_fn_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for UnaryExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_unary_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for UpdateExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_update_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for BinExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_bin_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for AssignExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_assign_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for MemberExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_member_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for CondExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_cond_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for CallExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_call_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for NewExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_new_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for SeqExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_seq_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Lit {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_lit(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Tpl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_tpl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TaggedTpl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_tagged_tpl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ArrowExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_arrow_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ClassExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_class_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for YieldExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_yield_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for MetaPropExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_meta_prop_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for AwaitExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_await_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ParenExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_paren_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXMemberExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_member_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXNamespacedName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_namespaced_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXEmptyExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_empty_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXFragment {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_fragment(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeAssertion {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_assertion(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsConstAssertion {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_const_assertion(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsNonNullExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_non_null_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeCastExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_cast_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsAsExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_as_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for OptChainExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_chain_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Invalid {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_invalid(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<Option<ExprOrSpread>> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_vec_expr_or_spreads(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_opt_expr_or_spread(v.as_ref(), _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<PropOrSpread> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_prop_or_spreads(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_prop_or_spread(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for PropOrSpread {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_prop_or_spread(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for SpreadElement {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_spread_element(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for UnaryOp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_unary_op(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for UpdateOp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_update_op(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for BinaryOp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_binary_op(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<Ident> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_ident(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_ident(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for AssignOp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_assign_op(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for PatOrExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_pat_or_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExprOrSuper {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_expr_or_super(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<ExprOrSpread> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_expr_or_spreads(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_expr_or_spread(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<Vec<ExprOrSpread>> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_expr_or_spreads(self.as_ref().map(|v| &**v), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_expr_or_spreads(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<Box<Expr>> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_exprs(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter().for_each(|v| _visitor.visit_expr(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<Pat> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_pats(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter().for_each(|v| _visitor.visit_pat(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for BlockStmtOrExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_block_stmt_or_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<TplElement> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_tpl_elements(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_tpl_element(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for TplElement {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_tpl_element(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<Str> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_str(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_str(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Str {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_str(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Super {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_super(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExprOrSpread {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_expr_or_spread(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<Span> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_span(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_span(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for BlockStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_block_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<Param> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_params(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter().for_each(|v| _visitor.visit_param(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Param {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_param(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ParamOrTsParamProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_param_or_ts_param_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsParamProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_param_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JsWord {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_js_word(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXObject {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_object(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXExprContainer {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_expr_container(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXSpreadChild {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_spread_child(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXElementName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_element_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXOpeningElement {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_opening_element(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<JSXAttrOrSpread> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_attr_or_spreads(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_jsx_attr_or_spread(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for JSXAttrOrSpread {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_attr_or_spread(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXAttr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_attr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXClosingElement {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_closing_element(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXAttrName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_attr_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<JSXAttrValue> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_jsx_attr_value(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_jsx_attr_value(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for JSXAttrValue {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_attr_value(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXText {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_text(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXElement {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_element(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<JSXElementChild> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_element_children(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_jsx_element_child(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<JSXClosingElement> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_jsx_closing_element(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_jsx_closing_element(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for JSXElementChild {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_element_child(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXOpeningFragment {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_opening_fragment(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for JSXClosingFragment {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_jsx_closing_fragment(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Bool {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_bool(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Null {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_null(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Number {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_number(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for BigInt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_big_int(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Regex {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_regex(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for BigIntValue {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_big_int_value(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Program {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_program(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Module {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_module(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Script {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_script(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<ModuleItem> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_module_items(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_module_item(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<JsWord> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_js_word(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_js_word(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<Stmt> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_stmts(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter().for_each(|v| _visitor.visit_stmt(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for ModuleItem {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_module_item(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ModuleDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_module_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Stmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ImportDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_import_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExportDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for NamedExport {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_named_export(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExportDefaultDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_default_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExportDefaultExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_default_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExportAll {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_all(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsImportEqualsDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_import_equals_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsExportAssignment {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_export_assignment(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsNamespaceExportDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_namespace_export_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<ImportSpecifier> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_import_specifiers(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_import_specifier(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<ExportSpecifier> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_specifiers(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_export_specifier(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for DefaultDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_default_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ImportSpecifier {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_import_specifier(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ImportNamedSpecifier {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_import_named_specifier(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ImportDefaultSpecifier {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_import_default_specifier(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ImportStarAsSpecifier {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_import_star_as_specifier(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExportSpecifier {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_specifier(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExportNamespaceSpecifier {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_namespace_specifier(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExportDefaultSpecifier {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_default_specifier(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExportNamedSpecifier {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_export_named_specifier(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ArrayPat {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_array_pat(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for RestPat {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_rest_pat(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ObjectPat {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_object_pat(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for AssignPat {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_assign_pat(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<Option<Pat>> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_vec_pats(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_opt_pat(v.as_ref(), _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<ObjectPatProp> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_object_pat_props(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_object_pat_prop(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for ObjectPatProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_object_pat_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for KeyValuePatProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_key_value_pat_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for AssignPatProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_assign_pat_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Prop {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for KeyValueProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_key_value_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for AssignProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_assign_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for GetterProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_getter_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for SetterProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_setter_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for MethodProp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_method_prop(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ComputedPropName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_computed_prop_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for DebuggerStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_debugger_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for WithStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_with_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ReturnStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_return_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for LabeledStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_labeled_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for BreakStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_break_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ContinueStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_continue_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for IfStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_if_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for SwitchStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_switch_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ThrowStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_throw_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TryStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_try_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for WhileStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_while_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for DoWhileStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_do_while_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ForStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_for_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ForInStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_for_in_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ForOfStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_for_of_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for ExprStmt {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_expr_stmt(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<Box<Stmt>> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_stmt(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_stmt(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<SwitchCase> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_switch_cases(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_switch_case(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<CatchClause> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_catch_clause(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_catch_clause(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Option<VarDeclOrExpr> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_var_decl_or_expr(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_var_decl_or_expr(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for VarDeclOrPat {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_var_decl_or_pat(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for SwitchCase {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_switch_case(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for CatchClause {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_catch_clause(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<Pat> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_pat(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_pat(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for VarDeclOrExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_var_decl_or_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeAnn {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_ann(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeParamDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_param_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<TsTypeParam> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_params(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_ts_type_param(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for TsTypeParam {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_param(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<Box<TsType>> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_ts_type(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_ts_type(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for TsTypeParamInstantiation {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_param_instantiation(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<Box<TsType>> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_types(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter().for_each(|v| _visitor.visit_ts_type(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for TsParamPropParam {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_param_prop_param(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsQualifiedName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_qualified_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsEntityName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_entity_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsSignatureDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_signature_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsCallSignatureDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_call_signature_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsConstructSignatureDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_construct_signature_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsMethodSignature {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_method_signature(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsFnType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_fn_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsConstructorType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_constructor_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeElement {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_element(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsPropertySignature {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_property_signature(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<TsFnParam> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_fn_params(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_ts_fn_param(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for TsType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsKeywordType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_keyword_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsThisType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_this_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsFnOrConstructorType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_fn_or_constructor_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeRef {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_ref(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeQuery {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_query(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeLit {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_lit(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsArrayType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_array_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTupleType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_tuple_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsOptionalType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_optional_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsRestType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_rest_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsUnionOrIntersectionType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_union_or_intersection_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsConditionalType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_conditional_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsInferType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_infer_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsParenthesizedType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_parenthesized_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeOperator {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_operator(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsIndexedAccessType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_indexed_access_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsMappedType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_mapped_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsLitType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_lit_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypePredicate {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_predicate(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsImportType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_import_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsKeywordTypeKind {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_keyword_type_kind(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsFnParam {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_fn_param(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsThisTypeOrIdent {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_this_type_or_ident(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeQueryExpr {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_query_expr(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<TsEntityName> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_ts_entity_name(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_ts_entity_name(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<TsTypeElement> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_elements(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_ts_type_element(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for Vec<TsTupleElement> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_tuple_elements(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_ts_tuple_element(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for TsTupleElement {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_tuple_element(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsUnionType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_union_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsIntersectionType {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_intersection_type(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsTypeOperatorOp {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_type_operator_op(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TruePlusMinus {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_true_plus_minus(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<TruePlusMinus> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_true_plus_minus(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_true_plus_minus(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for TsLit {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_lit(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsInterfaceBody {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_interface_body(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsExprWithTypeArgs {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_expr_with_type_args(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Vec<TsEnumMember> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_enum_members(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            n.iter()
                .for_each(|v| _visitor.visit_ts_enum_member(v, _parent))
        }
    }
}
impl<V: Visit> VisitWith<V> for TsEnumMember {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_enum_member(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsEnumMemberId {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_enum_member_id(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsModuleName {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_module_name(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<TsNamespaceBody> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_ts_namespace_body(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_ts_namespace_body(n, _parent),
                None => {}
            }
        }
    }
}
impl<V: Visit> VisitWith<V> for TsNamespaceBody {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_namespace_body(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsModuleBlock {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_module_block(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsNamespaceDecl {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_namespace_decl(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsModuleRef {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_module_ref(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for TsExternalModuleRef {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_ts_external_module_ref(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Accessibility {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_accessibility(self, _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {}
    }
}
impl<V: Visit> VisitWith<V> for Option<ExprOrSpread> {
    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
        v.visit_opt_expr_or_spread(self.as_ref(), _parent as _)
    }
    fn visit_children_with(&self, _visitor: &mut V) {
        let n = self;
        let _parent = n as &dyn Node;
        {
            match n {
                Some(n) => _visitor.visit_expr_or_spread(n, _parent),
                None => {}
            }
        }
    }
}
