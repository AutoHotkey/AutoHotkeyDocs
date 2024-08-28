var highlighter = new ctor_highlighter;
function ctor_highlighter()
{
  var self = this;
  self.syntax = [];
  self.assignOp = "(?:&lt;&lt;|<<|&gt;&gt;|>>|\\/\\/|\\^|&amp;|&|\\||\\.|\\/|\\*|-|\\+|:)=";
  self.addSyntaxColors = function(codes, index_data, docs_path, new_tab)
  {
    // Add syntax highlighting for AutoHotkey code.
    // Don't have to be pre elements, e.g. code elements are also possible.
    // An index item counts as a syntax element if its third field is one of the following digits:
    /* 
        0 - directive
        1 - built-in var
        2 - built-in function
        3 - control flow statement
        4 - operator
        5 - declaration
        6 - built-in class
        7 - built-in method/property
        99 - Ahk2Exe compiler
    */
    if (!-[1,]) // Exclude Internet Explorer 8 or below
      return;
    if (!self.syntax.length)
      self.syntax = sortByType(index_data);
    var syntax = self.syntax;
    // Traverse pre elements:
    for (var i = 0; i < codes.length; i++)
    {
      var pre = code = codes[i], els = [];
      els.order = [];
      // Skip pre.no-highlight elements:
      if (pre.className.indexOf('no-highlight') != -1)
        continue;
      // Add highlight class if not available:
      if (pre.className.indexOf('highlight') == -1)
        pre.className += ' highlight';
      // Convert to pre>code if necessary:
      if (pre.tagName == 'PRE')
      {
        if (pre.firstChild.tagName != 'CODE')
        {
          code = document.createElement('code');
          code.className = 'highlight';
          code.innerHTML = pre.innerHTML;
          pre.innerHTML = '';
          pre.appendChild(code);
        }
        else
        {
          code = pre.firstChild;
          code.className += ' highlight';
        }
      }
      // Temporary remove elements which interfering with syntax detection:
      els.order.push('various'); els.various = [];
      els.order.push('em'); els.em = [];
      for (var ii = 0; ii < code.children.length; ii++)
      {
        var child = code.children[ii];
        if (child.tagName == 'EM')
        {
          els.em.push(child.outerHTML);
          code.replaceChild(document.createElement('em'), child);
        }
        else if (child.href && child.getAttribute("href").substring(0, 4) != "http")
        {
          code.replaceChild(document.createTextNode(child.innerText), child);
          ii--;
        }
        else if (child.attributes.length || child.children.length)
        {
          els.various.push(child.outerHTML);
          code.replaceChild(document.createElement('various'), child);
        }
      }
      // Store code content into a variable to improve performance:
      var innerHTML = code.innerHTML;
      // comments:
      els.order.push('sct'); els.sct = [];
      innerHTML = innerHTML.replace(/(\s|^)(;.*?)$/gm, function(_, PRE, COMMENT)
      {
        out = wrap(COMMENT, 'cmt', null);
        els.sct.push(out);
        return PRE + '<sct></sct>';
      });
      els.order.push('mct'); els.mct = [];
      innerHTML = innerHTML.replace(/(^\s*\/\*[\s\S]*?(^\s*\*\/|\*\/\s*$|$(?![\r\n])))/gm, function(COMMENT)
      {
        out = wrap(COMMENT, 'cmt', null);
        els.mct.push(out);
        return '<mct></mct>';
      });
      // escape sequences:
      els.order.push('esc'); els.esc = [];
      innerHTML = innerHTML.replace(/`./gm, function(SEQUENCE)
      {
        out = wrap(SEQUENCE, 'esc', null);
        els.esc.push(out);
        return '<esc></esc>';
      });
      // function definitions:
      els.order.push('fun'); els.fun = [];
      innerHTML = innerHTML.replace(/^(\s*?static\s*?|\s*?)([A-Za-z0-9_\#@\$\u00A0-\uFFFF]+?)(?=\(.*?\)\s*(<(em|sct)><\/(em|sct)>\s*)*{)/mg, function(ASIS, PRE, DEFINITION)
      {
        if (DEFINITION.match(/^(while|if)$/i))
          return ASIS;
        out = wrap(DEFINITION, 'fun', null);
        els.fun.push(out);
        return PRE + '<fun></fun>';
      });
      // numeric values:
      els.order.push('num'); els.num = [];
      innerHTML = innerHTML.replace(/\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)\b/gm, function(_, NUMBER)
      {
        out = wrap(NUMBER, 'num', null);
        els.num.push(out);
        return '<num></num>';
      });
      // continuation section inside a string "(...)"
      els.order.push('cont1'); els.cont1 = [];
      innerHTML = innerHTML.replace(/('|")([<\/em>\s]*?^\s*\([\s\S]*?^\s*\).*?)\1/gm, function(_, QUOTE, SECTION)
      {
        out = processStrParam(SECTION);
        els.cont1.push(out);
        return QUOTE + '<cont1></cont1>' + QUOTE;
      });
      // continuation section for hotstrings ::(...)
      els.order.push('cont2'); els.cont2 = [];
      innerHTML = innerHTML.replace(/(^\s*:.*?:.*?::)([<\/em>\s]*?^\s*\([\s\S]*?^\s*\).*?)/gm, function(_, PRE, SECTION)
      {
        out = processStrParam(SECTION);
        els.cont2.push(out);
        return PRE + '<cont2></cont2>';
      });
      // built-in vars:
      els.order.push('biv'); els.biv = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[1].single.join('|') + ')\\b', 'gi'), function(_, BIV)
      {
        out = wrap(BIV, 'biv', 1);
        els.biv.push(out);
        return '<biv></biv>';
      });
      // strings:
      els.order.push('str'); els.str = [];
      innerHTML = innerHTML.replace(/(("|')[\s\S]*?\2)/gm, function(_, STRING)
      {
        out = wrap(STRING, 'str', null);
        index = els.str.push(out) - 1;
        return '<str ' + index + '></str>';
      });
      // methods:
      els.order.push('met'); els.met = [];
      innerHTML = innerHTML.replace(/(\.)([^~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|+=\-\s]+?)(?=\()/g, function(_, PRE, METHOD)
      {
        out = PRE + wrap(METHOD, 'met', null);
        els.met.push(out);
        return '<met></met>';
      });
      // properties:
      els.order.push('prp'); els.prp = [];
      innerHTML = innerHTML.replace(/\.([^~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|+=\-\s]+?)\b/g, function(_, PROPERTY)
      {
        out = '.' + wrap(PROPERTY, 'prp', null);
        els.prp.push(out);
        return '<prp></prp>';
      });
      // declaration: class ... extends
      els.order.push('dec_cls'); els.dec_cls = [];
      innerHTML = innerHTML.replace(/(^\s*)(class)(\s+\S+\s+)(extends)\b/gim, function(_, PRE, CLASS, INPUT, EXTENDS)
      {
        var link = index_data[syntax[5].dict['class']][1];
        els.dec_cls.push(wrap(CLASS, 'dec', link));
        els.dec_cls.push(wrap(EXTENDS, 'dec', link));
        return PRE + '<dec_cls></dec_cls>' + INPUT + '<dec_cls></dec_cls>';
      });
      // declarations:
      els.order.push('dec'); els.dec = [];
      innerHTML = innerHTML.replace(new RegExp('(^\\s*)(' + syntax[5].single.join('|') + ')\\b(?=\\s|$)', 'gim'), function(_, PRE, DEC)
      {
        out = PRE + wrap(DEC, 'dec', 5);
        els.dec.push(out);
        return '<dec></dec>';
      });
      // directives:
      els.order.push('dir'); els.dir = [];
      innerHTML = innerHTML.replace(new RegExp('(' + syntax[0].single.join('|') + ')\\b($|[\\s,])(.*?)(?=<(?:em|sct)></(?:em|sct)>|$)', 'gim'), function(_, DIR, SEP, PARAMS)
      {
        // Get type of every parameter:
        var types = index_data[syntax[0].dict[DIR.toLowerCase()]][3];
        // Skip param processing if first param is an expression:
        if (types[0] == 'E')
        {
          out = wrap(DIR, 'dir', 0);
          els.dir.push(out);
          return '<dir></dir>' + SEP + PARAMS;
        }
        // Temporary exclude (...), {...} and [...]:
        sub = [];
        PARAMS = PARAMS.replace(/[({\[][^({\[]*[\]})]/g, function(c)
        {
          index = sub.push(c) - 1;
          return '<sub ' + index + '></sub>';
        });
        // Split params:
        PARAMS = PARAMS.split(',');
        // Detect smart comma handling:
        if (PARAMS.length > types.length) // For the last param of any directive.
          PARAMS.push(PARAMS.splice(types.length - 1).join(','));
        // Iterate params and recompose them:
        for (n in PARAMS)
        {
          // Restore (...), {...} and [...] previously excluded:
          PARAMS[n] = PARAMS[n].replace(/<sub (\d+)><\/sub>/g, function(_, index)
          {
            return sub[index];
          });
          if (PARAMS[n].match(/^\s*%\s/)) // Skip forced expression parameter:
            continue;
          if (types[n] == 'S') // string
            PARAMS[n] = processStrParam(PARAMS[n]);
        }
        PARAMS = PARAMS.join(',');
        out = wrap(DIR, 'dir', 0) + SEP + PARAMS;
        els.dir.push(out);
        return '<dir></dir>';
      });
      // built-in classes:
      els.order.push('cls'); els.cls = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[6].single.join('|') + ')\\b', 'gi'), function(_, CLS)
      {
        out = wrap(CLS, 'cls', 6);
        els.cls.push(out);
        return '<cls></cls>';
      });
      // built-in functions:
      els.order.push('bif'); els.bif = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[2].single.join('|') + ')\\b(?=$|\\(|\\s(?!\\s*' + self.assignOp + '))', 'gi'), function(_, BIF)
      {
        out = wrap(BIF, 'bif', 2);
        els.bif.push(out);
        return '<bif></bif>';
      });
      // 2-word control flow statements (e.g. for ... in):
      els.order.push('cfs_2w'); els.cfs_2w = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[3][0].join('|') + ')(\\s+(?:\\S+|\\S*(?:\\s*,\\s*\\S*)*)\\s+|\\s+)(' + syntax[3][1].join('|') + ')(\\s+.+?)(?=<(?:em|sct)></(?:em|sct)>|$|{)', 'gim'), function(ASIS, WORD1, INPUT1, WORD2, INPUT2)
      {
        var cfs = index_data[syntax[3].dict[(WORD1 + ' ... ' + WORD2).toLowerCase()]];
        if (!cfs)
          return ASIS;
        out = wrap(WORD1, 'cfs', cfs[1]) + INPUT1 + wrap(WORD2, 'cfs', cfs[1]) + INPUT2;
        els.cfs_2w.push(out);
        return '<cfs_2w></cfs_2w>';
      });
      // 1-word control flow statements (e.g. if):
      els.order.push('cfs_1w'); els.cfs_1w = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[3].single.join('|') + ')\\b($|,|{|(?=\\()|\\s(?!\\s*' + self.assignOp + '))(.*?)(?=<(?:em|sct)></(?:em|sct)>|$|{|\\b(' + syntax[3].single.join('|') + ')\\b)', 'gim'), function(ASIS, CFS, SEP, PARAMS)
      {
        var cfs = CFS.toLowerCase();
        // Skip switch's case or default (will be handled below):
        if (cfs == 'case' || cfs == 'default')
          return ASIS;
        // Skip param processing if the statement uses parentheses:
        if (PARAMS.charAt(0) == '(')
        {
          out = wrap(CFS, 'cfs', 3);
          els.cfs_1w.push(out);
          return '<cfs_1w></cfs_1w>' + SEP + PARAMS;
        }
        // Get type of every parameter:
        var types = index_data[syntax[3].dict[cfs]][3];
        // Temporary exclude (...), {...} and [...]:
        sub = [];
        PARAMS = PARAMS.replace(/[({\[][^({\[]*[\]})]/g, function(c)
        {
          index = sub.push(c) - 1;
          return '<sub ' + index + '></sub>';
        });
        // Split params:
        PARAMS = PARAMS.split(',');
        // Iterate params and recompose them:
        for (n in PARAMS)
        {
          // Restore (...), {...} and [...] previously excluded:
          PARAMS[n] = PARAMS[n].replace(/<sub (\d+)><\/sub>/g, function(_, index)
          {
            return sub[index];
          });
          if (PARAMS[n].match(/^\s*%\s/)) // Skip forced expression parameter:
            continue;
          if (types[n] == 'S') // string
            PARAMS[n] = processStrParam(PARAMS[n]);
        }
        PARAMS = PARAMS.join(',');
        out = wrap(CFS, 'cfs', 3) + SEP + PARAMS;
        els.cfs_1w.push(out);
        return '<cfs_1w></cfs_1w>';
      });
      // case/default control flow statements:
      els.order.push('cfs_switch'); els.cfs_switch = [];
      innerHTML = innerHTML.replace(/^(\s*)(case|default)\b(?=.*?:)/gim, function(_, PRE, CFS)
      {
        out = PRE + wrap(CFS, 'cfs', 3);
        els.cfs_switch.push(out);
        return '<cfs_switch></cfs_switch>';
      });
      // hotstrings:
      els.order.push('hotstr'); els.hotstr = [];
      innerHTML = innerHTML.replace(/^(\s*)(:.*?:)(.*?)(::)(.*)/mg, function(_, PRE, HOTSTR1, ABBR, HOTSTR2, REPL)
      {
        out = PRE + wrap(HOTSTR1, 'lab', null) + wrap(ABBR, 'str', null) + wrap(HOTSTR2, 'lab', null) + ((HOTSTR1.match(/x/i) || (REPL.match(/^\s*\{\s*(?=<(?:em|sct)><\/(?:em|sct)>|$)/i))) ? REPL : wrap(REPL, 'str', null));
        els.hotstr.push(out);
        return '<hotstr></hotstr>';
      });
      // hotkeys:
      els.order.push('hotkey'); els.hotkey = [];
      innerHTML = innerHTML.replace(/^(\s*)((([#!^+*~$]|&lt;|&gt;)*(\S+)( up)?|~?(\S+) &amp; ~?(\S+)( up)?)::)/gim, function(_, PRE, HOTKEY)
      {
        out = PRE + wrap(HOTKEY, 'lab', null);
        els.hotkey.push(out);
        return '<hotkey></hotkey>';
      });
      // labels:
      els.order.push('lab'); els.lab = [];
      innerHTML = innerHTML.replace(/^(\s*)([^\s{(]+?:)(?=\s*(<(em|sct)><\/(em|sct)>|$))/mg, function(ASIS, PRE, LABEL)
      {
        if (LABEL == '<cfs_switch></cfs_switch>:')
          return ASIS;
        out = PRE + wrap(LABEL, 'lab', null);
        els.lab.push(out);
        return '<lab></lab>';
      });
      // Release changes:
      code.innerHTML = innerHTML;
      // Restore elements:
      for (var k = els.order.length - 1; k >= 0; k--)
      {
        var children = code.querySelectorAll(els.order[k]);
        for (var kk = 0; kk < children.length; kk++)
        {
          var child = children[kk];
          if (child.attributes[0])
            child.outerHTML = els[els.order[k]][child.attributes[0].name];
          else
            child.outerHTML = els[els.order[k]][kk];
        }
      }
      // Add line numbers:
      if (pre.tagName == 'PRE' && pre.className.indexOf('line-numbers') != -1)
      {
        var span = document.createElement('span');
        span.className = 'line-numbers-rows';
        var count = code.innerHTML.split(/\n(?!$)/).length;
        for (var k = 0; k < count; k++)
          span.appendChild(document.createElement('span'));
        code.appendChild(span);
      }
    }
    function wrap(match, className, TypeOrLink)
    {
      var span = document.createElement('span');
      span.className = className;
      if (TypeOrLink != null)
      {
        var a = document.createElement('a');
        if (new_tab)
          a.target = '_blank';
        if (typeof TypeOrLink == 'number')
          a.href = docs_path + index_data[syntax[TypeOrLink].dict[match.toLowerCase()]][1];
        else
          a.href = docs_path + TypeOrLink;
        a.innerHTML = match;
        span.appendChild(a);
      } else
        span.innerHTML = match;
      return span.outerHTML;
    }
    function processStrParam(param)
    {
      if (param.match(/^\s*(\+|-|\^)?\s*<num><\/num>\s*$/)) // skip number
        return param;
      param = param.replace(/<str (\d+)><\/str>/g, function(_, index)
      { // resolve substring
        return els.str[index];
      });
      // handle %...%:
      var out = '', lastIndex = 0;
      var re = /%[^,\s]+?%/g;
      while (m = re.exec(param))
      {
        out += wrap(param.slice(lastIndex, m.index), 'str', null) + m[0];
        lastIndex = re.lastIndex;
      }
      out += wrap(param.slice(lastIndex), 'str', null);
      return out;
    }
    function sortByType(index_data)
    {
      var syntax = [];
      for (var i = index_data.length - 1; i >= 0; i--)
      {
        entry = index_data[i][0];
        type = index_data[i][2];
        syntax[type] = syntax[type] || [];
        if (typeof type !== 'undefined')
        {
          if (entry.indexOf(' ... ') != -1)
          {
            part = entry.split(' ... ');
            for (k in part)
            {
              syntax[type][k] = syntax[type][k] || [];
              if (syntax[type][k].indexOf(part[k]) == -1)
                syntax[type][k].push(part[k]);
            }
          }
          else
            (syntax[type].single = syntax[type].single || []).push(entry);
          (syntax[type].dict = syntax[type].dict || {})[entry.toLowerCase()] = i;
        }
      }
      return syntax;
    }
  };
}
