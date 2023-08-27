import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import { useLoaderData } from "react-router";
import { Link } from "react-router-dom";
import { getCSRFCookie } from "./APIHelpers";

function Search()
  {
    async function searchFriend(e)
    {
      let query = `http://127.0.0.1:8000/cookies/friendSearch?limit=10`;
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
          a.setAttribute("data-func", "search")
          e.target.parentNode.appendChild(a);
          for (i = 0; i < msg.length; i++)
          {
            b = document.createElement("li");
            b.setAttribute("class", "list-group-item");
            c = document.createElement("a");
            c.setAttribute("class", "nav-link");
            c.setAttribute("href", `user/${msg[i].username}`);
            c.innerHTML = msg[i].username;
            b.appendChild(c);
            a.appendChild(b);
          }
        })
      }
    }

    function removeLists()
    {
      let items = document.querySelectorAll("[data-func='search']");
      for (let i = 0; i < items.length; i++)
      {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  
    return (
        <form autoComplete="off" className="container-sm my-5 mx-auto" style={{maxWidth:400+"px"}}onSubmit={(e) => {e.preventDefault();}}>
          <div className="mb-3 px-1">
            <label for="cookieSearch" className="form-label">Search for Users</label>
            <input onChange={searchFriend} className="form-control" name="cookieSearch" id="cookieSearch" type="text"></input>
          </div>
        </form>
    )
  }

function Stats()
{
    const [stats, setStats] = useState([]);
    const query = `http://127.0.0.1:8000/cookies/friendStats`;
    async function getStats()
    {
        let data = await fetch(query, {
            credentials: 'include',
        });
        let jsonData = await data.json();
        setStats(jsonData);
        console.log(jsonData)
    }

    useEffect(() => {
        let ignore = false;
        if (!ignore)
        {
            getStats();
        }
        return () => {
            ignore = true;
        }
    }, [query])

    let top = Object.keys(stats).map((cookie, i) => {
        if (i > 2)
            return null;
        return (
            <Link to={`/cookies/${stats[cookie]}`}>
            <li className="list-group-item">
                {cookie}
            </li>
            </Link>
        )
    })

    let bottom = Object.keys(stats).map((cookie, i) => {
        if (i > Object.keys(stats).length - 4)
        {
            return (
                <Link to={`/cookies/${stats[cookie]}`}>
                <li className="list-group-item">
                    {cookie}
                </li>
                </Link>
            )
        }
        return null;
    })

    return (
        <div className="mx-5 fluid-container">
        <div className="row">
            <h1>Stats</h1>
            <div className="col-md-6">
            <div className="card">
                <div className="card-header">
                    Friends' Most Favorited 3 Cookies:
                </div>
                <ul className="list-group list-group-flush">
                    {top}
                </ul>
            </div>
            </div>
            <div className="col-md-6">
            <div className="card">
                <div className="card-header">
                    Friends' Least Favorited 3 Cookies:
                </div>
                <ul className="list-group list-group-flush">
                    {bottom}
                </ul>
            </div>
            </div>
        </div>
        </div>
    )
}

function SuggestedFriends()
{
    const [suggestions, setSuggestions] = useState([]);
    const query = 'http://127.0.0.1:8000/cookies/suggestions';
    async function getSuggestions()
    {
        let data = await fetch(query, {
            credentials: 'include'
        });
        let jsonData = await data.json();
        setSuggestions(jsonData);
    }

    useEffect(() => {
        let ignore = false;
        if (!ignore)
        {
            getSuggestions();
        }
        return () => {
            ignore = true;
        }
    }, [query]);

    let friendSuggestions = Object.keys(suggestions).map((friend) => {
        return (
            <Link to={`/user/${friend}`}>    
                <li className="list-group-item">{friend}</li>
            </Link>
        )
    })

    return (
        <div className="my-5">
            <h1>Suggested Friends</h1>
            {friendSuggestions}
        </div>
    )
}

function Friends()
{
    const user = useLoaderData();
    let friends = user ? user['following'].map( (friend, num ) => {
        return (
            <Link to={`/user/${friend['username']}`}>    
                <li className="list-group-item">{friend['username']}</li>
            </Link>
            )
    }) : null;
    
    return (
        <div className='container-fluid min-vh-100'>
            <Navbar />
            <Search />
            <Stats />
            <h1 className="my-5">Friends</h1>
            <ul className="list-group mx-5">
                {friends}
            </ul>
            <ul className="list-group mx-5">
                <SuggestedFriends />
            </ul>
        </div>
    )
}

export default Friends;