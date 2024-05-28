const express = require("express");
const app = express();
const port = 5001;
app.use(express.json());

require("dotenv").config();

const db = require("./firebase");
const {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} = require("firebase/firestore");

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// get all messaging posts
app.get("/posts", async (req, res) => {
  try {
    let ret = [];
    const querySnapshot = await getDocs(collection(db, "messages"));
    querySnapshot.forEach((doc) => {
      ret.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json(ret);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// add a new messaging post
app.post("/msgs", async (req, res) => {
  try {
    const first = req.body.first;
    const last = req.body.last;
    const username = req.body.username;
    const message = req.body.message;
    const docRef = await addDoc(collection(db, "messages"), {
      first: first,
      last: last,
      username: username,
      message: message,
    });
    res.status(200).json({
      message: `Successfully created a user message with id ${docRef.id}`,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// delete an existing messaging post
app.delete("/msgs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, "messages", id));
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// edit an existing messaging post
app.put("/msgs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, message, first, last } = req.body;
    await updateDoc(doc(db, "messages", id), {
      ...(first && { first }),
      ...(last && { last }),
      ...(username && { username }),
      ...(message && { message }),
    });
    res.status(200).json({ message: "Message updated successfully" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
