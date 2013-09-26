---
layout: post
title: Bioinformaticians need lab notebooks too
published: true
category: R
tags:
    - R
    - knitr
    - productivity
---

Biologists preach to their undergrads: "Write down everything you do in your lab notebook or in six months you will not remember why you did it". Quite true. I have tried to embrace this philosophy several times with pitiful results—probably because every time my subconscious convinced me that it wasn't worth the pain of implementing it; my code is in some file in my computer, so why bother?—Luckily, one day I discovered [knitr][] and became a lab notebook fanatic.

<!--excerpt-->

Read Jeromy Anglim's [great tutorial][jeromy_tutorial] to get started with knitr and Markdown, or watch Yihui Xie's [video tutorial][yihui_vid]. Now that knitr has taken center stage in my research, instead of hacking away at a problem, I create a knitr report and I intersperse my thought process with the code that I am writing, along with whatever figures and results get generated. It allows me to investigate different aspects of a problem to see which direction is more promising without losing sight of the big picture. I can also go back months later to know why I did something, or what my figures looked like. [This][live_sample_report] is what one of my reports looks like, and [this][code_sample_report] is the code that I used to generate it.

I know a lot of people love RStudio, but I prefer to code in the text editor I know and love, [Sublime Text][sublime]. I have shared the [snippets and commands][knitr_reports] I use to generate knitr reports, for those who are interested. It doesn't matter what tools you use, the point is to stop analyzing data in a having-a-bunch-of-scripts mindset and transition into a everything-is-explained-in-my-lab-notebook mindset.

## knitr is awesome at

* Sharing your results with your colleagues and advisors, at any stage of the analysis, without having to copy and paste images into a Word document.
* Modifying all your figures in a single step (for example, if you want to rename the axes of all your figures).
* Keeping track of code written in different languages (knitr supports R, Ruby, Bash, Perl, Python, Awk, among others)
* Documenting command line workflows (for example, what arguments you used to call TopHat, Samtools and HTSeq in your RNA-Seq pipeline).
* Coming up with easily modifiable examples to grok difficult statistical or machine learning concepts.

## knitr best practices
* Give meaningful names to your chunks. This ensures that generated images also get meaningful names. Chunk names must be unique to each report.
* Save functions in an regular R file and call them inside your knitr report. This allows you to reuse your code and produces cleaner reports.
* Use `opts_chunk$set` to set global chunk options, use local chunk options when needed.
* Each report should have all its generated images in its own folder.

The list goes on. If you have comments about how knitr has helped you with your research, please share.

## Links to learn more
* [Yihui's examples on Github][yihui_examples]
* [Questions about knitr in Stack Overflow][so_knitr]
* Neil Saunders's [great tutorial][css-in-rstudio] on using knitr with custom CSS in RStudio.

[knitr_reports]: https://github.com/nachocab/knitr_reports
[yihui_examples]: https://github.com/yihui/knitr-examples
[yihui_vid]: http://www.screenr.com/qcv8
[so_knitr]: http://stackoverflow.com/questions/tagged/knitr
[sublime]: http://www.sublimetext.com/
[knitr]: http://yihui.name/knitr/
[knitr_readme]: https://github.com/yihui/knitr#readme
[jeromy_tutorial]: http://jeromyanglim.blogspot.com.es/2012/05/getting-started-with-r-markdown-knitr.html
[live_sample_report]: http://htmlpreview.github.com/?https://github.com/nachocab/knitr_reports/blob/master/example_reports/sample_report.html
[code_sample_report]: https://github.com/nachocab/knitr_reports/blob/master/example_reports/sample_report.Rmd
[live_basic_usage]: http://htmlpreview.github.com/?https://github.com/nachocab/knitr_reports/blob/master/example_reports/basic_usage.html
[markdown]: http://daringfireball.net/projects/markdown/syntax
[css-in-rstudio]: https://nsaunders.wordpress.com/2012/08/27/custom-css-for-html-generated-using-rstudio/

