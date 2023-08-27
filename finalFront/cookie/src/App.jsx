import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import './App.css'
import { updateCookie } from './APIHelpers'
import { useLoaderData } from 'react-router'
import { getCSRFCookie } from './APIHelpers'
import { Link } from 'react-router-dom'

function Search()
  {
    async function searchCookie(e)
    {
      let query = `http://127.0.0.1:8000/cookies/search?limit=10`;
      let input = e.target.value;
      let csrf = await getCSRFCookie('csrftoken');
      if (input === "")
      {
        removeLists();
        return;
      }
      else
      {
        let data = {
            "name": input,
        };
        fetch(query, {
            method: "POST", 
            headers: {
            "X-CSRFtoken": csrf,
            },
            body: JSON.stringify(data),
        })
        .then((errorMsg) => errorMsg.json())
        .then((msg) => {
          removeLists();
          let a, b, c, i, val = e.target.value;
          if (!val) { return false ;}
          a = document.createElement("ul");
          a.setAttribute("class", "list-group");
          e.target.parentNode.appendChild(a);
          for (i = 0; i < msg.length; i++)
          {
            b = document.createElement("li");
            b.setAttribute("class", "list-group-item");
            c = document.createElement("a");
            c.setAttribute("class", "nav-link");
            c.setAttribute("href", `cookies/${msg[i].id}`);
            c.innerHTML = msg[i].name;
            b.appendChild(c);
            a.appendChild(b);
          }
        })
      }
    }

    function removeLists()
    {
      let items = document.getElementsByClassName("list-group");
      for (let i = 0; i < items.length; i++)
      {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  
    return (
        <form autoComplete="off" className="container-sm my-5 mx-auto" style={{maxWidth:400+"px"}}onSubmit={(e) => {e.preventDefault();}}>
          <div className="mb-3 px-1">
            <label for="cookieSearch" className="form-label">Search for Cookies</label>
            <input onChange={searchCookie} className="form-control" name="cookieSearch" id="cookieSearch" type="text"></input>
          </div>
        </form>
    )
  }

function App()
{
  const [results, setResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [cookies, setCookies] = useState([]);
  const common = new Set();
  const who = useLoaderData();

  let query = `http://127.0.0.1:8000/cookies/?limit=10&offset=${offset}`;

  async function fetchCookies() {
    fetch(query).then((fetchedData) =>
    {
      fetchedData.json().then((fetchedJsonData) => {
          let temp = [...results, ...fetchedJsonData.results];
          if (offset <= fetchedJsonData.count || fetchedJsonData.count == null)
          {
              window.addEventListener('scroll', handleScroll);
          }
          setResults(temp);
          cookieUI(temp);
      })
    })
  }

  function handleScroll(event) {
    let y = window.innerHeight;
    let totalDocY = document.body.offsetHeight;
    let yScroll = window.scrollY;
    let pagePosition = totalDocY - (yScroll + y);
    if (pagePosition <= y) 
    {
      window.removeEventListener('scroll', handleScroll);
      setOffset(offset + 10);
    }
  }

  useEffect(() => {
    let ignore = false;
    if (!ignore)
    {
      fetchCookies();
    }
    return () => {
      ignore = true;
    };
  }, [query])

  async function tagCommonCookies(data)
  {
    let userCookies = who['user_upvotes'];
    let allCookies = data;
    for (let i = 0; i < userCookies.length; i++)
    {
      for (let j = 0; j < allCookies.length; j++)
      {
        if (userCookies[i]['id'] == allCookies[j]['id'])
        {
          common.add(userCookies[i]['id']);
        }
      }
    }
  }

  function cookieUI(data)
  {
    tagCommonCookies(data);
    let output = data.map((cookie, num) => {
      return (
      <div className="card w-75 px-5 mb-3 mx-auto" key={cookie.id} style={{maxWidth: 540 + 'px'}}>
        <Link to={`/cookies/${cookie.id}`}>
        <div className="row h-25" style={{color: 'black'}}>
          <div className="col-md-4">
            <img src={cookie.image_url} className="img-fluid rounded-start" style={{maxWidth: 150 + 'px'}} alt="..."></img>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className={'text-danger'}>{cookie.name}</h5>
              <p className="card-text">{cookie.description}</p>
            </div>
          </div>
        </div>
        </Link>
        {who == null ? null : <div className='d-flex justify-content-between mx-5'>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className="bi bi-check" viewBox="0 0 16 16">
            <path onClick={(event) => {
              if (event.target.attributes.fill.value != 'green')
              {
                let temp = document.querySelector(`[data-x='${cookie.id}']`);
                if (temp.attributes.fill.value == 'red')
                  temp.attributes.fill.value = 'currentColor';
                event.target.attributes.fill.value = "green";
                updateCookie(event, 'http://127.0.0.1:8000/cookies/favorite');
              }
            }} data-id={cookie.id} data-check={cookie.id} fill={common.has(cookie.id) ? "green" : "currentColor"} d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className="bi bi-x" viewBox="0 0 16 16">
                <path onClick={(event) => {
                  let temp = document.querySelector(`[data-check='${cookie.id}']`);
                  if (temp.attributes.fill.value == 'green')
                    temp.attributes.fill.value = 'currentColor';
                  event.target.attributes.fill.value = 'red';
                  updateCookie(event, 'http://127.0.0.1:8000/cookies/remove');
                }} data-id={cookie.id} data-x={cookie.id} fill="currentColor" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
          </div> }
      </div>
      )
    });
    setCookies(output);
    return output;
  }

  return (
    <div className='min-vh-100 w-100'>
      <Navbar/>
      <h1 className="my-5">All Cookies</h1>
      <Search />
      {cookies}
    </div>
  );
}

export default App
