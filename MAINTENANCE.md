# SWC maintenance

This document describes a way to manage/publish the swc repositories. These tasks are all done by me (`@kdy1`) previously, but as the project got much bigger, I'm writing this document to allow the other core team members do it.

## swc-project/swc

You can use `@changeset` bot to mark a crate as modified (by a PR). After the PR is merged, you can run `cargo mono publish --no-verify` to publish all crates.

## swc-project/plugins

When you need to publish crates in `swc-project/plugins`, you can use `./scripts/update-bump-all.sh` to update dependencies and bump versions of crates and npm packages.
Just like the main swc repository, the CI script will automatically publish all crates and npm packages when a PR is merged.
