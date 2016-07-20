---
layout: post
title: "Django Tips #7 How to Get the Current URL Within a Django Template"
date: 2016-07-20
author: Vitor Freitas
tags: django template
category: tips
thumbnail: "/media/2016-07-20-django-tip-7-how-to-get-the-current-url-within-a-django-template/featured-post-image.jpg"
featured_image: "/media/2016-07-20-django-tip-7-how-to-get-the-current-url-within-a-django-template/featured-post-image.jpg"
---

Make sure you have `django.template.context_processors.request` listed in your `context_processors`.

As of Django 1.9 version, it already comes configurated. The default `TEMPLATES` configuration looks like that:

{% highlight python %}
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
{% endhighlight %}

To get the current path:

{% highlight html %}
  {% raw %}{{ request.path }}{% endraw %}
{% endhighlight %}

Current path with querystring:

{% highlight html %}
  {% raw %}{{ request.get_full_path }}{% endraw %}
{% endhighlight %}

Domain, path and querystring:

{% highlight html %}
  {% raw %}{{ request.build_absolute_uri }}{% endraw %}
{% endhighlight %}

#### Outputs

Considering we are acessing the following URL: `http://127.0.0.1:8000/home/?q=test`

Method | Output
-------|-------
`request.path` | `/home/`
`request.get_full_path` | `/home/?q=test`
`request.build_absolute_uri` | `http://127.0.0.1:8000/home/?q=test`

#### Troubleshooting

##### Django 1.7 or below

If you are using an older version of Django (<= 1.7) where the `TEMPLATES` configuration is not available, you can include the
context processor like this:

**settings.py**

{% highlight python %}
from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP

TEMPLATE_CONTEXT_PROCESSORS = TCP + (
    'django.core.context_processors.request',
)
{% endhighlight %}

Notice the context processor was available inside the `core` module. Since version `>= 1.8` it is available inside the
`template` module.
