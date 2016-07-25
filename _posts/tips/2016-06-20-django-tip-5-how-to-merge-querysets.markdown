---
layout: post
title: "Django Tips #5 How to Merge QuerySets"
date: 2016-06-20
author: Vitor Freitas
tags: django models queryset
category: tips
thumbnail: "/media/2016-06-20-django-tip-5-how-to-merge-querysets/featured-post-image.jpg"
featured_image: "/media/2016-06-20-django-tip-5-how-to-merge-querysets/featured-post-image.jpg"
featured_image_source: "https://www.flickr.com/photos/37930382@N05/5055991764/"
---

This tip is particularly useful when you want to merge two or more querysets into a single queryset without losing
the capabilities of performing `filter`, `count`, `distinct`, etc. operations.

Consider the following models:

{% highlight python %}
class Story(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    category = models.ForeignKey(Category, related_name='stories')
    author = models.ForeignKey(User, related_name='stories')

class Medium(models.Model):
    name = models.CharField(max_length=30, unique=True)
    stories = models.ManyToManyField(Story)
{% endhighlight %}

Let's say you want to display all the stories published in a specific `Medium` together with stories written by a
`User` using the `Category` _django_. Note that this `User` might have published stories in different `Medium`:

{% highlight python %}
medium = Medium.objects.get(name='Django Blog')
user = User.objects.get(username='vitor')

django_stories = medium.stories.all()
vitor_stories = user.stories.filter(category__name='django')
{% endhighlight %}

At this point we have two different querysets, one containing all the stories from a medium and other containing all
the stories from a user using the _django_ category.

The querysets can be merged like in the example below, using the `|` operator:

{% highlight python %}
stories = django_stories | vitor_stories  # merge querysets
{% endhighlight %}

And you still can perform queryset operations:

{% highlight python %}
recent_stories = stories.distinct().order_by('-date')[:10]
{% endhighlight %}

It's important to note that the merge/combine operator `|` only works on querysets from the same model and before the
slicing it.