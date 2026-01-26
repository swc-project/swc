/**
 * SWC Compress Bug - Playground Reproduction
 * ==========================================
 *
 *
 * Steps:
 * 1. Run the output → logs "BUG: expected A, got B"
 * 2. Disable compress and run again → logs "OK: got A"
 *
 * Bug: When SWC's compress is enabled, a class property that calls
 * a function which returns a closure will have that closure capture
 * values from the LAST instance instead of its own.
 */

const wrap = (cb) => () => cb();

class Base {
    constructor(props) {
        this.props = props;
    }
}

class C extends Base {
    fn = wrap(this.props.cb);
}

// Test
const a = new C({ cb: () => "A" });
const b = new C({ cb: () => "B" });

const result = a.fn();

console.log(result === "A" ? "OK: got A" : "BUG: expected A, got " + result);
