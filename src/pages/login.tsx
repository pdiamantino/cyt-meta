import { Button, Image, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { useDashboardContext } from "../context";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { login, user } = useDashboardContext();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleLogin = (event: any) => {
    event.preventDefault();
    if (username && password) {
      login(username, password);
    }
  };
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleLogin(event);
    }
  };

  useEffect(() => {
    if (user !== undefined) {
      navigate("/chat");
    }
  }, []);
  useEffect(() => {
    if (user !== undefined) {
      navigate("/chat");
    }
  }, [user]);

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <Image width={300} src={"https://cytcomunicaciones.com/wp-content/uploads/2022/10/logo_cytfinalweb-12.webp"} alt={"CYT"} style={{ paddingBottom: 25 }} />
      <Input type="text" label="Usuario" onChange={(e) => setUsername(e.target.value)} className="max-w-xs mt-8" />
      <Input type="password" label="Contraseña" onChange={(e) => setPassword(e.target.value)} className="max-w-xs mt-8" onKeyDown={handleKeyPress} />
      <Button className="max-w-xs mt-8 text-white" color="primary" fullWidth={true} onClick={(e) => handleLogin(e)} >Iniciar sesión</Button>
    </main>
  );
}
