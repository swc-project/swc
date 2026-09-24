"""Temporary comparison; each variant starts from unchanged production code."""

from pathlib import Path
import sys

variant = sys.argv[1]
source = Path("target/diagnostic-input/integrity.rs").read_text()
if variant == "two-workers":
    assert source.count(".get().min(4)") == 1
    source = source.replace(".get().min(4)", ".get().min(2)")
elif variant == "serial":
    old = "return _raw_len.min(32 * 1024 * 1024) as usize;"
    assert source.count(old) == 1
    # 64 KiB reads remain below the parallel dispatch threshold. Every byte
    # still passes through the existing BLAKE3 verifier and length checks.
    source = source.replace(old, "return 64 * 1024;")
else:
    assert variant == "current"
Path("crates/swc_native_addon/src/integrity.rs").write_text(source)
