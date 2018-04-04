/*
Seek (based on the v1 script by Phi)
http://www.autohotkey.com
Navigating the Start Menu can be a hassle, especially if you have installed
many programs over time. 'Seek' lets you specify a case-insensitive key
word/phrase that it will use to filter only the matching programs and
directories from the Start Menu, so that you can easily open your target
program from a handful of matched entries. This eliminates the drudgery of
searching and traversing the Start Menu.
*/
/*
Options:

-cache Use the cached directory-listing if available (this is the default mode
       when no option is specified)
-scan  Force a directory scan to retrieve the latest directory listing
-scex  Scan & exit (this is useful for scheduling the potentially
       time-consuming directory-scanning as a background job)
-help  Show this help

Important notes:

Check AutoHotkey's Tutorial how to run this script, or to compile it if
necessary.

The only file 'Seek' creates is placed in your TMP directory:

  a. _Seek.ini  (cache file for last query string and directory listing)

When you run 'Seek' for the first time, it'll scan your Start Menu,
and save the directory listing into a cache file.

The following directories are included in the scanning:
- A_StartMenu
- A_StartMenuCommon

By default, subsequent runs will read from the cache file so as to reduce the
loading time. For more info on options, run 'Seek.exe -help'. If you think your
Start Menu doesn't contain too many programs, you can choose not to use the
cache and instruct 'Seek' to always do a directory scan (via option -scan).
That way, you will always get the latest listing.

When you run 'Seek', a window will appear, waiting for you to enter a
key word/phrase. After you have entered a query string, a list of
matching records will be displayed. Next, you need to highlight an entry and
press ENTER or click on the 'Open' button to run the selected program or open
the selected directory.
*/

/*
Specify which program to use when opening a directory. If the program cannot
be found or is not specified (i.e. variable is unassigned or assigned
a null value), the default Explorer will be used.
*/
config := {dirExplorer: "E:\utl\xplorer2_lite\xplorer2.exe"}

/*
User's customised list of additional directories to be included in the
scanning. The full path must not be enclosed by quotes or double-quotes.
If this file is missing, only the default directories will be scanned.
*/
config.SeekMyDir := A_ScriptDir "\Seek.dir"

/*
Specify the filename and directory location to save the cached directory/program
listing and the cached key word/phrase of the last search.
There is no need to change this unless you want to.
*/
config.saveFile := A_Temp "\_Seek.ini"

/*
Track search string (True/False)
If true, the last-used query string will be re-used as the default query
string the next time you run Seek. If false, the last-used query string will
not be tracked and there will not be a default query string value the
next time you run Seek.
*/
config.TrackKeyPhrase := True

/*
Specify what should be included in scan.
 F: Files are included.
 D: Directories are included.
*/
config.ScanMode := "FD"

; Init:
; #NoTrayIcon

; Define the script title:
config.ScriptTitle := "Seek - Search the Start Menu"

; Display the help instructions:
if A_Args[1] ~= "^(--help|-help|/h|-h|/\?|-\?)$"
{
    MsgBox("
    (
        Navigating the Start Menu can be a hassle, especially if you have installed
        many programs over time. 'Seek' lets you specify a case-insensitive key
        word/phrase that it will use to filter only the matching programs and
        directories from the Start Menu, so that you can easily open your target
        program from a handful of matched entries. This eliminates the drudgery of
        searching and traversing the Start Menu.

        Options:
          -cache  Use the cached directory-listing if available (this is the default mode
            when no option is specified)
          -scan  Force a directory scan to retrieve the latest directory listing
          -scex  Scan & exit (this is useful for scheduling the potentially
            time-consuming directory-scanning as a background job)
          -help  Show this help
    )", config.ScriptTitle)
    ExitApp
}

; Check that the mandatory environment variables exist and are valid:
if !FileExist(A_Temp) ; Path does not exist.
{
    MsgBox
    (
        "This mandatory environment variable is either not defined or invalid:
        
            TMP = " A_Temp "
            
        Please fix it before running Seek."
    ), config.ScriptTitle
    ExitApp
}

; Scan the Start Menu without Gui:
if A_Args[1] = "-scex"
{
    SaveFileList(config)
    return
}

; Create the GUI window:
G := GuiCreate(, config.ScriptTitle)

; Add the text box for user to enter the query string:
E_Search := G.Add("Edit", "W600")
if config.TrackKeyPhrase
    E_Search.Value := IniRead(config.saveFile, "LastSession", "SearchText")

; Add my fav tagline:
G.Add("Text", "X625 Y10", "What do you seek, my friend?")

; Add the status bar for providing feedback to user:
T_Info := G.Add("Text", "X10 Y31 R1 W764")

; Add the selection listbox for displaying search results:
LB := G.Add("ListBox", "X10 Y53 R28 W764 HScroll Disabled")

; Add these buttons, but disable them for now:
B_1 := G.Add("Button", "Default X10 Y446 Disabled", "Open")
B_2 := G.Add("Button", "X59 Y446 Disabled", "Open Directory")
B_3 := G.Add("Button", "X340 Y446", "Scan Start-Menu")

; Add the Exit button:
B_4 := G.Add("Button", "X743 Y446", "Exit")

; Create function references for event callbacks:
FindMatches := Func("FindMatches").bind(config, LB, B_1, B_2)
OpenTarget := Func("OpenTarget").bind(config, LB)
OpenFolder := Func("OpenFolder").bind(config, LB)
ScanStartMenu := Func("ScanStartMenu").bind(config, E_Search, T_Info, LB, B_1, B_2, B_3)
Gui_Close := Func("Gui_Close").bind(config, E_Search, LB)

; Add control events:
E_Search.OnEvent("Change", FindMatches)
LB.OnEvent("DoubleClick", OpenTarget)
B_1.OnEvent("Click", OpenTarget)
B_2.OnEvent("Click", OpenFolder)
B_3.OnEvent("Click", ScanStartMenu)
B_4.OnEvent("Click", Gui_Close)

; Add window events:
G.OnEvent("Close", Gui_Close)
G.OnEvent("Escape", Gui_Close)

; Pop-up the query window:
G.Show("Center")

; Force re-scanning if -scan is enabled or listing cache file does not exist:
if (A_Args[1] = "-scan" or !FileExist(config.saveFile))
    ScanStartMenu(config, E_Search, T_Info, LB, B_1, B_2, B_3)

; Retrieve an set the matching list:
FindMatches(config, LB, B_1, B_2, E_Search)

; Retrieve the last selection from cache file and select the item:
if config.TrackKeyPhrase
    if (LastSelection := IniRead(config.saveFile, "LastSession", "Selection"))
        LB.Choose(LastSelection)

; Function definitions ---

; Scan the start-menu and store the directory/program listings in a cache file:
ScanStartMenu(config, E_Search, T_Info, LB, B_1, B_2, B_3)
{
    ; Inform user that scanning has started:
    T_Info.Value := "Scanning directory listing..."

    ; Disable listbox while scanning is in progress:
    LB.Enabled := false
    B_1.Enabled := false
    B_2.Enabled := false
    B_3.Enabled := false

    ; Retrieve and save the start menu files:
    SaveFileList(config)
    
    ; Inform user that scanning has completed:
    T_Info.Value := "Scan completed."
    
    ; Enable listbox:
    LB.Enabled := true
    B_1.Enabled := true
    B_2.Enabled := true
    B_3.Enabled := true
    
    ; Filter for search string with the new listing:
    FindMatches(config, LB, B_1, B_2, E_Search)
}

; Retrieve and save the start menu files:
SaveFileList(config)
{
    ; Define the directory paths to retrieve:
    LocationArray := [A_StartMenu, A_StartMenuCommon]

    ; Include additional user-defined paths for scanning:
    if FileExist(config.SeekMyDir)
        Loop Read, config.SeekMyDir
        {
            if !FileExist(A_LoopReadLine)
                MsgBox
                (
                    "Processing your customised directory list...
                    
                    '" A_LoopReadLine "' does not exist and will be excluded from the scanning.
                    Please update [ " config.SeekMyDir " ]."
                ), config.ScriptTitle, 8192
            else
                LocationArray.Push(A_LoopReadLine)
        }

    ; Scan directory listing by recursing each directory to retrieve the contents.
    ; Hidden files are excluded:
    IniDelete(config.saveFile, "LocationList")
    For i, Location in LocationArray
    {
        ; Save space by using relative paths:
        IniWrite(Location, config.saveFile, "LocationList", "L" i)
        A_WorkingDir := Location
        Loop Files, "*", config.ScanMode "R"
            if !InStr(FileGetAttrib(A_LoopFilePath), "H") ; Exclude hidden file.
                FileList .= "%L" i "%\" A_LoopFilePath "`n"
    }
    IniDelete(config.saveFile, "FileList")
    IniWrite(FileList, config.saveFile, "FileList")
}

; Search and display all matching records in the listbox:
FindMatches(config, LB, B_1, B_2, E_Search)
{
    FileArray := []
    SearchText := E_Search.Value
    ; Filter matching records based on user query string:
    if SearchText
    {
        Loop
        {
            Location := IniRead(config.saveFile, "LocationList", "L" A_Index)
            if !Location
                break
            L%A_Index% := Location
        }
        Loop Parse, IniRead(config.saveFile, "FileList"), "`n"
        {
            Line := A_LoopField
            if RegExMatch(Line, "%(L\d+)%", m) ; Replace %L_n% with location paths.
                Line := StrReplace(Line, "%" m[1] "%", %m[1]%)
            if SearchText <> E_Search.Value
            {
                ; User has changed the search string.
                ; There is no point to continue searching using the old string, so abort.
                return
            }
            else
            {
                ; Append matching records into the list:
                SplitPath(Line, Name)
                MatchFound := true
                Loop Parse, SearchText, "`s"
                {
                    if !InStr(Name, A_LoopField)
                    {
                        MatchFound := false
                        break
                    }
                }
                if MatchFound
                    FileArray.Push(Line)
            }
        }
    }

    ; Refresh list with search results:
    LB.Delete(), LB.Add(FileArray)

    if !FileArray.Length()
    {
        ; No matching record is found. Disable listbox:
        LB.Enabled := false
        B_1.Enabled := false
        B_2.Enabled := false
    }
    else
    {
        ; Matching records are found. Enable listbox:
        LB.Enabled := true
        B_1.Enabled := true
        B_2.Enabled := true
        ; Select the first record if no other record has been selected:
        if LB.Text = ""
            LB.Choose(1, 1)
    }
}

; User clicked on 'Open' button or pressed ENTER:
OpenTarget(config, LB)
{
    ; Selected record does not exist (file or directory not found):
    if !FileExist(LB.Text)
    {
        MsgBox
        (
            LB.Text " does not exist.
            
            This means that the directory cache is outdated. You may click on
            the 'Scan Start-Menu' button below to update the directory cache with your
            latest directory listing now."
        ), config.ScriptTitle, 8192
        return
    }

    ; Check whether the selected record is a file or directory:
    fileAttrib := FileGetAttrib(LB.Text)
    if InStr(fileAttrib, "D") ; is directory
        OpenFolder(config, LB)
    else if fileAttrib ; is file
        Run(LB.Text)
    else
    {
        MsgBox
        (
            LB.Text " is neither a DIRECTORY or a FILE.
            
            This shouldn't happen. Seek cannot proceed. Quitting..."
        )
    }
    WinClose
}

; User clicked on 'Open Directory' button:
OpenFolder(config, LB)
{
    Path := LB.Text
    ; If user selected a file-record instead of a directory-record, extract the
    ; directory path (I'm using DriveGetStatus instead of FileGetAttrib to allow the
    ; scenario whereby LB.Text is invalid but the directory path of LB.Text is valid):
    if DriveGetStatus(Path) <> "Ready" ; not a directory
    {
        SplitPath(Path,, Dir)
        Path := Dir
    }

    ; Check whether directory exists:
    if !FileExist(Path)
    {
        MsgBox
        (
            Path " does not exist.
            
            This means that the directory cache is outdated. You may click on
            the 'Scan Start-Menu' button below to update the directory cache with your
            latest directory listing now."
        ), config.ScriptTitle, 8192
        return
    }

    ; Open the directory:
    if FileExist(config.dirExplorer)
        Run(Format('"{1}" "{2}"', config.dirExplorer, Path)) ; Open with custom file explorer.
    else
        Run(Path) ; Open with default windows file explorer.
}


Gui_Close(config, E_Search, LB)
{
    ; Save the key word/phrase for next run:
    if config.TrackKeyPhrase
    {
        IniWrite(E_Search.Value, config.saveFile, "LastSession", "SearchText")
        IniWrite(LB.Text, config.saveFile, "LastSession", "Selection")
    }
    ExitApp
}
