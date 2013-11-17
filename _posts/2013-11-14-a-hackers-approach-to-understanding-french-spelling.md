---
layout: post
title: A Hacker's Approach to Understanding French Spelling
published: true
category:
tags:
    - french
    - "data mining"
    - awk

---

Non-native French speakers like myself have a hard time grappling with the French spelling system. It may seem arbitrary to write **seconde** and pronounce it **segond**, or frustrating that there is no rule to define why **déçu** has an accent on the **e**, but **reçu** doesn't.

>C'est la vie, mon ami.— say the French

Now that I live in French Guiana, I am trying to come up with strategies to make these words easier to learn.

<!--excerpt-->

## Focus on the most common words

Dictionaries sort words by alphabetical order, which is convenient if you are looking for a definition, but masochistic if you are trying to figure out which words are the important ones.

One way is to sort them by frequency of usage. You take a bunch of French text and you count how many times each words appears, then you sort them by their frequency. Common words like **de**, **je** and **le** appear at the very top, and words like **macarron**, **compétiteur** and an **antisportif** show up at the bottom.

You have to do some trickery to combine words that share the same stem (for example: **enchanté**, **enchantée**, **enchantés** and **enchantées**) so they all add up as the same word, but it's manageable. [Here](https://github.com/nachocab/french_experiments/blob/master/fr_frequency_stems.txt) is my quick-and-dirty attempt to sort French words based on their usage (the file has four columns: stem, frequency, the most common word with that stem, that word without any accents (I use this column to play a [guessing game](https://github.com/nachocab/french_experiments/blob/master/play))).

Once you have that file, you can start enjoying some seriously fun language-geekery.

## Finding patterns amid the French chaos

The White Whale of French accents has to be the **é**. Every French student knows that the **participe passé** of -er verbs like **chanter** ends in é (<strong>chanté</strong>), but what are the rules governing words like **préféré**, **élève**, or **fréquence**?

Some [sites](http://orthonet.sdv.fr/pages/informations_p6.html) can tell you the multiple spelling rules with their corresponding multiple exceptions, but they are not very helpful because our brains are not wired to deal with detailed rules and exceptions. Besides, native French speakers don't study these rules. What we excel at is association and intuition. It's much easier to memorize the lyrics of a song than 100 random words.

## Divide and conquer

I have always wanted to know if I should accent words that begin with **e**. In the past, I grabbed my *Petit Robert* and tried making a list of words that began with **é** and another of words that began with **e**. I then promptly went on to forget everything from both lists.

A better approach is to focus on a few common words each day and reverse engineer the spelling rules. To add another layer of association, you can group them by type of word: words that begin with **é**, words that contain two **é**s separated by a consonant, words that have an **é** in the second position. Pick whatever you are having trouble with.

## Focus on the exceptions: words that begin with é

For example, I can use [AWK](http://reasoniamhere.com/2013/09/16/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-1/) to grab all the words that start with either **é** or **e** and show their frequency:

``` bash
awk '$3 ~ "^é" && $2 > 500 {print $2, $3}' fr_frequency_stems.txt

170230 était
28392 écoute
12778 étrange
12660 école
10824 équipe
...
561 élite
543 épingle
538 éclaté
518 épicerie
501 écureuil
```

In total, there are 123 words, but they are not all equally important: **école** is 25 times more common than **épicerie**.

Let's see what words that start with **e** look like:

``` bash
awk '$3 ~ "^e" && $2 > 500 {print $2, $3}' fr_frequency_stems.txt

69775 encore
50094 entendu
42068 enfants
27877 entre
25380 elles
...
528 effraie
519 endommagé
509 edgar
508 estimé
506 endurer
```

There are around 200 commonly-used words that start with **e**. If we compare both lists we can see that no word that starts with **é** is followed by an **x**, an **s**, or a double consonant (<strong>ll</strong>, **rr**, **ff**).

``` bash
awk '$3 ~ "^é[xs]|^é(ll|rr|ff)" && $2 > 500 {print $2, $3}' fr_frequency_stems.txt | wc -l

0 # extra essai ellipse erreur effacer ...
```

We can also see that words that start with **e** seem to be followed by **n** or **m**, and that only a handful of words break this rule:

``` bash
awk '$3 ~ "^e[nm]" && $2 > 500 {print $2, $3}' fr_frequency_stems.txt | wc -l
108 # ex: entendu enfants entre ensemble endroit ...
...

awk '$3 ~ "^é[nm]" && $2 > 500 {print $2, $3}' fr_frequency_stems.txt

3661 énorme
3193 énergie
2474 énerve
2344 émission
2229 émotions
```

The words that break the **n/m** rule contain an **é** that is pronounced by itself (it forms its own syllable), unlike the rest of *en/em* words. You should focus your memorization efforts on these outcasts and assume that the remaining words follow the rule.

## Guess wisely: words with é in the second position

We can use a similar approach to look at words that have **é** in the second position:

``` bash
awk '$3 ~ "^.é" && $2 > 500 {print $3}' fr_frequency_stems.txt | cut -c2 | sort | uniq -c | sort -k1,1gr
    113 dé
     64 ré
     19 mé
     16 sé
     15 pé
     10 hé
      9 lé
      8 gé
      8 né
      7 bé
      7 té
      7 vé
      6 cé
      6 fé
```

Holy Molly! This breakdown shows that words that begin with **dé** or **ré** make up 60% of the common words that have é in the second position ((113 + 64) / 300). Let's focus on those two.

``` bash
awk '$3 ~ "^de" && $2 > 500 {print $3}' fr_frequency_stems.txt | wc -l
62

awk '$3 ~ "^re" && $2 > 500 {print $3}' fr_frequency_stems.txt | wc -l
152
```

Well, that's interesting. There are twice as many **dé** words than **de** words, but there are twice as many **re** words as there are **ré** words. This means that if you are not sure how to accent a word you should guess **dé** and **re**.

Unfortunately there doesn't seem to be any obvious rules that we can follow to determine if these words should have **é** or **e**, so we will have to come up with our own associations.

For example, memorizing words that look alike is easier if we focus on their differences rather than if we learn them independently:

> début - debout

> désert - dessert

> démarrer - demander

> détruire - destruction

> déssigner - design

You can also make up memorable stories:

> La se**cré**taire a gardé l'accent de se**cre**t

There are hundreds of little tricks but this post has gone on long enough. I hope this approach makes your studying more effective. Let me know how it goes and share your own strategies in the comments.
