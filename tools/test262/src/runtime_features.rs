//! Node runtime capability probes for Test262 metadata features.
//!
//! This table is intentionally metadata-driven. A missing host built-in is an
//! explicit unsupported outcome, while syntax such as decorators is still
//! allowed to pass through SWC because a transform may remove it before Node
//! executes the result.

use std::{path::Path, process::Command};

use anyhow::{bail, Context, Result};

use crate::model::{FeatureSupport, Metadata, TestFlag};

/// A Test262 feature whose semantics depend on a Node built-in or engine
/// capability that SWC does not synthesize.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum RuntimeFeature {
    Temporal,
    ShadowRealm,
    JointIteration,
    IteratorSequencing,
    AwaitDictionary,
    ImmutableArrayBuffer,
    Upsert,
    Uint8ArrayBase64,
    ErrorStackAccessor,
    MathSumPrecise,
    IntlDurationFormat,
    RegExpEscape,
    PromiseTry,
    Float16Array,
    AtomicsPause,
    TailCallOptimization,
    ExplicitResourceManagement,
    ErrorIsError,
    IntlLocaleInfo,
}

/// A Test262 host hook which this Node worker cannot faithfully provide.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum RuntimeHostCapability {
    IsHtmlDda,
    Agent,
    AgentCanSuspendFalse,
}

impl RuntimeHostCapability {
    const ALL: [Self; 3] = [Self::IsHtmlDda, Self::Agent, Self::AgentCanSuspendFalse];

    pub(crate) const fn name(self) -> &'static str {
        match self {
            Self::IsHtmlDda => "IsHTMLDDA",
            Self::Agent => "$262.agent",
            Self::AgentCanSuspendFalse => "AgentCanSuspend=false",
        }
    }

    fn is_required(self, metadata: &Metadata) -> bool {
        match self {
            Self::IsHtmlDda => metadata
                .features
                .iter()
                .any(|feature| feature == "IsHTMLDDA"),
            Self::Agent => metadata
                .includes
                .iter()
                .any(|include| matches!(include.as_str(), "agent.js" | "atomicsHelper.js")),
            Self::AgentCanSuspendFalse => metadata.has_flag(TestFlag::CanBlockIsFalse),
        }
    }
}

impl RuntimeFeature {
    pub(crate) const ALL: [Self; 19] = [
        Self::Temporal,
        Self::ShadowRealm,
        Self::JointIteration,
        Self::IteratorSequencing,
        Self::AwaitDictionary,
        Self::ImmutableArrayBuffer,
        Self::Upsert,
        Self::Uint8ArrayBase64,
        Self::ErrorStackAccessor,
        Self::MathSumPrecise,
        Self::IntlDurationFormat,
        Self::RegExpEscape,
        Self::PromiseTry,
        Self::Float16Array,
        Self::AtomicsPause,
        Self::TailCallOptimization,
        Self::ExplicitResourceManagement,
        Self::ErrorIsError,
        Self::IntlLocaleInfo,
    ];

    pub(crate) const fn metadata_name(self) -> &'static str {
        match self {
            Self::Temporal => "Temporal",
            Self::ShadowRealm => "ShadowRealm",
            Self::JointIteration => "joint-iteration",
            Self::IteratorSequencing => "iterator-sequencing",
            Self::AwaitDictionary => "await-dictionary",
            Self::ImmutableArrayBuffer => "immutable-arraybuffer",
            Self::Upsert => "upsert",
            Self::Uint8ArrayBase64 => "uint8array-base64",
            Self::ErrorStackAccessor => "error-stack-accessor",
            Self::MathSumPrecise => "Math.sumPrecise",
            Self::IntlDurationFormat => "Intl.DurationFormat",
            Self::RegExpEscape => "RegExp.escape",
            Self::PromiseTry => "promise-try",
            Self::Float16Array => "Float16Array",
            Self::AtomicsPause => "Atomics.pause",
            Self::TailCallOptimization => "tail-call-optimization",
            Self::ExplicitResourceManagement => "explicit-resource-management",
            Self::ErrorIsError => "Error.isError",
            Self::IntlLocaleInfo => "Intl.Locale-info",
        }
    }

    const fn probe_expression(self) -> &'static str {
        match self {
            Self::Temporal => "typeof globalThis.Temporal === 'object'",
            Self::ShadowRealm => "typeof globalThis.ShadowRealm === 'function'",
            Self::JointIteration => {
                "typeof globalThis.Iterator === 'function' && typeof Iterator.zip === 'function' \
                 && typeof Iterator.zipKeyed === 'function'"
            }
            Self::IteratorSequencing => {
                "typeof globalThis.Iterator === 'function' && typeof Iterator.concat === 'function'"
            }
            Self::AwaitDictionary => {
                "typeof Promise.allKeyed === 'function' && typeof Promise.allSettledKeyed === \
                 'function'"
            }
            Self::ImmutableArrayBuffer => {
                "typeof ArrayBuffer.prototype.transferToImmutable === 'function' && typeof \
                 ArrayBuffer.prototype.sliceToImmutable === 'function' && typeof \
                 Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'immutable')?.get === \
                 'function'"
            }
            Self::Upsert => {
                "typeof Map.prototype.getOrInsert === 'function' && typeof \
                 Map.prototype.getOrInsertComputed === 'function' && typeof \
                 WeakMap.prototype.getOrInsert === 'function' && typeof \
                 WeakMap.prototype.getOrInsertComputed === 'function'"
            }
            Self::Uint8ArrayBase64 => {
                "typeof Uint8Array.fromBase64 === 'function' && typeof Uint8Array.fromHex === \
                 'function' && typeof Uint8Array.prototype.toBase64 === 'function' && typeof \
                 Uint8Array.prototype.toHex === 'function' && typeof \
                 Uint8Array.prototype.setFromBase64 === 'function' && typeof \
                 Uint8Array.prototype.setFromHex === 'function'"
            }
            Self::ErrorStackAccessor => {
                "(() => { const descriptor = Object.getOwnPropertyDescriptor(Error.prototype, \
                 'stack'); return typeof descriptor?.get === 'function' && typeof descriptor?.set \
                 === 'function'; })()"
            }
            Self::MathSumPrecise => "typeof Math.sumPrecise === 'function'",
            Self::IntlDurationFormat => "typeof Intl.DurationFormat === 'function'",
            Self::RegExpEscape => "typeof RegExp.escape === 'function'",
            Self::PromiseTry => "typeof Promise.try === 'function'",
            Self::Float16Array => {
                "typeof globalThis.Float16Array === 'function' && typeof \
                 DataView.prototype.getFloat16 === 'function' && typeof \
                 DataView.prototype.setFloat16 === 'function' && typeof Math.f16round === \
                 'function'"
            }
            Self::AtomicsPause => "typeof Atomics.pause === 'function'",
            Self::TailCallOptimization => {
                "(() => { 'use strict'; function recur(count) { if (count === 0) return true; \
                 return recur(count - 1); } try { return recur(100000); } catch { return false; } \
                 })()"
            }
            Self::ExplicitResourceManagement => {
                "typeof Symbol.dispose === 'symbol' && typeof Symbol.asyncDispose === 'symbol' && \
                 typeof globalThis.DisposableStack === 'function' && typeof \
                 globalThis.AsyncDisposableStack === 'function' && typeof \
                 globalThis.SuppressedError === 'function'"
            }
            Self::ErrorIsError => "typeof Error.isError === 'function'",
            Self::IntlLocaleInfo => {
                "typeof Intl.Locale === 'function' && ['getWeekInfo', 'getTimeZones', \
                 'getTextInfo', 'getHourCycles', 'getCollations', 'getNumberingSystems', \
                 'getCalendars'].every(name => typeof Intl.Locale.prototype[name] === 'function')"
            }
        }
    }

    const fn index(self) -> usize {
        self as usize
    }
}

/// Runtime support discovered from the exact Node executable used by workers.
#[derive(Debug, Clone)]
pub(crate) struct RuntimeFeatureSupport {
    support: [FeatureSupport; RuntimeFeature::ALL.len()],
}

impl RuntimeFeatureSupport {
    pub(crate) fn probe(node_binary: &Path) -> Result<Self> {
        let script = probe_script();
        let output = Command::new(node_binary)
            .arg("--eval")
            .arg(script)
            .output()
            .with_context(|| {
                format!(
                    "failed to probe Node runtime features with `{}`",
                    node_binary.display()
                )
            })?;
        if !output.status.success() {
            bail!(
                "Node runtime feature probe failed: {}",
                String::from_utf8_lossy(&output.stderr).trim()
            );
        }

        let results: Vec<bool> = serde_json::from_slice(&output.stdout).with_context(|| {
            format!(
                "Node runtime feature probe returned invalid JSON: {}",
                String::from_utf8_lossy(&output.stdout).trim()
            )
        })?;
        Self::from_results(&results)
    }

    pub(crate) fn from_results(results: &[bool]) -> Result<Self> {
        if results.len() != RuntimeFeature::ALL.len() {
            bail!(
                "Node runtime feature probe returned {} results, expected {}",
                results.len(),
                RuntimeFeature::ALL.len()
            );
        }

        let mut support = [FeatureSupport::Unsupported; RuntimeFeature::ALL.len()];
        for (feature, is_supported) in RuntimeFeature::ALL.into_iter().zip(results) {
            support[feature.index()] = if *is_supported {
                FeatureSupport::Supported
            } else {
                FeatureSupport::Unsupported
            };
        }
        Ok(Self { support })
    }

    pub(crate) fn support(&self, feature: RuntimeFeature) -> FeatureSupport {
        self.support[feature.index()]
    }

    pub(crate) fn unsupported(&self, metadata: &Metadata) -> Vec<RuntimeFeature> {
        RuntimeFeature::ALL
            .into_iter()
            .filter(|feature| {
                self.support(*feature) == FeatureSupport::Unsupported
                    && metadata
                        .features
                        .iter()
                        .any(|name| name == feature.metadata_name())
            })
            .collect()
    }

    pub(crate) fn unsupported_host(&self, metadata: &Metadata) -> Vec<RuntimeHostCapability> {
        RuntimeHostCapability::ALL
            .into_iter()
            .filter(|capability| capability.is_required(metadata))
            .collect()
    }
}

fn probe_script() -> String {
    let probes = RuntimeFeature::ALL
        .into_iter()
        .map(|feature| format!("() => Boolean({})", feature.probe_expression()))
        .collect::<Vec<_>>()
        .join(",");
    format!(
        "const probes=[{probes}];const results=probes.map(probe=>{{try{{return \
         probe();}}catch{{return false;}}}});process.stdout.write(JSON.stringify(results));"
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn maps_only_explicit_metadata_features() {
        let support =
            RuntimeFeatureSupport::from_results(&[false; RuntimeFeature::ALL.len()]).unwrap();
        let metadata = Metadata {
            features: vec!["Temporal".into(), "decorators".into(), "upsert".into()],
            ..Default::default()
        };

        assert_eq!(
            support.unsupported(&metadata),
            [RuntimeFeature::Temporal, RuntimeFeature::Upsert]
        );
    }

    #[test]
    fn respects_successful_capability_probes() {
        let mut results = [false; RuntimeFeature::ALL.len()];
        results[RuntimeFeature::Temporal.index()] = true;
        let support = RuntimeFeatureSupport::from_results(&results).unwrap();
        let metadata = Metadata {
            features: vec!["Temporal".into(), "ShadowRealm".into()],
            ..Default::default()
        };

        assert_eq!(
            support.unsupported(&metadata),
            [RuntimeFeature::ShadowRealm]
        );
        assert_eq!(
            support.support(RuntimeFeature::Temporal),
            FeatureSupport::Supported
        );
    }

    #[test]
    fn classifies_node_builtins_required_by_metadata_features() {
        let support =
            RuntimeFeatureSupport::from_results(&[false; RuntimeFeature::ALL.len()]).unwrap();
        let metadata = Metadata {
            features: vec![
                "explicit-resource-management".into(),
                "Error.isError".into(),
                "Intl.Locale-info".into(),
            ],
            ..Default::default()
        };

        assert_eq!(
            support.unsupported(&metadata),
            [
                RuntimeFeature::ExplicitResourceManagement,
                RuntimeFeature::ErrorIsError,
                RuntimeFeature::IntlLocaleInfo,
            ]
        );
    }

    #[test]
    fn table_has_unique_metadata_names() {
        let mut names = RuntimeFeature::ALL
            .map(RuntimeFeature::metadata_name)
            .into_iter()
            .collect::<Vec<_>>();
        names.sort_unstable();
        names.dedup();
        assert_eq!(names.len(), RuntimeFeature::ALL.len());
    }

    #[test]
    fn classifies_only_declared_host_capabilities() {
        let support =
            RuntimeFeatureSupport::from_results(&[true; RuntimeFeature::ALL.len()]).unwrap();
        let metadata = Metadata {
            features: vec!["IsHTMLDDA".into()],
            includes: vec!["atomicsHelper.js".into()],
            flags: vec![TestFlag::CanBlockIsFalse],
            ..Default::default()
        };

        assert_eq!(
            support.unsupported_host(&metadata),
            [
                RuntimeHostCapability::IsHtmlDda,
                RuntimeHostCapability::Agent,
                RuntimeHostCapability::AgentCanSuspendFalse,
            ]
        );
    }
}
