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
; July 6, 2005: Added auto-detection of joystick number.
; May 8, 2005 : Fixed: JoyAxes is no longer queried as a means of
; detecting whether the joystick is connected.  Some joysticks are
; gamepads and don't have even a single axis.

; If you want to unconditionally use a specific controller number, change
; the following value from 0 to the number of the controller (1-16).
; A value of 0 causes the controller number to be auto-detected:
ControllerNumber = 0

; END OF CONFIG SECTION. Do not make changes below this point unless
; you wish to alter the basic functionality of the script.

Gui, +AlwaysOnTop
Gui, Add, Text, w300, Note: For Xbox controller 2013 and newer (anything newer than the Xbox 360 controller), this script can only detect controller events if a window it owns is active (like this one).
Gui, Add, Edit, w300 h300 +ReadOnly
Gui, Show,, Controller Test Script

; Auto-detect the controller number if called for:
if ControllerNumber <= 0
{
	Loop 16  ; Query each controller number to find out which ones exist.
	{
		GetKeyState, ContName, %A_Index%JoyName
		if ContName <>
		{
			ControllerNumber = %A_Index%
			break
		}
	}
	if ControllerNumber <= 0
	{
		GuiControl,, Edit1, The system does not appear to have any controllers.
		return
	}
}

#SingleInstance
SetFormat, float, 03  ; Omit decimal point from axis position percentages.
GetKeyState, cont_buttons, %ControllerNumber%JoyButtons
GetKeyState, cont_name, %ControllerNumber%JoyName
GetKeyState, cont_info, %ControllerNumber%JoyInfo
Loop
{
	buttons_down =
	Loop, %cont_buttons%
	{
		GetKeyState, Cont%A_Index%, %ControllerNumber%Joy%A_Index%
		if Cont%A_Index% = D
			buttons_down = %buttons_down%%A_Space%%A_Index%
	}
	GetKeyState, ContX, %ControllerNumber%JoyX
	axis_info = X%ContX%
	GetKeyState, ContY, %ControllerNumber%JoyY
	axis_info = %axis_info%%A_Space%%A_Space%Y%ContY%
	IfInString, cont_info, Z
	{
		GetKeyState, ContZ, %ControllerNumber%JoyZ
		axis_info = %axis_info%%A_Space%%A_Space%Z%ContZ%
	}
	IfInString, cont_info, R
	{
		GetKeyState, ContR, %ControllerNumber%JoyR
		axis_info = %axis_info%%A_Space%%A_Space%R%ContR%
	}
	IfInString, cont_info, U
	{
		GetKeyState, ContU, %ControllerNumber%JoyU
		axis_info = %axis_info%%A_Space%%A_Space%U%ContU%
	}
	IfInString, cont_info, V
	{
		GetKeyState, ContV, %ControllerNumber%JoyV
		axis_info = %axis_info%%A_Space%%A_Space%V%ContV%
	}
	IfInString, cont_info, P
	{
		GetKeyState, ContPOV, %ControllerNumber%JoyPOV
		axis_info = %axis_info%%A_Space%%A_Space%POV%ContPOV%
	}
	GuiControl,, Edit1, %cont_name% (#%ControllerNumber%):`n%axis_info%`nButtons Down: %buttons_down%
	Sleep, 100
}
return

GuiClose:
ExitApp
