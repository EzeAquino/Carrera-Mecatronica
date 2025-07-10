let materias = [];
let aprobadas = new Set();
const colores = ["#e6f7ff", "#fff0f6", "#f9f0ff", "#f6ffed", "#fffbe6", "#f0f5ff", "#f0fff0", "#fff7e6", "#e6fffb", "#fff1f0"];

function renderMalla() {
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = "";

  for (let anio = 1; anio <= 5; anio++) {
    for (let cuatr = 1; cuatr <= 2; cuatr++) {
      const bloqueAnio = document.createElement("div");
      bloqueAnio.innerHTML = `<h2>Año ${anio} - ${cuatr === 1 ? "1º" : "2º"} Cuatrimestre</h2>`;
      contenedor.appendChild(bloqueAnio);

      const materiasFiltradas = materias.filter(m => m.anio === anio && m.cuatrimestre === cuatr);
      materiasFiltradas.forEach((mat, index) => {
        const bloque = document.createElement("div");
        bloque.className = "materia";
        bloque.style.backgroundColor = colores[(anio - 1) * 2 + cuatr - 1];

        let deshabilitado = false;
        if (mat.correlativas.length > 0) {
          for (let cor of mat.correlativas) {
            if (!aprobadas.has(cor)) {
              deshabilitado = true;
              break;
            }
          }
        }

        if (deshabilitado) bloque.classList.add("locked");
        if (mat.aprobada) bloque.classList.add("tachado");

        const label = document.createElement("div");
        label.textContent = mat.nombre;
        label.style.cursor = deshabilitado ? "not-allowed" : "pointer";

        bloque.addEventListener("click", () => {
          if (deshabilitado) return;
          mat.aprobada = !mat.aprobada;
          if (mat.aprobada) {
            aprobadas.add(mat.nombre);
          } else {
            aprobadas.delete(mat.nombre);
          }
          renderMalla();
          calcularAvance();
        });

        bloque.appendChild(label);
        bloqueAnio.appendChild(bloque);
      });
    }
  }
}

function calcularAvance() {
  let total = materias.length;
  let done = materias.filter(m => m.aprobada).length;
  let porcentaje = Math.round((done / total) * 100);
  document.getElementById("avance").innerText = `Avance: ${done} de ${total} materias (${porcentaje}%)`;
}

fetch("materias.json")
  .then(res => res.json())
  .then(data => {
    materias = data;
    materias.forEach(m => {
      if (m.aprobada) aprobadas.add(m.nombre);
    });
    renderMalla();
    calcularAvance();
  });
