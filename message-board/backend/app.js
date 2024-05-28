const express = require("express");
const app = express();
const port = 5001;
app.use(express.json());

const db = require("./firebase");
const {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
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

// like a post
app.put("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const currentLikes = req.body.currentLikes;
    await updateDoc(doc(db, "messages", id), {
      likes: currentLikes + 1,
    });
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// add a new messaging post
app.post("/msgs", async (req, res) => {
  try {
    const username = req.body.username;
    const message = req.body.message;
    const docRef = await addDoc(collection(db, "messages"), {
      username: username,
      message: message,
      likes: 0,
    });
    res
      .status(200)
      .json({ message: `Successfully created user with id ${docRef.id}` });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
