
import React, { useEffect, useState } from 'react'
import API from '../api'

export default function Admin() {
  const [dash, setDash] = useState({ totalUsers:0, totalStores:0, totalRatings:0 })
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [newUser, setNewUser] = useState({ name:'', email:'', address:'', password:'', role:'USER' })
  const [newStore, setNewStore] = useState({ name:'', email:'', address:'' })
  const [error, setError] = useState('')

  const load = async () => {
    const d = await API.get('/admin/dashboard'); setDash(d.data)
    const u = await API.get('/admin/users', { params: { q, role } }); setUsers(u.data)
    const s = await API.get('/admin/stores', { params: { q } }); setStores(s.data)
  }
  useEffect(()=>{ load() }, [q, role])

  const createUser = async (e) => {
    e.preventDefault()
    setError('')
    try { await API.post('/admin/users', newUser); setNewUser({ name:'', email:'', address:'', password:'', role:'USER' }); load() }
    catch (e) { setError(e.response?.data?.error || 'Failed') }
  }

  const createStore = async (e) => {
    e.preventDefault()
    setError('')
    try { await API.post('/admin/stores', newStore); setNewStore({ name:'', email:'', address:'' }); load() }
    catch (e) { setError(e.response?.data?.error || 'Failed') }
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>Users: {dash.totalUsers} | Stores: {dash.totalStores} | Ratings: {dash.totalRatings}</div>

      <h3>Create User</h3>
      <form onSubmit={createUser}>
        <input placeholder="Name (20-60)" value={newUser.name} onChange={e=>setNewUser({...newUser, name:e.target.value})}/>
        <input placeholder="Email" value={newUser.email} onChange={e=>setNewUser({...newUser, email:e.target.value})}/>
        <input placeholder="Address" value={newUser.address} onChange={e=>setNewUser({...newUser, address:e.target.value})}/>
        <input placeholder="Password" type="password" value={newUser.password} onChange={e=>setNewUser({...newUser, password:e.target.value})}/>
        <select value={newUser.role} onChange={e=>setNewUser({...newUser, role:e.target.value})}>
          <option>USER</option><option>OWNER</option><option>ADMIN</option>
        </select>
        <button>Create</button>
      </form>

      <h3>Create Store</h3>
      <form onSubmit={createStore}>
        <input placeholder="Name" value={newStore.name} onChange={e=>setNewStore({...newStore, name:e.target.value})}/>
        <input placeholder="Email" value={newStore.email} onChange={e=>setNewStore({...newStore, email:e.target.value})}/>
        <input placeholder="Address" value={newStore.address} onChange={e=>setNewStore({...newStore, address:e.target.value})}/>
        <button>Create</button>
      </form>

      <h3>Filters</h3>
      <input placeholder="Search name/email/address" value={q} onChange={e=>setQ(e.target.value)} />
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option value="">All Roles</option>
        <option value="USER">USER</option>
        <option value="OWNER">OWNER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      {error && <p style={{color:'red'}}>{error}</p>}

      <h3>User List</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>)}
        </tbody>
      </table>

      <h3>Store List</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
        <tbody>
          {stores.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{s.rating ? s.rating.toFixed(2) : '—'}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
