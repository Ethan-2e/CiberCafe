import { useState } from 'react'
import { obtenerDatos } from './api'
import Filtros from './components/Filtros'
import Resumen from './components/Resumen'
import Sala from './components/Sala'

export default function App() {
  const { salas, pcs } = obtenerDatos()

  const [estado, setEstado] = useState('todos')
  const [salaFiltro, setSalaFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  const visibles = pcs.filter(pc =>
    (estado === 'todos' || pc.estado === estado) &&
    (salaFiltro === 'todas' || pc.sala === salaFiltro) &&
    pc.id.toLowerCase().includes(busqueda.trim().toLowerCase())
  )

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
        <Filtros
          salas={salas} pcs={pcs}
          estado={estado} setEstado={setEstado}
          salaFiltro={salaFiltro} setSalaFiltro={setSalaFiltro}
          busqueda={busqueda} setBusqueda={setBusqueda}
        />

        <div id="salas">
          {visibles.length === 0 && <p className="vacio">Ningún equipo coincide con los filtros.</p>}
          {salas.map(sala => {
            const delaSala = visibles.filter(pc => pc.sala === sala.id)
            if (delaSala.length === 0) return null
            return (
              <Sala
                key={sala.id}
                sala={sala}
                pcs={delaSala}
                total={pcs.filter(pc => pc.sala === sala.id).length}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}
