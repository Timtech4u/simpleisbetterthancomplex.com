$(function () {
  $.ajax({
    url: '/api/latest-comments/',
    type: 'get',
    dataType: 'json',
    success: function (data) {
      $("#latest-comments").html(data.html);
    },
    error: function () {
      $("#latest-comments").closest(".card").remove();
    }
  });
});
