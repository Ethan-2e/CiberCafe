import { ETIQUETAS } from '../constantes'

export default function Puesto({ pc }){
  return(
    <button type="button" className="pc" data-e={pc.estado}>
      <div className="num">{pc.id}</div>
      <div className="est">{ETIQUETAS[pc.estado]}</div>
    </button>
  )
}
