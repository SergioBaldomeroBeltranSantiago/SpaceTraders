/**
 * Class to manage requests to the endpoints.
 * Use this class to initiate any request.
 */
export default class Requests {
    
    constructor() {}

    /** Send request to endpoint with body as argument
     * @param {string} endpoint the API endpoint to hit. Example: '/my/agent'
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
        
        const URL = `https://api.spacetraders.io/v2${endpoint}`
        console.log(options);
        // send request to endpoint
        return fetch(URL, options)
    }
}