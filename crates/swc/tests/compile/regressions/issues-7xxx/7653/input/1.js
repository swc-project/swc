/** Add your relevant code here for the issue to reproduce */
export default function Home() {
    return <div
        //TODO: Check if this is still needed after the approval of the new Ad Manager
        //! The following property might seem like it is doing nothing.
        //! However, it is important in order to prevent React from discarding
        //! the node's contents once hydration happens on the client.
        //! The contents of this node might change between the Server Side Rendering
        //! and the hydration, due to the registering of the slots that is done before hydration.
        dangerouslySetInnerHTML={{ __html: 'Hello World' }}
    />
}
