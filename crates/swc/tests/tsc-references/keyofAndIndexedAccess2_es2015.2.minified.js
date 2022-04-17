export function getAllEntities(state) {
    let { ids , entities  } = state;
    return ids.map((id)=>entities[id]
    );
}
export function getEntity(id, state) {
    let { ids , entities  } = state;
    if (ids.includes(id)) return entities[id];
}
export class c {
    constructor(){
        this.a = "b", this.a = "b";
    }
}
for (let action of [
    'resizeTo',
    'resizeBy'
])window[action] = (x, y)=>{
    window[action](x, y);
};
