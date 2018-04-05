; On-Screen Keyboard (based on the v1 script by Jon)
; http://www.autohotkey.com
; This script creates a mock keyboard at the bottom of your screen that shows
; the keys you are pressing in real time. I made it to help me to learn to
; touch-type (to get used to not looking at the keyboard). The size of the
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
; a number such as 2 for the following variable. Leave it blank to use
; the primary:
k_Monitor := ""

;---- End of configuration section. Don't change anything below this point
; unless you want to alter the basic nature of the script.

;---- Create a GUI window for the on-screen keyboard:
Gui := GuiCreate("-Caption +ToolWindow +AlwaysOnTop +Disabled")
Gui.SetFont("s" k_FontSize " " k_FontStyle, k_FontName)
Gui.MarginY := 0, Gui.MarginX := 0

;---- Alter the tray icon menu:
A_TrayMenu.Delete
A_TrayMenu.Add k_MenuItemHide, Func("k_ShowHide").bind(Gui, k_MenuItemHide, k_MenuItemShow)
A_TrayMenu.Add "&Exit", "k_MenuExit"
A_TrayMenu.Default := k_MenuItemHide

;---- Add a button for each key:

; The keyboard layout you see:
k_cL := [ ["``", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Back "]
        , ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\  "]
        , ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"]
        , ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift  "]
        , ["Ctrl", "Win", "Alt", "Space ", "Alt", "Win", "Menu", "Ctrl"] ]

; AutoHotkey's official key names for the keys above (leave empty if identical):
k_oL := [ [, , , , , , , , , , , , , "Backspace"]
        , []
        , ["CapsLock"]
        , ["LShift", , , , , , , , , , , "RShift"]
        , ["LCtrl", "LWin", "LAlt", , "RAlt", "RWin", "AppsKey", "RCtrl"] ]

; Traverse each key in the list of custom key names:
For n, k_Row in k_cL
    For i, k_CustomKeyName in k_Row
    {
        k_OfficialKeyName := k_oL[n][i]
        ; Calculate object dimensions based on chosen font size:
        opt := "h" k_FontSize * 3 " w" k_FontSize * (StrLen(k_CustomKeyName) + 2) " x+m" 
        if i = 1
            opt .= " y+m xm"
        ; When a key is pressed by the user, click the corresponding button on-screen:
        fn := Func("k_KeyPress").bind(Gui.Add("Button", opt, k_CustomKeyName))
        ; If the key has an official key name use it:
        if k_OfficialKeyName
            Hotkey("~*" k_OfficialKeyName, fn)
        else
            Hotkey("~*" Trim(k_CustomKeyName), fn)
    }

;---- Position the keyboard at the bottom of the screen (taking into account
; the position of the taskbar):
Gui.Show("Hide") ; Required to get the window's calculated width and height.
; Calculate window's X-position:
MonitorGetWorkArea(k_Monitor, WL,, WR, WB)
k_xPos := (WR - WL - Gui.Pos.W) / 2 ; Calculate position to center it horizontally.
; The following is done in case the window will be on a non-primary monitor
; or if the taskbar is anchored on the left side of the screen:
k_xPos += WL
; Calculate window's Y-position:
k_yPos := WB - Gui.Pos.H

;---- Show the window:
Gui.Show("x" k_xPos " y" k_yPos " NA")

;---- Function definitions:
k_KeyPress(BtnCtrl)
{ 
    BtnCtrl.Opt("Default") ; Highlight the last pressed key.
    ControlClick(, "ahk_id " BtnCtrl.Hwnd,,,, "D")
    KeyWait(SubStr(A_ThisHotkey, 3))
    ControlClick(, "ahk_id " BtnCtrl.Hwnd,,,, "U")
}

k_ShowHide(GuiObj, HideText, ShowText)
{
    static isVisible := true
    if isVisible
    {
        GuiObj.Hide
        A_TrayMenu.Rename HideText, ShowText
        isVisible := false
    }
    else
    {
        GuiObj.Show
        A_TrayMenu.Rename ShowText, HideText
        isVisible := true
    }
}

k_MenuExit()
{
    ExitApp
}
