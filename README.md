Weather Now
Overview
Weather Now is a web-based application that provides real-time weather information for a user's current location or a specified city. Built with HTML, CSS, and JavaScript, the application leverages the OpenWeatherMap API to fetch weather data and displays it with a modern, responsive user interface. The design incorporates a glassmorphism aesthetic, a custom logo, dynamic background images from Unsplash, and animated weather icons for an engaging user experience.
Features

Real-time weather data retrieval using the OpenWeatherMap API.
Geolocation support to display weather for the user's current location.
City search functionality to fetch weather data for any city.
Modern glassmorphism design with a gradient background and rounded card layout.
Custom SVG logo for branding.
Dynamic Unsplash background images that reflect weather conditions (e.g., sunny, rainy, cloudy).
High-quality, animated weather icons sourced from OpenWeatherMap.
Responsive design optimized for mobile and desktop devices.
Error handling for invalid city inputs or geolocation issues.
Interactive elements with smooth animations for input focus, button hover, and weather icon transitions.

Prerequisites

A modern web browser (e.g., Chrome, Firefox, Edge).
An active internet connection to fetch weather data and images.
A valid OpenWeatherMap API key (the provided key is 14951c93f3d11e8ac8bed96dd90e8bc7).

Installation

Clone or download the repository to your local machine.
Ensure the OpenWeatherMap API key in index.html is valid. The current key is 14951c93f3d11e8ac8bed96dd90e8bc7. If invalid, obtain a new key from https://openweathermap.org and replace it in the JavaScript code.
Save the index.html file and open it in a web browser.

Usage

Open index.html in a web browser.
Allow geolocation access to view weather data for your current location, if permitted.
Alternatively, enter a city name in the search bar and click "Search" or press Enter to retrieve weather information for the specified city.
The application displays the city name, current temperature, weather description, a relevant Unsplash background image, and an animated weather icon.

Dependencies

Tailwind CSS (loaded via CDN) for styling.
OpenWeatherMap API for weather data.
Unsplash API (public image URLs) for dynamic background images.

File Structure

index.html: The main application file containing HTML, CSS, and JavaScript.
No additional local files are required, as assets (icons, styles, images) are loaded via CDNs.

Notes

The OpenWeatherMap API key must be valid for the application to function. If issues arise, verify the key at https://openweathermap.org.
Background images are sourced from Unsplash and optimized for performance.
The application is designed to be lightweight and requires no server-side setup.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Acknowledgments

OpenWeatherMap for providing the weather API and icons.
Unsplash for high-quality background images.
Tailwind CSS for the responsive and modern styling framework.
