use anyhow::{bail, Error};
use string_enum::StringEnum;

#[derive(Clone, Copy, StringEnum)]
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

#[derive(Clone, Copy, StringEnum)]
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

//// https://github.com/napi-rs/napi-rs/blob/main/cli/src/parse-triple.ts
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct PlatformDetail {
    pub platform: NodePlatform,
    pub platform_arch_abi: String,
    pub arch: NodeArch,

    pub raw: String,
    pub abi: Option<String>,
}
