#![deny(dead_code)]
#![feature(box_patterns)]
#![recursion_limit = "4096"]

extern crate inflector;
extern crate swc_common;
#[macro_use]
extern crate pmutil;
extern crate proc_macro;
extern crate proc_macro2;
extern crate quote;
extern crate swc_ecma_parser;
extern crate swc_macros_common;
extern crate syn;

use inflector::Inflector;
use pmutil::Quote;
use proc_macro2::Span;
use std::{collections::HashMap, fs::read_dir, path::Path, sync::Arc};
use swc_common::{
    comments::Comments,
    errors::{ColorConfig, Handler},
    FilePathMapping, SourceMap,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
use swc_macros_common::{call_site, print};
use syn::{punctuated::Punctuated, Token};

#[proc_macro]
pub fn builtin(_: proc_macro::TokenStream) -> proc_macro::TokenStream {
    swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
        let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

        let session = Session { handler: &handler };
        let mut deps = HashMap::<String, Vec<String>>::default();
        let mut contents = HashMap::<String, String>::default();

        let dir_str =
            ::std::env::var("CARGO_MANIFEST_DIR").expect("failed to read CARGO_MANIFEST_DIR");
        let dir = Path::new(&dir_str).join("lib");
        let mut tokens = q();

        let files = read_dir(&dir)
            .expect("failed to read $CARGO_MANIFEST_DIR/lib")
            .filter_map(|entry| {
                let entry = entry.expect("failed to read file of directory");
                let file_name = entry
                    .file_name()
                    .into_string()
                    .expect("OsString.into_string()");
                if !file_name.ends_with(".d.ts") {
                    return None;
                }

                Some((entry.path(), file_name))
            })
            .collect::<Vec<_>>();

        let mut names = vec![];

        for (path, file_name) in files.clone() {
            //            println!("Processing file: {}", file_name);
            let name = syn::Ident::new(&name_for(&file_name), Span::call_site());
            names.push(name.clone());

            let comments = Comments::default();

            let fm = cm.load_file(&path).expect("failed to load file");

            contents.insert(name.to_string(), (*fm.src).clone());

            let mut parser = Parser::new(
                session,
                Syntax::Typescript(Default::default()),
                SourceFileInput::from(&*fm),
                Some(&comments),
            );

            // We cannot use parse_module because of `eval`
            let _ = parser
                .parse_script()
                .map_err(|mut e| {
                    e.emit();
                    ()
                })
                .expect("failed to parse module");

            let (leading, trailing) = comments.take_all();

            let mut ds = vec![];
            for (_, comments) in leading.into_iter().chain(trailing) {
                for cmt in comments {
                    if !cmt.text.starts_with("/ <reference lib=")
                        && !cmt.text.starts_with("/<reference lib=")
                    {
                        continue;
                    }
                    let dep = cmt
                        .text
                        .replace("/ <reference lib=\"", "")
                        .replace(" />", "");
                    ds.push(name_for(&dep));
                }
            }
            //            println!("{}: {:?}", file_name, ds);
            deps.insert(name_for(&file_name), ds);

            //            println!("\tParsed",);

            //            let tts = if file_name.contains("generated") {
            //                q().quote_with(smart_quote!(Vars { s: &*fm.src },
            // { parse_namespace(s) }))            } else {
            //                quote_namespace_decl(&script.body)
            //            };

            //            tokens = tokens.quote_with(smart_quote!(Vars { name:
            // &name, tts }, {                lazy_static! {
            //                    static ref name: TsNamespaceDecl = { tts };
            //                }
            //            }))
        }
        let names = names.iter().cloned().collect::<Punctuated<_, Token![,]>>();
        tokens = tokens.quote_with(smart_quote!(Vars { names: &names }, {
            #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
            pub enum Lib {
                names,
            }
        }));

        tokens = tokens.quote_with(smart_quote!(
            Vars {
                expr: syn::ExprMatch {
                    attrs: vec![],
                    arms: files
                        .iter()
                        .map(|(_, f)| {
                            let name = syn::Ident::new(&name_for(&f), call_site());

                            q().quote_with(smart_quote!(
                                Vars {
                                    name: &name,
                                    s: &f.replace(".d.ts","")
                                },
                                {
                                    s => Ok(Lib::name)
                                }
                            ))
                            .parse()
                        })
                        .chain(std::iter::once(
                            q().quote_with(smart_quote!(
                                Vars {
                                },
                                {
                                    _ => Err(())
                                }
                            ))
                            .parse()
                        ))
                        .collect(),
                    brace_token: call_site(),
                    match_token: call_site(),
                    expr: q().quote_with(smart_quote!(Vars {}, { s })).parse(),
                }
            },
            {
                impl ::std::str::FromStr for Lib {
                    type Err = ();
                    fn from_str(s: &str) -> Result<Self, ()> {
                        expr
                    }
                }
            }
        ));
        let match_expr = syn::ExprMatch {
            attrs: vec![],
            match_token: call_site(),
            expr: q().quote_with(smart_quote!(Vars {}, { self })).parse(),
            brace_token: call_site(),
            arms: names
                .iter()
                .map(|name| {
                    let content = &*contents[&name.to_string()];
                    q!(Vars { name, content }, { Lib::name => content }).parse()
                })
                .collect(),
        };
        tokens = tokens.quote_with(smart_quote!(Vars { match_expr }, {
            impl Lib {
                fn content(self) -> &'static str {
                    match_expr
                }
            }
        }));

        tokens = tokens.quote_with(smart_quote!(
            Vars {
                deps_body: syn::ExprMatch {
                    attrs: vec![],
                    match_token: call_site(),
                    expr: q().quote_with(smart_quote!(Vars {}, { self })).parse(),
                    brace_token: call_site(),
                    arms: deps
                        .into_iter()
                        .map(|(name, deps)| {
                            //                            println!("{}: {:?}", name, deps);
                            let deps = deps
                                .into_iter()
                                .map(|v| {
                                    q().quote_with(smart_quote!(
                                        Vars {
                                            v: syn::Ident::new(&*v, call_site())
                                        },
                                        { Lib::v }
                                    ))
                                })
                                .collect::<Punctuated<_, Token![,]>>();
                            //
                            q().quote_with(smart_quote!(
                                Vars {
                                    name: syn::Ident::new(&name, call_site()),
                                    deps: &deps,
                                },
                                {
                                    Lib::name => vec![deps],
                                }
                            ))
                            .parse()
                        })
                        .collect()
                }
            },
            {
                impl Lib {
                    pub fn load(lib_str: &str) -> Vec<Self> {
                        let lib: Self = match lib_str.parse() {
                            Ok(lib) => lib,
                            Err(..) => return vec![],
                        };

                        lib.load_deps()
                    }

                    fn load_deps(self) -> Vec<Self> {
                        use std::collections::HashSet;
                        let mut libs = indexmap::IndexSet::<Self>::default();

                        for d in self.deps() {
                            libs.extend(d.load_deps());
                        }

                        libs.insert(self);

                        libs.into_iter().collect()
                    }

                    fn deps(self) -> Vec<Self> {
                        deps_body
                    }
                }
            }
        ));

        print("builtin", tokens)
    })
}

fn q() -> Quote {
    Quote::new_call_site()
}

fn name_for(s: &str) -> String {
    if s.starts_with("dom.generated") {
        return "Dom".into();
    }

    if s.ends_with(".d.ts") {
        s[..s.len() - 4].to_pascal_case()
    } else {
        s.to_pascal_case()
    }
}
