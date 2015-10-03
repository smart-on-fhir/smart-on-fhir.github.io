---
layout: main
title: SMART on FHIR Authorization
---

# Worked "Basic Auth" Example

If the `client_id` is "my-app" and the `client_secret` is "my-app-secret-123",
then the header uses the value B64Encode("my-app:my-app-secret-123"), which
results in the following header:


```
Authorization: Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz
```
