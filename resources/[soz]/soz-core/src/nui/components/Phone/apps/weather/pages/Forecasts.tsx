import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppContent } from '../../../components/system/AppContent';
import { useThemeConfig } from '../../../system/config/config.atom';
import { WeatherIcon } from '../components/WeatherIcon';
import { useWeather } from '../hooks/useWeather';
import { useWeatherForecast } from '../hooks/useWeatherForecast';
import { LongTermForecasts } from './LongTermForecasts';

const formatRelativeTime = (ms: number): string => {
    const totalMinutes = Math.round(ms / 60_000);
    if (totalMinutes < 60) {
        return `${totalMinutes} min`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h${String(minutes).padStart(2, '0')}`;
};

export const Forecasts = () => {
    const { t } = useTranslation();
    const theme = useThemeConfig();

    const { forecasts } = useWeatherForecast();
    const { fixWeatherName } = useWeather();

    const cumulativeOffsets = useMemo(() => {
        if (!forecasts || forecasts.length <= 1) return [];
        const offsets: number[] = [];
        let cumulative = 0;
        // Build cumulative offsets for forecasts[0..length-2]:
        // offset[i] = time from now until forecasts[i+1] starts
        for (let i = 0; i < forecasts.length - 1; i++) {
            cumulative += forecasts[i].duration;
            offsets.push(cumulative);
        }
        return offsets;
    }, [forecasts]);

    if (!forecasts || forecasts.length === 0) {
        return (
            <AppContent
                className={clsx('flex flex-col justify-center items-center h-full', {
                    'text-white': theme === 'dark',
                    'text-dark': theme === 'light',
                })}
            >
                <h2>{t('WEATHER.LOADING')}</h2>
            </AppContent>
        );
    }

    return (
        <AppContent>
            <div className="m-auto pt-1 pb-3 flex flex-col w-11/12 h-full justify-between text-white font-thin">
                <div className="mt-40 m-auto text-center">
                    <WeatherIcon icon={forecasts[0].weather} size="100px" className="m-auto" />
                    <h1 className="text-3xl">{t(`WEATHER.FORECASTS.${fixWeatherName(forecasts[0].weather)}`)}</h1>
                    <h1 className="flex-auto text-5xl">{forecasts[0].temperature}°C</h1>
                </div>

                <div>
                    <p className="mb-2">Prévisions</p>
                    <ul className="p-2 bg-opacity-10 bg-black rounded">
                        {forecasts.slice(1).map((forecast, index) => {
                            const offsetMs = cumulativeOffsets[index] || 0;
                            return (
                                <li
                                    className="py-1 flex flex-row justify-between h-10 leading-7"
                                    key={'forecast-' + index}
                                >
                                    <div className="flex">
                                        <WeatherIcon icon={forecast.weather} size="2em" />
                                        <span className="ml-2 align-middle">
                                            {t(`WEATHER.FORECASTS.${fixWeatherName(forecast.weather)}`)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs opacity-60">
                                            {formatRelativeTime(offsetMs)}
                                        </span>
                                        <span>{forecast.temperature}°C</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <LongTermForecasts />
                </div>
            </div>
        </AppContent>
    );
};
