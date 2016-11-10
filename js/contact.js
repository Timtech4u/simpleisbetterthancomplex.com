$(function () {
  $("#id_send").click(function (event) {
    event.preventDefault();

    var from_email = $("#id_email").val();
    var message = $("#id_message").val();

    var errors = '';
    if (from_email === '') {
      errors += '<p>Email is a required field.</p>'
    }

    if (message === '') {
      errors += '<p>Message is a required field.</p>'
    }
    else {
      subject = message.substring(0, 30) + "...";
      message = message.split("\n").join("<br>");
    }

    if (errors.length > 0) {
      $("#contact_modal .modal-header h5").text("Error");
      $("#contact_modal .modal-body").html(errors);
      $("#contact_modal").openModal();
    }
    else {
      $.ajax({
        type: "POST",
        url: "https://mandrillapp.com/api/1.0/messages/send.json",
        data: {
          'key': '6cljZquTNAW4Ha3elGZAnw',
          'message': {
            'from_name': 'Contact at Simple is Better Than Complex',
            'from_email': 'contact@simpleisbetterthancomplex.com',
            'to': [
                {
                  'email': 'vitor@simpleisbetterthancomplex.com',
                  'name': 'Vitor Freitas',
                  'type': 'to'
                }
              ],
            'headers': {
                'Reply-To': from_email
            },
            'autotext': 'true',
            'subject': subject,
            'html': message
          }
        },
        beforeSend: function () {
          $("#id_send").prop("disabled", true);
          $("#id_send").text("Sending…");
        },
        success: function (data) {
          $("#contact_modal .modal-header h5").text("Success!");
          $("#contact_modal .modal-body").html("<p>Thanks for your message! I will get back to you soon!</p>");
          $("#contact_modal").openModal();
          $("#contact_form input, #contact_form textarea").val("");
        },
        error: function () {
          $("#contact_modal .modal-header h5").text("Error");
          $("#contact_modal .modal-body").html("<p>An error ocurred while trying to send your message. Please try again later.</p>");
          $("#contact_modal").openModal();
        },
        complete: function () {
          $("#id_send").prop("disabled", false);
          $("#id_send").text("Send");
        }
       });
    }

  });
});