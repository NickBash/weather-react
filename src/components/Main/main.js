import React, {useState} from 'react'
import classes from './main.module.css'
import {Container, Row, Col} from 'react-grid-system';

const api = {
    key: process.env.REACT_APP_KEY_WEATHER,
    base: "http://api.openweathermap.org/data/2.5/"
}

function Main() {
    const [query, setQuery] = useState('')
    const [weather, setWeather] = useState({})

    const search = event => {
        if (event.key === "Enter") {
            fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}&lang=ru`)
                .then(res => res.json())
                .then(result => {
                    setWeather(result)
                    setQuery('')
                    console.log(result)
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

    return (
        <div className={classes.fon}>
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
                        <Col xl={4}>
                            {(weather.message === "city not found") ? (
                                <p>Такой город не найден</p>
                            ) : null}
                            {(typeof weather.main != "undefined") ? (
                                <>
                                    <Row justify="center">
                                        <div className={classes.card}>
                                            <div className={classes.tempBox}>
                                                <div className={classes.location}>
                                                    <p>{weather.name}, {weather.sys.country}</p>
                                                    <p>{dateCreater(new Date())}</p>
                                                </div>
                                                <p className={classes.temp}>{Math.round(weather.main.temp) + "°"}</p>
                                                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                                     alt=""/>
                                                <p className={classes.weather}>{weather.weather[0].description}</p>
                                            </div>
                                        </div>
                                    </Row>
                                </>
                            ) : null}
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Main
