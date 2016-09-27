---
layout: post
title: "Django Tips #15 Using Mixins With Class-Based Views"
author: Vitor Freitas
date: 2016-09-27 20:49:00 +0300
tags: django views mixins
category: tips
thumbnail: "/media/2016/09/featured-mixins.jpg"
featured_image: "/media/2016/09/featured-mixins.jpg"
---

I was reading today the book **Two Scoops of Django** by Audrey and Daniel Roy Greenfeld and found some interesting
tips about using class-based views with mixins.

Some general rules to use mixins to compose your own view classes, as suggested by Kenneth Love, which I grabbed from
the above mentioned book:

1. The base view classes provided by Django _always_ go to the right;
2. Mixins go to the left of the base view;
3. Mixins should inherit from Python's built-in object type

Following an example to illustrate the rules:

{% highlight python %}
class FormMessageMixin(object):
    @property
    def form_valid_message(self):
        return NotImplemented

    form_invalid_message = 'Please correct the errors below.'

    def form_valid(self, form):
        messages.success(self.request, self.form_valid_message)
        return super(FormMessageMixin, self).form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, self.form_invalid_message)
        return super(FormMessageMixin, self).form_invalid(form)


class DocumentCreateView(FormMessageMixin, CreateView):
    model = Document
    fields = ('name', 'file')
    success_url = reverse_lazy('documents')
    form_valid_message = 'The document was successfully created!'
{% endhighlight %}

In a similar way you could reuse the same **FormMessageMixin** in a **UpdateView** for example, and also override
the default **form_invalid_message**:

{% highlight python %}
class DocumentUpdateView(FormMessageMixin, UpdateView):
    model = Document
    fields = ('name', )
    success_url = reverse_lazy('documents')
    form_valid_message = 'The document was successfully updated!'
    form_invalid_message = 'There are some errors in the form below.'
{% endhighlight %}

Since Django 1.9 we have the built-in mixins **LoginRequiredMixin** and **UserPassesTestMixin**. If you are using them
in your view classes, they should always go on the far left side, like below:

{% highlight python %}
class DocumentUpdateView(LoginRequiredMixin, FormMessageMixin, UpdateView):
    model = Document
    fields = ('name', )
    success_url = reverse_lazy('documents')
    form_valid_message = 'The document was successfully updated!'
{% endhighlight %}
