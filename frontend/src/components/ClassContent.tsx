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
  const [studyPlan, setStudyPlan] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("notes");

  useEffect(() => {
    const URI = encodeURI(
      `${import.meta.env.VITE_API_URI}/class?class_id=${classId}`
    );
    fetch(URI)
      .then((resp) => resp.json())
      .then((data) => {
        setNotes(data.notes.map((note: { content: string }) => note.content));
        console.log(data);
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

  const generateStudyPlan = useCallback(() => {}, []);

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
            className="notes"
            onClick={() => {
              sendAddNotesQuery(noteEntry);
              setNoteEntry("");
            }}
            disabled={noteEntry === ""}
          >
            Add
          </button>
          {notes.map((note, i) => (
            <p key={i}>{note}</p>
          ))}
        </section>
      ) : (
        <section className="plans">
          <button onClick={() => generateStudyPlan()}>
            (Re)Generate Study Plan
          </button>
        </section>
      )}
    </section>
  );
};
