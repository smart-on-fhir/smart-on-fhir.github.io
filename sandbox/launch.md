---
layout: main
title: Launch Scenarios
---

# Sandbox Launch Scenarios



## Introduction

A sandbox launch scenario is used to simulate a clinical use case or situation, by executing a particular launch flow described in the SMART on FHIR specification. You will need to create a Persona, or user profile, before you can launch the app as the selected user (patient or practitioner). 


### Step 1: Select who is the [Persona](http://docs.smarthealthit.org/sandbox/persona.html) (user) in the scenario
A scenario is used to simulate a real-world actor in an app launch. First, select the Persona.  

* If you select a practitioner Persona, then you are creating a scenario in which a practitioner is going to open an app and perform a function.
* If you select a patient Persona, then you are creating a scenario in which a patient is going into a PHR or patient portal to perform a function.
  
  
### Step 2: (Optional) Select the patient in the EHR/PHR context

If your real-world scenario is expecting a patient to be in the context of the EHR, or expecting a family member to be in context of the PHR, then select the patient you want to use. Otherwise, select none.  

* If you select a patient, then your launch context will include the patient in context.  
* If you select none, then your launch context will not have a patient in context, for example, a doctor checking their messages.
  
  
### Step 3: Select your [App](http://docs.smarthealthit.org/sandbox/register.html)

After Steps 1 and 2, you will see a list of apps that are registered in your sandbox. Select the app you would like to create the launch scenario for.  You can use the Custom App to launch an app that has not been registered.  You can use the client my_web_app for development prior to registering your app and gaining your own client id.


### Step 4: Save or launch

If you choose to save your launch scenario, it will be available for repeated execution. If you don't want to save it, you can simply launch without saving.
