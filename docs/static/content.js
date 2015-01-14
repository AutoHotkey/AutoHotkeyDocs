//
// Translatable items
//

var hdSearchTxt = "Enter search term ...";
var hdSearchBtn = "Search";
var sbContent   = "Content";
var sbIndex     = "Index";
var ftLicense   = "License:";
var ftExtra     = "";

//
// Table of Contents entries
//

content = [
  {label:"AutoHotkey",path:"docs/AutoHotkey.htm"},
  {label:"Tutorial (quick start)",path:"docs/Tutorial.htm"},
  {label:"FAQ (Frequently Asked Questions)",path:"docs/FAQ.htm"},
  {label:"Command and Function Index",path:"docs/commands/index.htm"},
  {label:"Script Showcase",path:"docs/scripts/index.htm"},
  {label:"Recent Changes",path:"docs/AHKL_ChangeLog.htm"},
  {label:"Basic Usage and Syntax",children:
  [
    {label:"Hotkeys",path:"docs/Hotkeys.htm"},
    {label:"Hotstrings & auto-replace",path:"docs/Hotstrings.htm"},
    {label:"Remapping keys and buttons",path:"docs/misc/Remap.htm"},
    {label:"Key List (Keyboard, Mouse, Joystick)",path:"docs/KeyList.htm"},
    {label:"Scripts",path:"docs/Scripts.htm"},
    {label:"Variables and Expressions",path:"docs/Variables.htm"},
    {label:"Functions",path:"docs/Functions.htm"},
    {label:"Debugging (DBGp) Clients",path:"docs/AHKL_DBGPClients.htm"},
    {label:"Objects",path:"docs/Objects.htm",children:
    [
      {label:"Basic Usage",path:"docs/Objects.htm#Usage"},
      {label:"Extended Usage",path:"docs/Objects.htm#Extended_Usage"},
      {label:"Custom Objects",path:"docs/Objects.htm#Custom_Objects"},
      {label:"Default Base Object",path:"docs/Objects.htm#Default_Base_Object"},
      {label:"Implementation",path:"docs/Objects.htm#Implementation"},
      {label:"Object",path:"docs/objects/Object.htm"},
      {label:"Enumerator Object",path:"docs/objects/Enumerator.htm"},
      {label:"File Object",path:"docs/objects/File.htm"},
      {label:"Func Object",path:"docs/objects/Func.htm"}
    ]}
  ]},
  {label:"Moving to AutoHotkey 1.1 (AutoHotkey_L)",children:
  [
    {label:"AutoHotkey_L New Features",path:"docs/AHKL_Features.htm"},
    {label:"Script Compatibility",path:"docs/Compat.htm"}
  ]},
  {label:"Environment Management",children:
  [
    {label:"ClipWait",path:"docs/commands/ClipWait.htm"},
    {label:"EnvGet",path:"docs/commands/EnvGet.htm"},
    {label:"EnvSet",path:"docs/commands/EnvSet.htm"},
    {label:"EnvUpdate",path:"docs/commands/EnvUpdate.htm"}
  ]},
  {label:"Native Code Interop",children:
  [
    {label:"DllCall",path:"docs/commands/DllCall.htm"},
    {label:"NumGet",path:"docs/commands/NumGet.htm"},
    {label:"NumPut",path:"docs/commands/NumPut.htm"},
    {label:"RegisterCallback",path:"docs/commands/RegisterCallback.htm"},
    {label:"StrPut()/StrGet()",path:"docs/commands/StrPutGet.htm"},
    {label:"COM",children:
    [
      {label:"ComObjActive",path:"docs/commands/ComObjActive.htm"},
      {label:"ComObjArray",path:"docs/commands/ComObjArray.htm"},
      {label:"ComObjConnect",path:"docs/commands/ComObjConnect.htm"},
      {label:"ComObjCreate",path:"docs/commands/ComObjCreate.htm"},
      {label:"ComObjGet",path:"docs/commands/ComObjGet.htm"},
      {label:"ComObjError",path:"docs/commands/ComObjError.htm"},
      {label:"ComObjFlags",path:"docs/commands/ComObjFlags.htm"},
      {label:"ComObjQuery",path:"docs/commands/ComObjQuery.htm"},
      {label:"ComObjType",path:"docs/commands/ComObjType.htm"},
      {label:"ComObjValue",path:"docs/commands/ComObjValue.htm"},
      {label:"ObjAddRef / ObjRelease",path:"docs/commands/ObjAddRef.htm"}
    ]}
  ]},
  {label:"File, Directory, and Disk Management",children:
  [
    {label:"Drive",path:"docs/commands/Drive.htm"},
    {label:"DriveGet",path:"docs/commands/DriveGet.htm"},
    {label:"DriveSpaceFree",path:"docs/commands/DriveSpaceFree.htm"},
    {label:"FileAppend",path:"docs/commands/FileAppend.htm"},
    {label:"FileCopy",path:"docs/commands/FileCopy.htm"},
    {label:"FileCopyDir",path:"docs/commands/FileCopyDir.htm"},
    {label:"FileCreateDir",path:"docs/commands/FileCreateDir.htm"},
    {label:"FileCreateShortcut",path:"docs/commands/FileCreateShortcut.htm"},
    {label:"FileDelete",path:"docs/commands/FileDelete.htm"},
    {label:"FileEncoding",path:"docs/commands/FileEncoding.htm"},
    {label:"FileGetAttrib",path:"docs/commands/FileGetAttrib.htm"},
    {label:"FileGetShortcut",path:"docs/commands/FileGetShortcut.htm"},
    {label:"FileGetSize",path:"docs/commands/FileGetSize.htm"},
    {label:"FileGetTime",path:"docs/commands/FileGetTime.htm"},
    {label:"FileGetVersion",path:"docs/commands/FileGetVersion.htm"},
    {label:"FileInstall",path:"docs/commands/FileInstall.htm"},
    {label:"FileMove",path:"docs/commands/FileMove.htm"},
    {label:"FileMoveDir",path:"docs/commands/FileMoveDir.htm"},
    {label:"FileOpen()",path:"docs/commands/FileOpen.htm"},
    {label:"FileReadLine",path:"docs/commands/FileReadLine.htm"},
    {label:"FileRead",path:"docs/commands/FileRead.htm"},
    {label:"FileRecycle",path:"docs/commands/FileRecycle.htm"},
    {label:"FileRecycleEmpty",path:"docs/commands/FileRecycleEmpty.htm"},
    {label:"FileRemoveDir",path:"docs/commands/FileRemoveDir.htm"},
    {label:"FileSelectFile",path:"docs/commands/FileSelectFile.htm"},
    {label:"FileSelectFolder",path:"docs/commands/FileSelectFolder.htm"},
    {label:"FileSetAttrib",path:"docs/commands/FileSetAttrib.htm"},
    {label:"FileSetTime",path:"docs/commands/FileSetTime.htm"},
    {label:"IfExist/IfNotExist",path:"docs/commands/IfExist.htm"},
    {label:"IniDelete",path:"docs/commands/IniDelete.htm"},
    {label:"IniRead",path:"docs/commands/IniRead.htm"},
    {label:"IniWrite",path:"docs/commands/IniWrite.htm"},
    {label:"Loop (files & folders)",path:"docs/commands/LoopFile.htm"},
    {label:"Loop (read file contents)",path:"docs/commands/LoopReadFile.htm"},
    {label:"SetWorkingDir",path:"docs/commands/SetWorkingDir.htm"},
    {label:"SplitPath",path:"docs/commands/SplitPath.htm"}
  ]},
  {label:"Flow of Control",children:
  [
    {label:"#Include/#IncludeAgain",path:"docs/commands/_Include.htm"},
    {label:"{ ... } (block)",path:"docs/commands/Block.htm"},
    {label:"Break",path:"docs/commands/Break.htm"},
    {label:"Catch",path:"docs/commands/Catch.htm"},
    {label:"Continue",path:"docs/commands/Continue.htm"},
    {label:"Critical",path:"docs/commands/Critical.htm"},
    {label:"Else",path:"docs/commands/Else.htm"},
    {label:"Exit",path:"docs/commands/Exit.htm"},
    {label:"ExitApp",path:"docs/commands/ExitApp.htm"},
    {label:"Finally",path:"docs/commands/Finally.htm"},
    {label:"For-loop",path:"docs/commands/For.htm"},
    {label:"Gosub",path:"docs/commands/Gosub.htm"},
    {label:"Goto",path:"docs/commands/Goto.htm"},
    {label:"If commands",path:"docs/commands/IfExpression.htm",children:
    [
      {label:"If (traditional)",path:"docs/commands/IfEqual.htm"},
      {label:"If (expression)",path:"docs/commands/IfExpression.htm"},
      {label:"If var [not] between Low and High",path:"docs/commands/IfBetween.htm"},
      {label:"If var is [not] type",path:"docs/commands/IfIs.htm"},
      {label:"If var [not] in/contains MatchList",path:"docs/commands/IfIn.htm"},
      {label:"IfExist/IfNotExist",path:"docs/commands/IfExist.htm"},
      {label:"IfInString/IfNotInString",path:"docs/commands/IfInString.htm"},
      {label:"IfMsgBox",path:"docs/commands/IfMsgBox.htm"},
      {label:"IfWinActive/IfWinNotActive",path:"docs/commands/WinActive.htm"},
      {label:"IfWinExist/IfWinNotExist",path:"docs/commands/WinExist.htm"}
    ]},
    {label:"Loop commands",path:"docs/commands/Loop.htm",children:
    [
      {label:"Loop",path:"docs/commands/Loop.htm"},
      {label:"Loop (files & folders)",path:"docs/commands/LoopFile.htm"},
      {label:"Loop (parse a string)",path:"docs/commands/LoopParse.htm"},
      {label:"Loop (read file contents)",path:"docs/commands/LoopReadFile.htm"},
      {label:"Loop (registry)",path:"docs/commands/LoopReg.htm"}
    ]},
    {label:"OnExit",path:"docs/commands/OnExit.htm"},
    {label:"Pause",path:"docs/commands/Pause.htm"},
    {label:"Reload",path:"docs/commands/Reload.htm"},
    {label:"Return",path:"docs/commands/Return.htm"},
    {label:"SetBatchLines",path:"docs/commands/SetBatchLines.htm"},
    {label:"SetTimer",path:"docs/commands/SetTimer.htm"},
    {label:"Sleep",path:"docs/commands/Sleep.htm"},
    {label:"Suspend",path:"docs/commands/Suspend.htm"},
    {label:"Thread",path:"docs/commands/Thread.htm"},
    {label:"Throw",path:"docs/commands/Throw.htm"},
    {label:"Try",path:"docs/commands/Try.htm"},
    {label:"Until",path:"docs/commands/Until.htm"},
    {label:"While-loop",path:"docs/commands/While.htm"}
  ]},
  {label:"Built-in Functions",path:"docs/Functions.htm",children:
  [
    {label:"Asc",path:"docs/Functions.htm#Asc"},
    {label:"Chr",path:"docs/Functions.htm#Chr"},
    {label:"FileExist",path:"docs/Functions.htm#FileExist"},
    {label:"GetKeyName/VK/SC",path:"docs/Functions.htm#GetKeyName"},
    {label:"GetKeyState",path:"docs/Functions.htm#GetKeyState"},
    {label:"InStr",path:"docs/Functions.htm#InStr"},
    {label:"IsByRef",path:"docs/Functions.htm#IsByRef"},
    {label:"IsFunc",path:"docs/Functions.htm#IsFunc"},
    {label:"IsLabel",path:"docs/Functions.htm#IsLabel"},
    {label:"NumGet",path:"docs/commands/NumGet.htm"},
    {label:"NumPut",path:"docs/commands/NumPut.htm"},
    {label:"OnMessage",path:"docs/commands/OnMessage.htm"},
    {label:"RegExMatch",path:"docs/commands/RegExMatch.htm"},
    {label:"RegExReplace",path:"docs/commands/RegExReplace.htm"},
    {label:"RegisterCallback",path:"docs/commands/RegisterCallback.htm"},
    {label:"StrLen",path:"docs/commands/StringLen.htm"},
    {label:"StrPut()/StrGet()",path:"docs/commands/StrPutGet.htm"},
    {label:"StrSplit",path:"docs/commands/StringSplit.htm"},
    {label:"SubStr",path:"docs/Functions.htm#SubStr"},
    {label:"VarSetCapacity",path:"docs/commands/VarSetCapacity.htm"},
    {label:"WinActive",path:"docs/commands/WinActive.htm"},
    {label:"WinExist",path:"docs/commands/WinExist.htm"}
  ]},
  {label:"GUI, MsgBox, InputBox & Other Dialogs",children:
  [
    {label:"FileSelectFile",path:"docs/commands/FileSelectFile.htm"},
    {label:"FileSelectFolder",path:"docs/commands/FileSelectFolder.htm"},
    {label:"Gui",path:"docs/commands/Gui.htm"},
    {label:"Gui control types",path:"docs/commands/GuiControls.htm"},
    {label:"GuiControl",path:"docs/commands/GuiControl.htm"},
    {label:"GuiControlGet",path:"docs/commands/GuiControlGet.htm"},
    {label:"Gui ListView control",path:"docs/commands/ListView.htm"},
    {label:"Gui TreeView control",path:"docs/commands/TreeView.htm"},
    {label:"IfMsgBox",path:"docs/commands/IfMsgBox.htm"},
    {label:"InputBox",path:"docs/commands/InputBox.htm"},
    {label:"Menu",path:"docs/commands/Menu.htm"},
    {label:"MsgBox",path:"docs/commands/MsgBox.htm"},
    {label:"OnMessage",path:"docs/commands/OnMessage.htm"},
    {label:"Progress",path:"docs/commands/Progress.htm"},
    {label:"SplashImage",path:"docs/commands/Progress.htm"},
    {label:"SplashTextOn/SplashTextOff",path:"docs/commands/SplashTextOn.htm"},
    {label:"ToolTip",path:"docs/commands/ToolTip.htm"},
    {label:"TrayTip",path:"docs/commands/TrayTip.htm"}
  ]},
  {label:"Mouse and Keyboard",children:
  [
    {label:"Hotkeys and Hotstrings",path:"docs/Hotkeys.htm",children:
    [
      {label:"#HotkeyInterval",path:"docs/commands/_HotkeyInterval.htm"},
      {label:"#HotkeyModifierTimeout",path:"docs/commands/_HotkeyModifierTimeout.htm"},
      {label:"#Hotstring",path:"docs/commands/_Hotstring.htm"},
      {label:"#If",path:"docs/commands/_If.htm"},
      {label:"#IfTimeOut",path:"docs/commands/_IfTimeout.htm"},
      {label:"#IfWinActive/Exist",path:"docs/commands/_IfWinActive.htm"},
      {label:"#InputLevel",path:"docs/commands/_InputLevel.htm"},
      {label:"#MaxHotkeysPerInterval",path:"docs/commands/_MaxHotkeysPerInterval.htm"},
      {label:"#MaxThreads",path:"docs/commands/_MaxThreads.htm"},
      {label:"#MaxThreadsBuffer",path:"docs/commands/_MaxThreadsBuffer.htm"},
      {label:"#MaxThreadsPerHotkey",path:"docs/commands/_MaxThreadsPerHotkey.htm"},
      {label:"#MenuMaskKey",path:"docs/commands/_MenuMaskKey.htm"},
      {label:"#UseHook",path:"docs/commands/_UseHook.htm"},
      {label:"Hotkey",path:"docs/commands/Hotkey.htm"},
      {label:"ListHotkeys",path:"docs/commands/ListHotkeys.htm"},
      {label:"Suspend",path:"docs/commands/Suspend.htm"}
    ]},
    {label:"#InstallKeybdHook",path:"docs/commands/_InstallKeybdHook.htm"},
    {label:"#InstallMouseHook",path:"docs/commands/_InstallMouseHook.htm"},
    {label:"#KeyHistory",path:"docs/commands/_KeyHistory.htm"},
    {label:"BlockInput",path:"docs/commands/BlockInput.htm"},
    {label:"Click",path:"docs/commands/Click.htm"},
    {label:"ControlClick",path:"docs/commands/ControlClick.htm"},
    {label:"ControlSend/ControlSendRaw",path:"docs/commands/ControlSend.htm"},
    {label:"CoordMode",path:"docs/commands/CoordMode.htm"},
    {label:"GetKeyState",path:"docs/commands/GetKeyState.htm"},
    {label:"Key List (Keyboard, Mouse, Joystick)",path:"docs/KeyList.htm"},
    {label:"KeyHistory",path:"docs/commands/KeyHistory.htm"},
    {label:"KeyWait",path:"docs/commands/KeyWait.htm"},
    {label:"Input",path:"docs/commands/Input.htm"},
    {label:"MouseClick",path:"docs/commands/MouseClick.htm"},
    {label:"MouseClickDrag",path:"docs/commands/MouseClickDrag.htm"},
    {label:"MouseGetPos",path:"docs/commands/MouseGetPos.htm"},
    {label:"MouseMove",path:"docs/commands/MouseMove.htm"},
    {label:"Send/SendRaw/SendInput/SendPlay/SendEvent",path:"docs/commands/Send.htm"},
    {label:"SendLevel",path:"docs/commands/SendLevel.htm"},
    {label:"SendMode",path:"docs/commands/SendMode.htm"},
    {label:"SetDefaultMouseSpeed",path:"docs/commands/SetDefaultMouseSpeed.htm"},
    {label:"SetKeyDelay",path:"docs/commands/SetKeyDelay.htm"},
    {label:"SetMouseDelay",path:"docs/commands/SetMouseDelay.htm"},
    {label:"SetNumScrollCapsLockState",path:"docs/commands/SetNumScrollCapsLockState.htm"},
    {label:"SetStoreCapslockMode",path:"docs/commands/SetStoreCapslockMode.htm"}
  ]},
  {label:"Maths",children:
  [
    {label:"Abs",path:"docs/Functions.htm#Abs"},
    {label:"Ceil",path:"docs/Functions.htm#Ceil"},
    {label:"Exp",path:"docs/Functions.htm#Exp"},
    {label:"Floor",path:"docs/Functions.htm#Floor"},
    {label:"Log",path:"docs/Functions.htm#Log"},
    {label:"Ln",path:"docs/Functions.htm#Ln"},
    {label:"Mod",path:"docs/Functions.htm#Mod"},
    {label:"Random",path:"docs/commands/Random.htm"},
    {label:"Round",path:"docs/Functions.htm#Round"},
    {label:"SetFormat",path:"docs/commands/SetFormat.htm"},
    {label:"Sqrt",path:"docs/Functions.htm#Sqrt"},
    {label:"Sin/Cos/Tan",path:"docs/Functions.htm#Sin"},
    {label:"ASin/ACos/ATan",path:"docs/Functions.htm#ASin"},
    {label:"Transform",path:"docs/commands/Transform.htm"}
  ]},
  {label:"Screen Management",children:
  [
    {label:"ImageSearch",path:"docs/commands/ImageSearch.htm"},
    {label:"PixelGetColor",path:"docs/commands/PixelGetColor.htm"},
    {label:"PixelSearch",path:"docs/commands/PixelSearch.htm"}
  ]},
  {label:"Misc. Commands",children:
  [
    {label:"#NoTrayIcon",path:"docs/commands/_NoTrayIcon.htm"},
    {label:"#SingleInstance",path:"docs/commands/_SingleInstance.htm"},
    {label:"#Warn",path:"docs/commands/_Warn.htm"},
    {label:"AutoTrim",path:"docs/commands/AutoTrim.htm"},
    {label:"Edit",path:"docs/commands/Edit.htm"},
    {label:"ListLines",path:"docs/commands/ListLines.htm"},
    {label:"ListVars",path:"docs/commands/ListVars.htm"},
    {label:"OutputDebug",path:"docs/commands/OutputDebug.htm"},
    {label:"SysGet",path:"docs/commands/SysGet.htm"},
    {label:"Transform",path:"docs/commands/Transform.htm"},
    {label:"URLDownloadToFile",path:"docs/commands/URLDownloadToFile.htm"},
    {label:"VarSetCapacity",path:"docs/commands/VarSetCapacity.htm"}
  ]},
  {label:"Process Management",children:
  [
    {label:"Process",path:"docs/commands/Process.htm"},
    {label:"Run/RunWait",path:"docs/commands/Run.htm"},
    {label:"RunAs",path:"docs/commands/RunAs.htm"},
    {label:"Shutdown",path:"docs/commands/Shutdown.htm"}
  ]},
  {label:"Registry Management",children:
  [
    {label:"Loop (registry)",path:"docs/commands/LoopReg.htm"},
    {label:"RegDelete",path:"docs/commands/RegDelete.htm"},
    {label:"RegRead",path:"docs/commands/RegRead.htm"},
    {label:"RegWrite",path:"docs/commands/RegWrite.htm"},
    {label:"SetRegView",path:"docs/commands/SetRegView.htm"}
  ]},
  {label:"Sound Commands",children:
  [
    {label:"SoundBeep",path:"docs/commands/SoundBeep.htm"},
    {label:"SoundGet",path:"docs/commands/SoundGet.htm"},
    {label:"SoundGetWaveVolume",path:"docs/commands/SoundGetWaveVolume.htm"},
    {label:"SoundPlay",path:"docs/commands/SoundPlay.htm"},
    {label:"SoundSet",path:"docs/commands/SoundSet.htm"},
    {label:"SoundSetWaveVolume",path:"docs/commands/SoundSetWaveVolume.htm"}
  ]},
  {label:"String Management",children:
  [
    {label:"FormatTime",path:"docs/commands/FormatTime.htm"},
    {label:"IfInString/IfNotInString",path:"docs/commands/IfInString.htm"},
    {label:"If var [not] in/contains MatchList",path:"docs/commands/IfIn.htm"},
    {label:"InStr()",path:"docs/Functions.htm#InStr"},
    {label:"Loop (parse a string)",path:"docs/commands/LoopParse.htm"},
    {label:"RegExMatch()",path:"docs/commands/RegExMatch.htm"},
    {label:"RegExReplace()",path:"docs/commands/RegExReplace.htm"},
    {label:"SetEnv (var = value)",path:"docs/commands/SetEnv.htm"},
    {label:"SetFormat",path:"docs/commands/SetFormat.htm"},
    {label:"Sort",path:"docs/commands/Sort.htm"},
    {label:"StringCaseSense",path:"docs/commands/StringCaseSense.htm"},
    {label:"StringGetPos",path:"docs/commands/StringGetPos.htm"},
    {label:"StringLeft/StringRight",path:"docs/commands/StringLeft.htm"},
    {label:"StringLen",path:"docs/commands/StringLen.htm"},
    {label:"StringLower/StringUpper",path:"docs/commands/StringLower.htm"},
    {label:"StringMid",path:"docs/commands/StringMid.htm"},
    {label:"StringReplace",path:"docs/commands/StringReplace.htm"},
    {label:"StringSplit",path:"docs/commands/StringSplit.htm"},
    {label:"StringTrimLeft/StringTrimRight",path:"docs/commands/StringTrimLeft.htm"},
    {label:"StrLen()",path:"docs/commands/StringLen.htm"},
    {label:"StrPut()/StrGet()",path:"docs/commands/StrPutGet.htm"},
    {label:"StrSplit()",path:"docs/commands/StringSplit.htm"},
    {label:"SubStr()",path:"docs/Functions.htm#SubStr"},
    {label:"Trim()",path:"docs/commands/Trim.htm"}
  ]},
  {label:"Window Management",children:
  [
    {label:"Controls",children:
    [
      {label:"Control",path:"docs/commands/Control.htm"},
      {label:"ControlClick",path:"docs/commands/ControlClick.htm"},
      {label:"ControlFocus",path:"docs/commands/ControlFocus.htm"},
      {label:"ControlGet",path:"docs/commands/ControlGet.htm"},
      {label:"ControlGetFocus",path:"docs/commands/ControlGetFocus.htm"},
      {label:"ControlGetPos",path:"docs/commands/ControlGetPos.htm"},
      {label:"ControlGetText",path:"docs/commands/ControlGetText.htm"},
      {label:"ControlMove",path:"docs/commands/ControlMove.htm"},
      {label:"ControlSend/ControlSendRaw",path:"docs/commands/ControlSend.htm"},
      {label:"ControlSetText",path:"docs/commands/ControlSetText.htm"},
      {label:"Menu",path:"docs/commands/Menu.htm"},
      {label:"PostMessage/SendMessage",path:"docs/commands/PostMessage.htm"},
      {label:"SetControlDelay",path:"docs/commands/SetControlDelay.htm"},
      {label:"WinMenuSelectItem",path:"docs/commands/WinMenuSelectItem.htm"}
    ]},
    {label:"Window Groups",children:
    [
      {label:"GroupActivate",path:"docs/commands/GroupActivate.htm"},
      {label:"GroupAdd",path:"docs/commands/GroupAdd.htm"},
      {label:"GroupClose",path:"docs/commands/GroupClose.htm"},
      {label:"GroupDeactivate",path:"docs/commands/GroupDeactivate.htm"}
    ]},
    {label:"#WinActivateForce",path:"docs/commands/_WinActivateForce.htm"},
    {label:"DetectHiddenText",path:"docs/commands/DetectHiddenText.htm"},
    {label:"DetectHiddenWindows",path:"docs/commands/DetectHiddenWindows.htm"},
    {label:"IfWinActive/IfWinNotActive",path:"docs/commands/WinActive.htm"},
    {label:"IfWinExist/IfWinNotExist",path:"docs/commands/WinExist.htm"},
    {label:"SetTitleMatchMode",path:"docs/commands/SetTitleMatchMode.htm"},
    {label:"SetWinDelay",path:"docs/commands/SetWinDelay.htm"},
    {label:"StatusBarGetText",path:"docs/commands/StatusBarGetText.htm"},
    {label:"StatusBarWait",path:"docs/commands/StatusBarWait.htm"},
    {label:"WinActivate",path:"docs/commands/WinActivate.htm"},
    {label:"WinActivateBottom",path:"docs/commands/WinActivateBottom.htm"},
    {label:"WinClose",path:"docs/commands/WinClose.htm"},
    {label:"WinGet",path:"docs/commands/WinGet.htm"},
    {label:"WinGetActiveStats",path:"docs/commands/WinGetActiveStats.htm"},
    {label:"WinGetActiveTitle",path:"docs/commands/WinGetActiveTitle.htm"},
    {label:"WinGetClass",path:"docs/commands/WinGetClass.htm"},
    {label:"WinGetPos",path:"docs/commands/WinGetPos.htm"},
    {label:"WinGetText",path:"docs/commands/WinGetText.htm"},
    {label:"WinGetTitle",path:"docs/commands/WinGetTitle.htm"},
    {label:"WinHide",path:"docs/commands/WinHide.htm"},
    {label:"WinKill",path:"docs/commands/WinKill.htm"},
    {label:"WinMaximize",path:"docs/commands/WinMaximize.htm"},
    {label:"WinMinimize",path:"docs/commands/WinMinimize.htm"},
    {label:"WinMinimizeAll/WinMinimizeAllUndo",path:"docs/commands/WinMinimizeAll.htm"},
    {label:"WinMove",path:"docs/commands/WinMove.htm"},
    {label:"WinRestore",path:"docs/commands/WinRestore.htm"},
    {label:"WinSet",path:"docs/commands/WinSet.htm"},
    {label:"WinSetTitle",path:"docs/commands/WinSetTitle.htm"},
    {label:"WinShow",path:"docs/commands/WinShow.htm"},
    {label:"WinWait",path:"docs/commands/WinWait.htm"},
    {label:"WinWaitActive/WinWaitNotActive",path:"docs/commands/WinWaitActive.htm"},
    {label:"WinWaitClose",path:"docs/commands/WinWaitClose.htm"}
  ]},
  {label:"#Directives",children:
  [
    {label:"#AllowSameLineComments",path:"docs/commands/_AllowSameLineComments.htm"},
    {label:"#ClipboardTimeout",path:"docs/commands/_ClipboardTimeout.htm"},
    {label:"#CommentFlag",path:"docs/commands/_CommentFlag.htm"},
    {label:"#ErrorStdOut",path:"docs/commands/_ErrorStdOut.htm"},
    {label:"#EscapeChar",path:"docs/commands/_EscapeChar.htm"},
    {label:"#HotkeyInterval",path:"docs/commands/_HotkeyInterval.htm"},
    {label:"#HotkeyModifierTimeout",path:"docs/commands/_HotkeyModifierTimeout.htm"},
    {label:"#Hotstring",path:"docs/commands/_Hotstring.htm"},
    {label:"#If",path:"docs/commands/_If.htm"},
    {label:"#IfWinActive/Exist",path:"docs/commands/_IfWinActive.htm"},
    {label:"#IfTimeout",path:"docs/commands/_IfTimeout.htm"},
    {label:"#Include/#IncludeAgain",path:"docs/commands/_Include.htm"},
    {label:"#InputLevel",path:"docs/commands/_InputLevel.htm"},
    {label:"#InstallKeybdHook",path:"docs/commands/_InstallKeybdHook.htm"},
    {label:"#InstallMouseHook",path:"docs/commands/_InstallMouseHook.htm"},
    {label:"#KeyHistory",path:"docs/commands/_KeyHistory.htm"},
    {label:"#MaxHotkeysPerInterval",path:"docs/commands/_MaxHotkeysPerInterval.htm"},
    {label:"#MaxMem",path:"docs/commands/_MaxMem.htm"},
    {label:"#MaxThreads",path:"docs/commands/_MaxThreads.htm"},
    {label:"#MaxThreadsBuffer",path:"docs/commands/_MaxThreadsBuffer.htm"},
    {label:"#MaxThreadsPerHotkey",path:"docs/commands/_MaxThreadsPerHotkey.htm"},
    {label:"#MenuMaskKey",path:"docs/commands/_MenuMaskKey.htm"},
    {label:"#NoEnv",path:"docs/commands/_NoEnv.htm"},
    {label:"#NoTrayIcon",path:"docs/commands/_NoTrayIcon.htm"},
    {label:"#Persistent",path:"docs/commands/_Persistent.htm"},
    {label:"#SingleInstance",path:"docs/commands/_SingleInstance.htm"},
    {label:"#UseHook",path:"docs/commands/_UseHook.htm"},
    {label:"#Warn",path:"docs/commands/_Warn.htm"},
    {label:"#WinActivateForce",path:"docs/commands/_WinActivateForce.htm"}
  ]}
];

//
// Keyword list entries
//

index = [
  {t:"#AllowSameLineComments",v:"docs/commands/_AllowSameLineComments.htm"},
  {t:"#ClipboardTimeout",v:"docs/commands/_ClipboardTimeout.htm"},
  {t:"#CommentFlag",v:"docs/commands/_CommentFlag.htm"},
  {t:"#Delimiter",v:"docs/commands/_EscapeChar.htm#Delimiter"},
  {t:"#DerefChar",v:"docs/commands/_EscapeChar.htm#DerefChar"},
  {t:"#ErrorStdOut",v:"docs/commands/_ErrorStdOut.htm"},
  {t:"#EscapeChar",v:"docs/commands/_EscapeChar.htm"},
  {t:"#HotkeyInterval",v:"docs/commands/_HotkeyInterval.htm"},
  {t:"#HotkeyModifierTimeout",v:"docs/commands/_HotkeyModifierTimeout.htm"},
  {t:"#Hotstring",v:"docs/commands/_Hotstring.htm"},
  {t:"#If",v:"docs/commands/_If.htm"},
  {t:"#IfTimeout",v:"docs/commands/_IfTimeout.htm"},
  {t:"#IfWinActive",v:"docs/commands/_IfWinActive.htm"},
  {t:"#IfWinExist",v:"docs/commands/_IfWinActive.htm"},
  {t:"#Include",v:"docs/commands/_Include.htm"},
  {t:"#IncludeAgain",v:"docs/commands/_Include.htm"},
  {t:"#InputLevel",v:"docs/commands/_InputLevel.htm"},
  {t:"#InstallKeybdHook",v:"docs/commands/_InstallKeybdHook.htm"},
  {t:"#InstallMouseHook",v:"docs/commands/_InstallMouseHook.htm"},
  {t:"#KeyHistory",v:"docs/commands/_KeyHistory.htm"},
  {t:"#LTrim",v:"docs/Scripts.htm#LTrim"},
  {t:"#MaxHotkeysPerInterval",v:"docs/commands/_MaxHotkeysPerInterval.htm"},
  {t:"#MaxMem",v:"docs/commands/_MaxMem.htm"},
  {t:"#MaxThreads",v:"docs/commands/_MaxThreads.htm"},
  {t:"#MaxThreadsBuffer",v:"docs/commands/_MaxThreadsBuffer.htm"},
  {t:"#MaxThreadsPerHotkey",v:"docs/commands/_MaxThreadsPerHotkey.htm"},
  {t:"#MenuMaskKey",v:"docs/commands/_MenuMaskKey.htm"},
  {t:"#NoEnv",v:"docs/commands/_NoEnv.htm"},
  {t:"#NoTrayIcon",v:"docs/commands/_NoTrayIcon.htm"},
  {t:"#Persistent",v:"docs/commands/_Persistent.htm"},
  {t:"#SingleInstance",v:"docs/commands/_SingleInstance.htm"},
  {t:"#UseHook",v:"docs/commands/_UseHook.htm"},
  {t:"#Warn",v:"docs/commands/_Warn.htm"},
  {t:"#WinActivateForce",v:"docs/commands/_WinActivateForce.htm"},
  {t:":=",v:"docs/commands/SetExpression.htm"},
  {t:"A_AhkPath",v:"docs/Variables.htm#AhkPath"},
  {t:"A_AhkVersion",v:"docs/Variables.htm#AhkVersion"},
  {t:"A_AppData",v:"docs/Variables.htm#AppData"},
  {t:"A_AppDataCommon",v:"docs/Variables.htm#AppDataCommon"},
  {t:"A_AutoTrim",v:"docs/Variables.htm#AutoTrim"},
  {t:"A_BatchLines",v:"docs/Variables.htm#BatchLines"},
  {t:"A_CaretX",v:"docs/Variables.htm#Caret"},
  {t:"A_CaretY",v:"docs/Variables.htm#Caret"},
  {t:"A_ComputerName",v:"docs/Variables.htm#ComputerName"},
  {t:"A_ControlDelay",v:"docs/Variables.htm#ControlDelay"},
  {t:"A_Cursor",v:"docs/Variables.htm#Cursor"},
  {t:"A_DD",v:"docs/Variables.htm#DD"},
  {t:"A_DDD",v:"docs/Variables.htm#DDDD"},
  {t:"A_DDDD",v:"docs/Variables.htm#DDDD"},
  {t:"A_DefaultMouseSpeed",v:"docs/Variables.htm#DefaultMouseSpeed"},
  {t:"A_Desktop",v:"docs/Variables.htm#Desktop"},
  {t:"A_DesktopCommon",v:"docs/Variables.htm#DesktopCommon"},
  {t:"A_DetectHiddenText",v:"docs/Variables.htm#DetectHiddenText"},
  {t:"A_DetectHiddenWindows",v:"docs/Variables.htm#DetectHiddenWindows"},
  {t:"A_EndChar",v:"docs/Variables.htm#EndChar"},
  {t:"A_EventInfo",v:"docs/Variables.htm#EventInfo"},
  {t:"A_ExitReason",v:"docs/Variables.htm#ExitReason"},
  {t:"A_FileEncoding",v:"docs/Variables.htm#FileEncoding"},
  {t:"A_FormatFloat",v:"docs/Variables.htm#FormatFloat"},
  {t:"A_FormatInteger",v:"docs/Variables.htm#FormatInteger"},
  {t:"A_Gui",v:"docs/Variables.htm#Gui"},
  {t:"A_GuiControl",v:"docs/Variables.htm#GuiControl"},
  {t:"A_GuiControlEvent",v:"docs/Variables.htm#GuiControlEvent"},
  {t:"A_GuiEvent",v:"docs/Variables.htm#GuiEvent"},
  {t:"A_GuiHeight",v:"docs/Variables.htm#GuiWidth"},
  {t:"A_GuiWidth",v:"docs/Variables.htm#GuiWidth"},
  {t:"A_GuiX",v:"docs/Variables.htm#GuiX"},
  {t:"A_GuiY",v:"docs/Variables.htm#GuiY"},
  {t:"A_Hour",v:"docs/Variables.htm#Hour"},
  {t:"A_IconFile",v:"docs/Variables.htm#IconFile"},
  {t:"A_IconHidden",v:"docs/Variables.htm#IconHidden"},
  {t:"A_IconNumber",v:"docs/Variables.htm#IconNumber"},
  {t:"A_IconTip",v:"docs/Variables.htm#IconTip"},
  {t:"A_Index",v:"docs/commands/Loop.htm"},
  {t:"A_IPAddress1 through 4",v:"docs/Variables.htm#IPAddress"},
  {t:"A_Is64bitOS",v:"docs/Variables.htm#Is64bitOS"},
  {t:"A_IsAdmin",v:"docs/Variables.htm#IsAdmin"},
  {t:"A_IsCompiled",v:"docs/Variables.htm#IsCompiled"},
  {t:"A_IsCritical",v:"docs/Variables.htm#IsCritical"},
  {t:"A_IsPaused",v:"docs/Variables.htm#IsPaused"},
  {t:"A_IsSuspended",v:"docs/Variables.htm#IsSuspended"},
  {t:"A_IsUnicode",v:"docs/Variables.htm#IsUnicode"},
  {t:"A_KeyDelay",v:"docs/Variables.htm#KeyDelay"},
  {t:"A_Language",v:"docs/Variables.htm#Language"},
  {t:"A_Language Values",v:"docs/misc/Languages.htm"},
  {t:"A_LastError",v:"docs/Variables.htm#LastError"},
  {t:"A_LineFile",v:"docs/Variables.htm#LineFile"},
  {t:"A_LineNumber",v:"docs/Variables.htm#LineNumber"},
  {t:"A_LoopField",v:"docs/commands/LoopParse.htm#LoopField"},
  {t:"A_LoopFileAttrib",v:"docs/commands/LoopFile.htm#LoopFileAttrib"},
  {t:"A_LoopFileDir",v:"docs/commands/LoopFile.htm#LoopFileDir"},
  {t:"A_LoopFileExt",v:"docs/commands/LoopFile.htm#LoopFileExt"},
  {t:"A_LoopFileFullPath",v:"docs/commands/LoopFile.htm#LoopFileFullPath"},
  {t:"A_LoopFileLongPath",v:"docs/commands/LoopFile.htm#LoopFileLongPath"},
  {t:"A_LoopFileName",v:"docs/commands/LoopFile.htm#LoopFileName"},
  {t:"A_LoopFileShortName",v:"docs/commands/LoopFile.htm#LoopFileShortName"},
  {t:"A_LoopFileShortPath",v:"docs/commands/LoopFile.htm#LoopFileShortPath"},
  {t:"A_LoopFileSize",v:"docs/commands/LoopFile.htm#LoopFileSize"},
  {t:"A_LoopFileSizeKB",v:"docs/commands/LoopFile.htm#LoopFileSizeKB"},
  {t:"A_LoopFileSizeMB",v:"docs/commands/LoopFile.htm#LoopFileSizeMB"},
  {t:"A_LoopFileTimeAccessed",v:"docs/commands/LoopFile.htm#LoopFileTimeAccessed"},
  {t:"A_LoopFileTimeCreated",v:"docs/commands/LoopFile.htm#LoopFileTimeCreated"},
  {t:"A_LoopFileTimeModified",v:"docs/commands/LoopFile.htm#LoopFileTimeModified"},
  {t:"A_LoopReadLine",v:"docs/commands/LoopReadFile.htm#LoopReadLine"},
  {t:"A_LoopRegKey",v:"docs/commands/LoopReg.htm"},
  {t:"A_LoopRegName",v:"docs/commands/LoopReg.htm"},
  {t:"A_LoopRegSubKey",v:"docs/commands/LoopReg.htm"},
  {t:"A_LoopRegTimeModified",v:"docs/commands/LoopReg.htm"},
  {t:"A_LoopRegType",v:"docs/commands/LoopReg.htm"},
  {t:"A_MDay",v:"docs/Variables.htm#DD"},
  {t:"A_Min",v:"docs/Variables.htm#Min"},
  {t:"A_MM",v:"docs/Variables.htm#MM"},
  {t:"A_MMM",v:"docs/Variables.htm#MMM"},
  {t:"A_MMMM",v:"docs/Variables.htm#MMMM"},
  {t:"A_Mon",v:"docs/Variables.htm#MM"},
  {t:"A_MouseDelay",v:"docs/Variables.htm#MouseDelay"},
  {t:"A_MSec",v:"docs/Variables.htm#MSec"},
  {t:"A_MyDocuments",v:"docs/Variables.htm#MyDocuments"},
  {t:"A_Now",v:"docs/Variables.htm#Now"},
  {t:"A_NowUTC",v:"docs/Variables.htm#NowUTC"},
  {t:"A_NumBatchLines",v:"docs/Variables.htm#BatchLines"},
  {t:"A_OSType",v:"docs/Variables.htm#OSType"},
  {t:"A_OSVersion",v:"docs/Variables.htm#OSVersion"},
  {t:"A_PriorHotkey",v:"docs/Variables.htm#PriorHotkey"},
  {t:"A_PriorKey",v:"docs/Variables.htm#PriorKey"},
  {t:"A_ProgramFiles",v:"docs/Variables.htm#ProgramFiles"},
  {t:"A_Programs",v:"docs/Variables.htm#Programs"},
  {t:"A_ProgramsCommon",v:"docs/Variables.htm#ProgramsCommon"},
  {t:"A_PtrSize",v:"docs/Variables.htm#PtrSize"},
  {t:"A_RegView",v:"docs/Variables.htm#RegView"},
  {t:"A_ScreenDPI",v:"docs/Variables.htm#ScreenDPI"},
  {t:"A_ScreenHeight",v:"docs/Variables.htm#Screen"},
  {t:"A_ScreenWidth",v:"docs/Variables.htm#Screen"},
  {t:"A_ScriptDir",v:"docs/Variables.htm#ScriptDir"},
  {t:"A_ScriptFullPath",v:"docs/Variables.htm#ScriptFullPath"},
  {t:"A_ScriptHwnd",v:"docs/Variables.htm#ScriptHwnd"},
  {t:"A_ScriptName",v:"docs/Variables.htm#ScriptName"},
  {t:"A_Sec",v:"docs/Variables.htm#Sec"},
  {t:"A_Space",v:"docs/Variables.htm#Space"},
  {t:"A_StartMenu",v:"docs/Variables.htm#StartMenu"},
  {t:"A_StartMenuCommon",v:"docs/Variables.htm#StartMenuCommon"},
  {t:"A_Startup",v:"docs/Variables.htm#Startup"},
  {t:"A_StartupCommon",v:"docs/Variables.htm#StartupCommon"},
  {t:"A_StringCaseSense",v:"docs/Variables.htm#StringCaseSense"},
  {t:"A_Tab",v:"docs/Variables.htm#Tab"},
  {t:"A_Temp",v:"docs/Variables.htm#Temp"},
  {t:"A_ThisFunc",v:"docs/Variables.htm#ThisFunc"},
  {t:"A_ThisHotkey",v:"docs/Variables.htm#ThisHotkey"},
  {t:"A_ThisLabel",v:"docs/Variables.htm#ThisLabel"},
  {t:"A_ThisMenu",v:"docs/Variables.htm#ThisMenu"},
  {t:"A_ThisMenuItem",v:"docs/Variables.htm#ThisMenuItem"},
  {t:"A_ThisMenuItemPos",v:"docs/Variables.htm#ThisMenuItemPos"},
  {t:"A_TickCount",v:"docs/Variables.htm#TickCount"},
  {t:"A_TimeIdle",v:"docs/Variables.htm#TimeIdle"},
  {t:"A_TimeIdlePhysical",v:"docs/Variables.htm#TimeIdlePhysical"},
  {t:"A_TimeSincePriorHotkey",v:"docs/Variables.htm#TimeSincePriorHotkey"},
  {t:"A_TimeSinceThisHotkey",v:"docs/Variables.htm#TimeSinceThisHotkey"},
  {t:"A_TitleMatchMode",v:"docs/Variables.htm#TitleMatchMode"},
  {t:"A_TitleMatchModeSpeed",v:"docs/Variables.htm#TitleMatchModeSpeed"},
  {t:"A_UserName",v:"docs/Variables.htm#UserName"},
  {t:"A_WDay",v:"docs/Variables.htm#WDay"},
  {t:"A_WinDelay",v:"docs/Variables.htm#WinDelay"},
  {t:"A_WinDir",v:"docs/Variables.htm#WinDir"},
  {t:"A_WorkingDir",v:"docs/Variables.htm#WorkingDir"},
  {t:"A_YDay",v:"docs/Variables.htm#YDay"},
  {t:"A_Year",v:"docs/Variables.htm#YYYY"},
  {t:"A_YWeek",v:"docs/Variables.htm#YWeek"},
  {t:"A_YYYY",v:"docs/Variables.htm#YYYY"},
  {t:"abbreviation expansion",v:"docs/Hotstrings.htm"},
  {t:"Abs()",v:"docs/Functions.htm#Abs"},
  {t:"absolute value, abs()",v:"docs/Functions.htm#Abs"},
  {t:"Acknowledgements",v:"docs/misc/Acknowledgements.htm"},
  {t:"ACos()",v:"docs/Functions.htm#ACos"},
  {t:"activate a window",v:"docs/commands/WinActivate.htm"},
  {t:"ActiveX controls (GUI)",v:"docs/commands/GuiControls.htm#ActiveX"},
  {t:"add",v:"docs/commands/EnvAdd.htm"},
  {t:"Address of a variable",v:"docs/Variables.htm#amp"},
  {t:"administrator privileges for scripts",v:"docs/Variables.htm#RequireAdmin"},
  {t:"ahk2exe",v:"docs/Scripts.htm#ahk2exe"},
  {t:"ahk_class",v:"docs/misc/WinTitle.htm#ahk_class"},
  {t:"ahk_exe",v:"docs/misc/WinTitle.htm#ahk_exe"},
  {t:"ahk_group",v:"docs/misc/WinTitle.htm#ahk_group"},
  {t:"ahk_id",v:"docs/misc/WinTitle.htm#ahk_id"},
  {t:"ahk_pid",v:"docs/misc/WinTitle.htm#ahk_pid"},
  {t:"AllowSameLineComments",v:"docs/commands/_AllowSameLineComments.htm"},
  {t:"alnum",v:"docs/commands/IfIs.htm"},
  {t:"alpha",v:"docs/commands/IfIs.htm"},
  {t:"AltGr",v:"docs/Hotkeys.htm#AltGr"},
  {t:"AltTab",v:"docs/Hotkeys.htm#alttab"},
  {t:"AlwaysOnTop (WinSet)",v:"docs/commands/WinSet.htm"},
  {t:"append to file",v:"docs/commands/FileAppend.htm"},
  {t:"Arrays",v:"docs/misc/Arrays.htm"},
  {t:"Asc()",v:"docs/Functions.htm#Asc"},
  {t:"ASCII conversion",v:"docs/commands/Transform.htm"},
  {t:"ASin()",v:"docs/Functions.htm#ASin"},
  {t:"assigning values to variables",v:"docs/Variables.htm#AssignOp"},
  {t:"ATan()",v:"docs/Functions.htm#ATan"},
  {t:"attributes of files and folders",v:"docs/commands/FileGetAttrib.htm"},
  {t:"auto-execute section",v:"docs/Scripts.htm"},
  {t:"auto-replace text as you type it",v:"docs/Hotstrings.htm"},
  {t:"AutoIt v2 compatibility",v:"docs/misc/AutoIt2Compat.htm"},
  {t:"AutoTrim",v:"docs/commands/AutoTrim.htm"},
  {t:"balloon tip",v:"docs/commands/TrayTip.htm"},
  {t:"base (Objects)",v:"docs/Objects.htm#Custom_Objects"},
  {t:"beep the PC speaker",v:"docs/commands/SoundBeep.htm"},
  {t:"between (check if var between two values)",v:"docs/commands/IfBetween.htm"},
  {t:"bitwise operations",v:"docs/Variables.htm#bitwise"},
  {t:"blind-mode Send",v:"docs/commands/Send.htm#blind"},
  {t:"BlockInput",v:"docs/commands/BlockInput.htm"},
  {t:"blocks (lines enclosed in braces)",v:"docs/commands/Block.htm"},
  {t:"Break",v:"docs/commands/Break.htm"},
  {t:"buffering",v:"docs/commands/_MaxThreadsBuffer.htm"},
  {t:"built-in functions",v:"docs/Functions.htm#BuiltIn"},
  {t:"built-in variables",v:"docs/Variables.htm#BuiltIn"},
  {t:"Button controls (GUI)",v:"docs/commands/GuiControls.htm#Button"},
  {t:"button list (mouse and joystick)",v:"docs/KeyList.htm"},
  {t:"button state",v:"docs/commands/GetKeyState.htm"},
  {t:"ByRef",v:"docs/Functions.htm#ByRef"},
  {t:"callbacks",v:"docs/commands/RegisterCallback.htm"},
  {t:"case sensitive strings",v:"docs/commands/StringCaseSense.htm"},
  {t:"Catch",v:"docs/commands/Catch.htm"},
  {t:"Ceil()",v:"docs/Functions.htm#Ceil"},
  {t:"Changelog",v:"docs/AHKL_ChangeLog.htm"},
  {t:"Checkbox controls (GUI)",v:"docs/commands/GuiControls.htm#Checkbox"},
  {t:"choose file",v:"docs/commands/FileSelectFile.htm"},
  {t:"choose folder",v:"docs/commands/FileSelectFolder.htm"},
  {t:"Chr()",v:"docs/Functions.htm#Chr"},
  {t:"class (Objects)",v:"docs/Objects.htm#Custom_Classes"},
  {t:"class name of a window",v:"docs/commands/WinGetClass.htm"},
  {t:"Click a mouse button",v:"docs/commands/Click.htm"},
  {t:"Clipboard",v:"docs/misc/Clipboard.htm"},
  {t:"ClipboardAll",v:"docs/misc/Clipboard.htm#ClipboardAll"},
  {t:"ClipWait",v:"docs/commands/ClipWait.htm"},
  {t:"Clone()",v:"docs/objects/Object.htm#Clone"},
  {t:"close a window",v:"docs/commands/WinClose.htm"},
  {t:"CLSID List (My Computer, etc.)",v:"docs/misc/CLSID-List.htm"},
  {t:"color names, RGB/HTML",v:"docs/commands/Progress.htm#colors"},
  {t:"color of pixels",v:"docs/commands/PixelSearch.htm"},
  {t:"COM",v:"docs/commands/ComObjCreate.htm"},
  {t:"ComboBox controls (GUI)",v:"docs/commands/GuiControls.htm#ComboBox"},
  {t:"comma operator (multi-statement)",v:"docs/Variables.htm#comma"},
  {t:"command line parameters",v:"docs/Scripts.htm#cmd"},
  {t:"commands, alphabetical list",v:"docs/commands/index.htm"},
  {t:"CommentFlag",v:"docs/commands/_CommentFlag.htm"},
  {t:"comments in scripts",v:"docs/Scripts.htm"},
  {t:"ComObj...()",v:"docs/commands/ComObjActive.htm"},
  {t:"ComObjArray()",v:"docs/commands/ComObjArray.htm"},
  {t:"ComObjConnect()",v:"docs/commands/ComObjConnect.htm"},
  {t:"ComObjCreate()",v:"docs/commands/ComObjCreate.htm"},
  {t:"ComObjError()",v:"docs/commands/ComObjError.htm"},
  {t:"ComObjFlags()",v:"docs/commands/ComObjFlags.htm"},
  {t:"ComObjGet()",v:"docs/commands/ComObjGet.htm"},
  {t:"ComObjQuery()",v:"docs/commands/ComObjQuery.htm"},
  {t:"ComObjType()",v:"docs/commands/ComObjType.htm"},
  {t:"ComObjValue()",v:"docs/commands/ComObjValue.htm"},
  {t:"Compatibility",v:"docs/Compat.htm"},
  {t:"compile a script",v:"docs/Scripts.htm#ahk2exe"},
  {t:"ComSpec",v:"docs/Variables.htm#ComSpec"},
  {t:"concatenate, in expressions",v:"docs/Variables.htm#concat"},
  {t:"concatenate, script lines",v:"docs/Scripts.htm#continuation"},
  {t:"context menu (GUI)",v:"docs/commands/Gui.htm#GuiContextMenu"},
  {t:"continuation sections",v:"docs/Scripts.htm#continuation"},
  {t:"Continue",v:"docs/commands/Continue.htm"},
  {t:"Control",v:"docs/commands/Control.htm"},
  {t:"ControlClick",v:"docs/commands/ControlClick.htm"},
  {t:"ControlFocus",v:"docs/commands/ControlFocus.htm"},
  {t:"ControlGet",v:"docs/commands/ControlGet.htm"},
  {t:"ControlGetFocus",v:"docs/commands/ControlGetFocus.htm"},
  {t:"ControlGetPos",v:"docs/commands/ControlGetPos.htm"},
  {t:"ControlGetText",v:"docs/commands/ControlGetText.htm"},
  {t:"ControlMove",v:"docs/commands/ControlMove.htm"},
  {t:"ControlSend",v:"docs/commands/ControlSend.htm"},
  {t:"ControlSendRaw",v:"docs/commands/ControlSend.htm"},
  {t:"ControlSetText",v:"docs/commands/ControlSetText.htm"},
  {t:"convert a script to an EXE",v:"docs/Scripts.htm#ahk2exe"},
  {t:"coordinates",v:"docs/commands/CoordMode.htm"},
  {t:"CoordMode",v:"docs/commands/CoordMode.htm"},
  {t:"copy file",v:"docs/commands/FileCopy.htm"},
  {t:"copy folder/directory",v:"docs/commands/FileCopyDir.htm"},
  {t:"Cos()",v:"docs/Functions.htm#Cos"},
  {t:"create file",v:"docs/commands/FileAppend.htm"},
  {t:"create folder/directory",v:"docs/commands/FileCreateDir.htm"},
  {t:"Critical",v:"docs/commands/Critical.htm"},
  {t:"current directory",v:"docs/commands/SetWorkingDir.htm"},
  {t:"current thread",v:"docs/misc/Threads.htm"},
  {t:"cursor shape",v:"docs/Variables.htm#Cursor"},
  {t:"Custom controls (GUI)",v:"docs/commands/GuiControls.htm#Custom"},
  {t:"dates and times (compare)",v:"docs/commands/EnvSub.htm"},
  {t:"dates and times (math)",v:"docs/commands/EnvAdd.htm"},
  {t:"dates and times (of files)",v:"docs/commands/FileSetTime.htm"},
  {t:"DateTime controls (GUI)",v:"docs/commands/GuiControls.htm#DateTime"},
  {t:"debugger",v:"docs/commands/OutputDebug.htm"},
  {t:"debugging a script",v:"docs/Scripts.htm#debug"},
  {t:"decimal places",v:"docs/commands/SetFormat.htm"},
  {t:"delete files",v:"docs/commands/FileDelete.htm"},
  {t:"delete folder/directory",v:"docs/commands/FileRemoveDir.htm"},
  {t:"Delimiter",v:"docs/commands/_EscapeChar.htm"},
  {t:"DerefChar",v:"docs/commands/_EscapeChar.htm"},
  {t:"DetectHiddenText",v:"docs/commands/DetectHiddenText.htm"},
  {t:"DetectHiddenWindows",v:"docs/commands/DetectHiddenWindows.htm"},
  {t:"dialog FileSelectFile",v:"docs/commands/FileSelectFile.htm"},
  {t:"dialog FileSelectFolder",v:"docs/commands/FileSelectFolder.htm"},
  {t:"dialog InputBox",v:"docs/commands/InputBox.htm"},
  {t:"dialog MsgBox",v:"docs/commands/MsgBox.htm"},
  {t:"digit",v:"docs/commands/IfIs.htm"},
  {t:"disk space",v:"docs/commands/DriveSpaceFree.htm"},
  {t:"divide (math)",v:"docs/Variables.htm#divide"},
  {t:"DllCall()",v:"docs/commands/DllCall.htm"},
  {t:"download a file",v:"docs/commands/URLDownloadToFile.htm"},
  {t:"DPI scaling",v:"docs/commands/Gui.htm#DPIScale"},
  {t:"drag and drop (GUI windows)",v:"docs/commands/Gui.htm#GuiDropFiles"},
  {t:"drag the mouse",v:"docs/commands/MouseClickDrag.htm"},
  {t:"Drive",v:"docs/commands/Drive.htm"},
  {t:"DriveGet",v:"docs/commands/DriveGet.htm"},
  {t:"DriveSpaceFree",v:"docs/commands/DriveSpaceFree.htm"},
  {t:"DropDownList controls (GUI)",v:"docs/commands/GuiControls.htm#DropDownList"},
  {t:"Edit",v:"docs/commands/Edit.htm"},
  {t:"Edit controls (GUI)",v:"docs/commands/GuiControls.htm#Edit"},
  {t:"Else",v:"docs/commands/Else.htm"},
  {t:"Enumerator object",v:"docs/objects/Enumerator.htm"},
  {t:"EnvAdd",v:"docs/commands/EnvAdd.htm"},
  {t:"EnvDiv",v:"docs/commands/EnvDiv.htm"},
  {t:"EnvGet",v:"docs/commands/EnvGet.htm"},
  {t:"environment variables",v:"docs/Variables.htm#env"},
  {t:"environment variables (change them)",v:"docs/commands/EnvSet.htm"},
  {t:"EnvMult",v:"docs/commands/EnvMult.htm"},
  {t:"EnvSet",v:"docs/commands/EnvSet.htm"},
  {t:"EnvSub",v:"docs/commands/EnvSub.htm"},
  {t:"EnvUpdate",v:"docs/commands/EnvUpdate.htm"},
  {t:"ErrorLevel",v:"docs/misc/ErrorLevel.htm"},
  {t:"ErrorStdOut",v:"docs/commands/_ErrorStdOut.htm"},
  {t:"escape sequence",v:"docs/commands/_EscapeChar.htm"},
  {t:"EscapeChar",v:"docs/commands/_EscapeChar.htm"},
  {t:"Exception()",v:"docs/commands/Throw.htm#Exception"},
  {t:"Exit",v:"docs/commands/Exit.htm"},
  {t:"ExitApp",v:"docs/commands/ExitApp.htm"},
  {t:"Exp()",v:"docs/Functions.htm#Exp"},
  {t:"expressions",v:"docs/Variables.htm#Expressions"},
  {t:"ExtractInteger -> NumGet()",v:"docs/commands/NumGet.htm"},
  {t:"False",v:"docs/Variables.htm#Boolean"},
  {t:"FAQ (Frequently Asked Questions)",v:"docs/FAQ.htm"},
  {t:"file attributes",v:"docs/commands/FileSetAttrib.htm"},
  {t:"File object",v:"docs/objects/File.htm"},
  {t:"file or folder (does it exist)",v:"docs/commands/IfExist.htm"},
  {t:"file pattern",v:"docs/commands/LoopFile.htm"},
  {t:"file, creating",v:"docs/commands/FileAppend.htm"},
  {t:"file, reading",v:"docs/commands/LoopReadFile.htm"},
  {t:"file, writing/appending",v:"docs/commands/FileAppend.htm"},
  {t:"FileAppend",v:"docs/commands/FileAppend.htm"},
  {t:"FileCopy",v:"docs/commands/FileCopy.htm"},
  {t:"FileCopyDir",v:"docs/commands/FileCopyDir.htm"},
  {t:"FileCreateDir",v:"docs/commands/FileCreateDir.htm"},
  {t:"FileCreateShortcut",v:"docs/commands/FileCreateShortcut.htm"},
  {t:"FileDelete",v:"docs/commands/FileDelete.htm"},
  {t:"FileEncoding",v:"docs/commands/FileEncoding.htm"},
  {t:"FileExist()",v:"docs/Functions.htm#FileExist"},
  {t:"FileGetAttrib",v:"docs/commands/FileGetAttrib.htm"},
  {t:"FileGetShortcut",v:"docs/commands/FileGetShortcut.htm"},
  {t:"FileGetSize",v:"docs/commands/FileGetSize.htm"},
  {t:"FileGetTime",v:"docs/commands/FileGetTime.htm"},
  {t:"FileGetVersion",v:"docs/commands/FileGetVersion.htm"},
  {t:"FileInstall",v:"docs/commands/FileInstall.htm"},
  {t:"FileMove",v:"docs/commands/FileMove.htm"},
  {t:"FileMoveDir",v:"docs/commands/FileMoveDir.htm"},
  {t:"FileOpen",v:"docs/commands/FileOpen.htm"},
  {t:"FileRead",v:"docs/commands/FileRead.htm"},
  {t:"FileReadLine",v:"docs/commands/FileReadLine.htm"},
  {t:"FileRecycle",v:"docs/commands/FileRecycle.htm"},
  {t:"FileRecycleEmpty",v:"docs/commands/FileRecycleEmpty.htm"},
  {t:"FileRemoveDir",v:"docs/commands/FileRemoveDir.htm"},
  {t:"FileSelectFile",v:"docs/commands/FileSelectFile.htm"},
  {t:"FileSelectFolder",v:"docs/commands/FileSelectFolder.htm"},
  {t:"FileSetAttrib",v:"docs/commands/FileSetAttrib.htm"},
  {t:"FileSetTime",v:"docs/commands/FileSetTime.htm"},
  {t:"Finally",v:"docs/commands/Finally.htm"},
  {t:"find a file",v:"docs/commands/IfExist.htm"},
  {t:"find a string",v:"docs/commands/StringGetPos.htm"},
  {t:"find a window",v:"docs/commands/WinExist.htm"},
  {t:"floating point (check if it is one)",v:"docs/commands/IfIs.htm"},
  {t:"floating point (SetFormat)",v:"docs/commands/SetFormat.htm"},
  {t:"Floor()",v:"docs/Functions.htm#Floor"},
  {t:"focus",v:"docs/commands/ControlFocus.htm"},
  {t:"folder/directory copy",v:"docs/commands/FileCopyDir.htm"},
  {t:"folder/directory create",v:"docs/commands/FileCreateDir.htm"},
  {t:"folder/directory move",v:"docs/commands/FileMoveDir.htm"},
  {t:"folder/directory remove",v:"docs/commands/FileRemoveDir.htm"},
  {t:"folder/directory select",v:"docs/commands/FileSelectFolder.htm"},
  {t:"Fonts",v:"docs/misc/FontsStandard.htm"},
  {t:"For-loop",v:"docs/commands/For.htm"},
  {t:"format, numbers",v:"docs/commands/SetFormat.htm"},
  {t:"FormatTime",v:"docs/commands/FormatTime.htm"},
  {t:"free space",v:"docs/commands/DriveSpaceFree.htm"},
  {t:"FTP uploading example",v:"docs/commands/FileAppend.htm#FTP"},
  {t:"functions (defining and calling)",v:"docs/Functions.htm"},
  {t:"Functions (libraries)",v:"docs/Functions.htm#lib"},
  {t:"Func object",v:"docs/objects/Func.htm"},
  {t:"Func()",v:"docs/Objects.htm#Function_References"},
  {t:"g-label (responding to GUI events)",v:"docs/commands/Gui.htm#label"},
  {t:"game automation",v:"docs/commands/PixelSearch.htm"},
  {t:"GetAddress()",v:"docs/objects/Object.htm#GetAddress"},
  {t:"GetCapacity()",v:"docs/objects/Object.htm#GetCapacity"},
  {t:"GetKeyName()",v:"docs/Functions.htm#GetKeyName"},
  {t:"GetKeySC()",v:"docs/Functions.htm#GetKeyName"},
  {t:"GetKeyState",v:"docs/commands/GetKeyState.htm"},
  {t:"GetKeyState()",v:"docs/Functions.htm#GetKeyState"},
  {t:"GetKeyVK()",v:"docs/Functions.htm#GetKeyName"},
  {t:"global variables in functions",v:"docs/Functions.htm#Global"},
  {t:"Gosub",v:"docs/commands/Gosub.htm"},
  {t:"Goto",v:"docs/commands/Goto.htm"},
  {t:"GroupActivate",v:"docs/commands/GroupActivate.htm"},
  {t:"GroupAdd",v:"docs/commands/GroupAdd.htm"},
  {t:"GroupBox controls (GUI)",v:"docs/commands/GuiControls.htm#GroupBox"},
  {t:"GroupClose",v:"docs/commands/GroupClose.htm"},
  {t:"GroupDeactivate",v:"docs/commands/GroupDeactivate.htm"},
  {t:"Gui",v:"docs/commands/Gui.htm"},
  {t:"Gui control types",v:"docs/commands/GuiControls.htm"},
  {t:"Gui styles reference",v:"docs/misc/Styles.htm"},
  {t:"GuiClose (label)",v:"docs/commands/Gui.htm#GuiClose"},
  {t:"GuiContextMenu (label)",v:"docs/commands/Gui.htm#GuiContextMenu"},
  {t:"GuiControl",v:"docs/commands/GuiControl.htm"},
  {t:"GuiControlGet",v:"docs/commands/GuiControlGet.htm"},
  {t:"GuiDropFiles (label)",v:"docs/commands/Gui.htm#GuiDropFiles"},
  {t:"GuiEscape (label)",v:"docs/commands/Gui.htm#GuiEscape"},
  {t:"GuiSize (label)",v:"docs/commands/Gui.htm#GuiSize"},
  {t:"HasKey()",v:"docs/objects/Object.htm#HasKey"},
  {t:"hexadecimal format",v:"docs/commands/SetFormat.htm"},
  {t:"hibernate or suspend",v:"docs/commands/Shutdown.htm#Suspend"},
  {t:"hidden text",v:"docs/commands/DetectHiddenText.htm"},
  {t:"hidden windows",v:"docs/commands/DetectHiddenWindows.htm"},
  {t:"HKEY_CLASSES_ROOT",v:"docs/commands/RegRead.htm"},
  {t:"HKEY_CURRENT_CONFIG",v:"docs/commands/RegRead.htm"},
  {t:"HKEY_CURRENT_USER",v:"docs/commands/RegRead.htm"},
  {t:"HKEY_LOCAL_MACHINE",v:"docs/commands/RegRead.htm"},
  {t:"HKEY_USERS",v:"docs/commands/RegRead.htm"},
  {t:"hook",v:"docs/commands/_InstallKeybdHook.htm"},
  {t:"Hotkey",v:"docs/Hotkeys.htm"},
  {t:"Hotkey command",v:"docs/commands/Hotkey.htm"},
  {t:"Hotkey controls (GUI)",v:"docs/commands/GuiControls.htm#Hotkey"},
  {t:"Hotkey, ListHotkeys",v:"docs/commands/ListHotkeys.htm"},
  {t:"Hotkey, other features",v:"docs/HotkeyFeatures.htm"},
  {t:"HotkeyInterval",v:"docs/commands/_HotkeyInterval.htm"},
  {t:"HotkeyModifierTimeout",v:"docs/commands/_HotkeyModifierTimeout.htm"},
  {t:"hotstrings and auto-replace",v:"docs/Hotstrings.htm"},
  {t:"HTML color names",v:"docs/commands/Progress.htm#colors"},
  {t:"HWND (of a control)",v:"docs/commands/ControlGet.htm#Hwnd"},
  {t:"HWND (of a window)",v:"docs/misc/WinTitle.htm#ahk_id"},
  {t:"icon, changing",v:"docs/commands/Menu.htm#Icon"},
  {t:"ID number for a window",v:"docs/commands/WinGet.htm"},
  {t:"If",v:"docs/commands/IfEqual.htm"},
  {t:"If (expression)",v:"docs/commands/IfExpression.htm"},
  {t:"If var [not] between Low and High",v:"docs/commands/IfBetween.htm"},
  {t:"If var [not] in/contains MatchList",v:"docs/commands/IfIn.htm"},
  {t:"If var is [not] type",v:"docs/commands/IfIs.htm"},
  {t:"IfEqual",v:"docs/commands/IfEqual.htm"},
  {t:"IfExist",v:"docs/commands/IfExist.htm"},
  {t:"IfGreater",v:"docs/commands/IfEqual.htm"},
  {t:"IfGreaterOrEqual",v:"docs/commands/IfEqual.htm"},
  {t:"IfInString",v:"docs/commands/IfInString.htm"},
  {t:"IfLess",v:"docs/commands/IfEqual.htm"},
  {t:"IfLessOrEqual",v:"docs/commands/IfEqual.htm"},
  {t:"IfMsgBox",v:"docs/commands/IfMsgBox.htm"},
  {t:"IfNotEqual",v:"docs/commands/IfEqual.htm"},
  {t:"IfNotExist",v:"docs/commands/IfExist.htm"},
  {t:"IfNotInString",v:"docs/commands/IfInString.htm"},
  {t:"IfWinActive",v:"docs/commands/WinActive.htm"},
  {t:"IfWinExist",v:"docs/commands/WinExist.htm"},
  {t:"IfWinNotActive",v:"docs/commands/WinActive.htm"},
  {t:"IfWinNotExist",v:"docs/commands/WinExist.htm"},
  {t:"IL_Add()",v:"docs/commands/ListView.htm#IL_Add"},
  {t:"IL_Create()",v:"docs/commands/ListView.htm#IL_Create"},
  {t:"IL_Destroy()",v:"docs/commands/ListView.htm#IL_Destroy"},
  {t:"Image Lists (GUI)",v:"docs/commands/ListView.htm#IL"},
  {t:"ImageSearch",v:"docs/commands/ImageSearch.htm"},
  {t:"Include",v:"docs/commands/_Include.htm"},
  {t:"infrared remote controls",v:"docs/scripts/WinLIRC.htm"},
  {t:"IniDelete",v:"docs/commands/IniDelete.htm"},
  {t:"IniRead",v:"docs/commands/IniRead.htm"},
  {t:"IniWrite",v:"docs/commands/IniWrite.htm"},
  {t:"Input",v:"docs/commands/Input.htm"},
  {t:"InputBox",v:"docs/commands/InputBox.htm"},
  {t:"Insert()",v:"docs/objects/Object.htm#Insert"},
  {t:"InsertInteger -> NumPut()",v:"docs/commands/NumPut.htm"},
  {t:"Install",v:"docs/commands/FileInstall.htm"},
  {t:"Installer Options",v:"docs/Scripts.htm#install"},
  {t:"InstallKeybdHook",v:"docs/commands/_InstallKeybdHook.htm"},
  {t:"InstallMouseHook",v:"docs/commands/_InstallMouseHook.htm"},
  {t:"InStr()",v:"docs/Functions.htm#InStr"},
  {t:"integer (check if it is one)",v:"docs/commands/IfIs.htm"},
  {t:"integer (SetFormat)",v:"docs/commands/SetFormat.htm"},
  {t:"Interrupt",v:"docs/commands/Thread.htm"},
  {t:"IsByRef()",v:"docs/Functions.htm#IsByRef"},
  {t:"IsFunc()",v:"docs/Functions.htm#IsFunc"},
  {t:"IsLabel()",v:"docs/Functions.htm#IsLabel"},
  {t:"IsObject()",v:"docs/Objects.htm"},
  {t:"Join (continuation sections)",v:"docs/Scripts.htm#Join"},
  {t:"Joystick",v:"docs/KeyList.htm#Joystick"},
  {t:"JScript, embedded/inline",v:"docs/commands/DllCall.htm#COM"},
  {t:"key list (keyboard, mouse, joystick)",v:"docs/KeyList.htm"},
  {t:"key state",v:"docs/commands/GetKeyState.htm"},
  {t:"keyboard hook",v:"docs/commands/_InstallKeybdHook.htm"},
  {t:"KeyHistory",v:"docs/commands/KeyHistory.htm"},
  {t:"keystrokes, sending",v:"docs/commands/Send.htm"},
  {t:"KeyWait",v:"docs/commands/KeyWait.htm"},
  {t:"labels",v:"docs/misc/Labels.htm"},
  {t:"last found window",v:"docs/misc/WinTitle.htm#LastFoundWindow"},
  {t:"length of a string",v:"docs/commands/StringLen.htm"},
  {t:"libraries of functions",v:"docs/Functions.htm#lib"},
  {t:"license",v:"docs/license.htm"},
  {t:"line continuation",v:"docs/Scripts.htm#continuation"},
  {t:"ListBox controls (GUI)",v:"docs/commands/GuiControls.htm#ListBox"},
  {t:"ListHotkeys",v:"docs/commands/ListHotkeys.htm"},
  {t:"ListLines",v:"docs/commands/ListLines.htm"},
  {t:"ListVars",v:"docs/commands/ListVars.htm"},
  {t:"ListView controls (GUI)",v:"docs/commands/ListView.htm"},
  {t:"ListView, getting text from",v:"docs/commands/ControlGet.htm#List"},
  {t:"Ln()",v:"docs/Functions.htm#Ln"},
  {t:"lnk (link/shortcut) file",v:"docs/commands/FileCreateShortcut.htm"},
  {t:"local variables",v:"docs/Functions.htm#Locals"},
  {t:"Locale",v:"docs/commands/StringCaseSense.htm#Locale"},
  {t:"Log()",v:"docs/Functions.htm#Log"},
  {t:"logarithm, log()",v:"docs/Functions.htm#Log"},
  {t:"logoff",v:"docs/commands/Shutdown.htm"},
  {t:"long file name (converting to)",v:"docs/commands/LoopFile.htm#LoopFileLongPath"},
  {t:"Loop",v:"docs/commands/Loop.htm"},
  {t:"Loop (registry)",v:"docs/commands/LoopReg.htm"},
  {t:"Loop (until)",v:"docs/commands/Until.htm"},
  {t:"Loop (while)",v:"docs/commands/While.htm"},
  {t:"Loop, FilePattern",v:"docs/commands/LoopFile.htm"},
  {t:"Loop, Parse a string",v:"docs/commands/LoopParse.htm"},
  {t:"Loop, Read file contents",v:"docs/commands/LoopReadFile.htm"},
  {t:"lParam",v:"docs/commands/PostMessage.htm"},
  {t:"LTrim (continuation sections)",v:"docs/Scripts.htm#LTrim"},
  {t:"LTrim()",v:"docs/commands/Trim.htm"},
  {t:"LV_Add()",v:"docs/commands/ListView.htm#LV_Add"},
  {t:"LV_Delete()",v:"docs/commands/ListView.htm#LV_Delete"},
  {t:"LV_DeleteCol()",v:"docs/commands/ListView.htm#LV_DeleteCol"},
  {t:"LV_GetCount()",v:"docs/commands/ListView.htm#LV_GetCount"},
  {t:"LV_GetNext()",v:"docs/commands/ListView.htm#LV_GetNext"},
  {t:"LV_GetText()",v:"docs/commands/ListView.htm#LV_GetText"},
  {t:"LV_Insert()",v:"docs/commands/ListView.htm#LV_Insert"},
  {t:"LV_InsertCol()",v:"docs/commands/ListView.htm#LV_InsertCol"},
  {t:"LV_Modify()",v:"docs/commands/ListView.htm#LV_Modify"},
  {t:"LV_ModifyCol()",v:"docs/commands/ListView.htm#LV_ModifyCol"},
  {t:"LV_SetImageList()",v:"docs/commands/ListView.htm#LV_SetImageList"},
  {t:"macro",v:"docs/misc/Macros.htm"},
  {t:"math operations (expressions)",v:"docs/Variables.htm#Expressions"},
  {t:"MaxHotkeysPerInterval",v:"docs/commands/_MaxHotkeysPerInterval.htm"},
  {t:"MaxIndex()",v:"docs/objects/Object.htm#MinMaxIndex"},
  {t:"MaxThreads",v:"docs/commands/_MaxThreads.htm"},
  {t:"MaxThreadsBuffer",v:"docs/commands/_MaxThreadsBuffer.htm"},
  {t:"MaxThreadsPerHotkey",v:"docs/commands/_MaxThreadsPerHotkey.htm"},
  {t:"Menu",v:"docs/commands/Menu.htm"},
  {t:"Menu Bar (GUI)",v:"docs/commands/Gui.htm#Menu"},
  {t:"Menu Icon",v:"docs/commands/Menu.htm#MenuIcon"},
  {t:"message list (WM_*)",v:"docs/misc/SendMessageList.htm"},
  {t:"messages, receiving",v:"docs/commands/OnMessage.htm"},
  {t:"messages, sending",v:"docs/commands/PostMessage.htm"},
  {t:"meta-functions (Objects)",v:"docs/Objects.htm#Meta_Functions"},
  {t:"MinIndex()",v:"docs/objects/Object.htm#MinMaxIndex"},
  {t:"Mod()",v:"docs/Functions.htm#Mod"},
  {t:"modal (always on top)",v:"docs/commands/MsgBox.htm"},
  {t:"modulo, mod()",v:"docs/Functions.htm#Mod"},
  {t:"MonthCal controls (GUI)",v:"docs/commands/GuiControls.htm#MonthCal"},
  {t:"mouse hook",v:"docs/commands/_InstallMouseHook.htm"},
  {t:"mouse speed",v:"docs/commands/SetDefaultMouseSpeed.htm"},
  {t:"mouse wheel",v:"docs/commands/Click.htm"},
  {t:"MouseClick",v:"docs/commands/MouseClick.htm"},
  {t:"MouseClickDrag",v:"docs/commands/MouseClickDrag.htm"},
  {t:"MouseGetPos",v:"docs/commands/MouseGetPos.htm"},
  {t:"MouseMove",v:"docs/commands/MouseMove.htm"},
  {t:"move a window",v:"docs/commands/WinMove.htm"},
  {t:"move file",v:"docs/commands/FileMove.htm"},
  {t:"move folder/directory",v:"docs/commands/FileMoveDir.htm"},
  {t:"MsgBox",v:"docs/commands/MsgBox.htm"},
  {t:"multiply",v:"docs/commands/EnvMult.htm"},
  {t:"mute (changing it)",v:"docs/commands/SoundSet.htm"},
  {t:"NewEnum()",v:"docs/objects/Object.htm#NewEnum"},
  {t:"NoTimers",v:"docs/commands/Thread.htm"},
  {t:"NoTrayIcon",v:"docs/commands/_NoTrayIcon.htm"},
  {t:"number",v:"docs/commands/IfIs.htm"},
  {t:"number format",v:"docs/commands/SetFormat.htm"},
  {t:"NumGet",v:"docs/commands/NumGet.htm"},
  {t:"NumPut",v:"docs/commands/NumPut.htm"},
  {t:"Objects (general information)",v:"docs/Objects.htm"},
  {t:"Object functions and methods",v:"docs/objects/Object.htm"},
  {t:"ObjAddRef()",v:"docs/commands/ObjAddRef.htm"},
  {t:"ObjClone()",v:"docs/objects/Object.htm#Clone"},
  {t:"ObjGetAddress()",v:"docs/objects/Object.htm#GetAddress"},
  {t:"ObjGetCapacity()",v:"docs/objects/Object.htm#GetCapacity"},
  {t:"ObjHasKey()",v:"docs/objects/Object.htm#HasKey"},
  {t:"ObjInsert()",v:"docs/objects/Object.htm#Insert"},
  {t:"ObjMaxIndex()",v:"docs/objects/Object.htm#MinMaxIndex"},
  {t:"ObjMinIndex()",v:"docs/objects/Object.htm#MinMaxIndex"},
  {t:"ObjNewEnum()",v:"docs/objects/Object.htm#NewEnum"},
  {t:"ObjRelease()",v:"docs/commands/ObjAddRef.htm"},
  {t:"ObjRemove()",v:"docs/objects/Object.htm#Remove"},
  {t:"ObjSetCapacity()",v:"docs/objects/Object.htm#SetCapacity"},
  {t:"OnClipboardChange (label)",v:"docs/misc/Clipboard.htm#OnClipboardChange"},
  {t:"OnExit",v:"docs/commands/OnExit.htm"},
  {t:"OnMessage()",v:"docs/commands/OnMessage.htm"},
  {t:"open file",v:"docs/commands/FileReadLine.htm"},
  {t:"operators in expressions",v:"docs/Variables.htm#Operators"},
  {t:"OutputDebug",v:"docs/commands/OutputDebug.htm"},
  {t:"OwnDialogs (GUI)",v:"docs/commands/Gui.htm#OwnDialogs"},
  {t:"Owner of a GUI window",v:"docs/commands/Gui.htm#Owner"},
  {t:"parameters passed into a script",v:"docs/Scripts.htm#cmd"},
  {t:"parse a string (Loop)",v:"docs/commands/LoopParse.htm"},
  {t:"parse a string (StringSplit)",v:"docs/commands/StringSplit.htm"},
  {t:"Pause",v:"docs/commands/Pause.htm"},
  {t:"performance of scripts",v:"docs/misc/Performance.htm"},
  {t:"Picture controls (GUI)",v:"docs/commands/GuiControls.htm#Picture"},
  {t:"PID (Process ID)",v:"docs/commands/Process.htm"},
  {t:"PixelGetColor",v:"docs/commands/PixelGetColor.htm"},
  {t:"PixelSearch",v:"docs/commands/PixelSearch.htm"},
  {t:"play a sound or video file",v:"docs/commands/SoundPlay.htm"},
  {t:"PostMessage",v:"docs/commands/PostMessage.htm"},
  {t:"power (exponentiation)",v:"docs/Variables.htm#pow"},
  {t:"prefix and suffix keys",v:"docs/Hotkeys.htm"},
  {t:"print a file",v:"docs/commands/Run.htm"},
  {t:"priority of a process",v:"docs/commands/Process.htm"},
  {t:"priority of a thread",v:"docs/commands/Thread.htm"},
  {t:"Process",v:"docs/commands/Process.htm"},
  {t:"ProgramFiles",v:"docs/Variables.htm#ProgramFiles"},
  {t:"Progress",v:"docs/commands/Progress.htm"},
  {t:"Progress controls (GUI)",v:"docs/commands/GuiControls.htm#Progress"},
  {t:"properties of a file or folder",v:"docs/commands/Run.htm"},
  {t:"quit script",v:"docs/commands/ExitApp.htm"},
  {t:"Radio controls (GUI)",v:"docs/commands/GuiControls.htm#Radio"},
  {t:"Random",v:"docs/commands/Random.htm"},
  {t:"read file",v:"docs/commands/FileReadLine.htm"},
  {t:"READONLY",v:"docs/commands/FileGetAttrib.htm"},
  {t:"reboot",v:"docs/commands/Shutdown.htm"},
  {t:"Reference-Counting",v:"docs/Objects.htm#Refs"},
  {t:"REG_BINARY",v:"docs/commands/RegRead.htm"},
  {t:"REG_DWORD",v:"docs/commands/RegRead.htm"},
  {t:"REG_EXPAND_SZ",v:"docs/commands/RegRead.htm"},
  {t:"REG_MULTI_SZ",v:"docs/commands/RegRead.htm"},
  {t:"REG_SZ",v:"docs/commands/RegRead.htm"},
  {t:"RegDelete",v:"docs/commands/RegDelete.htm"},
  {t:"RegEx: Quick Reference",v:"docs/misc/RegEx-QuickRef.htm"},
  {t:"RegEx: Callouts",v:"docs/misc/RegExCallout.htm"},
  {t:"RegEx: SetTitleMatchMode RegEx",v:"docs/commands/SetTitleMatchMode.htm#RegEx"},
  {t:"RegExMatch()",v:"docs/commands/RegExMatch.htm"},
  {t:"RegExReplace()",v:"docs/commands/RegExReplace.htm"},
  {t:"RegisterCallback()",v:"docs/commands/RegisterCallback.htm"},
  {t:"registry loop",v:"docs/commands/LoopReg.htm"},
  {t:"RegRead",v:"docs/commands/RegRead.htm"},
  {t:"Regular Expression Callouts",v:"docs/misc/RegExCallout.htm"},
  {t:"regular expressions: Quick Reference",v:"docs/misc/RegEx-QuickRef.htm"},
  {t:"regular expressions: RegExMatch()",v:"docs/commands/RegExMatch.htm"},
  {t:"regular expressions: RegExReplace()",v:"docs/commands/RegExReplace.htm"},
  {t:"regular expressions: SetTitleMatchMode RegEx",v:"docs/commands/SetTitleMatchMode.htm#RegEx"},
  {t:"RegWrite",v:"docs/commands/RegWrite.htm"},
  {t:"Reload",v:"docs/commands/Reload.htm"},
  {t:"remap joystick",v:"docs/misc/RemapJoystick.htm"},
  {t:"remap keys or mouse buttons",v:"docs/misc/Remap.htm"},
  {t:"remote controls, hand-held",v:"docs/scripts/WinLIRC.htm"},
  {t:"remove folder/directory",v:"docs/commands/FileRemoveDir.htm"},
  {t:"Remove()",v:"docs/objects/Object.htm#Remove"},
  {t:"rename file",v:"docs/commands/FileMove.htm"},
  {t:"resize a window",v:"docs/commands/WinMove.htm"},
  {t:"restart the computer",v:"docs/commands/Shutdown.htm"},
  {t:"Return",v:"docs/commands/Return.htm"},
  {t:"RGB color names",v:"docs/commands/Progress.htm#colors"},
  {t:"RGB colors",v:"docs/commands/PixelGetColor.htm"},
  {t:"Round()",v:"docs/Functions.htm#Round"},
  {t:"rounding a number",v:"docs/Functions.htm#Round"},
  {t:"RTrim()",v:"docs/commands/Trim.htm"},
  {t:"Run",v:"docs/commands/Run.htm"},
  {t:"RunAs",v:"docs/commands/RunAs.htm"},
  {t:"RunWait",v:"docs/commands/Run.htm"},
  {t:"SB_SetIcon()",v:"docs/commands/GuiControls.htm#SB_SetIcon"},
  {t:"SB_SetParts()",v:"docs/commands/GuiControls.htm#SB_SetParts"},
  {t:"SB_SetText()",v:"docs/commands/GuiControls.htm#SB_SetText"},
  {t:"scan code",v:"docs/commands/Send.htm#vk"},
  {t:"scientific notation",v:"docs/commands/SetFormat.htm#sci"},
  {t:"Script Showcase",v:"docs/scripts/index.htm"},
  {t:"Scripts",v:"docs/Scripts.htm"},
  {t:"select file",v:"docs/commands/FileSelectFile.htm"},
  {t:"select folder",v:"docs/commands/FileSelectFolder.htm"},
  {t:"Send",v:"docs/commands/Send.htm"},
  {t:"SendEvent",v:"docs/commands/Send.htm#SendEvent"},
  {t:"sending data between scripts",v:"docs/commands/OnMessage.htm#SendString"},
  {t:"SendInput",v:"docs/commands/Send.htm#SendInputDetail"},
  {t:"SendLevel",v:"docs/commands/SendLevel.htm"},
  {t:"SendMessage",v:"docs/commands/PostMessage.htm"},
  {t:"SendMode",v:"docs/commands/SendMode.htm"},
  {t:"SendPlay",v:"docs/commands/Send.htm#SendPlayDetail"},
  {t:"SendRaw",v:"docs/commands/Send.htm"},
  {t:"SetBatchLines",v:"docs/commands/SetBatchLines.htm"},
  {t:"SetCapacity()",v:"docs/objects/Object.htm#SetCapacity"},
  {t:"SetCapsLockState",v:"docs/commands/SetNumScrollCapsLockState.htm"},
  {t:"SetControlDelay",v:"docs/commands/SetControlDelay.htm"},
  {t:"SetDefaultMouseSpeed",v:"docs/commands/SetDefaultMouseSpeed.htm"},
  {t:"SetEnv",v:"docs/commands/SetEnv.htm"},
  {t:"SetFormat",v:"docs/commands/SetFormat.htm"},
  {t:"SetKeyDelay",v:"docs/commands/SetKeyDelay.htm"},
  {t:"SetMouseDelay",v:"docs/commands/SetMouseDelay.htm"},
  {t:"SetNumLockState",v:"docs/commands/SetNumScrollCapsLockState.htm"},
  {t:"SetRegView",v:"docs/commands/SetRegView.htm"},
  {t:"SetScrollLockState",v:"docs/commands/SetNumScrollCapsLockState.htm"},
  {t:"SetStoreCapslockMode",v:"docs/commands/SetStoreCapslockMode.htm"},
  {t:"SetTimer",v:"docs/commands/SetTimer.htm"},
  {t:"SetTitleMatchMode",v:"docs/commands/SetTitleMatchMode.htm"},
  {t:"SetWinDelay",v:"docs/commands/SetWinDelay.htm"},
  {t:"SetWorkingDir",v:"docs/commands/SetWorkingDir.htm"},
  {t:"short file name (8.3 format)",v:"docs/commands/LoopFile.htm#LoopFileShortPath"},
  {t:"short-circuit boolean evaluation",v:"docs/Functions.htm#ShortCircuit"},
  {t:"shortcut file",v:"docs/commands/FileCreateShortcut.htm"},
  {t:"Shutdown",v:"docs/commands/Shutdown.htm"},
  {t:"Silent Install/Uninstall",v:"docs/Scripts.htm#install"},
  {t:"Sin()",v:"docs/Functions.htm#Sin"},
  {t:"SingleInstance",v:"docs/commands/_SingleInstance.htm"},
  {t:"size of a file/folder",v:"docs/commands/FileGetSize.htm"},
  {t:"size of a window",v:"docs/commands/WinGetPos.htm"},
  {t:"Sleep",v:"docs/commands/Sleep.htm"},
  {t:"Slider controls (GUI)",v:"docs/commands/GuiControls.htm#Slider"},
  {t:"Sort",v:"docs/commands/Sort.htm"},
  {t:"SoundBeep",v:"docs/commands/SoundBeep.htm"},
  {t:"SoundGet",v:"docs/commands/SoundGet.htm"},
  {t:"SoundGetWaveVolume",v:"docs/commands/SoundGetWaveVolume.htm"},
  {t:"SoundPlay",v:"docs/commands/SoundPlay.htm"},
  {t:"SoundSet",v:"docs/commands/SoundSet.htm"},
  {t:"SoundSetWaveVolume",v:"docs/commands/SoundSetWaveVolume.htm"},
  {t:"space",v:"docs/commands/IfIs.htm"},
  {t:"speed of a script",v:"docs/commands/SetBatchLines.htm"},
  {t:"spinner control (GUI)",v:"docs/commands/GuiControls.htm#UpDown"},
  {t:"SplashImage",v:"docs/commands/Progress.htm"},
  {t:"SplashTextOff",v:"docs/commands/SplashTextOn.htm"},
  {t:"SplashTextOn",v:"docs/commands/SplashTextOn.htm"},
  {t:"SplitPath",v:"docs/commands/SplitPath.htm"},
  {t:"splitting long lines",v:"docs/Scripts.htm#continuation"},
  {t:"Sqrt()",v:"docs/Functions.htm#Sqrt"},
  {t:"standard library",v:"docs/Functions.htm#lib"},
  {t:"standard output (stdout)",v:"docs/commands/FileAppend.htm"},
  {t:"static variables",v:"docs/Functions.htm#static"},
  {t:"StatusBar controls (GUI)",v:"docs/commands/GuiControls.htm#StatusBar"},
  {t:"StatusBarGetText",v:"docs/commands/StatusBarGetText.htm"},
  {t:"StatusBarWait",v:"docs/commands/StatusBarWait.htm"},
  {t:"StrGet",v:"docs/commands/StrPutGet.htm"},
  {t:"string (search for)",v:"docs/Functions.htm#InStr"},
  {t:"string: InStr()",v:"docs/Functions.htm#InStr"},
  {t:"string: SubStr()",v:"docs/Functions.htm#SubStr"},
  {t:"StringCaseSense",v:"docs/commands/StringCaseSense.htm"},
  {t:"StringGetPos",v:"docs/commands/StringGetPos.htm"},
  {t:"StringLeft",v:"docs/commands/StringLeft.htm"},
  {t:"StringLen",v:"docs/commands/StringLen.htm"},
  {t:"StringLower",v:"docs/commands/StringLower.htm"},
  {t:"StringMid",v:"docs/commands/StringMid.htm"},
  {t:"StringReplace",v:"docs/commands/StringReplace.htm"},
  {t:"StringRight",v:"docs/commands/StringLeft.htm"},
  {t:"StringSplit",v:"docs/commands/StringSplit.htm"},
  {t:"StringTrimLeft",v:"docs/commands/StringTrimLeft.htm"},
  {t:"StringTrimRight",v:"docs/commands/StringTrimLeft.htm"},
  {t:"StringUpper",v:"docs/commands/StringLower.htm"},
  {t:"StrLen()",v:"docs/commands/StringLen.htm"},
  {t:"StrPut()",v:"docs/commands/StrPutGet.htm"},
  {t:"StrSplit()",v:"docs/commands/StringSplit.htm"},
  {t:"structures, via DllCall",v:"docs/commands/DllCall.htm#struct"},
  {t:"styles for GUI command",v:"docs/misc/Styles.htm"},
  {t:"SubStr()",v:"docs/Functions.htm#SubStr"},
  {t:"subtract",v:"docs/commands/EnvSub.htm"},
  {t:"Super-global variables",v:"docs/Functions.htm#SuperGlobal"},
  {t:"Suspend",v:"docs/commands/Suspend.htm"},
  {t:"suspend or hibernate",v:"docs/commands/Shutdown.htm#Suspend"},
  {t:"SysGet",v:"docs/commands/SysGet.htm"},
  {t:"Tab controls (GUI)",v:"docs/commands/GuiControls.htm#Tab"},
  {t:"Tan()",v:"docs/Functions.htm#Tan"},
  {t:"terminate a window",v:"docs/commands/WinKill.htm"},
  {t:"terminate script",v:"docs/commands/ExitApp.htm"},
  {t:"ternary operator (?:)",v:"docs/Variables.htm#ternary"},
  {t:"Text controls (GUI)",v:"docs/commands/GuiControls.htm#Text"},
  {t:"Thread",v:"docs/commands/Thread.htm"},
  {t:"threads",v:"docs/misc/Threads.htm"},
  {t:"Throw",v:"docs/commands/Throw.htm"},
  {t:"time",v:"docs/commands/IfIs.htm"},
  {t:"Timer (timed subroutines)",v:"docs/commands/SetTimer.htm"},
  {t:"times and dates (compare)",v:"docs/commands/EnvSub.htm"},
  {t:"times and dates (math)",v:"docs/commands/EnvAdd.htm"},
  {t:"times and dates (of files)",v:"docs/commands/FileSetTime.htm"},
  {t:"title of a window",v:"docs/commands/WinSetTitle.htm"},
  {t:"ToolTip",v:"docs/commands/ToolTip.htm"},
  {t:"Transform",v:"docs/commands/Transform.htm"},
  {t:"transparency of a window",v:"docs/commands/WinSet.htm#trans"},
  {t:"tray icon",v:"docs/commands/_NoTrayIcon.htm"},
  {t:"tray menu (customizing)",v:"docs/commands/Menu.htm"},
  {t:"TrayTip",v:"docs/commands/TrayTip.htm"},
  {t:"TreeView controls (GUI)",v:"docs/commands/TreeView.htm"},
  {t:"Trim",v:"docs/commands/AutoTrim.htm"},
  {t:"Trim()",v:"docs/commands/Trim.htm"},
  {t:"True",v:"docs/Variables.htm#Boolean"},
  {t:"Try",v:"docs/commands/Try.htm"},
  {t:"Tutorial",v:"docs/Tutorial.htm"},
  {t:"TV_Add()",v:"docs/commands/TreeView.htm#TV_Add"},
  {t:"TV_Delete()",v:"docs/commands/TreeView.htm#TV_Delete"},
  {t:"TV_Get()",v:"docs/commands/TreeView.htm#TV_Get"},
  {t:"TV_GetChild()",v:"docs/commands/TreeView.htm#TV_GetChild"},
  {t:"TV_GetCount()",v:"docs/commands/TreeView.htm#TV_GetCount"},
  {t:"TV_GetNext()",v:"docs/commands/TreeView.htm#TV_GetNext"},
  {t:"TV_GetParent()",v:"docs/commands/TreeView.htm#TV_GetParent"},
  {t:"TV_GetPrev()",v:"docs/commands/TreeView.htm#TV_GetPrev"},
  {t:"TV_GetSelection()",v:"docs/commands/TreeView.htm#TV_GetSelection"},
  {t:"TV_GetText()",v:"docs/commands/TreeView.htm#TV_GetText"},
  {t:"TV_Modify()",v:"docs/commands/TreeView.htm#TV_Modify"},
  {t:"Unicode text and clipboard",v:"docs/commands/Transform.htm"},
  {t:"Until",v:"docs/commands/Until.htm"},
  {t:"UpDown controls (GUI)",v:"docs/commands/GuiControls.htm#UpDown"},
  {t:"URLDownloadToFile",v:"docs/commands/URLDownloadToFile.htm"},
  {t:"UseHook",v:"docs/commands/_UseHook.htm"},
  {t:"user (run as a different user)",v:"docs/commands/RunAs.htm"},
  {t:"user library",v:"docs/Functions.htm#lib"},
  {t:"variables, assigning to",v:"docs/commands/SetEnv.htm"},
  {t:"variables, built-in",v:"docs/Variables.htm#BuiltIn"},
  {t:"variables, comparing them",v:"docs/commands/IfEqual.htm"},
  {t:"variables, ListVars",v:"docs/commands/ListVars.htm"},
  {t:"variables, MAIN",v:"docs/Variables.htm"},
  {t:"variables, type of data",v:"docs/commands/IfIs.htm"},
  {t:"variadic functions",v:"docs/Functions.htm#Variadic"},
  {t:"variants (duplicate hotkeys and hotstrings)",v:"docs/commands/_IfWinActive.htm#variant"},
  {t:"VarSetCapacity()",v:"docs/commands/VarSetCapacity.htm"},
  {t:"VBScript, embedded/inline",v:"docs/commands/DllCall.htm#COM"},
  {t:"version of a file",v:"docs/commands/FileGetVersion.htm"},
  {t:"virtual key",v:"docs/commands/Send.htm#vk"},
  {t:"volume (changing it)",v:"docs/commands/SoundSet.htm"},
  {t:"wait (sleep)",v:"docs/commands/Sleep.htm"},
  {t:"wait for a key to be released or pressed",v:"docs/commands/KeyWait.htm"},
  {t:"Wheel hotkeys for mouse",v:"docs/Hotkeys.htm#Wheel"},
  {t:"Wheel, simulating rotation",v:"docs/commands/Click.htm"},
  {t:"While-loop",v:"docs/commands/While.htm"},
  {t:"whitespace",v:"docs/commands/AutoTrim.htm"},
  {t:"wildcards (for files & folders)",v:"docs/commands/LoopFile.htm"},
  {t:"WinActivate",v:"docs/commands/WinActivate.htm"},
  {t:"WinActivateBottom",v:"docs/commands/WinActivateBottom.htm"},
  {t:"WinActivateForce",v:"docs/commands/_WinActivateForce.htm"},
  {t:"WinActive()",v:"docs/commands/WinActive.htm"},
  {t:"Winamp automation",v:"docs/misc/Winamp.htm"},
  {t:"WinClose",v:"docs/commands/WinClose.htm"},
  {t:"Windows Messages",v:"docs/misc/SendMessageList.htm"},
  {t:"WinExist()",v:"docs/commands/WinExist.htm"},
  {t:"WinGet",v:"docs/commands/WinGet.htm"},
  {t:"WinGetActiveStats",v:"docs/commands/WinGetActiveStats.htm"},
  {t:"WinGetActiveTitle",v:"docs/commands/WinGetActiveTitle.htm"},
  {t:"WinGetClass",v:"docs/commands/WinGetClass.htm"},
  {t:"WinGetPos",v:"docs/commands/WinGetPos.htm"},
  {t:"WinGetText",v:"docs/commands/WinGetText.htm"},
  {t:"WinGetTitle",v:"docs/commands/WinGetTitle.htm"},
  {t:"WinHide",v:"docs/commands/WinHide.htm"},
  {t:"WinKill",v:"docs/commands/WinKill.htm"},
  {t:"WinLIRC, connecting to",v:"docs/scripts/WinLIRC.htm"},
  {t:"WinMaximize",v:"docs/commands/WinMaximize.htm"},
  {t:"WinMenuSelectItem",v:"docs/commands/WinMenuSelectItem.htm"},
  {t:"WinMinimize",v:"docs/commands/WinMinimize.htm"},
  {t:"WinMinimizeAll",v:"docs/commands/WinMinimizeAll.htm"},
  {t:"WinMinimizeAllUndo",v:"docs/commands/WinMinimizeAll.htm"},
  {t:"WinMove",v:"docs/commands/WinMove.htm"},
  {t:"WinRestore",v:"docs/commands/WinRestore.htm"},
  {t:"WinSet",v:"docs/commands/WinSet.htm"},
  {t:"WinSetTitle",v:"docs/commands/WinSetTitle.htm"},
  {t:"WinShow",v:"docs/commands/WinShow.htm"},
  {t:"WinSize (via WinMove)",v:"docs/commands/WinMove.htm"},
  {t:"WinTitle",v:"docs/misc/WinTitle.htm"},
  {t:"WinWait",v:"docs/commands/WinWait.htm"},
  {t:"WinWaitActive",v:"docs/commands/WinWaitActive.htm"},
  {t:"WinWaitClose",v:"docs/commands/WinWaitClose.htm"},
  {t:"WinWaitNotActive",v:"docs/commands/WinWaitActive.htm"},
  {t:"WM_* (Windows messages)",v:"docs/misc/SendMessageList.htm"},
  {t:"WM_COPYDATA",v:"docs/commands/OnMessage.htm#SendString"},
  {t:"working directory",v:"docs/commands/SetWorkingDir.htm"},
  {t:"wParam",v:"docs/commands/PostMessage.htm"},
  {t:"write file",v:"docs/commands/FileAppend.htm"},
  {t:"WS_* (GUI styles)",v:"docs/misc/Styles.htm"},
  {t:"XButton",v:"docs/commands/Click.htm"},
  {t:"YYYYMMDDHH24MISS",v:"docs/commands/FileSetTime.htm#YYYYMMDD"},
  {t:"{Blind}",v:"docs/commands/Send.htm#blind"}
];

if (!IsInsideCHM() && !IsSearchBot())
{
  BuildStructure();
  AddContent();
}

function GetVirtualDir()
{
  var pathname = location.pathname;
  return pathname.substr(0, pathname.lastIndexOf('/docs'));
}

function GetScriptDir() {
  var scriptEls = document.getElementsByTagName('script');
  var thisScriptEl = scriptEls[scriptEls.length - 1];
  var scriptPath = thisScriptEl.src;
  return scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);
}

function BuildStructure()
{
  var vdir = GetVirtualDir();
  var header  = '<div class="header"><table class="hdr-table"><tr><td class="hdr-image"><a href="' + vdir + '/' + '"><img src="' + vdir + '/docs/static/ahk_logo_no_text.png" width="217" height="70" alt="AutoHotkey"></a></td><td class="hdr-search"><form id="search-form"><input id="q" size="30" type="text" placeholder="' + hdSearchTxt + '"></form><div id="search-btn">' + hdSearchBtn + '</div></td><td class="hdr-language"><ul><li>Language<ul class="second"><li id="lng-btn-en">English</li><li id="lng-btn-de">Deutsch</li><li id="lng-btn-cn">&#20013;&#25991;</li></ul></li></ul></td></tr></table></div>';
  var main_1  = '<div class="main-content"><div id="app-body"><div id="headerbar"></div><div class="left-col"><ul class="nav"><li id="sb_content" class="selected"><span>' + sbContent + '</span></li><li id="sb_index"><span>' + sbIndex + '</span></li></ul><div id="sidebar"></div><div id="keywords" style="display: none;"><input id="IndexEntry" type="text"><select id="indexcontainer" name="IndexListbox" class="docstyle" size="20"></select></div></div><div class="right-col"><div id="main-content">';
  var main_2  = '</div></div><div class="float-clear"></div></div></div>';
  var footer  = '<div class="footer"><b>Copyright</b> &copy; 2003-' + new Date().getFullYear() + ' ' + location.host + ' - <span id="ftLicense">' + ftLicense + '</span> <a href="' + vdir + '/docs/license.htm">GNU General Public License</a><span id="ftExtra">' + ftExtra + '</span></div>';
  document.write(header + main_1);
  $(document).ready(function() { $('body').append(main_2 + footer); });
}

function AddContent()
{
  $(window).unload(function () { $(window).unbind('unload'); }); // disable firefox's bfcache

  $(document).ready(function() {
    var vdir = GetVirtualDir();
    var urlpath = location.href.replace(location.host + vdir, '').replace(/.*?:\/*/, '');

    //
    // set last used state of sidebar
    //

    (window.name == 2) ? ShowIndex() : ShowTOC();

    //
    // on events for sidebar buttons
    //

    $('#sb_content').on('click', function() { ShowTOC(); });
    $('#sb_index').on('click', function() { ShowIndex(); });

    //
    // on events for search field + button
    //

    $('.header #search-btn').on('click', function() {
      var query = encodeURIComponent( $(".header #q").val() );
      document.location = eval(sessionStorage.getItem("hdSearchLnk"));
    });

    $('.header #search-form').on('submit', function(event) {
      event.preventDefault();
      var query = encodeURIComponent( $(".header #q").val() );
      document.location = eval(sessionStorage.getItem("hdSearchLnk"));
    });

    //
    // Hide logo
    //

    $('#ahklogo').hide();

    //
    // Headings
    //

    // Change display of h1 header

    $('h1').attr("class", "navh1");

    // Provide anchor link

    $('h1, h2, h3, h4, h5, h6').each(function(index) {

      // Show paragraph sign on mouseover

      $(this).hover(
        function() {
          $(this).append("<span style='color:#888;font-size:smaller;'> &para;</span>");
        }, function() {
          $(this).find("span:last").remove();
        }
      );

      // Add anchor

      if(!$(this).attr('id')) // if id anchor not exist, create one
      {
        
        var str = $(this).text().replace(/\s/g, '_'); // replace spaces with _
        var str = str.replace(/[():.,;'#\[\]\/{}&="|?!]/g, ''); // remove special chars
        if($('#' + str).length) // if new id anchor exist already, set it to a unique one
          $(this).attr('id', str + '_' + index);
        else
          $(this).attr('id', str);
      }
      $(this).wrap('<a href="#' + $(this).attr('id') + '" style="text-decoration:none;color:#000"></a>');
    });

    //
    // language button
    //

    var en = 'http://ahkscript.org/';
    var de = 'http://ragnar-f.github.io/';
    var cn = 'http://ahkcn.sourceforge.net/';

    $('#lng-btn-en').on('click', function() { document.location = en + urlpath; } );
    $('#lng-btn-de').on('click', function() { document.location = de + urlpath; } );
    $('#lng-btn-cn').on('click', function() { document.location = cn + urlpath; } );

    $('.hdr-table .hdr-language').find('li').mouseenter(function() {
      $(this).children('ul').show();
      $(this).addClass('selected');
      $(this).mouseleave(function() {
        $(this).children('ul').hide();
        $(this).removeClass('selected');
      });
    });

    //
    // Create toc sidebar
    //

    var node_matched = [];

    $('#sidebar').tree({
      data:             content,
      useContextMenu:   false,
      keyboardSupport:  false,
      saveState:        false,
      onCanSelectNode:  function(node) {
        if ((node.children.length) && (!node.path))
            return false;
        else
            return true;
      },
      onCreateLi:       function(node, $li) {
        if (node.path == urlpath)
        {
          node_matched.push(node);
        }
      }
    });

    $('#sidebar').bind('tree.click', function(event) {
      var node = event.node;
      $(this).tree('toggle', node);
      if (node.path)
        window.location = vdir + "/" + node.path;
    });

    //
    // pre-select toc sidebar item
    //

    for (var i = 0, len = node_matched.length; i < len; i++)
    {
      $('#sidebar').tree('addToSelection', node_matched[i]);
      $('#sidebar').tree('openNode', node_matched[i]);
      $('#sidebar').tree('openNode', node_matched[i].parent);
    }

    //
    // Create keyword list sidebar
    //

    var newContent = '';

    index.sort(function(a, b) {
      var textA = a.t.toLowerCase(), textB = b.t.toLowerCase()
      return textA.localeCompare(textB);
    });

    for (var i = 0, len = index.length; i < len; i++)
    {
      newContent += '<option value="' + index[i].v + '">' + index[i].t + '</option>';
    };

    $("#indexcontainer").html(newContent);
    
    //
    // pre-select keyword list sidebar item
    //

    var sb_index_lastselected = $('[value="' + urlpath + '"]').index() + 1;
    var sb_index_item_last = $('#indexcontainer :nth-child(' + sb_index_lastselected + ')');
    sb_index_item_last.prop('selected', true);

    //
    // select closest listbox entry while typing
    //

    $("#IndexEntry").on('keyup', function() {
      var oList = $('#indexcontainer')[0];
      var ListLen = oList.length;
      var iCurSel = oList.selectedIndex; 
      var text = $("#IndexEntry").val().toLowerCase();
      var TextLen = text.length;
      if (!text) return
      for (var i = 0; i < ListLen; i++) { 
        var listitem = oList.item(i).text.substr(0, TextLen).toLowerCase(); 
        if (listitem == text) { 
          if (i != iCurSel) { 
            var iPos = i + oList.size - 1; 
            if(ListLen > iPos) 
              oList.selectedIndex = iPos; 
            else 
              oList.selectedIndex = ListLen-1; 
            oList.selectedIndex = i; 
          } 
          break; 
        } 
      } 
    });

    //
    // open document when pressing enter or select item
    //

    $("#indexcontainer, #IndexEntry").on('keydown change', function(event) {
      if ((event.which && event.which==13) || (event.keyCode && event.keyCode==13) || (event.type == 'change')) {
        var iSelect = document.getElementById("indexcontainer").selectedIndex;
        if (iSelect >= 0) {
          var URL = document.getElementById("indexcontainer").item(iSelect).value;
          if (URL.length > 0) {
            window.location = vdir + '/' + URL;
          }
        }
      }
    });
  });
};

function ShowTOC()
{
  window.name = 1;
  $('#sb_content').attr('class', 'selected');
  $('#sb_index').removeAttr('class');
  $('#keywords').hide();
  $('#sidebar').fadeIn();
}

function ShowIndex()
{
  window.name = 2;
  $('#sb_index').attr('class', 'selected');
  $('#sb_content').removeAttr('class');
  $('#sidebar').hide();
  $('#keywords').fadeIn();
}

function IsInsideCHM()
{
  return (location.href.search(/::/) > 0) ? 1 : 0;
}

function IsSearchBot()
{
  return navigator.userAgent.match(/googlebot|bingbot|slurp/i);
}
