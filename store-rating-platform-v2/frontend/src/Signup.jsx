
import React, { useState } from 'react'
import API from '../api'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg('')
    try {
      const { data } = await API.post('/auth/register', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setMsg('Registered!')
      window.location.href = '/'
    } catch (e) {
      setErr(e.response?.data?.errors?.map(er=>er.msg).join(', ') || e.response?.data?.error || 'Failed')
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Signup</h2>
      <input name="name" placeholder="Full Name (20-60 chars)" value={form.name} onChange={onChange} /><br/>
      <input name="email" placeholder="Email" value={form.email} onChange={onChange} /><br/>
      <input name="address" placeholder="Address (<=400 chars)" value={form.address} onChange={onChange} /><br/>
      <input name="password" type="password" placeholder="Password (8-16, 1 uppercase & 1 special)" value={form.password} onChange={onChange} /><br/>
      <button>Create Account</button>
      {msg && <p style={{color:'green'}}>{msg}</p>}
      {err && <p style={{color:'red'}}>{err}</p>}
    </form>
  )
}
