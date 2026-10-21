1.- Pasos para tener una instancia funciona en aws:
    -El repositorio dentro de /var/www/html/project debe haber sido actualizado con git pull
    -Una vez ya actualizado, se debe usar "sudo json-server --watch db.json --port 3000 --host 0.0.0.0" para poder iniciar el backend local
    -Ejecutar "python3 -m http.server 8080" para encender el frontend.