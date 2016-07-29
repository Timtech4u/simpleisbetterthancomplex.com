---
title: "How to Export to Excel"
date: 2016-07-29 20:46:00 +0300
category: tutorial
tags: django models export xls
thumbnail: "/media/2016-07-29-how-to-export-to-excel/featured-post-image.jpg"
featured_image: "/media/2016-07-29-how-to-export-to-excel/featured-post-image.jpg"
---

Export data to excel is a common requirement on many web applications. Python makes everything easier. But,
nevertheless, it is the kind of task I need to look for references whenever I have to implement.

I will give you two options in this tutorial: (1) export data to a .csv file using Python's **csv** module; (2) export
data to a .xls file using a third-party module named **xlwt**.

For both cases, consider we are exporting `django.contrib.auth.models.User` data.

***

#### Export Data to CSV File

Easiest way. No need to install dependencies, which is a great thing. Use it if you do not need any fancy formating.

**views.py**

{% highlight python %}
import csv

from django.http import HttpResponse
from django.contrib.auth.models import User

def export_users_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="users.csv"'

    writer = csv.writer(response)
    writer.writerow(['Username', 'First name', 'Last name', 'Email address'])

    users = User.objects.all().values_list('username', 'first_name', 'last_name', 'email')
    for user in users:
        writer.writerow(user)

    return response
{% endhighlight %}

**urls.py**

{% highlight python %}
import views

urlpatterns = [
    ...
    url(r'^export/csv/$', views.export_users_csv, name='export_users_csv'),
]
{% endhighlight %}

**template.html**

{% highlight html %}
<a href="{% raw %}{% url 'export_users_csv' %}{% endraw %}">Export all users</a>
{% endhighlight %}

In the example above I used the `values_list` in the QuerySet for two reasons: First to query only the fields I needed
to export, and second because it will return the data in a tuple instead of model instances. The `writerow` method
expects a list/tuple.

Another way to do it would be:

{% highlight python %}
writer.writerow([user.username, user.first_name, user.last_name, user.email, ])
{% endhighlight %}

***

#### Export Data to XLS File

Use it if you really need to export to a .xls file. You will be able to add formating as bold font, font size, define
column size, etc.

First of all, install the **xlwt** module. The easiest way is to use **pip**.

{% highlight bash %}
pip install xlwt
{% endhighlight %}

**views.py**

{% highlight python %}
import xlwt

from django.http import HttpResponse
from django.contrib.auth.models import User

def export_users_xls(request):
    response = HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="users.xls"'

    wb = xlwt.Workbook(encoding='utf-8')
    ws = wb.add_sheet('Users')

    # Sheet header, first row
    row_num = 0

    font_style = xlwt.XFStyle()
    font_style.font.bold = True

    columns = ['Username', 'First name', 'Last name', 'Email address', ]

    for col_num in xrange(len(columns)):
        ws.write(row_num, col_num, columns[col_num], font_style)

    # Sheet body, remaining rows
    font_style = xlwt.XFStyle()

    rows = User.objects.all().values_list('username', 'first_name', 'last_name', 'email')
    for row in rows:
        row_num += 1
        for col_num in xrange(len(row)):
            ws.write(row_num, col_num, row[col_num], font_style)

    wb.save(response)
    return response
{% endhighlight %}

**urls.py**

{% highlight python %}
import views

urlpatterns = [
    ...
    url(r'^export/xls/$', views.export_users_xls, name='export_users_xls'),
]
{% endhighlight %}

**template.html**

{% highlight html %}
<a href="{% raw %}{% url 'export_users_xls' %}{% endraw %}">Export all users</a>
{% endhighlight %}

Learn more about the **xlwt** module reading its [official documentation][xlwt-docs]{:target="_blank"}.

[xlwt-docs]: http://xlwt.readthedocs.io/en/latest/