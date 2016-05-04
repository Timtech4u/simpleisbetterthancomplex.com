---
layout: post
title:  "Weekly Django Tip #1 Redirects"
date:   2016-05-02 12:00:00
author: Vitor Freitas
tags: python django
category: tips
---

View decorators can be used to restrict access to certain views. Django come with some built-in decorators, like `login_required`, `require_POST` or `has_permission`. They are really useful, but sometimes you might need to restrict the access in a different level of granularity, for example only letting the user who created an entry of the model to edit or delete it.