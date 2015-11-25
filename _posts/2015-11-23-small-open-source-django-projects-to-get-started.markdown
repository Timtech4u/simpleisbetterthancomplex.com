---
layout: post
title:  "Small Open-Source Django Projects to Get Started"
date:   2015-11-23 12:00:00
author: Vitor Freitas
tags: django python
thumbnail: "/media/bootcamp.png"
---

Learning Django and Python can be very fun. I personally love programming with Python and for the most part, work with the Django framework. But in the beginning some stuff can be confusing, especially if you are coming from a Java or C♯ background, like me.

The biggest challenges for me was to get familiar with the initial Django setup, understand the URL routing, and get to know how to organize the project files and apps. I've not being around for that long, it's been only three years now since I started to mess around with Django. 

Regarding those challenges, now I can say I'm really comfortable with the Django setup (you will eventually get there after creating a few projects), I fully understand how Django routes URLs but I'm always googling around to find a suitable regex for my needs, and finally, I'm always trying new ways to organize my Django projects.

In this post I will present you some of my open-source Django projects, which can help you to get started and learn more about how to get things done with Django. Of course they are not perfect, using the best practices nor anything. Some of them I developed while I was still learning the basics, but as they are quite small projects, they can be very useful in a sense that you can dive into the source code, without drown in a ocean of complexity.


***


#### Bootcamp

![Bootcamp]({{ "/media/bootcamp.png" | prepend: site.baseurl }} "Bootcamp: An enterprise social network")

Bootcamp is a simple concept of a enterprise social network. I've developed it to encourage the developers of a company I worked in the past to collaborate and share experiences. It's meant to be closed and to run inside a company. 

The whole idea was to have a simple feed app in the front page, like Twitter so we could share links and post some of our thoughts and keep track of what everyone was doing. Also we wanted a space that all developers could share some more elaborate content, hence the Articles app. And finally, we wanted a Q&A app, like StackOverflow, for questions related to our business and the softwares and projects we developed for our customers — which couldn't be shared openly.

A few things you can find within the Bootcamp project:

* [Feed app (A Twitter-like microblog)][bootcamp-feed]{:target="_blank"}
  * Live feed updates
  * Comments and likes
  * Track comments and likes changes/updates
* [Articles app (A collaborative blog)][bootcamp-articles]{:target="_blank"}
* [Question & Answers (A Stack Overflow-like platform)][bootcamp-qa]{:target="_blank"}
* [Notification center][bootcamp-notification]{:target="_blank"}
  * When someone likes and comments a feed post
  * When someone comments on a article you wrote
  * When someone answers your question, star or up-vote
* [Messages][bootcamp-messages]{:target="_blank"}
  * Simple async messages
  * Read/unread track
* [Search app][bootcamp-search]{:target="_blank"}
  * Quick and dirty search solution

You can grab the source code on GitHub and try the live demo on:

**Source Code**: [github.com/vitorfs/bootcamp][bootcamp-source]{:target="_blank"}  
**Live Demo**: [trybootcamp.vitorfs.com][bootcamp-demo]{:target="_blank"}


***


#### Woid

![Woid]({{ "/media/woid.png" | prepend: site.baseurl }} "Woid")

Woid is a web crawler that collects top stories on some web sites I usually read. I developed it be my home page so I can keep track of what people are talking about at the moment, so I never miss a good story. I also archive them, so I can look back and see what was the most discussed topic on a specific date.

It's a fairly simple Django project, but if you are curious about how to do some simple crawling, it might be useful.

* [Clients][woid-clients]{:target="_blank"}
  * Basic clients using the [requests][woid-requests]{:target="_blank"} library and [Beautiful Soup][woid-bs4]{:target="_blank"} to parse the data
* [Crawlers][woid-crawlers]{:target="_blank"}
  * Getting the parsed data, calculating story score and saving the updates to the database
* [Server script][woid-top]{:target="_blank"}
  * The script I run on the server to update the stories every 5 minutes (30 minutes for some of them)

You can grab the source code on GitHub and see the actual site on:

**Source Code:** [github.com/vitorfs/woid][woid-source]{:target="_blank"}  
**Website:** [woid.io][woid-site]{:target="_blank"}


***


#### Bloodhound

![Bloodhound]({{ "/media/bloodhound.png" | prepend: site.baseurl }} "Bloodhound")

Bloodhound is also a simple web crawler that runs the whole day indexing and tracking price changes on a Finnish retail store named [Verkkokauppa][bloodhound-verkkokauppa]{:target="_blank"}. The idea was to store all the price changes for every product in their website, so before I buy something, I could check if I'm paying the best price.

There isn't much to see regarding to the Django part, it's more about an interface to display the collected data.

* [Core app][bloodhound-core]{:target="_blank"}
  * Simple views and template to display the collected data
* [Sniffer app][bloodhound-sniffer]{:target="_blank"}
  * Crawling frontier model and the crawler source code
* [Server script][bloodhound-scripts]{:target="_blank"}
  * Index product script
  * Update prices script

You can grab the source code on GitHub and see the actual site on:

**Source Code:** [github.com/vitorfs/bloodhound][bloodhound-source]{:target="_blank"}  
**Website:** [bloodhound.me][bloodhound-site]{:target="_blank"}


***


#### Parsifal

![Parsifal]({{ "/media/parsifal.png" | prepend: site.baseurl }} "Parsifal")

Parsifal is a tool I developed a couple of years ago, while doing my Masters Degree. If you are not familiar with some research practices, this app might not be really meaningful for you and what it does can be confusing. Anyway, it's meant to help researchers do literature reviews.

There is still some old code there, but the app is pretty stable. It was one of my first Django projects and I still maintain actively, as I personally use on my daily activities and there is a good amount of users that also uses it. Even if the core of this app doesn't make sense for you, there is still some simple apps you can use to learn more about Django.

* [Auth][parsifal-auth]{:target="_blank"}
  * Authentication
  * Password reset
  * Registration
* [Blog][parsifal-blog]{:target="_blank"}
* [Help articles][parsifal-help]{:target="_blank"}
* [User profile][parsifal-profile]{:target="_blank"}
  * Extended user profile
  * Uploading and croping profile pictures
* [Follow users][parsifal-follow]{:target="_blank"}

You can grab the source code on GitHub and see the actual site on:

**Source Code:** [github.com/vitorfs/parsifal][parsifal-source]{:target="_blank"}  
**Website:** [parsif.al][parsifal-site]{:target="_blank"}


***

That's it for now. I hope those projects can help you learning a little bit more about the Django framework. There's a lot more to explore and to learn. If you are just starting, keep things simple. Do always the obvious solution first, even if it's not the best solution. Get comfortable with the framework first. Get your hands dirty! That's the only way to truly learn something.


[bootcamp-feed]: https://github.com/vitorfs/bootcamp/tree/master/bootcamp/feeds
[bootcamp-articles]: https://github.com/vitorfs/bootcamp/tree/master/bootcamp/articles
[bootcamp-qa]: https://github.com/vitorfs/bootcamp/tree/master/bootcamp/questions
[bootcamp-notification]: https://github.com/vitorfs/bootcamp/tree/master/bootcamp/activities
[bootcamp-messages]: https://github.com/vitorfs/bootcamp/tree/master/bootcamp/messages
[bootcamp-search]: https://github.com/vitorfs/bootcamp/tree/master/bootcamp/search
[bootcamp-source]: https://github.com/vitorfs/bootcamp/
[bootcamp-demo]: http://trybootcamp.vitorfs.com/

[woid-clients]: https://github.com/vitorfs/woid/blob/master/woid/apps/services/wrappers.py
[woid-requests]: http://docs.python-requests.org/en/latest/
[woid-bs4]: http://www.crummy.com/software/BeautifulSoup/bs4/doc/
[woid-crawlers]: https://github.com/vitorfs/woid/blob/master/woid/apps/services/crawlers.py
[woid-top]: https://github.com/vitorfs/woid/blob/master/scripts/top.py
[woid-source]: https://github.com/vitorfs/woid/
[woid-site]: http://woid.io/

[bloodhound-verkkokauppa]: https://www.verkkokauppa.com/
[bloodhound-core]: https://github.com/vitorfs/bloodhound/tree/master/bloodhound/core
[bloodhound-sniffer]: https://github.com/vitorfs/bloodhound/tree/master/bloodhound/sniffer
[bloodhound-scripts]: https://github.com/vitorfs/bloodhound/tree/master/scripts
[bloodhound-source]: https://github.com/vitorfs/bloodhound/
[bloodhound-site]: https://bloodhound.me

[parsifal-auth]: https://github.com/vitorfs/parsifal/tree/master/parsifal/authentication
[parsifal-blog]: https://github.com/vitorfs/parsifal/tree/master/parsifal/blog
[parsifal-help]: https://github.com/vitorfs/parsifal/tree/master/parsifal/help
[parsifal-profile]: https://github.com/vitorfs/parsifal/blob/master/parsifal/authentication/models.py
[parsifal-follow]: https://github.com/vitorfs/parsifal/tree/master/parsifal/activities
[parsifal-source]: https://github.com/vitorfs/parsifal
[parsifal-site]: https://parsif.al
