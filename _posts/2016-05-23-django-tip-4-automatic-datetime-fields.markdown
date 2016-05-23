---
layout: post
title: "Django Tips #4 Automatic DateTime Fields"
date: 2016-05-23
author: Vitor Freitas
tags: django django-models
category: tips
thumbnail: "/media/2016-05-23-django-tip-4-automatic-datetime-fields/featured-post-image.jpg"
featured_image: "/media/2016-05-23-django-tip-4-automatic-datetime-fields/featured-post-image.jpg"
featured_image_source: "https://www.pexels.com/photo/time-alarm-clock-alarm-clock-100733/"
---

Both Django's `DateTimeField` and `DateField` have two very useful arguments for automatically managing date and time.
If you want keep track on when a specific instance was created or updated you don't need to do it manually: just set
the `auto_now` and `auto_now_add` arguments to `True` like in the following example:

{% highlight python %}
class Invoice(models.Model):
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=10)
    vendor = models.ForeignKey(Vendor)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
{% endhighlight %}

The `auto_now_add` will set the `timezone.now()` only when the instance is created, and `auto_now` will update the
field everytime the `save` method is called.

It is important to note that both arguments will trigger the field update event with `timezone.now()`, meaning when
you create an object, both `created_at` and `updated_at` will be filled.

This is a very simple trick that will make your codebase cleaner.