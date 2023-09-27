; Custom Increments for UpDown Controls -- by numEric
; https://www.autohotkey.com
; This script demonstrates how to change an UpDown's increment to a value
; other than 1 (such as 5 or 0.1).

#SingleInstance Force

WM_NOTIFY    := 0x004E
UDM_GETBUDDY := 0x046A
UDN_DELTAPOS := 0xFFFFFD2E

SetFormat, Float, 0.1

; *** UpDown properties ***
; UpDown<Ctrl_ID>_fIncrement: Custom increment to be used by control UpDown<Ctrl_ID>.
; UpDown<Ctrl_ID>_fPos: Initial position (= 0 if omitted).
; UpDown<Ctrl_ID>_fRangeMin: Minimum position (= 0 if omitted).
; UpDown<Ctrl_ID>_fRangeMax: Maximum position (= (UpDown<Ctrl_ID>_fRangeMin + Abs(UpDown<Ctrl_ID>_fIncrement) * 100) if omitted).
; 
UpDown4_fIncrement := .1
UpDown4_fPos       := 0
UpDown4_fRangeMin  := -10
UpDown4_fRangeMax  := 10
UpDown6_fIncrement := 5
UpDown6_fPos       := 10

; The following "-2" option disables the control's UDS_SETBUDDYINT style.
; This is recommended when creating non-unitary UpDown controls, because
; it prevents a glitch that may otherwise occur when the control is greatly
; solicited (e.g. when using the mouse wheel to scroll the value).
Gui, Add, Edit, +Right
Gui, Add, UpDown, -2
Gui, Add, Edit, ym +Right
Gui, Add, UpDown, -2
; Set initial positions for all UpDown controls
GuiControl, , Edit1, %UpDown4_fPos%
GuiControl, , Edit2, %UpDown6_fPos%
Gui, Show

OnMessage(WM_NOTIFY, "WM_NOTIFY")

Return

GuiClose:
GuiEscape:
ExitApp

WM_NOTIFY(wParam, lParam, Msg, hWnd)
{
    Global UDM_GETBUDDY, UDN_DELTAPOS

    NMUPDOWN_NMHDR_hwndFrom := NumGet(lParam + 0, 0, "UInt")
    NMUPDOWN_NMHDR_idFrom   := NumGet(lParam + 0, 4, "UInt")
    NMUPDOWN_NMHDR_code     := NumGet(lParam + 0, 8, "UInt")
    ; NMUPDOWN_iPos           := NumGet(lParam + 0, 12, "Int")
    NMUPDOWN_iDelta         := NumGet(lParam + 0, 16, "Int")

    UpDown_fIncrement := UpDown%NMUPDOWN_NMHDR_idFrom%_fIncrement

    If (NMUPDOWN_NMHDR_code = UDN_DELTAPOS && UpDown_fIncrement != "")
    {
        If (BuddyCtrl_hWnd := DllCall("User32\SendMessage", "UInt", NMUPDOWN_NMHDR_hWndFrom, "UInt", UDM_GETBUDDY, "UInt", 0, "UInt", 0))
        {
            UpDown_ID := NMUPDOWN_NMHDR_idFrom

            UpDown_fRangeMin := (UpDown%UpDown_ID%_fRangeMin != "")
                ? UpDown%UpDown_ID%_fRangeMin
                : 0
            UpDown_fRangeMax := (UpDown%UpDown_ID%_fRangeMax != "")
                ? UpDown%UpDown_ID%_fRangeMax
                : UpDown_fRangeMin + Abs(UpDown_fIncrement) * 100

            ControlGetText, BuddyCtrl_Text, , ahk_id %BuddyCtrl_hWnd%
            BuddyCtrl_Text += NMUPDOWN_iDelta * UpDown_fIncrement
            BuddyCtrl_Text := (BuddyCtrl_Text < UpDown_fRangeMin)
                ? UpDown_fRangeMin
                : (BuddyCtrl_Text > UpDown_fRangeMax)
                ? UpDown_fRangeMax
                : BuddyCtrl_Text
            ControlSetText, , %BuddyCtrl_Text%, ahk_id %BuddyCtrl_hWnd%

            ; Done; discard proposed change
            Return True
        }
        Else
        {
            ; No buddy control
            Return False
        }
    }
    Else
    {
        ; Not UDN_DELTAPOS, or unit-incremented UpDown control
        Return False
    }
}
