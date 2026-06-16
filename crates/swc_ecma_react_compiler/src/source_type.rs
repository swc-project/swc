use swc_ecma_ast::Program;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Language {
    JavaScript,
    TypeScript,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum ModuleKind {
    Script,
    Module,
}

/// Minimal source-type information needed by the semantic bridge.
///
/// This mirrors the OXC semantic builder's use of source type for behavior
/// splits such as TypeScript-specific binding rules and script-vs-module
/// strictness/Annex B behavior.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct SourceType {
    language: Language,
    module_kind: ModuleKind,
}

impl SourceType {
    pub const fn script() -> Self {
        Self {
            language: Language::JavaScript,
            module_kind: ModuleKind::Script,
        }
    }

    pub const fn module() -> Self {
        Self {
            language: Language::JavaScript,
            module_kind: ModuleKind::Module,
        }
    }

    pub fn from_program(program: &Program) -> Self {
        match program {
            Program::Module(_) => Self::module(),
            Program::Script(_) => Self::script(),
        }
    }

    pub const fn with_module(mut self, yes: bool) -> Self {
        self.module_kind = if yes {
            ModuleKind::Module
        } else {
            ModuleKind::Script
        };
        self
    }

    pub const fn with_typescript(mut self, yes: bool) -> Self {
        self.language = if yes {
            Language::TypeScript
        } else {
            Language::JavaScript
        };
        self
    }

    pub const fn is_module(self) -> bool {
        matches!(self.module_kind, ModuleKind::Module)
    }

    pub const fn is_script(self) -> bool {
        matches!(self.module_kind, ModuleKind::Script)
    }

    pub const fn is_typescript(self) -> bool {
        matches!(self.language, Language::TypeScript)
    }
}
