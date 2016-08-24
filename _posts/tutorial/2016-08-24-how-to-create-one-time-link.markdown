---
title: "How to Create a One Time Link"
date: 2016-08-24 22:18:00 +0300
category: tutorial
tags: django security
thumbnail: "/media/2016/08/featured-one-time-link.jpg"
featured_image: "/media/2016/08/featured-one-time-link.jpg"
---

Django uses a very interesting approach to generate the Password reset tokens. I'm not really a security expert,
neither I'm very familiar with cryptography algorithms, but it is very safe and reliable.

Before I elaborate a little be more on the one-time-link generation, I wanted to discuss about the Django's
`PasswordResetTokenGenerator` implementation. Because what we will be doing is actually extending this particular
class to fit our needs.

Generally speaking, Django generate a token without persisting it in the database. Yet, it still have the capabilities
of determining whether a given token is valid or not. Also the token is only valid for a defined number of days.

The default value for the Password Reset Token is 7 days, and it can be changed in the **settings.py** by changing the
value of `PASSWORD_RESET_TIMEOUT_DAYS`.

The class have two public methods:

* make_token(user)
* check_token(user, token)

The **make_token** method will generate a hash value with user related data that _will change_ after the password
reset. Meaning, after the user clicks on the link with the hash and proceed to the password reset, the link (or the
hash) will no longer be valid:

{% highlight python %}
def _make_hash_value(self, user, timestamp):
    # Ensure results are consistent across DB backends
    login_timestamp = '' if user.last_login is None else user.last_login.replace(microsecond=0, tzinfo=None)
    return (
        six.text_type(user.pk) + user.password +
        six.text_type(login_timestamp) + six.text_type(timestamp)
    )
{% endhighlight %}

And then this hash value is used to create a hash that will be mailed to the user:

{% highlight python %}
    def _make_token_with_timestamp(self, user, timestamp):
        # timestamp is number of days since 2001-1-1.  Converted to
        # base 36, this gives us a 3 digit string until about 2121
        ts_b36 = int_to_base36(timestamp)

        hash = salted_hmac(
            self.key_salt,
            self._make_hash_value(user, timestamp),
        ).hexdigest()[::2]
        return "%s-%s" % (ts_b36, hash)
{% endhighlight %}

So, two things: it is using the `user.password` salt and `user.last_login` timestamp. Both will change and the link
will no longer be valid. Also the `SECRET_KEY` is used in the `salted_hmac` function. So unless your `SECRET_KEY` was
compromised, it would be impossible to reproduce the hash value.

***

#### Creating your own token

So, basically you will need an information that will change after using the link. The simplest approach would be:


{% highlight python %}
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import six

class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk) + six.text_type(timestamp) +
            six.text_type(user.profile.email_confirmed)
        )

account_activation_token = AccountActivationTokenGenerator()
{% endhighlight %}

I'm pretending we have an User model with a Profile model through a One-to-One relationship. And then in this profile
model we have an boolean flag named `email_confirmed`.

In order to use it, we could use the same approach as the password reset:

**urls.py**

{% highlight python %}
url(r'^activate_account/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
                views.ActivateAccountView.as_view(), name='activate_account'),
{% endhighlight %}

**views.py**

{% highlight python %}
from django.contrib.auth import login
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode

class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.profile.email_confirmed = True
            user.save()
            login(request, user)
            return redirect('profile')
        else:
            # invalid link
            return render(request, 'registration/invalid.html')
{% endhighlight %}

***

Of course there are cases and cases. Sometimes will be just way easier to generate a random token and save it in the
database and simply check it and invalidate after it is "used". But, if that's not the case, you can inspire yourself
on how Django implements the Password Reset Token.

[tokens]: https://github.com/django/django/blob/master/django/contrib/auth/tokens.py