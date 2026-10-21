import { useState } from "react";

export default function Login({ onEntrar }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function enviar(evento) {
    evento.preventDefault()
    onEntrar(email.trim())
  }

  return (
    <section id="login">
      <form id="form-login" onSubmit={enviar}>
        <h1>CiberCafe Nova</h1>
        <p>Ingresar para administrar los equipos.</p>

        <label htmlFor="email">Correo</label>
        <input
          type="email" id="email" required
          placeholder="admin@cibercafenova.cl"
          value={email} onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password" id="password" required minLength={6}
          value={password} onChange={e=> setPassword(e.target.value)}
        />

        <button type="submit" className="btn primary">Inicial sesión</button>
        <a href="#">¿Olvidaste tu contraseña?</a>
      </form>
    </section>
  )
}
