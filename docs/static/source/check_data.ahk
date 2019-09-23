; Requires AutoHotkey v1.1

SetWorkingDir %A_ScriptDir%\..\..  ; Required.

if !RegExMatch(A_WorkingDir, "\\docs$")  ; Sanity check.
    MsgBox 48,, Working dir is not \docs.`n%A_WorkingDir%

file_indexed := {}

; Check for missing files and anchors referenced in the index.
datafile := A_WorkingDir "\static\source\data_index.js"
Loop Read, %datafile%
{
    if RegExMatch(A_LoopReadLine, "O)\[""(.*?)"",""(.*?)""", m)
    {
        CheckHREF(m[1], m[2])
    }
}

; Check for missing files and anchors referenced in the TOC.
datafile := A_WorkingDir "\static\source\data_toc.js"
Loop Read, %datafile%
{
    if RegExMatch(A_LoopReadLine, "O)\[""(.*?)"",""(.+?)""", m)
    {
        CheckHREF(m[1], m[2])
    }
}

; Check for files which aren't in the index or TOC.
; Note that some are intentionally omitted.
if false
Loop Files, *.htm, FR
{
    path := A_LoopFileFullPath
    if !file_indexed[path]
        D("file not in index or TOC: " path)
}

CheckHREF(topic, href)
{
    global file_indexed, datafile
    href := StrSplit(href, "#")
    FileRead html, % href[1]
    if ErrorLevel
        D(datafile " (" A_Index ") : " href[1])
    else if href.length() != 1 && !InStr(html, "id=""" href[2] """")
        D(datafile " (" A_Index ") : #" href[2])
    file_indexed[StrReplace(href[1],"/","\")] := true
}

D(s) {
    FileAppend %s%`n, *
}