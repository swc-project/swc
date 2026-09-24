"""Temporary comparison; each variant starts from unchanged production code."""

from pathlib import Path
import sys

variant = sys.argv[1]
source = Path("target/diagnostic-input/integrity.rs").read_text()
format_source = Path("target/diagnostic-input/format.rs").read_text()
cache_source = Path("target/diagnostic-input/cache.rs").read_text()
if variant == "two-workers":
    assert source.count(".get().min(4)") == 1
    source = source.replace(".get().min(4)", ".get().min(2)")
elif variant == "serial":
    old = "return _raw_len.min(32 * 1024 * 1024) as usize;"
    assert source.count(old) == 1
    # 64 KiB reads remain below the parallel dispatch threshold. Every byte
    # still passes through the existing BLAKE3 verifier and length checks.
    source = source.replace(old, "return 64 * 1024;")
elif variant == "worker-stream":
    source = source.replace("fn verification_pool()", "pub(crate) fn verification_pool()")
    old = "return _raw_len.min(32 * 1024 * 1024) as usize;"
    assert source.count(old) == 1
    source = source.replace(old, """let bound = verification_pool()
                .and_then(|pool| pool.current_thread_index())
                .map_or(32 * 1024 * 1024, |_| 1024 * 1024);
            return _raw_len.min(bound) as usize;""")
    format_source += """
impl Payload<'_> {
    pub(crate) fn verify_runtime_file(&self, file: &mut std::fs::File) -> Result<()> {
        #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
        if self.integrity.is_some() {
            if let Some(pool) = crate::integrity::verification_pool() {
                return pool.install(|| self.verify_image(file));
            }
        }
        self.verify_image(file)
    }
}
"""
    assert cache_source.count("payload.verify_image(") == 2
    cache_source = cache_source.replace("payload.verify_image(", "payload.verify_runtime_file(")
else:
    assert variant == "current"
Path("crates/swc_native_addon/src/integrity.rs").write_text(source)
Path("crates/swc_native_addon/src/format.rs").write_text(format_source)
Path("crates/swc_native_addon/src/cache.rs").write_text(cache_source)
