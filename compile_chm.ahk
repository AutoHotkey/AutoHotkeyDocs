#Requires AutoHotkey v2 ; prefer 32-bit

; Change this path if the loop below doesn't find your hhc.exe,
; or leave it as-is if hhc.exe is somewhere in %PATH%.
hhc := "hhc.exe"

; Try to find hhc.exe, since it's not in %PATH% by default.
for env_var in ["ProgramFiles", "ProgramFiles(x86)", "ProgramW6432"]
{
    Programs := EnvGet(env_var)
    if (Programs && FileExist(checking := Programs "\HTML Help Workshop\hhc.exe"))
    {
        hhc := checking
        break
    }
}

IndexJS := FileRead("docs\static\source\data_index.js")
Overwrite("Index.hhk", INDEX_CreateHHK(IndexJS))

; Uncomment the following lines to use the old sidebar:
; try FileDelete("docs\static\content.js")
; TocJS := FileRead("docs\static\source\data_toc.js")
; Overwrite("Table of Contents.hhc", TOC_CreateHHC(TocJS))
; IniWrite("Table of Contents.hhc", "Project.hhp", "OPTIONS", "Contents file")
; IniWrite("AutoHotkey v2 Help,Table of Contents.hhc,Index.hhk,docs\index.htm,docs\index.htm,,,,,0x73520,,0x10200e,[200,0,1080,700],0,,,,0,,0", "Project.hhp", "WINDOWS", "Contents")

; Compile AutoHotkey.chm.
RunWait(hhc ' "' A_ScriptDir '\Project.hhp"')

Overwrite(File, Text)
{
    FileOpen(File, "w").Write(Text)
}

TOC_CreateHHC(data)
{
    sc := ComObject("ScriptControl")
    sc.Language := "JScript"
    sc.ExecuteStatement(data)
    content := "
    (
    <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
    <html>
    <body>
    <object type="text/site properties">
    <param name="Window Styles" value="0x800025">
    <param name="ImageType" value="Folder">
    </object>
    )"
    content .= createList(sc.Eval("tocData"))
    content .= "`n</body>`n</html>`n"
    return content

    createList(items, list := "")
    {
        list .= "`n<ul>`n"
        for item in items
        {
            list .= '<li><object type="text/sitemap">'
            list .= '<param name="Name" value="' EncodeHTML(item.0) '">'
            if item.1
                list .= '<param name="Local" value="docs/' EncodeHTML(item.1) '">'
            list .= "</object>"
            if item.hasOwnProperty(2)
                list .= createList(item.2)
            list .= "`n"
        }
        list .= "</ul>"
        return list
    }
}

INDEX_CreateHHK(data)
{
    sc := ComObject("ScriptControl")
    sc.Language := "JScript"
    sc.ExecuteStatement(data)
    content := "
    (
    <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
    <html>
    <body>
    )"
    content .= "`n<ul>`n"
    for item in sc.Eval("indexData")
    {
        content .= '<li><object type="text/sitemap">'
        content .= '<param name="Name" value="' EncodeHTML(item.0) '">'
        content .= '<param name="Local" value="docs/' EncodeHTML(item.1) '">'
        content .= "</object>`n"
    }
    content .= "</ul>"
    content .= "`n</body>`n</html>`n"
    return content
}

; https://www.autohotkey.com/docs/v2/scripts/index.htm#HTML_Entities_Encoding
EncodeHTML(String, Flags := 1)
{
    static TRANS_HTML_NAMED := 1
    static TRANS_HTML_NUMBERED := 2
    static ansi := ["euro", "#129", "sbquo", "fnof", "bdquo", "hellip", "dagger", "Dagger", "circ", "permil", "Scaron", "lsaquo", "OElig", "#141", "#381", "#143", "#144", "lsquo", "rsquo", "ldquo", "rdquo", "bull", "ndash", "mdash", "tilde", "trade", "scaron", "rsaquo", "oelig", "#157", "#382", "Yuml", "nbsp", "iexcl", "cent", "pound", "curren", "yen", "brvbar", "sect", "uml", "copy", "ordf", "laquo", "not", "shy", "reg", "macr", "deg", "plusmn", "sup2", "sup3", "acute", "micro", "para", "middot", "cedil", "sup1", "ordm", "raquo", "frac14", "frac12", "frac34", "iquest", "Agrave", "Aacute", "Acirc", "Atilde", "Auml", "Aring", "AElig", "Ccedil", "Egrave", "Eacute", "Ecirc", "Euml", "Igrave", "Iacute", "Icirc", "Iuml", "ETH", "Ntilde", "Ograve", "Oacute", "Ocirc", "Otilde", "Ouml", "times", "Oslash", "Ugrave", "Uacute", "Ucirc", "Uuml", "Yacute", "THORN", "szlig", "agrave", "aacute", "acirc", "atilde", "auml", "aring", "aelig", "ccedil", "egrave", "eacute", "ecirc", "euml", "igrave", "iacute", "icirc", "iuml", "eth", "ntilde", "ograve", "oacute", "ocirc", "otilde", "ouml", "divide", "oslash", "ugrave", "uacute", "ucirc", "uuml", "yacute", "thorn", "yuml"]
    static unicode := {0x20AC:1, 0x201A:3, 0x0192:4, 0x201E:5, 0x2026:6, 0x2020:7, 0x2021:8, 0x02C6:9, 0x2030:10, 0x0160:11, 0x2039:12, 0x0152:13, 0x2018:18, 0x2019:19, 0x201C:20, 0x201D:21, 0x2022:22, 0x2013:23, 0x2014:24, 0x02DC:25, 0x2122:26, 0x0161:27, 0x203A:28, 0x0153:29, 0x0178:32}

    out  := ""
    for i, char in StrSplit(String)
    {
        code := Ord(char)
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
            else if (code > 255)
            {
                if (Flags & TRANS_HTML_NAMED && unicode.HasOwnProp(code))
                    out .= "&" ansi[unicode.%code%] ";"
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
