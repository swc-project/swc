use std::fs;
use std::path::PathBuf;
use std::process;

use argh::FromArgs;
use swc_sourcemap::{DecodedMap, SourceView, Token};

/// Utility for working with source maps.
#[derive(FromArgs, Debug)]
pub struct Cli {
    /// the source map to process
    #[argh(option, short = 's')]
    sourcemap: Option<PathBuf>,
    /// the minified input file
    #[argh(option, short = 'm')]
    minified_file: Option<PathBuf>,
    /// the 0 indexed line number
    #[argh(option, short = 'L')]
    line0: Option<u32>,
    /// the 1 indexed line number
    #[argh(option, short = 'l')]
    line: Option<u32>,
    /// the 0 indexed column number
    #[argh(option, short = 'C')]
    column0: Option<u32>,
    /// the 1 indexed column number
    #[argh(option, short = 'c')]
    column: Option<u32>,
    /// the function name that should be mapped
    #[argh(option, short = 'f')]
    function: Option<String>,
    /// dumps all tokens
    #[argh(switch)]
    dump: bool,
}

impl Cli {
    /// Retrurns the zero indexed line
    fn lookup_pos(&self) -> Option<(u32, u32)> {
        Some((
            self.line0.unwrap_or_else(|| self.line.map_or(0, |x| x - 1)),
            self.column0.or_else(|| self.column.map(|x| x - 1))?,
        ))
    }
}

fn bail(msg: &str) -> ! {
    eprintln!("error: {}", msg);
    process::exit(1);
}

fn print_token(
    sm: &DecodedMap,
    token: &Token<'_>,
    line: u32,
    column: u32,
    func: Option<&str>,
    sv: Option<&SourceView>,
) {
    if let Some(name) = token.get_name() {
        println!("  name: {:?}", name);
    } else {
        println!("  name: not found");
    }
    if let Some(source) = token.get_source() {
        println!("  source file: {:?}", source);
    } else {
        println!("  source file: not found");
    }
    println!("  source line: {}", token.get_src_line());
    println!("  source column: {}", token.get_src_col());
    println!("  minified line: {}", token.get_dst_line());
    println!("  minified column: {}", token.get_dst_col());
    if let Some(name) = sm.get_original_function_name(line, column, func, sv) {
        println!("  original function: {:?}", name);
    } else {
        println!("  original function: not found");
    }
    if let Some(line) = token
        .get_source_view()
        .and_then(|sv| sv.get_line(token.get_src_line()))
    {
        println!("  source line:");
        println!("    {}", line.trim());
    } else if token.get_source_view().is_none() {
        println!("  cannot find source");
    } else {
        println!("  cannot find source line");
    }
}

fn main() {
    if let Err(err) = execute() {
        eprintln!("error: {}", err);
    }
}

fn execute() -> Result<(), Box<dyn std::error::Error>> {
    let args: Cli = argh::from_env();

    let sv = if let Some(ref path) = args.minified_file {
        Some(SourceView::from_string(fs::read_to_string(&path)?))
    } else {
        None
    };

    let (sm, sourcemap_path) = match (&args.sourcemap, &sv) {
        (&Some(ref path), _) => (None, Some(path.to_path_buf())),
        (&None, &Some(ref sv)) => {
            if let Some(smref) = sv.sourcemap_reference()? {
                if let Some(sm) = smref.get_embedded_sourcemap()? {
                    (Some(sm), None)
                } else {
                    (
                        None,
                        smref.resolve_path(args.minified_file.as_ref().unwrap()),
                    )
                }
            } else {
                bail("missing sourcemap reference");
            }
        }
        _ => bail("sourcemap not provided"),
    };

    let sm = if let Some(sm) = sm {
        sm
    } else {
        sourcemap::decode_slice(&fs::read(&sourcemap_path.as_ref().unwrap())?)?
    };

    let ty = match sm {
        DecodedMap::Regular(..) => "regular",
        DecodedMap::Index(..) => "indexed",
        DecodedMap::Hermes(..) => "hermes",
    };
    if let Some(ref path) = sourcemap_path {
        println!("source map path: {:?}", path);
    } else {
        println!("embedded source map");
    }
    println!("source map type: {}", ty);

    // perform a lookup
    if let Some((line, column)) = args.lookup_pos() {
        println!("lookup line: {}, column: {}:", line, column);
        if let Some(token) = sm.lookup_token(line, column) {
            print_token(
                &sm,
                &token,
                line,
                column,
                args.function.as_deref(),
                sv.as_ref(),
            );
        } else {
            println!("  - no match");
        }
    }

    // dump all tokens
    if args.dump {
        println!("tokens:");
        let converted_map;
        let token_iter = match sm {
            DecodedMap::Regular(ref sm) => sm.tokens(),
            DecodedMap::Index(ref sm) => {
                converted_map = sm.flatten()?;
                converted_map.tokens()
            }
            DecodedMap::Hermes(ref sm) => sm.tokens(),
        };
        for token in token_iter {
            println!(
                "  {}:{} -> {}:{}:{}{}",
                token.get_dst_line(),
                token.get_dst_col(),
                token.get_source().unwrap_or(""),
                token.get_src_line(),
                token.get_src_col(),
                if let Some(name) = token.get_name() {
                    format!(" [{}]", name)
                } else {
                    "".to_string()
                },
            );
        }
    }

    Ok(())
}
