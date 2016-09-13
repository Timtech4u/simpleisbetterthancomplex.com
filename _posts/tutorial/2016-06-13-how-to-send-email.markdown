---
layout: post
title: "How to Send Email in a Django App"
date: 2016-06-13
date_modified: 2016-09-13 11:10:00 +0300
author: Vitor Freitas
tags: django email sendgrid
category: tutorial
thumbnail: "/media/2016-06-13-how-to-send-email/featured-post-image.jpg"
featured_image: "/media/2016-06-13-how-to-send-email/featured-post-image.jpg"
featured_image_source: "https://www.flickr.com/photos/fotodispalle/14230749736/"
---

Sending emails with Django is a really easy task. In this short tutorial I will guide you through the necessary steps
to set up your Django Application to start sending emails right away.

The most common use case for sending emails in a Django Application are for password reset, account activation and
sending general notifications related to your app.

Django also provides mechanisms to send error reports via email. In the beginning it is great. But after a while you
will realize that it can get pretty spammy. Specially if your application has a high traffic.

***

#### Requirements

To start sending transactional emails you will need:

* A registered domain
* An email service

You can pretty much use any email service using SMTP, even a Gmail account. Usually it is not a good idea, because the
Gmail service was designed to be used as a personal email account, so it does not expect you to send many emails in a
short period of time. But just for testing it is absolutely fine. Even though there is better options to test the
emails your application sends in the development environment.

So, for this tutorial we will be using the free [SendGrid][sendgrid] plan, which gives you 12.000 free emails per
month. It should be enough for you to get started.

***

#### Get a SendGrid account

Go ahead and create a free SendGrid account. In the homepage should have a **Try Free** button:

![SendGrid Try Free]({{ "/media/2016-06-13-how-to-send-email/sendgrid-free-account.png" | prepend: site.baseurl }} "SendGrid Try Free")

After creating your account, you should activate it clicking on the link they send via email to confirm your email
address. New accounts usually starts in provisioning mode. It should not take so long for them to release your account.

***

#### Set up a domain on SendGrid

Logged in your SendGrid account, go to the Dashboard and find the menu:

`Settings > Whitelabels > Domains`

![SendGrid - Settings > Whitelabels > Domains]({{ "/media/2016-06-13-how-to-send-email/sendgrid-menu.png" | prepend: site.baseurl }} "SendGrid - Settings > Whitelabels > Domains")

Click on **Add Whitelabel**:

![SendGrid - Add Whitelabel]({{ "/media/2016-06-13-how-to-send-email/sendgrid-add-whitelabel.png" | prepend: site.baseurl }} "SendGrid - Add Whitelabel")

Click on **+ Use New Domain**:

![SendGrid - Use New Domain]({{ "/media/2016-06-13-how-to-send-email/sendgrid-add-new-domain.png" | prepend: site.baseurl }} "SendGrid - Use New Domain")

Add a subdomain and the domain you want to use to send emails and hit the **Save** button:

![SendGrid - Save New Domain]({{ "/media/2016-06-13-how-to-send-email/sendgrid-save-new-domain.png" | prepend: site.baseurl }} "SendGrid - Save New Domain")

After saving the new register, you should see something like the picture below:

![SendGrid - Validate Domain]({{ "/media/2016-06-13-how-to-send-email/sendgrid-init-validate-process.png" | prepend: site.baseurl }} "SendGrid - Validate Domain")

The following steps depends on where you have registered your domain. In my case, I have used the
[iwantmyname][iwantmyname] service.

Basically you will need to create three `CNAME` records in the DNS management of your domain, using the provided
values:

![iwantmyname - DNS Setup]({{ "/media/2016-06-13-how-to-send-email/iwantmyname-dns-setup.png" | prepend: site.baseurl }} "iwantmyname - DNS Setup")

Note that the DNS management will already append the `parsifal.co` part of the value. So instead of putting
`s1._domainkey.parsifal.co` in the host, use just `s1._domainkey`, like in the example above.

Now after creating the three `CNAME` records, click on the **Validate Record** button on SendGrid:

![SendGrid - Validate Record]({{ "/media/2016-06-13-how-to-send-email/sendgrid-validate-record.png" | prepend: site.baseurl }} "SendGrid - Validate Record")

If you did everything correctly, you should now see some green ticks:

![SendGrid - Validated Domain]({{ "/media/2016-06-13-how-to-send-email/sendgrid-validated-domain.png" | prepend: site.baseurl }} "SendGrid - Validated Domain")

***

#### Create a new credential on SendGrid

Go to the Dashboard and find the menu:

`Settings > Credentials`:

![SendGrid - Credentials Menu]({{ "/media/2016-06-13-how-to-send-email/sendgrid-credentials-menu.png" | prepend: site.baseurl }} "SendGrid - Credentials Menu")

Click on the **Add New Credential** button:

![SendGrid - Add New Credential]({{ "/media/2016-06-13-how-to-send-email/sendgrid-add-new-credential.png" | prepend: site.baseurl }} "SendGrid - Add New Credential")

Create an **username** and **password** and click on the **mail** option and click on the **Create Credential** button:

![SendGrid - New Credential]({{ "/media/2016-06-13-how-to-send-email/sendgrid-new-credential.png" | prepend: site.baseurl }} "SendGrid - New Credential")

We are now all set up to start sending emails:

![SendGrid - Credential Created]({{ "/media/2016-06-13-how-to-send-email/sendgrid-credential-created.png" | prepend: site.baseurl }} "SendGrid - Credential Created")

***

#### Configuring Django to send emails

To configure you Django App, add the following parameters to your `settings.py`:

{% highlight python %}
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'parsifal_app'
EMAIL_HOST_PASSWORD = 'mys3cr3tp4ssw0rd'
EMAIL_USE_TLS = True
{% endhighlight %}

Note that we have some sensitive informations here, such as the `EMAIL_HOST_PASSWORD`. You should not put it directly
to your `settings.py` file or commit it to a public repository. Instead use environment variables or use the Python
library [Python Decouple][python-decouple]. I have also written a
[tutorial on how to use Python Decouple][python-decouple-tutorial].

***

#### Sending emails in your Django Application

Here is a very simple snippet to send an email:

{% highlight python %}
from django.core.mail import send_mail

send_mail('subject', 'body of the message', 'noreply@parsifal.co', ['vitorfs@gmail.com'])
{% endhighlight %}

And here is how the email will look like, displaying properly your domain:

![Email Sent]({{ "/media/2016-06-13-how-to-send-email/email.png" | prepend: site.baseurl }} "Email Sent")

***

#### Basic Django Email Functions

Django implements a module on top of Python's `smtplib`, offering some very convenient functions, detailed below.
The module is available at `django.core.mail`.

##### send_mail()

This is the simpliest way to send emails. It uses the following parameters:

* **subject**: A string;
* **message**: A string;
* **from_email**: A string;
* **recipient_list**: A list of strings;
* **fail_silently**: A boolean;
* **auth_user**: The optional username to use to authenticate to the SMTP server;
* **auth_password**: The optional password to use to authenticate to the SMTP server;
* **connection**: The optional email backend to use to send the mail;
* **html_message**: An optional string containg the messsage in HTML format.

The return value will be the number of successfully delivered messages (which can be 0 or 1 since it can only send one message).


##### send_mass_mail()

A function to handle mass emailing. It uses the following parameters:

* **datatuple**: is a tuple in which each element is in this format:
    * `(subject, message, from_email, recipient_list)`
* **fail_silently**: A boolean;
* **auth_user**: The optional username to use to authenticate to the SMTP server;
* **auth_password**: The optional password to use to authenticate to the SMTP server;
* **connection**: The optional email backend to use to send the mail.

Example:

{% highlight python %}
message1 = ('Subject here', 'Here is the message', 'from@example.com', ['first@example.com', 'other@example.com'])
message2 = ('Another Subject', 'Here is another message', 'from@example.com', ['second@test.com'])
send_mass_mail((message1, message2), fail_silently=False)
{% endhighlight %}

The return value will be the number of successfully delivered messages.

***

In this tutorial we went through the most important steps into configuring a email service in a Django Application.
There is many other configuration options and built-in functions. If you want to learn more, have a look
on the official [Django Documentation about Sending Email][django-docs-email].

If you have any questions, leave a comment here and I will be glad to answer!

[sendgrid]: https://sendgrid.com
[iwantmyname]: https://www.iwantmyname.com
[python-decouple]: https://pypi.python.org/pypi/python-decouple
[python-decouple-tutorial]: /2015/11/26/package-of-the-week-python-decouple.html
[django-docs-email]: https://docs.djangoproject.com/en/dev/topics/email/
