const form = document.getElementById('form');
const ciudadInput = document.getElementById('ciudad');
const mensaje = document.getElementById('mensaje');
const resultado = document.getElementById('resultado');

const descripciones = {
  0: 'Despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla',
  51: 'Llovizna',
  53: 'Llovizna',
  55: 'Llovizna',
  61: 'Lluvia ligera',
  63: 'Lluvia',
  65: 'Lluvia fuerte',
  80: 'Chubascos',
  81: 'Chubascos',
  82: 'Chubascos fuertes',
  95: 'Tormenta eléctrica'
};

async function buscarClima(ciudad) {
  mensaje.textContent = 'Buscando...';
  resultado.hidden = true;

  try {
    const urlCiudad = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es`;
    const resCiudad = await fetch(urlCiudad);
    const datosCiudad = await resCiudad.json();

    if (!datosCiudad.results) {
      mensaje.textContent = 'No se encontró esa ciudad';
      return;
    }

    const { latitude, longitude, name, country } = datosCiudad.results[0];
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
    const resClima = await fetch(urlClima);
    const datos = await resClima.json();
    const actual = datos.current;

    document.getElementById('nombre').textContent = `${name}, ${country}`;
    document.getElementById('temp').textContent = `${Math.round(actual.temperature_2m)}°C`;
    document.getElementById('descripcion').textContent = descripciones[actual.weather_code] || 'Sin descripción';
    document.getElementById('humedad').textContent = `${actual.relative_humidity_2m}%`;
    document.getElementById('viento').textContent = `${actual.wind_speed_10m} km/h`;

    mensaje.textContent = '';
    resultado.hidden = false;
  } catch (error) {
    mensaje.textContent = 'Ocurrió un error, intenta de nuevo';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  buscarClima(ciudadInput.value.trim());
});