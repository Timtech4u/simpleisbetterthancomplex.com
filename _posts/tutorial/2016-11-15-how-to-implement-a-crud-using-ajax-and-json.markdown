---
title: "How to Implement CRUD Using Ajax and Json"
date: 2016-11-15 14:42:00 +0300
category: tutorial
tags: django ajax crud jquery
thumbnail: "/media/2016/11/thumbnail-ajax.jpg"
featured_image: "/media/2016/11/featured-ajax.jpg"
featured_image_source: "https://www.pexels.com/photo/macbook-laptop-smartphone-apple-7358/"
---

Using Ajax to create asynchronous request to manipulate Django models is a very common use case. It can be used to
provide an in line edit in a table, or create a new model instance without going back and forth in the website.
It also bring some challenges, such as keeping the state of the objects consistent.

In case you are not familiar with the term CRUD, it stand for **C**reate **R**ead **U**pdate **D**elete.

Those are the basic operations we perform in the application entities. For the most part the Django Admin is all about
CRUD.

This tutorial is compatible with Python 2.7 and 3.5, using Django 1.8, 1.9 or 1.10.

***

#### Table of Contents

* [Basic Configuration](#basic-configuration)
* [Working Example](#working-example)
* [Listing Books](#listing-books)
* [Create Book](#create-book)
* [Edit Book](#edit-book)
* [Delete Book](#delete-book)
* [Conclusions](#conclusions)

***

#### Basic Configuration

For this tutorial we will be using jQuery to implement the Ajax requests. Feel free to use any other JavaScript
framework (or to implement it using bare JavaScript). The concepts should remain the same.

Grab a copy of jQuery, either download it or refer to one of the many CDN options.

[jquery.com/download/](http://jquery.com/download/){:target="_blank"}

I usually like to have a local copy, because sometimes I have to work off-line. Place the jQuery in the bottom of your
base template:

**base.html**

{% highlight django %}
{% raw %}
{% load static %}<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bookstore - Simple is Better Than Complex</title>
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet">
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    {% include 'includes/header.html' %}
    <div class="container">
      {% block content %}
      {% endblock %}
    </div>
    <script src="{% static 'js/jquery-3.1.1.min.js' %}"></script>  <!-- JQUERY HERE -->
    <script src="{% static 'js/bootstrap.min.js' %}"></script>
    {% block javascript %}
    {% endblock %}
  </body>
</html>
{% endraw %}
{% endhighlight %}

I will be also using Bootstrap. It is not required but it provide a good base css and also some useful HTML components,
such as a Modal and pretty tables.

***

#### Working Example

I will be working in a app called **books**. For the CRUD operations consider the following model:

**models.py**

{% highlight python %}
class Book(models.Model):
    HARDCOVER = 1
    PAPERBACK = 2
    EBOOK = 3
    BOOK_TYPES = (
        (HARDCOVER, 'Hardcover'),
        (PAPERBACK, 'Paperback'),
        (EBOOK, 'E-book'),
    )
    title = models.CharField(max_length=50)
    publication_date = models.DateField(null=True)
    author = models.CharField(max_length=30, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    pages = models.IntegerField(blank=True, null=True)
    book_type = models.PositiveSmallIntegerField(choices=BOOK_TYPES)
{% endhighlight %}

***

#### Listing Books

Let's get started by listing all the book objects.

We need a route in the urlconf:

**urls.py**:

{% highlight python %}
from django.conf.urls import url, include
from mysite.books import views

urlpatterns = [
    url(r'^books/$', views.book_list, name='book_list'),
]

{% endhighlight %}

A simple view to list all the books:

**views.py**

{% highlight python %}
from django.shortcuts import render
from .models import Book

def book_list(request):
    books = Book.objects.all()
    return render(request, 'books/book_list.html', {'books': books})
{% endhighlight %}

**book_list.html**

{% highlight django %}
{% raw %}
{% extends 'base.html' %}

{% block content %}
  <h1 class="page-header">Books</h1>
  <table class="table" id="book-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Author</th>
        <th>Type</th>
        <th>Publication date</th>
        <th>Pages</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      {% for book in book_list %}
        <tr>
          <td>{{ book.id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.get_book_type_display }}</td>
          <td>{{ book.publication_date }}</td>
          <td>{{ book.pages }}</td>
          <td>{{ book.price }}</td>
        </tr>
      {% empty %}
        <tr>
          <td colspan="7" class="text-center bg-warning">No book</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
{% endblock %}
{% endraw %}
{% endhighlight %}

So far nothing special. Our template should look like this:

![Books List](/media/2016/11/books1.png)

***

#### Create Book

First thing, let's create a model form. Let Django do its work.

**forms.py**

{% highlight python %}
from django import forms
from .models import Book

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ('title', 'publication_date', 'author', 'price', 'pages', 'book_type', )
{% endhighlight %}

We need now to prepare the template to handle the creation operation. We will be working with partial templates to
render only the parts that we actually need.

The strategy I like to use is to place a generic bootstrap modal, and use it for all the operations.

**book_list.html**

{% highlight django %}
{% raw %}
{% extends 'base.html' %}

{% block content %}
  <h1 class="page-header">Books</h1>

  <!-- BUTTON TO TRIGGER THE ACTION -->
  <p>
    <button type="button" class="btn btn-primary js-create-book">
      <span class="glyphicon glyphicon-plus"></span>
      New book
    </button>
  </p>

  <table class="table" id="book-table">
    <!-- TABLE CONTENT SUPPRESSED FOR BREVITY'S SAKE -->
  </table>

  <!-- THE MODAL WE WILL BE USING -->
  <div class="modal fade" id="modal-book">
    <div class="modal-dialog">
      <div class="modal-content">
      </div>
    </div>
{% endblock %}
{% endraw %}
{% endhighlight %}

Note that I already added a **button** that will be used to start the creation process. I added a class **js-create-book**
to hook the click event. I usually add a class starting with **js-** for all elements that interacts with JavaScript
code. It's easier to debug the code later on. It's not a enforcement but just a convention. Helps the code quality.

Add a new route:

**urls.py**:

{% highlight python %}
from django.conf.urls import url, include
from mysite.books import views

urlpatterns = [
    url(r'^books/$', views.book_list, name='book_list'),
    url(r'^books/create/$', views.book_create, name='book_create'),
]

{% endhighlight %}

Let's implement the **book_create** view:

**views.py**

{% highlight python %}
from django.http import JsonResponse
from django.template.loader import render_to_string
from .forms import BookForm

def book_create(request):
    form = BookForm()
    context = {'form': form}
    html_form = render_to_string('books/includes/partial_book_create.html',
        context,
        request=request,
    )
    return JsonResponse({'html_form': html_form})
{% endhighlight %}

Note that we are not rendering a template but returning a Json response.

Now we create the partial template to render the form:

**partial_book_create.html**

{% highlight django %}
{% raw %}
{% load widget_tweaks %}

<form method="post">
  {% csrf_token %}
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <h4 class="modal-title">Create a new book</h4>
  </div>
  <div class="modal-body">
    {% for field in form %}
      <div class="form-group{% if field.errors %} has-error{% endif %}">
        <label for="{{ field.id_for_label }}">{{ field.label }}</label>
        {% render_field field class="form-control" %}
        {% for error in field.errors %}
          <p class="help-block">{{ error }}</p>
        {% endfor %}
      </div>
    {% endfor %}
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <button type="submit" class="btn btn-primary">Create book</button>
  </div>
</form>
{% endraw %}
{% endhighlight %}

I'm using the **django-widget-tweaks** library to render the form fields properly using the bootstrap class.
You can read more about it in a post I published last year: [Package of the Week: Django Widget Tweaks](/2015/12/04/package-of-the-week-django-widget-tweaks.html).

Now the glue that will put everything together: JavaScript.

Create an external JavaScript file. I created mine in the path: **mysite/books/static/books/js/books.js**

**books.js**

{% highlight javascript %}
$(function () {

  $(".js-create-book").click(function () {
    $.ajax({
      url: '/books/create/',
      type: 'get',
      dataType: 'json',
      beforeSend: function () {
        $("#modal-book").modal("show");
      },
      success: function (data) {
        $("#modal-book .modal-content").html(data.html_form);
      }
    });
  });

});
{% endhighlight %}

Don't forget to include this JavaScript file in the **book_list.html** template:

**book_list.html**


{% highlight django %}
{% raw %}
{% extends 'base.html' %}

{% load static %}

{% block javascript %}
  <script src="{% static 'books/js/books.js' %}"></script>
{% endblock %}

{% block content %}
  <!-- BLOCK CONTENT SUPPRESSED FOR BREVITY'S SAKE -->
{% endblock %}
{% endraw %}
{% endhighlight %}

Let's explore the JavaScript snippet in great detail:

This is a jQuery shortcut to tell the browser to wait for all the HTML be rendered before executing the code:

{% highlight javascript %}
$(function () {
  ...
});
{% endhighlight %}

Here we are hooking into the click event of the element with class **js-create-book**, which is our Add book button.

{% highlight javascript %}
$(".js-create-book").click(function () {
  ...
});
{% endhighlight %}

When the user clicks in the **js-create-book** button, this anonymous function with the **$.ajax** call will be
executed:

{% highlight javascript %}
$.ajax({
  url: '/books/create/',
  type: 'get',
  dataType: 'json',
  beforeSend: function () {
    $("#modal-book").modal("show");
  },
  success: function (data) {
    $("#modal-book .modal-content").html(data.html_form);
  }
});
{% endhighlight %}

Now, what is this ajax request saying to the browser:

*Hey, the resource I want is in this path*:

{% highlight javascript %}
url: '/books/create/',
{% endhighlight %}

*Make sure you request my data using the HTTP GET method:*

{% highlight javascript %}
type: 'get',
{% endhighlight %}

*Oh, by the way, I want to receive the data in JSON format:*
{% highlight javascript %}
dataType: 'json',
{% endhighlight %}

*But just before you communicate with the server, please execute this code:*

{% highlight javascript %}
beforeSend: function () {
  $("#modal-book").modal("show");
},
{% endhighlight %}

(This will open the Bootstrap Modal before the Ajax request starts.)

*And right after you receive the data (in the data variable), execute this code:*

{% highlight javascript %}
success: function (data) {
  $("#modal-book .modal-content").html(data.html_form);
}
{% endhighlight %}

(This will render the partial form defined in the **partial_book_create.html** template.)

Let's have a look on what we have so far:

![Books Add Button](/media/2016/11/books2.png)

Then when the user clicks the button:

![Books Modal](/media/2016/11/books3.png)

Great stuff. The book form is being rendered asynchronously. But it is not doing much at the moment. Good news is that
the structure is ready, now it is a matter of playing with the data.

Let's implement now the form submission handling.

First let's improve the **book_create** view function:

**views.py**

{% highlight python %}
def book_create(request):
    data = dict()

    if request.method == 'POST':
        form = BookForm(request.POST)
        if form.is_valid():
            form.save()
            data['form_is_valid'] = True
        else:
            data['form_is_valid'] = False
    else:
        form = BookForm()

    context = {'form': form}
    data['html_form'] = render_to_string('books/includes/partial_book_create.html',
        context,
        request=request
    )
    return JsonResponse(data)
{% endhighlight %}

**partial_book_create.html**

{% highlight django %}
{% raw %}
{% load widget_tweaks %}

<form method="post" action="{% url 'book_create' %}" class="js-book-create-form">
  <!-- FORM CONTENT SUPPRESSED FOR BREVITY'S SAKE -->
</form>
{% endraw %}
{% endhighlight %}

I added the **action** attribute to tell the browser to where it should send the submission and the class
**js-book-create-form** for us to use in the JavaScript side, hooking on the form submit event.

**books.js**

{% highlight javascript %}
  $("#modal-book").on("submit", ".js-book-create-form", function () {
    ...
  });
{% endhighlight %}

The way we are listening to the **submit** event is a little bit different from what we have implemented before. That's
because the element with class **.js-book-create-form** didn't exist on the initial page load of the **book_list.html**
template. So we can't register a listener to an element that doesn't exists.

A work around is to register the listener to an element that will always exist in the page context. The **#modal-book**
is the closest element. It is a little bit more complex what happen, but long story short, the HTML events propagate
to the parents elements until it reaches the end of the document.

Hooking to the **body** element would have the same effect, but it would be slightly worst, because it would have to
travel through several HTML elements before reaching it. So always pick the closest one.

Now the actual function:

**books.js**

{% highlight javascript %}
  $("#modal-book").on("submit", ".js-book-create-form", function () {
    var form = $(this);
    $.ajax({
      url: form.attr("action"),
      data: form.serialize(),
      type: form.attr("method"),
      dataType: 'json',
      success: function (data) {
        if (data.form_is_valid) {
          alert("Book created!");  // <-- This is just a placeholder for now for testing
        }
        else {
          $("#modal-book .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  });
{% endhighlight %}

A very important detail here: in the end of the function we are returning **false**. That's because we are capturing
the form submission event. So to avoid the browser to perform a full HTTP POST to the server, we cancel the default
behavior returning false in the function.

So, what we are doing here:

{% highlight javascript %}
var form = $(this);
{% endhighlight %}

In this context, `this` refers to the element with class `.js-book-create-form`. Which is the element that fired
the submit event. So when we select `$(this)` we are selecting the actual form.

{% highlight javascript %}
url: form.attr("action"),
{% endhighlight %}

Now I'm using the form attributes to build the Ajax request. The **action** here refers to the **action** attribute in
the **form**, which translates to `/books/create/`.

{% highlight javascript %}
data: form.serialize(),
{% endhighlight %}

As the name suggests, we are serializing all the data from the form, and posting it to the server. The rest follows
the same concepts as I explained before.

Before we move on, let's have a look on what we have so far.

The user fills the data:

![New Book](/media/2016/11/books4.png)

The user clicks on the **Create book** button:

![New Book](/media/2016/11/books5.png)

The data was invalid. No hard refresh no anything. Just this tiny part changed with the validation. This is what
happened:

1. The form was submitted via Ajax
2. The view function processed the form
3. The form data was invalid
4. The view function rendered the invalid stated to the `data['html_form']`, using the **render_to_string**
5. The Ajax request returned to the JavaScript function
6. The Ajax **success** callback was executed, replacing the contents of the modal with the new `data['html_form']`

Please note that the Ajax **success** callback:

{% highlight javascript %}
$.ajax({
  // ...
  success: function (data) {
    // ...
  }
});
{% endhighlight %}

Refers to the status of the **HTTP Request**, which has nothing to do with the status of your form, or whether the form
was successfully processed or not. It only means that the **HTTP Request** returned a status **200** for example.

Let's fix the **publication date** value and submit the form again:

![New Book](/media/2016/11/books6.png)

There we go, the **alert** tells us that the form was successfully processed and hopefully it was created in the
database.

{% highlight javascript %}
success: function (data) {
  if (data.form_is_valid) {
    alert("Book created!");  // <-- This line was executed! Means success
  }
  else {
    $("#modal-book .modal-content").html(data.html_form);
  }
}
{% endhighlight %}

It is not 100% what we want, but we are getting close. Let's refresh the screen and see if the new book shows in the
table:

![Book List](/media/2016/11/books7.png)

Great. We are getting there.

What we want to do now: after the success form processing, we want to close the bootstrap modal *and* update the table
with the newly created book. For that matter we will extract the body of the table to a external partial template,
and we will return the new table body in the Ajax success callback.

Watch that:

**book_list.html**

{% highlight django %}
{% raw %}
<table class="table" id="book-table">
  <thead>
    <tr>
      <th>#</th>
      <th>Title</th>
      <th>Author</th>
      <th>Type</th>
      <th>Publication date</th>
      <th>Pages</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    {% include 'books/includes/partial_book_list.html' %}
  </tbody>
</table>
{% endraw %}
{% endhighlight %}

**partial_book_list.html**

{% highlight django %}
{% raw %}
{% for book in books %}
  <tr>
    <td>{{ book.id }}</td>
    <td>{{ book.title }}</td>
    <td>{{ book.author }}</td>
    <td>{{ book.get_book_type_display }}</td>
    <td>{{ book.publication_date }}</td>
    <td>{{ book.pages }}</td>
    <td>{{ book.price }}</td>
  </tr>
{% empty %}
  <tr>
    <td colspan="7" class="text-center bg-warning">No book</td>
  </tr>
{% endfor %}
{% endraw %}
{% endhighlight %}

Now we can reuse the **partial_book_list.html** snippet without repeating ourselves.

Next step: **book_create** view function.

**views.py**

{% highlight python %}
def book_create(request):
    data = dict()

    if request.method == 'POST':
        form = BookForm(request.POST)
        if form.is_valid():
            form.save()
            data['form_is_valid'] = True
            books = Book.objects.all()
            data['html_book_list'] = render_to_string('books/includes/partial_book_list.html', {
                'books': books
            })
        else:
            data['form_is_valid'] = False
    else:
        form = BookForm()

    context = {'form': form}
    data['html_form'] = render_to_string('books/includes/partial_book_create.html',
        context,
        request=request
    )
    return JsonResponse(data)
{% endhighlight %}

A proper success handler in the JavaScript side:

**books.js**

{% highlight javascript %}
  $("#modal-book").on("submit", ".js-book-create-form", function () {
    var form = $(this);
    $.ajax({
      url: form.attr("action"),
      data: form.serialize(),
      type: form.attr("method"),
      dataType: 'json',
      success: function (data) {
        if (data.form_is_valid) {
          $("#book-table tbody").html(data.html_book_list);  // <-- Replace the table body
          $("#modal-book").modal("hide");  // <-- Close the modal
        }
        else {
          $("#modal-book .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  });
{% endhighlight %}

Sweet. It's working!

***

#### Edit Book

As you can expect, this will be very similar to what we did on the Create Book section. Except we will need to pass
the ID of the book we want to edit. The rest should be somewhat the same. We will be reusing several parts of the code.

**urls.py**:

{% highlight python %}
from django.conf.urls import url, include
from mysite.books import views

urlpatterns = [
    url(r'^books/$', views.book_list, name='book_list'),
    url(r'^books/create/$', views.book_create, name='book_create'),
    url(r'^books/(?P<pk>\d+)/update/$', views.book_update, name='book_update'),
]

{% endhighlight %}

Now we refactor the **book_create** view to reuse its code in the **book_update** view:

**views.py**

{% highlight python %}
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.template.loader import render_to_string

from .models import Book
from .forms import BookForm


def save_book_form(request, form, template_name):
    data = dict()
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            data['form_is_valid'] = True
            books = Book.objects.all()
            data['html_book_list'] = render_to_string('books/includes/partial_book_list.html', {
                'books': books
            })
        else:
            data['form_is_valid'] = False
    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)


def book_create(request):
    if request.method == 'POST':
        form = BookForm(request.POST)
    else:
        form = BookForm()
    return save_book_form(request, form, 'books/includes/partial_book_create.html')


def book_update(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if request.method == 'POST':
        form = BookForm(request.POST, instance=book)
    else:
        form = BookForm(instance=book)
    return save_book_form(request, form, 'books/includes/partial_book_update.html')
{% endhighlight %}

Basically the view functions **book_create** and **book_update** are responsible for receiving the request, preparing
the form instance and passing it to the **save_book_form**, along with the name of the template to use in the rendering
process.

Next step is to create the **partial_book_update.html** template. Similar to what we did with the view functions, we
will also refactor the **partial_book_create.html** to reuse some of the code.

**partial_book_form.html**

{% highlight django %}
{% raw %}
{% load widget_tweaks %}

{% for field in form %}
  <div class="form-group{% if field.errors %} has-error{% endif %}">
    <label for="{{ field.id_for_label }}">{{ field.label }}</label>
    {% render_field field class="form-control" %}
    {% for error in field.errors %}
      <p class="help-block">{{ error }}</p>
    {% endfor %}
  </div>
{% endfor %}
{% endraw %}
{% endhighlight %}

**partial_book_create.html**

{% highlight django %}
{% raw %}
<form method="post" action="{% url 'book_create' %}" class="js-book-create-form">
  {% csrf_token %}
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <h4 class="modal-title">Create a new book</h4>
  </div>
  <div class="modal-body">
    {% include 'books/includes/partial_book_form.html' %}
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <button type="submit" class="btn btn-primary">Create book</button>
  </div>
</form>
{% endraw %}
{% endhighlight %}

**partial_book_update.html**

{% highlight django %}
{% raw %}
<form method="post" action="{% url 'book_update' form.instance.pk %}" class="js-book-update-form">
  {% csrf_token %}
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <h4 class="modal-title">Update book</h4>
  </div>
  <div class="modal-body">
    {% include 'books/includes/partial_book_form.html' %}
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <button type="submit" class="btn btn-primary">Update book</button>
  </div>
</form>
{% endraw %}
{% endhighlight %}

This is good enough. Now we gotta add an edit button to trigger the action.

**partial_book_list.html**

{% highlight django %}
{% raw %}
{% for book in books %}
  <tr>
    <td>{{ book.id }}</td>
    <td>{{ book.title }}</td>
    <td>{{ book.author }}</td>
    <td>{{ book.get_book_type_display }}</td>
    <td>{{ book.publication_date }}</td>
    <td>{{ book.pages }}</td>
    <td>{{ book.price }}</td>
    <td>
      <button type="button"
              class="btn btn-warning btn-sm js-update-book"
              data-url="{% url 'book_update' book.id %}">
        <span class="glyphicon glyphicon-pencil"></span> Edit
      </button>
    </td>
  </tr>
{% empty %}
  <tr>
    <td colspan="8" class="text-center bg-warning">No book</td>
  </tr>
{% endfor %}
{% endraw %}
{% endhighlight %}

The class **js-update-book** will be used to start the edit process. Now note that I also added an extra HTML attribute
named **data-url**. This is the URL that will be used to create the ajax request dynamically.

Take the time and refactor the **js-create-book** button to also use the **data-url** strategy, so we can extract
the hard-coded URL from the Ajax request.

**book_list.html**

{% highlight django %}
{% raw %}
{% extends 'base.html' %}

{% block content %}
  <h1 class="page-header">Books</h1>

  <p>
    <button type="button"
            class="btn btn-primary js-create-book"
            data-url="{% url 'book_create' %}">
      <span class="glyphicon glyphicon-plus"></span>
      New book
    </button>
  </p>

  <!-- REST OF THE PAGE... -->

{% endblock %}
{% endraw %}
{% endhighlight %}


**books.js**

{% highlight javascript %}
$(".js-create-book").click(function () {
  var btn = $(this);  // <-- HERE
  $.ajax({
    url: btn.attr("data-url"),  // <-- AND HERE
    type: 'get',
    dataType: 'json',
    beforeSend: function () {
      $("#modal-book").modal("show");
    },
    success: function (data) {
      $("#modal-book .modal-content").html(data.html_form);
    }
  });
});
{% endhighlight %}

Next step is to create the edit functions. The thing is, they are pretty much the same as the create. So, basically
what we want to do is to extract the anonymous functions that we are using, and reuse them in the edit buttons and
forms. Check it out:

**books.js**

{% highlight javascript %}
$(function () {

  /* Functions */

  var loadForm = function () {
    var btn = $(this);
    $.ajax({
      url: btn.attr("data-url"),
      type: 'get',
      dataType: 'json',
      beforeSend: function () {
        $("#modal-book").modal("show");
      },
      success: function (data) {
        $("#modal-book .modal-content").html(data.html_form);
      }
    });
  };

  var saveForm = function () {
    var form = $(this);
    $.ajax({
      url: form.attr("action"),
      data: form.serialize(),
      type: form.attr("method"),
      dataType: 'json',
      success: function (data) {
        if (data.form_is_valid) {
          $("#book-table tbody").html(data.html_book_list);
          $("#modal-book").modal("hide");
        }
        else {
          $("#modal-book .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  };


  /* Binding */

  // Create book
  $(".js-create-book").click(loadForm);
  $("#modal-book").on("submit", ".js-book-create-form", saveForm);

  // Update book
  $("#book-table").on("click", ".js-update-book", loadForm);
  $("#modal-book").on("submit", ".js-book-update-form", saveForm);

});

{% endhighlight %}

Let's have a look on what we have so far.

![Book Edit](/media/2016/11/books8.png)

The user clicks in the edit button.

![Book Edit](/media/2016/11/books9.png)

Changes some data like the title of the book and hit the **Update book** button:

![Book Edit](/media/2016/11/books10.png)

Cool! Now just the delete and we are done.

***

#### Delete Book

**urls.py**:

{% highlight python %}
from django.conf.urls import url, include
from mysite.books import views

urlpatterns = [
    url(r'^books/$', views.book_list, name='book_list'),
    url(r'^books/create/$', views.book_create, name='book_create'),
    url(r'^books/(?P<pk>\d+)/update/$', views.book_update, name='book_update'),
    url(r'^books/(?P<pk>\d+)/delete/$', views.book_delete, name='book_delete'),
]

{% endhighlight %}

**views.py**

{% highlight python %}
def book_delete(request, pk):
    book = get_object_or_404(Book, pk=pk)
    data = dict()
    if request.method == 'POST':
        book.delete()
        data['form_is_valid'] = True  # This is just to play along with the existing code
        books = Book.objects.all()
        data['html_book_list'] = render_to_string('books/includes/partial_book_list.html', {
            'books': books
        })
    else:
        context = {'book': book}
        data['html_form'] = render_to_string('books/includes/partial_book_delete.html',
            context,
            request=request,
        )
    return JsonResponse(data)
{% endhighlight %}

**partial_book_delete.html**

{% highlight django %}
{% raw %}
<form method="post" action="{% url 'book_delete' book.id %}" class="js-book-delete-form">
  {% csrf_token %}
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <h4 class="modal-title">Confirm book deletion</h4>
  </div>
  <div class="modal-body">
    <p class="lead">Are you sure you want to delete the book <strong>{{ book.title }}</strong>?</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <button type="submit" class="btn btn-danger">Delete book</button>
  </div>
</form>
{% endraw %}
{% endhighlight %}

**partial_book_list.html**

{% highlight django %}
{% raw %}
{% for book in books %}
  <tr>
    <td>{{ book.id }}</td>
    <td>{{ book.title }}</td>
    <td>{{ book.author }}</td>
    <td>{{ book.get_book_type_display }}</td>
    <td>{{ book.publication_date }}</td>
    <td>{{ book.pages }}</td>
    <td>{{ book.price }}</td>
    <td>
      <button type="button"
              class="btn btn-warning btn-sm js-update-book"
              data-url="{% url 'book_update' book.id %}">
        <span class="glyphicon glyphicon-pencil"></span> Edit
      </button>
      <button type="button"
              class="btn btn-danger btn-sm js-delete-book"
              data-url="{% url 'book_delete' book.id %}">
        <span class="glyphicon glyphicon-trash"></span> Delete
      </button>
    </td>
  </tr>
{% empty %}
  <tr>
    <td colspan="8" class="text-center bg-warning">No book</td>
  </tr>
{% endfor %}
{% endraw %}
{% endhighlight %}

**books.js**

{% highlight javascript %}
// Delete book
$("#book-table").on("click", ".js-delete-book", loadForm);
$("#modal-book").on("submit", ".js-book-delete-form", saveForm);
{% endhighlight %}

And the result will be:

![Book Delete](/media/2016/11/books11.png)

The user clicks in a Delete button:

![Book Delete](/media/2016/11/books12.png)

The user confirm the deletion, and the table in the background is refreshed:

![Book Delete](/media/2016/11/books13.png)

***

#### Conclusions

I decided to use function-based views in this example because they are easier to read and use less configuration-magic
that could distract those who are learning Django.

I tried to bring as much detail as I could and discuss about some of the code design decisions. If anything is not
clear to you, or you want to suggest some improvements, feel free to leave a comment! I would love to hear your
thoughts.

The code is available on GitHub: [github.com/sibtc/simple-ajax-crud](https://github.com/sibtc/simple-ajax-crud){:target="_blank"},
so you can try it locally. It's very straightforward to get it running.
