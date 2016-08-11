---
layout: post
title: "Package of the Week: django-import-export"
date: 2016-08-11 22:27:00 +0300
author: Vitor Freitas
tags: django import export
category: packages
thumbnail: "/media/2016-08-11-django-import-export/featured.jpg"
featured_image: "/media/2016-08-11-django-import-export/featured.jpg"
---

As the name suggests, this is a library to handle importing and exporting data. The **django-import-export** library
supports multiple formats, including **xls**, **csv**, **json**, **yaml**, and all other formats supported by
**tablib**. It also have a Django admin integration, which is really convenient to use.

***

#### Installation

Pip is the way to go:

{% highlight bash %}
pip install django-import-export
{% endhighlight %}

Update your **settings.py**:

{% highlight python %}
INSTALLED_APPS = (
    ...
    'import_export',
)
{% endhighlight %}

There is also an optional configuration that I usually add:

{% highlight python %}
IMPORT_EXPORT_USE_TRANSACTIONS = True
{% endhighlight %}

The default value is **False**. It determines if the library will use database transactions on data import, just to be
on the safe side.

***

#### Resources

The **django-import-export** library work with the concept of **Resource**, which is class definition very similar to
how Django handle **model forms** and **admin classes**.

In the documentation the authors suggest to put the code related to the resources inside the **admin.py** file. But
if the implementation is not related to the Django admin, I usually prefer to create a new module named
**resources.py** inside the app folder.

**models.py**

{% highlight python %}
from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    birth_date = models.DateField()
    location = models.CharField(max_length=100, blank=True)
{% endhighlight %}

**resources.py**

{% highlight python %}
from import_export import resources
from .models import Person

class PersonResource(resources.ModelResource):
    class Meta:
        model = Person
{% endhighlight %}

This is the simplest definition. You can pass several configurations to the Meta class like `fields`, `exclude`, etc.
See the [documentation][import-export-docs]{:target="_blank"} for more details.

***

#### Exporting Data

Exporting data as CSV

{% highlight python %}
from .resources import PersonResource

person_resource = PersonResource()
dataset = person_resource.export()
dataset.csv
{% endhighlight %}

{% highlight txt %}
id,name,email,birth_date,location
1,John,john@doe.com,2016-08-11,Helsinki
2,Peter,peter@example.com,2016-08-11,Helsinki
3,Maria,maria@gmail.com,2016-08-11,Barcelona
4,Vitor,vitor@freitas.com,2016-08-11,Oulu
5,Erica,erica@gmail.com,2016-08-11,Oulu
{% endhighlight %}

Exporting data as JSON

{% highlight python %}
dataset.json
{% endhighlight %}

{% highlight json %}
[
  {"id": 1, "name": "John", "email": "john@doe.com", "birth_date": "2016-08-11", "location": "Helsinki"},
  {"id": 2, "name": "Peter", "email": "peter@example.com", "birth_date": "2016-08-11", "location": "Helsinki"},
  {"id": 3, "name": "Maria", "email": "maria@gmail.com", "birth_date": "2016-08-11", "location": "Barcelona"},
  {"id": 4, "name": "Vitor", "email": "vitor@freitas.com", "birth_date": "2016-08-11", "location": "Oulu"},
  {"id": 5, "name": "Erica", "email": "erica@gmail.com", "birth_date": "2016-08-11", "location": "Oulu"}
]
{% endhighlight %}

Exporting data as YAML


{% highlight python %}
dataset.yaml
{% endhighlight %}

{% highlight yaml %}
- {birth_date: '2016-08-11', email: john@doe.com, id: 1, location: Helsinki, name: John}
- {birth_date: '2016-08-11', email: peter@example.com, id: 2, location: Helsinki, name: Peter}
- {birth_date: '2016-08-11', email: maria@gmail.com, id: 3, location: Barcelona, name: Maria}
- {birth_date: '2016-08-11', email: vitor@freitas.com, id: 4, location: Oulu, name: Vitor}
- {birth_date: '2016-08-11', email: erica@gmail.com, id: 5, location: Oulu, name: Erica}
{% endhighlight %}

Filtering the data


{% highlight python %}
from .resources import PersonResource
from .models import Person

person_resource = PersonResource()
queryset = Person.objects.filter(location='Helsinki')
dataset = person_resource.export(queryset)
dataset.yaml
{% endhighlight %}

{% highlight python %}
- {birth_date: '2016-08-11', email: john@doe.com, id: 1, location: Helsinki, name: John}
- {birth_date: '2016-08-11', email: peter@example.com, id: 2, location: Helsinki, name: Peter}
{% endhighlight %}


##### Views Example

Exporting to CSV view:

{% highlight python %}
from django.http import HttpResponse
from .resources import PersonResource

def export(request):
    person_resource = PersonResource()
    dataset = person_resource.export()
    response = HttpResponse(dataset.csv, content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="persons.csv"'
    return response
{% endhighlight %}

Exporting to JSON view:

{% highlight python %}
from django.http import HttpResponse
from .resources import PersonResource

def export(request):
    person_resource = PersonResource()
    dataset = person_resource.export()
    response = HttpResponse(dataset.json, content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="persons.json"'
    return response
{% endhighlight %}

Exporting to Excel view:

{% highlight python %}
from django.http import HttpResponse
from .resources import PersonResource

def export(request):
    person_resource = PersonResource()
    dataset = person_resource.export()
    response = HttpResponse(dataset.xls, content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename="persons.xls"'
    return response
{% endhighlight %}

***

#### Importing Data

Consider the file **new_persons.csv**:

{% highlight txt %}
name,email,birth_date,location,id
Jessica,jessica@jones.com,2016-08-11,New York,
Mikko,mikko@suomi.com,2016-08-11,Jyväskyla,
{% endhighlight %}

The **id** must be present because it is the primary key. But it will be generated though, so we don't need to specify
the value.

**import.html**

{% highlight html %}
{% raw %}
{% extends 'base.html' %}

{% block content %}
  <form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    <input type="file" name="myfile">
    <button type="submit">Upload</button>
  </form>
{% endblock %}
{% endraw %}
{% endhighlight %}

**views.py**

{% highlight python %}
from tablib import Dataset

def simple_upload(request):
    if request.method == 'POST':
        person_resource = PersonResource()
        dataset = Dataset()
        new_persons = request.FILES['myfile']

        imported_data = dataset.load(new_persons.read())
        result = person_resource.import_data(dataset, dry_run=True)  # Test the data import

        if not result.has_errors():
            person_resource.import_data(dataset, dry_run=False)  # Actually import now

    return render(request, 'core/simple_upload.html')
{% endhighlight %}

***

#### Django Admin

Simply use `ImportExportModelAdmin` instead of `ModelAdmin`.
**admin.py**

{% highlight python %}
from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from .models import Person

@admin.register(Person)
class PersonAdmin(ImportExportModelAdmin):
    pass
{% endhighlight %}

And you will already notice the **Import** and **Export** buttons.

![Django Admin Import Export]({{ "/media/2016-08-11-django-import-export/django-admin.png" | prepend: site.baseurl }} "Django Admin Import Export")

The import functionaly come with a nice diff, when importing existing items:

![Django Admin Import Export]({{ "/media/2016-08-11-django-import-export/django-admin-2.png" | prepend: site.baseurl }} "Django Admin Import Export")

***

This is a great Django library. There is much more you can do with it. Totally worth having a look on the
[API reference][import-export-docs].

[import-export-docs]: https://django-import-export.readthedocs.io/en/latest/getting_started.html#creating-import-export-resource