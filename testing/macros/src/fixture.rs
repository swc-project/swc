use anyhow::{Context, Error};
use glob::glob;
use pmutil::q;
use proc_macro2::{SourceFile, Span};
use relative_path::RelativePath;
use syn::{
    parse::{Parse, ParseStream},
    Ident, ItemFn, LitStr,
};

pub struct Config {
    pattern: String,
}

impl Parse for Config {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let pattern: LitStr = input.parse()?;
        let pattern = pattern.value();

        Ok(Self { pattern })
    }
}

pub fn expand(test_file: &SourceFile, callee: &Ident, attr: Config) -> Result<Vec<ItemFn>, Error> {
    let base_dir = test_file.path().parent().unwrap().to_path_buf();
    let resolved_path = RelativePath::new(&attr.pattern).to_path(&base_dir);
    let pattern = resolved_path.to_string_lossy();

    let paths =
        glob(&pattern).with_context(|| format!("glob failed for whole path: `{}`", pattern))?;
    let mut test_fns = vec![];

    for path in paths {
        let path = path.with_context(|| format!("glob failed for file"))?;
        let path = path.strip_prefix(&base_dir).with_context(|| {
            format!(
                "Failed to strip prefix `{}` from `{}`",
                base_dir.display(),
                path.display()
            )
        })?;
        let path_str = path.to_string_lossy();
        let ignored = path_str.starts_with(".") || path_str.contains("/.");
        let test_name = format!(
            "{}_{}",
            callee,
            path_str
                .replace("/", "__")
                .replace(".", "_")
                .replace("-", "_")
        )
        .replace("___", "__");
        let test_ident = Ident::new(&test_name, Span::call_site());

        let mut f = q!(
            Vars {
                test_ident,
                path_str,
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
