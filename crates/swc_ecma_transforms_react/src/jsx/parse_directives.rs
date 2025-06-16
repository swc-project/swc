use std::mem;

use bytes_str::BytesStr;
use memchr::memmem;
use swc_common::comments::Comments;

use crate::{AutomaticConfig, ClassicConfig, Runtime};

enum JSXRuntime {
    Automatic,
    Classic,
}

pub fn parse_directives<C>(mut runtime: Runtime, comments: Option<C>) -> Runtime
where
    C: Comments + Clone,
{
    let Some(comments) = comments else {
        return runtime;
    };

    let mut jsx_runtime;
    let mut import_source = (None, 0u32);
    let mut pragma = (None, 0u32);
    let mut pragma_frag = (None, 0u32);

    let common = match &runtime {
        Runtime::Automatic(config) => config.common,
        Runtime::Classic(config) => config.common,
        Runtime::Preserve => unreachable!(),
    };

    match &mut runtime {
        Runtime::Automatic(config) => {
            jsx_runtime = (JSXRuntime::Automatic, 0);
            import_source = (Some(mem::take(&mut config.import_source)), 0);
        }
        Runtime::Classic(ref mut config) => {
            jsx_runtime = (JSXRuntime::Classic, 0);
            pragma = (Some(mem::take(&mut config.pragma)), 0);
            pragma_frag = (Some(mem::take(&mut config.pragma_frag)), 0);
        }
        Runtime::Preserve => unreachable!(),
    };

    comments.for_each(&mut |comment| {
        let start = comment.span.lo.0;
        let bytes = comment.text.as_bytes();
        // jsxRuntime
        // jsxImportSource
        // jsxFrag
        // jsx
        let it = memmem::find_iter(bytes, b"@jsx");
        for offset in it {
            let pos = start + offset as u32;
            let Some(b) = bytes.get(offset + 4) else {
                continue;
            };

            match b {
                b'R' => {
                    if bytes.get((offset + 5)..(offset + 8)) == Some(b"untime") {
                        // @jsxRuntime
                        if pos < jsx_runtime.1 {
                            continue;
                        }

                        if let Some(value) = extract_value(bytes, offset + 8) {
                            match value {
                                "automatic" => jsx_runtime = (JSXRuntime::Automatic, pos),
                                "classic" => jsx_runtime = (JSXRuntime::Classic, pos),
                                _ => {}
                            }
                        }
                    }
                }
                b'I' => {
                    if bytes.get((offset + 5)..(offset + 12)) == Some(b"mportSource") {
                        // @jsxImportSource
                        if pos < import_source.1 {
                            continue;
                        }

                        if let Some(value) = extract_value(bytes, offset + 12) {
                            import_source = (Some(value.into()), pos);
                        }
                    }
                }
                b'F' => {
                    if bytes.get((offset + 5)..(offset + 8)) == Some(b"rag") {
                        // @jsxFrag
                        if pos < pragma_frag.1 {
                            continue;
                        }

                        if let Some(value) = extract_value(bytes, offset + 8) {
                            pragma_frag = (Some(BytesStr::from_str_slice(value)), pos);
                        }
                    }
                }
                b if is_ascii_whitespace_sameline(*b) => {
                    // @jsx
                    if pos < jsx_runtime.1 {
                        continue;
                    }

                    if let Some(value) = extract_value(bytes, offset + 4) {
                        pragma = (Some(BytesStr::from_str_slice(value)), pos);
                    }
                }
                _ => {}
            }
        }
    });

    match jsx_runtime.0 {
        JSXRuntime::Automatic => Runtime::Automatic(AutomaticConfig {
            import_source: import_source.0.unwrap_or_else(|| "react".into()),
            common,
        }),
        JSXRuntime::Classic => Runtime::Classic(ClassicConfig {
            pragma: pragma.0.unwrap_or_else(|| "React.createElement".into()),
            pragma_frag: pragma_frag.0.unwrap_or_else(|| "React.Fragment".into()),
            common,
        }),
    }
}

fn extract_value(bytes: &[u8], start_offset: usize) -> Option<&str> {
    // Skip whitespace after the pragma name
    let mut offset = start_offset;
    while let Some(&b) = bytes.get(offset) {
        if b.is_ascii_whitespace() {
            offset += 1;
        } else {
            break;
        }
    }

    // Find the start of the value
    let value_start = offset;

    // Find the end of the value (until whitespace, newline, or end of comment)
    while let Some(&b) = bytes.get(offset) {
        if is_ascii_whitespace_sameline(b) {
            break;
        }
        offset += 1;
    }

    let value_end = offset;

    if value_start < value_end {
        std::str::from_utf8(&bytes[value_start..value_end]).ok()
    } else {
        None
    }
}

fn is_ascii_whitespace_sameline(c: u8) -> bool {
    matches!(c, b'\t' | b'\x0C' | b' ')
}
