function emit(type) {
    const e = events[type];
    if (Array.isArray(e)) for(let i = 0; i < e.length; i += 1)e[i].apply(this);
}
