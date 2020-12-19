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

let map
let originalEvent

navigator.geolocation.getCurrentPosition(function(position) {  // first function executes when it gets the location and the second when it couldn't
    const { latitude } = position.coords
    const { longitude } = position.coords
    const coords = [latitude, longitude]
    
    // Leaflet JS library              
     map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // adding an event listener to map
    map.on('click', function(originalE) {
        originalEvent = originalE
//        const {lat, lng} = originalEvent.latlng
//        
//        // marker
//        L.marker([lat, lng]).addTo(map)
//        .bindPopup(L.popup({minWidth: 100,  // options
//                            maxWidth: 300,
//                            className: 'running-popup',
//                              autoclose: false,
//                              closeOnClick : false
//                            })
//                  )
//        .setPopupContent('Workout') // content
//        .openPopup();
    })    
    //
    
    map.on('click', function() {
        form.classList.remove('hidden')
        inputDistance.focus()
    })
    
}, function() {
    alert('Couldn\'t get the location.')})

document.addEventListener('submit', function(e) {
    e.preventDefault()
    inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = ''
    const {lat, lng} = originalEvent.latlng
        
    // marker
    L.marker([lat, lng]).addTo(map)
    .bindPopup(L.popup({minWidth: 100,  // options
                        maxWidth: 300,
                        className: 'running-popup',
                        autoClose: false,
                        closeOnClick : false,
                        })
              )
    .setPopupContent('Workout') // content
    .openPopup();    
})

inputType.addEventListener('change', function() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    
})