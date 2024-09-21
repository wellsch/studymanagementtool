import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import "./notes.css";

const NotesHome = () => {
  const { id } = useContext(UserContext);
  const [classes, setClasses] = useState<{ name: string; class_id: string }[]>(
    []
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClassNotes, setSelectedClassNotes] = useState<string[]>([]);
  const [className, setClassName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const URI = encodeURI(
      `${import.meta.env.VITE_API_URI}/classes?user_id=${id}`
    );
    fetch(URI)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
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

  const selectClassQuery = useCallback((classId: string) => {
    const URI = encodeURI(
      `${import.meta.env.VITE_API_URI}/class?class_id=${classId}`
    );
    fetch(URI)
      .then((resp) => resp.json())
      .then((data) => setSelectedClassNotes(data.notes));
  }, []);

  const sendAddNotesQuery = useCallback(
    (notesContent: string) => {
      const URI = encodeURI(`${import.meta.env.VITE_API_URI}/class`);
      fetch(URI, {
        method: "POST",
        body: JSON.stringify({
          class_id: selectedClassId,
          notes: notesContent,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (!data.error)
            setSelectedClassNotes((prev) => [...prev, notesContent]);
        });
    },
    [selectedClassId]
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
                  selectClassQuery(classItem.class_id);
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
        <section className="notes">
          <h1 className="title">{selectedClass}</h1>
          <textarea
            className="notes input"
            placeholder="Notes"
            value={notes}
            onChange={(input) => {
              setNotes(input.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && className !== "") {
                sendAddNotesQuery(notes);
                setNotes("");
              }
            }}
          />
          <button
            className="add"
            onClick={() => {
              sendAddNotesQuery(notes);
              setNotes("");
            }}
            disabled={notes === ""}
          >
            Add
          </button>
          {selectedClassNotes.map((note, i) => (
            <p key={i}>{note}</p>
          ))}
        </section>
      ) : null}
    </>
  );
};

export default NotesHome;
