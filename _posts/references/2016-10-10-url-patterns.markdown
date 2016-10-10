---
title: "List of Useful URL Patterns"
date: 2016-10-10 11:45:00 +0300
category: references
tags: django urlconf url patterns
thumbnail: "/media/2016/10/featured-urls.jpg"
featured_image: "/media/2016/10/featured-urls.jpg"
featured_image_source: "https://www.pexels.com/photo/holidays-car-travel-adventure-21014/"
---

The ability to create beautiful and meaningful urls is certainly something I love about the Django Framework. But truth
is, it's very hard to get it right. Honestly I always have to refer to the documentation or to past projects I've
developed, just to grab the regex I need.

So that's why I thought about creating this post, to serve as a reference guide for common urls.

***

#### Primary Key AutoField

Regex: `(?P<pk>\d+)`

{% highlight python %}
url(r'^questions/(?P<pk>\d+)/$', views.question_details, name='question_details'),
{% endhighlight %}

<div class="panel panel-success">
  <div class="panel-header">Match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Captures</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/questions/0/</code></td>
        <td><code>{'pk': '0'}</code></td>
      </tr>
      <tr>
        <td><code>/questions/1/</code></td>
        <td><code>{'pk': '1'}</code></td>
      </tr>
      <tr>
        <td><code>/questions/934/</code></td>
        <td><code>{'pk': '934'}</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="panel panel-danger">
  <div class="panel-header">Won't match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/questions/-1/</code></td>
      </tr>
      <tr>
        <td><code>/questions/test-1/</code></td>
      </tr>
      <tr>
        <td><code>/questions/abcdef/</code></td>
      </tr>
    </tbody>
  </table>
</div>

***

#### Slug Fields

Regex: `(?P<slug>[-\w]+)`

{% highlight python %}
url(r'^posts/(?P<slug>[-\w]+)/$', views.post, name='post'),
{% endhighlight %}

<div class="panel panel-success">
  <div class="panel-header">Match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Captures</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/posts/0/</code></td>
        <td><code>{'slug': '0'}</code></td>
      </tr>
      <tr>
        <td><code>/posts/hello-world/</code></td>
        <td><code>{'slug': 'hello-world'}</code></td>
      </tr>
      <tr>
        <td><code>/posts/-hello-world_/</code></td>
        <td><code>{'slug': '-hello-world_'}</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="panel panel-danger">
  <div class="panel-header">Won't match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/posts/hello world/</code></td>
      </tr>
      <tr>
        <td><code>/posts/hello%20world/</code></td>
      </tr>
      <tr>
        <td><code>/posts/@hello-world*/</code></td>
      </tr>
    </tbody>
  </table>
</div>

***

#### Slug with Primary Key

Regex: `(?P<slug>[-\w]+)-(?P<pk>\d+)`

{% highlight python %}
url(r'^blog/(?P<slug>[-\w]+)-(?P<pk>\d+)/$', views.blog_post, name='blog_post'),
{% endhighlight %}

<div class="panel panel-success">
  <div class="panel-header">Match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Captures</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/blog/hello-world-159/</code></td>
        <td><code>{'slug': 'hello-world', 'pk': '159'}</code></td>
      </tr>
      <tr>
        <td><code>/blog/a-0/</code></td>
        <td><code>{'slug': 'a', 'pk': '0'}</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="panel panel-danger">
  <div class="panel-header">Won't match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/blog/hello-world/</code></td>
      </tr>
      <tr>
        <td><code>/blog/1/</code></td>
      </tr>
      <tr>
        <td><code>/blog/helloworld1/</code></td>
      </tr>
      <tr>
        <td><code>/hello-world-1-test/</code></td>
      </tr>
    </tbody>
  </table>
</div>

***

#### Usernames

Regex: `(?P<username>[\w.@+-]+)`

{% highlight python %}
url(r'^profile/(?P<username>[\w.@+-]+)/$', views.user_profile),
{% endhighlight %}

<div class="panel panel-success">
  <div class="panel-header">Match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Captures</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/profile/vitorfs/</code></td>
        <td><code>{'username': 'vitorfs'}</code></td>
      </tr>
      <tr>
        <td><code>/profile/vitor.fs/</code></td>
        <td><code>{'username': 'vitor.fs'}</code></td>
      </tr>
      <tr>
        <td><code>/profile/@vitorfs/</code></td>
        <td><code>{'username': '@vitorfs'}</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="panel panel-danger">
  <div class="panel-header">Won't match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/profile/*vitorfs/</code></td>
      </tr>
      <tr>
        <td><code>/profile/$vitorfs/</code></td>
      </tr>
      <tr>
        <td><code>/profile/vitor fs/</code></td>
      </tr>
    </tbody>
  </table>
</div>

***

#### Dates

##### Year

Regex: `(?P<year>[0-9]{4})`

{% highlight python %}
url(r'^articles/(?P<year>[0-9]{4})/$', views.year_archive)
{% endhighlight %}

<div class="panel panel-success">
  <div class="panel-header">Match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Captures</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/articles/2016/</code></td>
        <td><code>{'year': '2016'}</code></td>
      </tr>
      <tr>
        <td><code>/articles/9999/</code></td>
        <td><code>{'year': '9999'}</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="panel panel-danger">
  <div class="panel-header">Won't match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/articles/999/</code></td>
      </tr>
    </tbody>
  </table>
</div>

##### Year / Month

Regex: `(?P<year>[0-9]{4})/(?P<month>[0-9]{2})`

{% highlight python %}
url(r'^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/$', views.month_archive),
{% endhighlight %}

<div class="panel panel-success">
  <div class="panel-header">Match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Captures</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/articles/2016/01/</code></td>
        <td><code>{'year': '2016', 'month': '01'}</code></td>
      </tr>
      <tr>
        <td><code>/articles/2016/12/</code></td>
        <td><code>{'year': '2016', 'month': '12'}</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="panel panel-danger">
  <div class="panel-header">Won't match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/articles/2016/1/</code></td>
      </tr>
    </tbody>
  </table>
</div>

##### Year / Month / Day

Regex: `(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})`

{% highlight python %}
url(r'^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$', views.article_detail)
{% endhighlight %}

<div class="panel panel-success">
  <div class="panel-header">Match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Captures</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/articles/2016/01/01/</code></td>
        <td><code>{'year': '2016', 'month': '01', day: '01'}</code></td>
      </tr>
      <tr>
        <td><code>/articles/2016/02/28/</code></td>
        <td><code>{'year': '2016', 'month': '02', 'day': '28'}</code></td>
      </tr>
      <tr>
        <td><code>/articles/9999/99/99/</code></td>
        <td><code>{'year': '9999', 'month': '99', 'day': '99'}</code></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="panel panel-danger">
  <div class="panel-header">Won't match</div>
  <table>
    <thead>
      <tr>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/articles/2016/01/9/</code></td>
      </tr>
      <tr>
        <td><code>/articles/2016/01/290/</code></td>
      </tr>
    </tbody>
  </table>
</div>

***

#### Flattened Index

{% highlight python %}
url(r'^questions/(?P<pk>\d+)/$', views.question_details, name='question_details'),
url(r'^posts/(?P<slug>[-\w]+)/$', views.post, name='post'),
url(r'^blog/(?P<slug>[-\w]+)-(?P<pk>\d+)/$', views.blog_post, name='blog_post'),
url(r'^profile/(?P<username>[\w.@+-]+)/$', views.user_profile),
url(r'^articles/(?P<year>[0-9]{4})/$', views.year_archive),
url(r'^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/$', views.month_archive),
url(r'^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$', views.article_detail)
{% endhighlight %}

***

Wanna share some useful URL pattern you use? Leave a comment below and I will update the post!