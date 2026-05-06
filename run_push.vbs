Set objShell = CreateObject("WScript.Shell")
strCommand = "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\final_push.bat"
objShell.Run strCommand, 1, True
WScript.Echo "Batch file executed"
