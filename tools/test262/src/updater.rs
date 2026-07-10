//! Transactional update of the pinned Test262 revision and managed checkout.

use anyhow::Result;

use crate::{
    config::{ProjectPaths, Revision, UpstreamId, Upstreams},
    setup::{setup_upstreams, SetupOptions, UpstreamStatus},
};

pub fn update_test262(
    paths: &ProjectPaths,
    current: &Upstreams,
    revision: Revision,
) -> Result<UpstreamStatus> {
    let mut updated = current.clone();
    updated.test262.revision = revision;

    let mut statuses = setup_upstreams(
        paths,
        &updated,
        &[UpstreamId::Test262],
        SetupOptions {
            force: true,
            ..SetupOptions::default()
        },
    )?;
    updated.save(paths)?;
    Ok(statuses.remove(0))
}
