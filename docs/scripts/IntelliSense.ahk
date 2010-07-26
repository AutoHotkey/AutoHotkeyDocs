; IntelliSense -- by Rajat (requires XP/2k/NT)
; http://www.autohotkey.com
; This script watches while you edit an AutoHotkey script.  When it sees you
; type a command followed by a comma or space, it displays that command's
; parameter list to guide you.  In addition, you can press Ctrl+F1 (or
; another hotkey of your choice) to display that command's page in the help
; file. To dismiss the parameter list, press Escape or Enter.

; Requires v1.0.41+

; CONFIGURATION SECTION: Customize the script with the following variables.

; The hotkey below is pressed to display the current command's page in the
; help file:
I_HelpHotkey = ^F1

; The string below must exist somewhere in the active window's title for
; IntelliSense to be in effect while you're typing.  Make it blank to have
; IntelliSense operate in all windows.  Make it Pad to have it operate in
; editors such as Metapad, Notepad, and Textpad.  Make it .ahk to have it
; operate only when a .ahk file is open in Notepad, Metapad, etc.
I_Editor = pad

; If you wish to have a different icon for this script to distinguish it from
; other scripts in the tray, provide the filename below (leave blank to have
; no icon). For example: E:\stuff\Pics\icons\GeoIcons\Information.ico
I_Icon = 

; END OF CONFIGURATION SECTION (do not make changes below this point unless
; you want to change the basic functionality of the script).

SetKeyDelay, 0
#SingleInstance

if I_HelpHotkey <>
	Hotkey, %I_HelpHotkey%, I_HelpHotkey

; Change tray icon (if one was specified in the configuration section above):
if I_Icon <>
	IfExist, %I_Icon%
		Menu, Tray, Icon, %I_Icon%

; Determine AutoHotkey's location:
RegRead, ahk_dir, HKEY_LOCAL_MACHINE, SOFTWARE\AutoHotkey, InstallDir
if ErrorLevel  ; Not found, so look for it in some other common locations.
{
	if A_AhkPath
		SplitPath, A_AhkPath,, ahk_dir
	else IfExist ..\..\AutoHotkey.chm
		ahk_dir = ..\..
	else IfExist %A_ProgramFiles%\AutoHotkey\AutoHotkey.chm
		ahk_dir = %A_ProgramFiles%\AutoHotkey
	else
	{
		MsgBox Could not find the AutoHotkey folder.
		ExitApp
	}
}

ahk_help_file = %ahk_dir%\AutoHotkey.chm

; Read command syntaxes:
Loop, Read, %ahk_dir%\Extras\Editors\Syntax\Commands.txt
{
	I_FullCmd = %A_LoopReadLine%

	; Directives have a first space instead of a first comma.
	; So use whichever comes first as the end of the command name:
	StringGetPos, I_cPos, I_FullCmd, `,
	StringGetPos, I_sPos, I_FullCmd, %A_Space%
	if (I_cPos = -1 or (I_cPos > I_sPos and I_sPos <> -1))
		I_EndPos := I_sPos
	else
		I_EndPos := I_cPos

	if I_EndPos <> -1
		StringLeft, I_CurrCmd, I_FullCmd, %I_EndPos%
	else  ; This is a directive/command with no parameters.
		I_CurrCmd = %A_LoopReadLine%
	
	StringReplace, I_CurrCmd, I_CurrCmd, [,, All
	StringReplace, I_CurrCmd, I_CurrCmd, %A_Space%,, All
	StringReplace, I_FullCmd, I_FullCmd, ``n, `n, All
	StringReplace, I_FullCmd, I_FullCmd, ``t, `t, All
	
	; Make arrays of command names and full cmd syntaxes:
	I_Cmd%A_Index% = %I_CurrCmd%
	I_FullCmd%A_Index% = %I_FullCmd%
}

; Use the Input command to watch for commands that the user types:
Loop
{
	; Editor window check:
	WinGetTitle, ActiveTitle, A
	IfNotInString, ActiveTitle, %I_Editor%
	{
		ToolTip
		Sleep, 500
		Continue
	}
	
	; Get all keys till endkey:
	Input, I_Word, V, {enter}{escape}{space}`,
	I_EndKey = %ErrorLevel%
	
	; Tooltip is hidden in these cases:
	if I_EndKey in EndKey:Enter,EndKey:Escape
	{
		ToolTip
		Continue
	}

	; Editor window check again!
	WinGetActiveTitle, ActiveTitle
	IfNotInString, ActiveTitle, %I_Editor%
	{
		ToolTip
		Continue
	}

	; Compensate for any indentation that is present:
	StringReplace, I_Word, I_Word, %A_Space%,, All
	StringReplace, I_Word, I_Word, %A_Tab%,, All
	if I_Word =
		Continue
	
	; Check for commented line:
	StringLeft, I_Check, I_Word, 1
	if (I_Check = ";" or I_Word = "If")  ; "If" seems a little too annoying to show tooltip for.
		Continue

	; Match word with command:
	I_Index =
	Loop
	{
		; It helps performance to resolve dynamic variables only once.
		; In addition, the value put into I_ThisCmd is also used by the
		; I_HelpHotkey subroutine:
		I_ThisCmd := I_Cmd%A_Index%
		if I_ThisCmd =
			break
		if (I_Word = I_ThisCmd)
		{
			I_Index := A_Index
			I_HelpOn = %I_ThisCmd%
			break
		}
	}
	
	; If no match then resume watching user input:
	if I_Index =
		Continue
	
	; Show matched command to guide the user:
	I_ThisFullCmd := I_FullCmd%I_Index%
	ToolTip, %I_ThisFullCmd%, A_CaretX, A_CaretY + 20
}



I_HelpHotkey:
WinGetTitle, ActiveTitle, A
IfNotInString, ActiveTitle, %I_Editor%, Return

ToolTip  ; Turn off syntax helper since there is no need for it now.

SetTitleMatchMode, 1  ; In case it's 3. This setting is in effect only for this thread.
IfWinNotExist, AutoHotkey Help
{
	IfNotExist, %ahk_help_file%
	{
		MsgBox, Could not find the help file: %ahk_help_file%.
		return
	}
	Run, %ahk_help_file%
	WinWait, AutoHotkey Help
}

if I_ThisCmd =  ; Instead, use what was most recently typed.
	I_ThisCmd := I_Word

; The above has set the "last found" window which we use below:
WinActivate
WinWaitActive
StringReplace, I_ThisCmd, I_ThisCmd, #, {#}  ; Replace leading #, if any.
Send, !n{home}+{end}%I_HelpOn%{enter}
return
