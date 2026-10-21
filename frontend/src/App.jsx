import Detalle from './components/Detalle'
import { useState } from 'react'
import { obtenerDatos } from './api'
import Filtros from './components/Filtros'
import Resumen from './components/Resumen'
import Sala from './components/Sala'
import Login from './components/Login'

export default function App() {
  const { salas, pcs: pcsBase } = obtenerDatos()
  const [pcs, setPcs] = useState(pcsBase)
  const[seleccionadoId, setSeleccionadoId] = useState(null)

  const [estado, setEstado] = useState('todos')
  const [salaFiltro, setSalaFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  const [usuario, setUsuario] = useState(null)

  const visibles = pcs.filter(pc =>
    (estado === 'todos' || pc.estado === estado) &&
    (salaFiltro === 'todas' || pc.sala === salaFiltro) &&
    pc.id.toLowerCase().includes(busqueda.trim().toLowerCase())
  )
  const hayFiltro = estado !== 'todos' || busqueda.trim() !== ''
  const salasMostradas = salas.filter(s=>salaFiltro === 'todas' || s.id === salaFiltro)

  const seleccionado = pcs.find(pc => pc.id === seleccionadoId)
  function cambiarEstado(id, nuevoEstado) {
    setPcs(pcs.map(pc=>(pc.id === id ? {...pc, estado: nuevoEstado} :pc)))
  }

  function agregarPc(salaId) {
    const sala = salas.find(s => s.id === salaId)
    const numeros = pcs
      .filter(pc => pc.sala === salaId)
      .map(pc => parseInt(pc.id.slice(1)))
    const siguiente = Math.max(0, ...numeros) + 1
    const nuevo = {
      id: sala.pre + String(siguiente).padStart(2, '0'),
      sala: salaId,
      estado: 'disponible',
    }
    setPcs([...pcs, nuevo])
  }

  function eliminarPc(id) {
    if (!window.confirm(`¿Eliminar el equipo ${id}?`)) return
    setPcs(pcs.filter(pc => pc.id !== id))
    setSeleccionadoId(null)
  }

  if(!usuario) return <Login onEntrar={setUsuario} />

  return (
    <div id="app">
      <header className="topbar">
        <div className="logo">Cibercafé Nova</div>
        <div className="sesion">
          <span>{usuario}</span>
          <button
            type="button" className="btn"
            onClick={() => { setUsuario(null), setSeleccionadoId(null) }}
          >
            Cerrar sesión
          </button>
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
          {visibles.length === 0 && hayFiltro && (
            <p className='vacio'>Ningún equipo coincide con los filtros.</p>
          )}
          {salasMostradas.map(sala => {
            const delaSala = visibles.filter(pc => pc.sala === sala.id)
            if (delaSala.length === 0 && hayFiltro) return null
            return (
              <Sala
                key={sala.id}
                sala={sala}
                pcs={delaSala}
                total={pcs.filter(pc => pc.sala === sala.id).length}
                seleccionado={seleccionadoId}
                onSeleccionar={setSeleccionadoId}
                onAgregar={agregarPc}
              />
            )
          })}
        </div>

      </main>
      {seleccionado && (
        <Detalle
          pc={seleccionado}
          sala={salas.find(s => s.id === seleccionado.sala)}
          onCambiarEstado={cambiarEstado}
          onCerrar={() => setSeleccionadoId(null)}
          onEliminar={eliminarPc}
        />
      )}
    </div>
  )
}
