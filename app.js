var express = require("express");
var http = require("http");
var fs = require("fs");

// El objeto app representa nuestra aplicación web.
var app = express(); 

var inventario = [];


// Para realizar peticiones post necesitamos agregar el módulo body-parser
// ejecutando npm install body-parser --save
// Y además hay que añadir estas lineas.
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// public es el nombre de mi carpeta de recursos estaticos
app.use(express.static('public'));

// Crea un servidor HTTP y lo deja escuchando en un puerto especifico.
http.createServer(app).listen(8000, function() {
	console.log("Servidor escuchando en puerto 8000");
});

app.get("/", function(request, response) {
	fs.readFile("inventario.json", function (err, data) {    
		var cadena = data.toString();
		cadena = cadena.substr(cadena.indexOf("["));
		console.log("JSON LEIDO");
		console.log(cadena);
		inventario = JSON.parse(cadena);
		response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
		response.write("<h1>Inventario de supermercado</h1>");
		response.write("<img src='images/supermercado.jpg' />");
		response.write("<ol>");
		// Iterar los libros
		for (var i in inventario) {
			response.write("<li>");
			response.write(inventario[i].nombre + " " + "(" + inventario[i].categoria + ") ")
			
			
			response.write("<a href='http://localhost:8000/detalles/"+i+"' />Consultar</a>" + " ")
			response.write("<a href='http://localhost:8000/modificar/"+i+"' />Modificar</a>" + " ")
			response.write("<a href='http://localhost:8000/eliminar/"+i+"' />Eliminar</a>")
			response.write("</li>");
			
		}
		
		response.write("</ol>");
		response.write("<p><a href='http://localhost:8000/nuevo'>Nuevo producto</a></p>");                    
		response.end();
	});
});



app.get("/nuevo", function(request, response) {
	fs.readFile("nuevo.html", function (err, data) {
		// Ejecuta este código cuando el fichero leido está ya disponible.
		// El contenido de texto del fichero es retornado en data.
		
		response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
	    response.write(data.toString());                
		response.end();		
	});
});

app.post("/add", function(request, response) {
	
	inventario.push({
		// En las peticiones de tipo post, los parámetros se recogen con el objeto body
		"nombre": request.body.nombre,
		"categoria": request.body.categoria,
		"precio": request.body.precio,
		"stock": parseInt(request.body.stock)
		
	});
	fs.writeFile('inventario.json', JSON.stringify(inventario));
	
	response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
	response.write("<p>Nueva producto agregado</p>");
	response.write("<p><a href='http://localhost:8000'>Volver</a></p>");
	response.end();	
});


app.get("/eliminar/:posicion", function(request, response) {
	
	inventario.splice(request.params.posicion,1);
	fs.writeFile('inventario.json', JSON.stringify(inventario));
	response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
	response.write("<p>Se ha eliminado el producto con exito</p>");
	response.write("<p><a href='http://localhost:8000'>Volver</a></p>");
	response.end();	
});

app.get("/detalles/:posicion", function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
		response.write("<h1>Informacion de " + inventario[request.params.posicion].nombre + "</h1>");
		response.write("<ul>");
		
			response.write("<li>Categoria: ");
			response.write(inventario[request.params.posicion].categoria);
			response.write("</li>");
			response.write("<li>Precio: ");
			response.write(inventario[request.params.posicion].precio+"");
			response.write("</li>");
			response.write("<li>Stock: ");
			response.write(inventario[request.params.posicion].stock+"");
			response.write("</li>");
			
				
			response.write("<p><a href='http://localhost:8000'>Volver al listado de productos</a></p>");
			
			
		
		response.write("</ul>");
		response.end();


});

app.get("/modificar/:pos", function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
	response.write("<h1>Modificación de artículo</h1>");
	response.write("<form action='http://localhost:8000/guardar' method='get'>");
		response.write("<input type='hidden' name='pos' value='" + request.params.pos + "'> <br>");
		response.write("Nombre: <input type='text' name='nombre' value='" + inventario[request.params.pos].nombre + "'> <br>");
		response.write("Categoría: <input type='text' name='categoria' value='" + inventario[request.params.pos].categoria + "'> <br>");
		response.write("Precio: <input type='text' name='precio'value='" + inventario[request.params.pos].precio + "'> <br>");
		response.write("Stock: <input type='text' name='stock' value='" + inventario[request.params.pos].stock + "'> <br>");
		response.write("<input type='submit' value='Enviar'>");
	response.write("</form>");
	
	response.write("<p><a href='http://localhost:8000'>Volver</a></p>");
	response.end();	
});


app.get("/guardar/", function(request, response) {
	
	inventario[request.query.pos]={
		"nombre": request.query.nombre,
		"categoria":request.query.categoria,
		"precio":request.query.precio,
		"stock":request.query.stock
	};
	fs.writeFile('inventario.json', JSON.stringify(inventario));
	response.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
	response.write("<p>Articulo modificado</p>");
	response.write("<p><a href='http://localhost:8000'>Volver</a></p>");
	response.end();	
});

app.get("/*", function(request, response) {   
	response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
	response.write("<p>No existe la ruta</p>");
	response.write("<p><a href='http://localhost:8000'>Volver</a></p>");
	response.end();	
});






