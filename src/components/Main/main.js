import React, {useState} from 'react'
import classes from './main.module.css'
import {Container, Row, Col} from 'react-grid-system';
import moment from 'moment'
import ChartHour from "../ChartHour/ChartHour";

const api = {
    key: process.env.REACT_APP_KEY_WEATHER,
    base: "http://api.openweathermap.org/data/2.5/"
}

function Main() {
    const [query, setQuery] = useState('')
    const [weather, setWeather] = useState({})
    const [weatherOne, setWeatherOne] = useState({})
    const [view, setView] = useState([true, false, false, false])

    const search = event => {
        if (event.key === "Enter") {
            fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}&lang=ru`)
                .then(res => res.json())
                .then(result => {
                    setWeather(result)
                    setQuery('')
                    console.log(result)
                    weatherOneHourHandler(result.coord)
                })
                .catch((err) => {
                    console.log("error: " + err)
                })

        }
    }

    const dateCreater = (d) => {
        let months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря   "]
        let days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

        let day = days[d.getDay()]
        let date = d.getDate()
        let month = months[d.getMonth()]
        let year = d.getFullYear()

        return `${day}, ${date} ${month} ${year}`

    }

    const checkRadio = e => {
        if (view[e.target.value - 1] === true) {
            return false
        }
        const arr = [false, false, false, false]
        arr[e.target.value - 1] = true
        setView(arr)
    }

    const weatherNow = () => {
        if (weather.message === "city not found") {
            return (<Col xl={4}><p>Такой город не найден</p></Col>)
        }
        if (typeof weather.main != "undefined") {
            return (
                <Col xl={4}>
                    <Row justify="center">
                        <div className={classes.card}>
                            <div className={classes.tempBox}>
                                <div className={classes.location}>
                                    <p>{weather.name}, {weather.sys.country}</p>
                                    <p>{dateCreater(new Date())}</p>
                                </div>
                                <p className={classes.temp}>{Math.round(weather.main.temp) + "°"}</p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                    alt=""/>
                                <p className={classes.weather}>{weather.weather[0].description}</p>
                            </div>
                        </div>
                    </Row>
                </Col>
            )
        }
    }

    const weatherOneHourHandler = (coord) => {
        if (weather) {
            fetch(`${api.base}onecall?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${api.key}&lang=ru`)
                .then(res => res.json())
                .then(result => {
                    setWeatherOne(result)
                    console.log(result)
                })
                .catch((err) => {
                    console.log("error: " + err)
                })
        }
    }

    const weatherOneHour = () => {
        if (weatherOne.minutely) {
            return (
                weatherOne.minutely.map((i, k) =>
                    <div key={k}>
                        {/*{moment(i.dt * 1000).local().format('HH:mm')}, {i.precipitation}*/}
                    </div>)
            )
        }
    }

    return (
        <div className={classes.fon}>
            {console.log(weatherOne)}
            <Container className={classes.containerBlock}>
                <div>
                    <Row justify="center">
                        <Col xl={4}>
                            <input
                                type="text"
                                placeholder="Введите город..."
                                onChange={e => setQuery(e.target.value)}
                                value={query}
                                onKeyPress={search}
                            />
                        </Col>
                    </Row>
                    <Row justify="center">
                        <div className={classes.group_radio}>
                            <div className={classes.form_radio_btn}>
                                <input onClick={e => checkRadio(e)} id="radio-1" type="radio" name="radio" value="1" defaultChecked/>
                                <label htmlFor="radio-1">Погода сейчас</label>
                            </div>

                            <div className={classes.form_radio_btn}>
                                <input onClick={e => checkRadio(e)} id="radio-2" type="radio" name="radio" value="2"/>
                                <label htmlFor="radio-2">Прогноз на 1 час</label>
                            </div>

                            <div className={classes.form_radio_btn}>
                                <input onClick={e => checkRadio(e)} id="radio-3" type="radio" name="radio" value="3"/>
                                <label htmlFor="radio-3">Прогноз на 2 часа</label>
                            </div>

                            <div className={classes.form_radio_btn}>
                                <input onClick={e => checkRadio(e)} id="radio-4" type="radio" name="radio" value="4"/>
                                <label htmlFor="radio-4">Прогноз на 7 дней</label>
                            </div>
                        </div>
                    </Row>
                    <Row justify="center">
                        {view[0] === true ? weatherNow() : null}
                        {view[1] === true ? <div><ChartHour /></div> : null}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Main
