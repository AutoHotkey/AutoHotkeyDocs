; IntelliSense (based on the v1 script by Rajat)
; https://www.autohotkey.com
; This script watches while you edit an AutoHotkey script.  When it sees you
; type a command followed by a comma or space, it displays that command's
; parameter list to guide you.  In addition, you can press Ctrl+F1 (or
; another hotkey of your choice) to display that command's page in the help
; file. To dismiss the parameter list, press Escape or Enter.

; CONFIGURATION SECTION: Customize the script with the following variables.

; The hotkey below is pressed to display the current command's page in the
; help file:
global g_HelpHotkey := "^F1"

; The string below must exist somewhere in the active window's title for
; IntelliSense to be in effect while you're typing.  Make it blank to have
; IntelliSense operate in all windows.  Make it Pad to have it operate in
; editors such as Metapad, Notepad, and Textpad.  Make it .ahk to have it
; operate only when a .ahk file is open in Notepad, Metapad, etc.
global g_Editor := ".ahk"

; If you wish to have a different icon for this script to distinguish it from
; other scripts in the tray, provide the filename below (leave blank to have
; no icon). For example: E:\stuff\Pics\icons\GeoIcons\Information.ico
global g_Icon := ""

; END OF CONFIGURATION SECTION (do not make changes below this point unless
; you want to change the basic functionality of the script).

SetKeyDelay 0
#SingleInstance

global g_ThisCmd := ""
global g_HelpOn := ""
global g_Cmds := []
global g_FullCmds := []

if g_HelpHotkey != ""
    Hotkey g_HelpHotkey, "g_HelpHotkey"

; Change tray icon (if one was specified in the configuration section above):
if g_Icon != ""
    if FileExist(g_Icon)
        TraySetIcon g_Icon

; Determine AutoHotkey's location:
try
    ahk_dir := RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\AutoHotkey", "InstallDir")
catch  ; Not found, so look for it in some other common locations.
{
    if A_AhkPath
        SplitPath A_AhkPath,, ahk_dir
    else if FileExist("..\..\AutoHotkey.chm")
        ahk_dir := "..\.."
    else if FileExist(A_ProgramFiles "\AutoHotkey\AutoHotkey.chm")
        ahk_dir := A_ProgramFiles "\AutoHotkey"
    else
    {
        MsgBox "Could not find the AutoHotkey folder."
        ExitApp
    }
}

global g_AhkHelpFile := ahk_dir "\AutoHotkey.chm"

; Read command syntaxes; can be found in AHK Basic, but it's outdated:
Loop Read, ahk_dir "\Extras\Editors\Syntax\Commands.txt"
{
    FullCmd := A_LoopReadLine

    ; Directives have a first space instead of a first comma.
    ; So use whichever comes first as the end of the command name:
    cPos := InStr(FullCmd, "(")
    sPos := InStr(FullCmd, "`s")
    if (!cPos or (cPos > sPos and sPos))
        EndPos := sPos
    else
        EndPos := cPos

    if EndPos
        CurrCmd := SubStr(FullCmd, 1, EndPos - 1)
    else  ; This is a directive/command with no parameters.
        CurrCmd := A_LoopReadLine
    
    CurrCmd := StrReplace(CurrCmd, "[")
    CurrCmd := StrReplace(CurrCmd, "`s")
    FullCmd := StrReplace(FullCmd, "``n", "`n")
    FullCmd := StrReplace(FullCmd, "``t", "`t")
    
    ; Make arrays of command names and full cmd syntaxes:
    g_Cmds.Push(CurrCmd)
    g_FullCmds.Push(FullCmd)
}

; Use the Input function to watch for commands that the user types:
Loop
{
    ; Editor window check:
    if !WinActive(g_Editor)
    {
        ToolTip
        Sleep 500
        Continue
    }
    
    ; Get all keys till endkey:
    Hook := Input("V", "{Enter}{Escape}{Space},")
    Word := Hook.Input
    EndKey := Hook.EndKey
    
    ; ToolTip is hidden in these cases:
    if EndKey = "Enter" or EndKey = "Escape"
    {
        ToolTip
        Continue
    }

    ; Editor window check again!
    if !WinActive(g_Editor)
    {
        ToolTip
        Continue
    }

    ; Compensate for any indentation that is present:
    Word := StrReplace(Word, "`s")
    Word := StrReplace(Word, "`t")
    if Word = ""
        Continue
    
    ; Check for commented line:
    Check := SubStr(Word, 1, 1)
    if (Check = ";" or Word = "If")  ; "If" seems a little too annoying to show tooltip for.
        Continue

    ; Match word with command:
    Index := ""
    for Cmd in g_Cmds
    {
        ; The value put into g_ThisCmd is also used by the
        ; g_HelpHotkey function:
        g_ThisCmd := Cmd
        if (Word = g_ThisCmd)
        {
            Index := A_Index
            g_HelpOn := g_ThisCmd
            break
        }
    }
    
    ; If no match then resume watching user input:
    if Index = ""
        Continue
    
    ; Show matched command to guide the user:
    ThisFullCmd := g_FullCmds[Index]
    CaretGetPos CaretX, CaretY
    ToolTip ThisFullCmd, CaretX, CaretY + 20
}



; This script was originally written for AutoHotkey v1.
; Input() is a rough reproduction of the Input command.
Input(Options:="", EndKeys:="", MatchList:="") {
    static ih
    if IsSet(ih) && ih.InProgress
        ih.Stop()
    ih := InputHook(Options, EndKeys, MatchList)
    ih.Start()
    ih.Wait()
    return ih
}



g_HelpHotkey(*)
{
    if !WinActive(g_Editor)
        return

    ToolTip  ; Turn off syntax helper since there is no need for it now.

    SetTitleMatchMode 1  ; In case it's 3. This setting is in effect only for this thread.
    if !WinExist("AutoHotkey Help")
    {
        if !FileExist(g_AhkHelpFile)
        {
            MsgBox "Could not find the help file: " g_AhkHelpFile
            return
        }
        Run g_AhkHelpFile
        WinWait "AutoHotkey Help"
    }

    if g_ThisCmd = ""  ; Instead, use what was most recently typed.
        g_ThisCmd := Word

    ; The above has set the "last found" window which we use below:
    WinActivate
    WinWaitActive
    g_ThisCmd := StrReplace(g_ThisCmd, "#", "{#}")  ; Replace leading #, if any.
    Send "!n{home}+{end}" g_HelpOn "{enter}"
}
