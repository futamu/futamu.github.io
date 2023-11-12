let lat = 35.7100069; // 緯度
let lng = 139.8108103; // 経度
let zoom = 16; // ズームレベル

let gMap;
let gPopup = L.popup();

function init() {
    gMap = L.map("map"); // 地図の生成
    gMap.setView([lat, lng], zoom); // 緯度経度、ズームレベルを設定する

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
        {
            // 著作権の表示
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(gMap);

    getGeoJson();
}

function getGeoJson() {
    const Http = new XMLHttpRequest();
    const url = 'https://pipld6xm54.execute-api.ap-northeast-1.amazonaws.com/default/ekimemoMng/stations';
    Http.open('GET', url);
    Http.send();

    Http.onreadystatechange = function () {
        if (Http.readyState == 4 && Http.status == 200) {
            const data = JSON.parse(Http.responseText);

            const layerOptionsAccessed = {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, {
                        radius: 8,
                        color: "#000000",
                        weight: 1,
                        opacity: 1,
                        fillColor: selectColor(feature),
                        fillOpacity: 1,
                    })
                        .on('dblclick', onDblClick)
                        .bindPopup(feature.properties.Name);
                },
                filter: (feature) => {
                    switch (feature.properties.Accessed) {
                        case "true":
                            return true;
                        default:
                            return false;
                    }
                },
            };

            const layerAccessed = L.geoJSON(data, layerOptionsAccessed);
            // layerAccessed.addTo(gMap);

            const layerOptionsNonAccessed = {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, {
                        radius: 7,
                        color: selectColor(feature),
                        weight: 2,
                        opacity: 1,
                        fillColor: "#000000",
                        fillOpacity: 1,
                    })
                        .on('dblclick', onDblClick)
                        .bindPopup(feature.properties.Name);
                },
                filter: (feature) => {
                    switch (feature.properties.Accessed) {
                        case "false":
                            return true;
                        default:
                            return false;
                    }
                },
            };

            const layerNonAccessed = L.geoJSON(data, layerOptionsNonAccessed);
            // layerNonAccessed.addTo(gMap);

            let baseLayerControles = {
                '取得済': layerAccessed,
                '未取得': layerNonAccessed,
            };
            L.control.layers(null, baseLayerControles, { collapsed: false, }).addTo(gMap);

            gMap.addLayer(baseLayerControles);
        }
    }
}

function onDblClick(e) {
    const id = e.target.feature.properties.Id;
    const Http = new XMLHttpRequest();
    var url = 'https://pipld6xm54.execute-api.ap-northeast-1.amazonaws.com/default/ekimemoMng/';

    switch (e.target.feature.properties.Accessed) {
        case 'true':
            e.target.feature.properties.Accessed = 'false';
            url = url + 'checkOut/' + id;
            Http.open('GET', url);
            Http.send();

            e.target.setStyle({
                radius: 7,
                color: selectColor(e.target.feature),
                weight: 2,
                opacity: 1,
                fillColor: "#000000",
                fillOpacity: 1,
            });
            break;
        case 'false':
            e.target.feature.properties.Accessed = 'true';
            url = url + 'checkIn/' + id;
            Http.open('GET', url);
            Http.send();

            e.target.setStyle({
                radius: 8,
                color: "#000000",
                weight: 1,
                opacity: 1,
                fillColor: selectColor(e.target.feature),
                fillOpacity: 1,
            });
            break;
        default:
            break;
    }
}

function selectColor(feature) {
    switch (feature.properties.Type) {
        case 'heat':
            return '#AA3C1E';
        case 'eco':
            return '#1E8C13';
        case 'cool':
            return '#286EAA';
        default:
            return '#666666';
    }
}

// function onEachFeature(feature, layer) {
//     layer.on({
//         click: openPopup
//     });
// }

// function openPopup(e) {

// }