use std::{
    env,
    path::{Component, PathBuf},
};

use anyhow::{Context, Error};
use glob::glob;
use pmutil::q;
use proc_macro2::Span;
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
            if let Meta::List(list) = &meta {
                if list
                    .path
                    .get_ident()
                    .map(|i| *i == "exclude")
                    .unwrap_or(false)
                {
                    //
                    macro_rules! fail {
                        () => {{
                            fail!("invalid input to the attribute")
                        }};
                        ($inner:expr) => {{
                            panic!(
                                "{}\nnote: exclude() expects one or more comma-separated regular \
                                 expressions, like exclude(\".*\\\\.d\\\\.ts\") or \
                                 exclude(\".*\\\\.d\\\\.ts\", \".*\\\\.tsx\")",
                                $inner
                            )
                        }};
                    }

                    if list.nested.is_empty() {
                        fail!("empty exclude()")
                    }

                    for token in list.nested.iter() {
                        match token {
                            NestedMeta::Meta(_) => fail!(),
                            NestedMeta::Lit(lit) => {
                                let lit = match lit {
                                    Lit::Str(v) => v.value(),
                                    _ => fail!(),
                                };
                                c.exclude_patterns
                                    .push(Regex::new(&lit).unwrap_or_else(|err| {
                                        fail!(format!("failed to parse regex: {}\n{}", lit, err))
                                    }));
                            }
                        }
                    }

                    return;
                }
            }

            let expected = r#"#[fixture("fixture/**/*.ts", exclude("*\.d\.ts"))]"#;

            unimplemented!(
                "Expected something like {}\nGot wrong meta tag: {:?}",
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

pub fn expand(callee: &Ident, attr: Config) -> Result<Vec<ItemFn>, Error> {
    let base_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").expect(
        "#[fixture] requires CARGO_MANIFEST_DIR because it's relative to cargo manifest directory",
    ));
    let resolved_path = RelativePath::new(&attr.pattern).to_path(&base_dir);
    let pattern = resolved_path.to_string_lossy();

    let paths =
        glob(&pattern).with_context(|| format!("glob failed for whole path: `{}`", pattern))?;
    let mut test_fns = vec![];

    'add: for path in paths {
        let path = path.with_context(|| "glob failed for file".to_string())?;
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

            if cfg!(target_os = "windows") && pattern.is_match(&path_str.replace('\\', "/")) {
                continue 'add;
            }
        }

        let ignored = path.components().any(|c| match c {
            Component::Normal(s) => s.to_string_lossy().starts_with('.'),
            _ => false,
        });
        let test_name = format!(
            "{}_{}",
            callee,
            path_for_name
                .to_string_lossy()
                .replace('\\', "__")
                .replace(' ', "_")
                .replace('[', "_")
                .replace(']', "_")
                .replace('/', "__")
                .replace('.', "_")
                .replace('-', "_")
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
                #[inline(never)]
                #[ignore]
                #[doc(hidden)]
                fn test_ident() {
                    eprintln!("Input: {}", path_str);

                    callee(::std::path::PathBuf::from(path_str));
                }
            }
        )
        .parse::<ItemFn>();

        if !ignored {
            f.attrs.retain(|attr| {
                if let Some(name) = attr.path.get_ident() {
                    if name == "ignore" {
                        return false;
                    }
                }

                true
            });
            //
        }

        test_fns.push(f);
    }

    if test_fns.is_empty() {
        panic!("No test found")
    }

    Ok(test_fns)
}
