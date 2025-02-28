export default function(a,r,u,t,n,c,l){try{var o=a[c](l),e=o.value}catch(e){u(e);return}o.done?r(e):Promise.resolve(e).then(t,n)}
