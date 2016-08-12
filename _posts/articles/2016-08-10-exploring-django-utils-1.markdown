---
title: "Exploring Django Utils #1"
date: 2016-08-10 21:59:00 +0300
category: article
tags: django utils
thumbnail: "/media/2016-08-10-exploring-django-utils-1/featured.jpg"
featured_image: "/media/2016-08-10-exploring-django-utils-1/featured.jpg"
---

Exploring the Django source code I ended up discovering some really nice utility functions that I wasn't aware of. I
thought about sharing with you guys in a form of reference-like article. There are great stuff there, so I decided to
break this post into a few parts.

***

#### Crypto

Module: `django.utils.crypto`

##### get_random_string

Calling it without any parameters defaults the length to **12**.

{% highlight python %}
from django.utils.crypto import get_random_string

get_random_string()
{% endhighlight %}


{% highlight python %}
'5QxAxqyhsyJM'
{% endhighlight %}

Your may pass the number of characteres you want:

{% highlight python %}
get_random_string(50)
{% endhighlight %}

{% highlight python %}
'lrWYnyxhnXpwmjHDzmdgTFaIi1j73cKD5fPDOPwuVBmmKxITYF'
{% endhighlight %}

And also the collection of characteres the random string will have:

{% highlight python %}
get_random_string(12, '0123456789')
{% endhighlight %}

{% highlight python %}
'805379737758'
{% endhighlight %}

***

#### Dates

Module: `django.utils.dates`

Basically it is a collection of commonly-used date structures.

##### WEEKDAYS

{% highlight python %}
from django.utils.dates import WEEKDAYS
{% endhighlight %}

{% highlight python %}
WEEKDAYS = {
    0: _('Monday'), 1: _('Tuesday'), 2: _('Wednesday'), 3: _('Thursday'), 4: _('Friday'),
    5: _('Saturday'), 6: _('Sunday')
}
{% endhighlight %}

##### WEEKDAYS_ABBR

{% highlight python %}
from django.utils.dates import WEEKDAYS_ABBR
{% endhighlight %}

{% highlight python %}
WEEKDAYS_ABBR = {
    0: _('Mon'), 1: _('Tue'), 2: _('Wed'), 3: _('Thu'), 4: _('Fri'),
    5: _('Sat'), 6: _('Sun')
}
{% endhighlight %}

##### MONTHS

{% highlight python %}
from django.utils.dates import MONTHS
{% endhighlight %}

{% highlight python %}
MONTHS = {
    1: _('January'), 2: _('February'), 3: _('March'), 4: _('April'), 5: _('May'), 6: _('June'),
    7: _('July'), 8: _('August'), 9: _('September'), 10: _('October'), 11: _('November'),
    12: _('December')
}
{% endhighlight %}

***

#### DateFormat

Module: `django.utils.dateformat`

The implementation of PHP **date()** style date formatting, which is used in the Django template filter date formatter.
This is a great utility module.

Refer to the [Date Template Filter][date-ref-guide] reference guide for a list of format codes semantically ordered.

##### format

For the following examples, consider the `now = timezone.now()`.

{% highlight python %}
from django.utils.dateformat import format
from django.utils import timezone

now = timezone.now()  # datetime.datetime(2016, 8, 10, 20, 32, 36, 461069, tzinfo=<UTC>)
format(now, 'd M Y')
{% endhighlight %}

{% highlight python %}
'10 Aug 2016'
{% endhighlight %}

Date and time:

{% highlight python %}
format(now, 'd/m/Y H:i')
{% endhighlight %}

{% highlight python %}
'10/08/2016 20:32'
{% endhighlight %}

***

#### DateParse

Module: `django.utils.dateparse`

Convert a formatted date string into date/time/datetime. If the string is well formatted but represents an invalid,
the function will return **None**.

##### parse_date

{% highlight python %}
from django.utils.dateparse import parse_date

parse_date('2016-08-10')
{% endhighlight %}

{% highlight python %}
datetime.date(2016, 8, 10)
{% endhighlight %}


##### parse_time

{% highlight python %}
from django.utils.dateparse import parse_time

parse_time('20:43:02')
{% endhighlight %}

{% highlight python %}
datetime.time(20, 43, 2)
{% endhighlight %}

##### parse_datetime

{% highlight python %}
from django.utils.dateparse import parse_datetime

parse_datetime('2016-08-10 20:32:36')
{% endhighlight %}

{% highlight python %}
datetime.datetime(2016, 8, 10, 20, 32, 36)
{% endhighlight %}

***

#### HTML

Module: `django.utils.html`

##### urlize

Utility to turn urls into `<a>` tags.

{% highlight python %}
from django.utils.html import urlize

urlize('You guys should visit this website www.google.com')
{% endhighlight %}

{% highlight python %}
'You guys should visit this website <a href="http://www.google.com">www.google.com</a>'
{% endhighlight %}

It also works with emails:

{% highlight python %}
urlize('Send me a message to vitor@freitas.com')
{% endhighlight %}

{% highlight python %}
'Send me a message to <a href="mailto:vitor@freitas.com">vitor@freitas.com</a>'
{% endhighlight %}

You can also trim the size of the link:

{% highlight python %}
urlize('Visit the new Snippets section https://simpleisbetterthancomplex.com/snippets/', 30)
{% endhighlight %}

{% highlight python %}
'Visit the new Snippets section <a href="https://simpleisbetterthancomplex.com/snippets/">https://simpleisbetterthanc...</a>'
{% endhighlight %}

***

That's it for now. I hope you may find some of those useful. I will cover more modules in a future article.

[date-ref-guide]: /ref/date/
