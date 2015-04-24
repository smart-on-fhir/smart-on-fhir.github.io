
SMART Technical Documentation
=============================

This is the SMART technical documentation, hosted at
<http://docs.smarthealthit.org>

- See <http://smarthealthit.org> for high-level project info and news
- Need help? Ask a question at <http://groups.google.com/group/smart-on-fhir>
- Found an error in these docs? Fork them on Github and send us a pull
  request!


Installing Jekyll and Friends
-----------------------------

The SMART technical documentation is built using
[Ruby](https://www.ruby-lang.org/) tools. Using [Bundler](http://bundler.io/),
you can install all of the required dependencies to generate and run the
documentation locally by running the following command from the
`smart-on-fhir.github.io/` directory:

    $ bundle install

This will install [Jekyll](https://github.com/mojombo/jekyll), a static site
generator and [redcarpet](https://github.com/vmg/redcarpet), a Ruby Markdown
processor.

Once the required software is installed, generating the static site (in
the `_site` directory) is simply running

    $ jekyll serve --watch -b /

on the commandline.


---

If you prefer, you can serve the project with Node.js and grunt, which enables
"live reload" behavior. This allows editing side-by-side with the web page; and
every time you save, your changes appear automatically in the browser.

Just install nodejs and grunt, and then run:

```
npm install
grunt
```

And then open a browser to http://localhost:4000
