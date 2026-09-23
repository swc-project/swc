$source = @'
using System;
using System.ComponentModel;
using System.IO;
using System.Runtime.InteropServices;
public class NativeDelete {
 [DllImport("kernel32",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr CreateFileW(string p,uint a,uint s,IntPtr q,uint d,uint f,IntPtr t);
 [DllImport("kernel32",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr LoadLibraryW(string p);
 [DllImport("kernel32",SetLastError=true)] static extern bool FreeLibrary(IntPtr h);
 [DllImport("kernel32",SetLastError=true)] static extern bool CloseHandle(IntPtr h);
 [DllImport("kernel32",SetLastError=true)] static extern bool SetFileInformationByHandle(IntPtr h,int c,ref uint f,uint n);
 [DllImport("kernel32",SetLastError=true)] static extern bool SetFileInformationByHandle(IntPtr h,int c,IntPtr f,uint n);
 public static void Rename(string path, uint flags) {
  File.Copy(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.System),"version.dll"),path);
  IntPtr module=LoadLibraryW(path);Console.WriteLine("rename flags="+flags+" load="+module);
  string staged=path+".new";
  IntPtr file=CreateFileW(staged,0xC0010000,7,IntPtr.Zero,1,0x04000000,IntPtr.Zero);
  byte[] name=System.Text.Encoding.Unicode.GetBytes(path);
  IntPtr info=Marshal.AllocHGlobal(20+name.Length);
  Marshal.WriteInt32(info,0,(int)flags);Marshal.WriteIntPtr(info,8,IntPtr.Zero);Marshal.WriteInt32(info,16,name.Length);Marshal.Copy(name,0,IntPtr.Add(info,20),name.Length);
  Console.WriteLine("rename="+SetFileInformationByHandle(file,22,info,(uint)(20+name.Length))+" error="+Marshal.GetLastWin32Error());
  Marshal.FreeHGlobal(info);CloseHandle(file);
  Console.WriteLine("after-replace exists="+File.Exists(path));
  FreeLibrary(module);if(File.Exists(path))File.Delete(path);
 }
 public static void Run(string path, uint flags, bool after, bool legacy) {
  File.Copy(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.System),"version.dll"),path);
  IntPtr h=CreateFileW(path,0x80010000,7,IntPtr.Zero,3,legacy?0x04000000u:0u,IntPtr.Zero);
  Console.WriteLine("open="+h+" error="+Marshal.GetLastWin32Error());
  if(!after && flags!=0)Console.WriteLine("pre-set="+SetFileInformationByHandle(h,21,ref flags,4)+" error="+Marshal.GetLastWin32Error());
  IntPtr module=LoadLibraryW(path); Console.WriteLine("load="+module+" error="+Marshal.GetLastWin32Error());
  if(after)Console.WriteLine("post-set="+SetFileInformationByHandle(h,21,ref flags,4)+" error="+Marshal.GetLastWin32Error());
  Console.WriteLine("close="+CloseHandle(h)+" exists="+File.Exists(path));
  FreeLibrary(module);Console.WriteLine("after-unmap exists="+File.Exists(path));
  if(File.Exists(path))File.Delete(path);
 }
}
'@
Add-Type -TypeDefinition $source
foreach($legacy in @($false,$true)) { foreach($after in @($false,$true)) { foreach($flags in @(0,1,3,9,11)) {
 Write-Output "legacy=$legacy after=$after flags=$flags"
 $file=Join-Path $env:TEMP ([guid]::NewGuid().ToString()+'.dll')
 [NativeDelete]::Run($file,$flags,$after,$legacy)
}}}

foreach($flags in @(1,3,67)) { [NativeDelete]::Rename((Join-Path $env:TEMP ([guid]::NewGuid().ToString()+".dll")),$flags) }
