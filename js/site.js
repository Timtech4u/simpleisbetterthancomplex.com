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

  // Social Share
  $(".post-share .social a").click(function () {
    if ($(this).hasClass("js-send-email")) {
      var container = $(this).closest(".card");
      $("#email_this_thumbnail").attr("src", $(".featured-image", container).attr("src"));
      $("#email_this_category").text($(".post-category", container).text());
      $("#email_this_title").text($(".post-title", container).text());
      $("#email_this_date").text($(".post-meta-date", container).text());
      $("#email_this_author").text($(".post-meta-author", container).text());
      $("#email_this_modal").openModal();
    }
    else {
      var url = $(this).attr("href");
      var width = 600;
      var height = 400;
      var left = (screen.width / 2) - (width / 2);
      var top = (screen.height / 2) - (height / 2);
      var strWindowFeatures = "height=" + height + ", width=" + width + ", left=" + left + ", top=" + top + ", menubar=no,location=no,resizable=yes,scrollbars=yes,status=no";
      var windowObjectReference = window.open(url, "SocialShareWindow", strWindowFeatures);
    }
    return false;
  });

  $("header .toggle-menu a").click(function () {
    $("header .menu-left").toggleClass("open");
  });

});
