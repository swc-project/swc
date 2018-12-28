use super::*;
use swc_common::FilePathMapping;

fn tr() -> impl Fold<Module> {
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    jsx(
        cm,
        Options {
            pragma: "React.createElement".into(),
            pragma_frag: "React.Fragment".into(),
            throw_if_namespace: false,
            development: true,
            use_builtins: true,
        },
    )
}
