'use strict';

// ArrowFunctionExpression
["Model", "View", "Controller"].forEach(name => console.log(name));

// ClassBody, ClassDeclaration, MethodDefinition
class Socket {
    constructor(port) {
        // ...
    }
    open() {
        // ...
    }
    close() {
        // ...
    }
}

// ClassExpression
var WebSocket = class extends Socket {
    // ...
};

// ExportBatchSpecifier, ExportDeclaration
export * from 'lib/network';

// ExportSpecifier
export { Socket };

// ImportDeclaration, ImportSpecifier
import { Packet } from 'lib/data';