#NoEnv
#NoTrayIcon
SetBatchLines, -1

FileList := { MainJS:       "main.js"
            , IndexJS:      "data_index.js"
            , TocJS:        "data_toc.js"
            , TranslateJS:  "data_translate.js"
            , JQueryJS:     "jquery.js"
            , TreeJQueryJS: "tree.jquery.js" }

FileEncoding, UTF-8
For var, file in FileList
	FileRead %var%, %A_ScriptDir%\%file%

SetWorkingDir %A_ScriptDir%\..
Overwrite("content.js", JQueryJS "`n" TreeJQueryJS "`n" TocJS "`n" IndexJS "`n" TranslateJS "`n" MainJS)
Overwrite("content.chm.js", JQueryJS "`n" TranslateJS "`n" MainJS)
SetWorkingDir %A_ScriptDir%\..\..\..
Overwrite("Table of Contents.hhc", TOC_CreateHHC(TocJS))
Overwrite("Index.hhk", INDEX_CreateHHK(IndexJS))
return

Overwrite(File, Text)
{
    FileOpen(File, "w").Write(Text)
}

TOC_CreateHHC(data)
{
    ComObjError(false)
    sc := ComObjCreate("ScriptControl")
    sc.Language := "JScript"
    sc.ExecuteStatement(data)
    output =
    ( LTrim
    <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
    <html>
    <body>
    <object type="text/site properties">
    <param name="Window Styles" value="0x800025">
    <param name="ImageType" value="Folder">
    </object>
    )
    output .= TOC_CreateListCallback("", sc.Eval("toc"))
    output .= "`n</body>`n</html>`n"
    return % output
}

TOC_CreateListCallback(byref output, data)
{
    output .= "`n<ul>`n"
    Loop % data.length
    {
        i := A_Index - 1

        output .= "<li><object type=""text/sitemap"">"

        if data[i].label
        {
            Transform, param_name, HTML, % data[i].label
            output .= "<param name=""Name"" value=""" param_name """>"
        }
        if data[i].path
        {
            Transform, param_local, HTML, % data[i].path
            output .= "<param name=""Local"" value=""docs/" param_local """>"
        }

        output .= "</object>"

        if data[i].children
            output .= TOC_CreateListCallback(output, data[i].children)

        output .= "`n"
    }
    output .= "</ul>"
    return % output
}

INDEX_CreateHHK(data)
{
    ComObjError(false)
    sc := ComObjCreate("ScriptControl")
    sc.Language := "JScript"
    sc.ExecuteStatement(data)
    data := sc.Eval("index")
    output =
    ( LTrim
    <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
    <html>
    <body>
    )
    output .= "`n<ul>`n"
    Loop % data.length
    {
        i := A_Index - 1

        output .= "<li><object type=""text/sitemap"">"

        Transform, param_name, HTML, % data[i][0]
        output .= "<param name=""Name"" value=""" param_name """>"
        Transform, param_local, HTML, % data[i][1]
        output .= "<param name=""Local"" value=""docs/" param_local """>"

        output .= "</object>`n"
    }
    output .= "</ul>"
    output .= "`n</body>`n</html>`n"
    return % output
}
