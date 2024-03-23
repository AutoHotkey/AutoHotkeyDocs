; Easy Access to Favorite Folders (based on the v1 script by Savage)
; https://www.autohotkey.com
; When you click the middle mouse button while certain types of
; windows are active, this script displays a menu of your favorite
; folders.  Upon selecting a favorite, the script will instantly
; switch to that folder within the active window.  The following
; window types are supported: 1) Standard file-open or file-save
; dialogs; 2) Explorer windows; 3) Console (command prompt) windows.
; The menu can also be optionally shown for unsupported window
; types, in which case the chosen favorite will be opened as a new
; Explorer window.

; CONFIG: CHOOSE YOUR HOTKEY
; If your mouse has more than 3 buttons, you could try using
; XButton1 (the 4th) or XButton2 (the 5th) instead of MButton.
; You could also use a modified mouse button (such as ^MButton) or
; a keyboard hotkey.  In the case of MButton, the tilde (~) prefix
; is used so that MButton's normal functionality is not lost when
; you click in other window types, such as a browser.  The presence
; of a tilde tells the script to avoid showing the menu for
; unsupported window types.  In other words, if there is no tilde,
; the hotkey will always display the menu; and upon selecting a
; favorite while an unsupported window type is active, a new
; Explorer window will be opened to display the contents of that
; folder.
g_Hotkey := "~MButton"

; CONFIG: CHOOSE YOUR FAVORITES
; Update the special commented section below to list your favorite
; folders.  Specify the name of the menu item first, followed by a
; semicolon, followed by the name of the actual path of the favorite.
; Use a blank line to create a separator line.

/*
ITEMS IN FAVORITES MENU <-- Do not change this string.
Desktop      ; %USERPROFILE%\Desktop
Favorites    ; %USERPROFILE%\Favorites
Documents    ; %USERPROFILE%\Documents

Program Files; %PROGRAMFILES%
*/


; END OF CONFIGURATION SECTION
; Do not make changes below this point unless you want to change
; the basic functionality of the script.

#SingleInstance  ; Needed since the hotkey is dynamically created.

g_AlwaysShowMenu := true
g_Paths := []
g_Menu := Menu()
g_window_id := 0
g_class := ""

Hotkey g_Hotkey, DisplayMenu
if SubStr(g_Hotkey, 1, 1) = "~"  ; Show menu only for certain window types.
    g_AlwaysShowMenu := false

if A_IsCompiled  ; Read the menu items from an external file.
    FavoritesFile := A_ScriptDir "\Favorites.ini"
else  ; Read the menu items directly from this script file.
    FavoritesFile := A_ScriptFullPath

;----Read the configuration file.
AtStartingPos := false
FileExt := ""
Loop Read, FavoritesFile
{
    if FileExt != "Exe"
    {
        ; Since the menu items are being read directly from this
        ; script, skip over all lines until the starting line is
        ; arrived at.
        if !AtStartingPos
        {
            if InStr(A_LoopReadLine, "ITEMS IN FAVORITES MENU")
                AtStartingPos := true
            continue  ; Start a new loop iteration.
        }
        ; Otherwise, the closing comment symbol marks the end of the list.
        if A_LoopReadLine = "*/"
            break  ; terminate the loop
    }
    if !A_LoopReadLine  ; Blank indicates a separator line.
    {
        ; Menu separator lines must also be pushed to the array
        ; to be compatible with ItemPos:
        g_Paths.Push("")
        g_Menu.Add()
    }
    else
    {
        line := StrSplit(A_LoopReadLine, ";", "`s`t")
        ; Resolve any references to variables within either field, and
        ; create a new array element containing the path of this favorite:
        g_Paths.Push(line[2])
        g_Menu.Add(line[1], OpenFavorite)
    }
}


;----Open the selected favorite
OpenFavorite(ItemName, ItemPos, *)
{
    control_id := 0
    ; Fetch the array element that corresponds to the selected menu item:
    path := g_Paths[ItemPos]
    if path = ""
        return
    if g_class = "#32770"    ; It's a dialog.
    {
        ; Activate the window so that if the user is middle-clicking
        ; outside the dialog, subsequent clicks will also work:
        WinActivate g_window_id
        ; Retrieve the unique ID number of the Edit1 control:
        control_id := ControlGetHwnd("Edit1", g_window_id)
        ; Retrieve any filename that might already be in the field so
        ; that it can be restored after the switch to the new folder:
        text := ControlGetText(control_id)
        ControlSetText path, control_id
        ControlFocus control_id
        ControlSend "{Enter}", control_id
        Sleep 100  ; It needs extra time on some dialogs or in some cases.
        ControlSetText text, control_id
        return
    }
    else if g_class = "CabinetWClass"  ; In Explorer, switch folders.
    {
        if VerCompare(A_OSVersion, "10.0.22000") >= 0 ; Windows 11 and later
        {
            try GetActiveExplorerTab().Navigate(ExpandEnvVars(path))
        }
        else
        {
            ControlClick "ToolbarWindow323", g_window_id,,,, "NA x1 y1"
            ; Wait until the Edit1 control exists:
            while not control_id
                try control_id := ControlGetHwnd("Edit1", g_window_id)
            ControlFocus control_id
            ControlSetText path, control_id
            ; Tekl reported the following: "If I want to change to Folder L:\folder
            ; then the addressbar shows http://www.L:\folder.com. To solve this,
            ; I added a {right} before {Enter}":
            ControlSend "{Right}{Enter}", control_id
        }
        return
    }
    else if g_class ~= "ConsoleWindowClass|CASCADIA_HOSTING_WINDOW_CLASS" ; In a console window, CD to that directory
    {
        WinActivate g_window_id ; Because sometimes the mclick deactivates it.
        SetKeyDelay 0  ; This will be in effect only for the duration of this thread.
        if InStr(path, ":")  ; It contains a drive letter
        {
            path_drive := SubStr(path, 1, 1)
            Send path_drive ":{enter}"
        }
        Send "cd " path "{Enter}"
        return
    }
    ; Since the above didn't return, one of the following is true:
    ; 1) It's an unsupported window type but g_AlwaysShowMenu is true.
    Run "explorer " path  ; Might work on more systems without double quotes.
}


;----Display the menu
DisplayMenu(*)
{
    ; These first few variables are set here and used by OpenFavorite:
    try global g_window_id := WinGetID("A")
    try global g_class := WinGetClass(g_window_id)
    if g_AlwaysShowMenu = false  ; The menu should be shown only selectively.
    {
        if !(g_class ~= "#32770|ExploreWClass|CabinetWClass|ConsoleWindowClass|CASCADIA_HOSTING_WINDOW_CLASS")
            return ; Since it's some other window type, don't display menu.
    }
    ; Otherwise, the menu should be presented for this type of window:
    g_Menu.Show()
}

; Get the WebBrowser object of the active Explorer tab for the given window,
; or the window itself if it doesn't have tabs.  Supports IE and File Explorer.
; https://www.autohotkey.com/boards/viewtopic.php?t=109907
GetActiveExplorerTab(hwnd := WinExist("A")) {
    activeTab := 0
    try activeTab := ControlGetHwnd("ShellTabWindowClass1", hwnd) ; File Explorer (Windows 11)
    catch
    try activeTab := ControlGetHwnd("TabWindowClass1", hwnd) ; IE
    for w in ComObject("Shell.Application").Windows {
        if w.hwnd != hwnd
            continue
        if activeTab { ; The window has tabs, so make sure this is the right one.
            static IID_IShellBrowser := "{000214E2-0000-0000-C000-000000000046}"
            shellBrowser := ComObjQuery(w, IID_IShellBrowser, IID_IShellBrowser)
            ComCall(3, shellBrowser, "uint*", &thisTab:=0)
            if thisTab != activeTab
                continue
        }
        return w
    }
}

ExpandEnvVars(str)
{
    if sz:=DllCall("ExpandEnvironmentStrings", "Str", str, "Ptr", 0, "UInt", 0)
    {
        buf := Buffer(sz * 2)
        if DllCall("ExpandEnvironmentStrings", "Str", str, "Ptr", buf, "UInt", sz)
            return StrGet(buf)
    }
    return str
}