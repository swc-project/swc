import _object_spread from "@swc/helpers/lib/_object_spread.js";
export const a = f`
    hello
    ${(stuff)=>stuff.x}
    brave
    ${(stuff)=>stuff.y}
    world
    ${(stuff)=>stuff.z}
`;
export const b = g`
    hello
    ${(stuff)=>stuff.x}
    brave
    ${(stuff)=>stuff.y}
    world
    ${(stuff)=>stuff.z}
`;
export let c = obj["prop"]`${(input)=>_object_spread({}, input)}`;
c.returnedObjProp.x;
c.returnedObjProp.y;
c.returnedObjProp.z;
c = obj.prop`${(input)=>_object_spread({}, input)}`;
c.returnedObjProp.x;
c.returnedObjProp.y;
c.returnedObjProp.z;
