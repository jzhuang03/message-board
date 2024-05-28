import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function App() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [allData, setAllData] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null); // State to store the ID of the message being edited

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/posts");
      setAllData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        first: first,
        last: last,
        username: username,
        message: message,
      };
      await axios.post("http://localhost:5001/msgs", body);
      fetchData();
      setUsername("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const body = {
        username: username,
        message: message,
      };
      await axios.put(`http://localhost:5001/msgs/${id}`, body);
      fetchData();
      setEditingMessageId(null);
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleEditClick = (id, oldUsername, oldMessage) => {
    setUsername(oldUsername);
    setMessage(oldMessage);
    setEditingMessageId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/msgs/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div>
      <h1>The Message Board</h1>
      <form onSubmit={handleSubmit}>
        <div className="main-container">
          <label>First Name: </label>
          <input type="text" onChange={(e) => setFirst(e.target.value)}></input>
          <br></br>
          <label>Last Name: </label>
          <input type="text" onChange={(e) => setLast(e.target.value)}></input>
          <br></br>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <label>Message: </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <br />
          <button type="submit">Submit</button>
        </div>
      </form>
      <div>
        <h2>Recent Messages:</h2>
        {allData.map((user, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                {user.first} {user.last}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                @{user.username}
              </Typography>
              <Typography variant="body2">{user.message}</Typography>
            </CardContent>
            <CardActions>
              {editingMessageId !== user.id ? (
                <Button
                  onClick={() =>
                    handleEditClick(user.id, user.username, user.message)
                  }
                >
                  Edit
                </Button>
              ) : (
                <Button onClick={() => handleEdit(user.id)}>Save</Button>
              )}
              <Button onClick={() => handleDelete(user.id)}>Delete</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
