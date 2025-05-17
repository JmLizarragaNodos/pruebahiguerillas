class FechaService 
{
	constructor() 
	{
		this.primerslap = false;
		this.segundoslap = false;
	}

	cargarDatePicker(datos) 
	{
		let validarFecha = (dateString) => {
			// Analizar las partes de fecha en enteros
			var parts = dateString.split("-");
			var day = parseInt(parts[2], 10);
			var month = parseInt(parts[1], 10);
			var year = parseInt(parts[0], 10);

			if (day >= 1900)  // Si se esta usando el formato dd-MM-yyyy
			{
				var diaEncontrado = day;
				day = year;
				year = diaEncontrado;
			}

			// Checkear los rangos de mes y año
			if (year < 1000 || year >= 3000 || month == 0 || month > 12)
				return false;

			var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			// Ajustar para los años bisiestos
			if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
				monthLength[1] = 29;

			if ((day > 0 && day <= monthLength[month - 1]) == false) {
				//mostrarMensaje("El día ingresado no corresponde al mes seleccionado", "Informacion");
			}

			// Verificar el rango del día
			return day > 0 && day <= monthLength[month - 1];
		};

		//==============================================>>>>>

		let formatearfecha = (fecha) => {
			let esNumerico = (valor) => {
				let v1;
				let v2;
				var log = valor.length; var sw = "S";

				for (let x = 0; x < log; x++) {
					v1 = valor.substr(x, 1);
					v2 = parseInt(v1);
					if (isNaN(v2)) { sw = "N"; }  //Compruebo si es un valor numérico
				}
				if (sw == "S") { return true; } else { return false; }
			};

			let long = fecha.length;
			let dia;
			let mes;
			let ano;
			let separador = "-";

			if ((long >= 2) && (this.primerslap == false)) {
				dia = fecha.substr(0, 2);
				if ((esNumerico(dia) == true) && (dia <= 31) && (dia != "00")) { fecha = fecha.substr(0, 2) + separador + fecha.substr(3, 7); this.primerslap = true; }
				else { fecha = ""; this.primerslap = false; }
			}
			else {
				dia = fecha.substr(0, 1);
				if (esNumerico(dia) == false) { fecha = ""; }
				if ((long <= 2) && (this.primerslap = true)) { fecha = fecha.substr(0, 1); this.primerslap = false; }
			}
			if ((long >= 5) && (this.segundoslap == false)) {
				mes = fecha.substr(3, 2);
				if ((esNumerico(mes) == true) && (mes <= 12) && (mes != "00")) { fecha = fecha.substr(0, 5) + separador + fecha.substr(6, 4); this.segundoslap = true; }
				else { fecha = fecha.substr(0, 3);; this.segundoslap = false; }
			}
			else { if ((long <= 5) && (this.segundoslap = true)) { fecha = fecha.substr(0, 4); this.segundoslap = false; } }
			if (long >= 7) {
				ano = fecha.substr(6, 4);
				if (esNumerico(ano) == false) { fecha = fecha.substr(0, 6); }
				else { if (long == 10) { if ((ano == 0) || (ano < 1900) || (ano > 2100)) { fecha = fecha.substr(0, 6); } } }
			}
			if (long >= 10) {
				fecha = fecha.substr(0, 10);
				dia = fecha.substr(0, 2);
				mes = fecha.substr(3, 2);
				ano = fecha.substr(6, 4);

				// Año no viciesto y es febrero y el dia es mayor a 28
				if ((ano % 4 != 0) && (mes == "02") && (dia > 28)) { fecha = fecha.substr(0, 2) + separador; }
			}

			return (fecha);
		};

		//==============================================>>>>>

		var querySelector = datos.querySelector;

		let txtFecha = document.querySelector(querySelector);
		txtFecha.setAttribute("autocomplete", "off");

		if (datos.placeholder != null) {
			txtFecha.setAttribute("placeholder", datos.placeholder)
		}

		let elemento = $(querySelector);

		const retornoEvento = () => {
			let res = datos;
			let valor = elemento.val();

			if (valor.split("-").length == 3)   // Si es una fecha completa
				res.value = this.obtenerFechaInvertida(valor);

			return res;
		}

		elemento.datepicker({
			dateFormat: "dd-mm-yy",
			changeYear: true,   // Seleccionar año
			changeMonth: true,  // Seleccionar Dia
			yearRange: "1900:+0",
			firstDay: 1,  // Primer dia de la semana El lunes
			dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
			dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
			monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
			onSelect: () => {
				let retorno = retornoEvento();

				elemento.attr("fecha", this.obtenerFechaInvertida(elemento.val()))    // Coloca como atributo en el txt la fecha invertida
				//elemento.setAttribute("fecha", this.obtenerFechaInvertida(elemento.val()));  // Coloca como atributo en el txt la fecha invertida

				if (datos.onSelect != null && typeof datos.onSelect === "function") { // Si se desea ejecutar una funcion
					datos.onSelect(retorno);
				}
			}
		})
			.keyup(() => {
				elemento.val(formatearfecha(elemento.val()));

				if (elemento.val().length == 10)  // Si se completaron los caracteres de la fecha
				{
					if (!validarFecha(elemento.val())) {  // Si la fecha es invalida
						elemento.val("");
						elemento.removeAttr("fecha");  // Remueve el atributo con la fecha invertida en caso de que exista
						//this.removeAttribute("fecha");   // Remueve el atributo con la fecha invertida en caso de que exista
					}
					else {
						elemento.attr("fecha", obtenerFechaInvertida(elemento.val()))     // Coloca como atributo en el txt la fecha invertida
						//this.setAttribute("fecha", this.obtenerFechaInvertida(this.value));  // Coloca como atributo en el txt la fecha invertida

						if (datos.onSelect != null && typeof datos.onSelect === "function") { // Si se desea ejecutar una funcion
							datos.onSelect();
						}
					}
				}
				else {
					elemento.removeAttr("fecha");      // Remueve el atributo con la fecha invertida en caso de que exista
					//this.removeAttribute("fecha");   // Remueve el atributo con la fecha invertida en caso de que exista

					if (datos.onClear != null && typeof datos.onClear === "function") { // Si se desea ejecutar una funcion
						datos.onClear();
					}
				}
			})
			.focusout(function (evento) {
				if (!validarFecha(this.value)) {
					this.value = "";
					this.removeAttribute("fecha");   // Remueve el atributo con la fecha invertida en caso de que exista
				}
			});

	}

	obtenerFechaInvertida(fecha) {
		if ((typeof fecha === "string" || fecha instanceof String) && fecha != "") {
			if (fecha.includes("-")) { return fecha.split('-').reverse().join('-'); }
			if (fecha.includes("/")) { return fecha.split('/').reverse().join('/'); }
		}
		return "";
	}

}







