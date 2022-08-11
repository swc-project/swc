// this is random codes to ensure imports to the swc_core works. Depends on the
// regressions, we'll add more codes.

use std::sync::Arc;

use swc_core::{
    base::{try_with_handler, Compiler},
    common::{sync::Lazy, FileName, FilePathMapping, SourceMap},
};

static COMPILER: Lazy<Arc<Compiler>> = Lazy::new(|| {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    Arc::new(Compiler::new(cm))
});

pub fn compute(s: String) {
    let c = COMPILER.clone();

    let _ = try_with_handler(c.cm.clone(), Default::default(), |handler| {
        c.run(|| {
            let fm = c.cm.new_source_file(FileName::Anon, s);
            c.process_js_file(fm, handler, &Default::default())
        })
    });
}
