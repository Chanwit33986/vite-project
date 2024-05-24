import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useNavigate } from "react-router";

const AppUrlListener = () => {
  let navigate = useNavigate();
  useEffect(() => {
    App.addListener("appUrlOpen", (event) => {
      console.log("event", event);
      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2
      const slug = event.url.split(".app").pop();
      if (slug) {
        navigate(slug);
      }
      // If no match, do nothing - let regular routing
      // logic take over
    });
  }, []);

  return null;
};

export default AppUrlListener;
