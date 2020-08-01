; ToolTip Mouse Menu (based on the v1 script by Rajat)
; https://www.autohotkey.com
; This script displays a popup menu in response to briefly holding down
; the middle mouse button.  Select a menu item by left-clicking it.
; Cancel the menu by left-clicking outside of it.  A recent improvement
; is that the contents of the menu can change depending on which type of
; window is active (Notepad and Word are used as examples here).

; You can set any title here for the menu:
global g_MenuTitle := "-=-=-=-=-=-=-=-"

; This is how long the mouse button must be held to cause the menu to appear:
global g_UMDelay := 20

#SingleInstance


;___________________________________________
;_____Menu Definitions______________________

; Create / Edit Menu Items here.
; You can't use spaces in keys/values/section names.

; Don't worry about the order, the menu will be sorted.

global g_MenuItems := "Notepad/Calculator/Section 3/Section 4/Section 5"


;___________________________________________
;______Dynamic menuitems here_______________

; Syntax:
;     "MenuItem|Window title"

global g_Dyn := [
    "MS Word|- Microsoft Word",
    "Notepad II|- Notepad",
]

;___________________________________________

Exit


;___________________________________________
;_____Menu Sections_________________________

; Create / Edit Menu Sections here.

Notepad()
{
    Run "Notepad.exe"
}

Calculator()
{
    Run "Calc"
}

Section3()
{
    MsgBox "You selected 3"
}

Section4()
{
    MsgBox "You selected 4"
}

Section5()
{
    MsgBox "You selected 5"
}

MSWord()
{
    MsgBox "this is a dynamic entry (word)"
}

NotepadII()
{
    MsgBox "this is a dynamic entry (notepad)"
}


;___________________________________________
;_____Hotkey Section________________________

~MButton::
{
    HowLong := 0
    Loop
    {
        HowLong++
        Sleep 10
        if !GetKeyState("MButton", "P")
            Break
    }
    if HowLong < g_UMDelay
        return


    ; Prepares dynamic menu:
    DynMenu := ""
    For i, item in g_Dyn
    {
        mp := StrSplit(item, "|")
        if WinActive(mp[2])
            DynMenu .= "/" mp[1]
    }


    ; Joins sorted main menu and dynamic menu, and
    ; clears earlier entries and creates new entries:
    MenuItem := StrSplit(Sort(g_MenuItems, "D/") DynMenu, "/")

    ; Creates the menu:
    ToolTipMenu := g_MenuTitle
    For i, item in MenuItem
        ToolTipMenu .= "`n" item

    MouseGetPos mX, mY
    HotKey "~LButton", "MenuClick"
    HotKey "~LButton", "On"
    ToolTip ToolTipMenu, mX, mY
    WinActivate g_MenuTitle
    WinGetPos ,,, tH, g_MenuTitle
    
    MenuClick(*)
    {
        HotKey "~LButton", "Off"
        if !WinActive(g_MenuTitle)
        {
            ToolTip
            return
        }

        MouseGetPos mX, mY
        ToolTip
        mY /= tH / (MenuItem.Length + 1)  ; Space taken by each line.
        if mY < 1
            return
        TargetSection := MenuItem[Integer(mY)]
        %StrReplace(TargetSection, "`s")%()
    }
}
