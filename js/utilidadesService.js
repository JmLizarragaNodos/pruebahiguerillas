class UtilidadesService 
{
    showLoading() {
        document.querySelector("#loading-spinner").style.display = "block";
    }
    
    hideLoading() {
        document.querySelector("#loading-spinner").style.display = "none";
    }

    showModal(querySelector) {
        $(querySelector).modal("show"); 
    }

    hideModal(querySelector) {
        $(querySelector).modal("hide"); 
    }

    oscurecerModal(querySelector) {
        // $(querySelector).css("opacity", "0.5");
        $(querySelector).addClass("modal-oscuro");
    }
    
    aclararModal(querySelector) {
        // $(querySelector).css("opacity", "");
        $(querySelector).removeClass("modal-oscuro");
    }

    definirModal(datos) 
    {
        if (datos.open != null && typeof datos.open === "function")
            $(datos.querySelector).on("show.bs.modal", datos.open);
        
        if (datos.close != null && typeof datos.close === "function")
            $(datos.querySelector).on("hidden.bs.modal", datos.close);
    }

    validarNuloVacio(contenido)
    {
		if (contenido == null || contenido === "")
			return false;
		else
			return true;
    }

    habilitarTooltips() 
    {
        let currentTooltip = null;

        document.body.addEventListener('mouseover', (e) => {
            const el = e.target?.closest?.('[data-bs-toggle="tooltip"]');
            if (el && !el._tooltipShown) {
            if (currentTooltip) {
                currentTooltip.dispose();
                currentTooltip = null;
            }

            currentTooltip = new bootstrap.Tooltip(el);
            el._tooltipShown = true;
            currentTooltip.show();

            el.addEventListener('mouseleave', () => {
                currentTooltip?.dispose();
                el._tooltipShown = false;
                currentTooltip = null;
            }, { once: true });
            }
        });
    }
	
	resumirConTooltip(entrada, size = 40) 
	{
		if (entrada == null) return entrada;

		// Caso: entrada es texto
		if (typeof entrada === "string") {
			if (entrada.includes("\\n")) entrada = entrada.split("\\n").join("\n");

			if (entrada.length > size) {
				let titulo = entrada.replaceAll("\"", "&quot;");
				if (titulo.includes("\n")) titulo = titulo.split("\n").join("<br/>");

				return `<container data-bs-toggle="tooltip" title="${titulo}" style="cursor: pointer">${entrada.slice(0, size)} ...</container>`;
			}

			return entrada;
		}

		// Caso: entrada es un objeto JSON (no array)
		if (typeof entrada === "object" && !Array.isArray(entrada)) {
			const lineas = Object.entries(entrada).map(([clave, valor]) => `${clave}: ${valor}`);
			const resumen = `{ ${lineas.join(", ")} }`;
			let titulo = lineas.join("<br/>").replaceAll("\"", "&quot;");

			if (resumen.length > size) {
				return `<container data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="${titulo}" style="cursor: pointer">{ ${resumen.slice(2, size)} ... }</container>`;
			}

			return resumen;
		}

		// Otros tipos (números, booleanos, arrays, etc.)
		return String(entrada);
	}

    llenarFormulario(datos)
    {
        // datos = { querySelector: "#modalCrearEditar", objeto: this.objeto };

        Object.entries(datos.objeto).forEach(([key, value]) => 
        {
            let elemento = document.querySelector(`${datos.querySelector} [name='${key}']`);

            if (elemento != null && typeof value !== "object") 
            {
                // console.log(`key: ${key} | value: ${value}`);
                // console.log(elemento);
                // console.log(elemento.tagName);  // tagName    
                elemento.value = value;   
                //console.log("=====================================>>>>");
            }
        });
    }

    limpiarFormulario(querySelector)
    {
        Array.from($(querySelector).find(":input"))
        .filter(x => x.className.includes("form-control") && x.attributes.getNamedItem("no-limpiar") == null).forEach(x => 
        {
            x.value = "";
        });

        Array.from($(querySelector).find("select"))
        .filter(x => x.attributes.getNamedItem("no-limpiar") == null).forEach(x => 
        {
            //console.log(x);
            $(`${querySelector} [name='${x.name}']`).find("option:first-child").prop("selected", true).trigger("chosen:updated");
        });
    }

    llenarSelect2(datos)
    {
        /*
        {
            querySelector: "#select2_asignaturas",
            url: "DEF_TASIG_MC.aspx/Get_ProgramasFormacionRecomendados_Select2",
            consultarPorRut: true,
            maxlength: 15,
            placeholder: "Seleccione una Asignatura",
            registrosPorPagina: 5,
            multiple: true,
            params: { i_carr_ccod: "T66" },
            optionsSeleccionados: [
                { id: "DC0801", text: "DC0801-COMPUTACIÓN APLICADA I" },
                { id: "DC0802", text: "DC0802-COMPUTACIÓN APLICADA II" },
                { id: "DC0804", text: "DC0804-COMPUTACIÓN APLICADA III" },
            ],
            onclick: () => alert("Click en el select2"),
            onchange: () => alert("Onchange en el select2"),
            onblur: () => alert("Onblur en el select2")
        }
        */

        if ($(datos.querySelector).data("select2"))
        {
            let selector = document.querySelector(datos.querySelector);
            $(selector).off(); // Elimina todos los posibles eventos asociados al selector 

            $(datos.querySelector).empty().trigger("change");   // Limpia posibles options anteriormente seleccionados
            $(datos.querySelector).select2("destroy");          // Destruye el anterior Select2
        }

        let esMultiple = (datos.multiple != null && datos.multiple);
        let querySelectorSinGato = datos.querySelector.split("#").join("");
        let params = {};

        if (datos.params != null)
        {
            if (typeof datos.params === "function")  // Si es una funcion
                datos.params();
            else
            {
                if (typeof datos.params !== "function")  // Si no es una funcion
                    params = datos.params
            }
        }

        //const obtenerInputBuscador = () => 
        //{
        //    if (esMultiple) 
        //        return Array.from($(".select2-search__field")).find(x => x.attributes["aria-describedby"].nodeValue.includes(querySelectorSinGato));

        //    return inputBuscador = Array.from(document.getElementsByClassName("select2-search__field"))
        //    .find(x => x.attributes["aria-controls"] != null && x.attributes["aria-controls"].nodeValue.includes(querySelectorSinGato));
        //}

        const retornoEvento = () => 
        {
            let res = datos;
            res.value = $(datos.querySelector).select2("val");
            res.text = $(`${datos.querySelector} option:last-child`).text();
            
            return res;
        }

        $(datos.querySelector).select2({
            allowClear: true,
            closeOnSelect: esMultiple ? false : true,  // Si es multiple, no lo cierra al seleccionar un option
            multiple: esMultiple,
            placeholder: datos.placeholder ?? "Seleccione",
            //minimumInputLength: 3,  // Minimo de caracteres para busquedas
            ajax: {
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: datos.url,
                delay: 700,     // Esperar antes de enviar la petición
                beforeSend: () => this.showLoading(),
                complete: () => this.hideLoading(),
                data: (p) => 
                {
                    let query = {
                        search: p.term,
                        pageSize: datos.registrosPorPagina ?? 10,
                        page: p.page || 1
                    };

                    let envio = {...params, ...query};   // A los parametros recibidos le agrega los campos search, pageSize y page
                    return JSON.stringify(envio);
                    //return query;
                },
                transport: function (params, success, failure) 
                {
                    if (datos.stop != null) {
                        let detener = datos.stop();
                        if (detener == true) return;
                    }

                    /*
                    let busqueda = params.data.search;
                    let inputBuscador = obtenerInputBuscador();

                    if (![null, undefined, ""].includes(busqueda))  // Si el usuario escribió algo en la caja de búsquedas
                    {
                        if (datos.consultarPorRut != null && datos.consultarPorRut && ! /^[A-Za-z\s]*$/.test(busqueda))  // Si tiene al menos un caracter que no sea una letra
                        {
                            let rutFormateado = formatearRut(busqueda)
                            inputBuscador.value = rutFormateado; 

                            if (
                                busqueda.split("-").filter(x => x != "").length == 1 ||     // Si no tiene digito verificador
                                busqueda.length > 15 ||                                     // Si es un rut demasiado grande
                                ! busqueda.toLowerCase().match(/^[0-9\k\.\-\/]+$/)          // Si no es un rut válido (Sirve con y sin puntos)
                            )   
                            { return false; }   

                            params.data.search = busqueda.replaceAll(".", "");   // Va a buscar al backend el rut sin los puntos
                        }
                    }
                    */

                    var $request = $.ajax(params);
                    $request.then(success);
                    $request.fail(failure);

                    return $request;
                },
                processResults: (res) =>   // (res: RespuestaBackend<any>)
                {
                    if (res != null && res.status != null) 
                    {
                        if (res.status == 200)
                        {
                            return {
                                results: res.objeto.resultados,
                                pagination: {
                                    more: res.objeto.traerMasRegistros
                                }
                            };
                        }
                        else {
                            //this.utilidades.mostrarErroresRespuestaBackend(res);
                            mostrarErrores(res);
                        }
                    }
                    else
                        return { results: [], pagination: { more: false } };
                }
            }
        })
        .on("select2:open", () => 
        {
            if (datos.params != null && typeof datos.params === "function") 
            {
                let retorno = retornoEvento();
                params = datos.params(retorno);
            }

            if (datos.onclick != null && typeof datos.onclick === "function")
                datos.onclick();

            //let inputBuscador = obtenerInputBuscador();
            //inputBuscador.maxLength = datos.maxlength ?? 40;
        })
        .on("change", () => 
        {
            let retorno = retornoEvento();  // { value: "1234", text: "Hola" }

            if (datos.onchange != null && typeof datos.onchange === "function")
                datos.onchange(retorno);
        })
        .on("select2:close", () => 
        {
            let retorno = retornoEvento();  // { value: "1234", text: "Hola" }

            if (datos.onblur != null && typeof datos.onblur === "function")
                datos.onblur(retorno);
        });

        //==============================================>>>>>

        if (esMultiple)
        {
            if (datos.optionsSeleccionados != null && Array.isArray(datos.optionsSeleccionados)) 
            {
                datos.optionsSeleccionados.forEach(c => 
                    $(datos.querySelector).append(new Option(c.text, c.id, true, true))
                );
            
                //$(datos.querySelector).trigger("change");   // ESTO DISPARA EL EVENTO ONCHANGE
            }
        }
        else 
        {
            if (datos.value != null)   // Si trae un option seleccionadoy no es múltiple
            {
                // datos.value = { id: 1, text: "Probando" };

                if ('id' in datos.value && 'text' in datos.value) {
                    $(datos.querySelector).append(new Option(datos.value.text, datos.value.id, true, true));
                } 
                else {
                    console.log("datos.value no tiene alguna de las propiedades 'id' o 'text'");
                }  
            }
        }

        //==============================================>>>>>
        
    }

    limpiarSelect2(querySelector)   // Remueve todos los options seleccionados
    {
        // limpiarSelect2("#acordeon-niveles-descripcion-editar [name='defProgramaFormativoRecomendado']")

        Array.from($(querySelector)).forEach(x => {
            $(x).empty().trigger("change");
        });
    }

    obtenerValorSelect2(querySelector) {
        return $(querySelector).val();
    }

    obtenerTextoSelect2(querySelector) 
    {
        return $(`${querySelector} option:last-child`).text();
    }

    formatearRut(contenido)
    {
        // Si el primer caracter es un guion, o el contenido no es valido, o tiene mas de 15 caracteres
        if (contenido.charAt(0) == "-" || ! contenido.match(/^[0-9\k\.\-\/]+$/) || contenido.length > 15) 
            contenido = contenido.slice(0, -1);

        var dvRut = contenido.split("-")[1];
        if (dvRut != null && dvRut.length > 1) { contenido = contenido.slice(0, -1); }  // Remueve mas de un digito verificador

        var ultimoCaracter = contenido.substr(-1);

        if (!contenido.includes("-"))   // Si no se agrego el guion, entonces formatea el numero
        {
            if (ultimoCaracter.includes("k")) { contenido = contenido.slice(0, -1); }

            var num = contenido.split("-")[0].replace(/\./g, "");
            num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.");
            num = num.split("").reverse().join("").replace(/^[\.]/, "");
            contenido = num;
        }
        else {
            if ((contenido.split("-").length - 1) > 1) contenido = contenido.slice(0, -1);  // Si tiene mas de un guion
        }
        
        return contenido;
    }

    imprimirSQL(cadena) 
    {
        cadena = cadena.split(",").join(",\n	");
        cadena = cadena.split("AND").join("AND\n	");
        
        if (cadena.includes("WHERE")) {
            cadena = cadena.replace("WHERE", "\nWHERE"); 
        }
        
        console.log(cadena);
    }

    //=======================================================================================================================>>>>

    desplegarPaginacion(datos)
    {
      let paginaActual = datos.paginaActual 
      let totalRegistros = datos.totalRegistros
      let totalPaginas = datos.totalPaginas
      let registrosPorPagina = datos.registrosPorPagina
      let contarDesdeCero = (datos.contarDesdeCero != null) ? datos.contarDesdeCero : true;
  
      document.querySelector(datos.querySelector).innerHTML = "";   // Limpia
  
      let ul = document.createElement("ul");
      ul.setAttribute("class", "pagination");
    
      let cont = 0;
  
      let agregarLi = (info) => 
      {
        let li = document.createElement("li");
        li.setAttribute("class", `page-item ${(info.esPaginaActual != null && info.esPaginaActual) ? "active" : ""}`);
  
        let enlace = document.createElement("a"); 
        enlace.setAttribute("href","javascript:void(0)");
        enlace.setAttribute("class", "page-link"); 
        enlace.innerText = info.texto;
        if (info.numeroPagina != null) enlace.setAttribute("numeroPagina", info.numeroPagina);
        enlace.addEventListener("click", info.onclick);
        li.appendChild(enlace);
    
        ul.appendChild(li);
        cont ++;
      };
  
      if(totalPaginas > 0  &&  totalRegistros >= registrosPorPagina )
      {
        if(paginaActual != (contarDesdeCero ? 0 : 1))    // Ejemplo original java
        { 
          agregarLi({ texto: "Anterior", onclick: datos.pasoAtras });
        }
  
        let maximo_paginas_mostrado = 10; // Total de paginas desplegadas. Ej: paginas del 1 al 10,   del 10 al 19,   del 20 al 29 
        let inicio_paginacion = 0;        // Primer numero de la paginación
        let fin_paginacion = 0;           // Ultimo numero de la paginación
  
        if(totalPaginas <= maximo_paginas_mostrado) { // Si el numero total de paginas es menor o igual a 10	
          inicio_paginacion = contarDesdeCero ? 0 : 1;  
          fin_paginacion = totalPaginas;
        }
        else
        {
          if(paginaActual >  totalPaginas - maximo_paginas_mostrado)  // Esto impide que el numero de la pagina sobrepase el total de paginas
          {  
            if (contarDesdeCero) 
              inicio_paginacion = totalPaginas - maximo_paginas_mostrado;  
            else 
              inicio_paginacion = (totalPaginas - maximo_paginas_mostrado) + 1; 
  
            fin_paginacion = totalPaginas;
          } 
          else
          {
            if (paginaActual < maximo_paginas_mostrado) 
            {
              inicio_paginacion = contarDesdeCero ? 0 : 1;    
              fin_paginacion = maximo_paginas_mostrado;      
            }
            if(paginaActual >= maximo_paginas_mostrado) // Si la pagina actual es mayor o igual a diez  
            {                              
              let finLoop = 0;
  
              if(totalPaginas % maximo_paginas_mostrado == 0)   // Si la cantidad de resultados es divisible por el numero de paginas
                finLoop = Math.ceil((totalPaginas/maximo_paginas_mostrado)); 
              else
                finLoop = Math.ceil((totalPaginas/maximo_paginas_mostrado) + 1); 
  
              for(let i = 1; i < finLoop;  i++)  // Determinar donde empieza y termina la paginacion
              {
                if(paginaActual < maximo_paginas_mostrado * i) 
                {
                  inicio_paginacion = maximo_paginas_mostrado * (i - 1);
                  fin_paginacion = (maximo_paginas_mostrado * i) - 1; 
                  break;  // Es importante parar aquí el looping del for, sino aparecerá solo el ultimo grupo de paginas
                }
              }
            }
          }
        }
  
        //for(let i=0; i<=totalPaginas; i++)  // DE ESTA FORMA SE IMPRIMIRÍA UNA PAGINACIÓN CON EL TOTAL DE LAS PAGINAS
        
        for(let i = inicio_paginacion; i <= fin_paginacion; i++)  // LA PAGINACIÓN QUEDA ORDENADA EN GRUPOS DE 10 PAGINAS
        {
          agregarLi({ 
            texto: contarDesdeCero ? (i + 1) : i, 
            numeroPagina: i, 
            onclick: (paginaActual != i) ? datos.seleccionarPagina : null, 
            esPaginaActual: (paginaActual == i) 
          });
        }	
  
        if(paginaActual != totalPaginas)  // Si pagina es diferente de totalPaginas 
        {  
          agregarLi({ texto: "Siguiente", onclick: datos.pasoAdelante });
        }
  
        document.querySelector(datos.querySelector).appendChild(ul);  // NUEVO
      }  
    }

    //=======================================================================================================================>>>>
}

class HttpService
{
    constructor() 
    {
        //=================================>>>>

        let urlBackend = localStorage.getItem("urlBackendHiguerillas");

        if (!urlBackend) 
        {
            urlBackend = prompt("Ingrese el dominio del backend:");
            
            if (urlBackend) {
                localStorage.setItem("urlBackendHiguerillas", urlBackend);
            }
        }

        //=================================>>>>

		this.urlBackend = `https://${urlBackend}/Desarrollos/LosRomeros_2025`;
    }

    removerUrlBackend() {
        localStorage.removeItem("urlBackendHiguerillas");
    }

    mostrarErrores(res)
    {
        /*
        this.http.mostrarErrores({ objeto: null, errores: ["No autorizado"], status: 401 });
        this.http.mostrarErrores({ objeto: null, errores: ["Probando Error"], status: 500 });
        */

        if (res.status == null) // Si es un error del front
        {
            if (res.errores != null) 
            {
                let cadenaErrores = res.errores.map(error => error).join("\n\n");
                alert(cadenaErrores);
            }
            else {
                alert(res);
            }
        }

        if (res.status != null)   // Si es un error que viene del Backend
        {
            if (res.status == 400)  // Si es Bad Request
            {
                let cadenaErrores = res.errores.map(error => error).join("\n\n");
                alert(cadenaErrores);
                // res.errores.forEach(error => toastr.error(error));
            }

            if (res.status == 401)
            {
                let cadenaErrores = res.errores.map(error => error).join("\n\n");
                alert(cadenaErrores);

                //res.errores.forEach(error => toastr.error(error));
            }

            if (res.status == 500)  // Si es Internal Server Error
            {
                let modalError = $("#ModalError");

                if (modalError.length && modalError.find("[name='mensaje-error']").length)
                {
                    modalError.modal("show");
                    modalError.find("[name='mensaje-error']").html("");  // Limpia mensajes anteriores

                    let cadena = "";

                    res.errores.forEach(error => cadena += `${error} <br/>`);
                    modalError.find("[name='mensaje-error']").html(cadena);
                }
                else {
                    console.log("No se encontró el modal para desplegar los errores");
                    
                    let cadenaErrores = res.errores.map(error => 
					{
						console.log(error);
						//error = error.replaceAll("\t", "");
						return error;
					}).join("\n\n");
                    alert(cadenaErrores);
                    
                    //res.errores.forEach(error => toastr.error(error));
                }
            }
        }
    }

    get(url)
    {
        //return Promise.reject("Babu");  // Dispara alert con mensaje

        return new Promise((resolve, reject) => 
        {
            //reject("Sofi Osorio");   // Dispara alert con mensaje

            fetch(`${this.urlBackend}/${url}`, { 
                method: "GET" 
                //headers: {"Authorization": "Bearer ejemploToken"} 
            }) 
            .then(response => 
            { 
                if(response.ok) 
                { 
                    response.json().then(res => 
                    { 
                        if (res.status == 200)
                            resolve(res.objeto);
                        else 
                            reject(res);
                    }); 
                } 
                else { 
                    response.text().then(textoError => {
                        reject((response.status == 400 || response.status == 500 && ! [null, ""].includes(textoError)) ? 
                        textoError : `Error ${response.status}`);
                    }); 
                } 
            }) 
            .catch(error => { 
                this.removerUrlBackend();
                reject("Se encontro un error"); 
            });
        });
    }

    post(url, objeto)
    {
        return new Promise((resolve, reject) => 
        {
            fetch(`${this.urlBackend}/${url}`, { 
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                    //"Authorization": "Bearer ejemploToken"
                },
                body: JSON.stringify(objeto) 
            }) 
            .then(response => 
            { 
                if(response.ok) 
                { 
                    response.json().then(res => 
                    { 
                        if (res.status == 200)
                            resolve(res.objeto);
                        else 
                            reject(res);
                    }); 
                } 
                else { 
                    response.text().then(textoError => {
                        reject((response.status == 400 || response.status == 500 && ! [null, ""].includes(textoError)) ? 
                        textoError : `Error ${response.status}`);
                    }); 
                } 
            }) 
            .catch(error => { 
                reject("Se encontro un error"); 
            });
        });
    }

    put(url, objeto)
    {
        return new Promise((resolve, reject) => 
        {
            fetch(`${this.urlBackend}/${url}`, { 
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json"
                    //"Authorization": "Bearer ejemploToken"
                },
                body: JSON.stringify(objeto) 
            }) 
            .then(response => 
            { 
                if(response.ok) 
                { 
                    response.json().then(res => 
                    { 
                        if (res.status == 200)
                            resolve(res.objeto);
                        else 
                            reject(res);
                    }); 
                } 
                else { 
                    response.text().then(textoError => {
                        reject((response.status == 400 || response.status == 500 && ! [null, ""].includes(textoError)) ? 
                        textoError : `Error ${response.status}`);
                    }); 
                } 
            }) 
            .catch(error => { 
                reject("Se encontro un error"); 
            });
        });
    }

    delete(url)
    {
        return new Promise((resolve, reject) => 
        {
            fetch(`${this.urlBackend}/${url}`, { 
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json"
                    //"Authorization": "Bearer ejemploToken"
                }
            }) 
            .then(response => 
            { 
                if(response.ok) 
                { 
                    response.json().then(res => 
                    { 
                        if (res.status == 200)
                            resolve(res.objeto);
                        else 
                            reject(res);
                    }); 
                } 
                else { 
                    response.text().then(textoError => {
                        reject((response.status == 400 || response.status == 500 && ! [null, ""].includes(textoError)) ? 
                        textoError : `Error ${response.status}`);
                    }); 
                } 
            }) 
            .catch(error => { 
                reject("Se encontro un error"); 
            });
        });
    }
}
