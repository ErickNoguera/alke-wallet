/*
 * storage.js — Módulo compartido de RappiWallet.
 * Centraliza el acceso al Local Storage (saldo, transacciones, contactos, sesión)
 * y expone helpers en `window` para que los usen los scripts de cada pantalla.
 * No usa módulos ES para mantenerlo simple y compatible con `file://`.
 */
(function (global) {
  "use strict";

  var KEYS = {
    sesion: "rw_sesion",
    saldo: "rw_saldo",
    transacciones: "rw_transacciones",
    contactos: "rw_contactos"
  };

  /* ---------- utilidades internas ---------- */

  function leerJSON(clave, porDefecto) {
    try {
      var crudo = localStorage.getItem(clave);
      return crudo ? JSON.parse(crudo) : porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }

  function guardarJSON(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
  }

  function nuevoId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function hoyISO() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  }

  /* ---------- datos de ejemplo (seed) ---------- */

  var CONTACTOS_SEED = [
    { id: nuevoId(), nombre: "María González", alias: "maria.gonzalez", cbu: "0000003100010000000001" },
    { id: nuevoId(), nombre: "Juan Pérez",     alias: "juanpe.mp",      cbu: "0000003100010000000002" },
    { id: nuevoId(), nombre: "Lucía Fernández", alias: "luli.fdez",     cbu: "0000003100010000000003" }
  ];

  var TRANSACCIONES_SEED = [
    { id: nuevoId(), tipo: "deposito",                descripcion: "Depósito en cuenta",       monto: 8000,  fecha: "2026-08-28" },
    { id: nuevoId(), tipo: "compra",                  descripcion: "Supermercado La Estrella",  monto: -3200, fecha: "2026-08-30" },
    { id: nuevoId(), tipo: "transferencia_recibida",  descripcion: "Transferencia de Juan Pérez", monto: 5000, fecha: "2026-09-02" },
    { id: nuevoId(), tipo: "compra",                  descripcion: "Farmacia del Centro",       monto: -1450, fecha: "2026-09-04" },
    { id: nuevoId(), tipo: "envio",                   descripcion: "Envío a Lucía Fernández",   monto: -2000, fecha: "2026-09-06" },
    { id: nuevoId(), tipo: "transferencia_recibida",  descripcion: "Reintegro compra online",   monto: 1200,  fecha: "2026-09-08" }
  ];

  /**
   * Crea los datos iniciales solo si aún no existen. Idempotente: se puede
   * llamar al principio de cada script de página sin pisar datos del usuario.
   */
  function seedData() {
    if (localStorage.getItem(KEYS.saldo) === null) {
      localStorage.setItem(KEYS.saldo, "10000");
    }
    if (localStorage.getItem(KEYS.contactos) === null) {
      guardarJSON(KEYS.contactos, CONTACTOS_SEED);
    }
    if (localStorage.getItem(KEYS.transacciones) === null) {
      guardarJSON(KEYS.transacciones, TRANSACCIONES_SEED);
    }
  }

  /* ---------- saldo ---------- */

  function getSaldo() {
    var v = parseFloat(localStorage.getItem(KEYS.saldo));
    return isNaN(v) ? 0 : v;
  }

  function setSaldo(n) {
    localStorage.setItem(KEYS.saldo, String(n));
  }

  /* ---------- transacciones ---------- */

  function getTransacciones() {
    return leerJSON(KEYS.transacciones, []);
  }

  /**
   * Agrega una transacción al principio de la lista (más reciente primero).
   * @param {{tipo:string, descripcion:string, monto:number, fecha?:string}} obj
   */
  function addTransaccion(obj) {
    var lista = getTransacciones();
    lista.unshift({
      id: nuevoId(),
      tipo: obj.tipo,
      descripcion: obj.descripcion,
      monto: Number(obj.monto),
      fecha: obj.fecha || hoyISO()
    });
    guardarJSON(KEYS.transacciones, lista);
  }

  /* ---------- contactos ---------- */

  function getContactos() {
    return leerJSON(KEYS.contactos, []);
  }

  /**
   * @param {{nombre:string, alias:string, cbu:string}} obj
   * @returns {object} el contacto creado (con id)
   */
  function addContacto(obj) {
    var lista = getContactos();
    var contacto = {
      id: nuevoId(),
      nombre: obj.nombre,
      alias: obj.alias,
      cbu: obj.cbu
    };
    lista.push(contacto);
    guardarJSON(KEYS.contactos, lista);
    return contacto;
  }

  /* ---------- sesión ---------- */

  function iniciarSesion() {
    localStorage.setItem(KEYS.sesion, "true");
  }

  function haySesion() {
    return localStorage.getItem(KEYS.sesion) === "true";
  }

  function cerrarSesion() {
    localStorage.removeItem(KEYS.sesion);
  }

  /**
   * Guard de página: si no hay sesión activa, redirige al login.
   * Se llama al comienzo de los scripts de las pantallas privadas.
   */
  function requireSesion() {
    if (!haySesion()) {
      window.location.href = "login.html";
    }
  }

  /* ---------- formato / etiquetas ---------- */

  /** Formatea un número como moneda estilo es-AR: $1.234,56 */
  function formatoMoneda(n) {
    var valor = Number(n) || 0;
    try {
      return valor.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2
      });
    } catch (e) {
      return "$" + valor.toFixed(2);
    }
  }

  var ETIQUETAS_TIPO = {
    compra: "Compra",
    deposito: "Depósito",
    transferencia_recibida: "Transferencia recibida",
    envio: "Envío"
  };

  /** Devuelve el tipo de transacción en formato legible. */
  function getTipoTransaccion(tipo) {
    return ETIQUETAS_TIPO[tipo] || tipo;
  }

  /* ---------- API pública ---------- */

  global.RappiWallet = {
    KEYS: KEYS,
    seedData: seedData,
    getSaldo: getSaldo,
    setSaldo: setSaldo,
    getTransacciones: getTransacciones,
    addTransaccion: addTransaccion,
    getContactos: getContactos,
    addContacto: addContacto,
    iniciarSesion: iniciarSesion,
    haySesion: haySesion,
    cerrarSesion: cerrarSesion,
    requireSesion: requireSesion,
    formatoMoneda: formatoMoneda,
    getTipoTransaccion: getTipoTransaccion
  };
})(window);
