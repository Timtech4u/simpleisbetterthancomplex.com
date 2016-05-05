---
layout: post
title: "Django Tips #1 redirect"
date: 2016-05-05
author: Vitor Freitas
tags: python django
category: tips
---

`from django.shortcuts import redirect`

The function `redirect` will basically return an `HttpResponseRedirect` with the proper URL. I prefer to always use
this shortcut so my codebase remains consistent.

The advantages of using `redirect` instead of `HttpResponseRedirect` is that you can pass different types of arguments
and also it will save you from importing `django.urlresolvers.reverse` in your project's `views.py`.

The possible arguments are:

* A model instance. This will call the model's `get_absolute_url()` method;

{% highlight python %}
from django.shortcuts import redirect
from simple_blog.models import Post

def post_view(request, post_id):
    post = Post.objects.get(pk=post_id)
    return redirect(post)
    # equivalent to: return HttpResponseRedirect(post.get_absolute_url())
{% endhighlight %}

* A reverse url name (accept view arguments);

{% highlight python %}
from django.shortcuts import redirect
from simple_blog.models import Post

def post_view(request, post_id):
    return redirect('post_details', id=post_id)
    # equivalent to: return HttpResponseRedirect(reverse('post_details', args=(post_id, )))
{% endhighlight %}

* An aboluste or relative URL.

{% highlight python %}
from django.shortcuts import redirect

def relative_url_view(request):
    return redirect('/posts/archive/')
    # equivalent to: return HttpResponseRedirect('/posts/archive/')

def absolute_url_view(request):
    return redirect('https://simpleblog.com/posts/archive/')
    # equivalent to: return HttpResponseRedirect('https://simpleblog.com/posts/archive/')
{% endhighlight %}


Read more on the official [Django Documentation][django-docs-redirect]{:target="_blank"}.

[django-docs-redirect]: https://docs.djangoproject.com/en/dev/topics/http/shortcuts/#redirect