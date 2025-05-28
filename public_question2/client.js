"use strict";
(function () {
  window.addEventListener("load", init);

  function init() {
    document.getElementById("search-country").addEventListener("click", fetchCountryData);
    document.getElementById("search-airline").addEventListener("click", fetchAirlineData);
    document.getElementById("search-airport").addEventListener("click", fetchAirportData);
    document.getElementById("search-pair").addEventListener("click", fetchAirportPairData);
  }

  async function fetchCountryData() {
    const country = document.getElementById("country-input").value;
    const queryParams = new URLSearchParams({ country });

    const airlineRes = await fetch(`/airlines?${queryParams}`);
    const airportRes = await fetch(`/airports?${queryParams}`);

    if (airlineRes.ok && airportRes.ok) {
      const airlines = await airlineRes.json();
      const airports = await airportRes.json();
      document.getElementById("country-results").innerHTML = `
        <h3>Airlines:</h3><ul>${airlines.map(a => `<li>${a.name}</li>`).join('')}</ul>
        <h3>Airports:</h3><ul>${airports.map(a => `<li>${a.name}</li>`).join('')}</ul>
      `;
    } else {
      document.getElementById("country-results").innerHTML = "Error fetching country data.";
    }
  }

  async function fetchAirlineData() {
    const iata = document.getElementById("airline-iata-input").value;
    const icao = document.getElementById("airline-icao-input").value;
    const queryParams = new URLSearchParams({ iata, icao });

    const response = await fetch(`/airlines/search?${queryParams}`);
    if (response.ok) {
      const airportsRes = await fetch(`/routes/airline-planes?${queryParams}`);
      if (airportsRes.ok) {
        const airports = await airportsRes.json();
        document.getElementById("airline-results").innerHTML = `
          <h3>Routes:</h3><ul>${airports.map(r => `<li>${r.departure_name} ➔ ${r.arrival_name}</li>`).join('')}</ul>
        `;
      }
    } else {
      document.getElementById("airline-results").innerHTML = "Error fetching airline data.";
    }
  }

  async function fetchAirportData() {
    const iata = document.getElementById("airport-iata-input").value;
    const icao = document.getElementById("airport-icao-input").value;
    const queryParams = new URLSearchParams({ iata, icao });

    const airportInfo = await fetch(`/airports/temp?${queryParams}`);
    const departureRoutes = await fetch(`/routes/arrival-airport?dep=${iata}`);

    if (airportInfo.ok && departureRoutes.ok) {
      const info = await airportInfo.json();
      const routes = await departureRoutes.json();
      document.getElementById("airport-results").innerHTML = `
        <h3>Airport Info:</h3>
        <p>Name: ${info.name}, City: ${info.city}, Country: ${info.country}</p>
        <p>High Temp: ${info.high}°C, Low Temp: ${info.low}°C</p>
        <h3>Routes:</h3>
        <ul>${routes.map(r => `<li>To: ${r.arrival_name} (${r.arrival_iata})</li>`).join('')}</ul>
      `;
    } else {
      document.getElementById("airport-results").innerHTML = "Error fetching airport data.";
    }
  }

  async function fetchAirportPairData() {
    const dep = document.getElementById("departure-airport").value;
    const arr = document.getElementById("arrival-airport").value;
    const queryParams = new URLSearchParams({ dep, arr });

    const routeRes = await fetch(`/routes?${queryParams}`);

    if (routeRes.ok) {
      const data = await routeRes.json();
      document.getElementById("pair-results").innerHTML = `
        <h3>Distance: ${data.distanceInKm.toFixed(2)} km</h3>
        <h3>Available Routes:</h3>
        <ul>${data.routes.map(r => `<li>Airline: ${r.airline} | Planes: ${r.planes}</li>`).join('')}</ul>
      `;
    } else {
      document.getElementById("pair-results").innerHTML = "Error fetching airport pair data.";
    }
  }
})();

