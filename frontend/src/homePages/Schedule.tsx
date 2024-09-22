import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import "./schedule.css";

const Schedule: React.FC = () => {
  const { id } = useContext(UserContext);
  const [classes, setClasses] = useState<{ name: string; class_id: string }[]>(
    []
  );
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const URI = encodeURI(
      `${import.meta.env.VITE_API_URI}/classes?user_id=${id}`
    );
    fetch(URI)
      .then((resp) => resp.json())
      .then((data) => {
        return Promise.all(
          data.map(async (classElem: { class_id: string }) => {
            const newURI = encodeURI(
              `${import.meta.env.VITE_API_URI}/class?class_id=${
                classElem.class_id
              }`
            );
            const resp = await fetch(newURI);
            return await resp.json();
          })
        );
      })
      .then((data) =>
        setClasses(
          data
            .filter((classElem) => classElem.study_plan.length > 0)
            .map((classElem) => ({
              name: classElem.name,
              class_id: classElem._id,
            }))
        )
      );
  }, [id]);

  const requestSchedule = useCallback(() => {
    if (selectedClasses.size === 0 || startTime === "" || endTime === "") {
      alert("Must select a class, start time, and end time!");
      return;
    }
    const classPairs = Array.from(selectedClasses.values()).map((classElem) => {
      const prioObj = document.getElementById(`prio_${classElem}`);
      if (prioObj instanceof HTMLInputElement) {
        return { class_id: classElem, priority: Number(prioObj.value) };
      }
    });
    const URI = `${import.meta.env.VITE_API_URI}/calendar`;

    fetch(URI, {
      method: "POST",
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
        start_time: Number(startTime.split(":")[0]),
        end_time: Number(endTime.split(":")[0]),
        start_date: startDate,
        classes: classPairs,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data));
  }, [endTime, selectedClasses, startDate, startTime]);

  return (
    <section className="formSection">
      <h1 className="instructions">
        Select your desired classes and Due-Dates
      </h1>
      {classes.length > 0 ? (
        <>
          {classes.map((classItem) => (
            <section key={classItem.class_id}>
              <section className="formRow">
                <label className="classLabel" htmlFor={classItem.name}>
                  {classItem.name}:
                </label>
                <input
                  className="classCheckbox"
                  type="checkbox"
                  id={classItem.name}
                  onChange={(e) =>
                    setSelectedClasses((prev) => {
                      if (e.target.checked) prev.add(classItem.class_id);
                      else prev.delete(classItem.class_id);
                      return prev;
                    })
                  }
                />
              </section>

              <section className="formRow">
                <label
                  className="prioLabel"
                  htmlFor={`priority_${classItem.class_id}`}
                >
                  Priority:
                </label>
                <input
                  className="prioRange"
                  type="range"
                  id={`prio_${classItem.class_id}`}
                  min={0}
                  defaultValue={2}
                  max={5}
                />
              </section>
            </section>
          ))}

          <label htmlFor="date" className="dateLabel">
            Start Date:
          </label>
          <input
            type="date"
            id="date"
            className="dateInput"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <section className="timeInfo">
            <label htmlFor="start" className="timeLabel">
              Daily Start Time:
            </label>
            <input
              type="time"
              id="start"
              className="timeInput"
              onChange={(e) => setStartTime(e.target.value)}
            />
            <label htmlFor="end" className="timeLabel">
              Daily End Time:
            </label>
            <input
              type="time"
              id="end"
              className="timeInput"
              onChange={(e) => setEndTime(e.target.value)}
            />
          </section>
          <input
            type="submit"
            className="submit"
            value="Generate Study Sessions!"
            onClick={() => {
              requestSchedule();
            }}
          />
        </>
      ) : (
        <h2 className="noClasses">
          You have no classes with study plans at the moment!
        </h2>
      )}
    </section>
  );
};

export default Schedule;
