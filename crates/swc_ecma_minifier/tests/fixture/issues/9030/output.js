var FRUITS_MANGO = "mango", getMangoLabel = (label)=>label[FRUITS_MANGO];
export default ((name)=>{
    if (name === FRUITS_MANGO) return getMangoLabel;
});
