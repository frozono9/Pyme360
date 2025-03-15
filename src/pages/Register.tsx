
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
import { UserPlus } from "lucide-react";
import api from "@/api";

const registerSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Crear un objeto con los datos básicos necesarios para el registro
      const userData = {
        username: data.username,
        password: data.password,
        informacion_general: {
          nombre_empresa: "Empresa Nueva",
          nit: "000000000",
          direccion: "Dirección por definir",
          telefono: "0000000000",
          correo: data.username,
          sitio_web: "",
          fecha_fundacion: new Date().toISOString().split('T')[0],
          sector: "No especificado",
          tamano_empresa: "Micro",
          numero_empleados: 1,
          representante_legal: "No especificado",
          contrasena: data.password
        },
        // Inicializar estructuras de datos vacías para los demás campos requeridos
        historial_crediticio: {
          cuentas_credito: [],
          credito_proveedores: [],
          solicitudes_credito_recientes: [],
          incidentes_crediticios: []
        },
        ventas_mensuales: {
          datos_mensuales: [],
          ventas_por_categoria: [],
          metricas_ventas: {
            ticket_promedio: 0,
            tasa_conversion: 0,
            ciclo_venta_promedio_dias: 0,
            costo_adquisicion_cliente: 0
          }
        },
        margen_beneficio: {
          datos_mensuales: []
        },
        gastos: {
          datos_mensuales: [],
          desglose_gastos: []
        },
        flujo_caja: {
          datos_mensuales: []
        },
        distribucion_ingresos: {
          por_producto: [],
          por_cliente: []
        },
        gestion_ventas: {
          objetivos: [],
          rendimiento_vendedores: []
        },
        rendimiento_ventas: {
          por_canal: [],
          por_region: []
        },
        ingresos_vs_gastos: {
          comparativo_anual: []
        },
        indicadores_financieros: {
          roi: [],
          ciclo_conversion_efectivo: {
            datos_anuales: []
          },
          ratios_financieros: []
        },
        analisis_gastos: {
          tendencias_mensuales: {
            "2022": {
              promedio_mensual: 0,
              maximo: {
                mes: "",
                valor: 0
              },
              minimo: {
                mes: "",
                valor: 0
              },
              variacion_porcentual_anual: 0
            },
            "2023": {
              promedio_mensual: 0,
              maximo: {
                mes: "",
                valor: 0
              },
              minimo: {
                mes: "",
                valor: 0
              },
              variacion_porcentual_anual: 0
            }
          },
          estacionalidad: {
            temporada_alta: [],
            temporada_media: [],
            temporada_baja: []
          }
        },
        pyme360_trust_score: {
          calificacion_global: 50,
          componentes: {
            sostenibilidad: {
              puntuacion: 50,
              metricas: [],
              iniciativas: []
            },
            cumplimiento_fiscal: {
              puntuacion: 50,
              metricas: [],
              historial: []
            },
            practicas_laborales: {
              puntuacion: 50,
              metricas: [],
              iniciativas: []
            },
            estabilidad_financiera: {
              puntuacion: 50,
              metricas: [],
              tendencias: []
            },
            puntualidad_pagos: {
              puntuacion: 50,
              metricas: [],
              historial: []
            },
            innovacion: {
              puntuacion: 50,
              metricas: [],
              iniciativas: []
            }
          },
          historico: [],
          beneficios_obtenidos: []
        }
      };

      await api.registerUser(userData);
      
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
      });
      
      navigate("/acceso");
    } catch (error) {
      console.error("Error en el registro:", error);
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error.message || "No se pudo completar el registro. Inténtalo de nuevo.",
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
              Crear Cuenta
            </h1>
            <p className="text-pyme-gray-dark mt-2">
              Regístrate para acceder a todas las funcionalidades de PyME360
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
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirme su contraseña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <ButtonCustom 
                  type="submit" 
                  className="w-full" 
                  isLoading={isLoading}
                  leftIcon={isLoading ? null : <UserPlus size={18} />}
                >
                  Registrarse
                </ButtonCustom>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-pyme-gray-dark">
                ¿Ya tienes una cuenta?{" "}
                <a href="/acceso" className="text-pyme-blue hover:underline">
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
