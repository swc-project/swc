import*as a from"react";export default function b(){const[b,c]=a.useState({hits:[]}),[d,e]=a.useState("react");return a.useEffect(()=>{""!==d&&a();async function a(){const a=await fetch("https://hn.algolia.com/api/v1/search?query="+d),b=await a.json();c(b)}},[d]),<>

            <input value={d}onChange={a=>e(a.target.value)}/>

            <ul >

                {b.hits.map(a=><li key={a.objectID}>

                        <a href={a.url}>{a.title}</a>

                    </li>)}

            </ul>

        </>}
