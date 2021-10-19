export function getAllEntities(state) {
    const { ids , entities  } = state;
    return ids.map((id)=>entities[id]
    );
}
export function getEntity(id, state) {
    const { ids , entities  } = state;
    if (ids.includes(id)) return entities[id];
}
export class c {
    constructor(){
        this.a = "b", this.a = "b";
    }
}
for (const action of [
    "resizeTo",
    "resizeBy"
])window[action] = (x, y)=>{
    window[action](x, y);
};
