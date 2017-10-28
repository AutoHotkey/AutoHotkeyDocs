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

SetWorkingDir %A_ScriptDir%\docs\static

; Rebuild Index.hhk.
RunWait "%A_AhkPath%" source\CreateFiles4Help.ahk

; Compile AutoHotkey.chm.
RunWait %hhc% "%A_ScriptDir%\Project.hhp"
