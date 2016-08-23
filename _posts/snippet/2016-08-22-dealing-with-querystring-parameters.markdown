---
title: "Dealing With QueryString Parameters"
date: 2016-08-22 22:10:00 +0300
category: snippet
tags: django templatetags
thumbnail: "/media/2016/08/featured-dealing-with-querystring-parameters.jpg"
featured_image: "/media/2016/08/featured-dealing-with-querystring-parameters.jpg"
---

It is kinda tough to describe what the problem really is. But, do you know when you are creating an interface where
you provide pagination, filters and ordering, and you are keeping the state via URL Get parameters?

For instance if you have different options for ordering, you might think of something like that:

{% highlight html %}
{% raw %}
<div class="dropdown">
  <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
    Order by
  </button>
  <ul class="dropdown-menu">
    <li><a href="?order=name">Name (a-z)</a></li>
    <li><a href="?order=-name">Name (z-a)</a></li>
    <li><a href="?order=price">Price</a></li>
    <li><a href="?order=date">Date</a></li>
  </ul>
</div>
{% endraw %}
{% endhighlight %}

Basically you would be sending the user to the very same page, but passing a **GET** parameter named **order**, where
you could do something like that:

{% highlight python %}
def products_list(request):
    products = Product.objects.all()
    order = request.GET.get('order', 'name')  # Set 'name' as a default value
    products = products.order_by(order)
    return render(request, 'products_list.html', {
        'products': products
    })
{% endhighlight %}

_PS: This is a minimalist example, if you pass an invalid parameter directly in the querystring you will make the
queryset break. I will avoid adding extra validations so we can focus on the objective of this article._

So far so good. But the problem starts to appear when you add a new control, also via **GET** parameter. Lets say a
pagination:

{% highlight html %}
{% raw %}
<ul class="pagination">
  {% for i in page_obj.paginator.page_range %}
    <li>
      <a href="?page={{ i }}">{{ i }}</a>
    </li>
  {% endfor %}
</ul>
{% endraw %}
{% endhighlight %}

What would happen here: if you are ordering the results by the **Date** and then you move to the next page, you will
lose the ordering preference.

The easiest solution would be something like that:

{% highlight python %}
def products_list(request):
    ...
    return render(request, 'products_list.html', {
        'products': products,
        'order': order,
        'page': page
    })
{% endhighlight %}

And then:

{% highlight html %}
{% raw %}
<div class="dropdown">
  <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
    Order by
  </button>
  <ul class="dropdown-menu">
    <li><a href="?order=name&page={{ page }}">Name (a-z)</a></li>
    <li><a href="?order=-name&page={{ page }}">Name (z-a)</a></li>
    <li><a href="?order=price&page={{ page }}">Price</a></li>
    <li><a href="?order=date&page={{ page }}">Date</a></li>
  </ul>
</div>

...

<ul class="pagination">
  {% for i in page_obj.paginator.page_range %}
    <li>
      <a href="?page={{ i }}&order={{ order }}">{{ i }}</a>
    </li>
  {% endfor %}
</ul>
{% endraw %}
{% endhighlight %}

The bigger the number of parameters, the bigger the mess in the template.

***

#### The Solution

Last week while working on a project I faced this problem again, and I put some time to think of a better/reusable
solution.

So, I came up with this template tag, and I thought about sharing with you guys. Maybe it can be useful for you as
well. Basically you will need the `django.template.context_processors.request` in your project's `context_processors`.

**templatetags/templatehelpers.py**
{% highlight python %}
from django import template

register = template.Library()

@register.simple_tag
def relative_url(value, field_name, urlencode=None):
    url = '?{}={}'.format(field_name, value)
    if urlencode:
        querystring = urlencode.split('&')
        filtered_querystring = filter(lambda p: p.split('=')[0] != field_name, querystring)
        encoded_querystring = '&'.join(filtered_querystring)
        url = '{}&{}'.format(url, encoded_querystring)
    return url

{% endhighlight %}

And then you use it this way:

{% highlight html %}
{% raw %}
{% load templatehelpers %}

<div class="dropdown">
  <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
    Order by
  </button>
  <ul class="dropdown-menu">
    {% with params=request.GET.urlencode %}
      <li><a href="{% relative_url 'name' 'order' params %}">Name (a-z)</a></li>
      <li><a href="{% relative_url '-name' 'order' params %}">Name (z-a)</a></li>
      <li><a href="{% relative_url 'price' 'order' params %}">Price</a></li>
      <li><a href="{% relative_url 'date' 'order' params %}">Date</a></li>
    {% endwith %}
  </ul>
</div>

...

<ul class="pagination">
  {% for i in page_obj.paginator.page_range %}
    <li>
      <a href="{% relative_url i 'page' request.GET.urlencode %}">{{ i }}</a>
    </li>
  {% endfor %}
</ul>
{% endraw %}
{% endhighlight %}

Now the template tag will keep that current state of your filters/ordering/pages.
