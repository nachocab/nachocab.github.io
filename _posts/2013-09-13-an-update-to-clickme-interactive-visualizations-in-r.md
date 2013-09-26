---
layout: post
title: "An Update to Clickme: Interactive Visualizations in R"
published: true
category: R
tags:
    - R
    - Clickme
    - visualization
---

I just released an [update](https://github.com/nachocab/clickme/releases/tag/0.3.1) that makes it easy to hide all the color groups in a scatterplot except one. Simply click on "Show one". This is very useful to carry out exploratory analyses when there are many color groups. You can zoom around the plot by scrolling up and down with the mouse wheel.

<!--excerpt-->

<iframe width = "1000" height = "840" src="{{site.url}}/clickme/iris_mds.html"> </iframe>

I think these types of plots are much more usable than the static ones that R generates by default:

![Plain Iris]({{ site.url }}/assets/plain_iris.png)

You can read more about Clickme at [rclickme.com](http://rclickme.com). To install (or update to) the latest version, run the following in R:

<pre><code>
    install.packages("devtools")

    library(devtools)
    install_github("clickme", "nachocab")

    library(clickme)
    clickme(points, 1:10)
</code></pre>

