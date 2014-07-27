if (!IsInsideCHM())
{
  BuildStructure();
  AddContent();
}

function GetUrlRoot()
{ 
  return location.protocol + '//' + location.host + GetVirtualDir();
}

function GetVirtualDir()
{
  var pathname = location.pathname;
  return pathname.substr(0, pathname.lastIndexOf('/docs'));
}

function GetScriptDir() {
  var scriptEls = document.getElementsByTagName('script');
  var thisScriptEl = scriptEls[scriptEls.length - 1];
  var scriptPath = thisScriptEl.src;
  return scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);
}

function BuildStructure()
{
  var vdir = GetVirtualDir();
  var header  = '<div class="header"><table class="hdr-table"><tr><td class="hdr-image"><a href="' + vdir + '/' + '"><img src="' + vdir + '/docs/static/ahk_logo_no_text.png" width="217" height="70" alt="AutoHotkey"></a></td><td class="hdr-search"><form id="search-form"><input id="q" size="30" type="text"></form><div id="search-btn"></div></td><td class="hdr-language"><ul><li>Language<ul class="second"><li id="lng-btn-en">English</li><li id="lng-btn-de">Deutsch</li><li id="lng-btn-cn">&#20013;&#25991;</li></ul></li></ul></td></tr></table></div>';
  var main_1  = '<div class="main-content"><div id="app-body"><div id="headerbar"></div><div class="left-col"><ul class="nav"><li id="sb_content" class="selected"><span></span></li><li id="sb_index"><span></span></li></ul><div id="sidebar"></div><div id="keywords" style="display: none;"><input id="IndexEntry" type="text"><select id="indexcontainer" name="IndexListbox" class="docstyle" size="20"></select></div></div><div class="right-col"><div id="main-content">';
  var main_2  = '</div></div><div class="float-clear"></div></div></div>';
  var footer  = '<div class="footer"><b>Copyright</b> &copy; 2003-' + new Date().getFullYear() + ' ' + location.host + ' - <span id="ftLicense"></span> <a href="' + vdir + '/docs/license.htm">GNU General Public License</a><span id="ftExtra"></span></div>';
  document.write(header + main_1);
  $(document).ready(function() { $('body').append(main_2 + footer); });
}

function AddContent()
{
  $(document).ready(function() {
    var vdir = GetVirtualDir();
    var urlpath = location.href.replace(GetUrlRoot(), '').substr(1);

    //
    // Read config.xml
    //

    if (!sessionStorage.getItem('hdSearchTxt'))
    {
      $.ajax({
        url:     GetScriptDir() + 'config.xml',
        async:   false,
        success: function(xml) {
          $(xml).find('*').each(function(index) {
            sessionStorage.setItem($(this).prop("tagName"), $(this).text());
          });
        }
      });
    }
    $('#q').attr("placeholder", sessionStorage.getItem("hdSearchTxt"));
    $('#search-btn').text(sessionStorage.getItem("hdSearchBtn"));
    $('#sb_content span').text(sessionStorage.getItem("sbContent"));
    $('#sb_index span').text(sessionStorage.getItem("sbIndex"));
    $('#ftLicense').text(sessionStorage.getItem("ftLicense"));
    $('#ftExtra').text(sessionStorage.getItem("ftExtra"));

    //
    // set last used state of sidebar
    //

    (sessionStorage.getItem('sb_state') == 2) ? ShowIndex() : ShowTOC();

    //
    // on events for sidebar buttons
    //

    $('#sb_content').on('click', function() { ShowTOC(); });
    $('#sb_index').on('click', function() { ShowIndex(); });

    //
    // on events for search field + button
    //

    $('.header #search-btn').on('click', function() {
      var query = $(".header #q").val();
      document.location = 'https://www.google.com/search?sitesearch=' + location.host + '&q=' + query;
    });

    $('.header #search-form').on('submit', function(event) {
        event.preventDefault();
        var query = $(".header #q").val();
        document.location = 'https://www.google.com/search?sitesearch=' + location.host + '&q=' + query;
    });

    //
    // Hide logo
    //

    $('#ahklogo').hide();

    //
    // Headings
    //

    // Change display of h1 header

    $('h1').attr("class", "navh1");

    // Provide anchor link

    $('h1, h2, h3, h4, h5, h6').each(function(index) {

      // Show paragraph sign on mouseover

      $(this).hover(
        function() {
          $(this).append("<span style='color:#888;font-size:smaller;'> &para;</span>");
        }, function() {
          $(this).find("span:last").remove();
        }
      );

      // Add anchor

      if(!$(this).attr('id')) // if id anchor not exist, create one
      {
        
        var str = $(this).text().replace(/\s/g, '_'); // replace spaces with _
        var str = str.replace(/[():.,;'#\[\]\/{}&="|?!]/g, ''); // remove special chars
        if($('#' + str).length) // if new id anchor exist already, set it to a unique one
          $(this).attr('id', str + '_' + index);
        else
          $(this).attr('id', str);
      }
      $(this).wrap('<a href="#' + $(this).attr('id') + '" style="text-decoration:none;color:#000"></a>');
    });

    //
    // language button
    //

    var en = 'http://ahkscript.org/';
    var de = 'http://ragnar-f.github.io/';
    var cn = 'http://ahkcn.sourceforge.net/';

    $('#lng-btn-en').on('click', function() { document.location = en + urlpath; } );
    $('#lng-btn-de').on('click', function() { document.location = de + urlpath; } );
    $('#lng-btn-cn').on('click', function() { document.location = cn + urlpath; } );

    $('.hdr-table .hdr-language').find('li').mouseenter(function() {
      $(this).children('ul').show();
      $(this).addClass('selected');
      $(this).mouseleave(function() {
        $(this).children('ul').hide();
        $(this).removeClass('selected');
      });
    });

    //
    // Create toc sidebar based on HHC file (tree.jquery.js)
    //

    if (!sessionStorage.getItem('content'))
    {
      $.ajax({
        url:     vdir + '/Table of Contents.hhc',
        async:   false,
        success: function(txt) {
          var id = 0;

          function CreateData(obj_ul, tree)
          {
            var obj_lis = obj_ul.find("li");
            if (obj_lis.length == 0) return;        
            obj_lis.each(function(index) {
              var $this = $(this);
              if($this.parent("ul").get(0) == obj_ul.get(0))
              {
                tree.push({
                  label:    $this.find('> object > param[name="Name"]').attr('value'),
                  path:     $this.find('> object > param[name="Local"]').attr('value'),
                  children: CreateData($this.find("ul").first(), []),
                  id:       id++
                });
              }
            });
            return tree;
          }

          var data = CreateData($(txt).filter('ul'), []);
          sessionStorage.setItem('content', JSON.stringify(data));
        }
      });
    }

    var sb_content_matched = [];
    var sb_content_matched_2 = [];

    $('#sidebar').tree({
      data:             JSON.parse(sessionStorage.getItem('content')),
      useContextMenu:   false,
      keyboardSupport:  false,
      saveState:        false,
      onCanSelectNode:  function(node) {
        if ((node.children.length) && (!node.path))
            return false;
        else
            return true;
      },
      onCreateLi:       function(node, $li) {
        if (node.path == urlpath)
        {
          sb_content_matched.push(node.id);
        }
        if (node.path == urlpath.substr(0, urlpath.lastIndexOf('#')))
        {
          sb_content_matched_2.push(node.id);
        }
      }
    });

    $('#sidebar').bind('tree.click', function(event) {
      var node = event.node;
      sessionStorage.setItem('sb_content_lastselected', node.id);
      $(this).tree('toggle', node);
      if (node.path)
        window.location = vdir + "/" + node.path;
    });

    //
    // pre-select toc sidebar item
    //

    var array = [];

    if (sb_content_matched.length)
    {
      array = sb_content_matched;
    }
    else if (urlpath.indexOf('#') >= 0)
    {
      array = sb_content_matched_2;
    }
    for (var i = 0, len = array.length; i < len; i++)
    {
      var node = $('#sidebar').tree('getNodeById', array[i]);
      $('#sidebar').tree('addToSelection', node);
      $('#sidebar').tree('openNode', node);
      $('#sidebar').tree('openNode', node.parent);
    }

    //
    // Create keyword list sidebar based on HHK file
    //

    if (!sessionStorage.getItem('index'))
    {
      $.ajax({
        url:     vdir + '/Index.hhk',
        async:   false,
        success: function(txt) {
          var newContent      = '';
          $(txt).find("li").each(function(index) {
            var title = $(this).find('param[name="Name"]').attr('value');
            var path  = $(this).find('param[name="Local"]').attr('value');
            newContent += '<option value="' + path + '">' + title + '</option>';
          });
          sessionStorage.setItem('index', newContent);
        }
      });
    }

    $("#indexcontainer").html(sessionStorage.getItem('index'));
    
    //
    // pre-select toc sidebar item
    //

    var sb_index_lastselected = $('[value="' + urlpath + '"]').index() + 1;
    var sb_index_item_last = $('#indexcontainer :nth-child(' + sb_index_lastselected + ')');
    sb_index_item_last.prop('selected', true);

    //
    // select closest listbox entry while typing
    //

    $("#IndexEntry").on('keyup', function() {
      var oList = $('#indexcontainer')[0];
      var ListLen = oList.length;
      var iCurSel = oList.selectedIndex; 
      var text = $("#IndexEntry").val().toLowerCase();
      var TextLen = text.length;
      if (!text) return
      for (var i = 0; i < ListLen; i++) { 
        var listitem = oList.item(i).text.substr(0, TextLen).toLowerCase(); 
        if (listitem == text) { 
          if (i != iCurSel) { 
            var iPos = i + oList.size - 1; 
            if(ListLen > iPos) 
              oList.selectedIndex = iPos; 
            else 
              oList.selectedIndex = ListLen-1; 
            oList.selectedIndex = i; 
          } 
          break; 
        } 
      } 
    });

    //
    // open document when pressing enter or select item
    //

    $("#indexcontainer, #IndexEntry").on('keydown change', function(event) {
      if ((event.which && event.which==13) || (event.keyCode && event.keyCode==13) || (event.type == 'change')) {
        var iSelect = document.getElementById("indexcontainer").selectedIndex;
        if (iSelect >= 0) {
          var URL = document.getElementById("indexcontainer").item(iSelect).value;
          sessionStorage.setItem('sb_index_lastselected', iSelect + 1);
          if (URL.length > 0) {
            window.location = vdir + '/' + URL;
          }
        }
      }
    });
  });
};

function ShowTOC()
{
  sessionStorage.setItem('sb_state', 1);
  $('#sb_content').attr('class', 'selected');
  $('#sb_index').removeAttr('class');
  $('#keywords').hide();
  $('#sidebar').fadeIn();
}

function ShowIndex()
{
  sessionStorage.setItem('sb_state', 2);
  $('#sb_index').attr('class', 'selected');
  $('#sb_content').removeAttr('class');
  $('#sidebar').hide();
  $('#keywords').fadeIn();
}

function IsInsideCHM()
{
  return (location.href.search(/::/) > 0) ? 1 : 0;
}