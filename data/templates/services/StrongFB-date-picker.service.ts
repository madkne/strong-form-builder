// import { TranslationWidth } from '@angular/common';
// import { NbDateService } from '@nebular/theme';
// import { StrongFBLocaleService } from './StrongFB-locale.service';
// // const moment = _rollupMoment || _moment;
// export class StrongFBDatePickerService /*extends NbDateService/* {
// //FIXME:
//     TIME_ONLY_FORMAT_KEY: string;
//     constructor(protected _locale: StrongFBLocaleService) {
//         super();
//         this.TIME_ONLY_FORMAT_KEY = 'LT';
//         this.setLocale('fa');
//     }
//     setLocale(locale) {
//         super.setLocale(locale);
//         this.setMomentLocaleData(locale);
//     }
//     setHours(date, hour) {
//         return this.clone(date).set({ hour });
//     }
//     setMinutes(date, minute) {
//         return this.clone(date).set({ minute });
//     }
//     setSeconds(date, second) {
//         return this.clone(date).set({ second });
//     }
//     setMilliseconds(date, milliseconds) {
//         return this.clone(date).set({ milliseconds });
//     }
//     addDay(date, days) {
//         return this.clone(date).add({ days });
//     }
//     addMonth(date, months) {
//         return this.clone(date).add(months, 'jMonth');
//     }
//     addYear(date, years) {
//         return this.clone(date).add({ years });
//     }
//     addMinutes(date, minute) {
//         return this.clone(date).add({ minute });
//     }
//     addHours(date, hour) {
//         return this.clone(date).add({ hour });
//     }
//     clone(date) {
//         if (!date) {
//             return null;
//         }
//         let dateMoment;
//         // if (!date.clone) {
//         //     dateMoment = moment(date);
//         //     if (this.getYear(dateMoment) < 1000) {
//         //         dateMoment = moment(date, this.localeData.defaultFormat).locale('fa');
//         //     }
//         // }
//         // else {
//         //     dateMoment = date.clone();
//         // }//FIXME:
//         // if (dateMoment && this.locale || true) {
//         //     dateMoment.locale(this.locale || 'fa');
//         // }
//         dateMoment === null || dateMoment === void 0 ? void 0 : dateMoment.locale('fa', { useGregorianParser: true });
//         return dateMoment;
//     }
//     valueOf(date) {
//         return date.valueOf();
//     }
//     compareDates(date1, date2) {
//         return (this.getYear(date1) - this.getYear(date2) ||
//             this.getMonth(date1) - this.getMonth(date2) ||
//             this.getDate(date1) - this.getDate(date2));
//     }
//     createDate(year, month, date) {
//         // return moment([year, month + 1, date], this.localeData.defaultFormat);
//         //FIXME:
//     }
//     format(date, format) {
//         if (date) {
//             // return this.clone(date).format(format || this.localeData.defaultFormat);
//             //FIXME:
//         }
//         return '';
//     }
//     getLocaleTimeFormat() {
//         // return moment.localeData().longDateFormat(this.TIME_ONLY_FORMAT_KEY);
//         //FIXME:
//     }
//     getDate(date) {
//         return this.clone(date).date();
//     }
//     getDayOfWeek(date) {
//         return this.clone(date).day();
//     }
//     getDayOfWeekNames(style = TranslationWidth.Narrow) {
//         // return this.localeData.days[style];
//         //FIXME:
//     }
//     getFirstDayOfWeek() {
//         // return this.localeData.firstDayOfWeek;
//         //FIXME:
//     }
//     getMonth(date) {
//         return this.clone(date).month();
//     }
//     getHours(date) {
//         return this.clone(date).hour();
//     }
//     getMinutes(date) {
//         return this.clone(date).minute();
//     }
//     getSeconds(date) {
//         return this.clone(date).second();
//     }
//     getMilliseconds(date) {
//         return this.clone(date).milliseconds();
//     }
//     getMonthEnd(date) {
//         return this.clone(date).endOf('month');
//     }
//     getMonthName(date, style = TranslationWidth.Abbreviated) {
//         const month = this.getMonth(date);
//         return this.getMonthNameByIndex(month, style);
//     }
//     getMonthNameByIndex(month, style = TranslationWidth.Abbreviated) {
//         // return this.localeData.months[style][month];
//         //FIXME:
//     }
//     getMonthStart(date) {
//         return this.clone(date).startOf('month');
//     }
//     getNumberOfDaysInMonth(date) {
//         return this.clone(date).daysInMonth();
//     }
//     getYear(date) {
//         return this.clone(date).year();
//     }
//     getYearEnd(date) {
//         return this.clone(date).endOf('year');
//     }
//     getYearStart(date) {
//         return this.clone(date).startOf('year');
//     }
//     isSameDay(date1, date2) {
//         return this.isSameMonth(date1, date2) && this.getDate(date1) === this.getDate(date2);
//     }
//     isSameMonth(date1, date2) {
//         return this.isSameYear(date1, date2) && this.getMonth(date1) === this.getMonth(date2);
//     }
//     isSameYear(date1, date2) {
//         return this.getYear(date1) === this.getYear(date2);
//     }
//     isValidDateString(date, format) {
//         // return moment(date, format).isValid();
//         //FIXME:
//     }
//     isValidTimeString(date, format) {
//         // return moment(date, format, true).isValid();
//         //FIXME:
//     }
//     //todo work with format
//     parse(date, format) {
//         if (!date) return;
//         // var date = '1400/11/22';
//         // const year = date.slice(0, 4) || moment().locale('fa').year();
//         // // console.log('year', year);
//         // const month = date.slice(5, 7) || moment().locale('fa').month();
//         // // console.log('month', month);
//         // const day = date.slice(8, 10) || moment().locale('fa').date();
//         // console.log('day', day);
//         // const normalizeDate = `${year}/${month}/${day}`;
//         // return moment.from(normalizeDate, 'fa');
//         // // return moment(date, format);
//         //FIXME:
//     }
//     today() {
//         // return moment().locale('fa');
//         //FIXME:
//     }
//     getId() {
//         return 'jalali-moment';
//     }
//     setMomentLocaleData(locale) {
//         // const momentLocaleData = moment.localeData(locale);
//         // this.localeData = {
//         //     firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
//         //     defaultFormat: momentLocaleData.longDateFormat('L'),
//         //     months: {
//         //         [TranslationWidth.Abbreviated]: momentLocaleData.jMonthsShort(),
//         //         [TranslationWidth.Wide]: momentLocaleData.jMonths(),
//         //     },
//         //     days: {
//         //         [TranslationWidth.Wide]: momentLocaleData.weekdays(),
//         //         [TranslationWidth.Short]: momentLocaleData.weekdaysShort(),
//         //         [TranslationWidth.Narrow]: momentLocaleData.weekdaysMin(),
//         //     },
//         // };
//         //FIXME:
//     }
//     getWeekNumber(date) {
//         return date.locale('fa').week();
//     }
//     getDateFormat() {
//         return 'YYYY-MM-DD';
//     }
//     getTwelveHoursFormat() {
//         return 'hh:mm A';
//     }
// }
