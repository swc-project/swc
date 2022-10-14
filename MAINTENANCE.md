# SWC maintenance

This document describes a way to manage/publish the swc repositories. These tasks are all done by me (`@kdy1`) previously, but as the project got much bigger, I'm writing this document to allow the other core team members do it.

## swc-project/swc

This is the main repository. To help rust-side users, swc publishes changed crates everytime a PR is merged. The publish action is done by `@swc-bot`.

To control the bot, we use a review comment ending with yaml. The yaml should start with `swc-bump` and should be the last in the comment. An example of such comments is

```
Content about the PR

---

swc-bump:
 - swc_atoms
 - swc_ecma_ast --breaking

```

and this comment should be written by `@kdy1` at the moment. You can change this to allow more people by fixing [the bot script](https://github.com/swc-project/swc/blob/e46a192cb6b3281408d688b7bbf65c225ef6780e/scripts/bot/src/cargo/comment-parser.ts#L6).
Once PR is merged, the bot script will automatically publish crates and rebase another PR with auto-merged enabled.

If you want to publish crates manually, you can do `cargo mono publish --no-verify` after installing `cargo-mono`.

## swc-project/plugins

When you need to publish crates in `swc-project/plugins`, you can use `./scripts/update-bump-all.sh` to update dependencies and bump versions of crates and npm packages.
Just like the main swc repository, the CI script will automatically publish all crates and npm packages when a PR is merged.
