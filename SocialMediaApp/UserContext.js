import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [username, setUsername] = useState("Ad Soyad Ekleyin");
  const [nameSurname, setNameSurname] = useState("Kullanıcı Adı Ekleyin");
  const [myPrivacy, setMyPrivacy] = useState(false);
  const [biography, setBiography] = useState("Biyografi Ekleyin");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [myFavorites, setMyFavorites] = useState([]);

  const handleReset = () => {
    setProfilePictureUrl("");
    setUsername("Kullanıcı Adı Ekleyin");
    setNameSurname("Ad Soyad Ekleyin");
    setMyPrivacy(false);
    setBiography("Biyografi Ekleyin");
    setFollowers([]);
    setFollowings([]);
    setMyFavorites([]);
  }

  return (
    <UserContext.Provider value={{
      profilePictureUrl,
      setProfilePictureUrl,
      username,
      setUsername,
      nameSurname,
      setNameSurname,
      myPrivacy,
      setMyPrivacy,
      biography,
      setBiography,
      followers,
      setFollowers,
      followings,
      setFollowings,
      myFavorites,
      setMyFavorites,
      handleReset
      }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
