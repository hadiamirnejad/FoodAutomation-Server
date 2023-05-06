const { connectDB } = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User, Calendar} = require("../../../models/Schemas");
const mongoose = require("mongoose");
const moment = require('moment-jalaali')

connectDB();

const calendar = {
  path: ["/api/calendar/:type(1|2|3|4|5|6)/:local/:accasionType/:param1/:param2","/api/calendar/:type(1|3)/:local/:accasionType"],
  method: "get",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const {type, local, accasionType, param1, param2} = req.params;
    //type: 0: current month, 1: given month, 2: current week, 3: given week, 4: given date, 5: year details
    //local: 0: Jalali, 1: Gregorian, 2: Hijri
    if(!type || !local || !accasionType) return res.json({ error: "invalid parameters" })

    console.log(param1)
    let fromDate;
    let toDate;
    let daysCount = 0;
    let dates=[];

    try{
      switch (type) {
        case '1':
          switch (local) {
            case '1':
              fromDate = moment().startOf('jMonth').hour(0).minute(0).second(0)
              toDate = moment().endOf('jMonth').hour(0).minute(0).second(0)
              daysCount = toDate.diff(fromDate,'days') + 1
              break;
            case '2':
              fromDate = moment().startOf('month').hour(0).minute(0).second(0)
              toDate = moment().endOf('month').hour(0).minute(0).second(0)
              daysCount = toDate.diff(fromDate,'days') + 1
              break;
            case '3':
              
              break;
            default:
              break;
          }
          break;
        case '2':
          //param1: year, param2: month
          switch (local) {
            case '1':
              fromDate = moment(`${param1}-${param2}`,'jYYYY-jM').startOf('jMonth').hour(0).minute(0).second(0)
              toDate = moment(`${param1}-${param2}`,'jYYYY-jM').endOf('jMonth').hour(0).minute(0).second(0)
              daysCount = toDate.diff(fromDate,'days') + 1
              break;
            case '2':
              fromDate = moment(`${param1}-${param2}`,'YYYY-M').startOf('month')
              toDate = moment(`${param1}-${param2}`,'YYYY-M').endOf('month')
              daysCount = toDate.diff(fromDate,'days') + 1
              break;
            case '3':
              
              break;
            default:
              break;
          }
          break;
        case '3':
          //param1: year, param2: week
          switch (local) {
            case '1':
              const weekDay = moment().weekday();
              fromDate = moment().subtract(weekDay===6?0:weekDay+1, 'days').hour(0).minute(0).second(0)
              toDate = moment().subtract(weekDay===6?0:weekDay+1, 'days').add(6,'days').hour(0).minute(0).second(0)
              daysCount = toDate.diff(fromDate,'days') + 1
              break;
            case '2':
              fromDate = moment().startOf('isoWeek').hours(0).minutes(0).seconds(0)
              toDate = moment().endOf('isoWeek').hour(0).minute(0).second(0)
              daysCount = toDate.diff(fromDate,'days') + 1
              break;
            case '3':
              
              break;
            default:
              break;
          }
          break;
        case '4':
          switch (local) {
            case '1':
              const weekDay = moment(param1,'jYYYY').jWeek(param2).weekday();
              fromDate = moment(param1,'jYYYY').jWeek(param2).subtract(weekDay===6?0:weekDay+1, 'days').hour(0).minute(0).second(0);
              toDate = moment(param1,'jYYYY').jWeek(param2).subtract(weekDay===6?-6:weekDay-5, 'days').hour(0).minute(0).second(0);
              daysCount = toDate.diff(fromDate,'days') + 1;
              break;
            case '2':
              fromDate = moment(parseInt(param1)+1,'YYYY').isoWeek(param2).startOf('isoWeek').hour(0).minute(0).second(0);
              toDate = moment(parseInt(param1)+1,'YYYY').isoWeek(param2).endOf('isoWeek').hour(0).minute(0).second(0);
              console.log(fromDate, toDate)
              daysCount = toDate.diff(fromDate,'days') + 1;
              break;
            case '3':
              
              break;
            default:
              break;
          }
          break;
        case '5':
          switch (local) {
            case '1':
              fromDate = moment(param1,'jYYYYjMMjDD').hour(0).minute(0).second(0);
              toDate = moment(param2,'jYYYYjMMjDD').hour(0).minute(0).second(0);
              if(toDate < fromDate) return res.json({error: 'invalid period'})
              daysCount = toDate.diff(fromDate,'days') + 1
              if(daysCount > 500) return res.json({error: 'larg period'})
              break;
            case '2':
              fromDate = moment(param1,'YYYYMMDD').hour(0).minute(0).second(0);
              toDate = moment(param2,'YYYYMMDD').hour(0).minute(0).second(0);
              if(toDate < fromDate) return res.json({error: 'invalid period'})
              daysCount = toDate.diff(fromDate,'days') + 1
              if(daysCount > 500) return res.json({error: 'larg period'})
              break;
            case '3':
              
              break;
            default:
              break;
          }
          break;
        case '6':
          
          break;
      
        default:
          break;
      }

      const jalaliWeekDays = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه']
      const jalaliMonths = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']

      const sadgan = ['یکصد','دویست','سیصد','چهارصد','پانصد','ششصد','هفتصد','هشتصد','نهصد']
      const dahgan = ['بیست','سی','چهل','پنجاه','شصت','هفتاد','هشتاد','نود']
      const yekan = ['یک','دو','سه','چهار','پنج','شش','هفت','هشت','نه','ده','یازده','دوازده','سیزده','چهارده','پانزده','شانزده','هفده','هجده','نوزده']
      const zarib = ['',' هزار',' میلیون',' میلیارد',' بیلیون',' بیلیارد']

      const numberToHorufPe = (number)=>{
        const number3ToHoruf = (num)=>{
          let horuf = [];
          const p2=num.substring(num.length-2)
          if(num.length===3)
          {
            horuf.push(sadgan[num.substring(0,1)-1])
          };
  
          if(parseInt(p2)<20){
            horuf.push(yekan[parseInt(p2)-1])
          }
          else{
            horuf.push(dahgan[parseInt(p2[0])-2]);
            if(parseInt(p2[1])>0) horuf.push(yekan[parseInt(p2[1])-1])
          }
          return horuf.join(' و ')
        }

        const fff = [];
        const three = number.toString().split('')
        while (three.length > 0) {
          fff.push(three.splice(-3))
        }
        return fff.reverse().map((f, idx)=>number3ToHoruf(f.join('')) + zarib[fff.length - 1 - idx]).join(' و ')
      }

      const dateToString = (date)=>{
        const [year, month, day] = date.split('-');
        return `${![3,23].includes(parseInt(day))?numberToHorufPe(parseInt(day)):parseInt(day)===3?'سو':'بیست و سو'}م ${jalaliMonths[parseInt(month)-1]} ${numberToHorufPe(year)}`
      }

      const occasions = await Calendar.find();

      switch (local) {
        case '1':
          dates = [...Array(daysCount)].map((_,idx)=>{const date = moment(fromDate.format('YYYY-MM-DD').toString()).add(idx,'days');return {id: date.format('YYYY-MM-DD'), yearText: dateToString(date.format('jYYYY-jMM-jDD')), monthName: jalaliMonths[parseInt(date.format('jMM'))-1], weekDay:jalaliWeekDays[date.day()],dayInYear: parseInt(date.format('jDDD')),year: parseInt(date.format('jYYYY')),month: parseInt(date.format('jMM')),day: parseInt(date.format('jDD')), today: date.format('jYYYY-jMM-jDD')===moment().format('jYYYY-jMM-jDD'), holiday: [5].includes(date.day()) || occasions.filter(o=>moment(o.date).format('YYYY-MM-DD').toString()===date.format('YYYY-MM-DD').toString() && o.holiday===true).length>0}})
          switch (accasionType) {
            case '1':
              dates = dates.map(d=>{return {...d, occasions: occasions.filter(o=>moment(o.date).format('YYYY-MM-DD').toString()===d.id && o.category.includes(1))}})
              break;
            case '2':
              dates = dates.map(d=>{return {...d, occasions: occasions.filter(o=>moment(o.date).format('YYYY-MM-DD').toString()===d.id && o.category.includes(2))}})
              break;
            case '3':
              dates = dates.map(d=>{return {...d, occasions: occasions.filter(o=>moment(o.date).format('YYYY-MM-DD').toString()===d.id && o.category.includes(3))}})
              break;
            default:
              break;
          }
          break;
        case '2':
          dates = [...Array(daysCount)].map((_,idx)=>{const date = moment(fromDate.format('YYYY-MM-DD').toString()).add(idx,'days');return {id: date.format('YYYY-MM-DD'), monthName: date.format('MMMM'), monthNameShort: date.format('MMM'), weekDay:date.format('dddd'),dayInYear: parseInt(date.format('DDD')),year: parseInt(date.format('YYYY')),month: parseInt(date.format('MM')),day: parseInt(date.format('DD')), today: date.format('YYYY-MM-DD')===moment().format('YYYY-MM-DD'), holiday: [6,0].includes(date.day())}})
          switch (accasionType) {
            case '1':
              dates = dates.map(d=>{return {...d, occasions: occasions.filter(o=>moment(o.date).format('YYYY-MM-DD').toString()===d.id && o.category.includes(1))}})
              break;
            case '2':
              dates = dates.map(d=>{return {...d, occasions: occasions.filter(o=>moment(o.date).format('YYYY-MM-DD').toString()===d.id && o.category.includes(2))}})
              break;
            case '3':
              dates = dates.map(d=>{return {...d, occasions: occasions.filter(o=>moment(o.date).format('YYYY-MM-DD').toString()===d.id && o.category.includes(3))}})
              break;
            default:
              break;
          }
          break;
        case '3':
          
          break;
        default:
          break;
      }

      return res.status(200).json({daysCount, dates});
    } catch(error) {
      console.log(error)
      res.json({ error: error });
    }
  },
};

module.exports = { calendar };
