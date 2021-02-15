; HTML Entities Encoding
; https://www.autohotkey.com
; Similar to the Transform's HTML sub-command, this function converts a
; string into its HTML equivalent by translating characters whose ASCII
; values are above 127 to their HTML names (e.g. £ becomes &pound;). In
; addition, the four characters "&<> are translated to &quot;&amp;&lt;&gt;.
; Finally, each linefeed (`n) is translated to <br>`n (i.e. <br> followed
; by a linefeed).

; For Unicode executables: In addition of the functionality above, Flags
; can be zero or a combination (sum) of the following values. If omitted,
; it defaults to 1.

; - 1: Converts certain characters to named expressions. e.g. € is
;      converted to &euro;
; - 2: Converts certain characters to numbered expressions. e.g. € is
;      converted to &#8364;

; Only non-ASCII characters are affected. If Flags is the number 3,
; numbered expressions are used only where a named expression is not
; available. The following characters are always converted: <>"& and `n
; (line feed).

EncodeHTML(String, Flags := 1)
{
    SetBatchLines, -1
    static TRANS_HTML_NAMED := 1
    static TRANS_HTML_NUMBERED := 2
    static ansi := ["euro", "#129", "sbquo", "fnof", "bdquo", "hellip", "dagger", "Dagger", "circ", "permil", "Scaron", "lsaquo", "OElig", "#141", "#381", "#143", "#144", "lsquo", "rsquo", "ldquo", "rdquo", "bull", "ndash", "mdash", "tilde", "trade", "scaron", "rsaquo", "oelig", "#157", "#382", "Yuml", "nbsp", "iexcl", "cent", "pound", "curren", "yen", "brvbar", "sect", "uml", "copy", "ordf", "laquo", "not", "shy", "reg", "macr", "deg", "plusmn", "sup2", "sup3", "acute", "micro", "para", "middot", "cedil", "sup1", "ordm", "raquo", "frac14", "frac12", "frac34", "iquest", "Agrave", "Aacute", "Acirc", "Atilde", "Auml", "Aring", "AElig", "Ccedil", "Egrave", "Eacute", "Ecirc", "Euml", "Igrave", "Iacute", "Icirc", "Iuml", "ETH", "Ntilde", "Ograve", "Oacute", "Ocirc", "Otilde", "Ouml", "times", "Oslash", "Ugrave", "Uacute", "Ucirc", "Uuml", "Yacute", "THORN", "szlig", "agrave", "aacute", "acirc", "atilde", "auml", "aring", "aelig", "ccedil", "egrave", "eacute", "ecirc", "euml", "igrave", "iacute", "icirc", "iuml", "eth", "ntilde", "ograve", "oacute", "ocirc", "otilde", "ouml", "divide", "oslash", "ugrave", "uacute", "ucirc", "uuml", "yacute", "thorn", "yuml"]
    static unicode := {0x20AC:1, 0x201A:3, 0x0192:4, 0x201E:5, 0x2026:6, 0x2020:7, 0x2021:8, 0x02C6:9, 0x2030:10, 0x0160:11, 0x2039:12, 0x0152:13, 0x2018:18, 0x2019:19, 0x201C:20, 0x201D:21, 0x2022:22, 0x2013:23, 0x2014:24, 0x02DC:25, 0x2122:26, 0x0161:27, 0x203A:28, 0x0153:29, 0x0178:32}

    if !A_IsUnicode && !(Flags & TRANS_HTML_NAMED)
        throw Exception("Parameter #2 must be omitted or 1 in the ANSI version.", -1)
    
    out  := ""
    for i, char in StrSplit(String)
    {
        code := Asc(char)
        switch code
        {
            case 10: out .= "<br>`n"
            case 34: out .= "&quot;"
            case 38: out .= "&amp;"
            case 60: out .= "&lt;"
            case 62: out .= "&gt;"
            default:
            if (code >= 160 && code <= 255)
            {
                if (Flags & TRANS_HTML_NAMED)
                    out .= "&" ansi[code-127] ";"
                else if (Flags & TRANS_HTML_NUMBERED)
                    out .= "&#" code ";"
                else
                    out .= char
            }
            else if (A_IsUnicode && code > 255)
            {
                if (Flags & TRANS_HTML_NAMED && unicode[code])
                    out .= "&" ansi[unicode[code]] ";"
                else if (Flags & TRANS_HTML_NUMBERED)
                    out .= "&#" code ";"
                else
                    out .= char
            }
            else
            {
                if (code >= 128 && code <= 159)
                    out .= "&" ansi[code-127] ";"
                else
                    out .= char
            }
        }
    }
    return out
}