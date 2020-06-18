; Window Shading (based on the v1 script by Rajat)
; https://www.autohotkey.com
; This script reduces a window to its title bar and then back to its
; original size by pressing a single hotkey.  Any number of windows
; can be reduced in this fashion (the script remembers each).  If the
; script exits for any reason, all "rolled up" windows will be
; automatically restored to their original heights.

; Set the height of a rolled up window here.  The operating system
; probably won't allow the title bar to be hidden regardless of
; how low this number is:
ws_MinHeight := 25

; This line will unroll any rolled up windows if the script exits
; for any reason:
OnExit("ExitSub")
return  ; End of auto-execute section

#z::  ; Change this line to pick a different hotkey.
; Below this point, no changes should be made unless you want to
; alter the script's basic functionality.
; Uncomment this next line if this subroutine is to be converted
; into a custom menu item rather than a hotkey.  The delay allows
; the active window that was deactivated by the displayed menu to
; become active again:
;Sleep 200
ws_ID := WinGetID("A")
Loop Parse, ws_IDList, "|"
{
    if A_LoopField = ws_ID
    {
        ; Match found, so this window should be restored (unrolled):
        ws_Height := ws_Window%ws_ID%
        WinMove ,,, ws_Height, "ahk_id " ws_ID
        ws_IDList := StrReplace(ws_IDList, "|" ws_ID)
        return
    }
}
WinGetPos ,,, ws_Height, "A"
ws_Window%ws_ID% := ws_Height
WinMove ,,, ws_MinHeight, "ahk_id " ws_ID
ws_IDList .= "|" ws_ID
return

ExitSub(*)
{
    Loop Parse, ws_IDList, "|"
    {
        if A_LoopField = ""  ; First field in list is normally blank.
            continue         ; So skip it.
        ws_Height := ws_Window%A_LoopField%
        WinMove ,,, ws_Height, "ahk_id " A_LoopField
    }
    ExitApp  ; Must do this for the OnExit subroutine to actually Exit the script.
}
