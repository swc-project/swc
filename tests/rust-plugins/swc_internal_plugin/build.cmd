@ECHO OFF

REM Iterate over arguments, check if it's release build
SET BUILD_TARGET="debug"
FOR %%A in (%*) DO (
  IF /I "--release"=="%%A" (
    SET BUILD_TARGET="release"
  )
)

REM Build wasm binary
cargo build %* --target=wasm32-unknown-unknown

REM Build polyfill cli, run polyfill over generated wasm binary
PUSHD multivalue-polyfill
cargo build
cargo run -- %BUILD_TARGET%
POPD
