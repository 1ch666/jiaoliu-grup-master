import { JSX, useEffect, useState } from "react"
import style from "./style.module.scss"
import clsx from "clsx"

type WeatherData = {
  location: {
    name: string
    timezone: string
  }
  current: {
    temperature2m: number
    apparentTemperature: number
    relativeHumidity2m: number
    precipitation: number
    windSpeed10m: number
  }
  summary: string
  source: string
}

type WeatherResponse = {
  ok: boolean
  data?: WeatherData
  error?: string
}

export default function TESTTEST() {
  const [page, setPage] = useState(0)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherError, setWeatherError] = useState("")

  useEffect(() => {
    async function loadWeather() {
      try {
        const response = await fetch("/api/external")
        const result = (await response.json()) as WeatherResponse

        if (!result.ok || !result.data) {
          setWeatherError(result.error || "Weather unavailable")
          return
        }

        setWeather(result.data)
      } catch {
        setWeatherError("Weather unavailable")
      }
    }

    loadWeather()
  }, [])

  return <div id={style["Frame"]}>
    <div className={style["Bar"]}>
      <div className={style["Left"]}>
        <button onClick={() => setPage(0)}>{"各領域交流社團"}</button>
      </div>
      <div className={style["Right"]}>
        {/* 這邊 是按鈕 */}
        {[
          "首頁",
          "關於我們",
          "產品服務",
          "聯絡我們",
        ].map((e, i) => <button
          key={i}
          onClick={() => setPage(i)}
          className={clsx(page === i && style["this"])}>
          <span>{e}</span>
        </button>)}
      </div>
    </div>
    <div className={style["Content"]}>
      {/* 然後 這邊是内文 */}
      {/* 内文預設會填滿整個 Content 可以自己在裏面寫個 Scroll 沒關係 */}
      {([
        [
          style["Home"], <>
            <p>
              {"各位好，我們有創一個 Discord 技術交流社群"}<br />
              {"「各領域交流社團」"}<br />
              {"目前有程式開發、網頁、APP、嵌入式等分類頻道"}<br />
              {"主要做技術討論與資源交流"}<br />
            </p>
            <h1>{"如果有願意分享經驗或資源的前輩，也非常歡迎加入"}</h1>
            <a href="https://discord.gg/jjSUPdSAdE" target="_blank" rel="noopener noreferrer">{"加入 Discord 伺服器"}</a>
            <div className={style["Weather"]}>
              <span>{weather?.source || "Open-Meteo"}</span>
              {weather ? <>
                <strong>{weather.location.name} Weather</strong>
                <div>
                  <b>{Math.round(weather.current.temperature2m)}°C</b>
                  <small>{weather.summary}</small>
                </div>
                <p>
                  {`Feels ${Math.round(weather.current.apparentTemperature)}°C / Humidity ${weather.current.relativeHumidity2m}% / Wind ${Math.round(weather.current.windSpeed10m)} km/h`}
                </p>
              </> : <p>{weatherError || "Loading free API data..."}</p>}
            </div>
          </>
        ],
        [
          style["Home"], <>
            <h1>
              {"我們是一群由高中生和國中生還有一些社會人士組成的交流群組"}<br />
              {"目的在於交流技術、資源、時事，同時我們也有各式各樣的頻道對相對應的領域"}<br />
              {"還有一堆和藹可親的管理員"}<br />
            </h1>
          </>
        ],
        ["awa", <></>],
        ["awa", <></>],
      ] as [string, JSX.Element][])
        .map((e, i) => (
          <div
            className={clsx(
              style["Page"],
              page > i && style["left"],
              page < i && style["right"],
              e[0]
            )}
          >
            {e[1]}
          </div>
        ))}
    </div>
  </div>
} 
