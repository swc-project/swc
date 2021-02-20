#![cfg_attr(test, feature(test))]
#![feature(or_patterns)]

#[cfg(test)]
extern crate test;

pub mod config;
pub mod loaders;
pub mod resolvers;
