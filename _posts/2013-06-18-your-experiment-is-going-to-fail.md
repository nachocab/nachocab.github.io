---
layout: post
title: "Your experiment is going to fail"
published: true
category:
---
{% include JB/setup %}

Minimize the chance that your next experiment turns out to be a waste of time and money by making the following assumptions:

### 1) Half of your samples will be useless

If they do turn out to be useless, you will be covered. If they turn out great, you will have enough replicates to be confident about the significance of your results.

Also, you don't know which half will fail, so mix up the replicates. If you have two groups of ten patients, and you can only extract blood from ten patients in a day, don't do one group each day, do five from one group and five from the other each day. If you are sequencing their RNA, don't use one lane for each group. If each lane has samples from both groups, you can correct lane effects and you will be covered in case one lane is faulty.

<a href="http://reasoniamhere.com/clickme/count_nas_by_scan_date.html"><img src="/media/arrays_by_scan_date.png"></a>

[Click](http://reasoniamhere.com/clickme/count_nas_by_scan_date.html) the image for an interactive (zoomable) version.

Half of the samples in this [microarray](http://en.wikipedia.org/wiki/DNA_microarray) experiment turned out to be low quality. I was only able to figure out that the reason might be different scanning dates after looking around for extra information in the array files. It turns out that all the [jev samples](http://reasoniamhere.com/clickme/count_nas_by_initial_challenge.html) were analyzed in the same faulty batch, so they will have to be discarded. Luckily, a few of the denv4 samples were spared because they were done in the high quality arrays.

### 2) One experimental parameter will cause most of your variability

Maybe different people did the blood extractions each day, maybe half of the samples came from a different lab. You won't know which parameter will mess up your data, so you won't be able to avoid it, but you can the next best thing: write down all the information that you have about each sample in a plain text file.

If you must use Excel, make sure you don't encode information using just colors. If you do, somebody will have a to spend an hour making your table computer-readable (speaking from experience here).

**Don't do this**
<img src="/media/dont_do_this.png">

**Do this**
<img src="/media/do_this.png">

You might have been making these assumptions already. Great. But maybe you have a friend... you know, just tell them.