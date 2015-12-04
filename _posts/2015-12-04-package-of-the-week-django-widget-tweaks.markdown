---
layout: post
title:  "Package of the Week: Django Widget Tweaks"
date:   2015-12-04 12:00:00
author: Vitor Freitas
tags: python django package
---

When it comes to build forms, [Django Forms][django-forms]{:target="_blank"} can be really handy. If your application provide ways for the end-user to input data, it's strongly advised to do so through the built-in Django Forms. It will automate a good amount of work as well as providing a really stable and secure functionality.

In a nutshell, Django handles three distinct parts of the work involved in forms:

1. Preparing and restructuring data to make it ready for rendering;
2. Creating HTML forms for the data;
3. Receiving and processing submitted forms and data from the client.

The parts 1 and 3 are usually fine for the most cases. But when it comes to the actual HTML forms rendering, sometimes it lacks some options.

That's where the [Django Widget Tweaks][django-widget-tweaks]{:target="_blank"} takes place. I've been using it on my past projects, and I find it really useful. In this brief article, I will introduce you to the basics of this package, and show some of its use cases.


***

#### Installation

You can install it with `pip`, or download it from [PyPI][django-widget-tweaks]{:target="_blank"} if you prefer:

{% highlight bash %}
$ pip install django-widget-tweaks
{% endhighlight %}

Now add `widget_tweaks` to your `INSTALLED_APPS`:

{% highlight python %}
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'widget_tweaks',

    'simple_forms.apps.core',
]
{% endhighlight %}


****

#### Usage

[django-forms]: https://docs.djangoproject.com/en/1.9/topics/forms/
[django-widget-tweaks]: https://pypi.python.org/pypi/django-widget-tweaks