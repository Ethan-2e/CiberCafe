import { ETIQUETAS } from '../constantes'

export default function Puesto({ pc, activo, onSeleccionar }) {
  return (
    <button
      type="button"
      className={'pc' + (activo ? ' activo' : '')}
      data-e={pc.estado}
      onClick={() => onSeleccionar(pc.id)}
    >
      <div className="num">{pc.id}</div>
      <div className="est">{ETIQUETAS[pc.estado]}</div>
    </button>
  )
}
