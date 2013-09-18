---
layout: post
title: "AWK GTF! How to Analyze a Transcriptome Like a Pro - Part 1"
published: true
category:
tags:
    - tutorial
    - bioinformatics
---
{% include JB/setup %}

The goal of this tutorial is to show a few of the cool things that the Unix tool AWK can do with tabular data. We will focus on extracting useful information from a [transcriptome](https://en.wikipedia.org/wiki/Transcriptome)—because bioinformatics is cool—, but AWK can do its wonders with any kind of text file.

The tutorial has been carefully designed to make it easy for you to play along. So feel free to copy and paste the commands in your Unix terminal.

## Get the data

<pre><code>
# I recommend using this smaller file...
wget https://raw.github.com/nachocab/nachocab.github.io/master/assets/transcriptome.gtf

# ...but if you're feeling bold, go ahead and download the whole enchilada
wget ftp://ftp.sanger.ac.uk/pub/gencode/release_18/gencode.v18.annotation.gtf.gz
gzip -dc gencode.v18.annotation.gtf.gz > transcriptome.gtf
</code></pre>

Let's see what the file we just downloaded looks like.

<pre><code class="wrap">
head transcriptome.gtf

##description: evidence-based annotation of the human genome (GRCh37), version 18 (Ensembl 73)
##provider: GENCODE
##contact: gencode@sanger.ac.uk
##format: gtf
##date: 2013-09-02
chr1    HAVANA  gene    11869   14412   .   +   .   gene_id "ENSG00000223972.4"; transcript_id "ENSG00000223972.4"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "DDX11L1"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "DDX11L1"; level 2; havana_gene "OTTHUMG00000000961.2";
chr1    HAVANA  transcript  11869   14409   .   +   .   gene_id "ENSG00000223972.4"; transcript_id "ENST00000456328.2"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "DDX11L1"; transcript_type "processed_transcript"; transcript_status "KNOWN"; transcript_name "DDX11L1-002"; level 2; tag "basic"; havana_gene "OTTHUMG00000000961.2"; havana_transcript "OTTHUMT00000362751.1";
chr1    HAVANA  exon    11869   12227   .   +   .   gene_id "ENSG00000223972.4"; transcript_id "ENST00000456328.2"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "DDX11L1"; transcript_type "processed_transcript"; transcript_status "KNOWN"; transcript_name "DDX11L1-002"; exon_number 1;  exon_id "ENSE00002234944.1";  level 2; tag "basic"; havana_gene "OTTHUMG00000000961.2"; havana_transcript "OTTHUMT00000362751.1";
</code></pre>

Holy smokes. Who wrote that and why does he hate me?

That, my friend, is [Gencode](http://www.gencodegenes.org/releases/18.html)'s human transcriptome. It will seem less intimidating if we look at it one screen at a time

<pre><code>
less -S transcriptome.gtf

##description: evidence-based annotation of the human genome (GRCh37), version 18 (Ensembl 73)
##provider: GENCODE
##contact: gencode@sanger.ac.uk
##format: gtf
##date: 2013-09-02
chr1    HAVANA  gene    11869   14412   .   +   .   gene_id "ENSG00000223972.4"; transcript_id "ENSG00000223972.4"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "DDX11L1"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "DDX11L1"; level 2; havana_gene "OTTHUMG00000000961.2";
chr1    HAVANA  transcript  11869   14409   .   +   .   gene_id "ENSG00000223972.4"; transcript_id "ENST00000456328.2"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "DDX11L1"; transcript_type "processed_transcript"; transcript_status "KNOWN"; transcript_name "DDX11L1-002"; level 2; tag "basic"; havana_gene "OTTHUMG00000000961.2"; havana_transcript "OTTHUMT00000362751.1";
chr1    HAVANA  exon    11869   12227   .   +   .   gene_id "ENSG00000223972.4"; transcript_id "ENST00000456328.2"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "DDX11L1"; transcript_type "processed_transcript"; transcript_status "KNOWN"; transcript_name "DDX11L1-002"; exon_number 1;  exon_id "ENSE00002234944.1";  level 2; tag "basic"; havana_gene "OTTHUMG00000000961.2"; havana_transcript "OTTHUMT00000362751.1";
</code></pre>

After calling `less`, you can move up, down, left and right by using the arrow keys. Type `shift g` to go to the end of the file, and `gg` to get back. Type `q` when you're done looking around.

The transcriptome has 9 columns. The first 8 are separated by tabs and look reasonable (chromosome, annotation source, feature type, start, end, score, strand, and phase), the last one is kind of hairy: it is made up of key-value pairs separated by semicolons, some fields are mandatory and others are optional, and the values are surrounded in double quotes. That's no way to live a decent life.

## Ask a question

Imagine you wanted to get the list of all the protein-coding genes that only have one exon. How would you do it?

You could go learn Perl, or Python and write up a slow, 100-line-long script, but there is an easier way: use AWK. I *love* AWK. It is fast as a bullet, concise, and incredibly powerful. I couldn't live without it.

To use AWK, you need to understand three key ideas:

1. AWK reads files **one line at a time**
2. You can specify which lines should be read and which ones should be skipped by using a **rule**
3. Once a line has been read, you can **print text** or **do nothing**.

Let's try it with our example. Our first rule will make sure that column 3 is a gene:

<pre><code>
awk '$3 == "gene"' transcriptome.gtf | head | less -S

chr1    HAVANA  gene    11869   14412   .   +   .   gene_id "ENSG00000223972.4"; transcript_id "ENSG00000223972.4"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "DDX11L1"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "DDX11L1"; level 2; havana_gene "OTTHUMG00000000961.2";
chr1    HAVANA  gene    14363   29806   .   -   .   gene_id "ENSG00000227232.4"; transcript_id "ENSG00000227232.4"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "WASH7P"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "WASH7P"; level 2; havana_gene "OTTHUMG00000000958.1";
chr1    HAVANA  gene    29554   31109   .   +   .   gene_id "ENSG00000243485.2"; transcript_id "ENSG00000243485.2"; gene_type "lincRNA"; gene_status "NOVEL"; gene_name "MIR1302-11"; transcript_type "lincRNA"; transcript_status "NOVEL"; transcript_name "MIR1302-11"; level 2; havana_gene "OTTHUMG00000000959.2";
chr1    HAVANA  gene    34554   36081   .   -   .   gene_id "ENSG00000237613.2"; transcript_id "ENSG00000237613.2"; gene_type "lincRNA"; gene_status "KNOWN"; gene_name "FAM138A"; transcript_type "lincRNA"; transcript_status "KNOWN"; transcript_name "FAM138A"; level 2; havana_gene "OTTHUMG00000000960.1";
chr1    HAVANA  gene    52473   54936   .   +   .   gene_id "ENSG00000268020.2"; transcript_id "ENSG00000268020.2"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "OR4G4P"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "OR4G4P"; level 2; havana_gene "OTTHUMG00000185779.1";
chr1    HAVANA  gene    62948   63887   .   +   .   gene_id "ENSG00000240361.1"; transcript_id "ENSG00000240361.1"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "OR4G11P"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "OR4G11P"; level 2; havana_gene "OTTHUMG00000001095.2";
chr1    HAVANA  gene    69091   70008   .   +   .   gene_id "ENSG00000186092.4"; transcript_id "ENSG00000186092.4"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "OR4F5"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "OR4F5"; level 2; havana_gene "OTTHUMG00000001094.1";
chr1    HAVANA  gene    89295   133566  .   -   .   gene_id "ENSG00000238009.2"; transcript_id "ENSG00000238009.2"; gene_type "lincRNA"; gene_status "NOVEL"; gene_name "RP11-34P13.7"; transcript_type "lincRNA"; transcript_status "NOVEL"; transcript_name "RP11-34P13.7"; level 2; havana_gene "OTTHUMG00000001096.2";
chr1    HAVANA  gene    89551   91105   .   -   .   gene_id "ENSG00000239945.1"; transcript_id "ENSG00000239945.1"; gene_type "lincRNA"; gene_status "NOVEL"; gene_name "RP11-34P13.8"; transcript_type "lincRNA"; transcript_status "NOVEL"; transcript_name "RP11-34P13.8"; level 2; havana_gene "OTTHUMG00000001097.2";
chr1    HAVANA  gene    131025  134836  .   +   .   gene_id "ENSG00000233750.3"; transcript_id "ENSG00000233750.3"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "CICP27"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "CICP27"; level 1; tag "pseudo_consens"; havana_gene "OTTHUMG00000001257.3";
</code></pre>

Rules go between single quotes. Numbers after the dollar sign specify a column, so `$3` refers to column 3. The only exception is `$0`, which specifies the entire line.

The double equals sign `==` is how computer people write equality, it drives the math people crazy.

Character strings, like the word "gene", must be surrounded by double quotes.

The vertical line `|` is called a pipe. It connects the command on the left of the pipe with the command on the right. This tells the output generated by the command at the left to become the input of the command on the right.

Now that we have used column 3 to filter, we don't really care about any of the information in columns 1 through 8, so we can get rid of it by only printing column 9.

<pre><code>
awk '$3 == "gene" { print $9 }' transcriptome.gtf | head | less -S

gene_id
gene_id
gene_id
gene_id
gene_id
gene_id
gene_id
gene_id
gene_id
gene_id
</code></pre>

It worked, sort of. We used the stuff that comes before the braces to select the lines that we care about, and the stuff that goes inside the braces `{ }` to tell AWK what we want it to do with that line—in this case, print column 9—, but only `gene_id` showed up. What happened to the rest?

## What is a column?

By default, AWK uses whitespace as the delimiter between columns but there are two types of whitespace: spaces and tabs. Check this out:

<pre><code>
echo "a b c" | awk '{ print $2 }'

echo "a\tb\tc" | awk '{ print $2 }'
</code></pre>

Both commands return a `b`. We are using `echo` to send AWK a line of text (instead of reading from a file), and telling AWK to print the second column. In the second example we are separating the columns by tabs (`\t` is the special character for tabs) instead of spaces. We can tell AWK to treat spaces and tabs differently by using the `-F` option followed by a space and a character in double quotes.

<pre><code>
echo "a,b,c" | awk -F "," '{ print $2 }' # separate by commas, returns b

echo "a b c" | awk -F "\t" '{ print $2 }' # separate by tabs, returns nothing

echo "a\tb\tc" | awk -F "\t" '{ print $2 }' # separate by tabs, returns b
</code></pre>

It's not very intuitive that `-F` would define what the separator should be, and everybody forgets when they start learning AWK. Luckily, it's easy to find help.

<pre><code>
man awk
</code></pre>

This takes you to the Unix manual page on AWK, which behaves in a similar way as `less`. You can use the arrows to move around and you can search for words using the slash `/` followed by whatever you are looking for. Type `/-F` and press `Enter`. The screen will advance to the usage line:

<pre><code>
awk [ -F fs ] [ -v var=value ] [ 'prog' | -f progfile ] [ file ...  ]
</code></pre>

which contains `-F`, to move to the next occurrence, press `n`:

<pre><code>
The -F fs option defines the input field separator to be the regular expression fs.
</code></pre>

Bingo. You can go back to the previous occurrence by pressing `shift n`. Press `q` to leave.

AWK didn't return anything back in the `echo "a b c"` example, why? Because it didn't find any tabs, so it only saw one column, which means that there was no second column to print. See for yourself:

<pre><code>
echo "a b c" | awk -F "\t" '{ print $1 }' # a b c
</code></pre>

Back to the genes.

<pre><code>
awk -F "\t" '$3 == "gene" { print $9 }' transcriptome.gtf | head | less -S

gene_id "ENSG00000223972.4"; transcript_id "ENSG00000223972.4"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "DDX11L1"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "DDX11L1"; level 2; havana_gene "OTTHUMG00000000961.2";
gene_id "ENSG00000227232.4"; transcript_id "ENSG00000227232.4"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "WASH7P"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "WASH7P"; level 2; havana_gene "OTTHUMG00000000958.1";
gene_id "ENSG00000243485.2"; transcript_id "ENSG00000243485.2"; gene_type "lincRNA"; gene_status "NOVEL"; gene_name "MIR1302-11"; transcript_type "lincRNA"; transcript_status "NOVEL"; transcript_name "MIR1302-11"; level 2; havana_gene "OTTHUMG00000000959.2";
gene_id "ENSG00000237613.2"; transcript_id "ENSG00000237613.2"; gene_type "lincRNA"; gene_status "KNOWN"; gene_name "FAM138A"; transcript_type "lincRNA"; transcript_status "KNOWN"; transcript_name "FAM138A"; level 2; havana_gene "OTTHUMG00000000960.1";
gene_id "ENSG00000268020.2"; transcript_id "ENSG00000268020.2"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "OR4G4P"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "OR4G4P"; level 2; havana_gene "OTTHUMG00000185779.1";
gene_id "ENSG00000240361.1"; transcript_id "ENSG00000240361.1"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "OR4G11P"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "OR4G11P"; level 2; havana_gene "OTTHUMG00000001095.2";
gene_id "ENSG00000186092.4"; transcript_id "ENSG00000186092.4"; gene_type "protein_coding"; gene_status "KNOWN"; gene_name "OR4F5"; transcript_type "protein_coding"; transcript_status "KNOWN"; transcript_name "OR4F5"; level 2; havana_gene "OTTHUMG00000001094.1";
gene_id "ENSG00000238009.2"; transcript_id "ENSG00000238009.2"; gene_type "lincRNA"; gene_status "NOVEL"; gene_name "RP11-34P13.7"; transcript_type "lincRNA"; transcript_status "NOVEL"; transcript_name "RP11-34P13.7"; level 2; havana_gene "OTTHUMG00000001096.2";
gene_id "ENSG00000239945.1"; transcript_id "ENSG00000239945.1"; gene_type "lincRNA"; gene_status "NOVEL"; gene_name "RP11-34P13.8"; transcript_type "lincRNA"; transcript_status "NOVEL"; transcript_name "RP11-34P13.8"; level 2; havana_gene "OTTHUMG00000001097.2";
gene_id "ENSG00000233750.3"; transcript_id "ENSG00000233750.3"; gene_type "pseudogene"; gene_status "KNOWN"; gene_name "CICP27"; transcript_type "pseudogene"; transcript_status "KNOWN"; transcript_name "CICP27"; level 1; tag "pseudo_consens"; havana_gene "OTTHUMG00000001257.3";
</code></pre>

Now we have all the genes, but how do we filter for protein-coding genes? The answer, in [Part 2](http://reasoniamhere.com/2013/09/17/awk-gtf-how-to-analyze-a-transcriptome-like-a-pro-part-2).