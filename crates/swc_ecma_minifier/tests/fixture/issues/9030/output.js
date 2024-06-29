var FRUITS_MANGO = "mango", getMangoLabel = (label)=>label[FRUITS_MANGO];
const default_export = (name)=>{
    if (name === FRUITS_MANGO) return getMangoLabel;
};
export { default_export as default };
