import Puesto from './Puesto'

export default function Sala({ sala, pcs }){
  return(
    <section className="sala">
      <header>
        <h2>{sala.nombre}</h2>
        <span className="muted">{sala.desc}. Mostrando {pcs.length} puestos</span>
      </header>
      <div className="cuadricula">
        {pcs.map(pc => <Puesto key={pc.id} pc={pc} />)}
      </div>
    </section>
  )
}
