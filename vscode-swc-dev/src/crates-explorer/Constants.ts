

export const RunCommand = 'rust.cratesExplorer.run';
export const DebugCommand = 'rust.cratesExplorer.debug';

export enum NodeType {
    Binary = 'bin',
    Crate = 'crate',
    Library = 'lib',
    Dep = 'dep',
    Deps = 'deps',

    Examples = 'examples',
    Example = 'example',

    TestFiles = 'testFiles',
    TestFile = 'testFile',
    TestFn = 'testFn',

    BenchFiles = 'benchFiles',
    BenchFile = 'benchFile',
    BenchFn = 'benchFn'
}


