const apiUrl = "http://127.0.0.1:3000/";

export const api = {
    get: async function (path, params) {
        try {
            const res = await fetch(apiUrl + path, {
                credentials: 'include'
            });
            return res.json();
        } catch (error) {
            console.log(error)
            // return Promise.reject(error)
        }
    },
    call: async function (path, req, method, params) {
        try {
            const options = {
                method: method || 'POST',
                credentials: 'include',
                headers: {
                    "Content-type": "application/json",
                    "mode": "cors"
                },
                body: JSON.stringify(req)
            }

            const response = await fetch(apiUrl + path, options);

            if (response.ok) {
                return response.json();
            }
            else {
                return response.json().then(json => { 
                    throw json
                })
            }
        } catch (error) {
            console.log(error);
            // return Promise.reject(error);
        }
    }
}

export const user = {
    signup: function (request) {
        return api.call("users", request)
    },
    signin: function (request) {
        return api.call("users/signin",request)
    },
    signout: function () {
        return api.call("users/signout")
    },
    current: function () {
        return api.get("users/get_current_user")
    }
}