SMART on FHIR
---------------------------------------------------

#Abstract#
SMART on FHIR is a set of open specifications to integrate applications with Electronic Health Records, portals, Health 
Information Exchanges, and other Health IT systems.

#Status#
This document is currently a draft and has not yet been peer reviewed.

#License#
This document is licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0) license][24].

#Table of Contents#

*   1.  [Introduction](#1)
    *   1.1.    [Roles](#1.1)
    *   1.2.    [Terminology](#1.2)
    *   1.3.    [Notational Convention](#1.3)
*   2.  [Specification](#2)
    *   2.1.    [Contextless Flow](#2.1)
        *   2.1.1.  [Usage](#2.1.1)
        *   2.1.2.  [Authorization Request](#2.1.2)
        *   2.1.3.  [Authorization Response](#2.1.3)
        *   2.1.4.  [Access Token Request](#2.1.4)
        *   2.1.5.  [Access Token Response](#2.1.5)
        *   2.1.6.  [Resource Server Request](#2.1.6)
    *   2.2.    [EHR Launch Flow](#2.2)
        *   2.2.1.  [EHR Launch Request](#2.2.1)
        *   2.2.3.  [Authorization Request](#2.2.3)
        *   2.2.4.  [Authorization Response](#2.2.4)
        *   2.2.5.  [Access Token Request](#2.2.5)
        *   2.2.6.  [Access Token Response](#2.2.6)
            *   2.2.6.1.    [Launch Intent](#2.2.6.1)
        *   2.2.7.  [Resource Server Request](#2.2.7)
    *   2.3.    [SMART Application Launch Flow](#2.3)
        *   2.3.1.  [Authorization Request](#2.3.1)
        *   2.3.2.  [Authorization Response](#2.3.2)
        *   2.3.3.  [Access Token Request](#2.3.3)
        *   2.3.4.  [Access Token Response](#2.3.4)
        *   2.3.5.	[Resource Server Request](#2.3.5)
*   3.	[Scopes](#3)
    *   3.1.	[Resource Access](#3.1)
        *   3.1.1.	[Resource Context](#3.1.1)
        *   3.1.2.	[Resource Type](#3.1.2)
        *   3.1.3.	[Modification Rights](#3.1.3)
        *   3.1.4.	[Examples](#3.1.4)
    *   3.2.	[Scopes for Identity Information](#3.2)
    *   3.3.	[Scopes for Launch Information](#3.3)
    *   3.4.	[Scopes for Longevity](#3.4)
    *   3.5.	[Disambiguation of Scopes Between Competing Protocols](#3.5)
*   4.	[User Identity](#4)
    *   4.1.	[OpenID Connect Identifier Permanency](#4.1)
    *   4.2.	[Non-repudiation of OpenID Connect id_tokens](#4.2)
    *   4.3.	[Profile Resource](#4.3)
*   5.	[Discovery](#5)
*   6.	[Client Authentication](#6)
    *   6.1.	[JWT Usage with Refresh Tokens](#6.1)
    *   6.2.	[JWT Usage for Client Credentials Grant](#6.2)
*   7.	[Registration](#7)
*   8.	[Exception Conditions](#8)
*   9.	[Security Considerations](#9)
*   A.	[Appendix](#A)
    *   A.1.	[Resource Scope Syntax](#A.1)
    *   A.2.	[Launch Scope Syntax](#A.2.)
    *   A.3.	[Launch Code Syntax](#A.3)
    *   A.4.	[Launch Issuer Syntax](#A.4.)
    *   A.5.	[Launch Intent Syntax](#A.5.)


#<a id="1"/></a>1. Introduction#
Within the health-care environment, multiple actors may be involved with an individual's health record.  When an 
application needs to access data in a electronic health record via a [FHIR service][1], it may need to interact 
(directly or indirectly) with one or more of these actors to obtain authorization to perform work.

The SMART on FHIR framework standardizes the mechanisms under which an application obtains authorization to the
following types of resources:

* Clinical information.
* Contextual information for the resources currently of interest to an individual accessing the EHR.
* Identity information for the individual currently accessing the EHR.

To orchestrate this interaction, SMART on FHIR defines a set of authorization profiles and extensions for the OAuth 2.0 
Authorization Framework ([IETF RFC 6749][2]).

**QUESTION**:
>	SMART currently also conveys style information for optimizing the user interface.  Should this be handled as a 
>	separate, optional extension specification?

##<a id="1.1"/></a>1.1 Roles##
SMART on FHIR utilizes the four [roles defined by OAuth 2.0][3] of "resource owner", "resource server", "client", and
"authorization server".  One additional role is defined:

*	electronic health record (EHR)
	
	Computer software designed to store and process information about a person's health
	information, such as medications, allergies, medical history, etc.  The EHR acts as a resource
	server by providing FHIR services, is responsible for authenticating end users, and is 
	responsible for providing an 	authorization server. 
	
##<a id="1.2"/></a>1.2 Terminology##
The following terms are used within this specification:

*	application

	Synonymous with "client" or "SMART application", a piece computer software designed to utilize 
	FHIR services in order	to orchestrate a desired activity for the user.

*	healthcare institution

	An organization that operates an electronic health record for use in providing health care to
	a population of users and is responsible for policy decisions regarding the use of the record.
	The healthcare institution has ultimate ownership of the information in the EHR, but in 
	certain cases may delegate the role of resource ownership to end users.
	
*	patient

	An individual whose personal health information is stored within the EHR.  A patient may
	also be the end-user, acting in the capacity of a resource owner. 

*	EHR application

	A piece of computer software that is directly part of the EHR implementation and tracks
	the end user's current context.

##<a id="1.3"/></a>1.3 Notational Convention##
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", 
and "OPTIONAL" in this document are to be interpreted as described in [RFC2119][10].

Unless otherwise noted, all the protocol parameter names and values are case sensitive.

#<a id="2"/></a>2. Specification#

SMART on FHIR describes the following types of workflows:

*	Contextless Flow

    Used where a SMART application seeks to acquire authorization to access clinical information and does
    not require context from the EHR.
	
*	EHR Launch Flow

	Used by an EHR application to pass a specific context to a SMART application, which in turn attempts to
	acquire authorization from the EHR.
	
*	SMART Application Launch Flow

	Used by a SMART application to request context and authorization from an EHR to access resources.

**QUESTION**:
>	Should this specification touch on versioning for future versions?


##<a id="2.1"/></a>2.1 Contextless Flow##


```                                                                                                                            
+--------------+                                         +--------------+
|              |                                         |              |
| Resource     +--(1)------------------------------------> SMART        |
| Owner        |                                         | Application  |
|              |                                         |              |
|              |                                         |              |
|              |                                         |              |
|              |                                         |              |
|              |            +---------------+            |              |
|              |            |               |            |              |
|              <--(5)-------+ Authorization <--(4)-------+              |
|              |            | Server        |            |              |
|              +--(6)------->               +--(7)------->              |
|              |            |               |            |              |
+--------------+            |               <--(8)-------+              |
                            |               |            |              |
                            |               +--(9)------->              |
                            |               |            |              |
                            +---------------+            |              |
                                                         |              |
                            +---------------+            |              |
                            |               |            |              |
                            | FHIR Resource <--(2)-------+              |
                            | Server        |            |              |
                            |               +--(3)------->              |
                            |               |            |              |
                            |               <--(10)------+              |
                            |               |            |              |
                            |               +--(11)------>              |
                            |               |            |              |
                            +---------------+            +--------------+


```
__Figure 1__: SMART Application Contextless Flow Diagram

In Figure 1, the following workflow is described:

1.	The end user begins a workflow in the SMART application that requires access to FHIR resources.  The SMART
	application has either been pre-configured to work with a specific FHIR resource server, or the user has instructed
	the SMART application as to the location of the FHIR resource server, or the application is accessing a record
	it had previously accessed.
2.	The SMART application performs [discovery](#5) by requesting the FHIR server's conformance statement.
3.  The FHIR server returns the conformance statement, which provides the needed endpoints for steps 4 and 8.
4.	The SMART application creates an OAuth 2.0 authorization grant request, then directs the end user to the
	authorization server's authorization endpoint via a browser with said request.  This request contains a request
	for the appropriate scopes necessary to access the FHIR resource.
5.	The authorization server interacts with the resource owner to verify identity or other information required by
	the authorization server.
6.	The end user provides any information needed by the authorization server to proceed. 
7.	An authorization grant is sent via the OAuth 2.0 framework back to the SMART application.
8.	The SMART application requests an access token using the authorization code.
9.	The authorization server returns the access token.
10. The SMART application utilizes the access token to request a FHIR resource.
11.	The FHIR resource server returns the desired resource.

###<a id="2.1.1"/></a>2.1.1 Usage###

The contextless flow constitutes the most basic use of SMART workflows; it is used where the FHIR resource needed by 
the SMART application is already known.  Examples of such scenarios include:

*	The application has been provided context via some other means, such as a system generated hyperlink to the
	application.
*	The resource was previously used by the application, but access has since expired and a new request for
	authorization needs to be generated.
	
###<a id="2.1.2"/></a>2.1.2 Authorization Request###

SMART applications __SHALL__ utilize an [authorization code grant][4] to request authorization to FHIR
resources.  A SMART application __SHOULD__ request scopes needed to access the resource (per the [scopes](#3)
section) for maximum interoperability.  The application __MAY__ choose to omit the redirect URI, as SMART 
registration is limited to a single redirect URI for SMART applications.

In addition, SMART applications __MUST__ send the "state" parameter, as detailed in the 
[OAuth 2.0 Security Considerations][5].

SMART applications that are written natively for a platform __SHOULD__ utilize the operating system's default browser 
when performing the authorization request such that the authorization server may comply with any security controls that 
have been imparted upon it.  Such controls may include:

*	Support for single sign-on.
*	Support for anti-phishing controls implemented via persistent browser state or browser plug-ins.
*	Support for external native applications for sign-on.
*	External regulatory requirements that would prohibit user credentials from being entered via an embedded browser
	within the SMART application.
	
Such "native" applications __MAY__ support orchestrating the authorization flow in an embedded browser where requested
out-of-band by the EHR provider.

###<a id="2.1.3"></a>2.1.3 Authorization Response###

Authorization servers __SHALL__ return an [OAuth 2.0 authorization code grant][4] to exchange authorization with the 
SMART application.  Authorization servers __MAY__ choose to ask the end user for explicit approval to allow the SMART
application to complete this workflow.

###<a id="2.1.4"></a>2.1.4 Access Token Request###

SMART applications __SHALL__ utilize an access token request as described in the 
[section 4.1.3 of OAuth 2.0][6].  

**QUESTON**: 
>	What threat models necessitate client authentication? Offline access where refresh tokens are stored in aggregate?


###<a id="2.1.5"></a>2.1.5 Access Token Response###

Authorization servers __SHALL__ utilize an access token response as described in the 
[section 4.1.4 of OAuth 2.0][21] workflow to respond to the SMART application's request.  As part of the
token response, authorization servers __SHALL__ support the return of an id_token where requested and authorized
containing a minimal set of identity data, as described in [section 4 "User Identity"](#4).

Authorization servers __SHALL__ include the expires_in parameter to allow SMART applications to be proactive in
retrieving new access tokens where necessary.

Authorization servers __SHALL__ return a token type of "bearer" as defined in [RFC 6750][18].

###<a id="2.1.6"></a>2.1.6 Resource Server Request###

To call a FHIR resource, SMART applications __SHALL__ send the bearer token as an authorization header, as defined in 
[section 2.1 of RFC 6750][22].

##<a id="2.2"></a>2.2 EHR Launch Flow##

```                             
                                                                         
+--------------+            +---------------+            +--------------+
|              |            |               |            |              |
| Resource     +--(1)-------> EHR           +--(2)-------> SMART        |
| Owner        |            | Application   |            | Application  |
|              |            |               |            |              |
|              |            |               |            |              |
|              |            +---------------+            |              |
|              |                                         |              |
|              |            +---------------+            |              |
|              |            |               |            |              |
|              <--(6)-------+ Authorization <--(5)-------+              |
|              |            | Server        |            |              |
|              +--(7)------->               +--(8)------->              |
|              |            |               |            |              |
+--------------+            |               <--(9)-------+              |
                            |               |            |              |
                            |               +--(10)------>              |
                            |               |            |              |
                            +---------------+            |              |
                                                         |              |
                            +---------------+            |              |
                            |               |            |              |
                            | FHIR Resource <--(3)-------+              |
                            | Server        |            |              |
                            |               +--(4)------->              |
                            |               |            |              |
                            |               <--(11)------+              |
                            |               |            |              |
                            |               +--(12)------>              |
                            |               |            |              |
                            +---------------+            +--------------+
```
__Figure 2__: EHR Launch Flow Diagram

In Figure 2, the following workflow is described:

1.	The end user selects to launch a SMART application from within an EHR application.
2.	The EHR directs the user to a URI endpoint registered for the SMART application containing a reference to the
	current context information, and the location of the EHRs FHIR API.
3.	The SMART application performs [discovery](#5) by requesting the FHIR server's conformance statement.
4.  The FHIR server returns the conformance statement, which provides the needed endpoints for steps 5 and 9.
5.	The SMART application creates an OAuth 2.0 authorization grant request, then directs the end user to the
	authorization server's authorization endpoint via a browser with said request.  This request contains a request
	for the appropriate scopes necessary to access the FHIR resource.
6.	The authorization server interacts with the resource owner to verify identity or other information required by
	the authorization server.
7.	The end user provides any information needed by the authorization server to proceed.
8.	An authorization grant is sent via the OAuth 2.0 framework back to the SMART application.
9.	The SMART application requests an access token using the authorization code.
10.	The authorization server returns the access token.
11. The SMART application utilizes the access token to request a FHIR resource.
12.	The FHIR resource server returns the desired resource.

###<a id="2.2.1"></a>2.2.1 EHR Launch Request###

In the EHR application launch flow, the end user chooses to "launch" a SMART application from the EHR.  To receive
such a launch, the SMART application implements an endpoint at a specific URI that accepts the following 
query parameters:

*	iss

	Identifies the EHR's FHIR endpoint, which the app can use to obtain additional details about the EHR, including its 
	authorization URL.
	
*	launch
	
	An opaque identifier for this specific launch, and any EHR context associated with it.
	
Normative example:

```
https://example.org/launch?iss=https%3A%2F%2Fehr%2Ffhir&launch=ef1e6860-db06-4572-b311-02881d01d03d
```

The syntax for such launch codes are defined in [appendix A.3.](#A.3), and for the "iss" value is
defined in [appendix A.4](#A.4).


###<a id="2.2.3"></a>2.2.3 Authorization Request###

Upon receipt of a launch context, a SMART application __SHALL__ initiate an authorization grant request to the EMR's
authorization server as described in [section 2.1.2 Authorization Request](#2.1.2).  The SMART 
application __SHALL__ include the following extension parameters along with the request:

*	aud

	The value of the issuer parameter received by the SMART application from the EHR launch request.
*	launch

	The value of the launch parameter received by the SMART application from the EHR launch request.
	
In addition, the SMART application __MUST__ include the scope of "launch" as indicated in 
[section 3.3 Scopes for Launch Information](#3.3).

###<a id="2.2.4"></a>2.2.4 Authorization Response###

Authorization servers __SHALL__ return an [OAuth 2.0 authorization code grant][4] to exchange authorization with the 
SMART application.  As the user initiated this action, it is __NOT RECOMMENDED__ that Authorization servers ask the end 
user for explicit approval in this scenario unless other security considerations apply.  Authorization servers 
__SHOULD__ reject the request if the authorization code is not associated with the current user.  This step prevents
cross-site request forgery of SMART application launches. 

Upon successful authorization, the authorization server __SHALL__ associate the resulting authorization code with the
context information associated with the launch code.  

###<a id="2.2.5"></a>2.2.5 Access Token Request###

SMART applications __SHALL__ utilize an access token request as described in the 
[section 4.1.3 of OAuth 2.0][6].  

###<a id="2.2.6"></a>2.2.6 Access Token Response###
When the SMART application exchanges the authorization code for an access token, the authorization server __SHALL__ 
return the associated context information as parameters in the token response.  The following custom parameters are 
defined by this specification:

Parameter       | Example value                | Meaning
--------------- | ---------------------------- | ----------------------------------------------------------------------
patient 	    | "123" 	                   | String value with a patient id, indicating that the launched was in the context of FHIR Patient 123.   All scopes with resource context of "patient" will be constrained to Patient 123.
encounter       | "123"                        | String value with an encounter id, indicating that the launch was in the context of FHIR Encounter 123.
location        | "123"                        | String value with a location id, indicating that the launch was from the physical place corresponding to FHIR Location 123.
resource        | "MedicationPrescription/123" | String value with a relative resource link, describing some specific resource context for the (in this case, a particular medication prescription). This is a generic mechanism to communicate to an application that a particular resource is "of interest" at launch time.
intent 	        | "reconcile-medications"      | String value describing the [intent of the application launch](#2.2.6.1).

####<a id="2.2.6.1"></a>2.2.6.1 Launch Intent####
Some SMART applications might offer more than one context or user interface that can be accessed during the EHR launch. 
An authorization server __MAY__ include the intent parameter to communicate the specific user interface that the
SMART application should display.

Launch intent values are not defined by this specification, but most conform to the syntax defined in 
[appendix A.5. Launch Intent Syntax](#A.5).  Such values and their associated semantics are decided
via out-of-band agreement between SMART applications and EHR implementations.

###<a id="2.2.7"></a>2.2.7 Resource Server Request###
SMART applications utilize the bearer token from the token response as described in 
[2.1.6 Resource Server Request](#2.1.6) to access resources.

##<a id="2.3"></a>2.3 SMART Application Launch Flow##

```                         
+--------------+                                         +--------------+
|              |                                         |              |
| Resource     |                                         | SMART        |
| Owner        +--(1)------------------------------------> Application  |
|              |                                         |              |
|              |                                         |              |
|              |            +---------------+            |              |
|              |            |               |            |              |
|              <--(5)-------+ Authorization <--(4)-------+              |
|              |            | Server        |            |              |
|              +--(6)------->               +--(7)------->              |
|              |            |               |            |              |
+--------------+            |               <--(8)-------+              |
                            |               |            |              |
                            |               +--(9)------->              |
                            |               |            |              |
                            +---------------+            |              |
                                                         |              |
                            +---------------+            |              |
                            |               |            |              |
                            | FHIR Resource <--(2)-------+              |
                            | Server        |            |              |
                            |               +--(3)------->              |
                            |               |            |              |
                            |               <--(10)------+              |
                            |               |            |              |
                            |               +--(11)------>              |
                            |               |            |              |
                            +---------------+            +--------------+
```
__Figure 3__: SMART Launch Flow Diagram

In Figure 3, the following workflow is described:

1.	The end user selects an option in a SMART application to retrieve context from the EHR application.
2.	The SMART application performs [discovery](#5) by requesting the FHIR server's conformance statement.
    The mechanism for how the SMART application is provided the URL for the FHIR server is not defined by this
    specification.
3.  The FHIR server returns the conformance statement, which provides the needed endpoints for steps 8 and 12.
4.	The SMART application creates an OAuth 2.0 authorization grant request, then directs the end user to the
	authorization server's authorization endpoint via a browser with said request.  This request contains a request
	for the appropriate scopes necessary to access the FHIR resource, along with scopes to request the specific
	types of context information that is desired.
5.	The authorization server extrapolates the current context within the EHR for the user.  This may involve direct
	interaction with the user to confirm such context, or to prompt the user to establish context, and/or to
	authenticate the user.
6.	The user confirms or establishes the necessary context for the authorization server.
7.	An authorization grant is sent via the OAuth 2.0 framework back to the SMART application.
8.	The SMART application requests an access token using the authorization code.
9.	The authorization server returns the access token.
10. The SMART application utilizes the access token to request a FHIR resource.
11.	The FHIR resource server returns the desired resource.

###<a id="2.3.1"></a>2.3.1 Authorization Request###

In the SMART application launch flow, the end user initiates an action in a SMART application that requires access
to context within the EHR.  The SMART application in some way is supplied the base URL for the FHIR service of the EHR;
the details of such provisioning is not defined by this specification.  After performing discovery, the SMART 
application __SHALL__ initiate an authorization grant request to the EMR's authorization server as described 
in [section 2.1.2 Authorization Request](#2.1.2).  
	
The SMART application __SHALL__ include one or more scopes that convey the information that is needed for launch as
defined in [section 3.3 Scopes for Launch Information](#3.3).

###<a id="2.3.2"></a>2.3.2 Authorization Response###
The authorization server shall return a response as described in 
[section 2.1.3 Authorization Response](#2.1.3).

Upon successful authorization, the authorization server __SHALL__ associate the resulting authorization code with the
current context information.  

###<a id="2.3.3"></a>2.3.3 Access Token Request###
SMART applications __SHALL__ utilize an access token request as described in the 
[section 4.1.3 of OAuth 2.0][6].  

###<a id="2.3.4"></a>2.3.4 Access Token Response###
The authorization server returns a response as described in section 
[2.2.6 Access Token Response](#2.2.6).

###<a id="2.3.5"></a>2.3.5 Resource Server Request###
SMART applications utilize the bearer token from the token response as described in 
[2.1.6 Resource Server Request](#2.1.6) to access resources.

##<a id="3"></a>3. Scopes##

**QUESTION**:  
>	If an app has to re-request access to a resource whose authorization was originally obtained via a 
>	launch, how does it request that?  Currently, scopes only define single-resource access via launch scopes, or access
>	to the entire set available to the user.

To obtain access to resources, an application must request the set of scopes necessary for it to perform work on
behalf of the end user.  The SMART on FHIR framework describes four distinct collections of scopes:  resource access, 
access to identity information, requests for "launch" information, and longevity modifiers.

###<a id="3.1"></a>3.1 Resource Access###
A request to access a collection of FHIR resources on behalf of the user consists of one or more SMART scopes.  Each
SMART scope is constructed per the structure defined in appendix A.1. [Resource Scope Syntax](#A.1),
and contains the following elements:

*	Resource Context

	The context in which rights are being requested, described in [Resource Context] (#3.1.1).
	
*	Resource Type

	A FHIR resource type whose name is constrained by "Name" defined in the W3C XML specification or "*" to represent 
	access to any FHIR resource within the given context.
	
*	Modification Rights

	Rights to read and/or write to the given type level or instance level resource(s).

####<a id="3.1.1"></a>3.1.1 Resource Context####
Two contexts are defined as follows:

*	user

	"User" access allows an application access to any individual resource instance that the
	authenticated end user is authorized to access.
	
*	patient

	"Patient" access restricts an application's access to only those individual resource instances
	that are associated with the patient that is directly or indirectly in context.  Requests for
	such scopes may only occur in conjunction with the use of a launch flow.
	
####<a id="3.1.2"></a>3.1.2 Resource Type####
The resource type of a resource scope must conform with a valid resource type as defined in the 
[FHIR Resource Index][15].  An application __MAY__ request the value of "*" to denote a request for access to all
resources available to the end user for the given resource context.

####<a id="3.1.3"></a>3.1.3 Modification Rights####
**QUESTION**: 
>	Do any of these scopes allow for whole system interactions?

Three modifications rights are defined:

*	"read"

	Corresponds to "read", "vread", and "history" for instance level interactions as defined by the 
	[FHIR RESTful API specification][14].  Where the resource context is "user", this also allows the type level
	interactions of "search" and "history".
	
*	"write"

	Corresponds to "update" and "delete" for instance level interactions.  Where the resource context is "user", this
	also allows the type level interactions of "create" and "validate".
	
*	"*"

	Corresponds to both read and write access, as defined above.

####<a id="3.1.4"></a>3.1.4 Examples####
The following are normative examples of the resource scopes:

Scope                        | Authorizes Access to 
---------------------------- | ---------------------------------------------------------------------------------------
patient/*.read               | Read any resource for the current patient in context.
patient/Observation.read     | Read all observations about the patient in context
patient/Observation.write    | Add new observations about, such as new blood pressure readings.
user/Observation.read        | Read a feed of all new lab observations across a patient population.
user/\*.\* 	                 | Read and write access to all resources that the current user can access.
user/Appointment.write       | Add new appointments for the user.
user/Appointment.*           | Manage all appointments the user has access to.

###<a id="3.2"></a>3.2 Scopes for Identity Information###
The following scopes are defined for requesting identity information:

*	openid

	Requests that an OpenID Connect id_token be returned alongside the access token.  See  
	[section 4 User Identity](#4) for more information.
	
*	profile

	Requests access to the FHIR resource that represents the user, and that the location of said 
	resource be returned in the OpenID token.  See [section 4.3 Profile Resource](#4.3) 
	for more information.

###<a id="3.3"></a>3.3 Scopes for Launch Information###

**QUESTION**: 
>	Are there situations where the scope "launch" would be denied and the workflow would be expected to
>	continue uninterrupted?  We've found a lot of people forget the "launch" scope when making the request, which leads
>	to confusion, as they get a token back without any of their launch information.  It seems like simply having the
>	extension should be sufficient.
	
**QUESTION**:
>	Should the additional optional bits about intent and styling be included as a core part of the specification, or
>	be handled as an optional extension specification?  If those bits will change frequently, it may make sense to
>	keep them separate.

When servicing an [EHR launch request](#2.2.1), a SMART application __MUST__ include the scope of "launch"
in its list of requested scopes.

For SMART applications performing a [SMART Application Launch Flow](#2.3), the following 
scopes are defined by this specification: 

Scope                        | Requests context
---------------------------- | ---------------------------------------------------------------------------------------
launch/patient               | Requests the EHR provide context regarding a patient.
launch/encounter             | Requests the EHR provide context regarding an encounter.
launch/location              | Requests the EHR provide context regarding a location.

An EHR __MAY__ support additional custom launch scopes.  When doing so, the scope name must conform to the syntax
defined in appendix [A.2. Launch Scope Syntax](#A.2).
	
###<a id="3.4"></a>3.4 Scopes for Longevity###
SMART on FHIR provides a mechanism for a client application to request a longevity for the access that is being
requested.  Without such modifiers, no assumptions can be made about how long access may be granted.  A given
authorization server __MAY__ choose to generate access tokens that have very short lifetimes by default, and provide a
[refresh token][16] where longer access has been explicitly requested.

To request longevity, a SMART application __MAY__ include one of the two following scopes:

*	online_access

 	Where authorized, the authorization server __SHALL__ provide a refresh token that may be used to obtain new
 	access tokens as long as the user has an active session with the EHR.
 	
*	offline_access

	Where authorized, the authorization server __SHALL__ provide a refresh token that may be used to obtain
	new access tokens even when the user is no longer authenticated.  This refresh token will remain valid
	until individually revoked at the authorization server or until the SMART application's relationship with 
	the EHR is terminated.

###<a id="3.5"></a>3.5 Disambiguation of Scopes Between Competing Protocols###
In the event that an authorization request is used in conjunction with that of a protocol that defines a competing
scope, a SMART application or authorization server __MAY__ append the following prefix to a scope:

```
http://smarthealthit.org/fhir/scopes/
```

Normative example:

```
http://smarthealthit.org/fhir/scopes/user/Observation.read
```

Applications and authorization servers __MUST__ consider the fully-qualified scope names semantically equivalent to the
shorthand versions where no conflicts exist with other values.  For example, an authorization server __MAY__ choose to
return the fully-qualified scopes in the authorized access token response in response to the short-hand versions being 
used.

__NOTE__: The openid and profile scopes are defined by the OpenID Connect specification, which does not define a
prefix.  

##<a id="4"></a>4. User Identity##
**QUESTION**:  
>	Are we requiring EHRs to be identity providers, thus requiring them to implement section
>	"15.1.  Mandatory to Implement Features for All OpenID Providers" for OpenID Connect?  This adds quite a bit to
>	the EHR's requirements, and will require running EHRs through the OpenID Connect conformance features.  This also
>	gets QUITE complicated if the EHR itself is an OpenID Connect relying party... it has to pass-through much of the
>	functionality to the upstream OIDC IdP.

SMART on FHIR allows for identity information about the end user to be obtained via an [OpenID Connect][7] identity
token.  SMART applications __MAY__ request such identity information by requesting the scope of _openid_ during its
authorization request.  Authorization servers __MUST__ provide an id_token as part of the access token response
if the SMART application has been authorized to obtain the information.  

**QUESTION**:  
>	In certain workflows, the authorization server will need to request the user to authenticate.  Since
>	the mechanism used by providers and patients will likely be different, how do we disambiguate the nature of the access
>	for the authorization server to appropriately send them to the right place to log in?  Since services for patients
>	and providers might have different conformance properties, should it just be recommended that they are implemented
>	as different FHIR base URLs? 

###<a id="4.1"></a>4.1 OpenID Connect Identifier Permanency###
**QUESTION**:  
>	Exactly what happens in a scenario where a website needs to change its issuer value?  Perhaps an 
>	organization is re-named.  What about the permanency of identifiers?  Should an opaque identifier be used for
>	individuals, in the event that other identifying information changes in the underlying implementation?  Should this
>	be in a format to support web-finger to allow future authentication-only?  Since advertising the location of the
>	authorization and token endpoints are required in the OpenID Provider Configuration document, should implementations
>	make best effort to make those the same as the authorization endpoints for SMART/FHIR?  What happens if a 
>	non-passive	change occurs that breaks compatibility?

The authorization server __MUST__ include a permanent URL for the issuer (_iss_) value of the token.  The URL 
__MUST NOT__ contain path segments that vary over time, such as version information for the FHIR or SMART protocol
being utilized.  The value of the subject (_sub_) of the id_token must be a permanent identifier for the end user,
whose value does not change over time.  SMART applications __MUST__ treat the combination of issuer and subject as the
universally unique identifier for the end user.

###<a id="4.2"></a>4.2 Non-repudiation of OpenID Connect id_tokens ###
The authorization server __SHALL__ sign the id_token per the OpenID Connect specification using the RS256 algorithm.
  
The authorization server __SHALL__ make its public keys available as described in [OpenID Connect Discovery][12],
incorporating both an "OpenID Provider Configuration" document and a "JSON Web Key" document describing the public
key(s) used to sign tokens. 

SMART applications __MUST__ validate the token per the token validation section of the 
[OpenID Connect specification][11].

###<a id="4.3"></a>4.3 Profile Resource###
In addition to the to requesting access to the user's OpenID identity, a SMART application __MAY__ request access to
the FHIR resource that represents the user through the addition of the "_profile_" scope.  The authorization server
__SHALL__ fulfill such requests by including the URI of the user's FHIR resource as the "profile" claim within the
id_token.  This resource may be a Patient, Practitioner, or RelatedPerson resource as described by the
[FHIR Specification][15].

The FHIR resource server __MUST__ allow a user access to their own user resource when receiving any access token
that contains represents approved access to the profile scope. 

##<a id="5"></a>5. Discovery##
To support automated discovery of OAuth2 endpoints, a SMART on FHIR EHR publishes a set of OAuth2 endpoint URLs inside 
its conformance statement on the [Conformance.rest.security element][8].  The following elements are [extensions][9]
identified by the following URI:

```
http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris
```

The content of the extension defines the following urls, each associated with a valueUri:

*	authorize

	A valueUri indicating the OAuth2 "authorize" endpoint for this FHIR server.
	 
*	token

	A valueUri indicating the OAuth2 "token" endpoint for this FHIR server.

Non-normative conformance example as JSON:

```
{
  "resourceType": "Conformance", 
...
  "rest": [{
   ...
      "security": {
        "extension": [{
          "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
          "extension": [{
            "url": "token",
            "valueUri": "https://my-server.org/token"
          },{
            "url": "authorize",
            "valueUri": "https://my-server.org/authorize"
          }]
        }],
      ...
```

##<a id="6"></a>6. Client Authentication##
**QUESTION**
>	When should client authentication be a required element?  There should be a specific threat that needs to
>	be addressed, rather than simply "be capable of protecting a secret" -- otherwise, folks might choose to not use
>	client authentication when it really should be doing so.  The below is my recommendation.  In addition, this
>	prescribes the use PKI mechanisms in-line with the proposed EHR-to-EHR bits.


To mitigate the risk of compromised refresh tokens, SMART applications __SHOULD__ leverage client authentication 
when storing such refresh tokens outside of the client component of their application (e.g. storing in a central 
database, in memory on an application server, etc.)  This ensures that in the event such refresh tokens are 
compromised, that the tokens need not be revoked.  If the client's private key is stolen in addition to the tokens,
a client application need only to revoke its previous public keys with EHRs.

To authenticate, client applications __SHALL__ utilize a JSON web token as described in the next sections.

###<a id="6.1"></a>6.1 JWT Usage with Refresh Tokens###
A SMART application using client authentication to obtain a new access token using a refresh token __SHALL__ utilize
a JSON Web Token per [section 2.2 of the JWT Profile for OAuth 2.0 Client Authentication][20].  The SMART application
__MAY__ include scope restrictions in the subsequent access token request.  Authorization servers __MUST__ restrict
the resulting access token to the requested scopes, or provide an error if the original refresh token was not
issued with the requested scopes.

###<a id="6.2"></a>6.2 JWT Usage for Client Credentials Grant###
**QUESTION / COMMENT**
>	This is for the EHR-to-EHR bit.  Still needs to be fleshed out and brought in-line with the other parts of Josh's
>	proposal.

A SMART application using a client credentials grant to obtain an access token __SHALL__ utilize
a JSON Web Token per [section 2.1 of the JWT Profile for OAuth 2.0 Client Authentication][19].  The SMART application
__MAY__ include scope restrictions in the access token request.  Authorization servers __MUST__ restrict
the resulting access token to the requested scopes, or provide an error if the SMART application does not have
sufficient privileges to request the given scopes.

##<a id="7"></a>7. Registration##
**QUESTION**
>	Are these restricted to purely web schemes, or are native application redirects allowed?  That particular detail 
>	imparts some requirements on an authorization server.

**QUESTION**
>	HEART is proceeding with the use of JWK URIs for keys for client authentication -- I'm pretty much in agreement
>	with that approach; can we list that as a registration requirement for client apps that need authN?	 

A SMART application that utilizes the Contextless Flow, EHR Launch Flow, or SMART Application Launch Flow __MUST__ 
supply the following information when registering with an EHR:

*	The application's "launch" URL.

*	The application's redirect URI for receiving authorization code grants.


##<a id="8"></a>8. Exception Conditions##
**QUESTION**
>	I added the following as the question was repeatedly raised as to whose responsibility it was to react to and fix
>	problems that occur with security.  I'm interested in feedback on this proposal.  

During the processes of obtaining access tokens and utilizing access tokens, it is possible for exceptions to occur.
Such exceptions could be caused by, but are not limited to, the following conditions:

*	The SMART application isn't registered with the given EHR.
*	The SMART application's access to an EHR is suspended.
*	The end user's access is suspended.
*	The end user has terminated the SMART application's access or has logged off.
*	The end user did not have sufficient privileges to access a specific resource.
*	Internal errors in the EHR system.

In the majority of cases, the EHR system will have the most information as to the cause of the failure, and will be in
the best position to offer assistance to the user and/or individuals whom support a given the SMART application.  As 
such, it is __RECOMMENDED__ that authorization servers and resource servers utilize the "error_uri" parameter as 
detailed in the following specifications:

*	[OAuth 2.0 - section 4.1.2.1 Error Response](http://tools.ietf.org/html/rfc6749#section-4.1.2.1)
*	[OAuth 2.0 - section 5.2 - Error Response](http://tools.ietf.org/html/rfc6749#section-5.2)
*	[Bearer Token Usage - section 3 The WWW-Authenticate Response Header Field](http://tools.ietf.org/html/rfc6750#section-3)

SMART applications that receive such information in error responses __SHOULD__ present such links to end users.  

It is __RECOMMENDED__ that such links provide actionable instructions for either the end user or for individuals whom 
are supporting the SMART application.  It is __RECOMMENDED__ for SMART applications to provide a mechanism to retry a 
specific action after an error to assist users in recovering from transient error conditions.


##<a id="9"></a>9. Security Considerations##
*	It is __RECOMMENDED__ that EHRs issue access tokens for short durations (e.g. ten minutes or less) to minimize the
	window in which a compromised token could be excercised.  Otherwise, an EHR __SHOULD__ provide mechanisms accessible
	to administrators and end users to revoke tokens easily in the event of a security incident.

*	Authorization servers __MUST NOT__ utilize the value of the launch code as a mechanism for passing authenticated
	state.  Doing so opens the possibility to a session injection attack, and could open the possibility of a session 
	fixation attack.

*	SMART applications __MUST__ assure that sensitive information (authentication secrets, authorization codes, tokens,
	PHI) are transmitted ONLY to authenticated servers, over TLS-secured channels.
	
*	Resource servers __MUST__ be TLS-secured.
	
*	All use of TLS __MUST__ incorporate best current practices for transport layer security described in [RFC 7525][23].
	EHRs and SMART applications __SHOULD__ continue to incorporate updates to current practices and __SHOULD__ 
	document their policies for staying current.

**QUESTION**
>	Should we have a global revocation mechanism for client credential keys?  I suggest a JWK endpoint, allowing
>	clients to rotate keys, and more critically, allowing them to revoke keys.  Such documents could self-describe
>	their caching requirements via standard HTTP semantics.

##<a id="A"></a>Appendix A. 	Augmented Backus-Naur Form (ABNF) Syntax##

This section provides Augmented Backus-Naur Form (ABNF) syntax descriptions for the elements defined in this 
specification using the notation of [RFC5234][13], and additionally utilizes other syntax definitions defined in 
[Appendix A of the OAuth 2.0 Framework][17].

###<a id="A.1"></a>A.1. Resource Scope Syntax###

Resource scopes are defined in section [3.1 Resource Access](#3.1).

```
scope-name            = resource-context "/" resource-type "." modification-rights
resource-context      = ("user" / "patient") 
resource-type         = (Name / "*")
modification-rights   = ("read" / "write" / "*" ); 
```

###<a id="A.2."></a>A.2. Launch Scope Syntax###

Launch scopes are defined in section [3.3 Scopes for Launch Information](#3.3).

```
  launch-scope      = "launch/" *( SP scope-token )
```

###<a id="A.3"></a>A.3. Launch Code Syntax###

Launch codes are defined in section [2.2.1 EHR Launch Request](#2.2.1).

```
  launch-code      = 1*VSCHAR
```

###<a id="A.4."></a>A.4. Launch Issuer Syntax###

Launch issuers are defined in section [2.2.1 EHR Launch Request](#2.2.1).

```
  launch-issuer    = URI-reference
```

###<a id="A.5."></a>A.5. Launch Intent Syntax###

Launch intents are defined in section [2.2.6.1 Launch Intent](#2.2.6.1).

```
  launch-intent    = 1*VSCHAR
```

#Author's Addresses#

* Josh Mandel
	* Boston Children's Hospital and Harvard Medical School
	* email: jmandel@gmail.com

* Matt Randall
	* Cerner Corporation
	* email: mrandall@cerner.com

[1]: http://www.hl7.org/implement/standards/fhir/ "FHIR Specification Home Page"
[2]: http://tools.ietf.org/html/rfc6749 "The OAuth 2.0 Authorization Framework"
[3]: http://tools.ietf.org/html/rfc6749#section-1.1 "The OAuth 2.0 Authorization Framework - Roles"
[4]: http://tools.ietf.org/html/rfc6749#section-4.1 "The OAuth 2.0 Authorization Framework - Authorization Code Grant"
[5]: http://tools.ietf.org/html/rfc6819#section-4.4.1.8 "OAuth 2.0 Threat Model and Security Considerations - Threat: CSRF Attack against redirect-uri"
[6]: http://tools.ietf.org/html/rfc6749#section-4.1.3 "The OAuth 2.0 Authorization Framework - Access Token Request"
[7]: http://openid.net/specs/openid-connect-core-1_0.html "OpenID Connect Core 1.0 incorporating errata set 1"
[8]: http://www.hl7.org/implement/standards/fhir/conformance.html "Conformance - FHIR v0.0.82"
[9]: http://www.hl7.org/implement/standards/fhir/extensibility.html  "Extensibility - FHIR v0.0.82"
[10]: http://tools.ietf.org/html/rfc2119 "Key words for use in RFCs to Indicate Requirement Levels"
[11]: http://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation "OpenID Connect Core 1.0 incorporating errata set 1 - Token Validation"
[12]: http://openid.net/specs/openid-connect-discovery-1_0.html "OpenID Connect Discovery 1.0 incorporating errata set 1"
[13]: https://tools.ietf.org/html/rfc5234 "Augmented BNF for Syntax Specifications: ABNF"
[14]: http://www.hl7.org/implement/standards/fhir/http.html "RESTful API - FHIR v0.0.82"
[15]: http://www.hl7.org/implement/standards/fhir/resourcelist.html "Resource Index - FHIR v0.0.82"
[16]: http://tools.ietf.org/html/rfc6749#section-6 "The OAuth 2.0 Authorization Framework - Refreshing an Access Token"
[17]: http://tools.ietf.org/html/rfc6749#appendix-A "The OAuth 2.0 Authorization Framework - Appendix A.  Augmented Backus-Naur Form (ABNF) Syntax"
[18]: http://tools.ietf.org/html/rfc6750 "The OAuth 2.0 Authorization Framework: Bearer Token Usage"
[19]: http://tools.ietf.org/html/rfc7523#section-2.1 "JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants - Using JWTs as Authorization Grants"
[20]: http://tools.ietf.org/html/rfc7523#section-2.2 "JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants - Using JWTs for Client Authentication"
[21]: http://tools.ietf.org/html/rfc6749#section-4.1.4 "The OAuth 2.0 Authorization Framework - Access Token Response"
[22]: http://tools.ietf.org/html/rfc6750#section-2.1 "The OAuth 2.0 Authorization Framework: Bearer Token Usage - Authorization Request Header Field"
[23]: https://tools.ietf.org/html/rfc7525 "Recommendations for Secure Use of Transport Layer Security (TLS) and Datagram Transport Layer Security (DTLS)"
[24]: https://creativecommons.org/licenses/by/4.0/ - "Creative Commons Attribution 4.0 International (CC BY 4.0)"
