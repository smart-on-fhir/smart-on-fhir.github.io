
SMART Technical Documentation
=============================

This is the SMART technical documentation, hosted at
<https://smart-on-fhir.github.io/docs>

- See <http://smartplatforms.org> for high-level project info and news
- Need help? Ask a question at <http://groups.google.com/group/smart-on-fhir>
- Found an error in these docs? Fork them on Github and send us a pull
  request!


Installing Jekyll and Friends
-----------------------------

First, you'll need the [Jekyll](https://github.com/mojombo/jekyll)
static site generator installed. The full installation instructions are
[here](https://github.com/mojombo/jekyll/wiki/install), but you probaly
can just do:

    $ gem install jekyll

There are two other libraries to install to generate these documents:

1. `redcarpet`: our preferred Ruby Markdown processor.

    $ gem install redcarpet

2. `Pygments`: the Python-based syntax highligher, this installation
   instructions for which are at the bottom of the Jekyll page above.

Once the required software is installed, generating the static site (in
the `_site` directory) is simply running

    $ jekyll serve --watch -b /

on the commandline. 
