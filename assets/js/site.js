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
