---
title: "List of QuerySet Field Lookups"
category: references
tags: django queryset db
thumbnail: "/media/2016/10/featured-urls.jpg"
featured_image: "/media/2016/10/featured-urls.jpg"
featured_image_source: "https://www.pexels.com/photo/holidays-car-travel-adventure-21014/"
---

...

{% highlight python %}

Entry.objects.get(id__exact=14)
Blog.objects.get(name__iexact='beatles blog')
Entry.objects.get(headline__contains='Lennon')
Entry.objects.get(headline__icontains='Lennon')

Entry.objects.filter(id__in=[1, 3, 4])

inner_qs = Blog.objects.filter(name__contains='Cheddar')
entries = Entry.objects.filter(blog__in=inner_qs)

{% endhighlight %}