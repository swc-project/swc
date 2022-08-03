import*as t from"react";export default function e(){const[e,s]=t.useState({hits:[]}),[n,o]=t.useState("react");return t.useEffect(()=>{""!==n&&t();async function t(){const t=await fetch("https://hn.algolia.com/api/v1/search?query="+n),e=await t.json();s(e)}},[n]),<>

            <input value={n}onChange={t=>o(t.target.value)}/>

            <ul >

                {e.hits.map(t=><li key={t.objectID}>

                        <a href={t.url}>{t.title}</a>

                    </li>)}

            </ul>

        </>}
