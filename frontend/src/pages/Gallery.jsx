import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import heart from "../assets/coeur.png";
import { useUserContext } from "../contexts/UserContext";

export default function Gallery() {
  const [drawList, setDrawList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [getFavoritesUser, setGetFavoritesUser] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  const [{ user }] = useUserContext();

  const getDrawings = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/drawings/`)
      .then((resp) => resp.json())
      .then((data) => {
        // console.log("data from server:", data);
        setDrawList(data);
      })
      .catch((error) => console.error(error));
  };

  const getFavorites = () => {
    // if (user && user.id) {
    // console.log("Calling getFavorites...");
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${
        user.id
      }/favoriteDrawings`,
      {
        headers: {
          // Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        // console.log("favorite :", data);
        setGetFavoritesUser(data);
        setFavoritesLoaded(true);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
      });
  };

  useEffect(() => {
    getDrawings();
    if (user && user.id) {
      getFavorites();
    }
  }, [user]);

  const handleClick = (drawingId) => {
    if (!user || !user.id) {
      return;
    }
    const isFavorite = favorites[drawingId];

    if (isFavorite) {
      // Copie l'objet des favoris sans l'élément à supprimer
      const updatedFavorites = { ...favorites };
      delete updatedFavorites[drawingId];
      setFavorites(updatedFavorites);

      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${
          user.id
        }/favoriteDrawings/${drawingId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((resp) => resp.json())
        .then(() => {
          // console.log("Favorite removed on the server:", data);
        })
        .catch((err) => console.error(err));

      setDrawList((prevDrawList) =>
        prevDrawList.map((item) =>
          item.id === drawingId
            ? { ...item, count_likes: item.count_likes - 1 }
            : item
        )
      );
    } else {
      const newFavorite = { drawingId, userId: user.id };
      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [drawingId]: newFavorite,
      }));

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favoriteDrawings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newFavorite),
      })
        .then((resp) => resp.json())
        .then(() => {
          // console.log("Favorite added on the server:", data);
          setDrawList((prevDrawList) =>
            prevDrawList.map((item) =>
              item.id === drawingId
                ? { ...item, count_likes: item.count_likes + 1 }
                : item
            )
          );
        })
        .catch((err) => console.error(err));
    }
  };
  if (drawList.length === 0) {
    return (
      <p className="text-slate-500 flex justify-center mt-56">
        Chargement en cours...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex justify-start pt-28 border-b-2 border-[#282e4d] mx-10 mb-5">
        <p className="text-5xl ml-2">GALERIE</p>
      </div>

      <div className="px-8 parent mb-14">
        {drawList.map((item) => (
          <div
            className=" h-[25rem] md:flex flex-col justify-between rounded-md shadow-lg shadow-[#a4aac1] bg-[#e0e5fb] p-2  "
            key={item.id}
          >
            <div className="">
              <Link to={`/gallery/${item.id}`}>
                <div className="flex justify-center items-center py-2 mx-2 portrait-item  ">
                  <img
                    src={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/public/assets/drawings/${item.image}`}
                    alt="Drawing"
                    className=" h-[19rem] object-cover border-4 border-black  "
                  />
                </div>
              </Link>
            </div>
            <div className="border-t-[#c6cad7] border-2 flex justify-between items-center ">
              <p className="truncate">{item.title}</p>
              <div className="flex flex-col my-auto items-center ">
                <button type="button" onClick={() => handleClick(item.id)}>
                  <img
                    src={heart}
                    alt="heart logo"
                    className=" w-8 h-8 opacity-60 mx-auto hover:scale-125  p-1"
                  />
                </button>
                <p>count</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
