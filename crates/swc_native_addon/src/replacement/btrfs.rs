use std::{fs::File, io, os::fd::AsRawFd};

const ZLIB: u32 = 1;
const ZSTD: u32 = 3;

const FEATURE_COMPRESS_ZSTD: u64 = 1 << 4;

/// Read enabled filesystem features to preserve older-kernel compatibility.
pub(super) fn incompat_flags(file: &File) -> io::Result<u64> {
    #[repr(C)]
    #[derive(Default)]
    struct FeatureFlags {
        compat: u64,
        compat_ro: u64,
        incompat: u64,
    }
    let mut features = FeatureFlags::default();
    // SAFETY: The fd is live and `features` matches the three-u64 ioctl layout.
    if unsafe { libc::ioctl(file.as_raw_fd(), 0x8018_9439_u32 as _, &mut features) } == 0 {
        return Ok(features.incompat);
    }
    Err(io::Error::last_os_error())
}

/// Prefer enabled zstd, then zlib. Failed queries use the baseline codec.
pub(super) fn compress_with_fallback(
    features: io::Result<u64>,
    mut compress: impl FnMut(u32) -> io::Result<()>,
) -> io::Result<()> {
    let flags = features.unwrap_or_else(|error| {
        tracing::debug!(%error, "btrfs feature query failed; using zlib");
        0
    });
    if flags & FEATURE_COMPRESS_ZSTD != 0 {
        match compress(ZSTD) {
            Ok(()) => return Ok(()),
            Err(error) if error.raw_os_error() == Some(libc::EINVAL) => {}
            Err(error) => return Err(error),
        }
    }
    compress(ZLIB)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[cfg(target_os = "macos")]
    #[test]
    fn unsupported_feature_query_keeps_baseline_codec() {
        let features = incompat_flags(&tempfile::tempfile().unwrap());
        assert!(features.is_err());
        compress_with_fallback(features, |codec| {
            assert_eq!(codec, ZLIB);
            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn prefers_zstd_and_stops_at_first_supported_codec() {
        for supported in [ZSTD, ZLIB] {
            let mut attempted = Vec::new();
            compress_with_fallback(Ok(FEATURE_COMPRESS_ZSTD), |codec| {
                attempted.push(codec);
                if codec == supported {
                    Ok(())
                } else {
                    Err(io::Error::from_raw_os_error(libc::EINVAL))
                }
            })
            .unwrap();
            assert_eq!(
                attempted,
                if supported == ZSTD {
                    vec![ZSTD]
                } else {
                    vec![ZSTD, ZLIB]
                }
            );
        }
    }

    #[test]
    fn preserves_io_failures_without_retrying() {
        let mut attempts = 0;
        let error = compress_with_fallback(Ok(FEATURE_COMPRESS_ZSTD), |_| {
            attempts += 1;
            Err(io::Error::from_raw_os_error(libc::EIO))
        })
        .unwrap_err();
        assert_eq!(attempts, 1);
        assert_eq!(error.raw_os_error(), Some(libc::EIO));
    }

    #[test]
    fn preserves_zlib_failures() {
        for (features, expected) in [
            (Ok(0), &[ZLIB][..]),
            (Ok(FEATURE_COMPRESS_ZSTD), &[ZSTD, ZLIB][..]),
            (Err(io::Error::from_raw_os_error(libc::EACCES)), &[ZLIB][..]),
        ] {
            let mut attempted = Vec::new();
            let error = compress_with_fallback(features, |codec| {
                attempted.push(codec);
                Err(io::Error::from_raw_os_error(if codec == ZSTD {
                    libc::EINVAL
                } else {
                    libc::EIO
                }))
            })
            .unwrap_err();
            assert_eq!(attempted, expected);
            assert_eq!(error.raw_os_error(), Some(libc::EIO));
        }
    }

    #[test]
    fn reports_failure_when_all_codecs_are_rejected() {
        let mut attempted = Vec::new();
        let error = compress_with_fallback(Ok(FEATURE_COMPRESS_ZSTD), |codec| {
            attempted.push(codec);
            Err(io::Error::from_raw_os_error(libc::EINVAL))
        })
        .unwrap_err();
        assert_eq!(attempted, [ZSTD, ZLIB]);
        assert_eq!(error.raw_os_error(), Some(libc::EINVAL));
    }

    #[test]
    fn failed_feature_queries_use_zlib() {
        for errno in [
            libc::ENOTTY,
            libc::EINVAL,
            libc::EACCES,
            libc::EPERM,
            libc::EIO,
        ] {
            let mut attempted = Vec::new();
            compress_with_fallback(Err(io::Error::from_raw_os_error(errno)), |codec| {
                attempted.push(codec);
                Ok(())
            })
            .unwrap();
            assert_eq!(attempted, [ZLIB]);
        }
    }

    #[test]
    fn never_enables_new_filesystem_features() {
        for line in include_str!("../../tests/fixtures/btrfs-codecs.txt").lines() {
            let (flags, expected) = line.split_once(':').unwrap();
            let flags = u64::from_str_radix(flags, 16).unwrap();
            let expected: Vec<u32> = expected.split(',').map(|n| n.parse().unwrap()).collect();
            let mut attempted = Vec::new();
            compress_with_fallback(Ok(flags), |codec| {
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
