"""Temporary comparison against Node's default POSIX loading flags."""

from pathlib import Path
import sys

variant = sys.argv[1]
source = Path("target/diagnostic-input/binding.rs").read_text()
if variant == "lazy":
    old = "libloading::os::unix::RTLD_NOW"
    assert source.count(old) == 1
    source = source.replace(old, "libloading::os::unix::RTLD_LAZY")
else:
    assert variant == "current"
Path("bindings/binding_native_addon/src/lib.rs").write_text(source)
