"use client";
import { useState } from "react";
import SignInUI from "./SignInUI";
import UjianUi from "./UjianUi";

const App = () => {
  const [user, setUser] = useState(true);
  const changeUser = (newValue: boolean) => {
    setUser(newValue);
  };
  return (
    <main>
      {user ? (
        <UjianUi user={user} changeUser={changeUser} />
      ) : (
        <SignInUI user={user} changeUser={changeUser} />
      )}
    </main>
  );
};

export default App;
