async function searchItems(q, limit) {
    let r = await fetch(`/api?q=${q}&l=${limit}`);
    return r.ok ? r.json() : [];
}
export default function Panel(props) {
    let renders = useRef(0);
    renders.current++;
    let items = function(search = searchItems) {
        let [items, setItems] = useState([]);
        return useEffect(()=>{
            setItems([]);
        }, [
            search
        ]), items;
    }(props.search);
    return {
        renders: renders.current,
        items: items.length
    };
}
