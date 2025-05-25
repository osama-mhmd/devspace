import getPomodoros from "@/db/actions/pomodoros/get";

export default async function Statistics() {
  const pomodoros = await getPomodoros();

  if (!pomodoros) return "Something went wrong!";

  const totalSeconds = pomodoros.reduce((acc, cur) => acc + cur.duration, 0);

  // const stats = {
  //   timeLabels: pomodoros.map((el) => {
  //     return el.created_at.getDate();
  //   }),
  //   tasksOverTime: pomodoros.map((el) => {
  //     return el.duration;
  //   }),
  // };

  return (
    <section className="mt-16">
      <div className="container text-center">
        <div className="flex justify-evenly mb-8">
          <div>
            <h3>Total Pomodoros</h3>
            <p>{pomodoros.length}</p>
          </div>
          <div>
            <h3>Total time spent</h3>
            <p>
              {Math.floor(totalSeconds / 3600)}h {(totalSeconds / 60) % 60}m
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
