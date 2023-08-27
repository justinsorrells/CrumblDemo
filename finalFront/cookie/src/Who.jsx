async function whoAmI()
{
  let query = 'http://127.0.0.1:8000/cookies/who/';
  const data = await fetch(query, 
    {
     method: "GET",
     credentials: "include",
    });
  let name = null;
  try
  {
    name = await data.text()
  }
  catch (e)
  {
    console.error(e);
  }
  return name;
}

export async function userProfile()
{
  let username = await whoAmI();
  if (username.length < 1)
    return null;
  let query = `http://127.0.0.1:8000/cookies/user/${username}`;
  const data = await fetch(query);
  try 
  {
    const jsonData = await data.json();
    return jsonData;
  }
  catch (e)
  {
    console.error(e);
    return null;
  }
}

export default whoAmI;