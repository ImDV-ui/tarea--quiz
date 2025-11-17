// Obtener referencias a los elementos del DOM
const preguntaEl = document.getElementById('pregunta');
const respuestasContainerEl = document.getElementById('respuestas-container');
const siguienteBtn = document.getElementById('siguiente-btn');
const resultadoFinalEl = document.getElementById('resultado-final');
const mensajeFinalEl = document.getElementById('mensaje-final');
const puntuacionEl = document.getElementById('puntuacion');

// Variables para el estado del quiz
let preguntas = [];
let preguntaActualIndex = 0;
let puntuacion = 0;

// Función para cargar las preguntas desde el archivo JSON
async function cargarPreguntas() {
    try {
        const response = await fetch('data/preguntas.json');
        if (!response.ok) {
            throw new Error('No se pudieron cargar las preguntas.');
        }
        preguntas = await response.json();
        iniciarQuiz();
    } catch (error) {
        preguntaEl.textContent = error.message;
    }
}

// Función para iniciar o reiniciar el quiz
function iniciarQuiz() {
    preguntaActualIndex = 0;
    puntuacion = 0;
    resultadoFinalEl.style.display = 'none';
    document.querySelector('.quiz-header').style.display = 'block';
    siguienteBtn.style.display = 'none';
    mostrarPregunta();
}

// Función para mostrar la pregunta actual y sus respuestas
function mostrarPregunta() {
    // Limpiar respuestas anteriores
    respuestasContainerEl.innerHTML = '';

    const preguntaActual = preguntas[preguntaActualIndex];
    preguntaEl.textContent = preguntaActual.pregunta;

    // Crear un botón por cada respuesta
    for (const key in preguntaActual.respuestas) {
        const botonRespuesta = document.createElement('button');
        botonRespuesta.className = 'respuesta-btn';
        botonRespuesta.textContent = preguntaActual.respuestas[key];
        botonRespuesta.dataset.respuesta = key;

        botonRespuesta.addEventListener('click', seleccionarRespuesta);
        respuestasContainerEl.appendChild(botonRespuesta);
    }
}

// Función que se ejecuta al seleccionar una respuesta
function seleccionarRespuesta(e) {
    const botonSeleccionado = e.target;
    const respuestaSeleccionada = botonSeleccionado.dataset.respuesta;
    const respuestaCorrecta = preguntas[preguntaActualIndex].correcta;

    // Deshabilitar todos los botones después de responder
    Array.from(respuestasContainerEl.children).forEach(boton => {
        boton.disabled = true;
        // Marcar la respuesta correcta en verde
        if (boton.dataset.respuesta === respuestaCorrecta) {
            boton.classList.add('correcta');
        }
    });

    // Comprobar si la respuesta es correcta
    if (respuestaSeleccionada === respuestaCorrecta) {
        puntuacion++;
    } else {
        // Si es incorrecta, marcar la seleccionada en rojo
        botonSeleccionado.classList.add('incorrecta');
    }

    // Mostrar el botón de "Siguiente pregunta"
    siguienteBtn.style.display = 'block';
}

// Event listener para el botón "Siguiente pregunta"
siguienteBtn.addEventListener('click', () => {
    preguntaActualIndex++;
    if (preguntaActualIndex < preguntas.length) {
        mostrarPregunta();
        siguienteBtn.style.display = 'none';
    } else {
        mostrarResultadoFinal();
    }
});

// Función para mostrar la pantalla de resultados finales
function mostrarResultadoFinal() {
    document.querySelector('.quiz-header').style.display = 'none';
    siguienteBtn.style.display = 'none';
    resultadoFinalEl.style.display = 'block';
    
    mensajeFinalEl.textContent = '¡Has completado el quiz!';
    puntuacionEl.textContent = `Tu puntuación final es: ${puntuacion} de ${preguntas.length} preguntas acertadas.`;
}

// Iniciar el quiz al cargar la página
cargarPreguntas();