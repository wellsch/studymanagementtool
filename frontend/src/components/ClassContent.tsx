import { useCallback, useEffect, useState } from "react";
import "./classContent.css";

interface ClassContentProps {
  className: string;
  classId: string;
}

export const ClassContent: React.FC<ClassContentProps> = ({
  className,
  classId,
}) => {
  const [noteEntry, setNoteEntry] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [studyPlan, setStudyPlan] = useState<
    { title: string; agenda: string; time: number }[]
  >([]);
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const URI = encodeURI(
      `${import.meta.env.VITE_API_URI}/class?class_id=${classId}`
    );
    fetch(URI)
      .then((resp) => resp.json())
      .then((data) => {
        setNotes(data.notes.map((note: { content: string }) => note.content));
        setStudyPlan(data.study_plan);
      });
  }, [classId]);

  const sendAddNotesQuery = useCallback(
    (notesContent: string) => {
      const URI = encodeURI(`${import.meta.env.VITE_API_URI}/notes`);
      fetch(URI, {
        method: "POST",
        body: JSON.stringify({
          class_id: classId,
          notes: notesContent,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (!data.error) setNotes((prev) => [...prev, notesContent]);
        });
    },
    [classId]
  );

  const deleteNote = useCallback(
    (index: number) => {
      const URI = encodeURI(`${import.meta.env.VITE_API_URI}/notes`);
      fetch(URI, {
        method: "DELETE",
        body: JSON.stringify({
          class_id: classId,
          index: index,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (!data.error)
            setNotes((prev) => [
              ...prev.slice(0, index),
              ...prev.slice(index + 1),
            ]);
        });
    },
    [classId]
  );

  const generateStudyPlan = useCallback(() => {
    setLoading(true);
    const URI = encodeURI(
      `${import.meta.env.VITE_API_URI}/study?class_id=${classId}`
    );
    fetch(URI, {
      method: "POST",
    })
      .then(() => {
        const getURI = encodeURI(
          `${import.meta.env.VITE_API_URI}/class?class_id=${classId}`
        );
        fetch(getURI)
          .then((resp) => resp.json())
          .then((data) => {
            setNotes(
              data.notes.map((note: { content: string }) => note.content)
            );
            setStudyPlan(data.study_plan);
          });
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  }, [classId]);

  return (
    <section className="content">
      <section className="tabs">
        <button
          className={activeTab === "notes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
        <button
          className={activeTab === "studyPlan" ? "tab active" : "tab"}
          onClick={() => setActiveTab("studyPlan")}
        >
          Study Plan
        </button>
      </section>
      {activeTab === "notes" ? (
        <section className="notes">
          <h1 className="title">{className} Notes</h1>
          <textarea
            className="notes"
            placeholder="Notes"
            value={noteEntry}
            onChange={(input) => {
              setNoteEntry(input.target.value);
            }}
          />
          <button
            className="addNote"
            onClick={() => {
              sendAddNotesQuery(noteEntry);
              setNoteEntry("");
            }}
            disabled={noteEntry === ""}
          >
            Add
          </button>
          {notes.map((note, i) => (
            <section key={i} className="noteSection">
              <p>{note}</p>
              <button onClick={() => deleteNote(i)} className="delete">
                X
              </button>
            </section>
          ))}
        </section>
      ) : (
        <section className="plans">
          <div className="generate-container">
            <button className="generate" onClick={() => generateStudyPlan()}>
              (Re)Generate Study Plan
            </button>
            {loading && <div className="spinner"></div>} {/* Spinner */}
          </div>
          {studyPlan.map((plan, i) => (
            <section className="plan" key={i}>
              <h1 className="planTitle">{`${plan.title} - for ${plan.time} minutes.`}</h1>
              <p className="agenda">{plan.agenda}</p>
            </section>
          ))}
        </section>
      )}
    </section>
  );
};
