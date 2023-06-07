const onChange = useCallback<<T extends keyof typeof initialState>(key: T, value: typeof initialState[T]) => void>(
  );