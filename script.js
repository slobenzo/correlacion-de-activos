function mostrarSegundoActivo() {
    const activo1 = document.getElementById('activo1').value;
    if (activo1.trim() !== '') {
        document.getElementById('activo2-group').style.display = 'block';
    } else {
        document.getElementById('activo2-group').style.display = 'none';
        document.getElementById('comparacion').textContent = '';
        document.getElementById('tabla-container').style.display = 'none';
    }
}

function mostrarComparacion() {
    const activo1 = document.getElementById('activo1').value;
    const activo2 = document.getElementById('activo2').value;
    if (activo2.trim() !== '') {
        const comparacionElement = document.getElementById('comparacion');
        comparacionElement.textContent = `${activo1} VS ${activo2}`;
        comparacionElement.style.fontWeight = 'bold';
        comparacionElement.style.fontSize = '1.2em';
        document.getElementById('tabla-container').style.display = 'block';
    } else {
        document.getElementById('comparacion').textContent = '';
        document.getElementById('tabla-container').style.display = 'none';
    }
}

function agregarFila() {
    const tbody = document.getElementById('correlation-tbody');
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td><input type="date" class="fecha1" onchange="calcularDias(this)"></td>
        <td><input type="date" class="fecha2" onchange="calcularDias(this)"></td>
        <td class="dias-correlacionados"></td>
        <td><button class="delete-row-button" onclick="eliminarFila(this)">🗑️</button></td>
    `;
    tbody.appendChild(fila);
}

function eliminarFila(button) {
    const fila = button.closest('tr');
    fila.remove();
    calcularPromedioDias();
}

function calcularDias(input) {
    const fila = input.closest('tr');
    const fecha1 = fila.querySelector('.fecha1').value;
    const fecha2 = fila.querySelector('.fecha2').value;
    const diasCelda = fila.querySelector('.dias-correlacionados');

    if (fecha1 && fecha2) {
        const fechaInicio = new Date(fecha1);
        const fechaFin = new Date(fecha2);

        if (fechaFin < fechaInicio) {
            diasCelda.textContent = '';
            diasCelda.setAttribute('data-tooltip', 'La fecha final debe ser posterior a la fecha de inicio');
        } else {
            const diferencia = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
            diasCelda.textContent = diferencia;

            if (diferencia <= 7) {
                diasCelda.style.color = document.body.classList.contains('dark-mode') ? 'white' : 'black';
            } else {
                diasCelda.style.color = document.body.classList.contains('dark-mode') ? 'black' : 'blue';
            }

            diasCelda.removeAttribute('data-tooltip');
            calcularPromedioDias();
        }
    } else {
        diasCelda.textContent = '';
    }
}

function calcularPromedioDias() {
    const filas = document.querySelectorAll('#correlation-tbody tr');
    let totalDias = 0;
    let count = 0;

    filas.forEach(fila => {
        const diasText = fila.querySelector('.dias-correlacionados').textContent;
        if (diasText) {
            totalDias += parseInt(diasText, 10);
            count++;
        }
    });

    const promedio = totalDias / count;
    const promedioElement = document.getElementById('promedioDias');
    promedioElement.textContent = `Promedio de días correlacionados: ${promedio.toFixed(2)}`;

    const mensajeElement = document.getElementById('mensajeCorrelacion');
    if (promedio <= 7) {
        mensajeElement.textContent = 'Los activos no están correlacionados y pueden operarse';
        mensajeElement.style.color = document.body.classList.contains('dark-mode') ? 'white' : 'black';
    } else {
        mensajeElement.textContent = 'Los activos están correlacionados y NO pueden operarse';
        mensajeElement.style.color = document.body.classList.contains('dark-mode') ? 'black' : 'blue';
    }
}

function reiniciarTabla() {
    document.getElementById('activo1').value = '';
    document.getElementById('activo2').value = '';
    document.getElementById('activo2-group').style.display = 'none';
    document.getElementById('comparacion').textContent = '';
    document.getElementById('tabla-container').style.display = 'none';
    const tbody = document.getElementById('correlation-tbody');
    tbody.innerHTML = `
        <tr>
            <td><input type="date" class="fecha1" onchange="calcularDias(this)"></td>
            <td><input type="date" class="fecha2" onchange="calcularDias(this)"></td>
            <td class="dias-correlacionados"></td>
            <td><button class="delete-row-button" onclick="eliminarFila(this)">🗑️</button></td>
        </tr>
    `;
    document.getElementById('promedioDias').textContent = '';
    document.getElementById('mensajeCorrelacion').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
});

