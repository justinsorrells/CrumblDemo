export async function getCSRFCookie(name)
{
    let cookieValue = null;
    let test = null;
    if (document.cookie && document.cookie !== '')
    {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++)
        {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '='))
            {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    if (cookieValue === null)
    {
        let cookieValue = await fetch("http://127.0.0.1:8000/cookies/csrf/");
        test = await cookieValue.text();
        return test;
    }
    return cookieValue;
}

export async function getCookie(name)
{
    let cookieValue = null;
    if (document.cookie && document.cookie !== '')
    {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++)
        {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '='))
            {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
}

export async function updateCookie(event, query)
{
  let targetId = event.target.dataset.id;
  let csrf = await getCSRFCookie('csrftoken');
  fetch(query, {
    method: "POST",
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrf,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"id": targetId}),
  })
}

export function getUserFromURI()
{
  let user = null;
  let URI = window.location.pathname.split('/');
  for (let i = 0; i < URI.length; i++)
  {
    if (URI[i] === "user")
    {
      user = URI[i + 1];
      break;
    }
  }
  return user;
}

export async function getLeaderboard()
{
  let query = 'http://127.0.0.1:8000/cookies/leaderboard'
  let data = await fetch(query);
  let jsonData = await data.json();
  return jsonData;
}