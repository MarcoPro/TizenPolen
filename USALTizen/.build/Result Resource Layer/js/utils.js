/* UTILS */

/*
 * pad rellena, por la izquierda, una string con un carácter definido, Ejemplo: pad('8', 2, '0') => 08, pad('8', 3, 'XX') => XX8
 */
function pad(number, width, fill) {
	fill = fill || '0';
	number = String(number);
	return number.length >= width ? number : new Array(width - number.length + 1).join(fill) + number;
}

/*
 * Muestra un overlay con un loading
 */
function showOverlay(){
	hideOverlay();
	var body = document.getElementsByTagName('body');
	body=body[0];
	
	var overlay=document.createElement("DIV");
	overlay.className = "overlay";
	body.appendChild(overlay);
}

/*
 * Oculta el overlay
 */
function hideOverlay(){
	var element = document.querySelector('.overlay');
	if(element!=null){
		element.remove();
	}
}


