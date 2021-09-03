const x = <P extends object>(
    a: React.ComponentType<P>
): React.ComponentType<P & { a: string }> => React.memo();
