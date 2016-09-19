---
title: "How to Create a Password Reset View"
date: 2016-09-19 21:26:00 +0300
category: tutorial
tags: django auth contrib password
thumbnail: "/media/2016/09/featured-reset.jpg"
featured_image: "/media/2016/09/featured-reset.jpg"
featured_image_source: "https://www.pexels.com/photo/man-notebook-notes-macbook-7063/"
---

For this short tutorial we will be using the `django.contrib.auth` views to add a password reset functionality to your
Django application. The process of reseting passwords involves sending emails. For that matter we will be using console
email backend to debug and check if everything is working. In the end of this tutorial I will also provide resources
to properly configure a prodution-quality email server.

***

#### Dependencies

Basically all you need is to have `django.contrib.auth` in your `INSTALLED_APPS` and a email service properly
configurated (for production). During the development we can use file/console email backend.

**settings.py**

{% highlight python %}
INSTALLED_APPS = [
    ...
    'django.contrib.auth',
]

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # During development only

{% endhighlight %}

***

#### Implementing

We need 4 different views:

1. **password_reset**: Form where the user submit the email address
2. **password_reset_done**: Page displayed to the user after submitting the email form. Usually with instructions to
open the email account, look in the spam folder etc. And asking for the user to click on the link he will receive.
3. **password_reset_confirm**: The link that was emailed to the user. This view will validate the token and display a
password form if the token is valid or an error message if the token is invalid (e.g. was already used or expired).
4. **password_reset_complete**: Page displayed to the user after the password was successfully changed.

**urls.py**

{% highlight python %}
from django.contrib.auth import views as auth_views

urlpatterns = [
    ...
    url(r'^password_reset/$', auth_views.password_reset, name='password_reset'),
    url(r'^password_reset/done/$', auth_views.password_reset_done, name='password_reset_done'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.password_reset_confirm, name='password_reset_confirm'),
    url(r'^reset/done/$', auth_views.password_reset_complete, name='password_reset_complete'),
]

{% endhighlight %}

Or you can simply include all auth views:

{% highlight python %}
urlpatterns = [
    url('^', include('django.contrib.auth.urls')),
]
{% endhighlight %}

After including the routes in the project's url conf, now it is a matter of creating the templates. You won't need
to mess with views.

For convenience and to avoid adding extra parameter, create a folder named **registration** inside your **templates**
folder.

List of required templates:

* **registration/password_reset_form.html**
* **registration/password_reset_subject.txt**
* **registration/password_reset_email.html**
* **registration/password_reset_done.html**
* **registration/password_reset_confirm.html**
* **registration/password_reset_complete.html**


##### password_reset

**registration/password_reset_form.html**

{% highlight html %}
{% raw %}
{% extends 'base.html' %}

{% block content %}
  <h3>Forgot password</h3>
  <form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Submit</button>
  </form>
{% endblock %}
{% endraw %}
{% endhighlight %}

**registration/password_reset_subject.txt**

{% highlight txt %}
TestSite password reset
{% endhighlight %}

(It's just a one line file with the subject of the email that will be sent to the user).

* **registration/password_reset_email.html**

{% highlight html %}
{% raw %}
{% autoescape off %}
To initiate the password reset process for your {{ user.get_username }} TestSite Account,
click the link below:

{{ protocol }}://{{ domain }}{% url 'password_reset_confirm' uidb64=uid token=token %}

If clicking the link above doesn't work, please copy and paste the URL in a new browser
window instead.

Sincerely,
The TestSite Team
{% endautoescape %}
{% endraw %}
{% endhighlight %}

##### password_reset_done

**registration/password_reset_done.html**

{% highlight html %}
{% raw %}
{% extends 'base.html' %}

{% block content %}
  <p>
    We've emailed you instructions for setting your password, if an account exists with the email you entered.
    You should receive them shortly.
  </p>
  <p>
    If you don't receive an email, please make sure you've entered the address you registered with,
    and check your spam folder.
  </p>
{% endblock %}
{% endraw %}
{% endhighlight %}

##### password_reset_confirm

**registration/password_reset_confirm.html**

{% highlight html %}
{% raw %}
{% extends 'base.html' %}

{% block content %}
  {% if validlink %}
    <h3>Change password</h3>
    <form method="post">
      {% csrf_token %}
      {{ form.as_p }}
      <button type="submit">Change password</button>
    </form>
  {% else %}
    <p>
      The password reset link was invalid, possibly because it has already been used.
      Please request a new password reset.
    </p>
  {% endif %}
{% endblock %}
{% endraw %}
{% endhighlight %}

##### password_reset_complete

**registration/password_reset_complete.html**

{% highlight html %}
{% raw %}
{% extends 'base.html' %}

{% block content %}
  <p>
    Your password has been set. You may go ahead and <a href="{% url 'signin' %}">sign in</a> now.
  </p>
{% endblock %}
{% endraw %}
{% endhighlight %}


***

#### Testing the Views

**registration/password_reset_form.html**

![Password Reset]({{ "/media/2016/09/reset_1.png" | prepend: site.baseurl }})

**registration/password_reset_done.html**

![Password Reset]({{ "/media/2016/09/reset_2.png" | prepend: site.baseurl }})

The email sent using **registration/password_reset_subject.txt** and **registration/password_reset_email.html**.

![Password Reset]({{ "/media/2016/09/reset_3.png" | prepend: site.baseurl }})

**registration/password_reset_confirm.html**

![Password Reset]({{ "/media/2016/09/reset_4.png" | prepend: site.baseurl }})

**registration/password_reset_complete.html**

![Password Reset]({{ "/media/2016/09/reset_5.png" | prepend: site.baseurl }})


***

#### Configuring a SMTP Email Service

First remove the **EMAIL_BACKEND** from your **settings.py**, since it defaults to SMTP Email Backend.

Now add the information from your email provider:

**settings.py**

{% highlight python %}
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'testsite_app'
EMAIL_HOST_PASSWORD = 'mys3cr3tp4ssw0rd'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'TestSite Team <noreply@example.com>'
{% endhighlight %}

There are many transactional email services out there. SendGrid, MailGun, Mandrill. If you want to learn more about how
to configure a production-quality email service, I wrote a very detailed post about how to configure SendGrid using
Django:

[How to Send Email in a Django App][send-email]

[send-email]: /tutorial/2016/06/13/how-to-send-email.html