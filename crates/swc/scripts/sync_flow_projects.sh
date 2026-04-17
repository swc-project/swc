#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CRATE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR="$CRATE_DIR/tests/flow-projects"

python3 - "$TARGET_DIR" "$@" <<'PY'
import datetime as dt
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
from typing import Optional


TARGET_DIR = pathlib.Path(sys.argv[1])
SELECTED = sys.argv[2:] or ["react-native", "react-native-web"]

PROJECTS = {
    "react-native": {
        "repo": "facebook/react-native",
        "branch": "main",
        "flowconfig": ".flowconfig",
        "parser": {
            "jsx": True,
            "require_directive": False,
            "enums": True,
            "decorators": False,
            "components": True,
            "pattern_matching": True,
        },
    },
    "react-native-web": {
        "repo": "necolas/react-native-web",
        "branch": "master",
        "flowconfig": "configs/.flowconfig",
        "parser": {
            "jsx": True,
            "require_directive": False,
            "enums": False,
            "decorators": False,
            "components": False,
            "pattern_matching": False,
        },
    },
}


def run(*args: str, cwd: Optional[pathlib.Path] = None) -> str:
    result = subprocess.run(
        list(args),
        cwd=str(cwd) if cwd else None,
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return result.stdout


def git_show(repo_dir: pathlib.Path, path: str) -> str:
    return run("git", "show", f"HEAD:{path}", cwd=repo_dir)


def git_ls_tree(repo_dir: pathlib.Path) -> list[str]:
    output = run("git", "ls-tree", "-r", "--name-only", "HEAD", cwd=repo_dir)
    return [line for line in output.splitlines() if line]


def materialize_paths(repo_dir: pathlib.Path, paths: list[str]) -> None:
    if not paths:
        return

    subprocess.run(
        ["git", "sparse-checkout", "set", "--no-cone", "--stdin"],
        cwd=repo_dir,
        check=True,
        input="".join(f"{path}\n" for path in paths),
        text=True,
    )


def flowconfig_section_lines(flowconfig: str, wanted_section: str) -> list[str]:
    section = None
    lines = []

    for raw_line in flowconfig.splitlines():
        line = raw_line.strip()
        if not line or line.startswith(";"):
            continue
        if line.startswith("[") and line.endswith("]"):
            section = line[1:-1]
            continue
        if section != wanted_section:
            continue

        lines.append(line)

    return lines


def parse_flowconfig_regex_section(flowconfig: str, wanted_section: str) -> list[re.Pattern[str]]:
    patterns = []

    for line in flowconfig_section_lines(flowconfig, wanted_section):
        if line.startswith("<PROJECT_ROOT>/"):
            line = "^" + line[len("<PROJECT_ROOT>/"):]

        patterns.append(re.compile(line))

    return patterns


def parse_flowconfig_lib_paths(flowconfig: str) -> list[str]:
    prefixes = []

    for line in flowconfig_section_lines(flowconfig, "libs"):
        if line.startswith("<PROJECT_ROOT>/"):
            line = line[len("<PROJECT_ROOT>/"):]
        prefixes.append(line)

    return prefixes


def is_lib_path(path: str, lib_paths: list[str]) -> bool:
    for lib_path in lib_paths:
        if lib_path.endswith("/"):
            if path.startswith(lib_path):
                return True
            continue

        if path == lib_path:
            return True

    return False


def should_copy(
    path: str,
    ignore_patterns: list[re.Pattern[str]],
    declaration_patterns: list[re.Pattern[str]],
    lib_paths: list[str],
) -> bool:
    if not (path.endswith(".js") or path.endswith(".jsx")):
        return False

    if is_lib_path(path, lib_paths):
        return False

    for pattern in ignore_patterns:
        if pattern.search(path):
            return False

    for pattern in declaration_patterns:
        if pattern.search(path):
            return False

    return True


def sync_project(name: str, config: dict[str, object], workspace: pathlib.Path) -> None:
    repo = config["repo"]
    branch = config["branch"]
    repo_dir = workspace / name

    print(f"[flow-projects] cloning {repo}#{branch}", flush=True)
    subprocess.run(
        [
            "gh",
            "repo",
            "clone",
            repo,
            str(repo_dir),
            "--",
            "--depth",
            "1",
            "--branch",
            branch,
            "--filter=blob:none",
            "--sparse",
        ],
        check=True,
    )

    flowconfig_path = config["flowconfig"]
    flowconfig = git_show(repo_dir, flowconfig_path)
    ignore_patterns = parse_flowconfig_regex_section(flowconfig, "ignore")
    declaration_patterns = parse_flowconfig_regex_section(flowconfig, "declarations")
    lib_paths = parse_flowconfig_lib_paths(flowconfig)

    files = sorted(
        path
        for path in git_ls_tree(repo_dir)
        if should_copy(path, ignore_patterns, declaration_patterns, lib_paths)
    )
    commit = run("git", "rev-parse", "HEAD", cwd=repo_dir).strip()

    target_root = TARGET_DIR / name
    corpus_root = target_root / "corpus"

    if target_root.exists():
        shutil.rmtree(target_root)
    corpus_root.mkdir(parents=True)

    (target_root / "source.flowconfig").write_text(flowconfig, encoding="utf-8")

    materialize_paths(repo_dir, files)

    total_bytes = 0
    for rel in files:
        content = (repo_dir / rel).read_bytes()
        total_bytes += len(content)
        dst = corpus_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_bytes(content)

    (target_root / "manifest.txt").write_text("\n".join(files) + "\n", encoding="utf-8")

    metadata = {
        "name": name,
        "corpus": "corpus",
        "manifest": "manifest.txt",
        "flowconfig": "source.flowconfig",
        "source": {
            "repo": repo,
            "branch": branch,
            "commit": commit,
            "flowconfig_path": flowconfig_path,
        },
        "parser": config["parser"],
        "generated_at_utc": dt.datetime.now(tz=dt.timezone.utc).isoformat(),
        "counts": {
            "files": len(files),
            "bytes": total_bytes,
        },
    }

    (target_root / "metadata.json").write_text(
        json.dumps(metadata, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    print(
        f"[flow-projects] synced {name}: {len(files)} files, {total_bytes} bytes from {commit}",
        flush=True,
    )


unknown = sorted(set(SELECTED) - set(PROJECTS))
if unknown:
    raise SystemExit(f"unknown flow project(s): {', '.join(unknown)}")

TARGET_DIR.mkdir(parents=True, exist_ok=True)

with tempfile.TemporaryDirectory(prefix="swc-flow-projects-") as tmp:
    workspace = pathlib.Path(tmp)
    for project_name in SELECTED:
        sync_project(project_name, PROJECTS[project_name], workspace)
PY
