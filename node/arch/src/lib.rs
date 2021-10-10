use std::str::FromStr;

use anyhow::{bail, Context, Error};
use string_enum::StringEnum;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, StringEnum)]
pub enum NodeArch {
    /// `arm`
    Arm,

    /// `arm64`
    Arm64,

    /// `ia32`
    Ia32,

    /// `mips`
    Mips,

    /// `mipsel`
    MipSel,

    /// `ppc`
    Ppc,

    /// `ppc64`
    Ppc64,

    /// `s390`
    S390,

    /// `s390x`
    S390x,

    /// `x32`
    X32,

    /// `x64`
    X64,
}

impl NodeArch {
    pub fn from_cpu(cpu: &str) -> Result<Self, Error> {
        match cpu {
            "x86_64" => Ok(NodeArch::X64),
            "aarch64" => Ok(NodeArch::Arm64),
            "i686" => Ok(NodeArch::Ia32),
            "armv7" => Ok(NodeArch::Arm),
            _ => {
                let s = cpu.parse();

                match s {
                    Ok(v) => Ok(v),
                    Err(_) => bail!("failed to parse node arch from cpu `{}`", cpu),
                }
            }
        }
    }
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, StringEnum)]
pub enum NodePlatform {
    /// `linux`
    Linux,
    /// `freebsd`
    Freebsd,
    /// `darwin`
    Darwin,
    /// `win32`
    Windows,
}

impl NodePlatform {
    pub fn from_sys(s: &str) -> Result<Self, Error> {
        match s {
            "linux" => Ok(NodePlatform::Linux),
            "freebsd" => Ok(NodePlatform::Freebsd),
            "darwin" => Ok(NodePlatform::Darwin),
            "windows" => Ok(NodePlatform::Windows),

            _ => s
                .parse()
                .ok()
                .ok_or_else(|| anyhow::anyhow!("failed to parse `{}` as NodePlatform", s)),
        }
    }
}

//// https://github.com/napi-rs/napi-rs/blob/main/cli/src/parse-triple.ts
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct PlatformDetail {
    pub platform: NodePlatform,
    pub platform_arch_abi: String,
    pub arch: NodeArch,

    pub raw: String,
    pub abi: Option<String>,
}

//// https://github.com/napi-rs/napi-rs/blob/7e7b4f0a82da0be2a6288c3b88e3456568284714/cli/src/parse-triple.ts#L73
impl FromStr for PlatformDetail {
    type Err = Error;

    fn from_str(raw: &str) -> Result<Self, Self::Err> {
        (|| -> Result<_, Error> {
            let triples = raw.split('-').collect::<Vec<_>>();

            let (platform, arch, abi) = match &*triples {
                [cpu, _, sys, abi] => (
                    NodePlatform::from_sys(sys)?,
                    NodeArch::from_cpu(cpu)?,
                    Some(abi.to_string()),
                ),
                [cpu, _, sys] => (NodePlatform::from_sys(sys)?, NodeArch::from_cpu(cpu)?, None),
                [cpu, sys, ..] => (NodePlatform::from_sys(sys)?, NodeArch::from_cpu(cpu)?, None),
                _ => {
                    bail!("invalid format")
                }
            };

            let platform_arch_abi = if let Some(abi) = &abi {
                format!("{}-{}-{}", platform, arch, abi)
            } else {
                format!("{}-{}", platform, arch)
            };

            Ok(PlatformDetail {
                platform,
                platform_arch_abi,
                arch,
                raw: raw.to_string(),
                abi,
            })
        })()
        .with_context(|| format!("failed to parse `{}` as platform detail", raw))
    }
}
