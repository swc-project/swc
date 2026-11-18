namespace Local {
    export namespace Nested {
        export const value = 1;
    }

    export interface Shape {
        name: string;
    }
}

namespace Dotted.Inner {
    export const value = 2;
}

import LocalAlias = Local.Nested;
import External = require("./external");

declare module "./external" {
    export interface ExternalShape {
        ready: boolean;
    }
}

declare global {
    var fixtureFlag: boolean;
}

enum Status {
    Ready = "ready",
    Waiting = 1,
    Done,
}

const aliases = [LocalAlias.value, External, Status.Done];

export as namespace FixtureAstRoundtrip;

export function App() {
    return <div data-kind="modules" />;
}

export {};
