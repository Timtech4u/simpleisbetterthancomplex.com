---
title: "Django Tips #19 Protecting Sensitive Information"
date: 2016-11-01 10:52:00 +0300
tags: django security debug
category: tips
thumbnail: "/media/2016/11/featured-tip19.jpg"
featured_image: "/media/2016/11/featured-tip19.jpg"
---

The internet is a wild land. Security must be priority one when deploying a web application on the internet.
The Django framework does an amazing job providing reliable and secure APIs. But none of that matters if we don't use
them properly.

Nothing new that we should **never** deploy a Django application with `DEBUG=True`, right?

One of the features of having `DEBUG=True` is dumping lots of metadata from your environment, including the whole
**settings.py** configurations, when a exception occurs.

Even though you will never be using `DEBUG=True`, you need extra care when _naming_ the configurations in the
**settings.py** module. Make sure all sensitive variables use one of the keywords:

* API
* KEY
* PASS
* SECRET
* SIGNATURE
* TOKEN

This way, Django will not dump those variables that may contain sensitive information.

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
S3_BUCKET_KEY = 'xxxxxxxxxxxxxxxx'
{% endhighlight %}
</div>

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
S3_BUCKET = 'xxxxxxxxxxxxxxxx'
CHAVE_DE_ACESSO = 'xxxxxxxxxxxxxxxx'  # "access key" in portuguese
{% endhighlight %}
</div>

Even when you are running your application with `DEBUG=False`, if it's configured to send error reports via email,
there is a chance of the error report being exposed, specially if you are transmitting error reports unencrypted over
the internet.

PS: I mention this a lot here in the blog, but it's never enough: Don't commit sensitive information to public
repositories. In other words, don't add sensitive information directly to the **settings.py** file, instead use
environment variable or use **python-decouple**. Learn more about how to separate configuration from code reading this
article I published a while ago: [Package of the Week: Python Decouple](/2015/11/26/package-of-the-week-python-decouple.html).

Speaking of **filtering error reports**, there are two view decorators that you should put in action:

##### sensitive_variables

If your code handle sensitive information in local variables inside a view function, explicitly mark them as sensitive
to avoid showing them in error reports:

{% highlight python %}
from django.views.decorators.debug import sensitive_variables

@sensitive_variables('user', 'pw', 'cc')
def process_info(user):
    pw = user.pass_word
    cc = user.credit_card_number
    name = user.name
    ...
{% endhighlight %}

Or if you want to hide all local variables inside a function:

{% highlight python %}
@sensitive_variables()
def my_function():
    ...
{% endhighlight %}

PS: When using multiple decorators make sure the `@sensitive_variables()` decorator is the first one.

##### sensitive_post_parameters

Similar to the previous example, but this one handle post parameters, as the name suggests:

{% highlight python %}
from django.views.decorators.debug import sensitive_post_parameters

@sensitive_post_parameters('pass_word', 'credit_card_number')
def record_user_profile(request):
    UserProfile.create(
        user=request.user,
        password=request.POST['pass_word'],
        credit_card=request.POST['credit_card_number'],
        name=request.POST['name'],
    )
    ...
{% endhighlight %}

In a similiar way, to hide all post parameters:

{% highlight python %}
@sensitive_post_parameters()
def my_view(request):
    ...
{% endhighlight %}

***

#### Further Reading

Read more about [filtering sensitive information](https://docs.djangoproject.com/en/1.10/howto/error-reporting/#filtering-sensitive-information){:target="_blank"}
in the official Django docs.
