var highlighter = new ctor_highlighter;
function ctor_highlighter()
{
  var self = this;
  self.syntax = [];
  self.assignOp = "(?:&lt;&lt;|<<|&gt;&gt;|>>|\\/\\/|\\^|&amp;|&|\\||\\.|\\/|\\*|-|\\+|:|)=";
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
        6 - command
        7 - sub-command
        8 - built-in method/property
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
      innerHTML = innerHTML.replace(/(^\s*\/\*[\s\S]*?^\s*(\*\/|$(?![\r\n])))/gm, function(COMMENT)
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
      innerHTML = innerHTML.replace(/^(\s*?)([A-Za-z0-9_\#@\$\u00A0-\uFFFF]+?)(?=\(.*?\)\s*(<(em|sct)><\/(em|sct)>\s*)*{)/mg, function(ASIS, PRE, DEFINITION)
      {
        if (DEFINITION.match(/^(while|if)$/i))
          return ASIS;
        out = PRE + wrap(DEFINITION, 'fun', null);
        els.fun.push(out);
        return '<fun></fun>';
      });
      // numeric values:
      els.order.push('num'); els.num = [];
      innerHTML = innerHTML.replace(/\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)\b/gm, function(_, NUMBER)
      {
        out = wrap(NUMBER, 'num', null);
        els.num.push(out);
        return '<num></num>';
      });
      // continuation sections:
      els.order.push('cont'); els.cont = [];
      innerHTML = innerHTML.replace(/(^.*?(.)(?:\s*?<(?:em|sct)><\/(?:em|sct)>|$)[\r\n]*?^\s*)(\((?!.*?\))[\s\S]*?^\s*\))/gm, function(ASIS, PRE, QUOTE, SECTION)
      {
        if (QUOTE == '"')
          return ASIS;
        out = processStrParam(SECTION);
        els.cont.push(out);
        return PRE + '<cont></cont>';
      });
      // strings:
      els.order.push('str'); els.str = [];
      innerHTML = innerHTML.replace(/((")[\s\S]*?\2)/gm, function(_, STRING)
      {
        out = wrap(STRING, 'str', null);
        index = els.str.push(out) - 1;
        return '<str ' + index + '></str>';
      });
      // legacy assignments:
      els.order.push('assign'); els.assign = [];
      innerHTML = innerHTML.replace(/^([ \t]*[^(,\s]*?)([ \t]*=[ \t]*)(.*?)(?=<(?:em|sct)><\/(?:em|sct)>|$)/gim, function(ASIS, VAR, OP, VAL)
      {
        if ('^:!*/&^+-|~.='.indexOf(VAR.slice(-1)) != -1)
          return ASIS;
        out = processStrParam(VAL);
        els.assign.push(out);
        return VAR + OP + '<assign></assign>';
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
      // built-in vars:
      els.order.push('biv'); els.biv = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[1].single.join('|') + ')\\b', 'gi'), function(_, BIV)
      {
        out = wrap(BIV, 'biv', 1);
        els.biv.push(out);
        return '<biv></biv>';
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
      innerHTML = innerHTML.replace(new RegExp('((?:^|::)\\s*)(' + syntax[5].single.join('|') + ')\\b(?=\\s|$)', 'gim'), function(_, PRE, DEC)
      {
        out = wrap(DEC, 'dec', 5);
        els.dec.push(out);
        return PRE + '<dec></dec>';
      });
      // ByRef:
      els.order.push('byref'); els.byref = [];
      innerHTML = innerHTML.replace(/(.+?)\b(byref)\b(?=(.+?)\))/gim, function(_, PRE, BYREF)
      {
        out = PRE + wrap(BYREF, 'cfs', 'Functions.htm#ByRef');
        els.byref.push(out);
        return '<byref></byref>';
      });
      // built-in functions:
      els.order.push('bif'); els.bif = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[2].single.join('|').replace('()', '') + ')(?=\\()', 'gi'), function(_, BIF)
      {
        out = wrap(BIF, 'bif', 2);
        els.bif.push(out);
        return '<bif></bif>';
      });
      // directives:
      els.order.push('dir'); els.dir = [];
      innerHTML = innerHTML.replace(new RegExp('(' + syntax[0].single.join('|') + ')\\b($|[\\s,])(.*?)(?=<(?:em|sct)></(?:em|sct)>|$)', 'gim'), function(_, DIR, SEP, PARAMS)
      {
        // Get type of every parameter:
        var types = index_data[syntax[0].dict[DIR.toLowerCase()]][3];
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
      // commands:
      els.order.push('cmd'); els.cmd = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[6].single.join('|') + ')\\b(\\s*,|\\s*<(?:em|sct)><\\/(?:em|sct)>\\s*,|$|,|\\s(?!\\s*' + self.assignOp + '))(.*?$(?:(?:\\s*?(,|<cont>).*?$))*)', "gim"), function(_, CMD, SEP, PARAMS)
      {
        // Get type of every parameter:
        var types = index_data[syntax[6].dict[CMD.toLowerCase()]][3];
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
        if (PARAMS.length > types.length) // For the last param of any command.
          PARAMS.push(PARAMS.splice(types.length - 1).join(','));

        if (CMD.toLowerCase() == "msgbox" && PARAMS.length > 1) // For MsgBox.
        {
          var p1_isNum = PARAMS[0].match(/^\s*(<num><\/num>)?\s*$/);
          var p1_isExp = PARAMS[0].match(/^\s*%\s/);
          var p1_isOptions = p1_isNum || (p1_isExp && PARAMS[1]);
          var p4_isNum = PARAMS[3] && PARAMS[3].match(/^\s*(<num><\/num>)?\s*($|<(em|sct)><\/\3>)/);
          var p4_isExp = PARAMS[3] && PARAMS[3].match(/^\s*%/);
          var p4_isTimeout = p1_isOptions && (p4_isNum || p4_isExp);
          if (!p1_isOptions) // 1-parameter mode
            PARAMS.push(PARAMS.splice(0).join(','));
          else if (PARAMS[3] && !p4_isTimeout) // 3-parameter mode
            PARAMS.push(PARAMS.splice(2).join(','));
        }
        // Iterate params and recompose them:
        for (n in PARAMS)
        {
          // Restore (...), {...} and [...] previously excluded:
          PARAMS[n] = PARAMS[n].replace(/<sub (\d+)><\/sub>/g, function(_, index)
          {
            return sub[index];
          });
          p = /([\s\S]*?)(\s*<(?:em|sct)><\/(?:em|sct)>[\s\S]*|)$/.exec(PARAMS[n]);
          if (p[1].match(/^\s*%\s/)) // Skip forced expression parameter:
            continue;
          if (p[1].match(/<cont>/)) // Skip continuation section:
            continue;
          if (types[n] == 'S') // string
            PARAMS[n] = processStrParam(p[1]) + p[2];
        }
        PARAMS = PARAMS.join(',');
        out = wrap(CMD, 'cmd', 6) + SEP + PARAMS;
        els.cmd.push(out);
        return '<cmd></cmd>';
      });
      // control flow statements:
      els.order.push('cfs'); els.cfs = [];
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syntax[3][0].join('|') + ') (\\S+|\\S+, \\S+) (' + syntax[3][1].join('|') + ') ((.+) (' + syntax[3][2].join('|') + ') (.+?)|.+?)(?=<(?:em|sct)></(?:em|sct)>|$|{)|\\b(' + syntax[3].single.join('|') + ')\\b($|,|{|(?=\\()|\\s(?!\\s*' + self.assignOp + '))(.*?)(?=<(?:em|sct)></(?:em|sct)>|$|{|\\b(' + syntax[3].single.join('|') + ')\\b)', 'gim'), function(ASIS, IF, INPUT, BETWEEN, VAL, VAL1, AND, VAL2, CFS, SEP, PARAMS)
      {
        if (IF)
        {
          if (VAL1)
          {
            var cfs = index_data[syntax[3].dict[(IF + ' ... ' + BETWEEN + ' ... ' + AND).toLowerCase()]];
            if (cfs)
              out = wrap(IF, 'cfs', cfs[1]) + ' ' + INPUT + ' ' + wrap(BETWEEN, 'cfs', cfs[1]) + ' ' + processStrParam(VAL1) + ' ' + wrap(AND, 'cfs', cfs[1]) + ' ' + processStrParam(VAL2);
            else
              out = ASIS;
          }
          else if (INPUT)
          {
            var cfs = index_data[syntax[3].dict[(IF + ' ... ' + BETWEEN).toLowerCase()]];
            if (cfs)
              out = wrap(IF, 'cfs', cfs[1]) + ' ' + INPUT + ' ' + wrap(BETWEEN, 'cfs', cfs[1]) + ' ' + ((cfs[3][1] == "S") ? processStrParam(VAL) : VAL);
            else
              out = ASIS;
          }
        }
        else
        {
          var cfs = CFS.toLowerCase();
          // Get type of every parameter:
          var types = index_data[syntax[3].dict[cfs]][3];
          // legacy if-statement:
          if (cfs == 'if')
            if (m = PARAMS.match(/^([^.(:]+?)(&gt;=|&gt;|&lt;&gt;|&lt;=|&lt;|!=|=)(.*)$/))
            {
              var VAR = m[1], OP = m[2], VAL = m[3];
              out = wrap(CFS, 'cfs', 'lib/IfEqual.htm') + SEP + VAR + OP + processStrParam(VAL);
              els.cfs.push(out);
              return '<cfs></cfs>';
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
        }
        els.cfs.push(out);
        return '<cfs></cfs>';
      });
      // hotstrings:
      els.order.push('hotstr'); els.hotstr = [];
      innerHTML = innerHTML.replace(/^(\s*)(:.*?:)(.*?)(::)(.*)/mg, function(_, PRE, HOTSTR1, ABBR, HOTSTR2, REPL)
      {
        out = PRE + wrap(HOTSTR1, 'lab', null) + wrap(ABBR, 'str', null) + wrap(HOTSTR2, 'lab', null) + (HOTSTR1.match(/x/i) ? REPL : wrap(REPL, 'str', null));
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
      innerHTML = innerHTML.replace(/^(\s*)([^\s{(]+?:)(?=\s*(<(em|sct)><\/(em|sct)>|$))/mg, function(_, PRE, LABEL)
      {
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
      var re = /%([^,\s]+?)%/g;
      while (m = re.exec(param))
      {
        out += wrap(param.slice(lastIndex, m.index), 'str', null) + '%';
        out += (syntax[1].dict[m[1].toLowerCase()]) ? wrap(m[1], 'biv', 1) : m[1];
        out += '%';
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
        if (typeof type == 'undefined')
          continue;
        syntax[type] = syntax[type] || [];
        if (entry.substr(entry.length - 2) == '()')
          entry = entry.substr(0, entry.length - 2);
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
        if (entry.indexOf(', ') != -1)
        {
          entry = entry.toLowerCase().replace(', ', ' ');
          syntax[type].single.push(entry);
          (syntax[type].dict = syntax[type].dict || {})[entry] = i;
        }
      }
      return syntax;
    }
  };
}
