/**
 * Class to manage requests to the endpoints.
 * Use this class to initiate any request.
 */
export default class Requests {

    #BASE_URL = 'https://api.spacetraders.io/v2'
    
    constructor() {}

    /** 
     * Send a request to the endpoint with body as argument
     * @param {String} endpoint the API endpoint to hit.
     * @param {Object} body the request object
     * @param {String} [method='POST'] the method to use. Default is POST
     * @returns {Promise} a promise that resolves with the response body
     * */
    async send(endpoint, body, method = 'POST') {
        // build options object
        const options = {
            method: method,
            headers: method == 'POST' ? {
                'Content-Type': 'application/json',
            } : '',
            body: JSON.stringify(body)
        }
        
        const URL = this.#BASE_URL + endpoint
        
        // send request to endpoint
        const res = await fetch(URL, options)
        if (!res.ok) {
            const { error } = await res.json()
            throw new Error(`\nCode: ${error.code}\nMessage: ${error.message}\n${(error.data) ? 'Data: ' + JSON.stringify(error.data) : ''}`)
        }
        return await res.json()
    }

    /** 
     * Send a request with token to the endpoint with body as argument.
     * Use this method to hit endpoints that require the authorization token.
     * @param {String} token the authorization token for the agent
     * @param {String} endpoint the API endpoint to hit. Example: '/my/agent'
     * @param {Object} body the request object. Default is null
     * @param {String} [method='POST'] the method to use. Default is POST
     * @returns {Promise} a promise that resolves with the response body
     * */
    async sendAuth(token, endpoint, body = null, method = 'POST') {

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: (body != null) ? JSON.stringify(body) : ''
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