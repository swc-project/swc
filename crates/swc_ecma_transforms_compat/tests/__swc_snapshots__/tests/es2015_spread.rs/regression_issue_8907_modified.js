const arr = [];
arr.concat = ()=>{
    throw new Error('Should not be called');
};
const x = _to_consumable_array(arr);
