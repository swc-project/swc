var c = 100, log = [];
((c)=>{
    c = 1 + c, log.push(c), c = 0, log.push(c), log.push(c = 1 + c), 0 !== 23..toString() && log.push(c = 1 + c);
})(-1), console.log(log.join(','), c);
