(function() {
  var src = document.getElementsByTagName('script')[0].src.replace('/content.js', '/source/');
  function include(name) {
    document.writeln('<script src="'+src+name+'" type="text/javascript"></script>');
  }
  include('jquery.js'), include('tree.jquery.js')
  include('data_toc.js'), include('data_index.js'), include('data_translate.js'), include('main.js')
})();