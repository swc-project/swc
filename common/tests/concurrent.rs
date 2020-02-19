use rayon::prelude::*;
use std::{env, path::PathBuf, sync::Arc};
use swc_common::{FilePathMapping, SourceFile, SourceMap};

fn init() {
    let _ = rayon::ThreadPoolBuilder::new()
        .num_threads(100)
        .build_global();
}

#[test]
fn no_overlap() {
    init();

    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    let files: Vec<Arc<SourceFile>> = (0..100000)
        .into_par_iter()
        .map(|_| {
            let fm = cm
                .load_file(
                    &PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
                        .join("tests")
                        .join("concurrent.js"),
                )
                .unwrap();

            fm
        })
        .collect::<Vec<_>>();

    // This actually tests if there is overlap

    let start = files.clone().sort_by_key(|f| f.start_pos);
    let end = files.clone().sort_by_key(|f| f.end_pos);

    assert_eq!(start, end);
}
