#NoEnv
SetBatchLines, -1
SetWorkingDir %A_ScriptDir%

if (A_PtrSize = 8) {
    try
        RunWait "%A_AhkPath%\..\AutoHotkeyU32.exe" "%A_ScriptFullPath%"
    catch
        MsgBox 16,, This script must be run with AutoHotkey 32-bit, due to use of the ScriptControl COM component.
    ExitApp
}

; Change this path if the loop below doesn't find your hhc.exe,
; or leave it as-is if hhc.exe is somewhere in %PATH%.
hhc := "hhc.exe"

; Try to find hhc.exe, since it's not in %PATH% by default.
for i, env_var in ["ProgramFiles", "ProgramFiles(x86)", "ProgramW6432"]
{
    EnvGet Programs, %env_var%
    if (Programs && FileExist(checking := Programs "\HTML Help Workshop\hhc.exe"))
    {
        hhc := checking
        break
    }
}

FileRead IndexJS, docs\static\source\data_index.js
Overwrite("Index.hhk", INDEX_CreateHHK(IndexJS))

; Use old sidebar:
; FileDelete, docs\static\content.js
; FileRead TocJS, docs\static\source\data_toc.js
; Overwrite("Table of Contents.hhc", TOC_CreateHHC(TocJS))
; IniWrite, Table of Contents.hhc, Project.hhp, OPTIONS, Contents file
; IniWrite, % "AutoHotkey Help,Table of Contents.hhc,Index.hhk,docs\AutoHotkey.htm,docs\AutoHotkey.htm,,,,,0x73520,,0x10200e,[200,0,1080,700],0,,,,0,,0", Project.hhp, WINDOWS, Contents

; Compile AutoHotkey.chm.
RunWait %hhc% "%A_ScriptDir%\Project.hhp"

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
    output .= TOC_CreateListCallback("", sc.Eval("tocData"))
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

        if data[i][0]
        {
            Transform, param_name, HTML, % data[i][0]
            output .= "<param name=""Name"" value=""" param_name """>"
        }
        if data[i][1]
        {
            Transform, param_local, HTML, % data[i][1]
            output .= "<param name=""Local"" value=""docs/" param_local """>"
        }

        output .= "</object>"

        if data[i][2]
            output .= TOC_CreateListCallback(output, data[i][2])

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
    data := sc.Eval("indexData")
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
