export default function(e,r,t,o,n,a,u){try{var c=e[a](u),l=c.value}catch(e){t(e);return}c.done?r(l):Promise.resolve(l).then(o,n)};
