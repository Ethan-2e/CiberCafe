require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const { hashPassword } = require('../utils/password');
const Sala = require('../models/Sala');
const Computador = require('../models/Computador');
const Sesion = require('../models/Sesion');
const Incidencia = require('../models/Incidencia');
const Usuario = require('../models/Usuario');

async function seed() {
  await connectDB();

  const rutaDb = path.join(__dirname, '..', '..', 'db.json');
  const datos = JSON.parse(fs.readFileSync(rutaDb, 'utf8'));

  const salas = ['General', 'Gamer', 'Grupal'];
  for (const nombre of salas) {
    await Sala.updateOne({ nombre }, { $set: { nombre } }, { upsert: true });
  }
  console.log(`Salas listas: ${salas.join(', ')}`);

  if (Array.isArray(datos.computadores)) {
    for (const c of datos.computadores) {
      await Computador.updateOne(
        { codigo: c.id },
        { $set: { codigo: c.id, sala: c.sala, estado: c.estado, motivo: c.motivo || '' } },
        { upsert: true }
      );
    }
    console.log(`Computadores migrados: ${datos.computadores.length}`);
  }

  const usuariosDemo = [
    { nombre: 'Administrador', email: 'admin@cibercafe.cl', password: 'Admin1234', rol: 'administrador' },
    { nombre: 'Operador', email: 'operador@cibercafe.cl', password: 'Operador1234', rol: 'operador' },
    { nombre: 'Cliente Demo', email: 'cliente@cibercafe.cl', password: 'Cliente1234', rol: 'cliente' }
  ];

  for (const u of usuariosDemo) {
    const passwordHash = await hashPassword(u.password);
    await Usuario.updateOne(
      { email: u.email },
      { $set: { nombre: u.nombre, email: u.email, passwordHash, rol: u.rol, activo: true } },
      { upsert: true }
    );
  }
  console.log(`Usuarios demo listos: ${usuariosDemo.map((u) => u.email).join(', ')}`);

  if (Array.isArray(datos.sesiones)) {
    for (const s of datos.sesiones) {
      await Sesion.updateOne(
        { puesto: s.puesto, cliente: s.cliente, inicio: s.inicio },
        { $set: { puesto: s.puesto, cliente: s.cliente, inicio: s.inicio } },
        { upsert: true }
      );
    }
    console.log(`Sesiones migradas: ${datos.sesiones.length}`);
  }

  if (Array.isArray(datos.incidencias)) {
    for (const i of datos.incidencias) {
      await Incidencia.updateOne(
        { puesto: i.puesto, descripcion: i.descripcion, fecha: i.fecha },
        { $set: { puesto: i.puesto, descripcion: i.descripcion, fecha: i.fecha } },
        { upsert: true }
      );
    }
    console.log(`Incidencias migradas: ${datos.incidencias.length}`);
  }

  console.log('Seed completado.');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Error en el seed:', error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
