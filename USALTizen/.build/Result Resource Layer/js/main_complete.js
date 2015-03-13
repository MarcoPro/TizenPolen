

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

window.onload = function () {
	timebox = document.querySelector('#time');
	listenEvents();
	
	canvas_state[STATE_INIT]=document.getElementById('canvas');
	window.requestAnimationFrame(draw);
}



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


/*
 * Actualiza el reloj
 */
function refreshTime(){
	timebox.innerHTML=getTime();
}

/**
 * 
 * getPolenData
 */
function getPolenData(){
	if(navigator.onLine){
		showOverlay();
		var request = new Http.Get(Url, true);
		request.start().then(function(response) {
			hideOverlay();
			var itemsPolen=populateItems(response);
			viewSelectCity(itemsPolen);
			
			/*for(var i=0;i<itemsPolen.length;i++){
				if(itemsPolen[i].ciudad=="SALAMANCA"){
					alert(JSON.stringify(itemsPolen[i]));
				}
			}*/
		}).fail(function(error, errorCode) {
			hideOverlay();
		});
	}else{
		alert('Activa la conexión a internet');
	}
}

/*
 * getTime, devuelve una string con la hora actual con el formato hh:mm:ss
 */
function getTime(){
	var date=new Date();
	var hours=pad(date.getHours(),2);
	var minutes=pad(date.getMinutes(),2);
	var seconds=pad(date.getSeconds(),2);
	
	return hours+':'+minutes+':'+seconds;
}

/**
 * Cargamos los listen
 */
function listenEvents(){
	botonPolen = document.querySelector('#check_niveles a');
	botonPolen.addEventListener('click', function(e) {
			getPolenData();
	}, false);
}

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


/* Creamos pantalla view, donde mostraremos datos del polen */
function viewSelectCity(itemsPolen){
	var body = document.getElementsByTagName('body');
	body=body[0];
	
	var view=document.createElement("DIV");
	view.className = "view";
	body.appendChild(view);
	
	var volver=document.createElement("DIV");
	volver.className = "volver";
	view.appendChild(volver);
	
	var newSelect=document.createElement("SELECT");
	
	var opt = document.createElement("option");
	opt.innerHTML = '- Seleccione -';
	opt.value= '';
	newSelect.appendChild(opt);
	
	for(var i=0;i<itemsPolen.length;i++){
		var opt = document.createElement("option");
		var ciudad = itemsPolen[i].ciudad;
		opt.value= i;
		opt.innerHTML = ciudad;
		newSelect.appendChild(opt);
	}
	view.appendChild(newSelect);
	
	
	var blocks=document.createElement("DIV");
	blocks.className = "blocks";
	view.appendChild(blocks);
	
	newSelect.addEventListener('change', function(e) {
		if(this.value!=null && this.value!=""){
			var value=this.value;
			drawBlocksPolen(value,itemsPolen);
		}
	}, false);
	
	volver.addEventListener('click', function(e) {
		var view = document.querySelector('.view');
		view.remove();
		current_state=STATE_INIT;
	}, false);
	
	//añadimos la clase show a los 50 milisegundos para lanzar la transición CSS
	setTimeout(function(){
		view.className+=" show";
	}, 50);
}

function drawBlocksPolen(value,itemsPolen){
	var maxparticles={
			BAJO:3,
			MODERADO:25,
			ALTO:50,
	}
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
		
		var canvasBlock=document.createElement("CANVAS");
		canvasBlock.width = "360";
		canvasBlock.height = "140";
		canvasBlock.height = "140";
		canvasBlock.dataset.maxparticles=maxparticles[niveles[i].valor_real];
		
		block.innerHTML="<div class='nombre'>"+niveles[i].nombre+"</div>"+
		"<div class='valores "+niveles[i].valor_real+"'> Valor real: "+niveles[i].valor_real+"</div>"+
		"<div class='valores "+niveles[i].valor_previsto+"'> Valor previsto: "+niveles[i].valor_previsto+"</div>";
		block.appendChild(canvasBlock);
		blocks.appendChild(block);
	}
	
	canvas_state[STATE_PAGE_VIEW]=document.querySelectorAll('.view .block canvas');
	//cambiamos de estado VIEW
	current_state=STATE_PAGE_VIEW;
}

function drawParticles(canvas){
	//var canvas= document.getElementsByTagName('canvas')[0];
	var context = canvas.getContext('2d');
	var W=canvas.width=canvas.width;
	var H=canvas.height=canvas.height;
	
	var maxParticles=canvas.dataset.maxparticles;
	var heightBase=typeof canvas.dataset.heightbase != 'undefined'?canvas.dataset.heightbase:canvas.height;
	var particles=typeof canvas.dataset.particles != 'undefined'?JSON.parse(canvas.dataset.particles):[];
	//var particles=typeof canvas.dataset.particles != 'undefined'?canvas.dataset.particles:{};
	
	for(var i=0;i < maxParticles;i++){
		if(typeof particles[i] != 'undefined'){
			//console.log(particles[i]);
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



/* UTILS */

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



/* HTTP */

//	var request = new Http.Get(Url, true);
//	request.start().then(function(response) {
//		//OK
//	}).fail(function(error, errorCode) {
//		//Fail
//	}); 
	
	



//FRAGMENT 8.2///////////////////////////
var canvasBlock=document.createElement("CANVAS");
canvasBlock.width = "360";
canvasBlock.height = "140";
canvasBlock.height = "140";
canvasBlock.dataset.maxparticles=maxparticles[niveles[i].valor_real];
block.appendChild(canvasBlock);
//END-FRAGMENT 8.2///////////////////////

//FRAGMENT 8.3///////////////////////////
//recopilamos los elementos canvas de los bloques
canvas_state[STATE_PAGE_VIEW]=document.querySelectorAll('.view .block canvas');
//END-FRAGMENT 8.3///////////////////////

