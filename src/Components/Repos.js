import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import moment from 'moment'

const Repos = () => {
  const [topFiveRepos, setTopFiveRepos] = useState([])

  const month = moment().subtract(1, 'months').calendar()
  const date = moment(new Date(month)).format('YYYY-MM-DD')

  const loadRepos = async () => {
    const response = await axios({
      method: 'GET',
      url: `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc`,
      headers: {
        'Accept': 'application/vnd.github.v3.star+json'
      }
    })

    const responseArray = response.data.items
    setTopFiveRepos(responseArray.slice(0,5))
    console.log('this is response array', responseArray)
  }

  useEffect(() => {
    loadRepos()
  }, [])

return (
    <div className="mx-5">
      <h1>Most Starred Repos</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>No. of Stars</th>
          </tr>
        </thead>
        <tbody>
          {topFiveRepos.map((repo, index) => (
            <tr key={`${repo.id}`}>
              <td>{index + 1}</td>
              <td>{repo.id}</td>
              <td>{repo.name}</td>
              <td>{repo.description}</td>
              <td>{repo.stargazers_count}</td>
            </tr>

          ))}

        </tbody>
      </Table>
      <Button id="hot_repo" onClick={loadRepos} className="mb-4 mt-1" variant="info">Refresh</Button>
    </div>
  )
}

export default Repos
