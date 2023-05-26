; Controller Test Script
; https://www.autohotkey.com
; This script helps determine the button numbers and other attributes
; of your controller (gamepad, joystick, etc.). It might also reveal
; if your controller is in need of calibration; that is, whether the
; range of motion of each of its axes is from 0 to 100 percent as it
; should be. If calibration is needed, use the operating system's
; control panel or the software that came with your controller.

; May 24, 2023: Replaced ToolTip and MsgBox with GUI.
; April 14, 2023: Renamed 'joystick' to 'controller'.
; July 16, 2016: Revised code for AHK v2 compatibility
; July 6, 2005 : Added auto-detection of joystick number.
; May 8, 2005  : Fixed: JoyAxes is no longer queried as a means of
; detecting whether the joystick is connected.  Some joysticks are
; gamepads and don't have even a single axis.

; If you want to unconditionally use a specific controller number, change
; the following value from 0 to the number of the controller (1-16).
; A value of 0 causes the controller number to be auto-detected:
ControllerNumber := 0

; END OF CONFIG SECTION. Do not make changes below this point unless
; you wish to alter the basic functionality of the script.

G := Gui("+AlwaysOnTop", "Controller Test Script")
G.Add("Text", "w300", "Note: For Xbox controller 2013 and newer (anything newer than the Xbox 360 controller), this script can only detect controller events if a window it owns is active (like this one).")
E := G.Add("Edit", "w300 h300 +ReadOnly")
G.Show()

; Auto-detect the controller number if called for:
if ControllerNumber <= 0
{
    Loop 16  ; Query each controller number to find out which ones exist.
    {
        if GetKeyState(A_Index "JoyName")
        {
            ControllerNumber := A_Index
            break
        }
    }
    if ControllerNumber <= 0
    {
        E.Value := "The system does not appear to have any controllers."
        return
    }
}

#SingleInstance
cont_buttons := GetKeyState(ControllerNumber "JoyButtons")
cont_name := GetKeyState(ControllerNumber "JoyName")
cont_info := GetKeyState(ControllerNumber "JoyInfo")
Loop
{
    buttons_down := ""
    Loop cont_buttons
    {
        if GetKeyState(ControllerNumber "Joy" A_Index)
            buttons_down .= " " A_Index
    }
    axis_info := "X" Round(GetKeyState(ControllerNumber "JoyX"))
    axis_info .= "  Y" Round(GetKeyState(ControllerNumber "JoyY"))
    if InStr(cont_info, "Z")
        axis_info .= "  Z" Round(GetKeyState(ControllerNumber "JoyZ"))
    if InStr(cont_info, "R")
        axis_info .= "  R" Round(GetKeyState(ControllerNumber "JoyR"))
    if InStr(cont_info, "U")
        axis_info .= "  U" Round(GetKeyState(ControllerNumber "JoyU"))
    if InStr(cont_info, "V")
        axis_info .= "  V" Round(GetKeyState(ControllerNumber "JoyV"))
    if InStr(cont_info, "P")
        axis_info .= "  POV" Round(GetKeyState(ControllerNumber "JoyPOV"))
    E.Value := cont_name " (#" ControllerNumber "):`n" axis_info "`nButtons Down: " buttons_down
    Sleep 100
}
return
