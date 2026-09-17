var highlighter = new ctor_highlighter;
/**
 * Syntax highlighter for AutoHotkey code.
 * @constructor
 */
function ctor_highlighter()
{
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
  this.addSyntaxColors = function(codes, index_data, docs_path, new_tab)
  {
    if (!-[1,]) // Exclude Internet Explorer 8 or below
      return;
    var s, r, syn = sort_syntax_by_type(index_data);
    // Traverse pre elements:
    for (var i = 0; i < codes.length; i++)
    {
      var pre = codes[i], code = pre, els = {order: []};
      // Skip pre.no-highlight elements:
      if (pre.className.indexOf('no-highlight') != -1)
        continue;
      // Add highlight class if not available:
      if (pre.className.indexOf('highlight') == -1)
        pre.className += ' highlight';
      // Convert to pre>code if necessary:
      if (pre.tagName == 'PRE')
      {
        if (pre.firstChild && pre.firstChild.tagName == 'CODE')
        {
          code = pre.firstChild;
          code.className += ' highlight';
        }
        else
        {
          code = document.createElement('code');
          code.className = 'highlight';
          code.innerHTML = pre.innerHTML;
          pre.innerHTML = '';
          pre.appendChild(code);
        }
      }
      // Temporarily remove HTML elements interfering with syntax detection:
      for (var ii = 0; ii < code.children.length; ii++)
      {
        var child = code.children[ii];
        if (child.tagName == 'EM')
        {
          var index = els.order.length;
          var tagName = 'em' + index;
          code.replaceChild(document.createElement('em' + index), child);
          els[tagName] = {repl: child.outerHTML, raw: null};
          els.order.push(tagName);
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
          els[tagName] = {repl: child.outerHTML, raw: null};
          els.order.push(tagName);
          code.replaceChild(document.createElement('various' + index), child);
        }
      }
      // Store the code into a variable to improve performance:
      var innerHTML = code.innerHTML;
      // Search for syntax elements:
      try {
        innerHTML = parse_syntax(innerHTML, all_syntax_elements);
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
          child.outerHTML = els[tagName].repl;
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
    /** Search for syntax elements, format them and replace them with placeholders. */
    function all_syntax_elements(innerHTML, settings) {
      s = settings; r = build_regex_fragments(s);
      innerHTML = continuation_sections(innerHTML);
      innerHTML = comments(innerHTML);
      innerHTML = hotstrings(innerHTML);
      innerHTML = hotkeys(innerHTML);
      innerHTML = declarations(innerHTML);
      innerHTML = directives(innerHTML);
      innerHTML = command_alikes(innerHTML);
      innerHTML = legacy_assignments(innerHTML);
      innerHTML = labels(innerHTML);
      innerHTML = expressions(innerHTML);
      return innerHTML;
    }
    /** Searches for multi-line comments, formats them and replaces them with placeholders. */
    function comments_multi(innerHTML)
    {
      return innerHTML.replace(new RegExp('(^' + r.s + '*\\/\\*[\\s\\S]*?(^\\s*\\*\\/|$(?![\\r\\n])))', 'gm'), function(COMMENT)
      {
        COMMENT = resolve_placeholders(COMMENT, 'cont', true);
        return ph('mct', wrap(COMMENT, 'cmt', null));
      });
    }
    /** Searches for single-line comments, formats them and replaces them with placeholders. */
    function comments_single(innerHTML)
    {
      return innerHTML.replace(new RegExp('(' + r.s + '|^)(' + r.sct_flag + '.*?(\\r?\\n' + r.s + '*' + r.sct_flag + '.*?)*)(?=$|' + r.cont + ')', 'gm'), function(_, PRE, COMMENT)
      {
        return PRE + ph('sct', wrap(COMMENT, 'cmt', null), COMMENT);
      });
    }
    /** Searches for escape sequences, formats them and replaces them with placeholders. */
    function escape_sequences(innerHTML, regex)
    {
      return innerHTML.replace(new RegExp(regex || r.esc + '.', 'gm'), function(SEQUENCE)
      {
        return ph('esc', wrap(SEQUENCE, 'esc', null), SEQUENCE);
      });
    }
    /** Searches for continuation sections, formats them and replaces them with placeholders. */
    function continuation_sections(innerHTML, forced_opts, is_inside_quotes, is_literal)
    {
      return innerHTML.replace(new RegExp('([\\r\\n]*?^' + r.s + '*\\()(.*)([\\s\\S]*?)(^' + r.s + '*\\))', 'gm'), function(ASIS, OPEN, OPTS, CONT, CLOSE)
      {
        OPTS = comments_single(OPTS);
        var opts = OPTS + (forced_opts ? ' ' + forced_opts : '');
        opts = opts.replace(new RegExp('(^|' + r.s + '+)(join\\S*|(l|r)trim0?|' + r.sct + ')|', 'gi'), '');
        if (opts.indexOf(')') != -1)
          return OPEN + OPTS + continuation_sections(CONT + CLOSE);
        var allow_comments = (opts.indexOf('c') != -1 || opts.indexOf('C') != -1);
        var allow_escape_sequences = (opts.indexOf('`') == -1);
        var allow_var_refs = (opts.indexOf('%') == -1);
        if (allow_comments)
          CONT = comments_single(CONT);
        if (is_inside_quotes)
        {
          CONT = strings(CONT, !allow_escape_sequences, true, true);
          CONT = expressions(CONT);
        }
        else if (is_literal)
        {
          if (allow_escape_sequences)
            CONT = escape_sequences(CONT);
          CONT = allow_var_refs ? string_with_var_refs(CONT) : wrap(CONT, 'str', null);
        }
        else
        {
          CONT = strings(CONT, !allow_escape_sequences, true, !(CONT.split('"').length % 2));
          CONT = expressions(CONT);
        }
        return ph('cont', wrap(OPEN, 'opr', null) + wrap(OPTS, 'opt', null) + CONT + wrap(CLOSE, 'opr', null), ASIS);
      });
    }
    /** Searches for declarations, formats them and replaces them with placeholders. */
    function declarations(innerHTML)
    {
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syn[5].join('|') + ')(?=(?=' + r.s + '+' + r.name + ')|' + r.suf + ')', 'gim'), function(_, DEC)
      {
        return ph('dec', wrap(DEC, 'dec', 5), DEC);
      });
      // class declarations:
      innerHTML = innerHTML.replace(new RegExp('(<dec\\d+></dec\\d+>)(' + r.s + '+)(' + r.name + ')(' + r.s + '+)(extends)(' + r.s + '+)(' + r.name + ')', 'gim'), function(ASIS, CLASS, SPACE1, NAME1, SPACE2, EXTENDS, SPACE3, NAME2)
      {
        if (resolve_placeholders(CLASS, 'dec', true).toLowerCase() != 'class')
          return ASIS;
        var link = index_data[syn[5].dict['class']][1];
        return ph('dec', wrap(CLASS, 'dec', link) + SPACE1 + expressions(NAME1) + SPACE2 + wrap(EXTENDS, 'dec', link) + SPACE3 + expressions(NAME2));
      });
      // class's accessor definitions:
      innerHTML = innerHTML.replace(new RegExp(r.pre + '\\b(get|set)\\b(?=(?=' + r.s + '*\\{)|' + r.suf + ')', 'gim'), function(_, PRE, ACCESSOR)
      {
        var link = index_data[syn[5].dict['class']][1];
        return PRE + ph('cfs', wrap(ACCESSOR, 'dec', link));
      });
      return innerHTML;
    }
    /** Searches for directives, formats them and replaces them with placeholders. */
    function directives(innerHTML)
    {
      return innerHTML.replace(new RegExp(r.pre + '(' + syn[0].join('|') + ')\\b($|[\\t ' + r.delim + ']|' + r.s + '*(?=' + r.cont + '))(.*?)' + r.suf, 'gim'), function(_, PRE, DIR, SEP, PARAMS)
      {
        var dir = DIR.toLowerCase();
        var types = index_data[syn[0].dict[dir]][3]; // parameter types
        PARAMS = param_list_to_array(PARAMS, types.indexOf('E') != -1);
        PARAMS = merge_excess_params(PARAMS, types);
        PARAMS = param_array_to_list(PARAMS, types);
        return PRE + ph('dir', wrap(DIR, 'dir', 0) + operators(SEP) + PARAMS);
      });
    }
    /** Searches for control flow statements and commands, formats them and replaces them with placeholders. */
    function command_alikes(innerHTML)
    {
      innerHTML = innerHTML.replace(new RegExp(r.pre + '\\b(?:(' + syn[3].join('|') + ')|(' + syn[6].join('|') + '))\\b(' + r.s + '*' + r.delim + '|\\(|\\{|$|' + r.s + '(?!' + r.s + '*' + r.op_assign + ')|' + r.s + '*(?=' + r.cont + '))(.*?(?=' + r.s + '*' + r.sct + '(?!' + r.cont + ')|$)(?:(?:.*[\\n\\r]' + r.s + '*?(?:' + r.delim + '|' + r.sct + '(?:\\s*' + r.delim + ')?|' + r.cont + ').+?' + r.suf + '))*)', 'gim'), function(ASIS, PRE, CFS, CMD, SEP, PARAMS)
      {
        if (CFS) // control flow statements:
        {
          var cfs = CFS.toLowerCase(), out, link;
          var types = index_data[syn[3].dict[cfs]][3]; // parameter types
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
            if (m = PARAMS.match(new RegExp('^(' + r.s + '*?)(' + r.name_legacy + '?)(' + r.s + '*?)(&gt;=|>=|&gt;|>|&lt;&gt;|<>|&lt;=|<=|&lt;|<|!=|=)(' + r.s + '*?)(.*?)$', 'i')))
            {
              link = index_data[syn[3].dict['ifequal']][1];
              out = wrap(CFS, 'cfs', link) + SEP + m[1] + expressions(m[2]) + m[3] + operators(m[4]) + m[5] + param_array_to_list([m[6]], 'S');
              return PRE + ph('cfs', out);
            }
            else if (m = PARAMS.match(new RegExp('^(' + r.s + '*?)(' + r.name_legacy + '?)(' + r.s + '+?)((?:not' + r.s + '+?)?(?:between))(' + r.s + '+?)(.*?)(' + r.s + '+?)(and)(' + r.s + '+?)(.*?)$', 'i')))
            {
              link = index_data[syn[3].dict['if between']][1];
              out = wrap(CFS, 'cfs', link) + SEP + m[1] + expressions(m[2]) + m[3] + wrap(m[4], 'cfs', link) + m[5] + param_array_to_list([m[6]], 'S') + m[7] + wrap(m[8], 'cfs', link) + m[9] + param_array_to_list([m[10]], 'S');
              return PRE + ph('cfs', out);
            }
            else if (m = PARAMS.match(new RegExp('^(' + r.s + '*?)(' + r.name_legacy + '?)(' + r.s + '+?)((?:not' + r.s + '+?)?(in|contains)|(is)(?:' + r.s + '+?not)?)(' + r.s + '+?)(.*?)$', 'i')))
            {
              link = index_data[syn[3].dict['if ' + (m[5] || m[6]).toLowerCase()]][1];
              out = wrap(CFS, 'cfs', link) + SEP + m[1] + expressions(m[2]) + m[3] + wrap(m[4], 'cfs', link) + m[7] + param_array_to_list([m[8]], 'S');
              return PRE + ph('cfs', out);
            }
          }
          // named if statements:
          else if (cfs == 'ifmsgbox' || cfs == 'ifexist' || cfs == 'ifnotexist' || cfs == 'ifinstring' || cfs == 'ifnotinstring' || cfs == 'ifwinactive' || cfs == 'ifnotwinactive' || cfs == 'ifwinexist' || cfs == 'ifnotwinexist' || cfs == 'ifequal' || cfs == 'ifnotequal' || cfs == 'ifless' || cfs == 'iflessorequal' || cfs == 'ifgreater' || cfs == 'ifgreaterorequal')
          {
            PARAMS = param_list_to_array(PARAMS, types.indexOf('E') != -1);
            if (PARAMS.length > types.length)
              PARAMS.push(statements(PARAMS.splice(types.length).join(',')));
            PARAMS = param_array_to_list(PARAMS, types);
            return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + operators(SEP) + PARAMS);
          }
          // for statements:
          else if (cfs == 'for')
          {
            if (m = PARAMS.match(new RegExp('^(' + r.s + '*(?:' + r.delim + r.s + '*)?' + r.name + '?(?:' + r.s + '*' + r.delim + r.s + '*' + r.name + '?)*(?:' + r.s + '*' + r.delim + ')?)(' + r.s + '+)(in)(' + r.s + ')(.+)$', 'i')))
            {
              link = index_data[syn[3].dict['for']][1];
              out = wrap(CFS, 'cfs', link) + SEP + expressions(m[1]) + m[2] + wrap(m[3], 'cfs', link) + m[4] + expressions(m[5]);
              return PRE + ph('cfs', out);
            }
          }
          PARAMS = param_list_to_array(PARAMS, types.indexOf('E') != -1);
          PARAMS = merge_excess_params(PARAMS, types);
          // loop statements:
          if (cfs == 'loop')
          {
            // specialized loops:
            if (PARAMS.length > 1 && (m = PARAMS[0].match(new RegExp('^' + r.s + '*(files|parse|read|reg)' + r.s + '*$', 'i'))))
            {
              var subcfs = PARAMS.shift();
              var entry = index_data[syn[3].dict['loop, ' + m[1].toLowerCase()]];
              PARAMS = param_array_to_list(PARAMS, entry[3]);
              out = wrap(CFS, 'cfs', entry[1]) + operators(SEP) + wrap(subcfs, 'cfs', entry[1]) + wrap(r.delim, 'opr', null) + PARAMS;
              return PRE + ph('cfs', out);
            }
            // OTB:
            else if (PARAMS.length == 1 && (m = PARAMS[0].match(new RegExp('^(' + r.s + '*' + r.deref + r.s + '|)(.*?)(' + r.s + '*\\{[\\s\\S]*)'))))
            {
              PARAMS = operators(m[1]) + (m[1] ? expressions : string_param)(m[2]) + operators(m[3]);
              return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + operators(SEP) + PARAMS);
            }
          }
          PARAMS = param_array_to_list(PARAMS, types);
          return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + operators(SEP) + PARAMS);
        }
        else if (CMD) // commands:
        {
          var cmd = CMD.toLowerCase();
          var types = index_data[syn[6].dict[cmd]][3]; // parameter types
          if (SEP == '(')
            return ASIS;
          PARAMS = param_list_to_array(PARAMS, types.indexOf('E') != -1);
          PARAMS = merge_excess_params(PARAMS, types);
          // MsgBox commands:
          if (cmd == 'msgbox' && PARAMS.length > 1)
          {
            var p1_isNum = PARAMS[0].match(new RegExp('^' + r.s + '*\\+?(\\b(' + r.num + ')\\b)?' + r.s + '*$', 'm'));
            var p1_isExp = PARAMS[0].match(new RegExp('^' + r.s + '*' + r.deref + r.s));
            var p1_isOptions = p1_isNum || (p1_isExp && PARAMS[1]);
            var p4_isNum = PARAMS[3] && PARAMS[3].match(new RegExp('^' + r.s + '*(\\b(' + r.num + ')\\b)?' + r.suf, 'm'));
            var p4_isExp = PARAMS[3] && PARAMS[3].match(new RegExp('^' + r.s + '*' + r.deref));
            var p4_isTimeout = p1_isOptions && (p4_isNum || p4_isExp);
            if (!p1_isOptions) // 1-parameter mode
              PARAMS.push(PARAMS.splice(0).join(wrap(r.delim, 'opr', null)));
            else if (PARAMS[3] && !p4_isTimeout) // 3-parameter mode
              PARAMS.push(PARAMS.splice(2).join(wrap(r.delim, 'opr', null)));
          }
          else if (cmd == 'winmove' && PARAMS.length <= 2)
            types = 'EE';
          PARAMS = param_array_to_list(PARAMS, types);
          return PRE + ph('cmd', wrap(CMD, 'cmd', 6) + operators(SEP) + PARAMS);
        }
      });
      // switch's case keyword:
      innerHTML = innerHTML.replace(new RegExp(r.pre + '\\b(case)\\b(?:$|(' + r.s + '*' + r.delim + r.s + '*|' + r.s + '+|' + r.cont + ')(.*?(\\r?\\n' + r.s + '*(' + r.op + '|' + r.sct + '|' + r.mct + '|$))*.*?:(?!=).*?)' + r.suf + ')', 'gim'), function(ASIS, PRE, CFS, SEP, PARAMS)
      {
        if (!PARAMS)
          return PRE + ph('cfs', wrap(CFS, 'cfs', 3));
        // Temporarily exclude colon-using elements:
        var temp = {order: []};
        PARAMS = temp_exclude(temp, PARAMS, /".*?"/g);
        PARAMS = temp_exclude(temp, PARAMS, /\([^()]*\)|\[[^[]]*\]|\{[^{}]*\}/g);
        PARAMS = temp_exclude(temp, PARAMS, /:=/g);
        PARAMS = temp_exclude(temp, PARAMS, /\?.*?:/g);
        // Separate case value from statement:
        var i = PARAMS.indexOf(':');
        if (i == -1)
          return ASIS;
        var parts = [PARAMS.slice(0, i), PARAMS.slice(i + 1)];
        // Restore excluded elements:
        for (n in parts)
          parts[n] = temp_restore(temp, parts[n]);
        parts[0] = expressions(parts[0]);
        parts[1] = statements(parts[1]);
        return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + SEP + parts.join(wrap(':', 'opr', null)));
      });
      // switch's default keyword:
      innerHTML = innerHTML.replace(new RegExp(r.pre + '\\b(default)\\b(' + r.s + '*:(?!=))([^\\r\\n]+?)' + r.suf, 'gim'), function(_, PRE, CFS, COLON, PARAMS)
      {
        return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + operators(COLON) + statements(PARAMS));
      });
      return innerHTML;
    }
    /** Searches for hotstrings, formats them and replaces them with placeholders. */
    function hotstrings(innerHTML)
    {
      return innerHTML.replace(new RegExp('^(' + r.s + '*):(.*?):(.*)::(.*?(?=' + r.s + '+' + r.sct + '(?!' + r.cont + ')|' + r.s + '*$)(?:(?:.*[\\n\\r]' + r.s + '*?(?:' + r.sct + '|' + r.cont + ').*?' + r.suf + '))*)', 'mg'), function(ASIS, PRE, OPTS, ABBR, REPL)
      {
        if (ASIS.indexOf(r.esc + '::') != -1)
          return hotstrings(escape_sequences(ASIS, r.esc + '(::|.)'));
        var out = wrap(':', 'opr', null) + (OPTS ? wrap(escape_sequences(OPTS), 'opt', null) : '') + wrap(':', 'opr', null) + wrap(escape_sequences(ABBR), 'hot', null) + wrap('::', 'opr', null);
        if (REPL != '')
        {
          if (resolve_placeholders(OPTS, 'esc').match(/x/i)) // execute option
            out += statements(REPL);
          else if (REPL.match(new RegExp(r.cont))) // continuation section
            out += string_with_cont_sections(REPL, true);
          else
            out += wrap(escape_sequences(REPL), 'str', null);
        }
        return PRE + ph('hs', out);
      });
    }
    /** Searches for hotkeys, formats them and replaces them with placeholders. */
    function hotkeys(innerHTML)
    {
      var key_names = '(?:L|R|M)Button|XButton[1-2]|Wheel(?:Down|Up|Left|Right)|CapsLock|Space|Tab|Enter|Return|Escape|Esc|Backspace|BS|ScrollLock|Delete|Del|Insert|Ins|Home|End|PgUp|PgDn|Up|Down|Left|Right|Numpad(?:[0-9]|Dot|Ins|End|Down|PgDn|Left|Clear|Right|Home|Up|PgUp|Del|Div|Mult|Add|Sub|Enter)|NumLock|F(?:2[0-4]|1[0-9]|[1-9])|LWin|RWin|(?:L|R)?(?:Control|Ctrl|Shift|Alt)|Browser_(?:Back|Forward|Refresh|Stop|Search|Favorites|Home)|Volume_(?:Mute|Down|Up)|Media_(?:Next|Prev|Stop|Play_Pause)|Launch_(?:Mail|Media|App1|App2)|AppsKey|PrintScreen|CtrlBreak|Pause|Break|Help|Sleep|SC[0-9a-f]{1,3}|VK[0-9a-f]{1,2}|(?:1[0-6]|[1-9])?Joy(?:3[0-2]|2[0-9]|1[0-9]|[1-9])|\\S|' + r.esc + r.sct_flag + '|&.+?;';
      return innerHTML.replace(new RegExp('^(' + r.s + '*)((?:(?:[#!^+*~$]|&lt;|&gt;)*(?:' + key_names + ')(?:' + r.s + '+up)?|~?(?:' + key_names + ')' + r.s + '+&amp;' + r.s + '+~?(?:' + key_names + ')(?:' + r.s + '+up)?))::(' + r.s + '*)(.*?)' + r.suf, 'gim'), function(ASIS, PRE, HK, SPACE, ACTION)
      {
        var out = wrap(escape_sequences(HK, r.esc + r.sct_flag), 'hot', null) + wrap('::', 'opr', null) + SPACE;
        if (ACTION != '')
        {
          if (ACTION == '{')
            out += operators(ACTION);
          else if (ACTION.match(/^(control|sleep)$/i))
            out += wrap(ACTION, 'hot', null);
          else if (ACTION.match(/^(return|pause)$/i))
            out += statements(ACTION);
          else if (ACTION.match(/^(AltTab|ShiftAltTab|AltTabMenu|AltTabAndMenu|AltTabMenuDismiss)$/i))
            out += wrap(ACTION, 'hot', null);
          else if (ACTION.match(new RegExp('^[#!^+]*(' + key_names + ')$', 'i')))
            out += wrap(ACTION, 'hot', null);
          else
            out += statements(ACTION);
        }
        return PRE + ph('hk', out);
      });
    }
    /** Searches for labels, formats them and replaces them with placeholders. */
    function labels(innerHTML)
    {
      return innerHTML.replace(new RegExp('^(' + r.s + '*)([^\\s' + r.delim + ']+?:)' + r.suf, 'mg'), function(_, PRE, LABEL)
      {
        return PRE + ph('lab', wrap(escape_sequences(LABEL), 'lab', null));
      });
    }
    /** Searches for legacy assignments, formats them and replaces them with placeholders. */
    function legacy_assignments(innerHTML)
    {
      return innerHTML.replace(new RegExp(r.pre + '(' + r.name_legacy + '?' + r.s + '*([+-]?=)' + r.s + '*)(.*?(?=' + r.s + '*' + r.sct + '(?!' + r.cont + ')|$)(?:(?:.*[\\n\\r]' + r.s + '*?(?:' + r.delim + '|' + r.sct + '(\\s*' + r.delim + ')?|' + r.cont + ').+?' + r.suf + '))*)', 'gim'), function(_, PRE, VAR_OP, OP, PARAMS)
      {
        var types = 'S', is_not_equal = (OP != '=');
        PARAMS = param_list_to_array(PARAMS, is_not_equal);
        if (is_not_equal) // -= or +=
          types = (PARAMS.length == 2 && PARAMS[1].match(/^\s*[smhd]\S*\s*$/i)) ? 'ES' : 'E';
        PARAMS = merge_excess_params(PARAMS, types);
        PARAMS = param_array_to_list(PARAMS, types);
        return PRE + expressions(VAR_OP) + ph('assign', PARAMS);
      });
    }
    /** Searches for strings, formats them and replaces them with placeholders. */
    function strings(innerHTML, prevent_escape, multiline, reverse)
    {
      innerHTML = innerHTML.replace(new RegExp('((' + (reverse ? '^|"' : '"') + ')' + (multiline ? '[\\s\\S]' : '.') + '*?(' + (reverse ? '$|"' : '"') + '))+', 'g'), function(STRING)
      {
        return ph('str', process_string(STRING, prevent_escape));
      });
      // unterminated strings: v1 allows v := "(...") sections
      innerHTML = innerHTML.replace(new RegExp('".*?(?=' + r.cont + ')', 'g'), function(STRING)
      {
        return ph('str', process_string(STRING, prevent_escape, true));
      });
      return innerHTML;

      function process_string(string, prevent_escape, ignore_cont_sections)
      {
        string = escape_sequences(string, prevent_escape ? '(?!^)""(?!$)' : r.esc + '""|(?!^)""(?!$)|' + r.esc + '.');
        if (ignore_cont_sections)
          return wrap(string, 'str', null);
        var out = '', lastIndex = 0, m;
        var regex = /<(cont\d+)><\/\1>/g;
        while (m = regex.exec(string))
        {
          out += wrap(string.slice(lastIndex, m.index), 'str', null)
          out += continuation_sections(els[m[1]].raw, '', true);
          lastIndex = regex.lastIndex;
        }
        out += wrap(string.slice(lastIndex), 'str', null);
        return out;
      }
    }
    /** Searches for numeric values, formats them and replaces them with placeholders. */
    function numeric_values(innerHTML)
    {
      return innerHTML.replace(new RegExp('(^|[^' + r.char + '])(' + r.num + ')(?![' + r.char + '])', 'gm'), function(_, PRE, NUMBER)
      {
        return PRE + ph('num', wrap(NUMBER, 'num', null));
      });
    }
    /** Searches for methods, formats them and replaces them with placeholders. */
    function methods(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\.(' + r.name_prop + '?)(?=\\()', 'g'), function(_, METHOD)
      {
        return ph('met', wrap('.', 'opr', null) + wrap(METHOD, 'met', null));
      });
    }
    /** Searches for properties, formats them and replaces them with placeholders. */
    function properties(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\.(' + r.name_prop + '?)\\b', 'g'), function(_, PROPERTY)
      {
        return ph('prp', wrap('.', 'opr', null) + wrap(PROPERTY, 'prp', null));
      });
    }
    /** Searches for built-in variables, formats them and replaces them with placeholders. */
    function built_in_vars(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\b(' + syn[1].join('|') + ')\\b', 'gi'), function(_, BIV)
      {
        return ph('biv', wrap(BIV, 'biv', 1));
      });
    }
    /** Searches for functions, formats them and replaces them with placeholders. */
    function functions(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\b(' + r.name + ')(?=\\()', 'g'), function(_, NAME)
      {
        return ph('fun', wrap(NAME, 'fun', syn[2].dict[NAME.toLowerCase()] ? 2 : null));
      });
    }
    /** Searches for operators, formats them and replaces them with placeholders. */
    function operators(innerHTML)
    {
      return innerHTML.replace(new RegExp('(</)|' + r.op, 'gi'), function(ASIS, TAG, SYM, WORD)
      {
        if (TAG) // Prevents breaking end tags such as </span> due to /
          return ASIS;
        else if (SYM) // symbol operators
          return ph('opr', wrap(SYM, 'opr', null));
        else if (WORD) // word operators
          return ph('opr', wrap(WORD, WORD.match(/new/i) ? 'dec' : 'opr', 4));
      });
    }
    /** Searches for comments, formats them and replaces them with placeholders. */
    function comments(innerHTML)
    {
      innerHTML = comments_multi(innerHTML);
      innerHTML = comments_single(innerHTML);
      return innerHTML;
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
      innerHTML = methods(innerHTML);
      innerHTML = numeric_values(innerHTML);
      innerHTML = properties(innerHTML);
      innerHTML = built_in_vars(innerHTML);
      innerHTML = functions(innerHTML);
      innerHTML = operators(innerHTML);
      return innerHTML;
    }
    /** Converts a comma-separated list of parameters to an array.
     * @param {string} params - A comma-separated list of parameters.
     * @param {boolean} all_exprs - If true, treat each parameter as expression.
     * @returns {array} An array of parameters.
     */
    function param_list_to_array(params, all_exprs)
    {
      params = escape_sequences(params);
      var arr = [], index_start, mark = 0;
      while (mark <= params.length)
      {
        index_start = mark;
        while (params[mark] == ' ' || params[mark] == '\t') mark++;
        if (params[mark] == r.deref && (params[mark + 1] == ' ' || params[mark + 1] == '\t') || all_exprs)
          mark = find_next_delimiter(params, r.delim, index_start);
        else while (params[mark] && params[mark] !== r.delim) mark++;
        arr.push(params.substring(index_start, mark));
        mark++;
      }
      return arr;

      /** https://github.com/AutoHotkey/AutoHotkey/blob/v1.1/source/util.cpp#L2743 */
      function find_next_delimiter(string, delimiter, index_start)
      {
        var in_quotes = false, open_parens = 0;
        for (var mark = index_start; mark < string.length; ++mark)
        {
          if (string[mark] == delimiter && !in_quotes && open_parens <= 0)
            return mark;
          switch (string[mark])
          {
            case '"': in_quotes = !in_quotes; break;
            case '(': case '[': case '{': if (!in_quotes) ++open_parens; break;
            case ')': case ']': case '}': if (!in_quotes) --open_parens; break;
          }
        }
        return mark;
      }
    }
    /** Merges excess parameters with the last valid parameter.
     * @param {array} params - An array of parameters.
     * @param {string} types - A string of parameter types.
     * @returns {array} An array of parameters correctly sized.
     */
    function merge_excess_params(params, types)
    {
      if (params.length > types.length)
        params.push(params.splice(types.length - 1).join(r.delim));
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
        var forced_exp = param.match(new RegExp('^' + r.s + '*' + r.deref + r.s));
        var out = '', lastIndex = 0, m, part;
        var regex = new RegExp(r.s + '*<((?:sct|mct|em)\\d+)><\\/\\1>', 'g');
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
      return params.join(wrap(r.delim, 'opr', null));

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
          a.href = docs_path + index_data[syn[LinkOrTypeNum].dict[KeywordOrString.toLowerCase()]][1];
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
     * @param {string} raw - The unformatted syntax.
     * @returns {string} The placeholder, e.g. `<str12></str12>`.
     */
    function ph(abbr, repl, raw)
    {
      var tagName = abbr + els.order.length;
      els[tagName] = {repl: repl, raw: raw};
      els.order.push(tagName);
      return '<' + tagName + '></' + tagName + '>';
    }
    /**
     * Resolve placeholders.
     * @param {string} string - The string containing placeholders.
     * @param {string} phs - A pipe-delimited list of placeholders to resolve (regex).
     * @param {boolean} to_original - Resolve to original content.
     * @returns {string} The string containing resolved placeholders.
     */
    function resolve_placeholders(string, phs, to_original)
    {
      return string.replace(new RegExp('<((?:' + phs + ')\\d+)></\\1>', 'gi'), function(_, TAG)
      {
        return to_original ? els[TAG].raw : els[TAG].repl;
      });
    }
    /**
     * Temporarily exclude syntax parts to facilitate syntax detection.
     * @param {object} temp - An object with order property.
     * @param {string} syntax - The syntax to check, e.g. `abc "," xyz`.
     * @param {RegExp} regex - The syntax part(s) to exclude temporarily, e.g. `/".*?"/g`.
     * @returns {string} The modified syntax, e.g. `abc <temp1> xyz`.
     */
    function temp_exclude(temp, syntax, regex)
    {
      var syntax_old;
      while (syntax != syntax_old) {
        syntax_old = syntax;
        syntax = syntax.replace(regex, function(c) {
          var name = 'temp' + temp.order.length;
          temp[name] = c; temp.order.push(name);
          return '<' + name + '>';
        });
      }
      return syntax;
    }
    /**
     * Restore syntax parts excluded via temp_exclude function.
     * @param {object} temp - An object with order property.
     * @param {string} modified_syntax - The modified syntax, e.g. `abc <temp1> xyz`.
     * @returns {string} The restored syntax, e.g. `abc "," xyz`.
     */
    function temp_restore(temp, modified_syntax)
    {
      for (var i = temp.order.length - 1; i >= 0; i--)
      {
        var name = temp.order[i];
        modified_syntax = modified_syntax.replace('<' + name + '>', temp[name]);
      }
      return modified_syntax;
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
      if (m = param.match(new RegExp('^(' + r.s + '*(?:\\+|-)?' + r.s + '*)\\b(' + r.num + ')\\b(' + r.s + '*)$'))) // number
        return operators(m[1]) + wrap(m[2], 'num', null) + m[3];
      if (param.match(new RegExp(r.cont))) // continuation section
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
        out += continuation_sections(els[m[1]].raw, is_literal ? '%' : '', false, true);
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
      var regex = new RegExp(r.deref + '([^' + r.delim + '\\s]+?)' + r.deref, 'g');
      while (m = regex.exec(string))
      {
        out += wrap(string.slice(lastIndex, m.index), 'str', null) + wrap(r.deref, 'opr', null);
        out += expressions(m[1]);
        out += wrap(r.deref, 'opr', null);
        lastIndex = regex.lastIndex;
      }
      out += wrap(string.slice(lastIndex), 'str', null);
      return out;
    }
    /**
     * Search for parser directives such as #CommentFlag affecting syntax highlighting.
     * @param {string} code - The script code potentially containing parser directives.
     * @returns {array} An array of directive matches with their effective parser settings.
     */
    function get_parser_directives(code) {
      s = create_settings(); r = build_regex_fragments(s);
      var re = new RegExp(r.pre + '(#(' + s.list + '))\\b(' + r.delim + '?(?:' + r.s + ')*)(.*?)$', 'gim');
      var dirs = [{ match: '', settings: clone_settings(s), pos: 0 }];
      var m;
      while (m = re.exec(code)) {
        var mm = (new RegExp('.*?' + r.suf)).exec(comments_single(m[5]));
        if (mm[0]) s[m[3].toLowerCase()] = mm[0];
        dirs.push({ match: m[0], settings: clone_settings(s), pos: m.index });
      }
      return dirs;
      function clone_settings(s) { return JSON.parse(JSON.stringify(s)); }
    }
    /**
     * Parses syntax by parser directives.
     * @param {string} code - The script code to be parsed.
     * @param {function} callback - A function searching for and processing syntax elements.
     * @returns {string} The fully processed script code.
     */
    function parse_syntax(code, callback) {
      var new_code = '';
      var dirs = get_parser_directives(code);
      for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i], next = dirs[i + 1];
        var start = dir.pos + dir.match.length;
        var end = next ? (next.pos + next.match.length) : code.length;
        new_code += callback(code.slice(start, end), dir.settings);
      }
      return new_code;
    }
    /**
     * Escapes regex characters, such as `*` to `\*`.
     * @param {string} string - A string containing one or more unescaped regex characters.
     * @returns {string} The string, escaped.
     */
    function escape_regex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /**
     * The default parser settings.
     * @returns {object} An object containing the default parser characters.
     */
    function create_settings() {
      var names = ['commentflag', 'delimiter', 'derefchar', 'escapechar'];
      var defaults = [';', ',', '%', '`'];
      var settings = {list: names.join('|')};
      for (var i = 0; i < names.length; i++) { settings[names[i]] = defaults[i]; }
      return settings;
    }
    /**
     * Builds reusable regex fragments based on the current parser settings.
     * @param {object} s - The active parser settings.
     * @returns {object} An object containing the regex fragments.
     */
    function build_regex_fragments(s) {
      var r = {};
      r.delim = escape_regex(s.delimiter);
      r.deref = escape_regex(s.derefchar);
      r.esc = escape_regex(s.escapechar);
      r.sct_flag = escape_regex(s.commentflag);
      r.op = '(&(?:amp|lt|gt);|[\\-=' + r.delim + ':!?.*/^+|~' + r.deref + '(){}\\[\\]])|\\b(' + syn[4].join('|') + ')\\b'; // operators
      r.op_assign = '(?:&lt;&lt;|<<|&gt;&gt;|>>|\\/\\/|\\^|&amp;|&|\\||\\.|\\/|\\*|-|\\+|:|)='; // assignment operators
      r.num = '(?:0(?:x|X)[0-9a-fA-F]*)|(?:(?:[0-9]+\\.?[0-9]*)|(?:\\.[0-9]+))(?:(?:e|E)(?:\\+|-)?[0-9]+)?'; // number
      r.char_base = 'A-Za-z0-9_\\u00A0-\\uFFFF'; // character
      r.char = r.char_base + '\\#@\\$';
      r.name = '[' + r.char + ']+'; // vars, funcs, classes etc.
      r.name_legacy = '[' + r.char + r.deref + ']+'; // legacy vars, pseudo-arrays etc.
      r.name_prop = '[' + r.char_base + ']+'; // props and methods
      r.sct = '<(?:em|sct)\\d+></(?:em|sct)\\d+>'; // single-line comment
      r.mct = '<mct\\d+></mct\\d+>'; // multi-line comment
      r.cont = '<cont\\d+></cont\\d+>'; // continuation section
      r.s = '(?: |\\t|&nbsp;)'; // space
      r.pre = '(^' + r.s + '*(?:[{}]' + r.s + '*)*)'; // prefix
      r.suf = '(?=' + r.s + '*(?:$|' + r.sct + '))'; // suffix
      return r;
    }
  };
}
