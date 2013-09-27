---
layout: post
title: "AWK GTF! How to Analyze a Transcriptome Like a Pro - Part 3"
published: true
category:
tags:
    - tutorial
    - bioinformatics
    - awk
---

This post belongs to a 3-part series on AWK: [Part 1](http://reasoniamhere.com/2013/09/16/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-1) - [Part 2](http://reasoniamhere.com/2013/09/17/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-2) - **Part 3**

We finished [Part 2](http://reasoniamhere.com/2013/09/17/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-2) by creating an associative array, increasing the value of each of its keys for every line that contained a matching key, and used the `END` rule to print each key's final count.

<!--excerpt-->

In this post, we will apply the translator pattern to turn the gene symbols used in the [transcriptome](http://reasoniamhere.com/2013/09/16/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-1/#get_the_data) we have been working with into official [HGNC symbols](http://www.genenames.org/cgi-bin/hgnc_stats).

## Calling AWK with an external file

We have been calling AWK directly from the command line, but this approach can be limiting sometimes. The alternative is to use the `-f` option to tell AWK where the code is (in this case, in the `source_counter.awk` file).

``` bash
# create the instructions for AWK
echo 'NR > 5 {
    source_counter[$2] += 1
}

END {
    for (source_name in source_counter){
        print source_name, source_counter[source_name]
    }
}' > source_counter.awk

# run AWK
awk -f source_counter.awk transcriptome.gtf

HAVANA 2257550
ENSEMBL 357012
```

`NR` is a special variable that contains the current line number (AWK calls lines records, which explains the R). `NR > 5` tells AWK to execute the code between the curly braces only when the line number is greater than 5, so it skips the first 5 lines. We do this to get rid of the header lines that appear at the beginning of the Gencode transcriptome file.

Remember you still have to provide AWK with an input file (`transcriptome.gtf`) or use a pipe (`cat transcriptome.gtf | awk -f source_counter.awk`). If you don't, AWK will just sit there quietly until it receives an input that will never arrive. This is bound to happen to you at some point; when it does, press `ctrl c`, smack your forehead and start again.

## Splitting strings

The following two commands create the files that we will use for the rest of the post. Run them so you can play along.

``` bash
echo '
ZYX_CTSL 40
WVU_CTSV 21
TSR_MYCL 11
QPO_KMT2A 155
NML_HSP90AB1 36
KJI_CAPN7 52
HGF_DACH2 84
EDC_IFNA14 1' > exon_counts.txt

# the format of the translator is UNOFFICIAL_GENE_NAME OFFICIAL_GENE_NAME
echo '
CTSL CTSL1
FLJ31037 CTSL1
MGC125957 CTSL2
CTSU CTSL2
CTSV CTSL2
CATL2 CTSL2
MYCL MYCL1
LMYC MYCL1
KMT2A MLL
ALL-1 MLL
HTRX1 MLL
KMT2A MLL
CXXC7 MLL
TET1-MLL MLL
MLL1A MLL
FLJ11783 MLL' > translator.txt
```

Imagine that you found `exon_counts.txt` in the supplementary materials section of a paper from a rival lab, and you want to compare their results with yours. Unfortunately, they seem to enjoy prepending their gene symbols with a strange (but vaguely familiar) code followed by an underscore. How do we get rid of it?

AWK to the rescue. We can use `split`, one of its [functions](http://www.gnu.org/software/gawk/manual/html_node/String-Functions.html) to manipulate strings:

``` bash
echo "HOLY-GUACAMOLE" | awk '{ split($1, words, "-"); print words[2] }' # GUACAMOLE
echo "HOLY-GUACAMOLE" | awk '{ split($1, words, "-"); print words[1] }' # HOLY
echo "HOLY-GUACAMOLE-CHIMICHANGA" | awk '
{
    split($1, words, "-")
    print "I would like", words[2], "in my", words[3] ", please"
}' # I would like GUACAMOLE in my CHIMICHANGA, please
```

Its first argument is the **string** that we want to split, the second is the name of the **array** variable that will contain the pieces of the string that we split, and the third is the **delimiter** that we want to use to separate the string into pieces. In this case, we chose to call the array variable `words`. An array can be considered as a special case of the associative array, where the keys are numbers, instead of words.

The semicolon in the first two commands is just a way to be lazy and write more than one function (`split`, `print`) in the same line.

Notice a small subtlety hidden among the Tex-Mex: there is no comma between `words[3]` and `", please"`. If there was, the output would be `CHIMICHANGA , please`. Because there is no comma, AWK simply appends the two strings without inserting the default output separator (the space).

Now we are ready to get rid of the reverse-alphabetical madness.

``` bash
awk '{
    split($1, words, "_")
    print words[2], $2
}' exon_counts.txt > exon_counts2.txt

cat exon_counts2.txt

CTSL 40
CTSV 21
MYCL 11
KMT2A 155
HSP90AB1 36
CAPN7 52
DACH2 84
IFNA14 1
```

## Building a translation dictionary

Watch the magic unfold:

``` bash
awk -v translations_file="translator.txt" '
BEGIN{
    while (getline < translations_file) {
        translations[$1] = $2
    }
    close(translations_file)
}

{
    if (translations[$1] != ""){
       $1 = translations[$1]
       $3 = "translated"
    } else {
       $3 = "untranslated"
    }
   print
}' exon_counts2.txt

# output
CTSL1 40 translated
CTSL2 21 translated
MYCL1 11 translated
MLL 155 translated
HSP90AB1 36 untranslated
CAPN7 52 untranslated
DACH2 84 untranslated
IFNA14 1 untranslated
```

I always have to look up the exact syntax for the translator pattern because I never remember, but it's so useful that I keep it in an easily accessible [text file](https://github.com/nachocab/tips_and_tricks/blob/master/bash_tricks.sh), along with all the other useful-but-impossible-to-remember commands.

A lot is going on here.

``` bash
awk -v translations_file="translator.txt" '...' exon_counts2.txt
```

The `-v` option is used to create variables that can be used by AWK in the code that goes between the single quotes. In this case we are creating a variable called `translations_file` with value `"translator.txt"`. Due to the Holy UNIX Commandments, no spaces are allowed around the equals sign (this rule doesn't apply inside AWK, though).

``` bash
BEGIN{ ... }
```

The `BEGIN` rule does the opposite of the `END` rule: it is true before the input file (`exon_counts2.txt`) is read, and false thereafter.

``` bash
while (condition) { ... }
```

Similar to the `for` loop that we saw in the previous post, there is also a `while` loop, which runs until the condition between the parentheses stops being true.

``` bash
while (getline < translations_file) {
    translations[$1] = $2
}
close(translations_file)
```

`getline < some_file` is an [internal](http://www.gnu.org/software/gawk/manual/html_node/Getline.html#Getline) AWK command that lets you read the next line from a different file than the standard input file. After the line is read, the dollar `$` variables are updated, so we can use `$1` and `$2` just like we usually do. The file must then be closed to avoid angering the UNIX gods.

*NOTE*: There is a lot of wizardry that surrounds the `getline` command. Ninety percent of the time, the translator pattern is enough. If you want to do fancier stuff, like using a translator file with a different input delimiter than the one used by the input file, it's worth spending an hour reading the [documentation](http://www.gnu.org/software/gawk/manual/html_node/Getline.html#Getline) to understand all the nitty-gritties.

`translations` is an associative array that has the bad gene symbols as keys, and the official gene symbols as values. The `translator.txt` file doesn't have any repeats in column one, so we can be sure that each bad symbol only has one good translation. But our toy translator file doesn't have all the gene symbols that appear in `exon_counts2.txt` (HSP90AB1 is missing, for example).


``` bash
if (translations[$1] != ""){
   $1 = translations[$1]
   $3 = "translated"
} else {
   $3 = "untranslated"
}
```

We check this by using an `if` statement, which only executes the code inside the braces if what is between the parentheses is true. In our example, `translations[$1]` will equal the empty string `""` for genes genes that don't have a translation. In those cases, we won't overwrite `$1`.

The `print` command without any arguments prints all the fields (AWK calls columns **fields**), including the one we created to know if the gene was translated or not.

<hr>

I hope this series got you interested in learning more about AWK. From personal experience, once you grok it, you want to use it everywhere. There is a megaton of material we didn't cover, but here is a [great link](http://www.catonmat.net/blog/awk-one-liners-explained-part-one/) with many handy AWK one-liners. Feel free to get back to me if you have any questions.


