---
layout: post
title: "Django Tips #16 Simple Database Access Optimizations"
author: Vitor Freitas
date: 2016-10-05 17:18:00 +0300
tags: django models database
category: tips
thumbnail: "/media/2016/10/featured-tip16.jpg"
featured_image: "/media/2016/10/featured-tip16.jpg"
---

So, I just wanted to share a few straightforward tips about database access optimization. For the most those tips are
not something you should go to your code base and start refactoring. Actually for existing code it's a better idea to
profile first (with Django Debug Toolbar for example). But those tips are very easy to start applying, so keep them
in mind when writing new code!

***

#### Accessing Foreign Key Values

If you only need the ID of the Foreign Key:

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
post.author_id
{% endhighlight %}
</div>

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
post.author.id
{% endhighlight %}
</div>

If you have a foreign key named **author**, Django will automatically store the primary key in the property
**author_id**, while in the **author** property will be stored a lazy database reference. So if you access the id via
the **author** instance, like this `post.author.id`, it will cause an additional query.

***

#### Bulk Insert on Many to Many Fields

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
user.groups.add(administrators, managers)
{% endhighlight %}
</div>

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
user.groups.add(administrators)
user.groups.add(managers)
{% endhighlight %}
</div>

***

#### Counting QuerySets

If you only need the count:

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
users = User.objects.all()
users.count()

# Or in template...
{% raw %}{{ users.count }}{% endraw %}
{% endhighlight %}
</div>

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
users = User.objects.all()
len(users)

# Or in template...
{% raw %}{{ users|length }}{% endraw %}
{% endhighlight %}
</div>

***

### Empty QuerySets

If you only need to know if the queryset is empty:

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
groups = Group.objects.all()
if groups.exists():
    # Do something...
{% endhighlight %}
</div>

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
groups = Group.objects.all()
if groups:
    # Do something...
{% endhighlight %}
</div>

***

#### Reduce Query Counts

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
review = Review.objects.select_related('author').first()  # Select the Review and the Author in a single query
name = review.author.first_name
{% endhighlight %}
</div>

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
review = Review.objects.first()  # Select the Review
name = review.author.first_name  # Additional query to select the Author
{% endhighlight %}
</div>

***

#### Select Only What You Need

Let's say the **Invoice** model has 50 fields and you want to create a view to display just a summary, with the
**number**, **date** and **value**:

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
# views.py
# If you don't need the model instance, go for:
invoices = Invoice.objects.values('number', 'date', 'value')  # Returns a dict

# If you still need to access some instance methods, go for:
invoices = Invoice.objects.only('number', 'date', 'value')  # Returns a queryset

# invoices.html
{% raw %}<table>
  {% for invoice in invoices %}
    <tr>
      <td>{{ invoice.number }}</td>
      <td>{{ invoice.date }}</td>
      <td>{{ invoice.value }}</td>
    </tr>
  {% endfor %}
</table>
{% endraw %}
{% endhighlight %}
</div>

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
# views.py
invoices = Invoice.objects.all()

# invoices.html
{% raw %}<table>
  {% for invoice in invoices %}
    <tr>
      <td>{{ invoice.number }}</td>
      <td>{{ invoice.date }}</td>
      <td>{{ invoice.value }}</td>
    </tr>
  {% endfor %}
</table>
{% endraw %}
{% endhighlight %}
</div>

***

#### Bulk Updates

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
from django.db.models import F

Product.objects.update(price=F('price') * 1.2)
{% endhighlight %}
</div>

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
products = Product.objects.all()
for product in products:
    product.price *= 1.2
    product.save()
{% endhighlight %}
</div>
