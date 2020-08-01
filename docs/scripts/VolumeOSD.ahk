/*
Volume On-Screen-Display (based on the v1 script by Rajat)
https://www.autohotkey.com
This script assigns hotkeys of your choice to raise and lower the master wave volume.
*/

; --- User Settings ---

; The percentage by which to raise or lower the volume each time:
global g_Step := 4

; How long to display the volume level bar graphs:
global g_DisplayTime := 2000

; Master Volume Bar color (see the help file to use more precise shades):
global g_CBM := "Red"

; Background color:
global g_CW := "Silver"

; Bar's screen position. Use "center" to center the bar in that dimension:
global g_PosX := "center"
global g_PosY := "center"
global g_Width := 150  ; width of bar
global g_Thick := 12   ; thickness of bar

; If your keyboard has multimedia buttons for Volume, you can
; try changing the below hotkeys to use them by specifying
; Volume_Up and Volume_Down:
global g_MasterUp := "#Up"      ; Win+UpArrow
global g_MasterDown := "#Down"

; --- Auto Execute Section ---

; DON'T CHANGE ANYTHING HERE (unless you know what you're doing).

#SingleInstance

; Create the Progress window:
global G := Gui.New("+ToolWindow -Caption -Border +Disabled")
G.MarginX := 0, G.MarginY := 0
opt := "w" g_Width " h" g_Thick " background" g_CW
G.Add("Progress", opt " vMaster c" g_CBM)

; Register hotkeys:
Hotkey g_MasterUp,   (*) => ChangeVolume("+")
Hotkey g_MasterDown, (*) => ChangeVolume("-")

; --- Function Definitions ---

ChangeVolume(Prefix)
{
    SoundSetVolume(Prefix g_Step)
    G["Master"].Value := Round(SoundGetVolume())
    G.Show("x" g_PosX " y" g_PosY)
    SetTimer "HideWindow", -g_DisplayTime
}

HideWindow()
{
    G.Hide()
}
