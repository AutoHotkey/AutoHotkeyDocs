/*
Volume On-Screen-Display (based on the v1 script by Rajat)
https://www.autohotkey.com
This script assigns hotkeys of your choice to raise and lower the master wave volume.
*/

; --- User Settings ---

global config := {}

; The percentage by which to raise or lower the volume each time:
config.Step := 4

; How long to display the volume level bar graphs:
config.DisplayTime := 2000

; Master Volume Bar color (see the help file to use more precise shades):
config.CBM := "Red"

; Background color:
config.CW := "Silver"

; Bar's screen position. Use "center" to center the bar in that dimension:
config.PosX := "center"
config.PosY := "center"
config.Width := 150  ; width of bar
config.Thick := 12   ; thickness of bar

; If your keyboard has multimedia buttons for Volume, you can
; try changing the below hotkeys to use them by specifying
; Volume_Up and Volume_Down:
config.MasterUp := "#Up"      ; Win+UpArrow
config.MasterDown := "#Down"

; --- Auto Execute Section ---

; DON'T CHANGE ANYTHING HERE (unless you know what you're doing).

#SingleInstance

; Create the Progress window:
global G := Gui.New("+ToolWindow -Caption -Border +Disabled")
G.MarginX := 0, G.MarginY := 0
opt := "w" config.Width " h" config.Thick " background" config.CW
G.Add("Progress", opt " vMaster c" config.CBM)

; Register hotkeys:
Hotkey config.MasterUp,   () => ChangeVolume("+")
Hotkey config.MasterDown, () => ChangeVolume("-")

; --- Function Definitions ---

ChangeVolume(Prefix)
{
    SoundSetVolume(Prefix config.Step)
    G["Master"].Value := Round(SoundGetVolume())
    G.Show("x" config.PosX " y" config.PosY)
    SetTimer "HideWindow", -config.DisplayTime
}

HideWindow()
{
    G.Hide()
}
