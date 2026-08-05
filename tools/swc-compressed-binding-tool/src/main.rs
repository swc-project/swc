use std::{
    env,
    ffi::OsStr,
    fs,
    path::{Component, Path, PathBuf},
    process::Command,
};

use anyhow::{bail, Context, Result};
use swc_compressed_binding_tool::{pack_pressed_data, pressed_data_sha512_hex};

fn main() -> Result<()> {
    let mut args = env::args().skip(1);
    let command = args.next().context("expected subcommand: pack or build")?;

    match command.as_str() {
        "pack" => run_pack(parse_pack(args.collect())?),
        "build" => run_build(parse_build(args.collect())?),
        _ => bail!("unknown subcommand `{command}`; expected pack or build"),
    }
}

#[derive(Debug)]
struct PackOptions {
    input: PathBuf,
    output: PathBuf,
    level: i32,
}

#[derive(Debug)]
struct BuildOptions {
    package_dir: PathBuf,
    manifest_path: PathBuf,
    raw_crate: String,
    js: Option<PathBuf>,
    dts: Option<PathBuf>,
    no_js: bool,
    release: bool,
    napi_args: Vec<String>,
}

fn parse_pack(args: Vec<String>) -> Result<PackOptions> {
    let mut input = None;
    let mut output = None;
    let mut level = 19;
    let mut iter = args.into_iter();

    while let Some(arg) = iter.next() {
        if let Some(value) = arg.strip_prefix("--input=") {
            input = Some(PathBuf::from(value));
        } else if arg == "--input" {
            input = Some(PathBuf::from(take_value(&mut iter, "--input")?));
        } else if let Some(value) = arg.strip_prefix("--output=") {
            output = Some(PathBuf::from(value));
        } else if arg == "--output" {
            output = Some(PathBuf::from(take_value(&mut iter, "--output")?));
        } else if let Some(value) = arg.strip_prefix("--level=") {
            level = value.parse().context("--level must be an integer")?;
        } else if arg == "--level" {
            level = take_value(&mut iter, "--level")?
                .parse()
                .context("--level must be an integer")?;
        } else {
            bail!("unknown pack option `{arg}`");
        }
    }

    Ok(PackOptions {
        input: input.context("missing --input")?,
        output: output.context("missing --output")?,
        level,
    })
}

fn parse_build(args: Vec<String>) -> Result<BuildOptions> {
    let mut package_dir = PathBuf::from(".");
    let mut manifest_path = None;
    let mut raw_crate = None;
    let mut js = None;
    let mut dts = None;
    let mut no_js = false;
    let mut release = false;
    let mut napi_args = Vec::new();
    let mut iter = args.into_iter();

    while let Some(arg) = iter.next() {
        if arg == "--" {
            napi_args.extend(iter);
            break;
        } else if let Some(value) = arg.strip_prefix("--package-dir=") {
            package_dir = PathBuf::from(value);
        } else if arg == "--package-dir" {
            package_dir = PathBuf::from(take_value(&mut iter, "--package-dir")?);
        } else if let Some(value) = arg.strip_prefix("--manifest-path=") {
            manifest_path = Some(PathBuf::from(value));
        } else if arg == "--manifest-path" {
            manifest_path = Some(PathBuf::from(take_value(&mut iter, "--manifest-path")?));
        } else if let Some(value) = arg.strip_prefix("--raw-crate=") {
            raw_crate = Some(value.to_string());
        } else if arg == "--raw-crate" {
            raw_crate = Some(take_value(&mut iter, "--raw-crate")?);
        } else if let Some(value) = arg.strip_prefix("--js=") {
            js = Some(PathBuf::from(value));
        } else if arg == "--js" {
            js = Some(PathBuf::from(take_value(&mut iter, "--js")?));
        } else if let Some(value) = arg.strip_prefix("--dts=") {
            dts = Some(PathBuf::from(value));
        } else if arg == "--dts" {
            dts = Some(PathBuf::from(take_value(&mut iter, "--dts")?));
        } else if arg == "--no-js" {
            no_js = true;
        } else if arg == "--release" {
            release = true;
        } else {
            napi_args.push(arg);
        }
    }

    Ok(BuildOptions {
        package_dir,
        manifest_path: manifest_path.context("missing --manifest-path")?,
        raw_crate: raw_crate.context("missing --raw-crate")?,
        js,
        dts,
        no_js,
        release,
        napi_args,
    })
}

fn take_value(iter: &mut impl Iterator<Item = String>, flag: &str) -> Result<String> {
    iter.next()
        .with_context(|| format!("expected a value after {flag}"))
}

fn run_pack(options: PackOptions) -> Result<()> {
    let raw = fs::read(&options.input)
        .with_context(|| format!("failed to read native addon {}", options.input.display()))?;
    let pressed = pack_pressed_data(&raw, options.level)?;
    if let Some(parent) = options.output.parent() {
        fs::create_dir_all(parent).with_context(|| {
            format!(
                "failed to create pressed-data output directory {}",
                parent.display()
            )
        })?;
    }
    fs::write(&options.output, &pressed).with_context(|| {
        format!(
            "failed to write pressed-data output {}",
            options.output.display()
        )
    })?;
    eprintln!(
        "packed {} -> {} (payload sha512 {})",
        options.input.display(),
        options.output.display(),
        pressed_data_sha512_hex(&pressed)?
    );
    Ok(())
}

fn run_build(options: BuildOptions) -> Result<()> {
    let cwd = env::current_dir().context("failed to read current directory")?;
    let package_dir = resolve_path(&cwd, &options.package_dir)
        .canonicalize()
        .with_context(|| {
            format!(
                "failed to canonicalize package dir {}",
                options.package_dir.display()
            )
        })?;
    let manifest_path = resolve_path(&package_dir, &options.manifest_path)
        .canonicalize()
        .with_context(|| {
            format!(
                "failed to canonicalize workspace manifest {}",
                options.manifest_path.display()
            )
        })?;
    let workspace_root = manifest_path
        .parent()
        .context("workspace manifest has no parent directory")?;
    let stage_dir = workspace_root
        .join("target")
        .join("swc-compressed-bindings")
        .join(package_stage_name(&package_dir))
        .join(if options.release { "release" } else { "debug" })
        .join(sanitize_label(&target_label(&options.napi_args)));
    let raw_dir = stage_dir.join("raw");
    let pressed_data_path = stage_dir.join("pressed-data.bin");

    if raw_dir.exists() {
        fs::remove_dir_all(&raw_dir).with_context(|| {
            format!(
                "failed to clear raw addon staging dir {}",
                raw_dir.display()
            )
        })?;
    }
    fs::create_dir_all(&raw_dir).with_context(|| {
        format!(
            "failed to create raw addon staging dir {}",
            raw_dir.display()
        )
    })?;
    prepare_raw_output_subdirs(&options, &raw_dir)?;

    run_raw_build(&options, &package_dir, &manifest_path, &raw_dir)?;
    copy_generated_binding_outputs(&options, &raw_dir, &package_dir)?;

    let raw_addon = find_single_node_addon(&raw_dir)?;
    let raw = fs::read(&raw_addon)
        .with_context(|| format!("failed to read staged raw addon {}", raw_addon.display()))?;
    let pressed = pack_pressed_data(&raw, 19)?;
    fs::create_dir_all(&stage_dir).with_context(|| {
        format!(
            "failed to create pressed-data staging dir {}",
            stage_dir.display()
        )
    })?;
    fs::write(&pressed_data_path, &pressed).with_context(|| {
        format!(
            "failed to write pressed-data payload {}",
            pressed_data_path.display()
        )
    })?;

    eprintln!(
        "packed raw addon {} ({} bytes) into {} ({} bytes, payload sha512 {})",
        raw_addon.display(),
        raw.len(),
        pressed_data_path.display(),
        pressed.len(),
        pressed_data_sha512_hex(&pressed)?
    );

    run_loader_build(&options, &package_dir, &manifest_path, &pressed_data_path)?;

    Ok(())
}

fn run_raw_build(
    options: &BuildOptions,
    package_dir: &Path,
    manifest_path: &Path,
    raw_dir: &Path,
) -> Result<()> {
    let mut command = pnpm_command();
    command
        .current_dir(package_dir)
        .arg("exec")
        .arg("napi")
        .arg("build")
        .arg("--manifest-path")
        .arg(manifest_path)
        .arg("--platform")
        .arg("-p")
        .arg(&options.raw_crate);

    if options.no_js {
        command.arg("--no-js");
    } else if let Some(js) = &options.js {
        command.arg("--js").arg(js);
    }

    if let Some(dts) = &options.dts {
        command.arg("--dts").arg(dts);
    }

    if options.release {
        command.arg("--release");
    }

    command.arg("--output-dir").arg(raw_dir);
    command.args(&options.napi_args);
    run_command(command)
}

fn prepare_raw_output_subdirs(options: &BuildOptions, raw_dir: &Path) -> Result<()> {
    for path in options.js.iter().chain(options.dts.iter()) {
        if path.is_absolute() {
            continue;
        }
        if let Some(parent) = raw_dir.join(path).parent() {
            fs::create_dir_all(parent).with_context(|| {
                format!(
                    "failed to create staged binding output directory {}",
                    parent.display()
                )
            })?;
        }
    }
    Ok(())
}

fn copy_generated_binding_outputs(
    options: &BuildOptions,
    raw_dir: &Path,
    package_dir: &Path,
) -> Result<()> {
    for path in options.js.iter().chain(options.dts.iter()) {
        if path.is_absolute() {
            continue;
        }

        let source = raw_dir.join(path);
        if !source.exists() {
            continue;
        }

        copy_file(&source, &package_dir.join(path))?;

        let normalized_path = strip_leading_current_dir(path);
        if let Ok(package_relative_path) = normalized_path.strip_prefix("src") {
            if !package_relative_path.as_os_str().is_empty() {
                copy_file(&source, &package_dir.join(package_relative_path))?;
            }
        }
    }

    Ok(())
}

fn strip_leading_current_dir(path: &Path) -> PathBuf {
    path.components()
        .filter(|component| !matches!(component, Component::CurDir))
        .collect()
}

fn copy_file(source: &Path, destination: &Path) -> Result<()> {
    if let Some(parent) = destination.parent() {
        fs::create_dir_all(parent).with_context(|| {
            format!(
                "failed to create binding output directory {}",
                parent.display()
            )
        })?;
    }
    fs::copy(source, destination).with_context(|| {
        format!(
            "failed to copy generated binding {} to {}",
            source.display(),
            destination.display()
        )
    })?;
    Ok(())
}

fn run_loader_build(
    options: &BuildOptions,
    package_dir: &Path,
    manifest_path: &Path,
    pressed_data_path: &Path,
) -> Result<()> {
    let mut command = pnpm_command();
    command
        .current_dir(package_dir)
        .env("SWC_COMPRESSED_BINDING_PAYLOAD", pressed_data_path)
        .arg("exec")
        .arg("napi")
        .arg("build")
        .arg("--manifest-path")
        .arg(manifest_path)
        .arg("--platform")
        .arg("-p")
        .arg("binding_compressed_node_loader")
        .arg("--no-js");

    if options.release {
        command.arg("--release");
    }

    command.arg("--output-dir").arg(package_dir);
    command.args(loader_napi_args(&options.napi_args));
    run_command(command)
}

fn run_command(mut command: Command) -> Result<()> {
    let display = format!("{command:?}");
    eprintln!("running {display}");
    let status = command
        .status()
        .with_context(|| format!("failed to spawn {display}"))?;
    if !status.success() {
        bail!("command failed with {status}: {display}");
    }
    Ok(())
}

fn pnpm_command() -> Command {
    if cfg!(windows) {
        Command::new("pnpm.cmd")
    } else {
        Command::new("pnpm")
    }
}

fn resolve_path(base: &Path, path: &Path) -> PathBuf {
    if path.is_absolute() {
        path.to_path_buf()
    } else {
        base.join(path)
    }
}

fn package_stage_name(package_dir: &Path) -> String {
    package_dir
        .file_name()
        .and_then(OsStr::to_str)
        .map(sanitize_label)
        .unwrap_or_else(|| "package".to_string())
}

fn sanitize_label(value: &str) -> String {
    value
        .chars()
        .map(|ch| {
            if ch.is_ascii_alphanumeric() || matches!(ch, '.' | '_' | '-') {
                ch
            } else {
                '_'
            }
        })
        .collect()
}

fn target_label(args: &[String]) -> String {
    let mut iter = args.iter();
    while let Some(arg) = iter.next() {
        if arg == "--target" {
            if let Some(target) = iter.next() {
                return target.clone();
            }
        } else if let Some(target) = arg.strip_prefix("--target=") {
            return target.to_string();
        }
    }
    "host".to_string()
}

fn loader_napi_args(args: &[String]) -> Vec<String> {
    let mut loader_args = Vec::new();
    let mut iter = args.iter();

    while let Some(arg) = iter.next() {
        match arg.as_str() {
            "--target" | "--target-dir" => {
                loader_args.push(arg.clone());
                if let Some(value) = iter.next() {
                    loader_args.push(value.clone());
                }
            }
            "--use-napi-cross" | "-x" | "--zig" => loader_args.push(arg.clone()),
            value if value.starts_with("--target=") || value.starts_with("--target-dir=") => {
                loader_args.push(value.to_string());
            }
            _ => {}
        }
    }

    loader_args
}

fn find_single_node_addon(dir: &Path) -> Result<PathBuf> {
    let mut addons = Vec::new();
    collect_node_addons(dir, &mut addons)?;
    match addons.len() {
        1 => Ok(addons.remove(0)),
        0 => bail!(
            "raw addon build did not produce a .node file in {}",
            dir.display()
        ),
        _ => bail!(
            "raw addon build produced multiple .node files in {}: {}",
            dir.display(),
            addons
                .iter()
                .map(|path| path.display().to_string())
                .collect::<Vec<_>>()
                .join(", ")
        ),
    }
}

fn collect_node_addons(dir: &Path, addons: &mut Vec<PathBuf>) -> Result<()> {
    for entry in
        fs::read_dir(dir).with_context(|| format!("failed to read directory {}", dir.display()))?
    {
        let entry = entry.with_context(|| format!("failed to read entry in {}", dir.display()))?;
        let path = entry.path();
        let file_type = entry
            .file_type()
            .with_context(|| format!("failed to read file type for {}", path.display()))?;
        if file_type.is_dir() {
            collect_node_addons(&path, addons)?;
        } else if path.extension() == Some(OsStr::new("node")) {
            addons.push(path);
        }
    }
    Ok(())
}
