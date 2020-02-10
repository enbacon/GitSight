import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import moment from 'moment'
import axios from 'axios'

const Users = () => {
  const [topFiveUsers, setTopFiveUsers] = useState([])

  // Formatting date to match required format for search query
  const year = moment().subtract(1,'years').calendar()
  const date = moment(new Date(year)).format('YYYY-MM-DD')

  // API call with search query for users created in the last year
  const loadUsers = () => {
    axios({
      method: 'GET',
      url: `https://api.github.com/search/users?q=created:>${date}&sort=followers&order=desc`,
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(usersResponse => Promise.resolve(usersResponse.data.items.slice(0,5)))
    .then(users  => addFollowers(users))
    .then(allFiveUsers => setTopFiveUsers(allFiveUsers))
    .catch(console.error)
    }

  // New API call(s) using user login to recieve number of followers
  // Add number of followers to each user
  // Build promise chain of the 5 calls
  // Return Promise.all to add these calls to the main promise chain
  const addFollowers = (users) => {
    const promiseChain = users.map((user) => {
      return axios({
        method: 'GET',
        url: `https://api.github.com/users/${user.login}`,
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(person => Promise.resolve({ ...user, followers: person.data.followers }))
      .catch(console.error)
    })
    return Promise.all(promiseChain)
  }

// Must clear interval if using setInterval in useEffect
useEffect(() => {
  loadUsers()
  const interval = setInterval(() => {
    console.log('2 min update')
    loadUsers()
  }, 2 * 60 * 1000);
  return () => clearInterval(interval);
}, [])

  // Table build, button build, populating the table
  return (
    <div className= "mx-5">
      <h1>Users With The Most Followers</h1>
      <h5>(This table will be updated every 2 minutes)</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Login</th>
            <th>Avatar Image</th>
            <th>Number of Followers</th>
          </tr>
        </thead>
        <tbody>
          {topFiveUsers.map((user, index) =>
            <tr key={ `${user.id}` }>
            <td>{ index + 1 }</td>
            <td>{ user.id }</td>
            <td>{ user.login }</td>
            <td><img src={ user.avatar_url } alt={ user.login }/></td>
            <td>{ user.followers }</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Button id="prolific_users" onClick={loadUsers}
      className="btn my-1" variant="info">Refresh</Button>
    </div>
  )
}

export default Users
