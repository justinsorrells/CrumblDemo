import Navbar from "./Navbar"
import { useNavigate } from "react-router";
import { getCSRFCookie } from "./APIHelpers";

function Login() {
  let navigate = useNavigate();
  function resetErrorMsgs()
  {
      let all = document.querySelectorAll('.text-danger');
      for (let i = 0; i < all.length; i++)
      {
          all[i].textContent = "";
      }
  }

  function updateUIMessage(msg)
  {
      for (let i = 0; i < Object.keys(msg).length; i++)
      {
          let temp = document.querySelector(`#${Object.keys(msg)[i]}`);
          console.log(temp);
          temp.textContent = `${Object.values(msg)[i]}`;
      }
  }

  async function submitLogin()
  {
      resetErrorMsgs();
      let query = 'http://127.0.0.1:8000/cookies/auth/';
      let csrf = await getCSRFCookie('csrftoken');
      let username = document.querySelector("#username").value;
      let password = document.querySelector("#password").value;
      let data = {
          'username': username, 
          'password': password,
      }
      let output = fetch(query, {
          method: "POST", 
          credentials: 'include',
          headers: {
              'X-CSRFToken': csrf,
          },
          body: JSON.stringify(data),
      });
      output.then((error) => 
      {
          let errorMsg = error.json();
          errorMsg.then((msg) => {
              if (Object.keys(msg).length !== 0)
              {  
                console.log(msg);
                updateUIMessage(msg);
              }
              else
              {
                  navigate(`/user/${username}`);
              }
          });
      })
  }
    return (
      <div className="min-vh-100 container-fluid">
        <Navbar />
        <form className="container-sm my-5" onSubmit={(e) => {e.preventDefault();}}>
            <div className="mb-3 px-3 mx-4">
                <label for="username" className="form-label">Username</label>
                <input required id="username" name="username" type="text" className="form-control"></input>
                <div id="validationUsername" class="text-danger"></div>
            </div>
            <div className="mb-3 px-3 mx-4">
                <label for="password" className="form-label">Password</label>
                <input required id="password" name="password" type="password" className="form-control"></input>
                <div id="validationPassword" class="text-danger"></div>
            </div>
            <button onClick={submitLogin} className="btn btn-primary">Login</button>
        </form>
      </div>
    )
  }

export default Login