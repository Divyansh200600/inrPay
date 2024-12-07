import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../utils/FireBaseConfig/fireBaseConfig";
import SellerIDCard from "./sellersIdCard";

const C2I = () => {
  const [allSellers, setAllSellers] = useState([]);

  useEffect(() => {
    fetchAllSellers();
  }, []);

  const fetchAllSellers = async () => {
    try {
      const q = query(collection(firestore, "users"), where("userType", "==", "seller"));
      const sellersSnapshot = await getDocs(q);
      const sellersData = sellersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data()
      }));
      setAllSellers(sellersData);
    } catch (error) {
      console.error("Error fetching all sellers:", error);
    }
  };
  

  return (
    <div>
      <h1>C2I</h1>
      {allSellers.map((seller) => (
        <SellerIDCard key={seller.uid} userId={seller.uid} />
      ))}
    </div>
  );
};

export default C2I;