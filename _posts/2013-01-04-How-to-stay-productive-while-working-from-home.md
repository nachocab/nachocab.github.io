---
layout: post
title: How to stay productive while working from home
published: true
category:
tags:
    - productivity
---

I have been working from home since 2008 and I love everything about it: the freedom to set my own work hours, the lack of interruptions, the life-transcending 20-minute [power naps][power_nap] after lunch. Working without adult supervision is empowering, but it can also be stressful. I remember the anxiety I had at the beginning, when I didn't know if I was working enough or too much, and struggled through work marathons that left me feeling tired and unproductive. Everything changed when I started tracking my work hours on a [spreadsheet][track_me_now]. Seeing how much I was slacking or working took away all the guiltiness and stress of my workday.

<!--excerpt-->

## Plan

Every morning I open my [time tracker][track_me_now] and decide how many hours I would like to work (usually 7 hours). Then I estimate how long my breaks will be throughout the day (I take about 2 hours of unadulterated breaks, including lunch and nap). For example, if I sat down to work at 10:10, I would be done by 19:10.

<div class="screenshot width_75"><img src="/media/track_me_now/plan.png"></div>

If I know I have to run an errand at 18:00, I can either update my work goal or cut back on breaks. I like to make this decision before I start working, while I am still objective. It also promotes the healthy habit of working sustainable hours, which is the only way to be productive in the long run.

## Work

Once I am happy with my work and break goals for the day, I clock in by entering the current time using Excel's shortcut `Ctrl Shift ,` (if your version of Excel is not in English, you might have to look up the shortcut. I know that in Spanish it is `Ctrl Shift .`). I might work for 45 minutes and then decide it is time for a break, so I go back to the tracker and clock out. I don't have a hard limit for how long my breaks are. The only rule is that I have to clock in once the break is over, that way I don't have to rely on my warped perception of time.

Clocking in and out throughout the work day makes it easy to see how much I have been working and how long my breaks have been. As I update the spreadsheet, the estimated end time is updated automatically. Depending on how I am doing, I might also manually update my work/break goal.

<div class="screenshot width_75"><img src="/media/track_me_now/work.png"></div>

I have a couple tricks for the few times when I forget to clock in or out:

* look at my browser's history to see when I accessed my email (usually the first thing I do when I am on a break)
* check at what time I ran my last command on the [terminal][terminal_ps1], or in the [R console][r_time].
* guesstimate

## Review

At the end of the day I look at my actual work hours, I decide how realistic my work goal actually was, and plan accordingly for the next day. That way I can plan accordingly for next day's goal. To start a new day, I simply select the B column in the tracker and press `Delete` to reset everything.

It might take some time getting used to, especially during the first week, or after a long vacation, but I hope it helps you gain a clearer picture of your work habits and makes you more productive.

Tell me if you found TrackMeNow useful. Comment below or star the [github page][track_me_now_github].

[track_me_now]: https://github.com/nachocab/track_me_now/blob/master/TrackMeNow.xlsx?raw=true
[track_me_now_github]: https://github.com/nachocab/track_me_now
[power_nap]: https://en.wikipedia.org/wiki/Power_nap#Benefits
[terminal_ps1]: http://www.cyberciti.biz/tips/howto-linux-unix-bash-shell-setup-prompt.html
[r_time]: http://stackoverflow.com/a/8480225/355567

