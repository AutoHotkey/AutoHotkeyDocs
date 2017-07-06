; Joystick Test Script
; http://www.autohotkey.com
; This script helps determine the button numbers and other attributes
; of your joystick. It might also reveal if your joystick is in need
; of calibration; that is, whether the range of motion of each of its
; axes is from 0 to 100 percent as it should be. If calibration is
; needed, use the operating system's control panel or the software
; that came with your joystick.

; July 16, 2016: Revised code for AHK v2 compatibility
; July 6, 2005 : Added auto-detection of joystick number.
; May 8, 2005  : Fixed: JoyAxes is no longer queried as a means of
; detecting whether the joystick is connected.  Some joysticks are
; gamepads and don't have even a single axis.

; If you want to unconditionally use a specific joystick number, change
; the following value from 0 to the number of the joystick (1-16).
; A value of 0 causes the joystick number to be auto-detected:
JoystickNumber := 0

; END OF CONFIG SECTION. Do not make changes below this point unless
; you wish to alter the basic functionality of the script.

; Auto-detect the joystick number if called for:
if JoystickNumber <= 0
{
    Loop 16  ; Query each joystick number to find out which ones exist.
    {
        if GetKeyState(A_Index "JoyName")
        {
            JoystickNumber := A_Index
            break
        }
    }
    if JoystickNumber <= 0
    {
        MsgBox "The system does not appear to have any joysticks."
        ExitApp
    }
}

#SingleInstance
joy_buttons := GetKeyState(JoystickNumber "JoyButtons")
joy_name := GetKeyState(JoystickNumber "JoyName")
joy_info := GetKeyState(JoystickNumber "JoyInfo")
Loop
{
    buttons_down := ""
    Loop joy_buttons
    {
        if GetKeyState(JoystickNumber "Joy" A_Index)
            buttons_down .= " " A_Index
    }
    axis_info := "X" Round(GetKeyState(JoystickNumber "JoyX"))
    axis_info .= "  Y" Round(GetKeyState(JoystickNumber "JoyY"))
    if InStr(joy_info, "Z")
        axis_info .= "  Z" Round(GetKeyState(JoystickNumber "JoyZ"))
    if InStr(joy_info, "R")
        axis_info .= "  R" Round(GetKeyState(JoystickNumber "JoyR"))
    if InStr(joy_info, "U")
        axis_info .= "  U" Round(GetKeyState(JoystickNumber "JoyU"))
    if InStr(joy_info, "V")
        axis_info .= "  V" Round(GetKeyState(JoystickNumber "JoyV"))
    if InStr(joy_info, "P")
        axis_info .= "  POV" Round(GetKeyState(JoystickNumber "JoyPOV"))
    ToolTip "
    (Q
      " joy_name " (#" JoystickNumber "):
      " axis_info "
      Buttons Down:
      " buttons_down "

      (right-click the tray icon to exit)
    )"
    Sleep 100
}
return
