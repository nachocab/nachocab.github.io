---
layout: post
title: "AWK GTF! How to Analyze a Transcriptome Like a Pro - Part 2"
published: true
category:
tags:
    - tutorial
    - bioinformatics
    - awk
excerpt:
---

This post belongs to a 3-part series on AWK: [Part 1](http://reasoniamhere.com/2013/09/16/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-1) - **Part 2** - [Part 3](http://reasoniamhere.com/2013/09/18/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-3)

Back in [Part 1](http://reasoniamhere.com/2013/09/16/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-1), we learned how to tell AWK to select specific lines from a tab-separated [transcriptome file](http://reasoniamhere.com/2013/09/16/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-1/#get_the_data) (using the rule `'$3 == "gene"'`) and return a specific column (using the `print` statement inside the curly braces `{ }`).

In this post, we are going to count how many exons make up each protein-coding gene.

<!--excerpt-->

## Chaining AWK calls

We will start with the AWK call that we were using before, and we will append a pipe `|` so it can be used as input for the next AWK call, this time using a space and a semicolon as the delimiter to define what a column is:

``` bash
awk -F "\t" '$3 == "gene" { print $9 }' transcriptome.gtf | awk -F "; " '{ print $3 }' | head | less -S

gene_type "pseudogene"
gene_type "pseudogene"
gene_type "lincRNA"
gene_type "lincRNA"
gene_type "pseudogene"
gene_type "pseudogene"
gene_type "protein_coding"
gene_type "lincRNA"
gene_type "lincRNA"
gene_type "pseudogene"
```

Now that we see what the third column looks like, we can filter for protein-coding genes

``` bash
awk -F "\t" '$3 == "gene" { print $9 }' transcriptome.gtf | \
awk -F "; " '$3 == "gene_type \"protein_coding\""' | \
head | less -S head | less -S

gene_id "ENSG00000186092.4"; transcript_id "ENSG00000186092.4"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "OR4F5"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "OR4F5"; level 2; havana_gene "OTTHUMG00000001094.1";
gene_id "ENSG00000237683.5"; transcript_id "ENSG00000237683.5"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "AL627309.1"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "AL627309.1"; level 3;
gene_id "ENSG00000235249.1"; transcript_id "ENSG00000235249.1"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "OR4F29"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "OR4F29"; level 2; havana_gene "OTTHUMG00000002860.1";
gene_id "ENSG00000185097.2"; transcript_id "ENSG00000185097.2"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "OR4F16"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "OR4F16"; level 2; havana_gene "OTTHUMG00000002581.1";
gene_id "ENSG00000269831.1"; transcript_id "ENSG00000269831.1"; gene_type "protein_coding"; gene_status "NOVEL"; gene_name "AL669831.1"; transcript_type "protein_coding"; transcript_status "NOVEL"; transcript_name "AL669831.1"; level 3;
gene_id "ENSG00000269308.1"; transcript_id "ENSG00000269308.1"; gene_type "protein_coding"; gene_status "NOVEL"; gene_name "AL645608.2"; transcript_type "protein_coding"; transcript_status "NOVEL"; transcript_name "AL645608.2"; level 3;
gene_id "ENSG00000187634.6"; transcript_id "ENSG00000187634.6"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "SAMD11"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "SAMD11"; level 2; havana_gene "OTTHUMG00000040719.8";
gene_id "ENSG00000268179.1"; transcript_id "ENSG00000268179.1"; gene_type "protein_coding"; gene_status "NOVEL"; gene_name "AL645608.1"; transcript_type "protein_coding"; transcript_status "NOVEL"; transcript_name "AL645608.1"; level 3;
gene_id "ENSG00000188976.6"; transcript_id "ENSG00000188976.6"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "NOC2L"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "NOC2L"; level 2; havana_gene "OTTHUMG00000040720.1";
gene_id "ENSG00000187961.9"; transcript_id "ENSG00000187961.9"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "KLHL17"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "KLHL17"; level 2; havana_gene "OTTHUMG00000040721.6";
```

I added a space and a backslash `\` (not to be confused with the regular slash `/`) after the first and second pipes to split the code into two lines; this makes it easier to read and it highlights that we are taking two separate steps.

The double quotes around `protein_coding` are escaped (also with a backslash `\"`) because they are already contained inside double quotes. To avoid the backslashing drama we can use the partial matching operator `~` instead of the total equality operator `==`.

``` bash
awk -F "\t" '$3 == "gene" { print $9 }' transcriptome.gtf | \
awk -F "; " '$3 ~ "protein_coding"' | \
head | less -S
```

The output is the same as before: those lines that contain a `protein_coding` somewhere in their third column make the partial matching rule true, and they get printed (which is the default behavior when there are no curly braces).

Now we have all the protein-coding genes, but how do we get to the genes that only have one exon? Well, we have to revisit our initial AWK call: we selected lines that corresponded to genes, but we actually wanted lines that corresponded to *exons*. That's an easy fix, we just change the word "gene" for the word "exon". Everything else stays the same.

``` bash
awk -F "\t" '$3 == "exon" { print $9 }' transcriptome.gtf | \
awk -F "; " '$3 ~ "protein_coding"' | \
head | less -S

gene_id "ENSG00000186092.4"; transcript_id "ENST00000335137.3"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "OR4F5"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "OR4F5-001"; exon_number 1;  exon_id "ENSE00002319515.1";  level 2; tag "basic"; tag "CCDS"; ccdsid "CCDS30547.1"; havana_gene "OTTHUMG00000001094.1"; havana_transcript "OTTHUMT00000003223.1";
gene_id "ENSG00000237683.5"; transcript_id "ENST00000423372.3"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "AL627309.1"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "AL627309.1-201"; exon_number 1;  exon_id "ENSE00002221580.1";  level 3; tag "basic";
gene_id "ENSG00000237683.5"; transcript_id "ENST00000423372.3"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "AL627309.1"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "AL627309.1-201"; exon_number 2;  exon_id "ENSE00002314092.1";  level 3; tag "basic";
gene_id "ENSG00000235249.1"; transcript_id "ENST00000426406.1"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "OR4F29"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "OR4F29-001"; exon_number 1;  exon_id "ENSE00002316283.1";  level 2; tag "basic"; tag "CCDS"; ccdsid "CCDS41220.1"; havana_gene "OTTHUMG00000002860.1"; havana_transcript "OTTHUMT00000007999.1";
gene_id "ENSG00000185097.2"; transcript_id "ENST00000332831.2"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "OR4F16"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "OR4F16-001"; exon_number 1;  exon_id "ENSE00002324228.1";  level 2; tag "basic"; tag "CCDS"; ccdsid "CCDS41221.1"; havana_gene "OTTHUMG00000002581.1"; havana_transcript "OTTHUMT00000007334.1";
gene_id "ENSG00000269831.1"; transcript_id "ENST00000599533.1"; gene_type "protein_coding"; gene_status "NOVEL"; gene_name "AL669831.1"; transcript_type "protein_coding"; transcript_status "NOVEL"; transcript_name "AL669831.1-201"; exon_number 1;  exon_id "ENSE00003063549.1";  level 3; tag "basic";
gene_id "ENSG00000269831.1"; transcript_id "ENST00000599533.1"; gene_type "protein_coding"; gene_status "NOVEL"; gene_name "AL669831.1"; transcript_type "protein_coding"; transcript_status "NOVEL"; transcript_name "AL669831.1-201"; exon_number 2;  exon_id "ENSE00003084653.1";  level 3; tag "basic";
gene_id "ENSG00000269831.1"; transcript_id "ENST00000599533.1"; gene_type "protein_coding"; gene_status "NOVEL"; gene_name "AL669831.1"; transcript_type "protein_coding"; transcript_status "NOVEL"; transcript_name "AL669831.1-201"; exon_number 3;  exon_id "ENSE00003138540.1";  level 3; tag "basic";
gene_id "ENSG00000269308.1"; transcript_id "ENST00000594233.1"; gene_type "protein_coding"; gene_status "NOVEL"; gene_name "AL645608.2"; transcript_type "protein_coding"; transcript_status "NOVEL"; transcript_name "AL645608.2-201"; exon_number 1;  exon_id "ENSE00003079649.1";  level 3; tag "basic";
gene_id "ENSG00000269308.1"; transcript_id "ENST00000594233.1"; gene_type "protein_coding"; gene_status "NOVEL"; gene_name "AL645608.2"; transcript_type "protein_coding"; transcript_status "NOVEL"; transcript_name "AL645608.2-201"; exon_number 2;  exon_id "ENSE00003048391.1";  level 3; tag "basic";
```


## Cleaning up the output

Before we try to count how many exons belong to the same protein-coding gene, let's simplify the output so we only get the gene names (which are in column 5).

``` bash
awk -F "\t" '$3 == "exon" { print $9 }' transcriptome.gtf | \
awk -F "; " '$3 ~ "protein_coding" {print $5}' | \
head

gene_name "OR4F5"
gene_name "AL627309.1"
gene_name "AL627309.1"
gene_name "OR4F29"
gene_name "OR4F16"
gene_name "AL669831.1"
gene_name "AL669831.1"
gene_name "AL669831.1"
gene_name "AL645608.2"
gene_name "AL645608.2"
```

This is sort of what we want. We could chain another AWK call using `-F " "`, and pick the second column (which would get rid of the `gene_name`). Feel free to try that approach if you are curious.

We can also take a shortcut by using the `tr -d` command, which deletes whatever characters appear in double quotes. For example, to remove every vowel from a sentence:

``` bash
echo "This unix thing is cool" | tr -d "aeiou" # Ths nx thng s cl
```

Let's try deleting all the semicolons and quotes before the second AWK call:

``` bash
awk -F "\t" '$3 == "exon" { print $9 }' transcriptome.gtf | \
tr -d ";\"" | \
awk -F " " '$6 == "protein_coding" {print $10}' | \
head

OR4F5
AL627309.1
AL627309.1
OR4F29
OR4F16
AL669831.1
AL669831.1
AL669831.1
AL645608.2
AL645608.2
```

Run `awk -F "\t" '$3 == "exon" { print $9 }' transcriptome.gtf | tr -d ";\"" | head` to understand what the input to the second AWK call looks like. It's just words separated by spaces; the sixth word corresponds to the gene type, and the tenth word to the gene name.

## Counting genes

There is one more concept we need to introduce before we start counting. AWK uses a special rule called `END`, which is only true once the input is over. See an example:

``` bash
echo -e "a\na\nb\nb\nb\nc" | \
awk '

{ print $1 }

END { print "Done with letters!" }

'

a
a
b
b
b
c
Done with letters!
```

The `-e` option tells `echo` to convert each `\n` into a new line, which is a convenient way of printing multiple lines from a single character string.

In AWK, any amount of whitespace is allowed between the initial and the final quote `'`. I separated the first rule from the `END` rule to make them easier to read.

Now we are ready for counting.

``` bash
echo -e "a\na\nb\nb\nb\nc" | \
awk '


{ counter[$1] += 1 }

END {
    for (letter in counter){
        print letter, counter[letter]
    }
}'

a 2
b 3
c 1
```

Wow, what is all that madness?

Instead of printing each letter, we manipulate a variable that we called `counter`. This variable is special because it is followed by brackets `[ ]`, which makes it an **associative array**, a fancy way of calling a variable that stores key-value pairs.

In this case we chose the values of the first column `$1` to be the keys of the `counter` variable, which means there are 3 keys ("a", "b" and "c"). The values are initialized to 0. For every line in the input, we add a 1 to the value in the array whose key is equal to `$1`. We use the addition operator `+=`, a shortcut for `counter[$1] = counter[$1] + 1`.

When all the lines are read, the `END` rule becomes true, and the code between the curly braces `{ }` is executed. The structure `for (key in associate_array) { some_code }` is called a `for` loop, and it executes `some_code` as many times as there are keys in the array. `letter` is the name that we chose for the variable that cycles through all the keys in `counter`, and `counter[letter]` gives the value stored in `counter` for each `letter` (which we we calculated in the previous curly brace chunk).

Now we can apply this to the real example:

``` bash
awk -F "\t" '$3 == "exon" { print $9 }' transcriptome.gtf | \
tr -d ";\"" | \
awk -F " " '
$6 == "protein_coding" {
    gene_counter[$10] += 1
}

END {
    for (gene_name in gene_counter){
        print gene_name, gene_counter[gene_name]
    }
}' > number_of_exons_by_gene.txt

head number_of_exons_by_gene.txt
CAPN6 24
ARL14EPL 3
DACH1 38
IFNA13 1
HSP90AB1 36
CAPN7 52
DACH2 84
IFNA14 1
LARS 188
CAPN8 78
```

If you are using the real transcriptome, it takes less than a minute to count up one million exons. Pretty impressive.

We saved the output to a file, so now we can use AWK to see how many genes are made up of a single exon.

``` bash
awk '$2 == 1' number_of_exons_by_gene.txt | wc -l # 1362
```

In the next post we will use AWK to translate old gene symbols into official HGNC gene symbols.

