// Obtener referencias a los elementos del DOM
const preguntaEl = document.getElementById('pregunta');
const respuestasContainerEl = document.getElementById('respuestas-container');
const siguienteBtn = document.getElementById('siguiente-btn');
const resultadoFinalEl = document.getElementById('resultado-final');
const mensajeFinalEl = document.getElementById('mensaje-final');
const puntuacionEl = document.getElementById('puntuacion');
const quizHeaderEl = document.querySelector('.quiz-header');
const progressBarEl = document.getElementById('progress-bar');
const datoCuriosoContainerEl = document.getElementById('dato-curioso-container');
const datoCuriosoTextoEl = document.getElementById('dato-curioso-texto');

// Variables para el estado del quiz
let preguntas = [];
let preguntaActualIndex = 0;
let puntuacion = 0;

// Función para barajar un array (Algoritmo Fisher-Yates)
function barajarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función para cargar las preguntas desde el archivo JSON
async function cargarPreguntas() {
    try {
        const response = await fetch('data/preguntas.json');
        if (!response.ok) throw new Error('No se pudieron cargar las preguntas.');
        const todasLasPreguntas = await response.json();

        // Barajar todas las preguntas y seleccionar 10
        barajarArray(todasLasPreguntas);
        preguntas = todasLasPreguntas.slice(0, 10);

        iniciarQuiz();
    } catch (error) {
        preguntaEl.textContent = error.message;
    }
}

// Función para iniciar o reiniciar el quiz
function iniciarQuiz() {
    preguntaActualIndex = 0;
    puntuacion = 0; // CORRECCIÓN APLICADA AQUÍ
    resultadoFinalEl.style.display = 'none';
    quizHeaderEl.style.display = 'block';
    quizHeaderEl.classList.remove('fade-out');
    siguienteBtn.style.display = 'none';
    mostrarPregunta();
}

// Función para actualizar la barra de progreso
function actualizarBarraProgreso() {
    const progreso = (preguntaActualIndex / preguntas.length) * 100;
    progressBarEl.style.width = `${progreso}%`;
}

// Función para mostrar la pregunta actual y sus respuestas
function mostrarPregunta() {
    datoCuriosoContainerEl.classList.remove('visible');
    actualizarBarraProgreso();
    respuestasContainerEl.innerHTML = '';
    const preguntaActual = preguntas[preguntaActualIndex];
    preguntaEl.textContent = preguntaActual.pregunta;

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
    const preguntaActual = preguntas[preguntaActualIndex];
    const respuestaCorrecta = preguntaActual.correcta;

    Array.from(respuestasContainerEl.children).forEach(boton => {
        boton.disabled = true;
        if (boton.dataset.respuesta === respuestaCorrecta) {
            boton.classList.add('correcta');
        }
    });

    if (respuestaSeleccionada === respuestaCorrecta) {
        puntuacion++;
    } else {
        botonSeleccionado.classList.add('incorrecta');
    }

    const datoCurioso = preguntaActual.datoCurioso;
    if (datoCurioso) {
        datoCuriosoTextoEl.textContent = datoCurioso;
        datoCuriosoContainerEl.classList.add('visible');
    }

    siguienteBtn.style.display = 'block';
}

// Event listener para el botón "Siguiente"
siguienteBtn.addEventListener('click', () => {
    quizHeaderEl.classList.add('fade-out');

    setTimeout(() => {
        preguntaActualIndex++;
        if (preguntaActualIndex < preguntas.length) {
            mostrarPregunta();
            quizHeaderEl.classList.remove('fade-out');
            siguienteBtn.style.display = 'none';
        } else {
            progressBarEl.style.width = '100%';
            mostrarResultadoFinal();
        }
    }, 400);
});

// Función para mostrar la pantalla de resultados finales
function mostrarResultadoFinal() {
    quizHeaderEl.style.display = 'none';
    siguienteBtn.style.display = 'none';
    resultadoFinalEl.style.display = 'block';
    
    mensajeFinalEl.textContent = '¡Quiz Completado!';
    puntuacionEl.textContent = `Tu puntuación final es: ${puntuacion} de ${preguntas.length} preguntas acertadas.`;
}

// Iniciar el quiz al cargar la página
cargarPreguntas();