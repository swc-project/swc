let queue, rerenderQueue = [
    1
];
for(; rerenderQueue.length > 0;)queue = rerenderQueue.sort(), rerenderQueue = [], queue.forEach((c)=>console.log(c));
