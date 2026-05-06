Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Set working directory
strPath = "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
strBatchFile = strPath & "\EXECUTE_PUSH.bat"

' Run batch file
objShell.CurrentDirectory = strPath
objShell.Run strBatchFile, 1, False
