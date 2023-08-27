import { useState, useEffect, Suspense } from 'react';
import Navbar from './Navbar';
import { getUserFromURI, updateCookie } from './APIHelpers';
import { useLoaderData } from 'react-router';
import React from 'react';
import { Link } from 'react-router-dom';


function AddFriendButton({ canAddFriend, Username })
{
  const [override, setOverride] = useState(0);

  async function add()
  {
    let query = `http://127.0.0.1:8000/cookies/friend/${Username}`;
    fetch(query, {
      method: "GET",
      credentials: 'include',
    });
    setOverride(2);
  }

  async function remove()
  {
    let query = `http://127.0.0.1:8000/cookies/remove/${Username}`;
    fetch(query, {
      method: "GET",
      credentials: 'include',
    });
    setOverride(1);
  }

  let input = canAddFriend;
  if ((input != "error" && override == 1) || (override == 0 && input === "eligible"))
  {
    return (
      <button className="btn btn-primary" onClick={add}>Add Friend</button>
    )
  }
  else if ((input != "error" && override == 2) || (override == 0 && input === "friend"))
  {
    return (
      <button className="btn btn-danger" onClick={remove}>Remove Friend</button>
    )
  }

  return (null)
}

function UserProfile()
{
  const [user, setUser] = useState([]);
  const [cookies, setCookies] = useState([]);
  const [friendStatus, setStatus] = useState("");
  const forceUpdate = React.useCallback((arg) => setCookies(arg), [])
  const who = useLoaderData();
  let common = new Set();

  let username = getUserFromURI();
  let query = `http://127.0.0.1:8000/cookies/user/${username}?format=json`;



  async function fetchUserData() {
    const data = await fetch(query);
    const output = await data.json();
    setUser(output);
    return output;
  }

  function rc(id) {
    let cUI = document.querySelectorAll('.card');
    for(let i = 0; i < cUI.length; i++)
    {
      if (cUI[i].dataset.id == parseInt(id))
      {
        cUI[i].style.display = 'none';
      }
    }
  }

  async function tagCommonCookies(data, status)
  {
    if (status == "error" || status == "" || data == null || who == null)
    {
      return;
    }
    let userCookies = who['user_upvotes'];
    let profileCookies = data['user_upvotes'];
    for (let i = 0; i < userCookies.length; i++)
    {
      for (let j = 0; j < profileCookies.length; j++)
      {
        if (userCookies[i]['id'] == profileCookies[j]['id'])
        {
          common.add(userCookies[i]['id']);
        }
      }
    }
  }

  async function addFriend()
  {
    let status = null;
    if (who == null || username == undefined || who['username'] == undefined)
    {
      
      status = "error";
    }
    else if (username == who['username'])
    {
      status = "error";
    }
    else if(who['following'][0] != undefined)
    {
      for (let i = 0; i < who['following'].length; i++)
      {
        if (who['following'][i]['username'] == username)
        {
          status = "friend";
        }
      }
    }
    if (status == null)
      status = "eligible";
    setStatus(status);
    return status;
  }

  async function updateCookieUI(data, status)
  {
    let cookieData = data['user_upvotes'];
    let uname = data['username'];
    let output = cookieData?cookieData.map(cookie => (
      <div data-id={cookie.id} key={cookie.id} className="card w-75 px-5 mb-3 mx-auto" style={{maxWidth: 540 + 'px', background: 'white'}}>
      <Link to={`/cookies/${cookie.id}`}>
      <div className="row g-0" style={{color: 'black'}}>
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
            if (who['username'] != uname && event.target.attributes.fill.value != 'green')
            {
              let temp = document.querySelector(`[data-x='${cookie.id}']`);
              if (temp.attributes.fill.value == 'red')
                temp.attributes.fill.value = 'currentColor';
              updateCookie(event, 'http://127.0.0.1:8000/cookies/favorite');
              event.target.attributes.fill.value = 'green';
            }
          }} data-check={cookie.id} fill={(status == 'friend' || status == 'eligible') ? (common.has(cookie.id) ? "green" : "currentColor") : "currentColor"} data-id={cookie.id} d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>
        <svg data-id={cookie.id} xmlns="http://www.w3.org/2000/svg" width="50" height="50" className="bi bi-x" viewBox="0 0 16 16">
          <path onClick={(event) => {
            updateCookie(event, 'http://127.0.0.1:8000/cookies/remove')
            .then( () => {
              if (who['username'] == uname)
              {
                rc(event.target.dataset.id);
              }
              else
              {
                let temp = document.querySelector(`[data-check='${cookie.id}']`);
                if (temp.attributes.fill.value == 'green')
                  temp.attributes.fill.value = 'currentColor';
                event.target.attributes.fill.value = "red";
              }
            })
          }} data-id={cookie.id} data-x={cookie.id} fill="currentColor" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </div> }
    </div>
    )):null
    forceUpdate(output);
    console.log(cookies);
    return output;
  }
  useEffect(() => {
    let ignore = false;
    if (!ignore)
    {
      forceUpdate([]);
      let fetchUser = fetchUserData();
      fetchUser.then((data) => {
        let addFriendUpdate = addFriend();
        addFriendUpdate.then((status) => {
            let commonCookies = tagCommonCookies(data, status);
            commonCookies.then(() => {
              updateCookieUI(data, status)
            });
        });
      })
    }
    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <Suspense>
      <div className='container-fluid min-vh-100'>
        <Navbar />
        <div className='my-5'>
          <h1 className='my-1'>{user['username']}'s favorite cookies</h1>
          <AddFriendButton canAddFriend={friendStatus} Username={user['username']}/>
        </div>
        {cookies}
      </div>
    </Suspense>
  )
}

export default UserProfile