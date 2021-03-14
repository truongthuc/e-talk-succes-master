let calendar;

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
};

const getDifferentMinBetweenTime = (startDate, endDate) => {
    const oneMinutes = 1000 * 60 * 60;
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const diffTime = endTime - startTime;
    return Math.round(diffTime / oneMinutes);
};

const pad = (n) => (n >= 10 ? n : "0" + n);

$(document).ready(function () {
    //Add hourse Prototype
    const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
    ];
    const monthNamesShort = [
        "Thg 1",
        "Thg 2",
        "Thg 3",
        "Thg 4",
        "Thg 5",
        "Thg 6",
        "Thg 7",
        "Thg 8",
        "Thg 9",
        "Thg 10",
        "Thg 11",
        "Thg 12",
    ];

    const hotTime = [5, 6, 7, 8, 9, 13, 14, 15, 16];

    const date = new Date();
    const d = date.getDate();
    const m = date.getMonth()+1;
    const y = date.getFullYear();

    const randomId = () => {
        let dt = new Date().getTime();
        const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            (c) => {
                const r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
        );
        return uuid;
    };

    const pad = (n) => (n >= 10 ? n : "0" + n);

    //const createEventSlots

    const calendarEl = document.getElementById("js-book-calendar");
    let $toggleCheckbox;

    const hotTimeSlot = [
        {
            dateIndex: 0,
            hotTime: [5, 6, 7, 8, 13, 14, 15],
        },
        {
            dateIndex: 1,
            hotTime: [5, 6, 7, 8, 13, 14, 15],
        },
        {
            dateIndex: 2,
            hotTime: [5, 6, 7, 8, 13, 14, 15],
        },
    ];

    const eventDidMount = (args) => {
        console.log("eventDidMount", args);
        const { event } = args;
        let toggleStudent = document.getElementById('student-toggle-checkbox');
        $(args.el).tooltip({
            html: true,
            title: `
                  <p class="mg-b-5">${moment(event.start).format(
                      "dddd, MM / YYYY"
                  )}</p>
            <p class="mg-b-5">Start: ${moment(event.start).format(
                "hh:mm A"
            )}</p>
            <p class="mg-b-5">End: ${moment(event.end).format("hh:mm A")}</p>
            `,
            animation: false,
            template: `<div class="tooltip tooltip-primary" role="tooltip">
                <div class="tooltip-arrow">
                </div>
                <div class="tooltip-inner">
                
                </div>
              </div>`,
            trigger: "hover",
        });
        !!$toggleCheckbox &&  showStudentToggle();
       
    };

    const toggleStudentView = () => {
        
    }

    const eventClick = (args) =>{
        const element = args.el;
        if (
            [...element.classList].includes("fc-event-past") ||
            ![...element.classList].includes("empty-slot")
        )
            return;
        const { start, end } = args.event;
        const modalConfirm = document.getElementById("md-active-slot");
        const dateEl = modalConfirm.querySelector("#js-date-time");
        const startEl = modalConfirm.querySelector("#js-start-time");
        const endEl = modalConfirm.querySelector("#js-end-time");

        dateEl.textContent = moment(start).format("DD/MM/YYYY");
        startEl.textContent = moment(start).format("HH:mm A");
        endEl.textContent = moment(end).format("HH:mm A");
        $("#md-active-slot").modal("show");
    };
    

    calendar = new FullCalendar.Calendar(calendarEl, {
        height: 500,
        expandRows: true,
        slotMinTime: "01:00",
        slotMaxTime: "23:00",
        headerToolbar:{
            start: '', // will normally be on the left. if RTL, will be on the right
            center: '',
            end: 'today,prev,title,next' // will normally be on the right. if RTL, will be on the left
          },
        titleFormat: { year: "numeric", month: "short" },
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        stickyHeaderDates:true,
        selectable: true,
        nowIndicator: true,
        allDaySlot: false,
        allDayDefault: false,
        dayMaxEvents: true, // allow "more" link when too many events
        eventOverlap: false,
        initialDate: new Date(),
        initialView: "timeGridWeek",
        firstDay: 1,
        slotDuration: "00:30",
        slotLabelInterval: "00:30",
        slotEventOverlap: false,
        selectOverlap: function (event) {
            return event.rendering === "background";
        },
        slotLabelContent: function (arg) {
            //  console.log('slotLabelContent', arg);
            const hour = arg.date.getHours();

            let templateEl = document.createElement("div");
            templateEl.setAttribute("class", "slot-label");
            const html = `
         ${
             hotTime.includes(hour)
                 ? `<i class="fa fa-fire tx-danger hot-icon"></i>`
                 : ""
         }
         ${arg.text.toUpperCase()}
        `;
            templateEl.innerHTML = html;
            return { html };
        },

        dayHeaderContent: function (args) {
            const days = args.date.getDay();
            const d = args.date.getDate();
            const html = `<span class="hd-date">${d} </span><span class="hd-day">${dayNamesShort[days]}</span>`;
            return { html };
        },  
        eventClassNames: function (args) {
            const { event, isPast, isStart } = args;
            const {
                bookInfo,
                eventType,
                bookStatus,
                available,
                isEmptySlot,
            } = event.extendedProps;
            let classLists = bookStatus ? "booked-slot" : "available-slot";
            classLists += eventType === 1 ? " hot-slot " : "";
            classLists += isEmptySlot ? " empty-slot" : "";
            return classLists;
        },
        eventContent: function (args) {
            let templateEl = document.createElement("div");
            const { event, isPast, isStart } = args;
            console.log(args);
            const {
                bookInfo,
                eventType,
                bookStatus,
                available,
                isEmptySlot,
            } = event.extendedProps;
            const html = `
              ${
                  !isEmptySlot
                      ? `
              <div class="inner-book-wrap ">
                <div class="inner-content">
                  ${
                      bookStatus
                          ? `
                          <span class="label-book booked"><i class="fas ${
                              isPast ? "fa-check" : "fa-user-graduate"
                          }"></i> ${isPast ? "FINISHED" : "BOOKED"}</span> 
                          <p class="booking-name">${bookInfo.name}</p>
                          <a href="javascript:;" class="fix-btn cancel-schedule" data-schedule="${
                              event.id
                          }">Cancel</a>`
                          : ` <i class="fas fa-copyright"></i><span class="label-book">AVAILABLE</span>`
                  }
                  ${
                      available
                          ? `<a href="javascript:;" class="fix-btn close-schedule" data-schedule="${event.id}">Close</a>`
                          : ""
                  }
                  </div>
              </div>`
                      : ""
              }
        `;
            templateEl.innerHTML = html;
            return { domNodes: [templateEl] };
        },

        eventClick: eventClick,
        //  select: function (info) {

        //  },
        eventDidMount: eventDidMount,

        // eventDidMount: function(arg) { console.log('eventDidMount', arg) },
        // nowIndicatorDidMount: function(arg) { console.log('nowIndicatorDidMount', arg) },
        // nowIndicatorContent: function(arg) { console.log('nowIndicatorContent', arg); return 'hi' },
        // viewClassNames: 'sup',
        // dayCellClassNames: function(arg) { console.log('dayCellClassNames', arg) },

        // datesDidUpdate: function() { console.log('datesDidUpdate') },
        // viewDidMount: function (args){

        //   console.log('viewdidmount', args);
        // },
        nowIndicatorDidMount: function (args) {
            console.log("nowIndicatorDidMount", args);
        },
        events: [
            {
                id: randomId(),
                title: "Event Booked",
                start: new Date(moment(`${pad(d+2)}/${m}/2020 10:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d+2)}/${m}/2020 11:00`, "DD/MM/YYYY hh:mm")),
                eventType: 0, // 0 : Bình thường || 1 : Hot
                bookStatus: true,
                bookInfo: {
                    name: "Trương Văn Lam",
                },
                available: false,
                isEmptySlot: false,
            },
            {
                id: randomId(),
                title: "Event Booked",
                start: new Date(moment(`${pad(d+2)}/${m}/2020 15:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d+2)}/${m}/2020 16:00`, "DD/MM/YYYY hh:mm")),
                eventType: 0, // 0 : Bình thường || 1 : Hot
                bookStatus: true,
                bookInfo: {
                    name: "Hoàng Thúy Uyên",
                },
                available: false,
                isEmptySlot: false,
            },
            {
                id: randomId(),
                title: "Event Booked",
                start: new Date(moment(`${pad(d-1)}/${m}/2020 12:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d-1)}/${m}/2020 13:00`, "DD/MM/YYYY hh:mm")),
                eventType: 0, // 0 : Bình thường || 1 : Hot
                bookStatus: true,
                bookInfo: {
                    name: "Huynh van Banh",
                },
                available: false,
                isEmptySlot: false,
            },
            {
                id: randomId(),
                title: "Event Booked",
                start: new Date(moment(`${pad(d)}/${m}/2020 08:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d)}/${m}/2020 09:00`, "DD/MM/YYYY hh:mm")),
                eventType: 0, // 0 : Bình thường || 1 : Hot
                bookStatus: true,
                bookInfo: {
                    name: "Huynh van Banh",
                },
                available: false,
                isEmptySlot: false,
            },
            {
                id: randomId(),
                title: "Event Available",
                start: new Date(moment(`${pad(d-2)}/${m}/2020 14:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d-2)}/${m}/2020 15:00`, "DD/MM/YYYY hh:mm")),
                eventType: 0, // 0 : Bình thường || 1 : Hot
                bookStatus: false,
                bookInfo: null,
                available: true,
                isEmptySlot: false,
            },
            {
                id: randomId(),
                title: "Event Available",
                start: new Date(moment(`${pad(d)}/${m}/2020 14:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d)}/${m}/2020 15:00`, "DD/MM/YYYY hh:mm")),
                eventType: 0, // 0 : Bình thường || 1 : Hot
                bookStatus: false,
                bookInfo: null,
                available: true,
                isEmptySlot: false,
            },
            {
                id: randomId(),
                title: "Event Hot available",
                start: new Date(moment(`${pad(d+1)}/${m}/2020 12:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d+1)}/${m}/2020 13:00`, "DD/MM/YYYY hh:mm")),
                eventType: 1, // 0 : Bình thường || 1 : Hot
                bookStatus: false,
                bookInfo: null,
                available: true,
                isEmptySlot: false,
            },
            {
                id: randomId(),
                title: "Empty slot",
                start: new Date(moment(`${pad(d+1)}/${m}/2020 07:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d+1)}/${m}/2020 08:00`, "DD/MM/YYYY hh:mm")),
                eventType: 1, // 0 : Bình thường || 1 : Hot
                bookStatus: false,
                bookInfo: null,
                available: false,
                isEmptySlot: true,
            },
            {
                id: randomId(),
                title: "Empty slot",
                start: new Date(moment(`${pad(d+1)}/${m}/2020 08:00`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d+1)}/${m}/2020 08:30`, "DD/MM/YYYY hh:mm")),
                eventType: 1, // 0 : Bình thường || 1 : Hot
                bookStatus: false,
                bookInfo: null,
                available: false,
                isEmptySlot: true,
            },
            {
                id: randomId(),
                title: "Empty slot",
                start: new Date(moment(`${pad(d+1)}/${m}/2020 09:30`, "DD/MM/YYYY hh:mm")),
                end: new Date(moment(`${pad(d+1)}/${m}/2020 10:00`, "DD/MM/YYYY hh:mm")),
                eventType: 1, // 0 : Bình thường || 1 : Hot
                bookStatus: false,
                bookInfo: null,
                available: false,
                isEmptySlot: true,
            },
            {
                id: randomId(),
                title: "Empty slot",
                start: new Date(moment("15/06/2020 08:30", "DD/MM/YYYY hh:mm")),
                end: new Date(moment("15/06/2020 09:00", "DD/MM/YYYY hh:mm")),
                eventType: 1, // 0 : Bình thường || 1 : Hot
                bookStatus: false,
                bookInfo: null,
                available: false,
                isEmptySlot: true,
            },
        ],
    });

    calendar.render();

    $(".fc-toolbar-chunk:first-child").append(
        `<div class="custom-control custom-checkbox" id="student-toggle">
        <input type="checkbox" class="custom-control-input" id="student-toggle-checkbox">
        <label class="custom-control-label" for="student-toggle-checkbox">Only show student booking hours</label>
    </div>`
    );

    $('body').on('click','.cancel-schedule', function(e){
        e.preventDefault();
        const scheduleId = this.getAttribute('data-schedule');
        alert("Cancel schedule ID : " + scheduleId);
    });
    $('body').on('click','.close-schedule', function(e){
        e.preventDefault();
        const scheduleId = this.getAttribute('data-schedule');
        alert("Close slot available ID : " + scheduleId);
    });

    $toggleCheckbox = $('#student-toggle-checkbox');

    $('body').on('change',$toggleCheckbox, showStudentToggle);
    
    function showStudentToggle(){
        const value = $toggleCheckbox.prop('checked');
        const nonBookedEvents = $('.fc-event:not(.booked-slot)');
        value ? nonBookedEvents.hide() : nonBookedEvents.show();
    }
});

