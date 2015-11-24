---
layout: post
title:  "Package of the Week: Python-Decouple"
date:   2015-11-26 12:00:00
author: Vitor Freitas
tags: python package
---

Web applications relies on several number of parameters to run properly on different environments. To name a few from a Django app settings: database url, password, secret key, debug status, email host, allowed hosts. Most of these parameters are environment-specific. On a development environment you might want to run your application with debug mode on. Also, it's a clever idea to keep your secret key in a safe place (not in your git repository).

Python Decouple is a great library that helps you strictly separate the settings parameters from your source code. The idea is simple: Parameters related to the project, goes straight to the source code. Parameters related to an _instance of the project_, goes to an environment file.

The following is a quick start of how to use the Python Decouple library.

#### Install

{% highlight bash %}
$ pip install python-decouple
{% endhighlight %}

Or download it from [PyPI][python-decouple-pypi]{:target="_blank"} if you prefer.

[python-decouple-pypi]: https://pypi.python.org/pypi/python-decouple