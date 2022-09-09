import*as t from"react";export default function e(){const[e,i]=t.useState({hits:[]}),[u,c]=t.useState("react");return t.useEffect(()=>{""!==u&&t();async function t(){const t=await fetch("https://hn.algolia.com/api/v1/search?query="+u),e=await t.json();i(e)}},[u]),<>

            <input value={u}onChange={t=>c(t.target.value)}/>

            <ul >

                {e.hits.map(t=><li key={t.objectID}>

                        <a href={t.url}>{t.title}</a>

                    </li>)}

            </ul>

        </>};
