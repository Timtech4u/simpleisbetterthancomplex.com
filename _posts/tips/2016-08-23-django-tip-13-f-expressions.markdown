---
layout: post
title: "Django Tips #13 Using F() Expressions"
author: Vitor Freitas
date: 2016-08-23 23:49:00 +0300
tags: django db queryset
category: tips
thumbnail: "/media/2016/08/featured-f-expressions.jpg"
featured_image: "/media/2016/08/featured-f-expressions.jpg"
---

In the Django QuerySet API, **F()** expressions are used to refer to model field values directly in the database.
Let's say you have a `Product` class with a `price` field, and you want to increase the price of all products in 20%.

A possible solution would be:

{% highlight python %}
products = Product.objects.all()
for product in products:
    product.price *= 1.2
    product.save()
{% endhighlight %}

Instead you could use an **F()** expression to update it in a single query:

{% highlight python %}
from django.db.models import F

Product.objects.update(price=F('price') * 1.2)
{% endhighlight %}

You can also do it for a single object:

{% highlight python %}
product = Product.objects.get(pk=5009)
product.price = F('price') * 1.2
product.save()
{% endhighlight %}

But take care with this kind of assignment. The **F()** object persist after saving the model.

{% highlight python %}
product.price                   # price = Decimal('10.00')
product.price = F('price') + 1
product.save()                  # price = Decimal('11.00')
product.name = 'What the F()'
product.save()                  # price = Decimal('12.00')
{% endhighlight %}

So, basically after updating a field like that, `product.price` will hold an instance of
`django.db.models.expressions.CombinedExpression`, instead of the actual result. If you want to access the result
immediately:

{% highlight python %}
product.price = F('price') + 1
product.save()
print(product.price)            # <CombinedExpression: F(price) + Value(1)>
product.refresh_from_db()
print(product.price)            # Decimal('13.00')
{% endhighlight %}

You can also use it to annotate data:

{% highlight python %}
from django.db.models import ExpressionWrapper, DecimalField

Product.objects.all().annotate(
    value_in_stock=ExpressionWrapper(
        F('price') * F('stock'), output_field=DecimalField()
    )
)
{% endhighlight %}

Since **price** is a `DecimalField` and **stock** is a `IntegerField`, we need to wrap the expression inside a
`ExpressionWrapper` object.

It can be used to filter data as well:

{% highlight python %}
Product.objects.filter(stock__gte=F('ordered'))
{% endhighlight %}
