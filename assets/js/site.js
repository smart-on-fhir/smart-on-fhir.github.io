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
