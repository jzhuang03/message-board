import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@material-ui/core/TextField";

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
      setFirst("");
      setLast("");
      setUsername("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const body = {
        first: first,
        last: last,
        username: username,
        message: message,
      };
      await axios.put(`http://localhost:5001/msgs/${id}`, body);
      fetchData();
      setEditingMessageId(null);

      // Reset all fields after posting or editing
      setFirst("");
      setLast("");
      setUsername("");
      setMessage("");
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleEditClick = (id, oldUsername, oldMessage, oldFirst, oldLast) => {
    // Set state for all fields to be edited
    setFirst(oldFirst);
    setLast(oldLast);
    setUsername(oldUsername);
    setMessage(oldMessage);
    setEditingMessageId(id); // Store the current editing message's ID
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
      <h1> 𐙚 ‧₊˚ ⋅ The Message Board ᯓᡣ𐭩 </h1>
      <form onSubmit={handleSubmit}>
        <div className="main-container">
          <h2> Submit your message! ꒰ᐢ. .ᐢ꒱ </h2>
          <TextField
            id="first-name"
            label="First Name"
            variant="outlined"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            required
          />
          <br />
          <TextField
            id="last-name"
            label="Last Name"
            variant="outlined"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            required
          />
          <br />
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <TextField
            id="message"
            label="Message"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <br />
          {/* Submit button will only appear when not editing */}
          {editingMessageId === null && <button type="submit">Submit</button>}
        </div>
      </form>
      <div className="message-container">
        <h2>Recent Messages ᡣ𐭩 </h2>
        <div className="message-list">
          {allData.map((user, index) => (
            <Card key={index} variant="outlined">
              <CardContent className="individual-message">
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
                      handleEditClick(
                        user.id,
                        user.username,
                        user.message,
                        user.first,
                        user.last
                      )
                    }
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    className="edit-button"
                    onClick={() => handleEdit(user.id)}
                  >
                    Save
                  </Button>
                )}
                <Button
                  className="delete-button"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
