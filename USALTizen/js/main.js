

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
	
	//FRAGMENT 1 ////////////////////////
		botonPolen = document.querySelector('#check_niveles a');
		botonPolen.addEventListener('click', function(e) {
			//FRAGMENT 2.1 ////////////////////////
			getPolenData();
			//END-FRAGMENT 2.1 ////////////////////
		}, false);
	//END-FRAGMENT 1 ////////////////////////
	
	
	//FRAGMENT 7.1///////////////////////////
		canvas_state[STATE_INIT]=document.getElementById('canvas');
	//END-FRAGMENT 7.1///////////////////////
	window.requestAnimationFrame(draw);
}


	//FRAGMENT 7.2///////////////////////////
	/* Función principal para el pintado
	 * Encargada de refrescar/redibujar
	 * */
	function draw(){
		switch (current_state) {
			case STATE_INIT:
				refreshTime();
				drawParticles(canvas_state[STATE_INIT]);
				break;
			case STATE_PAGE_VIEW:
				if(canvas_state[STATE_PAGE_VIEW]!=null){
					for(var i=0;i<canvas_state[STATE_PAGE_VIEW].length;i++){
						
						drawParticles(canvas_state[STATE_PAGE_VIEW][i]);
					}
				}
				break;
		}
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

//FRAGMENT 2.2 ////////////////////////
/**
 * getPolenData
 */
function getPolenData(){
	if(navigator.onLine){
		showOverlay();
		var request = new Http.Get(Url, true);
		request.start().then(function(response) {
			//FRAGMENT 3.1 ////////////////////////
				hideOverlay();
				var itemsPolen=populateItems(response);
				//FRAGMENT 4.1 ////////////////////////
				viewSelectCity(itemsPolen);
				//END-FRAGMENT 4.1 ////////////////////
			//END-FRAGMENT 3.1 ////////////////////
		}).fail(function(error, errorCode) {
			hideOverlay();
		});
	}else{
		alert('Activa la conexión a internet!!');
	}
}
//END-FRAGMENT 2.2 ////////////////////

//FRAGMENT 3.2////////////////////////
/* Parseamos el JSON para simplificarlo */
function populateItems(polenData){
	var items = [];
	var count = 0;
	for ( var i = 0; i < polenData.list.element.estacion.length; i++) {
		// For por ciudad...
		var ciudad = polenData.list.element.estacion[i]["@attributes"].nombre;
		var niveles = [];
		for ( var j = 0; j < polenData.list.element.estacion[i].tipo_polinico.length; j++) {
			// For each estacion...
			nivelesTipo={};
			nivelesTipo['nombre']=polenData.list.element.estacion[i].tipo_polinico[j]["@attributes"].nombre;
			nivelesTipo['valor_real']=polenData.list.element.estacion[i].tipo_polinico[j].valor_real;
			nivelesTipo['valor_previsto']=polenData.list.element.estacion[i].tipo_polinico[j].valor_previsto;
			niveles.push(nivelesTipo);
		}
		items.push({
			ciudad : ciudad,
			niveles : niveles,
		});
	}
	return items;
}
//END-FRAGMENT 3.2////////////////////////

//FRAGMENT 4.2///////////////////////////
/* Creamos pantalla view, donde mostraremos datos del polen */
function viewSelectCity(itemsPolen){
	var body = document.getElementsByTagName('body')[0];
	
	//creamos contenedor de la nueva vista
	var view=document.createElement("DIV");
	view.className = "view";
	body.appendChild(view);
	
	//Botón Volver
	var volver=document.createElement("DIV");
	volver.className = "volver";
	view.appendChild(volver);
	
	//select para ciudades
	var newSelect=document.createElement("SELECT");
	
	//primer elemento del select
	var opt = document.createElement("option");
	opt.innerHTML = '- Seleccione -';
	opt.value= '';
	newSelect.appendChild(opt);
	
	//rellenamos el select con las ciudades
	for(var i=0;i<itemsPolen.length;i++){
		var opt = document.createElement("option");
		var ciudad = itemsPolen[i].ciudad;
		opt.value= i;
		opt.innerHTML = ciudad;
		newSelect.appendChild(opt);
	}
	view.appendChild(newSelect);
	
	//contenedor de bloques con información del polen
	var blocks=document.createElement("DIV");
	blocks.className = "blocks";
	view.appendChild(blocks);
	
	//evento CHANGE del select
	newSelect.addEventListener('change', function(e) {
		//FRAGMENT 5.1 ////////////////////////
		drawBlocksPolen(this.value,itemsPolen);
	//END-FRAGMENT 5.1 ////////////////////
	}, false);
	
	//evento click del botón volver
	volver.addEventListener('click', function(e) {
		var view = document.querySelector('.view');
		view.remove();
		//FRAGMENT 7.3///////////////////////////
			current_state=STATE_INIT;
		//END-FRAGMENT 7.3///////////////////////
	}, false);
	
	//añadimos la clase show a los 50 milisegundos para lanzar la transición CSS
	setTimeout(function(){
		view.className+=" show";
	}, 50);
}
//END-FRAGMENT 4.2///////////////////////
	
//FRAGMENT 5.2///////////////////////////
function drawBlocksPolen(value,itemsPolen){
	//FRAGMENT 8.1///////////////////////////
	var maxparticles={
			BAJO:5,
			MODERADO:25,
			ALTO:50,
	}
//END-FRAGMENT 8.1///////////////////////

	var view = document.querySelector('.view');
	view.className+=" auto";
	
	var blocks = document.querySelector('.view .blocks');
	blocks.remove();
	
	var blocks=document.createElement("DIV");
	blocks.className = "blocks";
	view.appendChild(blocks);
	
	niveles=itemsPolen[value].niveles;
	
	for(var i=0;i<niveles.length;i++){
		var block=document.createElement("DIV");
		block.className = "block";
		
		block.innerHTML="<div class='nombre'>"+niveles[i].nombre+"</div>"+
		"<div class='valores "+niveles[i].valor_real+"'> Valor real: "+niveles[i].valor_real+"</div>"+
		"<div class='valores "+niveles[i].valor_previsto+"'> Valor previsto: "+niveles[i].valor_previsto+"</div>";
		blocks.appendChild(block);
		
		//FRAGMENT 8.2///////////////////////////
		var canvasBlock=document.createElement("CANVAS");
		canvasBlock.width = "360";
		canvasBlock.height = "140";
		canvasBlock.height = "140";
		canvasBlock.dataset.maxparticles=maxparticles[niveles[i].valor_real];
		block.appendChild(canvasBlock);
	//END-FRAGMENT 8.2///////////////////////
	}
	
	//FRAGMENT 8.3///////////////////////////
	canvas_state[STATE_PAGE_VIEW]=document.querySelectorAll('.view .block canvas');
//END-FRAGMENT 8.3///////////////////////	
	//FRAGMENT 7.4///////////////////////////
	current_state=STATE_PAGE_VIEW;
	//END-FRAGMENT 7.4///////////////////////
}
//END-FRAGMENT 5.2///////////////////////
	
	
//FRAGMENT 6.2///////////////////////////
function drawParticles(canvas){
	var context = canvas.getContext('2d');
	var W=canvas.width=canvas.width;
	var H=canvas.height=canvas.height;
	
	var maxParticles=canvas.dataset.maxparticles;
	var heightBase=typeof canvas.dataset.heightbase != 'undefined'?canvas.dataset.heightbase:canvas.height;
	var particles=typeof canvas.dataset.particles != 'undefined'?JSON.parse(canvas.dataset.particles):[];
	
	for(var i=0;i < maxParticles;i++){
		if(typeof particles[i] != 'undefined'){
			if(particles[i].x>W || particles[i].x<0 || particles[i].y<0){
				particles[i].x=Math.random()*W;
				particles[i].y=heightBase;
			}else{
				particles[i].x+=Math.random()*particles[i].velocityX;
				particles[i].y-=Math.random()*particles[i].velocityY;
			}
			
			context.fillStyle = particles[i].color;
			context.beginPath();
			context.arc(particles[i].x,particles[i].y, particles[i].radius, 0, 2 * Math.PI, true);
			context.closePath();
			context.fill();
		}else{
			var radius=Math.random()*3;
			particles.push({
				color:'#FFF',
				x:Math.random()*W,
				y:heightBase,
				velocityY:Math.random()+((3-radius)/3),
				velocityX:Math.random(),
				radius:radius,
			});
		}
	}
	
	canvas.dataset.particles=JSON.stringify(particles);
}
//END-FRAGMENT 6.2///////////////////////






	
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
	
	