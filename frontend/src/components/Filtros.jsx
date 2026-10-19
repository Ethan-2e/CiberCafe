import { ETIQUETAS } from '../constantes'

export default function Filtros({ salas, pcs, estado, setEstado, salaFiltro, setSalaFiltro, busqueda, setBusqueda }) {
  const opciones = ['todos', ...Object.keys(ETIQUETAS)]
  const contar = e => (e === 'todos' ? pcs.length : pcs.filter(pc => pc.estado === e).length)

  return (
    <div className="barra">
      <div className="chips" role="group" aria-label="Filtrar por estado">
        {opciones.map(e => (
          <button
            key={e}
            type="button"
            className="btn chip"
            aria-pressed={estado === e}
            onClick={() => setEstado(e)}
          >
            {e === 'todos' ? 'Todos' : ETIQUETAS[e]} ({contar(e)})
          </button>
        ))}
      </div>

      <select value={salaFiltro} onChange={ev => setSalaFiltro(ev.target.value)} aria-label="Filtrar por sala">
        <option value="todas">Todas las salas</option>
        {salas.map(s => (
          <option key={s.id} value={s.id}>{s.nombre}</option>
        ))}
      </select>

      <input
        type="search"
        value={busqueda}
        onChange={ev => setBusqueda(ev.target.value)}
        placeholder="Buscar equipo (ej. P03)"
        aria-label="Buscar equipo"
      />
    </div>
  )
}
