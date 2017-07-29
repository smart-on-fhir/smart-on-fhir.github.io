---
layout: default
title: "SMART App Launch: Basic Auth Example"
---

# Worked "Basic Auth" Example

If the `client_id` is "my-app" and the `client_secret` is "my-app-secret-123",
then the header uses the value B64Encode("my-app:my-app-secret-123"), which
converts to `bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz`. This gives you the Authorization
token for "Basic Auth".

GET header:

```
Authorization: Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz
```
