import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "./App.css";
import Searchbar from "./searchbar";

firebase.initializeApp({
  // Your Firebase config object
  apiKey: "AIzaSyDqsmHiymsBMuzThC1TMysMFt7sZA3C7fE",
  authDomain: "stick25-6661f.firebaseapp.com",
  projectId: "stick25-6661f",
  storageBucket: "stick25-6661f.appspot.com",
  messagingSenderId: "289900010620",
  appId: "1:289900010620:web:6bb081e2f293e0b93c3df9",
  measurementId: "G-R0SR0XP3T1"
});

const db = firebase.firestore();
const storageRef = firebase.storage().ref();

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageNo, setPageNo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [pdfList, setPdfList] = useState([]);

  useEffect(() => {
    fetchPdfList();
  }, []);

  const handlePdfFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handlePageNoChange = (e) => {
    setPageNo(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePdfUpload = (e) => {
    e.preventDefault();

    if (!pdfFile || !pageNo || !date || !time || !name) {
      alert("Please fill in all the fields.");
      return;
    }

    const pdfFileName = pdfFile.name;
    const pdfFileRef = storageRef.child(pdfFileName);

    pdfFileRef.put(pdfFile).then(() => {
      pdfFileRef.getDownloadURL().then((pdfUrl) => {
        db.collection("pdfs")
          .doc(pdfFileName)
          .set({
            name,
            pageNo,
            date,
            time,

            pdfUrl
          })
          .then(() => {
            fetchPdfList();
          });
      });
    });
  };

  const fetchPdfList = () => {
    db.collection("pdfs").onSnapshot((querySnapshot) => {
      const pdfs = [];
      querySnapshot.forEach((doc) => {
        pdfs.push({ id: doc.id, ...doc.data() });
      });
      setPdfList(pdfs);
    });
  };
  // Add a new document to the "pdfs" collection
  const addPdf = async (pdfData) => {
    try {
      const docRef = await db.collection("pdfs").add(pdfData);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Call the addPdf function with the PDF data you want to add to the collection
  addPdf({
    name: "example",
    pageNo: 2,
    date: "2022-02-21",
    time: "14:30",
    pdfUrl:
      "https://seap.taylors.edu.my/file/rems/publication/109566_8816_1.pdf"
  });
  return (
    <div className="App">
      <form onSubmit={handlePdfUpload}>
        <h1>Demo</h1>
        <label>
          PDF file:
          <input type="file" onChange={handlePdfFileChange} />
        </label>
        <label>
          Total no of Pages:
          <input type="text" value={pageNo} onChange={handlePageNoChange} />
        </label>
        <label>
          Date:
          <input type="text" value={date} onChange={handleDateChange} />
        </label>
        <label>
          Time:
          <input type="text" value={time} onChange={handleTimeChange} />
        </label>
        <label>
          Title:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <button type="submit">Upload</button>
      </form>
      <Searchbar />
      <table>
        <thead>
          <tr>
            <th>Pages</th>
            <th>Date</th>

            <th>Time</th>

            <th>Title</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {pdfList.map((pdf) => (
            <tr key={pdf.id}>
              <td>{pdf.pageNo}</td>
              <td>{pdf.date}</td>
              <td>{pdf.time}</td>
              <td>{pdf.name}</td>
              <td>
                <a href={pdf.pdfUrl} target="_blank" rel="noreferrer">
                  {pdf.pdfUrl}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
