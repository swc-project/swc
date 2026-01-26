mod import_rewriter_swc;
mod import_rewriter_typescript;

pub use import_rewriter_swc::swc_import_rewriter as import_rewriter;
pub use import_rewriter_typescript::typescript_import_rewriter;
