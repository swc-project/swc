use std::path::Component;

use anyhow::{Context, Error};
use glob::glob;
use pmutil::q;
use proc_macro2::{SourceFile, Span};
use regex::Regex;
use relative_path::RelativePath;
use syn::{
    parse::{Parse, ParseStream},
    Ident, ItemFn, Lit, LitStr, Meta, NestedMeta, Token,
};

pub struct Config {
    pattern: String,
    exclude_patterns: Vec<Regex>,
}

impl Parse for Config {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        fn update(c: &mut Config, meta: Meta) {
            match &meta {
                Meta::List(list) => {
                    if list
                        .path
                        .get_ident()
                        .map(|i| i.to_string() == "exclude")
                        .unwrap_or(false)
                    {
                        //
                        macro_rules! fail {
                            () => {{
                                fail!("invalid input to the attribute")
                            }};
                            ($inner:expr) => {{
                                panic!(
                                    "{}\nnote: exclude() expectes one or more comma-separated \
             regular expressions, like exclude(\".*\\\\.d\\\\.ts\") or \
             exclude(\".*\\\\.d\\\\.ts\", \".*\\\\.tsx\")",
                                    $inner
                                )
                            }};
                        }

                        if list.nested.is_empty() {
                            fail!("empty exlclude()")
                        }

                        for token in list.nested.iter() {
                            match token {
                                NestedMeta::Meta(_) => fail!(),
                                NestedMeta::Lit(lit) => {
                                    let lit = match lit {
                                        Lit::Str(v) => v.value(),
                                        _ => fail!(),
                                    };
                                    c.exclude_patterns.push(Regex::new(&lit).unwrap_or_else(
                                        |err| {
                                            fail!(format!(
                                                "failed to parse regex: {}\n{}",
                                                lit, err
                                            ))
                                        },
                                    ));
                                }
                            }
                        }

                        return;
                    }
                }
                _ => {}
            }

            let expected = r#"#[fixture("fixture/**/*.ts", exclude("*\.d\.ts"))]"#;

            unimplemented!(
                "Exected something like {}\nGot wrong meta tag: {:?}",
                expected,
                meta,
            )
        }

        let pattern: LitStr = input.parse()?;
        let pattern = pattern.value();

        let mut config = Self {
            pattern,
            exclude_patterns: vec![],
        };

        let comma: Option<Token![,]> = input.parse()?;
        if comma.is_some() {
            let meta: Meta = input.parse()?;
            update(&mut config, meta);
        }

        Ok(config)
    }
}

pub fn expand(test_file: &SourceFile, callee: &Ident, attr: Config) -> Result<Vec<ItemFn>, Error> {
    let base_dir = test_file.path().parent().unwrap().to_path_buf();
    let resolved_path = RelativePath::new(&attr.pattern).to_path(&base_dir);
    let pattern = resolved_path.to_string_lossy();

    let paths =
        glob(&pattern).with_context(|| format!("glob failed for whole path: `{}`", pattern))?;
    let mut test_fns = vec![];

    'add: for path in paths {
        let path = path.with_context(|| format!("glob failed for file"))?;
        let abs_path = path
            .canonicalize()
            .with_context(|| format!("failed to canonicalize {}", path.display()))?;

        let path_for_name = path.strip_prefix(&base_dir).with_context(|| {
            format!(
                "Failed to strip prefix `{}` from `{}`",
                base_dir.display(),
                path.display()
            )
        })?;
        let path_str = path.to_string_lossy();
        // Skip excluded files
        for pattern in &attr.exclude_patterns {
            if pattern.is_match(&path_str) {
                continue 'add;
            }
        }

        let ignored = path.components().any(|c| match c {
            Component::Normal(s) => s.to_string_lossy().starts_with("."),
            _ => false,
        });
        let test_name = format!(
            "{}_{}",
            callee,
            path_for_name
                .to_string_lossy()
                .replace("\\", "__")
                .replace("/", "__")
                .replace(".", "_")
                .replace("-", "_")
        )
        .replace("___", "__");
        let test_ident = Ident::new(&test_name, Span::call_site());

        let mut f = q!(
            Vars {
                test_ident,
                path_str: &abs_path.to_string_lossy(),
                callee
            },
            {
                #[test]
                #[ignore]
                fn test_ident() {
                    callee(::std::path::PathBuf::from(path_str));
                }
            }
        )
        .parse::<ItemFn>();

        if !ignored {
            f.attrs.retain(|attr| {
                match attr.path.get_ident() {
                    Some(name) => {
                        if name == "ignore" {
                            return false;
                        }
                    }
                    None => {}
                }

                true
            });
            //
        }

        test_fns.push(f);
    }

    Ok(test_fns)
}
