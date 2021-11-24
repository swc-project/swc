const App = () => {
    let a = [1, 2, 3];
    return <ul>
        {a.map(item => <li key={item}>{item}</li>)}
    </ul>
};
