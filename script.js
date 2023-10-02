var map;

async function initMap(coord) {

    await ymaps3.ready;

    let {YMap, YMapDefaultSchemeLayer} = ymaps3;
    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');
    map = new YMap(
        document.getElementById('map'),
        {
            location: {
                center: coord,
                zoom: 13
            }
        }
    )
    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new ymaps3.YMapDefaultFeaturesLayer({zIndex: 1800}))
    const marker = new YMapDefaultMarker({
        coordinates: coord,
        color: 'red'
    });
    map.addChild(marker);
}

async function geoCode() {
    let input_text = document.getElementById('input_text').value;

    replace_text = input_text.replace(/ /ig, "+");
    
    let response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=a586c526-6ee4-463a-9eb0-dc151e1b9862&geocode=${replace_text}&format=json`)
    .then((response) => {
        return response.json();
      })

    response = response.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
    
    response = response.split(" ");

    response[0] = parseFloat(response[0]);
    response[1] = parseFloat(response[1]);
    map.destroy();
    initMap(response);

    let ul = document.querySelector('.history-list');
    let li = document.createElement("li");
    let link = document.createElement("a");
    link.href = "#";
    link.appendChild(document.createTextNode(input_text));
    li.appendChild(link);
    ul.appendChild(li);
    updateHistory()
}

function updateHistory() {
    let links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function(event) {
            document.getElementById('input_text').value = String(event.target.innerText);
        });
    }
}

function init() {
    initMap([82.920448, 55.035426]);

    document.querySelector('.button').
    addEventListener("click", function() {
        geoCode();
    });

    document.querySelector('.history-button'). 
    addEventListener("click", function() {
        document.querySelector('.content').classList.toggle('content-active');
        document.querySelector('.history-content').classList.toggle('history-list-active');
    });
}

init();