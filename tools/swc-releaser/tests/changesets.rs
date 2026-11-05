use std::path::Path;

/// Pending release files must be accepted by the same parser used by `cargo
/// bump`.
#[test]
fn pending_changesets_are_valid() {
    let directory = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../.changeset");
    changesets::ChangeSet::from_directory(directory).expect("failed to load pending changesets");
}
