import { Typography } from '@mui/material';
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firestore } from "../../../utils/FireBaseConfig/fireBaseConfig";
import SellerIDCard from "./sellersIdCard";

const I2C = () => {
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
        <Typography
  variant="h4"
  component="h2"
  className="font-bold text-center mb-6"
  sx={{
    fontFamily: 'Arial Black, sans-serif',
    fontSize: '2rem', // Slightly reduced font size for smaller box
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Ensure the text takes the full height of the container
  }}
>
  I2C
</Typography>
<br/>
      {allSellers.map((seller) => (
        <SellerIDCard key={seller.uid} userId={seller.uid} />
      ))}
    </div>
  );
};

export default I2C;