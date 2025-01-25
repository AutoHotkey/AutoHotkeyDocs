; Minimize Window to Tray Menu
; https://www.autohotkey.com
; This script assigns a hotkey of your choice to hide any window so that
; it becomes an entry at the bottom of the script's tray menu.  Hidden
; windows can then be unhidden individually or all at once by selecting
; the corresponding item on the menu.  If the script exits for any reason,
; all the windows that it hid will be unhidden automatically.

; CONFIGURATION SECTION: Change the below values as desired.

; This is the maximum number of windows to allow to be hidden (having a
; limit helps performance):
g_MaxWindows := 50

; This is the hotkey used to hide the active window:
g_Hotkey := "#h"  ; Win+H

; This is the hotkey used to unhide the last hidden window:
g_UnHotkey := "#u"  ; Win+U

; If you prefer to have the tray menu empty of all the standard items,
; such as Help and Pause, use False. Otherwise, use True:
g_StandardMenu := false

; These next few performance settings help to keep the action within the
; A_HotkeyModifierTimeout period, and thus avoid the need to release and
; press down the hotkey's modifier if you want to hide more than one
; window in a row. These settings are not needed if you choose to have
; the script use the keyboard hook via InstallKeybdHook or other means:
A_HotkeyModifierTimeout := 100
SetWinDelay 10
SetKeyDelay 0

#SingleInstance  ; Allow only one instance of this script to be running.
Persistent

; END OF CONFIGURATION SECTION (do not make changes below this point
; unless you want to change the basic functionality of the script).

g_WindowIDs := []
g_WindowTitles := []

Hotkey g_Hotkey, Minimize
Hotkey g_UnHotkey, UnMinimize

; If the user terminates the script by any means, unhide all the
; windows first:
OnExit RestoreAllThenExit

if g_StandardMenu = true
    A_TrayMenu.Add()
else
{
    A_TrayMenu.Delete()
    A_TrayMenu.Add("E&xit and Unhide All", RestoreAllThenExit)
}
A_TrayMenu.Add("&Unhide All Hidden Windows", RestoreAll)
A_TrayMenu.Add()  ; Another separator line to make the above more special.

g_MaxLength := 260  ; Reduce this to restrict the width of the menu.

Minimize(*)
{
    if g_WindowIDs.Length >= g_MaxWindows
    {
        MsgBox "No more than " g_MaxWindows " may be hidden simultaneously."
        return
    }

    ; Set the "last found window" to simplify and help performance.
    ; Since in certain cases it is possible for there to be no active window,
    ; a timeout has been added:
    if !WinWait("A",, 2)  ; It timed out, so do nothing.
        return

    ; Otherwise, the "last found window" has been set and can now be used:
    ActiveID := WinGetID()
    ActiveTitle := WinGetTitle()
    ActiveClass := WinGetClass()
    if ActiveClass ~= "Shell_TrayWnd|Progman"
    {
        MsgBox "The desktop and taskbar cannot be hidden."
        return
    }
    ; Because hiding the window won't deactivate it, activate the window
    ; beneath this one (if any). I tried other ways, but they wound up
    ; activating the task bar. This way sends the active window (which is
    ; about to be hidden) to the back of the stack, which seems best:
    Send "!{esc}"
    ; Hide it only now that WinGetTitle/WinGetClass above have been run (since
    ; by default, those functions cannot detect hidden windows):
    WinHide

    ; If the title is blank, use the class instead. This serves two purposes:
    ; 1) A more meaningful name is used as the menu name.
    ; 2) Allows the menu item to be created (otherwise, blank items wouldn't
    ;    be handled correctly by the various routines below).
    if ActiveTitle = ""
        ActiveTitle := "ahk_class " ActiveClass
    ; Ensure the title is short enough to fit. ActiveTitle also serves to
    ; uniquely identify this particular menu item.
    ActiveTitle := SubStr(ActiveTitle, 1, g_MaxLength)

    ; In addition to the tray menu requiring that each menu item name be
    ; unique, it must also be unique so that we can reliably look it up in
    ; the array when the window is later unhidden. So make it unique if it
    ; isn't already:
    for WindowTitle in g_WindowTitles
    {
        if WindowTitle = ActiveTitle
        {
            ; Match found, so it's not unique.
            ActiveIDShort := Format("{:X}" ,ActiveID)
            ActiveIDShortLength := StrLen(ActiveIDShort)
            ActiveTitleLength := StrLen(ActiveTitle)
            ActiveTitleLength += ActiveIDShortLength
            ActiveTitleLength += 1 ; +1 the 1 space between title & ID.
            if ActiveTitleLength > g_MaxLength
            {
                ; Since menu item names are limted in length, trim the title
                ; down to allow just enough room for the Window's Short ID at
                ; the end of its name:
                TrimCount := ActiveTitleLength
                TrimCount -= g_MaxLength
                ActiveTitle := SubStr(ActiveTitle, 1, -TrimCount)
            }
            ; Build unique title:
            ActiveTitle .= " " ActiveIDShort
            break
        }
    }

    ; First, ensure that this ID doesn't already exist in the list, which can
    ; happen if a particular window was externally unhidden (or its app unhid
    ; it) and now it's about to be re-hidden:
    AlreadyExists := false
    for WindowID in g_WindowIDs
    {
        if WindowID = ActiveID
        {
            AlreadyExists := true
            break
        }
    }

    ; Add the item to the array and to the menu:
    if AlreadyExists = false
    {
        A_TrayMenu.Add(ActiveTitle, RestoreFromTrayMenu)
        g_WindowIDs.Push(ActiveID)
        g_WindowTitles.Push(ActiveTitle)
    }
}


RestoreFromTrayMenu(ThisMenuItem, *)
{
    A_TrayMenu.Delete(ThisMenuItem)
    ; Find window based on its unique title stored as the menu item name:
    for WindowTitle in g_WindowTitles
    {
        if WindowTitle = ThisMenuItem  ; Match found.
        {
            IDToRestore := g_WindowIDs[A_Index]
            WinShow IDToRestore
            WinActivate IDToRestore  ; Sometimes needed.
            g_WindowIDs.RemoveAt(A_Index)  ; Remove it to free up a slot.
            g_WindowTitles.RemoveAt(A_Index)
            break
        }
    }
}


; This will pop the last minimized window off the stack and unhide it.
UnMinimize(*)
{
    ; Make sure there's something to unhide.
    if g_WindowIDs.Length > 0 
    {
        ; Get the id of the last window minimized and unhide it
        IDToRestore := g_WindowIDs.Pop()
        WinShow IDToRestore
        WinActivate IDToRestore
        
        ; Get the menu name of the last window minimized and remove it
        MenuToRemove := g_WindowTitles.Pop()
        A_TrayMenu.Delete(MenuToRemove)
    }
}


RestoreAllThenExit(*)
{
    RestoreAll()
    ExitApp  ; Do a true exit.
}


RestoreAll(*)
{
    for WindowID in g_WindowIDs
    {
        IDToRestore := WindowID
        WinShow IDToRestore
        WinActivate IDToRestore  ; Sometimes needed.
        ; Do it this way vs. DeleteAll so that the sep. line and first
        ; item are retained:
        MenuToRemove := g_WindowTitles[A_Index]
        A_TrayMenu.Delete(MenuToRemove)
    }
    ; Free up all slots:
    global g_WindowIDs := []
    global g_WindowTitles := []
}
