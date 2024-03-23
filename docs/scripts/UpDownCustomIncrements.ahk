; Custom Increments for UpDown Controls (based on the v1 script by numEric)
; https://www.autohotkey.com
; This script demonstrates how to change an UpDown's increment to a value
; other than 1 (such as 5 or 0.1).

#SingleInstance

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
G := Gui()
G.OnEvent("Escape", (*) => ExitApp())
E1 := G.Add("Edit", "+Right")
G.Add("UpDown", "-2")
E2 := G.Add("Edit", "ym +Right")
G.Add("UpDown", "-2")
; Set initial positions for all UpDown controls
E1.Value := UpDown4_fPos
E2.Value := UpDown6_fPos
G.Show()

OnMessage(0x004E, WM_NOTIFY)  ; 0x004E is WM_NOTIFY

WM_NOTIFY(wParam, lParam, Msg, hWnd)
{
    static is64Bit := (A_PtrSize = 8) ? true : false
    static UDM_GETBUDDY := 0x046A
    static UDN_DELTAPOS := 0xFFFFFD2E

    NMUPDOWN_NMHDR_hwndFrom := NumGet(lParam, 0, "UInt")
    NMUPDOWN_NMHDR_idFrom   := NumGet(lParam, is64Bit?8:4, "UInt")
    NMUPDOWN_NMHDR_code     := NumGet(lParam, is64Bit?16:8, "UInt")
    ; NMUPDOWN_iPos           := NumGet(lParam, is64Bit?20:12, "Int")
    NMUPDOWN_iDelta         := NumGet(lParam, is64Bit?28:16, "Int")

    UpDown_fIncrement := UpDown%NMUPDOWN_NMHDR_idFrom%_fIncrement

    if (NMUPDOWN_NMHDR_code = UDN_DELTAPOS && IsSet(UpDown_fIncrement))
    {
        try BuddyCtrl_hWnd := SendMessage(UDM_GETBUDDY, 0, 0, NMUPDOWN_NMHDR_hwndFrom)
        if IsSet(BuddyCtrl_hWnd)
        {
            UpDown_ID := NMUPDOWN_NMHDR_idFrom

            UpDown_fRangeMin := (IsSet(UpDown%UpDown_ID%_fRangeMin))
                ? UpDown%UpDown_ID%_fRangeMin
                : 0
            UpDown_fRangeMax := (IsSet(UpDown%UpDown_ID%_fRangeMax))
                ? UpDown%UpDown_ID%_fRangeMax
                : UpDown_fRangeMin + Abs(UpDown_fIncrement) * 100

            BuddyCtrl_Text := ControlGetText(BuddyCtrl_hWnd) || 0
            BuddyCtrl_Text += NMUPDOWN_iDelta * UpDown_fIncrement
            BuddyCtrl_Text := (BuddyCtrl_Text < UpDown_fRangeMin)
                ? UpDown_fRangeMin
                : (BuddyCtrl_Text > UpDown_fRangeMax)
                ? UpDown_fRangeMax
                : BuddyCtrl_Text
            BuddyCtrl_Text := IsFloat(BuddyCtrl_Text)
                ? Format("{:0.1f}", BuddyCtrl_Text)
                : BuddyCtrl_Text
            ControlSetText(BuddyCtrl_Text, BuddyCtrl_hWnd)

            ; Done; discard proposed change
            return true
        }
        else
        {
            ; No buddy control
            return false
        }
    }
    else
    {
        ; Not UDN_DELTAPOS, or unit-incremented UpDown control
        return false
    }
}
