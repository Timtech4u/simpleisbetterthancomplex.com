---
title: "How to Deploy a Django Application to Digital Ocean"
date: 2016-10-14 12:35:00 +0300
category: tutorial
tags: django deployment digitalocean
thumbnail: "/media/2016/10/featured-do.jpg"
featured_image: "/media/2016/10/featured-do.jpg"
featured_image_source: "https://www.pexels.com/photo/aerospace-engineering-exploration-launch-34521/"
---

DigitalOcean is a Virtual Private Server (VPS) provider. In my opinion it's a great service to get started. It's cheap
and very simple to setup. In this tutorial I will guide you through the steps I go to deploy a Django application
using Ubuntu 16.04, Git, PostgreSQL, NGINX, Supervisor and Gunicorn.

In this tutorial we will be deploying the following Django application: [github.com/sibtc/urban-train](https://github.com/sibtc/urban-train)

It's just an empty Django project I created to illustrate the deployment process. If you are wondering about the name,
it is the repository name suggestion GitHub gave.

Anyway! Let's get started.

***

#### Create a New Droplet

Pick the **Ubuntu 16.04.1** distribution:

![Digital Ocean](/media/2016/10/do1.png)

Select the size of the Droplet (cloud server):

![Digital Ocean](/media/2016/10/do2.png)

Select the region you want to deploy:

![Digital Ocean](/media/2016/10/do3.png)

Finally pick a name for the Droplet:

![Digital Ocean](/media/2016/10/do4.png)

And click on **Create**. After that you will see the recently created droplet in your profile:

![Digital Ocean](/media/2016/10/do5.png)

You will receive the root password via email. Now pick the **IP Address** and ssh into the server:

{% highlight bash %}
ssh root@107.170.28.172
{% endhighlight %}

![SSH](/media/2016/10/ssh.png)

You will be asked to change the root password upon the first login.

If you are using a Unix-like operating system you can use the terminal. If you are on Windows, you can perhaps download
[PuTTY](http://www.putty.org/){:target="_blank"}.

Also if you prefer, you can use the Digital Ocean's console:

![Digital Ocean Console](/media/2016/10/do-console.png)


***

#### Installing the Server Dependencies

First thing let's upgrade the packages:

{% highlight bash %}
sudo apt-get update
sudo apt-get -y upgrade
{% endhighlight %}

##### PostgreSQL

Install the dependencies to use PostgreSQL with Python/Django:

{% highlight bash %}
sudo apt-get -y install build-essential libpq-dev python-dev
{% endhighlight %}

Install the PostgreSQL Server:

{% highlight bash %}
sudo apt-get -y install postgresql postgresql-contrib
{% endhighlight %}

##### NGINX

Install NGINX, which will be used to serve static assets (css, js, images) and also to run the Django application
behind a proxy server:

{% highlight bash %}
sudo apt-get -y install nginx
{% endhighlight %}

##### Supervisor

Supervisor will start the application server and manage it in case of server crash or restart:

{% highlight bash %}
sudo apt-get -y install supervisor
{% endhighlight %}

Enable and start the Supervisor:

{% highlight bash %}
sudo systemctl enable supervisor
sudo systemctl start supervisor
{% endhighlight %}

##### Python Virtualenv

The Django application will be deployed inside a Python Virtualenv, for a better requirements management:

{% highlight bash %}
sudo apt-get -y install python-virtualenv
{% endhighlight %}

***

#### Configure PostgreSQL Database

Switch users:

{% highlight bash %}
su - postgres
{% endhighlight %}

Create a database user and the application database:

{% highlight bash %}
createuser u_urban
createdb urban_prod --owner u_urban
psql -c "ALTER USER u_urban WITH PASSWORD '123'"
{% endhighlight %}

PS: Make sure to pick a secure password! I'm using **123** for simplicity sake.

We can now go back to the root user, simply exit:

{% highlight bash %}
exit
{% endhighlight %}

***

#### Configure The Application User

Create a new user with the command below:

{% highlight bash %}
adduser urban
{% endhighlight %}

Usually I just use the application name. You will be asked a few questions. Sample of the output below:

{% highlight text %}
Adding user `urban' ...
Adding new group `urban' (1000) ...
Adding new user `urban' (1000) with group `urban' ...
Creating home directory `/home/urban' ...
Copying files from `/etc/skel' ...
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
Changing the user information for urban
Enter the new value, or press ENTER for the default
  Full Name []:
  Room Number []:
  Work Phone []:
  Home Phone []:
  Other []:
Is the information correct? [Y/n]
{% endhighlight %}

Add the user to the list of sudoers:

{% highlight bash %}
gpasswd -a urban sudo
{% endhighlight %}

Switch to the recently created user:

{% highlight bash %}
su - urban
{% endhighlight %}

***

#### Configure the Python Virtualenv

At this point we are logged in with the **urban** user (or whatever named you selected). We will install our Django
application in this user's home directory `/home/urban`:

{% highlight bash %}
virtualenv .
{% endhighlight %}

Activate it:

{% highlight bash %}
source bin/activate
{% endhighlight %}

Clone the repository:

{% highlight bash %}
git clone https://github.com/sibtc/urban-train.git
{% endhighlight %}

This is how the `/home/urban` directory should look like at the moment:

{% highlight text %}
urban/
 |-- bin/
 |-- urban-train/  <-- Django App (Git Repository)
 |-- include/
 |-- lib/
 |-- local/
 |-- pip-selfcheck.json
 +-- share/
{% endhighlight %}

First open the **urban-train** directory:

{% highlight bash %}
cd urban-train
{% endhighlight %}

Install the project's dependencies:

{% highlight bash %}
pip install -r requirements.txt
{% endhighlight %}

At this point you will need to set the database credentials in the **settings.py** file:

**settings.py**

{% highlight python %}
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'urban_prod',
        'USER': 'u_urban',
        'PASSWORD': '123',
        'HOST': 'localhost',
        'PORT': '',
    }
}
{% endhighlight %}

PS: There are better and secure ways to handle SECRET_KEY, database credentials etc. I'm editing it directly in the
settings.py file for the sake of simplicity. The focus of this tutorial is on the deployment process itself.

Migrate the database:

{% highlight bash %}
python manage.py migrate
{% endhighlight %}

Collect the static files:

{% highlight bash %}
python manage.py collectstatic
{% endhighlight %}

Test if everything is okay:

{% highlight bash %}
python manage.py runserver 0.0.0.0:8000
{% endhighlight %}

Access the IP Address of your server using port 8000. In my case, **107.170.28.172:8000**.

![Test Deployment](/media/2016/10/urban-train.png)

This is just a test. We won't be using the `runserver` to run our application. We will be using a proper application
server to securely serve our application.

Hit `CONTROL-C` to quit the development server and let's keep moving forward.

***

#### Configure Gunicorn

First install **Gunicorn** inside the virtualenv:

{% highlight bash %}
pip install gunicorn
{% endhighlight %}

Create a file named **gunicorn_start** inside the **bin/** folder:

{% highlight bash %}
vim bin/gunicorn_start
{% endhighlight %}

And add the following information and save it:

**/home/urban/bin/gunicorn_start**

{% highlight text %}
#!/bin/bash

NAME="urban_train"
DIR=/home/urban/urban-train
USER=urban
GROUP=urban
WORKERS=3
BIND=unix:/home/urban/run/gunicorn.sock
DJANGO_SETTINGS_MODULE=urban_train.settings
DJANGO_WSGI_MODULE=urban_train.wsgi
LOG_LEVEL=error

cd $DIR
source ../bin/activate

export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DIR:$PYTHONPATH

exec ../bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $WORKERS \
  --user=$USER \
  --group=$GROUP \
  --bind=$BIND \
  --log-level=$LOG_LEVEL \
  --log-file=-

{% endhighlight %}

Make the **gunicorn_start** file is executable:

{% highlight bash %}
chmod u+x bin/gunicorn_start
{% endhighlight %}

Create a directory named **run**, for the unix socket file:

{% highlight bash %}
mkdir run
{% endhighlight %}

***

#### Configure Supervisor

Now what we want to do is configure **Supervisor** to take care of running the gunicorn server.

First let's create a folder named **logs** inside the virtualenv:

{% highlight bash %}
mkdir logs
{% endhighlight %}

Create a file to be used to log the application errors:

{% highlight bash %}
touch logs/gunicorn-error.log
{% endhighlight %}

Create a new Supervisor configuration file:

{% highlight bash %}
sudo vim /etc/supervisor/conf.d/urban-train.conf
{% endhighlight %}

**/etc/supervisor/conf.d/urban-train.conf**

{% highlight text %}
[program:urban-train]
command=/home/urban/bin/gunicorn_start
user=urban
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/urban/logs/gunicorn-error.log
{% endhighlight %}

Reread Supervisor configuration files and make the new program available:

{% highlight bash %}
sudo supervisorctl reread
sudo supervisorctl update
{% endhighlight %}

Check the status:

{% highlight bash %}
sudo supervisorctl status urban-train
urban-train                      RUNNING   pid 23381, uptime 0:00:15
{% endhighlight %}

Now you can control your application using Supervisor. If you want to update the source code of your application
with a new version, you can pull the code from GitHub and then restart the process:

{% highlight bash %}
sudo supervisorctl restart urban-train
{% endhighlight %}

Where `urban-train` will be the name of your application.

***

#### Configure NGINX

Add a new configuration file named **urban** inside **/etc/nginx/sites-available/**:

{% highlight bash %}
sudo vim /etc/nginx/sites-available/urban-train
{% endhighlight %}

**/etc/nginx/sites-available/urban-train**

{% highlight nginx %}
upstream app_server {
    server unix:/home/urban/run/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;

    # add here the ip address of your server
    # or a domain pointing to that ip (like example.com or www.example.com)
    server_name 107.170.28.172;

    keepalive_timeout 5;
    client_max_body_size 4G;

    access_log /home/urban/logs/nginx-access.log;
    error_log /home/urban/logs/nginx-error.log;

    location /static/ {
        alias /home/urban/static/;
    }

    # checks for static file, if not found proxy to app
    location / {
        try_files $uri @proxy_to_app;
    }

    location @proxy_to_app {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_redirect off;
      proxy_pass http://app_server;
    }
}
{% endhighlight %}

Create a symbolic link to the **sites-enabled** dir:

{% highlight bash %}
sudo ln -s /etc/nginx/sites-available/urban-train /etc/nginx/sites-enabled/urban-train
{% endhighlight %}

Remove NGINX default website:

{% highlight bash %}
sudo rm /etc/nginx/sites-enabled/default
{% endhighlight %}

Restart NGINX:

{% highlight bash %}
sudo service nginx restart
{% endhighlight %}

***

#### The Final Test

Alright! At this point your application should be up and running! Open the web browser and access it:

![Urban Train Deployed](/media/2016/10/urban-train-admin.png)

A final test I like to run is rebooting the machine and see if everything restarts automatically:

{% highlight bash %}
sudo reboot
{% endhighlight %}

Wait a few seconds. Access the website via browser. If it loads normally, means everything is working as expected!
All the process are starting automatically.

***

#### Updating the Application

Usually that's the process you will follow when you want to update your Django application:

{% highlight bash %}
ssh urban@107.170.28.172

source bin/activate
cd urban-train
git pull origin master
python manage.py collectstatic
python manage.py migrate
sudo supervisorctl restart urban-train
exit
{% endhighlight %}

***

#### Caveats

I just wanted to take you through the basic steps of a deployment using Digital Ocean. Actually, for the most part
the basic steps will be the same for pretty much every cluod provider.

Please note that there are lots of details regarding security, performance, how you should manage the sensitive data
of your application, SSL certificate installation and so on.

I highly recommend reading all the available documentation about deployment on the official Django Docs. Also it's
very important to learn about the tooling you are using. Gunicorn, NGINX, Ubuntu, Supervisor, etc.

Further reading:

* [Django Docs: Deployment checklist](https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/){:target="_blank"}
* [Deploying Gunicorn](http://docs.gunicorn.org/en/latest/deploy.html){:target="_blank"}
* [NGINX Pitfalls and Common Mistakes](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/){:target="_blank"}
* [Initial Server Setup, Root Login, etc](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04){:target="_blank"}
* [How to Setup a SSL Certificate on Nginx for a Django Application](/tutorial/2016/05/11/how-to-setup-ssl-certificate-on-nginx-for-django-application.html){:target="_blank"}
* [Separating settings from code (database information, security key, allowed hosts, etc)](/2015/11/26/package-of-the-week-python-decouple.html){:target="_blank"}

I hope you enjoyed this tutorial! If you have any question, please leave a comment below!
