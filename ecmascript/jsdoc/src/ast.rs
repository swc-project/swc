use swc_atoms::JsWord;
use swc_common::{ast_node, Span};
use swc_ecma_ast::{Ident, Str};

#[ast_node]
pub struct JsDoc {
    pub span: Span,

    pub description: Str,
    pub tags: Vec<JsDocTagItem>,
}

/// JsDoc tag with comments.
#[ast_node]
pub struct JsDocTagItem {
    pub span: Span,
    #[serde(rename = "tagName")]
    pub tag_name: JsWord,
    #[serde(flatten)]
    pub tag: JsDocTag,
    pub tag: Tag,
}

#[ast_node]
#[non_exhaustive]
pub enum Tag {
    #[tag("Yield")]
    Yield(YieldTag),
    #[tag("TypeDef")]
    TypeDef(TypeDefTag),
    #[tag("Throw")]
    Throw(ThrowTag),
    #[tag("Todo")]
    Todo(TodoTag),
    #[tag("Tutorial")]
    Tutorial(TutorialTag),
    #[tag("Static")]
    Static(StaticTag),
    #[tag("Summary")]
    Summary(SummaryTag),
    #[tag("See")]
    See(SeeTag),
    #[tag("Since")]
    Since(SinceTag),
    #[tag("Requires")]
    Requires(RequiresTag),
    #[tag("Override")]
    Override(OverrideTag),
    #[tag("Package")]
    Package(PackageTag),
    #[tag("Module")]
    Module(ModuleTag),
    #[tag("Name")]
    Name(NameTag),
    #[tag("Namespace")]
    Namespace(NamespaceTag),
    #[tag("Variation")]
    Variation(VariationTag),
    #[tag("Version")]
    Version(VersionTag),
    #[tag("MemberOf")]
    MemberOf(MemberOfTag),
    #[tag("Mixes")]
    Mixes(MixesTag),
    #[tag("Mixin")]
    Mixin(MixinTag),
    #[tag("Member")]
    Member(MemberTag),
    #[tag("Listens")]
    Listens(ListensTag),
    #[tag("License")]
    License(LicenseTag),
    #[tag("Kind")]
    Kind(KindTag),
    #[tag("Lends")]
    Lends(LendsTag),
    #[tag("Instance")]
    Instance(InstanceTag),
    #[tag("Interface")]
    Interface(InterfaceTag),
    #[tag("Inner")]
    Inner(InnerTag),
    #[tag("InheritDoc")]
    InheritDoc(InheritDocTag),
    #[tag("IgnoreTag")]
    Ignore(IgnoreTag),
    #[tag("HideConstructorTag")]
    HideConstructor(HideConstructorTag),
    #[tag("GeneratorTag")]
    Generator(GeneratorTag),
    #[tag("FunctionTag")]
    Function(FunctionTag),
    #[tag("FilelTag")]
    File(FilelTag),
    #[tag("ConstructsTag")]
    Constructs(ConstructsTag),
    #[tag("CopyrightTag")]
    Copyright(CopyrightTag),
    #[tag("AbstractTag")]
    Abstract(AbstractTag),
    #[tag("AccessTag")]
    Access(AccessTag),
    #[tag("AliasTag")]
    Alias(AliasTag),
    #[tag("AsyncTag")]
    Async(AsyncTag),
    #[tag("UnknownTag")]
    Unknown(UnknownTag),
    #[tag("AugmentsTag")]
    Augments(AugmentsTag),
    #[tag("ImplementsTag")]
    Implements(ImplementsTag),
    #[tag("AuthorTag")]
    Author(AuthorTag),
    #[tag("BorrowsTag")]
    Borrows(BorrowsTag),
    #[tag("ClassTag")]
    Class(ClassTag),
    #[tag("JSDocClassDescTag")]
    ClassDesc(JSDocClassDescTag),
    #[tag("ConstTag")]
    Const(ConstTag),
    #[tag("PublicTag")]
    Public(PublicTag),
    #[tag("PrivateTag")]
    Private(PrivateTag),
    #[tag("ProtectedTag")]
    Protected(ProtectedTag),
    #[tag("ReadonlyTag")]
    Readonly(ReadonlyTag),
    #[tag("CallbackTag")]
    Callback(CallbackTag),
    #[tag("EnumTag")]
    Enum(EnumTag),
    #[tag("ParameterTag")]
    Parameter(ParameterTag),
    #[tag("ReturnTag")]
    Return(ReturnTag),
    #[tag("ThisTag")]
    This(ThisTag),
    #[tag("TypeTag")]
    Type(TypeTag),
    #[tag("TemplateTag")]
    Template(TemplateTag),
    #[tag("TypedefTag")]
    Typedef(TypedefTag),
    #[tag("PropertyTag")]
    Property(PropertyTag),
    #[tag("DescriptionTag")]
    Description(DescriptionTag),
    #[tag("ExampleTag")]
    Example(ExampleTag),
    #[tag("ExportsTag")]
    Exports(ExportsTag),
    #[tag("ExternalTag")]
    External(ExternalTag),
    #[tag("DefaultTag")]
    Default(DefaultTag),
    #[tag("DeprecatedTag")]
    Deprecated(DeprecatedTag),
}

#[ast_node]
pub struct AbstractTag {
    pub span: Span,
}

#[ast_node]
pub struct AccessTag {
    pub span: Span,
    pub access: Str,
}

#[ast_node]
pub struct AliasTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub enum JsDocTag {
    #[tag("JsDocAbstractTag")]
    Abstract(JsDocAbstractTag),
    #[tag("JsDocAccessTag")]
    Access(JsDocAccessTag),
    #[tag("JsDocAliasTag")]
    Alias(JsDocAliasTag),
    #[tag("JsDocAsyncTag")]
    Async(JsDocAsyncTag),
    #[tag("JsDocUnknownTag")]
    Unknown(JsDocUnknownTag),
    #[tag("JsDocAugmentsTag")]
    Augments(JsDocAugmentsTag),
    #[tag("JsDocImplementsTag")]
    Implements(JsDocImplementsTag),
    #[tag("JsDocAuthorTag")]
    Author(JsDocAuthorTag),
    #[tag("JsDocClassTag")]
    Class(JsDocClassTag),
    #[tag("JsDocPublicTag")]
    Public(JsDocPublicTag),
    #[tag("JsDocPrivateTag")]
    Private(JsDocPrivateTag),
    #[tag("JsDocProtectedTag")]
    Protected(JsDocProtectedTag),
    #[tag("JsDocReadonlyTag")]
    Readonly(JsDocReadonlyTag),
    #[tag("JsDocCallbackTag")]
    Callback(JsDocCallbackTag),
    #[tag("JsDocEnumTag")]
    Enum(JsDocEnumTag),
    #[tag("JsDocParameterTag")]
    Parameter(JsDocParameterTag),
    #[tag("JsDocReturnTag")]
    Return(JsDocReturnTag),
    #[tag("JsDocThisTag")]
    This(JsDocThisTag),
    #[tag("JsDocTypeTag")]
    Type(JsDocTypeTag),
    #[tag("JsDocTemplateTag")]
    Template(JsDocTemplateTag),
    #[tag("JsDocTypedefTag")]
    Typedef(JsDocTypedefTag),
    #[tag("JsDocPropertyTag")]
    Property(JsDocPropertyTag),
}

#[ast_node]
pub struct JsDocAbstractTag {
    pub span: Span,
}

#[ast_node]
pub struct JsDocAccessTag {
    pub span: Span,
    pub access: JsWord,
}

#[ast_node]
pub struct JsDocAliasTag {
    pub span: Span,
    pub name_path: JsDocNamePath,
}

#[ast_node]
pub struct JsDocAsyncTag {
    pub span: Span,
}

#[ast_node]
pub struct JsDocUnknownTag {
    pub span: Span,
    pub extras: Str,
}

/// `@extends`, `@augments`
#[ast_node]
pub struct JsDocAugmentsTag {
    pub span: Span,
    pub class: JsDocNamePath,
}

#[ast_node]
pub struct JsDocImplementsTag {
    pub span: Span,
    pub class: JsDocExprWithTypeArgs,
}

#[ast_node]
pub struct JsDocExprWithTypeArgs {
    pub span: Span,

    // TODO parent: HeritageClause | JSDocAugmentsTag | JSDocImplementsTag;
    pub expr: Box<JsDocExpr>,
}

#[ast_node]
pub enum JsDocExpr {
    #[tag("Identifier")]
    Ident(Ident),
    Property(JsDocNamePath),
}

#[ast_node]
pub struct JsDocAuthorTag {
    pub span: Span,
    /// `<name> [<emailAddress>]`
    pub author: Str,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocClassTag {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocPublicTag {
#[derive(Eq)]
pub struct PublicTag {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocPrivateTag {
#[derive(Eq)]
pub struct PrivateTag {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocProtectedTag {
#[derive(Eq)]
pub struct ProtectedTag {
    pub span: Span,
    pub ty: Option<Str>,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocReadonlyTag {
#[derive(Eq)]
pub struct ReadonlyTag {
    pub span: Span,
}

#[ast_node]
pub struct JsDocCallbackTag {
    pub span: Span,
    pub name: Option<Ident>,
    #[serde(rename = "fullName")]
    pub full_name: Option<JsDocNamespaceBody>,
    // TODO: pub type_expr: JSDocSignature;
}

#[ast_node]
pub struct JsDocPropertyTag {
    pub span: Span,

    pub name: TsEntityName,
    #[serde(rename = "typeExpression")]
    pub type_expr: Option<JsDocTypeExpr>,
    /// Whether the property name came before the type -- non-standard for
    /// JSDoc, but Typescript-like
    pub is_name_first: bool,
    pub is_bracketed: bool,
}

#[ast_node]
pub struct JsDocParameterTag {
    pub span: Span,

    pub name: TsEntityName,
    #[serde(rename = "typeExpression")]
    pub type_expr: Option<JsDocTypeExpr>,
    /// Whether the property name came before the type -- non-standard for
    /// JSDoc, but Typescript-like
    pub is_name_first: bool,
    pub is_bracketed: bool,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocEnumTag {
    pub span: Span,
}

#[ast_node]
pub struct JsDocReturnTag {
    pub span: Span,
    #[serde(rename = "typeExpression")]
    type_expr: Option<JsDocTypeExpr>,
    pub ty: Option<Str>,
    pub description: Str,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocThisTag {
pub struct ThisTag {
    pub span: Span,
}

#[ast_node]
pub struct JsDocTypeTag {
    pub span: Span,
    #[serde(rename = "typeExpression")]
    pub type_expr: JsDocTypeExpr,
    pub name: Str,
}

#[ast_node]
pub struct JsDocTemplateTag {
    pub span: Span,
    pub constraint: Option<JsDocTypeExpr>,
    #[serde(rename = "typeParameters")]
    pub type_params: Vec<TsTypeParamDecl>,
}

#[ast_node]
pub struct JsDocTypedefTag {
    pub span: Span,
    #[serde(rename = "full_name")]
    pub full_name: Option<JsDocNamespaceBody>,

    pub name: Option<Ident>,
    #[serde(rename = "typeExpression")]
    pub type_expr: Option<JsDocTypeExprOrTypeLit>,
}

#[ast_node]
pub enum JsDocType {
    /// `*`
    #[tag("JsDocAllType")]
    All(JsDocAllType),
    /// `?`
    #[tag("JsDocUnknownType")]
    Unknown(JsDocUnknownType),
    #[tag("JsDocNullableType")]
    Nullable(JsDocNullableType),
    #[tag("JsDocNonNullableType")]
    NonNullable(JsDocNonNullableType),
    #[tag("JsDocOptionalType")]
    Optional(JsDocOptionalType),
    #[tag("JsDocFunctionType")]
    Function(JsDocFunctionType),
    #[tag("JsDocVariadicType")]
    Variadic(JsDocVariadicType),
    // https://jsdoc.app/about-namepaths.html
    #[tag("JsDocNamePathType")]
    NamePath(JsDocNamePathType),
    #[tag("JsDocUnionType")]
    Union(JsDocUnionType),
    #[tag("JsDocParenType")]
    Paren(JsDocParenType),
}

#[ast_node]
pub struct JsDocUnionType {
    pub span: Span,
    pub types: Vec<JsDocType>,
}

#[ast_node]
pub struct JsDocParenType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocAllType {
#[derive(Eq)]
pub struct AllType {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocUnknownType {
#[derive(Eq)]
pub struct UnknownType {
    pub span: Span,
}

#[ast_node]
pub struct JsDocNullableType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
pub struct JsDocNonNullableType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
pub struct JsDocOptionalType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

/// TODO: Add fields
#[ast_node]
pub struct JsDocFunctionType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
pub struct JsDocVariadicType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
pub struct JsDocNamePathType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

/// represents a top level: { type } expression in a JSDoc comment.
#[ast_node]
pub struct JsDocTypeExpr {
    pub span: Span,
    pub ty: JsDocType,
}

#[ast_node]
pub struct JsDocNamespaceDecl {
    pub span: Span,
    pub name: Ident,
    pub body: Vec<JsDocNamespaceBody>,
}

#[ast_node]
pub enum JsDocNamespaceBody {
    #[tag("Identifier")]
    Ident(Box<Ident>),
    #[tag("JsDocNamespaceDecl")]
    Decl(Box<JsDocNamespaceDecl>),
}

#[ast_node]
pub enum JsDocTypeExprOrTypeLit {
    #[tag("JsDocTypeExpr")]
    Expr(Box<JsDocTypeExpr>),
    #[tag("JsDocTypeLit")]
    TypeLit(Box<JsDocTypeLit>),
}

#[ast_node]
pub struct JsDocTypeLit {
    pub span: Span,
    pub tags: Vec<JsDocPropOrParam>,
    /// If true, then this type literal represents an *array* of its type.
    pub is_array_type: bool,
}

#[ast_node]
pub enum JsDocPropOrParam {
    #[tag("JsDocPropertyTag")]
    Prop(JsDocPropertyTag),
    #[tag("JsDocParameterTag")]
    Param(JsDocParameterTag),
}

#[ast_node]
pub struct JsDocNamePath {
    pub components: Vec<Ident>,
}

#[ast_node]
pub struct CopyrightTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct DescriptionTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct ExampleTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct ExportsTag {
    pub span: Span,
    pub module_name: Str,
}

#[ast_node]
pub struct ExternalTag {
    pub span: Span,
    pub name: Str,
}

#[ast_node]
pub struct ConstructsTag {
    pub span: Span,
    pub name: Str,
}

#[ast_node]
pub struct DefaultTag {
    pub span: Span,
    pub value: Str,
}

#[ast_node]
pub struct DeprecatedTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct FilelTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct FunctionTag {
    pub span: Span,
    pub name: Option<Str>,
}

#[ast_node]
pub struct GeneratorTag {
    pub span: Span,
}
#[ast_node]
pub struct HideConstructorTag {
    pub span: Span,
}

#[ast_node]
pub struct IgnoreTag {
    pub span: Span,
}

#[ast_node]
pub struct InheritDocTag {
    pub span: Span,
}

#[ast_node]
pub struct InnerTag {
    pub span: Span,
}

#[ast_node]
pub struct InstanceTag {
    pub span: Span,
}

#[ast_node]
pub struct InterfaceTag {
    pub span: Span,
    pub name: Option<Str>,
}
#[ast_node]
pub struct KindTag {
    pub span: Span,
    pub name: Str,
}

#[ast_node]
pub struct LendsTag {
    pub span: Span,
    pub name: NamePath,
}

#[ast_node]
pub struct LicenseTag {
    pub span: Span,
    pub identifier: Str,
}

#[ast_node]
pub struct ListensTag {
    pub span: Span,
    pub event_name: Str,
}

#[ast_node]
pub struct MemberTag {
    pub span: Span,
    pub ty: Str,
    pub name: Str,
}

#[ast_node]
pub struct MemberOfTag {
    pub span: Span,
    pub parent_name_path: NamePath,
}

#[ast_node]
pub struct TypeDefTag {
    pub span: Span,
    pub ty: Option<Str>,
    pub name_path: NamePath,
}

#[ast_node]
pub struct MixesTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub struct MixinTag {
    pub span: Span,
    pub name: Str,
}

#[ast_node]
pub struct ModuleTag {
    pub span: Span,
    pub name: Str,
    pub ty: Str,
}

#[ast_node]
pub struct NameTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub struct NamespaceTag {
    pub span: Span,
    pub ty: Option<Str>,
    pub name: Option<Str>,
}

#[ast_node]
pub struct OverrideTag {
    pub span: Span,
}

#[ast_node]
pub struct PackageTag {
    pub span: Span,
    pub ty: Option<Str>,
}

#[ast_node]
pub struct RequiresTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub struct SeeTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct SinceTag {
    pub span: Span,
    pub version: Str,
}

#[ast_node]
pub struct SummaryTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct StaticTag {
    pub span: Span,
}

#[ast_node]
pub struct ThrowTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct TodoTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct TutorialTag {
    pub span: Span,
    pub text: Str,
}

#[ast_node]
pub struct VariationTag {
    pub span: Span,
    pub number: Str,
}

#[ast_node]
pub struct VersionTag {
    pub span: Span,
    pub value: Str,
}

#[ast_node]
pub struct YieldTag {
    pub span: Span,
    pub value: Option<Str>,
    pub description: Str,
}
