---
layout: post
title: "My PhD Research Project: Diagnosing Viral Infections"
published: true
category:
tags:
    - science
---
{% include JB/setup %}

I gave a presentation today in the Microbiology departmental retreat at Boston University, so I though I'd share it.

![presentation](https://lh5.googleusercontent.com/-nzVbaorZHoY/UjzzWilVUuI/AAAAAAAAEUA/5--h0EgJKbU/w500-no/lassa+title.png)

The goal of the research project I have been working on for the past two years, as part of my Bioinformatics PhD at Boston University, is to use blood samples from infected patients to determine which virus is causing the infection.

Traditional diagnostic methods, like detection by [ELISA](https://en.wikipedia.org/wiki/ELISA), are only effective after the virus has had enough time to replicate in the blood of the patient. However, for some viral infections, when this happens it is already too late for the treatment to be effective.

The approach that we have taken in my lab is to measure the transcriptional changes that take place in the peripheral blood cells, and identify patterns of expression that are unique for each type of infection. This indirect way of viral detection has the potential to reduce diagnosis time by several days, since it is known that these transcriptional changes precede the appearance of virus particles in the blood, and we believe that they are specific enough to discriminate between viruses.

To test our hypothesis, we sequenced the RNA from [PBMCs](https://en.wikipedia.org/wiki/PBMC) that were extracted from two groups of monkeys; one infected with Lassa virus, and the other with Marburg virus.

After comparing the expression of the samples extracted 3 days post-infection with those taken before infection, we identified multiple genes that showed strong changes in expression. Most of these genes play important roles in innate immunity pathways, so we expected them to be highly expressed in both infections.

What we found most surprising was the number of genes that showed different patterns of expression depending on what virus was causing the infection. Using only the expression patterns of a handful of genes, we were able to correctly classify unknown samples into three groups: uninfected, infected with Lassa virus, and infected with Marburg virus.

Our hope is that these results will be integrated in a diagnostic kit to easily identify Lassa and Marburg infected patients in areas where these diseases are common, but there is still a long way to go.

Here is the presentation I gave today.

<iframe src="http://www.slideshare.net/slideshow/embed_code/26398948" width="600" height="500" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen webkitallowfullscreen mozallowfullscreen> </iframe>
