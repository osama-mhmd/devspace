import { getHabit } from "@/db/actions/habits/get-habits";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";
import getRecords from "@/db/actions/habits/get-records";
import { LooseValue } from "react-calendar/dist/cjs/shared/types";

export default async function Habit({
  params,
}: {
  params: Promise<{ habit_id: string }>;
}) {
  const habitId = (await params).habit_id;

  const habit = await getHabit(habitId);

  if (!habit) return "Something went wrong";

  const records = await getRecords(habitId);

  const dates = records
    ? records.map((el) => {
        return el.record_date;
      })
    : [];

  console.log(dates);
  return (
    <section className="mt-12">
      <div className="container">
        <h2>{habit.name}</h2>
        <p>{habit.quote}</p>
        <Calendar
          calendarType="islamic"
          minDetail="month"
          value={dates as LooseValue}
        />
      </div>
    </section>
  );
}
