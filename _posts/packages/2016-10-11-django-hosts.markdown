---
layout: post
title: "Package of the Week: django-hosts"
date: 2016-10-11 11:31:00 +0300
tags: django django-hosts urlconf
category: packages
thumbnail: "/media/2016/10/featured-django-hosts.jpg"
featured_image: "/media/2016/10/featured-django-hosts.jpg"
---

This is a very handy Django package that I've used in a couple of projects. Essentially **django-hosts** let you serve
different parts of your application under different subdomains. For example, let's say we have a Django application
deployed on **www.example.com**. With this app you can serve an e-commerce under **shop.example.com** and the help
center under **help.example.com**. And in the end, it's just a single Django website.

It can also be used to host user spaces, with a wildcard, where your users could get their own subdomain like
**vitor.example.com** or **erica.example.com**. But that require a few tweaks in the DNS configuration.

A small caveat of developing with **django-hosts** is that you will need to do some configurations in your local
machine, which can differ if you are using Windows, Linux or Mac.

***

#### Installation

Install it with pip:

{% highlight bash %}
pip install django-hosts
{% endhighlight %}

Add the `django_hosts` to the `INSTALLED_APPS`:

{% highlight python %}
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_hosts',

    'core',
]
{% endhighlight %}

Add the `HostsRequestMiddleware` in the beginning of the `MIDDLEWARE` and `HostsResponseMiddleware` in the end of the
`MIDDLEWARE`:

{% highlight python %}
MIDDLEWARE = [
    'django_hosts.middleware.HostsRequestMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'django_hosts.middleware.HostsResponseMiddleware',
]
{% endhighlight %}

Still in the **settings.py**, add the following configuration variables:

{% highlight python %}
ROOT_HOSTCONF = 'mysite.hosts'  # Change `mysite` to the name of your project
DEFAULT_HOST = 'www'  # Name of the default host, we will create it in the next steps
{% endhighlight %}

Create a file named **hosts.py** right next to the **urls.py**:

{% highlight bash %}
mysite/
 |-- __init__.py
 |-- hosts.py  # <-- The `ROOT_HOSTCONF` refers to this file
 |-- settings.py
 |-- urls.py
 +-- wsgi.py
{% endhighlight %}

**mysite/hosts.py**

{% highlight python %}
from django.conf import settings
from django_hosts import patterns, host

host_patterns = patterns('',
    host(r'www', settings.ROOT_URLCONF, name='www'),  # <-- The `name` we used to in the `DEFAULT_HOST` setting
)
{% endhighlight %}

***

#### Usage

Let's create an app named **help** to illustrate the usage of the **django-hosts**:

{% highlight python %}
django-admin startapp help
{% endhighlight %}

Then inside of the new app, we create a **urls.py** module:

**help/urls.py**

{% highlight python %}
from django.conf.urls import url, include

from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^articles/$', views.articles, name='articles'),
    url(r'^articles/(?P<pk>\d+)/$', views.article_details, name='article_details'),
]
{% endhighlight %}

Now we update the **mysite/hosts**, which is our `ROOT_HOSTCONF`:

**mysite/hosts.py**

{% highlight python %}
from django.conf import settings
from django_hosts import patterns, host

host_patterns = patterns('',
    host(r'www', settings.ROOT_URLCONF, name='www'),
    host(r'help', 'help.urls', name='help'),
)
{% endhighlight %}

***

#### Testing Locally

In order to test it locally, you will need to setup a local DNS host.

On Linux and Mac, the file is located in the path `/etc/hosts`. For Windows it should be somewhere in
`%SystemRoot%\system32\drivers\etc\hosts`.

**hosts**

{% highlight bash %}
127.0.0.1 localhost
255.255.255.255 broadcasthost
::1             localhost

127.0.0.1 www.mysite.local
127.0.0.1 help.mysite.local
{% endhighlight %}

<div class="container">
  <div class="row">
    <div class="six columns">
      <img src="/media/2016/10/django-hosts-1.png" alt="Django Hosts Help Site">
    </div>
    <div class="six columns">
      <img src="/media/2016/10/django-hosts-2.png" alt="Django Hosts My Site">
    </div>
  </div>
</div>

***

#### Templates

Now instead of using the `{% raw %}{% url 'home' %}{% endraw %}` notation, you can load the **django-hosts** template tags:

{% highlight html %}
{% raw %}
{% load hosts %}

<a href="{% host_url 'home' host 'www' %}">Homepage</a>
<a href="{% host_url 'articles' host 'help' %}">Help Articles</a>
{% endraw %}
{% endhighlight %}

***

#### Reverse

The **django-hosts** extends Django's default **reverse** function so you can pass an extra argument **host**:

{% highlight python %}
from django.shortcuts import render
from django_hosts.resolvers import reverse

def homepage(request):
    homepage_url = reverse('homepage', host='www')
    return render(request, 'homepage.html', {'homepage_url': homepage_url})
{% endhighlight %}

***

#### Further Reading

You can learn more by reading the [Official Documentation](https://django-hosts.readthedocs.io/en/latest/) or
browsing the [code on GitHub](https://github.com/jazzband/django-hosts).