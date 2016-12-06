---
title: How to Create Group By Queries With Django ORM
date: 2016-12-06 12:48:00 +0200
category: tutorial
tags: django orm queryset
thumbnail: /media/2016/12/thumbnail-groupby.jpg
featured_image: /media/2016/12/featured-groupby.jpg
featured_image_source: https://unsplash.com/search/computer?photo=VHpDp_GkGgc
---

This tutorial is about how to implement SQL-like group by queries using the Django ORM. It's a fairly common operation,
specially for those who are familiar with SQL. The Django ORM is actually an abstraction layer, that let us play with
the database as it was object-oriented but in the end it's just a relational database and all the operations are
translated into SQL statements.

Most of the work can be done retrieving the raw data from the database, and playing with it in the Python side,
grouping the data in dictionaries, iterating through it, making sums, averages and what not. But the database is a very
powerful tool and do much more than simply storing the data, and often you can do the work much faster directly in the
database.

Generally speaking, when you start doing group by queries, you are no longer interested in each model instances (or
in a table row) details, but you want extract new information from your dataset, based on some common aspects shared
between the model instances.

Let's have a look in an example:

{% highlight python %}
class Country(models.Model):
    name = models.CharField(max_length=30)

class City(models.Model):
    name = models.CharField(max_length=30)
    country = models.ForeignKey(Country)
    population = models.PositiveIntegerField()
{% endhighlight %}

And the raw data stored in the database:

<div style="height: 300px; overflow-y: scroll; margin-bottom: 2.5rem; border: 1px dashed #e1e1e1; padding: 1em">
  <div class="row">
    <div class="seven columns" style="font-size: 14px; border-radius: 4px; background-color: #f1f1f1; border: 1px solid #e1e1e1; padding: 1rem 1.5rem">
      <table class="u-full-width">
        <thead>
          <tr>
            <th colspan="4">
              <strong>cities</strong>
            </th>
          </tr>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>country_id</th>
            <th>population</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Tokyo</td><td>28</td><td>36,923,000</td></tr>
          <tr><td>2</td><td>Shanghai</td><td>13</td><td>34,000,000</td></tr>
          <tr><td>3</td><td>Jakarta</td><td>19</td><td>30,000,000</td></tr>
          <tr><td>4</td><td>Seoul</td><td>21</td><td>25,514,000</td></tr>
          <tr><td>5</td><td>Guangzhou</td><td>13</td><td>25,000,000</td></tr>
          <tr><td>6</td><td>Beijing</td><td>13</td><td>24,900,000</td></tr>
          <tr><td>7</td><td>Karachi</td><td>22</td><td>24,300,000</td></tr>
          <tr><td>8</td><td>Shenzhen</td><td>13</td><td>23,300,000</td></tr>
          <tr><td>9</td><td>Delhi</td><td>25</td><td>21,753,486</td></tr>
          <tr><td>10</td><td>Mexico City</td><td>24</td><td>21,339,781</td></tr>
          <tr><td>11</td><td>Lagos</td><td>9</td><td>21,000,000</td></tr>
          <tr><td>12</td><td>São Paulo</td><td>1</td><td>20,935,204</td></tr>
          <tr><td>13</td><td>Mumbai</td><td>25</td><td>20,748,395</td></tr>
          <tr><td>14</td><td>New York City</td><td>20</td><td>20,092,883</td></tr>
          <tr><td>15</td><td>Osaka</td><td>28</td><td>19,342,000</td></tr>
          <tr><td>16</td><td>Wuhan</td><td>13</td><td>19,000,000</td></tr>
          <tr><td>17</td><td>Chengdu</td><td>13</td><td>18,100,000</td></tr>
          <tr><td>18</td><td>Dhaka</td><td>4</td><td>17,151,925</td></tr>
          <tr><td>19</td><td>Chongqing</td><td>13</td><td>17,000,000</td></tr>
          <tr><td>20</td><td>Tianjin</td><td>13</td><td>15,400,000</td></tr>
          <tr><td>21</td><td>Kolkata</td><td>25</td><td>14,617,882</td></tr>
          <tr><td>22</td><td>Tehran</td><td>11</td><td>14,595,904</td></tr>
          <tr><td>23</td><td>Istanbul</td><td>2</td><td>14,377,018</td></tr>
          <tr><td>24</td><td>London</td><td>26</td><td>14,031,830</td></tr>
          <tr><td>25</td><td>Hangzhou</td><td>13</td><td>13,400,000</td></tr>
          <tr><td>26</td><td>Los Angeles</td><td>20</td><td>13,262,220</td></tr>
          <tr><td>27</td><td>Buenos Aires</td><td>8</td><td>13,074,000</td></tr>
          <tr><td>28</td><td>Xi'an</td><td>13</td><td>12,900,000</td></tr>
          <tr><td>29</td><td>Paris</td><td>6</td><td>12,405,426</td></tr>
          <tr><td>30</td><td>Changzhou</td><td>13</td><td>12,400,000</td></tr>
          <tr><td>31</td><td>Shantou</td><td>13</td><td>12,000,000</td></tr>
          <tr><td>32</td><td>Rio de Janeiro</td><td>1</td><td>11,973,505</td></tr>
          <tr><td>33</td><td>Manila</td><td>18</td><td>11,855,975</td></tr>
          <tr><td>34</td><td>Nanjing</td><td>13</td><td>11,700,000</td></tr>
          <tr><td>35</td><td>Rhine-Ruhr</td><td>16</td><td>11,470,000</td></tr>
          <tr><td>36</td><td>Jinan</td><td>13</td><td>11,000,000</td></tr>
          <tr><td>37</td><td>Bangalore</td><td>25</td><td>10,576,167</td></tr>
          <tr><td>38</td><td>Harbin</td><td>13</td><td>10,500,000</td></tr>
          <tr><td>39</td><td>Lima</td><td>7</td><td>9,886,647</td></tr>
          <tr><td>40</td><td>Zhengzhou</td><td>13</td><td>9,700,000</td></tr>
          <tr><td>41</td><td>Qingdao</td><td>13</td><td>9,600,000</td></tr>
          <tr><td>42</td><td>Chicago</td><td>20</td><td>9,554,598</td></tr>
          <tr><td>43</td><td>Nagoya</td><td>28</td><td>9,107,000</td></tr>
          <tr><td>44</td><td>Chennai</td><td>25</td><td>8,917,749</td></tr>
          <tr><td>45</td><td>Bangkok</td><td>15</td><td>8,305,218</td></tr>
          <tr><td>46</td><td>Bogotá</td><td>27</td><td>7,878,783</td></tr>
          <tr><td>47</td><td>Hyderabad</td><td>25</td><td>7,749,334</td></tr>
          <tr><td>48</td><td>Shenyang</td><td>13</td><td>7,700,000</td></tr>
          <tr><td>49</td><td>Wenzhou</td><td>13</td><td>7,600,000</td></tr>
          <tr><td>50</td><td>Nanchang</td><td>13</td><td>7,400,000</td></tr>
          <tr><td>51</td><td>Hong Kong</td><td>13</td><td>7,298,600</td></tr>
          <tr><td>52</td><td>Taipei</td><td>29</td><td>7,045,488</td></tr>
          <tr><td>53</td><td>Dallas–Fort Worth</td><td>20</td><td>6,954,330</td></tr>
          <tr><td>54</td><td>Santiago</td><td>14</td><td>6,683,852</td></tr>
          <tr><td>55</td><td>Luanda</td><td>23</td><td>6,542,944</td></tr>
          <tr><td>56</td><td>Houston</td><td>20</td><td>6,490,180</td></tr>
          <tr><td>57</td><td>Madrid</td><td>17</td><td>6,378,297</td></tr>
          <tr><td>58</td><td>Ahmedabad</td><td>25</td><td>6,352,254</td></tr>
          <tr><td>59</td><td>Toronto</td><td>5</td><td>6,055,724</td></tr>
          <tr><td>60</td><td>Philadelphia</td><td>20</td><td>6,051,170</td></tr>
          <tr><td>61</td><td>Washington, D.C.</td><td>20</td><td>6,033,737</td></tr>
          <tr><td>62</td><td>Miami</td><td>20</td><td>5,929,819</td></tr>
          <tr><td>63</td><td>Belo Horizonte</td><td>1</td><td>5,767,414</td></tr>
          <tr><td>64</td><td>Atlanta</td><td>20</td><td>5,614,323</td></tr>
          <tr><td>65</td><td>Singapore</td><td>12</td><td>5,535,000</td></tr>
          <tr><td>66</td><td>Barcelona</td><td>17</td><td>5,445,616</td></tr>
          <tr><td>67</td><td>Munich</td><td>16</td><td>5,203,738</td></tr>
          <tr><td>68</td><td>Stuttgart</td><td>16</td><td>5,200,000</td></tr>
          <tr><td>69</td><td>Ankara</td><td>2</td><td>5,150,072</td></tr>
          <tr><td>70</td><td>Hamburg</td><td>16</td><td>5,100,000</td></tr>
          <tr><td>71</td><td>Pune</td><td>25</td><td>5,049,968</td></tr>
          <tr><td>72</td><td>Berlin</td><td>16</td><td>5,005,216</td></tr>
          <tr><td>73</td><td>Guadalajara</td><td>24</td><td>4,796,050</td></tr>
          <tr><td>74</td><td>Boston</td><td>20</td><td>4,732,161</td></tr>
          <tr><td>75</td><td>Sydney</td><td>10</td><td>5,000,500</td></tr>
          <tr><td>76</td><td>San Francisco</td><td>20</td><td>4,594,060</td></tr>
          <tr><td>77</td><td>Surat</td><td>25</td><td>4,585,367</td></tr>
          <tr><td>78</td><td>Phoenix</td><td>20</td><td>4,489,109</td></tr>
          <tr><td>79</td><td>Monterrey</td><td>24</td><td>4,477,614</td></tr>
          <tr><td>80</td><td>Inland Empire</td><td>20</td><td>4,441,890</td></tr>
          <tr><td>81</td><td>Rome</td><td>3</td><td>4,321,244</td></tr>
          <tr><td>82</td><td>Detroit</td><td>20</td><td>4,296,611</td></tr>
          <tr><td>83</td><td>Milan</td><td>3</td><td>4,267,946</td></tr>
          <tr><td>84</td><td>Melbourne</td><td>10</td><td>4,650,000</td></tr>
        </tbody>
      </table>
    </div>
    <div class="five columns" style="font-size: 14px; border-radius: 4px; background-color: #f1f1f1; border: 1px solid #e1e1e1; padding: 1rem 1.5rem">
      <table class="u-full-width">
        <thead>
          <tr>
            <th colspan="2">
              <strong>countries</strong>
            </th>
          </tr>
          <tr>
            <th>id</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Brazil</td></tr>
          <tr><td>2</td><td>Turkey</td></tr>
          <tr><td>3</td><td>Italy</td></tr>
          <tr><td>4</td><td>Bangladesh</td></tr>
          <tr><td>5</td><td>Canada</td></tr>
          <tr><td>6</td><td>France</td></tr>
          <tr><td>7</td><td>Peru</td></tr>
          <tr><td>8</td><td>Argentina</td></tr>
          <tr><td>9</td><td>Nigeria</td></tr>
          <tr><td>10</td><td>Australia</td></tr>
          <tr><td>11</td><td>Iran</td></tr>
          <tr><td>12</td><td>Singapore</td></tr>
          <tr><td>13</td><td>China</td></tr>
          <tr><td>14</td><td>Chile</td></tr>
          <tr><td>15</td><td>Thailand</td></tr>
          <tr><td>16</td><td>Germany</td></tr>
          <tr><td>17</td><td>Spain</td></tr>
          <tr><td>18</td><td>Philippines</td></tr>
          <tr><td>19</td><td>Indonesia</td></tr>
          <tr><td>20</td><td>United States</td></tr>
          <tr><td>21</td><td>South Korea</td></tr>
          <tr><td>22</td><td>Pakistan</td></tr>
          <tr><td>23</td><td>Angola</td></tr>
          <tr><td>24</td><td>Mexico</td></tr>
          <tr><td>25</td><td>India</td></tr>
          <tr><td>26</td><td>United Kingdom</td></tr>
          <tr><td>27</td><td>Colombia</td></tr>
          <tr><td>28</td><td>Japan</td></tr>
          <tr><td>29</td><td>Taiwan</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

This data is from Wikipedia, and I don't know to what extent it is correct, but for our example it doesn't really
matter.

Considering the whole dataset, if we wanted to know the total of habitants in all the 84 cities, we could perhaps use
an `aggregate` query:

{% highlight python %}
from django.db.models import Sum

City.objects.all().aggregate(Sum('population'))
{'population__sum': 970880224}  # 970,880,224
{% endhighlight %}

Or the average population in the top 84 cities:

{% highlight python %}
from django.db.models import Avg

City.objects.all().aggregate(Avg('population'))
{'population__avg': 11558097.904761905}  # 11,558,097.90
{% endhighlight %}

What if we now wanted to see the total population, but aggregated by the country instead? Not the whole dataset. In
this case we no longer can use `aggregate`, instead we will be using `annotate`.

The `aggregate` clause is terminal, it returns a Python dictionary, meaning you can't append any queryset methods.
Also, it will always return a single result. So if you wanted to get the population sum by country, using `aggregate`,
you would need to do something like this:

<div class="panel panel-danger">
  <div class="panel-header">Don't</div>
{% highlight python %}
from django.db.models import Sum

for country in Country.objects.all():
    result = City.objects.filter(country=country).aggregate(Sum('population'))
    print '{}: {}'.format(country.name, result['population__sum'])

# Output:
# -------
# Brazil: 38676123
# Turkey: 19527090
# Italy: 8589190
# Bangladesh: 17151925
# Canada: 6055724
# France: 12405426
# Peru: 9886647
# Argentina: 13074000
# Nigeria: 21000000
# Australia: 9650500
# Iran: 14595904
# ...
{% endhighlight %}
</div>

While the result is correct, we needed to execute **30** different queries in the database. And we've lost some of the
capabilities of the ORM, such as ordering this result set. Perhaps the data would be more interesting if we could order
by the country with the most population for example.

Now a better way to do it is using `annotate`, which will be translated as a **group by** query in the database:

<div class="panel panel-success">
  <div class="panel-header">Do</div>
{% highlight python %}
City.objects.all().values('country__name').annotate(Sum('population'))

[
  {'country__name': u'Angola', 'population__sum': 6542944},
  {'country__name': u'Argentina', 'population__sum': 13074000},
  {'country__name': u'Australia', 'population__sum': 9650500},
  {'country__name': u'Bangladesh', 'population__sum': 17151925},
  {'country__name': u'Brazil', 'population__sum': 38676123},
  '...(remaining elements truncated)...'
]
{% endhighlight %}
</div>

Much better, right?

Now if we wanted to order by the country population, we can use an alias to make it look cleaner and to use in the
`order_by()` clause:

{% highlight python %}
City.objects.all() \
  .values('country__name') \
  .annotate(country_population=Sum('population')) \
  .order_by('-country_population')

[
  {'country__name': u'China', 'country_population': 309898600},
  {'country__name': u'United States', 'country_population': 102537091},
  {'country__name': u'India', 'country_population': 100350602},
  {'country__name': u'Japan', 'country_population': 65372000},
  {'country__name': u'Brazil', 'country_population': 38676123},
  '...(remaining elements truncated)...'
]
{% endhighlight %}

Here is how the last SQL query looks like:

{% highlight sql %}
  SELECT "core_country"."name", SUM("core_city"."population") AS "country_population"
    FROM "core_city" INNER JOIN "core_country" ON ("core_city"."country_id" = "core_country"."id")
GROUP BY "core_country"."name"
ORDER BY "country_population" DESC
{% endhighlight %}

Now an important thing to note here: it only makes sense adding in the `values()` clause, the data that can be grouped.
Every field you add to the `values()` clause, will be used to create the group by query.

Look at this queryset:

{% highlight python %}
City.objects.all().values('name', 'country__name').annotate(Sum('population'))
{% endhighlight %}

The resulting SQL query would be:

{% highlight sql %}
  SELECT "core_city"."name", "core_country"."name", SUM("core_city"."population") AS "population__sum"
    FROM "core_city" INNER JOIN "core_country" ON ("core_city"."country_id" = "core_country"."id")
GROUP BY "core_city"."name", "core_country"."name"
{% endhighlight %}

This would have no effect, because all the city names are unique, and they can't be grouped (the database will try to
group it, but each "group" will have only 1 row/instance). We can see it simply by performing a count on each queryset:

{% highlight python %}
City.objects.all().values('name', 'country__name').annotate(Sum('population')).count()
84

City.objects.all().values('country__name').annotate(Sum('population')).count()
29
{% endhighlight %}

That's what I meant when I said in the beginning of the post that, you are no longer interested in the details of each
row. When we group by country to get the sum of the population, we lost the details of the cities (at least in the
query result).

Sometimes it makes sense to have more than one value in the `values()` clause. For example if our database was composed
by City / State / Country. Then we could group by using `.values('state__name', 'country__name')`. This way you would
have the population by country. And you would avoid States from different countries (with the same name) to be grouped
together.

The values you generate on the database, using the `annotate` clause, can also be used to filter data. Usually in the
database we use the `HAVING` function, which makes it very idiomatic. You can read the query like it was plain English.
Now, in the Django side, it's a simple `filter`.

For example, let's say we want to see the total population by country, but only those countries where the total
population is greater than 50,000,000:

{% highlight python %}
City.objects.all() \
  .values('country__name') \
  .annotate(country_population=Sum('population')) \
  .filter(country_population__gt=50000000) \
  .order_by('-country_population')

[
  {'country__name': u'China', 'country_population': 309898600},
  {'country__name': u'United States', 'country_population': 102537091},
  {'country__name': u'India', 'country_population': 100350602},
  {'country__name': u'Japan', 'country_population': 65372000}
]
{% endhighlight %}

And finally the SQL query:

{% highlight sql %}
  SELECT "core_country"."name", SUM("core_city"."population") AS "country_population"
    FROM "core_city" INNER JOIN "core_country" ON ("core_city"."country_id" = "core_country"."id")
GROUP BY "core_country"."name" HAVING SUM("core_city"."population") > 50000000
ORDER BY "country_population" DESC
{% endhighlight %}

I hope you found this small tutorial helpful! If you have any questions, please leave a comment below!

