//! Metadata and comment annotation passes for the minifier.
//!
//! This module provides the InfoMarker pass that analyzes comments and
//! converts them to marks for use during minification.

pub(crate) mod hook;

#[cfg(test)]
mod tests;
