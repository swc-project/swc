var FRUITS_MANGO = "mango", getMangoLabel = (label)=>label[FRUITS_MANGO];
export default ((name)=>{
    // Breaks with switch case
    if (name === FRUITS_MANGO) return getMangoLabel;
// Works with if else
// if (name === FRUITS.MANGO) {
//     return getMangoLabel;
// }
});
