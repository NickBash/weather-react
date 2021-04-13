import React, { useState } from 'react'
import classes from './main.module.css'
import { Container, Row, Col } from 'react-grid-system'
import moment from 'moment'
import ChartHour from '../ChartHour/ChartHour'

const api = {
  key: process.env.REACT_APP_KEY_WEATHER,
  base: 'http://api.openweathermap.org/data/2.5/',
}

function Main() {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState({})
  const [weatherFull, setWeatherFull] = useState({})
  const [view, setView] = useState([true, false, false, false])

  const search = (event) => {
    event.preventDefault()
    fetch(`http://localhost:5000/weather/one?q=${query}`)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          return res.json()
        } else {
          throw new Error('not correct')
        }
      })
      .then((result) => {
        if (result.cod === 200) {
          setWeather(result)
          setQuery('')
          weatherFullHandler(result.coord)
        } else if (result.code_status) {
          codeHandler(result.code_status)
        } else {
          throw new Error('not correct')
        }
      })
      .catch((err) => {
        console.log('error: ' + err)
      })
  }

  const codeHandler = (c) => {
    if (c === 404) {
      return (
        <Col xl={4}>
          <p className={classes.noCity}>Такой город не найден</p>
        </Col>
      )
    } else if (c === 401) {
      return (
        <Col xl={4}>
          <p className={classes.noCity}>Ключ api не действителен</p>
        </Col>
      )
    } else if (c === 429) {
      return (
        <Col xl={4}>
          <p className={classes.noCity}>Превышен лимит запросов</p>
        </Col>
      )
    } else {
      return (
        <Col xl={4}>
          <p className={classes.noCity}>Неизвестная ошибка</p>
        </Col>
      )
    }
  }

  const dateCreater = (d) => {
    let months = [
      'Января',
      'Февраля',
      'Марта',
      'Апреля',
      'Мая',
      'Июня',
      'Июля',
      'Августа',
      'Сентября',
      'Октября',
      'Ноября',
      'Декабря   ',
    ]
    let days = [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ]

    let day = days[d.getDay()]
    let date = d.getDate()
    let month = months[d.getMonth()]
    let year = d.getFullYear()

    return `${day}, ${date} ${month} ${year}`
  }

  const checkRadio = (e) => {
    if (view[e.target.value - 1] === true) {
      return false
    }
    const arr = [false, false, false, false]
    arr[e.target.value - 1] = true
    setView(arr)
  }

  const nav = () => (
    <Row justify="center">
      <div className={classes.group_radio}>
        <div className={classes.form_radio_btn}>
          <input
            onClick={(e) => checkRadio(e)}
            id="radio-1"
            type="radio"
            name="radio"
            value="1"
            defaultChecked
          />
          <label htmlFor="radio-1">Погода сейчас</label>
        </div>

        <div className={classes.form_radio_btn}>
          <input
            onClick={(e) => checkRadio(e)}
            id="radio-2"
            type="radio"
            name="radio"
            value="2"
          />
          <label htmlFor="radio-2">Осадки на 1 час</label>
        </div>

        <div className={classes.form_radio_btn}>
          <input
            onClick={(e) => checkRadio(e)}
            id="radio-3"
            type="radio"
            name="radio"
            value="3"
          />
          <label htmlFor="radio-3">Прогноз на завтра</label>
        </div>

        <div className={classes.form_radio_btn}>
          <input
            onClick={(e) => checkRadio(e)}
            id="radio-4"
            type="radio"
            name="radio"
            value="4"
          />
          <label htmlFor="radio-4">Прогноз на 7 дней</label>
        </div>
      </div>
    </Row>
  )

  const weatherNow = () => {
    if (typeof weather.main != 'undefined') {
      return (
        <Col xl={4}>
          <Row justify="center">
            <div className={classes.card}>
              <div className={classes.tempBox}>
                <div className={classes.location}>
                  <p>
                    {weather.name}, {weather.sys.country}
                  </p>
                  <p>{dateCreater(new Date())}</p>
                </div>
                <p className={classes.temp}>
                  {Math.round(weather.main.temp) + '°'}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt=""
                />
                <p className={classes.weather}>
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
          </Row>
        </Col>
      )
    }
  }

  const weatherFullHandler = (coord) => {
    if (weather) {
      fetch(
        `${api.base}onecall?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${api.key}&lang=ru`
      )
        .then((res) => res.json())
        .then((result) => {
          setWeatherFull(result)
          console.log(result)
        })
        .catch((err) => {
          console.log('error: ' + err)
        })
    }
  }

  const weatherOneHour = () => {
    if (weatherFull.minutely) {
      const time = []
      const precipitation = []
      for (let i = 0; i <= weatherFull.minutely.length; i++) {
        if (i % 5 === 0) {
          precipitation.push(weatherFull.minutely[i].precipitation)
          time.push(
            moment(weatherFull.minutely[i].dt * 1000)
              .local()
              .format('HH:mm')
          )
        }
      }
      return (
        <div>
          <ChartHour time={time} precipitation={precipitation} />
        </div>
      )
    }
  }

  const addOneDay = () => {
    const day = new Date()
    day.setDate(day.getDate() + 1)
    return day
  }

  const weatherTomorrow = () => {
    if (weatherFull) {
      return (
        <Col xl={4}>
          <Row justify="center">
            <div className={classes.card}>
              <div className={classes.tempBox}>
                <div className={classes.location}>
                  <p>
                    {weather.name}, {weather.sys.country}
                  </p>
                  <p>{dateCreater(addOneDay())}</p>
                </div>
                <div className={classes.day}>
                  <p className={classes.night}>
                    {Math.round(weatherFull.daily[1].feels_like.night) + '°'}
                  </p>
                  <p className={classes.morning}>
                    {Math.round(weatherFull.daily[1].feels_like.morn) + '°'}
                  </p>
                  <p className={classes.d}>
                    {Math.round(weatherFull.daily[1].feels_like.day) + '°'}
                  </p>
                  <p className={classes.evening}>
                    {Math.round(weatherFull.daily[1].feels_like.eve) + '°'}
                  </p>
                </div>
                <img
                  src={`http://openweathermap.org/img/wn/${weatherFull.daily[1].weather[0].icon}@2x.png`}
                  alt=""
                />
                <p className={classes.weather}>
                  {weatherFull.daily[1].weather[0].description}
                </p>
              </div>
            </div>
          </Row>
        </Col>
      )
    }
  }

  return (
    <div className={classes.background}>
      <Container className={classes.containerBlock}>
        <h2 className={classes.title}>Погода</h2>
        <div>
          <Row justify="center">
            <Col xl={4}>
              <div className={classes.block_search}>
                <form>
                  <input
                    type="text"
                    placeholder="Введите город..."
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                  />
                  <button onClick={search} className={classes.search_button}>
                    Найти
                  </button>
                </form>
              </div>
            </Col>
          </Row>
          {Object.keys(weather).length !== 0 ? nav() : null}
          <Row justify="center">
            {view[0] === true ? weatherNow() : null}
            {view[1] === true ? <div>{weatherOneHour()}</div> : null}
            {view[2] === true ? <div>{weatherTomorrow()}</div> : null}
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default Main
