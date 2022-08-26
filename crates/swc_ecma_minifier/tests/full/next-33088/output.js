import*as t from"react";export default function e(){const[e,s]=t.useState({hits:[]}),[c,o]=t.useState("react");return t.useEffect(()=>{""!==c&&t();async function t(){const t=await fetch("https://hn.algolia.com/api/v1/search?query="+c),e=await t.json();s(e)}},[c]),<>

            <input value={c}onChange={t=>o(t.target.value)}/>

            <ul >

                {e.hits.map(t=><li key={t.objectID}>

                        <a href={t.url}>{t.title}</a>

                    </li>)}

            </ul>

        </>}
