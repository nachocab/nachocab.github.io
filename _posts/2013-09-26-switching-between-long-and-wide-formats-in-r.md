---
layout: post
title: Switching Between Long and Wide Formats in R
published: true
category:
tags:
    - R
    - tutorial
---

This is a basic tutorial in R for switching between the two most common data formats: wide and long. The example dataset we will use is made up of [RT-PCR](https://en.wikipedia.org/wiki/Rt_pcr) threshold cycle (Ct) values under two conditions (A and B), with two replicates each.

<!--excerpt-->


Download the file by running this in your command line:

``` bash
wget https://raw.github.com/nachocab/nachocab.github.io/master/assets/pcr.txt
```

Once you have the file, open up an R session and load it in a variable. Instead of creating multiple variables, we will be proactive and create a list variable `d` that will hold them all. This makes them much easier to manage.

``` r
d <- list()
d$wide <- read.csv("pcr.txt", sep = "\t") # columns are separated by tabs
d$wide
#       gene    A1    A2    B1    B2
# 1   GENE_1 35.41 36.60 29.96 29.73
# 2   GENE_2 36.60 23.45 24.39 24.74
# 3   GENE_3 29.96 23.30 32.17 25.94
# 4   GENE_4 29.73 22.84 31.66 26.22
# 5   GENE_5 34.46 22.79 31.39 24.75
# 6   GENE_6 35.66 21.37 31.34 24.72
# 7   GENE_7 33.28 21.74 31.10 25.39
# 8   GENE_8 33.03 22.96 30.90 25.65
# 9   GENE_9 26.58 22.87 31.14 30.57
# 10 GENE_10 26.05 25.18 31.03 29.99
# 11 CONTROL 26.60 25.60 26.03 25.79
```

This variable is formatted in the typical style used in spreadsheets (it is known as *wide format* because each data group corresponds to a different column), but for some calculations it is easier to use a more redundant format called a *long format* because each data item corresponds to a different row.

The easiest way to convert from wide to long is to use the `reshape2` package.

``` r
# Install the package
install.packages("reshape2")

# And use it
library(reshape2)
d$long <- melt(d$wide) # Using gene as id variables
# rename the columns
colnames(d$long) <- c("gene", "sample_id", "ct_value")

d$long
#       gene sample_id ct_value
# 1   GENE_1        A1    35.41
# 2   GENE_2        A1    36.60
# 3   GENE_3        A1    29.96
# 4   GENE_4        A1    29.73
# 5   GENE_5        A1    34.46
# 6   GENE_6        A1    35.66
# 7   GENE_7        A1    33.28
# 8   GENE_8        A1    33.03
# 9   GENE_9        A1    26.58
# 10 GENE_10        A1    26.05
# 11 CONTROL        A1    26.60
# 12  GENE_1        A2    36.60
# 13  GENE_2        A2    23.45
# 14  GENE_3        A2    23.30
# 15  GENE_4        A2    22.84
# 16  GENE_5        A2    22.79
# 17  GENE_6        A2    21.37
# 18  GENE_7        A2    21.74
# 19  GENE_8        A2    22.96
# 20  GENE_9        A2    22.87
# 21 GENE_10        A2    25.18
# ...
```

The long format makes it easy to perform operations on subsets of the data. For example, say we want to calculate the mean of the A samples for each gene. First we will need an extra variable to distinguish between the sample groups. We can create it by simply removing the numbers from `sample_id`.

``` r
# The `gsub` function has three arguments: the pattern, the replacement and the input. Run ?gsub for more info.
d$long$sample_group <- gsub("\\d", "", d$long$sample_id)
d$long

#       gene sample_id ct_value sample_group
# ...
# 19  GENE_8        A2    22.96            A
# 20  GENE_9        A2    22.87            A
# 21 GENE_10        A2    25.18            A
# 22 CONTROL        A2    25.60            A
# 23  GENE_1        B1    29.96            B
# 24  GENE_2        B1    24.39            B
# 25  GENE_3        B1    32.17            B
# 26  GENE_4        B1    31.66            B
# 27  GENE_5        B1    31.39            B
# ...
```

*NOTE*: In R, backslashes `\` in [regular expressions](http://www.regular-expressions.info/quickstart.html) must be escaped with an extra backslash (for example, `\\d`).

Now we can use the `aggregate` function to calculate the mean Ct value and standard deviation for each gene under each condition.

``` r
d$long_by_group <- aggregate(ct_value ~ sample_group + gene, data = d$long, mean)
colnames(d$long_by_group)[3] <- "mean_ct_value"
d$long_by_group$sd <- aggregate(ct_value ~ sample_group + gene, data = d$long, sd)[,3]

d$long_by_group
#    sample_group    gene mean_ct_value        sd
# 1             A CONTROL        26.100  0.707107
# 2             B CONTROL        25.910  0.169706
# 3             A  GENE_1        36.005  0.841457
# 4             B  GENE_1        29.845  0.162635
# 5             A GENE_10        25.615  0.615183
# 6             B GENE_10        30.510  0.735391
# ...
```

This function is a bit unwieldy (for example, it reorders the rows and changes the column names), so it's worth to pay attention to what the output looks like. The tilde `~` expression is called a formula, you can read more about it [here](http://ww2.coastal.edu/kingw/statistics/R-tutorials/formulae.html).

Now that we have calculated the mean and standard deviation for each gene-sample_group pair, it is easy to convert them back to wide format using `dcast`, a function from the `reshape2` package.

``` r
d$wide_mean_by_group <- dcast(d$long_by_group, gene ~ sample_group, value.var = "mean_ct_value")

d$wide_mean_by_group
#       gene      A      B
# 1  CONTROL 26.100 25.910
# 2   GENE_1 36.005 29.845
# 3  GENE_10 25.615 30.510
# 4   GENE_2 30.025 24.565
# 5   GENE_3 26.630 29.055
# 6   GENE_4 26.285 28.940
# 7   GENE_5 28.625 28.070
# 8   GENE_6 28.515 28.030
# 9   GENE_7 27.510 28.245
# 10  GENE_8 27.995 28.275
# 11  GENE_9 24.725 30.855

d$wide_sd_by_group <- dcast(d$long_by_group, gene ~ sample_group, value.var = "sd")

d$wide_sd_by_group
#       gene         A        B
# 1  CONTROL  0.707107 0.169706
# 2   GENE_1  0.841457 0.162635
# 3  GENE_10  0.615183 0.735391
# 4   GENE_2  9.298454 0.247487
# 5   GENE_3  4.709331 4.405275
# 6   GENE_4  4.871966 3.846661
# 7   GENE_5  8.251936 4.695189
# 8   GENE_6 10.104556 4.681047
# 9   GENE_7  8.160012 4.037580
# 10  GENE_8  7.120565 3.712311
# 11  GENE_9  2.623366 0.403051
```

An easy way to remember how to use the formula in `dcast` is to think `row ~ column`. In our case, we have a row for each gene, and a column for each sample group.
