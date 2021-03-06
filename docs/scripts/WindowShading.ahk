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
global g_MinHeight := 25

; This line will unroll any rolled up windows if the script exits
; for any reason:
OnExit ExitSub

global IDs := Array()
global Windows := Map()

#z::  ; Change this line to pick a different hotkey.
; Below this point, no changes should be made unless you want to
; alter the script's basic functionality.
{
    ; Uncomment this next line if this subroutine is to be converted
    ; into a custom menu item rather than a hotkey. The delay allows
    ; the active window that was deactivated by the displayed menu to
    ; become active again:
    ;Sleep 200
    ActiveID := WinGetID("A")
    for ID in IDs
    {
        if ID = ActiveID
        {
            ; Match found, so this window should be restored (unrolled):
            Height := Windows[ActiveID]
            WinMove ,,, Height, ActiveID
            IDs.RemoveAt(A_Index)
            return
        }
    }
    WinGetPos ,,, &Height, "A"
    Windows.Set(ActiveID, Height)
    WinMove ,,, g_MinHeight, ActiveID
    IDs.Push(ActiveID)
}

ExitSub(*)
{
    for ID in IDs
    {
        Height := Windows[ID]
        WinMove ,,, Height, ID
    }
    ExitApp  ; Must do this for the OnExit subroutine to actually Exit the script.
}
