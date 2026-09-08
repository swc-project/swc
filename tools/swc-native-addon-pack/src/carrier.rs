//! Inspect the final linked image, including its mapped payload and exports.
//! A magic string in debug information or an appended overlay is not a carrier.

use std::io::Cursor;

use object::{Object, ObjectSection, SectionFlags};
use swc_native_addon::format::{native_target, NativeTarget, Payload, HEADER_LEN, MAX_SIZE};

pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

/// Find the retained payload section in the completed native image. The build
/// script keeps one complete allocation, even when LTO could otherwise fold
/// header reads and discard parts of the original include_bytes allocation.
/// Full decoding and raw-image verification remain mandatory for callers.
pub fn payload(bytes: &[u8], target: NativeTarget) -> Result<Payload<'_>> {
    native_target(&mut Cursor::new(bytes), bytes.len() as u64, target)?;
    let image = object::File::parse(bytes)?;
    let exports = image.exports()?;
    for name in [
        b"napi_register_module_v1".as_slice(),
        b"node_api_module_get_api_version_v1".as_slice(),
    ] {
        if !exports.iter().any(|export| {
            let exported = export.name();
            exported == name
                || (image.format() == object::BinaryFormat::MachO
                    && exported.strip_prefix(b"_") == Some(name))
        }) {
            return Err(format!(
                "carrier is missing export {}",
                String::from_utf8_lossy(name)
            )
            .into());
        }
    }
    let section_name = match image.format() {
        object::BinaryFormat::Elf => ".swc_native",
        object::BinaryFormat::MachO => "__swc_native",
        object::BinaryFormat::Pe => ".swcn",
        _ => return Err("unsupported carrier image format".into()),
    };
    let mut sections = image
        .sections()
        .filter(|section| section.name().ok() == Some(section_name));
    let section = sections
        .next()
        .ok_or("carrier is missing its retained payload section")?;
    if sections.next().is_some() {
        return Err("carrier contains multiple payload sections".into());
    }
    match section.flags() {
        SectionFlags::Elf { sh_flags }
            if sh_flags & u64::from(object::elf::SHF_ALLOC) != 0
                && sh_flags & u64::from(object::elf::SHF_WRITE) == 0 => {}
        SectionFlags::Coff { characteristics }
            if characteristics & object::pe::IMAGE_SCN_MEM_READ != 0
                && characteristics & object::pe::IMAGE_SCN_MEM_WRITE == 0 => {}
        SectionFlags::MachO { .. } if section.segment_name()? == Some("__TEXT") => {}
        _ => return Err("carrier payload must be in mapped read-only data".into()),
    }
    let data = section.data()?;
    if data.len() < HEADER_LEN {
        return Err("truncated carrier payload section".into());
    }
    let compressed = u64::from_le_bytes(data[16..24].try_into()?);
    if compressed > MAX_SIZE {
        return Err("carrier payload exceeds 2 GiB".into());
    }
    let end = usize::try_from(HEADER_LEN as u64 + compressed)?;
    let candidate = data.get(..end).ok_or("truncated carrier payload")?;
    // PE sections may have file-alignment padding, but no second payload or
    // trailing data may be hidden in the private section.
    if data[end..].iter().any(|byte| *byte != 0) {
        return Err("unexpected data after carrier payload".into());
    }
    let payload = Payload::parse(candidate)?;
    if payload.header.target != target {
        return Err("carrier payload target mismatch".into());
    }
    Ok(payload)
}
