import { Box, Button } from "@chakra-ui/react";
import { FormEvent, useRef } from "react";

var classes = ["COMP 140", "PSYC 101", "MATH 212"];

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
      <Box display="flex" justifyContent="space-evenly">
        <Box
          bg="green"
          width="400px"
          h="800px"
          display="flex"
          flexDirection="column"
          justifyContent="space-end"
          alignContent="flex-end"
        >
          <Box
            bg="orange"
            width="400px"
            h="100px"
            display="flex"
            justifyContent="center"
            alignContent="flex-end"
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="class" className="form-label">
                  New Class
                </label>
                <input ref={classRef} id="class" type="text" />
              </div>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          </Box>
          <Box
            bg="lightblue"
            width="400px"
            h="500px"
            display="flex"
            justifyContent="center"
            alignItems="space-around"
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <select>
                  <option value="">Select...</option>
                  {classes.map((item, index) => (
                    <option
                      key={index}
                      value={item.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="class" className="form-label">
                  Notes
                </label>
                <input
                  ref={notesRef}
                  id="class"
                  type="text"
                  style={{
                    width: "250px",
                    height: "300px",
                    textAlign: "center",
                    fontSize: "24px",
                  }}
                />
              </div>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </form>
          </Box>
        </Box>
        <Box>
          <Box
            bg="green"
            width="400px"
            h="800px"
            display="flex"
            flexDirection="column"
            justifyContent="space-end"
            alignContent="flex-end"
          ></Box>
        </Box>
      </Box>
    </>
  );
};

export default NotesHome;
