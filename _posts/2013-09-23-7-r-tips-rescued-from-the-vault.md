---
layout: post
title: "7 R Tips Rescued from the Vault"
published: true
category:
tags:
    - R
---

I keep a 2000-line [file](https://github.com/nachocab/tips_and_tricks/blob/master/R_tricks.R) full of R commands that I considered worthy of remembering at some point during the past 5 years. Life is too short, so here are my favorite 7 that don't get enough publicity, ranked from most to least awesome.

<!--excerpt-->

## Use "." to repeat the last returned value

This one is so useful, it should come enabled by default in every R installation. Stick this line in your `~/.Rprofile`

<pre><code class="r">
makeActiveBinding(".", function() .Last.value, .GlobalEnv)
</code></pre>

Now open a new R console, and type:

<pre><code class="r">
rnorm(20)

# let's say you forgot to save the previous value in a variable.
# Now you can just use "."
a <- .
length(a) # 20
</code></pre>

## Save objects into a variable

Use `saveRDS` and `readRDS` instead of `save` and `load`, so you can read from and write to objects with different names.

<pre><code class="r">
a <- rnorm(1e5)
saveRDS(a, file="my_object.rds")

b <- readRDS("my_object.rds")
</code></pre>

## Get the arguments used by a function

<pre><code class="r">
# I used to do this
head(read.csv)

# but this is better
args(read.csv)
# function (file, header = TRUE, sep = ",", quote = "\"", dec = ".",
#     fill = TRUE, comment.char = "", ...)
# NULL
</code></pre>

## Add names to a vector in one step

<pre><code class="r">
# instead of
tmp <- 1:3
names(tmp) <-  c("foo", "bar", "baz")

# use setNames()
tmp <- setNames(1:3, c("foo", "bar", "baz"))
</code></pre>

## Instead of creating multiple related objects, use "attributes"

<pre><code class="r">
a <- rnorm(20)
attributes(a) <- list(sample_number = 1, sample_id = "ABC") # you can create this object directly with: structure(c(4, 20, 40), max = 100, min = 0)

attributes(a)
# $sample_number
#  [1] 1
# $sample_id
#  [1] "ABC"
</code></pre>

## Paginate long objects or files

It works just like Unix's `less` command

<pre><code class="r">
page(rnorm(1e5))
</code></pre>

## Ensure that functions only accept a limited set of arguments

<pre><code class="r">
# Only "A" and "B" are allowed
a <-function(x, y = c("A","B")){
  y <- match.arg(y)
  y
}
a() # y equals "A"
a(3,"A") # y equals "A"
a(3,"B") # y equals "B"
a(3,"C") # Error in match.arg(y) : 'arg' should be one of “A”, “B”
</code></pre>
