---
layout: page
title: Contact — Simple is better than complex
permalink: /contact/
---

<h4 class="page-title">Contact</h4>
<hr class="sm">

<p>Hi there!</p>

<p>
  Here you can send me a message, suggest a topic you wanna read about, inform me in case you've found a bug/error,
  or simply say hello. Anything, really.
</p>

<p>If you prefer, you can also send me a message directly via <a href="mailto:vitor@freitas.com">vitor@freitas.com</a>.</p>

<hr>

<form id="contact_form">
  <div class="row">
    <div class="six columns">
      <label for="id_email">Your email</label>
      <input class="u-full-width" placeholder="your@email.com" id="id_email" type="email">
    </div>
    <div class="six columns">
      <label for="id_subject">Subject</label>
      <input class="u-full-width" placeholder="Contact reason" id="id_subject" type="text">
    </div>
  </div>
  <label for="id_message">Message</label>
  <textarea class="u-full-width" placeholder="Hi Vitor…" id="id_message"></textarea>
  <button class="button-primary" type="submit" id="id_send">Send</button>
</form>

<div id="contact_modal" class="modal">
  <div class="modal-header">
    <a href="#">
      <span class="fa fa-close"></span>
    </a>
    <h5></h5>
  </div>
  <div class="modal-body">
  </div>
</div>