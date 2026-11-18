const Context = createContext<<Key extends keyof Config>(key: Key) => Config[Key]>(
    (key) => properties[key]?.default
);