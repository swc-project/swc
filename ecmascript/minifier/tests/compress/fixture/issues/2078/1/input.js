let rerenderQueue = [1];
let queue;

while (rerenderQueue.length > 0) {
    queue = rerenderQueue.sort();
    rerenderQueue = [];
    queue.forEach((c) => console.log(c));
}
