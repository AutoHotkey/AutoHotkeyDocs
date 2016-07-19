; ToolTip Mouse Menu (requires XP/2k/NT) -- by Rajat
; http://www.autohotkey.com
; This script displays a popup menu in response to briefly holding down
; the middle mouse button.  Select a menu item by left-clicking it.
; Cancel the menu by left-clicking outside of it.  A recent improvement
; is that the contents of the menu can change depending on which type of
; window is active (Notepad and Word are used as examples here).

; You can set any title here for the menu:
MenuTitle := "-=-=-=-=-=-=-=-"

; This is how long the mouse button must be held to cause the menu to appear:
UMDelay := 20

#SingleInstance


;___________________________________________
;_____Menu Definitions______________________

; Create / Edit Menu Items here.
; You can't use spaces in keys/values/section names.

; Don't worry about the order, the menu will be sorted.

MenuItems := "Notepad/Calculator/Section 3/Section 4/Section 5"


;___________________________________________
;______Dynamic menuitems here_______________

; Syntax:
;     Dyn# = MenuItem|Window title

Dyn1 := "MS Word|- Microsoft Word"
Dyn2 := "Notepad II|- Notepad"

;___________________________________________

Exit


;___________________________________________
;_____Menu Sections_________________________

; Create / Edit Menu Sections here.

Notepad:
Run, Notepad.exe
Return

Calculator:
Run, Calc
Return

Section3:
MsgBox, You selected 3
Return

Section4:
MsgBox, You selected 4
Return

Section5:
MsgBox, You selected 5
Return

MSWord:
msgbox, this is a dynamic entry (word)
Return

NotepadII:
msgbox, this is a dynamic entry (notepad)
Return


;___________________________________________
;_____Hotkey Section________________________

~MButton::
HowLong := 0
Loop
{
	HowLong++
	Sleep, 10
	if !GetKeyState("MButton", "P")
		Break
}
if HowLong < UMDelay, return


;prepares dynamic menu
DynMenu := ""
Loop
{
	if Dyn%a_index% = "", break

	ppos := InStr(dyn%a_index%, "|")
	item := SubStr(dyn%a_index%, 1, ppos)
	ppos += 2
	win := SubStr(dyn%a_index%, ppos, 1000)

	if WinActive(win)
		DynMenu .= "/" item
}


;Joins sorted main menu and dynamic menu
TempMenu := Sort(MenuItems, "D/") DynMenu


;clears earlier entries
Loop
{
	if MenuItem%a_index% = "", break
	MenuItem%a_index% := ""
}

;creates new entries
Loop, Parse, %TempMenu%, /
{
	MenuItem%a_index% := a_loopfield
}

;creates the menu
Menu := MenuTitle
Loop
{
	if MenuItem%a_index% = "", break
	numItems++
	MenuText := MenuItem%a_index%
	Menu .= "`n" MenuText
}

MouseGetPos, mX, mY
HotKey, ~LButton, MenuClick
HotKey, ~LButton, On
ToolTip, %Menu%, %mX%, %mY%
WinActivate, %MenuTitle%
Return


MenuClick:
HotKey, ~LButton, Off
if !WinActive(MenuTitle)
{
	ToolTip
	Return
}

MouseGetPos, mX, mY
ToolTip
mY -= 3		;space after which first line starts
mY /= 13	;space taken by each line
if mY < 1, return
if mY > numItems, return
TargetSection := MenuItem%Round(mY)%
StrReplace, TargetSection, %TargetSection%, %a_space%
Gosub, %TargetSection%
Return
