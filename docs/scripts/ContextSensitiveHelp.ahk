; Context Sensitive Help in Any Editor -- by Rajat
; http://www.autohotkey.com
; This script makes Ctrl+2 (or another hotkey of your choice) show the help file
; page for the selected AutoHotkey function or keyword. If nothing is selected,
; the function name will be extracted from the beginning of the current line.

; The hotkey below uses the clipboard to provide compatibility with the maximum
; number of editors (since ControlGet doesn't work with most advanced editors).
; It restores the original clipboard contents afterward, but as plain text,
; which seems better than nothing.

$^2::
; The following values are in effect only for the duration of this hotkey thread.
; Therefore, there is no need to change them back to their original values
; because that is done automatically when the thread ends:
SetWinDelay 10
SetKeyDelay 0

C_ClipboardPrev := A_Clipboard
A_Clipboard := ""
; Use the highlighted word if there is one (since sometimes the user might
; intentionally highlight something that isn't a function):
Send "^c"
if !ClipWait(0.1)
{
    ; Get the entire line because editors treat cursor navigation keys differently:
    Send "{home}+{end}^c"
    if !ClipWait(0.2)  ; Rare, so no error is reported.
    {
        A_Clipboard := C_ClipboardPrev
        return
    }
}
C_Cmd := Trim(Clipboard)  ; This will trim leading and trailing tabs & spaces.
A_Clipboard := C_ClipboardPrev  ; Restore the original clipboard for the user.
Loop Parse, C_Cmd, "`s"  ; The first space is the end of the function.
{
    C_Cmd := A_LoopField
    break ; i.e. we only need one interation.
}
if !WinExist("AutoHotkey Help")
{
    ; Determine AutoHotkey's location:
    try
        ahk_dir := RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\AutoHotkey", "InstallDir")
    catch  ; Not found, so look for it in some other common locations.
    {
        if A_AhkPath
            SplitPath A_AhkPath,, ahk_dir
        else if FileExist("..\..\AutoHotkey.chm")
            ahk_dir := "..\.."
        else if FileExist(A_ProgramFiles "\AutoHotkey\AutoHotkey.chm")
            ahk_dir := A_ProgramFiles "\AutoHotkey"
        else
        {
            MsgBox "Could not find the AutoHotkey folder."
            return
        }
    }
    Run ahk_dir "\AutoHotkey.chm"
    WinWait "AutoHotkey Help"
}
; The above has set the "last found" window which we use below:
WinActivate
WinWaitActive
C_Cmd := StrReplace(C_Cmd, "#", "{#}")
Send "!n{home}+{end}" C_Cmd "{enter}"
return
