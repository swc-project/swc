use std::io;

const COMPRESS_LZO: u64 = 1 << 3;
const COMPRESS_ZSTD: u64 = 1 << 4;

/// Read enabled on-disk features, not the kernel's supported features. Enabling
/// a new compression feature would prevent older kernels from mounting the
/// volume.
#[cfg(any(target_os = "linux", all(test, unix)))]
pub(super) fn incompat_flags(file: &std::fs::File) -> io::Result<u64> {
    use std::os::fd::AsRawFd;

    #[repr(C)]
    #[derive(Default)]
    struct FeatureFlags {
        compat: u64,
        compat_ro: u64,
        incompat: u64,
    }
    let mut features = FeatureFlags::default();
    // SAFETY: GET_FEATURES writes the three-u64 UAPI structure to this valid
    // pointer. The file descriptor remains open for the duration of the call.
    if unsafe { libc::ioctl(file.as_raw_fd(), 0x8018_9439_u32 as _, &mut features) } == 0 {
        return Ok(features.incompat);
    }
    let error = io::Error::last_os_error();
    match error.raw_os_error() {
        Some(libc::ENOTTY | libc::EINVAL) => Ok(0),
        _ => Err(error),
    }
}

/// Prefer fast decoding only among already-enabled filesystem features. Only
/// unsupported-codec errors justify retrying another algorithm.
pub(super) fn compress_with_fallback(
    incompat_flags: u64,
    mut compress: impl FnMut(u32) -> io::Result<()>,
) -> io::Result<()> {
    for (codec, feature) in [(3, COMPRESS_ZSTD), (2, COMPRESS_LZO), (1, 0)] {
        if feature != 0 && incompat_flags & feature == 0 {
            continue;
        }
        match compress(codec) {
            Ok(()) => return Ok(()),
            Err(error) if codec != 1 && error.raw_os_error() == Some(libc::EINVAL) => {}
            Err(error) => return Err(error),
        }
    }
    unreachable!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[cfg(target_os = "macos")]
    #[test]
    fn unsupported_feature_query_keeps_baseline_codec() {
        assert_eq!(incompat_flags(&tempfile::tempfile().unwrap()).unwrap(), 0);
    }

    #[test]
    fn prefers_zstd_and_stops_at_first_supported_codec() {
        for supported in [3, 2, 1] {
            let mut attempted = Vec::new();
            compress_with_fallback(COMPRESS_ZSTD | COMPRESS_LZO, |codec| {
                attempted.push(codec);
                if codec == supported {
                    Ok(())
                } else {
                    Err(io::Error::from_raw_os_error(libc::EINVAL))
                }
            })
            .unwrap();
            assert_eq!(attempted, (supported..=3).rev().collect::<Vec<_>>());
        }
    }

    #[test]
    fn preserves_io_failures_without_retrying() {
        let mut attempts = 0;
        let error = compress_with_fallback(COMPRESS_ZSTD | COMPRESS_LZO, |_| {
            attempts += 1;
            Err(io::Error::from_raw_os_error(libc::EIO))
        })
        .unwrap_err();
        assert_eq!(attempts, 1);
        assert_eq!(error.raw_os_error(), Some(libc::EIO));
    }

    #[test]
    fn reports_failure_when_all_codecs_are_rejected() {
        let mut attempted = Vec::new();
        let error = compress_with_fallback(COMPRESS_ZSTD | COMPRESS_LZO, |codec| {
            attempted.push(codec);
            Err(io::Error::from_raw_os_error(libc::EINVAL))
        })
        .unwrap_err();
        assert_eq!(attempted, [3, 2, 1]);
        assert_eq!(error.raw_os_error(), Some(libc::EINVAL));
    }

    #[test]
    fn never_enables_new_filesystem_features() {
        for line in include_str!("../../tests/fixtures/btrfs-codecs.txt").lines() {
            let (flags, expected) = line.split_once(':').unwrap();
            let flags = u64::from_str_radix(flags, 16).unwrap();
            let expected: Vec<u32> = expected.split(',').map(|n| n.parse().unwrap()).collect();
            let mut attempted = Vec::new();
            compress_with_fallback(flags, |codec| {
                attempted.push(codec);
                if codec == 1 {
                    Ok(())
                } else {
                    Err(io::Error::from_raw_os_error(libc::EINVAL))
                }
            })
            .unwrap();
            assert_eq!(attempted, expected, "feature flags: {flags:#x}");
        }
    }
}
