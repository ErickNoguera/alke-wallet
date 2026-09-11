/*
 * sendmoney.js — Pantalla de enviar dinero.
 * - Mostrar/ocultar el formulario de nuevo contacto (+ validación de CBU).
 * - Buscar en la agenda por nombre o alias.
 * - Seleccionar un contacto (resalte) para revelar el botón "Enviar dinero".
 * - Confirmación al pie tras el envío, con descuento de saldo y transacción.
 */
$(function () {
  "use strict";

  var RW = window.RappiWallet;
  RW.seedData();
  RW.requireSesion();

  var CBU_RE = /^\d{22}$/;
  var contactoSeleccionadoId = null;
  var terminoBusqueda = "";

  function pintarSaldo() {
    $("#saldo-actual").text(RW.formatoMoneda(RW.getSaldo()));
  }

  function alerta($contenedor, tipo, mensaje) {
    var $a = $(
      '<div class="alert alert-' + tipo + ' alert-dismissible fade show" role="alert">' +
        '<span></span>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>' +
      "</div>"
    );
    $a.find("span").text(mensaje);
    $contenedor.empty().append($a);
  }

  /* ---------- render de la agenda ---------- */

  function contactosFiltrados() {
    var t = terminoBusqueda.trim().toLowerCase();
    var lista = RW.getContactos();
    if (t === "") return lista;
    return lista.filter(function (c) {
      return (
        c.nombre.toLowerCase().indexOf(t) !== -1 ||
        c.alias.toLowerCase().indexOf(t) !== -1
      );
    });
  }

  function renderContactos() {
    var $ul = $("#lista-contactos").empty();
    var lista = contactosFiltrados();

    if (lista.length === 0) {
      $ul.append(
        $('<li class="list-group-item text-secondary"></li>').text(
          "No se encontraron contactos."
        )
      );
      return;
    }

    lista.forEach(function (c) {
      var $li = $(
        '<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" role="button"></li>'
      );
      $li.attr("data-id", c.id);
      $('<span></span>').text(c.nombre).appendTo($li);
      $('<small class="text-secondary"></small>').text(c.alias).appendTo($li);
      if (c.id === contactoSeleccionadoId) {
        $li.addClass("contacto-seleccionado active");
      }
      $ul.append($li);
    });
  }

  /* ---------- selección de contacto ---------- */

  $("#lista-contactos").on("click", "li[data-id]", function () {
    contactoSeleccionadoId = $(this).attr("data-id");
    var contacto = RW.getContactos().filter(function (c) {
      return c.id === contactoSeleccionadoId;
    })[0];

    renderContactos();
    $("#destinatario").text(contacto ? contacto.nombre : "");
    $("#panel-envio").show();
    $("#confirmacion").empty();
  });

  /* ---------- búsqueda ---------- */

  $("#form-busqueda").submit(function (e) {
    e.preventDefault();
    terminoBusqueda = $("#busqueda").val();
    renderContactos();
  });

  // Filtrado en vivo mientras se escribe (además del submit).
  $("#busqueda").on("input", function () {
    terminoBusqueda = $(this).val();
    renderContactos();
  });

  /* ---------- alta de contacto ---------- */

  $("#btn-agregar-contacto").on("click", function () {
    $("#form-nuevo-contacto").toggle();
  });

  $("#btn-cancelar-contacto").on("click", function () {
    $("#form-nuevo-contacto").hide();
    $("#formNuevoContacto")[0].reset();
    $("#nc-alert").empty();
  });

  $("#formNuevoContacto").submit(function (e) {
    e.preventDefault();

    var nombre = $("#nc-nombre").val().trim();
    var alias = $("#nc-alias").val().trim();
    var cbu = $("#nc-cbu").val().trim();

    if (nombre === "" || alias === "") {
      alerta($("#nc-alert"), "danger", "El nombre y el alias son obligatorios.");
      return;
    }
    if (!CBU_RE.test(cbu)) {
      alerta($("#nc-alert"), "danger", "El CBU debe tener exactamente 22 dígitos.");
      return;
    }

    RW.addContacto({ nombre: nombre, alias: alias, cbu: cbu });
    $("#formNuevoContacto")[0].reset();
    $("#form-nuevo-contacto").hide();
    $("#nc-alert").empty();
    renderContactos();
    alerta($("#confirmacion"), "success", "Contacto \"" + nombre + "\" agregado a tu agenda.");
  });

  /* ---------- envío de dinero ---------- */

  $("#formEnvio").submit(function (e) {
    e.preventDefault();

    var contacto = RW.getContactos().filter(function (c) {
      return c.id === contactoSeleccionadoId;
    })[0];
    if (!contacto) {
      alerta($("#confirmacion"), "danger", "Seleccioná un contacto primero.");
      return;
    }

    var monto = parseFloat($("#monto-envio").val());
    if (isNaN(monto) || monto <= 0) {
      alerta($("#confirmacion"), "danger", "Ingresá un monto válido mayor a cero.");
      return;
    }
    if (monto > RW.getSaldo()) {
      alerta($("#confirmacion"), "danger", "Saldo insuficiente para realizar el envío.");
      return;
    }

    RW.setSaldo(RW.getSaldo() - monto);
    RW.addTransaccion({
      tipo: "envio",
      descripcion: "Envío a " + contacto.nombre,
      monto: -monto
    });

    pintarSaldo();
    $("#formEnvio")[0].reset();
    $("#panel-envio").hide();
    contactoSeleccionadoId = null;
    renderContactos();
    alerta(
      $("#confirmacion"),
      "success",
      "Enviaste " + RW.formatoMoneda(monto) + " a " + contacto.nombre + " con éxito."
    );
  });

  /* ---------- init ---------- */

  pintarSaldo();
  renderContactos();
});
