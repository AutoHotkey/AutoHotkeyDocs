; Joystick Test Script
; http://www.autohotkey.com
; This script helps determine the button numbers and other attributes
; of your joystick. It might also reveal if your joystick is in need
; of calibration; that is, whether the range of motion of each of its
; axes is from 0 to 100 percent as it should be. If calibration is
; needed, use the operating system's control panel or the software
; that came with your joystick.

; July 6, 2005: Added auto-detection of joystick number.
; May 8, 2005 : Fixed: JoyAxes is no longer queried as a means of
; detecting whether the joystick is connected.  Some joysticks are
; gamepads and don't have even a single axis.

; If you want to unconditionally use a specific joystick number, change
; the following value from 0 to the number of the joystick (1-16).
; A value of 0 causes the joystick number to be auto-detected:
JoystickNumber = 0

; END OF CONFIG SECTION. Do not make changes below this point unless
; you wish to alter the basic functionality of the script.

; Auto-detect the joystick number if called for:
if JoystickNumber <= 0
{
	Loop 16  ; Query each joystick number to find out which ones exist.
	{
		GetKeyState, JoyName, %A_Index%JoyName
		if JoyName <>
		{
			JoystickNumber = %A_Index%
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
SetFormat, float, 03  ; Omit decimal point from axis position percentages.
GetKeyState, joy_buttons, %JoystickNumber%JoyButtons
GetKeyState, joy_name, %JoystickNumber%JoyName
GetKeyState, joy_info, %JoystickNumber%JoyInfo
Loop
{
	buttons_down =
	Loop, %joy_buttons%
	{
		GetKeyState, joy%A_Index%, %JoystickNumber%joy%A_Index%
		if joy%A_Index% = D
			buttons_down = %buttons_down%%A_Space%%A_Index%
	}
	GetKeyState, JoyX, %JoystickNumber%JoyX
	axis_info = X%JoyX%
	GetKeyState, JoyY, %JoystickNumber%JoyY
	axis_info = %axis_info%%A_Space%%A_Space%Y%JoyY%
	IfInString, joy_info, Z
	{
		GetKeyState, JoyZ, %JoystickNumber%JoyZ
		axis_info = %axis_info%%A_Space%%A_Space%Z%JoyZ%
	}
	IfInString, joy_info, R
	{
		GetKeyState, JoyR, %JoystickNumber%JoyR
		axis_info = %axis_info%%A_Space%%A_Space%R%JoyR%
	}
	IfInString, joy_info, U
	{
		GetKeyState, JoyU, %JoystickNumber%JoyU
		axis_info = %axis_info%%A_Space%%A_Space%U%JoyU%
	}
	IfInString, joy_info, V
	{
		GetKeyState, JoyV, %JoystickNumber%JoyV
		axis_info = %axis_info%%A_Space%%A_Space%V%JoyV%
	}
	IfInString, joy_info, P
	{
		GetKeyState, joyp, %JoystickNumber%JoyPOV
		axis_info = %axis_info%%A_Space%%A_Space%POV%joyp%
	}
	ToolTip, %joy_name% (#%JoystickNumber%):`n%axis_info%`nButtons Down: %buttons_down%`n`n(right-click the tray icon to exit)
	Sleep, 100
}
return
