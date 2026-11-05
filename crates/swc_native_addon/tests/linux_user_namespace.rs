#![cfg(target_os = "linux")]

mod support;

use std::{env, fs, os::unix::fs::MetadataExt, process::Command};

use swc_native_addon::{
    cache::{self, CacheMode},
    format::Payload,
    platform,
};

#[test]
fn cache_loading_in_user_namespace() {
    let available = Command::new("unshare")
        .args(["--user", "--map-current-user", "true"])
        .output();
    if !available
        .as_ref()
        .is_ok_and(|output| output.status.success())
    {
        assert!(
            env::var_os("SWC_TEST_REQUIRE_USERNS").is_none(),
            "user namespaces are required: {available:?}"
        );
        eprintln!(
            "skipping user namespace cache fixture: unshare unavailable or forbidden: \
             {available:?}"
        );
        return;
    }
    for namespaced in [false, true] {
        let executable = env::current_exe().unwrap();
        let mut command = if namespaced {
            let mut command = Command::new("unshare");
            command
                .args(["--user", "--map-current-user"])
                .arg(&executable);
            command
        } else {
            Command::new(&executable)
        };
        let output = command
            .args(["--exact", "cache_loading_worker", "--nocapture"])
            .env("SWC_TEST_USERNS_WORKER", "1")
            .env_remove("SWC_NATIVE_BINDING_CACHE_SKIP_SECURITY_CHECK")
            .env_remove("SWC_NATIVE_BINDING_CACHE")
            .output()
            .unwrap();
        assert!(
            output.status.success(),
            "namespaced={namespaced}: {}{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        );
    }
}

#[test]
fn cache_loading_worker() {
    if env::var_os("SWC_TEST_USERNS_WORKER").is_none() {
        return;
    }
    eprintln!(
        "uid_map: {}root owner: {} mode: {:o}",
        fs::read_to_string("/proc/self/uid_map").unwrap(),
        fs::metadata("/").unwrap().uid(),
        fs::metadata("/").unwrap().mode()
    );
    let temporary = tempfile::tempdir().unwrap();
    let root = temporary.path();
    let home = root.join("home");
    let custom = root.join("custom");
    let blocked = root.join("blocked");
    fs::write(&blocked, b"not a directory").unwrap();
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let raw = fs::read(support::fixture()).unwrap();
    for case in include_str!("fixtures/linux-user-namespace.txt").lines() {
        if case.is_empty() || case.starts_with('#') {
            continue;
        }
        env::set_var("HOME", &home);
        env::set_var("XDG_CACHE_HOME", &home);
        env::set_var("TMPDIR", "/tmp");
        let (mode, selected) = match case {
            "default" => (CacheMode::Default, home.clone()),
            "custom" => (CacheMode::Custom(custom.clone()), custom.clone()),
            "temporary" => (CacheMode::Temporary, home.clone()),
            "fallback" => {
                env::set_var("HOME", &blocked);
                env::set_var("XDG_CACHE_HOME", &blocked);
                (CacheMode::Default, "/tmp".into())
            }
            _ => panic!("unknown namespace fixture {case}"),
        };
        let mut image = cache::materialize(&payload, &mode).unwrap();
        assert!(
            image.path().starts_with(
                selected
                    .join(platform::user_namespace().unwrap())
                    .join("v1")
            ),
            "{case}"
        );
        assert_eq!(fs::read(image.path()).unwrap(), raw, "{case}");
        let path = image.path().to_owned();
        let library = unsafe { libloading::Library::new(&path) }.unwrap();
        image.loaded().unwrap();
        assert_eq!(path.exists(), mode != CacheMode::Temporary, "{case}");
        drop(library);
    }
}
