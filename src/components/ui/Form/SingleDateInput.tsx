import React from "react";
import {DatePicker} from "@ParkComponents/ui/date-picker";
import {parseDate, useDatePicker} from "@ark-ui/react";
import {IconButton} from "@ParkComponents/ui/icon-button.tsx";
import {Text} from "@ParkComponents/ui/Text.tsx";
import {ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon, Cancel01Icon} from "hugeicons-react";
import { Button } from "@ParkComponents/ui";
import {format, parseISO} from "date-fns";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {css} from "../../../../styled-system/css";
import {useLanguage} from "../../../contexts";
import {useTranslation} from "react-i18next";

interface IProps extends Omit<DatePicker.RootProps, 'value'|'onValueChange'|'onChange'|'selectionMode'|'positioning'> {
    value: Date|undefined|null;
    onChange: (value: Date|null) => void;
}

export const SingleDateInput: React.FC<IProps> = ({value, onChange, ...datePickerProps}) => {
    const { language } = useLanguage();
    const { t } = useTranslation();

    /**
     * Changes the value of the input.
     * @param dateValues
     */
    const changeValue = (dateValues: string[]): void => {
        if (!dateValues.length)
            return onChange(null);

        onChange(parseISO(dateValues[0]));
    }

    const datePicker = useDatePicker({
        ...datePickerProps,
        startOfWeek: 1,
        selectionMode: 'single',
        positioning: { sameWidth: true },
        onValueChange: (change) => changeValue(change.valueAsString),
        value: value ? [parseDate(value)] : [],
        locale: language,
    });

    return <DatePicker.RootProvider value={datePicker}>
        <DatePicker.Control>
            <DatePicker.Trigger asChild>
                <Button aria-label="Vybrat datum" variant="outline"
                        className={css({
                            w: '100%', pos: 'relative', display: "flex", justifyContent: "left", fontWeight: "normal",
                            _invalid: { colorPalette: 'red'}
                        })}
                >
                    {datePicker.valueAsDate[0]
                        ? <Text fontSize="md">{format(datePicker.valueAsDate[0], 'd. L. y')}</Text>
                        : <Text color={{base: 'fg.subtle', _invalid: 'fg.error'}} fontSize="md">
                            {t('inputs.singleDateInputPlaceholder')}
                        </Text>
                    }
                    <HugeIcon icon={<Calendar03Icon/>} className={css({pos: 'absolute', right: '3'})}/>
                </Button>
            </DatePicker.Trigger>
            <DatePicker.ClearTrigger asChild>
                <IconButton variant="outline" aria-label="Zrušit výběr" colorPalette='red'>
                    <Cancel01Icon/>
                </IconButton>
            </DatePicker.ClearTrigger>
        </DatePicker.Control>
        <DatePicker.Positioner>
            <DatePicker.Content>
                <DatePicker.View view="day">
                    <DatePicker.Context>
                        {(api) => (
                            <>
                                <DatePicker.ViewControl>
                                    <DatePicker.PrevTrigger asChild>
                                        <IconButton variant="ghost" size="sm" type='button'>
                                            <ArrowLeft01Icon />
                                        </IconButton>
                                    </DatePicker.PrevTrigger>
                                    <DatePicker.ViewTrigger asChild>
                                        <Button variant="ghost" size="sm" type='button'>
                                            <DatePicker.RangeText />
                                        </Button>
                                    </DatePicker.ViewTrigger>
                                    <DatePicker.NextTrigger asChild>
                                        <IconButton variant="ghost" size="sm" type='button'>
                                            <ArrowRight01Icon />
                                        </IconButton>
                                    </DatePicker.NextTrigger>
                                </DatePicker.ViewControl>
                                <DatePicker.Table>
                                    <DatePicker.TableHead>
                                        <DatePicker.TableRow>
                                            {api.weekDays.map((weekDay, id) => (
                                                <DatePicker.TableHeader key={id}>{weekDay.narrow}</DatePicker.TableHeader>
                                            ))}
                                        </DatePicker.TableRow>
                                    </DatePicker.TableHead>
                                    <DatePicker.TableBody>
                                        {api.weeks.map((week, id) => (
                                            <DatePicker.TableRow key={id}>
                                                {week.map((day, id) => (
                                                    <DatePicker.TableCell key={id} value={day}>
                                                        <DatePicker.TableCellTrigger asChild>
                                                            <IconButton variant="ghost" type='button'>{day.day}</IconButton>
                                                        </DatePicker.TableCellTrigger>
                                                    </DatePicker.TableCell>
                                                ))}
                                            </DatePicker.TableRow>
                                        ))}
                                    </DatePicker.TableBody>
                                </DatePicker.Table>
                            </>
                        )}
                    </DatePicker.Context>
                </DatePicker.View>
                <DatePicker.View view="month">
                    <DatePicker.Context>
                        {(api) => (
                            <>
                                <DatePicker.ViewControl>
                                    <DatePicker.PrevTrigger asChild>
                                        <IconButton variant="ghost" size="sm" type="button">
                                            <ArrowLeft01Icon />
                                        </IconButton>
                                    </DatePicker.PrevTrigger>
                                    <DatePicker.ViewTrigger asChild>
                                        <Button variant="ghost" size="sm" type="button">
                                            <DatePicker.RangeText />
                                        </Button>
                                    </DatePicker.ViewTrigger>
                                    <DatePicker.NextTrigger asChild>
                                        <IconButton variant="ghost" size="sm" type="button">
                                            <ArrowRight01Icon />
                                        </IconButton>
                                    </DatePicker.NextTrigger>
                                </DatePicker.ViewControl>
                                <DatePicker.Table>
                                    <DatePicker.TableBody>
                                        {api.getMonthsGrid({ columns: 4, format: 'short' }).map((months, id) => (
                                            <DatePicker.TableRow key={id}>
                                                {months.map((month, id) => (
                                                    <DatePicker.TableCell key={id} value={month.value}>
                                                        <DatePicker.TableCellTrigger asChild>
                                                            <Button variant="ghost" type="button">{month.label}</Button>
                                                        </DatePicker.TableCellTrigger>
                                                    </DatePicker.TableCell>
                                                ))}
                                            </DatePicker.TableRow>
                                        ))}
                                    </DatePicker.TableBody>
                                </DatePicker.Table>
                            </>
                        )}
                    </DatePicker.Context>
                </DatePicker.View>
                <DatePicker.View view="year">
                    <DatePicker.Context>
                        {(api) => (
                            <>
                                <DatePicker.ViewControl>
                                    <DatePicker.PrevTrigger asChild>
                                        <IconButton variant="ghost" size="sm" type="button">
                                            <ArrowLeft01Icon />
                                        </IconButton>
                                    </DatePicker.PrevTrigger>
                                    <DatePicker.ViewTrigger asChild>
                                        <Button variant="ghost" size="sm" type="button">
                                            <DatePicker.RangeText />
                                        </Button>
                                    </DatePicker.ViewTrigger>
                                    <DatePicker.NextTrigger asChild>
                                        <IconButton variant="ghost" size="sm" type="button">
                                            <ArrowRight01Icon />
                                        </IconButton>
                                    </DatePicker.NextTrigger>
                                </DatePicker.ViewControl>
                                <DatePicker.Table>
                                    <DatePicker.TableBody>
                                        {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                                            <DatePicker.TableRow key={id}>
                                                {years.map((year, id) => (
                                                    <DatePicker.TableCell key={id} value={year.value}>
                                                        <DatePicker.TableCellTrigger asChild>
                                                            <Button variant="ghost" type="button">{year.label}</Button>
                                                        </DatePicker.TableCellTrigger>
                                                    </DatePicker.TableCell>
                                                ))}
                                            </DatePicker.TableRow>
                                        ))}
                                    </DatePicker.TableBody>
                                </DatePicker.Table>
                            </>
                            )}
                        </DatePicker.Context>
                    </DatePicker.View>
                </DatePicker.Content>
            </DatePicker.Positioner>
    </DatePicker.RootProvider>
}