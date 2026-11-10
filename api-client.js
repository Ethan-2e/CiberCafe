import { API_URL } from './api.js';

export async function apiFetch(path, options = {}) {
  const { headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    ...rest
  });

  const texto = await res.text();
  let datos = null;
  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = null;
  }

  if (!res.ok) {
    if (res.status === 401 && path !== '/auth/login') {
      if (!window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
      }
      return null;
    }
    throw new Error((datos && datos.error) || 'Error de API');
  }

  return datos;
}

let usuarioPromesa = null;

export function obtenerUsuarioActual() {
  if (!usuarioPromesa) {
    usuarioPromesa = apiFetch('/auth/me')
      .then((respuesta) => (respuesta ? respuesta.usuario : null))
      .catch(() => null);
  }
  return usuarioPromesa;
}

export async function cerrarSesion() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    window.location.href = 'login.html';
  }
}
