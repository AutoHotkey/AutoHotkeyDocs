; ToolTip Mouse Menu -- by Rajat
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
;     Dyn[#] := "MenuItem|Window title"

Dyn := [ "MS Word|- Microsoft Word"
       , "Notepad II|- Notepad" ]

;___________________________________________

Exit


;___________________________________________
;_____Menu Sections_________________________

; Create / Edit Menu Sections here.

Notepad:
Run "Notepad.exe"
return

Calculator:
Run "Calc"
return

Section3:
MsgBox "You selected 3"
return

Section4:
MsgBox "You selected 4"
return

Section5:
MsgBox "You selected 5"
return

MSWord:
MsgBox "this is a dynamic entry (word)"
return

NotepadII:
MsgBox "this is a dynamic entry (notepad)"
return


;___________________________________________
;_____Hotkey Section________________________

~MButton::
HowLong := 0
Loop
{
    HowLong++
    Sleep 10
    if !GetKeyState("MButton", "P")
        Break
}
if HowLong < UMDelay
    return


; Prepares dynamic menu:
DynMenu := ""
For i, item in Dyn
{
    mp := StrSplit(item, "|")
    if WinActive(mp[2])
        DynMenu .= "/" mp[1]
}


; Joins sorted main menu and dynamic menu, and
; clears earlier entries and creates new entries:
MenuItem := StrSplit(Sort(MenuItems, "D/") DynMenu, "/")

; Creates the menu:
Menu := MenuTitle
For i, item in MenuItem
    Menu .= "`n" item

MouseGetPos mX, mY
HotKey "~LButton", "MenuClick"
HotKey "~LButton", "On"
ToolTip Menu, mX, mY
WinActivate MenuTitle
return


MenuClick:
HotKey "~LButton", "Off"
if !WinActive(MenuTitle)
{
    ToolTip
    return
}

MouseGetPos mX, mY
ToolTip
mY -= 3   ; Space after which first line starts.
mY /= 13  ; Space taken by each line.
if mY < 1
    return
if mY > MenuItem.Length
    return
TargetSection := MenuItem[Round(mY)]
Gosub(StrReplace(TargetSection, "`s"))
return
