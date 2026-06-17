// REPRODUCTOR DE AUDIO

// Obtenemos el elemento de audio del HTML
var audio = document.getElementById("audioMinecraft");

// Variable para saber si está reproduciendo o pausado
var reproduciendo = false;

// Función que pausa o reproduce el audio al hacer clic en el botón central
function togglePlay() {
    var boton = document.getElementById("btnPlay");

    if (reproduciendo) {
        audio.pause();
        boton.textContent = "▶";
        reproduciendo = false;
    } else {
        audio.play();
        boton.textContent = "⏸";
        reproduciendo = true;
    }
}

// Cuando el audio termina, reseteamos el botón
audio.addEventListener("ended", function () {
    document.getElementById("btnPlay").textContent = "▶";
    reproduciendo = false;
});


// CANVAS

// Obtenemos el canvas y su contexto 2D para poder dibujar
var canvas = document.getElementById("miCanvas");
var ctx = canvas.getContext("2d");

// Variables de la animación

// Posición fija del sol en el canvas
var solX = 30;
var solY = 20;

var explotando = false;
var frameExplosion = 0;    // Contador de frames de la explosión


// Tamaño de cada pixel del sol (puedes cambiarlo para hacerlo más grande o más pequeño)
var tamPixelSol = 6;

// --- Mapa del Sol (pixel art) ---
// 0 = transparente (no se dibuja)
// 1 = amarillo claro
// 2 = amarillo oscuro
// 3 = naranja
var solPixeles = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
];


var creeperX = 190;   // Posición X donde empieza a dibujarse
var creeperY = 120;   // Posición Y donde empieza a dibujarse
var tamPixel = 12;    // Tamaño de cada pixel del Creeper


// --- Mapa del Creeper (pixel art) ---
// 1 = verde oscuro (cuerpo), 2 = negro (ojos/boca)
const creeperPixeles = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [1, 1, 1, 2, 2, 1, 1, 1],
    [1, 1, 2, 2, 2, 2, 1, 1],
    [1, 1, 2, 2, 2, 2, 1, 1],
    [1, 1, 2, 1, 1, 2, 1, 1],
];


// --- Función: dibujar el fondo del cielo ---
function dibujarCielo() {
    // Rectángulo grande azul que cubre todo el canvas
    ctx.fillStyle = "#87CEEB";   // Azul cielo
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// --- Función: dibujar el sol con pixel art ---
function dibujarSol() {
    // Recorremos cada fila del mapa del sol
    for (var fila = 0; fila < solPixeles.length; fila++) {
        for (var col = 0; col < solPixeles[fila].length; col++) {
            var valor = solPixeles[fila][col];

            // Elegimos el color según el número del mapa
            if (valor === 1) {
                ctx.fillStyle = "#FFE566";   // Amarillo claro
            } else if (valor === 2) {
                ctx.fillStyle = "#FFD700";   // Amarillo dorado
            } else if (valor === 3) {
                ctx.fillStyle = "#FFA500";   // Naranja
            } else {
                continue;   // 0 = transparente, saltamos este pixel
            }

            ctx.fillRect(
                solX + col * tamPixelSol,    // Posición X del pixel
                solY + fila * tamPixelSol,   // Posición Y del pixel
                tamPixelSol,                 // Ancho del pixel
                tamPixelSol                  // Alto del pixel
            );
        }
    }
}


// --- Función: dibujar el suelo (bloques de tierra y pasto) ---
function dibujarSuelo() {
    var alturaCanvas = canvas.height;

    // Bloque de pasto (capa verde de arriba)
    ctx.fillStyle = "#5D8A3C";
    ctx.fillRect(0, alturaCanvas - 60, canvas.width, 20);

    // Bloque de tierra (parte marrón de abajo)
    ctx.fillStyle = "#8B5E3C";
    ctx.fillRect(0, alturaCanvas - 40, canvas.width, 40);

    // Dibujamos líneas para simular los bloques individuales
    ctx.strokeStyle = "#6B4226";
    ctx.lineWidth = 1;

    // Líneas verticales cada 40 píxeles
    for (var x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, alturaCanvas - 60);
        ctx.lineTo(x, alturaCanvas);
        ctx.stroke();
    }
}


// --- Función: dibujar el Creeper con pixel art ---
function dibujarCreeper() {
    // Recorremos cada fila del mapa del Creeper
    for (var fila = 0; fila < creeperPixeles.length; fila++) {
        // Recorremos cada columna de esa fila
        for (var col = 0; col < creeperPixeles[fila].length; col++) {
            var valor = creeperPixeles[fila][col];

            if (valor === 1) {
                // Color verde del cuerpo del Creeper
                ctx.fillStyle = "#4CAF50";
                ctx.fillRect(
                    creeperX + col * tamPixel,    // Posición X del pixel
                    creeperY + fila * tamPixel,   // Posición Y del pixel
                    tamPixel,                     // Ancho del pixel
                    tamPixel                      // Alto del pixel
                );
            } else if (valor === 2) {
                // Color negro para ojos y boca
                ctx.fillStyle = "#1a1a1a";
                ctx.fillRect(
                    creeperX + col * tamPixel,
                    creeperY + fila * tamPixel,
                    tamPixel,
                    tamPixel
                );
            }
        }
    }
}


// --- Función: dibujar la explosión cuando se hace clic ---
function dibujarExplosion() {
    // Centro del Creeper
    var centroX = creeperX + (8 * tamPixel) / 2;
    var centroY = creeperY + (8 * tamPixel) / 2;

    // Dibujamos varios círculos de colores que se expanden
    var coloresExplosion = ["#FF4500", "#FF8C00", "#FFD700", "#FF6347"];

    for (var i = 0; i < 6; i++) {
        // Cada círculo tiene un radio diferente que crece con frameExplosion
        var radio = (frameExplosion * 3) + (i * 15);

        // Ángulo aleatorio pero fijo para cada círculo
        var angulo = (i * 60) * (Math.PI / 180);
        var px = centroX + Math.cos(angulo) * frameExplosion * 2;
        var py = centroY + Math.sin(angulo) * frameExplosion * 2;

        ctx.beginPath();
        ctx.arc(px, py, radio / 4, 0, Math.PI * 2);
        ctx.fillStyle = coloresExplosion[i % coloresExplosion.length];
        ctx.globalAlpha = 1 - (frameExplosion / 40);  // Se desvanece poco a poco
        ctx.fill();
        ctx.closePath();
    }

    ctx.globalAlpha = 1;  // Reseteamos la transparencia
}



// --- Función principal: dibuja todo el frame ---
function dibujarFrame() {
    // 1. Limpiamos el canvas antes de redibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Dibujamos el cielo de fondo
    dibujarCielo();

    // 3. Dibujamos el sol
    dibujarSol();

    // 4. Dibujamos el suelo
    dibujarSuelo();

    // 5. Si hay explosión, la dibujamos; si no, dibujamos el Creeper normal
    if (explotando) {
        frameExplosion++;

        if (frameExplosion < 40) {
            dibujarExplosion();
        } else {
            // La explosión terminó, volvemos al estado normal
            explotando = false;
            frameExplosion = 0;
            dibujarCreeper();
        }
    } else {
        dibujarCreeper();
    }

    // 6. Pedimos el siguiente frame (bucle de animación)
    requestAnimationFrame(dibujarFrame);
}


// --- Detectar el clic en el canvas ---
canvas.addEventListener("click", function (evento) {
    // Calculamos dónde hizo clic el usuario dentro del canvas
    var rect = canvas.getBoundingClientRect();
    var clicX = evento.clientX - rect.left;
    var clicY = evento.clientY - rect.top;

    // Comprobamos si el clic fue dentro del área del Creeper
    var limiteIzq = creeperX;
    var limiteDer = creeperX + (8 * tamPixel);
    var limiteArriba = creeperY;
    var limiteAbajo = creeperY + (8 * tamPixel);

    if (clicX >= limiteIzq && clicX <= limiteDer &&
        clicY >= limiteArriba && clicY <= limiteAbajo) {
        // ¡Clic en el Creeper! Iniciamos la explosión
        explotando = true;
        frameExplosion = 0;
    }
});


// --- Iniciamos el bucle de animación cuando carga la página ---
dibujarFrame();
