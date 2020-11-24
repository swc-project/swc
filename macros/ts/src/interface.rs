use std::{
    fmt,
    fmt::{Display, Write},
    path::PathBuf,
};
use syn::{
    Attribute, Data, DataStruct, DeriveInput, Fields, GenericArgument, Lit, Meta, NestedMeta,
    PathArguments, Type,
};

pub(super) fn create(input: DeriveInput) {
    let InterfaceAttr { path } = InterfaceAttr::parse(&input.attrs);
    if path == PathBuf::new() {
        panic!("#[interface(path = \"path/to/file.ts\")] is required")
    }

    let type_name = input.ident.to_string();

    let fields = match input.data {
        Data::Struct(s) => parse_struct(s),
        Data::Enum(_) => todo!("#[derive(Interface)] for `enum`"),
        Data::Union(_) => panic!("#[derive(Interface)] does not support `union`"),
    };

    let s = print_interface(&type_name, &fields).unwrap();
    std::fs::write(&path, s.as_bytes()).unwrap();
}

fn print_interface(type_name: &str, fields: &[InterfaceField]) -> Result<String, fmt::Error> {
    let mut b = String::new();

    writeln!(b, "export default interface {} {{", type_name)?;
    for field in fields {
        let optional = if field.optional { "?" } else { "" };

        writeln!(b, "    {}{}: {};", field.name, optional, field.ty)?;
    }
    writeln!(b, "}}")?;

    Ok(b)
}

fn parse_type(field_name: &str, attrs: &[Attribute], ty: &Type) -> (bool, FieldType) {
    match ty {
        Type::Path(path) => match path.path.get_ident() {
            Some(name) => {
                // Known types
                if name == "String" || name == "char" {
                    return (false, FieldType::Primitive("string"));
                }
                if name == "usize"
                    || name == "u8"
                    || name == "u16"
                    || name == "u32"
                    || name == "u64"
                    || name == "u128"
                    || name == "i8"
                    || name == "i16"
                    || name == "i32"
                    || name == "i64"
                    || name == "i128"
                {
                    return (false, FieldType::Primitive("number"));
                }

                if name == "bool" {
                    return (false, FieldType::Primitive("boolean"));
                }

                // Option<T>
                if name == "Option" {
                    for seg in &path.path.segments {
                        match &seg.arguments {
                            PathArguments::None => todo!("error reporting for empty Option"),
                            PathArguments::AngleBracketed(seg) => {
                                for arg in &seg.args {
                                    match &arg {
                                        GenericArgument::Type(ty) => {
                                            let (_, ty) = parse_type(field_name, attrs, ty);
                                            return (true, ty);
                                        }
                                        _ => panic!("error reporting non-type argument in Option"),
                                    }
                                }
                            }
                            PathArguments::Parenthesized(_) => todo!("error reporting?"),
                        }
                    }
                }

                if name == "Box" {
                    for seg in &path.path.segments {
                        match &seg.arguments {
                            PathArguments::None => todo!("error reporting for empty Box"),
                            PathArguments::AngleBracketed(seg) => {
                                for arg in &seg.args {
                                    match arg {
                                        GenericArgument::Type(ty) => {
                                            return parse_type(field_name, attrs, ty);
                                        }
                                        _ => panic!("error reporting non-type argument in Option"),
                                    }
                                }
                            }
                            PathArguments::Parenthesized(_) => todo!("error reporting?"),
                        }
                    }
                }

                if name == "Vec" {
                    for seg in &path.path.segments {
                        match &seg.arguments {
                            PathArguments::None => todo!("error reporting for empty Box"),
                            PathArguments::AngleBracketed(seg) => {
                                for arg in &seg.args {
                                    match arg {
                                        GenericArgument::Type(ty) => {
                                            let (_, ty) = parse_type(field_name, attrs, ty);
                                            return (false, FieldType::Array(Box::new(ty)));
                                        }
                                        _ => panic!("error reporting non-type argument in Option"),
                                    }
                                }
                            }
                            PathArguments::Parenthesized(_) => todo!("error reporting?"),
                        }
                    }
                }
            }
            None => todo!("non-trivial paths"),
        },
        _ => {}
    }

    for attr in attrs {
        if let Some(name) = attr.path.get_ident() {
            if name == "interface" {
                let meta = attr.parse_meta().unwrap_or_else(|err| {
                    panic!(
                        "failed to parse input provided to #[interface] on `{}`: {}",
                        field_name, err
                    )
                });

                let meta_list = match meta {
                    Meta::Path(_) => panic!("#[interface] on `{}` requires value", name),
                    Meta::List(list) => list.nested,
                    Meta::NameValue(_) => panic!("Expected #[interface(\"path/to/file.ts\")]"),
                };

                for meta in meta_list {
                    match meta {
                        NestedMeta::Meta(meta) => match meta {
                            Meta::Path(_) => {}
                            Meta::List(_) => {}
                            Meta::NameValue(meta) => {
                                if meta.path.get_ident().unwrap() == "path" {
                                    match meta.lit {
                                        Lit::Str(s) => {
                                            return (false, FieldType::Path(s.value()));
                                        }
                                        _ => {}
                                    }
                                    continue;
                                }
                            }
                        },
                        NestedMeta::Lit(_) => {}
                    }

                    panic!(
                        "Expected #[interface(path = \"path/to/file.ts\")] on `{}`",
                        name
                    )
                }
            }
        }
    }

    unimplemented!("Unknown type {:?}", ty)
}

fn parse_struct(s: DataStruct) -> Vec<InterfaceField> {
    match s.fields {
        Fields::Named(fields) => {
            let mut fs = vec![];
            for field in fields.named {
                let name = field.ident.unwrap().to_string();
                let (optional, ty) = parse_type(&name, &field.attrs, &field.ty);
                fs.push(InterfaceField { name, optional, ty });
            }

            fs
        }
        Fields::Unnamed(_) => panic!("#[derive(Interface)] does not support tuple struct"),
        Fields::Unit => return vec![],
    }
}

#[derive(Debug)]
struct InterfaceAttr {
    path: PathBuf,
}

impl InterfaceAttr {
    fn parse(attrs: &[Attribute]) -> Self {
        let mut base = InterfaceAttr {
            path: PathBuf::new(),
        };

        for attr in attrs {
            if let Some(name) = attr.path.get_ident() {
                if name == "interface" {
                    let meta = attr
                        .parse_meta()
                        .expect("failed to parse input provided to #[interface]");

                    let meta_list = match meta {
                        Meta::Path(_) => panic!("#[interface] requires value"),
                        Meta::List(list) => list.nested,
                        Meta::NameValue(_) => panic!("Expected #[interface(\"path/to/file.ts\")]"),
                    };

                    for meta in meta_list {
                        match meta {
                            NestedMeta::Meta(meta) => match meta {
                                Meta::Path(_) => {}
                                Meta::List(_) => {}
                                Meta::NameValue(meta) => {
                                    if meta.path.get_ident().unwrap() == "path" {
                                        match meta.lit {
                                            Lit::Str(s) => {
                                                base.path = s.value().into();
                                            }
                                            _ => {}
                                        }
                                        continue;
                                    }
                                }
                            },
                            NestedMeta::Lit(_) => {}
                        }

                        panic!("Expected #[interface(path = \"path/to/file.ts\")]")
                    }
                }
            }
        }

        base
    }
}

#[derive(Debug)]
struct InterfaceField {
    name: String,
    optional: bool,
    ty: FieldType,
}

#[derive(Debug)]
enum FieldType {
    Array(Box<FieldType>),
    Path(String),
    Primitive(&'static str),
}

#[derive(Debug)]
struct InterfaceFieldAttr {}

impl Display for FieldType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FieldType::Array(ty) => writeln!(f, "({})[]", ty),
            FieldType::Path(s) => write!(f, "import('./{}').default", s),
            FieldType::Primitive(s) => write!(f, "{}", s),
        }
    }
}
