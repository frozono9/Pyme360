import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, CreditCard, BriefcaseBusiness, HandCoins, LandPlot } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";

const FinancingMarketplace = () => {
  const { toast } = useToast();

  const mockFinancingOptions = [
    {
      type: "Programas Gubernamentales",
      icon: <Building className="h-10 w-10 text-amber-600" />,
      color: "amber",
      featured: true,
      entities: [
        { name: "Fondo Desarrollo PYME", rate: "4-7%", amount: "Hasta $1,500,000", term: "1-8 años" },
        { name: "Impulso Emprendedor Regional", rate: "3-6%", amount: "Hasta $1,000,000", term: "1-5 años" },
        { name: "Crédito ProExport", rate: "5-8%", amount: "Hasta $2,000,000", term: "2-10 años" },
        { name: "Fondo Social Productivo", rate: "2-5%", amount: "Hasta $800,000", term: "1-6 años" },
      ]
    },
    {
      type: "Bancos Tradicionales",
      icon: <Building className="h-10 w-10 text-blue-600" />,
      color: "blue",
      featured: false,
      entities: [
        { name: "Banco Continental", rate: "12-15%", amount: "Hasta $2,000,000", term: "1-5 años" },
        { name: "Banco Mercantil", rate: "11-14%", amount: "Hasta $1,500,000", term: "1-7 años" },
        { name: "Banco Latinoamericano", rate: "13-16%", amount: "Hasta $3,000,000", term: "1-10 años" },
      ]
    },
    {
      type: "Plataformas Fintech",
      icon: <CreditCard className="h-10 w-10 text-purple-600" />,
      color: "purple",
      featured: false,
      entities: [
        { name: "FinanzDigital", rate: "14-17%", amount: "Hasta $800,000", term: "6 meses-3 años" },
        { name: "CréditoTech", rate: "15-18%", amount: "Hasta $500,000", term: "3 meses-2 años" },
        { name: "PrestamoRápido", rate: "13-16%", amount: "Hasta $1,200,000", term: "1-4 años" },
      ]
    },
    {
      type: "Inversionistas Privados",
      icon: <Users className="h-10 w-10 text-green-600" />,
      color: "green",
      featured: false,
      entities: [
        { name: "Capital Semilla", rate: "Participación", amount: "Hasta $5,000,000", term: "Variable" },
        { name: "Inversores Ángel", rate: "Participación", amount: "Hasta $1,000,000", term: "Variable" },
        { name: "Asociados Estratégicos", rate: "Participación", amount: "Hasta $3,000,000", term: "Variable" },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Marketplace de Financiamiento</h1>
            <p className="text-lg text-pyme-gray-dark max-w-3xl">
              Conectamos tu perfil empresarial con las mejores opciones de financiamiento disponibles en el mercado,
              adaptadas a tus necesidades específicas y métricas financieras reales.
            </p>
          </div>
          
          {/* Featured Government Programs Section */}
          <div className="mb-10 bg-amber-50 p-6 rounded-xl border border-amber-200">
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-amber-800">Programas Gubernamentales Destacados</h2>
            </div>
            <p className="text-amber-700 mb-6">
              Los programas gubernamentales ofrecen las tasas más bajas y condiciones favorables para PyMEs en toda Latinoamérica. 
              Nuestro sistema identifica los programas para los que calificas.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockFinancingOptions[0].entities.map((entity, entityIndex) => (
                <div key={entityIndex} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                  <div className="font-medium text-amber-800 text-lg mb-2">{entity.name}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-amber-600 font-medium">Tasa:</span>
                      <span className="font-bold text-amber-900">{entity.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600 font-medium">Monto:</span>
                      <span>{entity.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600 font-medium">Plazo:</span>
                      <span>{entity.term}</span>
                    </div>
                  </div>
                  <ButtonCustom 
                    variant="default" 
                    size="sm"
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
                  >
                    Ver detalles
                  </ButtonCustom>
                </div>
              ))}
            </div>
          </div>
          
          {/* Other Financing Options */}
          <h2 className="text-2xl font-bold mb-6">Otras Opciones de Financiamiento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {mockFinancingOptions.slice(1).map((option, index) => (
              <Card key={index} className={`border-l-4 border-${option.color}-500`}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${option.color}-100`}>
                      {option.icon}
                    </div>
                    <div>
                      <CardTitle>{option.type}</CardTitle>
                      <CardDescription>
                        {option.type === "Bancos Tradicionales" && "Préstamos y líneas de crédito tradicionales"}
                        {option.type === "Plataformas Fintech" && "Soluciones digitales de financiamiento rápido"}
                        {option.type === "Inversionistas Privados" && "Capital a cambio de participación"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {option.entities.map((entity, entityIndex) => (
                      <div key={entityIndex} className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium mb-2">{entity.name}</div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500 block">Tasa</span>
                            <span>{entity.rate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Monto</span>
                            <span>{entity.amount}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Plazo</span>
                            <span>{entity.term}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <ButtonCustom 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    Explorar opciones
                  </ButtonCustom>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BriefcaseBusiness className="mr-2 text-pyme-blue" /> Financiamiento Especial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex bg-blue-50 p-4 rounded-lg">
                <div className="mr-4">
                  <HandCoins className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Factoraje Financiero</h4>
                  <p className="text-sm text-gray-600 mb-2">Convierte tus facturas por cobrar en efectivo inmediato</p>
                  <div className="text-xs text-blue-800 font-medium">Desde 1.5% mensual</div>
                </div>
              </div>
              
              <div className="flex bg-green-50 p-4 rounded-lg">
                <div className="mr-4">
                  <LandPlot className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Leasing de Equipos</h4>
                  <p className="text-sm text-gray-600 mb-2">Adquiere equipamiento sin comprometer capital</p>
                  <div className="text-xs text-green-800 font-medium">Plazos flexibles de 12-60 meses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FinancingMarketplace;
