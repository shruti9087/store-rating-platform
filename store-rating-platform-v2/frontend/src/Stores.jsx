
import React, { useEffect, useState } from 'react'
import API from '../api'

export default function Stores() {
  const [q, setQ] = useState('')
  const [stores, setStores] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const load = async () => {
    const { data } = await API.get('/stores', { params: { q } })
    setStores(data)
  }
  useEffect(()=>{ load() }, [q])

  const rate = async (id, value) => {
    await API.post(`/ratings/${id}`, { value })
    await load()
  }

  return (
    <div>
      <h2>Stores</h2>
      <input placeholder="Search name/address" value={q} onChange={e=>setQ(e.target.value)} />
      <table border="1" cellPadding="6" style={{marginTop:8}}>
        <thead><tr><th>Name</th><th>Address</th><th>Overall Rating</th><th>My Rating</th><th>Actions</th></tr></thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.overallRating ? s.overallRating.toFixed(2) : '—'}</td>
              <td>{s.myRating ?? '—'}</td>
              <td>
                {user && [1,2,3,4,5].map(v => (
                  <button key={v} onClick={()=>rate(s.id, v)} style={{marginRight:4}}>{v}</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
