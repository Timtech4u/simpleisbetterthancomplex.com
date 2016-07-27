---
title: "How to Return JSON-Encoded Response"
date: 2016-07-27 19:56:00 +0300
tags: django views json
category: tutorial
thumbnail: "/media/2016-07-27-how-to-return-json-encoded-response/featured-post-image.jpg"
featured_image: "/media/2016-07-27-how-to-return-json-encoded-response/featured-post-image.jpg"
---

Since version 1.7, Django counts with the built-in `JsonResponse` class, which is a subclass of `HttpResponse`.
Its default **Content-Type header** is set to **application/json**, which is really convenient. It also comes with a
**JSON encoder**, so you don't need to serialize the data before returning the response object.

See a minimal example below:

{% highlight python %}
from django.http import JsonResponse

def profile(request):
    data = {
        'name': 'Vitor',
        'location': 'Finland',
        'is_active': True,
        'count': 28
    }
    return JsonResponse(data)
{% endhighlight %}

By default, the `JsonResponse`'s first parameter, **data**, should be a **dict** instance. To pass any other
JSON-serializable object you must set the **safe** parameter to **False**.

{% highlight python %}
return JsonResponse([1, 2, 3, 4], safe=False)
{% endhighlight %}

See below the class signature:

{% highlight python %}
class JsonResponse(data, encoder, safe, json_dumps_params, **kwargs)
{% endhighlight %}

**Defaults**:

* **data**: (no default)
* **encoder**: django.core.serializers.json.DjangoJSONEncoder
* **safe**: True
* **json_dumps_params**: None


**Extra bits:**

If you want to return Django models as JSON, you may want to it this way:

{% highlight python %}
def get_users(request):
    users = User.objects.all().values('first_name', 'last_name')  # or simply .values() to get all fields
    users_list = list(users)  # important: convert the QuerySet to a list object
    return JsonResponse(users_list, safe=False)
{% endhighlight %}

***

#### Troubleshooting

##### Django 1.6 or below

For older versions of Django, you must use an `HttpResponse` object. See an example below:

{% highlight python %}
import json
from django.http import HttpResponse

def profile(request):
    data = {
        'name': 'Vitor',
        'location': 'Finland',
        'is_active': True,
        'count': 28
    }
    dump = json.dumps(data)
    return HttpResponse(dump, content_type='application/json')
{% endhighlight %}

***

Leave a comment below if this article was helpful to you! Or if you have any questions/suggestions/improvements etc etc
please let me know! :-)

You can also [subscribe to my mailing list][join]. I send exclusive content every week!

[join]: http://eepurl.com/b0gR51
