#Requires AutoHotkey v2

SetWorkingDir(A_ScriptDir "\..\..")  ; Required.

if !RegExMatch(A_WorkingDir, "\\docs$")  ; Sanity check.
    MsgBox("Working dir is not \docs.`n" A_WorkingDir, "", 48)

file_indexed := Map()

; Check for missing files and anchors referenced in the index.
datafile := A_WorkingDir "\static\source\data_index.js"
loop read, datafile
{
    if RegExMatch(A_LoopReadLine, '\["(.*?)","(.*?)"', &m)
    {
        CheckHREF(m[1], m[2])
    }
}

; Check for missing files and anchors referenced in the TOC.
datafile := A_WorkingDir "\static\source\data_toc.js"
loop read, datafile
{
    if RegExMatch(A_LoopReadLine, '\["(.*?)","(.+?)"', &m)
    {
        CheckHREF(m[1], m[2])
    }
}

; Check for files which aren't in the index or TOC.
; Note that some are intentionally omitted.
if false
loop files, "*.htm", "FR"
{
    path := A_LoopFilePath
    if !file_indexed.Has(path)
        D("file not in index or TOC: " path)
}

CheckHREF(topic, href)
{
    global file_indexed, datafile
    href := StrSplit(href, "#")
    try
        html := FileRead(href[1])
    catch
        D(datafile " (" A_Index ") : " href[1])
    else if href.length != 1 && !InStr(html, 'id="' href[2] '"')
        D(datafile " (" A_Index ") : #" href[2])
    file_indexed[StrReplace(href[1],"/","\")] := true
}

D(s) {
    FileAppend(s "`n", "*")
}