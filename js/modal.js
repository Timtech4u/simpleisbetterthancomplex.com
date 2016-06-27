$.fn.closeModal = function () {
  $(".overlay").hide();
  $(this).hide();
  $("body").css("overflow", "auto");
};

$.fn.openModal = function () {
  $(".overlay").show();
  $(this).show();
  $("body").css("overflow", "hidden");
}

$(function () {
  $(".overlay, .modal .modal-header a").click(function (event) {
    event.preventDefault();
    $(".modal:visible").closeModal();
  });

  $("body").on("keydown", function (event) {
    var ESCAPE_KEY = 27;
    var key = event.which || event.keyCode;
    if (key == ESCAPE_KEY && $(".modal").is(":visible")) {
      $(".modal:visible").closeModal();
    }
  });
});
