---
"@swc/core": major
"@swc/core-darwin-arm64": major
"@swc/core-darwin-x64": major
"@swc/core-linux-arm-gnueabihf": major
"@swc/core-linux-arm64-gnu": major
"@swc/core-linux-arm64-musl": major
"@swc/core-linux-ppc64-gnu": major
"@swc/core-linux-s390x-gnu": major
"@swc/core-linux-x64-gnu": major
"@swc/core-linux-x64-musl": major
"@swc/core-win32-arm64-msvc": major
"@swc/core-win32-ia32-msvc": major
"@swc/core-win32-x64-msvc": major
"@swc/html": major
"@swc/html-darwin-arm64": major
"@swc/html-darwin-x64": major
"@swc/html-linux-arm-gnueabihf": major
"@swc/html-linux-arm64-gnu": major
"@swc/html-linux-arm64-musl": major
"@swc/html-linux-ppc64-gnu": major
"@swc/html-linux-s390x-gnu": major
"@swc/html-linux-x64-gnu": major
"@swc/html-linux-x64-musl": major
"@swc/html-win32-arm64-msvc": major
"@swc/html-win32-ia32-msvc": major
"@swc/html-win32-x64-msvc": major
"@swc/minifier": major
"@swc/minifier-darwin-arm64": major
"@swc/minifier-darwin-x64": major
"@swc/minifier-linux-arm-gnueabihf": major
"@swc/minifier-linux-arm64-gnu": major
"@swc/minifier-linux-arm64-musl": major
"@swc/minifier-linux-ppc64-gnu": major
"@swc/minifier-linux-s390x-gnu": major
"@swc/minifier-linux-x64-gnu": major
"@swc/minifier-linux-x64-musl": major
"@swc/minifier-win32-arm64-msvc": major
"@swc/minifier-win32-ia32-msvc": major
"@swc/minifier-win32-x64-msvc": major
"@swc/react-compiler": major
"@swc/react-compiler-darwin-arm64": major
"@swc/react-compiler-darwin-x64": major
"@swc/react-compiler-linux-arm-gnueabihf": major
"@swc/react-compiler-linux-arm64-gnu": major
"@swc/react-compiler-linux-arm64-musl": major
"@swc/react-compiler-linux-ppc64-gnu": major
"@swc/react-compiler-linux-s390x-gnu": major
"@swc/react-compiler-linux-x64-gnu": major
"@swc/react-compiler-linux-x64-musl": major
"@swc/react-compiler-win32-arm64-msvc": major
"@swc/react-compiler-win32-ia32-msvc": major
"@swc/react-compiler-win32-x64-msvc": major
---

Compress native `.node` packages into a small Rust loader with a zstd-packed addon payload. The first load verifies the payload SHA-512, materializes the raw addon using OS transparent compression when available, and falls back to a per-user cache otherwise, reducing native package download and install size.

This also raises the Node.js engine requirement for all native SWC npm packages to Node 20 or newer.
