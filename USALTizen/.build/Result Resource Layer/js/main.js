

/* INICIALIZACIÖN DE VARIABLES*/
	//timebox, elemento del DOM que representara la hora
	var timebox;
	
	
	//URL OpenData Polen
	var Url="http:pruebas2.flagsolutions.net/pebble/pollenproxy.php";
	
	//Máquina de estados
	const STATE_INIT=0;
	const STATE_PAGE_VIEW=10;
	
	var current_state=0;
	var canvas_state={
		STATE_INIT:null,
		STATE_PAGE_VIEW:null,
	}
///////////////////////////////

	
	
//EVENT ONLOAD, se lanza cuando el DOM se ha cargado completamente	
window.onload = function () {
	timebox = document.querySelector('#time');
	
	//FRAGMENT 1////////////////////////
	//END-FRAGMENT 1////////////////////////
	
	
	//FRAGMENT 7.1///////////////////////////
	//END-FRAGMENT 7.1///////////////////////
	
	window.requestAnimationFrame(draw);
}


//FRAGMENT 7.2///////////////////////////
	/* Función principal para el pintado
	 * Encargada de refrescar/redibujar
	 * */
	function draw(){
		refreshTime();
		//FRAGMENT 6.3////////////////////////
			
		//END-FRAGMENT 6.3////////////////////
		window.requestAnimationFrame(draw);
		
	}

//END-FRAGMENT 7.2///////////////////////


/*
 * Actualizamos el reloj, format: hh:mm:ss
 */
function refreshTime(){
	timebox.innerHTML=getTime();
}

/*
 * getTime, devuelve una string con la hora actual. format: hh:mm:ss
 */
function getTime(){
	var date=new Date();
	var hours=pad(date.getHours(),2);
	var minutes=pad(date.getMinutes(),2);
	var seconds=pad(date.getSeconds(),2);
	
	return hours+':'+minutes+':'+seconds;
}

//FRAGMENT 2.2////////////////////////////
//END-FRAGMENT 2.2////////////////////////


//FRAGMENT 3.2////////////////////////////
//END-FRAGMENT 3.2////////////////////////

//FRAGMENT 4.2///////////////////////////	
//END-FRAGMENT 4.2///////////////////////
	
//FRAGMENT 5.2///////////////////////////	
//END-FRAGMENT 5.2///////////////////////
	
	
//FRAGMENT 6.2//////////////////////////
//END-FRAGMENT 6.2//////////////////////






	
											/** UTILS **/
/*
 * pad rellena, por la izquierda, una string con un carácter definido, Ejemplo:
 * pad('8', 2, '0') => 08, pad('8', 3, 'XX') => XX8
 */
//function pad(number, width, fill)

/*
 * Muestra un overlay con un loading
 */
//showOverlay()

/*
 * Oculta el overlay
 */
//hideOverlay()()



											/** HTTP **/

//	var request = new Http.Get(Url, true);
//	request.start().then(function(response) {
//		//OK
//	}).fail(function(error, errorCode) {
//		//Fail
//	}); 
	
	