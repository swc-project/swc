function a({ b = [] }: { b: C[] }) {
    const t = useMemo(() => {
        return [
            // Cmt1
            ...a.slice(0, 1),
            // Cmt2
            ...b,
            // Cmt3
            ...c.slice(1),
        ];
    }, [frameworks]);

    return 1;
}

export default a;
