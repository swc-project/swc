import * as React from "react";

export default function Index() {
    const [data, setData] = React.useState({ hits: [] });
    const [query, setQuery] = React.useState("react");

    React.useEffect(() => {
        if (query === "") return;

        function getFetchUrl() {
            return "https://hn.algolia.com/api/v1/search?query=" + query;
        }

        async function fetchData() {
            const res = await fetch(getFetchUrl());
            const data = await res.json();
            setData(data);
        }

        fetchData();
    }, [query]);

    return (
        <>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            <ul>
                {data.hits.map((item) => (
                    <li key={item.objectID}>
                        <a href={item.url}>{item.title}</a>
                    </li>
                ))}
            </ul>
        </>
    );
}
