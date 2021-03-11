; On-Screen Keyboard (based on the v1 script by Jon)
; https://www.autohotkey.com
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

;---- Create a Gui window for the on-screen keyboard:
MyGui := Gui("-Caption +ToolWindow +AlwaysOnTop +Disabled")
MyGui.SetFont("s" k_FontSize " " k_FontStyle, k_FontName)
MyGui.MarginY := 0, MyGui.MarginX := 0

;---- Alter the tray icon menu:
A_TrayMenu.Delete
A_TrayMenu.Add k_MenuItemHide, k_ShowHide
A_TrayMenu.Add "&Exit", (*) => ExitApp()
A_TrayMenu.Default := k_MenuItemHide

;---- Add a button for each key:

; The keyboard layout:
k_Layout := [
    ["``", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace:3"],
    ["Tab:3", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\"],
    ["CapsLock:3", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter:2"],
    ["LShift:3", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift:3"],
    ["LCtrl:2", "LWin:2", "LAlt:2", "Space:2", "RAlt:2", "RWin:2", "AppsKey:2", "RCtrl:2"]
]

; Traverse the keys of the keyboard layout:
for n, k_Row in k_Layout
    for i, k_Key in k_Row
    {
        k_KeyWidthMultiplier := 1
        ; Get custom key width multiplier:
        if RegExMatch(k_Key, "(.+):(\d)", &m)
        {
            k_Key := m[1]
            k_KeyWidthMultiplier := m[2]
        }
        ; Get localized key name:
        k_KeyNameText := GetKeyNameText(k_Key, 0, 1)
        ; Windows key names start with left or right so replace it:
        if (k_Key = "LWin" || k_Key = "RWin")
            k_KeyNameText := "Win"
         ; Truncate the key name:
        if (StrLen(k_Key) > 1)
            k_KeyNameText := Trim(SubStr(k_KeyNameText, 1, 5))
        else
            k_KeyNameText := k_Key
        ; Convert to uppercase:
        k_KeyNameText := StrUpper(k_KeyNameText)
        ; Calculate object dimensions based on chosen font size:
        k_KeyHeight := k_FontSize * 3
        opt := "h" k_KeyHeight " w" k_KeyHeight * k_KeyWidthMultiplier " -Wrap x+m" 
        if (i = 1)
            opt .= " y+m xm"
        ; Add the button:
        Btn := MyGui.Add("Button", opt, k_KeyNameText)
        ; When a key is pressed by the user, click the corresponding button on-screen:
        Hotkey("~*" k_Key, k_KeyPress.bind(Btn))
    }

;---- Position the keyboard at the bottom of the screen (taking into account
; the position of the taskbar):
MyGui.Show("Hide") ; Required to get the window's calculated width and height.
; Calculate window's X-position:
MonitorGetWorkArea(k_Monitor, &WL,, &WR, &WB)
MyGui.GetPos(,, &k_width, &k_height)
k_xPos := (WR - WL - k_width) / 2 ; Calculate position to center it horizontally.
; The following is done in case the window will be on a non-primary monitor
; or if the taskbar is anchored on the left side of the screen:
k_xPos += WL
; Calculate window's Y-position:
k_yPos := WB - k_height

;---- Show the window:
MyGui.Show("x" k_xPos " y" k_yPos " NA")

;---- Function definitions:
k_KeyPress(BtnCtrl, *)
{ 
    BtnCtrl.Opt("Default") ; Highlight the last pressed key.
    ControlClick(, BtnCtrl,,,, "D")
    KeyWait(SubStr(A_ThisHotkey, 3))
    ControlClick(, BtnCtrl,,,, "U")
}

k_ShowHide(*)
{
    static isVisible := true
    if isVisible
    {
        MyGui.Hide
        A_TrayMenu.Rename k_MenuItemHide, k_MenuItemShow
        isVisible := false
    }
    else
    {
        MyGui.Show
        A_TrayMenu.Rename k_MenuItemShow, k_MenuItemHide
        isVisible := true
    }
}

GetKeyNameText(Key, Extended := false, DoNotCare := false)
{
    Params := (GetKeySC(Key) << 16) | (Extended << 24) | (DoNotCare << 25)
    KeyNameText := BufferAlloc(64, 0)
    DllCall("User32.dll\GetKeyNameText", "Int", Params, "Ptr", KeyNameText, "Int", 32)
    return StrGet(KeyNameText)
}
