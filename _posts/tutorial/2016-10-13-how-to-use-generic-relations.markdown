---
title: "How to Use Django's Generic Relations"
date: 2016-10-13 14:48:00 +0300
category: tutorial
tags:
  - django
  - content types
  - generic relations
thumbnail: "/media/2016/10/featured-generic.jpg"
featured_image: "/media/2016/10/featured-generic.jpg"
featured_image_source: "https://www.pexels.com/photo/business-identity-blank-stationery-set-on-wood-background-6372/"
---

You probably have already seen Django's **ContentTypes** and wondered how to use it or what is it for anyway.
Basically it's a built in app that keeps track of models from the installed apps of your Django application. And one
of the use cases of the **ContentTypes** is to create generic relationships between models. That's what this post is
about.

***

#### Installation

If you didn't remove anything from settings generated by the `django-admin startproject myproject` command, it's probably
already installed. Also Django's built in authentication system relies on it.

Basically just make sure you have it in your `INSTALLED_APPS`:

{% highlight python %}
INSTALLED_APPS = [
    ...

    'django.contrib.contenttypes',

    ...
]
{% endhighlight %}

***

#### Example Scenario

Let's say we have one social app where the users can ask and answer questions, **up vote**, **down vote**, **favorite**
a question, **like** a post in the website, etc.

To keep track of that we create a model named **Activity**. See below:

{% highlight python %}
class Activity(models.Model):
    FAVORITE = 'F'
    LIKE = 'L'
    UP_VOTE = 'U'
    DOWN_VOTE = 'D'
    ACTIVITY_TYPES = (
        (FAVORITE, 'Favorite'),
        (LIKE, 'Like'),
        (UP_VOTE, 'Up Vote'),
        (DOWN_VOTE, 'Down Vote'),
    )

    user = models.ForeignKey(User)
    activity_type = models.CharField(max_length=1, choices=ACTIVITY_TYPES)
    date = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, null=True)
    question = models.ForeignKey(Question, null=True)
    answer = models.ForeignKey(Answer, null=True)
    comment = models.ForeignKey(Comment, null=True)
{% endhighlight %}

So an **Activity** can possibly interact with a **Post**, **Question**, **Answer** or a **Comment** instance. In a
practical scenario an **Activity** instance would represent a single interaction. For example, the User with ID 1
**up voted** a Question with ID 125:

{% highlight python %}
Activity.objects.create(user=1, activity_type='U', question=125)
{% endhighlight %}

And if I wanted to calculate how many **up votes** the Question 125 received, I could do something like that:

{% highlight python %}
question = Question.objects.get(pk=125)
up_votes = question.activity_set.filter(activity_type=Activity.UP_VOTE)

# Display how many up votes
count = up_votes.count()

# Display the names of users who up voted
up_voters = up_votes.values_list('user__first_name')
{% endhighlight %}

In a similar way we could work with the Post, Answer and Comment models.

***

#### Using the Generic Relations

If we wanted to achieve the same result using **Generic Relations**, here is what the **Activity** models should
look like:

{% highlight python %}
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Activity(models.Model):
    FAVORITE = 'F'
    LIKE = 'L'
    UP_VOTE = 'U'
    DOWN_VOTE = 'D'
    ACTIVITY_TYPES = (
        (FAVORITE, 'Favorite'),
        (LIKE, 'Like'),
        (UP_VOTE, 'Up Vote'),
        (DOWN_VOTE, 'Down Vote'),
    )

    user = models.ForeignKey(User)
    activity_type = models.CharField(max_length=1, choices=ACTIVITY_TYPES)
    date = models.DateTimeField(auto_now_add=True)

    # Below the mandatory fields for generic relation
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()
{% endhighlight %}

Now we are no longer keeping **ForeignKey** to other models we want to track the favorite, like, up vote and down vote
activities. Meaning we can now track those activities to any model we want without having to modify the Activity model.

The relation is created in the model you want to track the **Activity**:

{% highlight python %}
from django.db import models
from django.contrib.contenttypes.fields import GenericRelation

from activities.models import Activity


class Post(models.Model):
    ...
    likes = GenericRelation(Activity)

class Question(models.Model):
    ...
    activities = GenericRelation(Activity)

class Answer(models.Model):
    ...
    votes = GenericRelation(Activity)

class Comment(models.Model):
    ...
    likes = GenericRelation(Activity)
{% endhighlight %}

This also enables you to define a more meaningful name for the relations. For example, the **Users** can only interact
with **Post** and **Comment** models to **like** it. While with the **Answer** model, they can only
**up vote/down vote**. And finally with the **Question** model, the **Users** can **up vote/down vote** and
**favorite** it.

Now if you want to **like** a **Post**, you could do something like this:

{% highlight python %}
# Get the post object
post = Post.objects.get(pk=1)

# Add a like activity
post.likes.create(activity_type=Activity.LIKE, user=request.user)

# Or in a similar way using the Activity model to add the like
Activity.objects.create(content_object=post, activity_type=Activity.LIKE, user=request.user)

# Get all Activity instances related to Post
post.likes.all()

# Count the number of likes
post.likes.count()

# Get the users who liked the post
post.likes.values_list('user__first_name', flat=True)
{% endhighlight %}

A good thing about it is that if have a new model that you wants to interact with **Activity**, you simply add a
**GenericRelation**:

{% highlight python %}
from django.contrib.contenttypes.fields import GenericRelation

class Picture(models.Model):
    user = models.ForeignKey(User)
    picture_file = models.ImageField(upload_to='uploads/pictures')
    date = models.DateTimeField(auto_now_add=True)
    favorites = GenericRelation(Activity)
{% endhighlight %}

And it's already ready to use:

{% highlight python %}
picture = Picture.objects.get(pk=1)

picture.favorites.create(activity_type=Activity.FAVORITE, user=request.user)
picture.favorites.count()
{% endhighlight %}
***

#### Reverse relations

You may also define an extra parameter in the GenericRelation:

{% highlight python %}
from django.contrib.contenttypes.fields import GenericRelation

class Picture(models.Model):
    user = models.ForeignKey(User)
    picture_file = models.ImageField(upload_to='uploads/pictures')
    date = models.DateTimeField(auto_now_add=True)
    favorites = GenericRelation(Activity, related_query_name='pictures')
{% endhighlight %}

Then you can use it to query for example all favorited pictures that was uploaded by a given user:

{% highlight python %}
user = User.objects.get(pk=1)
Activity.objects.filter(pictures__user=user)
{% endhighlight %}

***

#### Caveats

This is just one of the usages of the **ContentTypes** and **GenericRelations**. Even though it seems very nice to use,
take care when implementing it! It adds an extra layer of complexity and will eventually make things slower.

Another caveat is that the **GenericForeignKey** does not accept an **on_delete** argument to customize this behavior.
The default behavior will cascade all the relations.

One way to avoid the default behavior is to not define a **GenericRelation**. Check the example below:

{% highlight python %}
class Comment(models.Model):
    text = models.CharField(max_length=500, blank=True)
    date = models.DateTimeField(auto_now_add=True)

# Add a new instance of Comment
comment = Comment.objects.create(text='This is a test comment')

# Like the comment
Activity.objects.create(content_object=comment, activity_type=Activity.LIKE, user=request.user)
{% endhighlight %}

Now to get the list of **likes** this **Comment** received you must use the **ContentType** class:

{% highlight python %}
from django.contrib.contenttypes.models import ContentType

# Pass the instance we created in the snippet above
ct = ContentType.objects.get_for_model(comment)

# Get the list of likes
Activity.objects.filter(content_type=ct, object_id=comment.id, activity_type=Activity.LIKE)
{% endhighlight %}

This is also an option if you want to interact with a model from Django's contrib module or any third party model that
you don't have access to add a **GenericRelation**.