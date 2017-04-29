; On-Screen Keyboard (requires XP/2k/NT) -- by Jon
; http://www.autohotkey.com
; This script creates a mock keyboard at the bottom of your screen that shows
; the keys you are pressing in real time. I made it to help me to learn to
; touch-type (to get used to not looking at the keyboard).  The size of the
; on-screen keyboard can be customized at the top of the script. Also, you
; can double-click the tray icon to show or hide the keyboard.

;---- Configuration Section: Customize the size of the on-screen keyboard and
; other options here.

; Changing this font size will make the entire on-screen keyboard get
; larger or smaller:
k_FontSize := 10
k_FontName := "Verdana"  ; This can be blank to use the system's default font.
k_FontStyle := "Bold"    ; Example of an alternative: Italic Underline

; Names for the tray menu items:
k_MenuItemHide := "Hide on-screen &keyboard"
k_MenuItemShow := "Show on-screen &keyboard"

; To have the keyboard appear on a monitor other than the primary, specify
; a number such as 2 for the following variable.  Leave it blank to use
; the primary:
k_Monitor := ""

;---- End of configuration section.  Don't change anything below this point
; unless you want to alter the basic nature of the script.


;---- Alter the tray icon menu:
Menu, Tray, Add, %k_MenuItemHide%, k_ShowHide
Menu, Tray, Add, &Exit, k_MenuExit
Menu, Tray, Default, %k_MenuItemHide%
Menu, Tray, NoStandard

;---- Calculate object dimensions based on chosen font size:
k_KeyWidth := k_FontSize * 3
k_KeyHeight := k_FontSize * 3
k_KeyMargin := k_FontSize / 6
k_SpacebarWidth := k_FontSize * 25
k_KeyWidthHalf := k_KeyWidth / 2

k_KeySize := "w%k_KeyWidth% h%k_KeyHeight%"
k_Position := "x+%k_KeyMargin% %k_KeySize%"

;---- Create a GUI window for the on-screen keyboard:
Gui := GuiCreate("-Caption +E0x200 +ToolWindow")
Gui.SetFont("s%k_FontSize% %k_FontStyle%", k_FontName)
Gui.BackColor := "F1ECED"  ; This color will be made transparent later below.

;---- Add a button for each key. Position the first button with absolute
; coordinates so that all other buttons can be positioned relative to it:
Gui.Add("Button", "1", "section %k_KeySize% xm+%k_KeyWidth%")
Gui.Add("Button", "2", k_Position)
Gui.Add("Button", "3", k_Position)
Gui.Add("Button", "4", k_Position)
Gui.Add("Button", "5", k_Position)
Gui.Add("Button", "6", k_Position)
Gui.Add("Button", "7", k_Position)
Gui.Add("Button", "8", k_Position)
Gui.Add("Button", "9", k_Position)
Gui.Add("Button", "0", k_Position)
Gui.Add("Button", "-", k_Position)
Gui.Add("Button", "=", k_Position)
Gui.Add("Button", "Bk", k_Position)

Gui.Add("Button", "Tab", "xm y+%k_KeyMargin% h%k_KeyHeight%")  ; Auto-width.
Gui.Add("Button", "Q", k_Position)
Gui.Add("Button", "W", k_Position)
Gui.Add("Button", "E", k_Position)
Gui.Add("Button", "R", k_Position)
Gui.Add("Button", "T", k_Position)
Gui.Add("Button", "Y", k_Position)
Gui.Add("Button", "U", k_Position)
Gui.Add("Button", "I", k_Position)
Gui.Add("Button", "O", k_Position)
Gui.Add("Button", "P", k_Position)
Gui.Add("Button", "[", k_Position)
Gui.Add("Button", "]", k_Position)
Gui.Add("Button", "\", k_Position)

Gui.Add("Button", "A", "xs+%k_KeyWidthHalf% y+%k_KeyMargin% %k_KeySize%")
Gui.Add("Button", "S", k_Position)
Gui.Add("Button", "D", k_Position)
Gui.Add("Button", "F", k_Position)
Gui.Add("Button", "G", k_Position)
Gui.Add("Button", "H", k_Position)
Gui.Add("Button", "J", k_Position)
Gui.Add("Button", "K", k_Position)
Gui.Add("Button", "L", k_Position)
Gui.Add("Button", ";", k_Position)
Gui.Add("Button", "'", k_Position)
Gui.Add("Button", "Enter", "x+%k_KeyMargin% h%k_KeyHeight%")  ; Auto-width.

; The first button below adds %A_Space% at the end to widen it a little,
; making the layout of keys next to it more accurately reflect a real keyboard:
Gui.Add("Button", "Shift  ", "xm y+%k_KeyMargin% h%k_KeyHeight%")
Gui.Add("Button", "Z", k_Position)
Gui.Add("Button", "X", k_Position)
Gui.Add("Button", "C", k_Position)
Gui.Add("Button", "V", k_Position)
Gui.Add("Button", "B", k_Position)
Gui.Add("Button", "N", k_Position)
Gui.Add("Button", "M", k_Position)
Gui.Add("Button", ",", k_Position)
Gui.Add("Button", ".", k_Position)
Gui.Add("Button", "/", k_Position)

Gui.Add("Button", "Ctrl", "xm y+%k_KeyMargin% h%k_KeyHeight%")  ; Auto-width.
Gui.Add("Button", "Win", "h%k_KeyHeight% x+%k_KeyMargin%")      ; Auto-width.
Gui.Add("Button", "Alt", "h%k_KeyHeight% x+%k_KeyMargin%")      ; Auto-width.
Gui.Add("Button", "Space", "h%k_KeyHeight% x+%k_KeyMargin% w%k_SpacebarWidth%")

;---- Show the window:
Gui.Show()
k_IsVisible := true

WinGetID, k_ID, A   ; Get its window ID.
WinGetPos,,, k_WindowWidth, k_WindowHeight, A

;---- Position the keyboard at the bottom of the screen (taking into account
; the position of the taskbar):
MonitorGetWorkArea, %k_Monitor%, k_WorkAreaLeft,, k_WorkAreaRight, k_WorkAreaBottom

; Calculate window's X-position:
k_WindowX := k_WorkAreaRight
k_WindowX -= k_WorkAreaLeft  ; Now k_WindowX contains the width of this monitor.
k_WindowX -= k_WindowWidth
k_WindowX /= 2  ; Calculate position to center it horizontally.
; The following is done in case the window will be on a non-primary monitor
; or if the taskbar is anchored on the left side of the screen:
k_WindowX += k_WorkAreaLeft

; Calculate window's Y-position:
k_WindowY := k_WorkAreaBottom - k_WindowHeight

WinMove, A,, %k_WindowX%, %k_WindowY%
WinSetAlwaysOnTop, On, ahk_id %k_ID%
WinSetTransColor, %Gui.BackColor% 220, ahk_id %k_ID%


;---- Set all keys as hotkeys. See www.asciitable.com
k_n := 1
k_ASCII := 45

Loop
{
	k_char := StrUpper(Chr(k_ASCII))
	if !InStr("<>^~?,", k_char)
		Hotkey, ~*%k_char%, k_KeyPress
		; In the above, the asterisk prefix allows the key to be detected regardless
		; of whether the user is holding down modifier keys such as Control and Shift.
	if k_ASCII = 93
		break
	k_ASCII++
}

return ; End of auto-execute section.


;---- When a key is pressed by the user, click the corresponding button on-screen:

~*Backspace::
ControlClick, Bk, ahk_id %k_ID%, , LEFT, 1, D
KeyWait, Backspace
ControlClick, Bk, ahk_id %k_ID%, , LEFT, 1, U
return


; LShift and RShift are used rather than "Shift" because when used as a hotkey,
; "Shift" would default to firing upon release of the key (in older AHK versions):
~*LShift::
~*RShift::
~*LCtrl::  ; Must use Ctrl not Control to match button names.
~*RCtrl::
~*LAlt::
~*RAlt::
~*LWin::
~*RWin::
k_ThisHotkey := SubStr(A_ThisHotkey, 3)
ControlClick, %k_ThisHotkey%, ahk_id %k_ID%, , LEFT, 1, D
KeyWait, %k_ThisHotkey%
ControlClick, %k_ThisHotkey%, ahk_id %k_ID%, , LEFT, 1, U
return


~*,::
~*'::
~*Space::
~*Enter::
~*Tab::
k_KeyPress:
StrReplace, k_ThisHotkey, %A_ThisHotkey%, ~
StrReplace, k_ThisHotkey, %k_ThisHotkey%, *
SetTitleMatchMode, 3  ; Prevents the T and B keys from being confused with Tab and Backspace.
ControlClick, %k_ThisHotkey%, ahk_id %k_ID%, , LEFT, 1, D
KeyWait, %k_ThisHotkey%
ControlClick, %k_ThisHotkey%, ahk_id %k_ID%, , LEFT, 1, U
Return


k_ShowHide:
if k_IsVisible = true
{
	Gui.Hide()
	Menu, Tray, Rename, %k_MenuItemHide%, %k_MenuItemShow%
	k_IsVisible := false
}
else
{
	Gui.Show()
	Menu, Tray, Rename, %k_MenuItemShow%, %k_MenuItemHide%
	k_IsVisible := true
}
return


k_MenuExit:
ExitApp
