<script setup>
import { ref } from 'vue'
import { f, arrX, arrY, tabula, g, maxValor, minValor, xMax, xMin } from './funciones.js'

const limiteInferior = ref(0)
const limiteSuperior = ref(1)
const incremento = ref(0.1)
const funcionSeleccionada = ref('ninguno')
const resultados = ref([])
const mostrarAlerta = ref(false)

let msjAlerta;

const opcionesFunciones = [
  { value: 'ninguno', label: 'Selecciona funcion'},
  { value: 'f', label: 'f(x) = 4x³ - 6x² + 7x - 2.3' },
  { value: 'g', label: 'f(x) = x² * √|cos(x)| - 5' }
]

function generarTabla() {
  if(!validarInputs()){
    msjAlerta = 'Campos vacios o erroneos.';
    mostrarAlerta.value = true;
    return;
  }

  if (limiteSuperior.value <= limiteInferior.value) {
    msjAlerta = 'El limite superior debe ser mayor al límite inferior.';
    mostrarAlerta.value = true
    return
  }
  
  let funcionAUsar;
  if (funcionSeleccionada.value === 'f') {
    funcionAUsar = f
  } else if (funcionSeleccionada.value === 'g') {
    funcionAUsar = g
  }
  
  tabula(funcionAUsar, limiteInferior.value, limiteSuperior.value, incremento.value)
  resultados.value = arrX.map((x, i) => ({
    x: Number(x),
    y: Number(arrY[i])
  }))
}

function cerrarAlerta() {
  mostrarAlerta.value = false
}

function validarInputs() {
  if (limiteInferior.value === '' || limiteSuperior.value === '' || incremento.value === '') {
    return false
  }
  
  if (funcionSeleccionada.value === 'ninguno') {
    return false
  }
  
  const valores = [limiteInferior.value.toString(), limiteSuperior.value.toString(), incremento.value.toString()]
  
  for (let valor of valores) {
    if (valor.includes('--')) {
      return false
    }
    
    if (valor.match(/-.*-/)) {
      return false
    }
    
    if (valor.includes('-') && valor.indexOf('-') !== 0) {
      return false
    }
  }
    return true
}

function bloquearTeclas(event) {  
  if(["e", "E", "+"].includes(event.key)) {
    event.preventDefault()
    return
  }
}
</script>

<template>
  <div class="container">
    <h1>📊 Tabular Funciones</h1>
    <p>Selecciona los limites y el incremento para tabular la funcion</p>
    
    <!-- Alerta de error -->
    <div v-if="mostrarAlerta" class="alerta">
      <div class="alerta-contenido">
        <span class="icono-alerta">⚠️</span>
        <span class="mensaje-alerta">{{ msjAlerta }}</span>
        <button class="boton-cerrar" @click="cerrarAlerta">×</button>
      </div>
    </div>

    <div class="inputs">
      <label class="selector-funcion">
        Funcion a tabular
        <select v-model="funcionSeleccionada" class="select-funcion">
          <option v-for="opcion in opcionesFunciones" :key="opcion.value" :value="opcion.value">
            {{ opcion.label }}
          </option>
        </select>
      </label>
      
      <div class="inputs-numericos">
        <label>
          Limite inferior
          <input type="number" v-model.number="limiteInferior" @keydown="bloquearTeclas" />
        </label>
        
        <label>
          Limite superior
          <input type="number" v-model.number="limiteSuperior" @keydown="bloquearTeclas" />
        </label>
        
        <label>
          Incremento
          <input type="number" v-model.number="incremento" @keydown="bloquearTeclas" min="0.001" step="0.001" />
        </label>
      </div>
    </div>
    
    <button @click="generarTabla">Generar Tabla</button>
    
    <div v-if="resultados.length" class="tabla-wrapper">
      <table>
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in resultados" :key="i">
            <td>{{ p.x }}</td>
            <td>{{ p.y.toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Estadísticas -->
      <div class="estadisticas">
        <h3>Puntos maximo y minimo</h3>
        <div class="stats-grid">
          <div class="stat-item maximo">
            <span class="stat-label">Valor Maximo</span>
            <span class="stat-value">Y = {{ maxValor.toFixed(3) }}</span>
            <span class="stat-position">en X = {{ xMax.toFixed(3) }}</span>
          </div>
          
          <div class="stat-item minimo">
            <span class="stat-label">Valor Minimo</span>
            <span class="stat-value">Y = {{ minValor.toFixed(3) }}</span>
            <span class="stat-position">en X = {{ xMin.toFixed(3) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 650px;
  margin: auto;
  padding: 2rem;
  background: #242424;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
  font-family: system-ui, sans-serif;
  color: #f9fafb;
}

h1 {
  text-align: center;
  color: #60a5fa;
  margin-bottom: 1rem;
}

p {
  color: #d1d5db;
  text-align: center;
}

/* Estilos para la alerta */
.alerta {
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease-out;
}

.alerta-contenido {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #7c2d12;
  border: 1px solid #dc2626;
  border-radius: 0.5rem;
  color: #fef2f2;
  position: relative;
}

.icono-alerta {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.mensaje-alerta {
  flex: 1;
  font-weight: 500;
}

.boton-cerrar {
  background: none;
  border: none;
  color: #fef2f2;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.boton-cerrar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.inputs {
  margin-bottom: 1rem;
}

.selector-funcion {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #e5e7eb;
  margin-bottom: 1rem;
  width: 100%;
}

.inputs-numericos {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #e5e7eb;
  flex: 1;
  min-width: 120px;
}

input, .select-funcion {
  padding: 0.4rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  margin-top: 0.3rem;
  background: #1f1f1f;
  color: #f9fafb;
}

.select-funcion {
  cursor: pointer;
}

.select-funcion:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}

/* Quitar spinner de inputs numéricos */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

button {
  display: block;
  margin: 1rem auto;
  padding: 0.6rem 1.2rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease-in-out;
}

button:hover {
  background: #1d4ed8;
}

.tabla-wrapper {
  margin-top: 1.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background: #1f1f1f;
  border-radius: 0.5rem;
  overflow: hidden;
  color: #f9fafb;
}

th, td {
  padding: 0.6rem;
  border-bottom: 1px solid #333;
}

th {
  background: #181818;
  font-weight: 600;
}

/* Estilos para las estadísticas */
.estadisticas {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #1f1f1f;
  border-radius: 0.5rem;
  border: 1px solid #333;
}

.estadisticas h3 {
  margin: 0 0 1rem 0;
  color: #60a5fa;
  text-align: center;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid;
  text-align: center;
}

.stat-item.maximo {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
}

.stat-item.minimo {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #d1d5db;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.maximo .stat-value {
  color: #22c55e;
}

.minimo .stat-value {
  color: #ef4444;
}

.stat-position {
  font-size: 0.8rem;
  color: #9ca3af;
  font-style: italic;
}
</style>