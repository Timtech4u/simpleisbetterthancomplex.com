---
title: "How to Upload Files With Django"
category: tutorial
tags: django forms media upload
date: 2016-08-01 12:05:00 +0300
date_modified: 2016-08-01 15:42:00 +0300
thumbnail: "/media/2016-08-01-how-to-upload-files-with-django/featured.jpg"
featured_image: "/media/2016-08-01-how-to-upload-files-with-django/featured.jpg"
excerpt: In this tutorial you will learn the concepts behind Django file upload and how to handle file upload using model forms. In the end of this post you will find the source code of the examples I used so you can try and explore.
---

<div class="info">
    <strong><i class="fa fa-info-circle"></i> Updated at {{ page.date_modified | date: "%b %-d, %Y" }}:</strong>
    As suggested by <a href="https://twitter.com/fapolloner/status/760075954874150912" target="_blank">@fapolloner</a>, I've removed the manual
    file handling. Updated the example using FileSystemStorage instead. Thanks!
</div>

In this tutorial you will learn the concepts behind Django file upload and how to handle file upload using model forms.
In the end of this post you will find the source code of the examples I used so you can try and explore.

***

#### The Basics of File Upload With Django

When files are submitted to the server, the file data ends up placed in `request.FILES`.

It is mandatory for the HTML form to have the attribute `enctype="multipart/form-data"` set correctly. Otherwise the
`request.FILES` will be empty.

The form must be submitted using the **POST** method.

Django have proper model fields to handle uploaded files: `FileField` and `ImageField`.

The files uploaded to `FileField` or `ImageField` are not stored in the database but in the filesystem.

`FileField` and `ImageField` are created as a string field in the database (usually VARCHAR), containing the reference
to the actual file.

If you delete a model instance containing `FileField` or `ImageField`, Django will **not** delete the physical file,
but only the reference to the file.

The `request.FILES` is a dictionary-like object. Each key in `request.FILES` is the name from the `<input type="file" name="" />`.

Each value in `request.FILES` is an `UploadedFile` instance.

You will need to set `MEDIA_URL` and `MEDIA_ROOT` in your project's **settings.py**.

{% highlight python %}
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
{% endhighlight %}

In the development server you may serve the user uploaded files (media) using **django.contrib.staticfiles.views.serve()**
view.

{% highlight python %}
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Project url patterns...
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
{% endhighlight %}

To access the `MEDIA_URL` in template you must add `django.template.context_processors.media` to your
`context_processeors` inside the `TEMPLATES` config.

***

#### Simple File Upload

Following is a minimal file upload example using `FileSystemStorage`. Use it just to learn about the flow of the
process.

**simple_upload.html**

{% highlight html %}
{% raw %}{% extends 'base.html' %}{% endraw %}

{% raw %}{% load static %}{% endraw %}

{% raw %}{% block content %}{% endraw %}
  <form method="post" enctype="multipart/form-data">
    {% raw %}{% csrf_token %}{% endraw %}
    <input type="file" name="myfile">
    <button type="submit">Upload</button>
  </form>

  {% raw %}{% if uploaded_file_url %}{% endraw %}
    <p>File uploaded at: <a href="{% raw %}{{ uploaded_file_url }}{% endraw %}">{% raw %}{{ uploaded_file_url }}{% endraw %}</a></p>
  {% raw %}{% endif %}{% endraw %}

  <p><a href="{% raw %}{% url 'home' %}{% endraw %}">Return to home</a></p>
{% raw %}{% endblock %}{% endraw %}
{% endhighlight %}

**views.py**

{% highlight python %}
from django.shortcuts import render
from django.conf import settings
from django.core.files.storage import FileSystemStorage

def simple_upload(request):
    if request.method == 'POST' and request.FILES['myfile']:
        myfile = request.FILES['myfile']
        fs = FileSystemStorage()
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = fs.url(filename)
        return render(request, 'core/simple_upload.html', {
            'uploaded_file_url': uploaded_file_url
        })
    return render(request, 'core/simple_upload.html')
{% endhighlight %}


***

#### File Upload With Model Forms

Now, this is a way more convenient way. Model forms perform validation, automatically builds the absolute path for the
upload, treats filename conflicts and other common tasks.

**models.py**

{% highlight python %}
from django.db import models

class Document(models.Model):
    description = models.CharField(max_length=255, blank=True)
    document = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
{% endhighlight %}


**forms.py**

{% highlight python %}
from django import forms
from uploads.core.models import Document

class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ('description', 'document', )
{% endhighlight %}

**views.py**

{% highlight python %}
def model_form_upload(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = DocumentForm()
    return render(request, 'core/model_form_upload.html', {
        'form': form
    })
{% endhighlight %}

**model_form_upload.html**

{% highlight html %}
{% raw %}{% extends 'base.html' %}{% endraw %}

{% raw %}{% block content %}{% endraw %}
  <form method="post" enctype="multipart/form-data">
    {% raw %}{% csrf_token %}{% endraw %}
    {% raw %}{{ form.as_p }}{% endraw %}
    <button type="submit">Upload</button>
  </form>

  <p><a href="{% raw %}{% url 'home' %}{% endraw %}">Return to home</a></p>
{% raw %}{% endblock %}{% endraw %}
{% endhighlight %}

***

#### About the FileField upload_to Parameter

See the example below:

{% highlight python %}
document = models.FileField(upload_to='documents/')
{% endhighlight %}

Note the `upload_to` parameter. The files will be automatically uploaded to `MEDIA_ROOT/documents/`.

It is also possible to do something like:

{% highlight python %}
document = models.FileField(upload_to='documents/%Y/%m/%d/')
{% endhighlight %}

A file uploaded today would be uploaded to `MEDIA_ROOT/documents/2016/08/01/`.

The `upload_to` can also be a callable that returns a string. This callable accepts two parameters, **instance** and
**filename**.

{% highlight python %}
def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/{1}'.format(instance.user.id, filename)

class MyModel(models.Model):
    upload = models.FileField(upload_to=user_directory_path)
{% endhighlight %}

***

#### Download the Examples

The code used in this post is available on [Github][source-code].

{% highlight bash %}
git clone https://github.com/sibtc/simple-file-upload.git
{% endhighlight %}

{% highlight bash %}
pip install django
{% endhighlight %}

{% highlight bash %}
python manage.py migrate
{% endhighlight %}

{% highlight bash %}
python manage.py runserver
{% endhighlight %}

[source-code]: https://github.com/sibtc/simple-file-upload