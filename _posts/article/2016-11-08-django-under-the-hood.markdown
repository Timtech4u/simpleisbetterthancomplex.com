---
title: "Django Under the Hood 2016"
date: 2016-11-08 16:13:00 +0300
category: article
tags: django conference duth
thumbnail: "/media/2016/11/featured-duth1.jpg"
featured_image: "/media/2016/11/featured-duth1.jpg"
---

This was the third edition of the Django: Under The Hood (DUTH) conference. Two days of awesome talks and two days of sprints.
The conference was organised by members of the Django community, including several members of the Django core
team, and in association with the Dutch Django Association.

The conference was great! It was my first time in a DUTH conference and also my first time in Amsterdam, so it was
quite an experience for me! I'm writing this post to share a little bit of what happened there.

***

#### About the Conference

![Django Under The Hood](/media/2016/11/duth2.jpeg)

<small>Picture by Bartek Pawlik: <a href="https://500px.com/photo/181370473/group-photo-at-django-under-the-hood-2016-by-django-under-the-hood" target="_blank">https://500px.com/photo/181370473/group-photo-at-django-under-the-hood-2016-by-django-under-the-hood</a></small>

Over 300 Djangonauts. Stellar organization. Nine great talks. Two days of sprints. Awesome venue. Very healthy and
friendly community. You could feel the excitement and enthusiasm of everyone participating in the conference. This was
quite a surprise for me! Because the parameter of comparison I had was previous academic conferences I've attended --
and they are far from being that fun :-)

In the first day we had three talks, starting by Andrew Godwin presenting the underlyings of Channels and discussing
about the Django specific implementations.

Ana Balica talked about testing in Django, she presented how the testing framework have evolved since Django 1.0, how
the testing framework works under the hood and gave some great insights and tips about extra resources to increase the
quality of the tests.

The last talk of the first day was presented by Aymeric Augustin, he talked about debugging performance, both on front
end and backend, tackling performance issues related to CSS, JS and much more. In the backend, he talked about the
implications of the ORM and gave some insights on the differences between `select_related` and `prefetch_related` and
also on other ORM related optimizations.

The second day started with a keynote by Jennifer Akullian from Keen.io. She talked about mental health in tech. It's
a very big and serious topic. Many developers worldwide are working way too much and experiencing burnouts, and we are
not talking about it.

Loïc Bistuer talked about Django Validation, exploring the main concerns of data validation, such as enforcement, user
experience, performance and convenience. He also talked about the different approach to validate user input.

Idan Gazit is a software developer from Heroku, and gave a presentation about the modern JavaScript. He talked about
how to work with the newest JavaScript versions, discussed about frameworks, packaging, orchestration and deployment.

Custom Database Backends was the next topic, presented by Michael Manfre. He works at Microsoft and is one of the
maintainers of the django-mssql package, which is a third-party database backend to support Microsoft SQL Server. He
talked about the challanges to implement a custom database backends and shared his experience implementing the
Microsoft SQL Server backend for Django.

Nadia Eghbal tackled the challanges of funding open source. She highlight how tough it is and how different it is from
other types of funding, such as startup funding, academic funding, etc. The problem is not only with the money itself
but also with the _access_ to the money. Right now many open source funding happens ad hoc, such as crowdfunding,
bouties, tipping, but none of them are sustainable.

Finally, the last talk was about Django at Instagram, presented by Carl Meyer, a Django Core developer and Instagram
employee. He talked how Django was important for the Instagram growth and how it is still used today. He shared some
very impressive numbers, such as 95 million photos and videos are uploaded every day, handling up to 4.2 billion likes
every day. In total, their database holds more than 2.3 trillion likes in total. To do that, Instagram have tens of
thousands Django servers running. He talked about the evolution of Instagram and some fun facts on how they migrated
from Django 1.3 to Django 1.8.

***

#### Talks

Below you can find all the nine talks that happened in the DUTH conference in the first two days.

<div class="row" style="margin-bottom: 30px">
  <div class="six columns">
    <h5>Channels <small>By ANDREW GODWIN</small></h5>
    <p>
      <img alt="Channels By Andrew Godwin" src="/media/2016/11/channels.jpg">
    </p>
    <p>
      <a href="https://twitter.com/andrewgodwin" target="_blank"><i class="fa fa-twitter"></i> @andrewgodwin</a><br>
      <a href="/media/2016/11/channels.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/rsEkQbMLCH4?t=55m9s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
  <div class="six columns">
    <h5>Testing <small>By ANA BALICA</small></h5>
    <p>
      <img src="/media/2016/11/testing.jpg" alt="Channels By Ana Balica">
    </p>
    <p>
      <a href="https://twitter.com/anabalica" target="_blank"><i class="fa fa-twitter"></i> @anabalica</a><br>
      <a href="/media/2016/11/testing.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/rsEkQbMLCH4?t=2h17m10s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
</div>

<div class="row" style="margin-bottom: 30px">
  <div class="six columns">
    <h5>Debugging <small>By AYMERIC AUGUSTIN</small></h5>
    <p>
      <img alt="Debugging By Aymeric Augustin" src="/media/2016/11/debugging.jpg">
    </p>
    <p>
      <a href="https://twitter.com/aymericaugustin" target="_blank"><i class="fa fa-twitter"></i> @aymericaugustin</a><br>
      <a href="/media/2016/11/debugging.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/rsEkQbMLCH4?t=3h14m8s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
  <div class="six columns">
    <h5>Mental Health <small>By JENNIFER AKULLIAN</small></h5>
    <p>
      <img alt="Mental Health By Jennifer Akullian" src="/media/2016/11/mental-health.jpg">
    </p>
    <p>
      <a href="https://twitter.com/JennyAkullian" target="_blank"><i class="fa fa-twitter"></i> @JennyAkullian</a><br>
      <a href="/media/2016/11/mental-health.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/kWH3Waigi5Y?t=36m30s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
</div>

<div class="row" style="margin-bottom: 30px">
  <div class="six columns">
    <h5>Validation <small>By LOÏC BISTUER</small></h5>
    <p>
      <img alt="Validation By Loïc Bistuer" src="/media/2016/11/validation.jpg">
    </p>
    <p>
      <a href="https://twitter.com/loic84" target="_blank"><i class="fa fa-twitter"></i> @loic84</a><br>
      <a href="/media/2016/11/validation.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/kWH3Waigi5Y?t=1h15m00s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
  <div class="six columns">
    <h5>Modern JavaScript <small>By IDAN GAZIT</small></h5>
    <p>
      <img alt="Modern JavaScript By Idan Gazit" src="/media/2016/11/js.jpg">
    </p>
    <p>
      <a href="https://twitter.com/idangazit" target="_blank"><i class="fa fa-twitter"></i> @idangazit</a><br>
      <a href="/media/2016/11/js.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/kWH3Waigi5Y?t=3h17m30s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
</div>

<div class="row" style="margin-bottom: 30px">
  <div class="six columns">
    <h5>Database Backends <small>By MICHAEL MANFRE</small></h5>
    <p>
      <img alt="Database Backends By Michael Manfre" src="/media/2016/11/db.jpg">
    </p>
    <p>
      <a href="https://twitter.com/manfre" target="_blank"><i class="fa fa-twitter"></i> @manfre</a><br>
      <a href="/media/2016/11/db.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/kWH3Waigi5Y?t=4h18m30s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
  <div class="six columns">
    <h5>OSS Funding <small>By NADIA EGHBAL</small></h5>
    <p>
      <img alt="OSS Funding By Nadia Eghbal" src="/media/2016/11/oss.jpg">
    </p>
    <p>
      <a href="https://twitter.com/nayafia" target="_blank"><i class="fa fa-twitter"></i> @nayafia</a><br>
      <a href="/media/2016/11/oss.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/kWH3Waigi5Y?t=5h48m45s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
</div>

<div class="row">
  <div class="six columns">
    <h5>Django at Instagram <small>By CARL MEYER</small></h5>
    <p>
      <img alt="Django at Instagram By Carl Meyer" src="/media/2016/11/instagram.jpg">
    </p>
    <p>
      <a href="https://twitter.com/carljm" target="_blank"><i class="fa fa-twitter"></i> @carljm</a><br>
      <a href="/media/2016/11/instagram.pdf" target="_blank"><i class="fa fa-file-pdf-o"></i> Slides</a><br>
      <a href="https://youtu.be/kWH3Waigi5Y?t=6h30m00s" target="_blank"><i class="fa fa-youtube"></i> Recording</a>
    </p>
  </div>
</div>

***

It was a unique experience. The talks were great. For the next weeks I will try to summarize some of the contents from
the talks and write it down in form of posts here in the blog, so we can explore together some of the topics and learn
more about it!

Some extra links:

* [Django: Under The Hood Website](https://djangounderthehood.com){:target="_blank"}
* [Photos of the Conference](https://500px.com/djangounderthehood){:target="_blank"}
* [Django: Under The Hood 2016 - Live stream - Day 1](https://youtu.be/rsEkQbMLCH4){:target="_blank"}
* [Django: Under The Hood 2016 - Live stream - Day 2](https://youtu.be/kWH3Waigi5Y){:target="_blank"}

