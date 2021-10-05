use anyhow::{anyhow, Error};
use std::fmt::Display;

pub mod cargo;

pub(crate) trait CargoEditResultExt<T>: Into<cargo_edit::Result<T>> {
    fn map_err_op(self, op: impl Display) -> Result<T, Error> {
        self.into()
            .map_err(|err| anyhow!("failed to {}: {:?}", op, err))
    }
}

impl<T> CargoEditResultExt<T> for cargo_edit::Result<T> {}
