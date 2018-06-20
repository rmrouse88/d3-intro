
var myInit = { method: 'GET',
                mode: 'no-cors',
                credentials: 'same-origin'}

d3.json('http://api.worldbank.org/countries/USA/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json', myInit)
    .then(function(data) {
        console.log(data)
    
    })

d3.json()