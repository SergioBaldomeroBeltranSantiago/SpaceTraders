/**
 * Class to manage requests to the endpoints.
 * Use this class to initiate any request.
 * 
 * The base URL is 'https://api.spacetraders.io/v2'
 */
class Requests {

    #BASE_URL = 'https://api.spacetraders.io/v2'

    /**
     * Create a Request manager.
     * @class
     */
    constructor() {}
    
    /**
     * Send a GET request to the endpoint with agent token
     * @param {String} endpoint the API endpoint to hit. Example: '/my/agent'
     * @param {String} token the authorization token for the agent. If token is null, it will send a typical GET request. Default is null
     * @returns {Object} the response body
     */
    async get(endpoint, token = null) {
        let options
        
        if (token != null) {
            options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }
        } else {
            options = {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        }

        const URL = this.#BASE_URL + endpoint

        const res = await fetch(URL, options)
        if (!res.ok) {
            const { error } = await res.json()
            throw new Error(`\nCode: ${error.code}\nMessage: ${error.message}\n${(error.data) ? 'Data: ' + JSON.stringify(error.data) : ''}`)
        }
        return await res.json()
    }
    
    /**
     * Send a POST request to the endpoint with authorization token
     * @param {String} endpoint the API endpoint to hit. Example: '/my/agent'
     * @param {String} token the authorization token for the agent
     * @param {Object} body the request object
     * @returns {Object} the response body
     * @throws a generic error explaining what went wrong. It contains the error code, the message and the data if any was returned by the endpoint.
     */
    async post(endpoint, token, body) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        }

        const URL = this.#BASE_URL + endpoint

        const res = await fetch(URL, options)
        if (!res.ok) {
            const { error } = await res.json()
            throw new Error(`\nCode: ${error.code}\nMessage: ${error.message}\n${(error.data) ? 'Data: ' + JSON.stringify(error.data) : ''}`)
        }
        return await res.json()
    }

    /**
     * Send a POST request to the endpoint
     * @param {String} endpoint the API endpoint to hit. Example: '/my/agent'
     * @param {Object} body the request object
     * @returns {Object} the response body
     * @throws a generic error explaining what went wrong. It contains the error code, the message and the data if any was returned by the endpoint.
     */
    async postGuest(endpoint, body) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }

        const URL = this.#BASE_URL + endpoint

        const res = await fetch(URL, options)
        if (!res.ok) {
            const { error } = await res.json()
            throw new Error(`\nCode: ${error.code}\nMessage: ${error.message}\n${(error.data) ? 'Data: ' + JSON.stringify(error.data) : ''}`)
        }
        return await res.json()
    }

    /**
     * Send a PATCH request to the endpoint with authorization token.
     * @param {string} endpoint the API endpoint to hit. Example: '/my/agent'
     * @param {string} token the authorization token for the agent
     * @param {Object} body the request object
     * @returns {Object} the response body
     */
    async patch(endpoint, token, body) {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        }

        const URL = this.#BASE_URL + endpoint

        const res = await fetch(URL, options)
        if (!res.ok) {
            const { error } = await res.json()
            throw new Error(`\nCode: ${error.code}\nMessage: ${error.message}\n${(error.data) ? 'Data: ' + JSON.stringify(error.data) : ''}`)
        }
        return await res.json()
    }
}

export default Requests
/**
 * Example of error returned by the API
 * {
    "message": "Request could not be processed due to an invalid payload.",
    "code": 422,
    "data": {
        "symbol": [
            "The symbol field is required."
        ]
    }
}
 */