// Keep the real addon larger than its carrier using a mapped, retained section.
// Appending an overlay after Mach-O link-edit data prevents codesign from
// signing the fixture on current macOS. Nonzero data cannot become BSS.
#[path = "node.rs"]
mod node;

#[no_mangle]
pub static SWC_FIXTURE_PADDING: [u8; 4 * 1024 * 1024] = [0x61; 4 * 1024 * 1024];
