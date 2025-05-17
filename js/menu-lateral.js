
let estaAbiertoNav = true;

let url_404 = "../404/404.html";

const arreglo = [
    { titulo: "Inicio", link: "inicio/inicio.html" },
	{ titulo: "Encuesta", link: "encuesta/encuesta.html" }
];

function menuLateral(datos = {}) 
{
	let atras = "../";
    let nivelActual = 1;
	
	arreglo.forEach(x => 
	{
		if (x.opciones != null && Array.isArray(x.opciones) && x.opciones.length > 0)
		{
			x.opciones.forEach(y => 
			{
				if (window.location.href.includes(y.link)) 
                {
                    nivelActual = 2;
					x.abierto = true;
					//atras += "../";   // ADAPTACION EN AULA_MAGNA
					y.style = "background-color: #007bff";
					x.style = "background-color: #818181";
				}
			});
		}
		else if (window.location.href.includes(x.link)) 
		{
			x.style = "background-color: #007bff";
		}
	});
	
	//==========================>>>>

    let cadena = `
    <header id="header-menu-lateral">
        <span onclick="abrirCerrarNav()" class="menu-icon">&#9776;</span>
        <h4 class="site-title">Los Romeros</h4>
    </header>

    <nav id="nav-menu">
        <ul style="margin-left: -38px">

            ${arreglo.map(x => 
            {
                if (x.opciones != null && Array.isArray(x.opciones) && x.opciones.length > 0)
                {
					let estaAbierto = (x.abierto != null && x.abierto);
					let sofia = (estaAbierto) ? "flecha-abajo" : "flecha-derecha";
					let osorio = (estaAbierto) ? "visible" : "";
					
                    return `
                    <li>
                        <a href="#" onclick="clickAgrupadorNav(event)" class="link-mostrar-sub-opciones ${sofia}" style="${x.style}">${x.titulo}</a>
                        <ul class="sub-options ${osorio}">

                            ${x.opciones.map(y => 
                            {
                                if (y.opciones != null && Array.isArray(y.opciones) && y.opciones.length > 0) 
                                {
                                    return `
                                    <li>
                                        <a href="#" onclick="clickAgrupadorNav(event)" class="link-mostrar-sub-opciones flecha-derecha">${y.titulo}</a>
                                        <ul class="sub-options">

                                            ${y.opciones.map(z => {
                                                return `<li><a href="#">${z.titulo}</a></li>`;
                                            }).join("")}

                                        </ul>
                                    </li>
                                    `;
                                }
                                else 
                                {
                                    //let vbgca = (nivelActual == 2) ? "../../" : atras; 
									let vbgca = atras;   // ADAPTACION EN AULA_MAGNA
                                    return `<li><a href="${vbgca}${y.link}" style="${y.style}">${y.titulo}</a></li>`;
                                }

                            }).join("")}
        
                        </ul>
                    </li>
                    `;
                }
                else {
                    return `<li><a href="${atras}${x.link}" style="${x.style}">${x.titulo}</a></li>`;
                }
                    
            }).join("")}

        </ul>
    </nav>
    `;

    document.querySelector(datos.querySelector).innerHTML = cadena; 
}

function clickAgrupadorNav(e)
{
    e.preventDefault();

    let link = e.target;
    let ulElement = e.target.nextElementSibling;

    if (ulElement && ulElement.tagName === "UL") 
    {
        if (link.classList.contains("flecha-derecha")) 
        {
			link.classList.remove("flecha-derecha");
			link.classList.add("flecha-abajo");
        } 
        else {
			link.classList.remove("flecha-abajo");
			link.classList.add("flecha-derecha");
        }

        ulElement.classList.toggle("visible");
    } 
}

function abrirCerrarNav() 
{
    const nav = document.querySelector('nav');
    const body = document.querySelector('body');
	const contenidoElement = document.querySelector('#contenido');
	
    let anchoPantalla = window.innerWidth;
	
    if (anchoPantalla <= 600) 
	{
		nav.style.left = (estaAbiertoNav) ? '0px' : '-250px';
		//contenidoElement.style.marginLeft = (!estaAbiertoNav) ? '0px' : '250px';
    } 
    else 
	{
		nav.style.left = (!estaAbiertoNav) ? '0px' : '-250px';
		contenidoElement.style.marginLeft = (estaAbiertoNav) ? '0px' : '250px';
    }

    estaAbiertoNav = !estaAbiertoNav;
    body.classList.toggle('menu-open');
}