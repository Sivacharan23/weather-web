// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = '14951c93f3d11e8ac8bed96dd90e8bc7'; // OpenWeatherMap API key
        this.baseURL = 'https://api.openweathermap.org/data/2.5/';
        this.initializeApp();
    }

    initializeApp() {
        this.searchBtn = document.getElementById('searchBtn');
        this.cityInput = document.getElementById('cityInput');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.errorMessage = document.getElementById('errorMessage');
        this.loading = document.getElementById('loading');

        // Event listeners
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        // Load weather for a default city on page load
        this.loadDefaultWeather();
    }

    async loadDefaultWeather() {
        // Try to get user's location or load default city
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    // If geolocation fails, load default city
                    this.getWeatherData('London');
                }
            );
        } else {
            this.getWeatherData('London');
        }
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        await this.getWeatherData(city);
    }

    async getWeatherByCoords(lat, lon) {
        this.showLoading();
        try {
            const response = await fetch(`${this.baseURL}weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) throw new Error('Weather data not found');
            
            const data = await response.json();
            await this.displayWeatherData(data);
            await this.getForecastByCoords(lat, lon);
        } catch (error) {
            this.showError('Unable to fetch weather data');
        }
    }

    async getWeatherData(city) {
        this.showLoading();
        try {
            const response = await fetch(`${this.baseURL}weather?q=${city}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) throw new Error('City not found');
            
            const data = await response.json();
            await this.displayWeatherData(data);
            await this.getForecastData(city);
        } catch (error) {
            this.showError('City not found. Please try again.');
        }
    }

    async getForecastData(city) {
        try {
            const response = await fetch(`${this.baseURL}forecast?q=${city}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) throw new Error('Forecast data not found');
            
            const data = await response.json();
            this.displayForecastData(data);
        } catch (error) {
            console.error('Unable to fetch forecast data');
        }
    }

    async getForecastByCoords(lat, lon) {
        try {
            const response = await fetch(`${this.baseURL}forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) throw new Error('Forecast data not found');
            
            const data = await response.json();
            this.displayForecastData(data);
        } catch (error) {
            console.error('Unable to fetch forecast data');
        }
    }

    displayWeatherData(data) {
        this.hideLoading();
        this.hideError();
        
        // Update weather information
        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;

        // Update weather icon
        const weatherIcon = document.getElementById('weatherIcon');
        const iconClass = this.getWeatherIcon(data.weather[0].main, data.weather[0].id);
        weatherIcon.className = `fas ${iconClass}`;

        this.showWeatherInfo();
    }

    displayForecastData(data) {
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';

        // Get forecast for next 5 days (every 24 hours)
        const dailyForecasts = [];
        const today = new Date().getDate();
        
        data.list.forEach(item => {
            const forecastDate = new Date(item.dt * 1000);
            const forecastDay = forecastDate.getDate();
            
            // Only add one forecast per day and skip today
            if (forecastDay !== today && !dailyForecasts.some(f => f.day === forecastDay)) {
                dailyForecasts.push({
                    day: forecastDay,
                    date: forecastDate,
                    temp: Math.round(item.main.temp),
                    weather: item.weather[0],
                    icon: this.getWeatherIcon(item.weather[0].main, item.weather[0].id)
                });
            }
        });

        // Display only 5 days
        dailyForecasts.slice(0, 5).forEach(forecast => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            forecastItem.innerHTML = `
                <div class="forecast-day">${this.getDayName(forecast.date)}</div>
                <div class="forecast-icon">
                    <i class="fas ${forecast.icon}"></i>
                </div>
                <div class="forecast-temp">${forecast.temp}°C</div>
            `;
            
            forecastContainer.appendChild(forecastItem);
        });
    }

    getWeatherIcon(weatherMain, weatherId) {
        // Map weather conditions to Font Awesome icons
        switch (weatherMain.toLowerCase()) {
            case 'clear':
                return 'fa-sun';
            case 'clouds':
                if (weatherId === 801) return 'fa-cloud-sun';
                return 'fa-cloud';
            case 'rain':
            case 'drizzle':
                return 'fa-cloud-rain';
            case 'thunderstorm':
                return 'fa-bolt';
            case 'snow':
                return 'fa-snowflake';
            case 'mist':
            case 'fog':
            case 'haze':
                return 'fa-smog';
            default:
                return 'fa-sun';
        }
    }

    getDayName(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()].substring(0, 3);
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.weatherInfo.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showWeatherInfo() {
        this.weatherInfo.style.display = 'block';
        this.errorMessage.style.display = 'none';
    }

    showError(message) {
        this.hideLoading();
        this.errorMessage.style.display = 'block';
        this.errorMessage.querySelector('p').textContent = message;
        this.weatherInfo.style.display = 'none';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

// Mock Weather Data (for demo purposes when no API key is provided)
class MockWeatherApp extends WeatherApp {
    constructor() {
        super();
    }

    async getWeatherData(city) {
        this.showLoading();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockData = {
            name: city || 'London',
            sys: { country: 'GB' },
            main: {
                temp: Math.floor(Math.random() * 30) + 5, // 5-35°C
                feels_like: Math.floor(Math.random() * 30) + 5,
                humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
            },
            weather: [{
                main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
                description: 'partly cloudy',
                id: 801
            }],
            wind: {
                speed: Math.floor(Math.random() * 10) + 2 // 2-12 m/s
            },
            visibility: Math.floor(Math.random() * 5000) + 5000 // 5-10km
        };

        this.displayWeatherData(mockData);
        this.displayMockForecast();
    }

    async getWeatherByCoords(lat, lon) {
        // For demo, just use London
        await this.getWeatherData('London');
    }

    displayMockForecast() {
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const icons = ['fa-sun', 'fa-cloud-sun', 'fa-cloud-rain', 'fa-cloud', 'fa-sun'];
        
        for (let i = 0; i < 5; i++) {
            const temp = Math.floor(Math.random() * 25) + 10; // 10-35°C
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            forecastItem.innerHTML = `
                <div class="forecast-day">${days[i]}</div>
                <div class="forecast-icon">
                    <i class="fas ${icons[i]}"></i>
                </div>
                <div class="forecast-temp">${temp}°C</div>
            `;
            
            forecastContainer.appendChild(forecastItem);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Use real API with the provided key
    new WeatherApp();
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to forecast items
    setTimeout(() => {
        const forecastItems = document.querySelectorAll('.forecast-item');
        forecastItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }, 2000);

    // Add temperature unit toggle
    let isCelsius = true;
    const tempElement = document.getElementById('temperature');
    const unitElement = document.querySelector('.unit');
    
    if (tempElement && unitElement) {
        unitElement.style.cursor = 'pointer';
        unitElement.addEventListener('click', () => {
            const currentTemp = parseInt(tempElement.textContent);
            if (isCelsius) {
                tempElement.textContent = Math.round(currentTemp * 9/5 + 32);
                unitElement.textContent = '°F';
            } else {
                tempElement.textContent = Math.round((currentTemp - 32) * 5/9);
                unitElement.textContent = '°C';
            }
            isCelsius = !isCelsius;
        });
    }
});
