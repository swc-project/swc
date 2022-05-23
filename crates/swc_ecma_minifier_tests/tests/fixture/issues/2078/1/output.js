let rerenderQueue = [
    1
], queue;
for(; rerenderQueue.length > 0;)queue = rerenderQueue.sort(), rerenderQueue = [], queue.forEach((c)=>console.log(c));
