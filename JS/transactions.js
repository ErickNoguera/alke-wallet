/*
 * transactions.js — Pantalla de últimos movimientos.
 * Toma la lista de transacciones desde Local Storage y la muestra con jQuery,
 * permitiendo filtrar por tipo (compra, depósito, transferencia recibida, envío).
 */
$(function () {
  "use strict";

  var RW = window.RappiWallet;
  RW.seedData();
  RW.requireSesion();

  // Lista real de transacciones (persistida en Local Storage).
  var listaTransacciones = RW.getTransacciones();

  /** Tipo de transacción en formato legible. */
  function getTipoTransaccion(tipo) {
    return RW.getTipoTransaccion(tipo);
  }

  /** Renderiza los movimientos que coinciden con el filtro ("todos" = todos). */
  function mostrarUltimosMovimientos(filtro) {
    var $ul = $("#lista-movimientos").empty();

    var items = listaTransacciones.filter(function (t) {
      return filtro === "todos" || t.tipo === filtro;
    });

    if (items.length === 0) {
      $ul.append(
        $('<li class="list-group-item text-secondary"></li>').text(
          "No hay movimientos para este filtro."
        )
      );
      return;
    }

    items.forEach(function (t) {
      var esIngreso = Number(t.monto) >= 0;
      var $li = $(
        '<li class="list-group-item d-flex justify-content-between align-items-start"></li>'
      );

      var $info = $('<div></div>');
      $('<div class="fw-semibold"></div>').text(t.descripcion).appendTo($info);
      $('<small class="text-secondary"></small>')
        .text(getTipoTransaccion(t.tipo) + " · " + t.fecha)
        .appendTo($info);

      var $monto = $('<span class="fw-bold"></span>')
        .addClass(esIngreso ? "monto-ingreso" : "monto-egreso")
        .text((esIngreso ? "+ " : "- ") + RW.formatoMoneda(Math.abs(t.monto)));

      $li.append($info).append($monto);
      $ul.append($li);
    });
  }

  $("#filtro-tipo").on("change", function () {
    mostrarUltimosMovimientos($(this).val());
  });

  // Render inicial.
  mostrarUltimosMovimientos("todos");
});
