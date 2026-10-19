export default function Resumen({ pcs }) {
  const contar = estado => pcs.filter(pc => pc.estado === estado).length

  return (
    <section className="resumen" aria-label="Resumen">
      <div className="stat" data-e="disponible">
        <div className="valor">{contar('disponible')}/{pcs.length}</div>
        <div className="nivel">Disponibles</div>
      </div>
      <div className="stat" data-e="uso">
        <div className="valor">{contar('uso')}/{pcs.length}</div>
        <div className="nivel">En uso</div>
      </div>
      <div className="stat" data-e="reservado">
        <div className="valor">{contar('reservado')}/{pcs.length}</div>
        <div className="nivel">Reservados</div>
      </div>
      <div className="stat" data-e="fuera">
        <div className="valor">{contar('fuera')}/{pcs.length}</div>
        <div className="nivel">Fuera de servicio</div>
      </div>
    </section>
  )
}
