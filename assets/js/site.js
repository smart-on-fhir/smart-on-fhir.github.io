$("img.sequence-diagram-raw").each(function(i, d){
  d = $(d);
  var url = d.attr('src').replace(/cgi-bin\/cdraw/, '');
  var wrapper = $('<a class="sequence-diagram" href="'+url+'">'); 
  d.after(wrapper);
  d.appendTo(wrapper);
});

$("table").each(function(i, d){
  $(d).addClass("table");
});

$(".edit-in-github").each(function(i,d){
  var rel = window.location.pathname;
  if (rel.match(/\/$/)){
    rel += "index.md";
  }
  if (rel.match(/.html$/)){
    rel = rel.substring(0,rel.length-4);
    rel += "md";
  }
  var branch = "/" + (github_branch || master);
  if (window.location.host.match(/^fhir-docs/)){
    branch = "";
  }
  $(d).attr("href", "https://github.com/smart-on-fhir/smart-on-fhir.github.io/edit"+ branch + rel);

});

// Open patient pickers
// $(".open-picker").click(function() {
//   var stu  = $(this).attr("data-stu");
//   var tags = $(this).attr("data-tags");
//   var url  = "https://patient-browser.herokuapp.com/#/";
//   var params = [];
//   if (stu) {
//     params.push('config=' + encodeURIComponent(stu));
//   }
  
//   if (tags) {
//     tags = tags.split(/\s*,\s*/).map(function(tag) {
//       return String(tag || "").trim();
//     }).filter(Boolean);
//     if (tags.length) {
//       params.push('tags=' + encodeURIComponent(tags.join(",")));
//     }
//   }
  
//   if (params.length) {
//     url += "?" + params.join("&");
//   }
  
//   window.open(url, "_blank");
//   return false;
// });
