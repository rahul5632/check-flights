"use strict";
(function () {
  window.addEventListener("load", init);

  function init() {
    document.getElementById("country_btn").addEventListener("click", fetchCountryData);
  }

  async function fetchCountryData() {
    const country = document.getElementById("country_code").value.trim();
    const airlinesList = document.getElementById("airlinesList");
    const airportsList = document.getElementById("airportsList");

    airlinesList.innerHTML = '';
    airportsList.innerHTML = '';

    if (!country) {
      alert("Please enter a country name.");
      return;
    }

    const queryParams = new URLSearchParams({ country: country });

    const airlineResponse = await fetch(`/airlines?${queryParams}`);
    if (airlineResponse.ok) {
      const airlineData = await airlineResponse.json();
      if (airlineData.length) {
        airlineData.forEach(airline => {
          const li = document.createElement("li");
          li.textContent = airline.name || airline;
          airlinesList.appendChild(li);
        });
      } else {
        airlinesList.innerHTML = "<li>No airlines found</li>";
      }
    } else {
      airlinesList.innerHTML = "<li>Error fetching airlines</li>";
    }

    const airportResponse = await fetch(`/airports?${queryParams}`);
    if (airportResponse.ok) {
      const airportData = await airportResponse.json();
      if (airportData.length) {
        airportData.forEach(airport => {
          const li = document.createElement("li");
          li.textContent = airport.name || airport;
          airportsList.appendChild(li);
        });
      } else {
        airportsList.innerHTML = "<li>No airports found</li>";
      }
    } else {
      airportsList.innerHTML = "<li>Error fetching airports</li>";
    }
  }
})();

