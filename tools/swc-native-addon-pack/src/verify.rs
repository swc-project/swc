//! Host-side release verification. Decode before extracting or replacing an
//! artifact; replacement never falls back to copying over the raw addon.

mod carrier;

use std::{
    env, fs,
    io::Write,
    path::{Path, PathBuf},
};

use sha2::{Digest, Sha512};
use swc_native_addon::{
    format::{NativeTarget, HEADER_LEN, MAX_SIZE},
    platform,
};

fn output_path(path: &Path) -> carrier::Result<PathBuf> {
    if path.extension().and_then(|extension| extension.to_str()) != Some("node") {
        return Err("destination must be a .node file, never a CLI executable".into());
    }
    let parent = path
        .parent()
        .filter(|p| !p.as_os_str().is_empty())
        .unwrap_or(Path::new("."));
    Ok(fs::canonicalize(parent)?.join(path.file_name().ok_or("destination filename is required")?))
}

fn run() -> carrier::Result<()> {
    let mut args = env::args_os().skip(1);
    let mut input = None;
    let mut target = None;
    let mut raw = None;
    let mut extract = None;
    let mut replace = None;
    while let Some(arg) = args.next() {
        let destination = match arg.to_str() {
            Some("--input") => &mut input,
            Some("--target") => &mut target,
            Some("--raw") => &mut raw,
            Some("--extract") => &mut extract,
            Some("--replace") => &mut replace,
            _ => return Err("expected --input, --target, --raw, --extract, or --replace".into()),
        };
        if destination.is_some() {
            return Err("duplicate verifier argument".into());
        }
        *destination = Some(args.next().ok_or("missing verifier argument value")?);
    }
    let input = fs::canonicalize(input.ok_or("--input is required")?)?;
    let target = target.ok_or("--target is required")?;
    let target = NativeTarget::parse(target.to_str().ok_or("target must be UTF-8")?)?;
    if fs::metadata(&input)?.len() > MAX_SIZE {
        return Err("carrier exceeds 2 GiB".into());
    }
    let bytes = fs::read(&input)?;
    let payload = carrier::payload(&bytes, target)?;
    if bytes.len() as u64 >= payload.header.raw_len {
        return Err("carrier must be smaller than the stripped raw addon".into());
    }
    let mut decoded = tempfile::tempfile()?;
    payload.decode_into(&mut decoded)?;
    payload.verify_target(&mut decoded)?;
    let raw = raw.map(fs::canonicalize).transpose()?;
    if let Some(path) = &raw {
        payload.header.verify(&mut fs::File::open(path)?)?;
    }
    if extract.is_some() && replace.is_some() {
        return Err("--extract and --replace are mutually exclusive".into());
    }
    if let Some(path) = extract {
        let path = output_path(Path::new(&path))?;
        if path.exists() {
            return Err("extraction destination already exists".into());
        }
        let mut stage = tempfile::NamedTempFile::new_in(path.parent().unwrap())?;
        use std::io::{Seek, SeekFrom};
        decoded.seek(SeekFrom::Start(0))?;
        std::io::copy(&mut decoded, &mut stage)?;
        stage.as_file().sync_all()?;
        stage.persist_noclobber(&path)?;
        platform::sync_directory(path.parent().unwrap())?;
    }
    if let Some(path) = replace {
        let path = output_path(Path::new(&path))?;
        if raw.as_ref() != Some(&fs::canonicalize(&path)?) || path == input {
            return Err(
                "--replace must name the verified --raw addon, distinct from the carrier".into(),
            );
        }
        let parent = path.parent().unwrap();
        let mut stage = tempfile::Builder::new()
            .prefix(".native-carrier-")
            .tempfile_in(parent)?;
        stage
            .as_file()
            .set_permissions(fs::metadata(&path)?.permissions())?;
        stage.write_all(&bytes)?;
        stage.as_file().sync_all()?;
        // Close all writable handles before MoveFileExW on Windows.
        let stage = stage.into_temp_path();
        platform::replace_file(&stage, &path)?;
        platform::sync_directory(parent)?;
    }
    println!(
        "{}",
        serde_json::json!({
            "kind": "carrier",
            "target": target.as_triple(),
            "rawSize": payload.header.raw_len,
            "rawSha512": payload.header.cache_key(),
            "compressedSize": payload.header.compressed_len,
            "payloadSize": HEADER_LEN as u64 + payload.header.compressed_len,
            "carrierSize": bytes.len(),
            "carrierSha512": format!("{:x}", Sha512::digest(&bytes)),
            "reduction": 1.0 - bytes.len() as f64 / payload.header.raw_len as f64,
        })
    );
    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("swc-native-addon-verify: {error}");
        std::process::exit(1);
    }
}
