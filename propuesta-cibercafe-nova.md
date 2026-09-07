# Propuesta de Proyecto
## Plataforma de gestión de puestos y sesiones de uso
**Cliente:** Cibercafé Nova  
**Presentado a:** Administración de Cibercafé Nova  
**Preparado por:** _(equipo de proyecto)_  
**Curso:** CIT2308 - Desarrollo Web · Universidad Diego Portales · Semestre 2026-2

---

## Ficha del proyecto

| Campo | Detalle |
|---|---|
| **Cliente** | Cibercafé Nova, local de entretenimiento y servicios digitales |
| **Rubro** | Servicios / entretenimiento digital |
| **Área solicitante** | Administración y operación del local |
| **Escala aproximada** | 30 computadores, 3 salas, 4 trabajadores por turno, ~180 clientes registrados |
| **Duración estimada** | Un semestre |
| **Modalidad de acceso** | Plataforma web responsiva, con usuario y contraseña, accesible desde computador o dispositivo móvil |

> **Nota:** Cibercafé Nova es un cliente ficticio creado con fines educativos. La propuesta describe una necesidad de negocio realista y define el problema, no una solución técnica única. El equipo deberá diseñar e implementar la solución y justificar sus decisiones.

---

## 1. Sobre Cibercafé Nova

Cibercafé Nova nació como un pequeño local de acceso a internet y, con el tiempo, se transformó en un espacio de videojuegos, estudio y trabajo. Actualmente cuenta con 30 computadores distribuidos en tres salas: una zona general, una zona gamer y una sala para equipos o grupos.

El crecimiento de la demanda no vino acompañado de herramientas de gestión. Las reservas, el inicio de las sesiones y las fallas se registran en mensajes, planillas separadas o anotaciones, lo que dificulta conocer la disponibilidad real de los puestos.

### 1.1 Cibercafé Nova en números

| Dato | Aproximado |
|---|---|
| Computadores disponibles | 30 |
| Salas | 3 |
| Clientes registrados | 180 |
| Sesiones por día | entre 45 y 80 |
| Reservas anticipadas por semana | entre 35 y 60 |
| Incidencias técnicas por semana | entre 8 y 15 |

---

## 2. El problema

Cada cliente necesita saber si existe un computador disponible, por cuánto tiempo puede utilizarlo y cuánto deberá pagar. Al mismo tiempo, el personal debe asignar puestos, controlar sesiones activas y evitar reservas duplicadas.

Hoy la disponibilidad se revisa caminando por el local o preguntando a otros trabajadores. Las reservas se anotan manualmente y una sesión puede terminar sin que quede claro qué equipo se utilizó, cuánto duró o quién la atendió.

- Una reserva puede coincidir con otra o con una sesión ya iniciada.
- Un computador con una falla puede seguir apareciendo como disponible.
- El cobro depende de cálculos manuales y puede variar entre turnos.
- La administración no dispone de un historial centralizado de uso e incidencias.

El problema no es la falta de computadores, sino la falta de una vista común y actualizada. Esto genera tiempos de espera, errores de cobro y una experiencia irregular para los clientes.

---

## 3. Objetivo del proyecto

Cibercafé Nova necesita una plataforma web que permita:

- Consultar la disponibilidad de computadores y salas.
- Registrar reservas e iniciar y finalizar sesiones de uso.
- Calcular el valor de cada sesión según su duración y tipo de puesto.
- Reportar incidencias y bloquear temporalmente equipos no disponibles.
- Consultar el historial de sesiones, reservas e incidencias.

La información debe quedar reunida en un solo lugar y reflejar el estado operativo del local en cada momento.

---

## 4. Quiénes usarán la plataforma

| Rol | Funciones |
|---|---|
| **Cliente** | Consulta disponibilidad, realiza o cancela sus propias reservas y revisa sus sesiones. |
| **Operador de turno** | Registra clientes, asigna computadores, inicia y finaliza sesiones y reporta incidencias. |
| **Administrador** | Configura equipos, salas, tarifas y usuarios; consulta reportes e historial general. |

---

## 5. Alcance del proyecto

### 5.1 Qué espera Cibercafé Nova de esta plataforma

- Un listado de salas y computadores con su estado: disponible, reservado, en uso o fuera de servicio.
- Una agenda de reservas que impida asignaciones incompatibles para el mismo puesto y horario.
- Una forma de iniciar y finalizar sesiones, registrando cliente, computador, horario, duración y monto.
- Tarifas configurables por tipo de puesto y tramo de tiempo.
- Un panel operativo con disponibilidad, sesiones activas, próximas reservas e incidencias abiertas.
- Gestión de computadores, salas, tarifas y cuentas de acceso por parte del administrador.
- Acceso mediante usuario y contraseña, con permisos diferenciados por rol.

Las pantallas se detallan en la sección 7. Las entidades, funcionalidades y reglas mínimas se presentan en la sección 9.

### 5.2 Qué queda fuera de este proyecto

- No se espera controlar remotamente los computadores ni instalar software en ellos.
- No se incluye venta de alimentos, inventario de productos ni facturación electrónica.
- No se exige integración con medios de pago reales; los pagos pueden quedar registrados como simulación.
- No se desarrollará una aplicación móvil nativa; la plataforma debe funcionar correctamente desde un navegador móvil.
- No se exige lectura automática de hardware ni detección automática de fallas.

El proyecto se concentra en la gestión web de disponibilidad, reservas, sesiones e incidencias.

---

## 6. Hitos esperados

Cibercafé Nova entiende que el proyecto se construye por etapas y espera avances verificables:

| Hito | Qué debería poder ver Cibercafé Nova | Cuándo |
|---|---|---|
| **1. Maqueta visual** | Una navegación completa con las pantallas principales, datos de ejemplo y diseño responsivo, publicada en una dirección web. | Mes 1 |
| **2. Prototipo interactivo** | Consultar puestos, crear una reserva e iniciar/finalizar una sesión simulada; los datos aún pueden reiniciarse. | Mes 2-3 |
| **3. Plataforma funcional** | Autenticación, persistencia, permisos, validaciones, gestión administrativa e historial funcionando de punta a punta. | Fin de semestre |

### Evidencia mínima por hito

- **Hito 1:** URL pública, navegación entre vistas y adaptación a escritorio y móvil.
- **Hito 2:** demostración de los flujos principales y repositorio con historial comprensible.
- **Hito 3:** URL final, cuentas de prueba por rol, datos persistentes, documentación y demostración.

---

## 7. Pantallas de la plataforma

Las siguientes pantallas constituyen el mínimo esperado. Cada equipo puede mejorar la experiencia sin eliminar estos flujos:

| Pantalla | Para quién | Qué debe permitir | Desde |
|---|---|---|---|
| Inicio de sesión | Todos | Ingresar con credenciales y acceder según el rol. | Hito 1 visual |
| Panel operativo | Operador, administrador | Ver disponibilidad, sesiones activas, próximas reservas e incidencias. | Hito 1 |
| Salas y puestos | Todos según permisos | Consultar computadores por sala, tipo y estado. | Hito 1 |
| Detalle de computador | Operador, administrador | Ver estado, características, reserva próxima e incidencias. | Hito 1 |
| Reservar puesto | Cliente, operador | Elegir fecha, horario y computador disponible; confirmar o cancelar. | Hito 2 |
| Gestionar sesión | Operador | Iniciar, extender y finalizar una sesión; calcular y registrar el monto. | Hito 2 |
| Reportar incidencia | Operador | Bloquear un equipo, describir la falla y registrar su resolución. | Hito 2 |
| Mi actividad | Cliente | Revisar sus reservas y sesiones anteriores. | Hito 3 |
| Administración | Administrador | Gestionar salas, equipos, tarifas y cuentas de acceso. | Hito 3 |
| Historial y resumen | Administrador | Consultar uso, ingresos simulados e incidencias por periodo. | Hito 3 |

> **Sobre "Disponible desde":** En el Hito 1 las vistas son maquetas con datos de ejemplo. En el Hito 2 los flujos marcados deben reaccionar a las acciones del usuario, aunque los datos todavía puedan ser temporales. En el Hito 3 la operación completa debe persistir y respetar roles y reglas.

---

## 8. Consideraciones adicionales

- La interfaz debe ser simple y permitir reconocer la disponibilidad sin leer instrucciones extensas.
- La plataforma debe funcionar en navegadores actuales sin instalar software adicional.
- Las acciones críticas deben pedir confirmación y entregar mensajes de error comprensibles.
- Las contraseñas no deben almacenarse ni mostrarse como texto legible.
- La plataforma debe estar publicada durante el desarrollo y adaptarse a computador, tablet y celular.

---

## 9. Entidades, funcionalidades y reglas de negocio

Esta sección traduce los requerimientos a un modelo funcional de referencia. No reemplaza el análisis del equipo ni impone una arquitectura.

### 9.1 Entidades principales

- Sala
- Computador o puesto
- Cliente
- Reserva
- Sesión de uso
- Tarifa
- Incidencia
- Usuario (con rol de cliente, operador o administrador)

### 9.2 Funcionalidades principales

- Consulta de disponibilidad por fecha, hora, sala y tipo de puesto.
- Creación, consulta y cancelación de reservas.
- Inicio, extensión y cierre de sesiones con cálculo del monto.
- Administración de salas, puestos, tarifas y usuarios.
- Registro y resolución de incidencias técnicas.
- Historial y resumen de uso, reservas e incidencias.

### 9.3 Reglas de negocio

- Un computador pertenece a una única sala.
- Un computador tiene un único estado operativo en cada momento.
- No pueden existir dos reservas incompatibles para el mismo puesto y horario.
- Una sesión solo puede iniciarse en un computador disponible o reservado por el cliente correspondiente.
- Al iniciar una sesión, el puesto pasa a estado **"en uso"**; al finalizar, vuelve a **"disponible"**, salvo que exista una incidencia abierta.
- Un computador fuera de servicio no puede reservarse ni iniciar sesiones.
- El monto se calcula con la tarifa vigente y la duración registrada.
- El cliente solo puede consultar y modificar su propia actividad.
- Solo el administrador gestiona tarifas, equipos, salas y usuarios.

### 9.4 Criterios mínimos de aceptación

- El usuario puede autenticarse y solo accede a las acciones permitidas para su rol.
- La disponibilidad mostrada coincide con las reservas, sesiones e incidencias registradas.
- El sistema rechaza reservas superpuestas y explica el motivo.
- El operador puede iniciar y finalizar una sesión y el monto queda registrado.
- Un equipo con incidencia abierta no puede asignarse como disponible.
- El administrador puede gestionar salas, equipos, tarifas y usuarios.
- El historial conserva fechas, usuario responsable y cambios relevantes.

---

## 10. Homologación con los requerimientos mínimos comunes del curso

| Requerimiento común | Cómo se cubre en Cibercafé Nova | Referencia |
|---|---|---|
| Aplicación web responsiva | Uso desde navegador en computador, tablet y celular. | Ficha; Sec. 8 |
| Autenticación y usuarios | Tres roles con visibilidad y permisos diferenciados. | Sec. 4, 7, 9 |
| Gestión CRUD y persistencia | Administración de salas, equipos, tarifas, usuarios, reservas, sesiones e incidencias. | Sec. 7, 9 |
| Backend y API | La implementación queda a criterio del equipo; el comportamiento y la persistencia son obligatorios. | Sec. 11 |
| Reglas de negocio | Disponibilidad, superposición, transiciones de estado, tarifas y permisos. | Sec. 9.3 |
| Consultas y visualización | Panel operativo, filtros, historial y resumen por periodo. | Sec. 5, 7 |
| Validación y errores | Rechazo de conflictos, confirmaciones y mensajes comprensibles. | Sec. 8, 9 |
| Características PWA | Diseño responsivo obligatorio; instalación y modo sin conexión son mejoras opcionales. | Sec. 8 |
| Despliegue | URL accesible durante los tres hitos. | Sec. 6, 8 |
| Documentación | Repositorio, instrucciones, cuentas de prueba y decisiones técnicas justificadas. | Sec. 6, 11 |

---

## 11. Sobre esta propuesta

Este documento describe qué necesita Cibercafé Nova y por qué. Las secciones de pantallas, reglas y criterios de aceptación establecen el mínimo funcional que debe poder comprobarse durante el semestre.

La propuesta no define cómo debe construirse la plataforma internamente. El lenguaje, las bibliotecas, la arquitectura, la base de datos y la organización de la API siguen siendo decisiones del equipo, que deberá presentarlas y justificarlas.

Las funcionalidades opcionales —por ejemplo, torneos, membresías, descuentos, pagos reales o instalación como PWA— solo deben abordarse después de completar y verificar el alcance mínimo.

Ante cualquier duda de alcance, se debe consultar con el docente antes de incorporar cambios que alteren los hitos o las reglas principales.

---

*CIT2308 - Desarrollo Web · Universidad Diego Portales · Semestre 2026-2*
