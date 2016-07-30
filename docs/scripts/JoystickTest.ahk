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
		GetKeyState, JoyName, %A_Index%JoyName
		if JoyName <> ""
		{
			JoystickNumber := A_Index
			break
		}
	}
	if JoystickNumber <= 0
	{
		MsgBox The system does not appear to have any joysticks.
		ExitApp
	}
}

#SingleInstance
GetKeyState, joy_buttons, %JoystickNumber%JoyButtons
GetKeyState, joy_name, %JoystickNumber%JoyName
GetKeyState, joy_info, %JoystickNumber%JoyInfo
Loop
{
	buttons_down := ""
	Loop, joy_buttons
	{
		GetKeyState, joy%a_index%, %JoystickNumber%joy%a_index%
		if joy%a_index%
			buttons_down .= " " a_index
	}
	GetKeyState, joyx, %JoystickNumber%JoyX
	axis_info := "X" Round(joyx)
	GetKeyState, joyy, %JoystickNumber%JoyY
	axis_info .= "  Y" Round(joyy)
	if InStr(joy_info, "Z")
	{
		GetKeyState, joyz, %JoystickNumber%JoyZ
		axis_info .= "  Z" Round(joyz)
	}
	if InStr(joy_info, "R")
	{
		GetKeyState, joyr, %JoystickNumber%JoyR
		axis_info .= "  R" Round(joyr)
	}
	if InStr(joy_info, "U")
	{
		GetKeyState, joyu, %JoystickNumber%JoyU
		axis_info .= "  U" Round(joyu)
	}
	if InStr(joy_info, "V")
	{
		GetKeyState, joyv, %JoystickNumber%JoyV
		axis_info .= "  V" Round(joyv)
	}
	if InStr(joy_info, "P")
	{
		GetKeyState, joyp, %JoystickNumber%JoyPOV
		axis_info .= "  POV" Round(joyp)
	}
	ToolTip, %joy_name% (#%JoystickNumber%):`n%axis_info%`nButtons Down: %buttons_down%`n`n(right-click the tray icon to exit)
	Sleep, 100
}
return
