#!/usr/bin/env python3
"""Verify the private foundation with Rust 1.73 without changing SWC's lockfile.

The main workspace has nightly flags and a Cargo v4 lockfile. This disposable
workspace uses the same sources and dependency versions, with v3 serialization.
No dependency versions are guessed or updated by the MSRV check.
"""

import os
from pathlib import Path
import shutil
import subprocess
import tempfile


repository = Path(__file__).resolve().parents[3]
members = [
    "crates/swc_native_addon",
    "tools/swc-native-addon-pack",
    "bindings/binding_native_addon",
]
with tempfile.TemporaryDirectory(prefix="swc-native-msrv-") as temporary:
    root = Path(temporary)
    for member in members:
        shutil.copytree(repository / member, root / member)
    manifest = '[workspace]\nresolver = "2"\nmembers = [\n'
    manifest += "".join(f'  "{member}",\n' for member in members) + "]\n"
    (root / "Cargo.toml").write_text(manifest)
    lock = (repository / "Cargo.lock").read_text()
    (root / "Cargo.lock").write_text(lock.replace("version = 4\n", "version = 3\n", 1))
    environment = os.environ.copy()
    environment["RUSTFLAGS"] = ""
    environment["RUSTDOCFLAGS"] = ""
    environment.pop("CARGO_ENCODED_RUSTFLAGS", None)
    environment["RUSTUP_TOOLCHAIN"] = "1.73.0"
    # This lockfile also contains unrelated workspace packages, which Cargo
    # prunes in the disposable copy. Dependency versions remain pinned.
    subprocess.run(["cargo", "test", "--workspace"], cwd=root, env=environment, check=True)
