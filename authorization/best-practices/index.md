---
layout: main
title: "SMART on FHIR Authorization: Best Practices"
---

# Best Practices in Authorization for SMART on FHIR EHRs

This page is designed to catalog best practices in developing secure SMART on
FHIR EHR implementations. As such, these considerations may not directly affect
interoperability, but are likely to affect the level of assurance the server
is able to provide.  These Best Practices are not intended to dictate 
institutional policy, but to offer pracical solutions for making security
decisions to enforce policy. This page is a work in progress.  

## Please contribute suggestions!

Please use the link at the top of this page to suggest additions to our best
practices list.

## Authorization Code Model

OAuth 2.0 [RFC 6749] defines four models for enabling a client to obtain an 
authorization grant.   For authorizing clients to access FHIR resources held 
by a resource server governed under the same security policy as the 
authorization server, the authorization code model MUST be used because it 
provides the distinct advantages of 1) enabling the end-user to authenticate 
directly to the authorization server, avoiding having to share credentials 
with the client; and 2) enabling the authorization server to transmit the 
access token directly to the client, rather than exposing it to the 
user-agent (e.g., browser).    

## Transport Layer Security (TLS) 

All transmissions that involve the exchange of sensitive information 
(e.g., end-user credential, client credential, authorization code, access 
token, refresh token, FHIR resource) MUST be conducted over links secured 
using Transport Layer Security (TLS).  For maximal security and interoperability, 
the most recent, widely deployed version of TLS SHOULD be used.  At this time, 
this version is TLS 1.0 [RFC2246].  The server involved in the exchange MUST 
authenticate its own identity to the client and set up the secure channel; 
authentication of the client is OPTIONAL.  

