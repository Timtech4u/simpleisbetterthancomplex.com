---
layout: post
title: "Django Tips #14 Using the Messages Framework"
author: Vitor Freitas
date: 2016-09-06 16:51:00 +0300
tags: django contrib messages
category: tips
thumbnail: "/media/2016/09/featured-messages.jpg"
featured_image: "/media/2016/09/featured-messages.jpg"
---

Keeping the users of your application aware of what is going on makes a huge difference in the user experience. If
there is something users hate more than slow applications, it is applications that does not communicate with them.

-- The user clicks in a save button. <br>
-- Nothing happens. <br>
-- So, did it save the data or not? <br>
-- User reaction after a couple of (mili)seconds: _{% raw %}*Click!*{% endraw %}_ _{% raw %}*Click!*{% endraw %}_
_{% raw %}*Click!*{% endraw %}_ _{% raw %}*Click!*{% endraw %}_

Let's make our users more confident and comfortable, shall we?

***

#### Configuration

By default, a brand new Django project already comes with the messages framework installed. If you did not change
anything in relation to the messages framework, just skip to the next section. Otherwise, set it up:

* **INSTALLED_APPS**
  * `django.contrib.messages`
* **MIDDLEWARE** or **MIDDLEWARE_CLASSES** in older versions:
  * `django.contrib.sessions.middleware.SessionMiddleware`
  * `django.contrib.messages.middleware.MessageMiddleware`
* **TEMPLATES**
  * **context_processors**
    * `django.contrib.messages.context_processors.messages`

***

#### Message Levels and Tags

| Constant | Level | Tag&nbsp;(for&nbsp;CSS) | Purpose |
|----------|-------|---------------|---------|
| **DEBUG**    | 10    | debug         | Development-related messages that will be ignored (or removed) in a production deployment |
| **INFO**     | 20    | info          | Informational messages for the user |
| **SUCCESS**  | 25    | success       | An action was successful |
| **WARNING**  | 30    | warning       | A failure did not occur but may be imminent |
| **ERROR**    | 40    | error         | An action was not successful or some other failure occurred |

By default, Django will only display messages with level greater than 20 (**INFO**). If you want to display
**DEBUG** messages:

**settings.py**

{% highlight python %}
from django.contrib.messages import constants as message_constants
MESSAGE_LEVEL = message_constants.DEBUG
{% endhighlight %}

Or if you are running into circular imports, you can add the constant value directly:

{% highlight python %}
MESSAGE_LEVEL = 10  # DEBUG
{% endhighlight %}

***

#### Usage

You have two ways to use it. If you are using the built-in message levels (which more the most cases are more than
enough):

**views.py**

{% highlight python %}
from django.contrib import messages

@login_required
def password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            messages.success(request, 'Your password was updated successfully!')  # <-
            return redirect('settings:password')
        else:
            messages.warning(request, 'Please correct the error below.')  # <-
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'profiles/change_password.html', {'form': form})
{% endhighlight %}

And then in the template:

{% highlight html %}
{% raw %}
{% if messages %}
  <ul class="messages">
    {% for message in messages %}
      <li class="{{ message.tags }}">{{ message }}</li>
    {% endfor %}
  </ul>
{% endif %}
{% endraw %}
{% endhighlight %}

If the success message was added, the output would be something like that:

{% highlight html %}
{% raw %}
<ul class="messages">
  <li class="success">Your password was updated successfully!</li>
</ul>
{% endraw %}
{% endhighlight %}

You can also pass extra tags to the message:

{% highlight python %}
messages.success(request, 'Your password was updated successfully!', extra_tags='alert')
{% endhighlight %}

Output:

{% highlight html %}
{% raw %}
<ul class="messages">
  <li class="success alert">Your password was updated successfully!</li>
</ul>
{% endraw %}
{% endhighlight %}

Built-in methods:

{% highlight python %}
messages.debug(request, 'Total records updated {0}'.format(count))
messages.info(request, 'Improve your profile today!')
messages.success(request, 'Your password was updated successfully!')
messages.warning(request, 'Please correct the error below.')
messages.error(request, 'An unexpected error occured.')

# Or...

messages.add_message(request, messages.DEBUG, 'Total records updated {0}'.format(count))
messages.add_message(request, messages.INFO, 'Improve your profile today!')

# Useful to define custom levels:
CRITICAL = 50
messages.add_message(request, CRITICAL, 'A very serious error ocurred.')
{% endhighlight %}

***

#### Extra: Bootstrap Snippet

**messages.html**

{% highlight html %}
{% raw %}
{% for message in messages %}
  <div class="alert {% message.tags %} alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    {{ message }}
  </div>
{% endfor %}
{% endraw %}
{% endhighlight %}

**settings.py**

{% highlight python %}
from django.contrib.messages import constants as messages

MESSAGE_TAGS = {
    messages.DEBUG: 'alert-info',
    messages.INFO: 'alert-info',
    messages.SUCCESS: 'alert-success',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}
{% endhighlight %}

And then to use it, add **messages.html** to your **base.html** template:

**base.html**

{% highlight html %}
{% raw %}
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Simple is Better Than Complex</title>
  </head>
  <body>
    {% include 'partials/header.html' %}
    <main>
      <div class="container">
        {% include 'partials/messages.html' %}
        {% block content %}
        {% endblock %}
      </div>
    </main>
    {% include 'partials/footer.html' %}
  </body>
</html>
{% endraw %}
{% endhighlight %}
