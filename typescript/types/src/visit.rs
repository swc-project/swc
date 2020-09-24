use super::*;
use swc_visit::define;

pub trait Node {}

impl<T> Node for T {}

define!({
    pub enum Type {
        This(TsThisType),
        Lit(TsLitType),
        Query(QueryType),
        Infer(InferType),
        Import(ImportType),
        Predicate(Predicate),
        IndexedAccessType(IndexedAccessType),

        Ref(Ref),
        TypeLit(TypeLit),
        Keyword(TsKeywordType),
        Conditional(Conditional),
        Tuple(Tuple),
        Array(Array),
        Union(Union),
        Intersection(Intersection),
        Function(Function),
        Constructor(Constructor),
        Method(Method),

        Operator(Operator),

        Param(TypeParam),
        EnumVariant(EnumVariant),

        Interface(Interface),
        Enum(Enum),

        Mapped(Mapped),

        /// export type A<B> = Foo<B>;
        Alias(Alias),
        Namespace(TsNamespaceDecl),
        Module(Module),

        Class(Class),
        /// Instance of the class.
        ///
        /// This variant is required ([TypeLit] is insufficient) because of
        /// codes like
        ///
        ///
        /// ```ts
        /// class A {
        ///     a: string;
        /// }
        ///
        /// class B {
        ///     a: string;
        ///     b: string;
        /// }
        /// ```
        ClassInstance(ClassInstance),

        Static(Static),
        Arc(Arc<Type>),

        Optional(OptionalType),

        Rest(RestType),

        Symbol(Symbol),
    }

    pub struct Symbol {
        pub span: Span,
        pub value: SymbolId,
    }

    pub struct RestType {
        pub span: Span,
        pub ty: Box<Type>,
    }

    pub struct OptionalType {
        pub span: Span,
        pub ty: Box<Type>,
    }

    pub struct IndexedAccessType {
        pub span: Span,
        pub readonly: bool,
        pub obj_type: Box<Type>,
        pub index_type: Box<Type>,
    }

    pub struct Ref {
        pub span: Span,
        pub type_name: TsEntityName,
        pub type_args: Option<TypeParamInstantiation>,
    }

    pub struct InferType {
        pub span: Span,
        pub type_param: TypeParam,
    }

    pub struct QueryType {
        pub span: Span,
        pub expr: QueryExpr,
    }

    pub enum QueryExpr {
        TsEntityName(TsEntityName),
        Import(ImportType),
    }

    pub struct ImportType {
        pub span: Span,
        pub arg: Str,
        pub qualifier: Option<TsEntityName>,
        pub type_params: Option<TypeParamInstantiation>,
    }

    pub struct Module {
        pub span: Span,
        pub exports: ModuleTypeInfo,
    }

    pub struct Enum {
        pub span: Span,
        pub declare: bool,
        pub is_const: bool,
        pub id: Ident,
        pub members: Vec<EnumMember>,
        pub has_num: bool,
        pub has_str: bool,
    }

    pub struct EnumMember {
        pub span: Span,
        pub id: TsEnumMemberId,
        pub val: Expr,
    }

    pub struct Class {
        pub span: Span,
        pub is_abstract: bool,
        pub name: Option<Id>,
        pub super_class: Option<Box<Type>>,
        pub body: Vec<ClassMember>,
        pub type_params: Option<TypeParamDecl>,
        // pub implements: Vec<Box<Type>>,
    }

    pub struct ClassInstance {
        pub span: Span,
        pub cls: Class,
        pub type_args: Option<TypeParamInstantiation>,
        // pub implements: Vec<Box<Type>>,
    }

    pub enum ClassMember {
        Constructor(ConstructorSignature),
        Method(Method),
        Property(ClassProperty),
        IndexSignature(IndexSignature),
    }

    pub struct ClassProperty {
        pub span: Span,
        pub key: Box<Expr>,
        pub value: Option<Box<Type>>,
        pub is_static: bool,
        pub computed: bool,
        pub accessibility: Option<Accessibility>,
        pub is_abstract: bool,
        pub is_optional: bool,
        pub readonly: bool,
        pub definite: bool,
    }

    pub struct Method {
        pub span: Span,
        pub key: PropName,
        pub is_static: bool,
        pub is_abstract: bool,
        pub is_optional: bool,
        pub type_params: Option<TypeParamDecl>,
        pub params: Vec<FnParam>,
        pub ret_ty: Box<Type>,
        pub kind: MethodKind,
    }

    pub struct Mapped {
        pub span: Span,
        pub readonly: Option<TruePlusMinus>,
        pub optional: Option<TruePlusMinus>,
        pub type_param: TypeParam,
        pub ty: Option<Box<Type>>,
    }

    pub struct Conditional {
        pub span: Span,
        pub check_type: Box<Type>,
        pub extends_type: Box<Type>,
        pub true_type: Box<Type>,
        pub false_type: Box<Type>,
    }

    // pub struct Static {
    //     pub span: Span,
    //     pub ty: &'static Type,
    // }

    pub struct Operator {
        pub span: Span,
        pub op: TsTypeOperatorOp,
        pub ty: Box<Type>,
    }

    pub struct Tuple {
        pub span: Span,
        pub elems: Vec<TupleElement>,
    }

    pub struct TupleElement {
        pub span: Span,
        pub label: Option<Pat>,
        pub ty: Box<Type>,
    }

    pub struct Alias {
        pub span: Span,
        pub type_params: Option<TypeParamDecl>,
        pub ty: Box<Type>,
    }

    pub struct Interface {
        pub span: Span,
        pub name: Id,
        pub type_params: Option<TypeParamDecl>,
        pub extends: Vec<TsExpr>,
        pub body: Vec<TypeElement>,
    }

    pub struct TypeLit {
        pub span: Span,
        pub members: Vec<TypeElement>,
    }

    pub struct TypeParamDecl {
        pub span: Span,
        pub params: Vec<TypeParam>,
    }

    pub struct TsExpr {
        pub span: Span,
        pub expr: TsEntityName,
        pub type_args: Option<TypeParamInstantiation>,
    }

    pub struct TypeParamInstantiation {
        pub span: Span,
        pub params: Vec<Box<Type>>,
    }

    pub enum TypeElement {
        Call(CallSignature),
        Constructor(ConstructorSignature),
        Property(PropertySignature),
        Method(MethodSignature),
        Index(IndexSignature),
    }

    pub struct CallSignature {
        pub span: Span,
        pub params: Vec<FnParam>,
        pub type_params: Option<TypeParamDecl>,
        pub ret_ty: Option<Box<Type>>,
    }

    pub struct ConstructorSignature {
        pub span: Span,
        pub params: Vec<FnParam>,
        pub ret_ty: Option<Box<Type>>,
        pub type_params: Option<TypeParamDecl>,
    }

    pub struct PropertySignature {
        pub span: Span,
        pub readonly: bool,
        pub key: Box<Expr>,
        pub computed: bool,
        pub optional: bool,
        pub params: Vec<FnParam>,
        pub type_ann: Option<Box<Type>>,
        pub type_params: Option<TypeParamDecl>,
    }

    pub struct MethodSignature {
        pub span: Span,
        pub readonly: bool,
        pub key: Box<Expr>,
        pub computed: bool,
        pub optional: bool,
        pub params: Vec<FnParam>,
        pub ret_ty: Option<Box<Type>>,
        pub type_params: Option<TypeParamDecl>,
    }

    pub struct IndexSignature {
        pub params: Vec<FnParam>,
        pub type_ann: Option<Box<Type>>,

        pub readonly: bool,
        pub span: Span,
    }

    pub struct Array {
        pub span: Span,
        pub elem_type: Box<Type>,
    }

    /// a | b
    #[derive(Debug, Clone, Spanned)]
    pub struct Union {
        pub span: Span,
        pub types: Vec<Box<Type>>,
    }

    pub struct FnParam {
        pub span: Span,
        pub required: bool,
        pub pat: Pat,
        pub ty: Box<Type>,
    }

    /// a & b

    pub struct Intersection {
        pub span: Span,
        pub types: Vec<Box<Type>>,
    }

    /// A type parameter

    pub struct TypeParam {
        pub span: Span,
        pub name: Id,
        pub constraint: Option<Box<Type>>,
        pub default: Option<Box<Type>>,
    }

    /// FooEnum.A

    pub struct EnumVariant {
        pub span: Span,
        pub enum_name: Id,
        pub name: JsWord,
    }

    pub struct Function {
        pub span: Span,
        pub type_params: Option<TypeParamDecl>,
        pub params: Vec<FnParam>,
        pub ret_ty: Box<Type>,
    }

    pub struct Constructor {
        pub span: Span,
        pub type_params: Option<TypeParamDecl>,
        pub params: Vec<FnParam>,
        pub type_ann: Box<Type>,
    }

    pub struct Predicate {
        pub span: Span,
        pub param_name: TsThisTypeOrIdent,
        pub asserts: bool,
        pub ty: Option<Box<Type>>,
    }

    pub struct TypeOrSpread {
        pub span: Span,
        pub spread: Option<Span>,
        pub ty: Box<Type>,
    }

    // Required for TypeEq to work correctly.

    pub struct TsKeywordType {
        pub span: Span,
        pub kind: TsKeywordTypeKind,
    }

    pub struct TsThisType {
        pub span: Span,
    }
});
