---
title: "How to Split Views Into Multiple Files"
date: 2016-08-02 11:04:00 +0300
category: tutorial
tags: django views
thumbnail: "/media/2016-08-02-how-to-split-views-into-multiple-files/featured.jpg"
featured_image: "/media/2016-08-02-how-to-split-views-into-multiple-files/featured.jpg"
featured_image_source: "https://www.pexels.com/photo/lego-walpaper-computer-59628/"
---

It is a good idea to keep your apps **views** module small. A common mistake is do much work inside the views
functions. For the most part you can create separate modules to do the processing work outside the **views** and
just import it and use the functions inside the **views**. Another common mistake is a single app implementing many
different requirements or serving for many purposes. Sometimes you can split the work into different apps. When it
makes sense of course. But sometimes, the **views** will get big anyway. In this case, you might want to split the
views into different files.

***

#### Sample Scenario

Before I show you how, please consider the scenario below:

**App dir**

{% highlight bash %}
|∙∙core/
  |∙∙__init__.py
  |∙∙admin.py
  |∙∙migrations/
  |∙∙models.py
  |∙∙tests.py
  |∙∙urls.py
  |∙∙views.py
{% endhighlight %}

**views.py**

{% highlight python %}
from django.shortcuts import render

def view_a(request):
    return render(request, 'view_a.html')

def view_b(request):
    return render(request, 'view_b.html')

def view_c(request):
    return render(request, 'view_c.html')

def view_d(request):
    return render(request, 'view_d.html')
{% endhighlight %}

**urls.py**

{% highlight python %}
from django.conf.urls import url
import .views

urlpatterns = [
    url(r'^aaa$', views.view_a, name='view_a'),
    url(r'^bbb$', views.view_b, name='view_b'),
    url(r'^ccc$', views.view_c, name='view_c'),
    url(r'^ddd$', views.view_d, name='view_d'),
]
{% endhighlight %}

***

#### Splitting the Views

This strategy is good if you are refactoring your code base. This way you won't need to change the way you handle
your **urls.py**. Even though the view functions are in different files, they are still acessible via `views.view_a`.

**App dir**

Remove the **views.py** file and create a directory named **views**. Add a **__init__.py** file inside it and create
the separated view files.

{% highlight bash %}
|∙∙core/
  |∙∙__init__.py
  |∙∙admin.py
  |∙∙migrations/
  |∙∙models.py
  |∙∙tests.py
  |∙∙urls.py
  |∙∙views/
    |∙∙__init__.py
    |∙∙alpha.py
    |∙∙beta.py
{% endhighlight %}

**views/__init__.py**

This is an important step: import all the modules inside each view file.

{% highlight python %}
from .alpha import *
from .beta import *
{% endhighlight %}

**views/alpha.py**

{% highlight python %}
from django.shortcuts import render

def view_a(request):
    return render(request, 'view_a.html')

def view_b(request):
    return render(request, 'view_b.html')
{% endhighlight %}

**views/beta.py**

{% highlight python %}
from django.shortcuts import render

def view_c(request):
    return render(request, 'view_c.html')

def view_d(request):
    return render(request, 'view_d.html')
{% endhighlight %}

**urls.py**

You don't need to change anything here.

{% highlight python %}
from django.conf.urls import url
import .views

urlpatterns = [
    url(r'^aaa$', views.view_a, name='view_a'),
    url(r'^bbb$', views.view_b, name='view_b'),
    url(r'^ccc$', views.view_c, name='view_c'),
    url(r'^ddd$', views.view_d, name='view_d'),
]
{% endhighlight %}

Or you can simply import the views directly from different files. Truth is Django doesn't really care about where the
view function lives. And the name **views** is not mandatory, but it is recommended (always think about a new
developer starting to work with your code -- try to make things easier).

The example below you may keep **views/__init__.py** empty, since we are importing the views directly.

{% highlight python %}
from django.conf.urls import url
from .views import alpha
from .views import beta

urlpatterns = [
    url(r'^aaa$', alpha.view_a, name='view_a'),
    url(r'^bbb$', alpha.view_b, name='view_b'),
    url(r'^ccc$', beta.view_c, name='view_c'),
    url(r'^ddd$', beta.view_d, name='view_d'),
]
{% endhighlight %}
