---
title: "Django Shortcuts"
date: 2016-09-12 23:29:00 +0300
category: article
tags: django shortcuts
thumbnail: "/media/2016/09/featured-shortcuts.jpg"
featured_image: "/media/2016/09/featured-shortcuts.jpg"
---

This module is a collection of helper classes generally used in view functions/classes. All the shortcuts are available
in the module `django.shortcuts`.

***

#### render

Params:

{% highlight python %}
def render(request, template_name, context=None, content_type=None, status=None, using=None)
{% endhighlight %}

Shortcut for:

{% highlight python %}
content = loader.render_to_string(template_name, context, request, using=using)
return HttpResponse(content, content_type, status)
{% endhighlight %}

There is also **render_to_response**, the only difference is that it does not pass the **request** to the context.

***

#### redirect

Params:

{% highlight python %}
def redirect(to, *args, **kwargs):
{% endhighlight %}

Returns an `HttpResponseRedirect` (or `HttpResponsePermanentRedirect`) to the appropriate URL for the arguments passed.

The arguments could be:

* A model: the model's `get_absolute_url()` function will be called.
* A view name, possibly with arguments: `urls.reverse()` will be used to reverse-resolve the name.
* A URL, which will be used as-is for the redirect location.

Shortcut for:

{% highlight python %}
def post_view(request, post_id):
    post = Post.objects.get(pk=post_id)
    return redirect(post)
    # equivalent to: return HttpResponseRedirect(post.get_absolute_url())

def post_view(request, post_id):
    return redirect('post_details', id=post_id)
    # equivalent to: return HttpResponseRedirect(reverse('post_details', args=(post_id, )))

def relative_url_view(request):
    return redirect('/posts/archive/')
    # equivalent to: return HttpResponseRedirect('/posts/archive/')

def absolute_url_view(request):
    return redirect('https://simpleblog.com/posts/archive/')
    # equivalent to: return HttpResponseRedirect('https://simpleblog.com/posts/archive/')
{% endhighlight %}

See more in this [post][django-tip-1] about the **redirect** function.

***

#### get_object_or_404

Params:

{% highlight python %}
def get_object_or_404(klass, *args, **kwargs):
{% endhighlight %}

Shortcut for:

{% highlight python %}
try:
    return Model.objects.get(pk=1)
except Model.DoesNotExist:
    raise Http404()
{% endhighlight %}

***

#### get_list_or_404

Params:

{% highlight python %}
def get_list_or_404(klass, *args, **kwargs):
{% endhighlight %}

Shortcut for:

{% highlight python %}
obj_list = list(Model.objects.filter(title='test'))
if not obj_list:
    raise Http404()
return obj_list
{% endhighlight %}

***

#### resolve_url

This one is actually used by the **redirect** shortcut. It will do basically the same thing, except to perform the
actual redirect.

Params:

{% highlight python %}
def resolve_url(to, *args, **kwargs):
{% endhighlight %}

The arguments could be:

* A model: the model's `get_absolute_url()` function will be called.
* A view name, possibly with arguments: `urls.reverse()` will be used to reverse-resolve the name.
* A URL, which will be returned as-is.

[django-tip-1]: /tips/2016/05/05/django-tip-1-redirect.html