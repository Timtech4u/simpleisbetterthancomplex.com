$(function () {
  var urls = [];
  $("[data-ga-identifier]").map(function(){
    urls.push($(this).attr("data-ga-identifier"));
  });
  $.ajax({
    url: '/api/page-views/',
    data: {
      'url': urls
    },
    type: 'get',
    dataType: 'json',
    success: function (data) {
      urls.forEach(function (url) {
        $("[data-ga-identifier='" + url + "']").text(data[url]);
      });
    },
    error: function () {

    }
  });
});
