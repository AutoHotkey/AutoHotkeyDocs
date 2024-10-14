var highlighter = new ctor_highlighter;
/**
 * Syntax highlighter for AutoHotkey code.
 * @constructor
 */
function ctor_highlighter()
{
  var self = this;
  self.syntax = {};
  self.assignOp = '(?:&lt;&lt;|<<|&gt;&gt;|>>|\\/\\/|\\^|&amp;|&|\\||\\.|\\/|\\*|-|\\+|:|)=';
  self.num = '(?:0(?:x|X)[0-9a-fA-F]*)|(?:(?:[0-9]+\\.?[0-9]*)|(?:\\.[0-9]+))(?:(?:e|E)(?:\\+|-)?[0-9]+)?';
  /**
   * Adds syntax highlighting for AutoHotkey code.
   *
   * An index item counts as a syntax element if its third field is one of the following digits:
   * - 0 = directive
   * - 1 = built-in var
   * - 2 = built-in function
   * - 3 = control flow statement
   * - 4 = operator
   * - 5 = declaration
   * - 6 = command
   * - 7 = sub-command
   * - 8 = built-in method/property
   * - 99 = Ahk2Exe compiler
   * @param {NodeList} codes - A list of `<pre>` or `<code>` elements.
   * @param {array} index_data - An array of arrays of strings (data_index.js).
   * @param {string} docs_path - The path to the docs.
   * @param {boolean} new_tab - If true, the link opens in a new tab.
   */
  self.addSyntaxColors = function(codes, index_data, docs_path, new_tab)
  {
    if (!-[1,]) // Exclude Internet Explorer 8 or below
      return;
    if (!self.syntax[0]) // empty
      self.syntax = sort_syntax_by_type(index_data);
    var syntax = self.syntax;
    // Traverse pre elements:
    for (var i = 0; i < codes.length; i++)
    {
      var pre = codes[i], code = pre, els = {order: []}, els_raw = {};
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
      // Temporary remove HTML elements interfering with syntax detection:
      for (var ii = 0; ii < code.children.length; ii++)
      {
        var child = code.children[ii];
        if (child.tagName == 'EM')
        {
          var index = els.order.length;
          var tagName = 'em' + index;
          code.replaceChild(document.createElement('em' + index), child);
          els[tagName] = child.outerHTML; els.order.push(tagName);
        }
        else if (child.href && child.getAttribute('href').substring(0, 4) != 'http')
        {
          code.replaceChild(document.createTextNode(child.innerText), child);
          ii--;
        }
        else if (child.attributes.length || child.children.length)
        {
          var index = els.order.length;
          var tagName = 'various' + index;
          els[tagName] = child.outerHTML; els.order.push(tagName);
          code.replaceChild(document.createElement('various' + index), child);
        }
      }
      // Store the code into a variable to improve performance:
      var innerHTML = code.innerHTML;
      // Search for syntax elements, format them and replace them with placeholders:
      try
      {
        innerHTML = comments(innerHTML);
        innerHTML = function_definitions(innerHTML);
        innerHTML = continuation_sections(innerHTML);
        innerHTML = hotstrings(innerHTML);
        innerHTML = hotkeys(innerHTML);
        innerHTML = declarations(innerHTML);
        innerHTML = directives(innerHTML);
        innerHTML = command_alikes(innerHTML);
        innerHTML = legacy_assignments(innerHTML);
        innerHTML = expressions(innerHTML);
        innerHTML = labels(innerHTML);
      } catch (e) {
        if (window.console) // For IE9
        {
          console.log("Syntax highlighting failed. Clear cache and hard refresh. If this doesn't help, please report the following error message and the problematic code at https://github.com/AutoHotkey/AutoHotkeyDocs.");
          console.log(e);
        }
      }
      // Release changes:
      code.innerHTML = innerHTML;
      // Resolve placeholders:
      for (var k = els.order.length - 1; k >= 0; k--)
      {
        var tagName = els.order[k];
        var child = code.querySelector(tagName);
        if (child)
          child.outerHTML = els[tagName];
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
    /** Searches for comments, formats them and replaces them with placeholders. */
    function comments(innerHTML)
    {
      // single-line comments:
      innerHTML = innerHTML.replace(/(\s|^)(;.*?)$/gm, function(_, PRE, COMMENT)
      {
        return PRE + ph('sct', wrap(COMMENT, 'cmt', null), COMMENT);
      });
      // multi-line comments:
      innerHTML = innerHTML.replace(/(^\s*\/\*[\s\S]*?^\s*(\*\/|$(?![\r\n])))/gm, function(COMMENT)
      {
        return ph('mct', wrap(COMMENT, 'cmt', null));
      });
      return innerHTML;
    }
    /** Searches for escape sequences, formats them and replaces them with placeholders. */
    function escape_sequences(innerHTML, regex)
    {
      return innerHTML.replace(new RegExp(regex || '`.', 'gm'), function(SEQUENCE)
      {
        return ph('esc', wrap(SEQUENCE, 'esc', null), SEQUENCE);
      });
    }
    /** Searches for function definitions, formats them and replaces them with placeholders. */
    function function_definitions(innerHTML)
    {
      return innerHTML.replace(/^(\s*?)([A-Za-z0-9_\#@\$\u00A0-\uFFFF]+?)(\(.*?\))(?=\s*(<(em|sct)\d+><\/(em|sct)\d+>\s*)*{)/mg, function(ASIS, PRE, NAME, PARAMS)
      {
        if (NAME.match(/^(while|if)$/i)) // Ignore while and if statements with open parenthesis
          return ASIS;
        PARAMS = PARAMS.replace(/\bbyref\b/gim, function(BYREF) // ByRef
        {
          return ph('byref', wrap(BYREF, 'dec', index_data[syntax[5].dict['byref']][1]));
        });
        return PRE + ph('fun', wrap(NAME, 'fun', null) + expressions(PARAMS));
      });
    }
    /** Searches for continuation sections, formats them and replaces them with placeholders. */
    function continuation_sections(innerHTML, forced_opts, is_inside_quotes, is_literal)
    {
      return innerHTML.replace(/([\r\n]*?^\s*\()(.*)([\s\S]*?)(^\s*\))/gm, function(ASIS, OPEN, OPTS, CONT, CLOSE)
      {
        var opts = (OPTS + (forced_opts ? ' ' + forced_opts : '')).split(/\s+/);
        for (var i in opts)
          if (opts[i].indexOf(')') != -1 && !/^join/i.test(opts[i]))
            return OPEN + OPTS + continuation_sections(CONT + CLOSE);
        if (opts.indexOf('comments') == -1 && opts.indexOf('comment') == -1 && opts.indexOf('com') == -1 && opts.indexOf('c') == -1)
          CONT = resolve_placeholders(CONT, 'em|sct');
        if (opts.indexOf('`') == -1)
          CONT = escape_sequences(CONT);
        if (is_inside_quotes)
        {
          CONT = escape_sequences(CONT, '""');
          if (CONT.indexOf('"') != -1 && (c = CONT.split('"')).length % 2)
          {
            var first = wrap(c.shift() + '"', 'str', null);
            var last = wrap('"' + c.pop(), 'str', null);
            var middle = expressions(c.join('"'));
            CONT = first + middle + last;
          }
          else
            CONT = wrap(CONT, 'str', null);
        }
        else if (is_literal)
        {
          if (opts.indexOf('%') == -1)
            CONT = string_with_var_refs(CONT);
          else
            CONT = wrap(CONT, 'str', null);
        }
        else
          CONT = expressions(CONT);
        return ph('cont', OPEN + OPTS + CONT + CLOSE, ASIS);

        /**
         * Attempts to resolve placeholders to their original content.
         * @param {string} string - The string containing placeholders.
         * @param {string} phs - A pipe-delimited list of placeholders to resolve.
         */
        function resolve_placeholders(string, phs)
        {
          return string.replace(new RegExp('<((?:' + phs + ')\\d+)></\\1>', 'gi'), function(_, TAG)
          {
            if (els_raw[TAG])
              return els_raw[TAG];
            else
            {
              var div = document.createElement('div');
              div.innerHTML = els[TAG];
              return div.textContent || div.innerText;
            }
          });
        }
      });
    }
    /** Searches for declarations, formats them and replaces them with placeholders. */
    function declarations(innerHTML)
    {
      return innerHTML.replace(new RegExp('((?:^|\\{|\\})\\s*)\\b(' + syntax[5].join('|') + ')(?:[ \\t]*$|([ \\t]+)(.+?)(?=[ \\t]+<(?:em|sct)\\d+></(?:em|sct)\\d+>|$))', 'gim'), function(_, PRE, DEC, SEP, VARS)
      {
        var dec = DEC.toLowerCase();
        if (dec == 'class' && VARS) // class statements:
          if (m = VARS.match(/^([a-z0-9_\#@\$\u00A0-\uFFFF]+)(?:(\s+?)(extends)(\s+?)([a-z0-9_\#@\$\u00A0-\uFFFF]+))?(.*)$/i))
          {
            var link = index_data[syntax[5].dict['class']][1];
            var out = wrap(DEC, 'dec', link) + SEP + expressions(m[1]);
            if (m[3]) // extends
              out += m[2] + wrap(m[3], 'dec', link) + m[4] + expressions(m[5]);
            return PRE + ph('dec', out + m[6]);
          }
        return PRE + ph('dec', wrap(DEC, 'dec', 5) + (VARS ? SEP + expressions(VARS) : ''));
      });
    }
    /** Searches for directives, formats them and replaces them with placeholders. */
    function directives(innerHTML)
    {
      return innerHTML.replace(new RegExp('(' + syntax[0].join('|') + ')\\b($|[\\s,])(.*?)(?=<(?:em|sct)\\d+></(?:em|sct)\\d+>|$)', 'gim'), function(_, DIR, SEP, PARAMS)
      {
        var dir = DIR.toLowerCase();
        var types = index_data[syntax[0].dict[dir]][3]; // parameter types
        PARAMS = param_list_to_array(PARAMS);
        PARAMS = merge_excess_params(PARAMS, types);
        PARAMS = param_array_to_list(PARAMS, types);
        return ph('dir', wrap(DIR, 'dir', 0) + SEP + PARAMS);
      });
    }
    /** Searches for control flow statements and commands, formats them and replaces them with placeholders. */
    function command_alikes(innerHTML)
    {
      innerHTML = innerHTML.replace(new RegExp('((?:^|\\{|\\})\\s*)\\b(?:(' + syntax[3].join('|') + ')|(' + syntax[6].join('|') + '))\\b(\\s*,|\\s*<(?:em|sct)\\d+></(?:em|sct)\\d+>\\s*,|\\(|\\{|$|\\s(?!\\s*' + self.assignOp + '))(.*?(?=\\s*<(?:em|sct)\\d+></(?:em|sct)\\d+>(?!<cont\\d+>)|$)(?:(?:.*[\\n\\r]\\s*?(?:,|<sct\\d+>|<cont\\d+>).*?(?=\\s*<(?:em|sct)\\d+></(?:em|sct)\\d+>|$)))*)', 'gim'), function(ASIS, PRE, CFS, CMD, SEP, PARAMS)
      {
        if (CFS) // control flow statements:
        {
          var cfs = CFS.toLowerCase(), out, link;
          var types = index_data[syntax[3].dict[cfs]][3]; // parameter types
          if (SEP == '(')
            if (cfs == 'if' || cfs == 'while')
              return PRE + ph('cfs', wrap(CFS, 'cfs', 3)) + expressions(SEP + PARAMS);
            else
              return ASIS;
          if (SEP == '{' || PARAMS[0] == '{')
            return PRE + ph('cfs', wrap(CFS, 'cfs', 3)) + SEP + PARAMS;
          if (!types)
            return PRE + ph('cfs', wrap(CFS, 'cfs', 3)) + SEP + statements(PARAMS);
          // legacy if statements:
          if (cfs == 'if')
          {
            if (m = PARAMS.match(/^([a-z0-9_\#@\$%\u00A0-\uFFFF]+?)(\s*?)(&gt;=|>=|&gt;|>|&lt;&gt;|<>|&lt;=|<=|&lt;|<|!=|=)(\s*?)(.*?)$/i))
            {
              link = index_data[syntax[3].dict['ifequal']][1];
              out = wrap(CFS, 'cfs', link) + SEP + expressions(m[1]) + m[2] + m[3] + m[4] + string_param(m[5]);
              return PRE + ph('cfs', out);
            }
            else if (m = PARAMS.match(/^([a-z0-9_\#@\$%\u00A0-\uFFFF]+?)(\s+?)((?:not\s+?)?(?:between))(\s+?)(.*?)(\s+?)(and)(\s+?)(.*?)$/i))
            {
              link = index_data[syntax[3].dict['if between']][1];
              out = wrap(CFS, 'cfs', link) + SEP + expressions(m[1]) + m[2] + wrap(m[3], 'cfs', link) + m[4] + string_param(m[5]) + m[6] + wrap(m[7], 'cfs', link) + m[8] + string_param(m[9]);
              return PRE + ph('cfs', out);
            }
            else if (m = PARAMS.match(/^([a-z0-9_\#@\$%\u00A0-\uFFFF]+?)(\s+?)((?:not\s+?)?(in|contains)|(is)(?:\s+?not)?)(\s+?)(.*?)$/i))
            {
              link = index_data[syntax[3].dict['if ' + (m[4] || m[5]).toLowerCase()]][1];
              out = wrap(CFS, 'cfs', link) + SEP + expressions(m[1]) + m[2] + wrap(m[3], 'cfs', link) + m[6] + string_param(m[7]);
              return PRE + ph('cfs', out);
            }
          }
          // named if statements:
          else if (cfs == 'ifmsgbox' || cfs == 'ifexist' || cfs == 'ifnotexist' || cfs == 'ifinstring' || cfs == 'ifnotinstring' || cfs == 'ifwinactive' || cfs == 'ifnotwinactive' || cfs == 'ifwinexist' || cfs == 'ifnotwinexist' || cfs == 'ifequal' || cfs == 'ifnotequal' || cfs == 'ifless' || cfs == 'iflessorequal' || cfs == 'ifgreater' || cfs == 'ifgreaterorequal')
          {
            PARAMS = param_list_to_array(PARAMS);
            if (PARAMS.length > types.length)
              PARAMS.push(statements(PARAMS.splice(types.length).join(',')));
            PARAMS = param_array_to_list(PARAMS, types);
            return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + SEP + PARAMS);
          }
          // for statements:
          else if (cfs == 'for')
          {
            if (m = PARAMS.match(/^(\s*(?:,\s*)?[a-z0-9_\#@\$\u00A0-\uFFFF]+?(?:\s*,\s*[a-z0-9_\#@\$\u00A0-\uFFFF]+?)*(?:\s*,)?)(\s+)(in)(\s)(.+)$/i))
            {
              link = index_data[syntax[3].dict['for']][1];
              out = wrap(CFS, 'cfs', link) + SEP + m[1] + m[2] + wrap(m[3], 'cfs', link) + m[4] + expressions(m[5]);
              return PRE + ph('cfs', out);
            }
          }
          PARAMS = param_list_to_array(PARAMS);
          PARAMS = merge_excess_params(PARAMS, types);
          // loop statements:
          if (cfs == 'loop')
          {
            // specialized loops:
            if (PARAMS.length > 1 && (m = PARAMS[0].match(/^\s*(files|parse|read|reg)\s*$/i)))
            {
              var subcfs = PARAMS.shift();
              var entry = index_data[syntax[3].dict['loop, ' + m[1].toLowerCase()]];
              PARAMS = param_array_to_list(PARAMS, entry[3]);
              out = wrap(CFS, 'cfs', entry[1]) + SEP + wrap(subcfs, 'cfs', entry[1]) + ',' + PARAMS;
              return PRE + ph('cfs', out);
            }
            // OTB:
            else if (PARAMS.length == 1 && (m = PARAMS[0].match(/^(\s*%\s|)(.*?)(\s*\{[\s\S]*)/)))
            {
              PARAMS = m[1] + (m[1] ? expressions : string_param)(m[2]) + m[3];
              return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + SEP + PARAMS);
            }
          }
          PARAMS = param_array_to_list(PARAMS, types);
          return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + SEP + PARAMS);
        }
        else if (CMD) // commands:
        {
          var cmd = CMD.toLowerCase();
          var types = index_data[syntax[6].dict[cmd]][3]; // parameter types
          if (SEP == '(')
            return ASIS;
          if (cmd == 'click' && PARAMS[PARAMS.length-1] == '}')
            return ASIS;
          PARAMS = param_list_to_array(PARAMS);
          PARAMS = merge_excess_params(PARAMS, types);
          // MsgBox commands:
          if (cmd == 'msgbox' && PARAMS.length > 1)
          {
            var p1_isNum = PARAMS[0].match(new RegExp('^\\s*\\+?(\\b(' + self.num + ')\\b)?\\s*$', 'm'));
            var p1_isExp = PARAMS[0].match(/^\s*%\s/);
            var p1_isOptions = p1_isNum || (p1_isExp && PARAMS[1]);
            var p4_isNum = PARAMS[3] && PARAMS[3].match(new RegExp('^\\s*(\\b(' + self.num + ')\\b)?\\s*($|<((?:em|sct)\\d+)></\\3>)', 'm'));
            var p4_isExp = PARAMS[3] && PARAMS[3].match(/^\s*%/);
            var p4_isTimeout = p1_isOptions && (p4_isNum || p4_isExp);
            if (!p1_isOptions) // 1-parameter mode
              PARAMS.push(PARAMS.splice(0).join(','));
            else if (PARAMS[3] && !p4_isTimeout) // 3-parameter mode
              PARAMS.push(PARAMS.splice(2).join(','));
          }
          PARAMS = param_array_to_list(PARAMS, types);
          return PRE + ph('cmd', wrap(CMD, 'cmd', 6) + SEP + PARAMS);
        }
      });
      // switch's case keyword:
      innerHTML = innerHTML.replace(new RegExp('((?:^|\\{|\\})\\s*)\\b(case)\\b(\\s*,\\s*|\\s+)(.*?:(?!=).*?)(?=\\s*<(?:em|sct)\\d+><\/(?:em|sct)\\d+>|$)', 'gim'), function(ASIS, PRE, CFS, SEP, PARAMS)
      {
        // Temporary exclude colon-using elements:
        var sub = [];
        PARAMS = PARAMS.replace(/".*?"|\(.*\)|\[.*\]|\{.*\}|:=|.*?\?.*?:/g, function(c)
        {
          return '<sub' + (sub.push(c) - 1) + '>';
        });
        var i = PARAMS.indexOf(':');
        if (i == -1)
          return ASIS;
        var parts = [PARAMS.slice(0, i), PARAMS.slice(i + 1)];
        // Restore excluded elements:
        for (n in parts)
          parts[n] = parts[n].replace(/<sub(\d+)>/g, function(_, i) { return sub[i]; });
        parts[0] = expressions(parts[0]);
        parts[1] = statements(parts[1]);
        return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + SEP + parts.join(':'));
      });
      // switch's default keyword:
      innerHTML = innerHTML.replace(new RegExp('((?:^|\\{|\\})\\s*)\\b(default)\\b(\\s*:(?!=))([^\\r\\n]+?)(?=\\s*<(?:em|sct)\\d+><\/(?:em|sct)\\d+>|$)', 'gim'), function(_, PRE, CFS, COLON, PARAMS)
      {
        return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + COLON + statements(PARAMS));
      });
      return innerHTML;
    }
    /** Searches for hotstrings, formats them and replaces them with placeholders. */
    function hotstrings(innerHTML)
    {
      return innerHTML.replace(/^(\s*)(:.*?:)(.*)(::)(.*)(?=<(?:em|sct)\d+><\/(?:em|sct)\d+>|$)/mg, function(ASIS, PRE, HS1, ABBR, HS2, REPL)
      {
        if (ASIS.indexOf('`::') != -1)
          return hotstrings(escape_sequences(innerHTML, '`::'));
        ABBR = wrap(escape_sequences(ABBR), 'str', null);
        if (HS1.match(/x/i)) // execute option
          REPL = statements(REPL);
        else if (/<cont\d+>/.test(REPL))
          REPL = string_with_cont_sections(REPL, true);
        else
          REPL = wrap(escape_sequences(REPL), 'str', null);
        var out = PRE + wrap(HS1, 'lab', null) + ABBR + wrap(HS2, 'lab', null) + REPL;
        return ph('hs', out);
      });
    }
    /** Searches for hotkeys, formats them and replaces them with placeholders. */
    function hotkeys(innerHTML)
    {
      var key_names = '(?:L|R|M)Button|XButton[1-2]|Wheel(?:Down|Up|Left|Right)|CapsLock|Space|Tab|Enter|Return|Escape|Esc|Backspace|BS|ScrollLock|Delete|Del|Insert|Ins|Home|End|PgUp|PgDn|Up|Down|Left|Right|Numpad(?:[0-9]|Dot|Ins|End|Down|PgDn|Left|Clear|Right|Home|Up|PgUp|Del|Div|Mult|Add|Sub|Enter)|NumLock|F(?:2[0-4]|1[0-9]|[1-9])|LWin|RWin|(?:L|R)?(?:Control|Ctrl|Shift|Alt)|Browser_(?:Back|Forward|Refresh|Stop|Search|Favorites|Home)|Volume_(?:Mute|Down|Up)|Media_(?:Next|Prev|Stop|Play_Pause)|Launch_(?:Mail|Media|App1|App2)|AppsKey|PrintScreen|CtrlBreak|Pause|Break|Help|Sleep|SC[0-9a-f]{1,3}|VK[0-9a-f]{1,2}|Joy(?:3[0-2]|2[0-9]|1[0-9]|[1-9])|\\S|&.+?;';
      return innerHTML.replace(new RegExp('^(\\s*)((?:(?:[#!^+*~$]|&lt;|&gt;)*(?:' + key_names + ')(?:\\s+up)?|~?(?:' + key_names + ')\\s+&amp;\\s+~?(?:' + key_names + ')(?:\\s+up)?)::)([\\t ]*)(.*)(?=\\s+<(?:em|sct)\\d+></(?:em|sct)\\d+>|$)', 'gim'), function(ASIS, PRE, HK, SPACE, ACTION)
      {
        var out = PRE + ph('hk', wrap(HK, 'lab', null)) + SPACE;
        if (ACTION == '')
          return out;
        if (/^(control|sleep)$/i.test(ACTION))
          return out + ACTION;
        var quote_count = ACTION.split('"').length - 1;
        if (quote_count == 1)
            return ASIS;
        return out + statements(ACTION);

      });
    }
    /** Searches for labels, formats them and replaces them with placeholders. */
    function labels(innerHTML)
    {
      return innerHTML.replace(/^(\s*)([^\s,`]+?:)(?=\s*(<(em|sct)\d+><\/(em|sct)\d+>|$))/mg, function(_, PRE, LABEL)
      {
        return PRE + ph('lab', wrap(LABEL, 'lab', null));
      });
    }
    /** Searches for legacy assignments, formats them and replaces them with placeholders. */
    function legacy_assignments(innerHTML)
    {
      return innerHTML.replace(/((?:^|\{|\})\s*)([a-z0-9_\#@\$%\u00A0-\uFFFF]+?[ \t]*((?:\+|-)?=)[ \t]*)(.*?(?=\s*<(?:em|sct)\d+><\/(?:em|sct)\d+>(?!<cont\d+>)|$)(?:(?:.*[\n\r]\s*?(?:,|<sct\d+>|<cont\d+>).*?(?=\s*<(?:em|sct)\d+><\/(?:em|sct)\d+>|$)))*)/gim, function(_, PRE, VAR_OP, OP, PARAMS)
      {
         var types = (OP == '+=' || OP == '-=') ? 'ES' : 'S'; // parameter types
        PARAMS = param_list_to_array(PARAMS);
        PARAMS = merge_excess_params(PARAMS, types);
        PARAMS = param_array_to_list(PARAMS, types);
        return PRE + expressions(VAR_OP) + ph('assign', PARAMS);
      });
    }
    /** Searches for strings, formats them and replaces them with placeholders. */
    function strings(innerHTML)
    {
      return innerHTML.replace(/((")[\s\S]*?\2)+/gm, function(STRING)
      {
        var out = '', lastIndex = 0, m;
        STRING = escape_sequences(STRING, '(?!^)""(?!$)|`.');
        var regex = /<(cont\d+)><\/\1>/g;
        while (m = regex.exec(STRING))
        {
          out += wrap(STRING.slice(lastIndex, m.index), 'str', null)
          out += continuation_sections(els_raw[m[1]], '', true);
          lastIndex = regex.lastIndex;
        }
        out += wrap(STRING.slice(lastIndex), 'str', null);
        return ph('str', out);
      });
    }
    /** Searches for numeric values, formats them and replaces them with placeholders. */
    function numeric_values(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\b(' + self.num + ')\\b', 'gm'), function(NUMBER)
      {
        return ph('num', wrap(NUMBER, 'num', null));
      });
    }
    /** Searches for methods, formats them and replaces them with placeholders. */
    function methods(innerHTML)
    {
      return innerHTML.replace(/\.([A-Za-z0-9_\u00A0-\uFFFF]+?)(?=\()/g, function(_, METHOD)
      {
        return ph('met', '.' + wrap(METHOD, 'met', null));
      });
    }
    /** Searches for properties, formats them and replaces them with placeholders. */
    function properties(innerHTML)
    {
      return innerHTML.replace(/\.([A-Za-z0-9_\u00A0-\uFFFF]+?)\b/g, function(_, PROPERTY)
      {
        return ph('prp', '.' + wrap(PROPERTY, 'prp', null));
      });
    }
    /** Searches for built-in variables, formats them and replaces them with placeholders. */
    function built_in_vars(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\b(' + syntax[1].join('|') + ')\\b', 'gi'), function(_, BIV)
      {
        return ph('biv', wrap(BIV, 'biv', 1));
      });
    }
    /** Searches for built-in functions, formats them and replaces them with placeholders. */
    function built_in_functions(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\b(' + syntax[2].join('|') + ')(?=\\()', 'gi'), function(_, BIF)
      {
        return ph('bif', wrap(BIF, 'bif', 2));
      });
    }
    /** Searches for statements, formats them and replaces them with placeholders. */
    function statements(innerHTML)
    {
      innerHTML = declarations(innerHTML);
      innerHTML = command_alikes(innerHTML);
      innerHTML = legacy_assignments(innerHTML);
      innerHTML = expressions(innerHTML);
      return innerHTML;
    }
    /** Searches for expressions, formats them and replaces them with placeholders. */
    function expressions(innerHTML)
    {
      innerHTML = strings(innerHTML);
      innerHTML = numeric_values(innerHTML);
      innerHTML = methods(innerHTML);
      innerHTML = properties(innerHTML);
      innerHTML = built_in_vars(innerHTML);
      innerHTML = built_in_functions(innerHTML);
      return innerHTML;
    }
    /** Converts a comma-separated list of parameters to an array.
     * @param {string} params - A comma-separated list of parameters.
     * @returns {array} An array of parameters.
     */
    function param_list_to_array(params)
    {
      params = escape_sequences(params);
      // Temporary exclude comma-using elements:
      var sub = [];
      params = params.replace(/\(.*\)|\[.*\]|\{.*\}/g, function(c)
      {
        return '<sub' + (sub.push(c) - 1) + '>';
      });
      params = params.split(',');
      // Search for forced expressions and adjust param list:
      var params_new = [];
      var merge_next_param = false;
      for (n in params)
      {
        var forced_exp = params[n].match(/^\s*%\s/);
        params_new.push(params[n]);
        if (merge_next_param)
        {
          merge_next_param = false;
          if (!forced_exp)
          {
            params_new.splice(-2, 2, params_new.slice(-2).join(','));
            forced_exp = true;
          }
        }
        if (forced_exp)
        {
          var quote_count = params_new[params_new.length - 1].split('"').length - 1;
          if (quote_count % 2) // odd number of quotes
            merge_next_param = true;
        }
      }
      // Restore excluded elements:
      for (n in params_new)
        params_new[n] = params_new[n].replace(/<sub(\d+)>/g, function(_, i) { return sub[i]; });
      return params_new;
    }
    /** Merges excess parameters with the last valid parameter.
     * @param {array} params - An array of parameters.
     * @param {string} types - A string of parameter types.
     * @returns {array} An array of parameters correctly sized.
     */
    function merge_excess_params(params, types)
    {
      if (params.length > types.length)
        params.push(params.splice(types.length - 1).join(','));
      return params;
    }
    /** Converts an array of parameters to a comma-separated list.
     * @param {array} params - An array of parameters.
     * @param {string} types - A string of parameter types.
     * @returns {string} A comma-separated list of parameters.
     */
    function param_array_to_list(params, types)
    {
      for (n in params)
      {
        var param = params[n];
        var param_type = types[n];
        var forced_exp = param.match(/^\s*%\s/);
        var out = '', lastIndex = 0, m, part;
        var regex = /\s*<((?:sct|mct|em)\d+)><\/\1>/g;
        while (m = regex.exec(param))
        {
          if ((part = param.slice(lastIndex, m.index)) != '')
            out += format_by_type(part);
          out += m[0];
          lastIndex = regex.lastIndex;
        }
        if ((part = param.slice(lastIndex)) != '')
          out += format_by_type(part);
        params[n] = out;
      }
      return params.join(',');

      function format_by_type(param_part)
      {
        if (param_type == 'E' || forced_exp) // expression
          return expressions(param_part);
        else if (param_type == 'I' || param_type == 'O') // InputVar or OutputVar
          return expressions(param_part);
        else if (param_type == 'S') // string
          return string_param(param_part);
        return param_part;
      }
    }
    /** Wraps a syntax keyword or any string in `<span>` and optionally `<a>`.
     * @param {string} KeywordOrString - A syntax keyword such as `MsgBox` or any string.
     * @param {string} className - The value for `<span>`'s class attribute.
     * @param {string|number} LinkOrTypeNum - Any relative link or type number. Type numbers can only be used if `KeywordOrString` is a valid syntax keyword.
     * @returns {string} The syntax keyword or string wrapped in HTML tags.
     */
    function wrap(KeywordOrString, className, LinkOrTypeNum)
    {
      var span = document.createElement('span');
      span.className = className;
      if (LinkOrTypeNum != null)
      {
        var a = document.createElement('a');
        if (new_tab)
          a.target = '_blank';
        if (typeof LinkOrTypeNum == 'number')
          a.href = docs_path + index_data[syntax[LinkOrTypeNum].dict[KeywordOrString.toLowerCase()]][1];
        else
          a.href = docs_path + LinkOrTypeNum;
        a.innerHTML = KeywordOrString;
        span.appendChild(a);
      }
      else
        span.innerHTML = KeywordOrString;
      return span.outerHTML;
    }
    /**
     * Replaces specific syntax with a resolvable placeholder to facilitate syntax detection.
     * @param {string} abbr - The abbreviation of the syntax element, e.g. 'str' for strings.
     * @param {string} repl - The replacement for the placeholder when resolving.
     * @param {string} [raw] - The unformatted syntax.
     * @returns {string} The placeholder, e.g. `<str12></str12>`.
     */
    function ph(abbr, repl, raw)
    {
      var tagName = abbr + els.order.length;
      els[tagName] = repl; els.order.push(tagName);
      if (raw)
        els_raw[tagName] = raw;
      return '<' + tagName + '></' + tagName + '>';
    }
    /**
     * Converts a parameter to a legacy string parameter.
     * @param {string} param - The parameter.
     * @returns {string} The parameter, formatted.
     */
    function string_param(param)
    {
      var m;
      param = escape_sequences(param);
      if (m = param.match(new RegExp('^(\\s*(?:\\+|-)?\\s*)\\b(' + self.num + ')\\b(\\s*)$'))) // number
        return m[1] + wrap(m[2], 'num', null) + m[3];
      if (/<cont\d+>/.test(param)) // continuation section
        param = string_with_cont_sections(param);
      else
        param = string_with_var_refs(param);
      return param;
    }
    /**
     * Sorts syntax keywords by type number.
     * @param {array} index_data - An array of arrays of strings (data_index.js).
     * @returns {object} An object of number properties and array values.
     */
    function sort_syntax_by_type(index_data)
    {
      var syntax = {};
      for (var i = index_data.length - 1; i >= 0; i--)
      {
        var entry = index_data[i][0];
        var type = index_data[i][2];
        var skip = index_data[i][4] || false;
        if (typeof type == 'undefined')
          continue;
        syntax[type] = syntax[type] || [];
        if (entry.substr(entry.length - 2) == '()')
          entry = entry.substr(0, entry.length - 2);
        if (!skip)
          syntax[type].push(entry);
        (syntax[type].dict = syntax[type].dict || {})[entry.toLowerCase()] = i;
      }
      return syntax;
    }
    /**
     * Formats continuation sections in a non-expression string.
     * @param {string} string - A string containing one or more continuation sections.
     * @param {boolean} is_literal - If true, the string cannot be dynamic (for hotstrings).
     * @returns {string} The string, formatted.
     */
    function string_with_cont_sections(string, is_literal)
    {
      var out = '', lastIndex = 0, m, part;
      var regex = /<(cont\d+)><\/\1>/g;
      while (m = regex.exec(string))
      {
        part = string.slice(lastIndex, m.index);
        if (part != '')
          out += is_literal ? wrap(part, 'str', null) : string_with_var_refs(part);
        out += continuation_sections(els_raw[m[1]], is_literal ? '%' : '', false, true);
        lastIndex = regex.lastIndex;
      }
      part = string.slice(lastIndex);
      if (part != '')
        out += is_literal ? wrap(part, 'str', null) : string_with_var_refs(part);
      return out;
    }
    /**
     * Formats variable references (%...%) in a non-expression string.
     * @param {string} string - A string containing one or more variable references.
     * @returns {string} The string, formatted.
     */
    function string_with_var_refs(string)
    {
      var out = '', lastIndex = 0, m;
      var regex = /%([^,\s]+?)%/g;
      while (m = regex.exec(string))
      {
        out += wrap(string.slice(lastIndex, m.index), 'str', null) + '%';
        out += expressions(m[1]);
        out += '%';
        lastIndex = regex.lastIndex;
      }
      out += wrap(string.slice(lastIndex), 'str', null);
      return out;
    }
  };
}
