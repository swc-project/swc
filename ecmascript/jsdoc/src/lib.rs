pub use self::input::Input;
use crate::ast::*;
use nom::{
    bytes::complete::{tag, take_while},
    error::ErrorKind,
    IResult, InputIter, Slice,
};
use swc_common::{Span, Spanned, SyntaxContext};

pub mod ast;
mod input;

pub fn parse(i: Input) -> IResult<Input, JsDoc> {
    let i = skip(i);

    let mut tags = vec![];
    let lo = i.span().lo;
    let (description, mut i) = take_while(|c| c != '@')(i)?;
    let description = trim(description).into();

    i = skip(i);

    while i.starts_with('@') {
        let (input, tag) = parse_tag_item(i)?;
        i = input;
        tags.push(tag);
        i = skip(i);
    }

    let hi = i.span().hi;
    Ok((
        i,
        JsDoc {
            span: Span::new(lo, hi, SyntaxContext::empty()),
            tags,
            description,
        },
    ))
}

pub fn parse_tag_item(i: Input) -> IResult<Input, TagItem> {
    let i = skip(i);
    let (_, i) = tag("@")(i)?;

    let (mut i, tag_name) = parse_word(i)?;
    i = skip_ws(i);

    let span = tag_name.span();
    let tag = match &*tag_name.value {
        "abstract" | "virtual" => Tag::Abstract(AbstractTag { span }),

        "access" => {
            let (input, access) = parse_one_of(i, &["private", "protected", "package", "public"])?;
            i = input;
            Tag::Access(AccessTag {
                span,
                access: access.into(),
            })
        }

        "alias" => {
            let (input, name_path) = parse_name_path(i)?;
            i = input;
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
            let (_, input) = tag("as")(input)?;
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
            let (text, input) = take_while(|c| c != '@')(i)?;
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
            let (input, name) = parse_line(input)?;
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
        }
    };

    Ok((
        i,
        TagItem {
            span,
            tag_name: tag_name.into(),
            tag,
        },
    ))
}

fn parse_opt_str(i: Input) -> IResult<Input, Option<Text>> {
    let (i, res) = parse_line(i)?;

    if res.value.is_empty() {
        Ok((i, None))
    } else {
        Ok((i, Some(res)))
    }
}

fn parse_str(i: Input) -> IResult<Input, Text> {
    parse_line(i)
}

fn parse_type(i: Input) -> IResult<Input, Text> {
    parse_line(i)
}

// ----- ----- Done ----- -----

fn trim(i: Input) -> Input {
    let prev_len = i.len();
    let new_str = i.trim_start();

    let start = prev_len - new_str.len();

    let end = i.trim_end().len();

    if start >= end {
        return i;
    }

    i.slice(start..end)
}

fn parse_opt_type(i: Input) -> IResult<Input, Option<Text>> {
    let i = skip_ws(i);
    if i.starts_with('{') {
        if let Some(pos) = i.find('}') {
            let ret = i.slice(..pos + 1);
            let i = i.slice(pos + 1..);
            return Ok((i, Some(ret.into())));
        }
    }

    parse_opt_word(i)
}

fn parse_one_of<'i>(i: Input<'i>, list: &[&str]) -> IResult<Input<'i>, Text> {
    for &item in list {
        if i.starts_with(item) {
            let res = tag::<&str, Input<'_>, (_, ErrorKind)>(item)(i);
            match res {
                Ok(v) => return Ok((v.1, v.0.into())),
                Err(..) => continue,
            }
        }
    }

    Err(nom::Err::Error((i, ErrorKind::Tag)))
}

fn parse_name_path(mut i: Input) -> IResult<Input, NamePath> {
    let lo = i.span().lo;
    let mut components = vec![];

    loop {
        let (input, component) = parse_word(i)?;
        components.push(component);
        i = input;

        let (_, input) = match tag(".")(i) {
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
        i = input;
    }
}

fn parse_opt_word(i: Input) -> IResult<Input, Option<Text>> {
    let (i, v) = parse_word(i)?;
    if v.value.is_empty() {
        return Ok((i, None));
    }

    Ok((i, Some(v)))
}

fn parse_word(i: Input) -> IResult<Input, Text> {
    let res = i.iter_indices().find(|(_, c)| {
        !(('a' <= *c && *c <= 'z') || ('A' <= *c && *c <= 'Z' || *c == '<' || *c == '>'))
    });

    if let Some((idx, _)) = res {
        let rest = i.slice(idx + 1..);
        let ret = i.slice(..idx);

        Ok((rest, ret.into()))
    } else {
        // Everything was alphabet
        Ok((Input::empty(), i.into()))
    }
}

fn parse_line(i: Input) -> IResult<Input, Text> {
    let i = skip_ws(i);
    let res = i.iter_indices().find(|(_, c)| *c == '\n' || *c == '\r');

    if let Some((idx, _)) = res {
        let rest = i.slice(idx + 1..);
        let ret = i.slice(..idx);

        Ok((rest, ret.into()))
    } else {
        Ok((i, Input::empty().into()))
    }
}

/// Skips whitespace
///
/// This function does not handle newline nor *.
fn skip_ws(i: Input) -> Input {
    let mut index = 0;

    for (idx, c) in i.char_indices() {
        if c == ' ' {
            index = idx + 1;
            continue;
        }

        break;
    }

    i.slice(index..)
}

/// Skips whitespace and * at line start
fn skip(i: Input) -> Input {
    //

    let mut at_line_start = true;
    let mut index = 0;

    for (idx, c) in i.char_indices() {
        if at_line_start && c == '*' {
            at_line_start = false;
            index = idx + 1;
            continue;
        }

        if c == '\r' || c == '\n' {
            at_line_start = true;
            index = idx + 1;
            continue;
        }

        if c == ' ' {
            index = idx + 1;
            continue;
        }

        break;
    }

    i.slice(index..)
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::BytePos;

    fn input(s: &str) -> Input {
        Input::new(BytePos(0), BytePos(s.as_bytes().len() as _), s)
    }

    #[test]
    fn issue_1058() {
        let (i, ret) = parse(input(
            r#"
            * 
            * @param list - LinkedList<T>
            * @example <caption>Linkedlists.compareWith</caption>
            * import { LinkedList } from './js_test/linkedlist.ts'
            * const testArr = [1, 2, 3, 4, 5, 6, 78, 9, 0, 65];
            * const firstList = new LinkedList<number>();
            * const secondList = new LinkedList<number>();
            * for (let data of testArr) {
            *   firstList.insertNode(data);
            *   secondList.insertNode(data);
            * }
            * const result = firstList.compareWith(secondList);
            * assert(result);
            * @returns boolean
            "#,
        ))
        .unwrap();

        assert_eq!(&*skip(i), "");
        assert_eq!(ret.tags.len(), 3);
    }

    #[test]
    fn access_tag() {
        let (i, ret) = parse(input(
            " Give x another name.
        @alias myObject
        @namespace
     ",
        ))
        .unwrap();

        assert_eq!(&*ret.description.value, "Give x another name.");
        assert_eq!(ret.tags.len(), 2);
        assert_eq!(&*skip(i), "");
    }

    #[test]
    fn abstract_tag() {
        let (i, ret) = parse_tag_item(input(
            "
        * @abstract ",
        ))
        .unwrap();

        match ret.tag {
            Tag::Abstract(..) => {}
            _ => panic!("Invalid tag: {:?}", ret.tag),
        }

        assert_eq!(&*skip(i), "");
    }

    #[test]
    fn yield_tag_1() {
        let (i, ret) = parse_tag_item(input(
            "
        *
        * @yields {number} The next number in the Fibonacci sequence.
       ",
        ))
        .unwrap();

        match ret.tag {
            Tag::Yield(tag) => {
                assert_eq!(tag.value.as_ref().map(|v| &*v.value), Some("{number}"));
                assert_eq!(
                    &*tag.description.value,
                    "The next number in the Fibonacci sequence."
                );
            }
            _ => panic!("Invalid tag: {:?}", ret.tag),
        }

        assert_eq!(&*skip(i), "");
    }

    #[test]
    fn trim_1() {
        assert_eq!(&*trim(input(" foo ")), "foo");
        assert_eq!(&*trim(input("foo ")), "foo");
        assert_eq!(&*trim(input(" foo")), "foo");
    }

    #[test]
    fn skip_1() {
        let i = skip(input(
            "   
        *
        * @yields ",
        ));

        assert_eq!(&*i, "@yields ");
    }

    #[test]
    fn one_of_1() {
        let (rest, ret) = parse_one_of(input("foo bar\nbaz"), &["fo", "bar"]).unwrap();

        assert_eq!(&*ret.value, "fo");
        assert_eq!(&*rest, "o bar\nbaz");
    }

    #[test]
    fn line_1() {
        let (rest, ret) = parse_line(input("foo bar\nbaz")).unwrap();

        assert_eq!(&*ret.value, "foo bar");
        assert_eq!(&*rest, "baz");
    }

    #[test]
    fn word_1() {
        let (rest, ret) = parse_word(input("foo bar\nbaz")).unwrap();

        assert_eq!(&*ret.value, "foo");
        assert_eq!(&*rest, "bar\nbaz");
    }
}
