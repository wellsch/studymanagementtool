import { FormEvent, useRef } from "react";

const NotesHome = () => {
  const classRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (classRef.current !== null) console.log(classRef.current.value);
    if (notesRef.current !== null) console.log(notesRef.current.value);
  };

  return (
    <>
      <div>Notes Home</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="class" className="form-label">
            Class
          </label>
          <input ref={classRef} id="class" type="text" />
        </div>
        <div className="mb-3">
          <label htmlFor="class" className="form-label">
            Notes
          </label>
          <input ref={notesRef} id="class" type="text" />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default NotesHome;
