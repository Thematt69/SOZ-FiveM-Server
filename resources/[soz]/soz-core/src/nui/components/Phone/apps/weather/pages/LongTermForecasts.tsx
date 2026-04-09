import { useTranslation } from 'react-i18next';

import { WeatherIcon } from '../components/WeatherIcon';
import { useWeather } from '../hooks/useWeather';
import { useLongTermForecast } from '../hooks/useLongTermForecast';

export const LongTermForecasts = () => {
    const { t } = useTranslation();
    const { fixWeatherName } = useWeather();
    const { longTermForecasts } = useLongTermForecast();

    if (longTermForecasts.length === 0) {
        return null;
    }

    return (
        <div className="mt-3">
            <p className="mb-2">{t('WEATHER.LONG_TERM.TITLE')}</p>
            <ul className="p-2 bg-opacity-10 bg-black rounded">
                {longTermForecasts.map((forecast, index) => (
                    <li className="py-1 flex flex-row justify-between h-10 leading-7" key={'lt-forecast-' + index}>
                        <div className="flex">
                            <WeatherIcon icon={forecast.weather} size="2em" />
                            <span className="ml-2 align-middle">
                                {forecast.label} - {t(`WEATHER.FORECASTS.${fixWeatherName(forecast.weather)}`)}
                            </span>
                        </div>
                        <div>
                            <span className="mr-2">
                                {forecast.temperatureMin}°C / {forecast.temperatureMax}°C
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
            <p className="mt-1 text-xs opacity-60 italic">{t('WEATHER.LONG_TERM.DISCLAIMER')}</p>
        </div>
    );
};
