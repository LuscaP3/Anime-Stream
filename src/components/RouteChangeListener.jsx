import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Jikan from "../services/JikanApi";

function RouteChangeListener() {
  const location = useLocation();

  useEffect(() => {
    //Jikan.clearQueue();

  }, [location]);

  return null;
}

export default RouteChangeListener;