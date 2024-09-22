import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import "./classes.css";
import { ClassContent } from "../components/ClassContent";

export const Classes: React.FC = () => {
  const { id } = useContext(UserContext);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState<{ name: string; class_id: string }[]>(
    []
  );

  useEffect(() => {
    const URI = encodeURI(
      `${import.meta.env.VITE_API_URI}/classes?user_id=${id}`
    );
    fetch(URI)
      .then((resp) => resp.json())
      .then((data) => {
        setClasses(data);
      });
  }, [id]);

  const sendAddClassQuery = useCallback(
    (className: string) => {
      const URI = encodeURI(`${import.meta.env.VITE_API_URI}/class`);
      fetch(URI, {
        method: "POST",
        body: JSON.stringify({
          user_id: id,
          name: className,
          priority: classes.length,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((resp) => resp.json())
        .then((data) =>
          setClasses((prev) => [
            ...prev,
            { class_id: data.class_id, name: className },
          ])
        );
    },
    [classes.length, id]
  );

  return (
    <>
      <section className="classSelector">
        <h1 className="title">Your Classes:</h1>
        <ul className="list">
          {classes.map((classItem, i) => (
            <li className="selector" key={i}>
              <button
                className={`open ${
                  selectedClass === classItem.name ? "selected" : ""
                }`}
                disabled={selectedClass === classItem.name}
                onClick={() => {
                  setSelectedClass(classItem.name);
                  setSelectedClassId(classItem.class_id);
                }}
              >
                {classItem.name}
              </button>
            </li>
          ))}
        </ul>
        <input
          className="add"
          placeholder="Add Class"
          value={className}
          onChange={(input) => {
            setClassName(input.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && className !== "") {
              sendAddClassQuery(className);
              setClassName("");
            }
          }}
        />
        <button
          className="add"
          onClick={() => {
            sendAddClassQuery(className);
            setClassName("");
          }}
          disabled={className === ""}
        >
          Add
        </button>
      </section>
      {selectedClass !== "" ? (
        <ClassContent className={selectedClass} classId={selectedClassId} />
      ) : null}
    </>
  );
};
