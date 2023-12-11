const current_definition = {
    'temperature_2m': 'Temperature',
    'relative_humidity_2m': 'Humidity',
    'apparent_temperature': 'Feels like',
    'is_day': 'Day/Night',
    'precipitation': 'Precipitation',
    'rain': 'Rain',
    'showers': 'Showers',
    'snowfall': 'Snowfall',
    'cloud_cover': 'Cloud coverage',
    'pressure_msl': 'Sea-level pressure',
    'surface_pressure': 'Surface pressure',
    'wind_speed_10m': 'Wind speed',
    'wind_direction_10m': 'Wind direction',
    'wind_gusts_10m': 'Wind gusts'

}

const hourly_definition = {
    time: 'Time',
    temperature_2m: 'Temperature (2 m)',
    relative_humidity_2m: 'Relative Humidity (2 m)',
    dew_point_2m: 'Dewpoint (2 m)',
    apparent_temperature: 'Apparent Temperature',
    precipitation_probability: 'Precipitation Probability',
    precipitation: 'Precipitation (rain + showers + snow)',
    rain: 'Rain',
    showers: 'Showers',
    snowfall: 'Snowfall',
    snow_depth: 'Snow Depth',
    weather_code: 'Weather',
    pressure_msl: 'Sealevel Pressure',
    surface_pressure: 'Surface Pressure',
    cloud_cover: 'Cloud cover Total',
    cloud_cover_low: 'Cloud cover Low',
    cloud_cover_mid: 'Cloud cover Mid',
    cloud_cover_high: 'Cloud cover High',
    visibility: 'Visibility',
    evapotranspiration: 'Evapotranspiration',
    et0_fao_evapotranspiration: 'Reference Evapotranspiration (ET₀)',
    vapour_pressure_deficit: 'Vapour Pressure Deficit',
    wind_speed_10m: 'Wind Speed (10 m)',
    wind_speed_80m: 'Wind Speed (80 m)',
    wind_speed_120m: 'Wind Speed (120 m)',
    wind_speed_180m: 'Wind Speed (180 m)',
    wind_direction_10m: 'Wind Direction (10 m)',
    wind_direction_80m: 'Wind Direction (80 m)',
    wind_direction_120m: 'Wind Direction (120 m)',
    wind_direction_180m: 'Wind Direction (180 m)',
    wind_gusts_10m: 'Wind Gusts (10 m)',
    temperature_80m: 'Temperature (80 m)',
    temperature_120m: 'Temperature (120 m)',
    temperature_180m: 'Temperature (180 m)',
    soil_temperature_0cm: 'Soil Temperature (0 cm)',
    soil_temperature_6cm: 'Soil Temperature (6 cm)',
    soil_temperature_18cm: 'Soil Temperature (18 cm)',
    soil_temperature_54cm: 'Soil Temperature (54 cm)',
    soil_moisture_0_to_1cm: 'Soil Moisture (0-1 cm)',
    soil_moisture_1_to_3cm: 'Soil Moisture (1-3 cm)',
    soil_moisture_3_to_9cm: 'Soil Moisture (3-9 cm)',
    soil_moisture_9_to_27cm: 'Soil Moisture (9-27 cm)',
    soil_moisture_27_to_81cm: 'Soil Moisture (27-81 cm)'
};

const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snowfall",
    73: "Moderate Snowfall",
    75: "Heavy Snowfall",
    77: "Snow grains",
    80: "Slight Rain showers",
    81: "Moderate Rain showers",
    82: "Violent Rain showers",
    85: "Slight Snow showers",
    86: "Heavy Snow showers",
    95: "Slight or moderate Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
    "*": "Code not specified or additional condition",
};


async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByLocation, handleLocationError);
    } else {
        const weatherInfo = document.getElementById('current-info');
        weatherInfo.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
}

async function getWeatherByLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const current_apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&forecast_days=1`;

    const get_weather_btn = document.getElementById('get-weather-btn');

    try {
        const response = await fetch(current_apiUrl);
        const data = await response.json();

        const currentInfo = document.getElementById('current-info');
        const tableContainer = document.getElementById('table-container');
        tableContainer.style.display = 'none';
        currentInfo.style.display = 'block';
        currentInfo.innerHTML = '';


        const variables = Object.keys(data["current"]);
        const current = Object.values(data["current"]);
        const current_units = Object.values(data["current_units"]);

        const current_weather = document.getElementById('current-weather');

        const footer = document.getElementById('footer');
        footer.style.display = 'flex';
        current_weather.style.display = 'block';
        current_weather.textContent = `${weatherDescriptions[data.current['weather_code']]}`;


        for (const v in current) {
            if (Object.hasOwnProperty.call(current, v)) {
                const variable = variables[v];
                let c = current[v];
                const u = current_units[v];

                if (current_definition[variable]) {

                    const cb = document.createElement('div');

                    const k = document.createElement('div');
                    const valu = document.createElement('div');


                    const var_name = current_definition[variable];


                    k.textContent = `${var_name}: `;

                    if (var_name === 'Day/Night') {
                        let nightImg = ['night1.jpg', 'night2.jpg'];
                        let dayImg = ['day1.jpg', 'day2.jpg'];
                        get_weather_btn.classList.add('button-effect');
                        const bodyEle = document.getElementById('bodyEle');
                        let url;

                        if (c === 0) {
                            try {
                                const fetchPromise = fetch("https://source.unsplash.com/1080x1080/?night");
                                fetchPromise.then(response => {
                                    url = response['url'];
                                    bodyEle.style.backgroundImage = `url(${url})`;
                                });

                            } catch (error) {
                                const night_Img = nightImg[Math.floor(Math.random() * nightImg.length)];
                                bodyEle.style.backgroundImage = `url(${night_Img})`;

                            }
                        } else if (c === 1) {
                            try {
                                const fetchPromise = fetch("https://source.unsplash.com/1080x1080/?day");
                                fetchPromise.then(response => {
                                    url = response['url'];
                                    bodyEle.style.backgroundImage = `url(${url})`;
                                });

                            } catch (error) {
                                const day_Img = dayImg[Math.floor(Math.random() * dayImg.length)];
                                bodyEle.style.backgroundImage = `url(${day_Img})`;
                            }

                        }
                    }
                    valu.textContent = `${(var_name === 'Day/Night') ? (c === 0 ? 'Night' : (c === 1 ? 'Day' : c)) : c} ${u}`;
                    cb.classList.add(`combo`);
                    k.classList.add(`key`);
                    cb.appendChild(k);
                    cb.appendChild(valu);
                    currentInfo.appendChild(cb);
                }
            }
        }
        get_weather_btn.classList.remove('get-weather-btn-initial');
        createHourlyTable(position);
    } catch (error) {
        console.error('Error fetching weather:', error);
        const weatherInfo = document.getElementById('weatherInfo');
        weatherInfo.innerHTML = '<p>Failed to fetch weather data. Please try again.</p>';
    }
    get_weather_btn.textContent = 'Refresh';
}

async function createHourlyTable(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const hourly_apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm&forecast_days=1`;
    const response = await fetch(hourly_apiUrl);
    const data = await response.json();
    const table = document.getElementById('data-table');
    table.innerHTML = '';
    const time_row = table.insertRow();
    const time_header = document.createElement('th');
    time_header.id = 'time_header';
    time_header.textContent = `${hourly_definition['time']}`;
    time_row.appendChild(time_header);

    const time_data = data['hourly']['time'];


    time_data.forEach(tim => {
        const time_ = document.createElement('th');
        time_.id = `${getHourFromISO(tim)}`;
        time_.textContent = `${getHourFromISO(tim)}`;
        time_row.appendChild(time_);

    });

    const headers = data.hourly;

    for (const key in headers) {
        if (key === 'time') { continue }
        else {
            const row = table.insertRow();
            row.id = `${key}`;
            const th = document.createElement('th');
            th.textContent = `${hourly_definition[key]}`;
            row.appendChild(th);
            const data_ = headers[key];
            data_.forEach(d => {
                const td = document.createElement('td');

                if (key === 'weather_code') {
                    td.textContent = `${weatherDescriptions[d]}`;

                } else {

                    td.textContent = `${d} ${data.hourly_units[key]}`;
                }
                row.appendChild(td);
            });

        }
    }
    scrollToTime();
}

function handleLocationError(error) {
    let message = '';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            message = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            message = 'An unknown error occurred.';
            break;
    }
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `<p>${message}</p>`;
}


function getHourFromISO(isoTimestamp) {
    const parsedTime = new Date(isoTimestamp);
    let hour = parsedTime.getHours();
    let period = 'AM';

    if (hour === 0) {
        hour = 12;
    } else if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
            hour -= 12;
        }
    }

    return `${hour}${period}`;
}


function scrollToTime() {
    const parsedTime = new Date();
    let hour = parsedTime.getHours();
    let period = 'AM';

    if (hour === 0) {
        hour = 12;
    } else if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
            hour -= 12;
        }
    }

    let req_id = `${hour}${period}`;

    const a = document.createElement('a');
    a.href = `#${req_id}`;
    a.click();

}



function toggleCurrentlyHourly() {
    const current_info = document.getElementById('current-info');
    const table_container = document.getElementById('table-container');
    const toggle_btn = document.getElementById('toggle_btn');

    const toggle = {
        'toggle_off': 'toggle_on',
        'toggle_on': 'toggle_off'
    }
    toggle_btn.textContent = toggle[toggle_btn.textContent.trim()];
    [current_info.style.display, table_container.style.display] = [table_container.style.display, current_info.style.display];
    scrollToTime();


}

const toggle_btn = document.getElementById('toggle_btn');
toggle_btn.addEventListener('click', () => {
    toggleCurrentlyHourly();
})

const currently_btn = document.getElementById('currently_btn');
const hourly_btn = document.getElementById('hourly_btn');


currently_btn.addEventListener('click', () => {
    const current_info = document.getElementById('current-info');
    const table_container = document.getElementById('table-container');
    const toggle_btn = document.getElementById('toggle_btn');
    toggle_btn.textContent = 'toggle_off';
    table_container.style.display = 'none';
    current_info.style.display = 'block';

})

hourly_btn.addEventListener('click', () => {
    const current_info = document.getElementById('current-info');
    const table_container = document.getElementById('table-container');
    const toggle_btn = document.getElementById('toggle_btn');

    toggle_btn.textContent = 'toggle_on';
    current_info.style.display = 'none';
    table_container.style.display = 'block';
})

