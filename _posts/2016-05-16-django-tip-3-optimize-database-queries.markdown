---
layout: post
title: "Django Tips #3 Optimize Database Queries"
author: Vitor Freitas
tags: django database optimization
category: tips
thumbnail: "/media/2016-05-16-django-tip-3-optimize-database-queries/featured-post-image.jpg"
featured_image: "/media/2016-05-16-django-tip-3-optimize-database-queries/featured-post-image.jpg"
featured_image_source: "https://unsplash.com/photos/IqaVFvH-ii0"
---

This is a very simple trick that can help you optimize your database queries using the Django ORM.

It is important to note that the Django QuerySets are lazy, which is a good thing if used properly.

For example, if we consider a model named `Invoice` and the following lines of code are executed:

{% highlight python %}
invoices = Invoice.objects.all()
unpaid_invoices = invoices.filter(status='UNPAID')
{% endhighlight %}

At this point, the Django ORM didn't touch the database yet, meaning no query was executed. It will hit touch the
database when we *evaluate* the QuerySet. Usually it happens when we start to iterate through the QuerySet, in a view
or in the template, like in the following example:

{% highlight html %}
<table>
  <tbody>
  {% raw %}{% for invoice in unpaid_invoices %}{% endraw %}
    <tr>
      <td>{% raw %}{{ invoice.id }}{% endraw %}</td>
      <td>{% raw %}{{ invoice.description }}{% endraw %}</td>
      <td>{% raw %}{{ invoice.status }}{% endraw %}</td>
    </tr>
  {% raw %}{% endfor %}{% endraw %}
  </tbody>
</table>
{% endhighlight %}

In the example above it is perfectly fine. Only **one** database query will be executed. But the problem starts to appear
when your model relates to other models through `ForeignKey`, `OneToOneField` or `ManyToManyField`.

Let's say our `Invoice` model has `ForeignKey` to a `Vendor` model:

{% highlight python %}
class Invoice(models.Model):
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=10)
    vendor = models.ForeignKey(Vendor)
{% endhighlight %}

Now if you want to iterate through the `unpaid_invoices` QuerySet, like we did in the previous example in the template,
but this time also displaying the vendor name, the Django ORM will execute an extra query for each row in the
`unpaid_invoices` QuerySet:

{% highlight html %}
<table>
  <tbody>
  {% raw %}{% for invoice in unpaid_invoices %}{% endraw %}
    <tr>
      <td>{% raw %}{{ invoice.id }}{% endraw %}</td>
      <td>{% raw %}{{ invoice.description }}{% endraw %}</td>
      <td>{% raw %}{{ invoice.status }}{% endraw %}</td>
      <td>{% raw %}{{ invoice.vendor.name }}{% endraw %}</td>
    </tr>
  {% raw %}{% endfor %}{% endraw %}
  </tbody>
</table>
{% endhighlight %}

If the `unpaid_invoices` QuerySet has **100 rows**, this simple `for loop` will execute **101 queries**. One query
to retrieve the invoices objects, and one query for each invoice object in order to retreive the vendor information.

This undesired effect can be mitigated using the `select_related` method in order to retrieve all the required
informations in a single database query.

So, instead of filtering the unpaid invoices like the first example, you may want to do it like this:

{% highlight python %}
invoices = Invoice.objects.all()
unpaid_invoices = invoices.select_related('vendor').filter(status='UNPAID')
{% endhighlight %}

This way, the Django ORM will prefetch the vendor data for each invoice in the same query. So extra queries are no
longer needed for this case. This can give a great performance increase for your application.

A good way to keep the track of the number of executed queries is using the [Django Debug Toolbar][django-debug-toolbar]{:target="_blank"}.

You can also learn more about the [Django QuerySet API][django-docs-select-related] reading the official Django Documentation.

[django-debug-toolbar]: https://django-debug-toolbar.readthedocs.io
[django-docs-select-related]: https://docs.djangoproject.com/en/dev/ref/models/querysets/#select-related

