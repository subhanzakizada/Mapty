'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

navigator.geolocation.getCurrentPosition(function(position) {  // first function executes when it gets the location and the second when it couldn't
    const { latitude } = position.coords
    const { longitude } = position.coords
    const coords = [latitude, longitude]
    
    // Leaflet JS library              
    var map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // adding an event listener to map
    map.on('click', function(originalEvent) {
        const {lat, lng} = originalEvent.latlng
        
        // marker
        L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({minWidth: 100,  // options
                            maxWidth: 300,
                            className: 'running-popup',
                            })
                  )
        .setPopupContent('Workout') // content
        .openPopup();
    })
    //
}, function() {
    alert('Couldn\'t get the location.')})