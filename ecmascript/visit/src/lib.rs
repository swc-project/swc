use std::any::Any;
use swc_common::AstNode;
use swc_ecma_visit_macros::{define, visit};

/// Visitable nodes.
pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

define!({
    pub struct Class {
        pub span: Span,

        pub decorators: Vec<Decorator>,

        pub body: Vec<ClassMember>,

        pub super_class: Option<Box<Expr>>,

        pub is_abstract: bool,

        pub type_params: Option<TsTypeParamDecl>,

        pub super_type_params: Option<TsTypeParamInstantiation>,

        pub implements: Vec<TsExprWithTypeArgs>,
    }
});

#[visit]
mod types {
    use crate::{
        expr::Expr,
        function::{Function, PatOrTsParamProp},
        ident::PrivateName,
        prop::PropName,
        stmt::BlockStmt,
        typescript::{
            Accessibility, TsExprWithTypeArgs, TsIndexSignature, TsTypeAnn, TsTypeParamDecl,
            TsTypeParamInstantiation,
        },
    };
    use serde::{Deserialize, Serialize};

    pub struct Class {
        pub span: Span,

        pub decorators: Vec<Decorator>,

        pub body: Vec<ClassMember>,

        pub super_class: Option<Box<Expr>>,

        pub is_abstract: bool,

        pub type_params: Option<TsTypeParamDecl>,

        pub super_type_params: Option<TsTypeParamInstantiation>,

        pub implements: Vec<TsExprWithTypeArgs>,
    }

    pub enum ClassMember {
        Constructor(Constructor),
        Method(ClassMethod),
        PrivateMethod(PrivateMethod),
        ClassProp(ClassProp),
        PrivateProp(PrivateProp),
        TsIndexSignature(TsIndexSignature),
    }

    macro_rules! property {
        ($name:ident, $ty:literal, $KEY:ty) => {
            pub struct $name {
                pub span: Span,

                pub key: $KEY,

                pub value: Option<Box<Expr>>,

                pub type_ann: Option<TsTypeAnn>,

                pub is_static: bool,

                pub decorators: Vec<Decorator>,

                pub computed: bool,

                pub accessibility: Option<Accessibility>,

                pub is_abstract: bool,

                pub is_optional: bool,

                pub readonly: bool,

                pub definite: bool,
            }
        };
    }

    property!(ClassProp, "ClassProperty", Box<Expr>);
    property!(PrivateProp, "PrivateProperty", PrivateName);

    macro_rules! method {
        ($name:ident, $ty:literal, $KEY:ty) => {
            pub struct $name {
                pub span: Span,

                pub key: $KEY,

                pub function: Function,

                pub kind: MethodKind,

                pub is_static: bool,

                pub accessibility: Option<Accessibility>,

                pub is_abstract: bool,

                pub is_optional: bool,
            }
        };
    }

    method!(ClassMethod, "ClassMethod", PropName);
    method!(PrivateMethod, "PrivateMethod", PrivateName);

    pub struct Constructor {
        pub span: Span,

        pub key: PropName,

        pub params: Vec<PatOrTsParamProp>,

        pub body: Option<BlockStmt>,

        pub accessibility: Option<Accessibility>,

        pub is_optional: bool,
    }

    pub struct Decorator {
        pub span: Span,

        pub expr: Box<Expr>,
    }

    pub enum MethodKind {
        Method,
        Getter,
        Setter,
    }
    use crate::{
        class::Class,
        expr::Expr,
        function::Function,
        ident::Ident,
        pat::Pat,
        typescript::{TsEnumDecl, TsInterfaceDecl, TsModuleDecl, TsTypeAliasDecl},
    };
    use string_enum::StringEnum;
    use swc_common::{ast_node, Fold, Span};

    pub enum Decl {
        Class(ClassDecl),
        Fn(FnDecl),
        Var(VarDecl),
        TsInterface(TsInterfaceDecl),
        TsTypeAlias(TsTypeAliasDecl),
        TsEnum(TsEnumDecl),
        TsModule(TsModuleDecl),
    }

    pub struct FnDecl {
        pub ident: Ident,

        pub declare: bool,

        pub function: Function,
    }

    pub struct ClassDecl {
        pub ident: Ident,

        pub declare: bool,

        pub class: Class,
    }

    pub struct VarDecl {
        pub span: Span,

        pub kind: VarDeclKind,

        pub declare: bool,

        pub decls: Vec<VarDeclarator>,
    }

    pub enum VarDeclKind {
        Var,
        Let,
        Const,
    }

    pub struct VarDeclarator {
        pub span: Span,
        pub name: Pat,

        pub init: Option<Box<Expr>>,

        pub definite: bool,
    }
    use crate::{
        class::Class,
        function::Function,
        ident::{Ident, PrivateName},
        jsx::{JSXElement, JSXEmptyExpr, JSXFragment, JSXMemberExpr, JSXNamespacedName},
        lit::{Bool, Lit, Number, Str},
        operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp},
        pat::Pat,
        prop::Prop,
        stmt::BlockStmt,
        typescript::{
            TsAsExpr, TsConstAssertion, TsNonNullExpr, TsTypeAnn, TsTypeAssertion, TsTypeCastExpr,
            TsTypeParamDecl, TsTypeParamInstantiation,
        },
        Invalid,
    };
    use serde::{self, Deserialize, Serialize};
    use swc_common::{ast_node, Fold, Span, Spanned, DUMMY_SP};

    pub enum Expr {
        This(ThisExpr),

        Array(ArrayLit),

        Object(ObjectLit),

        Fn(FnExpr),

        Unary(UnaryExpr),

        Update(UpdateExpr),

        Bin(BinExpr),

        Assign(AssignExpr),

        Member(MemberExpr),

        Cond(CondExpr),

        Call(CallExpr),

        New(NewExpr),

        Seq(SeqExpr),

        Ident(Ident),

        Lit(Lit),

        Tpl(Tpl),

        TaggedTpl(TaggedTpl),

        Arrow(ArrowExpr),

        Class(ClassExpr),

        Yield(YieldExpr),

        MetaProp(MetaPropExpr),

        Await(AwaitExpr),

        Paren(ParenExpr),

        JSXMember(JSXMemberExpr),

        JSXNamespacedName(JSXNamespacedName),

        JSXEmpty(JSXEmptyExpr),

        JSXElement(Box<JSXElement>),

        JSXFragment(JSXFragment),

        TsTypeAssertion(TsTypeAssertion),

        TsConstAssertion(TsConstAssertion),

        TsNonNull(TsNonNullExpr),

        TsTypeCast(TsTypeCastExpr),

        TsAs(TsAsExpr),

        PrivateName(PrivateName),

        OptChain(OptChainExpr),

        Invalid(Invalid),
    }

    pub struct ThisExpr {
        pub span: Span,
    }

    pub struct ArrayLit {
        pub span: Span,

        pub elems: Vec<Option<ExprOrSpread>>,
    }

    pub struct ObjectLit {
        pub span: Span,

        pub props: Vec<PropOrSpread>,
    }

    pub enum PropOrSpread {
        Spread(SpreadElement),

        Prop(Box<Prop>),
    }

    pub struct SpreadElement {
        pub dot3_token: Span,

        pub expr: Box<Expr>,
    }

    pub struct UnaryExpr {
        pub span: Span,

        pub op: UnaryOp,

        pub arg: Box<Expr>,
    }

    pub struct UpdateExpr {
        pub span: Span,

        pub op: UpdateOp,

        pub prefix: bool,

        pub arg: Box<Expr>,
    }

    pub struct BinExpr {
        pub span: Span,

        pub op: BinaryOp,

        pub left: Box<Expr>,

        pub right: Box<Expr>,
    }

    pub struct FnExpr {
        pub ident: Option<Ident>,

        pub function: Function,
    }

    pub struct ClassExpr {
        pub ident: Option<Ident>,

        pub class: Class,
    }

    pub struct AssignExpr {
        pub span: Span,

        pub op: AssignOp,

        pub left: PatOrExpr,

        pub right: Box<Expr>,
    }

    pub struct MemberExpr {
        pub span: Span,

        pub obj: ExprOrSuper,

        pub prop: Box<Expr>,

        pub computed: bool,
    }

    pub struct CondExpr {
        pub span: Span,

        pub test: Box<Expr>,

        pub cons: Box<Expr>,

        pub alt: Box<Expr>,
    }

    pub struct CallExpr {
        pub span: Span,

        pub callee: ExprOrSuper,

        pub args: Vec<ExprOrSpread>,

        pub type_args: Option<TsTypeParamInstantiation>,
    }

    pub struct NewExpr {
        pub span: Span,

        pub callee: Box<Expr>,

        pub args: Option<Vec<ExprOrSpread>>,

        pub type_args: Option<TsTypeParamInstantiation>,
    }

    pub struct SeqExpr {
        pub span: Span,

        pub exprs: Vec<Box<Expr>>,
    }

    pub struct ArrowExpr {
        pub span: Span,

        pub params: Vec<Pat>,

        pub body: BlockStmtOrExpr,

        pub is_async: bool,

        pub is_generator: bool,

        pub type_params: Option<TsTypeParamDecl>,

        pub return_type: Option<TsTypeAnn>,
    }

    pub struct YieldExpr {
        pub span: Span,

        pub arg: Option<Box<Expr>>,

        pub delegate: bool,
    }

    pub struct MetaPropExpr {
        pub meta: Ident,

        pub prop: Ident,
    }

    pub struct AwaitExpr {
        pub span: Span,

        pub arg: Box<Expr>,
    }

    pub struct Tpl {
        pub span: Span,

        pub exprs: Vec<Box<Expr>>,

        pub quasis: Vec<TplElement>,
    }

    pub struct TaggedTpl {
        pub span: Span,

        pub tag: Box<Expr>,

        pub exprs: Vec<Box<Expr>>,
        pub quasis: Vec<TplElement>,

        pub type_params: Option<TsTypeParamInstantiation>,
    }

    pub struct TplElement {
        pub span: Span,
        pub tail: bool,
        pub cooked: Option<Str>,
        pub raw: Str,
    }

    pub struct ParenExpr {
        pub span: Span,

        pub expr: Box<Expr>,
    }

    pub enum ExprOrSuper {
        Super(Super),

        Expr(Box<Expr>),
    }

    pub struct Super {
        pub span: Span,
    }

    pub struct ExprOrSpread {
        pub spread: Option<Span>,

        pub expr: Box<Expr>,
    }

    impl Spanned for ExprOrSpread {
        fn span(&self) -> Span {
            let expr = self.expr.span();
            match self.spread {
                Some(spread) => expr.with_lo(spread.lo()),
                None => expr,
            }
        }
    }

    pub enum BlockStmtOrExpr {
        BlockStmt(BlockStmt),
        Expr(Box<Expr>),
    }

    pub enum PatOrExpr {
        Expr(Box<Expr>),
        Pat(Box<Pat>),
    }

    impl From<bool> for Expr {
        fn from(value: bool) -> Self {
            Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value,
            }))
        }
    }

    impl From<f64> for Expr {
        fn from(value: f64) -> Self {
            Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value,
            }))
        }
    }

    impl From<Bool> for Expr {
        fn from(v: Bool) -> Self {
            Expr::Lit(Lit::Bool(v))
        }
    }

    impl From<Number> for Expr {
        fn from(v: Number) -> Self {
            Expr::Lit(Lit::Num(v))
        }
    }

    impl From<Str> for Expr {
        fn from(v: Str) -> Self {
            Expr::Lit(Lit::Str(v))
        }
    }

    pub struct OptChainExpr {
        pub span: Span,
        pub expr: Box<Expr>,
    }

    test_de!(
        jsx_element,
        JSXElement,
        r#"{
"type": "JSXElement",
"span": {
"start": 0,
"end": 5,
"ctxt": 0
},
"opening": {
"type": "JSXOpeningElement",
"name": {
"type": "Identifier",
"span": {
"start": 1,
"end": 2,
"ctxt": 0
},
"value": "a",
"optional": false
},
"span": {
"start": 1,
"end": 5,
"ctxt": 0
},
"selfClosing": true
},
"children": [],
"closing": null
}"#
    );
    use crate::{
        class::Decorator,
        pat::Pat,
        stmt::BlockStmt,
        typescript::{TsParamProp, TsTypeAnn, TsTypeParamDecl},
    };
    use swc_common::{ast_node, Span};

    pub struct Function {
        pub params: Vec<Pat>,

        pub decorators: Vec<Decorator>,

        pub span: Span,

        pub body: Option<BlockStmt>,

        pub is_generator: bool,

        pub is_async: bool,

        pub type_params: Option<TsTypeParamDecl>,

        pub return_type: Option<TsTypeAnn>,
    }

    pub enum PatOrTsParamProp {
        TsParamProp(TsParamProp),
        Pat(Pat),
    }
    use crate::typescript::TsTypeAnn;
    use swc_atoms::JsWord;
    use swc_common::{ast_node, Span};

    pub struct Ident {
        pub span: Span,
        pub sym: JsWord,
        pub type_ann: Option<TsTypeAnn>,
        pub optional: bool,
    }

    pub struct PrivateName {
        pub span: Span,
        pub id: Ident,
    }

    impl AsRef<str> for Ident {
        fn as_ref(&self) -> &str {
            &self.sym
        }
    }

    impl Ident {
        pub const fn new(sym: JsWord, span: Span) -> Self {
            Ident {
                span,
                sym,
                type_ann: None,
                optional: false,
            }
        }
    }

    pub trait IdentExt: AsRef<str> {
        fn is_reserved_for_es3(&self) -> bool {
            [
                "abstract",
                "boolean",
                "break",
                "byte",
                "case",
                "catch",
                "char",
                "class",
                "const",
                "continue",
                "debugger",
                "default",
                "delete",
                "do",
                "double",
                "else",
                "enum",
                "export",
                "extends",
                "false",
                "final",
                "finally",
                "float",
                "for",
                "function",
                "goto",
                "if",
                "implements",
                "import",
                "in",
                "instanceof",
                "int",
                "interface",
                "long",
                "native",
                "new",
                "null",
                "package",
                "private",
                "protected",
                "public",
                "return",
                "short",
                "static",
                "super",
                "switch",
                "synchronized",
                "this",
                "throw",
                "throws",
                "transient",
                "true",
                "try",
                "typeof",
                "var",
                "void",
                "volatile",
                "while",
                "with",
            ]
            .contains(&self.as_ref())
        }

        fn is_reserved_only_for_es3(&self) -> bool {
            [
                "abstract",
                "boolean",
                "byte",
                "char",
                "double",
                "enum",
                "final",
                "float",
                "goto",
                "implements",
                "int",
                "interface",
                "long",
                "native",
                "package",
                "private",
                "protected",
                "public",
                "short",
                "static",
                "synchronized",
                "throws",
                "transient",
                "volatile",
            ]
            .contains(&self.as_ref())
        }
    }

    impl IdentExt for JsWord {}
    impl IdentExt for Ident {}
    use crate::{
        expr::{Expr, SpreadElement},
        ident::Ident,
        lit::Lit,
        typescript::TsTypeParamInstantiation,
    };
    use swc_atoms::JsWord;
    use swc_common::{ast_node, Span};

    pub enum JSXObject {
        JSXMemberExpr(Box<JSXMemberExpr>),
        Ident(Ident),
    }

    pub struct JSXMemberExpr {
        pub obj: JSXObject,

        pub prop: Ident,
    }

    pub struct JSXNamespacedName {
        pub ns: Ident,
        pub name: Ident,
    }

    pub struct JSXEmptyExpr {
        pub span: Span,
    }

    pub struct JSXExprContainer {
        pub span: Span,
        pub expr: JSXExpr,
    }

    pub enum JSXExpr {
        JSXEmptyExpr(JSXEmptyExpr),
        Expr(Box<Expr>),
    }

    pub struct JSXSpreadChild {
        pub span: Span,
        pub expr: Box<Expr>,
    }

    pub enum JSXElementName {
        Ident(Ident),
        JSXMemberExpr(JSXMemberExpr),
        JSXNamespacedName(JSXNamespacedName),
    }

    pub struct JSXOpeningElement {
        pub name: JSXElementName,

        pub span: Span,

        pub attrs: Vec<JSXAttrOrSpread>,

        pub self_closing: bool,

        pub type_args: Option<TsTypeParamInstantiation>,
    }

    pub enum JSXAttrOrSpread {
        JSXAttr(JSXAttr),
        SpreadElement(SpreadElement),
    }

    pub struct JSXClosingElement {
        pub span: Span,
        pub name: JSXElementName,
    }

    pub struct JSXAttr {
        pub span: Span,
        pub name: JSXAttrName,
        pub value: Option<JSXAttrValue>,
    }

    pub enum JSXAttrName {
        Ident(Ident),
        JSXNamespacedName(JSXNamespacedName),
    }

    pub enum JSXAttrValue {
        Lit(Lit),

        JSXExprContainer(JSXExprContainer),

        JSXElement(Box<JSXElement>),

        JSXFragment(JSXFragment),
    }

    pub struct JSXText {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub struct JSXElement {
        pub span: Span,
        pub opening: JSXOpeningElement,
        pub children: Vec<JSXElementChild>,
        pub closing: Option<JSXClosingElement>,
    }

    pub enum JSXElementChild {
        JSXText(JSXText),

        JSXExprContainer(JSXExprContainer),

        JSXSpreadChild(JSXSpreadChild),

        JSXElement(Box<JSXElement>),

        JSXFragment(JSXFragment),
    }

    pub struct JSXFragment {
        pub span: Span,

        pub opening: JSXOpeningFragment,

        pub children: Vec<JSXElementChild>,

        pub closing: JSXClosingFragment,
    }

    pub struct JSXOpeningFragment {
        pub span: Span,
    }

    pub struct JSXClosingFragment {
        pub span: Span,
    }

    pub use self::{
        class::{
            Class, ClassMember, ClassMethod, ClassProp, Constructor, Decorator, MethodKind,
            PrivateMethod, PrivateProp,
        },
        decl::{ClassDecl, Decl, FnDecl, VarDecl, VarDeclKind, VarDeclarator},
        expr::{
            ArrayLit, ArrowExpr, AssignExpr, AwaitExpr, BinExpr, BlockStmtOrExpr, CallExpr,
            ClassExpr, CondExpr, Expr, ExprOrSpread, ExprOrSuper, FnExpr, MemberExpr, MetaPropExpr,
            NewExpr, ObjectLit, OptChainExpr, ParenExpr, PatOrExpr, PropOrSpread, SeqExpr,
            SpreadElement, Super, TaggedTpl, ThisExpr, Tpl, TplElement, UnaryExpr, UpdateExpr,
            YieldExpr,
        },
        function::{Function, PatOrTsParamProp},
        ident::{Ident, IdentExt, PrivateName},
        jsx::{
            JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXClosingElement,
            JSXClosingFragment, JSXElement, JSXElementChild, JSXElementName, JSXEmptyExpr, JSXExpr,
            JSXExprContainer, JSXFragment, JSXMemberExpr, JSXNamespacedName, JSXObject,
            JSXOpeningElement, JSXOpeningFragment, JSXSpreadChild, JSXText,
        },
        lit::{BigInt, Bool, Lit, Null, Number, Regex, Str},
        module::{Module, ModuleItem, Program, Script},
        module_decl::{
            DefaultDecl, DefaultExportSpecifier, ExportAll, ExportDecl, ExportDefaultDecl,
            ExportDefaultExpr, ExportSpecifier, ImportDecl, ImportDefault, ImportSpecific,
            ImportSpecifier, ImportStarAs, ModuleDecl, NamedExport, NamedExportSpecifier,
            NamespaceExportSpecifier,
        },
        operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp},
        pat::{
            ArrayPat, AssignPat, AssignPatProp, KeyValuePatProp, ObjectPat, ObjectPatProp, Pat,
            RestPat,
        },
        prop::{
            AssignProp, ComputedPropName, GetterProp, KeyValueProp, MethodProp, Prop, PropName,
            SetterProp,
        },
        stmt::{
            BlockStmt, BreakStmt, CatchClause, ContinueStmt, DebuggerStmt, DoWhileStmt, EmptyStmt,
            ExprStmt, ForInStmt, ForOfStmt, ForStmt, IfStmt, LabeledStmt, ReturnStmt, Stmt,
            SwitchCase, SwitchStmt, ThrowStmt, TryStmt, VarDeclOrExpr, VarDeclOrPat, WhileStmt,
            WithStmt,
        },
        typescript::{
            Accessibility, TruePlusMinus, TsArrayType, TsAsExpr, TsCallSignatureDecl,
            TsConditionalType, TsConstAssertion, TsConstructSignatureDecl, TsConstructorType,
            TsEntityName, TsEnumDecl, TsEnumMember, TsEnumMemberId, TsExportAssignment,
            TsExprWithTypeArgs, TsExternalModuleRef, TsFnOrConstructorType, TsFnParam, TsFnType,
            TsImportEqualsDecl, TsImportType, TsIndexSignature, TsIndexedAccessType, TsInferType,
            TsInterfaceBody, TsInterfaceDecl, TsIntersectionType, TsKeywordType, TsKeywordTypeKind,
            TsLit, TsLitType, TsMappedType, TsMethodSignature, TsModuleBlock, TsModuleDecl,
            TsModuleName, TsModuleRef, TsNamespaceBody, TsNamespaceDecl, TsNamespaceExportDecl,
            TsNonNullExpr, TsOptionalType, TsParamProp, TsParamPropParam, TsParenthesizedType,
            TsPropertySignature, TsQualifiedName, TsRestType, TsSignatureDecl, TsThisType,
            TsThisTypeOrIdent, TsTupleType, TsType, TsTypeAliasDecl, TsTypeAnn, TsTypeAssertion,
            TsTypeCastExpr, TsTypeElement, TsTypeLit, TsTypeOperator, TsTypeOperatorOp,
            TsTypeParam, TsTypeParamDecl, TsTypeParamInstantiation, TsTypePredicate, TsTypeQuery,
            TsTypeQueryExpr, TsTypeRef, TsUnionOrIntersectionType, TsUnionType,
        },
    };
    use swc_common::{ast_node, Span};

    mod class;
    mod decl;
    mod expr;
    mod function;
    mod ident;
    mod jsx;
    mod lit;
    mod macros;
    mod module;
    mod module_decl;
    mod operators;
    mod pat;
    mod prop;
    mod stmt;
    mod typescript;

    pub struct Invalid {
        pub span: Span,
    }
    use crate::jsx::JSXText;
    use num_bigint::BigInt as BigIntValue;
    use std::{
        fmt::{self, Display, Formatter},
        hash::{Hash, Hasher},
        mem,
    };
    use swc_atoms::JsWord;
    use swc_common::{ast_node, Span};

    pub enum Lit {
        Str(Str),

        Bool(Bool),

        Null(Null),

        Num(Number),

        BigInt(BigInt),

        Regex(Regex),

        JSXText(JSXText),
    }

    pub struct BigInt {
        pub span: Span,
        pub value: BigIntValue,
    }

    pub struct Str {
        pub span: Span,

        pub value: JsWord,

        pub has_escape: bool,
    }
    impl Str {
        pub fn is_empty(&self) -> bool {
            self.value.is_empty()
        }
    }

    pub struct Bool {
        pub span: Span,
        pub value: bool,
    }

    pub struct Null {
        pub span: Span,
    }

    pub struct Regex {
        pub span: Span,

        pub exp: JsWord,

        pub flags: JsWord,
    }

    pub struct Number {
        pub span: Span,
        pub value: f64,
    }

    impl Eq for Number {}

    impl Hash for Number {
        fn hash<H: Hasher>(&self, state: &mut H) {
            fn integer_decode(val: f64) -> (u64, i16, i8) {
                let bits: u64 = unsafe { mem::transmute(val) };
                let sign: i8 = if bits >> 63 == 0 { 1 } else { -1 };
                let mut exponent: i16 = ((bits >> 52) & 0x7ff) as i16;
                let mantissa = if exponent == 0 {
                    (bits & 0xfffffffffffff) << 1
                } else {
                    (bits & 0xfffffffffffff) | 0x10000000000000
                };

                exponent -= 1023 + 52;
                (mantissa, exponent, sign)
            }

            self.span.hash(state);
            integer_decode(self.value).hash(state);
        }
    }

    impl Display for Number {
        fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
            if self.value.is_infinite() {
                if self.value.is_sign_positive() {
                    Display::fmt("Infinity", f)
                } else {
                    Display::fmt("-Infinity", f)
                }
            } else {
                Display::fmt(&self.value, f)
            }
        }
    }
    macro_rules! op {
        (unary,"-") => {
            $crate::UnaryOp::Minus
        };
        (unary,"+") => {
            $crate::UnaryOp::Plus
        };
        ("!") => {
            $crate::UnaryOp::Bang
        };
        ("~") => {
            $crate::UnaryOp::Tilde
        };
        ("typeof") => {
            $crate::UnaryOp::TypeOf
        };
        ("void") => {
            $crate::UnaryOp::Void
        };
        ("delete") => {
            $crate::UnaryOp::Delete
        };

        ("++") => {
            $crate::UpdateOp::PlusPlus
        };
        ("--") => {
            $crate::UpdateOp::MinusMinus
        };

        ("==") => {
            $crate::BinaryOp::EqEq
        };
        ("!=") => {
            $crate::BinaryOp::NotEq
        };
        ("===") => {
            $crate::BinaryOp::EqEqEq
        };
        ("!==") => {
            $crate::BinaryOp::NotEqEq
        };
        ("<") => {
            $crate::BinaryOp::Lt
        };
        ("<=") => {
            $crate::BinaryOp::LtEq
        };
        (">") => {
            $crate::BinaryOp::Gt
        };
        (">=") => {
            $crate::BinaryOp::GtEq
        };
        ("<<") => {
            $crate::BinaryOp::LShift
        };
        (">>") => {
            $crate::BinaryOp::RShift
        };
        (">>>") => {
            $crate::BinaryOp::ZeroFillRShift
        };
        (bin,"+") => {
            $crate::BinaryOp::Add
        };
        (bin,"-") => {
            $crate::BinaryOp::Sub
        };
        ("*") => {
            $crate::BinaryOp::Mul
        };
        ("/") => {
            $crate::BinaryOp::Div
        };
        ("%") => {
            $crate::BinaryOp::Mod
        };
        ("|") => {
            $crate::BinaryOp::BitOr
        };
        ("^") => {
            $crate::BinaryOp::BitXor
        };
        ("&") => {
            $crate::BinaryOp::BitAnd
        };
        ("||") => {
            $crate::BinaryOp::LogicalOr
        };
        ("&&") => {
            $crate::BinaryOp::LogicalAnd
        };
        ("in") => {
            $crate::BinaryOp::In
        };
        ("instanceof") => {
            $crate::BinaryOp::InstanceOf
        };
        ("**") => {
            $crate::BinaryOp::Exp
        };
        ("??") => {
            $crate::BinaryOp::NullishCoalescing
        };

        ("=") => {
            $crate::AssignOp::Assign
        };
        ("+=") => {
            $crate::AssignOp::AddAssign
        };
        ("-=") => {
            $crate::AssignOp::SubAssign
        };
        ("*=") => {
            $crate::AssignOp::MulAssign
        };
        ("/=") => {
            $crate::AssignOp::DivAssign
        };
        ("%=") => {
            $crate::AssignOp::ModAssign
        };
        ("<<=") => {
            $crate::AssignOp::LShiftAssign
        };
        (">>=") => {
            $crate::AssignOp::RShiftAssign
        };
        (">>>=") => {
            $crate::AssignOp::ZeroFillRShiftAssign
        };
        ("|=") => {
            $crate::AssignOp::BitOrAssign
        };
        ("^=") => {
            $crate::AssignOp::BitXorAssign
        };
        ("&=") => {
            $crate::AssignOp::BitAndAssign
        };
        ("**=") => {
            $crate::AssignOp::ExpAssign
        };
    }

    macro_rules! test_de {
        ($name:ident, $T:path, $s:literal) => {
            fn $name() {
                let _var: $T = ::serde_json::from_str(&$s).expect("failed to parse json");
            }
        };
    }
    use crate::{module_decl::ModuleDecl, stmt::Stmt};
    use swc_atoms::JsWord;
    use swc_common::{ast_node, Span};

    pub enum Program {
        Module(Module),
        Script(Script),
    }

    pub struct Module {
        pub span: Span,

        pub body: Vec<ModuleItem>,

        pub shebang: Option<JsWord>,
    }

    pub struct Script {
        pub span: Span,

        pub body: Vec<Stmt>,

        pub shebang: Option<JsWord>,
    }

    pub enum ModuleItem {
        ModuleDecl(ModuleDecl),
        Stmt(Stmt),
    }
    use crate::{
        decl::Decl,
        expr::{ClassExpr, Expr, FnExpr},
        ident::Ident,
        lit::Str,
        typescript::{
            TsExportAssignment, TsImportEqualsDecl, TsInterfaceDecl, TsNamespaceExportDecl,
        },
    };
    use swc_common::{ast_node, Span};

    pub enum ModuleDecl {
        Import(ImportDecl),

        ExportDecl(ExportDecl),

        ExportNamed(NamedExport),

        ExportDefaultDecl(ExportDefaultDecl),

        ExportDefaultExpr(ExportDefaultExpr),

        ExportAll(ExportAll),

        TsImportEquals(TsImportEqualsDecl),

        TsExportAssignment(TsExportAssignment),

        TsNamespaceExport(TsNamespaceExportDecl),
    }

    pub struct ExportDefaultExpr {
        pub span: Span,

        pub expr: Box<Expr>,
    }

    pub struct ExportDecl {
        pub span: Span,

        pub decl: Decl,
    }

    pub struct ImportDecl {
        pub span: Span,

        pub specifiers: Vec<ImportSpecifier>,

        pub src: Str,

        pub type_only: bool,
    }

    pub struct ExportAll {
        pub span: Span,

        pub src: Str,
    }

    pub struct NamedExport {
        pub span: Span,

        pub specifiers: Vec<ExportSpecifier>,

        pub src: Option<Str>,

        pub type_only: bool,
    }

    pub struct ExportDefaultDecl {
        pub span: Span,

        pub decl: DefaultDecl,
    }

    pub enum DefaultDecl {
        Class(ClassExpr),

        Fn(FnExpr),

        TsInterfaceDecl(TsInterfaceDecl),
    }

    pub enum ImportSpecifier {
        Specific(ImportSpecific),
        Default(ImportDefault),
        Namespace(ImportStarAs),
    }

    pub struct ImportDefault {
        pub span: Span,

        pub local: Ident,
    }
    pub struct ImportStarAs {
        pub span: Span,

        pub local: Ident,
    }
    pub struct ImportSpecific {
        pub span: Span,

        pub local: Ident,

        pub imported: Option<Ident>,
    }

    pub enum ExportSpecifier {
        Namespace(NamespaceExportSpecifier),

        Default(DefaultExportSpecifier),

        Named(NamedExportSpecifier),
    }

    pub struct NamespaceExportSpecifier {
        pub span: Span,

        pub name: Ident,
    }

    pub struct DefaultExportSpecifier {
        pub exported: Ident,
    }

    pub struct NamedExportSpecifier {
        pub span: Span,
        pub orig: Ident,
        pub exported: Option<Ident>,
    }
    use enum_kind::Kind;
    use string_enum::StringEnum;
    use swc_common::Fold;

    pub enum BinaryOp {
        EqEq,
        NotEq,
        EqEqEq,
        NotEqEq,
        Lt,
        LtEq,
        Gt,
        GtEq,
        LShift,
        RShift,
        ZeroFillRShift,

        Add,
        Sub,
        Mul,
        Div,
        Mod,

        BitOr,
        BitXor,
        BitAnd,

        LogicalOr,

        LogicalAnd,

        In,
        InstanceOf,

        Exp,

        NullishCoalescing,
    }

    pub enum AssignOp {
        Assign,
        AddAssign,
        SubAssign,
        MulAssign,
        DivAssign,
        ModAssign,
        LShiftAssign,
        RShiftAssign,
        ZeroFillRShiftAssign,
        BitOrAssign,
        BitXorAssign,
        BitAndAssign,

        ExpAssign,
    }

    pub enum UpdateOp {
        PlusPlus,
        MinusMinus,
    }

    pub enum UnaryOp {
        Minus,
        Plus,
        Bang,
        Tilde,
        TypeOf,
        Void,
        Delete,
    }
    use crate::{expr::Expr, ident::Ident, prop::PropName, typescript::TsTypeAnn, Invalid};
    use swc_common::{ast_node, Span};

    pub enum Pat {
        Ident(Ident),

        Array(ArrayPat),

        Rest(RestPat),

        Object(ObjectPat),

        Assign(AssignPat),

        Invalid(Invalid),

        Expr(Box<Expr>),
    }

    pub struct ArrayPat {
        pub span: Span,

        pub elems: Vec<Option<Pat>>,

        pub optional: bool,

        pub type_ann: Option<TsTypeAnn>,
    }

    pub struct ObjectPat {
        pub span: Span,

        pub props: Vec<ObjectPatProp>,

        pub optional: bool,

        pub type_ann: Option<TsTypeAnn>,
    }

    pub struct AssignPat {
        pub span: Span,

        pub left: Box<Pat>,

        pub right: Box<Expr>,

        pub type_ann: Option<TsTypeAnn>,
    }

    pub struct RestPat {
        pub span: Span,

        pub dot3_token: Span,

        pub arg: Box<Pat>,

        pub type_ann: Option<TsTypeAnn>,
    }

    pub enum ObjectPatProp {
        KeyValue(KeyValuePatProp),

        Assign(AssignPatProp),

        Rest(RestPat),
    }

    pub struct KeyValuePatProp {
        pub key: PropName,

        pub value: Box<Pat>,
    }
    pub struct AssignPatProp {
        pub span: Span,
        pub key: Ident,

        pub value: Option<Box<Expr>>,
    }
    use crate::{
        expr::Expr,
        function::Function,
        ident::Ident,
        lit::{Number, Str},
        pat::Pat,
        stmt::BlockStmt,
        typescript::TsTypeAnn,
    };
    use swc_common::{ast_node, Span};

    pub enum Prop {
        Shorthand(Ident),

        KeyValue(KeyValueProp),

        Assign(AssignProp),

        Getter(GetterProp),

        Setter(SetterProp),

        Method(MethodProp),
    }

    pub struct KeyValueProp {
        pub key: PropName,

        pub value: Box<Expr>,
    }

    pub struct AssignProp {
        pub key: Ident,
        pub value: Box<Expr>,
    }

    pub struct GetterProp {
        pub span: Span,
        pub key: PropName,
        pub type_ann: Option<TsTypeAnn>,
        pub body: Option<BlockStmt>,
    }
    pub struct SetterProp {
        pub span: Span,
        pub key: PropName,
        pub param: Pat,
        pub body: Option<BlockStmt>,
    }
    pub struct MethodProp {
        pub key: PropName,

        pub function: Function,
    }

    pub enum PropName {
        Ident(Ident),
        Str(Str),
        Num(Number),
        Computed(ComputedPropName),
    }

    pub struct ComputedPropName {
        pub span: Span,
        pub expr: Box<Expr>,
    }
    use crate::{
        decl::{Decl, VarDecl},
        expr::Expr,
        ident::Ident,
        pat::Pat,
    };
    use swc_common::{ast_node, Span};

    pub struct BlockStmt {
        pub span: Span,

        pub stmts: Vec<Stmt>,
    }

    pub enum Stmt {
        Block(BlockStmt),

        Empty(EmptyStmt),

        Debugger(DebuggerStmt),

        With(WithStmt),

        Return(ReturnStmt),

        Labeled(LabeledStmt),

        Break(BreakStmt),

        Continue(ContinueStmt),

        If(IfStmt),

        Switch(SwitchStmt),

        Throw(ThrowStmt),

        Try(TryStmt),

        While(WhileStmt),

        DoWhile(DoWhileStmt),

        For(ForStmt),

        ForIn(ForInStmt),

        ForOf(ForOfStmt),

        Decl(Decl),

        Expr(ExprStmt),
    }

    pub struct ExprStmt {
        pub span: Span,
        pub expr: Box<Expr>,
    }

    pub struct EmptyStmt {
        pub span: Span,
    }

    pub struct DebuggerStmt {
        pub span: Span,
    }

    pub struct WithStmt {
        pub span: Span,
        pub obj: Box<Expr>,
        pub body: Box<Stmt>,
    }

    pub struct ReturnStmt {
        pub span: Span,
        pub arg: Option<Box<Expr>>,
    }

    pub struct LabeledStmt {
        pub span: Span,
        pub label: Ident,
        pub body: Box<Stmt>,
    }

    pub struct BreakStmt {
        pub span: Span,
        pub label: Option<Ident>,
    }

    pub struct ContinueStmt {
        pub span: Span,
        pub label: Option<Ident>,
    }

    pub struct IfStmt {
        pub span: Span,
        pub test: Box<Expr>,

        pub cons: Box<Stmt>,

        pub alt: Option<Box<Stmt>>,
    }

    pub struct SwitchStmt {
        pub span: Span,
        pub discriminant: Box<Expr>,
        pub cases: Vec<SwitchCase>,
    }

    pub struct ThrowStmt {
        pub span: Span,
        pub arg: Box<Expr>,
    }

    pub struct TryStmt {
        pub span: Span,

        pub block: BlockStmt,

        pub handler: Option<CatchClause>,

        pub finalizer: Option<BlockStmt>,
    }

    pub struct WhileStmt {
        pub span: Span,
        pub test: Box<Expr>,
        pub body: Box<Stmt>,
    }

    pub struct DoWhileStmt {
        pub span: Span,
        pub test: Box<Expr>,
        pub body: Box<Stmt>,
    }

    pub struct ForStmt {
        pub span: Span,

        pub init: Option<VarDeclOrExpr>,

        pub test: Option<Box<Expr>>,

        pub update: Option<Box<Expr>>,

        pub body: Box<Stmt>,
    }

    pub struct ForInStmt {
        pub span: Span,
        pub left: VarDeclOrPat,
        pub right: Box<Expr>,
        pub body: Box<Stmt>,
    }

    pub struct ForOfStmt {
        pub span: Span,
        pub await_token: Option<Span>,
        pub left: VarDeclOrPat,
        pub right: Box<Expr>,
        pub body: Box<Stmt>,
    }

    pub struct SwitchCase {
        pub span: Span,

        pub test: Option<Box<Expr>>,

        pub cons: Vec<Stmt>,
    }

    pub struct CatchClause {
        pub span: Span,
        pub param: Option<Pat>,

        pub body: BlockStmt,
    }

    pub enum VarDeclOrPat {
        VarDecl(VarDecl),

        Pat(Pat),
    }

    pub enum VarDeclOrExpr {
        VarDecl(VarDecl),

        Expr(Box<Expr>),
    }
    use crate::{
        class::Decorator,
        expr::Expr,
        ident::Ident,
        lit::{Bool, Number, Str},
        module::ModuleItem,
        pat::{ArrayPat, AssignPat, ObjectPat, RestPat},
    };
    use serde::{
        de::{self, Unexpected, Visitor},
        Deserialize, Deserializer, Serialize,
    };
    use std::fmt;
    use string_enum::StringEnum;
    use swc_common::{ast_node, Fold, Span};

    pub struct TsTypeAnn {
        pub span: Span,
        pub type_ann: Box<TsType>,
    }

    pub struct TsTypeParamDecl {
        pub span: Span,
        pub params: Vec<TsTypeParam>,
    }

    pub struct TsTypeParam {
        pub span: Span,
        pub name: Ident,

        pub constraint: Option<Box<TsType>>,

        pub default: Option<Box<TsType>>,
    }

    pub struct TsTypeParamInstantiation {
        pub span: Span,
        pub params: Vec<Box<TsType>>,
    }

    pub struct TsTypeCastExpr {
        pub span: Span,
        pub expr: Box<Expr>,
        pub type_ann: TsTypeAnn,
    }

    pub struct TsParamProp {
        pub span: Span,
        pub decorators: Vec<Decorator>,
        pub accessibility: Option<Accessibility>,
        pub readonly: bool,
        pub param: TsParamPropParam,
    }

    pub enum TsParamPropParam {
        Ident(Ident),

        Assign(AssignPat),
    }

    pub struct TsQualifiedName {
        pub left: TsEntityName,
        pub right: Ident,
    }

    pub enum TsEntityName {
        TsQualifiedName(Box<TsQualifiedName>),

        Ident(Ident),
    }

    pub enum TsSignatureDecl {
        TsCallSignatureDecl(TsCallSignatureDecl),

        TsConstructSignatureDecl(TsConstructSignatureDecl),

        TsMethodSignature(TsMethodSignature),

        TsFnType(TsFnType),

        TsConstructorType(TsConstructorType),
    }

    pub enum TsTypeElement {
        TsCallSignatureDecl(TsCallSignatureDecl),

        TsConstructSignatureDecl(TsConstructSignatureDecl),

        TsPropertySignature(TsPropertySignature),

        TsMethodSignature(TsMethodSignature),

        TsIndexSignature(TsIndexSignature),
    }

    pub struct TsCallSignatureDecl {
        pub span: Span,
        pub params: Vec<TsFnParam>,
        pub type_ann: Option<TsTypeAnn>,
        pub type_params: Option<TsTypeParamDecl>,
    }

    pub struct TsConstructSignatureDecl {
        pub span: Span,
        pub params: Vec<TsFnParam>,
        pub type_ann: Option<TsTypeAnn>,
        pub type_params: Option<TsTypeParamDecl>,
    }

    pub struct TsPropertySignature {
        pub span: Span,
        pub readonly: bool,
        pub key: Box<Expr>,
        pub computed: bool,
        pub optional: bool,
        pub init: Option<Box<Expr>>,
        pub params: Vec<TsFnParam>,
        pub type_ann: Option<TsTypeAnn>,
        pub type_params: Option<TsTypeParamDecl>,
    }

    pub struct TsMethodSignature {
        pub span: Span,
        pub readonly: bool,
        pub key: Box<Expr>,
        pub computed: bool,
        pub optional: bool,
        pub params: Vec<TsFnParam>,
        pub type_ann: Option<TsTypeAnn>,
        pub type_params: Option<TsTypeParamDecl>,
    }

    pub struct TsIndexSignature {
        pub params: Vec<TsFnParam>,
        pub type_ann: Option<TsTypeAnn>,

        pub readonly: bool,
        pub span: Span,
    }

    pub enum TsType {
        TsKeywordType(TsKeywordType),

        TsThisType(TsThisType),

        TsFnOrConstructorType(TsFnOrConstructorType),

        TsTypeRef(TsTypeRef),

        TsTypeQuery(TsTypeQuery),

        TsTypeLit(TsTypeLit),

        TsArrayType(TsArrayType),

        TsTupleType(TsTupleType),

        TsOptionalType(TsOptionalType),

        TsRestType(TsRestType),

        TsUnionOrIntersectionType(TsUnionOrIntersectionType),

        TsConditionalType(TsConditionalType),

        TsInferType(TsInferType),

        TsParenthesizedType(TsParenthesizedType),

        TsTypeOperator(TsTypeOperator),

        TsIndexedAccessType(TsIndexedAccessType),

        TsMappedType(TsMappedType),

        TsLitType(TsLitType),

        TsTypePredicate(TsTypePredicate),

        TsImportType(TsImportType),
    }

    pub enum TsFnOrConstructorType {
        TsFnType(TsFnType),
        TsConstructorType(TsConstructorType),
    }

    impl From<TsFnType> for TsType {
        fn from(t: TsFnType) -> Self {
            TsFnOrConstructorType::TsFnType(t).into()
        }
    }

    impl From<TsConstructorType> for TsType {
        fn from(t: TsConstructorType) -> Self {
            TsFnOrConstructorType::TsConstructorType(t).into()
        }
    }

    impl From<TsUnionType> for TsType {
        fn from(t: TsUnionType) -> Self {
            TsUnionOrIntersectionType::TsUnionType(t).into()
        }
    }

    impl From<TsIntersectionType> for TsType {
        fn from(t: TsIntersectionType) -> Self {
            TsUnionOrIntersectionType::TsIntersectionType(t).into()
        }
    }

    pub struct TsKeywordType {
        pub span: Span,
        pub kind: TsKeywordTypeKind,
    }

    pub enum TsKeywordTypeKind {
        TsAnyKeyword,

        TsUnknownKeyword,

        TsNumberKeyword,

        TsObjectKeyword,

        TsBooleanKeyword,

        TsBigIntKeyword,

        TsStringKeyword,

        TsSymbolKeyword,

        TsVoidKeyword,

        TsUndefinedKeyword,

        TsNullKeyword,

        TsNeverKeyword,
    }

    pub struct TsThisType {
        pub span: Span,
    }

    pub enum TsFnParam {
        Ident(Ident),

        Array(ArrayPat),

        Rest(RestPat),

        Object(ObjectPat),
    }

    pub struct TsFnType {
        pub span: Span,
        pub params: Vec<TsFnParam>,

        pub type_params: Option<TsTypeParamDecl>,
        pub type_ann: TsTypeAnn,
    }

    pub struct TsConstructorType {
        pub span: Span,
        pub params: Vec<TsFnParam>,
        pub type_params: Option<TsTypeParamDecl>,
        pub type_ann: TsTypeAnn,
    }

    pub struct TsTypeRef {
        pub span: Span,
        pub type_name: TsEntityName,
        pub type_params: Option<TsTypeParamInstantiation>,
    }

    pub struct TsTypePredicate {
        pub span: Span,
        pub asserts: bool,
        pub param_name: TsThisTypeOrIdent,
        pub type_ann: Option<TsTypeAnn>,
    }

    pub enum TsThisTypeOrIdent {
        TsThisType(TsThisType),

        Ident(Ident),
    }

    pub struct TsTypeQuery {
        pub span: Span,
        pub expr_name: TsTypeQueryExpr,
    }

    pub enum TsTypeQueryExpr {
        TsEntityName(TsEntityName),
        Import(TsImportType),
    }

    pub struct TsImportType {
        pub span: Span,
        pub arg: Str,
        pub qualifier: Option<TsEntityName>,
        pub type_args: Option<TsTypeParamInstantiation>,
    }

    pub struct TsTypeLit {
        pub span: Span,
        pub members: Vec<TsTypeElement>,
    }

    pub struct TsArrayType {
        pub span: Span,
        pub elem_type: Box<TsType>,
    }

    pub struct TsTupleType {
        pub span: Span,
        pub elem_types: Vec<Box<TsType>>,
    }

    pub struct TsOptionalType {
        pub span: Span,
        pub type_ann: Box<TsType>,
    }

    pub struct TsRestType {
        pub span: Span,
        pub type_ann: Box<TsType>,
    }

    pub enum TsUnionOrIntersectionType {
        TsUnionType(TsUnionType),

        TsIntersectionType(TsIntersectionType),
    }

    pub struct TsUnionType {
        pub span: Span,
        pub types: Vec<Box<TsType>>,
    }

    pub struct TsIntersectionType {
        pub span: Span,
        pub types: Vec<Box<TsType>>,
    }

    pub struct TsConditionalType {
        pub span: Span,
        pub check_type: Box<TsType>,
        pub extends_type: Box<TsType>,
        pub true_type: Box<TsType>,
        pub false_type: Box<TsType>,
    }

    pub struct TsInferType {
        pub span: Span,
        pub type_param: TsTypeParam,
    }

    pub struct TsParenthesizedType {
        pub span: Span,
        pub type_ann: Box<TsType>,
    }

    pub struct TsTypeOperator {
        pub span: Span,
        pub op: TsTypeOperatorOp,
        pub type_ann: Box<TsType>,
    }

    pub enum TsTypeOperatorOp {
        KeyOf,
        Unique,
        ReadOnly,
    }

    pub struct TsIndexedAccessType {
        pub span: Span,
        pub readonly: bool,
        pub obj_type: Box<TsType>,
        pub index_type: Box<TsType>,
    }

    pub enum TruePlusMinus {
        True,
        Plus,
        Minus,
    }

    impl Serialize for TruePlusMinus {
        fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: ::serde::Serializer,
        {
            match *self {
                TruePlusMinus::True => serializer.serialize_bool(true),
                TruePlusMinus::Plus => serializer.serialize_str("+"),
                TruePlusMinus::Minus => serializer.serialize_str("-"),
            }
        }
    }

    impl<'de> Deserialize<'de> for TruePlusMinus {
        fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
            D: Deserializer<'de>,
        {
            struct TruePlusMinusVisitor;

            impl<'de> Visitor<'de> for TruePlusMinusVisitor {
                type Value = TruePlusMinus;
                fn expecting(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
                    formatter.write_str("one of '+', '-', true")
                }

                fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
                where
                    E: de::Error,
                {
                    match value {
                        "+" => Ok(TruePlusMinus::Plus),
                        "-" => Ok(TruePlusMinus::Minus),
                        "true" => Ok(TruePlusMinus::True),
                        _ => Err(de::Error::invalid_value(Unexpected::Str(value), &self)),
                    }
                }

                fn visit_bool<E>(self, value: bool) -> Result<Self::Value, E>
                where
                    E: de::Error,
                {
                    if value {
                        Ok(TruePlusMinus::True)
                    } else {
                        Err(de::Error::invalid_value(Unexpected::Bool(value), &self))
                    }
                }
            }

            deserializer.deserialize_any(TruePlusMinusVisitor)
        }
    }

    pub struct TsMappedType {
        pub span: Span,
        pub readonly: Option<TruePlusMinus>,
        pub type_param: TsTypeParam,
        pub optional: Option<TruePlusMinus>,
        pub type_ann: Option<Box<TsType>>,
    }

    pub struct TsLitType {
        pub span: Span,
        pub lit: TsLit,
    }

    pub enum TsLit {
        Number(Number),

        Str(Str),

        Bool(Bool),
    }

    pub struct TsInterfaceDecl {
        pub span: Span,
        pub id: Ident,
        pub declare: bool,
        pub type_params: Option<TsTypeParamDecl>,
        pub extends: Vec<TsExprWithTypeArgs>,
        pub body: TsInterfaceBody,
    }

    pub struct TsInterfaceBody {
        pub span: Span,
        pub body: Vec<TsTypeElement>,
    }

    pub struct TsExprWithTypeArgs {
        pub span: Span,
        pub expr: TsEntityName,
        pub type_args: Option<TsTypeParamInstantiation>,
    }

    pub struct TsTypeAliasDecl {
        pub span: Span,
        pub declare: bool,
        pub id: Ident,
        pub type_params: Option<TsTypeParamDecl>,
        pub type_ann: Box<TsType>,
    }

    pub struct TsEnumDecl {
        pub span: Span,
        pub declare: bool,
        pub is_const: bool,
        pub id: Ident,
        pub members: Vec<TsEnumMember>,
    }

    pub struct TsEnumMember {
        pub span: Span,
        pub id: TsEnumMemberId,
        pub init: Option<Box<Expr>>,
    }

    pub enum TsEnumMemberId {
        Ident(Ident),

        Str(Str),
    }

    pub struct TsModuleDecl {
        pub span: Span,
        pub declare: bool,
        pub global: bool,
        pub id: TsModuleName,
        pub body: Option<TsNamespaceBody>,
    }

    pub enum TsNamespaceBody {
        TsModuleBlock(TsModuleBlock),

        TsNamespaceDecl(TsNamespaceDecl),
    }

    pub struct TsModuleBlock {
        pub span: Span,
        pub body: Vec<ModuleItem>,
    }

    pub struct TsNamespaceDecl {
        pub span: Span,
        pub declare: bool,
        pub global: bool,
        pub id: Ident,
        pub body: Box<TsNamespaceBody>,
    }

    pub enum TsModuleName {
        Ident(Ident),

        Str(Str),
    }

    pub struct TsImportEqualsDecl {
        pub span: Span,
        pub declare: bool,
        pub is_export: bool,
        pub id: Ident,
        pub module_ref: TsModuleRef,
    }

    pub enum TsModuleRef {
        TsEntityName(TsEntityName),

        TsExternalModuleRef(TsExternalModuleRef),
    }

    pub struct TsExternalModuleRef {
        pub span: Span,
        pub expr: Str,
    }

    pub struct TsExportAssignment {
        pub span: Span,
        pub expr: Box<Expr>,
    }

    pub struct TsNamespaceExportDecl {
        pub span: Span,
        pub id: Ident,
    }

    pub struct TsAsExpr {
        pub span: Span,
        pub expr: Box<Expr>,
        pub type_ann: Box<TsType>,
    }

    pub struct TsTypeAssertion {
        pub span: Span,
        pub expr: Box<Expr>,
        pub type_ann: Box<TsType>,
    }

    pub struct TsNonNullExpr {
        pub span: Span,
        pub expr: Box<Expr>,
    }

    pub enum Accessibility {
        Public,
        Protected,
        Private,
    }

    pub struct TsConstAssertion {
        pub span: Span,
        pub expr: Box<Expr>,
    }
}
