---
layout: post
title: "Django Tips #10 AuthenticationForm Custom Login Policy"
author: Vitor Freitas
date: 2016-08-12 23:28:00 +0300
tags: django contrib auth forms
category: tips
thumbnail: "/media/2016-08-12-django-tip-10-authentication-form-custom-login-policy/featured.jpg"
featured_image: "/media/2016-08-12-django-tip-10-authentication-form-custom-login-policy/featured.jpg"
---


Since I started working with Django, I never had to spend time implementing authentication related stuff. The built-in
authentication system is great and it's very easy to plug-in and get started. Now, even if need to customize, Django
makes it easy. That's what this tip is about.

For the built-in **login** view, Django makes use of `django.contrib.auth.forms.AuthenticationForm` form to handle
the authentication process. Basically it checks **username**, **password** and the **is_active** flag.

Django makes it easy to add custom verifications, as the `AuthenticationForm` has a method named
`confirm_login_allowed(user)`.

For example, if you are handling double opt-in email confirmation and don't wanna let users without the email confirmed
to log in to the application you can do something like that:

**forms.py**:

{% highlight python %}
from django import forms
from django.contrib.auth.forms import AuthenticationForm

class CustomAuthenticationForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        if not user.is_active or not user.is_validated:
            raise forms.ValidationError('There was a problem with your login.', code='invalid_login')
{% endhighlight %}

**urls.py**

{% highlight python %}
from django.conf.urls import url
from django.contrib.auth import views as auth_views

from .forms import CustomAuthenticationForm

urlpatterns = [
    url(r'^login/$', auth_views.login, {'template_name': 'core/login.html',
        'authentication_form': CustomAuthenticationForm}, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),
    ...
]
{% endhighlight %}

Basically it is just a matter of overriding the `confirm_login_allowed` method and substituting the
`authentication_form` parameter with the new form in the urlconf. You can add any login policy, and to invalidate the
authentication simply raise a `ValidationError`.
