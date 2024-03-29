import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import { ButtonGroup, Button, Box, useColorScheme } from "@mui/material";
import Legend from './Legend.js';



let data = require("./newareas.json")


const Map = ({
    selected, setSelected,
    selectedButton, setSelectedButton,
    selectedColors, setSelectedColors }) => {



    const highlightFeature = (e => {
        const properties = e.target.feature.properties;
        const areaName = properties['Name_x'];
        if (selected.includes(areaName)) {
            var newArr = [...selected].filter(function (e) { return e !== areaName });
            setSelected(newArr)
            selected.splice(selected.indexOf(areaName), 1);
            delete selectedColors[areaName]
            setSelectedColors(selectedColors)
        } else {
            setSelected([...selected, properties['Name_x']])
            selected.push(properties['Name_x'])

            selectedColors[areaName] = getSelectedColor()
            setSelectedColors(selectedColors)
        }
    })

    const mapStyle = {
        height: '80vh',
        width: '95%',
        margin: '0'
    }
    const style = (feature => {
        return ({
            fillColor: getColor(feature.properties),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '2',
            fillOpacity: 0.7,
        });
    });
    function getSelectedColor() {
        const selectedColorList = [
            '#b2df8a',
            '#fb9a99',
            '#fdbf6f',
            '#e31a1c',
            '#33a02c',
            '#ff7f00',
            '#cab2d6',
            '#6a3d9a',
            '#ffff99',
            '#a6cee3',
            '#1f78b4',
        ]

        const usedColors = Object.values(selectedColors)
        for (const item of selectedColorList) {
            if (!usedColors.includes(item)) {
                return item
            }
        }
        return ("FFFFFF")
    }
    function getColor(properties) {
        const areaName = properties['Name_x']
        const selectedAreas = [...selected]
        if (selectedAreas.includes(areaName)) {
            return selectedColors[areaName]
        }
        const d = properties['Single-Detached']
        if (d < 400000) return '#edf8fb';
        if (d < 600000) return '#b3cde3';
        if (d < 800000) return '#8c96c6';
        if (d < 1000000) return '#8856a7';
        if (d < 1200000) return '#810f7c';
        return '#8f1f8c';
    }

    var mapData = yearFilter(data)
    function yearFilter(arr) {
        const items = arr.filter(item => item.properties.year === selectedButton);
        return items
    }
    const onEachFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
                highlightFeature(e);
            },
        });
    }

    function updateYear(year) {
        setSelectedButton(year);
    }

    return (
        <div className='container'>
            <div className="header" >
                <h2 className='heading'>Regional Property Values in the CRD</h2>
                <p className="text-muted">A choropleth map displaying regional property assessments across the CRD.  Data collected <br />from the CMHC surveys published over 10 years, in 2006, 2011, and 2016.</p>
            </div>
            <div className="" >
                <div className="">
                    <MapContainer center={[48.47, -123.5]} attributionControl={false}
                        zoom={10} scrollWheelZoom={true} style={mapStyle}>
                        <TileLayer
                            style={{ zIndex: 1 }}
                            attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
                            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                        />
                        {data && (
                            <GeoJSON key={selectedButton} data={mapData} style={style} onEachFeature={onEachFeature} />
                        )}
                        <Box>
                            <Legend key={selectedButton + "a"} data={data} style={{ zIndex: 2 }} />
                        </Box>
                    </MapContainer>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            '& > *': {
                                m: 1,
                            },
                        }}
                    >
                        <ButtonGroup variant="text" aria-label="text button group">
                            <Button color={selectedButton === "2006" ? "secondary" : "primary"} onClick={() => updateYear("2006")}>2006</Button>
                            <Button color={selectedButton === "2011" ? "secondary" : "primary"} onClick={() => updateYear("2011")}> 2011</Button>
                            <Button color={selectedButton === "2016" ? "secondary" : "primary"} onClick={() => updateYear("2016")}> 2016</Button>
                        </ButtonGroup>
                    </Box>
                </div>
            </div >
        </div >

    )
}
export default Map;