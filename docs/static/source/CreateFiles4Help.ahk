#NoEnv
#NoTrayIcon
SetBatchLines, -1

FileList := { MainJS:       "main.js"
            , IndexJS:      "index.js"
            , TocJS:        "toc.js"
            , JQueryJS:     "jquery.js"
            , TreeJQueryJS: "tree.jquery.js" }

For var, file in FileList
    %var% := FileOpen(file, "r").Read()

FileDelete, content.js
FileAppend, % JQueryJS "`n" TreeJQueryJS "`n" TocJS "`n" IndexJS "`n" MainJS, content.js
FileDelete, Table of Contents.hhc
FileAppend, % TOC_CreateHHC(TocJS), Table of Contents.hhc
FileDelete, Index.hhk
FileAppend, % INDEX_CreateHHK(IndexJS), Index.hhk
Return

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
            output .= "<param name=""Local"" value=""" param_local """>"
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

        Transform, param_name, HTML, % data[i].t
        output .= "<param name=""Name"" value=""" param_name """>"
        Transform, param_local, HTML, % data[i].v
        output .= "<param name=""Local"" value=""" param_local """>"

        output .= "</object>`n"
    }
    output .= "</ul>"
    output .= "`n</body>`n</html>`n"
    return % output
}
