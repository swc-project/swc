use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

/// Spanned text
#[ast_node]
#[derive(Eq)]
pub struct Text {
    pub span: Span,
    pub value: JsWord,
}

#[ast_node]
pub struct JsDoc {
    pub span: Span,

    pub description: Text,
    pub tags: Vec<TagItem>,
}

///  tag with comments.
#[ast_node]
pub struct TagItem {
    pub span: Span,
    #[serde(rename = "tagName")]
    pub tag_name: Text,
    #[serde(flatten)]
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
    pub access: Text,
}

#[ast_node]
pub struct AliasTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub struct AsyncTag {
    pub span: Span,
}

#[ast_node]
pub struct BorrowsTag {
    pub span: Span,
    pub from: NamePath,
    pub to: NamePath,
}

#[ast_node]
pub struct JSDocClassDescTag {
    pub span: Span,
    pub desc: Text,
}

#[ast_node]
pub struct ConstTag {
    pub span: Span,
    pub ty: Option<Text>,
    pub name: Option<Text>,
}

#[ast_node]
pub struct UnknownTag {
    pub span: Span,
    pub extras: Text,
}

/// `@extends`, `@augments`
#[ast_node]
pub struct AugmentsTag {
    pub span: Span,
    pub class: NamePath,
}

#[ast_node]
pub struct ImplementsTag {
    pub span: Span,
    pub class: Text,
}

#[ast_node]
pub struct ExprWithTypeArgs {
    pub span: Span,

    // TODO parent: HeritageClause | JSDocAugmentsTag | JSDocImplementsTag;
    pub expr: Box<Expr>,
}

#[ast_node]
pub enum Expr {
    #[tag("Identifier")]
    Text(Text),
    #[tag("NamePath")]
    Property(NamePath),
}

#[ast_node]
pub struct AuthorTag {
    pub span: Span,
    /// `<name> [<emailAddress>]`
    pub author: Text,
}

#[ast_node]
#[derive(Eq)]
pub struct ClassTag {
    pub span: Span,
    pub ty: Option<Text>,
    pub name: Option<Text>,
}

#[ast_node]
#[derive(Eq)]
pub struct PublicTag {
    pub span: Span,
}

#[ast_node]
#[derive(Eq)]
pub struct PrivateTag {
    pub span: Span,
    pub ty: Option<Text>,
}

#[ast_node]
#[derive(Eq)]
pub struct ProtectedTag {
    pub span: Span,
    pub ty: Option<Text>,
}

#[ast_node]
#[derive(Eq)]
pub struct ReadonlyTag {
    pub span: Span,
}

#[ast_node]
pub struct CallbackTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub struct PropertyTag {
    pub span: Span,

    pub name_path: NamePath,
    pub ty: Option<Text>,
    pub desc: Text,
}

#[ast_node]
pub struct ParameterTag {
    pub span: Span,

    pub name: Option<Text>,
    #[serde(rename = "typeExpression")]
    pub ty: Option<Text>,

    pub desc: Text,
}

#[ast_node]
#[derive(Eq)]
pub struct EnumTag {
    pub span: Span,
    pub ty: Text,
}

#[ast_node]
pub struct ReturnTag {
    pub span: Span,
    pub ty: Option<Text>,
    pub description: Text,
}

#[ast_node]
pub struct ThisTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub struct TypeTag {
    pub span: Span,
    pub name: Text,
}

#[ast_node]
pub struct TemplateTag {
    pub span: Span,
    pub constraint: Option<TypeExpr>,
}

#[ast_node]
pub struct TypedefTag {
    pub span: Span,
    #[serde(rename = "full_name")]
    pub full_name: Option<NamespaceBody>,

    pub name: Option<Text>,
    #[serde(rename = "typeExpression")]
    pub type_expr: Option<TypeExprOrTypeLit>,
}

#[ast_node]
pub enum Type {
    /// `*`
    #[tag("AllType")]
    All(AllType),
    /// `?`
    #[tag("UnknownType")]
    Unknown(UnknownType),
    #[tag("NullableType")]
    Nullable(NullableType),
    #[tag("NonNullableType")]
    NonNullable(NonNullableType),
    #[tag("OptionalType")]
    Optional(OptionalType),
    #[tag("FunctionType")]
    Function(FunctionType),
    #[tag("VariadicType")]
    Variadic(VariadicType),
    // https://jsdoc.app/about-namepaths.html
    #[tag("NamePathType")]
    NamePath(NamePathType),
    #[tag("UnionType")]
    Union(UnionType),
    #[tag("ParenType")]
    Paren(ParenType),
}

#[ast_node]
pub struct UnionType {
    pub span: Span,
    pub types: Vec<Type>,
}

#[ast_node]
pub struct ParenType {
    pub span: Span,
    pub ty: Box<Type>,
}

#[ast_node]
#[derive(Eq)]
pub struct AllType {
    pub span: Span,
}

#[ast_node]
#[derive(Eq)]
pub struct UnknownType {
    pub span: Span,
}

#[ast_node]
pub struct NullableType {
    pub span: Span,
    pub ty: Box<Type>,
}

#[ast_node]
pub struct NonNullableType {
    pub span: Span,
    pub ty: Box<Type>,
}

#[ast_node]
pub struct OptionalType {
    pub span: Span,
    pub ty: Box<Type>,
}

/// TODO: Add fields
#[ast_node]
pub struct FunctionType {
    pub span: Span,
    pub ty: Box<Type>,
}

#[ast_node]
pub struct VariadicType {
    pub span: Span,
    pub ty: Box<Type>,
}

#[ast_node]
pub struct NamePathType {
    pub span: Span,
    pub ty: Box<Type>,
}

/// represents a top level: { type } expression in a JSDoc comment.
#[ast_node]
pub struct TypeExpr {
    pub span: Span,
    pub ty: Type,
}

#[ast_node]
pub struct NamespaceDecl {
    pub span: Span,
    pub name: Text,
    pub body: Vec<NamespaceBody>,
}

#[ast_node]
pub enum NamespaceBody {
    #[tag("Identifier")]
    Text(Box<Text>),
    #[tag("NamespaceDecl")]
    Decl(Box<NamespaceDecl>),
}

#[ast_node]
pub enum TypeExprOrTypeLit {
    #[tag("TypeExpr")]
    Expr(Box<TypeExpr>),
    #[tag("TypeLit")]
    TypeLit(Box<TypeLit>),
}

#[ast_node]
pub struct TypeLit {
    pub span: Span,
    pub tags: Vec<PropOrParam>,
    /// If true, then this type literal represents an *array* of its type.
    pub is_array_type: bool,
}

#[ast_node]
pub enum PropOrParam {
    #[tag("PropertyTag")]
    Prop(PropertyTag),
    #[tag("ParameterTag")]
    Param(ParameterTag),
}

#[ast_node]
pub struct NamePath {
    pub span: Span,
    pub components: Vec<Text>,
}

#[ast_node]
pub struct CopyrightTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct DescriptionTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct ExampleTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct ExportsTag {
    pub span: Span,
    pub module_name: Text,
}

#[ast_node]
pub struct ExternalTag {
    pub span: Span,
    pub name: Text,
}

#[ast_node]
pub struct ConstructsTag {
    pub span: Span,
    pub name: Text,
}

#[ast_node]
pub struct DefaultTag {
    pub span: Span,
    pub value: Text,
}

#[ast_node]
pub struct DeprecatedTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct FilelTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct FunctionTag {
    pub span: Span,
    pub name: Option<Text>,
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
    pub name: Option<Text>,
}
#[ast_node]
pub struct KindTag {
    pub span: Span,
    pub name: Text,
}

#[ast_node]
pub struct LendsTag {
    pub span: Span,
    pub name: NamePath,
}

#[ast_node]
pub struct LicenseTag {
    pub span: Span,
    pub identifier: Text,
}

#[ast_node]
pub struct ListensTag {
    pub span: Span,
    pub event_name: Text,
}

#[ast_node]
pub struct MemberTag {
    pub span: Span,
    pub ty: Text,
    pub name: Text,
}

#[ast_node]
pub struct MemberOfTag {
    pub span: Span,
    pub parent_name_path: NamePath,
}

#[ast_node]
pub struct TypeDefTag {
    pub span: Span,
    pub ty: Option<Text>,
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
    pub name: Text,
}

#[ast_node]
pub struct ModuleTag {
    pub span: Span,
    pub name: Text,
    pub ty: Text,
}

#[ast_node]
pub struct NameTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub struct NamespaceTag {
    pub span: Span,
    pub ty: Option<Text>,
    pub name: Option<Text>,
}

#[ast_node]
pub struct OverrideTag {
    pub span: Span,
}

#[ast_node]
pub struct PackageTag {
    pub span: Span,
    pub ty: Option<Text>,
}

#[ast_node]
pub struct RequiresTag {
    pub span: Span,
    pub name_path: NamePath,
}

#[ast_node]
pub struct SeeTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct SinceTag {
    pub span: Span,
    pub version: Text,
}

#[ast_node]
pub struct SummaryTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct StaticTag {
    pub span: Span,
}

#[ast_node]
pub struct ThrowTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct TodoTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct TutorialTag {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub struct VariationTag {
    pub span: Span,
    pub number: Text,
}

#[ast_node]
pub struct VersionTag {
    pub span: Span,
    pub value: Text,
}

#[ast_node]
pub struct YieldTag {
    pub span: Span,
    pub value: Option<Text>,
    pub description: Text,
}
