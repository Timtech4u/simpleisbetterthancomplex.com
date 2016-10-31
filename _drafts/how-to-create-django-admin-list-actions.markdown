---
title: "How to Create Django Admin List Actions"
category: tutorial
tags:
  - django
  - django admin
---

Django Admin list actions are meant to be used to perform operations in bulk. All Django Admin list views already come
with a default action "Delete selected &lt;ModelName&gt;s". In this short tutorial I will guide you through the steps
to create your own list actions.

![List Actions](/media/2016/10/list-actions.png)

***

#### Creating the Action Function

Each action in the action list is a regular Python function that takes three parameters: the current **ModelAdmin**,
a **HttpRequest** object (just like a view function) and a **QuerySet**, which is the list of selected model instances.

Those **Action Functions** can live inside the **admin.py** module of your app. But if they start to get really big,
you can define them outside the **admin.py**.

Following is the skeleton for a **Action Function**:

{% highlight python %}
def my_admin_action(modeladmin, request, queryset):
    # do something with the queryset

my_admin_action.short_description = 'My admin action'
{% endhighlight %}

***

#### Export to CSV Example

Let's say we want to export the selected