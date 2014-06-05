---
layout: main
title: SMART on FHIR Authorization
---

# EHR Authorization Profiles

SMART on FHIR provides reliable, secure authorization for a variety of app
architectures with a consistent, easy-to-implement set of building blocks.
Because different app architectures bring different security considerations to
the table, we've organized authorization profiles by one key question:

### Can your app keep a secret?

Pure client-side apps (for example, HTML5/JS browser-based apps, iOS mobile
apps, or Windows desktop apps) can provide adequate security -- but they can't
"keep a secret" in the OAuth2 sense. That is to say, any "secret" key, code, or
string that's embedded in the app can potentially be extracted by an end-user
or attacker. So security for these apps can't depend on secrets embedded at
install-time. Instead, security comes from being hosted at a trusted URL.

## Yes: [Confidential client]({{site.baseurl}}authorization/confidential)
## No: [Public client]({{site.baseurl}}authorization/public)
<br/><br/>
