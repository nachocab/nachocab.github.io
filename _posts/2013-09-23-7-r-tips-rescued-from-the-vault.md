---
layout: post
title: "7 R Tips Rescued from the Vault"
published: true
category:
tags:
    - R
---

I keep a 2000-lines long [file](https://github.com/nachocab/tips_and_tricks/blob/master/R_tricks.R) full of R commands that I considered worthy of remembering at some point during the past 5 years. Life is too short, so here are 7 tips that don't get enough publicity, ranked from most to least awesome.

<!--excerpt-->

## Use "." to repeat the last returned value

This one is so useful, it should come enabled by default in every R installation. Stick this line in your `~/.Rprofile`

``` r
makeActiveBinding(".", function() .Last.value, .GlobalEnv)
```

Now open a new R console, and type:

``` r

# let's say you forgot to save some calculation in a variable.
rnorm(20)

# Now you can just use "."
a <- .

length(a) # 20
```

## Save objects into variables

Use `saveRDS` and `readRDS` instead of `save` and `load`, so you can read from, and write to, objects with different names.

``` r
a <- rnorm(1e5)
saveRDS(a, file="my_object.rds")

b <- readRDS("my_object.rds")
```

## Get the arguments used by a function

``` r
# I used to do this to quickly look up the usage of a function
head(read.csv)

# but this is better
args(read.csv)
# function (file, header = TRUE, sep = ",", quote = "\"", dec = ".",
#     fill = TRUE, comment.char = "", ...)
# NULL
```

## Add names to a vector in one step

``` r
# instead of
tmp <- 1:3
names(tmp) <-  c("foo", "bar", "baz")

# use setNames()
tmp <- setNames(1:3, c("foo", "bar", "baz"))
```

## Store meta information using attributes

``` r
a <- data.frame(x = 1:3, y = 4:6)
attr(a, "experiment_id") <- "exp_1"

# you can still use the object like you normally would
a
# but you can also easily access is related information
attr(a, "experiment_id") # exp_1

# you can also initialize multiple attributes at once
# but realize that it overwrites whatever arguments you had previously set
attributes(a) <- list(sample_number = 1, sample_id = "ABC")

attributes(a)
# $sample_number
#  [1] 1
# $sample_id
#  [1] "ABC"
```

## Paginate long objects or files

It works just like Unix's `less` command, so you can move up and down with the arrow keys, the space bar, `shift g` and `gg` to advance a move line by line, screen by screen, go to the end, or back to the beginning, respectively.

``` r
page(rnorm(1e5))
```

## Ensure that functions only accept a limited set of arguments

``` r
# Only "A" and "B" are allowed
a <-function(x, y = c("A","B")){
  y <- match.arg(y)
  y
}
a() # y equals "A"
a(3,"A") # y equals "A"
a(3,"B") # y equals "B"
a(3,"C") # Error in match.arg(y) : 'arg' should be one of “A”, “B”
```
