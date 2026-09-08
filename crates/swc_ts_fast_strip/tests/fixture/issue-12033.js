// keep as-is
const assigned =    
(value   ) => value;

const asyncArrow = async(  
 value   ) => value;

function returnsOne() {
  return (  
   value   ) => value, 1;
}

function throwOne() {
  throw (  
   value   ) => value, 1;
}

function *yieldOne() {
  yield (  
   value   ) => value, 1;
}
