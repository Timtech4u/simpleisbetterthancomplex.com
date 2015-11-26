---
layout: post
title:  "Package of the Week: Python Decouple"
date:   2015-11-26 12:00:00
author: Vitor Freitas
tags: python package
---

Web applications relies on several number of parameters to run properly on different environments. To name a few from a Django app settings: database url, password, secret key, debug status, email host, allowed hosts. Most of these parameters are environment-specific. On a development environment you might want to run your application with debug mode on. Also, it's a clever idea to keep your secret key in a safe place (not in your git repository).

Python Decouple is a great library that helps you strictly separate the settings parameters from your source code. The idea is simple: Parameters related to the project, goes straight to the source code. Parameters related to an _instance of the project_, goes to an environment file.

The following is a quick start of how to use the Python Decouple library.

***

#### Installation

{% highlight bash %}
$ pip install python-decouple
{% endhighlight %}

Or download it from [PyPI][python-decouple-pypi]{:target="_blank"} if you prefer.

#### Usage

Let's consider the following `settings.py` file, to explain how to use the library.

{% highlight python %}
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = '3izb^ryglj(bvrjb2_y1fZvcnbky#358_l6-nn#i8fkug4mmz!'
DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'HELLO_DJANGO',
        'USER': 'U_HELLO',
        'PASSWORD': 'hA8(scA@!fg3*sc&xaGh&6%-l<._&xCf',
        'HOST': '127.0.0.1',
        'PORT': '',
    }
}
{% endhighlight %}

First create a file named `.env` in the root of your project. You can also use a `.ini` file, in case the `.env` isn't suitable for your use case. See the [documentation][python-decouple-pypi]{:target="_blank"} for further instructions.

{% highlight bash %}
SECRET_KEY=3izb^ryglj(bvrjb2_y1fZvcnbky#358_l6-nn#i8fkug4mmz!
DEBUG=True
DB_NAME=HELLO_DJANGO
DB_USER=U_HELLO
DB_PASSWORD=hA8(scA@!fg3*sc&xaGh&6%-l<._&xCf
DB_HOST=127.0.0.1
{% endhighlight %}

If you are working with Git, update your `.gitignore` adding the `.env` file so you don't commit any sensitive data to your remote repository.

Now import the library:

{% highlight python %}
from decouple import config
{% endhighlight %}

Retrieve the settings parameters:

{% highlight python %}
import os
from decouple import config

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', cast=bool)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': '',
    }
}
{% endhighlight %}

##### Casting the data

Attention to the **cast** argument. Django expects `DEBUG` to be a **boolean**. In a similar way it expects `EMAIL_PORT` to be an **integer**.

{% highlight python %}
DEBUG = config('DEBUG', cast=bool)
EMAIL_PORT = config('EMAIL_PORT', cast=int)
{% endhighlight %}

Actually, the **cast** argument can receive any **callable**, that will transform the string value into something else. In the case of the `ALLOWED_HOSTS`, Django expects a list of hostname.

In your `.env` file you can put it like this:

{% highlight bash %}
ALLOWED_HOSTS=.localhost, .herokuapp.com
{% endhighlight %}

And then in your `settings.py` you can retrieve it this way:

{% highlight python %}
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])
{% endhighlight %}

Looks complicated, right? Actually the library comes with a Csv Helper, so you don't need to write all this code. The better way to do it would be:

{% highlight python %}
from decouple import config, Csv

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())
{% endhighlight %}

##### Default values

You can add an extra parameter to the `config` function, to define a default value, in case there is an undefined value in the `.env` file.

{% highlight python %}
DEBUG = config('DEBUG', default=True, cast=bool)
{% endhighlight %}

Meaning you won't need to define the `DEBUG` parameter in the `.env` file in the development environment for example.

##### Overriding config files

In case you want to temporarily change some of the settings parameter, you can override it with environment variables:

{% highlight bash %}
DEBUG=False python manage.py
{% endhighlight %}

***

Python Decouple is a must have app if you are developing with Django. Personally I use it in all my Django projects. It's important to keep your application credentials like API Keys, Amazon S3, email parameters, database parameters safe, specially if it's an open source repository. Also no more `development_settings.py` and `production_settings.py`, use just one `settings.py` for your whole project.

Python Decouple was developed by [Henrique Bastos][henrique-bastos]{:target="_blank"} and it is distributed under the MIT license. You can learn more about it reading it's [documentation][python-decouple-pypi]{:target="_blank"}. The source code is available on [GitHub][python-decouple-github]{:target="_blank"}.

[python-decouple-pypi]: https://pypi.python.org/pypi/python-decouple
[python-decouple-github]: https://github.com/henriquebastos/python-decouple
[henrique-bastos]: http://henriquebastos.net