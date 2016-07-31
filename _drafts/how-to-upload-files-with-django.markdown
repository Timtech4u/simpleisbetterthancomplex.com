---
title: "How to Upload Files With Django"
date: 2016-08-01 14:36:00 +0300
category: tutorial
tags: django forms
thumbnail: "/media/2016-07-30-how-to-upload-files-with-django/featured.jpg"
featured_image: "/media/2016-07-30-how-to-upload-files-with-django/featured.jpg"
---

In this tutorial you will learn how to handle file uploads with Django. I will present the basics, how to do a simple
file upload, multiple file upload and AJAX file upload. I will also cover some general advices about security and
server side validations such as file type, size, etc.

***

#### The Basics of File Upload With Django

When files are submitted to the server, the file data ends up placed in `request.FILES`.

It is mandatory for the HTML form to have the attribute `enctype="multipart/form-data"` set correctly. Otherwise the
`request.FILES` will be empty.

The form must be submitted using the **POST** method.

Django have proper model fields to handle uploaded files: `FileField` and `ImageField`.

The files uploaded to `FileField` or `ImageField` are not stored in the database but in the filesystem.

`FileField` and `ImageField` are created as a string field in the database (usually VARCHAR), containing the reference
to the actual file.

If you delete a model instance containing `FileField` or `ImageField`, Django will **not** delete the physical file,
but only the reference to the file.

The `request.FILES` is a dictionary-like object. Each key in `request.FILES` is the name from the `<input type="file" name="" />`.

Each value in `request.FILES` is an `UploadedFile` instance. I will talk more about it later on.