export default function(e,r,t,n,o,a,u){try{var c=e[a](u),l=c.value}catch(e){t(e);return}c.done?r(l):Promise.resolve(l).then(n,o)};
