export default function SingleProjectPage({
    frontmatter,
    code,
}: SingleProjectPageProps) {
    const Component = useMemo(() => getMDXComponent(code), [code]);

    return <Component components={...MDXComponents as any}></Component>;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params!["slug"] as string;
    const { code, frontmatter } = await getFileBySlugAndType(slug, "projects");
    return {
        props: { frontmatter: frontmatter as ProjectFrontMatter, code },
    };
};
