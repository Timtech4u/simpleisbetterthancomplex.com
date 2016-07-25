---
layout: post
title: "Django Tips #8 Blank or Null?"
author: Vitor Freitas
date: 2016-07-25
tags: django models
category: tips
thumbnail: "/media/2016-07-25-django-tip-8-blank-or-null/featured-facebook.jpg"
featured_image: "/media/2016-07-25-django-tip-8-blank-or-null/featured-post-image.jpg"
---

Django models API offers two similar options that usually cause confusion on many developers: `null` and `blank`. When
I first started working with Django I couldn't tell the difference and always ended up using both. Sometimes even using
them improperly.

Both do almost the same thing, as the name suggests, but here is the difference:

* **Null**: It is database-related. Defines if a given database column will accept null values or not.
* **Blank**: It is validation-related. It will be used during **forms validation**, when calling `form.is_valid()`.

That being said, it is perfectly fine to have a field with `null=True` and `blank=False`. Meaning on the database level
the field can be **NULL**, but in the application level it is a **required** field.

Now, where most developers get it wrong: Defining `null=True` for string-based fields such as `CharField` and
`TextField`. Avoid doing that. Otherwise, you will end up having two possible values for "no data", that is: **None**
and an **empty string**. Having two possible values for "no data" is redundant. The Django convention is to use the
**empty string**, not **NULL**.

So, if you want a string-based model field to be "nullable", prefer doing that:

{% highlight python %}
class Person(models.Model):
    name = models.CharField(max_length=255)  # Mandatory
    bio = models.TextField(max_length=500, blank=True)  # Optional (don't put null=True)
    bith_date = models.DateField(null=True, blank=True) # Optional (here you may add null=True)
{% endhighlight %}

The default values of `null` and `blank` are **False**.

Also there is a special case, when you need to accept **NULL** values for a `BooleanField`, use `NullBooleanField`
instead.