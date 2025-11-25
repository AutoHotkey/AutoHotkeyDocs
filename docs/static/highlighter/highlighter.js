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
   * - 6 = built-in class
   * - 7 = built-in method/property
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
    var syn = sort_syntax_by_type(index_data);
    var r_op_assign = '(?:&lt;&lt;|<<|&gt;&gt;|>>|\\/\\/|\\^|&amp;|&|\\||\\.|\\/|\\*|-|\\+|:)='; // assignment operators
    var r_num = '(?:0(?:x|X)[0-9a-fA-F]*)|(?:(?:[0-9]+\\.?[0-9]*)|(?:\\.[0-9]+))(?:(?:e|E)(?:\\+|-)?[0-9]+)?'; // number
    var r_char = 'A-Za-z0-9_\\u00A0-\\uFFFF'; // allowed chars
    var r_com = '<(?:em|sct)\\d+></(?:em|sct)\\d+>'; // comment
    var r_cont = '<cont\\d+></cont\\d+>'; // continuation section
    var r_s = '(?: |\\t|&nbsp;)'; // space
    var r_pre = '(^' + r_s + '*(?:[{}]' + r_s + '*)*)'; // prefix
    var r_suf = '(?=' + r_s + '*(?:$|' + r_com + '))'; // suffix
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
      // Search for syntax elements, format them and replace them with placeholders:
      try
      {
        innerHTML = continuation_sections(innerHTML);
        innerHTML = comments(innerHTML);
        innerHTML = hotkeys(innerHTML);
        innerHTML = escape_sequences(innerHTML);
        innerHTML = hotstrings(innerHTML);
        innerHTML = declarations(innerHTML);
        innerHTML = directives(innerHTML);
        innerHTML = control_flow_statements(innerHTML);
        innerHTML = labels(innerHTML);
        innerHTML = expressions(innerHTML);
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
    /** Searches for multi-line comments, formats them and replaces them with placeholders. */
    function comments_multi(innerHTML)
    {
      return innerHTML.replace(new RegExp('(^' + r_s + '*\\/\\*[\\s\\S]*?(^\\s*\\*\\/|\\*\\/\\s*$|$(?![\\r\\n])))', 'gm'), function(COMMENT)
      {
        COMMENT = resolve_placeholders(COMMENT, 'cont', true);
        return ph('mct', wrap(COMMENT, 'cmt', null));
      });
    }
    /** Searches for single-line comments, formats them and replaces them with placeholders. */
    function comments_single(innerHTML)
    {
      return innerHTML.replace(new RegExp('(' + r_s + '|^)(;.*?(\\r?\\n' + r_s + '*;.*?)*)(?=$|' + r_cont + ')', 'gm'), function(_, PRE, COMMENT)
      {
        return PRE + ph('sct', wrap(COMMENT, 'cmt', null), COMMENT);
      });
    }
    /** Searches for escape sequences, formats them and replaces them with placeholders. */
    function escape_sequences(innerHTML, regex)
    {
      return innerHTML.replace(new RegExp(regex || '`.', 'gm'), function(SEQUENCE)
      {
        return ph('esc', wrap(SEQUENCE, 'esc', null), SEQUENCE);
      });
    }
    /** Searches for continuation sections, formats them and replaces them with placeholders. */
    function continuation_sections(innerHTML, forced_opts, is_literal, has_var_refs)
    {
      return innerHTML.replace(new RegExp('([\\r\\n]*?^' + r_s + '*\\()(.*)([\\s\\S]*?)(^' + r_s + '*\\))', 'gm'), function(ASIS, OPEN, OPTS, CONT, CLOSE)
      {
        OPTS = comments_single(OPTS);
        var opts = OPTS + (forced_opts ? ' ' + forced_opts : '');
        opts = opts.replace(new RegExp('(^|' + r_s + '+)(join\\S*|(l|r)trim0?|' + r_com + ')|', 'gi'), '');
        if (opts.indexOf('(') != -1 || opts.indexOf(')') != -1)
          return OPEN + OPTS + continuation_sections(CONT + CLOSE);
        var allow_comments = (opts.indexOf('c') != -1 || opts.indexOf('C') != -1);
        var allow_escape_sequences = (opts.indexOf('`') == -1);
        if (allow_comments)
          CONT = comments_single(CONT);
        if (allow_escape_sequences)
          CONT = escape_sequences(CONT);
        if (is_literal)
          CONT = (has_var_refs) ? string_with_var_refs(CONT) : wrap(CONT, 'str', null);
        else
          CONT = expressions(strings(CONT, true, true));
        return ph('cont', wrap(OPEN, 'opr', null) + wrap(OPTS, 'opt', null) + CONT + wrap(CLOSE, 'opr', null), ASIS);
      });
    }
    /** Searches for declarations, formats them and replaces them with placeholders. */
    function declarations(innerHTML)
    {
      innerHTML = innerHTML.replace(new RegExp(r_pre + '\\b(' + syn[5].join('|') + ')(?:(' + r_s + '+)([' + r_char + ']+)(\\()?|' + r_suf + ')', 'gim'), function(_, PRE, DEC, SPACE, NAME, OPEN_PAREN)
      {
        var out = PRE + ph('dec', wrap(DEC, 'dec', 5));
        if (DEC.toLowerCase() == 'static' && OPEN_PAREN) // static function definitions
          out += SPACE + ph('fun', wrap(NAME, 'fun', null)) + OPEN_PAREN;
        else if (NAME)
          out += SPACE + expressions(NAME) + (OPEN_PAREN || '');
        return out;
      });
      // class declarations:
      innerHTML = innerHTML.replace(new RegExp(r_pre + '\\b(class)(?:$|(' + r_s + '+)([' + r_char + ']+)(?:(' + r_s + '+)(extends)(' + r_s + '+)([' + r_char + ']+))?(?=(?=' + r_s + '*\\{)|' + r_suf + '))', 'gim'), function(_, PRE, CLASS, SPACE1, NAME1, SPACE2, EXTENDS, SPACE3, NAME2)
      {
        var link = index_data[syn[5].dict['class']][1];
        var repl = wrap(CLASS, 'dec', link);
        if (EXTENDS)
          repl += SPACE1 + expressions(NAME1) + SPACE2 + wrap(EXTENDS, 'dec', link) + SPACE3 + expressions(NAME2);
        else if (NAME1)
          repl += SPACE1 + expressions(NAME1);
        return PRE + ph('dec', repl);
      });
      return innerHTML;
    }
    /** Searches for directives, formats them and replaces them with placeholders. */
    function directives(innerHTML)
    {
      return innerHTML.replace(new RegExp(r_pre + '(' + syn[0].join('|') + ')\\b($|' + r_s + '|(?=' + r_cont + '))(.*?)' + r_suf, 'gim'), function(_, PRE, DIR, SEP, PARAMS)
      {
        var dir = DIR.toLowerCase();
        var types = index_data[syn[0].dict[dir]][3]; // parameter types
        PARAMS = param_list_to_array(PARAMS);
        PARAMS = merge_excess_params(PARAMS, types);
        PARAMS = param_array_to_list(PARAMS, types);
        return PRE + ph('dir', wrap(DIR, 'dir', 0) + SEP + PARAMS);
      });
    }
    /** Searches for control flow statements, formats them and replaces them with placeholders. */
    function control_flow_statements(innerHTML)
    {
      innerHTML = innerHTML.replace(new RegExp(r_pre + '\\b(' + syn[3].join('|') + ')\\b(\\(|\\{|$|' + r_s + '(?!' + r_s + '*' + r_op_assign + '))(.*?(?=' + r_s + '*\\{?' + r_s + '*(?:' + r_s + '+' + r_com + '(?!' + r_cont + ')|$))(?:(?:.*[\\n\\r]' + r_s + '*?(?:,|' + r_com + '(?:\\s*,)?|' + r_cont + ').+?' + r_suf + '))*)', 'gim'), function(ASIS, PRE, CFS, SEP, PARAMS)
      {
        var cfs = CFS.toLowerCase();
        var types = index_data[syn[3].dict[cfs]][3]; // parameter types
        if (!types)
          return PRE + ph('cfs', wrap(CFS, 'cfs', 3)) + SEP + statements(PARAMS);
        // loop statements:
        if (cfs == 'loop')
        {
          var link = 3;
          if (m = PARAMS.match(new RegExp('^' + r_s + '*(files|parse|read|reg)(?=' + r_s + '|,)', 'i'))) // specialized loops
          {
            CFS = CFS + SEP + m[0];
            link = index_data[syn[3].dict['loop ' + m[1].toLowerCase()]][1];
            SEP = '';
            PARAMS = PARAMS.substr(m[0].length);
          }
          return PRE + ph('cfs', wrap(CFS, 'cfs', link)) + SEP + PARAMS;
        }
        // switch's case keyword:
        if (cfs == 'case')
        {
          var SEP_PARAMS = SEP + PARAMS;
          if (SEP_PARAMS == '')
            return PRE + ph('cfs', wrap(CFS, 'cfs', 3));
          SEP_PARAMS = strings(SEP_PARAMS);
          // Temporarily exclude colon-using elements:
          var temp = {order: []};
          SEP_PARAMS = temp_exclude(temp, SEP_PARAMS, /\([^()]*\)|\[[^[]]*\]|\{[^{}]*\}/g);
          SEP_PARAMS = temp_exclude(temp, SEP_PARAMS, /:=/g);
          SEP_PARAMS = temp_exclude(temp, SEP_PARAMS, /\?.*?:/g);
          // Separate case value from statement:
          var i = SEP_PARAMS.indexOf(':');
          if (i == -1)
            return ASIS;
          var parts = [SEP_PARAMS.slice(0, i), SEP_PARAMS.slice(i + 1)];
          if (parts[0].trim() == '')
            return ASIS;
          // Restore excluded elements:
          for (n in parts)
            parts[n] = temp_restore(temp, parts[n]);
          parts[0] = expressions(parts[0]);
          parts[1] = statements(parts[1]);
          return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + parts.join(wrap(':', 'opr', null)));
        }
        if (SEP != '(' && (cfs == 'break' || cfs == 'continue' || cfs == 'goto'))
        {
          PARAMS = param_list_to_array(PARAMS);
          PARAMS = merge_excess_params(PARAMS, types);
          PARAMS = param_array_to_list(PARAMS, types);
        }
        else
          PARAMS = expressions(PARAMS);
        return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + operators(SEP) + PARAMS);
      });
      // switch's default keyword:
      innerHTML = innerHTML.replace(new RegExp(r_pre + '\\b(default)\\b(' + r_s + '*:(?!=))([^\\r\\n]*?)' + r_suf, 'gim'), function(_, PRE, CFS, COLON, PARAMS)
      {
        return PRE + ph('cfs', wrap(CFS, 'cfs', 3) + operators(COLON) + statements(PARAMS));
      });
      return innerHTML;
    }
    /** Searches for hotstrings, formats them and replaces them with placeholders. */
    function hotstrings(innerHTML)
    {
      return innerHTML.replace(new RegExp('^(' + r_s + '*):(.*?):(.*?)::(.*?(?=' + r_s + '+' + r_com + '(?!' + r_cont + ')|' + r_s + '*$)(?:(?:.*[\\n\\r]' + r_s + '*?(?:' + r_com + '|' + r_cont + ').*?' + r_suf + '))*)', 'mg'), function(_, PRE, OPTS, ABBR, REPL)
      {
        var out = wrap(':', 'opr', null) + (OPTS ? wrap(OPTS, 'opt', null) : '') + wrap(':', 'opr', null) + wrap(ABBR, 'hot', null) + wrap('::', 'opr', null);
        if (REPL != '')
        {
          if (REPL.match(new RegExp('^' + r_s + '*\\{$', 'm')))
            out += operators(REPL);
          else if (resolve_placeholders(OPTS, 'esc', true).match(/x/i)) // execute option
            out += statements(REPL);
          else if (REPL.match(new RegExp(r_cont))) // continuation section
            out += string_with_cont_sections(REPL, true);
          else
            out += wrap(REPL, 'str', null);
        }
        return PRE + ph('hs', out);
      });
    }
    /** Searches for hotkeys, formats them and replaces them with placeholders. */
    function hotkeys(innerHTML)
    {
      var key_names = '(?:L|R|M)Button|XButton[1-2]|Wheel(?:Down|Up|Left|Right)|CapsLock|Space|Tab|Enter|Escape|Esc|Backspace|BS|ScrollLock|Delete|Del|Insert|Ins|Home|End|PgUp|PgDn|Up|Down|Left|Right|Numpad(?:[0-9]|Dot|Ins|End|Down|PgDn|Left|Clear|Right|Home|Up|PgUp|Del|Div|Mult|Add|Sub|Enter)|NumLock|F(?:2[0-4]|1[0-9]|[1-9])|LWin|RWin|(?:L|R)?(?:Control|Ctrl|Shift|Alt)|Browser_(?:Back|Forward|Refresh|Stop|Search|Favorites|Home)|Volume_(?:Mute|Down|Up)|Media_(?:Next|Prev|Stop|Play_Pause)|Launch_(?:Mail|Media|App1|App2)|AppsKey|PrintScreen|CtrlBreak|Pause|Help|Sleep|SC[0-9a-f]{1,3}|VK[0-9a-f]{1,2}|(?:1[0-6]|[1-9])?Joy(?:3[0-2]|2[0-9]|1[0-9]|[1-9])|\\S|`;|&.+?;';
      return innerHTML.replace(new RegExp('^(' + r_s + '*)((?:(?:[#!^+*~$]|&lt;|&gt;)*(?:' + key_names + ')(?:' + r_s + '+up)?|~?(?:' + key_names + ')' + r_s + '+&amp;' + r_s + '+~?(?:' + key_names + ')(?:' + r_s + '+up)?))::(' + r_s + '*)(.*?)' + r_suf, 'gim'), function(ASIS, PRE, HK, SPACE, ACTION)
      {
        var out = wrap(escape_sequences(HK, '`;'), 'hot', null) + wrap('::', 'opr', null) + SPACE;
        if (ACTION != '')
        {
          if (ACTION == '{')
            out += operators(ACTION);
          else if (ACTION == '`{')
            out += wrap(escape_sequences(ACTION, '`\\{'), 'hot', null);
          else if (ACTION.match(/^(control|sleep)$/i))
            out += wrap(ACTION, 'hot', null);
          else if (ACTION.match(/^(pause)$/i))
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
      return innerHTML.replace(new RegExp('^(' + r_s + '*)([' + r_char + ']+?:)' + r_suf, 'gim'), function(_, PRE, LABEL)
      {
        return PRE + ph('lab', wrap(LABEL, 'lab', null));
      });
    }
    /** Searches for strings, formats them and replaces them with placeholders. */
    function strings(innerHTML, prevent_escape, multiline)
    {
      return innerHTML.replace(new RegExp('(("|\')' + (multiline ? '[\\s\\S]' : '.') + '*?\\2)+', 'gm'), function(STRING)
      {
        var out = '', lastIndex = 0, m;
        if (!prevent_escape)
          STRING = escape_sequences(STRING);
        var regex = /<(cont\d+)><\/\1>/g;
        while (m = regex.exec(STRING))
        {
          out += wrap(STRING.slice(lastIndex, m.index), 'str', null)
          out += continuation_sections(els[m[1]].raw, '', true);
          lastIndex = regex.lastIndex;
        }
        out += wrap(STRING.slice(lastIndex), 'str', null);
        return ph('str', out);
      });
    }
    /** Searches for numeric values, formats them and replaces them with placeholders. */
    function numeric_values(innerHTML)
    {
      return innerHTML.replace(new RegExp('(^|[^' + r_char + '])(' + r_num + ')(?![' + r_char + '])', 'gm'), function(_, PRE, NUMBER)
      {
        return PRE + ph('num', wrap(NUMBER, 'num', null));
      });
    }
    /** Searches for methods, formats them and replaces them with placeholders. */
    function methods(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\.([' + r_char + ']+?)(?=\\()', 'g'), function(_, METHOD)
      {
        return ph('met', wrap('.', 'opr', null) + wrap(METHOD, 'met', null));
      });
    }
    /** Searches for properties, formats them and replaces them with placeholders. */
    function properties(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\.([' + r_char + ']+?)\\b', 'g'), function(_, PROPERTY)
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
    /** Searches for built-in classes, formats them and replaces them with placeholders. */
    function built_in_classes(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\b(' + syn[6].join('|') + ')\\b', 'gi'), function(_, CLS)
      {
        return ph('cls', wrap(CLS, 'cls', 6));
      });
    }
    /** Searches for built-in functions, formats them and replaces them with placeholders. */
    function built_in_functions(innerHTML)
    {
      return innerHTML.replace(new RegExp('\\b(' + syn[2].join('|') + ')\\b(?=$|\\(|' + r_s + '(?!' + r_s + '*' + r_op_assign + ')|' + r_cont + ')', 'gim'), function(_, NAME)
      {
        return ph('fun', wrap(NAME, 'fun', 2));
      });
    }
    /** Searches for custom functions, formats them and replaces them with placeholders. */
    function custom_functions(innerHTML)
    {
      var reserved_words = [].concat(syn[3], syn[4], syn[5]).join('|');
      return innerHTML.replace(new RegExp('\\b([' + r_char + ']+)(?=\\()', 'g'), function(NAME)
      {
        if (NAME.match(new RegExp('^(' + reserved_words + ')$', 'i')))
          return statements(NAME);
        return ph('fun', wrap(NAME, 'fun', null));
      });
    }
    /** Searches for operators, formats them and replaces them with placeholders. */
    function operators(innerHTML)
    {
      // forward slash operators without breaking end tags:
      innerHTML = innerHTML.replace(new RegExp('(^|[^<])(//?)', 'g'), function(_, PRE, OPR)
      {
        return PRE + ph('opr', wrap(OPR, 'opr', null));
      });
      // other operators:
      innerHTML = innerHTML.replace(new RegExp('[\\-=,:!?.*^+|~%(){}\\[\\]]|&(amp|lt|gt);', 'gi'), function(OPR)
      {
        return ph('opr', wrap(OPR, 'opr', null));
      });
      // named operators:
      innerHTML = innerHTML.replace(new RegExp('\\b(' + syn[4].join('|') + ')\\b', 'gi'), function(OPR)
      {
        return ph('opr', wrap(OPR, 'opr', 4));
      });
      return innerHTML;
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
      innerHTML = control_flow_statements(innerHTML);
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
      innerHTML = built_in_classes(innerHTML);
      innerHTML = built_in_functions(innerHTML);
      innerHTML = custom_functions(innerHTML);
      innerHTML = operators(innerHTML);
      return innerHTML;
    }
    /** Converts a comma-separated list of parameters to an array.
     * @param {string} params - A comma-separated list of parameters.
     * @returns {array} An array of parameters.
     */
    function param_list_to_array(params)
    {
      var arr = [], index_start, mark = 0;
      while (mark <= params.length)
      {
        index_start = mark;
        while (params[mark] == ' ' || params[mark] == '\t') mark++;
        while (params[mark] && params[mark] !== ',') mark++;
        arr.push(params.substring(index_start, mark));
        mark++;
      }
      return arr;
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
        var out = '', lastIndex = 0, m, part;
        var regex = new RegExp(r_s + '*<((?:sct|mct|em)\\d+)><\\/\\1>', 'g');
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
      return params.join(wrap(',', 'opr', null));

      function format_by_type(param_part)
      {
        if (param_type == 'E') // expression
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
      if (m = param.match(new RegExp('^(' + r_s + '*(?:\\+|-)?' + r_s + '*)\\b(' + r_num + ')\\b(' + r_s + '*)$'))) // number
        return operators(m[1]) + wrap(m[2], 'num', null) + m[3];
      if (param.match(new RegExp(r_cont))) // continuation section
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
        out += continuation_sections(els[m[1]].raw, '', true, !is_literal);
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
        out += wrap(string.slice(lastIndex, m.index), 'str', null) + wrap('%', 'opr', null);
        out += expressions(m[1]);
        out += wrap('%', 'opr', null);
        lastIndex = regex.lastIndex;
      }
      out += wrap(string.slice(lastIndex), 'str', null);
      return out;
    }
  };
}
