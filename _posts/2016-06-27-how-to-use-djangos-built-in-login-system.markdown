---
layout: post
title: "How to Use Django's Built-in Login System"
date: 2016-06-27
author: Vitor Freitas
tags: django contrib auth django-1.9
category: tutorial
thumbnail: "/media/2016-06-27-how-to-use-djangos-built-in-login-system/featured-post-image.jpg"
featured_image: "/media/2016-06-27-how-to-use-djangos-built-in-login-system/featured-post-image.jpg"
featured_image_source: "https://www.pexels.com/photo/man-notebook-notes-macbook-7063/"
---

Django comes with a lot of built-in resources for the most common use cases of a Web application. The registration app
is a very good example and a good thing about it is that the features can be used out-of-the-box.

With the Django registration app you can take advantages of the following features:

* Login
* Logout
* Sign up
* Password reset

In this tutorial we will focus in the Login and Logout features.

***

#### Getting started

Before we start, make sure you have `django.contrib.auth` in your `INSTALLED_APPS` and the authentication middleware
properly configured in the `MIDDLEWARE_CLASSES` settings.

Both come already configured when you start a new Django project using the command `startproject`. So if you did not
remove the initial configurations you should be all set up.

In case you are starting a new project just to follow this tutorial, create a user using the command line just so we
can test the login and logout pages.

{% highlight bash %}
$ python manage.py createsuperuser
{% endhighlight %}

In the end of this article I will provide the source code of the example with the minimal configuration.

***

#### Configure the URL routes

First import the `django.contrib.auth.views` module and add a URL route for the login and logout views:

{% highlight python %}
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^login/$', auth_views.login, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),
    url(r'^admin/', admin.site.urls),
]
{% endhighlight %}

***

#### Create a login template

By default, the `django.contrib.auth.views.login` view will try to render the `registration/login.html` template. So
the basic configuration would be creating a folder named `registration` and place a `login.html` template inside.

Following a minimal login template:

{% highlight html %}
{% raw %}{% extends 'base.html' %}{% endraw %}

{% raw %}{% block title %}Login{% endblock %}{% endraw %}

{% raw %}{% block content %}{% endraw %}
  <h2>Login</h2>
  <form method="post">
    {% raw %}{% csrf_token %}{% endraw %}
    {% raw %}{{ form.as_p }}{% endraw %}
    <button type="submit">Login</button>
  </form>
{% raw %}{% endblock %}{% endraw %}
{% endhighlight %}

![Simple Login Page]({{ "/media/2016-06-27-how-to-use-djangos-built-in-login-system/login.png" | prepend: site.baseurl }} "Simple Login Page")

This simple example already validates username and password and authenticate correctly the user.

***

#### Customizing the login view

There are a few parameters you can pass to the `login` view to make it fit your project. For example, if you want to
store your login template somewhere else than `registration/login.html` you can pass the template name as a parameter:

{% highlight python %}
url(r'^login/$', auth_views.login, {'template_name': 'core/login.html'}, name='login'),
{% endhighlight %}

You can also pass a custom authentication form using the parameter `authentication_form`, incase you have implemented
a custom user model.

Now, a very important configuration is done in the `settings.py` file, which is the URL Django will redirect the user
after a successful authentication.

Inside the `settings.py` file add:

{% highlight python %}
LOGIN_REDIRECT_URL = 'home'
{% endhighlight %}

The value can be a hardcoded URL or a URL name. The default value for `LOGIN_REDIRECT_URL` is `/accounts/profile/`.

It is also important to note that Django will try to redirect the user to the `next` GET param.

***

#### Setting up logout view

After acessing the `django.contrib.auth.views.logout` view, Django will render the `registration/logged_out.html`
template. In a similar way as we did in the `login` view, you can pass a different template like so:

{% highlight python %}
url(r'^logout/$', auth_views.logout, {'template_name': 'logged_out.html'}, name='logout'),
{% endhighlight %}

Usually I prefer to use the `next_page` parameter and redirect either to the homepage of my project or to the login
page when it makes sense.

{% highlight python %}
url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
{% endhighlight %}

***

#### Running the example locally

The code used in this short tutorial is available at [GitHub][git-repo]{:target="_blank"}.

Clone the repository:

{% highlight bash %}
$ git clone https://github.com/sibtc/simple-django-login.git
{% endhighlight %}

Run migrations:

{% highlight bash %}
$ python manage.py migrate
{% endhighlight %}

Create a user:

{% highlight bash %}
$ python manage.py createsuperuser
{% endhighlight %}

Run the server:

{% highlight bash %}
$ python manage.py runserver
{% endhighlight %}

And open `127.0.0.1:8000/login` in your web browser.

***

Read more about the Django registration views in the official documentation [clicking here][django-docs-auth]{:target="_blank"}.

[django-docs-auth]: https://docs.djangoproject.com/en/1.9/topics/auth/default/#module-django.contrib.auth.views
[git-repo]: https://github.com/sibtc/simple-django-login