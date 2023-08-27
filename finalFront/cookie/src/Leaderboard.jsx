import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

function Leaderboard() 
{
  const [results, setResults] = useState([]);
  const [offset, setOffset] = useState(0);
  let query = `http://127.0.0.1:8000/cookies/leaderboard?limit=10&offset=${offset}`;

  async function fetchCookies() {
    fetch(query).then((fetchedData) =>
    {
      console.log(fetchedData)
      fetchedData.json().then((fetchedJsonData) => {
        console.log(fetchedJsonData.results)
          let temp = [...results, ...fetchedJsonData.results];
          setResults(temp);
          if (offset <= fetchedJsonData.count || fetchedJsonData.count == null)
          {
              window.addEventListener('scroll', handleScroll);
          }
      })
    })
  }

  function handleScroll(event) {
    let y = window.innerHeight;
    let totalDocY = document.body.offsetHeight;
    let yScroll = window.scrollY;
    let pagePosition = totalDocY - (yScroll + y);
    if (pagePosition < y) 
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

    let cookies = results.map( (cookie, num ) => {
      let i = Math.floor(cookie.rating);
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
            <div className='d-flex justify-content-around my-3' id="star-box">
                <i className={i-- > 0 ? "bi bi-star-fill" : "bi bi-star"} data-star="1"></i>
                <i className={i-- > 0 ? "bi bi-star-fill" : "bi bi-star"} data-star="2"></i>
                <i className={i-- > 0 ? "bi bi-star-fill" : "bi bi-star"} data-star="3"></i>
                <i className={i-- > 0 ? "bi bi-star-fill" : "bi bi-star"} data-star="4"></i>
                <i className={i-- > 0 ? "bi bi-star-fill" : "bi bi-star"} data-star="5"></i>
            </div>
            <span className="my-2" id="avg">({cookie.rating})</span>
            </div>
            )
    })
    return (
        <div>
            <Navbar />
            {cookies}
        </div>
    )
}

export default Leaderboard;