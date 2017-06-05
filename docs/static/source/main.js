if (!IsInsideCHM() && !IsSearchBot())
{
  BuildStructure();
  AddContent();
}
$(document).ready(AddChmAndOnlineFeatures);

function GetWorkingDir() 
{
  var wDir = '';
  var pathArray = GetScriptDir().split('/');
  for (i = 0; i < pathArray.length - 1; i++)
    wDir += pathArray[i] + "/";
  return wDir.substr(0, wDir.lastIndexOf('/'));
}

function GetScriptDir()
{
  var scriptPath = '';
  var scriptEls = document.getElementsByTagName('script');
  for (i = 0; i < scriptEls.length; i++)
    if (scriptEls[i].src) {
      scriptPath = scriptEls[i].src;
      break;
    }
  return scriptPath.substr(0, scriptPath.lastIndexOf('/'));
}

function BuildStructure()
{
  var wDir = GetWorkingDir();
  var header  = '<div class="header"><table class="hdr-table"><tr><td class="hdr-image"><a href="' + wDir + '/"><img src="' + wDir + '/static/ahk_logo_no_text.png" width="217" height="70" alt="AutoHotkey"></a></td><td class="hdr-search"><form id="search-form"><input id="q" size="30" type="text" placeholder="' + translate.hdSearchTxt + '"></form><div id="search-btn">' + translate.hdSearchBtn + '</div></td><td class="hdr-language"><ul><li>Language<ul class="second"><li id="lng-btn-en">English</li><li id="lng-btn-de">Deutsch</li><li id="lng-btn-cn">&#20013;&#25991;</li></ul></li></ul></td></tr></table></div>';
  var main_1  = '<div class="main-content"><div id="app-body"><div id="headerbar"></div><div class="left-col"><ul class="nav"><li id="sb_content" class="selected"><span>' + translate.sbContent + '</span></li><li id="sb_index"><span>' + translate.sbIndex + '</span></li></ul><div id="sidebar"></div><div id="keywords" style="display: none;"><input id="IndexEntry" type="text"><select id="indexcontainer" name="IndexListbox" class="docstyle" size="20"></select></div></div><div class="right-col"><div id="main-content">';
  var main_2  = '</div></div><div class="float-clear"></div></div></div>';
  var footer  = '<div class="footer"><b>Copyright</b> &copy; 2003-' + new Date().getFullYear() + ' ' + location.host + ' - <span id="ftLicense">' + translate.ftLicense + '</span> <a href="' + wDir + '/license.htm">GNU General Public License</a><span id="ftExtra">' + translate.ftExtra + '</span></div>';
  document.write(header + main_1);
  $(document).ready(function() { $('body').append(main_2 + footer); });
}

function AddContent()
{
  $(window).unload(function () { $(window).unbind('unload'); }); // disable firefox's bfcache

  $(document).ready(function() {
    var wDir = GetWorkingDir();
    var relPath = location.href.replace(wDir + '/', '');

    //
    // set last used state of sidebar
    //

    (window.name == 2) ? ShowIndex() : ShowTOC();

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
      document.location = translate.hdSearchLnk.format(query);
    });

    $('.header #search-form').on('submit', function(event) {
        event.preventDefault();
        var query = $(".header #q").val();
        document.location = translate.hdSearchLnk.format(query);
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

    var en = 'https://autohotkey.com/docs/';
    var de = 'http://ahkde.github.io/docs/';
    var cn = 'http://ahkcn.sourceforge.net/docs/';

    $('#lng-btn-en').on('click', function() { document.location = en + relPath; } );
    $('#lng-btn-de').on('click', function() { document.location = de + relPath; } );
    $('#lng-btn-cn').on('click', function() { document.location = cn + relPath; } );

    $('.hdr-table .hdr-language').find('li').mouseenter(function() {
      $(this).children('ul').show();
      $(this).addClass('selected');
      $(this).mouseleave(function() {
        $(this).children('ul').hide();
        $(this).removeClass('selected');
      });
    });

    //
    // Create toc sidebar
    //

    var node_matched = [];

    $('#sidebar').tree({
      data:             toc,
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
        if (node.path == relPath)
        {
          node_matched.push(node);
        }
      }
    });

    $('#sidebar').bind('tree.click', function(event) {
      var node = event.node;
      $(this).tree('toggle', node);
      if (node.path)
        window.location = wDir + "/" + node.path;
    });

    //
    // pre-select toc sidebar item
    //

    for (var i = 0, len = node_matched.length; i < len; i++)
    {
      $('#sidebar').tree('addToSelection', node_matched[i]);
      $('#sidebar').tree('openNode', node_matched[i]);
      $('#sidebar').tree('openNode', node_matched[i].parent);
    }

    //
    // Create keyword list sidebar
    //

    var newContent = '';

    index.sort(function(a, b) {
      var textA = a[0].toLowerCase(), textB = b[0].toLowerCase()
      return textA.localeCompare(textB);
    });

    for (var i = 0, len = index.length; i < len; i++)
    {
      newContent += '<option value="' + index[i][1] + '">' + index[i][0] + '</option>';
    };

    $("#indexcontainer").html(newContent);
    
    //
    // Make keyword list fill and follow the viewport
    //
    
    var nav = $('ul.nav')[0];
    (function(top) {
      var wasFixed, margin;
      function scrolled() {
        var fixed = $(window).scrollTop() > top;
        if (fixed != wasFixed) {
          if (wasFixed = fixed) {
            $('#keywords').css({position: 'fixed', top: '8px'});
            $('#IndexEntry').css('display', 'block');
            margin = 8 + 20 + 44;
          } else {
            $('#keywords').css({position: '', top: ''});
            $('#IndexEntry').css('display', '');
            margin = top + 20 + 8;
          }
          resized();
        }
      }
      function resized() {
        var ic = $('#indexcontainer');
        // Child height seems to always return 0 on IE, so calculate it this way:
        var itemHeight = ic.height() / (ic.attr('size') || 1);
        ic.attr('size', ~~(($(window).height() - margin) / itemHeight));
      }
      $(window).on({scroll: scrolled, resize: resized});
      scrolled();
    })(nav.offsetTop + nav.offsetHeight);
    
    //
    // pre-select keyword list sidebar item
    //

    var sb_index_lastselected = $('[value="' + relPath + '"]').index() + 1;
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

    $("#indexcontainer, #IndexEntry").on('keydown dblclick', function(event) {
      if ((event.which && event.which==13) || (event.keyCode && event.keyCode==13) || (event.type == 'dblclick')) {
        var iSelect = document.getElementById("indexcontainer").selectedIndex;
        if (iSelect >= 0) {
          var URL = document.getElementById("indexcontainer").item(iSelect).value;
          if (URL.length > 0) {
            window.location = wDir + '/' + URL;
          }
        }
      }
    });
  });
};

function AddChmAndOnlineFeatures()
{
  // Make all external links open a new tab/window.
  $("a[href^='http']").attr('target', '_blank');
  
  (function() {
    var templ = $('<a class="ver"></a>');
    $('span.ver').each(function(idx, el) {
      // Give each version annotation a link to the changelog.
      var jel = $(el);
      var m, title, href, text = jel.text();
      if (m = /AHK_L (\d+)\+/.exec(text)) {
        title = translate.verToolTipAHK_L.format(m[1]);
        href = '/AHKL_ChangeLog.htm#L' + m[1];
        text = text.replace(m[0], 'v1.0.90+'); // For users who don't know what AHK_L was.
      } else if (m = /v\d\.\d\.(\d+\.)?\d+/.exec(text)) {
        title = translate.verToolTipDefault.format(m[0]);
        if (!m[1])
          m[0] = m[0] + '.00';
        if (m[0] <= 'v1.0.48.05')
          href = '/ChangeLogHelp.htm#' + m[0];
        else
          href = '/AHKL_ChangeLog.htm#' + m[0];
      } else return;
      jel.replaceWith(templ.clone(true)
        .attr('title', title)
        .attr('href', GetWorkingDir() + href)
        .text(text)
        );
    });
  })();
  
  //
  // Add useful features for code boxes
  //

  // Show select and download buttons in lower right corner of a pre box

  var divStyle = {fontSize: "11px", float: "right"};
  var aStyle = {cursor: "pointer", color: $("a:not([href=])").css("color")};
  var selectLink = $('<a class="selectCode"></a>').text(translate.cdSelectBtn).css(aStyle);
  var downloadLink = $('<a class="downloadCode"></a>').text(translate.cdDownloadBtn).css(aStyle);

  $('pre').each(function(index) {
    if ($(this).is(".Syntax")) {
      $.extend(divStyle, {marginTop: "-32px", marginRight: "7px"});
      $(this).after($('<div>').css(divStyle).prepend(selectLink.clone()));
    }
    else {
      $.extend(divStyle, {marginTop: "-28px", marginRight: "28px"});
      $(this).after($('<div>').css(divStyle).prepend(selectLink.clone(), [' | ', downloadLink.clone()]));
    }
  });

  // Select complete code when clicking

  $('a.selectCode').each(function(index) {
    $(this).on('click', function(e) {
      var doc = document
        , text = $(this).parent().prev('pre')[0]
        , range, selection
      ;
      if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
      } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  });

  // Download complete code when clicking

  $('a.downloadCode').each(function(index) {
    $(this).on('click', function(e) {
      var textToWrite = '\ufeff' + $(this).parent().prev('pre').text().replace(/\n/g, "\r\n");
      var textFileAsBlob = new Blob([textToWrite], {type:'text/csv'});
      var fileNameToSaveAs = location.pathname.match(/([^\/]+)(?=\.\w+$)/)[0] + "-Script.ahk";

      var downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "Download File";

      if (window.webkitURL != null) {
        // Chrome
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        downloadLink.click();
      }
      else if (navigator.userAgent.indexOf("Trident")>-1) {
        // IE 10+
        navigator.msSaveBlob(textFileAsBlob, fileNameToSaveAs)
      }
      else {
        // Firefox
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    });
  });
}

function ShowTOC()
{
  window.name = 1;
  $('#sb_content').attr('class', 'selected');
  $('#sb_index').removeAttr('class');
  $('#keywords').hide();
  $('#sidebar').fadeIn();
}

function ShowIndex()
{
  window.name = 2;
  $('#sb_index').attr('class', 'selected');
  $('#sb_content').removeAttr('class');
  $('#sidebar').hide();
  $('#keywords').fadeIn();
  $(window).trigger('resize');
}

function IsInsideCHM()
{
  return (location.href.search(/::/) > 0) ? 1 : 0;
}

function IsSearchBot()
{
  return navigator.userAgent.match(/googlebot|bingbot|slurp/i);
}

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, n) { return args[n]; });
};
