---
title: "Exploring Django Utils #2"
date: 2016-08-17 22:58:00 +0300
category: article
tags: django utils
thumbnail: "/media/2016-08-17-exploring-django-utils-2/featured.jpg"
featured_image: "/media/2016-08-17-exploring-django-utils-2/featured.jpg"
---

Last week I started a post series exploring the `django.utils` module. In this second part I will be focusing more
on the `html` module.

***

#### HTML

Module: `django.utils.html`

##### escape

Returns the given text with ampersands, quotes and angle brackets encoded for use in HTML.

{% highlight python %}
from django.utils.html import escape

escape("<strong style='font-size: 12px'>escaped html</strong>")
{% endhighlight %}

{% highlight python %}
'&lt;strong style=&#39;font-size: 12px&#39;&gt;escaped html&lt;/strong&gt;'
{% endhighlight %}

It will cause already escaped strings to be escaped again:

{% highlight python %}
escaped_html = escape("<strong>escaped html</strong>")
# '&lt;strong&gt;escaped html&lt;/strong&gt;'

escape(escaped_html)
# '&amp;lt;strong&amp;gt;escaped html&amp;lt;/strong&amp;gt;'
{% endhighlight %}

If this is a concern, use `conditional_escape()` instead.

##### conditional_escape

{% highlight python %}
escaped_html = conditional_escape("<strong>escaped html</strong>")
# '&lt;strong&gt;escaped html&lt;/strong&gt;'

conditional_escape(escaped_html)
# '&lt;strong&gt;escaped html&lt;/strong&gt;'
{% endhighlight %}

##### format_html

This function is similar to str.format, but it will conditional escape all the arguments. Prefer to use it to build
small HTML fragments instead of str.format or string interpolation, as it is safer.

{% highlight python %}
from django.utils.html import format_html

format_html('<div class="alert {}">{}</>', 'warning', 'Watch out!')
{% endhighlight %}

{% highlight python %}
'<div class="alert warning">Watch out!</>'
{% endhighlight %}

Safely format HTML fragments:

{% highlight python %}
format_html('<div class="alert {}">{}</>', '<script>alert(1);</script>', 'Watch out!')
{% endhighlight %}

{% highlight python %}
'<div class="alert &lt;script&gt;alert(1);&lt;/script&gt;">Watch out!</>'
{% endhighlight %}


##### format_html_join

A wrapper of format_html, for the common case of a group of arguments that need to be formatted using the same format
string.

{% highlight python %}
format_html_join('\n', '<p>{}</p>', ['a', 'b', 'c'])
{% endhighlight %}

{% highlight html %}
{% raw %}
<p>a</p>\n<p>b</p>\n<p>c</p>
{% endraw %}
{% endhighlight %}

Another example:

{% highlight python %}
data = [
    ['success', 'Success message'],
    ['warning', 'Watch out!'],
    ['danger', 'Danger!!'],
]

format_html_join('\n', '<div class="alert {0}">{1}</div>', data)
{% endhighlight %}

{% highlight html %}
{% raw %}
<div class="alert success">Success message</div>\n
<div class="alert warning">Watch out!</div>\n
<div class="alert danger">Danger!!</div>
{% endraw %}
{% endhighlight %}

Yet another example:

{% highlight python %}
format_html_join('\n', '<tr><td>{0}</td><td>{1}</td></tr>', ((u.first_name, u.last_name)
                                                            for u in users))
{% endhighlight %}

{% highlight html %}
{% raw %}
<tr><td>Vitor</td><td>Freitas</td></tr>\n
<tr><td>John</td><td>Duo</td></tr>\n
<tr><td>Peter</td><td>Croke</td></tr>\n
<tr><td>Elektra</td><td>Moore</td></tr>
{% endraw %}
{% endhighlight %}


##### linebreaks

{% highlight python %}
from django.utils.html import linebreaks

linebreaks('convert\ninto html paragraphs\ntest')
{% endhighlight %}

{% highlight html %}
{% raw %}
<p>convert<br />into html paragraphs<br />test</p>
{% endraw %}
{% endhighlight %}

***

* [Exploring Django Utils #1][part1]

[part1]: /article/2016/08/10/exploring-django-utils-1.html
