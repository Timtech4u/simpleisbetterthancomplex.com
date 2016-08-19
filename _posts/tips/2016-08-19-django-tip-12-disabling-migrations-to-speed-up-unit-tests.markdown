---
layout: post
title: "Django Tips #12 Disabling Migrations to Speed Up Unit Tests"
author: Vitor Freitas
date: 2016-08-19 21:19:00 +0300
tags: django tests
category: tips
thumbnail: "/media/2016-08-19-django-tip-12-disabling-migrations-to-speed-up-unit-tests/featured.jpg"
featured_image: "/media/2016-08-19-django-tip-12-disabling-migrations-to-speed-up-unit-tests/featured.jpg"
---

The model migrations are certainly a great feature of the Django framework. But, when it comes down to running tests,
it really slows down the process. Especially if your migration history is big. This is a simple tip to speed up your
tests.

I like to create a separate **settings** file for this tweaks.

**tests_settings.py**

{% highlight python %}
from settings import *

# Custom settings goes here
{% endhighlight %}

And then to run the tests:

{% highlight bash %}
python manage.py test --settings=myproject.tests_settings --verbosity=1
{% endhighlight %}

***

#### Django >= 1.9

One option is using the `MIGRATION_MODULES` setting, which is intended to define a custom name for an app's
**migration** module. If you set **None** instead, Django will ignore the migration module.

{% highlight python %}
from settings import *

MIGRATION_MODULES = {
    'auth': None,
    'contenttypes': None,
    'default': None,
    'sessions': None,

    'core': None,
    'profiles': None,
    'snippets': None,
    'scaffold_templates': None,
}
{% endhighlight %}

***

#### Django < 1.9

This is a possible solution if you are using a version prior to 1.9. Actually, I still prefer to use it nowadays.
Because I don't need to set each app.

{% highlight python %}
from settings import *

class DisableMigrations(object):
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return 'notmigrations'

MIGRATION_MODULES = DisableMigrations()
{% endhighlight %}

***

#### Older Django Versions (using South)

Hold tight:

{% highlight python %}
SOUTH_TESTS_MIGRATE = False
{% endhighlight %}

Damn! It could even live inside the production **settings.py**.