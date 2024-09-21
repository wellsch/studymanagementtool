import React, { useCallback, useState } from "react";

const ScheduleHome: React.FC = () => {
  const [className, setClassName] = useState("");

  const requestSchedule = useCallback(async (className: string) => {
    const URI = `${
      import.meta.env.VITE_API_URI
    }/calendar?class=${className}&token=${sessionStorage.getItem("token")}`;
    console.log(URI);
    const data = await fetch(URI).then((resp) => resp.json());
    console.log(data);
  }, []);

  return (
    <section>
      <input
        id="classname"
        placeholder="classname"
        onChange={(e) => setClassName(e.target.value)}
        value={className}
      />
      <button
        onClick={() => {
          requestSchedule(className);
          setClassName("");
        }}
        disabled={className === ""}
      >
        Generate Schedule!
      </button>
    </section>
  );
};

export default ScheduleHome;
