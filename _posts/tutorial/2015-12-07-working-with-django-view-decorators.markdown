---
layout: post
title:  "Working with Django View Decorators"
date:   2015-12-07 12:00:00
author: Vitor Freitas
tags: python django
thumbnail: "/media/2015-12-07-working-with-django-view-decorators/featured-post-image.jpg"
featured_image: "/media/2015-12-07-working-with-django-view-decorators/featured-post-image.jpg"
featured_image_source: "https://unsplash.com/photos/ecQDQb8lWDU"
---

View decorators can be used to restrict access to certain views. Django come with some built-in decorators, like `login_required`, `require_POST` or `has_permission`. They are really useful, but sometimes you might need to restrict the access in a different level of granularity, for example only letting the user who created an entry of the model to edit or delete it.

A simple way to solve this problem, without adding an if statement inside each function, is to write a custom decorator.

In this article I will take you into the basic steps of creating an app level decorator.

***

#### Sample scenario

To ilustrate this article, let's pretend we have an app named `blog`.

##### models.py

{% highlight python %}
# coding: utf-8

from django.db import models
from django.contrib.auth.models import User

class Entry(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    content = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(User)
    creation_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Entry'
        verbose_name_plural = 'Entries'

    def __unicode__(self):
        return self.title
{% endhighlight %}

##### views.py

{% highlight python %}
# coding: utf-8

from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404

from simple_decorators.apps.blog.models import Entry
from simple_decorators.apps.blog.forms import EntryForm


@login_required
def index(request):
    entries = Entry.objects.filter(created_by=request.user)
    return render(request, 'blog/index.html', { 'entries': entries })

@login_required
def add(request):
    if request.method == 'POST':
        form = EntryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Entry was successfully added!')
            return redirect('index')
    else:
        form = EntryForm()
    return render(request, 'blog/entry.html', { 'form': form })

@login_required
def edit(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    if request.method == 'POST':
        form = EntryForm(request.POST, instance=entry)
        if form.is_valid():
            form.save()
            messages.success(request, 'Entry was successfully edited!')
            return redirect('index')
    else:
        form = EntryForm(instance=entry)
    return render(request, 'blog/entry.html', { 'form': form })
{% endhighlight %}

##### urls.py

{% highlight python %}
# coding: utf-8

from django.conf.urls import url
from simple_decorators.apps.blog import views

urlpatterns = [
    url(r'^blog/$', views.index, name='index'),
    url(r'^blog/add/$', views.add, name='add'),
    url(r'^blog/edit/(\d+)/$', views.edit, name='edit'),
  ]
{% endhighlight %}

At this point, we have one model named `Entry` that relates to a `User`. We also have three views, to list, add or edit an existing entry. In our index page, we only list the blog entries that were created by the logged in `User`. But, nothing stops the `User` from changing the browser url to edit an `Entry` that wasn't created by him.

We want to make sure the `User` only edit the `Entries` created by him.

***

#### Create the decorator module

The decorator module can live anywhere, but usually they are related to a specific app. I like to put it inside the app folder. In case it's a decorator for general use, I put it in the same level as my `settings.py` and `urls.py`.

Create a new file named `decorators.py`:

{% highlight bash %}
$ touch decorators.py
{% endhighlight %}

The app folder structure:

{% highlight bash %}
|∙∙blog/
  |∙∙__init__.py
  |∙∙admin.py
  |∙∙decorators.py
  |∙∙migrations/
  |∙∙models.py
  |∙∙tests.py
  |∙∙views.py
{% endhighlight %}

Edit the `decorators.py` file creating a new function named `user_is_entry_author`:

{% highlight python %}
# coding: utf-8

from functools import wraps
from django.core.exceptions import PermissionDenied
from simple_decorators.apps.models import Entry

def user_is_entry_author(function):
    def wrap(request, *args, **kwargs):
        entry = Entry.objects.get(pk=kwargs['entry_id'])
        if entry.created_by == request.user:
            return function(request, *args, **kwargs)
        else:
            raise PermissionDenied
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap
{% endhighlight %}

We are basically getting the current entry instance and checking if the logged in user is the owner of the entry. If it returns true, we proceed, otherwise we raise and `PermissionDenied` exception. We could also redirect the user to other page, like the login page for example. But as it's not an expected behavior (it's not meant to happen if the user follow the application flow clicking on the page and so on), it doesn't really need to have a user friendly message or behavior.

***

#### Take the decorator into use

Inside your `views.py`, import our new decorator and add it to the edit view:

{% highlight python %}
# coding: utf-8

from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404

from simple_decorators.apps.blog.models import Entry
from simple_decorators.apps.blog.forms import EntryForm
from simple_decorators.apps.blog.decorators import user_is_entry_author


@login_required
def index(request):
    ...

@login_required
def add(request):
    ...

@login_required
@user_is_entry_author
def edit(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    if request.method == 'POST':
        form = EntryForm(request.POST, instance=entry)
        if form.is_valid():
            form.save()
            messages.success(request, 'Entry was successfully edited!')
            return redirect('index')
    else:
        form = EntryForm(instance=entry)
    return render(request, 'blog/entry.html', { 'form': form })
{% endhighlight %}

That's it! Now only the user who have created the entry can edit it.

***

This solution can looks like an overkill in this small example. Of course if you only need to verify the ownership of the entry in the edit view, it's better and cleaner to put the if statement inside the edit view. But, if your app starts to grow, it's gonna be really handy. For example, consider we add this two new view functions in our `views.py`:


{% highlight python %}
@login_required
@user_is_entry_author
def remove(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    entry.delete()
    messages.success(request, 'Entry was successfully removed!')
    return redirect('index')

@login_required
@user_is_entry_author
def transfer(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    transfer_to = request.POST.get('transfer_to')
    new_owner = User.objects.get(pk=transfer_to)
    entry.created_by = new_owner
    entry.save()
    messages.success(request, 'Entry was successfully transferred!')
    return redirect('index')
{% endhighlight %}

Both view functions can only be accessed by the entry owner and we don't need to add the if statement inside each of them.

If you want to see more example of custom decorators, I have a few on my open source projects [Bootcamp][bootcamp-decorators]{:target="_blank"} and [Parsifal][parsifal-decorators]{:target="_blank"}

[bootcamp-decorators]: https://github.com/vitorfs/bootcamp/blob/master/bootcamp/decorators.py
[parsifal-decorators]: https://github.com/vitorfs/parsifal/blob/master/parsifal/reviews/decorators.py