type PanelMode = "on";
const typedPanel = <UI.Panel<PanelMode> x="on" />;

export function App<T extends string = "on">(x: T): React.ReactElement {
    const panelProps = {
        hidden: false,
        role: "status",
    };

    return (
        <section data-id={dashboard.id} {...panelProps}>
            <UI.Panel<T> x={x} title={`Status: ${Status.Ready}`}>
                <strong>{dashboard.user.name}</strong>
                <svg:path xml:space="preserve" d={icons.ready} />
                <>
                    {dashboard.count > 0 ? (
                        <span>{/* live count */}</span>
                    ) : null}
                </>
                {...dashboard.actions}
            </UI.Panel>
        </section>
    );
}
