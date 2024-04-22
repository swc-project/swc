//// [controlFlowInstanceOfGuardPrimitives.ts]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function distinguish(thing) {
    _instanceof(thing, Object) ? console.log("Aha!! It's a Date in " + thing.getFullYear()) : 'string' == typeof thing ? console.log("Aha!! It's a string of length " + thing.length) : console.log("Aha!! It's the number " + thing.toPrecision(3));
}
distinguish(new Date()), distinguish("beef"), distinguish(3.14159265);
