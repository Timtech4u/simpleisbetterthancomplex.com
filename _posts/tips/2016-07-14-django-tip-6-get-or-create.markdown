---
layout: post
title: "Django Tips #6 get_or_create"
date: 2016-07-14
author: Vitor Freitas
tags: django models queryset
category: tips
thumbnail: "/media/2016-07-14-django-tip-6-get-or-create/featured-post-image.jpg"
featured_image: "/media/2016-07-14-django-tip-6-get-or-create/featured-post-image.jpg"
---

This is a convenience method for looking up an object, giving a set of parameters, creating one if necessary.

The trick with the `get_or_create` method is that it actually returns a tuple of `(object, created)`. The first element
is an instance of the model you are trying to retrieve and the second is a boolean flag to tell if the instance was
created or not. `True` means the instance was created by the `get_or_create` method and `False` means it was retrieved
from the database.

Consider a Django model named `AppSettings`, where you store configurations parameters of your website.

{% highlight python %}
obj, created = AppSettings.objects.get_or_create(name='DEFAULT_LANG')
obj.value = request.POST.get('DEFAULT_LANG')
obj.save()
{% endhighlight %}

So, what happened here: if this was the first time I was saving a setting named `DEFAULT_LANG`, the `get_or_create`
would create an instance and persist in the database. If this was the second or third time I was saving this setting
it would simply update the existing instance.