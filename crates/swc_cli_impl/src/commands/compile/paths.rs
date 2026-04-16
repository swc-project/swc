use std::path::{Component, Path, PathBuf};

use anyhow::Context;
use path_absolutize::Absolutize;
use pathdiff::diff_paths;

/// Resolve the output path for a compiled file or copied asset under `out_dir`.
pub fn resolve_output_path(
    out_dir: &Path,
    raw_inputs: &[PathBuf],
    file_path: &Path,
    file_extension: Option<&str>,
    strip_leading_paths: bool,
) -> anyhow::Result<PathBuf> {
    let out_dir = out_dir.absolutize()?.into_owned();
    let mut relative_path =
        resolve_relative_output_path(raw_inputs, file_path, strip_leading_paths)?;

    if let Some(file_extension) = file_extension {
        relative_path.set_extension(file_extension);
    }

    Ok(out_dir.join(relative_path))
}

fn resolve_relative_output_path(
    raw_inputs: &[PathBuf],
    file_path: &Path,
    strip_leading_paths: bool,
) -> anyhow::Result<PathBuf> {
    let file_path = file_path.absolutize()?.into_owned();

    if let Some(relative_to_input_dir) = resolve_relative_to_input_dir(raw_inputs, &file_path)? {
        return Ok(finalize_relative_path(
            &file_path,
            relative_to_input_dir,
            strip_leading_paths,
        ));
    }

    let cwd = std::env::current_dir()?;
    let cwd_relative = diff_paths(&file_path, &cwd).with_context(|| {
        format!(
            "failed to make {} relative to {}",
            file_path.display(),
            cwd.display()
        )
    })?;

    // Absolute inputs outside the current working directory should not recreate
    // the host filesystem under `out_dir`.
    let base_path = if file_path.is_absolute() && starts_with_parent_component(&cwd_relative) {
        fallback_relative_path(&file_path)?
    } else {
        cwd_relative
    };

    Ok(finalize_relative_path(
        &file_path,
        base_path,
        strip_leading_paths,
    ))
}

fn resolve_relative_to_input_dir(
    raw_inputs: &[PathBuf],
    file_path: &Path,
) -> anyhow::Result<Option<PathBuf>> {
    let input_dir = match raw_inputs.iter().find(|path| path.is_dir()) {
        Some(input_dir) => input_dir,
        None => return Ok(None),
    };

    let input_dir = input_dir.absolutize()?.into_owned();
    let stripped = match file_path.strip_prefix(&input_dir) {
        Ok(stripped) => stripped,
        Err(_) => return Ok(None),
    };

    let mut relative_path = PathBuf::new();

    if let Some(dir_name) = input_dir.file_name() {
        relative_path.push(dir_name);
    }

    if !stripped.as_os_str().is_empty() {
        relative_path.push(stripped);
    }

    Ok(Some(relative_path))
}

fn finalize_relative_path(
    file_path: &Path,
    base_path: PathBuf,
    strip_leading_paths: bool,
) -> PathBuf {
    let mut relative_path = sanitize_relative_path(base_path, strip_leading_paths);

    if relative_path.as_os_str().is_empty() {
        relative_path = fallback_file_name(file_path);
    }

    relative_path
}

fn sanitize_relative_path(path: PathBuf, strip_leading_paths: bool) -> PathBuf {
    let mut sanitized = PathBuf::new();
    let mut stripped_first_component = !strip_leading_paths;

    for component in path.components() {
        match component {
            Component::Normal(component) => {
                if !stripped_first_component {
                    stripped_first_component = true;
                    continue;
                }

                sanitized.push(component);
            }
            Component::CurDir
            | Component::ParentDir
            | Component::RootDir
            | Component::Prefix(_) => {
                // Ignore non-normal components so output paths cannot escape
                // the destination directory or recreate
                // host-specific prefixes.
            }
        }
    }

    sanitized
}

fn fallback_relative_path(file_path: &Path) -> anyhow::Result<PathBuf> {
    let mut path = PathBuf::new();

    if let Some(parent_name) = file_path.parent().and_then(Path::file_name) {
        path.push(parent_name);
    }

    path.push(
        file_path
            .file_name()
            .context("Filename should be available for output path fallback")?,
    );

    Ok(path)
}

fn fallback_file_name(file_path: &Path) -> PathBuf {
    file_path
        .file_name()
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("unknown"))
}

fn starts_with_parent_component(path: &Path) -> bool {
    matches!(path.components().next(), Some(Component::ParentDir))
}
