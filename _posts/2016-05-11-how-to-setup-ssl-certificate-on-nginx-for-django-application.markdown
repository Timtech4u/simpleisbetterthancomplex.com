---
layout: post
title: "How to Setup a SSL Certificate on Nginx for a Django Application"
date: 2016-05-11
author: Vitor Freitas
tags: django nginx ssl ubuntu
category: tutorial
thumbnail: "/media/2016-05-11-how-to-setup-ssl-certificate-on-nginx-for-django-application/featured-post-image.jpg"
featured_image: "/media/2016-05-11-how-to-setup-ssl-certificate-on-nginx-for-django-application/featured-post-image.jpg"
featured_image_source: "http://www.lifeofpix.com/gallery/padlock/"
---

Serving a HTTPS only Django Application is very important to secure your users data. If your application have user
authentication it is already a good reason to start using HTTPS only. Otherwise usernames and passwords will be exposed
traveling over HTTP in plain text. Meaning if a user is using a public internet connection, and he logs in your
application, he is vulnerable to a sniffer attack.

It is important to not only secure login, password change and payment pages with HTTPS, but the whole application.
Otherwise you will be only protecting your user base only temporarily.

In this tutorial I will guide you through all the necessary steps to correctly secure your Django Application.

***

#### Getting a SSL Certificate

The first step is to get a SSL for your Django Application. There are a few options: you can generate your own
certificate, you can get a free one from [Let's Encrypt][letsencrypt]{:target="_blank"} or you can purchase one from the
many companies on the internet.

In this tutorial I will use a simple commercial SSL certificate by [Positive SSL][positivessl]{:target="_blank"} registered
from [Namecheap][namecheap]{:target="_blank"}.

***

#### Generate a CSR code

CSR stand for Certificate Signing Request and it is a base64 encoded data usually generated in the server-side.

Since we will be using Nginx for the web server, we will use openssl.

Usually CSR openssl configuration contains by default the details as follows below:

* Common Name (the domain name certificate should be issued for)
* Country
* State (or province)
* Locality (or city)
* Organization
* Organizational Unit (Department)
* E-mail address

To generate the CSR code run the following code in your server terminal:

{% highlight bash %}
openssl req -new -newkey rsa:2048 -nodes -keyout simpleacademy.key -out simpleacademy.csr
{% endhighlight %}

<div class="tip">
  <span class="fa fa-lightbulb-o"></span>
  <strong>Tip:</strong> Replace <strong>simpleacademy</strong> with the name of your domain.
</div>

After hitting enter you should see something like that:

{% highlight console %}
.............+++
....................................+++
writing new private key to 'simpleacademy.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:
{% endhighlight %}

You will be prompted a few questions:

{% highlight console %}
Country Name (2 letter code) [AU]:FI
State or Province Name (full name) [Some-State]:Oulu
Locality Name (eg, city) []:Oulu
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Simple is Better Than Complex
Organizational Unit Name (eg, section) []:IT
Common Name (e.g. server FQDN or YOUR name) []:simple.academy
Email Address []:admin@simpleisbetterthancomplex.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:samplepassword
An optional company name []:Simple is Better Than Complex
{% endhighlight %}

After answering all the questions, check if the files was created correctly:

{% highlight console %}
ubuntu@simpleacademy:~$ ls -l
total 8
-rw-rw-r-- 1 ubuntu ubuntu 1196 May 11 14:26 simpleacademy.csr
-rw-rw-r-- 1 ubuntu ubuntu 1704 May 11 14:26 simpleacademy.key
ubuntu@simpleacademy:~$
{% endhighlight %}

***

#### Activate the SSL Certificate

Grab the contents of the file `simpleacademy.csr` and paste it into the activation page:

![Activate SSL Certificate]({{ "/media/2016-05-11-how-to-setup-ssl-certificate-on-nginx-for-django-application/activate-certificate.png" | prepend: site.baseurl }} "Activate the SSL Certificate")

After submitting the data, you will be asked to confirm it. Now it is time to validate that you actually own the domain.
Usually there are three different ways to validate you own a domain: Email, HTTP-based or DNS-based. Pick the most
suitable option for you. In my case, DNS-based it is.

Visit the details page to get the instructions to create the CNAME (in case you have selected the DNS-based validation).

![Domain Control Validation]({{ "/media/2016-05-11-how-to-setup-ssl-certificate-on-nginx-for-django-application/dcv.png" | prepend: site.baseurl }} "Domain Control Validation")

Add a CNAME record with the given values:

![Create a CNAME record for DCV]({{ "/media/2016-05-11-how-to-setup-ssl-certificate-on-nginx-for-django-application/cname.png" | prepend: site.baseurl }} "Create a CNAME record for DCV")

<div class="tip">
  <span class="fa fa-lightbulb-o"></span>
  <strong>Tip:</strong> DNS-based method usually take a while to confirm. Prefer using Email or HTTP-based if possible.
</div>

***

#### Installing the SSL Certificate

After the activation process of your certificate, you should receive the necessary certificate files in your email address.
It comes usually in a .zip archive containing the files:

* simple_academy.crt
* simple_academy.ca-bundle

Concatenate the two files:

{% highlight console %}
cat simple_academy.crt simple_academy.ca-bundle >> simple_academy_cert_chain.crt
{% endhighlight %}

Upload those files to your server using `scp`:
{% highlight console %}
scp simple_academy_cert_chain.crt ubuntu@52.26.32.151:/home/ubuntu
{% endhighlight %}

Now you will need two files:

* simple_academy_cert_chain.crt
* simpleacademy.key (the key you genered while creating the CSR)

Copy both files to `/etc/ssl/`:

{% highlight console %}
sudo cp simpleacademy_cert_chain.crt /etc/ssl/
sudo cp simpleacademy.key /etc/ssl/
{% endhighlight %}

Edit your virtual hosts file:

{% highlight nginx %}
upstream simple_academy_server {
  server unix:/opt/simple_academy/run/gunicorn.sock fail_timeout=0;
}

# Redirect all non-encrypted to encrypted
server {
    server_name simple.academy;
    listen 80;
    return 301 https://simple.academy$request_uri;
}

server {
    server_name simple.academy;

    listen 443;  # <-

    ssl on;  # <-
    ssl_certificate /etc/ssl/simpleacademy_cert_chain.crt;  # <-
    ssl_certificate_key /etc/ssl/simpleacademy.key;  # <-

    client_max_body_size 4G;

    access_log /opt/simple_academy/logs/nginx-access.log;
    error_log /opt/simple_academy/logs/nginx-error.log;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;  # <-
        proxy_set_header Host $http_host;
        proxy_redirect off;

        if (!-f $request_filename) {
            proxy_pass http://simple_academy_server;
            break;
        }
    }
}
{% endhighlight %}

Restart the nginx:

{% highlight console %}
sudo service nginx restart
{% endhighlight %}

And it is already working, serving all requests with HTTPS only:

![Simple Academy HTTPS]({{ "/media/2016-05-11-how-to-setup-ssl-certificate-on-nginx-for-django-application/simple-academy-https.png" | prepend: site.baseurl }} "Simple Academy HTTPS")

Finally, add a few extra configurations to your `settings.py`:

{% highlight python %}
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
{% endhighlight %}

Restart your Django application and it is all set up.

***

I strongly recommend reading the official [Django Documentation on SSL/HTTPS][django-docs-ssl]{:target="_blank"} before
adding the extra configurations to your `settings.py`, as if not done correctly can seriously expose your application.


[letsencrypt]: https://letsencrypt.org/
[positivessl]: https://www.positivessl.com/free-ssl-certificate.php
[namecheap]: https://www.namecheap.com
[django-docs-ssl]: https://docs.djangoproject.com/en/dev/topics/security/#ssl-https
