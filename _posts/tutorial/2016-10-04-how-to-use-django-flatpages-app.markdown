---
title: "How to Use Django's Flatpages App"
date: 2016-10-04 13:06:00 +0300
category: tutorial
tags: django contrib flatpages
thumbnail: "/media/2016/10/featured-flatpages.jpg"
featured_image: "/media/2016/10/featured-flatpages.jpg"
featured_image_source: "https://www.pexels.com/photo/wood-light-creative-space-68562/"
---

Django ships with a Flatpages application that enables the user to create flat HTML pages and store it in the database.
It can be very handy for pages like About, Privacy Policy, Cookies Policy and so on.

Basically it works like this: You define a master page for the content to be displayed, the user creates a new flatpage
in the Django Admin interface, picks a URL and add the content. The user can also select if the page requires login or
not.

***

#### Installation

First add the `sites` and `flatpages` contrib apps to your `INSTALLED_APPS`:

{% highlight python %}
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django.contrib.sites',
    'django.contrib.flatpages',
]
{% endhighlight %}

If you wasn't using the `sites` app, you may also need to add a `SITE_ID` to the **settings.py** file:

{% highlight python %}
SITE_ID = 1
{% endhighlight %}

Now update your **urls.py** with the flatpages urls:

{% highlight python %}
from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^pages/', include('django.contrib.flatpages.urls')),
    url(r'^admin/', admin.site.urls),
]
{% endhighlight %}

Migrate the database:

{% highlight bash %}
$ python manage.py migrate

Operations to perform:
  Apply all migrations: admin, auth, contenttypes, core, flatpages, sessions, sites
Running migrations:
  Rendering model states... DONE
  Applying sites.0001_initial... OK
  Applying flatpages.0001_initial... OK
  Applying sites.0002_alter_domain_unique... OK
{% endhighlight %}

Add a default template for the flatpages. The default location is **flatpages/default.html**:

{% highlight html %}
{% raw %}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ flatpage.title }}</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
<body>
  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">Flatpages Example</a>
      </div>
    </div>
  </nav>
  <div class="container">
    {{ flatpage.content }}
  </div>
</body>
</html>
{% endraw %}
{% endhighlight %}

The important part here is this two variables: `flatpage.title` and `flatpage.content`.

***

#### Usage

Go to the Django Admin and add a new page. It should be very intuitive.

![New Flatpage](/media/2016/10/new-flatpage.png)

Save it and go to the flatpage URL, that is `/pages/privacy/`:

![Privacy Policy Flatpage](/media/2016/10/flatpage-html.png)

***

#### Rendering a List of Flatpages

You can list all the available flatpages like this in a template:

{% highlight html %}
{% raw %}
{% load flatpages %}
{% get_flatpages as flatpages %}
<ul>
  {% for page in flatpages %}
    <li><a href="{{ page.url }}">{{ page.title }}</a></li>
  {% endfor %}
</ul>
{% endraw %}
{% endhighlight %}

You can try this Bootstrap template snippet:

{% highlight html %}
{% raw %}
{% load flatpages %}<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ flatpage.title }}</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  </head>
  <body>
    <nav class="navbar navbar-default">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Flatpages Example</a>
        </div>
        <div class="collapse navbar-collapse" id="menu">
          {% get_flatpages as flatpages %}
          <ul class="nav navbar-nav">
            {% for page in flatpages %}
              <li><a href="/pages{{ page.url }}">{{ page.title }}</a></li>
            {% endfor %}
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      {{ flatpage.content }}
    </div>
  </body>
</html>
{% endraw %}
{% endhighlight %}

It will look something like that:

![Privacy Policy Flatpage with Menu](/media/2016/10/flatpage-html-2.png)

***

#### More

If you want to find out more about the Flatpages app, refer to the
[Django's Official](https://docs.djangoproject.com/en/1.10/ref/contrib/flatpages/){:target="_blank"} documentation about it.
