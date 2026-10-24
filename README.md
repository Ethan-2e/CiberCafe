1.- Pasos para tener una instancia funcionando en aws:
    -El repositorio dentro de /var/www/html/project debe haber sido actualizado con git pull
    -Una vez ya actualizado, se debe iniciar el backend con el json-server incluido en el proyecto (0.17.4):
        sudo node node_modules/json-server/lib/cli/bin.js --watch db.json --port 3000 --host 0.0.0.0
    -Importante: no usar el json-server global (v1), porque ignora los ids personalizados y genera ids aleatorios.

    NOTA: Ya no es necesario iniciar backend manualmente, se hizo un trigger con systemd cada que se prende la instancia
    