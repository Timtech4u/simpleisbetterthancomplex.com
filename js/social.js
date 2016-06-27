$(function () {
  // Social Share
  $(".post-share .social a").click(function () {
    var url = $(this).attr("href");
    var width = 600;
    var height = 400;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);
    var strWindowFeatures = "height=" + height + ", width=" + width + ", left=" + left + ", top=" + top + ", menubar=no,location=no,resizable=yes,scrollbars=yes,status=no";
    var windowObjectReference = window.open(url, "SocialShareWindow", strWindowFeatures);
    return false;
  });
});
