; Volume On-Screen-Display (OSD) -- by Rajat
; http://www.autohotkey.com
; This script assigns hotkeys of your choice to raise and lower the
; master and/or wave volume.  Both volumes are displayed as different
; color bar graphs.

;_________________________________________________ 
;_______User Settings_____________________________ 

; Make customisation only in this area or hotkey area only!! 

; The percentage by which to raise or lower the volume each time:
vol_Step := 4

; How long to display the volume level bar graphs:
vol_DisplayTime := 2000

; Master Volume Bar color (see the help file to use more
; precise shades):
vol_CBM := "Red"

; Wave Volume Bar color
vol_CBW := "Blue"

; Background color
vol_CW := "Silver"

; Bar's screen position.  Use "center" to center the bar in that dimension:
vol_PosX := "center"
vol_PosY := "center"
vol_Width := 150  ; width of bar
vol_Thick := 12   ; thickness of bar

; If your keyboard has multimedia buttons for Volume, you can
; try changing the below hotkeys to use them by specifying
; Volume_Up, ^Volume_Up, Volume_Down, and ^Volume_Down:
HotKey, #Up, vol_MasterUp      ; Win+UpArrow
HotKey, #Down, vol_MasterDown
HotKey, +#Up, vol_WaveUp       ; Shift+Win+UpArrow
HotKey, +#Down, vol_WaveDown


;___________________________________________ 
;_____Auto Execute Section__________________ 

; DON'T CHANGE ANYTHING HERE (unless you know what you're doing).

#SingleInstance

; Progress window

Gui := GuiCreate("+ToolWindow -Caption -Border +Disabled")
Gui.MarginX := 0, Gui.MarginY := 0
Master := Gui.Add("Progress", "w%vol_Width% h%vol_Thick% c%vol_CBM% background%vol_CW%")
Wave := Gui.Add("Progress", "w%vol_Width% h%vol_Thick% c%vol_CBW% background%vol_CW%")
Return

;___________________________________________ 

vol_WaveUp:
SoundSet, +%vol_Step%, Wave
Gosub, vol_ShowBars
return

vol_WaveDown:
SoundSet, -%vol_Step%, Wave
Gosub, vol_ShowBars
return

vol_MasterUp:
SoundSet, +%vol_Step%
Gosub, vol_ShowBars
return

vol_MasterDown:
SoundSet, -%vol_Step%
Gosub, vol_ShowBars
return

vol_ShowBars:
; Get both volumes in case the user or an external program changed them:
Master.Value := Round(SoundGet("Master"))
Wave.Value := Round(SoundGet("Wave"))
Gui.Show("x%vol_PosX% y%vol_PosY%")
SetTimer, vol_BarOff, -%vol_DisplayTime%
return

vol_BarOff:
Gui.Hide()
return
