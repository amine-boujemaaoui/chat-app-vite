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

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Réinitialiser les messages d'erreur

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        // Enregistrement réussi
        setSuccessMessage(
          "Inscription réussie ! Redirection vers la page de connexion..."
        );
        setTimeout(() => {
          navigate("/login"); // Redirection vers la page de connexion après 2 secondes
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Une erreur est survenue lors de l'inscription."
        );
      }
    } catch (err) {
      setError("Erreur lors de la requête d'inscription");
      console.error(err);
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Card className='w-[350px] mx-auto mt-10'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Inscription</CardTitle>
          <CardDescription>
            Créez un compte pour accéder à l'application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='username'>Nom d'utilisateur</Label>
                <Input
                  id='username'
                  type='text'
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Votre email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='password'>Mot de passe</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Votre mot de passe'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
          {error && <p className='text-red-500'>{error}</p>}
          {successMessage && <p className='text-green-500'>{successMessage}</p>}
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            type='submit'
            onClick={handleRegister}
            className='bg-black rounded-md px-4 text-zinc-50'>
            S'inscrire
          </Button>
          <Button variant='outline' onClick={redirectToLogin}>
            Se connecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
