---
layout: post
title: "Django Tips #2 humanize"
date: 2016-05-09
author: Vitor Freitas
tags: python django contrib
category: tips
---

Django comes with a set of template filters to add a "human touch" to your data. It is used to translate numbers and
dates into a human readable format.

Personally, I use the template filter `naturaltime` a lot. It looks good in the user interface and is very easy to
implement. Basically what it is gonna do is translate `09 May 2016 20:54:31` into `29 seconds ago` (considering when
**now** is **20:54:00**).

To install **Django Humanize**, add `django.contrib.humanize` to your `INSTALLED_APPS` setting:

{% highlight python %}
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django.contrib.humanize',
]
{% endhighlight %}

Now in the template, load the template tags:

{% highlight html %}
{% raw %}{% load humanize %}{% endraw %}
{% endhighlight %}

Using it is very straightforward, for example the `naturaltime` template filter:

{% highlight html %}
{% raw %}{% extends 'base.html' %}{% endraw %}

{% raw %}{% load humanize %}{% endraw %}

{% raw %}{% block content %}{% endraw %}
  <ul>
    {% raw %}{% for notification in notifications %}{% endraw %}
      <li>
        {% raw %}{{ notification }}{% endraw %}
        <small>{% raw %}{{ notification.date|naturaltime }}{% endraw %}</small>
      </li>
    {% raw %}{% empty %}{% endraw %}
      <li>You have no unread notification.</li>
    {% raw %}{% endfor %}{% endraw %}
  </ul>
{% raw %}{% endblock %}{% endraw %}
{% endhighlight %}

Following the available template filters:

| template filter | example |
|-----------------|---------|
| apnumber        | `1` becomes `one` |
| intcomma        | `4500000` becomes `4,500,000` |
| intword         | `1200000` becomes `1.2 million` |
| naturalday      | `08 May 2016` becomes `yesterday` |
| naturaltime     | `09 May 2016 20:54:31` becomes `29 seconds ago` |
| ordinal         | `3` becomes `3rd` |

Read more on the official [Django Documentation][django-docs-humanize]{:target="_blank"}.

[django-docs-humanize]: https://docs.djangoproject.com/en/dev/ref/contrib/humanize/