---
layout: main
title: "SMART on FHIR Authorization: Styling: Experimental styling properties"
---

# SMART App styling properties

The following properties are considered experimental and are subject to change.


```
{
  color_background: "#edeae3",
  color_error: "#9e2d2d",
  color_highlight: "#69b5ce",
  color_modal_backdrop: "",
  color_success: "#498e49",
  color_text: "#303030",
  dim_border_radius: "6px",
  dim_font_size: "13px",
  dim_spacing_size: "20px",
  font_family_body: "Georgia, Times, 'Times New Roman', serif",
  font_family_heading: "'HelveticaNeue-Light', Helvetica, Arial, 'Lucida Grande', sans-serif;"
}
```

The URL value itself is to be considered a version key for the contents of the SMART Style JSON:
hosts must return a new URL value in the `smart_style_url` launch context parameter if the contents
of this JSON is changed.

Style Property | Description
---------------|-------------
`color_background` | The color used as the background of the app.
`color_error` | The color used when UI elements need to indicate an area or item of concern or dangerous action, such as a button to be used to delete an item, or a display an error message.
`color_highlight` | The color used when UI elements need to indicate an area or item of focus, such as a button used to submit a form, or a loading indicator.
`color_modal_backdrop` | The color used when displaying a backdrop behind a modal dialog or window.
`color_success` | The color used when UI elements need to indicate a positive outcome, such as a notice that an action was completed successfully.
`color_text` | The color used for body text in the app.
`dim_border_radius` | The base corner radius used for UI element borders (0px results in square corners).
`dim_font_size` | The base size of body text displayed in the app.
`dim_spacing_size` | The base dimension used to space UI elements.
`font_family_body` | The list of typefaces to use for body text and elements.
`font_family_heading` | The list of typefaces to use for content heading text and elements.

SMART client apps that can adjust their styles should incorporate the above
property values into their stylesheets, but are not required to do so.