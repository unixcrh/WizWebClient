function checkOs() {
	win32 = (navigator.userAgent.indexOf("Windows",0) != -1)?1:0;
	mac = (navigator.userAgent.indexOf("Mac",0) != -1)?1:0;
	linux = (navigator.userAgent.indexOf("Linux",0) != -1)?1:0;
	unix = (navigator.userAgent.indexOf("X11",0) != -1)?1:0;
 
	if (win32) {
		if( navigator.userAgent.indexOf("64",0) != -1){
			os_type = "win64";
		}
		else{
			os_type = "win32";
		}
	}
	else if (mac) os_type = "osx";
	else if (linux) os_type = "lunix";
 
	return os_type;
}

function fitSys() {
	var osType = checkOs();
	var downloadLink = [];
	downloadLink[0] = "http://www.wiz.cn/down/?p=wiz&m=x86.ct&ts=20111206";
	downloadLink[1] = "http://www.wiz.cn/down/?p=wiz&m=x64&ts=20111028";
	downloadLink[2] = "http://www.wiz.cn/down/?p=wiznote&m=mac";
	downloadLink[3] = "/wiznote-linux";


	var downloadBtn = document.getElementById("fordl")

	switch(osType)
	{
		case "win32":
			downloadBtn.innerHTML = "下载为知笔记 Windows X86版";
			downloadBtn.href = downloadLink[0];
			break;
		case "win64":
			downloadBtn.innerHTML = "下载为知笔记 Windows 64位版";
			downloadBtn.href = downloadLink[1];
			break;

		case "osx":
			downloadBtn.innerHTML = "下载为知笔记 Mac OS X版";
			downloadBtn.href = downloadLink[2];
			break;
		case "linux":
			downloadBtn.innerHTML = "下载为知笔记 Linux版";
			downloadBtn.href = downloadLink[3];
			break;
	}
	// alert( navigator.userAgent );

}