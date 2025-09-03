
import React, { useEffect, useState } from 'react'
import API from '../api'

export default function Owner() {
  const [data, setData] = useState({ average: null, users: [] })
  useEffect(()=>{
    (async ()=>{
      const { data } = await API.get('/stores/owner/ratings')
      setData(data)
    })()
  }, [])
  return (
    <div>
      <h2>Owner Dashboard</h2>
      <div>Average Rating: {data.average ? data.average.toFixed(2) : '—'}</div>
      <h3>Users who rated your store</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Name</th><th>Email</th><th>Rating</th></tr></thead>
        <tbody>
          {data.users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.rating}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
