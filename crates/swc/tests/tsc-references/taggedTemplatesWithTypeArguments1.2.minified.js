//// [taggedTemplatesWithTypeArguments1.ts]
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
export let c = obj.prop`${(input)=>({
        ...input
    })}`;
c.returnedObjProp.x, c.returnedObjProp.y, c.returnedObjProp.z, (c = obj.prop`${(input)=>({
        ...input
    })}`).returnedObjProp.x, c.returnedObjProp.y, c.returnedObjProp.z;
