import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [allData, setAllData] = useState([]);

  const [editingMessage, setEditingMessage] = useState(null);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:5001/posts");
    console.log("response", response.data);
    setAllData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      username: username,
      message: message,
    };
    const response = await axios.post("http://localhost:5001/msgs", body);
    console.log(response);
    fetchData();
  };

  // const handleEdit = (msg) => {
  //   setUsername(msg.username);
  //   setMessage(msg.message);
  //   setEditingMessage(msg);
  // };

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:500/messages/${id}`);
  //     fetchMessages();
  //   } catch (error) {
  //     console.error("Error deleting message:", error);
  //   }
  // };

  return (
    <>
      <h1>Welcome!</h1>
      <form onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <br></br>
        <label>Message: </label>
        <input type="text" onChange={(e) => setMessage(e.target.value)}></input>
        <br></br>
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Users:</h2>
        {allData.map((user, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "2rem", alignItems: "center" }}
          >
            <h3>
              {user.username} {user.message}
            </h3>
            <p>Likes: {user.likes}</p>
            <button onClick={() => likeUser(user.id, user.likes)}>Like</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
