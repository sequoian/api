const axios = require('axios');

class RedditApi {

  constructor() {
    this.accessToken = null;
    this.lastRequest = Date.now();
  }

  async login(username, password) {
    return axios({
      method: 'post',
      url: 'https://www.reddit.com/api/v1/access_token',
      data: 'grant_type=client_credentials',
      auth: {
        username,
        password
      }
    })
    .then(response => {
      this.accessToken = response.data.access_token;
    })
    .catch(error => {
      throw new Error('Failed to log in with credentials');
    })
  }

  loggedIn() {
    return this.accessToken !== null;
  }

  logout() {
    this.accessToken = null;
  }

  async sendRequest(url) {
    if (!this.accessToken) throw new Error('Log in first');

    // limit request rate
    const limit = 1000;
    const elapsed = Date.now() - this.lastRequest;
    if (elapsed < limit) {
      await sleep(limit - elapsed);
    }

    const response = await axios({
      method: 'get',
      url: url, 
      headers: {
        'Authorization': `bearer ${this.accessToken}`
      }
    });
      
    if (response.status !== 200) throw new Error('Request failed: ', response.status);

    return response.data.data;
  }

}

const sleep = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = RedditApi;