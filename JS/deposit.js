/*
 * deposit.js — Pantalla de depósito.
 * Muestra el saldo actual, procesa el depósito, deja una leyenda con el monto,
 * muestra una alerta de Bootstrap y redirige al menú tras 2 segundos.
 */
$(function () {
  "use strict";

  var RW = window.RappiWallet;
  RW.seedData();
  RW.requireSesion();

  function pintarSaldo() {
    $("#saldo-actual").text(RW.formatoMoneda(RW.getSaldo()));
  }

  function mostrarAlertaExito(mensaje) {
    var $alerta = $(
      '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
        '<span></span>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>' +
      "</div>"
    );
    $alerta.find("span").text(mensaje);
    $("#alert-container").empty().append($alerta);
  }

  function mostrarAlertaError(mensaje) {
    var $alerta = $(
      '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
        '<span></span>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>' +
      "</div>"
    );
    $alerta.find("span").text(mensaje);
    $("#alert-container").empty().append($alerta);
  }

  pintarSaldo();

  $("#depositForm").submit(function (e) {
    e.preventDefault();

    var monto = parseFloat($("#monto").val());

    if (isNaN(monto) || monto <= 0) {
      mostrarAlertaError("Ingresá un monto válido mayor a cero.");
      return;
    }

    RW.setSaldo(RW.getSaldo() + monto);
    RW.addTransaccion({
      tipo: "deposito",
      descripcion: "Depósito en cuenta",
      monto: monto
    });

    pintarSaldo();
    $("#leyenda-deposito")
      .text("Depositaste " + RW.formatoMoneda(monto))
      .show();
    mostrarAlertaExito("Depósito realizado con éxito. Redirigiendo al menú…");

    $("#depositForm button[type=submit]").prop("disabled", true);
    setTimeout(function () {
      window.location.href = "menu.html";
    }, 2000);
  });
});
