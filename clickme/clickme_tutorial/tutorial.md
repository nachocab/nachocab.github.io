---




# Clickme Points Example

This example showcases some of the features of the Clickme template Points.

Clickme is an R package to create interactive visualizations. Each visualization is defined in a modified HTML file called a template. To generate a new visualization, we call the `clickme` function, passing it the name of a template and the data we want to visualize:

```r
library(clickme)
clickme("points", rnorm(10))
```


<iframe width = "1000" height = "800" src="tutorial0.html"> </iframe>


Things you can do:

* Zoom in and out using your mouse wheel or trackpad.
* Click and drag to move around.
* Click on `Show names` to toggle the name of each point.
* Hover over individual points to see additional information.


## Install

You can install clickme by running the following in R

```r
# you don't need to run this line if you already have the devtools package installed.
install.packages("devtools")

# every time you run these two lines you update to the latest version of Clickme. Feel free to do so as often as you like.
library(devtools)
install_github("clickme", "nachocab")

# this line loads Clickme. You can put it in your .Rprofile so it is always ready to use.
library(clickme)
```

## Flexible data types

Clickme understands the main data types in R. You can pass it any of the following data arguments:

* a vector (it will be used for the x)
* two vectors (the first will be used for the x, and the second for the y)
* a dataframe or a matrix (the first column will be used for the x, and the second for the y)
features
* a vector and a dataframe or a matrix (the vector will be used for the x, and the matrix for the y)

Why is this useful? For example, let’s say our data is in a matrix where each column represents a letter. Instead of renaming the columns of the matrix, we can just specify the x labels directly:

```r
x <- c("A", "B", "C")
data <- matrix(1:9, nrow = 3)
clickme("points", x, data)
```


<iframe width = "1000" height = "800" src="tutorial0b.html"> </iframe>


## Categorical variables

Like we saw before, the `x` and `y` variables can contain numbers (quantitative variables) as well as strings (categorical variables). Because categorical variables can be ordered in different ways (unlike numbers, which have a defined order), we have more options on how we display our data.

```
set.seed(1)
x <- sample_r(letters[1:5], 100)
y <- rnorm(100)
clickme("points", x, y,
        xlab = "Letter")

```

<iframe width = "1000" height = "800" src="tutorial5.html"> </iframe>


This is not very useful because of overplotting. We can minimize it by introducing a small jitter.

```
clickme("points", x, y,
        xlab = "Letter",
        jitter = .2)

```

<iframe width = "1000" height = "800" src="tutorial6.html"> </iframe>


We can change the ordering of the x axis is by using a factor.

```
x <- factor(sample_r(letters[1:5], 100), levels = letters[1:5])
clickme("points", x, y,
        xlab = "Letter",
        jitter = .2)

```

<iframe width = "1000" height = "800" src="tutorial6c.html"> </iframe>


## Easy coloring

If we want to color points by the sign of the x varaible, we can specify a vector that contains two groups, a positive and a negative group.

```r
set.seed(1)
data <- data.frame(x = rnorm(100), y = rnorm(100))
positives_and_negatives <- ifelse(data$x > 0, "positive", "negative")

clickme("points", data,
        color_groups = positives_and_negatives,
        color_title = "Sign of x")
```

<iframe width = "1000" height = "800" src="tutorial2.html"> </iframe>


We can use any variable to specify the color groups, it doesn’t have to be a column of `data`. The only requirement is that it must have as many elements as the data variable has rows.

The counts of each group are calculated automatically, which is often useful when you have multiple categories.

Let’s change the color palette

```
clickme("points", data,
        color_groups = positives_and_negatives,
        color_title = "Sign of x",
        palette = c(negative = "green", positive = "orange"))
```

<iframe width = "1000" height = "800" src="tutorial10.html"> </iframe>


What if we wanted to ensure that the positives appeared on top of the negatives in the color legend? Instead of reordering the data manually, we can just change the order of the palette.
```
clickme("points", data,
        color_groups = positives_and_negatives,
        color_title = "Sign of x",
        palette = c(positive = "orange", negative = "green"))
```

<iframe width = "1000" height = "800" src="tutorial11.html"> </iframe>


## Other features

We can introduce additional information that shows up when we hover over each point

```r
distance <- rnorm(100, mean = 100)

clickme("points", data,
        color_groups = positives_and_negatives,
        color_title = "Sign of x",
        palette = c(positive = "orange", negative = "green"),
        extra = list(distance = distance))
```

<iframe width = "1000" height = "800" src="tutorial15.html"> </iframe>

