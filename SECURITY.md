# Security Policy

## Supported Versions

Security fixes are provided for the latest released version of SWC and the
`main` branch.

Older releases may receive fixes at the maintainers' discretion, but they are
not guaranteed to receive security updates.

## Reporting a Vulnerability

Please do not report security vulnerabilities in a public GitHub issue.

Report suspected vulnerabilities privately by emailing:

<kdy.1997.dev@gmail.com>

Please include enough information for maintainers to reproduce and assess the
issue, such as:

-   The affected package, crate, version, or commit
-   Steps to reproduce the issue
-   The expected and actual behavior
-   The security impact
-   Any suggested fix, mitigation, or related context

Maintainers will review the report and coordinate investigation, fixes, and
public disclosure when appropriate.

## Security Model

SWC is a build tool. It is not designed to be a SaaS platform, a multi-tenant
sandbox, or a security boundary for executing or transforming arbitrary
untrusted input.

If you operate SWC in a service that accepts untrusted input, you are
responsible for validating that input before passing it to SWC and for applying
appropriate isolation, resource limits, privilege separation, and operational
controls around the process.

## Scope

Security reports are in scope when they affect SWC itself, including:

-   Official Rust crates and npm packages
-   Official bindings and release artifacts
-   Parser, compiler, bundler, transform, minifier, and code generation behavior
-   Issues that can cause practical confidentiality, integrity, or availability
    impact in supported SWC usage

## Out of Scope

The following reports are generally out of scope:

-   Issues that depend only on using SWC as an unsandboxed public service for
    arbitrary untrusted input
-   Issues that affect only unsupported versions
-   Reports without a practical security impact
-   Known dependency vulnerabilities without a demonstrated impact on SWC
