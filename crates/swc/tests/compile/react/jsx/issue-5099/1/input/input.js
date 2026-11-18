/** @jsx h */
/** @jsxFrag */
import { h } from "preact";

import { Marked } from "markdown";

export const handler = {
    async GET(req, ctx) {
        const markdown = await Deno.readTextFile(`posts/${ctx.params.id}.md`);
        const markup = Marked.parse(markdown);
        const resp = await ctx.render({ markup });
        return resp;
    },
};

export default function Greet(props) {
    return (
        <>
            <div
                dangerouslySetInnerHTML={{
                    __html: props.data.markup.content,
                }}
            />
        </>
    );
}
