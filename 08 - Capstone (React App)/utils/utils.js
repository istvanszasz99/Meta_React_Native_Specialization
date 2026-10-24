import { useRef, useEffect, createContext} from "react";

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}

export const validateEmail = email => {
  return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

export const validateName = name => {
  return name.match(/^[a-zA-Z]+$/);
};

export const validateNumber = (number) => {
  if (isNaN(number)) {
    return false;
  } else if (number.length == 10) {
    return true;
  }
};

export const AuthContext = createContext();

export const API_URL = "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

export const sections = ["starters", "mains", "desserts", "drinks"];