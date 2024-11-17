import React from "react";
import {DatePicker} from "@ParkComponents/ui/date-picker";
import {parseDate} from "@ark-ui/react";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {IconButton} from "@ParkComponents/ui/icon-button.tsx";
import {ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon} from "hugeicons-react";
import { Button } from "@ParkComponents/ui";
import {parseISO} from "date-fns";

interface IProps {
    value: Date|undefined|null;
    onChange: (value: Date|null) => void;
}

export const SingleDateInput: React.FC<IProps> = ({value, onChange}) => {
    return <DatePicker.Root
        startOfWeek={1}
        selectionMode={"single"}
        positioning={{sameWidth: true}}
        onValueChange={(value) => onChange(parseISO(value.valueAsString[0]))}
        value={value ? [parseDate(value)] : []}
        locale={'cs'}
    >
        <DatePicker.Control>
            <DatePicker.Input index={0} asChild>
                <Input />
            </DatePicker.Input>
            <DatePicker.Trigger asChild>
                <IconButton variant="outline" aria-label="Vybrat datum">
                    <Calendar03Icon/>
                </IconButton>
            </DatePicker.Trigger>
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
    </DatePicker.Root>
}