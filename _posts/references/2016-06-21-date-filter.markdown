---
title: Date Template Filter
date: 2016-06-21 12:00:00 +0300
category: references
tags: django templatefilter
thumbnail: "/media/2016/06/featured-date.jpg"
featured_image: "/media/2016/06/featured-date.jpg"
---

List of the most used Django date template filters to format date according to a given format, semantically ordered.

<table style="width: 100%">
  <thead>
    <tr>
      <th>Format character</th>
      <th>Description</th>
      <th>Example output</th>
    </tr>
  </thead>
  <tbody>

    <tr>
      <th colspan="3" style="text-align:center; background-color: #f0f0f0">
        Day
      </th>
    </tr>
    <tr>
      <td>d</td>
      <td>Day of the month, 2 digits with leading zeros.</td>
      <td><code>01</code> to <code>31</code></td>
    </tr>
    <tr>
      <td>j</td>
      <td>Day of the month without leading zeros.</td>
      <td><code>1</code> to <code>31</code></td>
    </tr>
    <tr>
      <td>S</td>
      <td>English ordinal suffix for day of the month, 2 characters.</td>
      <td><code>st</code>, <code>nd</code>, <code>rd</code> or <code>th</code></td>
    </tr>

    <tr>
      <th colspan="3" style="text-align:center; background-color: #f0f0f0">
        Month
      </th>
    </tr>
    <tr>
      <td>m</td>
      <td>Month, 2 digits with leading zeros.</td>
      <td><code>01</code> to <code>12</code></td>
    </tr>
    <tr>
      <td>n</td>
      <td>Month without leading zeros.</td>
      <td><code>1</code> to <code>12</code></td>
    </tr>
    <tr>
      <td>b</td>
      <td>Month, textual, 3 letters, lowercase.</td>
      <td><code>jan</code></td>
    </tr>
    <tr>
      <td>M</td>
      <td>Month, textual, 3 letters.</td>
      <td><code>Jan</code></td>
    </tr>
    <tr>
      <td>F</td>
      <td>Month, textual, long.</td>
      <td><code>January</code></td>
    </tr>

    <tr>
      <th colspan="3" style="text-align:center; background-color: #f0f0f0">
        Year
      </th>
    </tr>
    <tr>
      <td>y</td>
      <td>Year, 2 digits.</td>
      <td><code>99</code></td>
    </tr>
    <tr>
      <td>Y</td>
      <td>Year, 4 digits.</td>
      <td><code>1999</code></td>
    </tr>

    <tr>
      <th colspan="3" style="text-align:center; background-color: #f0f0f0">
        Week
      </th>
    </tr>
    <tr>
      <td>D</td>
      <td>Day of the week, textual, 3 letters.</td>
      <td><code>Fri</code></td>
    </tr>
    <tr>
      <td>l</td>
      <td>Day of the week, textual, long.</td>
      <td><code>Friday</code></td>
    </tr>

    <tr>
      <th colspan="3" style="text-align:center; background-color: #f0f0f0">
        Hours
      </th>
    </tr>
    <tr>
      <td>G</td>
      <td>Hour, 24-hour format without leading zeros.</td>
      <td><code>0</code> to <code>23</code></td>
    </tr>
    <tr>
      <td>H</td>
      <td>Hour, 24-hour format.</td>
      <td><code>00</code> to <code>23</code></td>
    </tr>
    <tr>
      <td>g</td>
      <td>Hour, 12-hour format without leading zeros.</td>
      <td><code>1</code> to <code>12</code></td>
    </tr>
    <tr>
      <td>h</td>
      <td>Hour, 12-hour format.</td>
      <td><code>01</code> to <code>12</code></td>
    </tr>
    <tr>
      <td>a</td>
      <td><code>a.m.</code> or <code>p.m.</code></td>
      <td><code>a.m.</code></td>
    </tr>
    <tr>
      <td>A</td>
      <td><code>AM</code> or <code>PM</code>.</td>
      <td><code>AM</code></td>
    </tr>

    <tr>
      <th colspan="3" style="text-align:center; background-color: #f0f0f0">
        Minutes
      </th>
    </tr>
    <tr>
      <td>i</td>
      <td>Minutes.</td>
      <td><code>00</code> to <code>59</code></td>
    </tr>

    <tr>
      <th colspan="3" style="text-align:center; background-color: #f0f0f0">
        Seconds
      </th>
    </tr>
    <tr>
      <td>s</td>
      <td>Seconds, 2 digits with leading zeros.</td>
      <td><code>00</code> to <code>59</code></td>
    </tr>

  </tbody>
</table>

Reference: [Built-in template tags and filters: date](https://docs.djangoproject.com/en/1.9/ref/templates/builtins/#date){:target="_blank"}
