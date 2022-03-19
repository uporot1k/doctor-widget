<template>
  <vue-meeting-selector
    v-model="meeting"
    :meetings-days="meetingsDays"
    :date="date"
    :calendarOptions="options"
    :loading="loading"
    data-cy="meeting-selector"
    @next-date="nextDate"
    @change="(v) => $emit('change', v)"
    @previous-date="previousDate"
  >
    <template #button-previous>
      <button
        class="tab__pagination__button"
        @click="previousDate"
        :disabled="isPrevButtonDisabled"
      >
        <i style="font-size: 25px" class="vms-icon vms-icon-left"></i>
      </button>
    </template>
    <template #button-next>
      <button
        class="tab__pagination__button"
        @click="nextDate"
        :disabled="isNextButtonDisabled"
      >
        <i style="font-size: 25px" class="vms-icon vms-icon-right"></i>
      </button>
    </template>
  </vue-meeting-selector>
</template>

<script>
import VueMeetingSelector from "vue-meeting-selector";
import {
  addMonths,
  addWeeks,
  differenceInHours,
  differenceInWeeks,
  format,
  subWeeks,
} from "date-fns";

export default {
  components: {
    VueMeetingSelector,
  },
  props: {
    doctor: Object,
  },
  data() {
    return {
      date: new Date(),
      page: 0,
      loading: false,
      meeting: null,
      availabilities: [],
      options: {
        limit: 7,
        daysLabel: [
          "Sonntag",
          "Montag",
          "Dienstag",
          "Mittwoch",
          "Donnerstag",
          "Freitag",
          "Samstag",
        ],
        monthsLabel: [
          "Jan",
          "Feb",
          "März",
          "Apr",
          "Mai",
          "Juni",
          "Juli",
          "Aug",
          "Sept",
          "Okt",
          "Nov",
          "Dez",
        ],
      },
    };
  },
  computed: {
    meetingsDays() {
      const limit = this.isMobile ? 3 : 7;
      const availabilities = JSON.parse(JSON.stringify(this.availabilities));
      return availabilities.splice(this.page * limit, limit);
    },
    isPrevButtonDisabled() {
      return differenceInHours(new Date(), this.date) >= 0;
    },
    isNextButtonDisabled() {
      return differenceInWeeks(this.date, addMonths(new Date(), 1)) >= 0;
    },
  },
  async created() {
    this.loading = true;
    await this.getAvailabilities();
    this.loading = false;
  },
  methods: {
    nextDate() {
      this.date = addWeeks(this.date, 1);
      this.page++;
    },
    previousDate() {
      this.date = subWeeks(this.date, 1);
      this.page--;
    },
    async getAvailabilities() {
      const { data: response } = await fetch(
        "https://api.aya.de/doctors/6/availabilities"
      ).then((res) => res.json());

      Object.entries(response).forEach(([date, timeArr]) => {
        const slots = [];

        timeArr.forEach((time) => {
          if (format(new Date(), "yyyy-MM-dd") === date) {
            if (time >= format(new Date(), "HH:mm")) {
              slots.push({ date: date + "T" + time });
            }
          } else {
            slots.push({ date: date + "T" + time });
          }
        });

        this.availabilities.push({ date: date + "T00:00:00", slots: slots });
      });
    },
  },
};
</script>
