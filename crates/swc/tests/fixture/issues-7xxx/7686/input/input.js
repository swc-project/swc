const WorkingComponent = () => {
    const options = ["a", "b", "c"];
    const spreadableStyles = { style: { color: "green" } };
    return <div>
        {options.map(o => {
            const caption = `${o}-working`
            const key = `${o}-key`
            return <div className="whatever" key={key} {...spreadableStyles}><div>{caption}</div><div /></div>
        })}
    </div>
}

const BrokenComponent = () => {
    const options = ["1", "2", "3"];
    const spreadableStyles = { style: { color: "red" } };
    return <div>
        {options.map(o => {
            const caption = `${o}-broken`
            const key = `${o}-key`
            return <div className="whatever" {...spreadableStyles} key={key}><div>{caption}</div><div /></div>
        })}
    </div>
}

export default function App() {
    return (
        <div className="App">
            <WorkingComponent />
            <BrokenComponent />
        </div>
    );
}