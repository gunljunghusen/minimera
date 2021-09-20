import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../context/AuthContext";
import { PrimarySection, AdForm } from "../../style/StyledComponents";

const AddNewAd = () => {
  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const currentUserId = currentUser ? currentUser.uid : null;
  const ownerEmail = currentUser ? currentUser.email : "unknown";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTitle("");
    setDesc("");
  };
  //TUTORIAL WAY: BETTER PERFORMANCE + INSTANT UPDATE
  const ref = db.collection("allAds");

  const getAds = () => {
    setLoading(true);

    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setAds(items);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAds();
  }, []);

  const addAd = () => {
    const newAd = {
      title,
      desc,
      id: uuidv4(),
      userId: currentUserId,
      ownerEmail,
    };

    ref
      .doc(newAd.id)
      // .doc(); use this is for some reason you want firebase to create the id
      .set(newAd)
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <PrimarySection>
      <h1>Add New Ad</h1>
      <AdForm onSubmit={handleSubmit}>
        <h3>Add new</h3>
        <input
          required
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          required
          value={desc}
          placeholder="Description"
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={() => addAd()}>Submit</button>
      </AdForm>

      {loading ? <h1>Loading...</h1> : null}

      {ads.map((ad) => (
        <div className="ad" key={ad.id}>
          <h2>{ad.title}</h2>
          <p>{ad.desc}</p>
          <p>userId: {ad.userId}</p>
          <p>owner email: {ad.ownerEmail}</p>
        </div>
      ))}
    </PrimarySection>
  );
};

export default AddNewAd;

//MY REWRITE OF TUTORIAL WAY
// const getAds = () => {
//   setLoading(true);
//   db.collection("group1").onSnapshot((querySnapshot) => {
//     //querySnapshot = the result of a query
//     const items = [];
//     querySnapshot.forEach((doc) => {
//       //for each document in the querySnapshot, we want to apply the data()-method to it
//       items.push(doc.data());
//       //then put that result into our items array
//     });
//     setAds(items);
//     setLoading(false);
//   });
// };

// useEffect(() => {
//   getAds();
// }, []);

//TUTORIAL WAY 2 WITH GET(), LESS PERFORMANT
// const ref = db.collection("group1");
// function getAds2() {
//   setLoading(true);
//   ref.get()
//   .then((item) => {
//     const items = items.docs.map((doc) => doc.data());
//     setAds(items);
//     setLoading(false);
//   });
// }
// useEffect(() => {
//   // getAds();
//   getAds2();
// }, []);
