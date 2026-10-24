1.- Pasos para tener una instancia funcionando en aws:
    -El repositorio dentro de /var/www/html/project debe haber sido actualizado con git pull
    -Una vez ya actualizado, se debe iniciar el backend con el json-server incluido en el proyecto (0.17.4):
        sudo node node_modules/json-server/lib/cli/bin.js --watch db.json --port 3000 --host 0.0.0.0
    -Importante: no usar el json-server global (v1), porque ignora los ids personalizados y genera ids aleatorios.

    NOTA: Ya no es necesario iniciar backend manualmente, se hizo un trigger con systemd cada que se prende la instancia


    Funcionalidades de esta versión de la app:
        -Login Simulado: Ahora se cuenta con un login simulado que (ojo, de momento solamente, más a futuro será un Oauth real) acepta cualquier correo con estructura adecuada y un minimo de 8 caracteres para la contraseña y un maximo de 16.
        -Panel operativo: Se cuenta con una página principal la cual es un daashboard con un resumen de 3 cards que muestran cuantos pc hay disponibles, en uso o que presentan una falla. Además cuenta con 3 secciones interactivas donde se puede revisar y modificar el estado de cada pc.
        -Gestión de equipos: Dentro del panel operativo tenemos un modal que nos permite gestionar el inventario eliminando o añadiendo por código equipos nuevos.
        -Control de estado: Al hacer click en uno de los equipos se puede cambiar su estado y justificar el cambio en caso de hacerlo.
        -Nueva Sesion: Para asignar sesiones a los usuarios nuevos.
        -Historeial de sesiones activas: permite gestionarlas y finalizarlas si se desea.
        -Incidencias: Esta página es para mostrar las incidencias activas y añadir o eliminarlas.
