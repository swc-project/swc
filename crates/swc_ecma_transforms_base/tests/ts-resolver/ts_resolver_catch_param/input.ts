function wrapper(...args) {
    try {
        return target(...args);
    } catch (err) {
        switch (err.name) {
        }
    }
}
