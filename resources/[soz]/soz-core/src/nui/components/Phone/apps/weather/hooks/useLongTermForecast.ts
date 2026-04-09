import { useAtomValue } from 'jotai';

import { longTermForecastsAtom } from '../weather.atom';

export const useLongTermForecast = () => {
    const longTermForecasts = useAtomValue(longTermForecastsAtom);

    return {
        longTermForecasts,
    };
};
