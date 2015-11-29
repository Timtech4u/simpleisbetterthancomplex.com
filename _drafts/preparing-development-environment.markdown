---
layout: post
title: "Starting a New Django Project"
date: 2015-11-30 12:00:00
author: Vitor Freitas
tags: django python
---

In this article you will find some useful tips regarding starting a new Django project and preparing a development environment. The steps below describes what I generally do when I'm starting a new project. 

#### Step 1: Python Virtual Environment

If you have to maintain more than one Django project, at some point you will end up having problems with its dependencies, or with the Django version itself. The solution is to use [virtualenv][virtualenv]{:target="_blank"}, which is a tool to create isolated Python environments. 

It's great because each of your Django project can live inside its own Python environment.

If you don't have it yet, you can install using pip:

{% highlight bash %}
$ pip install virtualenv
{% endhighlight %}

The basic usage of virtualenv would be, inside the folder you want to place your project, execute the following command:

{% highlight bash %}
$ virtualenv simple_django_skeleton
{% endhighlight %}

The instruction above will create a Python environment named `simple_django_skeleton`. In the end of the day, it's just a folder with a Python installation inside. We will place our Django project folder and all its dependencies inside this folder.

Now, inside the `simple_django_skeleton` folder, activate the environment:

{% highlight bash %}
$ source bin/activate
{% endhighlight %}

You will notice that the name of the active virtualenv will now appear on the left of the prompt. Your terminal should look like something like this:

![virtualenv]({{ "/media/2015-11-30/virtualenv.png" | prepend: site.baseurl }} "Creating a python virtual environment")

#### Step 2: Git Remote Repository

Using a version control system is a clever idea, even if you are gonna be working alone. I use [Git][git]{:target="_blank"} as the version control system for the projects I develop, and [GitHub][github]{:target="_blank"} as the remote storage.

I prefer to create the remote repository first on GitHub, and then clone it into my development environment. It's cleaner this way.

#### Initializing the project


[virtualenv]: http://docs.python-guide.org/en/latest/dev/virtualenvs/
[git]: https://git-scm.com/
[github]: https://github.com/