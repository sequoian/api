const axios = require('axios')

class RedditApi {

  login(username, password) {
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
      this.accessToken = response.data.access_token
    })
    .catch(error => {
      throw new Error('Failed to log in with credentials')
    })
  }

  async getTopPosts(subreddit, count) {
    if (!subreddit) throw new Error('Subreddit must be specified')
    if (!count) throw new Error('Number of posts must be specified')
    const numToGet = count < 5000 ? count : 5000
    const limit = count < 100 ? count : 100
    let after = null
    let numReceived = 0
    const posts = []
    
    const url = `https://oauth.reddit.com/r/${subreddit}/search.json?sort=top&t=all&restrict_sr=1&limit=${limit}`
    let response
    // send request
    try {
      response = await sendRequest(url, this.accessToken)

      // check response
      if (response.status !== 200) throw new Error('Request failed: ', response.status)

      // collect data
      const data = response.data.data
      after = data.after
      numReceived += data.dist
      data.children.forEach(post => posts.push(post))
      console.log(`Posts recieved: ${numReceived} / ${numToGet}`)
    } 
    catch (error) {
      console.log(error)
      return posts  // return early if request failed
    }

    // continue making requests until count is reached
    while (numReceived < numToGet) {
      const nextUrl = `${url}&after=${after}&count=${numReceived}`
      try {
        response = await sendRequest(nextUrl, this.accessToken)
        if (response.status !== 200) throw new Error('Request failed: ', response.status)
      }
      catch(error) {
        console.log(error)
        return posts
      }

      const data = response.data.data
      after = data.after
      numReceived += data.dist
      data.children.forEach(post => posts.push(post))
      console.log(`Posts recieved: ${numReceived} / ${numToGet}`)

      if (data.dist < limit) {
        // end early if there are no more posts to get
        console.log('No more posts to get')
        break  
      }
    }

    console.log('Done')
    return posts
  }
}

module.exports = RedditApi


const sendRequest = (url, token) => {
  return axios({
    method: 'get',
    url: url, 
    headers: {
      'Authorization': `bearer ${token}`
    }
  })
}