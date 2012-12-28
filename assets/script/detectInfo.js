function checkOs() {
	win32 = (navigator.userAgent.indexOf("Windows",0) != -1)?1:0;
	mac = (navigator.userAgent.indexOf("Mac",0) != -1)?1:0;
	linux = (navigator.userAgent.indexOf("Linux",0) != -1)?1:0;
	unix = (navigator.userAgent.indexOf("X11",0) != -1)?1:0;
 
	if (win32) {
		// if( navigator.userAgent.indexOf("64",0) != -1){
		// 	os_type = "win64";
		// }
		// else{
		// 	os_type = "win32";
		// }
		os_type = "win32";
	}
	else if (mac) os_type = "osx";
	else if (linux) os_type = "lunix";
 
	return os_type;
}

function fitSys() {
	var osType = checkOs();
	var downloadLink = [];
	downloadLink[0] = "http://download.wiz.cn/download?product=wiznote&client=windows-x32";
	downloadLink[1] = "http://download.wiz.cn/download?product=wiznote&client=windows-x64";
	downloadLink[2] = "http://download.wiz.cn/download?product=wiznote&client=macos";
	downloadLink[3] = "http://download.wiz.cn/download?product=wiznote&client=linux-x86";


	var downloadBtn = document.getElementById("fordl")

	switch(osType)
	{
		case "win32":
			downloadBtn.innerHTML = "下载为知笔记 Windows版";
			downloadBtn.href = downloadLink[0];
			break;
		// case "win64":
		// 	downloadBtn.innerHTML = "下载为知笔记 Windows 64位版";
		// 	downloadBtn.href = downloadLink[1];
		// 	break;

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