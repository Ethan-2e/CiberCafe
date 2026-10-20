import Puesto from './Puesto'

export default function Sala({ sala, pcs, total, seleccionado, onSeleccionar }){
  return(
    <section className="sala">
      <header>
        <h2>{sala.nombre}</h2>
        <span className="muted">{sala.desc}. Mostrando {pcs.length} de {total} puestos</span>
      </header>
      <div className="cuadricula">
        {pcs.map(pc => (
          <Puesto
            key={pc.id}
            pc={pc}
            activo={pc.id === seleccionado}
            onSeleccionar={onSeleccionar}
          />
        ))}
      </div>
    </section>
  )
}
