---
layout: post
title: "Django Tips #11 Custom Manager With Chainable QuerySets"
author: Vitor Freitas
date: 2016-08-16 21:28:00 +0300
tags: django db queryset models
category: tips
thumbnail: "/media/2016-08-16-django-tip-11-custom-manager-with-chainable-querysets/featured.jpg"
featured_image: "/media/2016-08-16-django-tip-11-custom-manager-with-chainable-querysets/featured.jpg"
---

In a Django model, the **Manager** is the interface that interacts with the database. By default the manager is
available through the `Model.objects` property. The default manager every Django model gets out of the box is the
`django.db.models.Manager`. It is very straightforward to extend it and change the default manager.

{% highlight python %}
from django.db import models

class DocumentManager(models.Manager):
    def pdfs(self):
        return self.filter(file_type='pdf')

    def smaller_than(self, size):
        return self.filter(size__lt=size)

class Document(models.Model):
    name = models.CharField(max_length=30)
    size = models.PositiveIntegerField(default=0)
    file_type = models.CharField(max_length=10, blank=True)

    objects = DocumentManager()
{% endhighlight %}

With that you will be able to retrieve all pdf files like this:

{% highlight python %}
Document.objects.pdfs()
{% endhighlight %}

The thing is, this method is not chainable. I mean, you can still use `order_by` or `filter` in the result:

{% highlight python %}
Document.objects.pdfs().order_by('name')
{% endhighlight %}

But if you try to chain the methods it will break:

{% highlight python %}
Document.objects.pdfs().smaller_than(1000)
{% endhighlight %}

{% highlight bash %}
AttributeError: 'QuerySet' object has no attribute 'smaller_than'
{% endhighlight %}

To make it work you must create custom QuerySet methods:

{% highlight python %}
class DocumentQuerySet(models.QuerySet):
    def pdfs(self):
        return self.filter(file_type='pdf')

    def smaller_than(self, size):
        return self.filter(size__lt=size)

class DocumentManager(models.Manager):
    def get_queryset(self):
        return DocumentQuerySet(self.model, using=self._db)  # Important!

    def pdfs(self):
        return self.get_queryset().pdfs()

    def smaller_than(self, size):
        return self.get_queryset().smaller_than(size)

class Document(models.Model):
    name = models.CharField(max_length=30)
    size = models.PositiveIntegerField(default=0)
    file_type = models.CharField(max_length=10, blank=True)

    objects = DocumentManager()
{% endhighlight %}

Now you can use it just like any other **QuerySet** method:

{% highlight python %}
Document.objects.pdfs().smaller_than(1000).exclude(name='Article').order_by('name')
{% endhighlight %}

You can keep the code inside the **models.py**. But as the code base grow, I prefer to keep the Managers and QuerySets
in a different module, named **managers.py**.