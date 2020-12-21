'use strict';

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
    
    setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]}`
        
    }
}

// child of Workout class
class Running extends Workout {
    type = 'running'

    constructor(coords, duration, distance, cadence) {
        super(coords, duration, distance)
        this.cadence = cadence // stem/min
        this.calcSpeed()
        this.setDescription()
    }

    calcSpeed() {
        this.pace = this.duration / this.distance
    }
}

// child of Workout class
class Cycling extends Workout {
    type = 'cycling'

    constructor(coords, duration, distance, elevGain) {
        super(coords, duration, distance.toFixed(1))
        this.elevGain = elevGain // meters
        this.calcSpeed()
        this.setDescription()
    }    

    calcSpeed() {
        this.speed = this.distance / (this.duration / 60)
    }
}

// APPLICATION class
class App {
    #workouts = []
    #map
    #mapE
    #mapZoomLevel = 13
    
    constructor() { // anything inside of the constructor gets execute when the page loads and eventListeners listen for an event
        this.getPosition()
        document.addEventListener('submit', this.newWorkout.bind(this))
        inputType.addEventListener('change', this.toggleElevationField)
        containerWorkouts.addEventListener('click', this.moveToPopup.bind(this))
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
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

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
    
    hideForm() {
        form.style.dislpay = 'none'
        form.classList.add('hidden')
        setTimeout(() => form.style.display = 'grid', 1000)
        inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '' 
    }    
    
    // changing the type    
    toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }
    
    // creating new workout pop up    
    newWorkout(e) {       
        e.preventDefault()
        
        // coords
        const {lat, lng} = this.#mapE.latlng 
        
        let workout // whether it's cycling or running to push ${this.#workouts} array
        const type = inputType.value
        const durationValue = +inputDuration.value
        const cadanceValue = +inputCadence.value // running
        const elevationValue = inputElevation.value // cycling
        const distanceValue = +inputDistance.value
        
        // helper functions
        const isValid = (...inputs) => inputs.every(input => Number.isFinite(input)) // not finite
        const isPositive = (...inputs) => inputs.every(input => input > 0)
        
        if(type === 'running') {
            if(!isValid(durationValue, cadanceValue, distanceValue) || !isPositive(durationValue, cadanceValue, distanceValue))
                return alert('Invalid Input!')
            
            //else
            workout = new Running([lat, lng], durationValue, distanceValue, cadanceValue)
            this.renderWorkoutMarker(workout)
            this.#workouts.push(workout)
            this.renderWorkout(workout)
        }
        
        if(type === 'cycling') {
            if(!isValid(durationValue, cadanceValue, distanceValue) || !isPositive(durationValue, distanceValue)) // ${evelationValue} can be negative 
                return alert('Invalid Input!')
            
            // else
            workout = new Cycling([lat, lng], durationValue, distanceValue, elevationValue)
            this.renderWorkoutMarker(workout)
            this.#workouts.push(workout)
            this.renderWorkout(workout)
            console.log(workout)
        }        
        this.hideForm()
    }
        
        renderWorkout(workout) {            // common html part for both - running and cycling
            let html = `<li class="workout workout--running" data-id="${workout.id}">
                         <h2 class="workout__title">${workout.description}</h2>
                         <div class="workout__details">
                         <span class="workout__icon"></span>
                         <span class="workout__value">${workout.distance}</span>
                         <span class="workout__unit">km</span>
                         </div>
                         <div class="workout__details">
                         <span class="workout__icon">⏱</span>
                         <span class="workout__value">${workout.duration}</span>
                         <span class="workout__unit">min</span>
                         </div>`
            
            if(workout.type === 'running') // adding running html part 
                html += `<div class="workout__details">
                         <span class="workout__icon">⚡️</span>
                         <span class="workout__value">${workout.pace.toFixed(1)}</span>
                         <span class="workout__unit">min/km</span>
                        </div>
                        <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${workout.cadence}</span>
                        <span class="workout__unit">spm</span>
                        </div>
                    </li>`
            
            if(workout.type === 'cycling') // adding cycling html part
                html += `<div class="workout__details">
                         <span class="workout__icon">⚡️</span>
                         <span class="workout__value">${workout.speed}</span>
                         <span class="workout__unit">km/h</span>
                        </div>
                         <div class="workout__details">
                         <span class="workout__icon">⛰</span>
                         <span class="workout__value">${workout.elevGain}</span>
                         <span class="workout__unit">m</span>
                        </div>
                    </li>`
            form.insertAdjacentHTML('afterend', html)
        }
        
    moveToPopup(e) { // moves to the workout clicked on the tab
        const workoutEl = e.target.closest('.workout') 
        if(!workoutEl) return
        const workout = this.#workouts.find(workout => workout.id === workoutEl.dataset.id)
        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1
            }
    })
    }
        
        // marker
    renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map)
       .bindPopup(L.popup({minWidth: 100,  // options
               maxWidth: 300,
               className: `${inputType.value}-popup`,
               autoClose: false,
               closeOnClick : false,
                   })
         )
       .setPopupContent(`${workout.description}`) // content
       .openPopup();
    }
}
const app = new App()