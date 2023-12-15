export const SearchLayoutRoot = ({
    children,
    sx,
    ...others
}: SearchLayoutRootProps) => (
    <Box sx={[styles, ...packSX(sx)]} {...others}>
        {children}
    </Box>
);
