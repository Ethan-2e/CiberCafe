import { ETIQUETAS } from "../constantes";

export default function Detalle({ pc, sala, onCambiarEstado, onCerrar }) {
  return (
    <aside className="detalle" aria-label="detalle del computador">
      <button type="button" className="btn cerrar" onClick={onCerrar} aria-label="Cerrar detalle">x</button>
      <h2>{pc.id}</h2>
      <p className="muted">{sala.nombre}</p>

      <h3>Hardware</h3>
      <p>{sala.hw}</p>
      <div className="estados">
        {Object.entries(ETIQUETAS).map(([clave, texto]) => (
          <button
            key={clave}
            type="button"
            className="btn"
            aria-pressed={pc.estado === clave}
            onClick={() => onCambiarEstado(pc.id, clave)}
          >
            {texto}
          </button>
        ))}
      </div>
    </aside>
  )
}
