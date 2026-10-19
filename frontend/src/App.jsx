import { obtenerDatos } from './api'
import Resumen from './components/Resumen'
import Sala from './components/Sala'

export default function App() {
  const { salas, pcs } = obtenerDatos()

  return (
    <div id="app">
      <header className="topbar">
        <div className="logo">Cibercafé Nova</div>
        <div className="sesion">
          <span>admin@cibercafenova.cl</span>
          <button type="button" className="btn">Cerrar sesión</button>
        </div>
      </header>

      <main>
        <h1>Panel operativo</h1>
        <Resumen pcs={pcs} />
        <div id="salas">
          {salas.map(sala => (
            <Sala key={sala.id} sala={sala} pcs={pcs.filter(pc => pc.sala === sala.id)} />
          ))}
        </div>
      </main>
    </div>
  )
}
