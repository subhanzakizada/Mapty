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

// parent of Running and Cycling classes
class Workout {
    date = new Date()
    id = Date.now().toString().slice(3)

    constructor(coords, duration, distance) {
        this.coords = coords // [lat, lng]
        this.duration = duration // min
        this.distance = distance // meters
    }
}

// child of Workout class
class Running extends Workout {
    constructor(coords, duration, distance, cadence) {
        super(coords, duration, distance)
        this.cadence = cadence // stem/min
    }
}

// child of Workout class
class Cycling extends Workout {
    constructor(coords, duration, distance, elevGain) {
        super(coords, duration, distance)
        this.elevGain = elevGain // meters
    }    
}

// APPLICATION class
class App {
    #map
    #mapE
    constructor() { // anything inside of the constructor gets execute when the page loads and eventListeners listen for an event
        this.getPosition()
        document.addEventListener('submit', this.newWorkout.bind(this))
        inputType.addEventListener('change', this.toggleElevationField)
    }
    
    // gets the user's location and calls loadMap fn according to that
    getPosition() {
        navigator.geolocation.getCurrentPosition(this.loadMap.bind(this), function() {
            alert('Couldn\'t get the location.')})
    }
    
    // loads the map according the positions it gets from getPosition fn
    loadMap(position) {
        const { latitude } = position.coords
        const { longitude } = position.coords
        const coords = [latitude, longitude]   
        // Leaflet JS library              
        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        this.#map.on('click', this.showForm.bind(this)) // making the form visible
        }
    
    // it removes the hidden class from the form and makes it visible in the page which gets called by getPosition when the user clicks on the map
    showForm(e) {
            this.#mapE = e
            form.classList.remove('hidden')
            inputDistance.focus()    
        }
    
    // changing the type    
    toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
        
    }
    
    // creating new workout pop up    
    newWorkout(e) {
        e.preventDefault()
        inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '' 
        const {lat, lng} = this.#mapE.latlng
        
        // marker
        L.marker([lat, lng]).addTo(this.#map)
        .bindPopup(L.popup({minWidth: 100,  // options
                    maxWidth: 300,
                    className: 'running-popup',
                    autoClose: false,
                    closeOnClick : false,
                    })
          )
        .setPopupContent('Workout') // content
        .openPopup();
        console.log(1)
    }
}

const app = new App()