const setAction = (fields) =>
    setCurrentAction({
        ...(<HeaderAction>getCurrentAction()),
        ...fields,
    });
