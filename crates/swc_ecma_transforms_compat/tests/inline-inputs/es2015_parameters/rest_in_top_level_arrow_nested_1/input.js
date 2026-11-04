
    const arrow = (...args) => (this, () => (...args) => {
      console.log(this, args);
    })
    