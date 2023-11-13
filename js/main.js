let lat = 35.7100069; // 緯度
let lng = 139.8108103; // 経度
let zoom = 16; // ズームレベル

let gMap;
let gPopup = L.popup();

function init() {
    gMap = L.map("map", { doubleClickZoom: false }); // 地図の生成
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
                        tags: createTags(feature),
                    })
                        // .on('dblclick', onDblClick)
                        .bindPopup(feature.properties.Name);
                },
            };

            L.geoJSON(data, layerOptionsAccessed).addTo(gMap);

            L.control.tagFilterButton({
                data: ['cool', 'eco', 'heat', 'none'],
                icon: '<img src="https://www.metro.tokyo.lg.jp/shared/images/favicon/favicon.ico">'
            }).addTo(gMap);

            L.control.tagFilterButton({
                data: ['checked', 'unchecked'],
                filterOnEveryClick: true,
                icon: '<img src="https://www.nta.go.jp/favicon.ico">'
            }).addTo(gMap);
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

function createTags(feature) {
    const type = feature.properties.Type;
    const accessed = feature.properties.Accessed;
    const deleted = feature.properties.Deleted;

    const tags = [];

    tags.push(type);

    if (accessed == "true") {
        tags.push("checked");
    } else {
        tags.push("unchecked");
    }

    if (deleted == "true") {
        tags.push("inactive");
    } else {
        tags.push("active");
    }

    return tags;
}

// function onEachFeature(feature, layer) {
//     layer.on({
//         click: openPopup
//     });
// }

// function openPopup(e) {

// }