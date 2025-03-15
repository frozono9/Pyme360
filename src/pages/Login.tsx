
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, LogIn } from "lucide-react";
import api from "@/api";

const loginSchema = z.object({
  username: z.string().min(1, "Nombre de usuario es requerido"),
  password: z.string().min(1, "Contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Llamar a la API real de login
      const response = await api.loginUser(data.username, data.password);
      
      // Obtener información del usuario después de iniciar sesión
      const userData = await api.getCurrentUser();
      
      // Guardar información básica del usuario en localStorage para la UI
      localStorage.setItem("pyme360-user", JSON.stringify({ 
        username: userData.username,
        nombre_empresa: userData.informacion_general?.nombre_empresa || "Empresa"
      }));
      
      // Notificar al usuario
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido a PyME360, ${userData.informacion_general?.nombre_empresa || data.username}`,
      });
      
      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Usuario o contraseña incorrectos",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Spacer div to prevent content from being hidden under the fixed navbar */}
      <div className="h-16"></div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pyme-blue to-pyme-blue-light">
              Iniciar Sesión
            </h1>
            <p className="text-pyme-gray-dark mt-2">
              Accede a tu cuenta PyME360 para gestionar tu negocio
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese su usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Ingrese su contraseña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <ButtonCustom 
                  type="submit" 
                  className="w-full" 
                  isLoading={isLoading}
                  leftIcon={isLoading ? null : <LogIn size={18} />}
                >
                  Iniciar Sesión
                </ButtonCustom>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-pyme-gray-dark">
                ¿No tienes una cuenta?{" "}
                <a href="/registro" className="text-pyme-blue hover:underline">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-pyme-gray-dark flex items-center justify-center">
              <Lock size={16} className="mr-1" /> 
              Acceso seguro con encriptación de extremo a extremo
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
