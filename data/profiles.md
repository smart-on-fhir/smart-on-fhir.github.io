---
layout: main
title: SMART on FHIR Profiles
---

# SMART on FHIR Profiles

To support apps that run unmodified across different health IT systems, we
need a set of "ground rules" that define which data fields are required
vs. optional, and which coding systems should be used in a given context. The FHIR
specification leaves many of these decisions open to downstream implementers,
to ensure that FHIR can work with a variety of use cases. But for a viable app
platform, we need more.

# Working with the community

As much as possible we want to avoid inventing these "ground rules" ourselves. In the United States, SMART has adopted the profiles outlined in the [Argonaut Implementation Guide](http://www.fhir.org/guides/argonaut/r2/). Similarly, communities in other regions should work together to define a standard set of profiles that are appropriate for the terminology systems commonly used in their area.
