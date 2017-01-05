#Sandbox Registered Apps 


##Introduction

The Registered Apps is a listing of all of the SMART on FHIR apps that are registered with your sandbox. These apps may be selected from a catalog of apps or may be registered by a member of your sandbox. Apps from the catalog are hosted by HSPC. Apps you register yourself may be hosted anywhere on the internet, or on your local machine. Launching an app in your sandbox using the SMART of FHIR authorization specification, requires that you register the app with the authorization server.


##App Type

There are currently two app types you can register for, a ["Public" or "Confidential"](http://docs.smarthealthit.org/authorization/) app. With a confidential app, the authorization takes place on the server side (ex. JSP code) such that a secret is not accessible by an end user running your app in the browser. For example, in a JSP app the authorization takes place on the server side in Java code and the client (browser) side never has access to the secret. A public app is an app in which the source code is visible, therefore, it cannot hide a secret (such as a password). JavaScript apps are public apps.


##App Name

The app name is simply a human readable name for your app. This name will be displayed by the authorization server to end users during the initial authorization of you app.


##App Launch URL

The app launch URL is the entry point for your app to be launched using the SMART on FHIR specification. This entry point receives a request containing the issuer URL and launch context value. The entry point then requests authorization from the authorization server.


##App Redirect URIs

The app redirect URIs is a comma separated list of valid redirect URIs. When your app requests authorization, it will provide a redirect_uri parameter in the request. The authorization server compares this redirect_uri against the list of app redirect URIs to insure the provided redirect_uri is approved. If the app redirect URIs list is empty, any redirect_uri value will be allowed.


##App Logo

The app logo is a 210px width by 150px height image for your app. This image will be displayed by the authorization server to end users during the initial authorization of you app.


##After Registering an App

After you have registered your app, you will be provided with several auto generated and/or preconfigured values.
Client ID
The Client ID is used by your app when requesting authorization from the authorization server.


##Client Secret (for a Confidential App Type)

For a confidential app, the client secret is used by your app to secure the request for the access token from the authorization server.


##Scopes

The scopes is a comma separated list of [scopes](http://docs.smarthealthit.org/authorization/scopes-and-launch-context/) for which your app can request authorization from the authorization server. Scopes allow your app to restrict what data will be allowed to be accessed from the FHIR server.
