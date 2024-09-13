import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const { token, userId } = data; // Récupérer le token et userId de la réponse

        // Stocker le token JWT et userId dans le localStorage
        localStorage.setItem("jwt", token);
        localStorage.setItem("userId", userId);

        // Redirection vers la page du chat
        navigate("/chat");
      } else {
        setError("Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur lors de la connexion");
      console.error(err);
    }
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Card className='w-[350px] mx-auto mt-10'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='email' className='text-sm font-medium'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Votre email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='mt-1 block w-full'
                  required
                />
              </div>
              <div>
                <Label htmlFor='password' className='text-sm font-medium'>
                  Mot de passe
                </Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Votre mot de passe'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='mt-1 block w-full'
                  required
                />
              </div>
            </div>
            {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
          </form>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            type='submit'
            onClick={handleLogin}
            className='bg-black rounded-md px-4 text-zinc-50'>
            Connexion
          </Button>
          <Button variant='outline' onClick={redirectToRegister}>
            S'inscrire
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
