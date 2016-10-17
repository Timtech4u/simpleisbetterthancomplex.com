---
title: "Django Tips #18 Difference Between ugettext And ugettext_lazy"
date: 2016-10-17 23:30:00 +0300
tags: django i18n translations
category: tips
thumbnail: "/media/2016/10/featured-tip18.jpg"
featured_image: "/media/2016/10/featured-tip18.jpg"
---

The Django translation API provides several utility functions to help you translate your application. They are all
available in the `django.utils.translation` module. For the most cases you will be using `ugettext()` and
`ugettext_lazy()`.

The "u" prefix stands for "unicode", and usually it is a better idea to use `ugettext()` instead of `gettext()`, and
`ugettext_lazy()` instead of `gettext_lazy()`, since for the most part we will be working with international charsets.

As the name suggests, the "lazy" version of the function holds a reference to the translation string instead of the
actual translated text, so the translation occurs when the value is accessed rather than when they’re called.

It’s very important to pay attention to this details, because in a Django project there are several cases where the
code is only executed once (on Django startup). That happens with definition modules like models, forms and model
forms.

So, what would happen if you use `ugettext()` (instead of `ugettext_lazy()`) in a model definition (let’s say on field
labels):

1. Django starts up, the default language is english;
2. Django picks the english version of the field labels;
3. The user changes the website language to spanish;
4. The labels are still displayed in english (because the field definition is called only once; and by the time it was
called, the language was other).

To avoid this bahavior, you have to use properly the utility functions.

Here goes a summary of when to use `ugettext()` or `ugettext_lazy()`:

* **`ugettext_lazy():`**
  * models.py (fields, verbose_name, help_text, methods short_description);
  * forms.py (labels, help_text, empty_label);
  * apps.py (verbose_name).


* **`ugettext():`**
  * views.py
  * Other modules similar to view functions that are executed during the request process
