import { useEffect } from "react";
import { useParams, useLoaderData } from "react-router";
import { useState } from "react";
import { updateCookie } from "./APIHelpers";
import { getCSRFCookie } from "./APIHelpers";
import Navbar from "./Navbar";

function Cookie() 
{
    const [cookie, setCookie] = useState([]);
    const who = useLoaderData();
    const common = new Set();
    let { cookieId } = useParams();
    let query = `http://127.0.0.1:8000/cookies/${cookieId}`;
    
    async function fetchCookieDetails()
    {
        fetch(query)
        .then((data) => data.json())
        .then((jsonMsg) => {
            tagCommonCookies(jsonMsg);
        });
    }

    async function getAverageRating()
    {
        const csrf = await getCSRFCookie('csrftoken');
        let data = {
            "cookie": cookieId,
        };
        fetch('http://127.0.0.1:8000/cookies/get_average_rating', 
        {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRFtoken": csrf,
            },
            body: JSON.stringify(data),
        })
        .then((data) => data.json())
        .then((response) => {
            let avgUI = document.querySelector('#avg');
            if (avgUI)
                avgUI.textContent = `${response.rating} `;
        })
    }

    async function getUserRating()
    {
        const csrf = await getCSRFCookie('csrftoken');
        let data = {
            "cookie": cookieId,
        };
        fetch('http://127.0.0.1:8000/cookies/get_user_rating', 
        {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRFtoken": csrf,
            },
            body: JSON.stringify(data),
        })
        .then((data) => data.json())
        .then((response) => {
            resetRating();
            let stars = document.querySelectorAll(".bi-star");
            if (stars)
            {
                for (let i = 0; i < response.userRating; i++)
                {
                    console.log(stars[i]);
                    stars[i].removeAttribute("bi-star");
                    stars[i].setAttribute("class", "bi-star-fill");
                }
            }
        })
    }

    function tagCommonCookies(data)
    {
        if (who !== null)
        {
            let userCookies = who['user_upvotes'];
            console.log(data);
            for (let i = 0; i < userCookies.length; i++)
            {
                if (userCookies[i]['id'] == data['id'])
                {
                    common.add(data.id);
                }
            }
        }
        updateUI(data);
    }

    function resetRating()
    {
        let stars = document.querySelectorAll('[data-star]');
        for (let i = 0; i < stars.length; i++)
        {
            stars[i].removeAttribute("bi-star-fill");
            stars[i].setAttribute("class", "bi-star");
        }
    }

    async function postRating(num)
    {
        const csrf = await getCSRFCookie('csrftoken');
        let query = `http://127.0.0.1:8000/cookies/rate`;
        let data = {
            "id" : cookieId,
            "value": num,
        };
        fetch(query, {
            method: "POST", 
            credentials: "include", 
            headers: {
                "X-CSRFtoken": csrf,
            },
            body: JSON.stringify(data),
        })
        .then(() => getAverageRating());
    }

    async function rateCookie(e)
    {
        if (e.target.id !== "star-box")
        {
            resetRating();
            let rating = e.target.dataset.star;
            let stars = document.querySelectorAll(".bi-star");
            postRating(rating);
            for (let i = 0; i < rating; i++)
            {
                console.log(stars[i]);
                stars[i].removeAttribute("bi-star");
                stars[i].setAttribute("class", "bi-star-fill");
            }
        }
    }

    function updateUI(data)
    {
        let cookie = data;
        let output = (
            <div className="card w-75 px-5 mb-3 mx-auto" key={cookie.id} style={{maxWidth: 540 + 'px'}}>
            <div className="row h-25">
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
            {who == null ? null : <div onClick={rateCookie} className='d-flex justify-content-between mx-5 my-3' id="star-box">
                <i className="bi bi-star" data-star="1"></i>
                <i className="bi bi-star" data-star="2"></i>
                <i className="bi bi-star" data-star="3"></i>
                <i className="bi bi-star" data-star="4"></i>
                <i className="bi bi-star" data-star="5"></i>
            </div> }
            <div>Average Rating: <span id="avg">{cookie.rating} </span><i className="bi bi-star-fill" data-star="5"></i>'s</div>
            {who == null ? null : <div className='d-flex justify-content-between mx-5 my-3'>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className="bi bi-check" viewBox="0 0 16 16">
                <path onClick={(event) => {
                if (event.target.attributes.fill.value != 'green')
                {
                    let temp = document.querySelector(`[data-x='${cookie.id}']`);
                    if (temp.attributes.fill.value == 'red')
                    temp.attributes.fill.value = 'currentColor';
                    event.target.attributes.fill.value = "green";
                    updateCookie(event, 'http://127.0.0.1:8000/cookies/favorite');
                    console.log(common.has(cookie.id))
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
        setCookie(output);
        getUserRating();
    }

    useEffect(() => {
        let ignore = false;
        if (!ignore)
        {
            fetchCookieDetails();
        }
        return () => 
        {
            ignore=true;
        };
    }, [query])

    return (
        <div className='min-vh-100 w-100'>
        <Navbar />
            {cookie}
        </div>
    )
}

export default Cookie;