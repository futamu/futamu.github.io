let lat = 35.7100069; // 緯度
let lng = 139.8108103; // 経度
let zoom = 16; // ズームレベル

let gMap;
let gPopup = L.popup();

function init() {
    gMap = L.map("map", { doubleClickZoom: false }); // 地図の生成
    gMap.setView([lat, lng], zoom); // 緯度経度、ズームレベルを設定する

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //     {
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }
    // ).addTo(gMap);

    L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
        {
            attribution: "<a href='https://developers.google.com/maps/documentation' target='_blank'>Google Map</a>"
        }
    ).addTo(gMap);
    // L.MaptilerLayer({
    //     apiKey: 'kLDcubnaeP3o00MMpScj',
    //     style: "jp-mierune-streets",
    // }).addTo(gMap);

    getGeoJson();
}

function getGeoJson() {
    const Http = new XMLHttpRequest();
    const url = 'data/data.geojson';
    Http.open('GET', url);
    Http.send();

    Http.onreadystatechange = function () {
        if (Http.readyState == 4 && Http.status == 200) {
            const data = JSON.parse(Http.responseText);

            const layerOptionsAccessed = {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, {
                        radius: 8,
                        color: selectColor(feature),
                        weight: 1,
                        opacity: 1,
                        fillColor: selectFillColor(feature),
                        fillOpacity: 1,
                        tags: createTags(feature),
                    })
                        .bindPopup(createBindItem(feature));
                },
            };

            L.geoJSON(data, layerOptionsAccessed).addTo(gMap);

            var typeFilterBtn = L.control.tagFilterButton({
                data: ['cool', 'eco', 'heat', 'none'],
                filterOnEveryClick: true,
                icon: '<img src="icon01.jpeg">'
            }).addTo(gMap);

            var checkFilterBtn = L.control.tagFilterButton({
                data: ['checked', 'unchecked'],
                filterOnEveryClick: true,
                icon: '<img src="icon02.jpeg">'
            }).addTo(gMap);

            // typeFilterBtn.addToReleated(checkFilterBtn);

        }
    }
}

// function selectColor(feature) {
//     switch (feature.properties.Accessed) {
//         case 'true':
//             return '#FF9900';
//         case 'false':
//             return '#000000';
//         default:
//             return '#FFFFFF';
//     }
// }

function selectColor(feature) {
    return '#000000';
}

// function selectFillColor(feature) {
//     switch (feature.properties.Type) {
//         case 'heat':
//             return '#AA3C1E';
//         case 'eco':
//             return '#1E8C13';
//         case 'cool':
//             return '#286EAA';
//         default:
//             return '#666666';
//     }
// }

function selectFillColor(feature) {
    if (feature.properties.isCheckedIn == true) {
        return '#1E8C13';
    } else {
        return '#666666';
    }
}

function createBindItem(feature) {
    const Id = feature.properties.id;
    const Name = feature.properties.name;

    var item = Id + '</br>' + Name;

    return item;
}

function createTags(feature) {
    const type = feature.properties.type;
    const accessed = feature.properties.isCheckedIn;
    const deleted = feature.properties.isClosed;

    const tags = [];

    tags.push(type);

    if (accessed == true) {
        tags.push("checked");
    } else {
        tags.push("unchecked");
    }

    if (deleted == true) {
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
