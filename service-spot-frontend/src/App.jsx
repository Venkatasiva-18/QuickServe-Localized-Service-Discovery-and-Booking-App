import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const callApi = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/hello");
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage("Error calling API");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>React + Spring Boot</h1>
      <button onClick={callApi}>Call API</button>

      <p>Response: {message}</p>
    </div>
  );
}

export default App;
