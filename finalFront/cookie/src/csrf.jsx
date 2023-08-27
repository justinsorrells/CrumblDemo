import React from "react";
import { useState, useEffect } from "react";
import { getCSRFCookie } from "./APIHelpers";
function CSRFToken()
{
    const [csrf, setCSRF] = useState('');
    let name = 'csrftoken';
    async function getCSRF()
    {
        let csrftoken = await getCSRFCookie(name);
        setCSRF(csrftoken);
        document.cookie = `csrftoken=${csrftoken}; Max-Age=31449600; Path=/; SameSite=Lax`
    }

    useEffect(() => {
        let ignore = false;
        if (!ignore)
            getCSRF();
        return () => {
            ignore = true;
        };
    }, [name]);

    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrf}></input>
    );
}

export default CSRFToken;
