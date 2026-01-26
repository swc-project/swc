use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub fn strip_node_colon_prefix(unresolved_mark: Mark) -> impl Pass {
    visit_mut_pass(NodeColonPrefixStrip {
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
    })
}

struct NodeColonPrefixStrip {
    unresolved_ctxt: SyntaxContext,
}

impl VisitMut for NodeColonPrefixStrip {
    noop_visit_mut_type!();

    fn visit_mut_import_decl(&mut self, node: &mut ImportDecl) {
        if let Some(value) = Self::strip_node_colon(&node.src.value.to_string_lossy()) {
            node.src.value = value.into();
            node.src.raw = None;
        }
    }

    fn visit_mut_named_export(&mut self, node: &mut NamedExport) {
        let Some(src) = &mut node.src else {
            return;
        };
        if let Some(value) = Self::strip_node_colon(&src.value.to_string_lossy()) {
            src.value = value.into();
            src.raw = None;
        }
    }

    fn visit_mut_export_all(&mut self, node: &mut ExportAll) {
        if let Some(value) = Self::strip_node_colon(&node.src.value.to_string_lossy()) {
            node.src.value = value.into();
            node.src.raw = None;
        }
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        node.visit_mut_children_with(self);

        match &node.callee {
            Callee::Import(..) => {}
            Callee::Expr(expr)
                if expr
                    .as_ident()
                    .is_some_and(|id| id.sym == "require" && id.ctxt == self.unresolved_ctxt) => {}
            _ => return,
        }

        if let Some(source) = node
            .args
            .first_mut()
            .and_then(|arg| arg.expr.as_mut_lit())
            .and_then(|lit| lit.as_mut_str())
        {
            if let Some(value) = Self::strip_node_colon(&source.value.to_string_lossy()) {
                source.value = value.into();
                source.raw = None;
            }
        }
    }
}

impl NodeColonPrefixStrip {
    /// Only Strip known `node:` prefixes.
    /// There are some modules only available in the `node:` namespace which we
    /// should not strip.
    ///
    /// You can use the following code to generate this list:
    /// ```JavaScript
    /// require("node:module").builtinModules.filter((m) => !m.startsWith("node:"))
    /// ```
    fn strip_node_colon(value: &str) -> Option<&str> {
        value.strip_prefix("node:").filter(|value| {
            matches!(
                *value,
                "_http_agent"
                    | "_http_client"
                    | "_http_common"
                    | "_http_incoming"
                    | "_http_outgoing"
                    | "_http_server"
                    | "_stream_duplex"
                    | "_stream_passthrough"
                    | "_stream_readable"
                    | "_stream_transform"
                    | "_stream_wrap"
                    | "_stream_writable"
                    | "_tls_common"
                    | "_tls_wrap"
                    | "assert"
                    | "assert/strict"
                    | "async_hooks"
                    | "buffer"
                    | "child_process"
                    | "cluster"
                    | "console"
                    | "constants"
                    | "crypto"
                    | "dgram"
                    | "diagnostics_channel"
                    | "dns"
                    | "dns/promises"
                    | "domain"
                    | "events"
                    | "fs"
                    | "fs/promises"
                    | "http"
                    | "http2"
                    | "https"
                    | "inspector"
                    | "inspector/promises"
                    | "module"
                    | "net"
                    | "os"
                    | "path"
                    | "path/posix"
                    | "path/win32"
                    | "perf_hooks"
                    | "process"
                    | "punycode"
                    | "querystring"
                    | "readline"
                    | "readline/promises"
                    | "repl"
                    | "stream"
                    | "stream/consumers"
                    | "stream/promises"
                    | "stream/web"
                    | "string_decoder"
                    | "sys"
                    | "timers"
                    | "timers/promises"
                    | "tls"
                    | "trace_events"
                    | "tty"
                    | "url"
                    | "util"
                    | "util/types"
                    | "v8"
                    | "vm"
                    | "wasi"
                    | "worker_threads"
                    | "zlib"
            )
        })
    }
}
