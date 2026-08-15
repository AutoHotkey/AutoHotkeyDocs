// Sidebar, toolbar, etc. for the online and offline AutoHotkey documentation.
// This replaces the offline help (CHM) interface but requires IE11 (Windows 7 and later).
// Max supported JavaScript version is ECMAScript 2009 (ES5) due to IE11 support.

addPolyfills(); addExtensions();
const site = new setupSite;
const cache = new setupCache;
const user = new setupUserSettings;
const host = new setupSiteHost;
const frame = new setupSiteFrame;

function setupSite() {
  const site = this;
  site.scriptElement = document.currentScript || document.querySelector('script[src$="static/content.js"]');
  site.scriptDir = site.scriptElement.src.slice(0, site.scriptElement.src.lastIndexOf('/'));
  site.urlBase = site.scriptDir.slice(0, site.scriptDir.lastIndexOf('/'));
  site.urlRelative = getUrlRelative(location.href, site.urlBase);
  site.urlFull = site.urlBase + '/' + (getUrlParam('frame') || site.urlRelative);
  site.urlEquivRelative = getUrlEquivRelative();
  site.inCHM = /::/.test(location.href);
  site.isLocal = window.location.protocol === 'file:';
  site.inFrame = (window.self !== window.top);
  site.openedBySearchbot = /googlebot|bingbot|slurp/i.test(navigator.userAgent);
  site.onPhone = detectPhone(site.scriptElement);
  site.inIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11
  site.supportsHistory = (history.replaceState) && !site.inCHM;
  site.supportsStorage = !!window.sessionStorage && !site.isLocal;
  site.supportsCookies = navigator.cookieEnabled && !site.isLocal;
  site.onTouchDevice = !!('ontouchstart' in window) || !!(navigator.msMaxTouchPoints);
  site.init = function() {
    if (site.openedBySearchbot) return;
    cache.init(); user.init();
    site.trackFocus();
    if (site.inFrame) {
      frame.listenForMessages();
      frame.applyUserSettings();
      frame.updateHost();
      frame.saveLastClickedTocItem();
      frame.addShortcuts();
      frame.show();
      frame.onDOMContentLoad(function() {
        frame.focus();
        frame.content.modify();
      });
      frame.onHashChange(function() {
        frame.updateHost();
        frame.saveLastClickedTocItem();
        frame.content.highlightAnchor();
      });
      frame.onBeforeUnload(function() {
        cache.save();
        frame.hide();
      });
    }
    else { // not in frame
      host.listenForMessages();
      host.build();
      host.addShortcuts();
      host.applyTranslations();
      host.init();
      host.applyUserSettings();
      host.onHashChange(function() {
        host.viewer.openURL(location.href); // Redirect manually added # anchor to the frame.
      });
    }
  };
  site.trackFocus = function() {
    document.addEventListener('focusin', function() {
      cache.update('lastFocusLocation', site.inFrame ? 'frame' : 'host');
    });
  };
  site.postMessage = function(full_path) {
    const params = [];
    const parts = full_path.split('.');
    const root = parts[0], path = parts.slice(1).join('.');
    const root_references = { host: host, frame: frame, site: site };
    for (var i = 1; i < arguments.length; i++) params.push(arguments[i]);
    if (root == 'host' && site.inFrame)
      window.parent.postMessage(JSON.stringify([root, path].concat(params)), '*');
    else if (root == 'frame' && !site.inFrame) {
      const frame_element = host.viewer && host.viewer.frame;
      if (!frame_element || !frame_element.contentWindow) return;
      frame_element.contentWindow.postMessage(JSON.stringify([root, path].concat(params)), '*');
    }
    else
      site.resolvePath(root_references[root], path).apply(root_references[root], params);
  };
  site.listenForMessages = function() { // Messages sent by postMessage.
    const root = this;
    window.addEventListener('message', function(e) {
      const data = parseJSON(e.data);
      if (!Array.isArray(data)) return;
      site.resolvePath(root, data[1]).apply(root, data.slice(2));
    });
  };
  site.resolvePath = function(root, path) {
    const parts = path.split('.');
    var obj = root;
    for (var i = 0; i < parts.length; i++) {
      if (obj == null) return null;
      obj = obj[parts[i]];
    }
    return obj;
  };
  site.addShortcuts = function() {
    if (!site.waitForDataTranslate(site.addShortcuts)) return;
    const altKeys = {};
    ['C', 'N', 'S'].forEach(function(k) { return altKeys[T(k).charCodeAt(0)] = k; });
    document.addEventListener('keydown', function(e) {
      if (e.which == 117) { // F6
        e.preventDefault(); host.performKeyAction('F6');
      }
      else if (e.altKey && altKeys[e.which]) {
        e.preventDefault(); host.performKeyAction(altKeys[e.which]);
      }
    });
  };
  site.setScheme = function(scheme) {
    cache.update('colorScheme', scheme);
    const dark_css = document.head.querySelector('#dark_css');
    if (scheme == 'light') {
      if (!dark_css) return;
      dark_css.remove();
    }
    else if (scheme == 'dark') {
      if (dark_css) { dark_css.removeAttribute('media'); return; }
      document.head.appendChild(createLink());
    }
    else if (scheme == null) {
      const media = '(prefers-color-scheme: dark)';
      if (dark_css) { dark_css.media = media; return; }
      document.head.appendChild(createLink()).media = media;
    }
    function createLink() {
      const link = document.createElement('link');
      link.href = site.urlBase + '/static/dark.css';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.id = 'dark_css';
      return link;
    }
  };
  site.setSchemeAll = function(scheme) {
    host.postMessage('setScheme', scheme);
    frame.postMessage('setScheme', scheme);
  };
  site.applyUserSettings = function() {
    if (cache.user_loaded) { apply(); return; }
    user.load(function(config) {
      cache.update('user_loaded', true);
      if (config) cache.update(Object.assign(config, cache.forced));
      apply();
    });
    function apply() {
      for (var setting in user.settings)
        site.postMessage(user.settings_paths[setting], cache[setting]);
      cache.update('forced', null);
    }
  };
  site.onHashChange = function(callback) {
    window.addEventListener('hashchange', callback);
  };
  site.onDOMContentLoad = function(callback) {
    window.addEventListener('DOMContentLoaded', callback);
  };
  site.onBeforeUnload = function(callback) {
    window.addEventListener('beforeunload', callback);
  };
  site.waitForData = function(path, pairs, callback, args) {
    const missing = pairs.find(function(p) { return cache[p[0]] === undefined; });
    if (!missing) return true;
    loadScript(path, function() {
      pairs.forEach(function(p) { cache[p[0]] = window[p[1]]; });
      callback.apply(null, args);
    });
    return false;
  }
  site.waitForDataTOC = function(caller, args) {
    return site.waitForData(site.urlBase + '/static/source/data_toc.js', [
      ['toc_data', 'tocData']
    ], caller, args);
  };
  site.waitForDataIndex = function(caller, args) {
    return site.waitForData(site.urlBase + '/static/source/data_index.js', [
      ['index_data', 'indexData']
    ], caller, args);
  };
  site.waitForDataSearch = function(caller, args) {
    return site.waitForData(site.urlBase + '/static/source/data_search.js', [
      ['search_index', 'SearchIndex'],
      ['search_files', 'SearchFiles'],
      ['search_titles', 'SearchTitles']
    ], caller, args);
  };
  site.waitForDataTranslate = function(caller, args) {
    return site.waitForData(site.urlBase + '/static/source/data_translate.js', [
      ['translate_data', 'translateData']
    ], caller, args);
  };
  site.waitForDataDeprecate = function(caller, args) {
    return site.waitForData(site.urlBase + '/static/source/data_deprecate.js', [
      ['deprecate_data', 'deprecateData']
    ], caller, args);
  };
}

function setupCache() {
  // CHM does not support Web Storage or cookies.
  // Firefox when used locally (file: protocol) does not support them reliably.
  // Chromium locally supports them, but it's not safe due to the lack of W3C standards.
  const cache = this;
  cache.init = function() {
    cache.loaded = cache.load();
  };
  cache.load = function() {
    if (site.supportsStorage) {
      var data = JSON.parse(window.sessionStorage.getItem('data'));
      if (!data) return false;
    }
    else try {
      var data = JSON.parse(window.name);
    } catch (e) {
      return false;
    }
    cache.update(Object.assign(data, data.forced));
    return true;
  };
  cache.save = function() {
    if (site.supportsStorage)
      window.sessionStorage.setItem('data', JSON.stringify(cache));
    else
      window.name = JSON.stringify(cache);
  };
  cache.update = function(source, value, skip_post_msg) {
    if (!skip_post_msg)
      (site.inFrame ? host : frame).postMessage('cache.update', source, value, true);
    if (typeof source === 'object') return Object.assign(cache, source);
    cache[source] = value;
    return value;
  };
}

function setupUserSettings() {
  const user = this;
  user.settings = {
    fontSize: 1.0,
    selectedTab: 0,
    showSidebar: true,
    colorScheme: null,
    collapseQuickRef: false
  };
  user.settings_paths = {
    fontSize: 'frame.setFontSize',
    selectedTab: 'host.sidebar.tabs.selectByIndex',
    showSidebar: 'host.sidebar.show',
    colorScheme: 'site.setSchemeAll',
    collapseQuickRef: 'host.sidebar.quick.collapse'
  };
  user.init = function() {
    Object.assignNew(cache, user.settings);
  };
  user.load = function(callback) {
    if (site.inCHM) {
      loadScript(user.getCHMConfigPath(), function() {
        callback(window.config);
      }, function() {
        callback(null);
      });
    }
    else if (site.supportsStorage) {
      var config = JSON.parse(window.localStorage.getItem('config'));
      callback(config);
    }
    else if (site.supportsCookies) {
      var config = document.cookie.match(/config=([^;]+)/);
      config && (config = JSON.parse(config[1]));
      callback(config);
    }
    else callback();
  };
  user.save = function(settings) {
    if (site.inCHM) {
      const content = 'config = ' + JSON.stringify(settings, null, 2);
      const fso = new ActiveXObject('Scripting.FileSystemObject');
      const file = fso.OpenTextFile(user.getCHMConfigPath(), 2, true);
      file.WriteLine(content.replace(/\n/g, '\r\n'));
      file.Close();
    }
    else if (site.supportsStorage) {
      window.localStorage.setItem('config', JSON.stringify(settings));
    }
    else if (site.supportsCookies) {
      document.cookie = ['config', '=', JSON.stringify(settings), '; expires=.', new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 365).toGMTString(), '; path=/;'].join('');
    }
  };
  user.getCHMConfigPath = function() {
    return decodeURI(window.location.href.match(/mk:@MSITStore:(.*?)\\[^\\]+\.chm/i)[1] + '\\chm_config.js')
  };
}

function setupSiteHost() {
  const host = this;
  host.cache = cache;
  host.template = '<div class="lyt_head" role="banner"><button class="lyt_skipnav" data-translate aria-label="data-content" data-content="Skip navigation"></button><div class="lyt_area"><div class="lyt_tab_row"><ul><li><button data-translate title="Shortcut: ALT+C" aria-label="Content tab" data-content="C̲ontent"></button></li><li><button data-translate title="Shortcut: ALT+N" aria-label="Index tab" data-content="In̲dex"></button></li><li><button data-translate title="Shortcut: ALT+S" aria-label="Search tab" data-content="S̲earch"></button></li></ul></div><div class="lyt_sidebar_toggle"><ul><li><button title="Hide or show the sidebar" data-translate aria-label="title">&#926;</button></li></ul></div><div class="lyt_tools"><div class="lyt_tools_online"><ul><li class="lyt_tool_home"><a href="{0}" title="Go to the homepage" data-translate aria-label="title">&#916;</a></li><li class="lyt_tool_language dropdown closed"><button title="Change the language" data-translate aria-label="title" data-content="en"></button><ul class="selected"><li><a href="#" title="English" aria-label="title" data-content="en"></a></li><li><a href="#" title="Deutsch (German)" data-content="de" aria-label="title"></a></li><li><a href="#" title="&#x65e5;&#x672c;&#x8a9e; (Japanese)" data-content="ja" aria-label="title"></a></li><li><a href="#" title="&#xD55C;&#xAD6D;&#xC5B4 (Korean)" aria-label="title" data-content="ko"></a></li><li><a href="#" title="Português (Portuguese)" data-content="pt" aria-label="title"></a></li><li><a href="#" title="&#x4E2D;&#x6587; (Chinese)" aria-label="title" data-content="zh"></a></li></ul></li><li class="lyt_tool_version dropdown closed"><button title="Change the version" data-translate aria-label="title" data-content="v1"></button><ul class="selected"><li><a href="#" title="AHK v1.1" aria-label="title" data-content="v1"></a></li><li><a href="#" title="AHK v2.0" aria-label="title" data-content="v2"></a></li></ul></li><li class="lyt_tool_edit"><a href="#" target="_blank" title="Edit this document on GitHub" data-translate="2" aria-label="title" data-content="E"></a></li></ul></div><div class="lyt_tools_chm"><ul><li class="lyt_tool_back"><button title="Go back" data-translate="2" aria-label="title">&#9668;</button></li><li class="lyt_tool_forward"><button title="Go forward" data-translate="2" aria-label="title">&#9658;</button></li><li class="lyt_tool_zoom"><button title="Change the font size" data-translate="2" aria-label="title" data-content="Z"></button></li><li class="lyt_tool_print"><button title="Print this document" data-translate="2" aria-label="title" data-content="P"></button></li><li class="lyt_tool_browser"><a href="#" target="_blank" title="Open this document in the default browser (requires internet connection). Middle-click to copy the link address." data-translate="2" aria-label="title" data-content="¬"></a></li></ul></div><div class="lyt_tools_main"><ul><li class="lyt_tool_color"><button title="Use the dark or light scheme" data-translate="2" aria-label="title" data-content="C"></button></li><li class="lyt_tool_settings"><button title="Open the help settings" data-translate="2" aria-label="title">&#1029;</button></li></ul></div></div></div></div><div class="lyt_main"><div class="lyt_left" role="navigation"><div class="lyt_tab_page_toc hidden"></div><div class="lyt_tab_page_index hidden"><div class="lyt_input"><input type="search" placeholder="Search" data-translate="2" /></div><div class="lyt_select"><select size="1" class="lyt_select_empty"><option value="-1" selected data-translate>Unfiltered</option><option value="0" data-translate>Directives</option><option value="1" data-translate>Built-in Variables</option><option value="2" data-translate>Built-in Functions</option><option value="3" data-translate>Control Flow Statements</option><option value="4" data-translate>Operators</option><option value="5" data-translate>Declarations</option><option value="6" data-translate>Built-in Classes</option><option value="7" data-translate>Built-in Methods/Properties</option><option value="99" data-translate>Ahk2Exe Compiler</option></select></div><div class="lyt_list"></div></div><div class="lyt_tab_page_search hidden"><div class="lyt_input"><input type="search" placeholder="Search" data-translate="2" /></div><div class="lyt_list"></div><div class="lyt_checkbox"><input type="checkbox" id="highlightSearchTerms"><label for="highlightSearchTerms" data-translate>Highlight search terms</label><div class="lyt_updown" title="Go to previous/next occurrence" data-translate aria-label="title"><div class="lyt_updown_up"><div class="triangle-up"></div></div><div class="lyt_updown_down"><div class="triangle-down"></div></div></div></div></div><div class="lyt_load"><div class="lds-dual-ring"></div></div><div class="lyt_quick"><button class="lyt_quick_head" title="Collapse or uncollapse the quick reference" data-translate aria-label="title"><div class="chevron"></div><span data-translate data-content="Quick reference"></span></button><div class="lyt_quick_main"></div></div></div><div class="lyt_dragbar"></div><div class="lyt_right"><div class="lyt_load"><div class="lds-dual-ring"></div></div><iframe class="lyt_frame hidden" frameborder="0" src="about:blank" role="main"></iframe></div></div>';
  host.build = function() {
    const body = document.body.cloneNode(false);
    body.classList.add('lyt_body');
    body.innerHTML = host.template;
    document.documentElement.replaceChild(body, document.body);
  };
  host.listenForMessages = function() { site.listenForMessages.apply(host); };
  host.postMessage = function(path) {
    const params = ['host.' + path];
    for (var i = 1; i < arguments.length; i++) params.push(arguments[i]);
    site.postMessage.apply(null, params);
  };
  host.applyUserSettings = site.applyUserSettings;
  host.update = function(title, urlFull, urlRelative, urlEquiv, history_state) {
    host.updateTitle(title);
    host.updateUrl(urlFull, urlRelative);
    host.toolbar.tools.update(urlRelative, urlEquiv);
    host.sidebar.tabs.page_toc.update(urlFull, history_state, true);
  };
  host.updateTitle = function(title) { document.title = title; };
  host.updateUrl = function(urlFull, urlRelative) {
    try {
      if (history.replaceState)
        history.replaceState(null, null, urlFull);
    }
    catch (e) {
      if (history.replaceState)
        history.replaceState(null, null, '?frame=' + encodeURI(urlRelative).replace(/#/g, '%23'));
    }
  };
  host.setupViewer = function() {
    const viewer = this;
    viewer.init = function() {
      viewer.right = host.main.querySelector('.lyt_right');
      viewer.frame = host.viewer.right.querySelector('.lyt_frame');
      viewer.load = host.viewer.right.querySelector('.lyt_load');
      if (site.inIE) viewer.show(true);
      viewer.onReady(function(frame_win) { // Load the initial URL into the frame.
        if (site.supportsStorage)
          window.sessionStorage.setItem('data', JSON.stringify(cache));
        else
          frame_win.name = JSON.stringify(cache);
        viewer.openURL(site.urlFull, true);
      });
    };
    viewer.show = function(show) {
      if (show) {
        viewer.load.hide();
        viewer.frame.classList.remove('hidden'); viewer.frame.classList.add('visible');
      }
      else {
        viewer.load.show(); // forces reflow
        viewer.frame.classList.add('hidden'); viewer.frame.classList.remove('visible');
      }
    };
    viewer.onReady = function(callback) {
      function check() {
        const win = viewer.frame.contentWindow, doc = win && win.document;
        if (win && doc)
          callback(win, doc);
        else
          setTimeout(check, 10);
      }
      check();
    };
    viewer.openURL = function(url, prevent_focus) {
      cache.update('toc_clickItemTemp', cache.toc_clickItem);
      if (site.inIE && prevent_focus) {
        const focused = document.activeElement;
        viewer.frame.addEventListener('focus', function onFocus() {
          viewer.frame.removeEventListener('focus', onFocus);
          if (focused) focused.focus();
        });
      }
      viewer.frame.contentWindow.location.href = url;
      if (!prevent_focus) viewer.focus();
      cache.save();
      if (site.onPhone) setTimeout(function() { host.sidebar.show(false); }, 200);
    };
    viewer.focus = function() {
      tryFocus();
      function tryFocus() {
        const frame_win = viewer.frame.contentWindow;
        if (viewer.hasFocus()) return;
        if (frame_win)
          site.inIE ? setTimeout(function() { frame_win.focus(); }, 50) : frame_win.focus();
        setTimeout(tryFocus, 10);
      };
    };
    viewer.hasFocus = function() {
      return viewer.right.contains(document.activeElement);
    };
  };
  host.performKeyAction = function(keyName) {
    if (site.inFrame) {
      host.postMessage('performKeyAction', keyName);
      return;
    }
    switch (keyName) {
      case 'C': host.sidebar.tabs.selectByIndex(0); break;
      case 'N': host.sidebar.tabs.selectByIndex(1); break;
      case 'S': host.sidebar.tabs.selectByIndex(2); break;
      case 'F6': host.cycleFocus(); break;
    }
  };
  host.cycleFocus = function() {
    if (cache.lastFocusLocation == 'frame') {
      host.sidebar.tabs.items[cache.selectedTab].page.focus();
      return;
    }
    host.viewer.focus();
  };
  host.applyTranslations = function() {
    // data-translate=1 for content only, data-translate=2 for attributes only
    if (!site.waitForDataTranslate(host.applyTranslations)) return;
    document.querySelectorAll('[data-translate]').forEach(function(el) {
      const content = el.textContent;
      const title = el.getAttribute('title');
      const placeholder = el.getAttribute('placeholder');
      const ariaLabel = el.getAttribute('aria-label');
      const dataContent = el.getAttribute('data-content');
      const dataTranslate = el.getAttribute('data-translate');
      if (!dataTranslate || dataTranslate == 1) {
        if (content != '')
          el.textContent = T(content) || content;
        if (dataContent !== null)
          el.setAttribute('data-content', T(dataContent));
      }
      if (!dataTranslate || dataTranslate == 2) {
        if (title !== null)
          el.title = T(title);
        if (placeholder !== null)
          el.placeholder = T(placeholder);
      }
      if (ariaLabel) {
        const value = el.getAttribute(ariaLabel);
        el.setAttribute('aria-label', T(value || ariaLabel));
      }
    });
  };
  host.init = function() {
    host.head = document.querySelector('.lyt_head');
    host.main = document.querySelector('.lyt_main');
    host.skipnav = document.querySelector('.lyt_skipnav');
    host.skipnav.addEventListener('click', function() { host.viewer.focus(); });
    host.toolbar = new host.setupToolbar; host.toolbar.init();
    host.sidebar = new host.setupSidebar; host.sidebar.init();
    host.viewer = new host.setupViewer; host.viewer.init();
  };
  host.setupToolbar = function() {
    const toolbar = this;
    toolbar.init = function() {
      toolbar.tools = new host.setupToolbarTools; toolbar.tools.init();
    };
  };
  host.setupToolbarTools = function() {
    const tools = this;
    tools.links = { // language links. Keys are based on ISO 639-1 language name standard.
      v1: {
        en: 'https://www.autohotkey.com/docs/v1/',
        de: 'https://ahkde.github.io/docs/v1/',
        ko: 'https://ahkscript.github.io/ko/docs/',
        pt: 'https://ahkscript.github.io/pt/docs/',
        zh: 'https://wyagd001.github.io/zh-cn/docs/'
      },
      v2: {
        en: 'https://www.autohotkey.com/docs/v2/',
        de: 'https://ahkde.github.io/docs/v2/',
        ja: 'https://ahkscript.github.io/ja/docs/v2/',
        zh: 'https://wyagd001.github.io/v2/docs/'
      }
    };
    tools.opened = null;
    tools.init = function() {
      if (!site.waitForDataTranslate(tools.init)) return;
      tools.element = host.head.querySelector('.lyt_tools');
      tools.home.init();
      tools.language.init();
      tools.version.init();
      tools.edit.init();
      tools.back.init();
      tools.forward.init();
      tools.zoom.init();
      tools.print.init();
      tools.browser.init();
      tools.color.init();
      tools.settings.init();
      tools.update(site.urlRelative, site.urlEquivRelative);
      tools.element.querySelector('.lyt_tools_' + (site.inCHM ? 'online' : 'chm')).hide();
    };
    tools.setupDropdown = function(tool) {
      tool.dropdown = tool.element.querySelector('ul');
      tool.open = function() {
        if (tools.opened) return;
        tools.opened = this;
        this.element.classList.remove('closed');
        this.element.classList.add('open', 'selected');
        this.dropdown.slideDown(100);
      };
      tool.close = function() {
        if (!tools.opened) return;
        tools.opened = null;
        this.element.classList.add('closed');
        this.element.classList.remove('open', 'selected');
        this.dropdown.slideUp(100);
      };
      tool.toggle = function() {
        tools.opened ? this.close() : this.open();
      };
      tool.element.addEventListener('click', function() {
        if (tools.opened && tools.opened !== tool)
          tools.opened.close();
        tool.toggle();
      });
      tool.dropdown.addEventListener('mouseup', function(e) {
        if (e.button == 0 || e.button == 1) // left-click or middle-click
          setTimeout(function() { tool.close(); }, 200);
      });
    };
    tools.home = {
      link: location.protocol + '//' + location.host,
      init: function() {
        tools.home.element = tools.element.querySelector('.lyt_tool_home');
        tools.home.element.firstChild.href = tools.home.link;
      }
    };
    tools.language = {
      init: function() {
        tools.language.element = tools.element.querySelector('.lyt_tool_language');
        tools.setupDropdown(tools.language);
        tools.language.dropdown.querySelector('[data-content="' + T('en') + '"]').parentElement.hide();
      },
      update: function(urlRelative) {
        tools.language.dropdown.children.forEach(function(li) {
          const a = li.querySelector('a');
          const lang = a.dataset.content;
          const link = tools.links[T('v1')][lang];
          link ? a.href = link + urlRelative : li.hide();
        });
      }
    };
    tools.version = {
      init: function() {
        tools.version.element = tools.element.querySelector('.lyt_tool_version');
        tools.setupDropdown(tools.version);
        tools.version.dropdown.querySelector('[data-content="' + T('v1') + '"]').parentElement.hide();
      },
      update: function(urlRelative, urlEquivRelative) {
        tools.version.dropdown.children.forEach(function(li) {
          const a = li.querySelector('a');
          const ver = a.dataset.content;
          const link = tools.links[ver][T('en')];
          a.href = (link || link[ver]['en']) + (urlEquivRelative || urlRelative);
        });
      }
    };
    tools.edit = {
      init: function() {
        tools.edit.element = tools.element.querySelector('.lyt_tool_edit');
      },
      update: function(urlRelative) {
        tools.edit.element.firstChild.href = T('https://github.com/Lexikos/AutoHotkey_L-Docs/edit/v1/docs/') + urlRelative;
      }
    };
    tools.back = {
      init: function() {
        tools.back.element = tools.element.querySelector('.lyt_tool_back');
        tools.back.element.addEventListener('click', function() { history.back(); });
      }
    };
    tools.forward = {
      init: function() {
        tools.forward.element = tools.element.querySelector('.lyt_tool_forward');
        tools.forward.element.addEventListener('click', function() { history.forward(); });
      }
    };
    tools.zoom = {
      init: function() {
        tools.zoom.element = tools.element.querySelector('.lyt_tool_zoom');
        tools.zoom.element.addEventListener('click', function() {
          const fontSize = cache.fontSize + 0.2;
          frame.postMessage('setFontSize', fontSize > 1.4 ? 0.6 : fontSize);
        });
      }
    };
    tools.print = {
      init: function() {
        tools.print.element = tools.element.querySelector('.lyt_tool_print');
        tools.print.element.addEventListener('click', function() {
          host.viewer.frame.contentWindow.document.execCommand('print', false, null);
        });
      }
    };
    tools.browser = {
      init: function() {
        tools.browser.element = tools.element.querySelector('.lyt_tool_browser');
        tools.browser.element.addEventListener('mouseup', function(e) {
          if (e.button == 1) // middle-click
            window.clipboardData.setData('Text', tools.browser.firstChild.href);
        });
      },
      update: function(urlRelative) {
        tools.browser.element.firstChild.href = tools.links[T('v1')][T('en')] + urlRelative;
      }
    };
    tools.color = {
      init: function() {
        tools.color.element = tools.element.querySelector('.lyt_tool_color');
        tools.color.element.addEventListener('click', function() {
          const scheme = cache.colorScheme;
          const prefers_dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const dark_active = scheme == 'dark' || (scheme == null && prefers_dark);
          site.setSchemeAll(dark_active ? 'light' : 'dark');
        });
      }
    };
    tools.settings = {
      init: function() {
        tools.settings.element = tools.element.querySelector('.lyt_tool_settings');
        tools.settings.element.addEventListener('click', function() {
          host.viewer.openURL(site.urlBase + '/settings.htm');
        });
      }
    };
    tools.update = function(urlRelative, urlEquivRelative) {
      tools.language.update(urlRelative);
      tools.version.update(urlRelative, urlEquivRelative);
      tools.edit.update(urlRelative);
      tools.browser.update(urlRelative);
    };
  };
  host.setupSidebar = function() {
    const sidebar = this;
    sidebar.init = function() {
      sidebar.toggle = host.head.querySelector('.lyt_sidebar_toggle button');
      sidebar.left = host.main.querySelector('.lyt_left');
      sidebar.width = sidebar.widthDefault = window.getComputedStyle(sidebar.left).width;
      if (site.onPhone) sidebar.left.classList.add('phone');
      sidebar.toggle.addEventListener('click', function() {
        host.sidebar.show(!sidebar.visible);
      });
      sidebar.tabs = new host.setupSidebarTabs; sidebar.tabs.init();
      sidebar.quick = new host.setupSidebarQuick; sidebar.quick.init();
      sidebar.dragbar = new host.setupSidebarDragbar; sidebar.dragbar.init();
      sidebar.show(site.onPhone ? false : user.settings.showSidebar);
    };
    sidebar.visible = null;
    sidebar.show = function(show) {
      if (show == sidebar.visible) return;
      sidebar.visible = cache.update('showSidebar', show);
      const show_style = { width: sidebar.width, visibility: 'visible' };
      const hide_style = { width: 0, visibility: 'hidden' };
      if (show) {
        Object.assign(sidebar.tabs.row.style, show_style);
        Object.assign(sidebar.left.style, show_style);
        sidebar.dragbar.element.show();
        sidebar.dragbar.element.style.left = sidebar.width;
        sidebar.tabs.selected.page.focus();
        if (site.onPhone) host.toolbar.tools.element.hide();
      }
      else {
        Object.assign(sidebar.tabs.row.style, hide_style);
        Object.assign(sidebar.left.style, hide_style);
        sidebar.dragbar.element.hide();
        if (site.onPhone) host.toolbar.tools.element.show();
      }
    };
    sidebar.setWidth = function(width) {
      sidebar.width = width;
      sidebar.left.style.width = width;
      sidebar.tabs.row.style.width = width;
      sidebar.dragbar.element.style.left = width;
    };
  };
  host.setupSidebarTabs = function() {
    const tabs = this;
    tabs.init = function() {
      tabs.row = host.head.querySelector('.lyt_tab_row');
      tabs.buttons = tabs.row.querySelectorAll('li');
      tabs.pages = host.sidebar.left.querySelectorAll('[class^=lyt_tab_page_]');
      tabs.load = host.sidebar.left.querySelector('.lyt_load');
      tabs.items = [];
      tabs.buttons.forEach(function(button, i) {
        tabs.items.push({ button: button, page: tabs.pages[i] });
        button.addEventListener('click', function() { tabs.selectByIndex(i); });
      });
      tabs.selected = null;
      tabs.page_toc = new host.setupSidebarTabsPageToc; tabs.page_toc.init();
      tabs.page_index = new host.setupSidebarTabsPageIndex; tabs.page_index.init();
      tabs.page_search = new host.setupSidebarTabsPageSearch; tabs.page_search.init();
      tabs.load.hide();
      tabs.selectByIndex(cache.selectedTab);
    };
    tabs.selectByIndex = function(index) {
      if (tabs.items[index] == tabs.selected) return;
      if (tabs.selected != null) tabs.selected.button.classList.remove('selected');
      tabs.selected = tabs.items[index]; cache.update('selectedTab', index);
      tabs.selected.button.classList.add('selected');
      tabs.items.forEach(function(item) {
        item.page.classList.toggle('visible', item.page === tabs.selected.page);
        item.page.classList.toggle('hidden', item.page !== tabs.selected.page);
      });
      tabs.selected.page.focus({ focusVisible: false });
    };
  };
  host.setupSidebarQuick = function() {
    const quick = this;
    quick.init = function() {
      quick.element = host.sidebar.left.querySelector('.lyt_quick');
      quick.head = quick.element.querySelector('.lyt_quick_head');
      quick.main = quick.element.querySelector('.lyt_quick_main');
      quick.chevron = quick.element.querySelector('.chevron');
      quick.head.addEventListener('click', function() {
        quick.collapse(!quick.collapsed);
      });
      quick.main.addEventListener('click', function(e) {
        const li = e.target.closest('li');
        if (!li) return;
        e.preventDefault();
        host.viewer.openURL(li.querySelector('a').href);
      });
      if (!site.onTouchDevice) {
        quick.main.addEventListener('mouseenter', function() { quick.showScrollbar(); });
        quick.main.addEventListener('mouseleave', function() { quick.hideScrollbar(); });
      }
      if (!site.onTouchDevice) quick.hideScrollbar();
      quick.collapse(user.settings.collapseQuickRef);
    };
    quick.collapsed = null;
    quick.collapse = function(collapse) {
      if (collapse == quick.collapsed) return;
      quick.collapsed = cache.update('collapseQuickRef', collapse);
      host.sidebar.tabs.items.forEach(function(item) {
        item.page.classList.toggle('full', collapse);
        item.page.classList.toggle('shrinked', !collapse);
      });
      quick.chevron.classList.toggle('right', collapse);
      quick.chevron.classList.toggle('down', !collapse);
      collapse ? quick.main.hide() : quick.main.show();
    };
    quick.update = function(url, h2s) {
      const ul = document.createElement('ul'); quick.main.replaceChildren(ul);
      h2s.forEach(function(h2) {
        const li = document.createElement('li'); ul.appendChild(li);
        const span = document.createElement('span'); li.appendChild(span);
        const a = document.createElement('a'); span.appendChild(a);
        a.href = site.urlBase + '/' + getUrlHashless(url) + (h2.id ? '#' + h2.id : '');
        a.setAttribute('data-content', h2.innerText);
        a.setAttribute('aria-label', h2.innerText);
        li.title = h2.innerText;
      });
    };
    quick.showScrollbar = function() { quick.main.style.overflow = ''; };
    quick.hideScrollbar = function() { quick.main.style.overflow = 'hidden'; };
  };
  host.setupSidebarDragbar = function() {
    const dragbar = this;
    var dragging = false, dragMoveHandler = null, ghostbar = null;
    dragbar.init = function() {
      dragbar.element = host.main.querySelector('.lyt_dragbar');
      dragbar.element.addEventListener(site.inCHM ? 'mousedown' : 'pointerdown', function(e) {
        if (e.button !== 0) return;
        e.preventDefault();
        dragging = true;
        if (site.inCHM) {
          host.viewer.show(false);
          ghostbar = document.createElement('div');
          ghostbar.classList.add('lyt_ghostbar');
          document.body.appendChild(ghostbar);
          dragMoveHandler = function(e) { ghostbar.style.left = (e.pageX + 2) + 'px'; };
          document.addEventListener('mousemove', dragMoveHandler);
        }
        else {
          dragbar.element.setPointerCapture(e.pointerId);
          dragMoveHandler = function(e) { host.sidebar.setWidth(e.pageX + 'px'); };
          dragbar.element.addEventListener('pointermove', dragMoveHandler);
        }
      });
      (site.inCHM ? document : dragbar.element).addEventListener(site.inCHM ? 'mouseup' : 'pointerup', function(e) {
        if (!dragging) return;
        dragging = false;
        if (site.inCHM) {
          host.sidebar.setWidth(e.pageX + 'px');
          host.viewer.show(true);
          ghostbar.remove();
          document.removeEventListener('mousemove', dragMoveHandler);
        } else {
          dragbar.element.releasePointerCapture(e.pointerId);
          dragbar.element.removeEventListener('pointermove', dragMoveHandler);
        }
      });
      dragbar.element.addEventListener('dblclick', function() {
        host.sidebar.setWidth(host.sidebar.widthDefault);
      });
    };
  };
  host.setupSidebarTabsPageToc = function() {
    const toc = this;
    toc.items = { all: [], selected: [], focused: null };
    toc.createList = function(items) {
      var li_counter = 0;
      return worker(items);
      function worker(items) {
        const ul = document.createElement('ul');
        items.forEach(function(item) {
          const text = item[0], path = item[1], subitems = item[2];
          const li = document.createElement('li'); toc.items.all.push(li);
          if (path != '') {
            li.label = document.createElement('a');
            li.label.href = site.urlBase + '/' + path;
            if (cache.deprecate_data[path])
              li.label.classList.add('deprecated');
          }
          else
            li.label = document.createElement('button');
          li.label.setAttribute('data-content', text);
          li.label.setAttribute('aria-label', text);
          const span = document.createElement('span');
          span.appendChild(li.label);
          li._index = li_counter++;
          li.title = text;
          if (cache.deprecate_data[path])
            li.title += '\n\n' + T('Deprecated. New scripts should use {0} instead.').format(cache.deprecate_data[path]);
          if (subitems && subitems.length) {
            li.classList.add('closed');
            li.appendChild(span);
            li.subList = li.appendChild(worker(subitems));
          }
          else
            li.appendChild(span);
          ul.appendChild(Object.assign(li, toc.extensions));
        });
        return ul;
      }
    };
    toc.init = function() {
      if (!site.waitForDataTOC(toc.init)) return;
      if (!site.waitForDataDeprecate(toc.init)) return;
      if (!site.waitForDataTranslate(toc.init)) return;
      toc.element = host.sidebar.left.querySelector('.lyt_tab_page_toc');
      toc.element.addEventListener('click', function(e) {
        const item = e.target.closest('li');
        if (!item) return;
        e.preventDefault();
        cache.update('toc_clickItem', item._index);
        if (item.subList) {
          item.expanded ? item.collapse(100) : item.expand(100);
        }
        if (item.label.href) {
          toc.deselectItems(); item.select();
          host.viewer.openURL(item.label.href);
        }
      });
      if (!site.onTouchDevice) {
        toc.element.addEventListener('mouseenter', function() { toc.showScrollbar(); });
        toc.element.addEventListener('mouseleave', function() { toc.hideScrollbar(); });
      }
      toc.element.addEventListener('focusin', function(e) {
        toc.items.focused = e.target.closest('li');
      });
      toc.element.focus = function() {
        if (toc.items.focused) toc.items.focused.focus();
      };
      toc.element.appendChild(toc.createList(cache.toc_data));
      if (!site.onTouchDevice) toc.hideScrollbar();
      requestAnimationFrame(function() {
        toc.update(site.urlFull, null, false);
        if (cache.selectedTab == 0) document.body.focus();
      });
    };
    toc.update = function(urlFull, history_state, focus) {
      if (toc.findItemByUrl(toc.items.selected, urlFull)) return;
      toc.deselectItems();
      if (history_state && history_state.toc_clickItemTemp) {
        toc.items.all[history_state.toc_clickItemTemp].select();
        return;
      }
      const itemsToSelect = toc.getItemsToSelectByUrl(urlFull);
      if (!itemsToSelect) return;
      toc.selectItems(itemsToSelect);
      if (focus) itemsToSelect[0].focus();
    };
    toc.extensions = {
      select: function() {
        if (toc.items.selected.includes(this)) return;
        toc.items.selected.push(this);
        this.classList.add('selected');
        this.getParents().forEach(function(parent) { parent.highlight(); });
      },
      deselect: function() {
        if (!toc.items.selected.includes(this)) return;
        toc.items.selected = toc.items.selected.filter(function(i) { return i !== this; }, this);
        this.classList.remove('selected');
        this.getParents().forEach(function(parent) { parent.unhighlight(); });
      },
      getParents: function() {
        const parents = [];
        for (var p = this; p && p !== toc; p = p.parentElement.closest('li'))
          parents.push(p);
        return parents;
      },
      highlight: function() { this.classList.add('highlighted'); },
      unhighlight: function() { this.classList.remove('highlighted'); },
      expand: function(duration) {
        if (!this.subList || this.expanded) return;
        this.expanded = true;
        this.subList.slideDown(duration);
        this.classList.remove('closed');
        this.classList.add('open');
      },
      expandParents: function(duration) {
        this.getParents().forEach(function(parent) {
          parent.highlight();
          parent.expand(duration);
        });
      },
      collapse: function(duration) {
        if (!this.subList || !this.expanded) return;
        this.expanded = false;
        this.subList.slideUp(duration);
        this.classList.add('closed');
        this.classList.remove('open');
      },
      collapseParents: function(duration) {
        this.getParents().forEach(function(parent) {
          parent.unhighlight();
          parent.collapse(duration);
        });
      },
      focus: function() {
        toc.items.focused = this;
        this.label.focus({ focusVisible: false });
      }
    };
    toc.getItemsToSelectByUrl = function(url) {
      const clicked = toc.items.all[cache.toc_clickItem];
      if (url.endsWith('/')) url += 'index.htm';
      const matchList = toc.filterItemsByUrl(toc.items.all, url);
      const matchListNoHash = toc.filterItemsByUrl(toc.items.all, getUrlHashless(url));
      const matches = matchList.length ? matchList : matchListNoHash.length ? matchListNoHash : null;
      const useClicked = matches && matches.some(function(el) { return el === clicked; });
      return useClicked ? [clicked] : matches;
    };
    toc.selectItems = function(items) {
      items.forEach(function(item) { item.select(); item.expandParents(0); });
    };
    toc.filterItemsByUrl = function(items, url) {
      return items.filter(function(item) { return (item.label.href === url); });
    };
    toc.findItemByUrl = function(items, url) {
      return items.find(function(item) {
        return (item.label.href === url || item.label.href === getUrlHashless(url));
      });
    };
    toc.deselectItems = function() {
      toc.items.selected.forEach(function(item) { item.deselect(); });
    };
    toc.showScrollbar = function() { toc.element.style.overflow = ''; };
    toc.hideScrollbar = function() { toc.element.style.overflow = 'hidden'; };
  };
  host.setupSidebarTabsPageIndex = function() {
    const index = this;
    index.createList = function(items, filter) {
      const list = [];
      const type_name = { 2: T('function'), 4: T('operator'), 6: T('class') };
      const lang = T('en');
      const collator = window.Intl ? new Intl.Collator(lang) : null;
      if (collator)
        items.sort(function(a, b) { return collator.compare(a[0], b[0]); });
      else
        items.sort(function(a, b) { return a[0].localeCompare(b[0], lang); });
      items.forEach(function(item, i) {
        var label = item[0], path = item[1], type = item[2];
        if (filter != -1 && type != filter) return;
        if (filter == -1 && type && type_name[type]) {
          var prev = items[i - 1], next = items[i + 1];
          if (prev && prev[0] == label || next && next[0] == label)
            label += ' (' + type_name[type] + ')';
        }
        list.push({ label: label, href: site.urlBase + '/' + path });
      });
      return list;
    };
    index.init = function() {
      if (!site.waitForDataIndex(index.init)) return;
      if (!site.waitForDataTranslate(index.init)) return;
      index.element = host.sidebar.left.querySelector('.lyt_tab_page_index');
      index.edit = index.element.querySelector('.lyt_input input');
      index.filter = index.element.querySelector('.lyt_select select');
      index.list = index.element.querySelector('.lyt_list');
      setupEditListCombo(index.edit, index.list);
      index.edit.value = cache.index_input || null;
      index.edit.addEventListener('input', selectFirstMatch);
      index.filter.value = cache.index_filter || -1;
      index.filter.addEventListener('change', filterList); filterList();
      index.element.focus = function() { index.edit.focus(); };
      function selectFirstMatch() {
        const input = cache.update('index_input', index.edit.value.toLowerCase());
        if (!input) {
          index.edit.setMatchStateColor(null);
          return null;
        }
        const match = index.list.children[index.list.items.findIndex(function(item) {
          return item.label.toLowerCase().startsWith(input);
        })];
        if (match) {
          index.list.selectItemByIndex(match._index);
          const scroll_target = index.list.children[Math.min(match._index + 5, index.list.max)];
          requestAnimationFrame(function() { scroll_target.scrollIntoView(false); });
          index.edit.setMatchStateColor(true);
          return true;
        }
        index.edit.setMatchStateColor(false);
        return false;
      }
      function filterList() {
        const selection = cache.update('index_filter', index.filter.value);
        index.filter.classList[selection == -1 ? 'add' : 'remove']('lyt_select_empty');
        index.list.replaceItems(index.createList(cache.index_data, selection));
        if (!selectFirstMatch(index.edit, index.list))
          index.list.selectItemByIndex(0);
      }
    };
  };
  host.setupSidebarTabsPageSearch = function() {
    const search = this;
    search.init = function() {
      if (!site.waitForDataSearch(search.init)) return;
      search.element = host.sidebar.left.querySelector('.lyt_tab_page_search');
      search.edit = search.element.querySelector('.lyt_input input');
      search.list = search.element.querySelector('.lyt_list');
      search.checkbox = search.element.querySelector('.lyt_checkbox input');
      search.updown = search.element.querySelector('.lyt_checkbox .lyt_updown');
      setupEditListCombo(search.edit, search.list);
      search.edit.value = cache.search_input || null;
      search.edit.addEventListener('input', updateList); updateList();
      search.checkbox.checked = cache.search_highlightTerms;
      search.element.focus = function() { search.edit.focus(); };
      search.checkbox.addEventListener('change', function() {
        const checked = cache.update('search_highlightTerms', this.checked);
        const path = 'content.search_highlight.' + (checked ? 'showMatchesAndSelectFirst' : 'hideMatches');
        frame.postMessage(path, cache.search_input);
      });
      search.updown.children.addEventListener('click', function() {
        const count = this.classList.contains('lyt_updown_up') ? -1 : 1;
        frame.postMessage('content.search_highlight.moveMatchSelection', count);
      });
      function updateList() {
        const input = cache.update('search_input', search.edit.value);
        const input_array = cache.update('search_input_array', convertInputToArray(input));
        search.list.removeItems();
        search.edit.setMatchStateColor(null);
        if (!input_array) return;
        search.list.addItems(search.createList(input_array));
        search.list.selectItemByIndex(0);
        search.edit.setMatchStateColor(!!(search.list.items.length));
      }
      function convertInputToArray(input) {
        input = input.toLowerCase().replace(/^ +| +$| +(?= )|\+/, ''); // Normalize whitespace.
        if (input == '') return null;
        return input.split(' ').filter(Boolean); // Split and remove undefined or empty strings.
      }
    };
    search.createList = function(terms) {
      const list = [], PartialIndex = {}, RESULT_LIMIT = 50;
      // Get each word from index and clone for modification below:
      const all_results = [];
      terms.forEach(function(term) {
        var t = term.replace(/(\(|\(\))$/, ''); // special case for page names ending with ()
        var w = index_partial(t);
        w = w ? w.slice() : [];
        all_results.push(get_results(w));
      });
      rank_results(all_results, terms).slice(0, RESULT_LIMIT).forEach(function(r) {
        list.push({ label: r.n, href: site.urlBase + '/' + r.u });
      });
      return list;

      function file_has_all_words(file_index, words, start) {
        for (; start < words.length; ++start) {
          var iw = index_partial(words[start]);
          if (!iw || !iw.includes(file_index))
            return false;
        }
        return true;
      }

      // Get normal results for each term:
      function get_results(w) {
        var c = 0;
        const ret = [];
        for (var i = 0; i < w.length && c < RESULT_LIMIT; ++i) {
          if (!file_has_all_words(w[i], terms, 1))
            continue; // Skip files which don't have all the words.
          c++;
          var f = cache.search_files[w[i]];
          // data.files excludes '.htm' to save space, so add it back:
          f = (f.includes('#')) ? f.replace('#', '.htm#') : f + '.htm';
          ret.push({ u: f, t: (cache.search_titles[w[i]] || f) });
        }
        return ret;
      }

      function rank_results(aro, terms) {
        // Organize the info:
        const aro_k = [];
        const aro_ua = [];
        const aro_ka = [];
        aro.forEach(function(ar, i) {
          aro_k[i] = [];
          if (ar === undefined) return;
          ar.forEach(function(r) {
            aro_k[i].push(r.t);
            aro_ka.push(r.t);
            aro_ua[r.t] = r.u;
          });
        });
        // Assemble list of unique results:
        const ukeys = [];
        aro_ka.forEach(function(k) { if (!ukeys.includes(k)) ukeys.push(k); });

        // The lower the rank the better normal ranking (based on page contents):
        const uranks = [];
        for (var i = 0; i < ukeys.length; ++i) {
          uranks[ukeys[i]] = [];
          for (var j = 0; j < aro_k.length; ++j)
            uranks[ukeys[i]][j] = ukeys[i].indexOf(aro_k[j]);
        }
        // Added ranking (based on page names) and calculate the ranks:
        ukeys.forEach(function(name) {
          const tmp = uranks[name], name_lower = name.toLowerCase();
          // If the name contains any of the search terms:
          if (terms.find(function(term) { name_lower.includes(term); }))
            tmp.push(0); // Give it a better rank.
          else
            tmp.push(1, 8); // Give it a worse rank, Tweakable!
          uranks[name] = array_avg(tmp);
        });

        // Sort results by rank average and finalize:
        const ret = [];
        ukeys.forEach(function(name) {
          const url = aro_ua[name];
          const avg = uranks[name];
          ret.push({ n: name, u: url, a: avg });
        });
        ret.sort(function(a, b) { return (a.a - b.a) });
        ret.slice(0, RESULT_LIMIT);

        return ret;
      }

      function array_avg(arr) {
        var sum = 0;
        var total = arr.length;
        arr.forEach(function(n, i) {
          if ((n < 0) || (arr[i - 1] == n))
            total -= 1; // Give a worse rank, duplicate ranks are ignored.
          else
            sum += n;
        });
        return (sum / total);
      }

      function decode_numbers(a) {
        // Decode a string of [a-zA-Z] based 'numbers'
        const n = [];
        for (i = 0; i < a.length; i += 2)
          n.push(decode_number(a.substr(i, 2)));
        return n;
      }

      function decode_number(a) {
        // Decode a number encoded by encode_number() in build_search.ahk:
        var n = 0, c;
        for (var i = 0; i < a.length; ++i) {
          c = a.charCodeAt(i);
          n = n * 52 + c - ((c >= 97 && c <= 122) ? 97 : 39);
        }
        return n;
      }

      function index_whole(word) {
        // Return a word from the index, decoding the list of files
        // if it hasn't been decoded already:
        var files = cache.search_index[word];
        if (typeof (files) == 'string') {
          files = decode_numbers(files);
          cache.search_index[word] = files;
        }
        return files;
      }

      function index_partial(word) {
        if (word[0] == '+') // + prefix disables partial matching.
          return index_whole(word.substr(1));
        // Check if we've already indexed this partial word.
        const indexed = PartialIndex[word];
        if (indexed !== undefined)
          return indexed;
        // Find all words in search.index which *contain* this word
        // and cache the result.
        const files = [], files_low = [];
        for (var iw in cache.search_index) {
          var p = iw.indexOf(word);
          if (p != -1)
            files.push.apply(p == 0 ? files : files_low, index_whole(iw));
        }
        files.push.apply(files, files_low);
        const unique = [];
        for (var i = 0; i < files.length; ++i)
          if (unique.indexOf(files[i]) == -1)
            unique.push(files[i]);
        PartialIndex[word] = unique;
        return unique;
      }
    };
  };
  host.onHashChange = site.onHashChange;
  host.setScheme = site.setScheme;
  host.addShortcuts = site.addShortcuts;
}

function setupSiteFrame() {
  const frame = this;
  frame.cache = cache;
  frame.listenForMessages = function() { site.listenForMessages.apply(frame); };
  frame.postMessage = function(path) {
    const params = ['frame.' + path];
    for (var i = 1; i < arguments.length; i++) params.push(arguments[i]);
    site.postMessage.apply(null, params);
  };
  frame.applyUserSettings = site.applyUserSettings;
  frame.updateHost = function() {
    const title = document.title;
    const urlFull = location.href;
    const urlRelative = getUrlRelative(urlFull, site.urlBase);
    const urlEquivRelative = site.urlEquivRelative;
    const history_state = history.state;
    host.postMessage('update', title, urlFull, urlRelative, urlEquivRelative, history_state);
  };
  frame.onHashChange = site.onHashChange;
  frame.onDOMContentLoad = site.onDOMContentLoad;
  frame.onBeforeUnload = site.onBeforeUnload;
  frame.saveLastClickedTocItem = function() {
    if (cache.toc_clickItemTemp && site.supportsHistory) {
      const state = history.state || {};
      const newState = Object.assign({}, state, { toc_clickItemTemp: cache.toc_clickItemTemp });
      history.replaceState(newState, null, null);
    }
    cache.update('toc_clickItemTemp', null);
  };
  frame.setFontSize = function(fontSize) {
    cache.update('fontSize', fontSize);
    if (fontSize == 1) {
      document.body.style.fontSize = '';
      return;
    }
    const old_size = document.body.style.fontSize;
    const new_size = fontSize + 'em';
    if (old_size == new_size) return;
    document.body.style.fontSize = new_size;
  };
  frame.setScheme = site.setScheme;
  frame.addShortcuts = site.addShortcuts;
  frame.show = function() {
    if (!site.inIE) host.postMessage('viewer.show', true);
  };
  frame.hide = function() {
    if (!site.inIE) host.postMessage('viewer.show', false);
  };
  frame.focus = function() {
    if (cache.lastFocusLocation != 'frame') return;
    host.postMessage('viewer.focus');
  };
  frame.content = new setupSiteFrameContent;
}

function setupSiteFrameContent() {
  const content = this;
  content.modify = function() {
    if (!site.waitForDataTranslate(content.modify)) return;
    content.addFooter();
    const queue = createFuncQueue();
    queue.add(content.highlightAnchor);
    queue.add(content.modifyTables);
    queue.add(content.modifyHeadings);
    queue.add(content.gatherHeadingsForQuickRef);
    queue.add(content.modifyExternalLinks);
    queue.add(content.modifyDeprecatedLinks);
    queue.add(content.modifyVersions);
    queue.add(content.modifyCodeBoxes);
    queue.add(content.addBackButton);
    queue.add(content.highlightSearchTerms);
  };
  // Briefly show the user where the current anchor points to:
  content.highlightAnchor = function() {
    if (!location.hash) return;
    const anchor = document.getElementById(location.hash.slice(1));
    if (!anchor) return;
    anchor.classList.remove('anchor_transition');
    anchor.classList.add('anchor_highlight');
    setTimeout(function() {
      anchor.classList.add('anchor_transition');
      anchor.classList.remove('anchor_highlight');
    }, 200);
  };
  // Mobile view only: Convert .info tables into row‑per‑cell tables:
  content.modifyTables = function() {
    if (!site.onPhone) return;
    document.body.querySelectorAll('table.info').forEach(function(table) {
      var headers;
      const newTable = document.createElement('table');
      if (table.id) newTable.id = table.id;
      newTable.classList.add('mobile');
      const frag = document.createDocumentFragment(); // Use this for performance.
      const trs = table.querySelectorAll('tr');
      trs.forEach(function(tr, i) {
        const ths = tr.querySelectorAll('th');
        if (ths.length) { headers = ths; return; }
        const newTable_tbody = document.createElement('tbody');
        if (tr.id) newTable_tbody.id = tr.id;
        // Normalize rowspan/colspan so each logical cell becomes a real <td>:
        tr.querySelectorAll('td').forEach(function(td, ii) {
          if (td.rowSpan)
            for (var iii = 1; iii < td.rowSpan; iii++)
              trs[i + iii].insertCell(ii).innerHTML = td.innerHTML;
          if (td.colSpan)
            for (var iii = 1; iii < td.colSpan; iii++)
              tr.insertCell(ii + iii).innerHTML = td.innerHTML;
        });
        // Build the rows from normalized cells:
        tr.querySelectorAll('td').forEach(function(td, ii) {
          const row = document.createElement('tr');
          if (td.id) row.id = td.id;
          const cellLabel = document.createElement('td');
          const cellValue = document.createElement('td');
          const h = headers && headers[ii];
          cellLabel.innerHTML = h ? (h.abbr || h.innerHTML) : '';
          cellValue.innerHTML = td.innerHTML;
          row.appendChild(cellLabel); row.appendChild(cellValue);
          newTable_tbody.appendChild(row);
        });
        frag.appendChild(newTable_tbody);
      });
      newTable.appendChild(frag);
      table.parentNode.replaceChild(newTable, table);
    });
  };
  // Convert headings into clickable links, allowing them to be copied via right-click:
  content.modifyHeadings = function() {
    if (site.inCHM) return;
    document.body.querySelectorAll('h2, h3, h4, h5, h6').forEach(function(h) {
      h.classList.add('headLine');
      h.id = getID(h);
      // Add the link, and unnest nested links if necessary:
      const a = document.createElement('a');
      a.classList.add('headLink'); a.href = '#' + h.id;
      const frag = document.createDocumentFragment();
      var a_cloned = a.cloneNode();
      h.childNodes.forEach(function(node) {
        const node_cloned = node.cloneNode(true);
        a_cloned.appendChild(node_cloned);
        if (node.tagName !== 'A') return;
        frag.appendChild(a_cloned);
        frag.appendChild(node_cloned);
        a_cloned = a.cloneNode();
      });
      if (a_cloned.firstChild) frag.appendChild(a_cloned);
      h.replaceChildren(frag);
      // Jump to the heading if the page has not been scrolled yet:
      if (!document.documentElement.scrollTop && h.id === location.hash.slice(1))
        h.scrollIntoView();
    });
    function getID(h) {
      if (h.id) return h.id;
      if (h.parentNode.id && h.parentNode !== document.body && !h.previousElementSibling)
        return h.parentNode.id; // for .methodShort
      // Otherwise generate an id (but relying on it should be avoided for translation reasons):
      const text = h.textContent.replace(/\s/g, '_').replace(/[():.,;'#\[\]\/{}&="|?!]/g, '');
      return document.getElementById(text) ? text + '_' + h.index() : text;
    }
  };
  // Gather and show all h2 headings in the sidebar's quick reference:
  content.gatherHeadingsForQuickRef = function() {
    const h2_list = [];
    document.body.querySelectorAll('h2').forEach(function(h2) {
      const h2_cloned = h2.cloneNode(true);
      h2_cloned.querySelectorAll('.ver, .headnote').forEach(function(el) { el.remove(); });
      h2_list.push({ id: h2_cloned.id, innerText: h2_cloned.innerText });
    });
    host.postMessage('sidebar.quick.update', site.urlRelative, h2_list);
  };
  // Mark external links and make them open in a new tab/window:
  content.modifyExternalLinks = function() {
    document.body.querySelectorAll('a[href^="http"]').forEach(function(a) {
      if (a.querySelector('img') || a.classList.contains('no-ext')) return;
      a.classList.add('extLink'); a.target = '_blank';
    });
  };
  // Mark deprecated-syntax links and add tooltips indicating the recommended alternative:
  content.modifyDeprecatedLinks = function() {
    if (!site.waitForDataDeprecate(content.modifyDeprecatedLinks)) return;
    document.body.querySelectorAll('a').forEach(function(a) {
      const force_deprecated = a.classList.contains('deprecated');
      const has_title = a.hasAttribute('title');
      if (force_deprecated && !has_title) a.title = T('Deprecated.');
      const href = a.getAttribute('href'); if (!href) return;
      if (href.startsWith('#') && !force_deprecated) return;
      const alt = cache.deprecate_data[getUrlRelative(a.href, site.urlBase)];
      if (!alt) return;
      a.classList.add('deprecated');
      if (has_title) return;
      a.title = T('Deprecated. New scripts should use {0} instead.').format(alt);
    });
  };
  // Add links for version annotations:
  content.modifyVersions = function() {
    document.body.querySelectorAll('span.ver').forEach(function(span) {
      const text = span.textContent;
      const m = /(v(\d+)\.(\d+)(?:\.(\d+))?(\-[\w\.\-]+)?)(\+)?/.exec(text);
      if (!m) return;
      const ver = m[1], major = m[2], minor = m[3], patch = m[4], prerelease = m[5], plus = m[6];
      const a = document.createElement('a');
      a.title = (plus ? T('Applies to AutoHotkey {0} and later') : 'AutoHotkey {0}').format(ver);
      a.href = site.urlBase + '/ChangeLog.htm#' + ver;
      a.textContent = text;
      span.replaceChildren(a);
    });
  };
  // Modify code boxes:
  content.modifyCodeBoxes = function() {
    const pres = document.body.querySelectorAll('pre, code');
    content.addCodeBoxButtons(pres);
    content.addSyntaxColors(pres);
  };
  // Add select and download buttons for code boxes:
  content.addCodeBoxButtons = function(pres) {
    pres.forEach(function(pre) {
      if (pre.tagName == 'CODE') return;
      const is_syntax_box = pre.classList.contains('Syntax');
      const force_no_highlight = pre.classList.contains('no-highlight') || is_syntax_box;
      const wrapper = document.createElement('pre');
      wrapper.className = 'parent ' + pre.className;
      pre.className = 'origin'; if (force_no_highlight) pre.classList.add('no-highlight');
      pre.parentNode.replaceChild(wrapper, pre); wrapper.appendChild(pre);
      const buttons = document.createElement('div'); buttons.className = 'buttons';
      wrapper.appendChild(buttons);
      buttons.appendChild(createButtonSelect(pre));
      if (!force_no_highlight) buttons.appendChild(createButtonDownload(pre));
      wrapper.addEventListener('mouseenter', showButtons);
      wrapper.addEventListener('mouseleave', hideButtons);
    });
    function createButton(className, text, title) {
      const a = document.createElement('a');
      a.className = className; a.setAttribute('data-content', text); a.title = title;
      return a;
    }
    function createButtonSelect(pre) {
      const btn = createButton('selectCode', 'S', T('Select code'));
      btn.addEventListener('click', function() {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(pre);
        selection.removeAllRanges();
        selection.addRange(range);
      });
      return btn;
    }
    function createButtonDownload(pre) {
      const btn = createButton('downloadCode', '↓', T('Download code'));
      const textToWrite = '\ufeff' + pre.textContent.replace(/\n/g, '\r\n');
      const blob = new Blob([textToWrite], { type: 'text/plain' });
      const customFile = pre.getAttribute('filename');
      const defaultFile = location.pathname.split('/').pop().replace(/\.[^.]+$/, '') + '-Script.ahk';
      btn.download = customFile || defaultFile;
      btn.href = (window.URL || window.webkitURL).createObjectURL(blob);
      if (navigator.msSaveBlob) // IE11
        btn.addEventListener('click', function() { navigator.msSaveBlob(blob, btn.download); });
      return btn;
    }
    function showButtons() { this.querySelector('.buttons').classList.add('visible'); }
    function hideButtons() { this.querySelector('.buttons').classList.remove('visible'); }
  }
  // Add syntax highlighting for AutoHotkey code:
  content.addSyntaxColors = function(pres) {
    if (typeof highlighter == 'undefined') {
      if (!site.waitForDataIndex(content.addSyntaxColors, arguments)) return;
      loadScript(site.urlBase + '/static/highlighter/highlighter.js', function() {
        highlighter.addSyntaxColors(pres, cache.index_data, site.urlBase + '/', false);
      });
    }
    else
      highlighter.addSyntaxColors(pres, cache.index_data, site.urlBase + '/', false);
  };
  // Add copyright and licence information at the bottom of the page:
  content.addFooter = function() {
    const div = document.createElement('div');
    div.className = 'footer';
    div.innerHTML = 'Copyright &copy; 2003-' + new Date().getFullYear() + ' ' + location.host + ' - LIC: <a href="' + site.urlBase + '/license.htm" class="no-ext">GNU GPLv2</a>';
    document.body.appendChild(div);
  };
  // Add a button that allows users to quickly return to the top of the page:
  content.addBackButton = function() {
    const div = document.createElement('div');
    div.className = 'back_to_top';
    div.title = T('Back to top');
    div.addEventListener('click', function() {
      const scrollTop = document.documentElement.scrollTop;
      rafAnim(100, function(p) {
        document.documentElement.scrollTop = scrollTop * (1 - p);
      });
    });
    document.body.appendChild(div);
    window.addEventListener('scroll', showBackButton); showBackButton();
    function showBackButton() {
      if (document.documentElement.scrollTop > 20)
        div.classList.add('visible');
      else
        div.classList.remove('visible');
    }
  }
  // Highlight search terms:
  content.search_highlight = new setupFrameContentSearchHighlight('body', 'search_highlight', 'selected');
  content.highlightSearchTerms = function() {
    if (!cache.search_highlightTerms || cache.selectedTab != 2) return;
    content.search_highlight.showMatchesAndSelectFirst();
  };
}

function setupFrameContentSearchHighlight(container_selector, match_class, selected_class) {
  const highlight = this;
  var selectedIndex = 0;
  const match_selector = 'span.' + match_class;
  const selected_selector = match_selector + '.' + selected_class;
  highlight.showMatches = function(search_terms) {
    if (!search_terms) return;
    const container = document.querySelector(container_selector);
    function recurse(node, term) {
      var found = 0;
      if (node.nodeType === 3) {
        var pos = node.data.toUpperCase().indexOf(term);
        pos -= node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length;
        if (pos >= 0) {
          const span = document.createElement('span');
          span.className = match_class;
          const split = node.splitText(pos);
          split.splitText(term.length);
          span.appendChild(split.cloneNode(true));
          split.parentNode.replaceChild(span, split);
          found = 1;
        }
      }
      else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) &&
        node.className !== match_class)
        for (var i = 0; i < node.childNodes.length; i++)
          i += recurse(node.childNodes[i], term);
      return found;
    }
    search_terms.forEach(function(search_term) { recurse(container, search_term.toUpperCase()); });
  };
  highlight.hideMatches = function() {
    const container = document.querySelector(container_selector);
    container.querySelectorAll(match_selector).forEach(function(span) {
      const parent = span.parentNode;
      parent.replaceChild(span.firstChild, span);
      parent.normalize();
    });
  };
  highlight.selectMatchByIndex = function(index) {
    const matches = document.body.querySelectorAll(match_selector);
    if (!matches.length) return;
    selectedIndex = (index + matches.length) % matches.length;
    var selected = document.body.querySelector(selected_selector);
    if (selected) selected.classList.remove('selected');
    selected = matches[selectedIndex];
    selected.classList.add('selected');
    selected.scrollIntoView({ block: 'center' });
  };
  highlight.moveMatchSelection = function(count) {
    highlight.selectMatchByIndex(selectedIndex + count);
  };
  highlight.showMatchesAndSelectFirst = function() {
    highlight.showMatches(cache.search_input_array);
    highlight.selectMatchByIndex(0);
  };
}

// Run intense JavaScript without freezing the browser.
// For details, see debuggable.com (run-intense-js-without-freezing-the-browser).
// Only relevant for old browsers such as IE11.
function createFuncQueue() {
  var timer = null;
  const queue = [];
  function runNext() {
    const next = queue.shift();
    if (!next) return 0;
    next.fn.call(next.ctx || window);
    return next.time;
  }
  function schedule(time) {
    timer = setTimeout(function() {
      time = runNext();
      if (queue.length) schedule(time);
    }, time || 2);
  }
  function q(fn, ctx, time) {
    if (fn) {
      queue.push({ fn: fn, ctx: ctx, time: time });
      if (queue.length === 1) schedule(time);
      return;
    }
    return runNext();
  }
  q.add = function(fn, ctx, time) {
    return q(fn, ctx, time);
  };
  q.clear = function() {
    clearTimeout(timer);
    queue.length = 0;
  };
  return q;
}

function getUrlHashless(url) {
  return url.split('#', 1)[0];
}

function getUrlRelative(url, base) {
  if (url.startsWith(base))
    return url.substring(base.length + 1);
  return url;
}

function getUrlEquivRelative() {
  const meta = document.querySelector('meta[name|="ahk:equiv"]');
  return meta ? meta.getAttribute('content') : null;
}

function detectPhone(scriptElement) {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
  scriptElement.parentNode.insertBefore(meta, scriptElement.nextSibling);
  const clientWidth = document.documentElement.clientWidth;
  meta.parentNode.removeChild(meta);
  return clientWidth <= 600;
}

function isScrolledIntoView(el, container) {
  const containerTop = container.scrollTop;
  const containerBottom = containerTop + container.clientHeight;
  const elTop = el.offsetTop;
  const elBottom = elTop + el.offsetHeight;
  return (elTop >= containerTop && elBottom <= containerBottom);
}

function loadScript(url, callback, fail) {
  const script = document.createElement('script');
  script.onload = callback;
  script.onerror = fail;
  script.src = url;
  document.head.appendChild(script);
}

function T(original) {
  const translation = cache.translate_data[original];
  return translation == true ? original : translation;
}

function getUrlParam(name) {
  const params = window.location.search.substring(1).split('&');
  const match = params.find(function(param) { return param.split('=')[0] === name; });
  if (!match) return undefined;
  const value = match.split('=')[1];
  return value ? decodeURIComponent(value) : true;
}

// Try to parse a JSON string, but return null instead of throwing:
function parseJSON(json) {
  try { return JSON.parse(json); }
  catch (e) { return null; }
}

function rafAnim(duration, fn, done) {
  const start = Date.now();
  (function step() {
    const p = Math.min((Date.now() - start) / duration, 1);
    fn(p);
    if (p < 1) requestAnimationFrame(step);
    else if (done) done();
  })();
}

function setupEditListCombo(edit, list) {
  list.items = [];
  list.max = 0;
  list.selected = null;
  list.addItems = function(items) {
    items.forEach(function(item, i) {
      const a = document.createElement('a');
      a.href = item.href;
      a.tabIndex = -1;
      a.setAttribute('data-content', item.label);
      a.setAttribute('aria-label', item.label);
      a._index = list.max = i;
      list.appendChild(a);
    });
    list.selectItemByIndex(0);
    list.items = items;
  };
  list.removeItems = function() { list.innerHTML = ''; list.items = []; };
  list.replaceItems = function(items) { list.removeItems(); list.addItems(items); };
  list.selectItemByIndex = function(index) {
    if (index < 0 || index >= list.items.length) return;
    list.clearSelection();
    list.selected = list.children[index];
    list.selected.classList.add('selected');
    list.selected.tabIndex = 0;
    const parent = list.selected.parentNode;
    if (!isScrolledIntoView(list.selected, parent)) {
      const half = (parent.clientHeight + parent.getBoundingClientRect().top) / 2;
      if (list.selected.getBoundingClientRect().top > half)
        list.selected.scrollIntoView(false); // Move down
      else
        list.selected.scrollIntoView(); // Move up
    }
  };
  list.clearSelection = function() {
    if (!list.selected) return;
    list.selected.classList.remove('selected');
    list.selected.tabIndex = -1;
  };
  list.moveSelection = function(count) {
    if (!list.selected) return;
    const i = list.selected._index + count;
    list.selectItemByIndex(Math.max(0, Math.min(i, list.max)));
  };
  edit.setMatchStateColor = function(state) {
    edit.classList.remove('match', 'mismatch');
    if (state === false) edit.classList.add('mismatch');
    else if (state) edit.classList.add('match');
  };
  // Events:
  // Process the input control's keyboard input:
  edit.addEventListener('keydown', function(e) {
    if (!list.selected) return;
    switch (e.which) {
      case 13: host.viewer.openURL(list.selected.href, true); return; // Enter
      case 33: list.moveSelection(-getPageSize()); break; // PageUp
      case 34: list.moveSelection(getPageSize()); break; // PageDown
      case 38: list.moveSelection(-1); break; // Up
      case 40: list.moveSelection(1); break; // Down
      default: return;
    }
    list.selected.focus();
    e.preventDefault();
  });
  // Process the list control's keyboard input:
  list.addEventListener('keydown', function(e) {
    if (!list.selected) return;
    if (e.shiftKey && e.which == 9) return; // Shift+Tab
    switch (e.which) {
      case 9: return; // Tab
      case 13: host.viewer.openURL(list.selected.href, true); return; // Enter
      case 16: return; // Shift
      case 17: return; // Ctrl
      case 18: return; // Alt
      case 33: list.moveSelection(-getPageSize()); break; // PageUp
      case 34: list.moveSelection(getPageSize()); break; // PageDown
      case 35: list.selectItemByIndex(list.max); break; // End
      case 36: list.selectItemByIndex(0); break; // Home
      case 38: list.moveSelection(-1); break; // Up
      case 40: list.moveSelection(1); break; // Down
      case 91: case 92: case 93: return; // Meta
      default: edit.focus(); edit.select(); return; // Redirect other keys to the input control.
    }
    list.selected.focus();
    e.preventDefault();
  });
  // Select an item on click:
  list.addEventListener('click', function(e) {
    if (e.target.nodeName !== 'A') return;
    e.preventDefault();
    list.selectItemByIndex(e.target._index);
  });
  // Open an item on double-click or touch (for mobile):
  var touchmoved;
  list.addEventListener('dblclick', function(e) {
    if (e.target.nodeName !== 'A') return;
    if (touchmoved) return;
    e.preventDefault();
    list.selected = e.target;
    host.viewer.openURL(list.selected.href, true);
  });
  list.addEventListener('touchmove', function(e) {
    if (e.target.nodeName !== 'A') return; touchmoved = true;
  });
  list.addEventListener('touchstart', function(e) {
    if (e.target.nodeName !== 'A') return; touchmoved = false;
  });
  // Show tooltip on mouseover if an item exceeds the length of its parent:
  list.addEventListener('mouseover', function(e) {
    if (e.target.nodeName !== 'A') return;
    const item = e.target;
    if (item.offsetWidth < item.scrollWidth && !item.title) {
      item.title = item.dataset.content;
    }
  });
  // Helper functions:
  function getPageSize() {
    return Math.floor(list.offsetHeight / list.children[0].offsetHeight);
  };
}

function addPolyfills() {
  if (!Object.assign) { // for IE
    Object.assign = function(t) {
      for (var i = 1; i < arguments.length; i++) {
        var s = arguments[i];
        for (var k in s) if (s.hasOwnProperty(k)) t[k] = s[k];
      }
      return t;
    };
  }
  if (!Element.prototype.closest) { // for IE
    Object.defineProperty(Element.prototype, 'closest', {
      value: function(selector) {
        var el = this;
        while (el && el.nodeType === 1) {
          if (el.matches(selector)) return el;
          el = el.parentElement || el.parentNode;
        }
        return null;
      }
    });
  }
  if (!Element.prototype.matches) { // for IE
    Element.prototype.matches = Element.prototype.msMatchesSelector;
  }
  if (!Element.prototype.remove) {
    Element.prototype.remove = function() {
      if (this.parentNode) this.parentNode.removeChild(this);
    };
  }
  if (!Element.prototype.replaceChildren) {
    Element.prototype.replaceChildren = function() {
      this.innerHTML = '';
      for (var i = 0; i < arguments.length; i++) { this.appendChild(arguments[i]); }
    };
  }
  if (typeof window.CustomEvent !== 'function') { // for IE
    window.CustomEvent = function(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    window.CustomEvent.prototype = window.Event.prototype;
  }
  [NodeList, HTMLCollection, DOMTokenList].forEach(function(ctor) {
    if (ctor && !ctor.prototype.forEach)
      Object.defineProperty(ctor.prototype, 'forEach', {
        value: function(callback, thisArg) {
          thisArg = thisArg || window;
          for (var i = 0; i < this.length; i++)
            callback.call(thisArg, this[i], i, this);
        }
      });
  });
  if (!Array.from) { // for IE
    Object.defineProperty(Array, 'from', {
      value: function(list) { return Array.prototype.slice.call(list); }
    });
  }
  if (!Array.prototype.find) { // for IE
    Object.defineProperty(Array.prototype, 'find', {
      value: function(callback, thisArg) {
        for (var i = 0; i < this.length; i++)
          if (callback.call(thisArg, this[i], i, this))
            return this[i];
      }
    });
  }
  if (!Array.prototype.findIndex) { // for IE
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function(callback, thisArg) {
        for (var i = 0; i < this.length; i++)
          if (callback.call(thisArg, this[i], i, this))
            return i;
        return -1;
      }
    });
  }
  if (!Array.prototype.includes) { // for IE
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {
        return this.indexOf(searchElement, fromIndex || 0) !== -1;
      }
    });
  }
  if (!String.prototype.includes) {
    String.prototype.includes = function(searchString, position) {
      return this.indexOf(searchString, position || 0) !== -1;
    };
  }
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, endPosition) {
      if (endPosition === undefined || endPosition > this.length)
        endPosition = this.length;
      return this.substring(endPosition - searchString.length, endPosition) === searchString;
    };
  }
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.substring(position, position + searchString.length) === searchString;
    };
  }
  if (!Map.prototype.keys) {
    Map.prototype.keys = function() {
      const keys = [];
      this.forEach(function(v, k) { keys.push(k); });
      return keys;
    };
  }
  if (!Object.values) {
    Object.values = function(obj) {
      const values = [];
      Object.keys(obj).forEach(function(key) {
        values.push(obj[key]);
      });
      return values;
    };
  }
  if (!Object.entries) {
    Object.entries = function(obj) {
      const entries = [];
      Object.keys(obj).forEach(function(key) {
        entries.push([key, obj[key]]);
      });
      return entries;
    };
  }
  (function() { // for IE
    var add = DOMTokenList.prototype.add;
    var remove = DOMTokenList.prototype.remove;
    var toggle = DOMTokenList.prototype.toggle;

    DOMTokenList.prototype.add = function() {
      for (var i = 0; i < arguments.length; i++) {
        add.call(this, arguments[i]);
      }
    };

    DOMTokenList.prototype.remove = function() {
      for (var i = 0; i < arguments.length; i++) {
        remove.call(this, arguments[i]);
      }
    };

    DOMTokenList.prototype.toggle = function(token, force) {
      if (arguments.length > 1) {
        if (force) {
          add.call(this, token);
          return true;
        } else {
          remove.call(this, token);
          return false;
        }
      }
      return toggle.call(this, token);
    };
  })();
}

function addExtensions() {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m, n) { return args[n]; });
  };
  Element.prototype.show = function() {
    this.style.display = '';
    if (window.getComputedStyle(this).display === 'none') {
      this.style.display = 'block';
    }
  };
  Element.prototype.hide = function() {
    this.style.display = 'none';
  };
  Element.prototype.toggle = function() {
    if (window.getComputedStyle(this).display === 'none')
      this.show();
    else
      this.hide();
  };
  Element.prototype.slideUp = function(duration) {
    var el = this;
    var h = el.offsetHeight;
    el.style.height = h + 'px';
    el.style.overflow = 'hidden';

    rafAnim(duration, function(p) {
      el.style.height = (h * (1 - p)) + 'px';
    }, function() {
      el.style.display = 'none';
      el.style.height = '';
      el.style.overflow = '';
    });
  };
  Element.prototype.slideDown = function(duration) {
    var el = this;
    el.style.display = 'block';
    var h = el.scrollHeight;
    el.style.height = '0px';
    el.style.overflow = 'hidden';

    rafAnim(duration, function(p) {
      el.style.height = (h * p) + 'px';
    }, function() {
      el.style.height = '';
      el.style.overflow = '';
    });
  };
  Element.prototype.slideToggle = function(duration) {
    var el = this;
    if (window.getComputedStyle(el).display === 'none')
      el.slideDown(duration);
    else
      el.slideUp(duration);
  }
  Element.prototype.index = function() {
    var i = 0, el = this;
    while ((el = el.previousElementSibling) !== null) i++;
    return i;
  };
  Element.prototype.focusFirstFocusableElement = function() {
    const candidates = this.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const focusable = Array.from(candidates).find(function(el) { return el.tabIndex >= 0; });
    if (focusable) focusable.focus();
  };
  NodeList.prototype.addEventListener =
    HTMLCollection.prototype.addEventListener = function(type, handler, useCapture) {
      for (var i = 0; i < this.length; i++) {
        this[i].addEventListener(type, handler, useCapture);
      }
    };
  // Similar to Object.assign but without adding new properties:
  Object.assignExisting = function(target, source) {
    for (var key in source)
      if (key in target)
        target[key] = source[key];
    return target;
  };
  // Similar to Object.assign but adding new properties only:
  Object.assignNew = function(target, source) {
    for (var key in source)
      if (!(key in target))
        target[key] = source[key];
    return target;
  };
}
