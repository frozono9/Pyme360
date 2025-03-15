
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const registerSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  
  // Información General
  nombre_empresa: z.string().min(1, "Nombre de la empresa es requerido"),
  nit: z.string().min(1, "NIT es requerido"),
  direccion: z.string().min(1, "Dirección es requerida"),
  telefono: z.string().min(7, "Teléfono debe tener al menos 7 dígitos"),
  correo: z.string().email("Correo electrónico inválido"),
  sitio_web: z.string().optional(),
  fecha_fundacion: z.string().min(1, "Fecha de fundación es requerida"),
  pais: z.string().min(1, "País es requerido"),
  sector: z.string().min(1, "Sector es requerido"),
  tamano_empresa: z.string().min(1, "Tamaño de empresa es requerido"),
  numero_empleados: z.coerce.number().min(1, "Debe tener al menos 1 empleado"),
  representante_legal: z.string().min(1, "Representante legal es requerido"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      nombre_empresa: "",
      nit: "",
      direccion: "",
      telefono: "",
      correo: "",
      sitio_web: "",
      fecha_fundacion: new Date().toISOString().split('T')[0],
      pais: "",
      sector: "",
      tamano_empresa: "Micro",
      numero_empleados: 1,
      representante_legal: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Extraer los campos para crear la estructura correcta
      const userData = {
        username: data.username,
        password: data.password,
        informacion_general: {
          nombre_empresa: data.nombre_empresa,
          nit: data.nit,
          direccion: data.direccion,
          telefono: data.telefono,
          correo: data.correo,
          sitio_web: data.sitio_web || "",
          fecha_fundacion: data.fecha_fundacion,
          pais: data.pais,
          sector: data.sector,
          tamano_empresa: data.tamano_empresa,
          numero_empleados: data.numero_empleados,
          representante_legal: data.representante_legal,
        },
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

  const nextStep = () => {
    // Validar solo los campos del paso actual
    if (currentStep === 1) {
      const { username, password, confirmPassword } = form.getValues();
      
      // Crear un esquema parcial para validar solo los campos del paso 1
      const firstStepSchema = z.object({
        username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
      
      const result = firstStepSchema.safeParse({ username, password, confirmPassword });
      
      if (!result.success) {
        // Mostrar manualmente los errores de validación
        const formattedErrors = result.error.format();
        
        if (formattedErrors.username?._errors) {
          form.setError("username", { message: formattedErrors.username._errors[0] });
        }
        
        if (formattedErrors.password?._errors) {
          form.setError("password", { message: formattedErrors.password._errors[0] });
        }
        
        if (formattedErrors.confirmPassword?._errors) {
          form.setError("confirmPassword", { message: formattedErrors.confirmPassword._errors[0] });
        }
        
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Spacer div to prevent content from being hidden under the fixed navbar */}
      <div className="h-16"></div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pyme-blue to-pyme-blue-light">
              Crear Cuenta
            </h1>
            <p className="text-pyme-gray-dark mt-2">
              Regístrate para acceder a todas las funcionalidades de PyME360
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            {/* Pasos de registro */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 1 ? 'bg-pyme-blue text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <div className={`h-1 w-8 ${currentStep >= 2 ? 'bg-pyme-blue' : 'bg-gray-200'}`}></div>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 2 ? 'bg-pyme-blue text-white' : 'bg-gray-200'}`}>
                  2
                </div>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Datos de acceso</h2>
                    
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
                    
                    <div className="pt-2">
                      <ButtonCustom 
                        type="button" 
                        className="w-full" 
                        onClick={nextStep}
                      >
                        Siguiente
                      </ButtonCustom>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Información de la empresa</h2>
                    
                    <FormField
                      control={form.control}
                      name="nombre_empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Ingrese el nombre de su empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="nit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIT</FormLabel>
                          <FormControl>
                            <Input placeholder="Ingrese el NIT de su empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="direccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input placeholder="Ingrese la dirección de su empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="Teléfono de contacto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="correo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input placeholder="correo@ejemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="sitio_web"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sitio web (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="www.ejemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fecha_fundacion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de fundación</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pais"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>País</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione un país" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Argentina">Argentina</SelectItem>
                                <SelectItem value="Bolivia">Bolivia</SelectItem>
                                <SelectItem value="Brasil">Brasil</SelectItem>
                                <SelectItem value="Chile">Chile</SelectItem>
                                <SelectItem value="Colombia">Colombia</SelectItem>
                                <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                                <SelectItem value="Cuba">Cuba</SelectItem>
                                <SelectItem value="Ecuador">Ecuador</SelectItem>
                                <SelectItem value="El Salvador">El Salvador</SelectItem>
                                <SelectItem value="Guatemala">Guatemala</SelectItem>
                                <SelectItem value="Honduras">Honduras</SelectItem>
                                <SelectItem value="México">México</SelectItem>
                                <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                                <SelectItem value="Panamá">Panamá</SelectItem>
                                <SelectItem value="Paraguay">Paraguay</SelectItem>
                                <SelectItem value="Perú">Perú</SelectItem>
                                <SelectItem value="República Dominicana">República Dominicana</SelectItem>
                                <SelectItem value="Uruguay">Uruguay</SelectItem>
                                <SelectItem value="Venezuela">Venezuela</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sector</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione un sector" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Tecnología">Tecnología</SelectItem>
                                <SelectItem value="Comercio">Comercio</SelectItem>
                                <SelectItem value="Servicios">Servicios</SelectItem>
                                <SelectItem value="Manufactura">Manufactura</SelectItem>
                                <SelectItem value="Construcción">Construcción</SelectItem>
                                <SelectItem value="Agricultura">Agricultura</SelectItem>
                                <SelectItem value="Turismo">Turismo</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tamano_empresa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tamaño de empresa</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione tamaño" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Micro">Micro (1-10 empleados)</SelectItem>
                                <SelectItem value="Pequeña">Pequeña (11-50 empleados)</SelectItem>
                                <SelectItem value="Mediana">Mediana (51-200 empleados)</SelectItem>
                                <SelectItem value="Grande">Grande (201+ empleados)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="numero_empleados"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de empleados</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="representante_legal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Representante legal</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del representante legal" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex space-x-4 pt-2">
                      <ButtonCustom 
                        type="button" 
                        className="w-1/2" 
                        variant="outline"
                        onClick={prevStep}
                      >
                        Anterior
                      </ButtonCustom>
                      
                      <ButtonCustom 
                        type="submit" 
                        className="w-1/2" 
                        isLoading={isLoading}
                        leftIcon={isLoading ? null : <UserPlus size={18} />}
                      >
                        Registrarse
                      </ButtonCustom>
                    </div>
                  </div>
                )}
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
