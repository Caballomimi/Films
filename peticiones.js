var key= "bcfc0649";
var urlNormal="http://www.omdbapi.com/?apikey="+key+"&s=";
var urlDatosPelicula="http://www.omdbapi.com/?apikey="+key+"&i="
var contador=0;
var pagina="&page="+contador
tipo="&type="
var miTimeOut=null;
window.onload=()=>{
    const div=document.getElementById("peliculas")
    const buscador=document.getElementById("buscador")
    const clonar=document.getElementById("clonar")
    const clonarDatos=document.getElementById("clonarDatos")
    const clonarInicio=document.getElementById("clonarInicio")
    inicioCloano= clonarInicio.cloneNode(true)
    inicioCloano.id=""
    div.appendChild(inicioCloano);
    document.getElementById("inicio").addEventListener("click",()=>{
        crearInicio(div,buscador)
    })
    document.getElementById("pelicula").addEventListener("click",()=>{
        tipo="&type=movie"
        div.innerHTML=""
        contador=1
        pagina="&page="+contador;
        tituloImagen(div,clonar,buscadorValor,clonarDatos,pagina,tipo)
        
    })
    document.getElementById("series").addEventListener("click",()=>{
        tipo="&type=series"
        div.innerHTML=""
        contador=1
        pagina="&page="+contador;
        tituloImagen(div,clonar,buscadorValor,clonarDatos,pagina,tipo)
    })
    buscador.addEventListener("keyup",(e)=>{
        buscadorValor=e.target.value.trim()
        contador=1
        if (e.target.value==buscadorValor) {
            if (buscadorValor.length>=3) {
                div.innerHTML=""
                pagina="&page="+contador;
                if (miTimeOut) {
                    clearTimeout(miTimeOut)
                }
                miTimeOut= setTimeout(()=>{
                    console.log("hola")
                    tituloImagen(div,clonar,buscadorValor,clonarDatos,pagina,tipo)
                },1000)
            }else if(buscadorValor==0){
                crearInicio(div,buscador)
            }else{
                div.innerHTML="Introduzca al menos tres letras"
                pagina="&page="+contador;   
            }
        }
    })
    
    var ejecutarMasPeliculas=true;
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY;
        const scrollPorcentaje = (scrollPos / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPorcentaje > 95 && ejecutarMasPeliculas) {
            contador++;
            masPeliculas(contador,ejecutarMasPeliculas,buscador,div,clonar,clonarDatos,tipo);
            ejecutarMasPeliculas=false
        } else if (scrollPorcentaje < 95) {
            ejecutarMasPeliculas = true;
        }
    });
}
function crearInicio(div,buscador) {
    tipo="&type="
    div.innerHTML=""
    buscador.value=""
    inicioCloano= clonarInicio.cloneNode(true)
    inicioCloano.id=""
    div.appendChild(inicioCloano);
}
function tituloImagen(div,clonar,buscador,clonarDatos,page,tipe) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            textoJSON= JSON.parse(this.responseText);
            console.log(textoJSON)
            console.log(page)
            if (textoJSON.Response=="True") {
                textoJSON.Search.forEach(element => {
                    divClonado=clonar.cloneNode(true);
                    if (element.Poster!="N/A") {
                        divClonado.querySelector("div").querySelector("img").src=element.Poster;
                    }else{
                        divClonado.querySelector("div").querySelector("img").src="NoPortada.png"
                    }
                    divClonado.querySelector("i").innerHTML=element.Year;       
                    divClonado.querySelector("h2").innerHTML=element.Title;
                    divClonado.id=element.imdbID;
                    divClonado.addEventListener("click",(e)=>{
                        separar=e.target.innerHTML.split("<")
                        contenido=e.target.innerHTML
                        if (e.target.innerHTML=="") {
                            variable=e.target.parentNode.parentNode.id;
                        }else if (separar[0]==contenido ) {
                            variable=e.target.parentNode.id
                        }else{
                            variable=e.target.id
                        }
                        datosPelicula(variable,clonarDatos)
                    })
                    div.appendChild(divClonado)
                });
            }else{
                if (page=="&page=1") {
                    div.innerHTML="No se Han encontrado Ninguna pelicula con ese nombre"
                } 
            }
        }
    };
    xhttp.open("GET", urlNormal+buscador+page+tipe, true)
    xhttp.send();
}

function datosPelicula(id,clonarDatos) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            textoJSON= JSON.parse(this.responseText);
            console.log(textoJSON)
            if (textoJSON.Response=="True") {
                nuevoDivClonado=clonarDatos.cloneNode(true)
                if (textoJSON.Poster!="N/A") {
                    nuevoDivClonado.querySelector("div").querySelector("img").src=textoJSON.Poster;
                }else{
                    nuevoDivClonado.querySelector("div").querySelector("img").src="./NoPortada.png"
                }
                nuevoDivClonado.id=textoJSON.imdbID;
                nuevoDivClonado.querySelector("#director").innerHTML="<b>Director: </b>"+textoJSON.Director
                nuevoDivClonado.querySelector("#actores").innerHTML="<b>Actores: </b>"+textoJSON.Actors
                nuevoDivClonado.querySelector("#sinopsis").innerHTML="<b>Sinopsis: </b>"+textoJSON.Plot
                nuevoDivClonado.querySelector("#año").innerHTML="<b>Año de estreno: </b>"+textoJSON.Year
                nuevoDivClonado.querySelector("button").addEventListener("click",(e)=>{
                    e.target.parentNode.remove()
                })
                document.addEventListener("click", (e)=> {
                    if (!nuevoDivClonado.contains(e.target)) {
                        nuevoDivClonado.remove();
                    }
                });
                document.querySelector("body").appendChild(nuevoDivClonado)
                
            }
        }
    };
    xhttp.open("GET", urlDatosPelicula+id, true)
    xhttp.send();
}
function masPeliculas(contador,ejecutarMasPeliculas,buscador,div,clonar,clonarDatos,tipe) {
    if (ejecutarMasPeliculas) {
        pagina="&page="+contador;
        tituloImagen(div,clonar,buscador.value.trim(),clonarDatos,pagina,tipe)
    }
}