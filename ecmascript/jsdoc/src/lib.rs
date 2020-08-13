pub use self::input::Input;
use crate::ast::*;
use nom::{
    branch::alt,
    bytes::complete::{tag, take_while},
    character::is_alphabetic,
    IResult,
    IResult, InputIter, Slice,
    IResult, Slice,
    IResult, InputIter, Slice,
};
use swc_common::{Span, Spanned};
use swc_ecma_ast::Str;

pub mod ast;

pub fn parse(start: BytePos, end: BytePos, i: &str) -> IResult<&str, JsDoc> {}
pub fn parse(i: Input) -> IResult<Input, JsDoc> {}
pub fn parse(i: Input) -> IResult<Input, JsDoc> {
    unimplemented!()
}
#[derive(Debug, Clone, Copy)]
pub struct Input<'i> {
    pub start: BytePos,
    pub end: BytePos,
    pub src: &'i str,
}
mod input;

pub fn parse(i: Input) -> IResult<Input, JsDoc> {}

pub fn parse_tag_item(i: Input) -> IResult<Input, JsDocTagItem> {
    let (i, _) = tag("@")(i)?;

    let (mut i, tag_name) = parse_word(i)?;

    let span = tag_name.span();

    let tag = match &*tag_name.value {
        "abstract" | "virtual" => JsDocTag::Abstract(JsDocAbstractTag { span }),

        "access" => {
            let (input, access) = parse_one_of(i, &["private", "protected", "package", "public"])?;
            i = input;
            JsDocTag::Access(JsDocAccessTag {
                span,
                access: access.into(),
            })
        }

        "alias" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            JsDocTag::Alias(JsDocAliasTag { span, name_path })
        }

        "async" => JsDocTag::Async(JsDocAsyncTag { span }),

        "augments" | "extends" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            JsDocTag::Augments(JsDocAugmentsTag {
                span,
                class: name_path,
            })
        }

        "author" => {
            let (input, author) = parse_line(i)?;
            i = input;
            JsDocTag::Author(JsDocAuthorTag { span, author })
        }

        "borrows" => {
            let (input, from) = parse_name_path(i)?;
            let (input, _) = tag("as")(input)?;
            let (input, to) = parse_name_path(input)?;
            i = input;
            JsDocTag::Borrows(JsDocBorrowsTag { span, from, to })
        }

        "callback" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            JsDocTag::Callback(JsDocCallbackTag { span, name_path })
        }

        "class" | "constructor" => {
            // TODO: name is must if ty is some
            let (input, ty) = parse_opt_str(i)?;
            let (input, name) = parse_opt_str(input)?;
            i = input;

            JsDocTag::Class(JsDocClassTag { span, ty, name })
        }

        "classdesc" => {
            let (input, desc) = parse_line(i)?;
            i = input;

            JsDocTag::ClassDesc(JSDocClassDescTag { span, desc })
        }

        "constant" | "const" => {
            // TODO: name is must if ty is some
            let (input, ty) = parse_opt_str(i)?;
            let (input, name) = parse_opt_str(input)?;
            i = input;
            JsDocTag::Const(JsDocConstTag { span, ty, name })
        }

        "constructs" => {
            let (input, name) = parse_line(i)?;
            i = input;
            JsDocTag::Constructs(JsDocConstructsTag { span, name })
        }

        "copyright" => {
            let (input, text) = parse_line(i)?;
            i = input;
            JsDocTag::Copyright(JsDocCopyrightTag { span, text })
        }

        "default" | "defaultvalue" => {
            let (input, value) = parse_line(i)?;
            i = input;
            JsDocTag::Default(JsDocDefaultTag { span, value })
        }

        "deprecated" => {
            let (input, text) = parse_line(i)?;
            i = input;
            JsDocTag::Deprecated(JsDocDeprecatedTag { span, text })
        }

        "description" | "desc" => {
            let (input, text) = parse_line(i)?;
            i = input;
            JsDocTag::Description(JsDocDescriptionTag { span, text })
        }

        "enum" => {
            let (input, ty) = parse_type(i)?;
            i = input;
            JsDocTag::Enum(JsDocEnumTag { span, ty })
        }

        "event" => {
            // TODO: implement this
            let (input, ty) = parse_line(i)?;
            i = input;
            JsDocTag::Unknown(JsDocUnknownTag { span, extras: ty })
        }

        "example" => {
            let (input, text) = take_while(|c| c != '@')(i)?;
            i = input;
            JsDocTag::Example(JsDocExampleTag {
                span,
                text: text.into(),
            })
        }

        "exports" => {
            let (input, text) = parse_line(i)?;
            i = input;
            JsDocTag::Exports(JsDocExportsTag {
                span,
                module_name: text.into(),
            })
        }

        "external" | "host" => {
            let (input, name) = parse_line(i)?;
            i = input;
            JsDocTag::External(JsDocExternalTag {
                span,
                name: name.into(),
            })
        }

        "file" | "fileoverview" | "overview" => {
            let (input, text) = parse_line(i)?;
            i = input;
            JsDocTag::File(JsDocFilelTag { span, text })
        }

        "fires" | "emits" => {
            // TODO: implement this
            let (input, ty) = parse_line(i)?;
            i = input;
            JsDocTag::Unknown(JsDocUnknownTag { span, extras: ty })
        }

        "function" | "func" | "method" => {
            let (input, name) = parse_opt_str(i)?;
            i = input;
            JsDocTag::Function(JsDocFunctionTag { span, name })
        }

        "generator" => JsDocTag::Generator(JsDocGeneratorTag { span }),

        "hideconstructor" => JsDocTag::HideConstructor(JsDocHideConstructorTag { span }),

        "ignore" => JsDocTag::Ignore(JsDocIgnoreTag { span }),

        "implements" => {
            let (input, class) = parse_type(i)?;
            i = input;
            JsDocTag::Implements(JsDocImplementsTag { span, class })
        }

        "inheritdoc" => JsDocTag::InheritDoc(JsDocInheritDocTag { span }),

        "inner" => JsDocTag::Inner(JsDocInnerTag { span }),

        "instance" => JsDocTag::Instance(JsDocInstanceTag { span }),

        "interface" => {
            let (input, name) = parse_opt_str(i)?;
            i = input;
            JsDocTag::Interface(JsDocInterfaceTag { span, name })
        }

        "kind" => {
            let (input, name) = parse_one_of(
                i,
                &[
                    "class",
                    "constant",
                    "event",
                    "external",
                    "file",
                    "function",
                    "member",
                    "mixin",
                    "module",
                    "namespace",
                    "typedef",
                ],
            )?;
            i = input;
            JsDocTag::Kind(JsDocKindTag { span, name })
        }

        "lends" => {
            let (input, name) = parse_name_path(i)?;
            i = input;
            JsDocTag::Lends(JsDocLendsTag { span, name })
        }

        "license" => {
            let (input, identifier) = parse_line(i)?;
            i = input;
            JsDocTag::License(JsDocLicenseTag { span, identifier })
        }

        "listens" => {
            let (input, event_name) = parse_line(i)?;
            i = input;
            JsDocTag::Listens(JsDocListensTag { span, event_name })
        }

        "member" | "var" => {
            let (input, ty) = parse_word(i)?;
            let (input, name) = parse_word(input)?;
            i = input;
            JsDocTag::Member(JsDocMemberTag { span, ty, name })
        }

        "memberof" | "memberof!" => {
            let (input, parent_name_path) = parse_name_path(i)?;
            i = input;
            JsDocTag::MemberOf(JsDocMemberOfTag {
                span,
                parent_name_path,
            })
        }

        "mixes" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            JsDocTag::Mixes(JsDocMixesTag { span, name_path })
        }

        "mixin" => {
            let (input, name) = parse_line(i)?;
            i = input;
            JsDocTag::Mixin(JsDocMixinTag { span, name })
        }

        "module" => {
            let (input, ty) = parse_word(i)?;
            let (input, module_name) = parse_line(i)?;
            i = input;
            JsDocTag::Module(JsDocMixinTag { span, name })
        }

        "name" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            JsDocTag::Name(JsDocNameTag { span, name_path })
        }

        "namespace" => {
            let (input, ty) = parse_opt_type(i)?;
            let (input, name) = parse_opt_str(input)?;
            i = input;
            JsDocTag::Name(JsDocNameTag { span, ty, name })
        }

        "override" => JsDocTag::Override(JsDocOverrideTag { span }),

        "package" => {
            let (input, ty) = parse_opt_type(i)?;
            i = input;
            JsDocTag::Package(JsDocPackageTag { span, ty })
        }

        "param" | "arg" | "argument" => {
            let (input, ty) = parse_opt_type(i)?;
            let (input, name) = parse_opt_word(input)?;
            let (input, desc) = parse_line(input)?;
            i = input;
            JsDocTag::Parameter(JsDocParameterTag {
                span,
                ty,
                name,
                desc,
            })
        }

        "private" => {
            let (input, ty) = parse_opt_type(i)?;
            i = input;
            JsDocTag::Private(JsDocPrivateTag { span, ty })
        }

        "property" | "prop" => {
            let (input, ty) = parse_opt_type(i)?;
            let (input, name_path) = parse_name_path(input)?;
            let (input, desc) = parse_line(input)?;
            i = input;
            JsDocTag::Property(JsDocPropertyTag {
                span,
                ty,
                name_path,
                desc,
            })
        }

        "protected" => {
            let (input, ty) = parse_opt_type(i)?;
            i = input;
            JsDocTag::Protected(JsDocProtectedTag { span, ty })
        }

        "public" => JsDocTag::Public(JsDocPublicTag { span }),

        "readonly" => JsDocTag::Readonly(JsDocReadonlyTag { span }),

        "requires" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            JsDocTag::Requires(JsDocRequiresTag { span, name_path })
        }

        "returns" | "return" => {
            let (input, ty) = parse_opt_type(i)?;
            let description = parse_line(input)?;
            i = input;
            JsDocTag::Return(JsDocReturnTag {
                span,
                ty,
                description,
            })
        }

        "see" => {
            let (input, text) = parse_line(i)?;
            i = input;
            JsDocTag::See(JsDocSeeTag { span, text })
        }

        "since" => {}

        "static" => {}

        "summary" => {}

        "this" => {}

        "tutorial" => {}

        "type" => {}

        "typedef" => {}

        "variation" => {}

        "version" => {}

        "yields" | "yield" => {}
            Tag::Alias(AliasTag { span, name_path })
        }

        "async" => Tag::Async(AsyncTag { span }),

        "augments" | "extends" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            Tag::Augments(AugmentsTag {
                span,
                class: name_path,
            })
        }

        "author" => {
            let (input, author) = parse_line(i)?;
            i = input;
            Tag::Author(AuthorTag { span, author })
        }

        "borrows" => {
            let (input, from) = parse_name_path(i)?;
            let (input, _) = tag("as")(input)?;
            let (input, to) = parse_name_path(input)?;
            i = input;
            Tag::Borrows(BorrowsTag { span, from, to })
        }

        "callback" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            Tag::Callback(CallbackTag { span, name_path })
        }

        "class" | "constructor" => {
            // TODO: name is must if ty is some
            let (input, ty) = parse_opt_str(i)?;
            let (input, name) = parse_opt_str(input)?;
            i = input;

            Tag::Class(ClassTag { span, ty, name })
        }

        "classdesc" => {
            let (input, desc) = parse_line(i)?;
            i = input;

            Tag::ClassDesc(JSDocClassDescTag { span, desc })
        }

        "constant" | "const" => {
            // TODO: name is must if ty is some
            let (input, ty) = parse_opt_str(i)?;
            let (input, name) = parse_opt_str(input)?;
            i = input;
            Tag::Const(ConstTag { span, ty, name })
        }

        "constructs" => {
            let (input, name) = parse_line(i)?;
            i = input;
            Tag::Constructs(ConstructsTag { span, name })
        }

        "copyright" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::Copyright(CopyrightTag { span, text })
        }

        "default" | "defaultvalue" => {
            let (input, value) = parse_line(i)?;
            i = input;
            Tag::Default(DefaultTag { span, value })
        }

        "deprecated" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::Deprecated(DeprecatedTag { span, text })
        }

        "description" | "desc" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::Description(DescriptionTag { span, text })
        }

        "enum" => {
            let (input, ty) = parse_type(i)?;
            i = input;
            Tag::Enum(EnumTag { span, ty })
        }

        "event" => {
            // TODO: implement this
            let (input, ty) = parse_line(i)?;
            i = input;
            Tag::Unknown(UnknownTag { span, extras: ty })
        }

        "example" => {
            let (input, text) = take_while(|c| c != '@')(i)?;
            i = input;
            Tag::Example(ExampleTag {
                span,
                text: text.into(),
            })
        }

        "exports" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::Exports(ExportsTag {
                span,
                module_name: text.into(),
            })
        }

        "external" | "host" => {
            let (input, name) = parse_line(i)?;
            i = input;
            Tag::External(ExternalTag {
                span,
                name: name.into(),
            })
        }

        "file" | "fileoverview" | "overview" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::File(FilelTag { span, text })
        }

        "fires" | "emits" => {
            // TODO: implement this
            let (input, ty) = parse_line(i)?;
            i = input;
            Tag::Unknown(UnknownTag { span, extras: ty })
        }

        "function" | "func" | "method" => {
            let (input, name) = parse_opt_str(i)?;
            i = input;
            Tag::Function(FunctionTag { span, name })
        }

        "generator" => Tag::Generator(GeneratorTag { span }),

        "hideconstructor" => Tag::HideConstructor(HideConstructorTag { span }),

        "ignore" => Tag::Ignore(IgnoreTag { span }),

        "implements" => {
            let (input, class) = parse_type(i)?;
            i = input;
            Tag::Implements(ImplementsTag { span, class })
        }

        "inheritdoc" => Tag::InheritDoc(InheritDocTag { span }),

        "inner" => Tag::Inner(InnerTag { span }),

        "instance" => Tag::Instance(InstanceTag { span }),

        "interface" => {
            let (input, name) = parse_opt_str(i)?;
            i = input;
            Tag::Interface(InterfaceTag { span, name })
        }

        "kind" => {
            let (input, name) = parse_one_of(
                i,
                &[
                    "class",
                    "constant",
                    "event",
                    "external",
                    "file",
                    "function",
                    "member",
                    "mixin",
                    "module",
                    "namespace",
                    "typedef",
                ],
            )?;
            i = input;
            Tag::Kind(KindTag { span, name })
        }

        "lends" => {
            let (input, name) = parse_name_path(i)?;
            i = input;
            Tag::Lends(LendsTag { span, name })
        }

        "license" => {
            let (input, identifier) = parse_line(i)?;
            i = input;
            Tag::License(LicenseTag { span, identifier })
        }

        "listens" => {
            let (input, event_name) = parse_line(i)?;
            i = input;
            Tag::Listens(ListensTag { span, event_name })
        }

        "member" | "var" => {
            let (input, ty) = parse_word(i)?;
            let (input, name) = parse_word(input)?;
            i = input;
            Tag::Member(MemberTag { span, ty, name })
        }

        "memberof" | "memberof!" => {
            let (input, parent_name_path) = parse_name_path(i)?;
            i = input;
            Tag::MemberOf(MemberOfTag {
                span,
                parent_name_path,
            })
        }

        "mixes" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            Tag::Mixes(MixesTag { span, name_path })
        }

        "mixin" => {
            let (input, name) = parse_line(i)?;
            i = input;
            Tag::Mixin(MixinTag { span, name })
        }

        "module" => {
            let (input, ty) = parse_word(i)?;
            let (input, name) = parse_line(i)?;
            i = input;
            Tag::Module(ModuleTag { span, ty, name })
        }

        "name" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            Tag::Name(NameTag { span, name_path })
        }

        "namespace" => {
            let (input, ty) = parse_opt_type(i)?;
            let (input, name) = parse_opt_str(input)?;
            i = input;
            Tag::Namespace(NamespaceTag { span, ty, name })
        }

        "override" => Tag::Override(OverrideTag { span }),

        "package" => {
            let (input, ty) = parse_opt_type(i)?;
            i = input;
            Tag::Package(PackageTag { span, ty })
        }

        "param" | "arg" | "argument" => {
            let (input, ty) = parse_opt_type(i)?;
            let (input, name) = parse_opt_word(input)?;
            let (input, desc) = parse_line(input)?;
            i = input;
            Tag::Parameter(ParameterTag {
                span,
                ty,
                name,
                desc,
            })
        }

        "private" => {
            let (input, ty) = parse_opt_type(i)?;
            i = input;
            Tag::Private(PrivateTag { span, ty })
        }

        "property" | "prop" => {
            let (input, ty) = parse_opt_type(i)?;
            let (input, name_path) = parse_name_path(input)?;
            let (input, desc) = parse_line(input)?;
            i = input;
            Tag::Property(PropertyTag {
                span,
                ty,
                name_path,
                desc,
            })
        }

        "protected" => {
            let (input, ty) = parse_opt_type(i)?;
            i = input;
            Tag::Protected(ProtectedTag { span, ty })
        }

        "public" => Tag::Public(PublicTag { span }),

        "readonly" => Tag::Readonly(ReadonlyTag { span }),

        "requires" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            Tag::Requires(RequiresTag { span, name_path })
        }

        "returns" | "return" => {
            let (input, ty) = parse_opt_type(i)?;
            let (input, description) = parse_line(input)?;
            i = input;
            Tag::Return(ReturnTag {
                span,
                ty,
                description,
            })
        }

        "see" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::See(SeeTag { span, text })
        }

        "since" => {
            let (input, version) = parse_line(i)?;
            i = input;
            Tag::Since(SinceTag { span, version })
        }

        "static" => Tag::Static(StaticTag { span }),

        "summary" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::Summary(SummaryTag { span, text })
        }

        "this" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
            Tag::This(ThisTag { span, name_path })
        }

        "throws" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::Throw(ThrowTag { span, text })
        }

        "todo" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::Todo(TodoTag { span, text })
        }

        "tutorial" => {
            let (input, text) = parse_line(i)?;
            i = input;
            Tag::Tutorial(TutorialTag { span, text })
        }

        "type" => {
            let (input, name) = parse_line(i)?;
            i = input;
            Tag::Type(TypeTag { span, name })
        }

        "typedef" => {
            let (input, ty) = parse_opt_type(i)?;
            let (input, name_path) = parse_name_path(input)?;
            i = input;
            Tag::TypeDef(TypeDefTag {
                span,
                ty,
                name_path,
            })
        }

        "variation" => {
            let (input, number) = parse_line(i)?;
            i = input;
            Tag::Variation(VariationTag { span, number })
        }

        "version" => {
            let (input, value) = parse_line(i)?;
            i = input;
            Tag::Version(VersionTag { span, value })
        }

        "yields" | "yield" => {
            let (input, value) = parse_opt_type(i)?;
            let (input, description) = parse_line(input)?;
            i = input;
            Tag::Yield(YieldTag {
                span,
                value,
                description,
            })
        }

        _ => {
            let (input, extras) = parse_str(i)?;
            i = input;
            Tag::Unknown(UnknownTag { span, extras })

        _ => {
            let (input, extras) = parse_str(i)?;
            i = input;
            JsDocTag::Unknown(JsDocUnknownTag { span, extras })
        }
    };

    Ok((
        i,
        JsDocTagItem {
            span,
            tag_name: tag_name.into(),
            tag,
        },
    ))
}

fn parse_one_of<'i, 'l>(i: Input<'i>, list: &'l [&str]) -> IResult<Input<'i>, &'l str> {
    for s in list {
        if i.starts_with(s) {
            let i = &i[s.len()..];
            return Ok((i, s));
        }
    }

    Err(nom::Err::Error((
        format!("Expected one of {}", list.join(",")).as_bytes(),
        nom::error::ErrorKind::Tag,
    )))
    Err()
fn parse_opt_str(i: Input) -> IResult<Input, Str> {
    parse_line(i)
fn parse_opt_str(i: Input) -> IResult<Input, Option<Str>> {
    let (i, res) = parse_line(i)?;

    if res.value.is_empty() {
        Ok((i, None))
    } else {
        Ok((i, Some(res)))
    }
}

fn parse_str(i: Input) -> IResult<Input, Str> {
    parse_line(i)
}

fn parse_opt_type(i: Input) -> IResult<Input, Option<Str>> {
    parse_opt_word(i)
}

fn parse_type(i: Input) -> IResult<Input, Str> {
    parse_line(i)
}

fn parse_one_of<'i>(i: Input<'i>, list: &[&str]) -> IResult<Input<'i>, Str> {
    for &item in list {
        if i.starts_with(item) {
            let res = tag(item)(i);
            match res {
                Ok(v) => return Ok((v.0, v.1.into())),
                Err(..) => continue,
            }
        }
    }

    Err()
}

// ----- ----- Done ----- -----

fn parse_name_path(mut i: Input) -> IResult<Input, NamePath> {
    let lo = i.span().lo;
    let mut components = vec![];
fn parse_name_path(mut i: Input) -> IResult<Input, JsDocNamePath> {
    let lo = i.span().lo;
    let mut components = vec![];

    loop {
        let (input, component) = parse_word(i)?;
        i = input;

        let (input, _) = match tag(".")(i) {
            Ok(v) => v,
            Err(err) => {
                if components.is_empty() {
                    return Err(err);
                }

                return Ok((
                    i,
                    NamePath {
                        span: Span::new(lo, i.span().hi, Default::default()),
                        components,
                    },
                ));
            }
        };
    }
}

fn parse_opt_word(i: Input) -> IResult<Input, Option<Str>> {
    let (i, v) = parse_word(i)?;
    if v.value.is_empty() {
        return Ok((i, None));
    }

    Ok((i, Some(v)))
}

fn parse_word(i: Input) -> IResult<Input, Str> {
    let res = i
        .iter_indices()
        .find(|(_, c)| !(('a' <= *c && *c <= 'z') || ('A' <= *c && *c <= 'Z')));

    if let Some((idx, _)) = res {
        let rest = i.slice(idx + 1..);
        let ret = i.slice(..idx);

        Ok((rest, ret.into()))
    } else {
        // Everything was alphabet
        Ok((Input::empty(), i.into()))
    }
}

fn parse_line(i: Input) -> IResult<Input, Str> {
    let res = i.iter_indices().find(|(_, c)| *c == '\n' || *c == '\r');

    if let Some((idx, _)) = res {
        let rest = i.slice(idx + 1..);
        let ret = i.slice(..idx);

        Ok((rest, ret.into()))
    } else {
        Ok((i, Input::empty().into()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::BytePos;

    fn input(s: &str) -> Input {
        Input::new(BytePos(0), BytePos(s.as_bytes().len() as _), s)
    }

    #[test]
    fn test_parse_line() {
        let (rest, ret) = parse_line(input("foo bar\nbaz")).unwrap();

        assert_eq!(&*ret.value, "foo bar");
        assert_eq!(&*rest, "baz");
    }

    #[test]
    fn test_parse_word() {
        let (rest, ret) = parse_word(input("foo bar\nbaz")).unwrap();

        assert_eq!(&*ret.value, "foo");
        assert_eq!(&*rest, "bar\nbaz");
    }
}

fn parse_name_path(i: Input) -> IResult<Input, Str> {
    parse_line(i)
            Err(_) => {
                if path.is_empty() {
                    return Err();
                }

                return Ok((
                    i,
                    JsDocNamePath {
                        span: Span::new(lo, i.span().hi, Default::default()),
                        components,
                    },
                ));
            }
        };
    }
}

fn parse_opt_word(i: Input) -> IResult<Input, Option<Str>> {
    let (i, v) = parse_word(i)?;
    if v.value.is_empty() {
        return Ok((i, None));
    }

    Ok((i, v))
}

fn parse_word(i: Input) -> IResult<Input, Str> {
    let res = i
        .iter_indices()
        .find(|(_, c)| !(('a' <= *c && *c <= 'z') || ('A' <= *c && *c <= 'Z')));

    if let Some((idx, _)) = res {
        let rest = i.slice(idx + 1..);
        let ret = i.slice(..idx);

        Ok((rest, ret.into()))
    } else {
        // Everything was alphabet
        Ok((Input::empty(), i.into()))
    }
}

fn parse_line(i: Input) -> IResult<Input, Str> {
    let res = i.iter_indices().find(|(_, c)| *c == '\n' || *c == '\r');

    if let Some((idx, _)) = res {
        let rest = i.slice(idx + 1..);
        let ret = i.slice(..idx);

        Ok((rest, ret.into()))
    } else {
        Ok((i, Input::empty().into()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::BytePos;

    fn input(s: &str) -> Input {
        Input::new(BytePos(0), BytePos(s.as_bytes().len() as _), s)
    }

    #[test]
    fn test_parse_line() {
        let (rest, ret) = parse_line(input("foo bar\nbaz")).unwrap();

        assert_eq!(&*ret.value, "foo bar");
        assert_eq!(&*rest, "baz");
    }

    #[test]
    fn test_parse_word() {
        let (rest, ret) = parse_word(input("foo bar\nbaz")).unwrap();

        assert_eq!(&*ret.value, "foo");
        assert_eq!(&*rest, "bar\nbaz");
    }
}
