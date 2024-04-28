/**
 * Class to manage requests to the endpoints.
 * Use this class to initiate any request.
 */
export default class Requests {

    #BASE_URL = 'https://api.spacetraders.io/v2'
    
    constructor() {}

    /** Send a request to the endpoint with body as argument
     * @param {string} endpoint the API endpoint to hit.
     * @param {Object} body the request object
     * @param {string} [method='POST'] the method to use. Default is POST
     * @returns {Promise} a promises that can be resolved. Use then() as usual
     * */
    send(endpoint, body, method = 'POST') {
        // build options object
        const options = {
            method: method,
            headers: method == 'POST' ? {
                'Content-Type': 'application/json',
            } : '',
            body: JSON.stringify(body)
        }
        
        const URL = this.#BASE_URL + endpoint
        console.log(options);
        // send request to endpoint
        return fetch(URL, options)
    }

    /** Send a request with token to the endpoint with body as argument.
     * Use this method to hit endpoints that require the authorization token.
     * @param {String} token the authorization token for the agent
     * @param {string} endpoint the API endpoint to hit. Example: '/my/agent'
     * @param {Object} body the request object. Default is null
     * @param {string} [method='POST'] the method to use. Default is POST
     * @returns {Promise} a promises that can be resolved. Use then() as usual
     * */
    sendAuth(token, endpoint, body = null, method = 'POST') {

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: (body != null) ? JSON.stringify(body) : ''
        }

        const URL = this.#BASE_URL + endpoint

        return fetch(URL, options)
    }
}