/*
Volume On-Screen-Display (based on the v1 script by Rajat)
http://www.autohotkey.com
This script assigns hotkeys of your choice to raise and lower the master and/or
wave volume. Both volumes are displayed as different color bar graphs.
*/

; --- User Settings ---

; The percentage by which to raise or lower the volume each time:
global config := {Step: 4}

; How long to display the volume level bar graphs:
config.DisplayTime := 2000

; Master Volume Bar color (see the help file to use more precise shades):
config.CBM := "Red"

; Wave Volume Bar color:
config.CBW := "Blue"

; Background color:
config.CW := "Silver"

; Bar's screen position. Use "center" to center the bar in that dimension:
config.PosX := "center"
config.PosY := "center"
config.Width := 150  ; width of bar
config.Thick := 12   ; thickness of bar

; If your keyboard has multimedia buttons for Volume, you can
; try changing the below hotkeys to use them by specifying
; Volume_Up, ^Volume_Up, Volume_Down, and ^Volume_Down:
config.MasterUp := "#Up"      ; Win+UpArrow
config.MasterDown := "#Down"
config.WaveUp := "+#Up"       ; Shift+Win+UpArrow
config.WaveDown := "+#Down"

; --- Auto Execute Section ---

; DON'T CHANGE ANYTHING HERE (unless you know what you're doing).

#SingleInstance

; Create the Progress window:
G := GuiCreate("+ToolWindow -Caption -Border +Disabled")
G.MarginX := 0, G.MarginY := 0
opt := "w" config.Width " h" config.Thick " background" config.CW
G.Add("Progress", opt " vMaster c" config.CBM)
G.Add("Progress", opt " vWave c" config.CBW)

; Register hotkeys:
Hotkey config.MasterUp,   () => ChangeVolume(G, "+")
Hotkey config.MasterDown, () => ChangeVolume(G, "-")
Hotkey config.WaveUp,     () => ChangeVolume(G, "+", "Wave")
Hotkey config.WaveDown,   () => ChangeVolume(G, "-", "Wave")

; --- Function Definitions ---

ChangeVolume(G, Prefix, ComponentType := "Master")
{
    SoundSet(Prefix config.Step, ComponentType)
    G.Control["Master"].Value := Round(SoundGet("Master"))
    G.Control["Wave"].Value := Round(SoundGet("Wave"))
    G.Show("x" config.PosX " y" config.PosY)
    SetTimer () => G.Hide(), -config.DisplayTime
}
