export default function(e,t,r,n,a,o,u){try{var c=e[o](u),l=c.value}catch(v){r(v);return}c.done?t(l):Promise.resolve(l).then(n,a)};
