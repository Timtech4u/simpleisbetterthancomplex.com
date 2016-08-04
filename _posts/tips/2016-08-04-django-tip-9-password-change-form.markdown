---
layout: post
title: "Django Tips #9 How to Create a Change Password View"
author: Vitor Freitas
date: 2016-08-04 10:36:00 +0300
tags: django forms contrib
category: tips
thumbnail: "/media/2016-08-04-django-tip-9-password-change-form/featured.jpg"
featured_image: "/media/2016-08-04-django-tip-9-password-change-form/featured.jpg"
---

This is a very quick tip about how to create a change password view using the built-in `PasswordChangeForm`.

For that matter, using a function-based view is easier, because the `PasswordChangeForm` is slightly different.
It does not inherit from `ModelForm` and it takes an **user** argument in its constructor.

The example below is a functional code to change the password for the authenticated user.

**views.py**

{% highlight python %}
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.shortcuts import render, redirect

def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important!
            messages.success(request, 'Your password was successfully updated!')
            return redirect('accounts:change_password')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'accounts/change_password.html', { 'form': form })
{% endhighlight %}

The `messages.success()` and `messages.error()` are optional, but it is a good idea to keep your user aware about what
is going on in the application.

Now an important bit is to call `update_session_auth_hash()` after you save the form. Otherwise the user's auth session
will be invalidated and she/he will have to log in again.

**urls.py**

{% highlight python %}
from django.conf.urls import url
from myproject.accounts import views

urlpatterns = [
    url(r'^password/$', views.change_password, name='change_password'),
]
{% endhighlight %}

**change_password.html**

{% highlight html %}
{% raw %}
<form method="post">
  {% csrf_token %}
  {{ form }}
  <button type="submit">Save changes</button>
</form>
{% endraw %}
{% endhighlight %}
