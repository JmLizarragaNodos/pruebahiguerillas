let operacion = ""; 
this.objeto = {}; 
let paginaActual = 0; 
let totalPaginas = 0; 
let util = new UtilidadesService(); 
let http = new HttpService(); 
let fechaService = new FechaService(); 

(() => 
{ 
	obtenerListaPrincipal(); 
})(); 

window.onload = () => 
{ 
	menuLateral({ querySelector: '#menu-lateral' }); 
	util.habilitarTooltips(); 

}; 

function obtenerConsultaBuscador() 
{ 
	let filtroBusqueda = document.querySelector("#filtroBusqueda"); 
	let nombre = filtroBusqueda.querySelector("[name='nombre']").value; 
	let direccion = filtroBusqueda.querySelector("[name='direccion']").value; 
	let telefono = filtroBusqueda.querySelector("[name='telefono']").value; 
	let nombreContactoEmergencia = filtroBusqueda.querySelector("[name='nombreContactoEmergencia']").value; 
	let relacionParentescoContactoEmergencia = filtroBusqueda.querySelector("[name='relacionParentescoContactoEmergencia']").value; 
	let direccionContactoEmergencia = filtroBusqueda.querySelector("[name='direccionContactoEmergencia']").value; 
	let telefonoEmailContactoEmergencia = filtroBusqueda.querySelector("[name='telefonoEmailContactoEmergencia']").value; 
	let estaEnteradoContactoEmergencia = filtroBusqueda.querySelector("[name='estaEnteradoContactoEmergencia']").value; 
	let revisado = filtroBusqueda.querySelector("[name='revisado']").value; 
 
	let consulta = { 
		nombre: (nombre != "") ? nombre : null, 
		direccion: (direccion != "") ? direccion : null, 
		telefono: (telefono != "") ? telefono : null, 
		nombreContactoEmergencia: (nombreContactoEmergencia != "") ? nombreContactoEmergencia : null, 
		relacionParentescoContactoEmergencia: (relacionParentescoContactoEmergencia != "") ? relacionParentescoContactoEmergencia : null, 
		direccionContactoEmergencia: (direccionContactoEmergencia != "") ? direccionContactoEmergencia : null, 
		telefonoEmailContactoEmergencia: (telefonoEmailContactoEmergencia != "") ? telefonoEmailContactoEmergencia : null, 
		estaEnteradoContactoEmergencia: (estaEnteradoContactoEmergencia != "") ? estaEnteradoContactoEmergencia : "null", 
		revisado: (revisado != "") ? revisado : "null", 
	}; 
	return consulta; 
} 

async function obtenerListaPrincipal() 
{ 
	let tabla = document.querySelector('#tablaPrincipal'); 
	tabla.innerHTML = ''; 

	let registrosPorPagina = 10; 
	let inicio = paginaActual * registrosPorPagina; 

	let consulta = obtenerConsultaBuscador(); 
	consulta.start = inicio; 
	consulta.length = registrosPorPagina; 

	let parametros = Object.entries(consulta).map(c=> c.join("=")).join("&"); 

	util.showLoading(); 

	try { 
		let res = await http.get(`encuesta/llenarDataTable.php?${parametros}`); 
		let totalRegistros = parseInt(res.recordsTotal); 
		totalPaginas = Math.ceil(totalRegistros / registrosPorPagina) - 1; 

		if (res.informacionExtra != null) 
			console.log(util.imprimirSQL(res.informacionExtra)); 

		util.desplegarPaginacion({ 
			querySelector: '#div_numeros_paginacion', 
			paginaActual: paginaActual, 
			totalRegistros: totalRegistros, 
			totalPaginas: totalPaginas, 
			registrosPorPagina: registrosPorPagina, 
			pasoAtras: () => { paginaActual --; obtenerListaPrincipal() }, 
			pasoAdelante: () => { paginaActual ++; obtenerListaPrincipal() }, 
			seleccionarPagina: (e) => { 
				paginaActual = parseInt(e.target.getAttribute('numeroPagina')); 
				obtenerListaPrincipal() 
			} 
		}); 

		tabla.innerHTML = ` 
		<table id='tablaPrincipal' class='table table-bordered'> 
			<thead> 
				<tr> 
					<th>Id</th> 
					<th>Nombre</th> 
					<th>Direccion</th> 
					<th>Telefono</th> 
					<th>Nombre Contacto Emergencia</th> 
					<th>Relacion Parentesco Contacto Emergencia</th> 
					<th>Direccion Contacto Emergencia</th> 
					<th>Telefono Email Contacto Emergencia</th> 
					<th>Esta Enterado Contacto Emergencia</th> 
					<th>Revisado</th> 
					<th></th> 
					<th></th> 
				</tr> 
			</thead> 
			<tbody> 
				${res.data.map(c => 
				{ 
					return ` 
					<tr> 
						<td>${c.id}</td> 
						<td>${util.resumirConTooltip(c.nombre)}</td> 
						<td>${util.resumirConTooltip(c.direccion)}</td> 
						<td>${util.resumirConTooltip(c.telefono)}</td> 
						<td>${util.resumirConTooltip(c.nombreContactoEmergencia)}</td> 
						<td>${util.resumirConTooltip(c.relacionParentescoContactoEmergencia)}</td> 
						<td>${util.resumirConTooltip(c.direccionContactoEmergencia)}</td> 
						<td>${util.resumirConTooltip(c.telefonoEmailContactoEmergencia)}</td> 
						<td>${c.estaEnteradoContactoEmergencia}</td> 
						<td>${c.revisado}</td> 
						<td> 
							<button type='button' onclick='abrirModalEditar(${c.id})' class='btn btn-link'>Editar</button> 
						</td> 
						<td> 
							<button type='button' onclick='abrirModalEliminar(${c.id})' class='btn btn-link'>Eliminar</button> 
						</td> 
					</tr> 
					`; 
				}) 
				.join('')} 
			</tbody> 
		</table>`; 
	} 
	catch (ex) { 
		http.mostrarErrores(ex); 
	} 
	finally { util.hideLoading() } 
} 

function resetearPaginacion() 
{ 
	paginaActual = 0; 
	totalPaginas = 0; 
} 

function abrirModalCrear() 
{ 
	document.querySelector("#modalCrearEditar [name='titulo']").textContent = 'Crear Encuesta'; 

	this.objeto = { 
		nombre: "", 
		direccion: "", 
		telefono: "", 
		nombreContactoEmergencia: "", 
		relacionParentescoContactoEmergencia: "", 
		direccionContactoEmergencia: "", 
		telefonoEmailContactoEmergencia: "", 
		estaEnteradoContactoEmergencia: "", 
		revisado: "", 
	}; 

	operacion = 'crear'; 

	util.limpiarFormulario('#modalCrearEditar'); 
	util.showModal('#modalCrearEditar'); 
} 

function validar() 
{ 
	let errores = []; 

	if (!util.validarNuloVacio(this.objeto.nombre)) 
		errores.push('El campo nombre no posee un valor'); 

	if (!util.validarNuloVacio(this.objeto.direccion)) 
		errores.push('El campo direccion no posee un valor'); 

	if (!util.validarNuloVacio(this.objeto.telefono)) 
		errores.push('El campo telefono no posee un valor'); 

	if (!util.validarNuloVacio(this.objeto.nombreContactoEmergencia)) 
		errores.push('El campo nombreContactoEmergencia no posee un valor'); 

	if (!util.validarNuloVacio(this.objeto.relacionParentescoContactoEmergencia)) 
		errores.push('El campo relacionParentescoContactoEmergencia no posee un valor'); 

	if (!util.validarNuloVacio(this.objeto.direccionContactoEmergencia)) 
		errores.push('El campo direccionContactoEmergencia no posee un valor'); 

	if (!util.validarNuloVacio(this.objeto.telefonoEmailContactoEmergencia)) 
		errores.push('El campo telefonoEmailContactoEmergencia no posee un valor'); 

	if (!util.validarNuloVacio(this.objeto.estaEnteradoContactoEmergencia)) 
		errores.push('El campo estaEnteradoContactoEmergencia no posee un valor'); 

	if (!util.validarNuloVacio(this.objeto.revisado)) 
		errores.push('El campo revisado no posee un valor'); 

	if (errores.length > 0) { 
		alert(errores.reverse().map(c => `- ${c}.`).join('|')); 
		return false; 
	} 
	return true; 
} 

async function guardar() 
{ 
	if (!validar()) return; 
	util.showLoading(); 

	try 
	{ 
		if (operacion == "crear") 
			await http.post('encuesta/insertar.php', this.objeto); 
		else 
			await http.put('encuesta/actualizar.php', this.objeto); 

		obtenerListaPrincipal(); 
		util.hideModal('#modalCrearEditar'); 
	} 
	catch (ex) { 
		http.mostrarErrores(ex); 
	} 
	finally { util.hideLoading() } 
} 

async function abrirModalEditar(id) 
{ 
	document.querySelector("#modalCrearEditar [name='titulo']").textContent = "Editar Encuesta"; 
	util.showLoading(); 

	try { 
		this.objeto = await http.get(`encuesta/traerRegistro.php?id=${id}`); 
		operacion = 'editar'; 
		util.llenarFormulario({ querySelector: '#modalCrearEditar', objeto: this.objeto }); 

		util.showModal('#modalCrearEditar'); 
	} 
	catch (ex) { 
		http.mostrarErrores(ex); 
	} 
	finally { util.hideLoading() } 
} 

function abrirModalEliminar(id) 
{ 
	document.querySelector("#modalEliminar [name='id']").value = id; 
	util.showModal("#modalEliminar"); 
} 

async function eliminar() 
{ 
	let id = document.querySelector("#modalEliminar [name='id']").value; 
	util.showLoading(); 

	try { 
		await http.delete(`encuesta/eliminar.php?id=${id}`); 
		obtenerListaPrincipal(); 
		util.hideModal('#modalEliminar'); 
	} 
	catch (ex) { 
		http.mostrarErrores(ex); 
	} 
	finally { util.hideLoading() } 
} 

