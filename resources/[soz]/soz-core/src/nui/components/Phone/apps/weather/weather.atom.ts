import { useNuiEvent } from '@public/nui/hook/nui';
import { atom } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { atomWithRefresh } from 'jotai/utils';

import { ForecastWithTemperature, LongTermForecast } from '../../../../../shared/weather';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

export const alertEndTimestampAtom = atom<number>();
export const alertInProgressAtom = atomWithRefresh<boolean>(get => get(alertEndTimestampAtom) > Date.now());

export const forecastsAtom = atom<ForecastWithTemperature[]>([]);
export const currentForecastAtom = atom<ForecastWithTemperature | undefined>(get => get(forecastsAtom)[0]);

export const longTermForecastsAtom = atom<LongTermForecast[] | null>(null);

export const useAppWeatherStateHandlers = () => {
    const setAlertEndTimestamp = useSetAtom(alertEndTimestampAtom);
    const setForecasts = useSetAtom(forecastsAtom);
    const setLongTermForecasts = useSetAtom(longTermForecastsAtom);

    useNuiEvent('phone', 'AppWeatherSetData', setForecasts);
    useNuiEvent('phone', 'AppWeatherSetStormAlert', setAlertEndTimestamp);
    useNuiEvent('phone', 'AppWeatherSetLongTermForecasts', setLongTermForecasts);

    useInjectDebugData(() => {
        setAlertEndTimestamp(Date.now() + 10000);

        setForecasts([
            {
                temperature: 20,
                weather: 'HALLOWEEN',
                duration: 43200000, // 43200000 for 12 hours
            },
            {
                temperature: 45,
                weather: 'EXTRASUNNY',
                duration: 0,
            },
            {
                temperature: -5,
                weather: 'CLOUDS',
                duration: 0,
            },
            {
                temperature: 22,
                weather: 'SMOG',
                duration: 0,
            },
            {
                temperature: 0,
                weather: 'OVERCAST',
                duration: 0,
            },
        ]);

        setLongTermForecasts([
            {
                label: '24h',
                weather: 'CLOUDS',
                temperatureMin: 10,
                temperatureMax: 20,
            },
            {
                label: '48h',
                weather: 'RAIN',
                temperatureMin: 5,
                temperatureMax: 15,
            },
        ]);
    });
};
