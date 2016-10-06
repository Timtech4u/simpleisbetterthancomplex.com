---
layout: post
title: "Django Tips #17 Using QuerySet Latest & Earliest Methods"
author: Vitor Freitas
date: 2016-10-06 23:58:00 +0300
tags: django models manager
category: tips
thumbnail: "/media/2016/10/featured-tip17.jpg"
featured_image: "/media/2016/10/featured-tip17.jpg"
---

Similar to the **QuerySet** methods `first` and `last`, the API also offer the `earliest` and `latest` methods. They
are convenience methods which can be used to enhance the readability of the code.

The best way to use it is to define `get_latest_by` in the model's Meta class:

{% highlight python %}
class Post(models.Model):
    headline = models.CharField(max_length=150)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    publication_date = models.DateTimeField(blank=True, null=True)
    change_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        get_latest_by = 'publication_date'
{% endhighlight %}

Then the usage is very straightforward:

{% highlight python %}
latest_post = Post.objects.latest()
earliest_post = Post.objects.earliest()
{% endhighlight %}

If you didn't specify the `get_latest_by` property, or if you want to use a different field, you can pass it as a
parameter on the fly:

{% highlight python %}
latest_change = Post.objects.latest('change_date')
{% endhighlight %}

The `earliest` and `latest` methods will raise a `DoesNotExist` exception if there is no object with the given
parameters, that is, the table is empty or it was filtered. It is slightly different from `first` and `last`, because
it returns `None` if there is no matching object.

Another important thing to note is that the `earliest` and `latest` methods might return instances with null dates. But
the thing is, the ordering behavior is not consistent between the different databases. So you might want to remove
null dates, like so:

{% highlight python %}
Post.objects.filter(change_date__isnull=False).latest('change_date')
{% endhighlight %}

Typically it is used with either `DateField`, `DateTimeField` or `IntegerField`. It will work with other field
types. But you should avoid it, because it will be semantically wrong, and as those methods are available just for
convinience and to enhance readability, in that case, using for something different than dates will cause more
confusion.

